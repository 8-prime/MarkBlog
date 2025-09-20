package auth

import (
	"backend/internal/handlers"
	"net/http"

	"github.com/gorilla/sessions"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/google"
)

const (
	MaxAge = 86400 * 30
	IsProd = false
)

func NewAuth(settings *handlers.HandlerSettings) {
	store := sessions.NewCookieStore([]byte(settings.SessionSecret))
	store.MaxAge(MaxAge)

	store.Options.Path = "/"
	store.Options.HttpOnly = true
	store.Options.Secure = IsProd
	if IsProd {
		store.Options.SameSite = http.SameSiteStrictMode
	} else {
		store.Options.SameSite = http.SameSiteLaxMode
	}

	gothic.Store = store

	goth.UseProviders(
		google.New(settings.GoogleClientId, settings.GoogleClientSecret, settings.CallbackUrl),
	)
}
