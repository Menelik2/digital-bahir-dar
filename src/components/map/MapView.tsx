import { useMemo, useEffect } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  CircleMarker,
  Circle,
  ScaleControl,
  ZoomControl,
  useMapEvents,
  Polyline,
} from 'react-leaflet'
import L from 'leaflet'
import type { Place } from '@/types/place'
import { BAHIR_DAR_CENTER } from '@/constants'
import {
  BAHIR_DAR_MAX_BOUNDS,
  BAHIR_DAR_MIN_ZOOM,
  BAHIR_DAR_MAX_ZOOM,
  BAHIR_DAR_DEFAULT_ZOOM,
  MAPBOX_RASTER_STYLES,
  getMapboxToken,
  mapboxTileUrl,
  mapboxAttribution,
} from '@/constants/map'
import { placeGuideLinks } from '@/constants/guideSites'
import { displayPlaceName } from '@/utils/realPlaces'
import { inAppDirectionsPath } from '@/services/routing'
import { placeCoverImage } from '@/utils/placeImage'
import { MapErrorBoundary } from './MapErrorBoundary'
import 'leaflet/dist/leaflet.css'

export type MapViewProps = {
  places: Place[]
  selectedPlaceId: string | null
  userLocation: { lat: number; lng: number; accuracy?: number | null } | null
  center: { lat: number; lng: number }
  onPlaceSelect: (place: Place) => void
  onCenterChange?: (center: { lat: number; lng: number }) => void
  routeCoordinates?: [number, number][] | null
  basemap?: 'streets' | 'satellite'
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

function pinIcon(selected: boolean, featured: boolean, categorySlug?: string | null) {
  const color = selected ? '#0ea5e9' : featured ? '#f59e0b' : categoryColor(categorySlug)
  const scale = selected ? 1.25 : 1
  const size = 28 * scale
  return L.divIcon({
    className: 'dbd-pin',
    html: `<div style="width:${size}px;height:${size}px;background:${color};border:2.5px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 10px rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);width:8px;height:8px;background:#fff;border-radius:50%;"></span></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  })
}

/** Photo-style pin for hotels (Google Maps-like place cards on the map) */
function photoPinIcon(imageUrl: string, selected: boolean) {
  const size = selected ? 48 : 40
  const border = selected ? '#0ea5e9' : '#fff'
  const ring = selected ? '0 0 0 3px rgba(14,165,233,.45)' : '0 2px 10px rgba(0,0,0,.35)'
  const safe = imageUrl.replace(/"/g, '"')
  return L.divIcon({
    className: 'dbd-photo-pin',
    html: `<div style="width:${size}px;height:${size}px;border-radius:12px;overflow:hidden;border:2.5px solid ${border};box-shadow:${ring};background:#0f172a;"><img src="${safe}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display='none'"/></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  })
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

function MapCamera({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap()
  useEffect(() => {
    if (!isValidLatLng(center.lat, center.lng)) return
    const [[s, w], [n, e]] = BAHIR_DAR_MAX_BOUNDS
    const lat = Math.min(Math.max(center.lat, s), n)
    const lng = Math.min(Math.max(center.lng, w), e)
    const target = L.latLng(lat, lng)
    const cur = map.getCenter()
    if (Math.abs(cur.lat - lat) < 1e-5 && Math.abs(cur.lng - lng) < 1e-5) {
      if (map.getZoom() < 14) map.setZoom(15, { animate: true })
      return
    }
    map.setView(target, Math.max(map.getZoom(), 15), { animate: true })
  }, [map, center.lat, center.lng])
  return null
}

function FitRoute({ coords }: { coords: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (!coords.length) return
    try {
      const bounds = L.latLngBounds(coords.map(([lat, lng]) => [lat, lng] as [number, number]))
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 16, animate: true })
    } catch {
      /* ignore */
    }
  }, [map, coords])
  return null
}

function MapEvents({ onCenterChange }: { onCenterChange?: (c: { lat: number; lng: number }) => void }) {
  const map = useMap()
  useMapEvents({
    dragend: () => {
      if (!onCenterChange) return
      const c = map.getCenter()
      onCenterChange({ lat: c.lat, lng: c.lng })
    },
    zoomend: () => {
      if (!onCenterChange) return
      const c = map.getCenter()
      onCenterChange({ lat: c.lat, lng: c.lng })
    },
  })
  return null
}

function InvalidateSize() {
  const map = useMap()
  useEffect(() => {
    const t = window.setTimeout(() => map.invalidateSize(), 100)
    const onResize = () => map.invalidateSize()
    window.addEventListener('resize', onResize)
    const onVis = () => {
      if (document.visibilityState === 'visible') map.invalidateSize()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [map])
  return null
}

function BahirDarLock() {
  const map = useMap()
  useEffect(() => {
    const bounds = L.latLngBounds(BAHIR_DAR_MAX_BOUNDS)
    map.setMaxBounds(bounds.pad(0.02))
    map.setMinZoom(BAHIR_DAR_MIN_ZOOM)
    map.setMaxZoom(BAHIR_DAR_MAX_ZOOM)
  }, [map])
  return null
}

function LeafletMapView({
  places,
  selectedPlaceId,
  userLocation,
  center,
  onPlaceSelect,
  onCenterChange,
  routeCoordinates,
  basemap = 'streets',
}: MapViewProps) {
  const token = getMapboxToken()
  const useMapboxTiles = !!token
  const isSat = basemap === 'satellite'

  const mapCenter: [number, number] = useMemo(() => {
    if (isValidLatLng(center?.lat, center?.lng)) return [center.lat, center.lng]
    return [BAHIR_DAR_CENTER.lat, BAHIR_DAR_CENTER.lng]
  }, [center?.lat, center?.lng])

  const tileUrl = useMapboxTiles
    ? mapboxTileUrl(isSat ? MAPBOX_RASTER_STYLES.satellite : MAPBOX_RASTER_STYLES.streets, token!)
    : isSat
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

  const attribution = useMapboxTiles
    ? mapboxAttribution()
    : isSat
      ? 'Tiles &copy; Esri'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

  return (
    <MapContainer
      center={mapCenter}
      zoom={BAHIR_DAR_DEFAULT_ZOOM}
      className="h-full w-full z-0"
      style={{ minHeight: 320, background: '#e2e8f0' }}
      zoomControl={false}
      maxBounds={BAHIR_DAR_MAX_BOUNDS}
      maxBoundsViscosity={0.85}
      minZoom={BAHIR_DAR_MIN_ZOOM}
      maxZoom={BAHIR_DAR_MAX_ZOOM}
    >
      <TileLayer url={tileUrl} attribution={attribution} />
      <ZoomControl position="bottomright" />
      <ScaleControl position="bottomleft" imperial={false} />
      <BahirDarLock />
      <InvalidateSize />
      <MapCamera center={{ lat: mapCenter[0], lng: mapCenter[1] }} />
      <MapEvents onCenterChange={onCenterChange} />
      {routeCoordinates && routeCoordinates.length > 1 && (
        <>
          <Polyline
            positions={routeCoordinates}
            pathOptions={{ color: '#0b6e99', weight: 5, opacity: 0.9 }}
          />
          <FitRoute coords={routeCoordinates} />
        </>
      )}

      {places.map((place) => {
        if (!isValidLatLng(place.latitude, place.longitude)) return null
        const selected = place.id === selectedPlaceId
        const links = placeGuideLinks(place)
        const isHotel = place.category?.slug === 'hotel'
        const cover = placeCoverImage(place)
        const icon =
          isHotel || place.image_url
            ? photoPinIcon(cover, selected)
            : pinIcon(selected, !!place.featured, place.category?.slug)
        return (
          <Marker
            key={place.id}
            position={[place.latitude, place.longitude]}
            icon={icon}
            eventHandlers={{
              click: () => onPlaceSelect(place),
            }}
          >
            <Popup>
              <div style={{ minWidth: 160, maxWidth: 220 }}>
                <div
                  style={{
                    width: '100%',
                    height: 88,
                    borderRadius: 10,
                    overflow: 'hidden',
                    marginBottom: 8,
                    background: '#e2e8f0',
                  }}
                >
                  <img
                    src={cover}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <strong>{displayPlaceName(place.name)}</strong>
                {place.hotel?.star_rating != null && (
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                    {'★'.repeat(place.hotel.star_rating)} hotel
                    {place.hotel.minimum_price != null
                      ? ` · from ETB ${place.hotel.minimum_price.toLocaleString()}`
                      : ''}
                  </div>
                )}
                <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <a href={inAppDirectionsPath(place)} style={{ fontSize: 12 }}>
                    Directions
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' Bahir Dar')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 12 }}
                  >
                    Photos on Google Maps
                  </a>
                  <a href={links.openStreetMap} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12 }}>
                    OpenStreetMap
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        )
      })}

      {userLocation && isValidLatLng(userLocation.lat, userLocation.lng) && (
        <>
          {userLocation.accuracy != null &&
            userLocation.accuracy > 0 &&
            userLocation.accuracy < 2000 && (
              <Circle
                center={[userLocation.lat, userLocation.lng]}
                radius={userLocation.accuracy}
                pathOptions={{
                  color: '#0ea5e9',
                  fillColor: '#0ea5e9',
                  fillOpacity: 0.12,
                  weight: 1,
                }}
                interactive={false}
              />
            )}
          <CircleMarker
            center={[userLocation.lat, userLocation.lng]}
            radius={10}
            pathOptions={{
              color: '#ffffff',
              fillColor: '#2563eb',
              fillOpacity: 1,
              weight: 3,
            }}
            eventHandlers={{
              click: (e) => {
                L.DomEvent.stopPropagation(e)
              },
            }}
          >
            <Popup>
              You are here
              {userLocation.accuracy != null
                ? ` (±${Math.round(userLocation.accuracy)} m)`
                : ''}
            </Popup>
          </CircleMarker>
          <CircleMarker
            center={[userLocation.lat, userLocation.lng]}
            radius={22}
            pathOptions={{
              color: '#3b82f6',
              fillColor: '#3b82f6',
              fillOpacity: 0.18,
              weight: 1,
            }}
            interactive={false}
          />
        </>
      )}
    </MapContainer>
  )
}

export function MapView(props: MapViewProps) {
  return (
    <MapErrorBoundary>
      <LeafletMapView {...props} />
    </MapErrorBoundary>
  )
}
