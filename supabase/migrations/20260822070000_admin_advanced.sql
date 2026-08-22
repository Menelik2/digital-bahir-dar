-- Advanced admin: staff can list profiles for user management
CREATE POLICY "Staff can select all profiles" ON profiles
  FOR SELECT USING (public.is_staff() OR auth.uid() = id);

-- Optional staff notes on places (nullable text)
ALTER TABLE places ADD COLUMN IF NOT EXISTS staff_notes text;

COMMENT ON COLUMN places.staff_notes IS 'Internal moderation notes; staff only';
