import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { Search, X, AlertCircle, Layers } from 'lucide-react'
import { MapView, openGoogleMapsDirections } from '@/components/map/MapView'
import { MapFilter } from '@/components/map/MapFilter'
import { LocationButton } from '@/components/map/LocationButton'
import { LocationStatus } from '@/components/map/LocationStatus'
import { PlaceBottomSheet } from '@/components/map/PlaceBottomSheet'
import { DirectionsPanel } from '@/components/map/DirectionsPanel'
import { useFilteredPlaces } from '@/hooks/usePlaces'
import { useOsmPlaces } from '@/hooks/useOsmPlaces'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useAppStore } from '@/store'
import { BAHIR_DAR_CENTER } from '@/constants'
import { getMapboxToken } from '@/constants/map'
import { distanceMeters } from '@/utils/geo'
import { filterRealPlaces } from '@/utils/realPlaces'
import type { Place } from '@/types/place'
import { Button } from '@/components/ui/button'
import { useT } from '@/hooks/useT'

function mergePlaces(primary: Place[], secondary: Place[]): Place[] {
  const seen = new Set(primary.map((p) => p.name.toLowerCase().trim()))
  const out = [...primary]
  for (const p of secondary) {
    const key = p.name.toLowerCase().trim()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(p)
  }
  return out
}

export default function MapPage() {
  const t = useT()
  const { location, setMapCenter, mapCenter, selectedPlaceId, setSelectedPlaceId } = useAppStore()
  const { request: requestLocation, hasFix } = useGeolocation({ autoRequest: true, watch: true })
  const mapboxOn = !!getMapboxToken()
  const didCenterOnFix = useRef(false)

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string | null>(null)
  const [directionsPlace, setDirectionsPlace] = useState<Place | null>(null)
  const [travelMode, setTravelMode] = useState<'walking' | 'driving'>('walking')
  const [includeOsm, setIncludeOsm] = useState(true)

  const categorySlug =
    filter && !['near_me', 'verified'].includes(filter) ? filter : null
  const nearMe = filter === 'near_me'
  const verifiedOnly = filter === 'verified'

  const { places: dbPlaces, isLoading, isError, error, refetch } = useFilteredPlaces({
    search: undefined,
    categorySlug,
    nearMe,
    verifiedOnly,
  })

  const osmCategories = useMemo(() => {
    if (categorySlug === 'hotel') return ['hotel'] as const
    if (categorySlug === 'restaurant' || categorySlug === 'cafe') return ['restaurant', 'cafe'] as const
    if (categorySlug === 'attraction') return ['attraction'] as const
    if (categorySlug === 'transport') return ['transport'] as const
    if (categorySlug === 'bank' || categorySlug === 'atm') return ['bank', 'atm'] as const
    if (categorySlug === 'hospital' || categorySlug === 'pharmacy') return ['hospital', 'pharmacy'] as const
    return ['all'] as const
  }, [categorySlug])

  const {
    data: osmPlaces = [],
    isFetching: osmFetching,
    isError: osmError,
    refetch: refetchOsm,
  } = useOsmPlaces([...osmCategories], includeOsm)

  const places = useMemo(() => {
    const base = filterRealPlaces(dbPlaces)
    // Prefer OSM first when enabled (live POIs), then curated/DB fallbacks
    let list = includeOsm ? mergePlaces(osmPlaces, base) : base
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.short_description?.toLowerCase().includes(q) ||
          p.address?.toLowerCase().includes(q)
      )
    }
    return list
  }, [dbPlaces, osmPlaces, includeOsm, search])

  const selectedPlace = useMemo(
    () => places.find((p) => p.id === selectedPlaceId) ?? null,
    [places, selectedPlaceId]
  )

  const userPos =
    (location.permission === 'granted' || hasFix) &&
    location.latitude != null &&
    location.longitude != null
      ? { lat: location.latitude, lng: location.longitude }
      : null

  const selectedDistance = useMemo(() => {
    if (!selectedPlace || !userPos) return undefined
    return distanceMeters(userPos.lat, userPos.lng, selectedPlace.latitude, selectedPlace.longitude)
  }, [selectedPlace, userPos])

  const directionsDistance = useMemo(() => {
    if (!directionsPlace) return 0
    if (userPos)
      return distanceMeters(
        userPos.lat,
        userPos.lng,
        directionsPlace.latitude,
        directionsPlace.longitude
      )
    return distanceMeters(
      BAHIR_DAR_CENTER.lat,
      BAHIR_DAR_CENTER.lng,
      directionsPlace.latitude,
      directionsPlace.longitude
    )
  }, [directionsPlace, userPos])

  useEffect(() => {
    if (userPos && !didCenterOnFix.current) {
      didCenterOnFix.current = true
      setMapCenter(userPos)
    }
  }, [userPos, setMapCenter])

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

  const handleLocate = useCallback(
    (lat?: number, lng?: number) => {
      if (lat != null && lng != null) {
        setMapCenter({ lat, lng })
        return
      }
      void requestLocation().then((pos) => {
        if (pos) setMapCenter({ lat: pos.latitude, lng: pos.longitude })
        else if (userPos) setMapCenter(userPos)
      })
    },
    [requestLocation, userPos, setMapCenter]
  )

  return (
    <div className="relative h-[calc(100dvh-4rem)] overflow-hidden bg-slate-200">
      <div className="absolute left-4 right-4 top-4 z-[1000] flex flex-col gap-2 lg:right-auto lg:w-[400px]">
        <div className="flex gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <Search className="h-5 w-5 shrink-0 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.map.searchPlaceholder}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
              aria-label={t.common.search}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="rounded p-0.5 hover:bg-slate-100"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            )}
          </div>
          <LocationButton onLocated={(lat, lng) => handleLocate(lat, lng)} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <LocationStatus />
          <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
            {t.map.liveMap}
          </span>
          {mapboxOn && (
            <span className="rounded-full bg-sky-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
              {t.map.mapboxTiles}
            </span>
          )}
          <button
            type="button"
            onClick={() => setIncludeOsm((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium shadow-sm ${
              includeOsm
                ? 'border-emerald-600 bg-emerald-600 text-white'
                : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            {includeOsm ? t.map.osmOn : t.map.osmOff}
            {osmFetching && includeOsm ? '…' : ''}
          </button>
          <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium text-slate-600 shadow-sm dark:bg-slate-900/95">
            {places.length} {t.map.places}
          </span>
        </div>
      </div>

      <MapView
        places={places}
        selectedPlaceId={selectedPlaceId}
        userLocation={userPos}
        center={mapCenter}
        onPlaceSelect={handlePlaceSelect}
        onCenterChange={setMapCenter}
      />

      {includeOsm && osmError && osmPlaces.length === 0 && (
        <div className="absolute left-1/2 top-40 z-[1000] max-w-sm -translate-x-1/2 rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-amber-900 dark:bg-slate-900">
          <p className="font-medium text-amber-800 dark:text-amber-200">{t.map.osmSlow}</p>
          <p className="text-xs text-slate-500">{t.map.osmSlowBody}</p>
          <Button size="sm" variant="outline" className="mt-2" onClick={() => void refetchOsm()}>
            {t.map.retryOsm}
          </Button>
        </div>
      )}

      {isError && places.length === 0 && (
        <div className="absolute left-1/2 top-40 z-[1000] flex max-w-sm -translate-x-1/2 items-start gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-sm shadow-lg">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <div>
            <p className="font-medium text-red-700">{t.map.loadFail}</p>
            <p className="text-xs text-slate-500">
              {error instanceof Error ? error.message : t.common.error}
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-2"
              onClick={() => {
                void refetch()
                void refetchOsm()
              }}
            >
              {t.common.retry}
            </Button>
          </div>
        </div>
      )}

      {isLoading && places.length === 0 && (
        <div className="absolute left-1/2 top-40 z-[1000] -translate-x-1/2 rounded-full bg-white px-4 py-1.5 text-sm shadow">
          {t.map.loading}
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

      <div className="absolute bottom-24 left-0 right-0 z-[1000] px-4 lg:bottom-6">
        <MapFilter active={filter} onChange={setFilter} />
        <p className="mt-2 text-center text-[10px] text-slate-700 drop-shadow-sm dark:text-slate-200">
          {t.map.footer}
        </p>
      </div>
    </div>
  )
}
