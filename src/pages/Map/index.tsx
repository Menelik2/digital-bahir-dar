import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
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
import { Button } from '@/components/ui/button'
import { useT } from '@/hooks/useT'

function nameKey(name: string) {
  return (name || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .split(' · ')[0]
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
  const [searchParams, setSearchParams] = useSearchParams()
  const { location, setMapCenter, mapCenter, selectedPlaceId, setSelectedPlaceId } = useAppStore()
  const { request: requestLocation, hasFix } = useGeolocation({ autoRequest: true, watch: true })
  const mapboxOn = !!getMapboxToken()
  const didCenterOnFix = useRef(false)
  const didApplyDeepLink = useRef(false)

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string | null>(null)
  const [directionsPlace, setDirectionsPlace] = useState<Place | null>(null)
  const [travelMode, setTravelMode] = useState<TravelMode>('walking')
  const [includeOsm, setIncludeOsm] = useState(true)
  const [routeCoords, setRouteCoords] = useState<[number, number][] | null>(null)
  const [routeLoading, setRouteLoading] = useState(false)
  const [routeError, setRouteError] = useState(false)
  const [routeDurationSec, setRouteDurationSec] = useState<number | null>(null)
  const [routeDistanceM, setRouteDistanceM] = useState<number | null>(null)

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
    let list: Place[] = []

    if (!categorySlug || categorySlug === 'hotel') {
      list = mergePlaces(list, CURATED_HOTELS)
    }
    if (!categorySlug || categorySlug === 'attraction') {
      list = mergePlaces(list, CURATED_TOURISM_PLACES)
    }

    const base = filterRealPlaces(dbPlaces)
    list = mergePlaces(list, base)

    if (includeOsm) {
      list = mergePlaces(list, osmPlaces)
    }

    list = list.filter(isValidPlace)

    if (nearMe && location.latitude != null && location.longitude != null) {
      list = list.filter((p) => {
        if (p.id.startsWith('curated-hotel-') || p.id.startsWith('curated-tourism-')) return true
        const d = distanceMeters(location.latitude!, location.longitude!, p.latitude, p.longitude)
        return d <= 12_000
      })
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (p) =>
          (p.name || '').toLowerCase().includes(q) ||
          p.short_description?.toLowerCase().includes(q) ||
          p.address?.toLowerCase().includes(q)
      )
    }

    return list
  }, [
    dbPlaces,
    osmPlaces,
    includeOsm,
    search,
    categorySlug,
    nearMe,
    location.latitude,
    location.longitude,
  ])

  const selectedPlace = useMemo(
    () => places.find((p) => p.id === selectedPlaceId) ?? null,
    [places, selectedPlaceId]
  )

  const userPos =
    (location.permission === 'granted' || hasFix) &&
    location.latitude != null &&
    location.longitude != null &&
    Number.isFinite(location.latitude) &&
    Number.isFinite(location.longitude)
      ? { lat: location.latitude, lng: location.longitude }
      : null

  const selectedDistance = useMemo(() => {
    if (!selectedPlace || !userPos) return undefined
    return distanceMeters(userPos.lat, userPos.lng, selectedPlace.latitude, selectedPlace.longitude)
  }, [selectedPlace, userPos])

  const directionsDistance = useMemo(() => {
    if (!directionsPlace) return 0
    if (routeDistanceM != null) return routeDistanceM
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
  }, [directionsPlace, userPos, routeDistanceM])

  useEffect(() => {
    const to = parseToParam(searchParams.get('to'))
    if (!to) {
      didApplyDeepLink.current = false
      return
    }
    if (didApplyDeepLink.current) return
    didApplyDeepLink.current = true

    const modeParam = searchParams.get('mode')
    const mode: TravelMode = modeParam === 'driving' ? 'driving' : 'walking'
    const name = searchParams.get('name') || 'Destination'
    const placeId = searchParams.get('placeId') || `dir-${to.lat}-${to.lng}`

    const fromList = places.find(
      (p) =>
        p.id === placeId ||
        (Math.abs(p.latitude - to.lat) < 1e-5 && Math.abs(p.longitude - to.lng) < 1e-5)
    )

    const dest: Place =
      fromList ??
      ({
        id: placeId,
        slug: placeId,
        name,
        latitude: to.lat,
        longitude: to.lng,
        featured: false,
        verified: false,
        status: 'published',
        currency: 'ETB',
      } as Place)

    setTravelMode(mode)
    setDirectionsPlace(dest)
    setSelectedPlaceId(dest.id)
    setMapCenter({ lat: to.lat, lng: to.lng })
  }, [searchParams, places, setMapCenter, setSelectedPlaceId])

  useEffect(() => {
    if (!directionsPlace || !isValidPlace(directionsPlace)) {
      setRouteCoords(null)
      setRouteDistanceM(null)
      setRouteDurationSec(null)
      setRouteError(false)
      setRouteLoading(false)
      return
    }

    const origin = userPos ?? {
      lat: BAHIR_DAR_CENTER.lat,
      lng: BAHIR_DAR_CENTER.lng,
    }
    const dest = {
      lat: directionsPlace.latitude,
      lng: directionsPlace.longitude,
    }

    const ac = new AbortController()
    setRouteLoading(true)
    setRouteError(false)

    void fetchRoute(origin, dest, travelMode, ac.signal).then((route) => {
      if (ac.signal.aborted) return
      setRouteLoading(false)
      if (!route) {
        setRouteError(true)
        setRouteCoords([
          [origin.lat, origin.lng],
          [dest.lat, dest.lng],
        ])
        setRouteDistanceM(distanceMeters(origin.lat, origin.lng, dest.lat, dest.lng))
        setRouteDurationSec(null)
        return
      }
      setRouteCoords(route.coordinates)
      setRouteDistanceM(route.distanceM)
      setRouteDurationSec(route.durationSec)
    })

    return () => ac.abort()
  }, [directionsPlace, userPos, travelMode])

  useEffect(() => {
    if (userPos && !didCenterOnFix.current) {
      didCenterOnFix.current = true
      setMapCenter(userPos)
    }
  }, [userPos, setMapCenter])

  const handlePlaceSelect = useCallback(
    (place: Place) => {
      if (!isValidPlace(place)) return
      setSelectedPlaceId(place.id)
      setMapCenter({ lat: place.latitude, lng: place.longitude })
      setDirectionsPlace(null)
      setRouteCoords(null)
      if (searchParams.has('to')) {
        didApplyDeepLink.current = false
        const next = new URLSearchParams(searchParams)
        next.delete('to')
        next.delete('mode')
        next.delete('name')
        next.delete('placeId')
        setSearchParams(next, { replace: true })
      }
    },
    [setSelectedPlaceId, setMapCenter, searchParams, setSearchParams]
  )

  const handleDirections = useCallback((place: Place) => {
    if (!isValidPlace(place)) return
    setDirectionsPlace(place)
  }, [])

  const handleCloseDirections = useCallback(() => {
    setDirectionsPlace(null)
    setRouteCoords(null)
    if (searchParams.has('to')) {
      didApplyDeepLink.current = false
      const next = new URLSearchParams(searchParams)
      next.delete('to')
      next.delete('mode')
      next.delete('name')
      next.delete('placeId')
      setSearchParams(next, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const handleLocate = useCallback(
    (lat?: number, lng?: number) => {
      if (lat != null && lng != null && Number.isFinite(lat) && Number.isFinite(lng)) {
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

  const centerTimer = useRef<number | null>(null)
  const handleCenterChange = useCallback(
    (c: { lat: number; lng: number }) => {
      if (centerTimer.current) window.clearTimeout(centerTimer.current)
      centerTimer.current = window.setTimeout(() => {
        setMapCenter(c)
      }, 200)
    },
    [setMapCenter]
  )

  const curatedHotelCount = places.filter((p) => p.id.startsWith('curated-hotel-')).length

  return (
    <div className="relative h-[calc(100dvh-3.25rem-env(safe-area-inset-top,0px))] overflow-hidden bg-[#e8e8ed] dark:bg-black lg:h-[calc(100dvh-4rem)]">
      <div className="absolute left-3 right-3 top-3 z-[1000] flex flex-col gap-2 sm:left-4 sm:right-4 sm:top-4 lg:right-auto lg:w-[400px]">
        <div className="flex gap-2">
          <div
            className="flex min-h-[48px] flex-1 items-center gap-2 rounded-[1.15rem] border border-black/[0.06] bg-white/90 px-3.5 shadow-lg backdrop-blur-xl dark:border-white/[0.1] dark:bg-[#1c1c1e]/90"
            style={{ WebkitBackdropFilter: 'saturate(180%) blur(20px)' }}
          >
            <Search className="h-5 w-5 shrink-0 text-[#8e8e93]" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.map.searchPlaceholder}
              className="flex-1 bg-transparent text-[16px] outline-none placeholder:text-[#8e8e93] dark:text-white"
              aria-label={t.common.search}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="flex h-9 w-9 items-center justify-center rounded-full active:bg-black/5"
              >
                <X className="h-4 w-4 text-[#8e8e93]" />
              </button>
            )}
          </div>
          <LocationButton onLocated={(lat, lng) => handleLocate(lat, lng)} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <LocationStatus />
          <span className="rounded-full bg-[#078930] px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
            {t.map.liveMap}
          </span>
          {mapboxOn && (
            <span className="rounded-full bg-[#0b6e99] px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
              {t.map.mapboxTiles}
            </span>
          )}
          <button
            type="button"
            onClick={() => setIncludeOsm((v) => !v)}
            className={`inline-flex min-h-[32px] items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm transition active:scale-[0.97] ${
              includeOsm
                ? 'border-[#078930] bg-[#078930] text-white'
                : 'border-black/[0.08] bg-white/90 text-[#3c3c43] backdrop-blur-md dark:border-white/12 dark:bg-[#1c1c1e]/90 dark:text-white'
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
        </div>
      </div>

      <MapView
        places={places}
        selectedPlaceId={selectedPlaceId}
        userLocation={userPos}
        center={mapCenter}
        onPlaceSelect={handlePlaceSelect}
        onCenterChange={handleCenterChange}
        routeCoordinates={routeCoords}
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

      {directionsPlace && isValidPlace(directionsPlace) && (
        <DirectionsPanel
          origin={userPos}
          destination={directionsPlace}
          distanceM={directionsDistance}
          mode={travelMode}
          onModeChange={setTravelMode}
          onClose={handleCloseDirections}
          routeLoading={routeLoading}
          routeError={routeError}
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
