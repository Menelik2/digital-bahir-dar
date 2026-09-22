-- Staff full CRUD on trips (moderation + template management)

CREATE POLICY "Staff select all trips" ON trips
  FOR SELECT USING (public.is_staff());

CREATE POLICY "Staff insert trips" ON trips
  FOR INSERT WITH CHECK (public.is_staff());

CREATE POLICY "Staff update trips" ON trips
  FOR UPDATE USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY "Staff delete trips" ON trips
  FOR DELETE USING (public.is_staff());

CREATE POLICY "Staff manage trip_days" ON trip_days
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY "Staff manage trip_stops" ON trip_stops
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY "Staff manage trip_expenses" ON trip_expenses
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());
