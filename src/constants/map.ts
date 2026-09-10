import { BAHIR_DAR_CENTER } from '@/constants'

/**
 * Bahir Dar region viewport — map is locked here (no world panning).
 * Covers city + Zege monasteries + Blue Nile Falls day-trip (matches OSM bbox).
 * Leaflet uses [lat, lng]; Mapbox GL uses [lng, lat].
 */
/** Region lock: city + Zege monasteries + Blue Nile Falls day-trip (matches OSM bbox) */
export const BAHIR_DAR_MAX_BOUNDS: [[number, number], [number, number]] = [
  [11.45, 37.28], // SW — lat, lng (Leaflet)
  [11.72, 37.62], // NE
]

/** Mapbox GL maxBounds: [SW, NE] as [lng, lat] */
export const BAHIR_DAR_MAX_BOUNDS_GL: [[number, number], [number, number]] = [
  [37.28, 11.45],
  [37.62, 11.72],
]

export const BAHIR_DAR_MIN_ZOOM = 11
export const BAHIR_DAR_MAX_ZOOM = 18
export const BAHIR_DAR_DEFAULT_ZOOM = 13

export const MAPBOX_STYLES = {
  streets: 'mapbox://styles/mapbox/streets-v12',
  outdoors: 'mapbox://styles/mapbox/outdoors-v12',
  light: 'mapbox://styles/mapbox/light-v11',
  dark: 'mapbox://styles/mapbox/dark-v11',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
} as const

/** Raster tile style paths for Leaflet + Mapbox tiles API */
export const MAPBOX_RASTER_STYLES = {
  streets: 'mapbox/streets-v12',
  outdoors: 'mapbox/outdoors-v12',
  light: 'mapbox/light-v11',
  dark: 'mapbox/dark-v11',
  satellite: 'mapbox/satellite-streets-v12',
} as const

export type MapboxStyleId = keyof typeof MAPBOX_STYLES

/** Public token from env — required for Mapbox GL / tiles */
export function getMapboxToken(): string | null {
  const t = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string | undefined
  if (!t || !t.trim() || t.includes('your-')) return null
  return t.trim()
}

export function mapboxTileUrl(stylePath: string, token: string): string {
  return `https://api.mapbox.com/styles/v1/${stylePath}/tiles/512/{z}/{x}/{y}@2x?access_token=${token}`
}

export function mapboxAttribution(): string {
  return (
    '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> ' +
    '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
    '<a href="https://www.mapbox.com/map-feedback/">Improve this map</a>'
  )
}

export { BAHIR_DAR_CENTER }
