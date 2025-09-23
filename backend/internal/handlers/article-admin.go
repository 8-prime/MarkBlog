package handlers

import (
	"backend/internal/models"
	"backend/internal/services"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

func GetArticlesHandler(articleService *services.ArticleService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		page := r.URL.Query().Get("page")
		if page == "" {
			page = "1"
		}
		p, err := strconv.Atoi(page)
		if err != nil || p < 1 {
			http.Error(w, "Invalid page number", http.StatusBadRequest)
			return
		}

		articleInfos, err := articleService.GetArticleInfos(p, r.Context())

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(articleInfos)
	}
}

func GetArticleHandler(articleService *services.ArticleService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		articleId := chi.URLParam(r, "id")
		id, err := strconv.ParseInt(articleId, 10, 64)
		if err != nil {
			http.Error(w, "Invalid article id", http.StatusBadRequest)
			return
		}
		article, err := articleService.GetArticleDto(id, r.Context())
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(article)
	}
}

func CreateArticleHandler(articleService *services.ArticleService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		decoder := json.NewDecoder(r.Body)
		var createArticle models.CreateArticle
		err := decoder.Decode(&createArticle)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		id, err := articleService.CreateArticle(createArticle, r.Context())
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		articleDto, err := articleService.GetArticleDto(id, r.Context())

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(articleDto)
	}
}

func UpdateArticleHandler(articleService *services.ArticleService, publishService *services.PublisherService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		decoder := json.NewDecoder(r.Body)
		var articleUpdate models.ArticleDto
		err := decoder.Decode(&articleUpdate)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		err = articleService.UpdateArticle(&articleUpdate, r.Context())
		if articleUpdate.ScheduledAt != nil {
			log.Printf("Scheduling article %d for publishing", articleUpdate.ID)
			publishService.Publish(articleUpdate.ID, articleUpdate.ScheduledAt)
		}

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}

func DeleteArticleHandler(articleService *services.ArticleService, publishService *services.PublisherService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		articleId := chi.URLParam(r, "id")
		id, err := strconv.ParseInt(articleId, 10, 64)
		if err != nil {
			http.Error(w, "Invalid article id", http.StatusBadRequest)
			return
		}

		err = publishService.Unpublish(id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		err = articleService.DeleteArticle(id, r.Context())
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}
