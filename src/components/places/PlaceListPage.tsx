import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Loader2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
} from 'lucide-react'
import { PlaceCard } from './PlaceCard'
import { Button } from '@/components/ui/button'
import { useFilteredPlaces } from '@/hooks/usePlaces'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useOsmPlaces } from '@/hooks/useOsmPlaces'
import { useAppStore } from '@/store'
import { rankNearby } from '@/services/places'
import { placeGuideLinks } from '@/constants/guideSites'
import type { OsmCategory } from '@/services/osmPlaces'
import type { Place, SortOption } from '@/types/place'
import { cn } from '@/lib/utils'

interface PlaceListPageProps {
  title: string
  subtitle?: string
  categorySlug: string
  filters?: { id: string; label: string }[]
  emptyMessage?: string
  /** Pull live OpenStreetMap places for this category */
  osmCategories?: OsmCategory[]
  /** When true, show OSM even if Supabase has rows (merged, Supabase first) */
  mergeOsm?: boolean
}

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

export function PlaceListPage({
  title,
  subtitle,
  categorySlug,
  filters = [],
  emptyMessage = 'No places found yet. Verified listings will appear here.',
  osmCategories,
  mergeOsm = true,
}: PlaceListPageProps) {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [sort, setSort] = useState<SortOption>('featured')
  const [showSort, setShowSort] = useState(false)
  const { location } = useAppStore()
  useGeolocation(true)

  const { places, isLoading, error, refetch } = useFilteredPlaces({
    search,
    categorySlug,
    verifiedOnly: activeFilter === 'verified',
  })

  const osmCats = osmCategories ?? ([categorySlug] as OsmCategory[])
  const {
    data: osmPlaces = [],
    isLoading: osmLoading,
    isFetching: osmFetching,
    refetch: refetchOsm,
  } = useOsmPlaces(osmCats, mergeOsm)

  const combined = useMemo(() => {
    if (!mergeOsm) return places
    // Prefer verified Supabase; fill gaps with OSM
    return mergePlaces(places, osmPlaces)
  }, [places, osmPlaces, mergeOsm])

  const sorted = useMemo(() => {
    let list: Place[] = [...combined]
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.short_description?.toLowerCase().includes(q) ||
          p.address?.toLowerCase().includes(q)
      )
    }
    if (activeFilter === 'traditional') list = list.filter((p) => p.restaurant?.traditional_food)
    if (activeFilter === 'vegetarian') list = list.filter((p) => p.restaurant?.vegetarian)
    if (activeFilter === 'atm')
      list = list.filter(
        (p) => p.bank?.has_atm || p.bank?.is_atm_only || p.category?.slug === 'atm'
      )
    if (sort === 'distance' && location.latitude != null && location.longitude != null) {
      return rankNearby(list, location.latitude, location.longitude, 50_000)
    }
    if (sort === 'name') return list.sort((a, b) => a.name.localeCompare(b.name))
    return list.sort(
      (a, b) => Number(b.featured) - Number(a.featured) || Number(b.verified) - Number(a.verified) || a.name.localeCompare(b.name)
    )
  }, [combined, search, sort, location.latitude, location.longitude, activeFilter])

  const loading = isLoading && (osmLoading || !mergeOsm)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-slate-500 dark:text-slate-400">{subtitle}</p>}
          {mergeOsm && (
            <p className="mt-1 text-xs text-slate-400">
              Includes OpenStreetMap data ·{' '}
              <Link to="/discover" className="text-sky-600 hover:underline">
                Discover live map
              </Link>
            </p>
          )}
        </div>
        {mergeOsm && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void refetch()
              void refetchOsm()
            }}
            disabled={osmFetching}
          >
            {osmFetching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh maps
          </Button>
        )}
      </div>

      <div className="mb-4 flex gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${title.toLowerCase()}...`}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 dark:text-slate-100"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 shrink-0 rounded-xl"
          onClick={() => setShowSort(!showSort)}
        >
          <SlidersHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {showSort && (
        <div className="mb-4 flex flex-wrap gap-2">
          {(
            [
              ['featured', 'Featured'],
              ['distance', 'Nearest'],
              ['name', 'Name'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setSort(id)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-sm font-medium',
                sort === id
                  ? 'border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                  : 'border-slate-200 text-slate-600 dark:border-slate-700'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveFilter(null)}
          className={cn(
            'shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium',
            !activeFilter
              ? 'border-sky-500 bg-sky-500 text-white'
              : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
          )}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter(activeFilter === 'verified' ? null : 'verified')}
          className={cn(
            'shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium',
            activeFilter === 'verified'
              ? 'border-sky-500 bg-sky-500 text-white'
              : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
          )}
        >
          Verified
        </button>
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActiveFilter(activeFilter === f.id ? null : f.id)}
            className={cn(
              'shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium',
              activeFilter === f.id
                ? 'border-sky-500 bg-sky-500 text-white'
                : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex flex-col items-center py-20 text-slate-500">
          <Loader2 className="mb-3 h-8 w-8 animate-spin text-sky-500" />
          <p>Loading places…</p>
        </div>
      )}

      {error && !sorted.length && (
        <div className="flex flex-col items-center py-20 text-center">
          <AlertCircle className="mb-3 h-8 w-8 text-red-500" />
          <p className="mb-4 text-sm text-slate-500">Could not load data.</p>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" /> Retry
          </Button>
        </div>
      )}

      {!loading && sorted.length === 0 && (
        <div className="flex flex-col items-center py-20 text-center">
          <MapPin className="mb-3 h-10 w-10 text-slate-300" />
          <p className="font-medium text-slate-700 dark:text-slate-300">{emptyMessage}</p>
          <Link to="/discover" className="mt-4 text-sm font-medium text-sky-600 hover:underline">
            Try Discover (live OpenStreetMap) →
          </Link>
        </div>
      )}

      {!loading && sorted.length > 0 && (
        <>
          <p className="mb-4 text-sm text-slate-500">
            {sorted.length} place{sorted.length !== 1 ? 's' : ''}
            {osmPlaces.length > 0 && (
              <span className="text-slate-400"> · {osmPlaces.length} from OpenStreetMap</span>
            )}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((place) => {
              const isOsm = place.id.startsWith('osm-')
              const links = placeGuideLinks(place)
              return (
                <div key={place.id} className="flex flex-col gap-2">
                  <PlaceCard place={place} />
                  {isOsm && (
                    <div className="flex flex-wrap gap-2 px-1">
                      <a
                        href={links.googleMaps}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700 dark:bg-sky-950 dark:text-sky-300"
                      >
                        <ExternalLink className="h-3 w-3" /> Maps
                      </a>
                      <a
                        href={links.googleDirections}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-teal-50 px-2 py-1 text-xs font-medium text-teal-800 dark:bg-teal-950 dark:text-teal-300"
                      >
                        Directions
                      </a>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
