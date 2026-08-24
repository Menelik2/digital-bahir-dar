import { Link } from 'react-router-dom'
import { Hotel, Waves, Building2, Plane } from 'lucide-react'
import { PlaceListPage } from '@/components/places/PlaceListPage'
import { Card, CardContent } from '@/components/ui/card'
import { useT } from '@/hooks/useT'

export default function HotelsPage() {
  const t = useT()

  const tiers = [
    {
      id: 'budget',
      label: t.hotelsPage.tierBudget,
      range: t.hotelsPage.tierBudgetRange,
      body: t.hotelsPage.tierBudgetBody,
    },
    {
      id: 'mid',
      label: t.hotelsPage.tierMid,
      range: t.hotelsPage.tierMidRange,
      body: t.hotelsPage.tierMidBody,
    },
    {
      id: 'luxury',
      label: t.hotelsPage.tierComfort,
      range: t.hotelsPage.tierComfortRange,
      body: t.hotelsPage.tierComfortBody,
    },
  ] as const

  const areas = [
    {
      id: 'lake',
      label: t.hotelsPage.nearLake,
      icon: Waves,
      body: t.hotelsPage.nearLakeBody,
    },
    {
      id: 'center',
      label: t.hotelsPage.nearCenter,
      icon: Building2,
      body: t.hotelsPage.nearCenterBody,
    },
    {
      id: 'airport',
      label: t.hotelsPage.nearAirport,
      icon: Plane,
      body: t.hotelsPage.nearAirportBody,
    },
  ] as const

  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 pt-8">
        <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-sky-600 to-cyan-600 px-5 py-7 text-white shadow-lg">
          <p className="text-sm font-medium text-blue-100">{t.hotelsPage.whereToStay}</p>
          <h2 className="mt-1 flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <Hotel className="h-7 w-7" /> {t.hotelsPage.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-blue-50">{t.hotelsPage.intro}</p>
        </div>

        <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          {t.hotelsPage.priceTier}
        </h3>
        <div className="mb-6 grid gap-2 sm:grid-cols-3">
          {tiers.map((tier) => (
            <Card key={tier.id} className="border-sky-100 dark:border-sky-900">
              <CardContent className="p-4">
                <p className="font-bold">{tier.label}</p>
                <p className="text-sm font-medium text-teal-700 dark:text-teal-400">{tier.range}</p>
                <p className="mt-1 text-xs text-slate-500">{tier.body}</p>
                <p className="mt-2 text-[11px] text-slate-400">{t.hotelsPage.tapChip}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          {t.hotelsPage.areaFocus}
        </h3>
        <div className="mb-2 grid gap-2 sm:grid-cols-3">
          {areas.map((a) => {
            const Icon = a.icon
            return (
              <Card key={a.id}>
                <CardContent className="flex gap-3 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold">{a.label}</p>
                    <p className="text-xs text-slate-500">{a.body}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
        <p className="mb-4 text-xs text-slate-400">
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
