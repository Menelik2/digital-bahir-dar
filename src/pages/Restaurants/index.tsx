import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Utensils, Coffee, Fish, Leaf, AlertCircle, ChevronRight, Sparkles } from 'lucide-react'
import { PlaceListPage } from '@/components/places/PlaceListPage'
import { Card, CardContent } from '@/components/ui/card'
import {
  LOCAL_RESTAURANT_PICKS,
  FOOD_NEIGHBORHOODS,
  FOOD_ETIQUETTE,
  FOOD_SAFETY,
  type FoodPick,
} from '@/data/restaurants'
import { useT } from '@/hooks/useT'
import { cn } from '@/lib/utils'

type FoodMode = 'all' | 'traditional' | 'fish' | 'coffee'

function RecommendationsBanner() {
  const t = useT()
  const [mode, setMode] = useState<FoodMode>('all')
  const [showTips, setShowTips] = useState(false)

  const MODES = useMemo(
    () =>
      [
        {
          id: 'traditional' as const,
          title: t.food.modeTraditional,
          hint: t.food.modeTraditionalBody,
          icon: Utensils,
          match: (p: FoodPick) =>
            p.tags.includes('injera') ||
            p.tags.includes('local') ||
            p.tags.includes('budget') ||
            p.cuisine.toLowerCase().includes('ethiopian'),
          tile: 'bg-orange-50 border-orange-100 dark:bg-orange-950/40 dark:border-orange-900',
          iconBg: 'bg-orange-100 dark:bg-orange-900/60',
          iconColor: 'text-orange-600 dark:text-orange-300',
          tileOn:
            'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-200/60 dark:shadow-none',
          ring: 'ring-2 ring-orange-400 ring-offset-2 dark:ring-offset-slate-950',
        },
        {
          id: 'fish' as const,
          title: t.food.modeFish,
          hint: t.food.modeFishBody,
          icon: Fish,
          match: (p: FoodPick) => p.tags.includes('fish') || p.tags.includes('lakeside'),
          tile: 'bg-sky-50 border-sky-100 dark:bg-sky-950/40 dark:border-sky-900',
          iconBg: 'bg-sky-100 dark:bg-sky-900/60',
          iconColor: 'text-sky-600 dark:text-sky-300',
          tileOn: 'bg-sky-500 border-sky-500 text-white shadow-md shadow-sky-200/60 dark:shadow-none',
          ring: 'ring-2 ring-sky-400 ring-offset-2 dark:ring-offset-slate-950',
        },
        {
          id: 'coffee' as const,
          title: t.food.modeCoffee,
          hint: t.food.modeCoffeeBody,
          icon: Coffee,
          match: (p: FoodPick) =>
            p.tags.includes('coffee') ||
            p.tags.includes('snack') ||
            p.tags.includes('juice') ||
            p.tags.includes('breakfast'),
          tile: 'bg-amber-50 border-amber-100 dark:bg-amber-950/40 dark:border-amber-900',
          iconBg: 'bg-amber-100 dark:bg-amber-900/60',
          iconColor: 'text-amber-700 dark:text-amber-300',
          tileOn:
            'bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-200/60 dark:shadow-none',
          ring: 'ring-2 ring-amber-400 ring-offset-2 dark:ring-offset-slate-950',
        },
      ] as const,
    [t]
  )

  const filtered = useMemo(() => {
    if (mode === 'all') return LOCAL_RESTAURANT_PICKS
    const rule = MODES.find((m) => m.id === mode)
    if (!rule) return LOCAL_RESTAURANT_PICKS
    return LOCAL_RESTAURANT_PICKS.filter(rule.match)
  }, [mode, MODES])

  const featured = filtered.filter((p) => p.featured)
  const rest = filtered.filter((p) => !p.featured)
  const activeMode = MODES.find((m) => m.id === mode)

  return (
    <div className="mx-auto max-w-6xl px-4 pb-2 pt-4">
      <div className="mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
          {t.food.localGuide}
        </p>
        <h2 className="mt-0.5 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.food.moodTitle}
        </h2>
        <p className="mt-0.5 text-sm text-slate-500">{t.food.whatToEatBody}</p>
      </div>

      <div className="mb-3 grid grid-cols-3 gap-2">
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
                'flex flex-col items-center gap-1.5 rounded-2xl border px-1.5 py-3 text-center transition active:scale-[0.97]',
                on ? cn(m.tileOn, m.ring) : m.tile
              )}
            >
              <span
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full',
                  on ? 'bg-white/20' : m.iconBg
                )}
              >
                <Icon
                  className={cn(on ? 'text-white' : m.iconColor)}
                  style={{ width: 18, height: 18 }}
                  strokeWidth={2.25}
                />
              </span>
              <span
                className={cn(
                  'text-[12px] font-bold leading-tight',
                  on ? 'text-white' : 'text-slate-800 dark:text-slate-100'
                )}
              >
                {m.title}
              </span>
              <span className={cn('line-clamp-2 text-[10px] leading-tight', on ? 'text-white/85' : 'text-slate-500')}>
                {m.hint}
              </span>
            </button>
          )
        })}
      </div>

      {activeMode && (
        <button
          type="button"
          onClick={() => setMode('all')}
          className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white dark:bg-slate-100 dark:text-slate-900"
        >
          <Sparkles className="h-3 w-3" />
          {activeMode.title} · {filtered.length}
          <span className="ml-0.5 opacity-70">✕</span>
        </button>
      )}

      <h3 className="mb-2 flex items-center gap-2 text-[15px] font-semibold text-slate-900 dark:text-white">
        <Utensils className="h-4 w-4 text-orange-600" />
        {mode === 'all' ? t.food.recommended : t.food.shortList}
      </h3>

      <div className="mb-6 grid gap-2.5 sm:grid-cols-2 sm:gap-3">
        {(featured.length ? featured : filtered.slice(0, 4)).map((r) => (
          <Card key={r.id} className="overflow-hidden border-orange-100/80 dark:border-orange-950">
            <CardContent className="p-3.5">
              <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                {r.tags.includes('fish') && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                    <Fish className="h-3 w-3" /> {t.food.modeFish}
                  </span>
                )}
                {r.tags.includes('coffee') && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                    <Coffee className="h-3 w-3" /> {t.food.modeCoffee}
                  </span>
                )}
                {r.tags.includes('vegetarian-friendly') && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    <Leaf className="h-3 w-3" /> {t.list.vegetarian}
                  </span>
                )}
              </div>
              <h4 className="text-[15px] font-semibold leading-snug">{r.name}</h4>
              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
                <MapPin className="h-3 w-3 shrink-0" /> {r.area} · {r.cuisine}
              </p>
              <p className="mt-1.5 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{r.why}</p>
              <p className="mt-1.5 text-xs font-medium text-orange-700 dark:text-orange-300">{r.priceLabel}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {r.mustTry.slice(0, 3).map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] dark:bg-slate-800"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-2.5 flex gap-3">
                {r.slug && (
                  <Link to={`/places/${r.slug}`} className="text-xs font-semibold text-sky-600">
                    {t.food.openInApp}
                  </Link>
                )}
                <Link to="/map" className="text-xs font-medium text-slate-500">
                  {t.common.openMap}
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {rest.length > 0 && mode === 'all' && (
        <>
          <h3 className="mb-2 text-[15px] font-semibold">{t.food.moreIdeas}</h3>
          <div className="mb-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((r) => (
              <Card key={r.id}>
                <CardContent className="p-3.5">
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {r.area} · {r.priceLabel}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-400">{r.why}</p>
                  {r.slug && (
                    <Link
                      to={`/places/${r.slug}`}
                      className="mt-1.5 inline-block text-[11px] font-medium text-sky-600"
                    >
                      {t.food.openInApp}
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <h3 className="mb-2 text-[15px] font-semibold">{t.food.neighborhoods}</h3>
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FOOD_NEIGHBORHOODS.map((n) => (
          <div
            key={n.id}
            className="min-w-[10.5rem] shrink-0 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
          >
            <p className="text-sm font-semibold">{n.title}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-slate-500">{n.blurb}</p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setShowTips(!showTips)}
        className="mb-3 flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-left text-sm font-medium dark:border-slate-700 dark:bg-slate-900"
      >
        {t.food.tipsToggle}
        <ChevronRight className={cn('h-4 w-4 transition', showTips && 'rotate-90')} />
      </button>
      {showTips && (
        <div className="mb-6 grid gap-3 lg:grid-cols-2">
          <Card>
            <CardContent className="p-4">
              <h4 className="text-sm font-semibold">{t.food.etiquette}</h4>
              <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                {FOOD_ETIQUETTE.map((e) => (
                  <li key={e} className="flex gap-2">
                    <span className="text-orange-500">·</span> {e}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h4 className="flex items-center gap-2 text-sm font-semibold">
                <AlertCircle className="h-4 w-4 text-amber-600" /> {t.food.foodSafety}
              </h4>
              <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
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

      <h3 className="mb-1 text-[15px] font-semibold">{t.food.liveListings}</h3>
      <p className="mb-2 text-xs text-slate-500">{t.food.liveListingsBody}</p>
    </div>
  )
}

export default function RestaurantsPage() {
  const t = useT()
  return (
    <>
      <RecommendationsBanner />
      <PlaceListPage
        title={t.pages.restaurantsTitle}
        subtitle={t.pages.restaurantsSubtitle}
        categorySlug="restaurant"
        osmCategories={['restaurant', 'cafe']}
        filters={[
          { id: 'traditional', label: t.list.traditional },
          { id: 'vegetarian', label: t.list.vegetarian },
        ]}
        emptyMessage={t.pages.restaurantsEmpty}
      />
    </>
  )
}
