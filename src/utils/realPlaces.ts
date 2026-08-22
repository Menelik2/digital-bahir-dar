import type { Place } from '@/types/place'

/** Commercial / planning fixtures that should not appear as "real" map businesses */
const DEMO_ID_PREFIXES = ['demo-hotel', 'demo-rest', 'demo-cafe', 'demo-bank', 'demo-atm']

/** True for placeholder commercial DEMO rows (not real OSM/Supabase businesses) */
export function isDemoCommercialPlace(place: Place): boolean {
  if (place.name.includes('(DEMO)')) return true
  if (place.id.startsWith('demo-hotel')) return true
  if (place.id.startsWith('demo-rest')) return true
  if (place.id.startsWith('demo-cafe')) return true
  if (place.id.startsWith('demo-bank')) return true
  if (place.id.startsWith('demo-atm')) return true
  if (place.slug?.includes('-demo')) return true
  return DEMO_ID_PREFIXES.some((p) => place.id.startsWith(p))
}

/** Keep real landmarks + OSM + Supabase; drop fake hotels/restaurants */
export function filterRealPlaces(places: Place[]): Place[] {
  return places.filter((p) => !isDemoCommercialPlace(p))
}

export function displayPlaceName(name: string): string {
  return name.replace(/\s*\(DEMO\)\s*/gi, '').trim()
}
