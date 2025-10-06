package utils

import (
	"backend/internal/models"
	"fmt"
	"net/url"
)

func BlogName(config *models.Configuration) string {
	if config.AuthorName != "" {
		return fmt.Sprintf("%s's Blog", config.AuthorName)
	}
	return "My Blog"
}

func ArticleUrl(config *models.Configuration, fileName string) string {
	u, e := url.JoinPath(config.HostingUrl, "articles", fileName)
	if e != nil {
		return ""
	}
	return u
}

func BlogImage(config *models.Configuration) string {
	u, e := url.JoinPath(config.HostingUrl, "static", "title-image.png")
	if e != nil {
		return ""
	}
	return u
}
