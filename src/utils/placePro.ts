import type { Place } from '@/types/place'

/** Google-style $ / ETB price-level dots */
export function priceLevelLabel(level: number | null | undefined, isAm?: boolean): string {
  if (level == null || level < 1) return ''
  const n = Math.min(4, Math.max(1, Math.round(level)))
  if (isAm) return 'ብር'.repeat(n)
  return 'ETB '.repeat(n).trim() || '€'.repeat(n)
}

export function priceLevelDots(level: number | null | undefined): string {
  if (level == null || level < 1) return ''
  const n = Math.min(4, Math.max(1, Math.round(level)))
  return '●'.repeat(n) + '○'.repeat(4 - n)
}

/** Default amenities when hotel only has WiFi or empty */
export function resolveAmenities(place: Place): string[] {
  const fromHotel = place.hotel?.amenities?.filter(Boolean) ?? []
  const fromTags = place.tags?.filter(Boolean) ?? []
  const merged = [...new Set([...fromHotel, ...fromTags])]
  if (merged.length > 1 || (merged.length === 1 && merged[0] !== 'WiFi')) return merged

  const slug = place.category?.slug
  if (slug === 'hotel') {
    const stars = place.hotel?.star_rating ?? place.price_level ?? 2
    const base = ['Free Wi‑Fi', 'Parking']
    if (stars >= 3) base.push('Restaurant', 'Room service', 'Air conditioning')
    if (stars >= 4) base.push('Spa', 'Fitness', 'Lake view', 'Airport shuttle')
    if (place.name.toLowerCase().includes('resort') || place.name.toLowerCase().includes('sky')) {
      base.push('Bar', 'Breakfast', 'Conference room', 'Boat tours')
    }
    return [...new Set(base)]
  }
  if (slug === 'restaurant' || slug === 'cafe') {
    return ['Dine-in', 'Wi‑Fi', place.restaurant?.delivery_available ? 'Delivery' : 'Takeaway'].filter(Boolean) as string[]
  }
  if (slug === 'attraction') {
    return ['Photo spots', 'Visitor info']
  }
  return merged
}

export function formatEtbRange(min: number | null | undefined, max: number | null | undefined): string | null {
  if (min == null && max == null) return null
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-ET', { style: 'decimal', maximumFractionDigits: 0 }).format(n)
  if (min != null && max != null) return `ETB ${fmt(min)} – ${fmt(max)}`
  if (min != null) return `From ETB ${fmt(min)}`
  return `Up to ETB ${fmt(max!)}`
}

export function googleMapsPlaceUrl(lat: number, lng: number, name?: string): string {
  const q = name ? encodeURIComponent(name) : `${lat},${lng}`
  return `https://www.google.com/maps/search/?api=1&query=${q}&query_place_id=&center=${lat},${lng}`
}

export async function sharePlace(opts: {
  title: string
  text?: string
  url: string
}): Promise<'shared' | 'copied' | 'failed'> {
  try {
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({ title: opts.title, text: opts.text, url: opts.url })
      return 'shared'
    }
  } catch {
    /* user cancelled or unsupported */
  }
  try {
    await navigator.clipboard.writeText(opts.url)
    return 'copied'
  } catch {
    return 'failed'
  }
}
