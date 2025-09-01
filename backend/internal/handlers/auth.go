package handlers

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/markbates/goth/gothic"
)

const userSessionKey = "user_id"

func LoginHandler(settings *HandlerSettings) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		provider := chi.URLParam(r, "provider")
		r = r.WithContext(context.WithValue(context.Background(), "provider", provider))
		// try to get the user without re-authenticating
		if user, err := gothic.CompleteUserAuth(w, r); err == nil {
			if user.Email != settings.adminEmail {
				http.Redirect(w, r, "/bad", http.StatusSeeOther)
			}

			err = gothic.StoreInSession(userSessionKey, user.UserID, r, w)
			if err != nil {
				http.Error(w, "Failed to save session", http.StatusInternalServerError)
				log.Println(err)
				return
			}

			fmt.Println(w, err)
			return
		} else {
			gothic.BeginAuthHandler(w, r)
		}
	}
}

func AuthCallbackHandler(settings *HandlerSettings) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		provider := chi.URLParam(r, "provider")
		fmt.Println(provider)
		r = r.WithContext(context.WithValue(context.Background(), "provider", provider))

		user, err := gothic.CompleteUserAuth(w, r)
		if err != nil {
			fmt.Fprintln(w, err)
			return
		}
		fmt.Println(user)
		if user.Email != settings.adminEmail {
			http.Redirect(w, r, "/bad", http.StatusSeeOther)
		}

		err = gothic.StoreInSession(userSessionKey, user.UserID, r, w)
		if err != nil {
			http.Error(w, "Failed to save session", http.StatusInternalServerError)
			log.Println(err)
			return
		}
		http.Redirect(w, r, settings.clientUrl, http.StatusSeeOther)
	}
}
