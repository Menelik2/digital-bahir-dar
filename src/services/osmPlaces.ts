/**
 * Live Bahir Dar places from OpenStreetMap via Overpass API.
 * Axios-style HTTP client (src/services/http.ts).
 *
 * Categories: hotel, restaurant, cafe, attraction, transport, bank, atm, hospital, pharmacy
 * Attribution: © OpenStreetMap contributors (ODbL)
 */

import { http } from '@/services/http'
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

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
]

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

  const place: Place = {
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

  return place
}

async function postOverpass(query: string): Promise<OverpassResponse> {
  let lastError: unknown
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const client = http.create({
        baseURL: endpoint,
        timeout: 28_000,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      // Overpass expects form body: data=<query>
      const body = `data=${encodeURIComponent(query)}`
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body,
        signal: AbortSignal.timeout(28_000),
      })
      if (!res.ok) throw new Error(`Overpass ${res.status}`)
      const data = (await res.json()) as OverpassResponse
      void client
      return data
    } catch (e) {
      lastError = e
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Overpass request failed')
}

/**
 * Fetch live POIs for Bahir Dar (hotels, restaurants, cafés, travel, transport, …).
 *
 * @example
 * const hotels = await fetchOsmPlaces({ categories: ['hotel'] })
 * const food = await fetchOsmPlaces({ categories: ['restaurant', 'cafe'] })
 */
export async function fetchOsmPlaces(opts?: {
  categories?: OsmCategory[]
  limit?: number
}): Promise<Place[]> {
  const categories = opts?.categories?.length ? opts.categories : (['all'] as OsmCategory[])
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
  return opts?.limit ? places.slice(0, opts.limit) : places
}

/** Convenience helpers */
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
