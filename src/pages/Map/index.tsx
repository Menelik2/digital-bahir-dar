import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, AlertCircle, Layers } from 'lucide-react'
import { MapView } from '@/components/map/MapView'
import { MapFilter } from '@/components/map/MapFilter'
import { LocationButton } from '@/components/map/LocationButton'
import { WhereAmIPanel } from '@/components/map/WhereAmIPanel'
import { LocationStatus } from '@/components/map/LocationStatus'
import { PlaceBottomSheet } from '@/components/map/PlaceBottomSheet'
import { DirectionsPanel } from '@/components/map/DirectionsPanel'
import { useFilteredPlaces } from '@/hooks/usePlaces'
import { useOsmPlaces } from '@/hooks/useOsmPlaces'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useAppStore } from '@/store'
import { BAHIR_DAR_CENTER } from '@/constants'
import { distanceMeters } from '@/utils/geo'
import { filterRealPlaces } from '@/utils/realPlaces'
import { CURATED_HOTELS } from '@/services/curatedHotels'
import { CURATED_TOURISM_PLACES } from '@/services/curatedTourism'
import { fetchRoute, type TravelMode } from '@/services/routing'
import { rankNearby } from '@/services/places'
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
  const {
    request: requestLocation,
    loading: locationLoading,
    getLastError,
  } = useGeolocation(false)
  const [locationHint, setLocationHint] = useState<string | null>(null)

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
  const includeOsm = true
  const [routeCoords, setRouteCoords] = useState<[number, number][] | null>(null)
  const [routeLoading, setRouteLoading] = useState(false)
  const [routeError, setRouteError] = useState(false)
  const [routeDurationSec, setRouteDurationSec] = useState<number | null>(null)
  const openedDeepLink = useRef<string | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem('dbd-map-basemap', basemap)
    } catch {
      /* ignore */
    }
  }, [basemap])

  useEffect(() => {
    const to = parseToParam(searchParams.get('to'))
    if (to) setMapCenter(to)
  }, [searchParams, setMapCenter])

  // ?locate=1 or ?near=1 — for visitors who open map from “Where am I?”
  useEffect(() => {
    const want = searchParams.get('locate') === '1' || searchParams.get('near') === '1'
    if (!want) return
    let cancelled = false
    ;(async () => {
      try {
        const pos = await requestLocation()
        if (cancelled || !pos) return
        setMapCenter({ lat: pos.latitude, lng: pos.longitude })
        if (searchParams.get('near') === '1') setFilter('near_me')
      } catch {
        setLocationHint('Please allow location to see where you are.')
      }
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const categorySlug = (() => {
    if (!filter || filter === 'near_me' || filter === 'verified') return null
    if (filter === 'taxi') return 'transport'
    return filter
  })()
  const nearMe = filter === 'near_me'
  const verifiedOnly = filter === 'verified'

  const { places: dbPlaces, isLoading, isError, refetch } = useFilteredPlaces({
    search: undefined,
    categorySlug: categorySlug ?? undefined,
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
    isLoading: osmLoading,
    isError: osmError,
    refetch: refetchOsm,
  } = useOsmPlaces(osmCategories, includeOsm)

  const places = useMemo(() => {
    let list = mergePlaces(dbPlaces, includeOsm ? osmPlaces : [])
    if (!categorySlug || categorySlug === 'hotel') {
      list = mergePlaces(list, CURATED_HOTELS as Place[])
    }
    if (!categorySlug || categorySlug === 'attraction') {
      list = mergePlaces(list, CURATED_TOURISM_PLACES as Place[])
    }
    list = filterRealPlaces(list)
    if (verifiedOnly) list = list.filter((p) => p.verified)
    if (search.trim()) {
      const qq = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(qq) ||
          p.short_description?.toLowerCase().includes(qq) ||
          p.category?.name?.toLowerCase().includes(qq)
      )
    }
    if (nearMe && location.latitude != null && location.longitude != null) {
      list = rankNearby(list, location.latitude, location.longitude, 15_000)
    }
    return list
  }, [
    dbPlaces,
    osmPlaces,
    includeOsm,
    categorySlug,
    search,
    verifiedOnly,
    nearMe,
    location.latitude,
    location.longitude,
  ])

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
      setLocationHint(null)
    },
    [setMapCenter]
  )

  const ensureLocationForRoute = useCallback(async () => {
    if (location.latitude != null && location.longitude != null) return true
    try {
      const pos = await requestLocation()
      if (pos) {
        setMapCenter({ lat: pos.latitude, lng: pos.longitude })
        return true
      }
    } catch {
      setLocationHint(getLastError?.() || 'Location needed for route')
    }
    return false
  }, [location.latitude, location.longitude, requestLocation, setMapCenter, getLastError])

  useEffect(() => {
    if (!nearMe) return
    if (location.latitude != null && location.longitude != null) return
    void ensureLocationForRoute()
  }, [nearMe, location.latitude, location.longitude, ensureLocationForRoute])

  const handleDirections = useCallback(
    async (place: Place) => {
      setDirectionsPlace(place)
      setSelectedPlaceId(null)
      const ok = await ensureLocationForRoute()
      if (!ok) return
    },
    [ensureLocationForRoute, setSelectedPlaceId]
  )

  const handleCloseDirections = useCallback(() => {
    setDirectionsPlace(null)
    setRouteCoords(null)
    setRouteError(false)
    setRouteDurationSec(null)
  }, [])

  useEffect(() => {
    if (!directionsPlace || !userPos) {
      setRouteCoords(null)
      setRouteDurationSec(null)
      return
    }
    let cancelled = false
    setRouteLoading(true)
    setRouteError(false)
    ;(async () => {
      try {
        const r = await fetchRoute(
          { lat: userPos.lat, lng: userPos.lng },
          { lat: directionsPlace.latitude, lng: directionsPlace.longitude },
          travelMode
        )
        if (cancelled) return
        if (r?.coordinates?.length) {
          setRouteCoords(r.coordinates)
          setRouteDurationSec(r.duration ?? null)
        } else {
          setRouteCoords(null)
          setRouteError(true)
        }
      } catch {
        if (!cancelled) {
          setRouteCoords(null)
          setRouteError(true)
        }
      } finally {
        if (!cancelled) setRouteLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [directionsPlace, userPos?.lat, userPos?.lng, travelMode])

  return (
    <div className="relative h-[calc(100dvh-3.5rem)] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
      <div className="absolute inset-0 z-0">
        <MapView
          places={places}
          center={mapCenter.lat ? mapCenter : BAHIR_DAR_CENTER}
          selectedId={selectedPlaceId}
          onSelect={handlePlaceSelect}
          onCenterChange={handleCenterChange}
          userLocation={userPos}
          routeCoords={routeCoords}
          basemap={basemap}
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1000] p-3 sm:p-4">
        <div className="pointer-events-auto mx-auto flex max-w-2xl gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.map.searchPlaceholder}
              className="h-11 w-full rounded-xl border border-black/[0.08] bg-white/95 pl-10 pr-10 text-sm shadow-lg outline-none backdrop-blur focus:border-[#078930] dark:border-white/12 dark:bg-[#1c1c1e]/95"
            />
            {search && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400"
                onClick={() => setSearch('')}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button
            size="icon"
            variant="outline"
            className="h-11 w-11 shrink-0 rounded-xl bg-white shadow-lg dark:bg-[#1c1c1e]"
            onClick={() => setBasemap((b) => (b === 'streets' ? 'satellite' : 'streets'))}
            title={basemap === 'streets' ? t.map.layerSatellite : t.map.layerStreets}
          >
            <Layers className="h-5 w-5" />
          </Button>
          <LocationButton onLocated={(lat, lng) => handleLocate(lat, lng)} />
        </div>
        {(isLoading || osmLoading) && (
          <p className="pointer-events-none mt-2 text-center text-[11px] text-slate-600">{t.common.loading}</p>
        )}
        {(isError || (osmError && includeOsm)) && (
          <div className="pointer-events-auto mx-auto mt-2 flex max-w-md items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-100">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="flex-1">{t.map.osmSlowBody}</span>
            <button
              type="button"
              className="font-medium underline"
              onClick={() => {
                void refetch()
                void refetchOsm()
              }}
            >
              {t.common.retry}
            </button>
          </div>
        )}
      </div>

      {locationHint && (
        <div className="absolute left-3 right-16 top-14 z-[1100] rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 shadow-md dark:border-amber-900/40 dark:bg-amber-950/50 dark:text-amber-100">
          {locationHint}
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 top-[4.25rem] z-[1050] px-3 sm:top-[4.5rem] sm:px-4">
        <div className="pointer-events-auto mx-auto max-w-2xl">
          <WhereAmIPanel
            onLocated={(lat, lng) => handleLocate(lat, lng)}
            onNearFilter={(cat) => {
              setFilter(cat)
              setDirectionsPlace(null)
            }}
          />
        </div>
      </div>
      <div className="absolute right-3 top-[4.5rem] z-[1060] hidden sm:block">
        <LocationStatus />
      </div>

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
          onEnableLocation={() => void ensureLocationForRoute()}
          locationLoading={locationLoading}
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
