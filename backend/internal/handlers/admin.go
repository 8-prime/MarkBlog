package handlers

import (
	"backend/internal/models"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

func AdminPageHandler(config *models.Configuration) http.Handler {
	fs := http.FileServer(http.Dir(config.FrontendDir))

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// StripPrefix so /admin/* maps to filesystem root
		r2 := new(http.Request)
		*r2 = *r
		r2.URL.Path = strings.TrimPrefix(r.URL.Path, "/admin/")

		// Try to open the file
		f, err := os.Open(filepath.Join(config.FrontendDir, r2.URL.Path))
		if err != nil {
			// If not found, serve index.html (React SPA fallback)
			http.ServeFile(w, r, filepath.Join(config.FrontendDir, "index.html"))
			return
		}
		f.Close()

		fs.ServeHTTP(w, r)
	})
}
