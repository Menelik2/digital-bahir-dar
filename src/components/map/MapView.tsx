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
} from 'react-leaflet'
import L from 'leaflet'
import type { Place } from '@/types/place'
import { BAHIR_DAR_CENTER, DEFAULT_MAP_ZOOM } from '@/constants'
import { placeGuideLinks } from '@/constants/guideSites'
import 'leaflet/dist/leaflet.css'

/** Category → pin color (Mapcarta-style quick read) */
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
    map.panTo([center.lat, center.lng], { animate: true })
  }, [map, center.lat, center.lng])
  return null
}

function MapEvents({ onCenterChange }: { onCenterChange?: (c: { lat: number; lng: number }) => void }) {
  const map = useMap()
  useEffect(() => {
    if (!onCenterChange) return
    const handler = () => {
      const c = map.getCenter()
      onCenterChange({ lat: c.lat, lng: c.lng })
    }
    map.on('moveend', handler)
    return () => {
      map.off('moveend', handler)
    }
  }, [map, onCenterChange])
  return null
}

/** Invalidate size when container becomes visible (fixes blank map after tab switch) */
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

export function MapView({
  places,
  selectedPlaceId,
  userLocation,
  center,
  onPlaceSelect,
  onCenterChange,
}: MapViewProps) {
  // Cap markers for performance on dense OSM results
  const markers = useMemo(() => places.slice(0, 400), [places])

  return (
    <MapContainer
      center={[BAHIR_DAR_CENTER.lat, BAHIR_DAR_CENTER.lng]}
      zoom={DEFAULT_MAP_ZOOM}
      className="h-full w-full z-0"
      zoomControl={false}
      attributionControl
      style={{ height: '100%', width: '100%', minHeight: 280 }}
    >
      <ZoomControl position="bottomright" />
      <ScaleControl position="bottomleft" imperial={false} />
      <InvalidateSize />
      <MapCamera center={center} />
      <MapEvents onCenterChange={onCenterChange} />

      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Streets">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Light">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={20}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satellite">
          <TileLayer
            attribution="Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Terrain">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://www.opentopomap.org/">OpenTopoMap</a>'
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            maxZoom={17}
          />
        </LayersControl.BaseLayer>
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
                  <a href={links.mapcarta} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12 }}>
                    Mapcarta
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

      {userLocation && (
        <>
          <CircleMarker
            center={[userLocation.lat, userLocation.lng]}
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
            center={[userLocation.lat, userLocation.lng]}
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

/** Opens Google Maps directions in a new tab (no API key required). */
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
