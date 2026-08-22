-- Tighten staff profile updates: staff may update others only for role/name fields via app;
-- still use is_staff(). Document that role changes should be rare.
-- Prevent anonymous profile inserts (profiles created only by auth trigger).

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Note: PostGIS is required by 20260821000000_init.sql.
-- On Supabase: Database → Extensions → enable "postgis" if migration fails.
