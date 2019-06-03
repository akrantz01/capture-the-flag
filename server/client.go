package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

const (
	// Websocket configuration
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	maxMessageSize = 512

	// Command codes
	SetPlayerData	= 1
	SetObjectData	= 2
	DeleteObject	= 3
	Broadcast		= 4
	UpdateScore		= 5
	TakeFlag		= 6
	ResetFlag		= 7
	UpdateHealth	= 8
	EventFlag		= 9
)

var (
	// Upgrade connection to websocket
	upgrader = websocket.Upgrader{
		ReadBufferSize: 1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
)

// Client for hub
type Client struct {
	hub  *Hub				// Hub to use with the client
	conn *websocket.Conn	// Websocket connection established
	send chan []byte		// Messages being sent
}

// Connection reader for users
func (c *Client) readPump() {
	// Close connection and remove from hub
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()

	// Store client ID and team
	var (
		id string
		team = data.AssignTeam()
	)

	// Delete all user data from memory on connection close
	c.conn.SetCloseHandler(func(code int, text string) error {
		data.DeleteUserData(id)
		if team == 1 {
			data.RemovePlayerTeam1()
		} else {
			data.RemovePlayerTeam2()
		}
		return nil
	})

	// Configure the websocket connection
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })

	for {
		// Read message from connection
		_, message, err := c.conn.ReadMessage()

		// Check if connection error is unexpected
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("Unexpected Close Error: %v\n", err)
			}
			break
		}

		// Parse the raw message
		var msg Message
		if err := json.Unmarshal(message, &msg); err != nil {
			log.Printf("JSON Decode Error: %v", err)
		}

		// Operate on different data based on message type
		switch msg.Type {
		// Set the player's position and orientation
		case SetPlayerData:
			id = msg.ID

			data.SetUserData(
				msg.ID,
				msg.Coordinates.X,
				msg.Coordinates.Y,
				msg.Coordinates.Z,
				msg.Orientation,
				msg.Name,
			)

			// Assign team if not already assigned one
			if data.Users[msg.ID].Team == 0 {
				data.SetTeam(msg.ID, team)
			}
			break

		// Set the position of an object
		case SetObjectData:
			data.SetObject(
				msg.ID,
				msg.Coordinates.X,
				msg.Coordinates.Y,
				msg.Coordinates.Z,
			)
			break

		// Remove all of the data from an object
		case DeleteObject:
			data.DeleteObject(msg.ID)
			break

		// Immediately send this data to all other clients so long as there is no error
		case Broadcast:
			if out, err := json.Marshal(msg); err != nil {
				log.Printf("JSON Encode Error: %v", err)
			} else {
				c.hub.broadcast <- out
			}
			break

		// Increment the score of a user's team
		case UpdateScore:
			if data.Users[msg.ID].Team == 1 {
				data.IncrementScoreTeam1()
			} else {
				data.IncrementScoreTeam2()
			}
			break

		// Set that the current player has the flag
		case TakeFlag:
			data.SetFlagTaken(msg.ID, data.Users[msg.ID].Team)
			break

		// Reset the flag location
		case ResetFlag:
			data.ResetFlagTaken(data.Users[msg.ID].Team)
			break

		// Change the user's health by some amount
		case UpdateHealth:
			data.UpdateHealth(msg.ID, msg.Health)
			break

		// A special type of broadcast for flag position
		case EventFlag:
			if out, err := json.Marshal(msg); err != nil {
				log.Printf("JSON Encode Error: %v", err)
			} else {
				c.hub.broadcast <- out
			}
			break
		}
	}
}

// Connection writer for users
func (c *Client) writePump() {
	// Keep connection alive
	// Allows server to know when client dies
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()


	for {
		// Select == special switch statement for channels
		select {
		// Get message to be sent
		case message, ok := <-c.send:
			// Deadlines for messages to be written
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// Close on error
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			// Get writer for text based messages
			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			// Write the message
			w.Write(message)

			// Send data in segments
			n := len(c.send)
			for i := 0; i < n; i++ {
				w.Write([]byte{'\n'})
				w.Write(<-c.send)
			}

			// Close on error
			if err := w.Close(); err != nil {
				return
			}

		// Handle ping-pongs
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
