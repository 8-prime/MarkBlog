package handlers

import (
	"backend/internal/models"
	"fmt"
	"log"
	"net/http"

	"github.com/markbates/goth/gothic"
)

const userSessionKey = "user_id"

func LoginHandler(config *models.Configuration) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if user, err := gothic.CompleteUserAuth(w, r); err == nil {
			if user.Email != config.AdminEmail {
				http.Redirect(w, r, "/bad", http.StatusSeeOther)
				return
			}

			err = gothic.StoreInSession(userSessionKey, user.UserID, r, w)
			if err != nil {
				http.Error(w, "Failed to save session", http.StatusInternalServerError)
				log.Println(err)
				return
			}

			http.Redirect(w, r, config.ClientUrl, http.StatusSeeOther)
			return
		} else {
			gothic.BeginAuthHandler(w, r)
		}
	}
}

func AuthCallbackHandler(config *models.Configuration) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user, err := gothic.CompleteUserAuth(w, r)
		if err != nil {
			fmt.Fprintln(w, err)
			return
		}
		fmt.Println(user)
		if user.Email != config.AdminEmail {
			http.Redirect(w, r, "/bad", http.StatusSeeOther)
		}

		err = gothic.StoreInSession(userSessionKey, user.UserID, r, w)
		if err != nil {
			http.Error(w, "Failed to save session", http.StatusInternalServerError)
			log.Println(err)
			return
		}
		http.Redirect(w, r, config.ClientUrl, http.StatusSeeOther)
	}
}
