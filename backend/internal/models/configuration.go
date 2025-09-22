package models

import (
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Configuration struct {
	AdminEmail         string
	ClientUrl          string
	HostingUrl         string
	SessionSecret      string
	GoogleClientId     string
	GoogleClientSecret string
	CallbackUrl        string
	AuthEnabled        bool
	ImagesDir          string
	ConnectionString   string
}

func LoadConfiguration() (*Configuration, error) {
	err := godotenv.Load()
	if err != nil {
		return nil, err
	}

	authEnabled := os.Getenv("AUTH_ENABLED")
	authEnabledBool, err := strconv.ParseBool(authEnabled)
	if err != nil {
		return nil, err
	}

	conn, found := os.LookupEnv("CONNECTION_STRING")
	if !found {
		conn = ":memory:"
	}

	hostingUrl := os.Getenv("HOSTING_URL")

	return &Configuration{
		AdminEmail:         os.Getenv("ADMIN_EMAIL"),
		ClientUrl:          os.Getenv("CLIENT_URL"),
		HostingUrl:         hostingUrl,
		SessionSecret:      os.Getenv("SESSION_KEY"),
		GoogleClientId:     os.Getenv("GOOGLE_CLIENT_ID"),
		GoogleClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		CallbackUrl:        hostingUrl + "/auth/google/callback",
		AuthEnabled:        authEnabledBool,
		ImagesDir:          os.Getenv("IMAGES_DIR"),
		ConnectionString:   conn,
	}, nil
}
