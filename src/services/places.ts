import type { Place, PlaceWithDistance } from '@/types/place'
import { distanceMeters } from '@/utils/geo'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import { DEMO_PLACES, demoPlacesByCategory, CURATED_PLACES } from './demoPlaces'
import { CURATED_HOTELS } from './curatedHotels'
import { CURATED_TOURISM_PLACES } from './curatedTourism'

export { DEMO_PLACES, CURATED_PLACES }

function mergeByName(primary: Place[], secondary: Place[]): Place[] {
  const seen = new Set(primary.map((p) => (p.name || '').toLowerCase().trim()))
  const out = [...primary]
  for (const p of secondary) {
    const key = (p.name || '').toLowerCase().trim()
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(p)
  }
  return out
}

export function getCuratedPlaces(categorySlug?: string): Place[] {
  if (categorySlug) return demoPlacesByCategory(categorySlug)
  return CURATED_PLACES
}

export async function fetchPlaces(opts?: { categorySlug?: string }): Promise<Place[]> {
  if (!isSupabaseConfigured || !supabase) {
    return getCuratedPlaces(opts?.categorySlug)
  }
  try {
    let q = supabase.from('places').select('*, category:categories(*)').eq('is_active', true)
    if (opts?.categorySlug) {
      q = q.eq('category.slug', opts.categorySlug)
    }
    const { data, error } = await q.limit(500)
    if (error) throw error
    const rows = (data as Place[]) || []
    if (rows.length > 0) {
      if (opts?.categorySlug === 'hotel') return mergeByName(CURATED_HOTELS, rows)
      if (opts?.categorySlug === 'attraction') return mergeByName(CURATED_TOURISM_PLACES, rows)
      return mergeByName(getCuratedPlaces(opts?.categorySlug), rows)
    }
  } catch {
    /* fall through */
  }
  return getCuratedPlaces(opts?.categorySlug)
}

export async function fetchPlaceBySlug(slug: string): Promise<Place | null> {
  if (!slug) return null
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('places')
        .select('*, category:categories(*)')
        .eq('slug', slug)
        .maybeSingle()
      if (!error && data) return data as Place
    } catch {
      /* fall through */
    }
  }
  const curated = CURATED_PLACES.find((p) => p.slug === slug)
  if (curated) return curated
  return (
    CURATED_TOURISM_PLACES.find((p) => p.slug === slug) ??
    CURATED_HOTELS.find((p) => p.slug === slug) ??
    null
  )
}

export async function fetchCategories() {
  if (!isSupabaseConfigured || !supabase) return []
  try {
    const { data, error } = await supabase.from('categories').select('*').order('name')
    if (error) throw error
    return data || []
  } catch {
    return []
  }
}

export function rankNearby(
  places: Place[],
  lat: number,
  lng: number,
  radiusM = 5000
): PlaceWithDistance[] {
  return places
    .map((p) => ({
      ...p,
      distance_m: distanceMeters(lat, lng, p.latitude, p.longitude),
    }))
    .filter((p) => p.distance_m <= radiusM)
    .sort((a, b) => a.distance_m - b.distance_m)
}

export function searchPlaces(places: Place[], query: string): Place[] {
  const q = query.trim().toLowerCase()
  if (!q) return places
  return places.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.short_description?.toLowerCase().includes(q) ||
      p.address?.toLowerCase().includes(q) ||
      p.category?.name?.toLowerCase().includes(q) ||
      p.category?.slug?.includes(q)
  )
}

export function placesOrDemo(data: Place[], categorySlug?: string): Place[] {
  if (data.length > 0) return data
  return getCuratedPlaces(categorySlug)
}

/** Related category groups for similarity (shared tourism intent). */
const RELATED_CATEGORY_GROUPS: string[][] = [
  ['hotel', 'guest_house', 'lodge', 'hostel'],
  ['restaurant', 'cafe', 'food', 'bar'],
  ['attraction', 'tourism', 'viewpoint', 'museum', 'historic', 'monument', 'park'],
  ['bank', 'atm'],
  ['hospital', 'pharmacy', 'clinic', 'doctors'],
  ['taxi', 'bus_station', 'transport', 'ferry_terminal'],
  ['marketplace', 'shop', 'supermarket'],
]

function categoriesRelated(a: string, b: string): boolean {
  if (!a || !b) return false
  if (a === b) return true
  return RELATED_CATEGORY_GROUPS.some((g) => g.includes(a) && g.includes(b))
}

export type SimilarPlace = Place & { distance_m: number }

/**
 * Rank real similar places for a detail page.
 * Priority: same/related category + geographic closeness + verified/featured.
 * Works offline against any candidate pool (API + curated + OSM cache).
 */
export function findSimilarPlaces(
  place: Place,
  candidates: Place[],
  limit = 6
): SimilarPlace[] {
  const selfId = place.id
  const selfSlug = (place.slug || '').toLowerCase()
  const cat = (place.category?.slug || '').toLowerCase()
  const type = (place.attraction?.attraction_type || '').toLowerCase()
  const lat = place.latitude
  const lng = place.longitude

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return []
  }

  const scored: Array<SimilarPlace & { _score: number }> = []

  for (const p of candidates) {
    if (!p || p.id === selfId) continue
    if ((p.slug || '').toLowerCase() === selfSlug) continue
    if (!Number.isFinite(p.latitude) || !Number.isFinite(p.longitude)) continue

    const dist = distanceMeters(lat, lng, p.latitude, p.longitude)
    // Skip far-away noise outside Bahir Dar metro (~25 km)
    if (dist > 25_000) continue

    const pCat = (p.category?.slug || '').toLowerCase()
    const pType = (p.attraction?.attraction_type || '').toLowerCase()
    let score = 0

    if (cat && pCat === cat) score += 100
    else if (cat && pCat && categoriesRelated(cat, pCat)) score += 45

    if (type && pType && type === pType) score += 55

    if (dist < 400) score += 45
    else if (dist < 1200) score += 35
    else if (dist < 3000) score += 25
    else if (dist < 7000) score += 12
    else score += 4

    if (p.verified) score += 10
    if (p.featured) score += 6
    if (p.name && !p.name.includes('(DEMO)')) score += 5

    // Light name-token overlap (e.g. "Lake Tana" sites)
    const tokens = (place.name || '')
      .toLowerCase()
      .replace(/[^a-z0-9\u1200-\u137f\s]/gi, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 3)
    const pname = (p.name || '').toLowerCase()
    for (const t of tokens.slice(0, 6)) {
      if (pname.includes(t)) score += 8
    }

    scored.push({ ...p, distance_m: dist, _score: score })
  }

  scored.sort((a, b) => b._score - a._score || a.distance_m - b.distance_m)
  return scored.slice(0, limit).map(({ _score, ...rest }) => rest)
}
