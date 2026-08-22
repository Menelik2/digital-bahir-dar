import { useEffect, useMemo, useState, useCallback } from 'react'
import { Search, X, AlertCircle, ExternalLink } from 'lucide-react'
import { MapView, openGoogleMapsDirections } from '@/components/map/MapView'
import { MapcartaEmbed } from '@/components/map/MapcartaEmbed'
import { MapFilter } from '@/components/map/MapFilter'
import { LocationButton } from '@/components/map/LocationButton'
import { PlaceBottomSheet } from '@/components/map/PlaceBottomSheet'
import { DirectionsPanel } from '@/components/map/DirectionsPanel'
import { useFilteredPlaces } from '@/hooks/usePlaces'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useAppStore } from '@/store'
import { BAHIR_DAR_CENTER } from '@/constants'
import { MAPCARTA_BAHIR_DAR, openMapcarta } from '@/constants/guideSites'
import { distanceMeters } from '@/utils/geo'
import type { Place } from '@/types/place'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type MapProvider = 'app' | 'mapcarta'

export default function MapPage() {
  const { location, setMapCenter, mapCenter, selectedPlaceId, setSelectedPlaceId } = useAppStore()
  const { request: requestLocation } = useGeolocation(true)

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string | null>(null)
  const [directionsPlace, setDirectionsPlace] = useState<Place | null>(null)
  const [travelMode, setTravelMode] = useState<'walking' | 'driving'>('walking')
  const [provider, setProvider] = useState<MapProvider>('mapcarta')

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
      {/* Provider toggle */}
      <div className="absolute left-4 right-4 top-4 z-20 flex flex-col gap-2 lg:right-auto lg:w-[420px]">
        <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setProvider('mapcarta')}
            className={cn(
              'flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition',
              provider === 'mapcarta'
                ? 'bg-sky-600 text-white'
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
            )}
          >
            Mapcarta
          </button>
          <button
            type="button"
            onClick={() => setProvider('app')}
            className={cn(
              'flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition',
              provider === 'app'
                ? 'bg-sky-600 text-white'
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
            )}
          >
            App places
          </button>
        </div>

        {provider === 'app' && (
          <div className="flex gap-2">
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
        )}

        {provider === 'mapcarta' && (
          <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
            <p className="text-slate-600 dark:text-slate-300">
              Exploring Bahir Dar on{' '}
              <a
                href={MAPCARTA_BAHIR_DAR}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-sky-600 hover:underline"
              >
                Mapcarta
              </a>
            </p>
            <Button
              size="sm"
              variant="outline"
              className="h-8 shrink-0"
              onClick={() => openMapcarta(search || 'Bahir Dar')}
            >
              <ExternalLink className="h-3.5 w-3.5" /> Full site
            </Button>
          </div>
        )}
      </div>

      {provider === 'mapcarta' ? (
        <MapcartaEmbed className="absolute inset-0 z-0 h-full w-full" />
      ) : (
        <MapView
          places={places}
          selectedPlaceId={selectedPlaceId}
          userLocation={userPos}
          center={mapCenter}
          onPlaceSelect={handlePlaceSelect}
          onCenterChange={setMapCenter}
        />
      )}

      {provider === 'app' && isError && (
        <div className="absolute left-1/2 top-36 z-20 flex max-w-sm -translate-x-1/2 items-start gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-red-900 dark:bg-slate-900">
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

      {provider === 'app' && isLoading && (
        <div className="absolute left-1/2 top-36 z-10 -translate-x-1/2 rounded-full bg-white px-4 py-1.5 text-sm shadow dark:bg-slate-900">
          Loading places…
        </div>
      )}

      {provider === 'app' && search && !isLoading && !isError && (
        <div className="absolute left-1/2 top-36 z-10 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs shadow dark:bg-slate-900">
          {places.length} result{places.length !== 1 ? 's' : ''}
        </div>
      )}

      {provider === 'app' && directionsPlace && (
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

      {provider === 'app' && !directionsPlace && (
        <PlaceBottomSheet
          place={selectedPlace}
          distanceM={selectedDistance}
          onClose={() => setSelectedPlaceId(null)}
          onDirections={handleDirections}
        />
      )}

      {provider === 'app' && (
        <div className="absolute bottom-24 left-0 right-0 z-10 px-4 lg:bottom-6">
          <MapFilter active={filter} onChange={setFilter} />
        </div>
      )}
    </div>
  )
}
