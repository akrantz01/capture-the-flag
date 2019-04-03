package main

import (
	"fmt"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"log"
)

type User struct {
	gorm.Model
	Name		string
	Email		string
	Password	string
}

type Account struct {
	gorm.Model
	Username	string
	HighScore	uint
	TimePlayed	float64
	UserId		uint
	User		User
}

type Token struct {
	gorm.Model
	UserId		uint
	User		User
	Token		string
	SigningKey	string
}

type PasswordReset struct {
	gorm.Model
	Email		string
	Token		string
	SigningKey	string
}

func connectDatabase() *gorm.DB {
	log.Print("Connecting to database...")
	db, err := gorm.Open("postgres", fmt.Sprintf("host=%s port=%d user=%s dbname=%s password=%s sslmode=%s", config.Database.Host, config.Database.Port, config.Database.Username, config.Database.Database, config.Database.Password, config.Database.SSL))
	if err != nil {
		panic(fmt.Sprintf("Unable to connect to database: %v\n", err))
	}

	log.Println("Connected")

	log.Print("Creating database schema...")
	createSchema(db)
	log.Println("Created")

	return db
}

func createSchema(db *gorm.DB) {
	for _, model := range []interface{}{&User{}, &Account{}, &Token{}, &PasswordReset{}} {
		if !db.HasTable(model) {
			db.CreateTable(model)
		}
	}
}
