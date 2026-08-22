import { useEffect, useMemo } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  CircleMarker,
  LayersControl,
  ScaleControl,
  ZoomControl,
  useMapEvents,
} from 'react-leaflet'
import L from 'leaflet'
import type { Place } from '@/types/place'
import { BAHIR_DAR_CENTER } from '@/constants'
import {
  BAHIR_DAR_MAX_BOUNDS,
  BAHIR_DAR_MIN_ZOOM,
  BAHIR_DAR_MAX_ZOOM,
  BAHIR_DAR_DEFAULT_ZOOM,
  MAPBOX_STYLES,
  getMapboxToken,
  mapboxTileUrl,
  mapboxAttribution,
} from '@/constants/map'
import { placeGuideLinks } from '@/constants/guideSites'
import { displayPlaceName } from '@/utils/realPlaces'
import 'leaflet/dist/leaflet.css'

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
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${color};
      border:2.5px solid #fff;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 2px 10px rgba(0,0,0,.45);
      display:flex;align-items:center;justify-content:center;
    "><span style="
      transform:rotate(45deg);
      width:8px;height:8px;
      background:#fff;border-radius:50%;
    "></span></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  })
}

interface MapViewProps {
  places: Place[]
  selectedPlaceId: string | null
  userLocation: { lat: number; lng: number } | null
  center: { lat: number; lng: number }
  onPlaceSelect: (place: Place) => void
  onCenterChange?: (center: { lat: number; lng: number }) => void
}

function MapCamera({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap()
  useEffect(() => {
    const bounds = L.latLngBounds(BAHIR_DAR_MAX_BOUNDS)
    const target = L.latLng(center.lat, center.lng)
    if (bounds.contains(target)) {
      map.panTo(target, { animate: true })
    }
  }, [map, center.lat, center.lng])
  return null
}

function MapEvents({ onCenterChange }: { onCenterChange?: (c: { lat: number; lng: number }) => void }) {
  const map = useMap()
  useMapEvents({
    moveend: () => {
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
    // Fix blank tiles after orientation / tab switch
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

export function MapView({
  places,
  selectedPlaceId,
  userLocation,
  center,
  onPlaceSelect,
  onCenterChange,
}: MapViewProps) {
  const token = getMapboxToken()
  const useMapbox = !!token
  const markers = useMemo(() => places.slice(0, 500), [places])

  return (
    <MapContainer
      center={[BAHIR_DAR_CENTER.lat, BAHIR_DAR_CENTER.lng]}
      zoom={BAHIR_DAR_DEFAULT_ZOOM}
      minZoom={BAHIR_DAR_MIN_ZOOM}
      maxZoom={BAHIR_DAR_MAX_ZOOM}
      maxBounds={BAHIR_DAR_MAX_BOUNDS}
      maxBoundsViscosity={0.85}
      className="h-full w-full z-0"
      zoomControl={false}
      attributionControl
      style={{ height: '100%', width: '100%', minHeight: 320, background: '#e2e8f0' }}
    >
      <ZoomControl position="bottomright" />
      <ScaleControl position="bottomleft" imperial={false} />
      <InvalidateSize />
      <BahirDarLock />
      <MapCamera center={center} />
      <MapEvents onCenterChange={onCenterChange} />

      <LayersControl position="topright">
        {useMapbox && token ? (
          <>
            <LayersControl.BaseLayer checked name="Streets">
              <TileLayer
                attribution={mapboxAttribution()}
                url={mapboxTileUrl(MAPBOX_STYLES.streets, token)}
                tileSize={512}
                zoomOffset={-1}
                maxZoom={BAHIR_DAR_MAX_ZOOM}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Outdoors">
              <TileLayer
                attribution={mapboxAttribution()}
                url={mapboxTileUrl(MAPBOX_STYLES.outdoors, token)}
                tileSize={512}
                zoomOffset={-1}
                maxZoom={BAHIR_DAR_MAX_ZOOM}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satellite">
              <TileLayer
                attribution={mapboxAttribution()}
                url={mapboxTileUrl(MAPBOX_STYLES.satellite, token)}
                tileSize={512}
                zoomOffset={-1}
                maxZoom={BAHIR_DAR_MAX_ZOOM}
              />
            </LayersControl.BaseLayer>
          </>
        ) : (
          <>
            <LayersControl.BaseLayer checked name="Streets">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={BAHIR_DAR_MAX_ZOOM}
                crossOrigin
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Light">
              <TileLayer
                attribution='&copy; OSM &copy; CARTO'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                subdomains="abcd"
                maxZoom={BAHIR_DAR_MAX_ZOOM}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satellite">
              <TileLayer
                attribution="Tiles &copy; Esri"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                maxZoom={BAHIR_DAR_MAX_ZOOM}
              />
            </LayersControl.BaseLayer>
          </>
        )}
      </LayersControl>

      {markers.map((place) => {
        const selected = place.id === selectedPlaceId
        const links = placeGuideLinks(place)
        const cat = place.category?.slug
        return (
          <Marker
            key={place.id}
            position={[place.latitude, place.longitude]}
            icon={pinIcon(selected, !!place.featured, cat)}
            eventHandlers={{
              click: () => onPlaceSelect(place),
            }}
            zIndexOffset={selected ? 1000 : 1}
          >
            <Popup>
              <div style={{ minWidth: 170 }}>
                <strong>{displayPlaceName(place.name)}</strong>
                {place.category?.name && (
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{place.category.name}</div>
                )}
                {place.short_description && (
                  <div style={{ fontSize: 12, marginTop: 4 }}>{place.short_description}</div>
                )}
                <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <a href={links.googleDirections} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12 }}>
                    Directions
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

      {/* Always show GPS blue dot when we have a fix (even slightly outside soft bounds) */}
      {userLocation && (
        <>
          <CircleMarker
            center={[userLocation.lat, userLocation.lng]}
            radius={9}
            pathOptions={{
              color: '#0369a1',
              fillColor: '#0ea5e9',
              fillOpacity: 1,
              weight: 3,
            }}
          >
            <Popup>You are here</Popup>
          </CircleMarker>
          <CircleMarker
            center={[userLocation.lat, userLocation.lng]}
            radius={28}
            pathOptions={{
              color: '#0ea5e9',
              fillColor: '#0ea5e9',
              fillOpacity: 0.15,
              weight: 1,
            }}
          />
        </>
      )}
    </MapContainer>
  )
}

export function openGoogleMapsDirections(
  dest: Place,
  origin?: { lat: number; lng: number } | null,
  mode: 'walking' | 'driving' = 'walking'
) {
  const travelmode = mode === 'walking' ? 'walking' : 'driving'
  let url = `https://www.google.com/maps/dir/?api=1&destination=${dest.latitude},${dest.longitude}&travelmode=${travelmode}`
  if (origin) url += `&origin=${origin.lat},${origin.lng}`
  window.open(url, '_blank', 'noopener,noreferrer')
}
