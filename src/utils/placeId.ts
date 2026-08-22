import { isOsmPlaceId } from '@/services/osmPlaces'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/** True if place id can be stored in Supabase (real UUID, not DEMO/OSM). */
export function isPersistedPlaceId(id: string | undefined | null): boolean {
  if (!id) return false
  if (id.startsWith('demo-')) return false
  if (isOsmPlaceId(id)) return false
  return UUID_RE.test(id)
}
