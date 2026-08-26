import type { Place } from '@/types/place'
import { LOCAL_TOURISM_SITES } from '@/data/localTourism'

const CAT = {
  id: 'curated-attraction',
  name: 'Attractions',
  slug: 'attraction',
  icon: 'Landmark',
  description: null as string | null,
  sort_order: 4,
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\u1200-\u137f]+/gi, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 72)
}

const now = () => new Date().toISOString()

/** Local tourism sites as Place rows for lists, map, and detail */
export const CURATED_TOURISM_PLACES: Place[] = LOCAL_TOURISM_SITES.map((s, i) => {
  const id = `curated-tourism-${s.id}`
  const display = s.nameAm ? `${s.name} · ${s.nameAm}` : s.name
  return {
    id,
    name: display,
    slug: slugify(s.name) || `tourism-${i}`,
    category_id: CAT.id,
    description: s.description,
    short_description: s.short,
    address: s.address,
    latitude: s.lat,
    longitude: s.lng,
    phone: null,
    email: null,
    website: null,
    price_level: 2,
    entrance_fee: null,
    currency: 'ETB',
    verified: true,
    featured: !!s.featured,
    status: 'published' as const,
    created_at: now(),
    updated_at: now(),
    category: CAT,
    attraction: {
      id: `curated-att-${s.id}`,
      place_id: id,
      attraction_type: s.category,
      entrance_fee: null,
      recommended_duration: s.duration,
      best_time_to_visit: s.bestTime,
      historical_information: s.tips.join(' · '),
      safety_information: s.dressCode ?? null,
      accessibility: null,
    },
  }
})

export function findCuratedTourismBySlug(slug: string): Place | null {
  return CURATED_TOURISM_PLACES.find((p) => p.slug === slug) ?? null
}
