-- Staff can manage categories and transport services from admin dashboard

CREATE POLICY "Staff manage categories" ON categories
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY "Staff manage transport services" ON transport_services
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY "Staff manage hotels" ON hotels
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY "Staff manage restaurants" ON restaurants
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY "Staff manage attractions" ON attractions
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY "Staff manage banks" ON banks
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());
