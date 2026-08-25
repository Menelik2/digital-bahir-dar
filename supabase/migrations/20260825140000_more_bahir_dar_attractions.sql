-- Additional Bahir Dar attractions (public landmarks; approximate coordinates)
-- Safe to re-run: places.slug is UNIQUE

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
  (
    'Kebran Gabriel Monastery',
    'kebran-gabriel-monastery',
    '14th-century island monastery on Lake Tana with a museum of manuscripts and paintings. Traditionally open to men only — women usually visit other Zege sites instead. Reach by boat from Bahir Dar; entry and boat costs are separate. Modest dress and quiet behavior expected.',
    'Island monastery · men-only access',
    11.6500, 37.3800,
    'Kebran Gabriel, Lake Tana',
    NULL::text, NULL::text,
    2, 200::numeric, false, true
  ),
  (
    'Narga Selassie Monastery',
    'narga-selassie-monastery',
    '18th-century church on Dek Island (largest island on Lake Tana), founded under Empress Mentewab. Peaceful setting with fine murals; longer boat ride than Zege (often half to full day). Open to visitors of all genders. Confirm boat price, islands, and return time before departure.',
    'Dek Island · 18th-century church',
    11.9200, 37.2500,
    'Dek Island, Lake Tana',
    NULL, NULL,
    2, 200::numeric, false, true
  ),
  (
    'Daga Estifanos Monastery',
    'daga-estifanos-monastery',
    'Hilltop monastery on Daga Island with sweeping Lake Tana views. Known for historic manuscripts, ceremonial robes, and tradition of housing remains of Ethiopian emperors. Boat plus a short uphill walk; access rules can be strict — confirm locally who may enter.',
    'Daga Island · hilltop monastery',
    11.8800, 37.3000,
    'Daga Island, Lake Tana',
    NULL, NULL,
    2, 200::numeric, false, false
  ),
  (
    'Tana Cherqos (Tana Kirkos)',
    'tana-cherqos-kirkos',
    'Remote eastern-shore island monastery with deep religious history. Local tradition links the site to early Judaic worship and stories of the Ark of the Covenant before Axum. Longer boat journey from Bahir Dar; best as a dedicated full-day trip with a trusted operator.',
    'Remote island · sacred history',
    11.8500, 37.5500,
    'Tana Cherqos, Lake Tana',
    NULL, NULL,
    2, 200::numeric, false, false
  ),
  (
    'Zege Peninsula Coffee Forest',
    'zege-peninsula-coffee-forest',
    'Shaded walking paths on the Zege Peninsula through coffee forest, birds, and monkeys, linking boat landings to monasteries such as Ura Kidane Mehret and Azwa Maryam. Combine with a half-day boat tour; wear comfortable shoes and bring water.',
    'Coffee forest walks · Zege',
    11.7050, 37.3250,
    'Zege Peninsula, Lake Tana',
    NULL, NULL,
    1, 100::numeric, false, true
  ),
  (
    'Portuguese Bridge (Tis Abay)',
    'portuguese-bridge-tis-abay',
    'Historic stone bridge near the Blue Nile Falls trail, often crossed on the walk to Tis Issat viewpoints. Part of the classic Falls day trip from Bahir Dar (~30–35 km). Entry is usually tied to the Falls area ticket; paths can be muddy after rain.',
    'Historic bridge · Falls trail',
    11.4920, 37.5850,
    'Near Tis Abay / Blue Nile Falls',
    NULL, NULL,
    1, 50::numeric, false, false
  ),
  (
    'Bahir Dar Lakeside Promenade',
    'bahir-dar-lakeside-promenade',
    'Palm-lined lakeshore walk popular for sunset, cafés, and people-watching between hotels and the boat pier area. Free; safest and most lively in late afternoon. Good starting point before a monastery boat trip the next morning.',
    'Sunset walk · lakeshore',
    11.5980, 37.3850,
    'Lake Avenue / lakeshore, Bahir Dar',
    NULL, NULL,
    1, 0::numeric, false, true
  ),
  (
    'St. George Church (Kidus Giorgis)',
    'st-george-church-bahir-dar',
    'Important Orthodox church near the lake in Bahir Dar. The compound is linked in local history to early Jesuit-era structures along the shore. Dress modestly; ask before photographing people or services.',
    'City Orthodox church',
    11.5953, 37.3889,
    'Near Lake Street, Bahir Dar',
    NULL, NULL,
    1, 0::numeric, false, false
  ),
  (
    'Abay Ras (Head of the Blue Nile)',
    'abay-ras-head-of-nile',
    'The outflow where Lake Tana becomes the Blue Nile — often called Abay Ras. Best appreciated by short boat ride near the outlet; hippos are sometimes spotted in quieter channels. Pair with Bezawit Hill for views from above.',
    'Blue Nile source outlet',
    11.6080, 37.4080,
    'Lake Tana outlet, Bahir Dar',
    NULL, NULL,
    1, 0::numeric, false, true
  )
) AS v(name, slug, description, short_description, lat, lng, address, phone, website, price_level, entrance_fee, verified, featured)
JOIN categories c ON c.slug = 'attraction'
ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  address = EXCLUDED.address,
  price_level = EXCLUDED.price_level,
  entrance_fee = EXCLUDED.entrance_fee,
  featured = EXCLUDED.featured,
  status = 'published',
  updated_at = now();

-- Enrich Martyrs Memorial if already seeded
UPDATE places SET
  description = 'Amhara Martyrs Memorial near the Blue Nile / Gondar road area — tall monument, sculptures, and often a small museum about resistance history. Free or low-cost outdoor visit; combine with a short city orientation stop.',
  short_description = 'Memorial · museum & fountains',
  latitude = 11.6023,
  longitude = 37.4125,
  address = 'Gondar Road / east of Blue Nile, Bahir Dar',
  featured = true,
  updated_at = now()
WHERE slug = 'martyrs-memorial-bahir-dar';

-- Attraction detail rows
INSERT INTO attractions (place_id, attraction_type, entrance_fee, recommended_duration, best_time_to_visit, historical_information, safety_information, accessibility)
SELECT p.id, 'religious', 200, 'Half day with boat', 'Morning',
  'Believed 14th-century foundation; museum with manuscripts and religious art. Traditionally men only.',
  'Confirm gender access rules; modest dress; boat safety; respect services.',
  'Boat + paths; men-only tradition'
FROM places p WHERE p.slug = 'kebran-gabriel-monastery'
ON CONFLICT (place_id) DO UPDATE SET entrance_fee = EXCLUDED.entrance_fee, historical_information = EXCLUDED.historical_information;

INSERT INTO attractions (place_id, attraction_type, entrance_fee, recommended_duration, best_time_to_visit, historical_information, safety_information, accessibility)
SELECT p.id, 'religious', 200, 'Full day with boat', 'Morning – dry season preferred',
  'Built in the 18th century under Empress Mentewab on Dek Island; noted mural program.',
  'Longer boat ride; weather and lake conditions; agree itinerary before departure.',
  'Boat + island paths; open to all genders'
FROM places p WHERE p.slug = 'narga-selassie-monastery'
ON CONFLICT (place_id) DO UPDATE SET entrance_fee = EXCLUDED.entrance_fee, historical_information = EXCLUDED.historical_information;

INSERT INTO attractions (place_id, attraction_type, entrance_fee, recommended_duration, best_time_to_visit, historical_information, safety_information, accessibility)
SELECT p.id, 'religious', 200, 'Full day with boat', 'Morning',
  'Hilltop island monastery associated with imperial burials and historic manuscripts.',
  'Uphill walk after landing; confirm who may enter; boat safety.',
  'Boat + steep walk'
FROM places p WHERE p.slug = 'daga-estifanos-monastery'
ON CONFLICT (place_id) DO UPDATE SET entrance_fee = EXCLUDED.entrance_fee, historical_information = EXCLUDED.historical_information;

INSERT INTO attractions (place_id, attraction_type, entrance_fee, recommended_duration, best_time_to_visit, historical_information, safety_information, accessibility)
SELECT p.id, 'religious', 200, 'Full day', 'Dry season mornings',
  'Linked in tradition to early sacred history on Lake Tana’s eastern side; remote setting.',
  'Remote boat trip; limited facilities; travel with experienced operator.',
  'Boat + island terrain'
FROM places p WHERE p.slug = 'tana-cherqos-kirkos'
ON CONFLICT (place_id) DO UPDATE SET entrance_fee = EXCLUDED.entrance_fee, historical_information = EXCLUDED.historical_information;

INSERT INTO attractions (place_id, attraction_type, entrance_fee, recommended_duration, best_time_to_visit, historical_information, safety_information, accessibility)
SELECT p.id, 'nature', 100, '1–3 hours on foot', 'Morning',
  'Coffee forest trails on Zege Peninsula connecting landings to monasteries.',
  'Uneven paths; insects; stay on marked routes; respect local farms.',
  'Walking paths; boat to peninsula'
FROM places p WHERE p.slug = 'zege-peninsula-coffee-forest'
ON CONFLICT (place_id) DO UPDATE SET entrance_fee = EXCLUDED.entrance_fee, recommended_duration = EXCLUDED.recommended_duration;

INSERT INTO attractions (place_id, attraction_type, entrance_fee, recommended_duration, best_time_to_visit, historical_information, safety_information, accessibility)
SELECT p.id, 'historical', 50, '30–60 minutes (with Falls visit)', 'Morning with Falls day trip',
  'Stone bridge on the classic approach to Tis Issat / Blue Nile Falls.',
  'Slippery after rain; stay with the Falls trail group/guide when required.',
  'Uneven historic path'
FROM places p WHERE p.slug = 'portuguese-bridge-tis-abay'
ON CONFLICT (place_id) DO UPDATE SET attraction_type = EXCLUDED.attraction_type, recommended_duration = EXCLUDED.recommended_duration;

INSERT INTO attractions (place_id, attraction_type, entrance_fee, recommended_duration, best_time_to_visit, safety_information, accessibility)
SELECT p.id, 'viewpoint', 0, '30–90 minutes', 'Late afternoon / sunset',
  'Urban lakeshore; keep valuables secure after dark.',
  'Paved / lakeside walk'
FROM places p WHERE p.slug = 'bahir-dar-lakeside-promenade'
ON CONFLICT (place_id) DO UPDATE SET attraction_type = EXCLUDED.attraction_type;

INSERT INTO attractions (place_id, attraction_type, entrance_fee, recommended_duration, best_time_to_visit, historical_information, safety_information, accessibility)
SELECT p.id, 'religious', 0, '20–45 minutes', 'Outside service times unless invited',
  'City Orthodox church near the lake; shore area has early European-era associations.',
  'Modest dress; ask before photos of worship.',
  'Urban church compound'
FROM places p WHERE p.slug = 'st-george-church-bahir-dar'
ON CONFLICT (place_id) DO UPDATE SET attraction_type = EXCLUDED.attraction_type;

INSERT INTO attractions (place_id, attraction_type, entrance_fee, recommended_duration, best_time_to_visit, historical_information, safety_information, accessibility)
SELECT p.id, 'nature', 0, '30–90 minutes by boat or shore', 'Morning or late afternoon',
  'Outlet of Lake Tana into the Blue Nile — symbolic “head” of the Abay.',
  'Boat operators only; do not approach wildlife; life jackets when offered.',
  'Boat recommended; limited shore access'
FROM places p WHERE p.slug = 'abay-ras-head-of-nile'
ON CONFLICT (place_id) DO UPDATE SET attraction_type = EXCLUDED.attraction_type, historical_information = EXCLUDED.historical_information;
