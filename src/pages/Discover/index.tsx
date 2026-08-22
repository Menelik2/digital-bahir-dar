import { useMemo, useState } from 'react'
import { ExternalLink, MapPin, Loader2, RefreshCw } from 'lucide-react'
import { useOsmPlaces } from '@/hooks/useOsmPlaces'
import type { OsmCategory } from '@/services/osmPlaces'
import { GUIDE_SITES, placeGuideLinks, categoryGuideSearch } from '@/constants/guideSites'
import { PlaceCard } from '@/components/places/PlaceCard'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const FILTERS: { id: OsmCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'hotel', label: 'Hotels' },
  { id: 'restaurant', label: 'Restaurants' },
  { id: 'cafe', label: 'Cafés' },
  { id: 'attraction', label: 'Travel / sights' },
  { id: 'transport', label: 'Transport' },
  { id: 'bank', label: 'Banks' },
  { id: 'atm', label: 'ATMs' },
  { id: 'hospital', label: 'Health' },
]

export default function DiscoverPage() {
  const [cat, setCat] = useState<OsmCategory>('hotel')
  const categories = useMemo(() => (cat === 'all' ? (['all'] as OsmCategory[]) : [cat]), [cat])
  const { data: places = [], isLoading, isError, error, refetch, isFetching } = useOsmPlaces(categories)

  const searchLinks = categoryGuideSearch(
    cat === 'all' ? 'places' : cat === 'attraction' ? 'attractions' : cat
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Discover Bahir Dar</h1>
          <p className="mt-1 max-w-2xl text-slate-500 dark:text-slate-400">
            Live places from OpenStreetMap (hotels, restaurants, cafés, attractions, transport). Open
            Google Maps or OSM to navigate to each location.
          </p>
          <p className="mt-1 text-xs text-slate-400">Data © OpenStreetMap contributors · ODbL</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void refetch()} disabled={isFetching}>
          {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh
        </Button>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setCat(f.id)}
            className={cn(
              'shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium',
              cat === f.id
                ? 'border-sky-500 bg-sky-500 text-white'
                : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <section className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Guide sites</h2>
        <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
          Use these sites to research Bahir Dar, then open a place on the map for directions.
        </p>
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
            Google Maps: {cat} in Bahir Dar →
          </a>
          <a
            href={searchLinks.openStreetMap}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-sky-600 hover:underline"
          >
            OSM search →
          </a>
        </div>
      </section>

      {isLoading && (
        <p className="flex items-center justify-center gap-2 py-16 text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading live map data…
        </p>
      )}

      {isError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-100">
          Could not load OpenStreetMap data. {(error as Error)?.message}
          <button type="button" className="ml-2 underline" onClick={() => void refetch()}>
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && places.length === 0 && (
        <p className="py-12 text-center text-slate-500">No places in this category yet on OSM.</p>
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
                  Directions
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
