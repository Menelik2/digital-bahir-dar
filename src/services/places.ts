import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Place, Category, PlaceWithDistance } from '@/types/place'
import { distanceMeters } from '@/utils/geo'
import { DEMO_PLACES, demoPlacesByCategory } from './demoPlaces'
import { findCachedOsmPlace } from './osmPlaces'

export { DEMO_PLACES }

export class PlacesFetchError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PlacesFetchError'
  }
}

export async function fetchPlaces(opts?: {
  categorySlug?: string
  verifiedOnly?: boolean
  limit?: number
}): Promise<Place[]> {
  if (!isSupabaseConfigured) {
    return placesOrDemo([], opts?.categorySlug)
  }

  let query = supabase
    .from('places')
    .select(`
      *,
      category:categories(*),
      hotel:hotels(*),
      restaurant:restaurants(*),
      attraction:attractions(*),
      bank:banks(*)
    `)
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
    const { data, error } = await supabase
      .from('places')
      .select(`
        *,
        category:categories(*),
        hotel:hotels(*),
        restaurant:restaurants(*),
        attraction:attractions(*),
        bank:banks(*)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .is('deleted_at', null)
      .maybeSingle()

    if (error) console.warn('fetchPlaceBySlug:', error.message)
    if (data) return normalizePlace(data as Record<string, unknown>)
  }
  if (slug.startsWith('osm-')) return findCachedOsmPlace(slug)
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

/** Only when Supabase is empty or offline — never on query error. */
export function placesOrDemo(data: Place[], categorySlug?: string): Place[] {
  if (data.length > 0) return data
  if (categorySlug) return demoPlacesByCategory(categorySlug)
  return DEMO_PLACES
}
