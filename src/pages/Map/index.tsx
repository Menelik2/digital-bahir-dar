import { useEffect, useMemo, useState, useCallback } from 'react'
import { Search, X, AlertCircle } from 'lucide-react'
import { MapView, openGoogleMapsDirections } from '@/components/map/MapView'
import { MapFilter } from '@/components/map/MapFilter'
import { LocationButton } from '@/components/map/LocationButton'
import { PlaceBottomSheet } from '@/components/map/PlaceBottomSheet'
import { DirectionsPanel } from '@/components/map/DirectionsPanel'
import { useFilteredPlaces } from '@/hooks/usePlaces'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useAppStore } from '@/store'
import { BAHIR_DAR_CENTER } from '@/constants'
import { distanceMeters } from '@/utils/geo'
import type { Place } from '@/types/place'
import { Button } from '@/components/ui/button'

export default function MapPage() {
  const { location, setMapCenter, mapCenter, selectedPlaceId, setSelectedPlaceId } = useAppStore()
  const { request: requestLocation } = useGeolocation(true)

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string | null>(null)
  const [directionsPlace, setDirectionsPlace] = useState<Place | null>(null)
  const [travelMode, setTravelMode] = useState<'walking' | 'driving'>('walking')

  const categorySlug =
    filter && !['near_me', 'verified'].includes(filter) ? filter : null
  const nearMe = filter === 'near_me'
  const verifiedOnly = filter === 'verified'

  const { places, isLoading, isError, error, refetch } = useFilteredPlaces({
    search,
    categorySlug,
    nearMe,
    verifiedOnly,
  })

  const selectedPlace = useMemo(
    () => places.find((p) => p.id === selectedPlaceId) ?? null,
    [places, selectedPlaceId]
  )

  const userPos =
    location.permission === 'granted' && location.latitude != null && location.longitude != null
      ? { lat: location.latitude, lng: location.longitude }
      : null

  const selectedDistance = useMemo(() => {
    if (!selectedPlace || !userPos) return undefined
    return distanceMeters(userPos.lat, userPos.lng, selectedPlace.latitude, selectedPlace.longitude)
  }, [selectedPlace, userPos])

  const directionsDistance = useMemo(() => {
    if (!directionsPlace) return 0
    if (userPos) return distanceMeters(userPos.lat, userPos.lng, directionsPlace.latitude, directionsPlace.longitude)
    return distanceMeters(BAHIR_DAR_CENTER.lat, BAHIR_DAR_CENTER.lng, directionsPlace.latitude, directionsPlace.longitude)
  }, [directionsPlace, userPos])

  useEffect(() => {
    if (userPos) setMapCenter(userPos)
  }, [location.permission]) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePlaceSelect = useCallback(
    (place: Place) => {
      setSelectedPlaceId(place.id)
      setMapCenter({ lat: place.latitude, lng: place.longitude })
      setDirectionsPlace(null)
    },
    [setSelectedPlaceId, setMapCenter]
  )

  const handleDirections = useCallback((place: Place) => {
    setDirectionsPlace(place)
  }, [])

  const handleLocate = useCallback(() => {
    requestLocation()
    if (userPos) setMapCenter(userPos)
  }, [requestLocation, userPos, setMapCenter])

  return (
    <div className="relative h-[calc(100dvh-4rem)] overflow-hidden">
      <div className="absolute left-4 right-4 top-4 z-10 flex gap-2 lg:right-auto lg:w-[420px]">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <Search className="h-5 w-5 shrink-0 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search places in Bahir Dar..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            aria-label="Search places"
          />
          {search && (
            <button type="button" onClick={() => setSearch('')} className="rounded p-0.5 hover:bg-slate-100">
              <X className="h-4 w-4 text-slate-400" />
            </button>
          )}
        </div>
        <LocationButton onLocated={() => handleLocate()} />
      </div>

      <MapView
        places={places}
        selectedPlaceId={selectedPlaceId}
        userLocation={userPos}
        center={mapCenter}
        onPlaceSelect={handlePlaceSelect}
        onCenterChange={setMapCenter}
      />

      {isError && (
        <div className="absolute left-1/2 top-20 z-20 flex max-w-sm -translate-x-1/2 items-start gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-red-900 dark:bg-slate-900">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <div>
            <p className="font-medium text-red-700 dark:text-red-300">Could not load places</p>
            <p className="text-xs text-slate-500">{error instanceof Error ? error.message : 'Unknown error'}</p>
            <Button size="sm" variant="outline" className="mt-2" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="absolute left-1/2 top-20 z-10 -translate-x-1/2 rounded-full bg-white px-4 py-1.5 text-sm shadow dark:bg-slate-900">
          Loading places…
        </div>
      )}

      {search && !isLoading && !isError && (
        <div className="absolute left-1/2 top-20 z-10 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs shadow dark:bg-slate-900">
          {places.length} result{places.length !== 1 ? 's' : ''}
        </div>
      )}

      {directionsPlace && (
        <DirectionsPanel
          origin={userPos}
          destination={directionsPlace}
          distanceM={directionsDistance}
          mode={travelMode}
          onModeChange={setTravelMode}
          onClose={() => setDirectionsPlace(null)}
          onStartNavigation={() => openGoogleMapsDirections(directionsPlace, userPos, travelMode)}
        />
      )}

      {!directionsPlace && (
        <PlaceBottomSheet
          place={selectedPlace}
          distanceM={selectedDistance}
          onClose={() => setSelectedPlaceId(null)}
          onDirections={handleDirections}
        />
      )}

      <div className="absolute bottom-24 left-0 right-0 z-10 px-4 lg:bottom-6">
        <MapFilter active={filter} onChange={setFilter} />
      </div>
    </div>
  )
}
