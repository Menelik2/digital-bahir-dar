/**
 * In-app routing via public OSRM (no Google Maps site redirect).
 * Geometry is drawn on the Leaflet map inside Digital Bahir Dar.
 */

export type TravelMode = 'walking' | 'driving'

export type RouteResult = {
  coordinates: [number, number][] // [lat, lng] for Leaflet
  distanceM: number
  durationSec: number
}

const OSRM = 'https://router.project-osrm.org/route/v1'

export async function fetchRoute(
  origin: { lat: number; lng: number },
  dest: { lat: number; lng: number },
  mode: TravelMode = 'walking',
  signal?: AbortSignal
): Promise<RouteResult | null> {
  const profile = mode === 'driving' ? 'driving' : 'foot'
  const url =
    `${OSRM}/${profile}/${origin.lng},${origin.lat};${dest.lng},${dest.lat}` +
    `?overview=full&geometries=geojson&steps=false`

  try {
    const res = await fetch(url, { signal })
    if (!res.ok) return null
    const data = (await res.json()) as {
      code?: string
      routes?: Array<{
        distance: number
        duration: number
        geometry?: { coordinates?: [number, number][] }
      }>
    }
    if (data.code !== 'Ok' || !data.routes?.[0]?.geometry?.coordinates?.length) {
      return null
    }
    const route = data.routes[0]
    // GeoJSON is [lng, lat] → Leaflet wants [lat, lng]
    const coordinates = route.geometry.coordinates!.map(
      ([lng, lat]) => [lat, lng] as [number, number]
    )
    return {
      coordinates,
      distanceM: route.distance,
      durationSec: route.duration,
    }
  } catch {
    return null
  }
}

/** Build in-app map directions URL (stays in Digital Bahir Dar) */
export function inAppDirectionsPath(
  dest: { latitude: number; longitude: number; name?: string; id?: string },
  mode: TravelMode = 'walking'
) {
  const p = new URLSearchParams()
  p.set('to', `${dest.latitude},${dest.longitude}`)
  p.set('mode', mode)
  if (dest.name) p.set('name', dest.name.replace(/\s*\(DEMO\)\s*/gi, '').trim())
  if (dest.id) p.set('placeId', dest.id)
  return `/map?${p.toString()}`
}

/** Optional: open native Google Maps *app* (not the website in a new tab as primary flow) */
export function googleMapsDirectionsUrl(
  dest: { latitude: number; longitude: number },
  origin?: { lat: number; lng: number } | null,
  mode: TravelMode = 'walking'
) {
  const travelmode = mode === 'walking' ? 'walking' : 'driving'
  let url = `https://www.google.com/maps/dir/?api=1&destination=${dest.latitude},${dest.longitude}&travelmode=${travelmode}`
  if (origin) url += `&origin=${origin.lat},${origin.lng}`
  return url
}
