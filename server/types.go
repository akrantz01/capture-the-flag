package main

import (
	"encoding/json"
	"sync"
)

type (
	// Game data
	GameData struct {
		sync.RWMutex
		Users		map[string]*UserValue
		Objects		map[string]Object
		Scores		Scores
	}

	// User value
	UserValue struct {
		X		float32
		Y	 	float32
		Z		float32
		Orientation	float32
		Other	map[string]interface{}
	}

	// Message container
	Message struct {
		Type		int						`yaml:"type"`
		ID			string					`yaml:"id"`
		Other		map[string]interface{}	`yaml:"other"`
		Coordinates Coordinates				`yaml:"coordinates"`
		Orientation	float32					`yaml:"orientation"`
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
		Other		map[string]interface{}	`yaml:"other"`
	}

	// Store game data
	Scores struct {
		Team1	float32	`yaml:"team1"`
		Team2	float32	`yaml:"team2"`
	}
)

func (g *GameData) SetUserData(id string, x, y, z, orientation float32, other map[string]interface{}) {
	g.Lock()
	defer g.Unlock()
	g.Users[id] = &UserValue{
		X: x,
		Y: y,
		Z: z,
		Orientation: orientation,
		Other: other,
	}
}

func (g *GameData) SetObject(id string, x, y, z float32, other map[string]interface{}) {
	g.Lock()
	defer g.Unlock()
	g.Objects[id] = Object{
		Coordinates: Coordinates{
			X: x,
			Y: y,
			Z: z,
		},
		Other: other,
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

func (g *GameData) GetAllData() ([]byte, error) {
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

func (u UserValue) equals (u2 UserValue) bool {
	if u.X != u2.X {return false}
	if u.Y != u2.Y {return false}
	if u.Z != u2.Z {return false}
	if len(u.Other) != len(u2.Other) {return false}
	return true
}
