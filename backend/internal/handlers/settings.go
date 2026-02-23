package handlers

import (
	"backend/internal/services"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

type Theme struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

var themes = []Theme{
	{"terminal", "Terminal", "Dark hacker aesthetic with green-on-black styling"},
	{"minimal", "Minimal", "Clean editorial light theme with navy accents"},
	{"chronicle", "Chronicle", "Warm amber logbook — date-first entries on a near-black canvas"},
}

var validThemes = func() map[string]bool {
	m := make(map[string]bool, len(themes))
	for _, t := range themes {
		m[t.ID] = true
	}
	return m
}()

// StylesHandler serves the active theme CSS with ETag-based cache busting.
func StylesHandler(settingsService *services.SettingsService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		theme, err := settingsService.GetTheme(ctx)
		if err != nil || !validThemes[theme] {
			theme = "terminal"
		}

		version, err := settingsService.GetThemeVersion(ctx)
		if err != nil {
			version = "0"
		}

		etag := fmt.Sprintf(`"%s-%s"`, theme, version)

		if match := r.Header.Get("If-None-Match"); match == etag {
			w.WriteHeader(http.StatusNotModified)
			return
		}

		cssPath := fmt.Sprintf("public/styles-%s.css", theme)
		data, err := os.ReadFile(cssPath)
		if err != nil {
			http.Error(w, "CSS file not found", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "text/css; charset=utf-8")
		w.Header().Set("Cache-Control", "no-cache")
		w.Header().Set("ETag", etag)
		w.WriteHeader(http.StatusOK)
		w.Write(data)
	}
}

type themeResponse struct {
	Theme string `json:"theme"`
}

// GetThemeHandler handles GET /api/settings/theme
func GetThemeHandler(settingsService *services.SettingsService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		theme, err := settingsService.GetTheme(r.Context())
		if err != nil {
			http.Error(w, "failed to get theme", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(themeResponse{Theme: theme})
	}
}

// GetThemesHandler handles GET /api/settings/themes
func GetThemesHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(themes)
	}
}

// SetThemeHandler handles PUT /api/settings/theme
func SetThemeHandler(settingsService *services.SettingsService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var body themeResponse
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, "invalid request body", http.StatusBadRequest)
			return
		}

		if !validThemes[body.Theme] {
			http.Error(w, "invalid theme", http.StatusBadRequest)
			return
		}

		if err := settingsService.SetTheme(r.Context(), body.Theme); err != nil {
			http.Error(w, "failed to set theme", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusNoContent)
	}
}
