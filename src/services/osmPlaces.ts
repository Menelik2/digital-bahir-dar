/**
 * Live Bahir Dar places from OpenStreetMap via Overpass API.
 * Real POIs only — no DEMO data.
 */

import { BAHIR_DAR_CENTER } from '@/constants'
import type { CategorySlug, Place } from '@/types/place'
import { placeGuideLinks } from '@/constants/guideSites'

export const BAHIR_DAR_BBOX = {
  south: 11.52,
  west: 37.3,
  north: 11.66,
  east: 37.48,
}

/** Prefer mirrors that respond from more networks */
const OVERPASS_ENDPOINTS = [
  'https://overpass.openstreetmap.fr/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://overpass-api.de/api/interpreter',
]

const APP_USER_AGENT =
  'DigitalBahirDar/1.3 (https://github.com/Menelik2/digital-bahir-dar; tourism-poi)'

const MIN_GAP_MS = 500
const BACKOFF_429_MS = 12_000
const MAX_RETRIES = 1
const NETWORK_TIMEOUT_MS = 14_000
const CACHE_TTL_MS = 60 * 60_000
const LS_PREFIX = 'dbd-osm-v3:'
const DETAIL_KEY = 'dbd-osm-detail'

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

const CATEGORY_UNION: Record<Exclude<OsmCategory, 'all'>, string[]> = {
  hotel: ['nwr["tourism"~"^(hotel|guest_house|hostel|motel)$"]["name"]'],
  restaurant: ['nwr["amenity"~"^(restaurant|fast_food)$"]["name"]'],
  cafe: ['nwr["amenity"~"^(cafe|coffee_shop)$"]["name"]'],
  attraction: [
    'nwr["tourism"~"^(attraction|museum|viewpoint|zoo|artwork)$"]["name"]',
    'nwr["historic"]["name"]',
  ],
  transport: [
    'nwr["amenity"~"^(bus_station|ferry_terminal)$"]',
    'nwr["aeroway"="aerodrome"]',
    'nwr["railway"="station"]',
  ],
  bank: ['nwr["amenity"="bank"]["name"]'],
  atm: ['nwr["amenity"="atm"]'],
  hospital: ['nwr["amenity"~"^(hospital|clinic)$"]["name"]'],
  pharmacy: ['nwr["amenity"="pharmacy"]["name"]'],
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

let lastRequestAt = 0
let chain: Promise<unknown> = Promise.resolve()
const memoryCache = new Map<string, { at: number; data: Place[] }>()

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

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

function bboxClause(): string {
  const { south, west, north, east } = BAHIR_DAR_BBOX
  return `(${south},${west},${north},${east})`
}

export function buildOverpassQuery(categories: OsmCategory[]): string {
  const keys: Exclude<OsmCategory, 'all'>[] =
    categories.includes('all') || categories.length === 0
      ? ['hotel', 'restaurant', 'cafe', 'attraction', 'transport', 'bank', 'hospital', 'pharmacy']
      : (categories.filter((c) => c !== 'all') as Exclude<OsmCategory, 'all'>[])

  const bb = bboxClause()
  const lines: string[] = []
  for (const cat of keys) {
    for (const frag of CATEGORY_UNION[cat]) {
      lines.push(`  ${frag}${bb};`)
    }
  }

  return ['[out:json][timeout:12][maxsize:16777216];', '(', ...lines, ');', 'out center qt;'].join(
    '\n'
  )
}

function buildQuery(categories: OsmCategory[]): string {
  return buildOverpassQuery(categories)
}

function detectCategory(tags: Record<string, string>): CategorySlug {
  if (tags.tourism === 'hotel' || tags.tourism === 'guest_house' || tags.tourism === 'hostel' || tags.tourism === 'motel')
    return 'hotel'
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

  const name = tags.name || tags['name:en'] || tags['name:am']
  if (!name) return null

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
      : tags.tourism || tags.amenity || tags.historic
        ? `${tags.tourism || tags.amenity || tags.historic} · OpenStreetMap`
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

function readLocalCache(key: string): Place[] | null {
  try {
    const raw = localStorage.getItem(LS_PREFIX + key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { at: number; data: Place[] }
    if (Date.now() - parsed.at > CACHE_TTL_MS) return null
    return parsed.data
  } catch {
    return null
  }
}

function writeLocalCache(key: string, data: Place[]) {
  try {
    localStorage.setItem(LS_PREFIX + key, JSON.stringify({ at: Date.now(), data }))
  } catch {
    /* */
  }
}

async function postToEndpoint(endpoint: string, query: string): Promise<OverpassResponse> {
  const body = `data=${encodeURIComponent(query)}`
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      'User-Agent': APP_USER_AGENT,
    },
    body,
    signal: AbortSignal.timeout(NETWORK_TIMEOUT_MS),
  })
  if (res.status === 429) {
    const err = new Error('Overpass 429') as Error & { status?: number }
    err.status = 429
    throw err
  }
  if (!res.ok) throw new Error(`Overpass HTTP ${res.status}`)
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
          if ((e as { status?: number }).status === 429) {
            await sleep(BACKOFF_429_MS)
            break
          }
        }
      }
      if (attempt < MAX_RETRIES) await sleep(400)
    }
    throw lastError instanceof Error ? lastError : new Error('Overpass failed')
  })
}

function cacheKey(categories: OsmCategory[]) {
  return categories.slice().sort().join(',')
}

export async function fetchOsmPlaces(opts?: {
  categories?: OsmCategory[]
  limit?: number
  force?: boolean
}): Promise<Place[]> {
  const categories = opts?.categories?.length ? opts.categories : (['all'] as OsmCategory[])
  const key = cacheKey(categories)

  if (!opts?.force) {
    const mem = memoryCache.get(key)
    if (mem && Date.now() - mem.at < CACHE_TTL_MS) {
      return opts?.limit ? mem.data.slice(0, opts.limit) : mem.data
    }
    const disk = readLocalCache(key)
    if (disk?.length) {
      memoryCache.set(key, { at: Date.now(), data: disk })
      return opts?.limit ? disk.slice(0, opts.limit) : disk
    }
  }

  try {
    const query = buildQuery(categories)
    const data = await postOverpass(query)
    const seen = new Set<string>()
    const places: Place[] = []
    for (const el of data.elements || []) {
      const p = elementToPlace(el)
      if (!p || seen.has(p.id)) continue
      seen.add(p.id)
      places.push(p)
    }
    places.sort((a, b) => a.name.localeCompare(b.name))
    memoryCache.set(key, { at: Date.now(), data: places })
    writeLocalCache(key, places)
    return opts?.limit ? places.slice(0, opts.limit) : places
  } catch (e) {
    console.warn('OSM fetch failed:', e)
    const disk = readLocalCache(key)
    if (disk?.length) return disk
    return []
  }
}

export const fetchOsmHotels = () => fetchOsmPlaces({ categories: ['hotel'] })
export const fetchOsmRestaurants = () => fetchOsmPlaces({ categories: ['restaurant'] })
export const fetchOsmCafes = () => fetchOsmPlaces({ categories: ['cafe'] })
export const fetchOsmAttractions = () => fetchOsmPlaces({ categories: ['attraction'] })
export const fetchOsmTransport = () => fetchOsmPlaces({ categories: ['transport'] })

export function cacheOsmPlaceForDetail(place: Place) {
  try {
    sessionStorage.setItem(DETAIL_KEY, JSON.stringify(place))
  } catch {
    /* */
  }
}

export function findCachedOsmPlace(slug: string): Place | null {
  for (const entry of memoryCache.values()) {
    const hit = entry.data.find((x) => x.slug === slug || x.id === slug)
    if (hit) return hit
  }
  try {
    const raw = sessionStorage.getItem(DETAIL_KEY)
    if (raw) {
      const place = JSON.parse(raw) as Place
      if (place.slug === slug || place.id === slug) return place
    }
  } catch {
    /* */
  }
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (!k?.startsWith(LS_PREFIX)) continue
      const parsed = JSON.parse(localStorage.getItem(k) || '{}') as { data?: Place[] }
      const hit = parsed.data?.find((x) => x.slug === slug || x.id === slug)
      if (hit) return hit
    }
  } catch {
    /* */
  }
  return null
}

export function isOsmPlaceId(id: string | undefined | null): boolean {
  return !!id && (id.startsWith('osm-') || id.includes('osm-'))
}

export function withGuideLinks(place: Place) {
  return {
    place,
    guides: placeGuideLinks(place),
    centerHint: BAHIR_DAR_CENTER,
  }
}
