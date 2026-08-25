import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Utensils, Coffee, Fish, Leaf, AlertCircle, ChevronRight, X } from 'lucide-react'
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
  activeClass: string
  idleClass: string
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
    activeClass: 'bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-200',
    idleClass:
      'bg-white text-slate-700 border-slate-200 hover:border-orange-300 hover:bg-orange-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200',
  },
  {
    id: 'fish',
    title: 'Lake fish',
    short: 'Fish',
    body: 'Tilapia & Nile perch by the shore',
    icon: Fish,
    match: (p) => p.tags.includes('fish') || p.tags.includes('lakeside'),
    activeClass: 'bg-sky-500 text-white border-sky-500 shadow-sm shadow-sky-200',
    idleClass:
      'bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:bg-sky-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200',
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
    activeClass: 'bg-amber-600 text-white border-amber-600 shadow-sm shadow-amber-200',
    idleClass:
      'bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:bg-amber-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200',
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
    <div className="mx-auto max-w-6xl px-4 pb-2 pt-5">
      {/* Compact hero */}
      <div className="mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-orange-600 via-amber-600 to-rose-600 px-4 py-4 text-white shadow-md sm:px-5 sm:py-5">
        <p className="text-[11px] font-medium uppercase tracking-wide text-orange-100/90 sm:text-xs">
          Local food guide
        </p>
        <h2 className="mt-0.5 text-lg font-bold tracking-tight sm:text-2xl">What to eat in Bahir Dar</h2>
        <p className="mt-1 text-xs text-orange-50/95 sm:text-sm sm:max-w-2xl">
          Pick a mood — short lists first, full map listings below.
        </p>
      </div>

      {/* Mood label */}
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 sm:text-base">
          What are you in the mood for?
        </h3>
        {mode !== 'all' && (
          <button
            type="button"
            onClick={() => setMode('all')}
            className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        )}
      </div>

      {/* Horizontal pill chips — minimal height, app-like */}
      <div className="-mx-4 mb-5 overflow-x-auto px-4 pb-1 scrollbar-none">
        <div className="flex w-max items-center gap-2 sm:w-full sm:flex-wrap">
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
                  'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition active:scale-[0.97]',
                  on ? m.activeClass : m.idleClass
                )}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={2.25} />
                <span className="whitespace-nowrap">{m.title}</span>
              </button>
            )
          })}
        </div>
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
