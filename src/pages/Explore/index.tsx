import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Navigation, LocateFixed } from 'lucide-react'
import { PlaceCard } from '@/components/places/PlaceCard'
import { useFilteredPlaces } from '@/hooks/usePlaces'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useT } from '@/hooks/useT'
import { CATEGORIES } from '@/constants'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function ExplorePage() {
  const t = useT()
  const [params] = useSearchParams()
  const [search, setSearch] = useState(params.get('q') || '')
  const [category, setCategory] = useState<string | null>(null)
  const [nearMe, setNearMe] = useState(false)
  const { request, loading: geoLoading, error: geoError, hasFix, location } = useGeolocation()

  const { places, isLoading } = useFilteredPlaces({
    search,
    categorySlug: category,
    nearMe: nearMe && hasFix,
  })

  useEffect(() => {
    const q = params.get('q')
    if (q) setSearch(q)
  }, [params])

  const toggleNearMe = () => {
    if (nearMe) {
      setNearMe(false)
      return
    }
    if (!hasFix) request()
    setNearMe(true)
  }

  // If user enabled near-me before fix arrives, keep trying once
  useEffect(() => {
    if (nearMe && !hasFix && !geoLoading && location.permission === 'prompt') {
      request()
    }
  }, [nearMe, hasFix, geoLoading, location.permission, request])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-50">{t.explore.title}</h1>
      <p className="mb-6 text-slate-500 dark:text-slate-400">{t.explore.subtitle}</p>

      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900">
          <Search className="h-5 w-5 shrink-0 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.search.placeholder}
            className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
          />
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
          GPS ±{Math.round(location.accuracy ?? 0)} m · sorted by {t.explore.distance.toLowerCase()}
        </p>
      )}
      {geoError && nearMe && location.permission === 'granted' && (
        <p className="mb-3 text-sm text-slate-500">{geoError}</p>
      )}

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
        {CATEGORIES.slice(0, 10).map((c) => (
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

      {isLoading && <p className="py-12 text-center text-slate-500">{t.explore.loading}</p>}

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
          { to: '/map', label: t.nav.map },
          { to: '/directory', label: t.nav.directory },
          { to: '/events', label: t.nav.events },
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
