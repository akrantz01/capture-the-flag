package main

import (
	"flag"
	"fmt"
	"github.com/gorilla/handlers"
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
	}
	hub = newHub()
)

func main() {
	// Get host, port and debug enabled
	host := flag.String("host", "127.0.0.1", "Host to run on")
	port := flag.String("port", "8080", "Port to run on")
	debug := flag.Bool("debug", false, "Enable debug info")

	// Serve from static directory
	http.Handle("/", handlers.LoggingHandler(os.Stdout, http.FileServer(http.Dir("public"))))

	// Gracefully stop goroutines
	c := make(chan os.Signal)
	signal.Notify(c, syscall.SIGINT, syscall.SIGTERM, syscall.SIGKILL)
	go func() {
		log.Println("Listening for SIGINT, SIGTERM & SIGKILL...")
		<-c
		log.Println("Stopped goroutines")
		os.Exit(0)
	}()

	go func() {
		log.Println("Started pushing data...")
		for {
			if out, err := data.GetAllData(); err != nil {
				fmt.Printf("JSON Encoding Error: %v", err)
			} else {
				hub.broadcast <- out
			}
			time.Sleep(15 * time.Millisecond)
		}
	}()

	// WebSocket route
	http.HandleFunc("/ws", wsHandler)

	// Debug routes
	if *debug { http.Handle("/debug", handlers.LoggingHandler(os.Stdout, debugHandler{})) }

	// Start server
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
