import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Place, Category, PlaceWithDistance } from '@/types/place'
import { distanceMeters } from '@/utils/geo'
import { DEMO_PLACES, demoPlacesByCategory, CURATED_PLACES } from './demoPlaces'
import { findCuratedHotelBySlug } from './curatedHotels'
import { findCachedOsmPlace } from './osmPlaces'

export { DEMO_PLACES, CURATED_PLACES }

export class PlacesFetchError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PlacesFetchError'
  }
}

/** Instant guide data — never blocks on network */
export function getCuratedPlaces(categorySlug?: string): Place[] {
  if (categorySlug) return demoPlacesByCategory(categorySlug)
  return CURATED_PLACES
}

/**
 * Fast path for lists:
 * 1) Supabase (short timeout) when configured
 * 2) Curated Bahir Dar guide data (always instant fallback)
 *
 * Live OpenStreetMap is loaded separately via useOsmPlaces (cached).
 */
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
        // Merge curated hotels so the user list always appears even with DB data
        if (!opts?.categorySlug || opts.categorySlug === 'hotel') {
          return mergeByName(rows, getCuratedPlaces(opts?.categorySlug === 'hotel' ? 'hotel' : undefined))
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
  const seen = new Set(primary.map((p) => p.name.toLowerCase().replace(/\s+/g, ' ').trim()))
  const out = [...primary]
  for (const p of secondary) {
    const key = p.name.toLowerCase().replace(/\s+/g, ' ').trim()
    // Match base English name before " · " Amharic suffix
    const base = key.split(' · ')[0]
    if (seen.has(key) || seen.has(base)) continue
    if ([...seen].some((s) => s.includes(base) || base.includes(s.split(' · ')[0]))) continue
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

function sleepReject(ms: number, msg: string): Promise<never> {
  return new Promise((_, rej) => setTimeout(() => rej(new Error(msg)), ms))
}

function normalizePlace(row: Record<string, unknown>): Place {
  const one = <T>(v: T | T[] | null | undefined): T | null =>
    Array.isArray(v) ? v[0] ?? null : v ?? null
  return {
    ...(row as unknown as Place),
    hotel: one(row.hotel as Place['hotel']),
    restaurant: one(row.restaurant as Place['restaurant']),
    attraction: one(row.attraction as Place['attraction']),
    bank: one(row.bank as Place['bank']),
  }
}

export async function fetchCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured) return []
  const { data, error } = await supabase.from('categories').select('*').order('sort_order')
  if (error) throw new PlacesFetchError(error.message)
  return (data ?? []) as Category[]
}

export async function fetchPlaceBySlug(slug: string): Promise<Place | null> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
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
        .eq('slug', slug)
        .eq('status', 'published')
        .is('deleted_at', null)
        .maybeSingle()

      if (!error && data) return normalizePlace(data as Record<string, unknown>)
    } catch (e) {
      console.warn('fetchPlaceBySlug supabase:', e)
    }
  }

  const hotel = findCuratedHotelBySlug(slug)
  if (hotel) return hotel

  const curated = CURATED_PLACES.find((p) => p.slug === slug)
  if (curated) return curated

  if (slug.startsWith('osm-') || slug.includes('osm-')) {
    return findCachedOsmPlace(slug)
  }

  return DEMO_PLACES.find((p) => p.slug === slug) ?? null
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
