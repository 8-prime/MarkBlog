package services

import (
	"backend/internal/database"
	"backend/internal/models"
	"backend/internal/utils"
	"context"
	"log"
	"os"
	"path"
	"time"
)

type PublishRequest struct {
	id          int64
	scheduledAt *time.Time
}

type Publisher interface {
	Publish(articleId int64, publishAt *time.Time)
	Unpublish(articleId int64) error
}

type PublisherService struct {
	queries        *database.Queries
	config         *models.Configuration
	requests       chan *PublishRequest
	articleService *ArticleService
	renderer       *RendererService
	timers         map[int64]*time.Timer
}

func NewPublisherService(queries *database.Queries, config *models.Configuration, articleService *ArticleService, renderer *RendererService) *PublisherService {
	service := &PublisherService{
		queries:        queries,
		config:         config,
		articleService: articleService,
		renderer:       renderer,
		requests:       make(chan *PublishRequest, 100),
		timers:         make(map[int64]*time.Timer),
	}
	go service.watchPublishRequests()
	return service
}

func (s *PublisherService) writeArticle(article *models.ArticleDto) error {
	articleFileName := path.Join(s.config.ArticlesDir, article.Filename+".html")
	err := os.MkdirAll(s.config.ArticlesDir, 0755)
	if err != nil {
		return err
	}
	file, err := os.Create(articleFileName)
	if err != nil {
		return err
	}
	defer file.Close()

	err = s.queries.PublishArticle(context.Background(), article.ID)
	if err != nil {
		return err
	}

	err = s.renderer.Render(*article, file)
	if err != nil {
		return err
	}

	return nil
}

func (s *PublisherService) watchPublishRequests() {
	ctx := context.Background()
	startup, err := s.queries.GetScheduledArticleTimes(ctx)
	if err != nil {
		log.Printf("Error getting scheduled articles: %v", err)
	} else {
		for _, article := range startup {
			s.requests <- &PublishRequest{
				id:          article.ID,
				scheduledAt: utils.TimeFromDb(article.ScheduledAt),
			}
		}
	}

	for {
		select {
		case req := <-s.requests:
			article, err := s.articleService.GetArticleDto(req.id, ctx)

			timer := s.timers[req.id]
			if timer != nil {
				timer.Stop()
				delete(s.timers, req.id)
			}

			if err != nil {
				log.Printf("Error getting article %d: %v", req.id, err)
				continue
			}
			if article.ScheduledAt == nil {
				log.Printf("Article %d has no scheduled time, skipping", req.id)
				continue
			}

			if article.ScheduledAt.Before(time.Now()) {
				log.Printf("Publishing article %d immediately", req.id)
				s.writeArticle(&article)
			} else {
				duration := time.Until(*article.ScheduledAt)
				s.timers[req.id] = time.AfterFunc(duration, func() {
					err := s.writeArticle(&article)
					if err != nil {
						log.Printf("Error publishing article %d: %v", req.id, err)
					}
					delete(s.timers, req.id)
				})
			}
		}
	}
}

func (s *PublisherService) Publish(articleId int64, publishAt *time.Time) {
	s.requests <- &PublishRequest{
		id:          articleId,
		scheduledAt: publishAt,
	}
}

func (s *PublisherService) Unpublish(articleId int64) error {
	timer := s.timers[articleId]
	if timer != nil {
		timer.Stop()
		delete(s.timers, articleId)
	}
	title, err := s.queries.GetArticleTitle(context.Background(), articleId)
	if err != nil {
		return err
	}
	articleFileName := path.Join(s.config.ArticlesDir, title+".html")
	err = os.Remove(articleFileName)
	if os.IsNotExist(err) {
		return nil
	}
	return err
}
