-- Add excerpt column to news table
ALTER TABLE news ADD COLUMN excerpt TEXT;

-- Add is_featured column to mark "Big News" for the hero section
ALTER TABLE news ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;

-- Add category_id column if not exists (it was in the initial schema but let's be sure or handle any missing links)
-- Actually, let's check the initial schema again. It had category_id.
-- Check if we need to add indexing for views_count
CREATE INDEX IF NOT EXISTS idx_news_views_count ON news(views_count DESC);

-- Ensure categories table has required fields for frontend
-- Initial schema: id, name, slug, description, created_at
-- Frontend needs: name (with bn/en support)
-- The current schema has name VARCHAR(100). We might want to keep it simple or use JSON for multi-lang.
-- Given the current setup, let's keep it simple or add a name_bn if needed.
-- But the user wants "good" things, so let's use a JSONB field for localized names or just add name_bn.
ALTER TABLE categories ADD COLUMN IF NOT EXISTS name_bn VARCHAR(100);

-- Update news table to make sure it's ready for HTML
-- The content column is already TEXT, which is fine for HTML.
