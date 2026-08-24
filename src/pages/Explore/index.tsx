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

/** Category chips shown on Explore (includes transport — missing from older CATEGORIES slice) */
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

export default function ExplorePage() {
  const t = useT()
  const [params, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(params.get('q') || '')
  const [category, setCategory] = useState<string | null>(params.get('cat') || null)
  const [nearMe, setNearMe] = useState(params.get('near') === '1')
  const { request, loading: geoLoading, error: geoError, hasFix, location } = useGeolocation()

  // Curated / Supabase base list (all categories — we filter client-side after OSM merge)
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

  // Keep URL in sync for shareable filters
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
    // Prefer live OSM when available, then curated landmarks (filter out demo hotels/restaurants)
    let list =
      osmPlaces.length > 0 ? mergeByName(osmPlaces, curated) : curated

    list = list.filter((p) => matchesCategory(p, category))

    if (search.trim()) {
      list = searchPlaces(list, search)
    }

    // Near me: only rank when we have a fix — otherwise keep full list (avoid empty flash)
    if (nearMe && hasFix && location.latitude != null && location.longitude != null) {
      return rankNearby(list, location.latitude, location.longitude, 25_000)
    }

    // Default: featured first, then verified, then name
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
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-50">
            {t.explore.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">{t.explore.subtitle}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
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

      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900">
          <Search className="h-5 w-5 shrink-0 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.search.placeholder}
            className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
            aria-label={t.common.search}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="rounded p-0.5 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label={t.common.close}
            >
              <X className="h-4 w-4 text-slate-400" />
            </button>
          )}
        </div>
        <Button
          type="button"
          variant={nearMe ? 'default' : 'outline'}
          className={cn('shrink-0', nearMe && 'bg-teal-600 hover:bg-teal-700')}
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
        <p className="mb-3 text-sm text-slate-500">{t.explore.locating}</p>
      )}
      {nearMe && location.permission === 'denied' && (
        <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100">
          {t.explore.locationDenied}
        </p>
      )}
      {nearMe && location.permission === 'unsupported' && (
        <p className="mb-3 text-sm text-rose-600">{t.explore.locationUnsupported}</p>
      )}
      {nearMe && hasFix && (
        <p className="mb-3 text-xs text-teal-700 dark:text-teal-400">
          GPS ±{Math.round(location.accuracy ?? 0)} m · sorted by{' '}
          {t.explore.distance.toLowerCase()} (25 km)
        </p>
      )}
      {nearMe && !hasFix && !geoLoading && location.permission === 'granted' && geoError && (
        <p className="mb-3 text-sm text-slate-500">{geoError}</p>
      )}

      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-sky-600 px-2.5 py-0.5 text-[11px] font-semibold text-white">
          {places.length} places
        </span>
        {osmPlaces.length > 0 && (
          <span className="text-xs text-slate-500">{osmPlaces.length} from OpenStreetMap</span>
        )}
        {osmFetching && (
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Loader2 className="h-3 w-3 animate-spin" /> Updating map data…
          </span>
        )}
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className={cn(
            'shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium',
            !category
              ? 'border-sky-500 bg-sky-500 text-white'
              : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
          )}
        >
          {t.explore.all}
        </button>
        {EXPLORE_CATEGORIES.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setCategory(category === c.slug ? null : c.slug)}
            className={cn(
              'shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium',
              category === c.slug
                ? 'border-sky-500 bg-sky-500 text-white'
                : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      {isLoading && (
        <p className="flex items-center justify-center gap-2 py-12 text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-sky-500" />
          {t.explore.loading}
        </p>
      )}

      {!isLoading && places.length === 0 && (
        <p className="py-12 text-center text-slate-500">
          {nearMe && hasFix ? t.explore.nearbyEmpty : t.explore.empty}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {places.map((p) => (
          <PlaceCard key={p.id} place={p} />
        ))}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
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
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-medium text-slate-800 transition hover:border-sky-300 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-sky-700 dark:hover:bg-sky-950/40"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
