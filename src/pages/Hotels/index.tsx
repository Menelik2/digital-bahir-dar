import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Hotel, Waves, Building2, Plane } from 'lucide-react'
import { PlaceListPage } from '@/components/places/PlaceListPage'
import { useT } from '@/hooks/useT'
import { cn } from '@/lib/utils'

export default function HotelsPage() {
  const t = useT()
  const [tierHint, setTierHint] = useState<string | null>(null)

  const tiers = [
    {
      id: 'budget',
      label: t.hotelsPage.tierBudget,
      range: t.hotelsPage.tierBudgetRange,
      body: t.hotelsPage.tierBudgetBody,
      active: 'bg-teal-600 text-white border-teal-600',
    },
    {
      id: 'mid',
      label: t.hotelsPage.tierMid,
      range: t.hotelsPage.tierMidRange,
      body: t.hotelsPage.tierMidBody,
      active: 'bg-sky-600 text-white border-sky-600',
    },
    {
      id: 'luxury',
      label: t.hotelsPage.tierComfort,
      range: t.hotelsPage.tierComfortRange,
      body: t.hotelsPage.tierComfortBody,
      active: 'bg-indigo-600 text-white border-indigo-600',
    },
  ] as const

  const areas = [
    { id: 'lake', label: t.hotelsPage.nearLake, icon: Waves, body: t.hotelsPage.nearLakeBody },
    { id: 'center', label: t.hotelsPage.nearCenter, icon: Building2, body: t.hotelsPage.nearCenterBody },
    { id: 'airport', label: t.hotelsPage.nearAirport, icon: Plane, body: t.hotelsPage.nearAirportBody },
  ] as const

  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 pt-6">
        <div className="mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-sky-600 to-cyan-600 px-4 py-5 text-white shadow-md sm:px-5 sm:py-6">
          <p className="text-[11px] font-medium uppercase tracking-wide text-blue-100/90 sm:text-xs">
            {t.hotelsPage.whereToStay}
          </p>
          <h2 className="mt-0.5 flex items-center gap-2 text-xl font-bold sm:text-2xl">
            <Hotel className="h-6 w-6" /> {t.hotelsPage.title}
          </h2>
          <p className="mt-1.5 max-w-2xl text-xs text-blue-50 sm:text-sm">{t.hotelsPage.intro}</p>
        </div>

        <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          {t.hotelsPage.priceTier}
        </h3>
        <div className="-mx-4 mb-3 overflow-x-auto px-4 pb-1 scrollbar-none">
          <div className="flex w-max items-center gap-2 sm:w-full sm:flex-wrap">
            {tiers.map((tier) => {
              const on = tierHint === tier.id
              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setTierHint(on ? null : tier.id)}
                  className={cn(
                    'inline-flex shrink-0 flex-col rounded-2xl border px-3.5 py-2.5 text-left transition active:scale-[0.98]',
                    on
                      ? tier.active
                      : 'border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
                  )}
                >
                  <span className="text-sm font-semibold">{tier.label}</span>
                  <span
                    className={cn(
                      'text-[11px] font-medium',
                      on ? 'text-white/90' : 'text-teal-700 dark:text-teal-400'
                    )}
                  >
                    {tier.range}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
        {tierHint && (
          <p className="mb-3 text-xs text-slate-500">
            {tiers.find((x) => x.id === tierHint)?.body} · {t.hotelsPage.tapChip}
          </p>
        )}

        <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          {t.hotelsPage.areaFocus}
        </h3>
        <div className="-mx-4 mb-3 overflow-x-auto px-4 pb-1 scrollbar-none">
          <div className="flex w-max gap-2 sm:w-full sm:flex-wrap">
            {areas.map((a) => {
              const Icon = a.icon
              return (
                <div
                  key={a.id}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="pr-1">
                    <p className="text-xs font-semibold leading-tight">{a.label}</p>
                    <p className="text-[10px] leading-tight text-slate-500">{a.body}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <p className="mb-2 text-xs text-slate-400">
          {t.hotelsPage.preferPlan}{' '}
          <Link to="/today" className="font-medium text-sky-600 hover:underline">
            {t.home.todayTitle}
          </Link>
          {' · '}
          <Link to="/trip-planner" className="font-medium text-sky-600 hover:underline">
            {t.home.multiDayPlanner}
          </Link>
        </p>
      </section>

      <PlaceListPage
        title={t.pages.hotelsTitle}
        subtitle={t.pages.hotelsSubtitle}
        categorySlug="hotel"
        osmCategories={['hotel']}
        filters={[
          { id: 'budget', label: t.list.budget },
          { id: 'mid', label: t.list.midRange },
          { id: 'luxury', label: t.list.luxury },
        ]}
        emptyMessage={t.pages.hotelsEmpty}
      />
    </div>
  )
}
