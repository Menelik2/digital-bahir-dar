import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  SlidersHorizontal,
  Loader2,
  RefreshCw,
  X,
  Star,
} from 'lucide-react'
import { PlaceCard } from './PlaceCard'
import { Button } from '@/components/ui/button'
import { useFilteredPlaces } from '@/hooks/usePlaces'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useOsmPlaces } from '@/hooks/useOsmPlaces'
import { useAppStore } from '@/store'
import { rankNearby } from '@/services/places'
import { CURATED_HOTELS } from '@/services/curatedHotels'
import type { OsmCategory } from '@/services/osmPlaces'
import type { Place, SortOption } from '@/types/place'
import { cn } from '@/lib/utils'
import { useT } from '@/hooks/useT'
import { StateMessage } from '@/components/feedback/StateMessage'

interface PlaceListPageProps {
  title: string
  subtitle?: string
  categorySlug: string
  filters?: { id: string; label: string }[]
  emptyMessage?: string
  osmCategories?: OsmCategory[]
  mergeOsm?: boolean
  groupByStars?: boolean
}

function mergePlaces(primary: Place[], secondary: Place[]): Place[] {
  const seen = new Set(
    primary.map((p) => p.name.toLowerCase().replace(/\s+/g, ' ').trim().split(' · ')[0])
  )
  const out = [...primary]
  for (const p of secondary) {
    const base = p.name.toLowerCase().replace(/\s+/g, ' ').trim().split(' · ')[0]
    if (seen.has(base)) continue
    seen.add(base)
    out.push(p)
  }
  return out
}

function matchesPriceTier(place: Place, tier: string): boolean {
  const level = place.price_level
  const min = place.hotel?.minimum_price ?? null
  const max = place.hotel?.maximum_price ?? null
  const mid = min != null && max != null ? (min + max) / 2 : min ?? max

  if (tier === 'budget') {
    if (level != null) return level <= 2
    if (mid != null) return mid < 4000
    return true
  }
  if (tier === 'mid') {
    if (level != null) return level === 3
    if (mid != null) return mid >= 4000 && mid < 9000
    return true
  }
  if (tier === 'luxury') {
    if (level != null) return level >= 4
    if (mid != null) return mid >= 9000
    return true
  }
  return true
}

function hotelStarBucket(place: Place): number {
  const s = place.hotel?.star_rating
  if (s != null && s >= 1 && s <= 5) return Math.round(s)
  const pl = place.price_level
  if (pl != null && pl >= 1 && pl <= 5) return Math.min(5, Math.max(1, Math.round(pl)))
  return 0
}

const STAR_ORDER = [5, 4, 3, 2, 1, 0] as const

function starSectionLabel(stars: number, isAm: boolean): string {
  if (stars === 0) return isAm ? 'ዋጋ ያልተገለጸ / Unrated' : 'Unrated'
  if (isAm) return `${stars} ኮከብ ${'★'.repeat(stars)}`
  return `${stars}-star ${'★'.repeat(stars)}`
}

export function PlaceListPage({
  title,
  subtitle,
  categorySlug,
  filters = [],
  emptyMessage,
  osmCategories,
  mergeOsm = true,
  groupByStars = false,
}: PlaceListPageProps) {
  const t = useT()
  const { language } = useAppStore()
  const isAm = language === 'am'
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('featured')
  const [filterId, setFilterId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const { request, hasFix, location } = useGeolocation()

  const {
    places: dbPlaces,
    isLoading,
    isError,
    refetch,
  } = useFilteredPlaces({
    search: undefined,
    categorySlug,
    nearMe: false,
  })

  const {
    data: osmPlaces = [],
    isLoading: osmLoading,
    isFetching: osmFetching,
    refetch: refetchOsm,
  } = useOsmPlaces(osmCategories ?? ['all'], mergeOsm)

  const curatedCount = useMemo(() => {
    if (categorySlug !== 'hotel') return 0
    return CURATED_HOTELS.filter((h) =>
      dbPlaces.some((p) => p.name.toLowerCase().includes(h.name.toLowerCase().slice(0, 12)))
    ).length
  }, [dbPlaces, categorySlug])

  const places = useMemo(() => {
    let list = mergeOsm && osmPlaces.length > 0 ? mergePlaces(dbPlaces, osmPlaces) : dbPlaces
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q) ||
          (p.address || '').toLowerCase().includes(q)
      )
    }
    if (filterId) {
      if (['budget', 'mid', 'luxury'].includes(filterId)) {
        list = list.filter((p) => matchesPriceTier(p, filterId))
      } else if (filterId.startsWith('star-')) {
        const star = Number(filterId.replace('star-', ''))
        list = list.filter((p) => hotelStarBucket(p) === star)
      } else {
        list = list.filter((p) => p.tags?.includes(filterId) || p.category?.slug === filterId)
      }
    }
    if (sort === 'nearby' && hasFix && location.latitude != null && location.longitude != null) {
      return rankNearby(list, location.latitude, location.longitude, 50_000)
    }
    if (sort === 'rating') {
      return [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    }
    if (sort === 'name') {
      return [...list].sort((a, b) => a.name.localeCompare(b.name))
    }
    return [...list].sort(
      (a, b) =>
        Number(b.featured) - Number(a.featured) ||
        Number(b.verified) - Number(a.verified) ||
        (b.rating ?? 0) - (a.rating ?? 0)
    )
  }, [
    dbPlaces,
    osmPlaces,
    mergeOsm,
    search,
    filterId,
    sort,
    hasFix,
    location.latitude,
    location.longitude,
  ])

  const sorted = places

  const starGroups = useMemo(() => {
    if (!groupByStars) return null
    const map = new Map<number, Place[]>()
    for (const p of sorted) {
      const s = hotelStarBucket(p)
      if (!map.has(s)) map.set(s, [])
      map.get(s)!.push(p)
    }
    return STAR_ORDER.filter((s) => map.has(s)).map((s) => ({
      stars: s,
      places: map.get(s)!,
    }))
  }, [sorted, groupByStars])

  const renderCard = (p: Place) => <PlaceCard key={p.id} place={p} />

  if (isError) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <StateMessage
          variant="error"
          title={t.common.error}
          body={t.list.loadFail}
          action={
            <Button onClick={() => void refetch()} variant="outline" className="rounded-full">
              <RefreshCw className="h-4 w-4" /> {t.common.retry}
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-5 sm:py-8">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3 sm:mb-6">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-[#1c1c1e] dark:text-white sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-0.5 text-[14px] text-[#8e8e93] sm:text-[15px]">{subtitle}</p>}
          {mergeOsm && (
            <p className="mt-1 text-xs text-slate-400">
              {t.list.includesOsm} ·{' '}
              <Link to="/discover" className="text-sky-600 hover:underline">{t.list.discoverLive}</Link>
            </p>
          )}
        </div>
        {mergeOsm && (
          <Button variant="outline" size="sm" className="min-h-[40px] rounded-full" onClick={() => { void refetch(); void refetchOsm() }} disabled={osmFetching}>
            {osmFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {t.list.refreshMaps}
          </Button>
        )}
      </div>

      <div className="mb-3 flex gap-2">
        <div className="flex min-h-[48px] flex-1 items-center gap-2 rounded-[1rem] border border-black/[0.06] bg-white px-3.5 dark:border-white/[0.08] dark:bg-[#1c1c1e]">
          <Search className="h-5 w-5 shrink-0 text-[#8e8e93]" />
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`${t.list.searchPrefix} ${title}…`} className="flex-1 bg-transparent text-[16px] outline-none placeholder:text-[#8e8e93] dark:text-white" />
          {search && (
            <button type="button" onClick={() => setSearch('')} className="flex h-9 w-9 items-center justify-center rounded-full" aria-label={t.common.close}>
              <X className="h-4 w-4 text-[#8e8e93]" />
            </button>
          )}
        </div>
        <Button variant="outline" size="icon" className="h-12 w-12 shrink-0 rounded-xl" onClick={() => setShowFilters((v) => !v)} aria-label="Filters">
          <SlidersHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {showFilters && (
        <div className="mb-4 flex flex-wrap gap-2 rounded-[1rem] border border-black/[0.06] bg-white p-3 dark:border-white/[0.08] dark:bg-[#1c1c1e]">
          {([
            { id: 'featured' as SortOption, label: t.common.featured },
            { id: 'rating' as SortOption, label: 'Rating' },
            { id: 'name' as SortOption, label: t.common.name },
            { id: 'nearby' as SortOption, label: t.explore.nearMe },
          ] as const).map((s) => (
            <button key={s.id} type="button" onClick={() => { setSort(s.id); if (s.id === 'nearby' && !hasFix) void request() }}
              className={cn('min-h-[36px] rounded-full px-3 text-[13px] font-semibold', sort === s.id ? 'bg-[#078930] text-white' : 'bg-black/[0.05] text-[#3c3c43] dark:bg-white/10 dark:text-white/80')}>
              {s.label}
            </button>
          ))}
        </div>
      )}

      {(isLoading || osmLoading) && sorted.length === 0 && (
        <p className="flex items-center justify-center gap-2 py-12 text-[#8e8e93]">
          <Loader2 className="h-5 w-5 animate-spin text-[#078930]" /> {t.common.loading}
        </p>
      )}

      {!isLoading && sorted.length === 0 && (
        <p className="py-12 text-center text-[15px] text-[#8e8e93]">{emptyMessage || t.explore.empty}</p>
      )}

      {sorted.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {sorted.map(renderCard)}
        </div>
      )}
    </div>
  )
}
