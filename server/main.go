package main

import (
	"flag"
	"fmt"
	"github.com/gorilla/handlers"
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
	db = connectDatabase()
)

func main() {
	// Get host, port and debug enabled
	host := flag.String("host", "127.0.0.1", "Host to run on")
	port := flag.String("port", "8080", "Port to run on")
	debug := flag.Bool("debug", false, "Enable debug info")
	flag.Parse()

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

	// WebSocket route
	http.HandleFunc("/ws", wsHandler)

	// Authentication/authorization routes
	http.HandleFunc("/api/login", LoginHandler)
	http.HandleFunc("/api/logout", LogoutHandler)
	http.HandleFunc("/api/signup", SignUpHandler)
	http.HandleFunc("/api/verify", VerifyHandler)
	http.HandleFunc("/api/update", UpdateHandler)

	// Debug routes
	if *debug { http.Handle("/debug", handlers.LoggingHandler(os.Stdout, debugHandler{})) }

	// Start server
	log.Printf("Running on %s:%s with debug: %t", *host, *port, *debug)
	go hub.run()
	log.Fatal(http.ListenAndServe(*host + ":" + *port, nil))
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
