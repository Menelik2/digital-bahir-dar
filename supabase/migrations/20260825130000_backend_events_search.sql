-- A) City events (production content pipeline)
CREATE TABLE IF NOT EXISTS city_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  title_am TEXT,
  date_label TEXT NOT NULL,
  time_label TEXT,
  venue TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('culture', 'music', 'market', 'sports', 'community', 'seasonal')),
  description TEXT NOT NULL,
  price_label TEXT NOT NULL DEFAULT 'Check locally',
  featured BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  sort_order INT NOT NULL DEFAULT 0,
  starts_on DATE,
  ends_on DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS city_events_status_idx ON city_events(status);
CREATE INDEX IF NOT EXISTS city_events_featured_idx ON city_events(featured) WHERE status = 'published';

CREATE TRIGGER city_events_updated_at
  BEFORE UPDATE ON city_events
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE city_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published events are public" ON city_events
  FOR SELECT USING (status = 'published' OR public.is_staff());

CREATE POLICY "Staff manage events" ON city_events
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

-- Seed curated events (idempotent by title)
INSERT INTO city_events (title, title_am, date_label, time_label, venue, category, description, price_label, featured, sort_order)
SELECT v.title, v.title_am, v.date_label, v.time_label, v.venue, v.category, v.description, v.price_label, v.featured, v.sort_order
FROM (VALUES
  ('Lake Tana Cultural Evening', 'የጣና ሐይቅ ባህላዊ ምሽት', 'Often Saturdays (seasonal)', '18:00 – 21:00', 'Lakeside hotels & cultural venues', 'culture',
   'Music, coffee ceremony, and traditional dance evenings are common by the lake. Ask your hotel for this week’s venue — schedules change by season and holidays.',
   'Often free entry · food/drink extra', true, 1),
  ('Central Market mornings', NULL, 'Daily · busiest morning', '07:00 – 14:00', 'Bahir Dar central market area', 'market',
   'Produce, spices, coffee, textiles, and household goods. Go early for selection. Keep bags closed; agree prices calmly before paying.',
   'Free to browse', true, 2),
  ('Timket (Epiphany)', NULL, 'January (Ethiopian calendar · ~19 Jan Gregorian often)', NULL, 'City-wide · churches & processions', 'seasonal',
   'Major religious festival with processions and crowded streets. Book lodging early; dress modestly near churches; expect transport delays.',
   'Public celebrations', false, 3),
  ('Meskel (Finding of the True Cross)', NULL, 'September (Ethiopian calendar)', NULL, 'Public squares & church compounds', 'seasonal',
   'Bonfires (demera) and community gatherings. Confirm exact public sites with locals or hotel staff each year.',
   'Public', false, 4),
  ('Lakeside morning walks', NULL, 'Daily', 'Before 09:00 recommended', 'Lake Tana shore / promenade areas', 'sports',
   'Locals and visitors walk or jog along the lake before heat builds. Stay alert where paths meet roads or boat traffic.',
   'Free', false, 5),
  ('Weekend hotel live music', NULL, 'Fri – Sat evenings', NULL, 'Selected hotels & restaurants', 'music',
   'Some hotels host bands on weekends. Ask reception for the current schedule — not every venue performs every week.',
   'Entry often free · consume on-site', false, 6)
) AS v(title, title_am, date_label, time_label, venue, category, description, price_label, featured, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM city_events e WHERE e.title = v.title);

-- C) Server search: full-text-ish search across places
CREATE OR REPLACE FUNCTION public.search_places(q text, lim int DEFAULT 20)
RETURNS SETOF places
LANGUAGE sql
STABLE
SECURITY INVOKER
AS $$
  SELECT p.*
  FROM places p
  WHERE p.deleted_at IS NULL
    AND p.status = 'published'
    AND (
      q IS NULL OR length(trim(q)) = 0
      OR p.name ILIKE '%' || trim(q) || '%'
      OR COALESCE(p.address, '') ILIKE '%' || trim(q) || '%'
      OR COALESCE(p.short_description, '') ILIKE '%' || trim(q) || '%'
      OR COALESCE(p.description, '') ILIKE '%' || trim(q) || '%'
      OR p.slug ILIKE '%' || trim(q) || '%'
    )
  ORDER BY
    CASE WHEN p.name ILIKE trim(q) || '%' THEN 0
         WHEN p.name ILIKE '%' || trim(q) || '%' THEN 1
         ELSE 2 END,
    p.featured DESC,
    p.verified DESC,
    p.name
  LIMIT GREATEST(1, LEAST(COALESCE(lim, 20), 50));
$$;

GRANT EXECUTE ON FUNCTION public.search_places(text, int) TO anon, authenticated;

-- Recommendations: featured + verified published places
CREATE OR REPLACE FUNCTION public.recommend_places(lim int DEFAULT 12)
RETURNS SETOF places
LANGUAGE sql
STABLE
SECURITY INVOKER
AS $$
  SELECT p.*
  FROM places p
  WHERE p.deleted_at IS NULL AND p.status = 'published'
  ORDER BY p.featured DESC, p.verified DESC, p.updated_at DESC
  LIMIT GREATEST(1, LEAST(COALESCE(lim, 12), 30));
$$;

GRANT EXECUTE ON FUNCTION public.recommend_places(int) TO anon, authenticated;
