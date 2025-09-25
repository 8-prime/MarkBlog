package handlers

import (
	"net/http"
)

func StaticFilesHandler() http.Handler {
	return http.StripPrefix("/static/", http.FileServer(http.Dir("backend/static/")))
}
