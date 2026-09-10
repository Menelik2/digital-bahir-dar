import type { Place } from '@/types/place'
import { ALL_HOTELS, estimateHotelPriceEtb } from '@/data/allHotels'

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\u1200-\u137f]+/gi, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64)
}

const HOTEL_CAT = {
  id: 'curated-hotel',
  name: 'Hotels',
  slug: 'hotel',
  icon: 'Hotel',
  description: null as string | null,
  sort_order: 1,
  name_am: 'ሆቴሎች',
}

const now = () => new Date().toISOString()

/** Real hotel listings (not DEMO planning fixtures) */
export const CURATED_HOTELS: Place[] = ALL_HOTELS.map((h, i) => {
  const id = `curated-hotel-${i + 1}`
  const slug = `${slugify(h.name)}-${i + 1}`
  return {
    id,
    name: h.name,
    name_am: h.nameAm ?? null,
    slug,
    category_id: HOTEL_CAT.id,
    description:
      `${h.name} · ${h.address ?? 'Bahir Dar, Ethiopia'}. ` +
      `Map pin uses verified coordinates for this hotel.`,
    description_am: h.nameAm
      ? `${h.nameAm} · ${h.address ?? 'ባሕር ዳር'}። ካርታው የተረጋገጠ መጋጠሚያ ይጠቀማል።`
      : null,
    short_description: h.nameAm ? `${h.nameAm} · Hotel` : 'Hotel · Bahir Dar',
    short_description_am: h.nameAm ? `${h.nameAm} · ሆቴል` : 'ሆቴል · ባሕር ዳር',
    address: h.address ?? 'Bahir Dar, Ethiopia',
    address_am: 'ባሕር ዳር፣ ኢትዮጵያ',
    latitude: h.lat,
    longitude: h.lng,
    phone: null,
    email: null,
    website: h.mapsUrl,
    price_level: h.stars && h.stars >= 4 ? 4 : h.stars && h.stars >= 3 ? 3 : 2,
    entrance_fee: null,
    currency: 'ETB',
    verified: true,
    featured: !!h.featured,
    status: 'published' as const,
    created_at: now(),
    updated_at: now(),
    category: HOTEL_CAT,
    hotel: {
      id: `curated-h-${i + 1}`,
      place_id: id,
      star_rating: h.stars ?? null,
      minimum_price: h.priceFrom ?? estimateHotelPriceEtb(h.stars).from,
      maximum_price: h.priceTo ?? estimateHotelPriceEtb(h.stars).to,
      amenities: ['WiFi'],
      check_in: null,
      check_out: null,
    },
  }
})

export function findCuratedHotelBySlug(slug: string): Place | null {
  return CURATED_HOTELS.find((p) => p.slug === slug) ?? null
}
