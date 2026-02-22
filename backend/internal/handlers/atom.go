package handlers

import (
	"backend/internal/models"
	"errors"
	"net/http"
	"os"
)

func AtomFeedHandler(config *models.Configuration) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		f, err := os.Open(config.AtomFilePath)
		if err != nil {
			if errors.Is(err, os.ErrNotExist) {
				http.Error(w, "feed not available", http.StatusNotFound)
				return
			}
			http.Error(w, "internal server error", http.StatusInternalServerError)
			return
		}
		defer f.Close()
		stat, err := f.Stat()
		if err != nil {
			http.Error(w, "internal server error", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/atom+xml; charset=utf-8")
		http.ServeContent(w, r, "atom.xml", stat.ModTime(), f)
	}
}
