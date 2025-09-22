package services

import (
	"backend/internal/database"
	"backend/internal/models"
	"context"
	"fmt"
	"regexp"
	"strings"
	"unicode"

	_ "modernc.org/sqlite"
)

type ArticleService struct {
	Queries *database.Queries
}

func NewArticleService(queries *database.Queries) *ArticleService {
	return &ArticleService{
		Queries: queries,
	}
}

// titleToFilename converts an article title to a URL-safe filename
// that can be used as a browser URL path segment
func titleToFilename(title string) (string, error) {
	if title == "" {
		return "", fmt.Errorf("title cannot be empty")
	}

	// Convert to lowercase
	filename := strings.ToLower(title)

	// Replace spaces and underscores with hyphens
	filename = strings.ReplaceAll(filename, " ", "-")
	filename = strings.ReplaceAll(filename, "_", "-")

	// Remove or replace common punctuation
	replacements := map[string]string{
		"&":  "and",
		"+":  "plus",
		"%":  "percent",
		"@":  "at",
		"#":  "",
		"$":  "",
		"!":  "",
		"?":  "",
		",":  "",
		".":  "",
		";":  "",
		":":  "",
		"\"": "",
		"'":  "",
		"`":  "",
		"~":  "",
		"^":  "",
		"*":  "",
		"(":  "",
		")":  "",
		"[":  "",
		"]":  "",
		"{":  "",
		"}":  "",
		"|":  "",
		"\\": "",
		"/":  "",
		"<":  "",
		">":  "",
		"=":  "",
	}

	for old, new := range replacements {
		filename = strings.ReplaceAll(filename, old, new)
	}

	var result strings.Builder
	for _, r := range filename {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') || r == '-' {
			result.WriteRune(r)
		} else if unicode.IsLetter(r) || unicode.IsNumber(r) {
			continue
		}
	}
	filename = result.String()

	// Remove multiple consecutive hyphens
	re := regexp.MustCompile(`-+`)
	filename = re.ReplaceAllString(filename, "-")

	// Trim hyphens from start and end
	filename = strings.Trim(filename, "-")

	if filename == "" {
		return "", fmt.Errorf("title must contain at least one valid character")
	}
	return filename, nil
}

func (a *ArticleService) CreateArticle(article models.CreateArticle, ctx context.Context) (*database.Article, error) {
	filename, err := titleToFilename(article.Title)
	if err != nil {
		return nil, err
	}

	articleInfo, err := a.Queries.CreateArticle(ctx, database.CreateArticleParams{
		Title:       article.Title,
		Filename:    filename,
		Description: article.Description,
		Body:        article.Body,
	})

	if err != nil {
		return nil, err
	}

	for _, tag := range article.Tags {
		err = a.Queries.CreateTag(ctx, tag)
		if err != nil {
			return nil, err
		}

		err = a.Queries.CreateArticleTag(ctx, database.CreateArticleTagParams{
			ArticleID: articleInfo.ID,
			TagName:   tag,
		})
		if err != nil {
			return nil, err
		}
	}
	return &articleInfo, nil
}
