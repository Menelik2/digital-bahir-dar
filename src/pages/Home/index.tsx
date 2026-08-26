import { Link } from 'react-router-dom'
import {
  MapPin,
  Hotel,
  UtensilsCrossed,
  Car,
  Building2,
  CreditCard,
  Hospital,
  Calendar,
  AlertTriangle,
  Sparkles,
  Navigation,
  Users,
  Wallet,
  ListTodo,
  Building,
  Compass,
  Search,
  Sun,
  Landmark,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CITY_EVENTS, PRACTICAL_TIPS } from '@/data/cityLife'
import { CITY_TODOS } from '@/data/thingsToDo'
import { useTodoStore } from '@/store/todoStore'
import { useT } from '@/hooks/useT'

const LAKE_TANA_IMG = '/images/lake-tana.jpg'
const FALLS_IMG = '/images/blue-nile-falls.jpg'
const CITY_IMG = '/images/bahir-dar.jpg'
const LAKE_TANA_FALLBACK =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/ET_Amhara_asv2018-02_img112_Lake_Tana_at_Bahir_Dar.jpg/800px-ET_Amhara_asv2018-02_img112_Lake_Tana_at_Bahir_Dar.jpg'
const FALLS_FALLBACK =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Blue_Nile_Falls-03%2C_by_CT_Snow.jpg/800px-Blue_Nile_Falls-03%2C_by_CT_Snow.jpg'
const CITY_FALLBACK =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/The_city_of_Bahir_Dar%2C_Ethiopia.jpg/800px-The_city_of_Bahir_Dar%2C_Ethiopia.jpg'

export default function HomePage() {
  const t = useT()
  const upcoming = CITY_EVENTS.filter((e) => e.featured).slice(0, 3)
  const tips = PRACTICAL_TIPS.slice(0, 3)
  const completed = useTodoStore((s) => s.completed)
  const done = CITY_TODOS.filter((x) => completed[x.id]).length

  const desk = [
    {
      to: '/hotels',
      title: t.home.stay,
      body: t.home.stayBody,
      icon: Hotel,
      gradient: 'from-[#0b6e99] to-[#0a4d6e]',
    },
    {
      to: '/restaurants',
      title: t.home.eat,
      body: t.home.eatBody,
      icon: UtensilsCrossed,
      gradient: 'from-[#c4a574] to-[#6f4e37]',
    },
    {
      to: '/transport',
      title: t.home.go,
      body: t.home.goBody,
      icon: Car,
      gradient: 'from-[#078930] to-[#056b24]',
    },
    {
      to: '/today',
      title: t.home.see,
      body: t.home.seeBody,
      icon: Sun,
      gradient: 'from-[#d4a017] to-[#b8860b]',
    },
  ] as const

  const moreTools = [
    { label: t.nav.today, icon: Sun, path: '/today', color: 'bg-[#f5c518]/25 text-[#8a6d0b]' },
    { label: t.nav.planner, icon: Sparkles, path: '/trip-planner', color: 'bg-[#0b6e99]/12 text-[#0b6e99]' },
    { label: t.home.budget, icon: Wallet, path: '/budget', color: 'bg-[#0b6e99]/12 text-[#0b6e99]' },
    { label: t.home.thingsToDo, icon: ListTodo, path: '/todo', color: 'bg-[#078930]/12 text-[#078930]' },
    { label: t.nav.discover, icon: Compass, path: '/discover', color: 'bg-[#078930]/10 text-[#056b24]' },
    { label: t.nav.explore, icon: Search, path: '/explore', color: 'bg-[#0b6e99]/10 text-[#0a5a7e]' },
    { label: t.nav.map, icon: Navigation, path: '/map', color: 'bg-[#078930]/12 text-[#078930]' },
    { label: t.nav.attractions, icon: Landmark, path: '/attractions', color: 'bg-[#d4a017]/15 text-[#8a6d0b]' },
    { label: t.nav.banks, icon: Building2, path: '/banks', color: 'bg-[#f2f2f7] text-[#3c3c43] dark:bg-white/10 dark:text-white' },
    { label: 'ATM', icon: CreditCard, path: '/banks', color: 'bg-[#0b6e99]/10 text-[#0b6e99]' },
    { label: t.nav.city, icon: Building, path: '/city', color: 'bg-[#f3e6c8]/60 text-[#6f4e37]' },
    { label: t.nav.events, icon: Calendar, path: '/events', color: 'bg-[#da121a]/10 text-[#da121a]' },
    { label: t.nav.guides, icon: Users, path: '/guides', color: 'bg-[#078930]/10 text-[#056b24]' },
    { label: t.home.emergency, icon: AlertTriangle, path: '/directory#emergency', color: 'bg-[#da121a]/12 text-[#da121a]' },
  ]

  return (
    <div className="bg-[#f2f2f7] dark:bg-black">
      {/* Compact iOS-style hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#056b24] via-[#0b6e99] to-[#0a4d6e] px-4 pb-8 pt-8 text-white sm:pb-14 sm:pt-14">
        <div className="ethio-flag-bar absolute inset-x-0 top-0" aria-hidden />
        <div className="ethio-mesh pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[12px] font-semibold backdrop-blur-md sm:mb-4 sm:px-4 sm:py-1.5 sm:text-sm">
            <MapPin className="h-3.5 w-3.5 text-[#f5c518] sm:h-4 sm:w-4" /> {t.home.badge}
          </div>
          <h1 className="mb-2 text-[28px] font-bold leading-tight tracking-tight sm:mb-3 sm:text-5xl md:text-6xl">
            {t.home.title}
          </h1>
          <p className="mx-auto mb-1 max-w-2xl text-[15px] font-medium text-[#f5c518]/95 sm:text-xl">
            {t.tagline}
          </p>
          <p className="mx-auto mb-5 max-w-md text-[13px] leading-snug text-white/80 sm:mb-8 sm:text-sm">
            {t.home.heroHint}
          </p>
          <div className="flex flex-col items-stretch justify-center gap-2.5 sm:flex-row sm:items-center">
            <Link to="/today" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full bg-[#f5c518] text-[#3d3200] shadow-lg shadow-black/10 hover:bg-[#e6b800]"
              >
                <Sun className="h-5 w-5" /> {t.home.todayTitle}
              </Button>
            </Link>
            <Link to="/trip-planner" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/35 bg-white/15 text-white backdrop-blur-sm hover:bg-white/25"
              >
                <Sparkles className="h-5 w-5" /> {t.home.planMultiDay}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What do you need — app grid */}
      <section className="mx-auto max-w-6xl px-4 py-5 sm:py-8">
        <div className="mb-3">
          <h2 className="ios-section-title text-[20px] font-bold tracking-tight text-[#1c1c1e] dark:text-white sm:text-xl">
            {t.home.whatNeed}
          </h2>
          <p className="mt-0.5 text-[13px] text-[#8e8e93]">{t.home.whatNeedSub}</p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
          {desk.map((item) => (
            <Link key={item.to} to={item.to} className="group block ios-press">
              <div
                className={`relative overflow-hidden rounded-[1.25rem] bg-gradient-to-br ${item.gradient} p-3.5 text-white shadow-[0_4px_20px_rgba(0,0,0,0.12)] sm:p-4`}
              >
                <item.icon className="mb-2 h-6 w-6 opacity-95 sm:h-7 sm:w-7" strokeWidth={2} />
                <p className="text-[16px] font-bold tracking-tight sm:text-lg">{item.title}</p>
                <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-white/85 sm:text-xs">
                  {item.body}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <Link to="/today" className="mt-3 block ios-press">
          <div className="flex items-center gap-3 rounded-[1.25rem] border border-black/[0.04] bg-white px-3.5 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:border-white/[0.08] dark:bg-[#1c1c1e]">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f5c518] text-[#3d3200]">
              <Sun className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-[#1c1c1e] dark:text-white">{t.home.todayTitle}</p>
              <p className="truncate text-[12px] text-[#8e8e93]">{t.home.todayBody}</p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-[#c7c7cc]" />
          </div>
        </Link>
      </section>

      {/* Tools — iOS app icon grid */}
      <section className="px-4 pb-6 sm:pb-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-3 text-[20px] font-bold tracking-tight text-[#1c1c1e] dark:text-white">
            {t.home.moreTools}
          </h2>
          <div className="grid grid-cols-4 gap-x-2 gap-y-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
            {moreTools.map((a) => (
              <Link key={a.path + a.label} to={a.path} className="ios-press">
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-[1.1rem] shadow-sm ${a.color}`}
                  >
                    <a.icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <span className="line-clamp-2 max-w-[4.5rem] text-[11px] font-medium leading-tight text-[#3c3c43] dark:text-white/80">
                    {a.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[20px] font-bold tracking-tight text-[#1c1c1e] dark:text-white">
              {t.home.happening}
            </h2>
            <Link to="/events" className="text-[15px] font-medium text-[#078930] dark:text-[#30d158]">
              {t.home.allEvents}
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
            {upcoming.map((e) => (
              <Link key={e.id} to="/events" className="ios-press">
                <Card className="h-full">
                  <CardContent className="p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#0b6e99]">
                      {e.dateLabel}
                    </p>
                    <h3 className="mt-1 text-[15px] font-semibold">{e.title}</h3>
                    <p className="mt-1 line-clamp-2 text-[13px] text-[#8e8e93]">{e.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-[20px] font-bold tracking-tight text-[#1c1c1e] dark:text-white">
            {t.home.featured}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            <Link to="/places/lake-tana" className="ios-press">
              <Card className="overflow-hidden">
                <div className="relative h-36 bg-[#0b6e99]/30 sm:h-40">
                  <img
                    src={LAKE_TANA_IMG}
                    alt="Lake Tana"
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const el = e.currentTarget
                      if (el.dataset.fb !== '1') {
                        el.dataset.fb = '1'
                        el.src = LAKE_TANA_FALLBACK
                      }
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-[15px] font-semibold">{t.home.lakeTana}</h3>
                  <p className="text-[13px] text-[#8e8e93]">{t.home.lakeTanaDesc}</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/places/blue-nile-falls-tis-issat" className="ios-press">
              <Card className="overflow-hidden">
                <div className="relative h-36 bg-[#078930]/20 sm:h-40">
                  <img
                    src={FALLS_IMG}
                    alt="Blue Nile Falls"
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const el = e.currentTarget
                      if (el.dataset.fb !== '1') {
                        el.dataset.fb = '1'
                        el.src = FALLS_FALLBACK
                      }
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-[15px] font-semibold">{t.home.blueNileFalls}</h3>
                  <p className="text-[13px] text-[#8e8e93]">{t.home.blueNileFallsDesc}</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/todo" className="ios-press">
              <Card className="overflow-hidden">
                <div className="relative h-36 bg-[#d4a017]/20 sm:h-40">
                  <img
                    src={CITY_IMG}
                    alt="Bahir Dar"
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const el = e.currentTarget
                      if (el.dataset.fb !== '1') {
                        el.dataset.fb = '1'
                        el.src = CITY_FALLBACK
                      }
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-[15px] font-semibold">{t.home.checklist}</h3>
                  <p className="text-[13px] text-[#8e8e93]">
                    {done} / {CITY_TODOS.length} {t.home.checklistDone}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[20px] font-bold tracking-tight text-[#1c1c1e] dark:text-white">
              {t.home.travelSmart}
            </h2>
            <Link to="/directory" className="text-[15px] font-medium text-[#078930] dark:text-[#30d158]">
              {t.home.fullDirectory}
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {tips.map((tip) => (
              <Card key={tip.id}>
                <CardContent className="p-4">
                  <h3 className="text-[15px] font-semibold">{tip.title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-[#8e8e93]">{tip.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/transport">
              <Button variant="outline" size="sm">
                <Car className="h-4 w-4" /> {t.home.fares}
              </Button>
            </Link>
            <Link to="/directory#emergency">
              <Button variant="outline" size="sm">
                <Hospital className="h-4 w-4" /> {t.home.emergency}
              </Button>
            </Link>
            <Link to="/budget">
              <Button variant="outline" size="sm">
                <Wallet className="h-4 w-4" /> {t.home.budget}
              </Button>
            </Link>
            <Link to="/map">
              <Button variant="outline" size="sm">
                <Navigation className="h-4 w-4" /> {t.home.map}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 text-center sm:py-16">
        <h2 className="mb-2 text-[22px] font-bold tracking-tight text-[#1c1c1e] dark:text-white sm:text-2xl">
          {t.home.ctaTitle}
        </h2>
        <p className="mb-6 text-[15px] text-[#8e8e93]">{t.home.ctaBody}</p>
        <div className="flex flex-col items-stretch justify-center gap-2.5 sm:flex-row sm:items-center">
          <Link to="/today">
            <Button size="lg" className="w-full sm:w-auto">
              <Sun className="h-5 w-5" /> {t.home.startWithToday}
            </Button>
          </Link>
          <Link to="/trip-planner">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <Sparkles className="h-5 w-5" /> {t.home.multiDayPlanner}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
