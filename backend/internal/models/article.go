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
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
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
	Tags        []string
}

type AdminArticleInfo struct {
	ID          int64      `json:"id"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	UpdatedAt   time.Time  `json:"updated_at"`
	PublishedAt *time.Time `json:"published_at"`
	ScheduledAt *time.Time `json:"scheduled_at"`
	Tags        []string   `json:"tags"`
}

type ArticleStats struct {
	ID        int64      `json:"id"`
	Views     int64      `json:"views"`
	FirstRead string     `json:"first_read"`
	LastRead  string     `json:"last_read"`
	AllReads  []ReadInfo `json:"all_reads"`
}

type ReadInfo struct {
	Timestamp string `json:"timestamp"`
	Reads     int64  `json:"reads"`
}
