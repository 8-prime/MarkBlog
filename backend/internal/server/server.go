package server

import (
	"backend/internal/database"
	"backend/internal/models"
	"backend/internal/services"
	"database/sql"
	"fmt"
	"net/http"
	"time"

	_ "github.com/joho/godotenv/autoload"
)

type Server struct {
	port             int
	config           *models.Configuration
	atomService      *services.AtomService
	articleService   *services.ArticleService
	renderService    *services.RendererService
	publisherService *services.PublisherService
	db               *sql.DB
	queries          *database.Queries
}

func NewServer(config *models.Configuration) (*http.Server, error) {

	db, err := sql.Open("sqlite", config.ConnectionString)
	if err != nil {
		return nil, err
	}
	err = database.RunMigrations(db)
	if err != nil {
		return nil, err
	}

	queries := database.New(db)

	renderService, err := services.NewRendererService(config)
	if err != nil {
		return nil, err
	}

	atomService := services.NewAtomService(queries, config)
	articleService := services.NewArticleService(queries, db, atomService)

	serverConfig := &Server{
		db:               db,
		queries:          queries,
		port:             config.Port,
		config:           config,
		atomService:      atomService,
		articleService:   articleService,
		renderService:    renderService,
		publisherService: services.NewPublisherService(queries, config, articleService, renderService, atomService),
	}

	// Regenerate atom feed on startup so it is always fresh after a restart.
	atomService.Generate()

	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", serverConfig.port),
		Handler:      serverConfig.RegisterRoutes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	return server, nil
}
