import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Utensils, Coffee, Fish, Leaf, AlertCircle, ChevronRight } from 'lucide-react'
import { PlaceListPage } from '@/components/places/PlaceListPage'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  LOCAL_RESTAURANT_PICKS,
  FOOD_NEIGHBORHOODS,
  FOOD_ETIQUETTE,
  FOOD_SAFETY,
  type FoodPick,
} from '@/data/restaurants'
import { cn } from '@/lib/utils'

type FoodMode = 'all' | 'traditional' | 'fish' | 'coffee'

const MODES: {
  id: FoodMode
  title: string
  short: string
  body: string
  icon: typeof Fish
  match: (p: FoodPick) => boolean
}[] = [
  {
    id: 'traditional',
    title: 'Traditional',
    short: 'Injera',
    body: 'Injera, shiro, tibs — local houses',
    icon: Utensils,
    match: (p) =>
      p.tags.includes('injera') ||
      p.tags.includes('local') ||
      p.tags.includes('budget') ||
      p.cuisine.toLowerCase().includes('ethiopian'),
  },
  {
    id: 'fish',
    title: 'Lake fish',
    short: 'Fish',
    body: 'Tilapia & Nile perch by the shore',
    icon: Fish,
    match: (p) => p.tags.includes('fish') || p.tags.includes('lakeside'),
  },
  {
    id: 'coffee',
    title: 'Coffee & light',
    short: 'Coffee',
    body: 'Bunna, macchiato, snacks, juice',
    icon: Coffee,
    match: (p) =>
      p.tags.includes('coffee') ||
      p.tags.includes('snack') ||
      p.tags.includes('juice') ||
      p.tags.includes('breakfast'),
  },
]

function RecommendationsBanner() {
  const [mode, setMode] = useState<FoodMode>('all')
  const [showTips, setShowTips] = useState(false)

  const filtered = useMemo(() => {
    if (mode === 'all') return LOCAL_RESTAURANT_PICKS
    const rule = MODES.find((m) => m.id === mode)
    if (!rule) return LOCAL_RESTAURANT_PICKS
    return LOCAL_RESTAURANT_PICKS.filter(rule.match)
  }, [mode])

  const featured = filtered.filter((p) => p.featured)
  const rest = filtered.filter((p) => !p.featured)

  return (
    <div className="mx-auto max-w-6xl px-4 pb-2 pt-6">
      {/* Compact hero — less vertical space on mobile */}
      <div className="mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-orange-600 via-amber-600 to-rose-600 px-4 py-5 text-white shadow-md sm:px-5 sm:py-6">
        <p className="text-xs font-medium text-orange-100 sm:text-sm">Local food guide</p>
        <h2 className="mt-0.5 text-xl font-bold tracking-tight sm:text-2xl">What to eat in Bahir Dar</h2>
        <p className="mt-1.5 text-sm text-orange-50/95 sm:max-w-2xl">
          Pick a mood — short lists first, full map listings below.
        </p>
      </div>

      {/* Mood chooser — compact single row on mobile */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold sm:text-lg">What are you in the mood for?</h3>
        {mode !== 'all' && (
          <button
            type="button"
            onClick={() => setMode('all')}
            className="text-xs font-medium text-orange-600 hover:underline sm:hidden"
          >
            Clear
          </button>
        )}
      </div>

      {/* Mobile: equal 3-col compact tiles | Desktop: slightly richer cards */}
      <div className="mb-5 grid grid-cols-3 gap-2 sm:gap-3">
        {MODES.map((m) => {
          const on = mode === m.id
          const Icon = m.icon
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(on ? 'all' : m.id)}
              aria-pressed={on}
              className={cn(
                'flex flex-col items-center rounded-2xl border px-2 py-3 text-center transition active:scale-[0.98] sm:items-start sm:px-4 sm:py-4 sm:text-left',
                on
                  ? 'border-orange-500 bg-orange-50 shadow-sm ring-2 ring-orange-300/80 dark:bg-orange-950/50 dark:ring-orange-600/50'
                  : 'border-slate-200/80 bg-white shadow-sm hover:border-orange-300 hover:bg-orange-50/40 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-orange-700'
              )}
            >
              <span
                className={cn(
                  'mb-1.5 flex h-9 w-9 items-center justify-center rounded-full sm:mb-2 sm:h-10 sm:w-10',
                  on
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                )}
              >
                <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" strokeWidth={2} />
              </span>
              <p className="text-[13px] font-semibold leading-tight sm:text-base">{m.title}</p>
              <p className="mt-0.5 hidden text-xs leading-snug text-slate-500 sm:block">{m.body}</p>
              {/* Mobile-only short hint under title */}
              <p className="mt-0.5 text-[11px] leading-tight text-slate-400 sm:hidden">{m.short}</p>
            </button>
          )
        })}
      </div>

      {mode !== 'all' && (
        <div className="mb-4 hidden items-center justify-between gap-2 sm:flex">
          <p className="text-sm text-slate-500">
            Showing <strong className="text-slate-800 dark:text-slate-200">{filtered.length}</strong> picks for{" "}
            {MODES.find((m) => m.id === mode)?.title.toLowerCase()}
          </p>
          <Button size="sm" variant="ghost" onClick={() => setMode('all')}>
            Show all
          </Button>
        </div>
      )}

      <h3 className="mb-3 flex items-center gap-2 text-base font-semibold sm:text-lg">
        <Utensils className="h-5 w-5 text-orange-600" />{' '}
        {mode === 'all' ? 'Recommended experiences' : 'Your short list'}
      </h3>
      <div className="mb-8 grid gap-3 sm:grid-cols-2 sm:gap-4">
        {(featured.length ? featured : filtered.slice(0, 4)).map((r) => (
          <Card key={r.id} className="overflow-hidden border-orange-100 dark:border-orange-950">
            <CardContent className="p-4 sm:p-5">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {r.tags.includes('fish') && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                    <Fish className="h-3 w-3" /> Fish
                  </span>
                )}
                {r.tags.includes('coffee') && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                    <Coffee className="h-3 w-3" /> Coffee
                  </span>
                )}
                {r.tags.includes('vegetarian-friendly') && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    <Leaf className="h-3 w-3" /> Veg-friendly
                  </span>
                )}
              </div>
              <h4 className="text-base font-semibold sm:text-lg">{r.name}</h4>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="h-3.5 w-3.5 shrink-0" /> {r.area} · {r.cuisine}
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{r.why}</p>
              <p className="mt-2 text-xs font-medium text-orange-700 dark:text-orange-300">{r.priceLabel}</p>
              <div className="mt-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Must try</p>
                <ul className="mt-1 flex flex-wrap gap-1.5">
                  {r.mustTry.map((m) => (
                    <li
                      key={m}
                      className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs dark:bg-slate-800"
                    >
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
              {r.tip && (
                <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
                  <strong>Tip:</strong> {r.tip}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-3">
                {r.slug && (
                  <Link
                    to={`/places/${r.slug}`}
                    className="text-sm font-medium text-sky-600 hover:underline"
                  >
                    Open in app →
                  </Link>
                )}
                <Link to="/map" className="text-sm font-medium text-slate-500 hover:underline">
                  Open map
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {rest.length > 0 && mode === 'all' && (
        <>
          <h3 className="mb-1 text-base font-semibold sm:text-lg">More ideas</h3>
          <p className="mb-3 text-sm text-slate-500">Extra picks, then live listings below.</p>
          <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((r) => (
              <Card key={r.id}>
                <CardContent className="p-4">
                  <p className="font-semibold">{r.name}</p>
                  <p className="text-xs text-slate-500">
                    {r.area} · {r.priceLabel}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{r.why}</p>
                  {r.slug && (
                    <Link
                      to={`/places/${r.slug}`}
                      className="mt-2 inline-block text-xs font-medium text-sky-600"
                    >
                      View place →
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <h3 className="mb-3 text-base font-semibold sm:text-lg">Neighborhoods</h3>
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {FOOD_NEIGHBORHOODS.map((n) => (
          <Card key={n.id}>
            <CardContent className="p-4">
              <p className="font-semibold">{n.title}</p>
              <p className="mt-1 text-sm text-slate-500">{n.blurb}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tips collapsed by default */}
      <button
        type="button"
        onClick={() => setShowTips(!showTips)}
        className="mb-4 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium dark:border-slate-700 dark:bg-slate-900"
      >
        Tips for eating here (etiquette & safety)
        <ChevronRight className={cn('h-4 w-4 transition', showTips && 'rotate-90')} />
      </button>
      {showTips && (
        <div className="mb-8 grid gap-4 lg:grid-cols-2">
          <Card>
            <CardContent className="p-5">
              <h4 className="font-semibold">Etiquette</h4>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                {FOOD_ETIQUETTE.map((e) => (
                  <li key={e} className="flex gap-2">
                    <span className="text-orange-500">·</span> {e}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <h4 className="flex items-center gap-2 font-semibold">
                <AlertCircle className="h-4 w-4 text-amber-600" /> Food safety
              </h4>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                {FOOD_SAFETY.map((e) => (
                  <li key={e} className="flex gap-2">
                    <span className="text-amber-500">·</span> {e}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      <h3 className="mb-1 text-base font-semibold sm:text-lg">Live listings</h3>
      <p className="mb-2 text-sm text-slate-500">
        App + OpenStreetMap restaurants and cafés in Bahir Dar.
      </p>
    </div>
  )
}

export default function RestaurantsPage() {
  return (
    <>
      <RecommendationsBanner />
      <PlaceListPage
        title="Restaurants & cafés"
        subtitle="App listings + live OpenStreetMap food places"
        categorySlug="restaurant"
        osmCategories={['restaurant', 'cafe']}
        filters={[
          { id: 'traditional', label: 'Traditional Ethiopian' },
          { id: 'vegetarian', label: 'Vegetarian' },
        ]}
        emptyMessage="No restaurants in the database yet — use recommendations above or Discover for live map food places."
      />
    </>
  )
}
