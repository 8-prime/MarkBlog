package handlers

import "os"

type HandlerSettings struct {
	adminEmail string
	clientUrl  string
}

func NewHandlerSettings() *HandlerSettings {
	return &HandlerSettings{
		adminEmail: os.Getenv("ADMIN_EMAIL"),
		clientUrl:  os.Getenv("CLIENT_URL"),
	}
}
