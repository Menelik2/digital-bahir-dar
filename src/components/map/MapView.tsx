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
  const scale = selected ? 1.3 : 1
  const size = 26 * scale
  return L.divIcon({
    className: 'dbd-pin',
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${color};
      border:2.5px solid #fff;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 2px 8px rgba(0,0,0,.4);
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
    } else {
      map.panTo([BAHIR_DAR_CENTER.lat, BAHIR_DAR_CENTER.lng], { animate: true })
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
    const t = window.setTimeout(() => map.invalidateSize(), 80)
    const onResize = () => map.invalidateSize()
    window.addEventListener('resize', onResize)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('resize', onResize)
    }
  }, [map])
  return null
}

/** Enforce Bahir Dar-only navigation even if maxBounds is bypassed on some devices */
function BahirDarLock() {
  const map = useMap()
  useEffect(() => {
    const bounds = L.latLngBounds(BAHIR_DAR_MAX_BOUNDS)
    map.setMaxBounds(bounds)
    map.setMinZoom(BAHIR_DAR_MIN_ZOOM)
    map.setMaxZoom(BAHIR_DAR_MAX_ZOOM)
    // Keep user inside city
    const keepIn = () => {
      if (!bounds.contains(map.getCenter())) {
        map.panInsideBounds(bounds, { animate: true })
      }
    }
    map.on('drag', keepIn)
    map.on('zoomend', keepIn)
    return () => {
      map.off('drag', keepIn)
      map.off('zoomend', keepIn)
    }
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
  const markers = useMemo(() => places.slice(0, 400), [places])

  // Clamp user location marker to city (still show if inside)
  const userInCity =
    userLocation &&
    L.latLngBounds(BAHIR_DAR_MAX_BOUNDS).contains(L.latLng(userLocation.lat, userLocation.lng))
      ? userLocation
      : null

  return (
    <MapContainer
      center={[BAHIR_DAR_CENTER.lat, BAHIR_DAR_CENTER.lng]}
      zoom={BAHIR_DAR_DEFAULT_ZOOM}
      minZoom={BAHIR_DAR_MIN_ZOOM}
      maxZoom={BAHIR_DAR_MAX_ZOOM}
      maxBounds={BAHIR_DAR_MAX_BOUNDS}
      maxBoundsViscosity={1.0}
      className="h-full w-full z-0"
      zoomControl={false}
      attributionControl
      style={{ height: '100%', width: '100%', minHeight: 280 }}
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
            <LayersControl.BaseLayer checked name="Mapbox Streets">
              <TileLayer
                attribution={mapboxAttribution()}
                url={mapboxTileUrl(MAPBOX_STYLES.streets, token)}
                tileSize={512}
                zoomOffset={-1}
                maxZoom={BAHIR_DAR_MAX_ZOOM}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Mapbox Outdoors">
              <TileLayer
                attribution={mapboxAttribution()}
                url={mapboxTileUrl(MAPBOX_STYLES.outdoors, token)}
                tileSize={512}
                zoomOffset={-1}
                maxZoom={BAHIR_DAR_MAX_ZOOM}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Mapbox Satellite">
              <TileLayer
                attribution={mapboxAttribution()}
                url={mapboxTileUrl(MAPBOX_STYLES.satellite, token)}
                tileSize={512}
                zoomOffset={-1}
                maxZoom={BAHIR_DAR_MAX_ZOOM}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Mapbox Light">
              <TileLayer
                attribution={mapboxAttribution()}
                url={mapboxTileUrl(MAPBOX_STYLES.light, token)}
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
              <div style={{ minWidth: 160 }}>
                <strong>{place.name.replace(' (DEMO)', '')}</strong>
                {place.category?.name && (
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{place.category.name}</div>
                )}
                {place.short_description && (
                  <div style={{ fontSize: 12, marginTop: 4 }}>{place.short_description}</div>
                )}
                <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  <a href={links.googleDirections} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12 }}>
                    Directions
                  </a>
                  <a href={links.openStreetMap} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12 }}>
                    OSM
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        )
      })}

      {userInCity && (
        <>
          <CircleMarker
            center={[userInCity.lat, userInCity.lng]}
            radius={8}
            pathOptions={{
              color: '#0369a1',
              fillColor: '#0ea5e9',
              fillOpacity: 0.9,
              weight: 2,
            }}
          >
            <Popup>You are here</Popup>
          </CircleMarker>
          <CircleMarker
            center={[userInCity.lat, userInCity.lng]}
            radius={22}
            pathOptions={{
              color: '#0ea5e9',
              fillColor: '#0ea5e9',
              fillOpacity: 0.12,
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
