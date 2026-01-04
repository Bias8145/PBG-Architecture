-- Add gallery column to portfolio table to store multiple image URLs
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS gallery text[] DEFAULT '{}';

-- Migrate existing image_url data into the new gallery array so we don't lose anything
UPDATE portfolio 
SET gallery = ARRAY[image_url] 
WHERE image_url IS NOT NULL AND (gallery IS NULL OR gallery = '{}');
