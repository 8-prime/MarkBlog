package handlers

import (
	"backend/internal/models"
	"backend/internal/services"
	"encoding/xml"
	"net/http"
	"net/url"
)

func getUrlsFromArticleInfos(infos []models.SiteMapArticleInfo, config *models.Configuration) []models.SitemapUrl {
	urls := make([]models.SitemapUrl, 0)
	for i := 0; i < len(infos); i++ {
		info := infos[i]
		loc, err := url.JoinPath(config.HostingUrl, "articles", info.Filename)
		if err != nil {
			continue
		}
		urls = append(urls, models.SitemapUrl{
			Location: loc,
		})
	}
	return urls
}

func SitemapHandler(articlesService *services.ArticleService, config *models.Configuration) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		articles, err := articlesService.GetSitemapArticleInfos(r.Context())
		if err != nil {
			http.Error(w, "Could not load articles for sitemap", http.StatusInternalServerError)
			return
		}

		sitemap := models.Sitemap{
			Xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
			Urls:  getUrlsFromArticleInfos(articles, config),
		}
		w.Header().Set("Content-Type", "application/xml; charset=utf-8")

		output, err := xml.MarshalIndent(sitemap, "", "  ")
		if err != nil {
			http.Error(w, "Error generating sitemap", http.StatusInternalServerError)
			return
		}

		w.Write([]byte(xml.Header))
		w.Write(output)
	})
}
