-- DEMO seed data only — clearly marked for development
INSERT INTO categories (name, slug, icon, sort_order) VALUES
  ('Hotels', 'hotel', 'Hotel', 1),
  ('Restaurants', 'restaurant', 'UtensilsCrossed', 2),
  ('Cafes', 'cafe', 'Coffee', 3),
  ('Attractions', 'attraction', 'Landmark', 4),
  ('Banks', 'bank', 'Building2', 5),
  ('ATMs', 'atm', 'CreditCard', 6),
  ('Transport', 'transport', 'Bus', 7),
  ('Hospitals', 'hospital', 'Hospital', 8),
  ('Pharmacies', 'pharmacy', 'Pill', 9),
  ('Shopping', 'shopping', 'ShoppingBag', 10),
  ('Events', 'event', 'Calendar', 11),
  ('Emergency', 'emergency', 'AlertTriangle', 12)
ON CONFLICT (slug) DO NOTHING;
