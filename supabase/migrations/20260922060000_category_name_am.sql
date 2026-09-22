-- Optional Amharic label on categories for bilingual UI
ALTER TABLE categories ADD COLUMN IF NOT EXISTS name_am TEXT;
