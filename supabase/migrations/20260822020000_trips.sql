-- Phase 5: Trips, itinerary, expenses

CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  traveler_count INT NOT NULL DEFAULT 1 CHECK (traveler_count >= 1),
  budget_total NUMERIC(14,2),
  currency TEXT NOT NULL DEFAULT 'ETB',
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'archived')),
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX trips_user_idx ON trips(user_id);

CREATE TABLE trip_days (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  day_number INT NOT NULL CHECK (day_number >= 1),
  date DATE,
  title TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(trip_id, day_number)
);

CREATE TABLE trip_stops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_day_id UUID NOT NULL REFERENCES trip_days(id) ON DELETE CASCADE,
  place_id UUID REFERENCES places(id) ON DELETE SET NULL,
  custom_name TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  start_time TIME,
  end_time TIME,
  notes TEXT,
  estimated_cost NUMERIC(12,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX trip_stops_day_idx ON trip_stops(trip_day_id);

CREATE TABLE trip_expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'ETB',
  expense_date DATE,
  notes TEXT,
  is_estimated BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX trip_expenses_trip_idx ON trip_expenses(trip_id);

CREATE TRIGGER trips_updated_at BEFORE UPDATE ON trips FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trip_expenses_updated_at BEFORE UPDATE ON trip_expenses FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own trips" ON trips FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public trips readable" ON trips FOR SELECT USING (is_public = true);

CREATE POLICY "Users manage own trip days" ON trip_days FOR ALL USING (
  EXISTS (SELECT 1 FROM trips t WHERE t.id = trip_id AND t.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM trips t WHERE t.id = trip_id AND t.user_id = auth.uid())
);

CREATE POLICY "Users manage own trip stops" ON trip_stops FOR ALL USING (
  EXISTS (
    SELECT 1 FROM trip_days d JOIN trips t ON t.id = d.trip_id
    WHERE d.id = trip_day_id AND t.user_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM trip_days d JOIN trips t ON t.id = d.trip_id
    WHERE d.id = trip_day_id AND t.user_id = auth.uid()
  )
);

CREATE POLICY "Users manage own trip expenses" ON trip_expenses FOR ALL USING (
  EXISTS (SELECT 1 FROM trips t WHERE t.id = trip_id AND t.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM trips t WHERE t.id = trip_id AND t.user_id = auth.uid())
);
