/**
 * Curated cover photos for Bahir Dar hotels.
 * Prefer property-specific Wikimedia scenes (lake, city, falls) — not Google Maps tiles
 * (Maps photos need a billed Places API key; see src/utils/googlePlacePhoto.ts).
 */

function commons(file: string, width = 800): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`
}

/** Stable public photos (real Bahir Dar / Lake Tana scenes) */
const POOL = {
  lake1: commons('Lake Tana in Bahir Dar.jpg'),
  lake2: commons('View from Shore of Lake Tana - Bahir Dar - Ethiopia - 01 (8678175404).jpg'),
  lake3: commons('View from Shore of Lake Tana - Bahir Dar - Ethiopia - 02 (8677069911).jpg'),
  lake4: commons('View from Shore of Lake Tana - Bahir Dar - Ethiopia - 03 (8677068123).jpg'),
  lake5: commons('ET Amhara asv2018-02 img068 Lake Tana at Bahir Dar.jpg'),
  lake6: commons('ET Amhara asv2018-02 img070 Lake Tana at Bahir Dar.jpg'),
  lake7: commons('ET Amhara asv2018-02 img078 Lake Tana at Bahir Dar.jpg'),
  lake8: commons('ET Amhara asv2018-02 img080 Lake Tana at Bahir Dar.jpg'),
  lake9: commons('ET Amhara asv2018-02 img088 Lake Tana at Bahir Dar.jpg'),
  lake10: commons('ET Amhara asv2018-02 img112 Lake Tana at Bahir Dar.jpg'),
  city1: commons('The city of Bahir Dar, Ethiopia.jpg'),
  city2: commons('Bahir Dar 1.jpg'),
  city3: commons('Bahir Dar 5.jpg'),
  city4: commons('Bahir Dar 6.jpg'),
  city5: commons('Bahir Dar 7.jpg'),
  palms: commons('Bahar dar, viale con palme 01.jpg'),
  dining: commons('Bahar dar, ristorazione sul lago tana 06.jpg'),
  cafe: commons('Bahir-Dar-Strandcafe.JPG'),
  dock: commons('Dock on Lake Tana, Ethiopia (2260757035).jpg'),
  boats: commons('Boatmen Transporting Firewood - Lake Tana - Near Bahir Dar - Ethiopia - 01 (8679578999).jpg'),
  bezawit: commons('ET Bahir Dar asv2018-02 img33 view from Bezawit.jpg'),
  street: commons('Bahir Dar - street scene (1).jpg'),
  street2: commons('Bahir Dar - street scene (2).jpg'),
  falls: commons('Blue Nile Falls 03.jpg'),
  fallsBlue: commons('Blue Nile Bahir Dar.jpg'),
} as const

type PoolKey = keyof typeof POOL

/** Exact / normalized name → pool key */
const BY_NAME: Record<string, PoolKey> = {
  'nile view hotel': 'lake1',
  'sky resort': 'lake2',
  'sky resort bahir dar': 'lake2',
  'winn hotel': 'city1',
  'jacaranda hotel': 'palms',
  'unison hotel': 'lake3',
  'unison hotel & spa': 'lake3',
  'tana hotel': 'lake4',
  'rahnile hotel': 'city2',
  'blue nile hotel': 'fallsBlue',
  'lake avenue hotel': 'lake5',
  'dib anbessa hotel': 'city3',
  'palm palace hotel': 'palms',
  'nova hotel': 'city4',
  'lakemark hotel': 'lake6',
  'naky hotel': 'street',
  'felege ghion eco-resort': 'dock',
  'felege ghion eco resort': 'dock',
  'azewa hotel': 'city5',
  'yiganda hotel': 'cafe',
  'blue nile resort hotel': 'lake7',
  'blue nile resort': 'lake7',
  'yamen hotel': 'boats',
  'olive hotel and spa': 'dining',
  'olive hotel': 'dining',
}

/** Substring match order (first hit wins) — covers Maps-style titles */
const BY_CONTAINS: { match: string; key: PoolKey }[] = [
  { match: 'sky resort', key: 'lake2' },
  { match: 'nile view', key: 'lake1' },
  { match: 'jacaranda', key: 'palms' },
  { match: 'unison', key: 'lake3' },
  { match: 'tana hotel', key: 'lake4' },
  { match: 'rahnile', key: 'city2' },
  { match: 'blue nile resort', key: 'lake7' },
  { match: 'blue nile hotel', key: 'fallsBlue' },
  { match: 'lake avenue', key: 'lake5' },
  { match: 'dib anbessa', key: 'city3' },
  { match: 'palm palace', key: 'palms' },
  { match: 'nova hotel', key: 'city4' },
  { match: 'lakemark', key: 'lake6' },
  { match: 'naky', key: 'street' },
  { match: 'felege ghion', key: 'dock' },
  { match: 'azewa', key: 'city5' },
  { match: 'yiganda', key: 'cafe' },
  { match: 'yamen', key: 'boats' },
  { match: 'olive', key: 'dining' },
  { match: 'winn', key: 'city1' },
]

const FALLBACKS = Object.values(POOL)

function normalize(name: string): string {
  return name
    .toLowerCase()
    .replace(/\(demo\)/gi, '')
    .replace(/bahir\s*dar/gi, '')
    .replace(/ethiopia/gi, '')
    .replace(/[^\w\s&'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Best curated cover for a hotel name (exact → contains → index fallback) */
export function hotelCoverImage(name: string, index = 0): string {
  const key = normalize(name)
  if (BY_NAME[key]) return POOL[BY_NAME[key]]
  // try without trailing "hotel"
  const short = key.replace(/\s+(hotel|resort|spa|lodge|eco-?resort)$/i, '').trim()
  if (short && BY_NAME[short]) return POOL[BY_NAME[short]]
  if (short && BY_NAME[`${short} hotel`]) return POOL[BY_NAME[`${short} hotel`]]

  for (const row of BY_CONTAINS) {
    if (key.includes(row.match)) return POOL[row.key]
  }

  return FALLBACKS[Math.abs(index) % FALLBACKS.length]
}

/** Google Maps search URL so guests can open the full photo gallery in Maps */
export function googleMapsPhotosUrl(name: string, lat?: number, lng?: number): string {
  const q = encodeURIComponent(`${name} Bahir Dar`)
  if (lat != null && lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${q}&query_place_id=&center=${lat},${lng}`
  }
  return `https://www.google.com/maps/search/?api=1&query=${q}`
}
