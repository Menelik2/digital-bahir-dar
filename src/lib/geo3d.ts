import { BAHIR_DAR_CENTER } from '@/constants'

/** Local 3D scale: 1 unit ≈ 80 metres. Keeps city + lake readable. */
export const GEO3D_METERS_PER_UNIT = 80

const ORIGIN = BAHIR_DAR_CENTER
const M_PER_DEG_LAT = 111_320

/**
 * Project WGS84 lat/lng into a local XZ plane centered on Bahir Dar.
 * +X = east, +Z = south (so north is -Z, natural for top-down maps).
 */
export function latLngToLocal(lat: number, lng: number): { x: number; z: number } {
  const dLatM = (lat - ORIGIN.lat) * M_PER_DEG_LAT
  const dLngM =
    (lng - ORIGIN.lng) * M_PER_DEG_LAT * Math.cos((ORIGIN.lat * Math.PI) / 180)
  return {
    x: dLngM / GEO3D_METERS_PER_UNIT,
    z: -dLatM / GEO3D_METERS_PER_UNIT,
  }
}

export function localToLatLng(x: number, z: number): { lat: number; lng: number } {
  const dLngM = x * GEO3D_METERS_PER_UNIT
  const dLatM = -z * GEO3D_METERS_PER_UNIT
  return {
    lat: ORIGIN.lat + dLatM / M_PER_DEG_LAT,
    lng: ORIGIN.lng + dLngM / (M_PER_DEG_LAT * Math.cos((ORIGIN.lat * Math.PI) / 180)),
  }
}

/** Rough lake outline (Lake Tana is west/NW of the city). Units in local space. */
export const LAKE_TANA_CENTER = latLngToLocal(11.62, 37.28)
export const LAKE_TANA_SIZE = { width: 420, depth: 380 }

/** Approximate city footprint for procedural fallback buildings */
export const CITY_BOUNDS = {
  minX: -25,
  maxX: 35,
  minZ: -30,
  maxZ: 25,
}

/** Blue Nile Falls (Tis Abay) — ~30 km SE of Bahir Dar */
export const BLUE_NILE_FALLS = {
  lat: 11.4905,
  lng: 37.5878,
  name: 'Blue Nile Falls',
  nameAm: 'ጢስ አባይ',
} as const

export const BLUE_NILE_FALLS_LOCAL = latLngToLocal(BLUE_NILE_FALLS.lat, BLUE_NILE_FALLS.lng)

/** Camera / fly-to target (place or fixed landmark) */
export type FlyTarget = {
  latitude: number
  longitude: number
  label?: string
  /** Higher = more elevated look-at (waterfall ledge) */
  lookAtY?: number
  cameraOffset?: [number, number, number]
}
