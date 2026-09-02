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
  const slug = slugify(s.name) || `tourism-${i}`

  const historyParts = [
    s.highlights?.length ? `Highlights: ${s.highlights.join(' · ')}` : null,
    s.tips.length ? `Tips: ${s.tips.join(' · ')}` : null,
    s.howToGet ? `How to get there: ${s.howToGet}` : null,
    s.whatToBring?.length ? `Bring: ${s.whatToBring.join(', ')}` : null,
    s.nearby?.length ? `Nearby: ${s.nearby.join(' · ')}` : null,
  ].filter(Boolean)

  return {
    id,
    name: display,
    slug,
    category_id: CAT.id,
    description: s.description,
    short_description: s.short,
    address: s.address,
    latitude: s.lat,
    longitude: s.lng,
    phone: null,
    email: null,
    website: null,
    price_level: s.entryFeeEtb && s.entryFeeEtb > 0 ? 2 : 1,
    entrance_fee: s.entryFeeEtb ?? null,
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
      entrance_fee: s.entryFeeEtb ?? null,
      recommended_duration: s.duration,
      best_time_to_visit: s.bestTime,
      historical_information: historyParts.join('\n\n'),
      safety_information: s.dressCode
        ? `${s.dressCode}. ${s.costHint}`
        : s.costHint,
      accessibility: s.howToGet,
    },
  }
})

export function findCuratedTourismBySlug(slug: string): Place | null {
  return CURATED_TOURISM_PLACES.find((p) => p.slug === slug) ?? null
}

export function similarTourismPlaces(slug: string, limit = 4): Place[] {
  const current = findCuratedTourismBySlug(slug)
  if (!current) return CURATED_TOURISM_PLACES.filter((p) => p.featured).slice(0, limit)
  const type = current.attraction?.attraction_type
  const same = CURATED_TOURISM_PLACES.filter(
    (p) => p.slug !== slug && p.attraction?.attraction_type === type
  )
  const rest = CURATED_TOURISM_PLACES.filter(
    (p) => p.slug !== slug && p.attraction?.attraction_type !== type
  )
  return [...same, ...rest].slice(0, limit)
}
