import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Hotel, Waves, Building2, Plane, Star } from 'lucide-react'
import { PlaceListPage } from '@/components/places/PlaceListPage'
import { HotelPriceCompare } from '@/components/hotels/HotelPriceCompare'
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
      active: 'bg-[#078930] text-white border-[#078930]',
    },
    {
      id: 'mid',
      label: t.hotelsPage.tierMid,
      range: t.hotelsPage.tierMidRange,
      body: t.hotelsPage.tierMidBody,
      active: 'bg-[#0b6e99] text-white border-[#0b6e99]',
    },
    {
      id: 'luxury',
      label: t.hotelsPage.tierLuxury,
      range: t.hotelsPage.tierLuxuryRange,
      body: t.hotelsPage.tierLuxuryBody,
      active: 'bg-[#d4a017] text-white border-[#d4a017]',
    },
  ]

  const areas = [
    { id: 'lake', label: t.hotelsPage.areaLake, body: t.hotelsPage.areaLakeBody, icon: Waves },
    { id: 'center', label: t.hotelsPage.areaCenter, body: t.hotelsPage.areaCenterBody, icon: Building2 },
    { id: 'airport', label: t.hotelsPage.areaAirport, body: t.hotelsPage.areaAirportBody, icon: Plane },
  ]

  return (
    <div className="bg-[#f2f2f7] dark:bg-black">
      <section className="mx-auto max-w-6xl px-4 pt-6 sm:pt-8">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#078930]/12 text-[#078930] dark:bg-[#30d158]/15 dark:text-[#30d158]">
            <Hotel className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wide text-[#8e8e93]">{t.home.stay}</p>
            <h1 className="text-[22px] font-bold tracking-tight text-[#1c1c1e] dark:text-white sm:text-2xl">
              {t.pages.hotelsTitle}
            </h1>
          </div>
        </div>

        <h3 className="mb-2 px-0.5 text-[13px] font-semibold uppercase tracking-wide text-[#8e8e93]">
          {t.hotelsPage.priceTier}
        </h3>
        <div className="mobile-chips mb-2">
          {tiers.map((tier) => {
            const on = tierHint === tier.id
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setTierHint(on ? null : tier.id)}
                className={cn(
                  'inline-flex min-h-[48px] shrink-0 flex-col justify-center rounded-2xl border px-3 py-2 text-left transition',
                  on ? tier.active : 'border-black/[0.06] bg-white dark:border-white/10 dark:bg-[#1c1c1e]'
                )}
              >
                <span className={cn('text-[13px] font-semibold', on ? 'text-white' : 'text-[#1c1c1e] dark:text-white')}>
                  {tier.label}
                </span>
                <span className={cn('text-[11px] font-medium', on ? 'text-white/90' : 'text-[#078930] dark:text-[#30d158]')}>
                  {tier.range}
                </span>
              </button>
            )
          })}
        </div>
        {tierHint && (
          <p className="mb-3 text-[13px] leading-relaxed text-[#8e8e93]">
            {tiers.find((x) => x.id === tierHint)?.body} · {t.hotelsPage.tapChip}
          </p>
        )}

        <h3 className="mb-2 px-0.5 text-[13px] font-semibold uppercase tracking-wide text-[#8e8e93]">
          {t.hotelsPage.areaFocus}
        </h3>
        <div className="mobile-chips mb-3">
          {areas.map((a) => {
            const Icon = a.icon
            return (
              <div
                key={a.id}
                className="inline-flex min-h-[48px] shrink-0 items-center gap-2 rounded-2xl border border-black/[0.06] bg-white px-3 py-2 dark:border-white/10 dark:bg-[#1c1c1e]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0b6e99]/12 text-[#0b6e99] dark:bg-[#0b6e99]/25 dark:text-[#7dd3fc]">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="pr-1">
                  <p className="text-[13px] font-semibold leading-tight text-[#1c1c1e] dark:text-white">{a.label}</p>
                  <p className="text-[11px] leading-tight text-[#8e8e93]">{a.body}</p>
                </div>
              </div>
            )
          })}
        </div>

        <p className="mb-3 text-[13px] text-[#8e8e93]">
          {t.hotelsPage.preferPlan}{' '}
          <Link to="/today" className="font-semibold text-[#078930] dark:text-[#30d158]">
            {t.home.todayTitle}
          </Link>
          {' · '}
          <Link to="/trip-planner" className="font-semibold text-[#078930] dark:text-[#30d158]">
            {t.home.multiDayPlanner}
          </Link>
        </p>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <HotelPriceCompare />
      </div>

      <PlaceListPage
        title={t.pages.hotelsTitle}
        subtitle={t.pages.hotelsSubtitle}
        categorySlug="hotel"
        osmCategories={['hotel']}
        groupByStars
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
