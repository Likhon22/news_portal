package service

import (
	"context"
	"fmt"
	"regexp"
	"strings"
	"time"

	"news-portal-backend/internal/core/domain"
	"news-portal-backend/internal/core/port"

	"github.com/google/uuid"
	"github.com/microcosm-cc/bluemonday"
)

type NewsService struct {
	repo         port.NewsRepository
	categoryRepo port.CategoryRepository
	p            *bluemonday.Policy
}

func NewNewsService(repo port.NewsRepository, categoryRepo port.CategoryRepository) *NewsService {
	p := bluemonday.UGCPolicy()
	// Allow TipTap alignment classes and the tiptap class itself
	p.AllowAttrs("class").Matching(regexp.MustCompile(`^(text-align-(left|center|right|justify)|tiptap)$`)).OnElements("p", "h1", "h2", "h3", "h4", "h5", "h6", "div", "span")
	// Allow inline styles for colors
	p.AllowAttrs("style").OnElements("span", "p", "h1", "h2", "h3", "h4", "h5", "h6")

	return &NewsService{
		repo:         repo,
		categoryRepo: categoryRepo,
		p:            p,
	}
}

func (s *NewsService) CreateNews(ctx context.Context, authorID, categoryID uuid.UUID, title, excerpt, content, thumbnail string, isFeatured bool) (*domain.News, error) {
	slug := generateSlug(title)
	sanitizedContent := s.p.Sanitize(content)

	news := &domain.News{
		AuthorID:   authorID,
		CategoryID: categoryID,
		Title:      title,
		Excerpt:    &excerpt,
		Content:    sanitizedContent,
		Thumbnail:  thumbnail,
		Slug:       slug,
		IsFeatured: isFeatured,
	}
	return s.repo.CreateNews(ctx, news)
}

func (s *NewsService) UpdateNews(ctx context.Context, id uuid.UUID, categoryID uuid.UUID, title, excerpt, content, thumbnail string, isFeatured bool) error {
	sanitizedContent := s.p.Sanitize(content)
	news := &domain.News{
		ID:         id,
		CategoryID: categoryID,
		Title:      title,
		Excerpt:    &excerpt,
		Content:    sanitizedContent,
		Thumbnail:  thumbnail,
		IsFeatured: isFeatured,
	}
	return s.repo.UpdateNews(ctx, news)
}

func (s *NewsService) DeleteNews(ctx context.Context, id uuid.UUID) error {
	return s.repo.DeleteNews(ctx, id)
}

func (s *NewsService) GetNewsBySlug(ctx context.Context, slug string) (*domain.News, error) {
	news, err := s.repo.GetNewsBySlug(ctx, slug)
	if err != nil {
		return nil, err
	}
	if news != nil {
		// Increment views in background
		go func() {
			_ = s.repo.IncrementNewsViews(context.Background(), slug)
		}()
	}
	return news, nil
}

func (s *NewsService) ListNews(ctx context.Context, page, limit int32, categorySlug string, sortBy string, isFeatured *bool) ([]*domain.News, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	offset := (page - 1) * limit

	var categoryID *uuid.UUID
	if categorySlug != "" {
		cat, err := s.categoryRepo.GetCategoryBySlug(ctx, categorySlug)
		if err != nil {
			return nil, err
		}
		if cat != nil {
			categoryID = &cat.ID
		}
	}

	return s.repo.ListNews(ctx, limit, offset, categoryID, sortBy, isFeatured)
}

func (s *NewsService) CheckSlug(ctx context.Context, slug string) (bool, error) {
	return s.repo.CheckSlugExists(ctx, slug)
}

func (s *NewsService) GetHomepageData(ctx context.Context) (*port.HomepageData, error) {
	// 1. Fetch Featured News (Limit 1)
	isFeatured := true
	featuredList, err := s.repo.ListNews(ctx, 1, 0, nil, "latest", &isFeatured)
	if err != nil {
		return nil, err
	}

	var featured *domain.News
	var featuredID uuid.UUID
	if len(featuredList) > 0 {
		featured = featuredList[0]
		featuredID = featured.ID
	}

	// 2. Fetch Latest News (Limit 21 - fetching one extra in case we filter out featured)
	latestList, err := s.repo.ListNews(ctx, 21, 0, nil, "latest", nil)
	if err != nil {
		return nil, err
	}

	// Filter out Featured from Latest
	var latest []*domain.News
	count := 0
	for _, news := range latestList {
		if news.ID != featuredID {
			latest = append(latest, news)
			count++
			if count >= 20 { // We want 20 latest news
				break
			}
		}
	}

	// 3. Fetch Popular News (Limit 6 - fetching one extra for filter)
	popularList, err := s.repo.ListNews(ctx, 6, 0, nil, "popular", nil)
	if err != nil {
		return nil, err
	}

	// Filter out Featured from Popular
	var popular []*domain.News
	count = 0
	for _, news := range popularList {
		if news.ID != featuredID {
			popular = append(popular, news)
			count++
			if count >= 5 { // We want 5 popular news
				break
			}
		}
	}

	return &port.HomepageData{
		Featured: featured,
		Latest:   latest,
		Popular:  popular,
	}, nil
}

func generateSlug(title string) string {
	slug := strings.ToLower(title)
	slug = strings.ReplaceAll(slug, " ", "-")
	return fmt.Sprintf("%s-%d", slug, time.Now().Unix())
}

// Category Service

type CategoryService struct {
	repo port.CategoryRepository
}

func NewCategoryService(repo port.CategoryRepository) *CategoryService {
	return &CategoryService{repo: repo}
}

func (s *CategoryService) ListCategories(ctx context.Context) ([]*domain.Category, error) {
	return s.repo.ListCategories(ctx)
}
