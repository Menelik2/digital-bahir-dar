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

export type MapViewProps = {
  places: Place[]
  selectedPlaceId: string | null
  userLocation: { lat: number; lng: number } | null
  center: { lat: number; lng: number }
  onPlaceSelect: (place: Place) => void
  onCenterChange?: (center: { lat: number; lng: number }) => void
  routeCoordinates?: [number, number][] | null
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

function placesToGeoJSON(places: Place[], selectedId: string | null): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: places.slice(0, 500).map((p) => ({
      type: 'Feature',
      id: p.id,
      properties: {
        id: p.id,
        name: displayPlaceName(p.name),
        category: p.category?.name ?? '',
        slug: p.category?.slug ?? '',
        color: selectedId === p.id ? '#0ea5e9' : p.featured ? '#f59e0b' : categoryColor(p.category?.slug),
        selected: selectedId === p.id ? 1 : 0,
      },
      geometry: {
        type: 'Point',
        coordinates: [p.longitude, p.latitude],
      },
    })),
  }
}

function routeToGeoJSON(coords: [number, number][]): GeoJSON.FeatureCollection {
  // coords are [lat, lng] from OSRM helper → Mapbox wants [lng, lat]
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: coords.map(([lat, lng]) => [lng, lat]),
        },
      },
    ],
  }
}

export function MapViewGl({
  places,
  selectedPlaceId,
  userLocation,
  center,
  onPlaceSelect,
  onCenterChange,
  routeCoordinates,
  token,
}: MapViewProps & { token: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const placesRef = useRef(places)
  const onSelectRef = useRef(onPlaceSelect)
  const onCenterRef = useRef(onCenterChange)
  placesRef.current = places
  onSelectRef.current = onPlaceSelect
  onCenterRef.current = onCenterChange

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    mapboxgl.accessToken = token

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLES.streets,
      center: [BAHIR_DAR_CENTER.lng, BAHIR_DAR_CENTER.lat],
      zoom: BAHIR_DAR_DEFAULT_ZOOM,
      minZoom: BAHIR_DAR_MIN_ZOOM,
      maxZoom: BAHIR_DAR_MAX_ZOOM,
      maxBounds: BAHIR_DAR_MAX_BOUNDS_GL,
      attributionControl: true,
      logoPosition: 'bottom-left',
    })

    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'bottom-right')
    map.addControl(new mapboxgl.ScaleControl({ unit: 'metric' }), 'bottom-left')

    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: false,
        showUserHeading: false,
      }),
      'bottom-right'
    )

    // Style switcher (simple)
    const styles = [
      { id: 'streets', label: 'Streets', url: MAPBOX_STYLES.streets },
      { id: 'outdoors', label: 'Outdoors', url: MAPBOX_STYLES.outdoors },
      { id: 'satellite', label: 'Satellite', url: MAPBOX_STYLES.satellite },
    ] as const

    const styleCtrl = document.createElement('div')
    styleCtrl.className = 'mapboxgl-ctrl mapboxgl-ctrl-group'
    styleCtrl.style.cssText = 'display:flex;flex-direction:column;margin:8px;'
    styles.forEach((s) => {
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.textContent = s.label
      btn.title = s.label
      btn.style.cssText =
        'font-size:11px;padding:6px 8px;cursor:pointer;border:none;background:#fff;'
      btn.onclick = () => {
        const center = map.getCenter()
        const zoom = map.getZoom()
        map.setStyle(s.url)
        map.once('style.load', () => {
          map.setCenter(center)
          map.setZoom(zoom)
          // Re-add data layers after style change
          addDataLayers(map)
          syncPlaces(map, placesRef.current, selectedPlaceId)
          syncUser(map, userLocation)
          syncRoute(map, routeCoordinates ?? null)
        })
      }
      styleCtrl.appendChild(btn)
    })
    const pos = document.createElement('div')
    pos.className = 'mapboxgl-ctrl-top-right'
    pos.appendChild(styleCtrl)
    containerRef.current.appendChild(pos)

    map.on('load', () => {
      addDataLayers(map)
      syncPlaces(map, placesRef.current, selectedPlaceId)
      syncUser(map, userLocation)
      syncRoute(map, routeCoordinates ?? null)
    })

    map.on('moveend', () => {
      const c = map.getCenter()
      onCenterRef.current?.({ lat: c.lat, lng: c.lng })
    })

    map.on('click', 'places-circle', (e) => {
      const f = e.features?.[0]
      const id = f?.properties?.id as string | undefined
      if (!id) return
      const place = placesRef.current.find((p) => p.id === id)
      if (place) onSelectRef.current(place)
    })

    map.on('mouseenter', 'places-circle', () => {
      map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseleave', 'places-circle', () => {
      map.getCanvas().style.cursor = ''
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // Pan to center
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    map.easeTo({
      center: [center.lng, center.lat],
      duration: 450,
    })
  }, [center.lat, center.lng])

  // Places
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    syncPlaces(map, places, selectedPlaceId)
  }, [places, selectedPlaceId])

  // User location
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    syncUser(map, userLocation)
  }, [userLocation])

  // Route
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    syncRoute(map, routeCoordinates ?? null)
    if (routeCoordinates && routeCoordinates.length > 1) {
      const bounds = new mapboxgl.LngLatBounds()
      routeCoordinates.forEach(([lat, lng]) => bounds.extend([lng, lat]))
      map.fitBounds(bounds, { padding: 56, maxZoom: 16, duration: 600 })
    }
  }, [routeCoordinates])

  return (
    <div
      ref={containerRef}
      className="h-full w-full z-0"
      style={{ minHeight: 320, background: '#e2e8f0' }}
    />
  )
}

function addDataLayers(map: mapboxgl.Map) {
  if (!map.getSource('places')) {
    map.addSource('places', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
    })
    map.addLayer({
      id: 'places-circle',
      type: 'circle',
      source: 'places',
      paint: {
        'circle-radius': [
          'case',
          ['==', ['get', 'selected'], 1],
          11,
          8,
        ],
        'circle-color': ['get', 'color'],
        'circle-stroke-width': 2.5,
        'circle-stroke-color': '#ffffff',
      },
    })
  }

  if (!map.getSource('user')) {
    map.addSource('user', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
    })
    map.addLayer({
      id: 'user-accuracy',
      type: 'circle',
      source: 'user',
      paint: {
        'circle-radius': 28,
        'circle-color': '#0ea5e9',
        'circle-opacity': 0.15,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#0ea5e9',
      },
    })
    map.addLayer({
      id: 'user-dot',
      type: 'circle',
      source: 'user',
      paint: {
        'circle-radius': 7,
        'circle-color': '#0ea5e9',
        'circle-stroke-width': 3,
        'circle-stroke-color': '#0369a1',
      },
    })
  }

  if (!map.getSource('route')) {
    map.addSource('route', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
    })
    map.addLayer({
      id: 'route-line',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#0b6e99',
        'line-width': 5,
        'line-opacity': 0.92,
      },
    })
  }
}

function syncPlaces(map: mapboxgl.Map, places: Place[], selectedId: string | null) {
  const src = map.getSource('places') as mapboxgl.GeoJSONSource | undefined
  if (!src) return
  src.setData(placesToGeoJSON(places, selectedId))
}

function syncUser(map: mapboxgl.Map, user: { lat: number; lng: number } | null) {
  const src = map.getSource('user') as mapboxgl.GeoJSONSource | undefined
  if (!src) return
  if (!user) {
    src.setData({ type: 'FeatureCollection', features: [] })
    return
  }
  src.setData({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: { type: 'Point', coordinates: [user.lng, user.lat] },
      },
    ],
  })
}

function syncRoute(map: mapboxgl.Map, coords: [number, number][] | null) {
  const src = map.getSource('route') as mapboxgl.GeoJSONSource | undefined
  if (!src) return
  if (!coords || coords.length < 2) {
    src.setData({ type: 'FeatureCollection', features: [] })
    return
  }
  src.setData(routeToGeoJSON(coords))
}

// silence unused import if tree-shaken oddly
void inAppDirectionsPath
