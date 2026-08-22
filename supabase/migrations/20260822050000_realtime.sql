-- Enable Supabase Realtime for core Digital Bahir Dar tables
-- Run after previous migrations. Safe to re-run (guards on publication membership).

DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'places',
    'reviews',
    'favorites',
    'trips',
    'trip_days',
    'trip_stops',
    'trip_expenses',
    'place_claims',
    'business_profiles',
    'review_reports',
    'categories',
    'profiles'
  ];
BEGIN
  FOREACH t IN ARRAY tables
  LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = t
    ) AND NOT EXISTS (
      SELECT 1
      FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = t
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t);
    END IF;
  END LOOP;
END $$;

-- Replica identity FULL helps DELETE/UPDATE payloads include old row data when needed
ALTER TABLE IF EXISTS public.places REPLICA IDENTITY FULL;
ALTER TABLE IF EXISTS public.reviews REPLICA IDENTITY FULL;
ALTER TABLE IF EXISTS public.favorites REPLICA IDENTITY FULL;
ALTER TABLE IF EXISTS public.trips REPLICA IDENTITY FULL;
ALTER TABLE IF EXISTS public.trip_days REPLICA IDENTITY FULL;
ALTER TABLE IF EXISTS public.trip_stops REPLICA IDENTITY FULL;
ALTER TABLE IF EXISTS public.trip_expenses REPLICA IDENTITY FULL;
ALTER TABLE IF EXISTS public.place_claims REPLICA IDENTITY FULL;
ALTER TABLE IF EXISTS public.business_profiles REPLICA IDENTITY FULL;
ALTER TABLE IF EXISTS public.review_reports REPLICA IDENTITY FULL;
