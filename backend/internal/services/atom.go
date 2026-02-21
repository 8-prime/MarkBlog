package services

import (
	"backend/internal/database"
	"backend/internal/models"
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/gorilla/feeds"
)

type AtomService struct {
	queries  *database.Queries
	config   *models.Configuration
	generate chan struct{}
}

func NewAtomService(queries *database.Queries, config *models.Configuration) *AtomService {
	s := &AtomService{
		queries:  queries,
		config:   config,
		generate: make(chan struct{}, 1),
	}
	go s.loop()
	return s
}

// Generate signals the background goroutine to regenerate the feed.
// If a generation is already queued, the signal is dropped — the pending
// run will include the latest state.
func (s *AtomService) Generate() {
	select {
	case s.generate <- struct{}{}:
	default:
	}
}

func (s *AtomService) loop() {
	for range s.generate {
		if err := s.write(); err != nil {
			log.Printf("atom: generate error: %v", err)
		}
	}
}

func (s *AtomService) write() error {
	ctx := context.Background()
	rows, err := s.queries.GetPublishedArticleInfos(ctx, database.GetPublishedArticleInfosParams{
		Limit: 50, Offset: 0,
	})
	if err != nil {
		return fmt.Errorf("querying articles: %w", err)
	}

	items := make([]*feeds.Item, 0, len(rows))
	for _, row := range rows {
		if !row.PublishedAt.Valid {
			continue
		}
		url := fmt.Sprintf("%s/articles/%s", s.config.HostingUrl, row.Filename)
		items = append(items, &feeds.Item{
			Title:       row.Title,
			Link:        &feeds.Link{Href: url},
			Description: row.Description,
			Author:      &feeds.Author{Name: s.config.AuthorName},
			Created:     row.PublishedAt.Time,
			Updated:     row.UpdatedAt,
			Id:          url,
		})
	}

	feed := &feeds.Feed{
		Title:       s.config.AuthorName,
		Link:        &feeds.Link{Href: s.config.HostingUrl},
		Description: fmt.Sprintf("%s — blog", s.config.AuthorName),
		Author:      &feeds.Author{Name: s.config.AuthorName},
		Created:     time.Now(),
		Items:       items,
	}

	atom, err := feed.ToAtom()
	if err != nil {
		return fmt.Errorf("generating feed: %w", err)
	}

	if err := os.MkdirAll(filepath.Dir(s.config.AtomFilePath), 0755); err != nil {
		return fmt.Errorf("mkdir: %w", err)
	}

	// Write to a temp file then rename so the HTTP handler never reads
	// a partially-written file.
	tmp := s.config.AtomFilePath + ".tmp"
	if err := os.WriteFile(tmp, []byte(atom), 0644); err != nil {
		return fmt.Errorf("writing tmp: %w", err)
	}
	if err := os.Rename(tmp, s.config.AtomFilePath); err != nil {
		os.Remove(tmp)
		return fmt.Errorf("rename: %w", err)
	}

	log.Printf("Atom feed regenerated (%d items)", len(items))
	return nil
}
