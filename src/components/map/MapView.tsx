import { useEffect } from 'react'
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useMap,
} from '@vis.gl/react-google-maps'
import type { Place } from '@/types/place'
import { BAHIR_DAR_CENTER, DEFAULT_MAP_ZOOM } from '@/constants'

const MAP_ID = 'digital-bahir-dar-map'

interface MapViewProps {
  places: Place[]
  selectedPlaceId: string | null
  userLocation: { lat: number; lng: number } | null
  center: { lat: number; lng: number }
  onPlaceSelect: (place: Place) => void
  onCenterChange?: (center: { lat: number; lng: number }) => void
}

function PlaceMarkers({
  places,
  selectedPlaceId,
  onPlaceSelect,
}: {
  places: Place[]
  selectedPlaceId: string | null
  onPlaceSelect: (place: Place) => void
}) {
  return (
    <>
      {places.map((place) => {
        const selected = place.id === selectedPlaceId
        return (
          <AdvancedMarker
            key={place.id}
            position={{ lat: place.latitude, lng: place.longitude }}
            onClick={() => onPlaceSelect(place)}
            title={place.name}
            zIndex={selected ? 1000 : 1}
          >
            <Pin
              background={selected ? '#0ea5e9' : place.featured ? '#f59e0b' : '#0f766e'}
              borderColor={selected ? '#0369a1' : '#134e4a'}
              glyphColor="#ffffff"
              scale={selected ? 1.3 : 1}
            />
          </AdvancedMarker>
        )
      })}
    </>
  )
}

function UserMarker({ position }: { position: { lat: number; lng: number } }) {
  return (
    <AdvancedMarker position={position} title="You are here" zIndex={2000}>
      <div className="relative flex h-5 w-5 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-60" />
        <span className="relative h-3.5 w-3.5 rounded-full border-2 border-white bg-sky-500 shadow" />
      </div>
    </AdvancedMarker>
  )
}

function MapCamera({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap()
  useEffect(() => {
    if (map) map.panTo(center)
  }, [map, center.lat, center.lng])
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
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined

  if (!apiKey) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="max-w-sm px-6 text-center">
          <p className="mb-2 text-lg font-semibold">Google Maps API key required</p>
          <p className="text-sm text-slate-500">
            Add <code className="rounded bg-slate-200 px-1 dark:bg-slate-800">VITE_GOOGLE_MAPS_API_KEY</code> to your
            environment to enable the interactive map.
          </p>
          <p className="mt-3 text-xs text-slate-400">
            Showing {places.length} place{places.length !== 1 ? 's' : ''} in data layer.
          </p>
        </div>
      </div>
    )
  }

  return (
    <APIProvider apiKey={apiKey} libraries={['marker']}>
      <Map
        defaultCenter={BAHIR_DAR_CENTER}
        defaultZoom={DEFAULT_MAP_ZOOM}
        mapId={MAP_ID}
        gestureHandling="greedy"
        disableDefaultUI={false}
        zoomControl
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
        className="h-full w-full"
        onCameraChanged={(ev) => {
          const c = ev.detail.center
          if (c) onCenterChange?.({ lat: c.lat, lng: c.lng })
        }}
      >
        <MapCamera center={center} />
        <PlaceMarkers places={places} selectedPlaceId={selectedPlaceId} onPlaceSelect={onPlaceSelect} />
        {userLocation && <UserMarker position={userLocation} />}
      </Map>
    </APIProvider>
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
