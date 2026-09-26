/**
 * Official Google Places API (New) — Place Photos.
 * Requires VITE_GOOGLE_PLACES_API_KEY with Places API (New) enabled + billing.
 * We do NOT scrape Google Maps tiles or undocumented endpoints.
 */

const KEY = (import.meta.env.VITE_GOOGLE_PLACES_API_KEY as string | undefined)?.trim() || ''

export function googlePlacesApiEnabled(): boolean {
  return KEY.length > 10
}

type CacheEntry = { url: string; at: number }
const mem = new Map<string, CacheEntry>()
const LS_PREFIX = 'dbd-gphoto:'
const TTL_MS = 7 * 24 * 60 * 60 * 1000

function cacheGet(key: string): string | null {
  const m = mem.get(key)
  if (m && Date.now() - m.at < TTL_MS) return m.url
  try {
    const raw = localStorage.getItem(LS_PREFIX + key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CacheEntry
    if (Date.now() - parsed.at < TTL_MS && parsed.url) {
      mem.set(key, parsed)
      return parsed.url
    }
  } catch {
    /* ignore */
  }
  return null
}

function cacheSet(key: string, url: string) {
  const entry = { url, at: Date.now() }
  mem.set(key, entry)
  try {
    localStorage.setItem(LS_PREFIX + key, JSON.stringify(entry))
  } catch {
    /* ignore */
  }
}

/**
 * Resolve a Place Photo media URL for a business near Bahir Dar.
 * Returns null if no key, no photo, or request fails.
 */
export async function fetchGooglePlacePhotoUrl(
  name: string,
  opts?: { lat?: number; lng?: number; maxHeightPx?: number },
): Promise<string | null> {
  if (!googlePlacesApiEnabled() || !name.trim()) return null

  const cacheKey = `${name}|${opts?.lat ?? ''}|${opts?.lng ?? ''}`
  const hit = cacheGet(cacheKey)
  if (hit) return hit

  const maxH = opts?.maxHeightPx ?? 800
  const body: Record<string, unknown> = {
    textQuery: `${name} Bahir Dar Ethiopia`,
    pageSize: 1,
    languageCode: 'en',
  }
  if (opts?.lat != null && opts?.lng != null) {
    body.locationBias = {
      circle: {
        center: { latitude: opts.lat, longitude: opts.lng },
        radius: 2000,
      },
    }
  }

  try {
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': KEY,
        'X-Goog-FieldMask': 'places.name,places.photos,places.displayName',
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) return null
    const data = (await res.json()) as {
      places?: { name?: string; photos?: { name?: string }[] }[]
    }
    const photoName = data.places?.[0]?.photos?.[0]?.name
    if (!photoName) return null

    const mediaUrl =
      `https://places.googleapis.com/v1/${photoName}/media` +
      `?maxHeightPx=${maxH}&key=${encodeURIComponent(KEY)}`

    cacheSet(cacheKey, mediaUrl)
    return mediaUrl
  } catch {
    return null
  }
}
