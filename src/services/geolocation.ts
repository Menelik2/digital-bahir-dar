/**
 * Geolocation services for Digital Bahir Dar.
 * Browser Geolocation API + permission helpers + Bahir Dar context.
 */

import { BAHIR_DAR_CENTER } from '@/constants'
import { BAHIR_DAR_MAX_BOUNDS } from '@/constants/map'
import { distanceMeters } from '@/utils/geo'
import L from 'leaflet'

export type GeoPermission = 'granted' | 'denied' | 'prompt' | 'unsupported'

export type GeoPosition = {
  latitude: number
  longitude: number
  accuracy: number | null
  altitude: number | null
  heading: number | null
  speed: number | null
  timestamp: number
}

export type GeoErrorCode =
  | 'unsupported'
  | 'permission_denied'
  | 'position_unavailable'
  | 'timeout'
  | 'unknown'

export class GeoServiceError extends Error {
  code: GeoErrorCode
  constructor(code: GeoErrorCode, message: string) {
    super(message)
    this.code = code
    this.name = 'GeoServiceError'
  }
}

const DEFAULT_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 15_000,
  maximumAge: 30_000,
}

export function isGeolocationSupported(): boolean {
  return typeof navigator !== 'undefined' && 'geolocation' in navigator
}

/** Query Permissions API when available (Chrome / Edge / Android) */
export async function queryGeoPermission(): Promise<GeoPermission> {
  if (!isGeolocationSupported()) return 'unsupported'
  try {
    if (navigator.permissions?.query) {
      const status = await navigator.permissions.query({ name: 'geolocation' as PermissionName })
      if (status.state === 'granted') return 'granted'
      if (status.state === 'denied') return 'denied'
      return 'prompt'
    }
  } catch {
    /* Safari often throws */
  }
  return 'prompt'
}

function mapPositionError(err: GeolocationPositionError): GeoServiceError {
  switch (err.code) {
    case err.PERMISSION_DENIED:
      return new GeoServiceError(
        'permission_denied',
        'Location permission denied. Enable location for this site in browser settings.'
      )
    case err.POSITION_UNAVAILABLE:
      return new GeoServiceError(
        'position_unavailable',
        'Position unavailable. Check GPS/network and try again.'
      )
    case err.TIMEOUT:
      return new GeoServiceError('timeout', 'Location request timed out. Try again outdoors.')
    default:
      return new GeoServiceError('unknown', err.message || 'Could not get location')
  }
}

function toGeoPosition(pos: GeolocationPosition): GeoPosition {
  return {
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
    accuracy: pos.coords.accuracy ?? null,
    altitude: pos.coords.altitude ?? null,
    heading: pos.coords.heading ?? null,
    speed: pos.coords.speed ?? null,
    timestamp: pos.timestamp,
  }
}

/** One-shot high-accuracy fix */
export function getCurrentPosition(options?: PositionOptions): Promise<GeoPosition> {
  return new Promise((resolve, reject) => {
    if (!isGeolocationSupported()) {
      reject(new GeoServiceError('unsupported', 'Geolocation is not supported on this device.'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(toGeoPosition(pos)),
      (err) => reject(mapPositionError(err)),
      { ...DEFAULT_OPTIONS, ...options }
    )
  })
}

/** Continuous watch — returns watchId; call clearWatch when done */
export function watchPosition(
  onUpdate: (pos: GeoPosition) => void,
  onError?: (err: GeoServiceError) => void,
  options?: PositionOptions
): number {
  if (!isGeolocationSupported()) {
    onError?.(new GeoServiceError('unsupported', 'Geolocation is not supported on this device.'))
    return -1
  }
  return navigator.geolocation.watchPosition(
    (pos) => onUpdate(toGeoPosition(pos)),
    (err) => onError?.(mapPositionError(err)),
    {
      enableHighAccuracy: true,
      timeout: 20_000,
      maximumAge: 10_000,
      ...options,
    }
  )
}

export function clearWatch(watchId: number) {
  if (watchId >= 0 && isGeolocationSupported()) {
    navigator.geolocation.clearWatch(watchId)
  }
}

/** Distance from user to Bahir Dar center (meters) */
export function distanceToBahirDarCenter(lat: number, lng: number): number {
  return distanceMeters(lat, lng, BAHIR_DAR_CENTER.lat, BAHIR_DAR_CENTER.lng)
}

/** True if coordinates fall inside the app’s Bahir Dar city bounds */
export function isInsideBahirDar(lat: number, lng: number): boolean {
  try {
    return L.latLngBounds(BAHIR_DAR_MAX_BOUNDS).contains(L.latLng(lat, lng))
  } catch {
    // Fallback bbox without Leaflet
    const [[s, w], [n, e]] = BAHIR_DAR_MAX_BOUNDS
    return lat >= s && lat <= n && lng >= w && lng <= e
  }
}

/** Rough “near city” for travelers approaching (25 km) */
export function isNearBahirDar(lat: number, lng: number, radiusM = 25_000): boolean {
  return distanceToBahirDarCenter(lat, lng) <= radiusM
}

export function formatAccuracy(meters: number | null | undefined): string {
  if (meters == null || Number.isNaN(meters)) return '—'
  if (meters < 50) return `±${Math.round(meters)} m (good)`
  if (meters < 200) return `±${Math.round(meters)} m`
  return `±${Math.round(meters)} m (low accuracy)`
}

export function geoErrorUserMessage(code: GeoErrorCode | string | null): string {
  switch (code) {
    case 'unsupported':
      return 'This device or browser does not support location.'
    case 'permission_denied':
      return 'Location blocked. Allow location for this site, then try again.'
    case 'position_unavailable':
      return 'Could not determine position. Try again with GPS on.'
    case 'timeout':
      return 'Location timed out. Move outdoors and retry.'
    default:
      return 'Unable to get your location right now.'
  }
}
