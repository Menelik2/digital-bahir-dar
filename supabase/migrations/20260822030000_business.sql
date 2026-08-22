-- Phase 7: Business portal — profiles, claims, listing ownership

CREATE TABLE business_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  description TEXT,
  city TEXT DEFAULT 'Bahir Dar',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX business_profiles_user_idx ON business_profiles(user_id);

CREATE TABLE place_claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_profile_id UUID REFERENCES business_profiles(id) ON DELETE SET NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(place_id, user_id)
);

CREATE INDEX place_claims_user_idx ON place_claims(user_id);
CREATE INDEX place_claims_place_idx ON place_claims(place_id);

ALTER TABLE places ADD COLUMN IF NOT EXISTS owner_business_id UUID REFERENCES business_profiles(id) ON DELETE SET NULL;

CREATE TRIGGER business_profiles_updated_at BEFORE UPDATE ON business_profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE place_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own business profile" ON business_profiles
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Approved business profiles public read" ON business_profiles
  FOR SELECT USING (status = 'approved' OR auth.uid() = user_id);

CREATE POLICY "Users manage own claims" ON place_claims
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Business owners update own places" ON places
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM business_profiles bp
      WHERE bp.id = places.owner_business_id AND bp.user_id = auth.uid() AND bp.status = 'approved'
    )
  );
