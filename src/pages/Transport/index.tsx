import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bus, ExternalLink, ChevronDown, Plane, Ship, Car, MapPin } from 'lucide-react'
import { PlaceListPage } from '@/components/places/PlaceListPage'
import { GUIDE_SITES, categoryGuideSearch } from '@/constants/guideSites'
import { TRANSPORT_FARES } from '@/data/cityLife'
import { Card, CardContent } from '@/components/ui/card'
import { useT } from '@/hooks/useT'
import { cn } from '@/lib/utils'

type HowItem = {
  id: string
  question: string
  answer: string
  priceHint: string
  tips: string[]
  fareIds: string[]
  icon: typeof Plane
  links?: { label: string; to?: string; href?: string }[]
}

const HOW_TO: HowItem[] = [
  {
    id: 'airport',
    question: 'Airport (BJR) → city?',
    answer:
      'Bahir Dar Airport is about 15–40 minutes from the center depending on traffic. Hotel pickup is the easiest after landing. Bajaj or taxi work if you prefer to negotiate on the spot.',
    priceHint: '~300–1,500 ETB / trip',
    tips: ['Agree price before you leave the curb', 'Have small ETB notes ready'],
    fareIds: ['tf-6', 'tf-1', 'tf-2'],
    icon: Plane,
    links: [{ label: 'Map', to: '/map' }, { label: 'Hotels', to: '/hotels' }],
  },
  {
    id: 'boat',
    question: 'Boat to the monasteries?',
    answer:
      'Go to the Lake Tana pier in the morning. Compare shared vs private boats. Agree which islands, return time, and whether monastery entry is included before boarding.',
    priceHint: '~800–15,000 ETB (shared person → private half day)',
    tips: ['Modest dress for churches', 'Morning departures are usually calmer'],
    fareIds: ['tf-4'],
    icon: Ship,
    links: [
      { label: 'Lake Tana', to: '/places/lake-tana' },
      { label: 'Today plan', to: '/today' },
    ],
  },
  {
    id: 'falls',
    question: 'Day trip to Blue Nile Falls?',
    answer:
      'Tis Issat is about 30 km toward Tis Abay. Private car + driver is simplest for a group; bus/minibus is cheaper. Entry and optional guide are separate from the vehicle.',
    priceHint: 'Car ~800–3,500 ETB vehicle round trip (est.)',
    tips: ['Paths can be steep — good shoes', 'Pack water and a snack'],
    fareIds: ['tf-5'],
    icon: Car,
    links: [
      { label: 'Falls place', to: '/places/blue-nile-falls-tis-issat' },
      { label: 'Plan a day', to: '/trip-planner' },
    ],
  },
  {
    id: 'town',
    question: 'Short ride in town (bajaj / taxi)?',
    answer:
      'Bajaj (tuk-tuk) for short hops; taxi for longer cross-town trips. Always agree the price before you start. Minibuses are cheapest on fixed routes if you know the line.',
    priceHint: 'Bajaj ~50–200 · Taxi ~150–500 ETB',
    tips: ['Night and rain often cost more', 'Hotel staff can help set a fair price'],
    fareIds: ['tf-1', 'tf-2', 'tf-3'],
    icon: MapPin,
    links: [{ label: 'Live map', to: '/map' }],
  },
  {
    id: 'bus',
    question: 'Bus to Gondar / Addis / other cities?',
    answer:
      'Use the main bus station for intercity routes. Prices depend on distance and bus type. Buy early on busy days and keep valuables close.',
    priceHint: '~100–800+ ETB / seat (route-dependent)',
    tips: ['Confirm departure time the day before', 'Arrive early for a seat'],
    fareIds: ['tf-7'],
    icon: Bus,
    links: [{ label: 'Discover transport', to: '/discover' }],
  },
]

function HowDoISection() {
  const [openId, setOpenId] = useState<string | null>('airport')

  return (
    <section className="mx-auto max-w-6xl px-4 pb-4 pt-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold sm:text-2xl">How do I…?</h2>
        <p className="text-sm text-slate-500">
          Plain answers first. Fares are planning estimates in ETB — confirm on site.
        </p>
      </div>
      <div className="space-y-2">
        {HOW_TO.map((item) => {
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
                  <ul className="mt-2 space-y-1 text-xs text-slate-500">
                    {item.tips.map((t) => (
                      <li key={t}>· {t}</li>
                    ))}
                  </ul>
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
                  {item.links && item.links.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.links.map((l) =>
                        l.to ? (
                          <Link
                            key={l.label}
                            to={l.to}
                            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-sky-700 dark:border-slate-700"
                          >
                            {l.label}
                          </Link>
                        ) : null
                      )}
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
