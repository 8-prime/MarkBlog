package server

import (
	"backend/internal/database"
	"backend/internal/handlers"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	_ "github.com/joho/godotenv/autoload"
)

type Server struct {
	port            int
	handlerSettings *handlers.HandlerSettings
	dbSettings      *database.DatabaseSettings
}

func NewServer(settings *handlers.HandlerSettings) *http.Server {
	port, _ := strconv.Atoi(os.Getenv("PORT"))
	NewServer := &Server{
		port:            port,
		handlerSettings: settings,
		dbSettings:      database.NewDatabaseSettings(),
	}

	// Declare Server config
	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", NewServer.port),
		Handler:      NewServer.RegisterRoutes(NewServer.handlerSettings),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	return server
}
