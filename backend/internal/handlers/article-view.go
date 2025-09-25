package handlers

import (
	"backend/internal/database"
	"backend/internal/models"
	"backend/internal/services"
	"backend/internal/views"
	"context"
	"log"
	"net/http"
	"path"
	"strconv"

	"github.com/go-chi/chi/v5"
)

func ArticleInfos(articleService *services.ArticleService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		page := r.URL.Query().Get("page")
		pageNum, err := strconv.Atoi(page)
		if err != nil || pageNum < 1 {
			http.Error(w, "", http.StatusBadRequest)
			return
		}
		articles, err := articleService.GetArticleInfos(pageNum, r.Context())
		if err != nil {
			http.Error(w, "", http.StatusInternalServerError)
			return
		}
		views.ArticlesInfo(articles).Render(r.Context(), w)
	}
}

func MainPageHandler(articleService *services.ArticleService, config *models.Configuration) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		articles, err := articleService.GetArticleInfos(1, r.Context())
		if err != nil {
			articles = make([]models.ArticleInfo, 0)
		}

		views.Index(articles, config).Render(r.Context(), w)
	}
}

func ViewArticleHandler(config *models.Configuration, queries *database.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		articleId := chi.URLParam(r, "id")

		go func() {
			err := queries.AddArticleRead(context.Background(), articleId)
			if err != nil {
				log.Println("Error adding article read:", err)
			}
		}()

		filename := path.Join(config.ArticlesDir, articleId+".html")
		http.ServeFile(w, r, filename)
	}
}
