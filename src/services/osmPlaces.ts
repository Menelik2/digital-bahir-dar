/**
 * Live Bahir Dar places from OpenStreetMap via Overpass API.
 *
 * Rate limits (public overpass-api.de — guideline, not a hard meter):
 * - Stay under ~10,000 queries / day and ~1 GB download / day
 * - Concurrent “slots” per IP (often ~2); extra requests wait or get 429
 * - On HTTP 429: wait ≥30s before retrying (OSM wiki)
 * - Always send a unique User-Agent / Referer identifying the app
 *
 * Docs: https://dev.overpass-api.de/overpass-doc/en/preface/commons.html
 * Wiki: https://wiki.openstreetmap.org/wiki/Overpass_API
 *
 * Attribution: © OpenStreetMap contributors (ODbL)
 */

import { BAHIR_DAR_CENTER } from '@/constants'
import type { CategorySlug, Place } from '@/types/place'
import { placeGuideLinks } from '@/constants/guideSites'

/** Bounding box around Bahir Dar city + nearby Blue Nile Falls corridor */
export const BAHIR_DAR_BBOX = {
  south: 11.48,
  west: 37.28,
  north: 11.68,
  east: 37.48,
}

/** Public instances — try in order. Prefer POST. */
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  // legacy alias still seen in docs
  'https://overpass.kumi.systems/api/interpreter',
]

const APP_USER_AGENT =
  'DigitalBahirDar/1.0 (https://github.com/Menelik2/digital-bahir-dar; tourism-poi; contact: via-github)'

const MIN_GAP_MS = 1500 // space client requests (protect shared IP / mobile NAT)
const BACKOFF_429_MS = 30_000
const MAX_RETRIES = 2

export type OsmCategory =
  | 'hotel'
  | 'restaurant'
  | 'cafe'
  | 'attraction'
  | 'transport'
  | 'bank'
  | 'atm'
  | 'hospital'
  | 'pharmacy'
  | 'all'

const CATEGORY_QL: Record<Exclude<OsmCategory, 'all'>, string[]> = {
  hotel: [
    'node["tourism"="hotel"]',
    'node["tourism"="guest_house"]',
    'node["tourism"="hostel"]',
    'way["tourism"="hotel"]',
  ],
  restaurant: [
    'node["amenity"="restaurant"]',
    'node["amenity"="fast_food"]',
    'way["amenity"="restaurant"]',
  ],
  cafe: ['node["amenity"="cafe"]', 'node["amenity"="coffee_shop"]'],
  attraction: [
    'node["tourism"="attraction"]',
    'node["tourism"="museum"]',
    'node["tourism"="viewpoint"]',
    'node["historic"]',
    'node["tourism"="zoo"]',
  ],
  transport: [
    'node["amenity"="bus_station"]',
    'node["highway"="bus_stop"]',
    'node["amenity"="taxi"]',
    'node["railway"="station"]',
    'node["aeroway"="aerodrome"]',
    'node["amenity"="ferry_terminal"]',
  ],
  bank: ['node["amenity"="bank"]'],
  atm: ['node["amenity"="atm"]'],
  hospital: ['node["amenity"="hospital"]', 'node["amenity"="clinic"]'],
  pharmacy: ['node["amenity"="pharmacy"]'],
}

type OverpassElement = {
  type: 'node' | 'way' | 'relation'
  id: number
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
  tags?: Record<string, string>
}

type OverpassResponse = { elements: OverpassElement[] }

// --- client-side throttle + short memory cache ---
let lastRequestAt = 0
let chain: Promise<unknown> = Promise.resolve()
const memoryCache = new Map<string, { at: number; data: Place[] }>()
const CACHE_TTL_MS = 15 * 60_000 // 15 min — cuts repeat hits while browsing pages

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

/** Serialize Overpass calls and enforce a minimum gap between them */
function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const run = async () => {
    const wait = Math.max(0, MIN_GAP_MS - (Date.now() - lastRequestAt))
    if (wait) await sleep(wait)
    lastRequestAt = Date.now()
    return fn()
  }
  const next = chain.then(run, run)
  chain = next.then(
    () => undefined,
    () => undefined
  )
  return next
}

function bboxFilter() {
  const { south, west, north, east } = BAHIR_DAR_BBOX
  return `(${south},${west},${north},${east})`
}

function buildQuery(categories: OsmCategory[]): string {
  const keys =
    categories.includes('all') || categories.length === 0
      ? (Object.keys(CATEGORY_QL) as Exclude<OsmCategory, 'all'>[])
      : (categories.filter((c) => c !== 'all') as Exclude<OsmCategory, 'all'>[])

  const lines: string[] = []
  const bb = bboxFilter()
  for (const cat of keys) {
    for (const sel of CATEGORY_QL[cat]) {
      lines.push(`  ${sel}${bb};`)
    }
  }

  return `
[out:json][timeout:25];
(
${lines.join('\n')}
);
out center tags;
`.trim()
}

function detectCategory(tags: Record<string, string>): CategorySlug {
  if (tags.tourism === 'hotel' || tags.tourism === 'guest_house' || tags.tourism === 'hostel') return 'hotel'
  if (tags.amenity === 'restaurant' || tags.amenity === 'fast_food') return 'restaurant'
  if (tags.amenity === 'cafe' || tags.amenity === 'coffee_shop') return 'cafe'
  if (tags.amenity === 'bank') return 'bank'
  if (tags.amenity === 'atm') return 'atm'
  if (tags.amenity === 'hospital' || tags.amenity === 'clinic') return 'hospital'
  if (tags.amenity === 'pharmacy') return 'pharmacy'
  if (
    tags.amenity === 'bus_station' ||
    tags.highway === 'bus_stop' ||
    tags.amenity === 'taxi' ||
    tags.railway === 'station' ||
    tags.aeroway === 'aerodrome' ||
    tags.amenity === 'ferry_terminal'
  )
    return 'transport'
  if (tags.tourism || tags.historic) return 'attraction'
  return 'attraction'
}

function slugify(name: string, id: number) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48)
  return `osm-${base || 'place'}-${id}`
}

function elementToPlace(el: OverpassElement): Place | null {
  const tags = el.tags || {}
  const lat = el.lat ?? el.center?.lat
  const lon = el.lon ?? el.center?.lon
  if (lat == null || lon == null) return null

  const name = tags.name || tags['name:en'] || tags['name:am'] || `OSM place ${el.id}`
  const categorySlug = detectCategory(tags)
  const phone = tags.phone || tags['contact:phone'] || null
  const website = tags.website || tags['contact:website'] || null
  const address = [tags['addr:street'], tags['addr:city'] || 'Bahir Dar'].filter(Boolean).join(', ')

  return {
    id: `osm-${el.type}-${el.id}`,
    name,
    slug: slugify(name, el.id),
    category_id: categorySlug,
    description: tags.description || tags.note || null,
    short_description: tags.cuisine
      ? `${tags.cuisine} · OpenStreetMap`
      : tags.tourism || tags.amenity
        ? `${tags.tourism || tags.amenity} · OpenStreetMap`
        : 'OpenStreetMap',
    address: address || 'Bahir Dar, Ethiopia',
    latitude: lat,
    longitude: lon,
    phone,
    email: tags.email || tags['contact:email'] || null,
    website,
    price_level: null,
    entrance_fee: null,
    currency: 'ETB',
    verified: false,
    featured: false,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: categorySlug,
      name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
      slug: categorySlug,
      icon: null,
      description: null,
      sort_order: 0,
    },
  }
}

async function postToEndpoint(endpoint: string, query: string): Promise<OverpassResponse> {
  const body = `data=${encodeURIComponent(query)}`
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      // Identify the app — required for fair use; avoid stock browser-only UA patterns for bots
      'User-Agent': APP_USER_AGENT,
    },
    body,
    signal: AbortSignal.timeout(28_000),
  })

  if (res.status === 429) {
    const err = new Error('Overpass rate limited (429). Backing off 30s.') as Error & {
      status?: number
      retryAfterMs?: number
    }
    err.status = 429
    err.retryAfterMs = BACKOFF_429_MS
    throw err
  }

  if (res.status === 504 || res.status === 502) {
    throw new Error(`Overpass gateway ${res.status}`)
  }

  if (!res.ok) {
    throw new Error(`Overpass HTTP ${res.status}`)
  }

  return (await res.json()) as OverpassResponse
}

async function postOverpass(query: string): Promise<OverpassResponse> {
  return enqueue(async () => {
    let lastError: unknown

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      for (const endpoint of OVERPASS_ENDPOINTS) {
        try {
          return await postToEndpoint(endpoint, query)
        } catch (e) {
          lastError = e
          const status = (e as { status?: number }).status
          if (status === 429) {
            // Official guidance: pause ~30s after 429; do not hammer
            await sleep(BACKOFF_429_MS)
            break // retry same / next endpoints after backoff
          }
          // try next mirror quickly
        }
      }
      if (attempt < MAX_RETRIES) await sleep(1000 * (attempt + 1))
    }

    throw lastError instanceof Error ? lastError : new Error('Overpass request failed')
  })
}

function cacheKey(categories: OsmCategory[]) {
  return categories.slice().sort().join(',')
}

/**
 * Fetch live POIs for Bahir Dar.
 * Results are cached in memory for 15 minutes to respect Overpass quotas.
 */
export async function fetchOsmPlaces(opts?: {
  categories?: OsmCategory[]
  limit?: number
  /** Bypass memory cache (still rate-limited) */
  force?: boolean
}): Promise<Place[]> {
  const categories = opts?.categories?.length ? opts.categories : (['all'] as OsmCategory[])
  const key = cacheKey(categories)

  if (!opts?.force) {
    const hit = memoryCache.get(key)
    if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
      return opts?.limit ? hit.data.slice(0, opts.limit) : hit.data
    }
  }

  const query = buildQuery(categories)
  const data = await postOverpass(query)

  const seen = new Set<string>()
  const places: Place[] = []

  for (const el of data.elements || []) {
    const p = elementToPlace(el)
    if (!p) continue
    if (seen.has(p.id)) continue
    seen.add(p.id)
    places.push(p)
  }

  places.sort((a, b) => a.name.localeCompare(b.name))
  memoryCache.set(key, { at: Date.now(), data: places })

  return opts?.limit ? places.slice(0, opts.limit) : places
}

export const fetchOsmHotels = () => fetchOsmPlaces({ categories: ['hotel'] })
export const fetchOsmRestaurants = () => fetchOsmPlaces({ categories: ['restaurant'] })
export const fetchOsmCafes = () => fetchOsmPlaces({ categories: ['cafe'] })
export const fetchOsmAttractions = () => fetchOsmPlaces({ categories: ['attraction'] })
export const fetchOsmTransport = () => fetchOsmPlaces({ categories: ['transport'] })

export function withGuideLinks(place: Place) {
  return {
    place,
    guides: placeGuideLinks(place),
    centerHint: BAHIR_DAR_CENTER,
  }
}

/** Optional: inspect public slot status (debugging only) */
export async function fetchOverpassStatus() {
  const res = await fetch('https://overpass-api.de/api/status', {
    headers: { 'User-Agent': APP_USER_AGENT },
  })
  return res.text()
}
