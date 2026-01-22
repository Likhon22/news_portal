package storage

import (
	"context"

	"news-portal-backend/internal/core/port"
)

func (a *Adapter) CountNews(ctx context.Context) (int64, error) {
	var count int64
	err := a.db.QueryRow(ctx, "SELECT COUNT(*) FROM news").Scan(&count)
	return count, err
}

func (a *Adapter) CountTotalViews(ctx context.Context) (int64, error) {
	var totalViews int64
	// Handle NULL sum by COALESCE just in case, though views_count is int not null default 0
	err := a.db.QueryRow(ctx, "SELECT COALESCE(SUM(views_count), 0) FROM news").Scan(&totalViews)
	return totalViews, err
}

func (a *Adapter) CountCategories(ctx context.Context) (int64, error) {
	var count int64
	err := a.db.QueryRow(ctx, "SELECT COUNT(*) FROM categories").Scan(&count)
	return count, err
}

func (a *Adapter) GetCategoryViewStats(ctx context.Context) ([]port.CategoryViewStat, error) {
	query := `
		SELECT c.name, COALESCE(SUM(n.views_count), 0) as value
		FROM categories c
		LEFT JOIN news n ON c.id = n.category_id
		GROUP BY c.name
		HAVING COALESCE(SUM(n.views_count), 0) > 0
		ORDER BY value DESC
	`
	rows, err := a.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var stats []port.CategoryViewStat
	for rows.Next() {
		var s port.CategoryViewStat
		if err := rows.Scan(&s.Name, &s.Value); err != nil {
			return nil, err
		}
		stats = append(stats, s)
	}
	return stats, nil
}

func (a *Adapter) GetMonthlyTopNews(ctx context.Context, limit int) ([]port.NewsViewStat, error) {
	query := `
		SELECT title, views_count
		FROM news
		WHERE published_at >= NOW() - INTERVAL '30 days'
		ORDER BY views_count DESC
		LIMIT $1
	`
	rows, err := a.db.Query(ctx, query, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var stats []port.NewsViewStat
	for rows.Next() {
		var s port.NewsViewStat
		if err := rows.Scan(&s.Title, &s.Views); err != nil {
			return nil, err
		}
		stats = append(stats, s)
	}
	return stats, nil
}
