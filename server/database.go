package main

import (
	"fmt"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/spf13/viper"
	"log"
)

// Users table
// Used for authentication
type User struct {
	gorm.Model
	Name		string
	Email		string
	Password	string
}

// Account table
// Used for user account information
type Account struct {
	gorm.Model
	Username	string
	HighScore	uint		// Currently unused
	TimePlayed	float64		// Currently ununsed
	UserId		uint		// One-to-one relationship with users table
	User		User
}

// Tokens table
// Used for authentication tokens to validate HTTP API
type Token struct {
	gorm.Model
	UserId		uint		// One-to-many relationship with users table
	User		User
	Token		string
	SigningKey	string		// For decoding token successfully
}

// Password reset tokens table
// Used for checking if a user is allowed to reset their password
type PasswordReset struct {
	gorm.Model
	Email		string
	Token		string
	SigningKey	string
}

// Create the database connection to PostgreSQL
func connectDatabase() *gorm.DB {
	// Connect with values from viper
	log.Print("Connecting to database...")
	db, err := gorm.Open("postgres", fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s", viper.GetString("database.host"), viper.GetString("database.port"), viper.GetString("database.username"), viper.GetString("database.password"), viper.GetString("database.database"), viper.GetString("database.ssl")))
	if err != nil {
		log.Fatalf("Unable to connect to database: %s", err)
	}
	log.Println("Connected")

	// Build the schema
	log.Print("Creating database schema...")
	createSchema(db)
	log.Println("Created")

	return db
}

// Create the table if it does not already exist in the database
func createSchema(db *gorm.DB) {
	for _, model := range []interface{}{&User{}, &Account{}, &Token{}, &PasswordReset{}} {
		if !db.HasTable(model) {
			db.CreateTable(model)
		}
	}
}
