package services

import (
	"backend/internal/database"
	"backend/internal/models"
	"context"
	"database/sql"
	"fmt"
	"regexp"
	"strings"
	"time"
	"unicode"

	_ "modernc.org/sqlite"
)

type ArticleService struct {
	Queries *database.Queries
	Db      *sql.DB
}

func NewArticleService(queries *database.Queries, db *sql.DB) *ArticleService {
	return &ArticleService{
		Queries: queries,
		Db:      db,
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

func (a *ArticleService) setTagsForArticle(articleId int64, tags []string, qtx *database.Queries, ctx context.Context) error {
	for _, tag := range tags {
		err := qtx.CreateTag(ctx, tag)
		if err != nil {
			return err
		}

		err = qtx.CreateArticleTag(ctx, database.CreateArticleTagParams{
			ArticleID: articleId,
			TagName:   tag,
		})
		if err != nil {
			return err
		}
	}
	return nil
}

func (a *ArticleService) CreateArticle(article models.CreateArticle, ctx context.Context) (int64, error) {
	tx, err := a.Db.BeginTx(ctx, nil)
	if err != nil {
		return 0, err
	}
	defer tx.Rollback()
	qtx := a.Queries.WithTx(tx)

	filename, err := titleToFilename(article.Title)
	if err != nil {
		return 0, err
	}

	articleId, err := qtx.CreateArticle(ctx, database.CreateArticleParams{
		Title:       article.Title,
		Filename:    filename,
		Description: article.Description,
		Body:        article.Body,
	})

	if err != nil {
		return 0, err
	}

	err = a.setTagsForArticle(articleId, article.Tags, qtx, ctx)
	if err != nil {
		return 0, err
	}
	return articleId, tx.Commit()
}

func (a *ArticleService) UpdateArticle(article *models.ArticleDto, ctx context.Context) error {
	tx, err := a.Db.BeginTx(ctx, nil)

	if err != nil {
		return err
	}
	defer tx.Rollback()
	qtx := a.Queries.WithTx(tx)

	newTitle, err := titleToFilename(article.Title)
	if err != nil {
		return err
	}

	var publishTime sql.NullTime
	if article.PublishedAt == nil {
		publishTime = sql.NullTime{Valid: false}
	} else {
		publishTime = sql.NullTime{Time: *article.PublishedAt, Valid: true}
	}

	var scheduleTime sql.NullTime
	if article.ScheduledAt == nil {
		scheduleTime = sql.NullTime{Valid: false}
	} else {
		scheduleTime = sql.NullTime{Time: *article.ScheduledAt, Valid: true}
	}

	err = qtx.UpdateArticle(ctx, database.UpdateArticleParams{
		Title:       article.Title,
		Filename:    newTitle,
		Description: article.Description,
		Body:        article.Body,
		ID:          article.ID,
		ScheduledAt: scheduleTime,
		PublishedAt: publishTime,
	})
	if err != nil {
		return err
	}

	err = qtx.ClearArticleTags(ctx, article.ID)
	if err != nil {
		return err
	}
	err = a.setTagsForArticle(article.ID, article.Tags, qtx, ctx)

	if err != nil {
		return err
	}

	return tx.Commit()
}

func (a *ArticleService) GetArticleInfos(page int, ctx context.Context) ([]database.GetArticleInfosRow, error) {
	infos, err := a.Queries.GetArticleInfos(ctx, database.GetArticleInfosParams{
		Limit:  10,
		Offset: int64((page - 1) * 10),
	})

	return infos, err
}

func (a *ArticleService) GetArticleDto(id int64, ctx context.Context) (models.ArticleDto, error) {
	article, err := a.Queries.GetArticle(ctx, id)
	if err != nil {
		return models.ArticleDto{}, err
	}

	tags, err := a.Queries.GetArticleTags(ctx, id)
	if err != nil {
		return models.ArticleDto{}, err
	}

	articleDto := models.ArticleDto{
		ID:          article.ID,
		Title:       article.Title,
		Filename:    article.Filename,
		Description: article.Description,
		Body:        article.Body,
		CreatedAt:   article.CreatedAt.Format(time.RFC3339),
		UpdatedAt:   article.UpdatedAt.Format(time.RFC3339),
		Tags:        tags,
	}

	if article.ScheduledAt.Valid {
		articleDto.ScheduledAt = &article.ScheduledAt.Time
	} else {
		articleDto.ScheduledAt = nil
	}

	if article.PublishedAt.Valid {
		articleDto.PublishedAt = &article.PublishedAt.Time
	} else {
		articleDto.PublishedAt = nil
	}

	return articleDto, nil
}

func (a *ArticleService) DeleteArticle(id int64, ctx context.Context) error {
	return a.Queries.SetArticleDeleted(ctx, id)
}
