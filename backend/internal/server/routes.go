package server

import (
	"backend/internal/handlers"
	authMiddleware "backend/internal/middleware"
	"encoding/json"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.Logger)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Get("/", s.HelloWorldHandler)
	r.Get("/scalar", handlers.ScalarHandler())
	r.Route("/api", func(r chi.Router) {
		r.Get("/user", handlers.GetUserHandler())
		r.Get("/auth/{provider}", handlers.LoginHandler(s.config))
		r.Route("/articles", func(r chi.Router) {
			if s.config.AuthEnabled {
				r.Use(authMiddleware.AuthMiddleware)
			}
			r.Get("/", handlers.GetArticlesHandler(s.articleService))
			r.Get("/{id}", handlers.GetArticleHandler(s.articleService))
			r.Post("/", handlers.CreateArticleHandler(s.articleService))
			r.Put("/{id}", handlers.UpdateArticleHandler(s.articleService, s.publisherService))
			r.Delete("/{id}", handlers.DeleteArticleHandler(s.articleService, s.publisherService))
		})
		r.Route("/images", func(r chi.Router) {
			if s.config.AuthEnabled {
				r.Use(authMiddleware.AuthMiddleware)
			}
			r.Post("/", handlers.ImageUploadHandler(s.config))
			r.Get("/{imageId}", handlers.ImageDownloadHandler(s.config))
		})
	})
	r.Get("/auth/{provider}/callback", handlers.AuthCallbackHandler(s.config))

	return r
}

func (s *Server) HelloWorldHandler(w http.ResponseWriter, r *http.Request) {
	resp := make(map[string]string)
	resp["message"] = "Hello World"

	jsonResp, err := json.Marshal(resp)
	if err != nil {
		log.Fatalf("error handling JSON marshal. Err: %v", err)
	}

	_, _ = w.Write(jsonResp)
}
