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

func (g *GameData) SetUserData(id string, x, y, z, orientation float32) {
	g.Lock()
	defer g.Unlock()

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

func (g *GameData) SetTeam(id string, team int) {
	g.Lock()
	defer g.Unlock()
	g.Users[id].Team = team
}

func (g *GameData) UpdateHealth(id string, amount int) {
	g.Lock()
	defer g.Unlock()

	g.Users[id].Health += amount
}

func (g *GameData) SetObject(id string, x, y, z float32) {
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

func (g *GameData) DeleteUserData(id string) {
	g.Lock()
	defer g.Unlock()
	delete(g.Users, id)
}

func (g *GameData) DeleteObject(id string) {
	g.Lock()
	defer g.Unlock()
	delete(g.Objects, id)
}

func (g *GameData) IncrementScoreTeam1() {
	g.Scores.Team1++
}

func (g *GameData) IncrementScoreTeam2() {
	g.Scores.Team2++
}

func (g *GameData) AssignTeam() int {
	g.Lock()
	defer g.Unlock()
	if g.PlayerStatistics.Team1 > g.PlayerStatistics.Team2 {
		g.PlayerStatistics.Team2++
		return 2
	}
	g.PlayerStatistics.Team1++
	return 1
}

func (g *GameData) RemovePlayerTeam1() {
	g.Lock()
	defer g.Unlock()
	g.PlayerStatistics.Team1--
}

func (g *GameData) RemovePlayerTeam2() {
	g.Lock()
	defer g.Unlock()
	g.PlayerStatistics.Team2--
}

func (g *GameData) GetAllData() ([]byte, error) {
	g.Lock()
	defer g.Unlock()
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

func (g *GameData) GetPlayerData() ([]byte, error) {
	g.Lock()
	defer g.Unlock()
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

func (g *GameData) SetFlagTaken(id string, team int) {
	g.Lock()
	defer g.Unlock()

	if team == 1 {
		g.Flags.Team1 = id
	} else if team == 2 {
		g.Flags.Team2 = id
	}
}

func (g *GameData) ResetFlagTaken(team int) {
	g.Lock()
	defer g.Unlock()

	if team == 1 {
		g.Flags.Team1 = ""
	} else if team == 2 {
		g.Flags.Team2 = ""
	}
}

func (u UserValue) equals (u2 UserValue) bool {
	if u.X != u2.X {return false}
	if u.Y != u2.Y {return false}
	if u.Z != u2.Z {return false}
	return true
}
