package main

import (
	"fmt"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"log"
	"os"
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

func connectDatabase() *gorm.DB {
	if os.Getenv("DB_USERNAME") == "" || os.Getenv("DB_PASSWORD" ) == "" || os.Getenv("DB_DATABASE") == "" || os.Getenv("DB_HOST") == "" || os.Getenv("DB_PORT") == "" {
		panic("Environment variables: DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_HOST, and DB_PORT must be defined")
	}

	log.Print("Connecting to database...")
	db, err := gorm.Open("postgres", fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s", os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB_USERNAME"), os.Getenv("DB_DATABASE"), os.Getenv("DB_PASSWORD")))
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
	for _, model := range []interface{}{&User{}, &Account{}, &Token{}} {
		if !db.HasTable(model) {
			db.CreateTable(model)
		}
	}
}
