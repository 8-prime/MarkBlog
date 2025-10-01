package auth

import (
	"backend/internal/models"
	"net/http"

	"github.com/gorilla/sessions"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/google"
)

const (
	MaxAge = 86400 * 30
)

func NewAuth(config *models.Configuration) {
	store := sessions.NewCookieStore([]byte(config.SessionSecret))
	store.MaxAge(MaxAge)

	store.Options.Path = "/"
	store.Options.HttpOnly = true
	store.Options.Secure = config.IsProd
	if config.IsProd {
		store.Options.SameSite = http.SameSiteStrictMode
	} else {
		store.Options.SameSite = http.SameSiteLaxMode
	}

	gothic.Store = store

	goth.UseProviders(
		google.New(config.GoogleClientId, config.GoogleClientSecret, config.CallbackUrl),
	)
}
