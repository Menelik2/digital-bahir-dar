import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { Place } from '@/types/place'
import { BAHIR_DAR_CENTER } from '@/constants'
import {
  BAHIR_DAR_DEFAULT_ZOOM,
  BAHIR_DAR_MAX_BOUNDS_GL,
  BAHIR_DAR_MAX_ZOOM,
  BAHIR_DAR_MIN_ZOOM,
  MAPBOX_STYLES,
} from '@/constants/map'
import { displayPlaceName } from '@/utils/realPlaces'
import { inAppDirectionsPath } from '@/services/routing'

export type MapBasemap = 'streets' | 'satellite'

export type MapViewProps = {
  places: Place[]
  selectedPlaceId: string | null
  userLocation: { lat: number; lng: number; accuracy?: number | null } | null
  center: { lat: number; lng: number }
  onPlaceSelect: (place: Place) => void
  onCenterChange?: (center: { lat: number; lng: number }) => void
  routeCoordinates?: [number, number][] | null
  /** Streets (default) or satellite imagery */
  basemap?: MapBasemap
}

function categoryColor(slug?: string | null): string {
  switch (slug) {
    case 'hotel':
      return '#2563eb'
    case 'restaurant':
    case 'cafe':
      return '#ea580c'
    case 'attraction':
    case 'historical':
    case 'religious':
    case 'museum':
    case 'park':
      return '#059669'
    case 'bank':
    case 'atm':
      return '#7c3aed'
    case 'transport':
    case 'taxi':
      return '#0891b2'
    case 'hospital':
    case 'pharmacy':
    case 'emergency':
      return '#e11d48'
    case 'shopping':
    case 'market':
      return '#db2777'
    default:
      return '#0f766e'
  }
}

function isValidLatLng(lat: number, lng: number) {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  )
}

let userMarker: mapboxgl.Marker | null = null
let accuracyCircle: mapboxgl.Marker | null = null

function syncUser(
  map: mapboxgl.Map,
  userLocation: { lat: number; lng: number; accuracy?: number | null } | null
) {
  if (userMarker) {
    userMarker.remove()
    userMarker = null
  }
  if (accuracyCircle) {
    accuracyCircle.remove()
    accuracyCircle = null
  }
  if (!userLocation || !isValidLatLng(userLocation.lat, userLocation.lng)) return

  const el = document.createElement('div')
  el.style.cssText =
    'width:18px;height:18px;background:#2563eb;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,.4);'
  userMarker = new mapboxgl.Marker({ element: el })
    .setLngLat([userLocation.lng, userLocation.lat])
    .setPopup(new mapboxgl.Popup({ offset: 12 }).setText('You are here'))
    .addTo(map)
}

export function MapViewGl({
  places,
  selectedPlaceId,
  userLocation,
  center,
  onPlaceSelect,
  onCenterChange,
  routeCoordinates,
  basemap = 'streets',
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const token = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined
    if (!token) return
    mapboxgl.accessToken = token

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: basemap === 'satellite' ? MAPBOX_STYLES.satellite : MAPBOX_STYLES.streets,
      center: [center.lng || BAHIR_DAR_CENTER.lng, center.lat || BAHIR_DAR_CENTER.lat],
      zoom: BAHIR_DAR_DEFAULT_ZOOM,
      minZoom: BAHIR_DAR_MIN_ZOOM,
      maxZoom: BAHIR_DAR_MAX_ZOOM,
      maxBounds: BAHIR_DAR_MAX_BOUNDS_GL,
    })
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')
    mapRef.current = map

    map.on('moveend', () => {
      const c = map.getCenter()
      onCenterChange?.({ lat: c.lat, lng: c.lng })
    })

    return () => {
      markersRef.current.forEach((m) => m.remove())
      markersRef.current = []
      if (userMarker) {
        userMarker.remove()
        userMarker = null
      }
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const style = basemap === 'satellite' ? MAPBOX_STYLES.satellite : MAPBOX_STYLES.streets
    if (map.getStyle()?.sprite !== undefined) {
      try {
        map.setStyle(style)
      } catch {
        /* ignore */
      }
    }
  }, [basemap])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !isValidLatLng(center.lat, center.lng)) return
    map.flyTo({ center: [center.lng, center.lat], zoom: Math.max(map.getZoom(), 15), essential: true })
  }, [center.lat, center.lng])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []
    for (const place of places) {
      if (!isValidLatLng(place.latitude, place.longitude)) continue
      const color = place.id === selectedPlaceId ? '#0ea5e9' : categoryColor(place.category?.slug)
      const el = document.createElement('div')
      el.style.cssText = `width:14px;height:14px;background:${color};border:2px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.35);cursor:pointer;`
      el.addEventListener('click', (e) => {
        e.stopPropagation()
        onPlaceSelect(place)
      })
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([place.longitude, place.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 10 }).setHTML(
            `<strong>${displayPlaceName(place)}</strong><br/><a href="${inAppDirectionsPath(place)}">Directions</a>`
          )
        )
        .addTo(map)
      markersRef.current.push(marker)
    }
    syncUser(map, userLocation)
  }, [places, selectedPlaceId, onPlaceSelect, userLocation])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    syncUser(map, userLocation)
  }, [userLocation])

  return <div ref={containerRef} className="h-full w-full" />
}
