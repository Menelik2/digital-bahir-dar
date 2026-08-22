-- Staff full CRUD visibility for moderation

CREATE POLICY "Staff can select all places" ON places
  FOR SELECT USING (public.is_staff());

CREATE POLICY "Staff can delete places" ON places
  FOR DELETE USING (public.is_staff());

CREATE POLICY "Staff can delete reviews" ON reviews
  FOR DELETE USING (public.is_staff());

-- Ensure staff_notes exists (idempotent)
ALTER TABLE places ADD COLUMN IF NOT EXISTS staff_notes text;
