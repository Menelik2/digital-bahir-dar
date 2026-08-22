import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, MapPin, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { PlaceCard } from './PlaceCard'
import { Button } from '@/components/ui/button'
import { useFilteredPlaces } from '@/hooks/usePlaces'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useAppStore } from '@/store'
import { rankNearby } from '@/services/places'
import type { Place, SortOption } from '@/types/place'
import { cn } from '@/lib/utils'

interface PlaceListPageProps {
  title: string
  subtitle?: string
  categorySlug: string
  filters?: { id: string; label: string }[]
  emptyMessage?: string
}

export function PlaceListPage({
  title,
  subtitle,
  categorySlug,
  filters = [],
  emptyMessage = 'No places found yet. Verified listings will appear here.',
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

  const sorted = useMemo(() => {
    let list: Place[] = [...places]
    if (activeFilter === 'traditional') list = list.filter((p) => p.restaurant?.traditional_food)
    if (activeFilter === 'vegetarian') list = list.filter((p) => p.restaurant?.vegetarian)
    if (activeFilter === 'atm') list = list.filter((p) => p.bank?.has_atm || p.bank?.is_atm_only || p.category?.slug === 'atm')
    if (sort === 'distance' && location.latitude != null && location.longitude != null) {
      return rankNearby(list, location.latitude, location.longitude, 50_000)
    }
    if (sort === 'name') return list.sort((a, b) => a.name.localeCompare(b.name))
    return list.sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name))
  }, [places, sort, location.latitude, location.longitude, activeFilter])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-slate-500">{subtitle}</p>}
      </div>
      <div className="mb-4 flex gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900">
          <Search className="h-5 w-5 text-slate-400" />
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${title.toLowerCase()}...`}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" />
        </div>
        <Button variant="outline" size="icon" className="h-11 w-11 shrink-0 rounded-xl" onClick={() => setShowSort(!showSort)}>
          <SlidersHorizontal className="h-5 w-5" />
        </Button>
      </div>
      {showSort && (
        <div className="mb-4 flex flex-wrap gap-2">
          {([['featured', 'Featured'], ['distance', 'Nearest'], ['name', 'Name']] as const).map(([id, label]) => (
            <button key={id} type="button" onClick={() => setSort(id)}
              className={cn('rounded-full border px-3 py-1.5 text-sm font-medium',
                sort === id ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 text-slate-600 dark:border-slate-700')}>
              {label}
            </button>
          ))}
        </div>
      )}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        <button type="button" onClick={() => setActiveFilter(null)}
          className={cn('shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium',
            !activeFilter ? 'border-sky-500 bg-sky-500 text-white' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900')}>All</button>
        <button type="button" onClick={() => setActiveFilter(activeFilter === 'verified' ? null : 'verified')}
          className={cn('shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium',
            activeFilter === 'verified' ? 'border-sky-500 bg-sky-500 text-white' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900')}>Verified</button>
        {filters.map((f) => (
          <button key={f.id} type="button" onClick={() => setActiveFilter(activeFilter === f.id ? null : f.id)}
            className={cn('shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium',
              activeFilter === f.id ? 'border-sky-500 bg-sky-500 text-white' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900')}>{f.label}</button>
        ))}
      </div>
      {isLoading && (
        <div className="flex flex-col items-center py-20 text-slate-500">
          <Loader2 className="mb-3 h-8 w-8 animate-spin text-sky-500" /><p>Loading…</p>
        </div>
      )}
      {error && (
        <div className="flex flex-col items-center py-20 text-center">
          <AlertCircle className="mb-3 h-8 w-8 text-red-500" />
          <p className="mb-4 text-sm text-slate-500">Could not load data.</p>
          <Button variant="outline" onClick={() => refetch()}><RefreshCw className="h-4 w-4" /> Retry</Button>
        </div>
      )}
      {!isLoading && !error && sorted.length === 0 && (
        <div className="flex flex-col items-center py-20 text-center">
          <MapPin className="mb-3 h-10 w-10 text-slate-300" />
          <p className="font-medium text-slate-700 dark:text-slate-300">{emptyMessage}</p>
        </div>
      )}
      {!isLoading && !error && sorted.length > 0 && (
        <>
          <p className="mb-4 text-sm text-slate-500">{sorted.length} place{sorted.length !== 1 ? 's' : ''}</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((place) => <PlaceCard key={place.id} place={place} />)}
          </div>
        </>
      )}
    </div>
  )
}
