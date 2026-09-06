import type { Place, Category } from '@/types/place'
import type { Lang } from '@/i18n/strings'

/** Split "English · አማርኛ" combined display names used by curated packs. */
export function splitBilingualName(raw: string): { en: string; am?: string } {
  const cleaned = raw.replace(' (DEMO)', '').trim()
  const parts = cleaned.split(' · ').map((s) => s.trim()).filter(Boolean)
  if (parts.length >= 2) {
    // Prefer Ethiopic script part as Amharic
    const amPart = parts.find((p) => /[\u1200-\u137F]/.test(p))
    const enPart = parts.find((p) => !/[\u1200-\u137F]/.test(p)) ?? parts[0]
    return { en: enPart, am: amPart }
  }
  return { en: cleaned }
}

/** Well-known Bahir Dar landmarks (OSM / common English labels → Amharic). */
const LANDMARK_AM: Record<string, string> = {
  'lake tana': 'ጣና ሐይቅ',
  'blue nile falls': 'ጢስ አባይ / ጢስ እሳት',
  'tis issat': 'ጢስ እሳት',
  'tis abay': 'ጢስ አባይ',
  'blue nile': 'አባይ',
  'bahir dar': 'ባሕር ዳር',
  'bahir dar airport': 'የባሕር ዳር አውሮፕላን ማረፊያ',
  'bahir dar university': 'ባሕር ዳር ዩኒቨርሲቲ',
  'st. george church': 'ቅዱስ ጊዮርጊስ ቤተክርስቲያን',
  'saint george church': 'ቅዱስ ጊዮርጊስ ቤተክርስቲያን',
  'debre maryam': 'ደብረ ማርያም',
  'ura kidane mehret': 'ኡራ ኪዳነ ምሕረት',
  'azuwa maryam': 'አዝዋ ማርያም',
  'bezawit': 'በዛዊት',
  'portuguese bridge': 'ፖርቱጋላዊ ድልድይ',
  'central market': 'ማዕከላዊ ገበያ',
  'martyrs memorial': 'የሰማዕታት መታሰቢያ',
  'nile avenue': 'አባይ መንገድ',
  'abay bridge': 'የአባይ ድልድይ',
  'boat pier': 'የጀልባ ማረፊያ',
  'lake tana boat pier': 'የጀልባ ማረፊያ',
}

const CATEGORY_AM: Record<string, string> = {
  hotel: 'ሆቴል',
  hotels: 'ሆቴሎች',
  restaurant: 'ምግብ ቤት',
  restaurants: 'ምግብ ቤቶች',
  cafe: 'ካፌ',
  cafes: 'ካፌዎች',
  attraction: 'መስህብ',
  attractions: 'መስህቦች',
  historical: 'ታሪካዊ',
  religious: 'ሃይማኖታዊ',
  museum: 'ሙዚየም',
  park: 'ፓርክ',
  bank: 'ባንክ',
  banks: 'ባንኮች',
  atm: 'ኤቲኤም',
  atms: 'ኤቲኤሞች',
  taxi: 'ታክሲ',
  transport: 'ትራንስፖርት',
  hospital: 'ሆስፒታል',
  pharmacy: 'ፋርማሲ',
  shopping: 'ግዢ',
  market: 'ገበያ',
  entertainment: 'መዝናኛ',
  event: 'ዝግጅት',
  government: 'መንግሥት',
  emergency: 'አደጋ ጊዜ',
  nature: 'ተፈጥሮ',
  viewpoint: 'እይታ',
  activity: 'እንቅስቃሴ',
  culture: 'ባህል',
  heritage: 'ቅርስ',
}

function lookupLandmarkAm(englishName: string): string | undefined {
  const key = englishName.toLowerCase().trim()
  if (LANDMARK_AM[key]) return LANDMARK_AM[key]
  for (const [en, am] of Object.entries(LANDMARK_AM)) {
    if (key.includes(en) || en.includes(key)) return am
  }
  return undefined
}

/** Localized place name for the active UI language. */
export function placeName(place: Place, lang: Lang = 'en'): string {
  const raw = place.name ?? ''
  const { en, am: fromCombined } = splitBilingualName(raw)
  const explicitAm =
    (place as Place & { name_am?: string | null }).name_am ||
    (place as Place & { nameAm?: string | null }).nameAm ||
    fromCombined ||
    lookupLandmarkAm(en)

  if (lang === 'am') {
    return explicitAm || en
  }
  return en || raw
}

/** Optional secondary line (e.g. Amharic under English or vice versa). */
export function placeNameSecondary(place: Place, lang: Lang = 'en'): string | null {
  const raw = place.name ?? ''
  const { en, am: fromCombined } = splitBilingualName(raw)
  const explicitAm =
    (place as Place & { name_am?: string | null }).name_am ||
    (place as Place & { nameAm?: string | null }).nameAm ||
    fromCombined ||
    lookupLandmarkAm(en)

  if (lang === 'am') {
    // Show English under Amharic when both exist and differ
    if (explicitAm && en && explicitAm !== en) return en
    return null
  }
  if (explicitAm && explicitAm !== en) return explicitAm
  return null
}

export function placeDescription(place: Place, lang: Lang = 'en'): string | null {
  const am =
    (place as Place & { description_am?: string | null }).description_am ||
    (place as Place & { descriptionAm?: string | null }).descriptionAm
  if (lang === 'am' && am) return am
  return place.description
}

export function placeShortDescription(place: Place, lang: Lang = 'en'): string | null {
  const am =
    (place as Place & { short_description_am?: string | null }).short_description_am ||
    (place as Place & { shortAm?: string | null }).shortAm
  if (lang === 'am' && am) return am
  return place.short_description
}

export function categoryLabel(
  category: Category | { name?: string | null; slug?: string | null } | null | undefined,
  lang: Lang = 'en'
): string {
  if (!category) return ''
  if (lang === 'am') {
    const slug = (category.slug || '').toLowerCase()
    const nameKey = (category.name || '').toLowerCase()
    return CATEGORY_AM[slug] || CATEGORY_AM[nameKey] || category.name || ''
  }
  return category.name || ''
}

/** Search haystack includes both EN and AM forms. */
export function placeSearchText(place: Place): string {
  const { en, am } = splitBilingualName(place.name ?? '')
  const nameAm =
    (place as Place & { name_am?: string }).name_am ||
    (place as Place & { nameAm?: string }).nameAm ||
    am ||
    ''
  return [en, nameAm, place.short_description, place.description, place.address, place.category?.name]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}
