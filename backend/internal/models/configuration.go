package models

import (
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Configuration struct {
	IsProd             bool
	AdminEmail         string
	ClientUrl          string
	HostingUrl         string
	SessionSecret      string
	GoogleClientId     string
	GoogleClientSecret string
	CallbackUrl        string
	AuthEnabled        bool
	ImagesDir          string
	FrontendDir        string
	ArticlesDir        string
	ConnectionString   string
	Port               int
	Style              string
	AuthorName         string
}

func LoadConfiguration() (*Configuration, error) {
	prod := os.Getenv("IS_PROD")
	isProd, err := strconv.ParseBool(prod)
	if err != nil {
		return nil, err
	}

	if !isProd {
		err := godotenv.Load()
		if err != nil {
			return nil, err
		}
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

	port, err := strconv.Atoi(os.Getenv("PORT"))
	if err != nil {
		return nil, err
	}

	style, found := os.LookupEnv("CODE_HIGHLIGHT_STYLE")
	if !found {
		style = "github-dark"
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
		ArticlesDir:        os.Getenv("ARTICLES_DIR"),
		ConnectionString:   conn,
		Port:               port,
		Style:              style,
		AuthorName:         os.Getenv("AUTHOR_NAME"),
		FrontendDir:        os.Getenv("FRONTEND_DIR"),
		IsProd:             isProd,
	}, nil
}
