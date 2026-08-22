import { supabase } from '@/lib/supabase'
import type { Place, Category, PlaceWithDistance } from '@/types/place'
import { distanceMeters } from '@/utils/geo'
import { BAHIR_DAR_CENTER } from '@/constants'

export async function fetchPlaces(opts?: {
  categorySlug?: string
  verifiedOnly?: boolean
  limit?: number
}): Promise<Place[]> {
  let query = supabase
    .from('places')
    .select('*, category:categories(*)')
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('featured', { ascending: false })
    .order('name')

  if (opts?.verifiedOnly) query = query.eq('verified', true)
  if (opts?.limit) query = query.limit(opts.limit)

  if (opts?.categorySlug) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', opts.categorySlug)
      .single()
    if (cat) query = query.eq('category_id', cat.id)
  }

  const { data, error } = await query
  if (error) {
    console.warn('fetchPlaces error (using empty until seed exists):', error.message)
    return []
  }
  return (data ?? []) as Place[]
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')
  if (error) {
    console.warn('fetchCategories error:', error.message)
    return []
  }
  return (data ?? []) as Category[]
}

export async function fetchPlaceBySlug(slug: string): Promise<Place | null> {
  const { data, error } = await supabase
    .from('places')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .is('deleted_at', null)
    .single()
  if (error) return null
  return data as Place
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

/** Fallback demo places when DB is empty (clearly marked DEMO) */
export const DEMO_PLACES: Place[] = [
  {
    id: 'demo-lake-tana',
    name: 'Lake Tana (DEMO)',
    slug: 'lake-tana-demo',
    category_id: 'demo-attraction',
    description: "DEMO DATA — Ethiopia's largest lake. Home to ancient monasteries on islands.",
    short_description: 'Largest lake in Ethiopia',
    address: 'Bahir Dar, Amhara',
    latitude: 11.6167,
    longitude: 37.4,
    phone: null,
    email: null,
    website: null,
    price_level: null,
    entrance_fee: null,
    currency: 'ETB',
    verified: false,
    featured: true,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: 'demo-attraction', name: 'Attractions', slug: 'attraction', icon: 'Landmark', description: null, sort_order: 4 },
  },
  {
    id: 'demo-blue-nile',
    name: 'Blue Nile Falls Viewpoint (DEMO)',
    slug: 'blue-nile-falls-demo',
    category_id: 'demo-attraction',
    description: 'DEMO DATA — Tissisat Falls viewpoint. Verify current access and fees locally.',
    short_description: 'Tissisat — the smoking water',
    address: 'Near Bahir Dar',
    latitude: 11.489,
    longitude: 37.587,
    phone: null,
    email: null,
    website: null,
    price_level: 2,
    entrance_fee: null,
    currency: 'ETB',
    verified: false,
    featured: true,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: 'demo-attraction', name: 'Attractions', slug: 'attraction', icon: 'Landmark', description: null, sort_order: 4 },
  },
  {
    id: 'demo-center',
    name: 'Bahir Dar City Center (DEMO)',
    slug: 'bahir-dar-center-demo',
    category_id: 'demo-attraction',
    description: 'DEMO DATA — Approximate city center reference point.',
    short_description: 'City center',
    address: 'Bahir Dar',
    latitude: BAHIR_DAR_CENTER.lat,
    longitude: BAHIR_DAR_CENTER.lng,
    phone: null,
    email: null,
    website: null,
    price_level: null,
    entrance_fee: null,
    currency: 'ETB',
    verified: false,
    featured: false,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: 'demo-attraction', name: 'Attractions', slug: 'attraction', icon: 'Landmark', description: null, sort_order: 4 },
  },
]
