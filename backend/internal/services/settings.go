package services

import (
	"backend/internal/database"
	"context"
	"strconv"
	"time"
)

type SettingsService struct {
	queries *database.Queries
}

func NewSettingsService(queries *database.Queries) *SettingsService {
	return &SettingsService{queries: queries}
}

func (s *SettingsService) GetTheme(ctx context.Context) (string, error) {
	theme, err := s.queries.GetSetting(ctx, "theme")
	if err != nil {
		return "terminal", nil
	}
	return theme, nil
}

func (s *SettingsService) GetThemeVersion(ctx context.Context) (string, error) {
	version, err := s.queries.GetSetting(ctx, "theme_version")
	if err != nil {
		return "0", nil
	}
	return version, nil
}

func (s *SettingsService) SetTheme(ctx context.Context, theme string) error {
	err := s.queries.SetSetting(ctx, database.SetSettingParams{
		Key:   "theme",
		Value: theme,
	})
	if err != nil {
		return err
	}
	version := strconv.FormatInt(time.Now().Unix(), 10)
	return s.queries.SetSetting(ctx, database.SetSettingParams{
		Key:   "theme_version",
		Value: version,
	})
}
