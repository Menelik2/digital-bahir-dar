-- Phase 8: Admin / moderator policies

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('admin', 'moderator')
  );
$$;

CREATE POLICY "Staff can update any place" ON places
  FOR UPDATE USING (public.is_staff());

CREATE POLICY "Staff can insert places" ON places
  FOR INSERT WITH CHECK (public.is_staff());

CREATE POLICY "Staff can update any review" ON reviews
  FOR UPDATE USING (public.is_staff());

CREATE POLICY "Staff can select all reviews" ON reviews
  FOR SELECT USING (public.is_staff() OR status = 'published' OR auth.uid() = user_id);

CREATE POLICY "Staff manage review reports" ON review_reports
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY "Staff manage all claims" ON place_claims
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY "Staff manage business profiles" ON business_profiles
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY "Staff can update profiles" ON profiles
  FOR UPDATE USING (public.is_staff());
