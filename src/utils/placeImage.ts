import type { Place } from '@/types/place'

/**
 * Cover images for Bahir Dar places.
 * Prefer Wikimedia Commons via Special:FilePath (stable redirect to current storage path).
 * When a unique photo is unknown, use a clear category fallback — never a broken URL
 * (broken URLs trigger PlaceCard gradient).
 */

/** Wikimedia Commons file → 640px-wide delivery URL */
function commons(fileName: string, width = 640): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=${width}`
}

const BY_SLUG: Record<string, string> = {
  // Lake & nature
  'lake-tana': commons('Lake Tana from the air (Ethiopia).jpg'),
  'lake-tana-demo': commons('Lake Tana from the air (Ethiopia).jpg'),
  'lake-tana-boat-pier': commons('Dock on Lake Tana, Ethiopia (2260757035).jpg'),

  // Falls & river
  'blue-nile-falls-tis-issat': commons('Blue Nile Falls 03.jpg'),
  'blue-nile-falls-demo': commons('Blue Nile Falls 03.jpg'),
  'blue-nile-bridge-outlet': commons('ET Amhara asv2018-02 img080 Lake Tana at Bahir Dar.jpg'),

  // Viewpoint & city
  'bezawit-palace-viewpoint': commons('ET Bahir Dar asv2018-02 img33 view from Bezawit.jpg'),
  'bahir-dar-center': commons('Bahir Dar - street scene (1).jpg'),
  'bahir-dar-center-demo': commons('Bahir Dar - street scene (1).jpg'),
  'bahir-dar-central-market': commons('Bahir Dar - street scene (2).jpg'),

  // Monasteries (Ura is classic Zege visit)
  'ura-kidane-mehret': commons('ET Amhara asv2018-02 img070 Lake Tana at Bahir Dar.jpg'),
  'debre-maryam-monastery': commons('ET Amhara asv2018-02 img078 Lake Tana at Bahir Dar.jpg'),
  'azwa-maryam-monastery': commons('ET Amhara asv2018-02 img070 Lake Tana at Bahir Dar.jpg'),

  // Transport hubs
  'bahir-dar-airport-bjr': commons('Bahir Dar (BJR - HABD) AN0457026.jpg'),
  'bahir-dar-bus-station': commons('Bahar dar, viale con palme 01.jpg'),

  // Services
  'felege-hiwot-hospital': commons('Bahir Dar - street scene (1).jpg'),
  'bahir-dar-university': commons('Bahar dar, viale con palme 01.jpg'),
  'martyrs-memorial-bahir-dar': commons('The city of Bahir Dar, Ethiopia.jpg'),
}

/** Name-fragment hints when slug is missing (OSM places) */
const BY_NAME_HINT: { test: RegExp; file: string }[] = [
  { test: /airport|bjr|habd/i, file: 'Bahir Dar (BJR - HABD) AN0457026.jpg' },
  { test: /blue nile falls|tis\s*issat|tis abay/i, file: 'Blue Nile Falls 03.jpg' },
  { test: /lake tana|tana shore/i, file: 'Lake Tana from the air (Ethiopia).jpg' },
  { test: /boat|pier|dock|ferry/i, file: 'Dock on Lake Tana, Ethiopia (2260757035).jpg' },
  { test: /bezawit/i, file: 'ET Bahir Dar asv2018-02 img33 view from Bezawit.jpg' },
  { test: /ura kidane|kidane mehret|zege/i, file: 'ET Amhara asv2018-02 img070 Lake Tana at Bahir Dar.jpg' },
  { test: /bus station|terminal/i, file: 'Bahar dar, viale con palme 01.jpg' },
  { test: /market|merkato/i, file: 'Bahir Dar - street scene (2).jpg' },
  { test: /hospital|felege/i, file: 'Bahir Dar - street scene (1).jpg' },
]

const BY_CATEGORY: Record<string, string> = {
  hotel: commons('Bahar dar, ristorazione sul lago tana 06.jpg'),
  restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=640&q=80&auto=format&fit=crop',
  cafe: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=640&q=80&auto=format&fit=crop',
  attraction: commons('Lake Tana from the air (Ethiopia).jpg'),
  bank: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=640&q=80&auto=format&fit=crop',
  atm: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=640&q=80&auto=format&fit=crop',
  transport: commons('Bahir Dar (BJR - HABD) AN0457026.jpg'),
  hospital: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=640&q=80&auto=format&fit=crop',
  pharmacy: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=640&q=80&auto=format&fit=crop',
  shopping: commons('Bahir Dar - street scene (2).jpg'),
  emergency: 'https://images.unsplash.com/photo-1516574187841-cb9cc3604600?w=640&q=80&auto=format&fit=crop',
}

const DEFAULT_COVER = commons('The city of Bahir Dar, Ethiopia.jpg')

export function placeCoverImage(place: {
  slug?: string
  category?: { slug?: string } | null
  category_id?: string
  name?: string
}): string {
  if (place.slug && BY_SLUG[place.slug]) return BY_SLUG[place.slug]

  const name = place.name || ''
  for (const h of BY_NAME_HINT) {
    if (h.test.test(name)) return commons(h.file)
  }

  const cat =
    place.category?.slug ||
    (typeof place.category_id === 'string' && place.category_id.includes('-')
      ? place.category_id.replace(/^demo-/, '')
      : undefined)

  if (cat && BY_CATEGORY[cat]) return BY_CATEGORY[cat]

  const n = name.toLowerCase()
  if (n.includes('hotel') || n.includes('resort') || n.includes('guesthouse')) return BY_CATEGORY.hotel
  if (n.includes('restaurant') || n.includes('kitchen') || n.includes('grill'))
    return BY_CATEGORY.restaurant
  if (n.includes('cafe') || n.includes('coffee')) return BY_CATEGORY.cafe
  if (n.includes('bank') || n.includes('atm')) return BY_CATEGORY.bank
  if (n.includes('hospital') || n.includes('clinic')) return BY_CATEGORY.hospital
  if (
    n.includes('airport') ||
    n.includes('bus') ||
    n.includes('boat') ||
    n.includes('taxi') ||
    n.includes('pier')
  )
    return BY_CATEGORY.transport

  return DEFAULT_COVER
}

export function placeImageAlt(place: Place | { name: string }): string {
  return `${place.name.replace(' (DEMO)', '')} — Bahir Dar`
}
