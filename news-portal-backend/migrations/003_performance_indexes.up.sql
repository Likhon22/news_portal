-- Composite index for fast category listing with sorting
CREATE INDEX IF NOT EXISTS idx_news_category_status_published_at ON news(category_id, status, published_at DESC);

-- Index for popular news sorting if not already present
CREATE INDEX IF NOT EXISTS idx_news_views_published_at ON news(views_count DESC, published_at DESC);
