import { useEffect, useMemo, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, AlertCircle, Layers } from 'lucide-react'
import { MapView } from '@/components/map/MapView'
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
import { CURATED_HOTELS } from '@/services/curatedHotels'
import { CURATED_TOURISM_PLACES } from '@/services/curatedTourism'
import { fetchRoute, type TravelMode } from '@/services/routing'
import type { Place } from '@/types/place'
import type { OsmCategory } from '@/services/osmPlaces'
import { Button } from '@/components/ui/button'
import { useT } from '@/hooks/useT'

function nameKey(name: string) {
  return (name || '').toLowerCase().replace(/\s+/g, ' ').trim().split(' · ')[0]
}

function mergePlaces(primary: Place[], secondary: Place[]): Place[] {
  const seen = new Set(primary.map((p) => nameKey(p.name)))
  const out = [...primary]
  for (const p of secondary) {
    const key = nameKey(p.name)
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(p)
  }
  return out
}

function parseToParam(raw: string | null): { lat: number; lng: number } | null {
  if (!raw) return null
  const parts = raw.split(',').map((s) => Number(s.trim()))
  if (parts.length !== 2 || !Number.isFinite(parts[0]) || !Number.isFinite(parts[1])) return null
  return { lat: parts[0], lng: parts[1] }
}

function isValidPlace(p: Place | null | undefined): p is Place {
  return (
    !!p &&
    Number.isFinite(p.latitude) &&
    Number.isFinite(p.longitude) &&
    typeof p.id === 'string' &&
    p.id.length > 0
  )
}

export default function MapPage() {
  const t = useT()
  const [searchParams] = useSearchParams()
  const { location, setMapCenter, mapCenter, selectedPlaceId, setSelectedPlaceId } = useAppStore()
  useGeolocation(false)

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string | null>(null)
  const [basemap, setBasemap] = useState<'streets' | 'satellite'>(() => {
    try {
      return localStorage.getItem('dbd-map-basemap') === 'satellite' ? 'satellite' : 'streets'
    } catch {
      return 'streets'
    }
  })
  const [directionsPlace, setDirectionsPlace] = useState<Place | null>(null)
  const [travelMode, setTravelMode] = useState<TravelMode>('walking')
  const [includeOsm, setIncludeOsm] = useState(true)
  const [routeCoords, setRouteCoords] = useState<[number, number][] | null>(null)
  const [routeLoading, setRouteLoading] = useState(false)
  const [routeError, setRouteError] = useState(false)
  const [routeDurationSec, setRouteDurationSec] = useState<number | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem('dbd-map-basemap', basemap)
    } catch {
      /* ignore */
    }
  }, [basemap])

  // Deep link: ?to=lat,lng centers the map once
  useEffect(() => {
    const to = parseToParam(searchParams.get('to'))
    if (to) setMapCenter(to)
  }, [searchParams, setMapCenter])

  const categorySlug =
    filter && !['near_me', 'verified'].includes(filter) ? filter : null
  const nearMe = filter === 'near_me'
  const verifiedOnly = filter === 'verified'

  const { places: dbPlaces, isLoading, isError, refetch } = useFilteredPlaces({
    search: undefined,
    categorySlug,
    nearMe,
    verifiedOnly,
  })

  const osmCategories = useMemo((): OsmCategory[] => {
    if (categorySlug === 'hotel') return ['hotel']
    if (categorySlug === 'restaurant' || categorySlug === 'cafe') return ['restaurant', 'cafe']
    if (categorySlug === 'attraction') return ['attraction']
    if (categorySlug === 'transport' || categorySlug === 'taxi') return ['transport']
    if (categorySlug === 'bank' || categorySlug === 'atm') return ['bank', 'atm']
    if (categorySlug === 'hospital' || categorySlug === 'pharmacy') return ['hospital', 'pharmacy']
    return ['all']
  }, [categorySlug])

  const {
    data: osmPlaces = [],
    isFetching: osmFetching,
    isError: osmError,
    refetch: refetchOsm,
  } = useOsmPlaces(osmCategories, includeOsm)

  const places = useMemo(() => {
    let list = mergePlaces(dbPlaces, includeOsm ? osmPlaces : [])
    if (!categorySlug || categorySlug === 'hotel') {
      list = mergePlaces(list, CURATED_HOTELS)
    }
    if (!categorySlug || categorySlug === 'attraction') {
      list = mergePlaces(list, CURATED_TOURISM_PLACES)
    }
    list = filterRealPlaces(list)
    list = list.filter(isValidPlace)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.short_description?.toLowerCase().includes(q) ||
          p.category?.name?.toLowerCase().includes(q)
      )
    }
    return list
  }, [dbPlaces, osmPlaces, includeOsm, categorySlug, search])

  const selectedPlace = useMemo(
    () => places.find((p) => p.id === selectedPlaceId) ?? null,
    [places, selectedPlaceId]
  )

  const userPos =
    location.latitude != null && location.longitude != null
      ? { lat: location.latitude, lng: location.longitude }
      : null

  const selectedDistance =
    selectedPlace && userPos
      ? distanceMeters(userPos.lat, userPos.lng, selectedPlace.latitude, selectedPlace.longitude)
      : undefined

  const directionsDistance =
    directionsPlace && userPos
      ? distanceMeters(userPos.lat, userPos.lng, directionsPlace.latitude, directionsPlace.longitude)
      : undefined

  const handlePlaceSelect = useCallback(
    (place: Place) => {
      setSelectedPlaceId(place.id)
      setDirectionsPlace(null)
      setMapCenter({ lat: place.latitude, lng: place.longitude })
    },
    [setSelectedPlaceId, setMapCenter]
  )

  const handleCenterChange = useCallback(
    (c: { lat: number; lng: number }) => {
      setMapCenter(c)
    },
    [setMapCenter]
  )

  const handleLocate = useCallback(
    (lat: number, lng: number) => {
      setMapCenter({ lat, lng })
    },
    [setMapCenter]
  )

  const handleDirections = useCallback(
    (place: Place) => {
      setDirectionsPlace(place)
      setSelectedPlaceId(null)
    },
    [setSelectedPlaceId]
  )

  const handleCloseDirections = useCallback(() => {
    setDirectionsPlace(null)
    setRouteCoords(null)
    setRouteError(false)
  }, [])

  useEffect(() => {
    if (!directionsPlace || !userPos) {
      setRouteCoords(null)
      return
    }
    let cancelled = false
    setRouteLoading(true)
    setRouteError(false)
    void fetchRoute(
      userPos,
      { lat: directionsPlace.latitude, lng: directionsPlace.longitude },
      travelMode
    )
      .then((r) => {
        if (cancelled) return
        if (r?.coordinates?.length) {
          setRouteCoords(r.coordinates)
          setRouteDurationSec(r.durationSec ?? null)
        } else {
          setRouteCoords(null)
          setRouteError(true)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRouteCoords(null)
          setRouteError(true)
        }
      })
      .finally(() => {
        if (!cancelled) setRouteLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [directionsPlace, userPos, travelMode])

  const mapboxOn = !!getMapboxToken()
  const curatedHotelCount = places.filter((p) => p.id.startsWith('curated-hotel-')).length

  return (
    <div className="relative h-[calc(100dvh-3.5rem)] w-full overflow-hidden lg:h-[calc(100dvh-4rem)]">
      <div className="absolute left-3 right-3 top-3 z-[1000] flex flex-col gap-2 sm:left-4 sm:right-4 sm:top-4 lg:right-auto lg:w-[400px]">
        <div
          className="flex items-center gap-2 rounded-2xl border border-black/[0.06] bg-white/95 px-3 py-2 shadow-lg backdrop-blur-xl dark:border-white/[0.1] dark:bg-[#1c1c1e]/95"
          style={{ WebkitBackdropFilter: 'saturate(180%) blur(20px)' }}
        >
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.map.searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="rounded-full p-1 hover:bg-black/5"
              aria-label="Clear"
            >
              <X className="h-4 w-4 text-slate-400" />
            </button>
          )}
          <LocationButton onLocated={(lat, lng) => handleLocate(lat, lng)} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div
            className="inline-flex overflow-hidden rounded-full border border-black/[0.08] bg-white/95 shadow-sm dark:border-white/12 dark:bg-[#1c1c1e]/95"
            role="group"
            aria-label="Map type"
          >
            <button
              type="button"
              onClick={() => setBasemap('streets')}
              className={`px-3 py-1.5 text-[11px] font-semibold transition ${
                basemap === 'streets'
                  ? 'bg-[#078930] text-white'
                  : 'text-[#3c3c43] dark:text-white/80'
              }`}
            >
              {t.map.layerStreets || 'Streets'}
            </button>
            <button
              type="button"
              onClick={() => setBasemap('satellite')}
              className={`px-3 py-1.5 text-[11px] font-semibold transition ${
                basemap === 'satellite'
                  ? 'bg-[#078930] text-white'
                  : 'text-[#3c3c43] dark:text-white/80'
              }`}
            >
              {t.map.layerSatellite || 'Satellite'}
            </button>
          </div>
          <button
            type="button"
            onClick={() => setIncludeOsm((v) => !v)}
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold shadow-sm ${
              includeOsm
                ? 'border-[#078930]/30 bg-[#078930]/10 text-[#056b24]'
                : 'border-black/[0.08] bg-white/95 text-[#3c3c43] dark:border-white/12 dark:bg-[#1c1c1e]/95 dark:text-white/80'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            {includeOsm ? t.map.osmOn : t.map.osmOff}
            {osmFetching && includeOsm ? '…' : ''}
          </button>
          <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium text-[#3c3c43] shadow-sm dark:bg-[#1c1c1e]/95 dark:text-white/80">
            {places.length} {t.map.places}
            {filter === 'hotel' && curatedHotelCount > 0 && (
              <span className="text-[#078930]"> · {curatedHotelCount} hotels</span>
            )}
          </span>
          {mapboxOn && (
            <span className="rounded-full bg-sky-50 px-2 py-1 text-[10px] font-medium text-sky-800 dark:bg-sky-950 dark:text-sky-200">
              {t.map.mapboxTiles}
            </span>
          )}
        </div>
        <LocationStatus />
      </div>

      <MapView
        places={places}
        selectedPlaceId={selectedPlaceId}
        userLocation={userPos}
        center={mapCenter ?? BAHIR_DAR_CENTER}
        onPlaceSelect={handlePlaceSelect}
        onCenterChange={handleCenterChange}
        routeCoordinates={routeCoords}
        basemap={basemap}
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

      {directionsPlace && isValidPlace(directionsPlace) && (
        <DirectionsPanel
          origin={userPos}
          destination={directionsPlace}
          distanceM={directionsDistance}
          mode={travelMode}
          onModeChange={setTravelMode}
          onClose={handleCloseDirections}
          routeLoading={routeLoading}
          routeError={routeError ? 'error' : null}
          routeDurationSec={routeDurationSec}
        />
      )}

      {!directionsPlace && selectedPlace && (
        <PlaceBottomSheet
          place={selectedPlace}
          distanceM={selectedDistance}
          onClose={() => setSelectedPlaceId(null)}
          onDirections={handleDirections}
        />
      )}

      <div className="absolute bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] left-0 right-0 z-[1000] px-3 sm:px-4 lg:bottom-6">
        <MapFilter active={filter} onChange={setFilter} />
        <p className="mt-2 text-center text-[10px] text-slate-700 drop-shadow-sm dark:text-slate-200">
          {t.map.footer}
        </p>
      </div>
    </div>
  )
}
