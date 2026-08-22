import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import type { Place } from '@/types/place'
import { BAHIR_DAR_CENTER, DEFAULT_MAP_ZOOM } from '@/constants'
import 'leaflet/dist/leaflet.css'

function pinIcon(selected: boolean, featured: boolean) {
  const color = selected ? '#0ea5e9' : featured ? '#f59e0b' : '#0f766e'
  const scale = selected ? 1.25 : 1
  const size = 28 * scale
  return L.divIcon({
    className: 'dbd-pin',
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${color};
      border:2px solid ${selected ? '#0369a1' : '#134e4a'};
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 2px 6px rgba(0,0,0,.35);
      display:flex;align-items:center;justify-content:center;
    "><span style="
      transform:rotate(45deg);
      width:10px;height:10px;
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

export function MapView({
  places,
  selectedPlaceId,
  userLocation,
  center,
  onPlaceSelect,
  onCenterChange,
}: MapViewProps) {
  return (
    <MapContainer
      center={[BAHIR_DAR_CENTER.lat, BAHIR_DAR_CENTER.lng]}
      zoom={DEFAULT_MAP_ZOOM}
      className="h-full w-full z-0"
      zoomControl
      attributionControl
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <MapCamera center={center} />
      <MapEvents onCenterChange={onCenterChange} />

      {places.map((place) => {
        const selected = place.id === selectedPlaceId
        return (
          <Marker
            key={place.id}
            position={[place.latitude, place.longitude]}
            icon={pinIcon(selected, !!place.featured)}
            eventHandlers={{
              click: () => onPlaceSelect(place),
            }}
            zIndexOffset={selected ? 1000 : 1}
          >
            <Popup>
              <strong>{place.name}</strong>
              {place.short_description && (
                <div style={{ fontSize: 12, marginTop: 4 }}>{place.short_description}</div>
              )}
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
            radius={20}
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
