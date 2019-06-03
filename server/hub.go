package main

import "log"

// Handles all of the websocket connections and clients
type Hub struct {
	clients    map[*Client]bool		// All clients and whether the are connected or not
	broadcast  chan []byte			// Channel to send to all clients
	register   chan *Client			// Register a new client
	unregister chan *Client			// Unregister a client
}

// Hub "constructor"
func newHub() *Hub {
	return &Hub{
		clients:    make(map[*Client]bool),
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

// Main websocket runner
func (h *Hub) run() {
	log.Println("Starting hub")
	// Run forever
	for {
		select {
		// Register a new client
		case client := <-h.register:
			h.clients[client] = true

		// Unregister a client & close connection
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}

		// Send message to all clients
		case message := <-h.broadcast:
			// Iterate over all clients
			for client := range h.clients {
				// Send via channel
				select {
				case client.send <- message:

				// If no message, unregister
				default:
					close(client.send)
					delete(h.clients, client)
				}
			}
		}
	}
}
