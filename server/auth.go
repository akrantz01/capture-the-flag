package main

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"gopkg.in/hlandau/passlib.v1"
	"log"
	"net/http"
	"time"
)

func GetJWT(tokenString string) (*jwt.Token, error) {
	// Parse the token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (i interface{}, e error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		} else if _, ok := token.Header["kid"]; !ok {
			return nil, fmt.Errorf("unable to find key id in token")
		}

		// Get token
		t := new(Token)
		db.Where("id = ?", token.Header["kid"]).First(&t)
		if t.SigningKey == "" {
			return nil, fmt.Errorf("unable to find signing key for token: %v", token.Header["kid"])
		}

		// Decode signing key
		signingKey, err := base64.StdEncoding.DecodeString(t.SigningKey)
		if err != nil {
			return nil, fmt.Errorf("unable to decode signing key")
		}

		return signingKey, nil
	})
	if err != nil {
		return nil, err
	}

	// Check token validity
	if !token.Valid {
		return nil, fmt.Errorf("token is invalid")
	}

	return token, nil
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	// Check method is POST
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		if _, err := fmt.Fprint(w, "{\"status\": \"error\", \"reason\": \"method not allowed\"}"); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		return
	}

	// Decode json body
	decoder := json.NewDecoder(r.Body)
	var login struct{
		Email		string	`json:"email"`
		Password	string	`json:"password"`
	}
	if err := decoder.Decode(&login); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		if _, err := fmt.Fprintf(w, "{\"status\": \"error\", \"reason\": \"unable to unmarshal json: %v\"}", err); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		return
	}

	// Check if username & password exist
	if login.Email == "" || login.Password == "" {
		w.WriteHeader(http.StatusBadRequest)
		if _, err := fmt.Fprint(w, "{\"status\": \"error\", \"reason\": \"email and password fields are required\"}"); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		return
	}

	// Verify argument lengths
	if len(login.Email) < 4 || len(login.Email) > 64 {
		w.WriteHeader(http.StatusBadRequest)
		if _, err := fmt.Fprint(w, "{\"status\": \"error\", \"reason\": \"email must be between 4 and 64 characters\"}"); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		return
	} else if len(login.Password) != 64 {
		w.WriteHeader(http.StatusBadRequest)
		if _, err := fmt.Fprint(w, "{\"status\": \"error\", \"reason\": \"password must be 64 characters\"}"); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		return
	}

	// Check against database
	user := new(User)
	db.Where("email = ?", login.Email).First(&user)
	if user.ID == 0 && user.Email == "" && user.Password == "" {
		w.WriteHeader(http.StatusUnauthorized)
		if _, err := fmt.Fprint(w, "{\"status\": \"error\", \"reason\": \"invalid username or password\"}"); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		return
	}

	// Verify that password is correct
	hash, err := passlib.Verify(login.Password, user.Password)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		if _, err := fmt.Fprint(w, "{\"status\": \"error\", \"reason\": \"invalid username or password\"}"); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		return
	}

	// Update hash if needed
	if hash != "" {
		user.Password = hash
		db.Save(&user)
	}

	// Generate claims for JWT
	claims := &jwt.StandardClaims{
		ExpiresAt: time.Now().Unix() + (60*60*24),
		Issuer: "capture-the-flag",
		IssuedAt: time.Now().Unix(),
		Subject: user.Email,
	}

	// Create signing key
	signingKey := make([]byte, 128)
	if _, err := rand.Read(signingKey); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		if _, err := fmt.Fprint(w, "{\"status\": \"error\", \"reason\": \"unable to generate JWT signing key\"}"); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		return
	}

	// Base64 encode signing key
	b64SigningKey := base64.StdEncoding.EncodeToString(signingKey)

	// Save token to DB
	storedToken := &Token{
		UserId: user.ID,
		Token: "",
		SigningKey: b64SigningKey,
	}
	db.NewRecord(storedToken)
	db.Create(&storedToken)

	// Generate token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	token.Header["kid"] = storedToken.ID

	// Sign the token
	signed, err := token.SignedString(signingKey)

	storedToken.Token = signed
	db.Save(&storedToken)

	w.WriteHeader(http.StatusOK)
	if _, err := fmt.Fprintf(w, "{\"status\": \"success\", \"token\": \"%s\"}", signed); err != nil {
		log.Printf("Unable to send response: %v\n", err)
	}
}

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	// Check if method is GET
	if r.Method != "GET" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		if _, err := fmt.Fprint(w, "{\"status\": \"error\", \"reason\": \"method not allowed\"}"); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		return
	}

	// Verify arguments
	if r.Header.Get("Token") == "" {
		w.WriteHeader(http.StatusBadRequest)
		if _, err := fmt.Fprint(w, "{\"status\": \"error\", \"reason\": \"header 'Token' does not exist\"}"); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		return
	}

	// Verify JWT
	token, err := GetJWT(r.Header.Get("Token"))
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		if _, err := fmt.Fprintf(w, "{\"status\": \"error\", \"reason\": \"invalid token: %s\"}", err); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		return
	}

	// Get the token claims
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		if _, err := fmt.Fprint(w, "{\"status\": \"error\", \"reason\": \"invalid claims format\"}"); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		return
	}

	user := new(User)
	db.Where("email = ?", claims["sub"]).First(&user)
	if user.ID == 0 {
		w.WriteHeader(http.StatusUnauthorized)
		if _, err := fmt.Fprintf(w, "{\"status\": \"error\", \"reason\": \"no user exists at email: %v\"}", claims["sub"]); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		return
	}

	tdao := new(Token)
	db.Where("id = ?", token.Header["kid"]).First(&tdao)
	db.Delete(&tdao)

	w.WriteHeader(http.StatusOK)
	if _, err := fmt.Fprint(w, "{\"status\": \"success\"}"); err != nil {
		log.Printf("Unable to send response: %v\n", err)
	}
}

func SignUpHandler(w http.ResponseWriter, r *http.Request) {
	// Check method is POST
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		if _, err := fmt.Fprint(w, "{\"status\": \"error\", \"reason\": \"method not allowed\"}"); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		return
	}

	// Decode json body
	decoder := json.NewDecoder(r.Body)
	var signup struct{
		Email		string	`json:"email"`
		Password	string	`json:"password"`
		Name		string	`json:"name"`
		Username	string	`json:"username"`
	}
	if err := decoder.Decode(&signup); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		if _, err := fmt.Fprintf(w, "{\"status\": \"error\", \"reason\": \"unable to unmarshal json: %v\"}", err); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		return
	}

	// Check if username & password exist
	if signup.Email == "" || signup.Password == "" || signup.Username == "" || signup.Name == "" {
		w.WriteHeader(http.StatusBadRequest)
		if _, err := fmt.Fprint(w, "{\"status\": \"error\", \"reason\": \"email, password, name and username fields are required\"}"); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		return
	}

	// Verify argument lengths
	if len(signup.Email) < 4 || len(signup.Email) > 64 {
		w.WriteHeader(http.StatusBadRequest)
		if _, err := fmt.Fprint(w, "{\"status\": \"error\", \"reason\": \"email must be between 4 and 64 characters\"}"); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		return
	} else if len(signup.Password) != 64 {
		w.WriteHeader(http.StatusBadRequest)
		if _, err := fmt.Fprint(w, "{\"status\": \"error\", \"reason\": \"password must be 64 characters\"}"); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		return
	} else if len(signup.Username) < 4 || len(signup.Username) > 64 {
		w.WriteHeader(http.StatusBadRequest)
		if _, err := fmt.Fprint(w, "{\"status\": \"error\", \"reason\": \"username must be between 4 and 64 characters\"}"); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		return
	} else if len(signup.Name) > 64 {
		w.WriteHeader(http.StatusBadRequest)
		if _, err := fmt.Fprint(w, "{\"status\": \"error\", \"reason\": \"name must be 64 characters\"}"); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		return
	}

	// Hash the password
	hashed, err := passlib.Hash(signup.Password)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		if _, err := fmt.Fprint(w, "{\"status\": \"error\", \"reason\": \"unable to hash password\"}"); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		log.Printf("Error hashing password: %v\n", err)
		return
	}

	// Check email exists
	qu := new(User)
	db.Where("email = ?", signup.Email).First(&qu)
	if qu.Email != "" {
		w.WriteHeader(http.StatusConflict)
		if _, err := fmt.Fprint(w, "{\"status\": \"error\", \"reason\": \"email already in use\"}"); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		return
	}
	qa := new(Account)
	db.Where("username = ?", signup.Username).First(&qa)
	if qa.Username != "" {
		w.WriteHeader(http.StatusConflict)
		if _, err := fmt.Fprint(w, "{\"status\": \"error\", \"reason\": \"username already in use\"}"); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		return
	}

	// Create the user
	user := User{
		Name:     signup.Name,
		Email:    signup.Email,
		Password: hashed,
	}
	db.NewRecord(user)
	db.Create(&user)

	// Create the account data
	account := Account{
		Username:   signup.Username,
		HighScore:  0,
		TimePlayed: 0,
		UserId:     user.ID,
	}
	db.NewRecord(account)
	db.Create(&account)

	// Send success
	w.WriteHeader(http.StatusOK)
	if _, err := fmt.Fprint(w, "{\"status\": \"success\"}"); err != nil {
		log.Printf("Unable to send response: %v\n", err)
	}
}

func VerifyHandler(w http.ResponseWriter, r *http.Request) {
	// Check method
	if r.Method != "GET" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		if _, err := fmt.Fprint(w, "{\"status\": \"error\", \"reason\": \"method not allowed\"}"); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		return
	}

	// Verify arguments
	if r.Header.Get("Token") == "" {
		w.WriteHeader(http.StatusBadRequest)
		if _, err := fmt.Fprint(w, "{\"status\": \"error\", \"reason\": \"header 'Token' does not exist\"}"); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		return
	}

	// Verify JWT
	token, err := GetJWT(r.Header.Get("Token"))
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		if _, err := fmt.Fprintf(w, "{\"status\": \"error\", \"reason\": \"invalid token: %s\", \"valid\": false}", err); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		return
	}

	// Get the token claims
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		if _, err := fmt.Fprint(w, "{\"status\": \"error\", \"reason\": \"invalid claims format\", \"valid\": false}"); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
	}

	user := new(User)
	db.Where("email = ?", claims["sub"]).First(&user)
	if user.ID == 0 {
		w.WriteHeader(http.StatusUnauthorized)
		if _, err := fmt.Fprintf(w, "{\"status\": \"error\", \"reason\": \"no user exists at email: %v\", \"valid\": false}", claims["sub"]); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		return
	}

	w.WriteHeader(http.StatusOK)
	if _, err := fmt.Fprint(w, "{\"status\": \"success\", \"valid\": true}"); err != nil {
		log.Printf("Unable to send response: %v\n", err)
	}
}

func UpdateHandler(w http.ResponseWriter, r *http.Request) {
	// Check method
	if r.Method != "PUT" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		if _, err := fmt.Fprint(w, "{\"status\": \"error\", \"reason\": \"method not allowed\"}"); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		return
	}

	// Decode json body
	decoder := json.NewDecoder(r.Body)
	var update struct{
		Email		string	`json:"email"`
		Password	string	`json:"password"`
		Name		string	`json:"name"`
		Username	string	`json:"username"`
	}
	if err := decoder.Decode(&update); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		if _, err := fmt.Fprintf(w, "{\"status\": \"error\", \"reason\": \"unable to unmarshal json: %v\"}", err); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		return
	}

	// Verify token exists
	if r.Header.Get("Token") == "" {
		w.WriteHeader(http.StatusBadRequest)
		if _, err := fmt.Fprint(w, "{\"status\": \"error\", \"reason\": \"header 'Token' does not exist\"}"); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		return
	}

	// Verify JWT
	token, err := GetJWT(r.Header.Get("Token"))
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		if _, err := fmt.Fprintf(w, "{\"status\": \"error\", \"reason\": \"invalid token: %s\"}", err); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		return
	}

	// Get the token claims
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		if _, err := fmt.Fprint(w, "{\"status\": \"error\", \"reason\": \"invalid claims format\", \"valid\": false}"); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
	}

	// Get user to modify
	user := new(User)
	db.Where("email = ?", claims["sub"]).First(&user)
	if user.ID == 0 {
		w.WriteHeader(http.StatusUnauthorized)
		if _, err := fmt.Fprintf(w, "{\"status\": \"error\", \"reason\": \"no user exists at email: %v\", \"valid\": false}", claims["sub"]); err != nil {
			log.Printf("Unable to send response: %v\n", err)
		}
		return
	}

	// Handle updating email
	if update.Email != "" {
		user.Email = update.Email
	}

	// Handle updating password
	if update.Password != "" {
		user.Password = update.Password
	}

	// Handle updating username
	if update.Username != "" {
		account := new(Account)
		db.Where("user_id = ?", user.ID).First(&account)
		account.Username = update.Username
		db.Save(&account)
	}

	// Handle updating name
	if update.Name != "" {
		user.Name = update.Name
	}

	// Commit changes
	db.Save(&user)

	w.WriteHeader(http.StatusOK)
	if _, err := fmt.Fprint(w, "{\"status\": \"success\"}"); err != nil {
		log.Printf("Unable to send response: %v\n", err)
	}
}
