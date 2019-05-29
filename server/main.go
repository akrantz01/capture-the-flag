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
	"strings"
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
	if err := passlib.UseDefaults(passlib.DefaultsLatest); err != nil {/* Ignore error, will never occur - appeasing GoLand */}

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
			log.Fatalf("Unable to connect to mail server: %s", err)
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
						log.Fatalf("Unable to connect to mail server: %s", err)
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
							log.Fatalf("Unable to close mail server connection: %s", err)
						}
						open = false
					}
			}
		}
	}()

	// Primary websockets handler
	go hub.run()

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

	// Wait for stuff to initialize
	time.Sleep(1 * time.Second)

	// Start server
	startupMessage()
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

func startupMessage() {
	log.Printf("Successfully started server with configuration:")

	// Display server config
	log.Printf("\t=> Server:")
	log.Printf("\t\t=> Host: %s", viper.GetString("server.host"))
	log.Printf("\t\t=> Port: %s", viper.GetString("server.port"))
	log.Printf("\t\t=> Debug: %t", viper.GetBool("server.debug"))
	log.Printf("\t\t=> Domain: %s", viper.GetString("server.domain"))

	// Display email config
	log.Printf("\t=> Email:")
	log.Printf("\t\t=> Host: %s", viper.GetString("email.host"))
	log.Printf("\t\t=> Port: %s", viper.GetString("email.port"))
	log.Printf("\t\t=> SSL: %t", viper.GetBool("email.ssl"))
	log.Printf("\t\t=> Username: %s", viper.GetString("email.username"))
	log.Printf("\t\t=> Password: %s", strings.Repeat("*", len(viper.GetString("email.password"))))

	// Display database config
	log.Printf("\t=> Database:")
	log.Printf("\t\t=> Host: %s", viper.GetString("database.host"))
	log.Printf("\t\t=> Port: %s", viper.GetString("database.port"))
	log.Printf("\t\t=> SSL: %s", viper.GetString("database.ssl"))
	log.Printf("\t\t=> Database: %s", viper.GetString("database.database"))
	log.Printf("\t\t=> Username: %s", viper.GetString("database.username"))
	log.Printf("\t\t=> Password: %s", strings.Repeat("*", len(viper.GetString("database.password"))))
}
