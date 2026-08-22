import { BAHIR_DAR_CENTER } from '@/constants'

/**
 * Bahir Dar city viewport — map is locked here (no world panning).
 * Slight pad so lakeshore + central districts stay usable.
 */
export const BAHIR_DAR_MAX_BOUNDS: [[number, number], [number, number]] = [
  [11.52, 37.30], // SW — lat, lng
  [11.66, 37.48], // NE
]

export const BAHIR_DAR_MIN_ZOOM = 12
export const BAHIR_DAR_MAX_ZOOM = 18
export const BAHIR_DAR_DEFAULT_ZOOM = 13

export const MAPBOX_STYLES = {
  streets: 'mapbox/streets-v12',
  outdoors: 'mapbox/outdoors-v12',
  light: 'mapbox/light-v11',
  dark: 'mapbox/dark-v11',
  satellite: 'mapbox/satellite-streets-v12',
} as const

export type MapboxStyleId = keyof typeof MAPBOX_STYLES

/** Public token from env — required for Mapbox tiles */
export function getMapboxToken(): string | null {
  const t = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string | undefined
  if (!t || !t.trim() || t.includes('your-')) return null
  return t.trim()
}

export function mapboxTileUrl(stylePath: string, token: string): string {
  // Leaflet uses {z}/{x}/{y}; Mapbox static tiles use the same with @2x optional
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
