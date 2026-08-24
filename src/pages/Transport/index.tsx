import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bus, ExternalLink, ChevronDown, Plane, Ship, Car, MapPin } from 'lucide-react'
import { PlaceListPage } from '@/components/places/PlaceListPage'
import { GUIDE_SITES, categoryGuideSearch } from '@/constants/guideSites'
import { TRANSPORT_FARES } from '@/data/cityLife'
import { Card, CardContent } from '@/components/ui/card'
import { useT } from '@/hooks/useT'
import { cn } from '@/lib/utils'

function HowDoISection() {
  const t = useT()
  const [openId, setOpenId] = useState<string | null>('airport')

  const items = useMemo(
    () => [
      {
        id: 'airport',
        question: t.transportPage.qAirport,
        answer: t.transportPage.aAirport,
        priceHint: t.transportPage.pAirport,
        fareIds: ['tf-6', 'tf-1', 'tf-2'],
        icon: Plane,
        links: [
          { label: t.nav.map, to: '/map' },
          { label: t.nav.hotels, to: '/hotels' },
        ],
      },
      {
        id: 'boat',
        question: t.transportPage.qBoat,
        answer: t.transportPage.aBoat,
        priceHint: t.transportPage.pBoat,
        fareIds: ['tf-4'],
        icon: Ship,
        links: [
          { label: t.home.lakeTana, to: '/places/lake-tana' },
          { label: t.nav.today, to: '/today' },
        ],
      },
      {
        id: 'falls',
        question: t.transportPage.qFalls,
        answer: t.transportPage.aFalls,
        priceHint: t.transportPage.pFalls,
        fareIds: ['tf-5'],
        icon: Car,
        links: [
          { label: t.home.blueNileFalls, to: '/places/blue-nile-falls-tis-issat' },
          { label: t.nav.planner, to: '/trip-planner' },
        ],
      },
      {
        id: 'town',
        question: t.transportPage.qTown,
        answer: t.transportPage.aTown,
        priceHint: t.transportPage.pTown,
        fareIds: ['tf-1', 'tf-2', 'tf-3'],
        icon: MapPin,
        links: [{ label: t.nav.map, to: '/map' }],
      },
      {
        id: 'bus',
        question: t.transportPage.qBus,
        answer: t.transportPage.aBus,
        priceHint: t.transportPage.pBus,
        fareIds: ['tf-7'],
        icon: Bus,
        links: [{ label: t.nav.discover, to: '/discover' }],
      },
    ],
    [t]
  )

  return (
    <section className="mx-auto max-w-6xl px-4 pb-4 pt-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold sm:text-2xl">{t.transportPage.howDoI}</h2>
        <p className="text-sm text-slate-500">{t.transportPage.howDoISub}</p>
      </div>
      <div className="space-y-2">
        {items.map((item) => {
          const open = openId === item.id
          const Icon = item.icon
          const fares = TRANSPORT_FARES.filter((f) => item.fareIds.includes(f.id))
          return (
            <Card key={item.id} className="overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : item.id)}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-slate-900 dark:text-white">{item.question}</span>
                  <span className="block text-xs font-medium text-teal-700 dark:text-teal-400">
                    {item.priceHint}
                  </span>
                </span>
                <ChevronDown
                  className={cn('h-5 w-5 shrink-0 text-slate-400 transition', open && 'rotate-180')}
                />
              </button>
              {open && (
                <CardContent className="border-t border-slate-100 px-4 pb-4 pt-3 dark:border-slate-800">
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.answer}</p>
                  {fares.length > 0 && (
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {fares.map((f) => (
                        <div
                          key={f.id}
                          className="rounded-lg bg-slate-50 px-3 py-2 text-xs dark:bg-slate-900"
                        >
                          <p className="font-medium">{f.mode}</p>
                          <p className="text-teal-700 dark:text-teal-400">
                            {f.priceMin}–{f.priceMax} {f.unit}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  {item.links.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.links.map((l) => (
                        <Link
                          key={l.label + l.to}
                          to={l.to}
                          className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-sky-700 dark:border-slate-700"
                        >
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </section>
  )
}

export default function TransportPage() {
  const t = useT()
  const maps = categoryGuideSearch('bus station taxi Bahir Dar')

  return (
    <div>
      <HowDoISection />

      <PlaceListPage
        title={t.pages.transportTitle}
        subtitle={t.pages.transportSubtitle}
        categorySlug="transport"
        osmCategories={['transport']}
        emptyMessage={t.pages.transportEmpty}
      />

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="mb-3 text-lg font-semibold">{t.pages.typicalFares}</h2>
        <div className="mb-8 grid gap-3 sm:grid-cols-2">
          {TRANSPORT_FARES.map((f) => (
            <Card key={f.id}>
              <CardContent className="flex gap-3 p-4">
                <Bus className="h-5 w-5 shrink-0 text-sky-600" />
                <div>
                  <p className="font-medium">{f.mode}</p>
                  <p className="text-sm text-slate-500">{f.route}</p>
                  <p className="mt-1 text-sm font-semibold text-teal-700 dark:text-teal-400">
                    {f.priceMin}–{f.priceMax} {f.unit}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{f.notes}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="mb-3 text-lg font-semibold">{t.pages.findRoutes}</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href={maps.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium dark:border-slate-700 dark:bg-slate-900"
          >
            <ExternalLink className="h-4 w-4 text-sky-600" /> {t.pages.googleTransport}
          </a>
          <Link
            to="/discover"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium dark:border-slate-700 dark:bg-slate-900"
          >
            {t.pages.liveOsmTransport}
          </Link>
          {GUIDE_SITES.filter((s) => s.categories.includes('transport')).map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium dark:border-slate-700 dark:bg-slate-900"
            >
              {s.name}
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
