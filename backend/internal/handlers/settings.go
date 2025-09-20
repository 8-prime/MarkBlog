package handlers

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type HandlerSettings struct {
	AdminEmail         string
	ClientUrl          string
	SessionSecret      string
	GoogleClientId     string
	GoogleClientSecret string
	CallbackUrl        string
	AuthEnabled        bool
	ImagesDir          string
}

func NewHandlerSettings() *HandlerSettings {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	authEnabled := os.Getenv("AUTH_ENABLED")
	authEnabledBool, err := strconv.ParseBool(authEnabled)
	if err != nil {
		panic(err)
	}
	return &HandlerSettings{
		AdminEmail:         os.Getenv("ADMIN_EMAIL"),
		ClientUrl:          os.Getenv("CLIENT_URL"),
		SessionSecret:      os.Getenv("SESSION_KEY"),
		GoogleClientId:     os.Getenv("GOOGLE_CLIENT_ID"),
		GoogleClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		CallbackUrl:        os.Getenv("CALLBACK_URL"),
		AuthEnabled:        authEnabledBool,
		ImagesDir:          os.Getenv("IMAGES_DIR"),
	}
}
