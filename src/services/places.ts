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
      console.warn('fetchPlaces supabase:', e)
    }
  }
  return getCuratedPlaces(opts?.categorySlug)
}

function mergeByName(primary: Place[], secondary: Place[]): Place[] {
  const seen = new Set(primary.map((p) => p.name.toLowerCase().trim()))
  const out = [...primary]
  for (const p of secondary) {
    const key = p.name.toLowerCase().trim()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(p)
  }
  return out
}

async function fetchFromSupabase(opts?: {
  categorySlug?: string
  verifiedOnly?: boolean
  limit?: number
}): Promise<Place[]> {
  let q = supabase
    .from('places')
    .select(
      `*, category:categories(*), hotel:hotels(*), restaurant:restaurants(*), attraction:attractions(*), bank:banks(*)`
    )
    .eq('status', 'published')
  if (opts?.verifiedOnly) q = q.eq('verified', true)
  if (opts?.limit) q = q.limit(opts.limit)
  if (opts?.categorySlug) {
    const { data: cats } = await supabase.from('categories').select('id').eq('slug', opts.categorySlug).maybeSingle()
    if (cats?.id) q = q.eq('category_id', cats.id)
  }
  const { data, error } = await q
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
  // Prefer verified curated pins (hotels + tourism) over demo/OSM cache
  const hotel = findCuratedHotelBySlug(slug)
  if (hotel) return hotel
  const tourism = findCuratedTourismBySlug(slug)
  if (tourism) return tourism
  const curated = CURATED_PLACES.find((p) => p.slug === slug)
  if (curated) return curated
  return findCachedOsmPlace(slug)
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

export function findSimilarPlaces(place: Place, pool: Place[], limit = 6): Place[] {
  const lat = place.latitude
  const lng = place.longitude
  const cat = place.category?.slug
  const scored = []
  for (const p of pool) {
    if (p.id === place.id || p.slug === place.slug) continue
    if (!Number.isFinite(p.latitude) || !Number.isFinite(p.longitude)) continue
    if (p.latitude === 0 && p.longitude === 0) continue
    const dist = distanceMeters(lat, lng, p.latitude, p.longitude)
    let score = 0
    if (cat && p.category?.slug === cat) score += 50
    if (dist < 500) score += 40
    else if (dist < 1500) score += 25
    else if (dist < 4000) score += 10
    else score += Math.max(0, 5 - dist / 10000)
    scored.push({ p, score, dist })
  }
  scored.sort((a, b) => b.score - a.score || a.dist - b.dist)
  return scored.slice(0, limit).map((x) => x.p)
}
