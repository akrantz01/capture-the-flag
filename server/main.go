package main

import (
	"fmt"
	"github.com/gorilla/handlers"
	"github.com/jinzhu/gorm"
	"github.com/spf13/viper"
	"gopkg.in/gomail.v2"
	"gopkg.in/hlandau/passlib.v1"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

var (
	data = GameData{
		Users: make(map[string]*UserValue),
		Objects: make(map[string]Object),
		Scores: Scores{
			Team1: 0,
			Team2: 0,
		},
		PlayerStatistics: PlayerStats{
			Team1: 0,
			Team2: 0,
		},
	}
	hub = newHub()
	db *gorm.DB
	mail = make(chan *gomail.Message)
)

func main() {
	// Get server config
	parseConfiguration()

	// Initialize database
	db = connectDatabase()

	// Configure hashing
	if err := passlib.UseDefaults(passlib.DefaultsLatest); err != nil {
		panic(err)
	}

	// Serve from static directory
	http.Handle("/", handlers.LoggingHandler(os.Stdout, http.FileServer(http.Dir("public"))))

	// Gracefully stop goroutines
	c := make(chan os.Signal)
	signal.Notify(c, syscall.SIGINT, syscall.SIGTERM, syscall.SIGKILL)
	go func() {
		log.Println("Listening for SIGINT, SIGTERM & SIGKILL...")
		<-c
		log.Println("Stopped goroutines")
		if err := db.Close(); err != nil {
			log.Printf("Unable to close database: %v\n", err)
		} else {
			log.Println("Closed connection to database")
		}
		os.Exit(0)
	}()

	// Send data to connected clients
	go func() {
		log.Println("Started pushing data...")
		for {
			if out, err := data.GetPlayerData(); err != nil {
				fmt.Printf("JSON Encoding Error: %v", err)
			} else {
				hub.broadcast <- out
			}
			time.Sleep(15 * time.Millisecond)
		}
	}()

	// Password reset email sender
	go func() {
		d := gomail.NewDialer(viper.GetString("email.host"), viper.GetInt("email.port"), viper.GetString("email.username"), viper.GetString("email.password"))
		d.SSL = viper.GetBool("email.ssl")

		log.Print("Connecting to mail server...")
		var s gomail.SendCloser
		var err error
		if s, err = d.Dial(); err != nil {
			panic(fmt.Sprintf("Unable to connect to mail server: %v\n", err))
		}
		log.Print("Connected")

		open := true

		for {
			select {
			case m, ok := <- mail:
				if !ok {
					return
				}
				if !open {
					if s, err = d.Dial(); err != nil {
						panic(err)
					}
					open = true
				}
				if err := gomail.Send(s, m); err != nil {
					log.Print(err)
				}
				break

				case <- time.After(30 * time.Second):
					if open {
						if err := s.Close(); err != nil {
							panic(err)
						}
						open = false
					}
			}
		}
	}()

	// WebSocket route
	http.Handle("/ws", handlers.LoggingHandler(os.Stdout, http.HandlerFunc(wsHandler)))

	// Authentication/authorization routes
	http.Handle("/api/login", handlers.LoggingHandler(os.Stdout, http.HandlerFunc(LoginHandler)))
	http.Handle("/api/logout", handlers.LoggingHandler(os.Stdout, http.HandlerFunc(LogoutHandler)))
	http.Handle("/api/signup", handlers.LoggingHandler(os.Stdout, http.HandlerFunc(SignUpHandler)))
	http.Handle("/api/verify", handlers.LoggingHandler(os.Stdout, http.HandlerFunc(VerifyHandler)))
	http.Handle("/api/update", handlers.LoggingHandler(os.Stdout, http.HandlerFunc(UpdateHandler)))
	http.Handle("/api/user", handlers.LoggingHandler(os.Stdout, http.HandlerFunc(UserHandler)))
	http.Handle("/api/forgot-password", handlers.LoggingHandler(os.Stdout, http.HandlerFunc(ForgotPasswordHandler)))
	http.Handle("/api/reset-password", handlers.LoggingHandler(os.Stdout, http.HandlerFunc(ResetPassword)))

	// Debug routes
	if viper.GetBool("server.debug") { http.Handle("/debug", handlers.LoggingHandler(os.Stdout, debugHandler{})) }

	// Start server
	log.Printf("Running on %s:%s with debug: %t", viper.GetString("server.host"), viper.GetString("server.port"), viper.GetBool("server.debug"))
	go hub.run()
	log.Fatal(http.ListenAndServe(viper.GetString("server.host") + ":" + viper.GetString("server.port"), nil))
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	client := &Client{
		hub: hub,
		conn: conn,
		send: make(chan []byte, 256),
	}
	client.hub.register <- client

	go client.readPump()
	go client.writePump()
}

type debugHandler struct {}
func (_ debugHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if j, err := data.GetAllData(); err != nil {
		log.Printf("JSON Encoding Error: %v", err)
	} else {
		w.Header().Set("Content-Type", "application/json")
		if _, err := w.Write(j); err != nil {
			log.Fatalf("Unable to send response: %s", err)
		}
	}
}
