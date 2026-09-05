import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Navigation, LocateFixed, Loader2, RefreshCw, X } from 'lucide-react'
import { PlaceCard } from '@/components/places/PlaceCard'
import { useFilteredPlaces } from '@/hooks/usePlaces'
import { useOsmPlaces } from '@/hooks/useOsmPlaces'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useT } from '@/hooks/useT'
import { rankNearby, searchPlaces } from '@/services/places'
import { filterRealPlaces } from '@/utils/realPlaces'
import type { OsmCategory } from '@/services/osmPlaces'
import type { Place } from '@/types/place'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const EXPLORE_CATEGORIES: { slug: string; name: string; osm: OsmCategory[] }[] = [
  { slug: 'hotel', name: 'Hotels', osm: ['hotel'] },
  { slug: 'restaurant', name: 'Restaurants', osm: ['restaurant'] },
  { slug: 'cafe', name: 'Cafes', osm: ['cafe'] },
  { slug: 'attraction', name: 'Attractions', osm: ['attraction'] },
  { slug: 'transport', name: 'Transport', osm: ['transport'] },
  { slug: 'bank', name: 'Banks', osm: ['bank', 'atm'] },
  { slug: 'hospital', name: 'Health', osm: ['hospital', 'pharmacy'] },
  { slug: 'shopping', name: 'Shopping', osm: [] },
]

function mergeByName(primary: Place[], secondary: Place[]): Place[] {
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

function matchesCategory(place: Place, slug: string | null): boolean {
  if (!slug) return true
  const s = place.category?.slug || ''
  if (slug === 'restaurant') return s === 'restaurant'
  if (slug === 'cafe') return s === 'cafe'
  if (slug === 'attraction')
    return ['attraction', 'historical', 'religious', 'museum', 'park'].includes(s)
  if (slug === 'bank') return s === 'bank' || s === 'atm'
  if (slug === 'hospital') return s === 'hospital' || s === 'pharmacy' || s === 'emergency'
  if (slug === 'transport') return s === 'transport' || s === 'taxi'
  return s === slug
}

const chipBase =
  'shrink-0 rounded-full px-3.5 py-2 text-[13px] font-semibold transition active:scale-[0.97]'
const chipOn = 'bg-[#078930] text-white shadow-sm shadow-[#078930]/25'
const chipOff =
  'border border-black/[0.08] bg-white text-[#1c1c1e] dark:border-white/10 dark:bg-[#1c1c1e] dark:text-white'

export default function ExplorePage() {
  const t = useT()
  const [params, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(params.get('q') || '')
  const [category, setCategory] = useState<string | null>(params.get('cat') || null)
  const [nearMe, setNearMe] = useState(params.get('near') === '1')
  const { request, loading: geoLoading, error: geoError, hasFix, location } = useGeolocation()

  const { places: dbPlaces, isLoading: dbLoading, refetch: refetchDb } = useFilteredPlaces({
    search: undefined,
    categorySlug: undefined,
    nearMe: false,
  })

  const osmCats = useMemo((): OsmCategory[] => {
    if (!category) return ['all']
    const row = EXPLORE_CATEGORIES.find((c) => c.slug === category)
    return row?.osm?.length ? row.osm : ['all']
  }, [category])

  const {
    data: osmPlaces = [],
    isLoading: osmLoading,
    isFetching: osmFetching,
    refetch: refetchOsm,
  } = useOsmPlaces(osmCats, true)

  useEffect(() => {
    const q = params.get('q')
    if (q != null) setSearch(q)
    const cat = params.get('cat')
    setCategory(cat || null)
    setNearMe(params.get('near') === '1')
  }, [params])

  useEffect(() => {
    const next = new URLSearchParams()
    if (search.trim()) next.set('q', search.trim())
    if (category) next.set('cat', category)
    if (nearMe) next.set('near', '1')
    setSearchParams(next, { replace: true })
  }, [search, category, nearMe, setSearchParams])

  const toggleNearMe = () => {
    if (nearMe) {
      setNearMe(false)
      return
    }
    setNearMe(true)
    if (!hasFix) void request()
  }

  useEffect(() => {
    if (nearMe && !hasFix && !geoLoading && location.permission === 'prompt') {
      void request()
    }
  }, [nearMe, hasFix, geoLoading, location.permission, request])

  const places = useMemo(() => {
    const curated = filterRealPlaces(dbPlaces)
    let list = osmPlaces.length > 0 ? mergeByName(osmPlaces, curated) : curated
    list = list.filter((p) => matchesCategory(p, category))
    if (search.trim()) list = searchPlaces(list, search)
    if (nearMe && hasFix && location.latitude != null && location.longitude != null) {
      return rankNearby(list, location.latitude, location.longitude, 25_000)
    }
    return [...list].sort(
      (a, b) =>
        Number(b.featured) - Number(a.featured) ||
        Number(b.verified) - Number(a.verified) ||
        a.name.localeCompare(b.name)
    )
  }, [
    dbPlaces,
    osmPlaces,
    category,
    search,
    nearMe,
    hasFix,
    location.latitude,
    location.longitude,
  ])

  const isLoading = dbLoading && places.length === 0 && osmLoading

  return (
    <div className="mx-auto max-w-6xl px-4 py-5 sm:py-8">
      {/* Large title */}
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3 sm:mb-6">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-[#1c1c1e] dark:text-white sm:text-3xl">
            {t.explore.title}
          </h1>
          <p className="mt-0.5 text-[14px] text-[#8e8e93] sm:text-[15px]">{t.explore.subtitle}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="min-h-[40px] rounded-full"
          disabled={osmFetching}
          onClick={() => {
            void refetchDb()
            void refetchOsm()
          }}
        >
          {osmFetching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {/* Search + near me */}
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex min-h-[48px] flex-1 items-center gap-2 rounded-[1rem] border border-black/[0.06] bg-white px-3.5 dark:border-white/[0.08] dark:bg-[#1c1c1e]">
          <Search className="h-5 w-5 shrink-0 text-[#8e8e93]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.search.placeholder}
            className="flex-1 bg-transparent text-[16px] text-[#1c1c1e] outline-none placeholder:text-[#8e8e93] dark:text-white"
            aria-label={t.common.search}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="flex h-9 w-9 items-center justify-center rounded-full active:bg-black/5"
              aria-label={t.common.close}
            >
              <X className="h-4 w-4 text-[#8e8e93]" />
            </button>
          )}
        </div>
        <Button
          type="button"
          variant={nearMe ? 'default' : 'outline'}
          className={cn('min-h-[48px] shrink-0 rounded-full', nearMe && 'bg-[#078930] hover:bg-[#056b24]')}
          onClick={toggleNearMe}
        >
          {geoLoading ? (
            <LocateFixed className="h-4 w-4 animate-pulse" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
          {t.explore.nearMe}
        </Button>
      </div>

      {nearMe && geoLoading && (
        <p className="mb-2 text-[13px] text-[#8e8e93]">{t.explore.locating}</p>
      )}
      {nearMe && location.permission === 'denied' && (
        <p className="mb-2 rounded-xl bg-amber-50 px-3 py-2 text-[13px] text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          {t.explore.locationDenied}
        </p>
      )}
      {nearMe && location.permission === 'unsupported' && (
        <p className="mb-2 text-[13px] text-rose-600">{t.explore.locationUnsupported}</p>
      )}
      {nearMe && hasFix && (
        <p className="mb-2 text-[12px] text-[#078930]">
          GPS ±{Math.round(location.accuracy ?? 0)} m · {t.explore.distance.toLowerCase()} (25 km)
        </p>
      )}
      {nearMe && !hasFix && !geoLoading && location.permission === 'granted' && geoError && (
        <p className="mb-2 text-[13px] text-[#8e8e93]">{geoError}</p>
      )}

      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[#078930] px-2.5 py-0.5 text-[11px] font-bold text-white">
          {places.length}
        </span>
        {osmPlaces.length > 0 && (
          <span className="text-[12px] text-[#8e8e93]">{osmPlaces.length} OpenStreetMap</span>
        )}
        {osmFetching && (
          <span className="flex items-center gap-1 text-[12px] text-[#8e8e93]">
            <Loader2 className="h-3 w-3 animate-spin" /> Updating…
          </span>
        )}
      </div>

      {/* Filter chips — horizontal scroll */}
      <div className="mobile-chips mb-5 gap-2">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className={cn(chipBase, !category ? chipOn : chipOff)}
        >
          {t.explore.all}
        </button>
        {EXPLORE_CATEGORIES.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setCategory(category === c.slug ? null : c.slug)}
            className={cn(chipBase, category === c.slug ? chipOn : chipOff)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {isLoading && (
        <p className="flex items-center justify-center gap-2 py-12 text-[#8e8e93]">
          <Loader2 className="h-5 w-5 animate-spin text-[#078930]" />
          {t.explore.loading}
        </p>
      )}

      {!isLoading && places.length === 0 && (
        <p className="py-12 text-center text-[15px] text-[#8e8e93]">
          {nearMe && hasFix ? t.explore.nearbyEmpty : t.explore.empty}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {places.map((p) => (
          <PlaceCard key={p.id} place={p} />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {[
          { to: '/hotels', label: t.nav.hotels },
          { to: '/restaurants', label: t.nav.restaurants },
          { to: '/attractions', label: t.nav.attractions },
          { to: '/transport', label: t.nav.transport },
          { to: '/discover', label: t.nav.discover },
          { to: '/map', label: t.nav.map },
          { to: '/directory', label: t.nav.directory },
          { to: '/guides', label: t.nav.guides },
        ].map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="flex min-h-[48px] items-center justify-center rounded-[1rem] border border-black/[0.06] bg-white px-3 text-center text-[14px] font-semibold text-[#1c1c1e] active:bg-black/[0.03] dark:border-white/[0.08] dark:bg-[#1c1c1e] dark:text-white"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
