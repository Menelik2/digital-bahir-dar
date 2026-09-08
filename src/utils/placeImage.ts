import type { Place } from '@/types/place'

/**
 * Explore / place cards — real Bahir Dar photography only (Wikimedia Commons).
 * Special:FilePath keeps links stable when storage hashes change.
 */

function commons(fileName: string, width = 640): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=${width}`
}

/** Curated real Bahir Dar / Lake Tana / Blue Nile photos on Commons */
const FILES = {
  city: 'The city of Bahir Dar, Ethiopia.jpg',
  city1: 'Bahir Dar 1.jpg',
  city5: 'Bahir Dar 5.jpg',
  city6: 'Bahir Dar 6.jpg',
  city7: 'Bahir Dar 7.jpg',
  city8: 'Bahir Dar 8.jpg',
  lakeAerial: 'Lake Tana in Bahir Dar.jpg',
  lakeShore1: 'View from Shore of Lake Tana - Bahir Dar - Ethiopia - 01 (8678175404).jpg',
  lakeShore2: 'View from Shore of Lake Tana - Bahir Dar - Ethiopia - 02 (8677069911).jpg',
  lakeShore3: 'View from Shore of Lake Tana - Bahir Dar - Ethiopia - 03 (8677068123).jpg',
  lakeEt068: 'ET Amhara asv2018-02 img068 Lake Tana at Bahir Dar.jpg',
  lakeEt070: 'ET Amhara asv2018-02 img070 Lake Tana at Bahir Dar.jpg',
  lakeEt078: 'ET Amhara asv2018-02 img078 Lake Tana at Bahir Dar.jpg',
  lakeEt080: 'ET Amhara asv2018-02 img080 Lake Tana at Bahir Dar.jpg',
  lakeEt088: 'ET Amhara asv2018-02 img088 Lake Tana at Bahir Dar.jpg',
  lakeEt112: 'ET Amhara asv2018-02 img112 Lake Tana at Bahir Dar.jpg',
  falls: 'Blue Nile Falls 03.jpg',
  fallsBlue: 'Blue Nile Bahir Dar.jpg',
  fallsTis: 'ET Bahir Dar asv2018-02 img13 Tis Issat.jpg',
  bezawit: 'ET Bahir Dar asv2018-02 img33 view from Bezawit.jpg',
  street1: 'Bahir Dar - street scene (1).jpg',
  street2: 'Bahir Dar - street scene (2).jpg',
  street3: 'Bahir Dar - street scene (3).jpg',
  street4: 'Bahir Dar - street scene (4).jpg',
  palms: 'Bahar dar, viale con palme 01.jpg',
  lakesideDining: 'Bahar dar, ristorazione sul lago tana 06.jpg',
  strandCafe: 'Bahir-Dar-Strandcafe.JPG',
  dock: 'Dock on Lake Tana, Ethiopia (2260757035).jpg',
  boats: 'Boatmen Transporting Firewood - Lake Tana - Near Bahir Dar - Ethiopia - 01 (8679578999).jpg',
  tankwa: 'Tankwas in Bahir Dar.jpg',
  papyrus: 'Papyrus - Lake Tana Bahir Dar.jpg',
  airport: 'Bahir Dar (BJR - HABD) AN0457026.jpg',
  uni: 'Bahir Dar University.jpg',
} as const

type FileKey = keyof typeof FILES

function url(key: FileKey, width = 640): string {
  return commons(FILES[key], width)
}

/** Large pool for hash-based variety (all real BD photos) */
const REAL_POOL: FileKey[] = [
  'city',
  'city1',
  'city5',
  'city6',
  'city7',
  'city8',
  'lakeAerial',
  'lakeShore1',
  'lakeShore2',
  'lakeShore3',
  'lakeEt068',
  'lakeEt070',
  'lakeEt078',
  'lakeEt080',
  'lakeEt088',
  'lakeEt112',
  'falls',
  'fallsBlue',
  'fallsTis',
  'bezawit',
  'street1',
  'street2',
  'street3',
  'street4',
  'palms',
  'lakesideDining',
  'strandCafe',
  'dock',
  'boats',
  'tankwa',
  'papyrus',
]

const LAKE_POOL: FileKey[] = [
  'lakeAerial',
  'lakeShore1',
  'lakeShore2',
  'lakeShore3',
  'lakeEt068',
  'lakeEt070',
  'lakeEt078',
  'lakeEt080',
  'lakeEt088',
  'lakeEt112',
  'dock',
  'boats',
  'tankwa',
  'papyrus',
]

const CITY_POOL: FileKey[] = [
  'city',
  'city1',
  'city5',
  'city6',
  'city7',
  'city8',
  'street1',
  'street2',
  'street3',
  'street4',
  'palms',
  'bezawit',
]

const FOOD_POOL: FileKey[] = ['lakesideDining', 'strandCafe', 'palms', 'lakeShore1', 'city5']
const STAY_POOL: FileKey[] = ['city', 'city1', 'palms', 'lakeShore2', 'lakeEt112', 'bezawit']
const FALLS_POOL: FileKey[] = ['falls', 'fallsBlue', 'fallsTis', 'lakeEt080']

function hashKey(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

function pick(pool: FileKey[], seed: string, width = 640): string {
  const i = hashKey(seed) % pool.length
  return url(pool[i], width)
}

const SLUG_MAP: Record<string, FileKey> = {
  'lake-tana': 'lakeAerial',
  'lake-tana-demo': 'lakeAerial',
  'lake-tana-boat-pier': 'dock',
  'blue-nile-falls-tis-issat': 'falls',
  'blue-nile-falls-demo': 'falls',
  'blue-nile-bridge-outlet': 'fallsBlue',
  'bezawit-palace-viewpoint': 'bezawit',
  'bahir-dar-center': 'street1',
  'bahir-dar-center-demo': 'city',
  'bahir-dar-central-market': 'street2',
  'ura-kidane-mehret': 'lakeEt070',
  'debre-maryam-monastery': 'lakeEt078',
  'azwa-maryam-monastery': 'lakeEt068',
  'kebran-gabriel': 'lakeEt088',
  'narga-selassie': 'lakeEt112',
  'tana-kirkos': 'boats',
  'papyrus-boats': 'tankwa',
  'bahir-dar-airport': 'airport',
  'bahir-dar-university': 'uni',
}

const NAME_HINTS: { test: RegExp; pool: FileKey[] }[] = [
  { test: /tis\s*issat|tis\s*abay|blue\s*nile\s*falls|ፏፏቴ|ጥሶ/i, pool: FALLS_POOL },
  { test: /lake\s*tana|ጣና|tana\s*kirkos|ura\s*kidane|debre\s*maryam|monastery|ገዳም/i, pool: LAKE_POOL },
  { test: /bezawit|በዛዊት|viewpoint|palace/i, pool: ['bezawit', 'city', 'city1'] },
  { test: /market|ገበያ|bazaar/i, pool: CITY_POOL },
  { test: /airport|አውሮፕላን/i, pool: ['airport', 'city'] },
  { test: /university|ዩኒቨርሲቲ/i, pool: ['uni', 'city', 'palms'] },
  { test: /pier|dock|boat|ጀልባ|tankwa/i, pool: ['dock', 'boats', 'tankwa', 'lakeShore1'] },
  { test: /hotel|resort|lodge|guesthouse|ሆቴል/i, pool: STAY_POOL },
  { test: /restaurant|cafe|coffee|fish|injera|ሬስቶ|ካፌ|ቡና|ዓሳ/i, pool: FOOD_POOL },
  { test: /bank|atm|ባንክ|ኤቲኤም/i, pool: CITY_POOL },
  { test: /hospital|clinic|pharmacy|ሆስፒታል/i, pool: CITY_POOL },
]

const BY_CATEGORY: Record<string, FileKey[]> = {
  hotel: STAY_POOL,
  restaurant: FOOD_POOL,
  cafe: FOOD_POOL,
  attraction: LAKE_POOL,
  historical: ['bezawit', 'city', 'fallsTis'],
  religious: ['lakeEt070', 'lakeEt078', 'lakeEt068', 'lakeEt088'],
  museum: CITY_POOL,
  park: LAKE_POOL,
  bank: CITY_POOL,
  atm: CITY_POOL,
  transport: ['airport', 'dock', 'street1', 'palms'],
  hospital: CITY_POOL,
  pharmacy: CITY_POOL,
  shopping: CITY_POOL,
  emergency: CITY_POOL,
  tourism: LAKE_POOL,
}

export const BAHIR_DAR_CITY_COVER = url('city')

/**
 * Prefer real Wikimedia Bahir Dar photos for every Explore / place card.
 * Uses slug → name hints → category pools → hash variety so cards don't all look identical.
 */
export function placeCoverImage(place: {
  id?: string
  slug?: string
  category?: { slug?: string } | null
  category_id?: string
  name?: string
}): string {
  const seed = `${place.id || ''}|${place.slug || ''}|${place.name || ''}`

  if (place.slug && SLUG_MAP[place.slug]) return url(SLUG_MAP[place.slug])

  const name = place.name || ''
  for (const h of NAME_HINTS) {
    if (h.test.test(name)) return pick(h.pool, seed)
  }

  const cat =
    place.category?.slug ||
    (typeof place.category_id === 'string' && place.category_id.includes('-')
      ? place.category_id.replace(/^demo-/, '').replace(/^osm-/, '')
      : undefined)

  if (cat && BY_CATEGORY[cat]) return pick(BY_CATEGORY[cat], seed)

  return pick(REAL_POOL, seed || 'bahir-dar')
}

export function placeImageAlt(place: Place | { name: string }): string {
  return `${place.name.replace(' (DEMO)', '')} — Bahir Dar, Ethiopia`
}

/** Category hero / chip images for Explore */
export function exploreCategoryImage(slug: string | null): string {
  if (!slug) return BAHIR_DAR_CITY_COVER
  const pool = BY_CATEGORY[slug]
  if (pool) return url(pool[0])
  return BAHIR_DAR_CITY_COVER
}

/** Ordered gallery of real BD photos (e.g. Explore hero strip) */
export const EXPLORE_HERO_IMAGES = [
  url('lakeAerial', 960),
  url('falls', 960),
  url('city', 960),
  url('bezawit', 960),
  url('lakesideDining', 960),
  url('dock', 960),
]
