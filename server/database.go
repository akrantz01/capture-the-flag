package main

import (
	"fmt"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/spf13/viper"
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
	db, err := gorm.Open("postgres", fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s", viper.GetString("database.host"), viper.GetString("database.port"), viper.GetString("database.username"), viper.GetString("database.password"), viper.GetString("database.database"), viper.GetString("database.ssl")))
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
