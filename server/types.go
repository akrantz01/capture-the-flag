package main

import (
	"encoding/json"
	"sync"
)

type (
	// Game data
	GameData struct {
		sync.RWMutex
		Users				map[string]*UserValue
		Objects				map[string]Object
		Scores				Scores
		PlayerStatistics	PlayerStats
		Flags				Flags
	}

	// User value
	UserValue struct {
		X		float32
		Y	 	float32
		Z		float32
		Orientation	float32
		Health	int
		Team	int
	}

	// Message container
	Message struct {
		Type		int						`yaml:"type"`
		ID			string					`yaml:"id"`
		Coordinates Coordinates				`yaml:"coordinates"`
		Orientation	float32					`yaml:"orientation"`
		Vel 		Coordinates				`yaml:"vel"`
		Health		int						`yaml:"health"`
		Flag		int						`yaml:"flag"`
		Action		int						`yaml:"action"`
		Size		float32					`yaml:"size"`
	}

	// Store player coordinates (2d)
	Coordinates struct {
		X	float32	`yaml:"x"`
		Y	float32 `yaml:"y"`
		Z	float32	`yaml:"z"`
	}

	// Store objects
	Object struct {
		Coordinates Coordinates				`yaml:"coordinates"`
	}

	// Store game data
	Scores struct {
		Team1	float32	`yaml:"team1"`
		Team2	float32	`yaml:"team2"`
	}

	// Player statistics
	PlayerStats struct {
		Team1	int
		Team2	int
	}

	// Flag positions
	Flags struct {
		Team1 string
		Team2 string
	}
)

// Set the position and orientation of a player by ID
func (g *GameData) SetUserData(id string, x, y, z, orientation float32) {
	// Acquire lock to prevent race conditions
	g.Lock()
	defer g.Unlock()

	// Set health if not in memory
	if _, ok := g.Users[id]; !ok {
		g.Users[id] = &UserValue{
			X: x,
			Y: y,
			Z: z,
			Orientation: orientation,
			Health: 100,
		}
	} else {
		g.Users[id] = &UserValue{
			X: x,
			Y: y,
			Z: z,
			Orientation: orientation,
			Health: g.Users[id].Health,
		}
	}
}

// Set the player's team by ID
func (g *GameData) SetTeam(id string, team int) {
	// Acquire lock to prevent race conditions
	g.Lock()
	defer g.Unlock()

	g.Users[id].Team = team
}

// Change the user's health by a specified amount
func (g *GameData) UpdateHealth(id string, amount int) {
	// Acquire lock to prevent race conditions
	g.Lock()
	defer g.Unlock()

	g.Users[id].Health += amount
}

// Set an object's position
func (g *GameData) SetObject(id string, x, y, z float32) {
	// Acquire lock to prevent race conditions
	g.Lock()
	defer g.Unlock()

	g.Objects[id] = Object{
		Coordinates: Coordinates{
			X: x,
			Y: y,
			Z: z,
		},
	}
}

// Delete all of a users data from memory
func (g *GameData) DeleteUserData(id string) {
	// Acquire lock to prevent race conditions
	g.Lock()
	defer g.Unlock()

	delete(g.Users, id)
}

// Delete an object's data from memory
func (g *GameData) DeleteObject(id string) {
	// Acquire lock to prevent race conditions
	g.Lock()
	defer g.Unlock()
	delete(g.Objects, id)
}

// Add a new player to team 1
func (g *GameData) IncrementScoreTeam1() {
	// Acquire lock to prevent race conditions
	g.Lock()
	defer g.Unlock()

	g.Scores.Team1++
}

// Add a new player to team 2
func (g *GameData) IncrementScoreTeam2() {
	// Acquire lock to prevent race conditions
	g.Lock()
	defer g.Unlock()

	g.Scores.Team2++
}

// Assign a user to a team
func (g *GameData) AssignTeam() int {
	// Acquire lock to prevent race conditions
	g.Lock()
	defer g.Unlock()

	// Check if one team has more players
	if g.PlayerStatistics.Team1 > g.PlayerStatistics.Team2 {
		g.PlayerStatistics.Team2++
		return 2
	}
	// Default to team 1
	g.PlayerStatistics.Team1++
	return 1
}

// Decrement the number of players on team 1
func (g *GameData) RemovePlayerTeam1() {
	// Acquire lock to prevent race conditions
	g.Lock()
	defer g.Unlock()
	g.PlayerStatistics.Team1--
}

// Decrement the number of players on team 2
func (g *GameData) RemovePlayerTeam2() {
	// Acquire lock to prevent race conditions
	g.Lock()
	defer g.Unlock()
	g.PlayerStatistics.Team2--
}

// Get all user data in JSON format
func (g *GameData) GetAllData() ([]byte, error) {
	// Acquire lock to prevent race conditions
	g.Lock()
	defer g.Unlock()

	// Marshal to JSON
	j, err := json.Marshal(struct {
		Users				map[string]*UserValue
		Objects				map[string]Object
		Scores				Scores
		PlayerStatistics	PlayerStats
	}{
		Users: g.Users,
		Objects: g.Objects,
		Scores: g.Scores,
		PlayerStatistics: g.PlayerStatistics,
	})
	if err != nil {
		return nil, err
	}
	return j, nil
}

// Get only the data the clients will need
// Excludes player statistics
func (g *GameData) GetPlayerData() ([]byte, error) {
	// Acquire lock to prevent race conditions
	g.Lock()
	defer g.Unlock()

	// Marshal into JSON
	j, err := json.Marshal(struct {
		Users		map[string]*UserValue
		Objects		map[string]Object
		Scores		Scores
	}{
		Users: g.Users,
		Objects: g.Objects,
		Scores: g.Scores,
	})
	if err != nil {
		return nil, err
	}
	return j, nil
}

// Mark a flag as taken by a team
func (g *GameData) SetFlagTaken(id string, team int) {
	// Acquire lock to prevent race conditions
	g.Lock()
	defer g.Unlock()

	// Set who has the flag based on team and ID
	if team == 1 {
		g.Flags.Team1 = id
	} else if team == 2 {
		g.Flags.Team2 = id
	}
}

// Reset which team has the flag
func (g *GameData) ResetFlagTaken(team int) {
	// Acquire lock to prevent race conditions
	g.Lock()
	defer g.Unlock()

	if team == 1 {
		g.Flags.Team1 = ""
	} else if team == 2 {
		g.Flags.Team2 = ""
	}
}

// Deep equal for users
func (u UserValue) equals (u2 UserValue) bool {
	if u.X != u2.X {return false}
	if u.Y != u2.Y {return false}
	if u.Z != u2.Z {return false}
	return true
}
