package models

import "time"

type CreateArticle struct {
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Body        string   `json:"body"`
	Tags        []string `json:"tags"`
}

type ArticleDto struct {
	ID          int64      `json:"id"`
	Title       string     `json:"title"`
	Filename    string     `json:"-"`
	Description string     `json:"description"`
	Body        string     `json:"body"`
	CreatedAt   string     `json:"created_at"`
	UpdatedAt   string     `json:"updated_at"`
	ScheduledAt *time.Time `json:"scheduled_at"`
	PublishedAt *time.Time `json:"published_at"`
	Tags        []string   `json:"tags"`
}

type ArticleInfo struct {
	Filename    string
	Title       string
	Description string
	PublishedAt *time.Time
	UpdatedAt   time.Time
}
