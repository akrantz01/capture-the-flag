package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	maxMessageSize = 512
)

var (
	newline = []byte{'\n'}
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
	hub  *Hub
	conn *websocket.Conn
	send chan []byte
}

func (c *Client) readPump() {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()

	var (
		id string
		team = data.AssignTeam()
	)

	c.conn.SetCloseHandler(func(code int, text string) error {
		data.DeleteUserData(id)
		if team == 1 {
			data.RemovePlayerTeam1()
		} else {
			data.RemovePlayerTeam2()
		}
		return nil
	})

	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })

	for {
		_, message, err := c.conn.ReadMessage()

		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("Unexpected Close Error: %v\n", err)
			}
			break
		}

		var msg Message
		if err := json.Unmarshal(message, &msg); err != nil {
			log.Printf("JSON Decode Error: %v", err)
		}

		switch msg.Type {
		case 1:
			id = msg.ID

			data.SetUserData(
				msg.ID,
				msg.Coordinates.X,
				msg.Coordinates.Y,
				msg.Coordinates.Z,
				msg.Orientation,
			)

			if data.Users[msg.ID].Team == 0 {
				data.SetTeam(msg.ID, team)
			}
			break

		case 2:
			data.SetObject(
				msg.ID,
				msg.Coordinates.X,
				msg.Coordinates.Y,
				msg.Coordinates.Z,
			)
			break

		case 3:
			data.DeleteObject(msg.ID)
			break

		case 4:
			if out, err := json.Marshal(msg); err != nil {
				log.Printf("JSON Encode Error: %v", err)
			} else {
				c.hub.broadcast <- out
			}
			break

		case 5:
			if data.Users[msg.ID].Team == 1 {
				data.IncrementScoreTeam1()
			} else {
				data.IncrementScoreTeam2()
			}
			break

		case 6:
			data.SetFlagTaken(msg.ID, data.Users[msg.ID].Team)
			break

		case 7:
			data.ResetFlagTaken(data.Users[msg.ID].Team)
			break

		case 8:
			data.UpdateHealth(msg.ID, msg.Health)
			break
		}
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			n := len(c.send)
			for i := 0; i < n; i++ {
				w.Write(newline)
				w.Write(<-c.send)
			}

			if err := w.Close(); err != nil {
				return
			}

		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
