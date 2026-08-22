import { useMemo, useState } from 'react'
import { ExternalLink, MapPin, Loader2, RefreshCw, Search, X, Compass } from 'lucide-react'
import { useOsmPlaces } from '@/hooks/useOsmPlaces'
import type { OsmCategory } from '@/services/osmPlaces'
import { CURATED_PLACES } from '@/services/demoPlaces'
import { GUIDE_SITES, placeGuideLinks, categoryGuideSearch } from '@/constants/guideSites'
import { PlaceCard } from '@/components/places/PlaceCard'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { filterRealPlaces } from '@/utils/realPlaces'
import type { Place } from '@/types/place'
import { useT } from '@/hooks/useT'

function matchesCategory(place: Place, cat: OsmCategory): boolean {
  if (cat === 'all') return true
  const slug = place.category?.slug || ''
  if (cat === 'restaurant') return slug === 'restaurant' || slug === 'cafe'
  if (cat === 'cafe') return slug === 'cafe'
  if (cat === 'attraction')
    return ['attraction', 'historical', 'religious', 'museum', 'park'].includes(slug)
  if (cat === 'hospital') return slug === 'hospital' || slug === 'pharmacy' || slug === 'emergency'
  if (cat === 'bank') return slug === 'bank' || slug === 'atm'
  if (cat === 'atm') return slug === 'atm'
  return slug === cat
}

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

export default function DiscoverPage() {
  const t = useT()
  const [cat, setCat] = useState<OsmCategory>('all')
  const [q, setQ] = useState('')

  const FILTERS: { id: OsmCategory; label: string }[] = [
    { id: 'all', label: t.common.all },
    { id: 'hotel', label: t.discover.hotels },
    { id: 'restaurant', label: t.discover.restaurants },
    { id: 'cafe', label: t.discover.cafes },
    { id: 'attraction', label: t.discover.sights },
    { id: 'transport', label: t.discover.transport },
    { id: 'bank', label: t.discover.banks },
    { id: 'atm', label: t.discover.atms },
    { id: 'hospital', label: t.discover.health },
  ]

  const osmCats = useMemo((): OsmCategory[] => {
    if (cat === 'all') return ['all']
    if (cat === 'restaurant') return ['restaurant', 'cafe']
    if (cat === 'hospital') return ['hospital', 'pharmacy']
    if (cat === 'bank') return ['bank', 'atm']
    return [cat]
  }, [cat])

  const {
    data: osmPlaces = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useOsmPlaces(osmCats, true)

  const curated = useMemo(() => filterRealPlaces(CURATED_PLACES), [])

  const places = useMemo(() => {
    const curatedFiltered = curated.filter((p) => matchesCategory(p, cat))
    let list =
      osmPlaces.length > 0 ? mergeByName(osmPlaces, curatedFiltered) : curatedFiltered

    if (q.trim()) {
      const needle = q.trim().toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(needle) ||
          p.short_description?.toLowerCase().includes(needle) ||
          p.address?.toLowerCase().includes(needle) ||
          p.category?.name?.toLowerCase().includes(needle)
      )
    }

    return list.sort((a, b) => a.name.localeCompare(b.name))
  }, [osmPlaces, curated, cat, q])

  const searchLinks = categoryGuideSearch(
    cat === 'all' ? 'places' : cat === 'attraction' ? 'attractions' : cat
  )

  const showInitialSpinner = isLoading && places.length === 0

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Compass className="h-6 w-6 text-sky-600" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{t.discover.title}</h1>
          </div>
          <p className="mt-1 max-w-2xl text-slate-500 dark:text-slate-400">{t.discover.subtitle}</p>
          <p className="mt-1 text-xs text-slate-400">{t.discover.osmCredit}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void refetch()} disabled={isFetching}>
          {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          {t.discover.refresh}
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <Search className="h-5 w-5 shrink-0 text-slate-400" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.discover.searchPlaceholder}
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          aria-label={t.common.search}
        />
        {q && (
          <button type="button" onClick={() => setQ('')} className="rounded p-0.5 hover:bg-slate-100">
            <X className="h-4 w-4 text-slate-400" />
          </button>
        )}
      </div>

      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[11px] font-semibold text-white">
          {places.length} {t.discover.placesCount}
        </span>
        {isFetching && (
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Loader2 className="h-3 w-3 animate-spin" /> {t.discover.updatingOsm}
          </span>
        )}
        {!isFetching && osmPlaces.length > 0 && (
          <span className="text-xs text-slate-500">
            {osmPlaces.length} {t.discover.fromLiveOsm}
          </span>
        )}
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setCat(f.id)}
            className={cn(
              'shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition',
              cat === f.id
                ? 'border-sky-500 bg-sky-500 text-white'
                : 'border-slate-200 bg-white hover:border-sky-300 dark:border-slate-700 dark:bg-slate-900'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <section className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          {t.discover.guideSites}
        </h2>
        <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">{t.discover.guideSitesBody}</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDE_SITES.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white p-3 text-sm transition hover:border-sky-300 dark:border-slate-700 dark:bg-slate-950"
            >
              <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
              <span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{s.name}</span>
                <span className="mt-0.5 block text-xs text-slate-500">{s.description}</span>
              </span>
            </a>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={searchLinks.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-sky-600 hover:underline"
          >
            {t.discover.googleMapsCat}: {cat} →
          </a>
          <a
            href={searchLinks.openStreetMap}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-sky-600 hover:underline"
          >
            {t.discover.osmSearch} →
          </a>
        </div>
      </section>

      {showInitialSpinner && (
        <p className="flex items-center justify-center gap-2 py-16 text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" /> {t.common.loading}
        </p>
      )}

      {isError && places.length === 0 && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-100">
          {t.discover.loadFail} {(error as Error)?.message}
          <button type="button" className="ml-2 underline" onClick={() => void refetch()}>
            {t.common.retry}
          </button>
        </div>
      )}

      {isError && places.length > 0 && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          {t.discover.loadFailPartial}{' '}
          <button type="button" className="underline" onClick={() => void refetch()}>
            {t.common.retry}
          </button>
        </div>
      )}

      {!showInitialSpinner && places.length === 0 && (
        <p className="py-12 text-center text-slate-500">{t.discover.empty}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {places.map((p) => {
          const links = placeGuideLinks(p)
          return (
            <div key={p.id} className="flex flex-col gap-2">
              <PlaceCard place={p} />
              <div className="flex flex-wrap gap-2 px-1">
                <a
                  href={links.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700 dark:bg-sky-950 dark:text-sky-300"
                >
                  <MapPin className="h-3.5 w-3.5" /> Google Maps
                </a>
                <a
                  href={links.googleDirections}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-800 dark:bg-teal-950 dark:text-teal-300"
                >
                  {t.common.directions}
                </a>
                <a
                  href={links.openStreetMap}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  OSM
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
