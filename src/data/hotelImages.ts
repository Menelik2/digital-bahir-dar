/**
 * Curated cover photos for Bahir Dar hotels.
 * Sources: Wikimedia Commons (Bahir Dar / Lake Tana / lakeside lodging scenes).
 * Google Maps place photos require a billed Places API key — we link users to Maps for full galleries.
 */

function commons(file: string, width = 800): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`
}

/** Stable public photos (real Bahir Dar / Lake Tana scenes) assigned per property */
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
  falls: commons('Blue Nile Falls 03.jpg'),
} as const

/** Explicit cover image per hotel name (case-insensitive match) */
const BY_NAME: Record<string, string> = {
  'nile view hotel': POOL.lake1,
  'sky resort': POOL.lake2,
  'winn hotel': POOL.city1,
  'jacaranda hotel': POOL.palms,
  'unison hotel': POOL.lake3,
  'tana hotel': POOL.lake4,
  'rahnile hotel': POOL.city2,
  'blue nile hotel': POOL.falls,
  'lake avenue hotel': POOL.lake5,
  'dib anbessa hotel': POOL.city3,
  'palm palace hotel': POOL.palms,
  'nova hotel': POOL.city4,
  'lakemark hotel': POOL.lake6,
  'naky hotel': POOL.street,
  'felege ghion eco-resort': POOL.dock,
  'azewa hotel': POOL.city5,
  'yiganda hotel': POOL.cafe,
  'blue nile resort hotel': POOL.lake7,
  'yamen hotel': POOL.boats,
  'olive hotel and spa': POOL.dining,
}

const FALLBACKS = Object.values(POOL)

export function hotelCoverImage(name: string, index = 0): string {
  const key = name.trim().toLowerCase()
  if (BY_NAME[key]) return BY_NAME[key]
  return FALLBACKS[Math.abs(index) % FALLBACKS.length]
}

/** Google Maps search URL so guests can open the full photo gallery in Maps */
export function googleMapsPhotosUrl(name: string, lat: number, lng: number): string {
  const q = encodeURIComponent(`${name} Bahir Dar`)
  return `https://www.google.com/maps/search/?api=1&query=${q}&query_place_id=&center=${lat},${lng}`
}
