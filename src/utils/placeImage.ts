import type { Place } from '@/types/place'

/**
 * Cover images for Explore / place cards — real Bahir Dar photos from Wikimedia Commons.
 * Special:FilePath redirects stay stable when storage hashes change.
 */

function commons(fileName: string, width = 640): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=${width}`
}

/** Verified / commonly used Bahir Dar & Lake Tana files on Commons */
const BD = {
  city: 'The city of Bahir Dar, Ethiopia.jpg',
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
  bezawit: 'ET Bahir Dar asv2018-02 img33 view from Bezawit.jpg',
  street1: 'Bahir Dar - street scene (1).jpg',
  street2: 'Bahir Dar - street scene (2).jpg',
  palms: 'Bahar dar, viale con palme 01.jpg',
  lakesideDining: 'Bahar dar, ristorazione sul lago tana 06.jpg',
  strandCafe: 'Bahir-Dar-Strandcafe.JPG',
  dock: 'Dock on Lake Tana, Ethiopia (2260757035).jpg',
  boats: 'Boatmen Transporting Firewood - Lake Tana - Near Bahir Dar - Ethiopia - 01 (8679578999).jpg',
  airport: 'Bahir Dar (BJR - HABD) AN0457026.jpg',
  papyrus: 'Papyrus - Lake Tana Bahir Dar.jpg',
} as const

const BY_SLUG: Record<string, string> = {
  'lake-tana': commons(BD.lakeAerial),
  'lake-tana-demo': commons(BD.lakeAerial),
  'lake-tana-boat-pier': commons(BD.dock),
  'blue-nile-falls-tis-issat': commons(BD.falls),
  'blue-nile-falls-demo': commons(BD.falls),
  'blue-nile-bridge-outlet': commons(BD.lakeEt080),
  'bezawit-palace-viewpoint': commons(BD.bezawit),
  'bahir-dar-center': commons(BD.street1),
  'bahir-dar-center-demo': commons(BD.street1),
  'bahir-dar-central-market': commons(BD.street2),
  'ura-kidane-mehret': commons(BD.lakeEt070),
  'debre-maryam-monastery': commons(BD.lakeEt078),
  'azwa-maryam-monastery': commons(BD.lakeEt070),
  'bahir-dar-airport-bjr': commons(BD.airport),
  'bahir-dar-bus-station': commons(BD.palms),
  'felege-hiwot-hospital': commons(BD.street1),
  'bahir-dar-university': commons(BD.palms),
  'martyrs-memorial-bahir-dar': commons(BD.city),
}

const BY_NAME_HINT: { test: RegExp; file: string }[] = [
  { test: /airport|bjr|habd/i, file: BD.airport },
  { test: /blue nile falls|tis\s*issat|tis\s*abay|tisabay/i, file: BD.falls },
  { test: /lake tana|tana shore|tana lake/i, file: BD.lakeAerial },
  { test: /bezawit|viewpoint|palace view/i, file: BD.bezawit },
  { test: /ura kidane|zege|monastery|kidane mehret|debre maryam|azwa/i, file: BD.lakeEt070 },
  { test: /pier|dock|boat|ferry|papyrus/i, file: BD.dock },
  { test: /market|bazaar|merkato/i, file: BD.street2 },
  { test: /kuriftu|papyrus|lakeside|lake side|shore/i, file: BD.lakesideDining },
  { test: /coffee|café|cafe|bunna/i, file: BD.strandCafe },
  { test: /fish|restaurant|kitfo|injera/i, file: BD.lakesideDining },
  { test: /hotel|lodge|resort|guesthouse|pension/i, file: BD.lakesideDining },
  { test: /bus station|taxi|bajaj/i, file: BD.palms },
  { test: /hospital|clinic|pharmacy|health/i, file: BD.street1 },
  { test: /bank|atm|cbe|dashen|awash/i, file: BD.street1 },
]

/** Category covers — all real Bahir Dar / Lake Tana photography (no generic Unsplash) */
const BY_CATEGORY: Record<string, string> = {
  hotel: commons(BD.lakesideDining),
  restaurant: commons(BD.strandCafe),
  cafe: commons(BD.strandCafe),
  attraction: commons(BD.lakeAerial),
  historical: commons(BD.bezawit),
  religious: commons(BD.lakeEt070),
  museum: commons(BD.city),
  park: commons(BD.lakeShore1),
  bank: commons(BD.street1),
  atm: commons(BD.street2),
  transport: commons(BD.airport),
  hospital: commons(BD.street1),
  pharmacy: commons(BD.palms),
  shopping: commons(BD.street2),
  emergency: commons(BD.city),
  tourism: commons(BD.lakeEt112),
}

const DEFAULT_COVER = commons(BD.city)

/** Stable city-wide fallback when a specific file 404s in the browser */
export const BAHIR_DAR_CITY_COVER = DEFAULT_COVER

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
  if (n.includes('hotel') || n.includes('resort') || n.includes('guesthouse') || n.includes('lodge'))
    return BY_CATEGORY.hotel
  if (n.includes('restaurant') || n.includes('kitchen') || n.includes('grill') || n.includes('fish'))
    return BY_CATEGORY.restaurant
  if (n.includes('cafe') || n.includes('coffee') || n.includes('bunna')) return BY_CATEGORY.cafe
  if (n.includes('bank') || n.includes('atm')) return BY_CATEGORY.bank
  if (n.includes('hospital') || n.includes('clinic') || n.includes('pharmacy')) return BY_CATEGORY.hospital
  if (
    n.includes('airport') ||
    n.includes('bus') ||
    n.includes('boat') ||
    n.includes('taxi') ||
    n.includes('pier') ||
    n.includes('bajaj')
  )
    return BY_CATEGORY.transport

  return DEFAULT_COVER
}

export function placeImageAlt(place: Place | { name: string }): string {
  return `${place.name.replace(' (DEMO)', '')} — Bahir Dar, Ethiopia`
}

/** Category hero images for Explore filter chips / list headers */
export function exploreCategoryImage(slug: string | null): string {
  if (!slug) return DEFAULT_COVER
  return BY_CATEGORY[slug] || DEFAULT_COVER
}
