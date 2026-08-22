-- Phase 3: City services tables

CREATE TABLE hotels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id UUID NOT NULL UNIQUE REFERENCES places(id) ON DELETE CASCADE,
  star_rating INT CHECK (star_rating BETWEEN 1 AND 5),
  minimum_price NUMERIC(12,2),
  maximum_price NUMERIC(12,2),
  amenities TEXT[] DEFAULT '{}',
  check_in TIME,
  check_out TIME,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id UUID NOT NULL UNIQUE REFERENCES places(id) ON DELETE CASCADE,
  cuisine_type TEXT,
  minimum_price NUMERIC(12,2),
  maximum_price NUMERIC(12,2),
  vegetarian BOOLEAN DEFAULT false,
  traditional_food BOOLEAN DEFAULT false,
  delivery_available BOOLEAN DEFAULT false,
  reservation_available BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE attractions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id UUID NOT NULL UNIQUE REFERENCES places(id) ON DELETE CASCADE,
  attraction_type TEXT,
  entrance_fee NUMERIC(12,2),
  recommended_duration TEXT,
  best_time_to_visit TEXT,
  historical_information TEXT,
  safety_information TEXT,
  accessibility TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE banks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id UUID NOT NULL UNIQUE REFERENCES places(id) ON DELETE CASCADE,
  bank_name TEXT,
  has_atm BOOLEAN DEFAULT false,
  has_foreign_exchange BOOLEAN DEFAULT false,
  is_atm_only BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE transport_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id UUID REFERENCES places(id) ON DELETE SET NULL,
  service_type TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  phone TEXT,
  estimated_price_min NUMERIC(12,2),
  estimated_price_max NUMERIC(12,2),
  currency TEXT DEFAULT 'ETB',
  price_label TEXT DEFAULT 'Estimated',
  route_description TEXT,
  verified BOOLEAN DEFAULT false,
  last_price_updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER hotels_updated_at BEFORE UPDATE ON hotels FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER restaurants_updated_at BEFORE UPDATE ON restaurants FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER attractions_updated_at BEFORE UPDATE ON attractions FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER banks_updated_at BEFORE UPDATE ON banks FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER transport_services_updated_at BEFORE UPDATE ON transport_services FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE attractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hotels public via published place" ON hotels FOR SELECT USING (
  EXISTS (SELECT 1 FROM places p WHERE p.id = place_id AND p.status = 'published' AND p.deleted_at IS NULL)
);
CREATE POLICY "Restaurants public via published place" ON restaurants FOR SELECT USING (
  EXISTS (SELECT 1 FROM places p WHERE p.id = place_id AND p.status = 'published' AND p.deleted_at IS NULL)
);
CREATE POLICY "Attractions public via published place" ON attractions FOR SELECT USING (
  EXISTS (SELECT 1 FROM places p WHERE p.id = place_id AND p.status = 'published' AND p.deleted_at IS NULL)
);
CREATE POLICY "Banks public via published place" ON banks FOR SELECT USING (
  EXISTS (SELECT 1 FROM places p WHERE p.id = place_id AND p.status = 'published' AND p.deleted_at IS NULL)
);
CREATE POLICY "Transport services public" ON transport_services FOR SELECT USING (true);
