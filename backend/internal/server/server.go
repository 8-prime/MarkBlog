package server

import (
	"backend/internal/database"
	"backend/internal/models"
	"backend/internal/services"
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	_ "github.com/joho/godotenv/autoload"
)

type Server struct {
	port           int
	config         *models.Configuration
	articleService *services.ArticleService
	db             *sql.DB
	queries        *database.Queries
}

func NewServer(config *models.Configuration) (*http.Server, error) {
	port, _ := strconv.Atoi(os.Getenv("PORT"))

	db, err := sql.Open("sqlite", config.ConnectionString)
	if err != nil {
		return nil, err
	}
	err = database.RunMigrations(db)
	if err != nil {
		return nil, err
	}

	queries := database.New(db)

	serverConfig := &Server{
		db:             db,
		queries:        queries,
		port:           port,
		config:         config,
		articleService: services.NewArticleService(queries),
	}

	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", serverConfig.port),
		Handler:      serverConfig.RegisterRoutes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	return server, nil
}
