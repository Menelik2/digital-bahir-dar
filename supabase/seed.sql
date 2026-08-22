-- Digital Bahir Dar — seed data for development
-- All place names include (DEMO) — never present as verified production data.

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

INSERT INTO places (
  name, slug, category_id, description, short_description,
  latitude, longitude, address, phone, status, verified
)
SELECT
  v.name, v.slug, c.id, v.description, v.short_description,
  v.lat, v.lng, v.address, v.phone, 'published', false
FROM (VALUES
  (
    'Lakeside View Hotel (DEMO)',
    'lakeside-view-hotel-demo',
    'hotel',
    'DEMO hotel near Lake Tana. Not a real booking listing — for UI testing only.',
    'DEMO lakeside stay',
    11.5980, 37.3850,
    'Bahir Dar lakeside (DEMO)',
    '+251 58 000 0001'
  ),
  (
    'Tana Traditional Restaurant (DEMO)',
    'tana-traditional-restaurant-demo',
    'restaurant',
    'DEMO restaurant serving injera and lake fish concepts. Prices and hours are fictional.',
    'DEMO Ethiopian cuisine',
    11.5920, 37.3780,
    'Near pier area (DEMO)',
    '+251 58 000 0002'
  ),
  (
    'Blue Nile Falls Viewpoint (DEMO)',
    'blue-nile-falls-viewpoint-demo',
    'attraction',
    'DEMO marker for Blue Nile Falls planning. Confirm access and conditions locally.',
    'DEMO day-trip attraction',
    11.4860, 37.5880,
    'Tis Abay area (DEMO)',
    NULL
  ),
  (
    'Lake Tana Boat Pier (DEMO)',
    'lake-tana-boat-pier-demo',
    'transport',
    'DEMO pier location for monastery boat trips. Book only with verified operators.',
    'DEMO boat departure area',
    11.6050, 37.3900,
    'Lake Tana shore (DEMO)',
    NULL
  ),
  (
    'Central Bank Branch (DEMO)',
    'central-bank-branch-demo',
    'bank',
    'DEMO bank/ATM marker for map filters. Not a real branch listing.',
    'DEMO banking',
    11.5935, 37.3615,
    'Bahir Dar center (DEMO)',
    '+251 58 000 0003'
  ),
  (
    'City Cafe (DEMO)',
    'city-cafe-demo',
    'cafe',
    'DEMO cafe for coffee-culture tips in the AI guide and map filters.',
    'DEMO coffee stop',
    11.5900, 37.3650,
    'Main road (DEMO)',
    NULL
  )
) AS v(name, slug, category, description, short_description, lat, lng, address, phone)
JOIN categories c ON c.slug = v.category
ON CONFLICT (slug) DO NOTHING;

INSERT INTO hotels (place_id, star_rating, check_in, check_out, amenities)
SELECT p.id, 3, '14:00', '11:00', ARRAY['WiFi','Breakfast']
FROM places p
WHERE p.slug = 'lakeside-view-hotel-demo'
  AND NOT EXISTS (SELECT 1 FROM hotels h WHERE h.place_id = p.id);

INSERT INTO restaurants (place_id, cuisine_type, traditional_food, vegetarian)
SELECT p.id, 'Ethiopian', true, true
FROM places p
WHERE p.slug = 'tana-traditional-restaurant-demo'
  AND NOT EXISTS (SELECT 1 FROM restaurants r WHERE r.place_id = p.id);

INSERT INTO attractions (place_id, attraction_type, recommended_duration, safety_information)
SELECT p.id, 'nature', 'Half day', 'DEMO: verify seasonal water levels and paths locally.'
FROM places p
WHERE p.slug = 'blue-nile-falls-viewpoint-demo'
  AND NOT EXISTS (SELECT 1 FROM attractions a WHERE a.place_id = p.id);

INSERT INTO banks (place_id, bank_name, has_atm, has_foreign_exchange)
SELECT p.id, 'DEMO Bank', true, true
FROM places p
WHERE p.slug = 'central-bank-branch-demo'
  AND NOT EXISTS (SELECT 1 FROM banks b WHERE b.place_id = p.id);
