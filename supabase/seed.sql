-- Digital Bahir Dar — expanded seed data for development / demo
-- Real landmarks use approximate public coordinates.
-- Commercial names with (DEMO) are fictional UI fixtures — not live bookings.
-- Prices & phones are planning estimates only. verified = false unless noted.

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

-- ========== PLACES ==========
INSERT INTO places (
  name, slug, category_id, description, short_description,
  latitude, longitude, address, phone, website,
  price_level, entrance_fee, currency, status, verified, featured
)
SELECT
  v.name, v.slug, c.id, v.description, v.short_description,
  v.lat, v.lng, v.address, v.phone, v.website,
  v.price_level, v.entrance_fee, 'ETB', 'published', v.verified, v.featured
FROM (VALUES
  -- —— Attractions (well-known landmarks) ——
  (
    'Lake Tana',
    'lake-tana',
    'attraction',
    'Ethiopia’s largest lake and source of the Blue Nile. Boat trips to island monasteries leave from the Bahir Dar shore. Shared half-day boats often 800–5000 ETB; private charters higher. Agree price before boarding.',
    'Largest lake in Ethiopia · monasteries',
    11.6167, 37.4000,
    'Lake Tana, Bahir Dar',
    NULL, NULL,
    2, 200::numeric, false, true
  ),
  (
    'Blue Nile Falls (Tis Issat)',
    'blue-nile-falls-tis-issat',
    'attraction',
    '“Smoking water” falls near Tis Abay, about 30 km from Bahir Dar. Entry often 50–300 ETB; optional guide ~300–1500 ETB/group; private car round trip ~800–3500 ETB. Best flow after rainy season. Confirm fees on site.',
    'Tis Issat · day trip from Bahir Dar',
    11.4890, 37.5870,
    'Tis Abay / Tis Issat, near Bahir Dar',
    NULL, NULL,
    2, 200::numeric, false, true
  ),
  (
    'Bezawit Palace Viewpoint',
    'bezawit-palace-viewpoint',
    'attraction',
    'Hilltop viewpoint over the Blue Nile outlet and Lake Tana. Often free or a small fee. Good sunrise/sunset photos. Paths can be steep.',
    'City viewpoint · Nile outlet',
    11.6015, 37.4025,
    'Bezawit Hill, Bahir Dar',
    NULL, NULL,
    1, 50::numeric, false, true
  ),
  (
    'Ura Kidane Mehret Monastery',
    'ura-kidane-mehret',
    'attraction',
    'Famous Lake Tana island monastery (Zege peninsula area) known for murals and circular church architecture. Boat + entry fees apply; modest dress required. Typical monastery entry ~100–400 ETB.',
    'Lake Tana monastery · murals',
    11.6950, 37.3350,
    'Zege / Lake Tana islands',
    NULL, NULL,
    2, 200::numeric, false, true
  ),
  (
    'Debre Maryam Monastery',
    'debre-maryam-monastery',
    'attraction',
    'Island monastery on Lake Tana, reachable by boat from Bahir Dar. Historic church site; entry and boat costs separate. Confirm operator and opening times locally.',
    'Island monastery · boat access',
    11.6300, 37.4100,
    'Lake Tana, near Bahir Dar',
    NULL, NULL,
    2, 200::numeric, false, false
  ),
  (
    'Azwa Maryam Monastery',
    'azwa-maryam-monastery',
    'attraction',
    'Lake Tana monastery often combined with Zege peninsula boat tours. Expect boat charter plus per-monastery entry. Research modest clothing customs.',
    'Zege peninsula monastery',
    11.7100, 37.3200,
    'Zege / Lake Tana',
    NULL, NULL,
    2, 200::numeric, false, false
  ),
  (
    'Bahir Dar University Main Campus',
    'bahir-dar-university',
    'attraction',
    'Major public university campus in Bahir Dar. Landmark for orientation and local life. Campus access rules may apply for visitors.',
    'University campus landmark',
    11.5740, 37.3610,
    'Bahir Dar University, Bahir Dar',
    NULL, 'https://www.bdu.edu.et',
    NULL, 0::numeric, false, false
  ),
  (
    'Martyrs Memorial Monument',
    'martyrs-memorial-bahir-dar',
    'attraction',
    'City memorial and orientation landmark in Bahir Dar. Useful meeting point; check local events around the site.',
    'City memorial landmark',
    11.5930, 37.3905,
    'Bahir Dar center',
    NULL, NULL,
    1, 0::numeric, false, false
  ),
  (
    'Blue Nile Bridge / Outlet',
    'blue-nile-bridge-outlet',
    'attraction',
    'Where Lake Tana feeds the Blue Nile. Popular photo stop near town. Combine with Bezawit viewpoint for a short outing.',
    'Nile outlet · photo stop',
    11.6050, 37.4050,
    'Blue Nile outlet, Bahir Dar',
    NULL, NULL,
    1, 0::numeric, false, true
  ),
  (
    'Bahir Dar Central Market',
    'bahir-dar-central-market',
    'shopping',
    'Busy local market for produce, spices, coffee, and household goods. Good for atmosphere and small souvenirs. Watch belongings in crowds; bargain politely.',
    'Local market · produce & crafts',
    11.5925, 37.3880,
    'Central Bahir Dar',
    NULL, NULL,
    1, 0::numeric, false, true
  ),

  -- —— Hotels (DEMO commercial fixtures) ——
  (
    'Lakeside View Hotel (DEMO)',
    'lakeside-view-hotel-demo',
    'hotel',
    'DEMO mid-range lakeside-style stay for UI testing. Typical research band ~4000–9000 ETB/night. Not a real booking listing.',
    'DEMO lakeside stay',
    11.5980, 37.3850,
    'Bahir Dar lakeside (DEMO)',
    '+251 58 000 0001', NULL,
    3, NULL, false, true
  ),
  (
    'Kuriftu-Style Resort Example (DEMO)',
    'kuriftu-style-resort-demo',
    'hotel',
    'DEMO comfort / lakeside resort-class placeholder. Research band often 8000–25000+ ETB/night for this tier. Not affiliated with any brand.',
    'DEMO resort-class example',
    11.6100, 37.3750,
    'Lake shore road (DEMO)',
    NULL, NULL,
    4, NULL, false, true
  ),
  (
    'City Center Guesthouse (DEMO)',
    'city-center-guesthouse-demo',
    'hotel',
    'DEMO budget guesthouse. Typical 1500–4000 ETB/night. For map filters and trip planner tests only.',
    'DEMO budget stay',
    11.5910, 37.3920,
    'Central Bahir Dar (DEMO)',
    '+251 58 000 0010', NULL,
    1, NULL, false, false
  ),
  (
    'Papyrus Hotel Example (DEMO)',
    'papyrus-hotel-demo',
    'hotel',
    'DEMO mid hotel near the lake promenade concept. Price band ~4000–9000 ETB/night. Fictional listing.',
    'DEMO mid hotel',
    11.5995, 37.3810,
    'Near lake promenade (DEMO)',
    NULL, NULL,
    3, NULL, false, false
  ),
  (
    'Airport Road Inn (DEMO)',
    'airport-road-inn-demo',
    'hotel',
    'DEMO simple inn toward the airport corridor. Budget–mid band. Not a real property.',
    'DEMO airport-area inn',
    11.5650, 37.3200,
    'Airport road area (DEMO)',
    NULL, NULL,
    2, NULL, false, false
  ),

  -- —— Restaurants & cafes (DEMO) ——
  (
    'Tana Traditional Restaurant (DEMO)',
    'tana-traditional-restaurant-demo',
    'restaurant',
    'DEMO Ethiopian kitchen (injera, tibs, shiro). Plates often 80–400 ETB in this city band. Hours and menu are fictional.',
    'DEMO injera & traditional dishes',
    11.5920, 37.3780,
    'Near pier area (DEMO)',
    '+251 58 000 0002', NULL,
    2, NULL, false, true
  ),
  (
    'Lake Fish Grill (DEMO)',
    'lake-fish-grill-demo',
    'restaurant',
    'DEMO lakeside fish restaurant concept (tilapia / Nile fish). Mains often 180–500 ETB. Not a real venue.',
    'DEMO lake fish',
    11.6005, 37.3825,
    'Lakeside (DEMO)',
    NULL, NULL,
    2, NULL, false, true
  ),
  (
    'Abay Family Kitchen (DEMO)',
    'abay-family-kitchen-demo',
    'restaurant',
    'DEMO family-style local eatery. Budget plates 50–200 ETB typical of local houses. Fictional name.',
    'DEMO local eatery',
    11.5890, 37.3950,
    'Inner city (DEMO)',
    NULL, NULL,
    1, NULL, false, false
  ),
  (
    'City Cafe (DEMO)',
    'city-cafe-demo',
    'cafe',
    'DEMO coffee stop for coffee-culture tips. Coffee often 30–80 ETB. Fictional listing.',
    'DEMO coffee stop',
    11.5900, 37.3650,
    'Main road (DEMO)',
    NULL, NULL,
    1, NULL, false, true
  ),
  (
    'Zege Coffee House (DEMO)',
    'zege-coffee-house-demo',
    'cafe',
    'DEMO café themed around Zege coffee stories. Espresso/macchiato style pricing varies. Not a real shop.',
    'DEMO specialty coffee',
    11.5945, 37.3870,
    'Center (DEMO)',
    NULL, NULL,
    2, NULL, false, false
  ),

  -- —— Banks / ATMs ——
  (
    'Commercial Bank Branch (DEMO)',
    'cbe-branch-demo',
    'bank',
    'DEMO bank branch marker for filters and map pins. Not an official CBE listing.',
    'DEMO bank branch',
    11.5935, 37.3615,
    'Bahir Dar center (DEMO)',
    '+251 58 000 0003', NULL,
    NULL, NULL, false, false
  ),
  (
    'Dashen Bank ATM (DEMO)',
    'dashen-atm-center-demo',
    'atm',
    'DEMO ATM pin for city-center cash access planning. Availability not guaranteed.',
    'DEMO ATM',
    11.5940, 37.3900,
    'City center (DEMO)',
    NULL, NULL,
    NULL, NULL, false, false
  ),
  (
    'Bank of Abyssinia Branch (DEMO)',
    'boa-branch-demo',
    'bank',
    'DEMO branch with FX concept for travelers changing currency. Verify real branches on site.',
    'DEMO bank + FX',
    11.5915, 37.3865,
    'Main street (DEMO)',
    NULL, NULL,
    NULL, NULL, false, false
  ),

  -- —— Transport ——
  (
    'Lake Tana Boat Pier',
    'lake-tana-boat-pier',
    'transport',
    'Main shore area for monastery and island boats. Negotiate shared vs private boats; use known operators when possible. Prices change by season and group size.',
    'Boat departure area',
    11.6050, 37.3900,
    'Lake Tana shore, Bahir Dar',
    NULL, NULL,
    2, NULL, false, true
  ),
  (
    'Bahir Dar Bus Station',
    'bahir-dar-bus-station',
    'transport',
    'Intercity and regional buses (Addis, Gondar, etc.). Arrive early; keep tickets and valuables secure. Fares change — ask at the station.',
    'Intercity bus terminal',
    11.5850, 37.3800,
    'Bahir Dar bus station area',
    NULL, NULL,
    1, NULL, false, true
  ),
  (
    'Bahir Dar Airport (BJR)',
    'bahir-dar-airport-bjr',
    'transport',
    'Bahir Dar Airport (BJR / BAS). Domestic flights to Addis Ababa and other cities. Allow time for road transfer into town (~15–40 min depending on traffic).',
    'Domestic airport',
    11.6080, 37.3210,
    'Bahir Dar Airport',
    NULL, NULL,
    3, NULL, false, true
  ),
  (
    'Bajaj / Taxi Hub (DEMO)',
    'bajaj-taxi-hub-demo',
    'transport',
    'DEMO marker for short-hop bajaj and taxi negotiation. City hops often tens to a few hundred ETB — agree before riding.',
    'DEMO local transport hub',
    11.5938, 37.3890,
    'Central junction (DEMO)',
    NULL, NULL,
    1, NULL, false, false
  ),

  -- —— Health ——
  (
    'Felege Hiwot Referral Hospital',
    'felege-hiwot-hospital',
    'hospital',
    'Major public referral hospital serving Bahir Dar and the region. Emergency and specialty services; expect crowds. Confirm departments and visiting hours locally.',
    'Main public hospital',
    11.5800, 37.3700,
    'Felege Hiwot area, Bahir Dar',
    NULL, NULL,
    NULL, NULL, false, true
  ),
  (
    'City Pharmacy (DEMO)',
    'city-pharmacy-demo',
    'pharmacy',
    'DEMO pharmacy pin for map category testing. Not a verified shop. Carry prescriptions when possible.',
    'DEMO pharmacy',
    11.5928, 37.3912,
    'Near center (DEMO)',
    NULL, NULL,
    NULL, NULL, false, false
  ),
  (
    'Emergency / Red Cross Post (DEMO)',
    'emergency-red-cross-demo',
    'emergency',
    'DEMO emergency services marker for UI and AI guide context. In a real emergency dial local emergency numbers or go to Felege Hiwot.',
    'DEMO emergency marker',
    11.5942, 37.3888,
    'Bahir Dar (DEMO)',
    NULL, NULL,
    NULL, NULL, false, false
  ),

  -- —— Shopping ——
  (
    'Souvenir & Craft Stall Row (DEMO)',
    'souvenir-craft-row-demo',
    'shopping',
    'DEMO craft/souvenir area near tourist routes. Bargaining common. Prefer fair prices and authentic makers when possible.',
    'DEMO crafts & souvenirs',
    11.5970, 37.3840,
    'Tourist strip (DEMO)',
    NULL, NULL,
    2, NULL, false, false
  )
) AS v(
  name, slug, category, description, short_description,
  lat, lng, address, phone, website,
  price_level, entrance_fee, verified, featured
)
JOIN categories c ON c.slug = v.category
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  price_level = EXCLUDED.price_level,
  entrance_fee = EXCLUDED.entrance_fee,
  status = 'published',
  verified = EXCLUDED.verified,
  featured = EXCLUDED.featured,
  updated_at = now();

-- ========== DETAIL TABLES ==========

INSERT INTO hotels (place_id, star_rating, minimum_price, maximum_price, amenities, check_in, check_out)
SELECT p.id, 3, 4000, 9000, ARRAY['WiFi','Breakfast','Lake view'], '14:00'::time, '11:00'::time
FROM places p WHERE p.slug = 'lakeside-view-hotel-demo'
ON CONFLICT (place_id) DO UPDATE SET
  star_rating = EXCLUDED.star_rating,
  minimum_price = EXCLUDED.minimum_price,
  maximum_price = EXCLUDED.maximum_price,
  amenities = EXCLUDED.amenities;

INSERT INTO hotels (place_id, star_rating, minimum_price, maximum_price, amenities, check_in, check_out)
SELECT p.id, 4, 8000, 25000, ARRAY['WiFi','Pool','Restaurant','Lake view'], '14:00'::time, '11:00'::time
FROM places p WHERE p.slug = 'kuriftu-style-resort-demo'
ON CONFLICT (place_id) DO UPDATE SET
  star_rating = EXCLUDED.star_rating,
  minimum_price = EXCLUDED.minimum_price,
  maximum_price = EXCLUDED.maximum_price,
  amenities = EXCLUDED.amenities;

INSERT INTO hotels (place_id, star_rating, minimum_price, maximum_price, amenities, check_in, check_out)
SELECT p.id, 2, 1500, 4000, ARRAY['WiFi'], '13:00'::time, '10:00'::time
FROM places p WHERE p.slug = 'city-center-guesthouse-demo'
ON CONFLICT (place_id) DO UPDATE SET
  star_rating = EXCLUDED.star_rating,
  minimum_price = EXCLUDED.minimum_price,
  maximum_price = EXCLUDED.maximum_price,
  amenities = EXCLUDED.amenities;

INSERT INTO hotels (place_id, star_rating, minimum_price, maximum_price, amenities, check_in, check_out)
SELECT p.id, 3, 4000, 9000, ARRAY['WiFi','Restaurant'], '14:00'::time, '11:00'::time
FROM places p WHERE p.slug = 'papyrus-hotel-demo'
ON CONFLICT (place_id) DO UPDATE SET minimum_price = EXCLUDED.minimum_price, maximum_price = EXCLUDED.maximum_price;

INSERT INTO hotels (place_id, star_rating, minimum_price, maximum_price, amenities, check_in, check_out)
SELECT p.id, 2, 2000, 5000, ARRAY['WiFi','Parking'], '14:00'::time, '11:00'::time
FROM places p WHERE p.slug = 'airport-road-inn-demo'
ON CONFLICT (place_id) DO UPDATE SET minimum_price = EXCLUDED.minimum_price, maximum_price = EXCLUDED.maximum_price;

INSERT INTO restaurants (place_id, cuisine_type, minimum_price, maximum_price, vegetarian, traditional_food, delivery_available, reservation_available)
SELECT p.id, 'Ethiopian', 80, 400, true, true, false, false
FROM places p WHERE p.slug = 'tana-traditional-restaurant-demo'
ON CONFLICT (place_id) DO UPDATE SET cuisine_type = EXCLUDED.cuisine_type, minimum_price = EXCLUDED.minimum_price, maximum_price = EXCLUDED.maximum_price;

INSERT INTO restaurants (place_id, cuisine_type, minimum_price, maximum_price, vegetarian, traditional_food, delivery_available, reservation_available)
SELECT p.id, 'Seafood', 180, 500, false, true, false, true
FROM places p WHERE p.slug = 'lake-fish-grill-demo'
ON CONFLICT (place_id) DO UPDATE SET cuisine_type = EXCLUDED.cuisine_type, minimum_price = EXCLUDED.minimum_price, maximum_price = EXCLUDED.maximum_price;

INSERT INTO restaurants (place_id, cuisine_type, minimum_price, maximum_price, vegetarian, traditional_food, delivery_available, reservation_available)
SELECT p.id, 'Ethiopian', 50, 200, true, true, false, false
FROM places p WHERE p.slug = 'abay-family-kitchen-demo'
ON CONFLICT (place_id) DO UPDATE SET minimum_price = EXCLUDED.minimum_price, maximum_price = EXCLUDED.maximum_price;

INSERT INTO restaurants (place_id, cuisine_type, minimum_price, maximum_price, vegetarian, traditional_food, delivery_available, reservation_available)
SELECT p.id, 'Cafe', 30, 150, true, false, false, false
FROM places p WHERE p.slug = 'city-cafe-demo'
ON CONFLICT (place_id) DO UPDATE SET cuisine_type = EXCLUDED.cuisine_type;

INSERT INTO restaurants (place_id, cuisine_type, minimum_price, maximum_price, vegetarian, traditional_food, delivery_available, reservation_available)
SELECT p.id, 'Cafe', 40, 200, true, false, false, false
FROM places p WHERE p.slug = 'zege-coffee-house-demo'
ON CONFLICT (place_id) DO UPDATE SET cuisine_type = EXCLUDED.cuisine_type;

INSERT INTO attractions (place_id, attraction_type, entrance_fee, recommended_duration, best_time_to_visit, historical_information, safety_information, accessibility)
SELECT p.id, 'nature', 200, 'Half day – full day', 'Morning',
  'Source region of the Blue Nile; island monasteries date back many centuries.',
  'Use verified boat operators; wear life jackets when provided; agree price before boarding.',
  'Boat access required for islands'
FROM places p WHERE p.slug = 'lake-tana'
ON CONFLICT (place_id) DO UPDATE SET entrance_fee = EXCLUDED.entrance_fee, recommended_duration = EXCLUDED.recommended_duration;

INSERT INTO attractions (place_id, attraction_type, entrance_fee, recommended_duration, best_time_to_visit, safety_information, accessibility)
SELECT p.id, 'nature', 200, '2–4 hours', 'After rainy season for stronger flow',
  'Steep paths; spray and slippery rocks in wet season; hire local guide if unsure.',
  'Limited — uneven terrain'
FROM places p WHERE p.slug = 'blue-nile-falls-tis-issat'
ON CONFLICT (place_id) DO UPDATE SET entrance_fee = EXCLUDED.entrance_fee, recommended_duration = EXCLUDED.recommended_duration;

INSERT INTO attractions (place_id, attraction_type, entrance_fee, recommended_duration, best_time_to_visit, safety_information, accessibility)
SELECT p.id, 'viewpoint', 50, '45–90 minutes', 'Sunrise or sunset',
  'Steep sections; watch footing after rain.',
  'Limited'
FROM places p WHERE p.slug = 'bezawit-palace-viewpoint'
ON CONFLICT (place_id) DO UPDATE SET entrance_fee = EXCLUDED.entrance_fee;

INSERT INTO attractions (place_id, attraction_type, entrance_fee, recommended_duration, best_time_to_visit, historical_information, safety_information, accessibility)
SELECT p.id, 'religious', 200, '2–4 hours with boat', 'Morning',
  'Celebrated for mural art and circular church form on Lake Tana / Zege area.',
  'Modest dress; boat safety; respect worship services.',
  'Boat + walking paths'
FROM places p WHERE p.slug = 'ura-kidane-mehret'
ON CONFLICT (place_id) DO UPDATE SET entrance_fee = EXCLUDED.entrance_fee;

INSERT INTO attractions (place_id, attraction_type, entrance_fee, recommended_duration, best_time_to_visit, safety_information, accessibility)
SELECT p.id, 'religious', 200, 'Half day with boat', 'Morning',
  'Boat access; modest dress; confirm open hours.',
  'Boat + paths'
FROM places p WHERE p.slug = 'debre-maryam-monastery'
ON CONFLICT (place_id) DO UPDATE SET entrance_fee = EXCLUDED.entrance_fee;

INSERT INTO attractions (place_id, attraction_type, entrance_fee, recommended_duration, best_time_to_visit, safety_information, accessibility)
SELECT p.id, 'religious', 200, 'Half day with boat', 'Morning',
  'Often combined with other Zege monasteries; boat required.',
  'Boat + paths'
FROM places p WHERE p.slug = 'azwa-maryam-monastery'
ON CONFLICT (place_id) DO UPDATE SET entrance_fee = EXCLUDED.entrance_fee;

INSERT INTO attractions (place_id, attraction_type, entrance_fee, recommended_duration, best_time_to_visit, accessibility)
SELECT p.id, 'landmark', 0, '30–60 minutes', 'Daytime', 'Campus rules may apply'
FROM places p WHERE p.slug = 'bahir-dar-university'
ON CONFLICT (place_id) DO UPDATE SET attraction_type = EXCLUDED.attraction_type;

INSERT INTO attractions (place_id, attraction_type, entrance_fee, recommended_duration, best_time_to_visit, accessibility)
SELECT p.id, 'landmark', 0, '15–30 minutes', 'Daytime', 'Urban open area'
FROM places p WHERE p.slug = 'martyrs-memorial-bahir-dar'
ON CONFLICT (place_id) DO UPDATE SET attraction_type = EXCLUDED.attraction_type;

INSERT INTO attractions (place_id, attraction_type, entrance_fee, recommended_duration, best_time_to_visit, accessibility)
SELECT p.id, 'viewpoint', 0, '20–40 minutes', 'Late afternoon', 'Roadside / short walk'
FROM places p WHERE p.slug = 'blue-nile-bridge-outlet'
ON CONFLICT (place_id) DO UPDATE SET attraction_type = EXCLUDED.attraction_type;

INSERT INTO banks (place_id, bank_name, has_atm, has_foreign_exchange, is_atm_only)
SELECT p.id, 'Commercial Bank (DEMO)', true, true, false
FROM places p WHERE p.slug = 'cbe-branch-demo'
ON CONFLICT (place_id) DO UPDATE SET bank_name = EXCLUDED.bank_name, has_atm = true, has_foreign_exchange = true;

INSERT INTO banks (place_id, bank_name, has_atm, has_foreign_exchange, is_atm_only)
SELECT p.id, 'Dashen ATM (DEMO)', true, false, true
FROM places p WHERE p.slug = 'dashen-atm-center-demo'
ON CONFLICT (place_id) DO UPDATE SET is_atm_only = true, has_atm = true;

INSERT INTO banks (place_id, bank_name, has_atm, has_foreign_exchange, is_atm_only)
SELECT p.id, 'Bank of Abyssinia (DEMO)', true, true, false
FROM places p WHERE p.slug = 'boa-branch-demo'
ON CONFLICT (place_id) DO UPDATE SET has_foreign_exchange = true;

-- Transport service estimates (planning only)
INSERT INTO transport_services (
  place_id, service_type, provider_name, phone,
  estimated_price_min, estimated_price_max, currency, price_label, route_description, verified
)
SELECT p.id, 'boat', 'Lake Tana boat operators (ask at pier)', NULL,
  800, 15000, 'ETB', 'Estimated', 'Shared half-day ~800–5000; private half-day often 3000–15000+', false
FROM places p WHERE p.slug = 'lake-tana-boat-pier'
AND NOT EXISTS (
  SELECT 1 FROM transport_services t WHERE t.place_id = p.id AND t.service_type = 'boat'
);

INSERT INTO transport_services (
  place_id, service_type, provider_name, phone,
  estimated_price_min, estimated_price_max, currency, price_label, route_description, verified
)
SELECT p.id, 'bus', 'Regional bus services', NULL,
  15, 500, 'ETB', 'Estimated', 'Local/regional fares vary widely — confirm at station',
  false
FROM places p WHERE p.slug = 'bahir-dar-bus-station'
AND NOT EXISTS (
  SELECT 1 FROM transport_services t WHERE t.place_id = p.id AND t.service_type = 'bus'
);

INSERT INTO transport_services (
  place_id, service_type, provider_name, phone,
  estimated_price_min, estimated_price_max, currency, price_label, route_description, verified
)
SELECT p.id, 'taxi', 'Airport taxi / hotel transfer', NULL,
  300, 1500, 'ETB', 'Estimated', 'Airport ↔ city center (agree price first)', false
FROM places p WHERE p.slug = 'bahir-dar-airport-bjr'
AND NOT EXISTS (
  SELECT 1 FROM transport_services t WHERE t.place_id = p.id AND t.service_type = 'taxi'
);
