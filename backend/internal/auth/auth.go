package auth

import (
	"log"
	"os"

	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
	"github.com/markbates/goth"
	"github.com/markbates/goth/providers/google"
)

const (
	MaxAge = 86400 * 30
	IsProd = false
)

func NewAuth() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	googleClientId := os.Getenv("GOOGLE_CLIENT_ID")
	googleClientSecret := os.Getenv("GOOGLE_CLIENT_SECRET")
	key := os.Getenv("SESSION_KEY")
	callbackUrl := os.Getenv("CALLBACK_URL")

	store := sessions.NewCookieStore([]byte(key))
	store.MaxAge(MaxAge)

	store.Options.Path = "/"
	store.Options.HttpOnly = true
	store.Options.Secure = IsProd

	// gothic.Store = store
	// goth.Session

	goth.UseProviders(
		google.New(googleClientId, googleClientSecret, callbackUrl),
	)

	// gothic.UseProviders(
	// 	google.New(googleClientId, googleClientSecret, callbackUrl))
}
