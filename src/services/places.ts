import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Place, Category, PlaceWithDistance } from '@/types/place'
import { distanceMeters } from '@/utils/geo'
import { DEMO_PLACES, demoPlacesByCategory, CURATED_PLACES } from './demoPlaces'
import { findCuratedHotelBySlug } from './curatedHotels'
import { findCuratedTourismBySlug } from './curatedTourism'
import { findCachedOsmPlace } from './osmPlaces'

export { DEMO_PLACES, CURATED_PLACES }

export class PlacesFetchError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PlacesFetchError'
  }
}

export function getCuratedPlaces(categorySlug?: string): Place[] {
  if (categorySlug) return demoPlacesByCategory(categorySlug)
  return CURATED_PLACES
}

export async function fetchPlaces(opts?: {
  categorySlug?: string
  verifiedOnly?: boolean
  limit?: number
}): Promise<Place[]> {
  if (isSupabaseConfigured) {
    try {
      const rows = await Promise.race([
        fetchFromSupabase(opts),
        sleepReject(4000, 'Supabase timeout'),
      ])
      if (rows.length > 0) {
        if (!opts?.categorySlug || opts.categorySlug === 'hotel' || opts.categorySlug === 'attraction') {
          return mergeByName(getCuratedPlaces(opts?.categorySlug), rows)
        }
        return rows
      }
    } catch (e) {
      console.warn('places supabase:', e)
    }
  }

  return getCuratedPlaces(opts?.categorySlug)
}

function mergeByName(primary: Place[], secondary: Place[]): Place[] {
  const seen = new Set(
    primary.map((p) => p.name.toLowerCase().replace(/\s+/g, ' ').trim().split(' · ')[0])
  )
  const out = [...primary]
  for (const p of secondary) {
    const base = p.name.toLowerCase().replace(/\s+/g, ' ').trim().split(' · ')[0]
    if (seen.has(base)) continue
    seen.add(base)
    out.push(p)
  }
  return out
}

async function fetchFromSupabase(opts?: {
  categorySlug?: string
  verifiedOnly?: boolean
  limit?: number
}): Promise<Place[]> {
  let query = supabase
    .from('places')
    .select(
      `
        *,
        category:categories(*),
        hotel:hotels(*),
        restaurant:restaurants(*),
        attraction:attractions(*),
        bank:banks(*)
      `
    )
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('featured', { ascending: false })
    .order('name')

  if (opts?.verifiedOnly) query = query.eq('verified', true)
  if (opts?.limit) query = query.limit(opts.limit)

  if (opts?.categorySlug) {
    const { data: cat, error: catErr } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', opts.categorySlug)
      .maybeSingle()
    if (catErr) throw new PlacesFetchError(catErr.message)
    if (cat) query = query.eq('category_id', cat.id)
  }

  const { data, error } = await query
  if (error) throw new PlacesFetchError(error.message)
  return (data ?? []).map(normalizePlace) as Place[]
}

function normalizePlace(row: Record<string, unknown>): Place {
  const lat = Number(row.latitude)
  const lng = Number(row.longitude)
  // Fix swapped coords if needed (Bahir Dar: lat ~11, lng ~37)
  let latitude = lat
  let longitude = lng
  if (Number.isFinite(lat) && Number.isFinite(lng) && lat > 20 && lng < 20 && lng > 5) {
    latitude = lng
    longitude = lat
  }
  return {
    ...(row as unknown as Place),
    latitude: Number.isFinite(latitude) ? latitude : 0,
    longitude: Number.isFinite(longitude) ? longitude : 0,
  }
}

function sleepReject(ms: number, message: string): Promise<never> {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms))
}

export async function fetchPlaceBySlug(slug: string): Promise<Place | null> {
  if (!slug) return null
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('places')
        .select(
          `*, category:categories(*), hotel:hotels(*), restaurant:restaurants(*), attraction:attractions(*), bank:banks(*)`
        )
        .eq('slug', slug)
        .maybeSingle()
      if (!error && data) return normalizePlace(data as Record<string, unknown>)
    } catch (e) {
      console.warn('place by slug:', e)
    }
  }
  const curated = CURATED_PLACES.find((p) => p.slug === slug)
  if (curated) return curated
  return findCuratedTourismBySlug(slug) ?? findCuratedHotelBySlug(slug) ?? findCachedOsmPlace(slug)
}

export async function fetchCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured) return []
  try {
    const { data, error } = await supabase.from('categories').select('*').order('name')
    if (error) throw new PlacesFetchError(error.message)
    return (data ?? []) as Category[]
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

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return []

  const scored: Array<SimilarPlace & { _score: number }> = []

  for (const p of candidates) {
    if (!p || p.id === selfId) continue
    if ((p.slug || '').toLowerCase() === selfSlug) continue
    if (!Number.isFinite(p.latitude) || !Number.isFinite(p.longitude)) continue

    const dist = distanceMeters(lat, lng, p.latitude, p.longitude)
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
