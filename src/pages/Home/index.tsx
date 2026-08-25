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
      ring: 'hover:ring-[#0b6e99]/40',
    },
    {
      to: '/restaurants',
      title: t.home.eat,
      body: t.home.eatBody,
      icon: UtensilsCrossed,
      gradient: 'from-[#c4a574] to-[#6f4e37]',
      ring: 'hover:ring-[#c4a574]/50',
    },
    {
      to: '/transport',
      title: t.home.go,
      body: t.home.goBody,
      icon: Car,
      gradient: 'from-[#078930] to-[#056b24]',
      ring: 'hover:ring-[#078930]/40',
    },
    {
      to: '/today',
      title: t.home.see,
      body: t.home.seeBody,
      icon: Sun,
      gradient: 'from-[#d4a017] to-[#b8860b]',
      ring: 'hover:ring-[#f5c518]/50',
    },
  ] as const

  const moreTools = [
    { label: t.nav.today, icon: Sun, path: '/today', color: 'bg-[#f5c518]/20 text-[#8a6d0b]' },
    { label: t.nav.planner, icon: Sparkles, path: '/trip-planner', color: 'bg-[#0b6e99]/12 text-[#0b6e99]' },
    { label: t.home.budget, icon: Wallet, path: '/budget', color: 'bg-[#0b6e99]/12 text-[#0b6e99]' },
    { label: t.home.thingsToDo, icon: ListTodo, path: '/todo', color: 'bg-[#078930]/12 text-[#078930]' },
    { label: t.nav.discover, icon: Compass, path: '/discover', color: 'bg-[#078930]/10 text-[#056b24]' },
    { label: t.nav.explore, icon: Search, path: '/explore', color: 'bg-[#0b6e99]/10 text-[#0a5a7e]' },
    { label: t.nav.map, icon: Navigation, path: '/map', color: 'bg-[#078930]/12 text-[#078930]' },
    { label: t.nav.attractions, icon: Landmark, path: '/attractions', color: 'bg-[#d4a017]/15 text-[#8a6d0b]' },
    { label: t.nav.banks, icon: Building2, path: '/banks', color: 'bg-slate-100 text-slate-700' },
    { label: 'ATM', icon: CreditCard, path: '/banks', color: 'bg-[#0b6e99]/10 text-[#0b6e99]' },
    { label: t.nav.city, icon: Building, path: '/city', color: 'bg-[#f3e6c8]/60 text-[#6f4e37]' },
    { label: t.nav.events, icon: Calendar, path: '/events', color: 'bg-[#da121a]/10 text-[#da121a]' },
    { label: t.nav.guides, icon: Users, path: '/guides', color: 'bg-[#078930]/10 text-[#056b24]' },
    { label: t.home.emergency, icon: AlertTriangle, path: '/directory#emergency', color: 'bg-[#da121a]/12 text-[#da121a]' },
  ]

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#056b24] via-[#0b6e99] to-[#0a4d6e] px-4 py-14 text-white sm:py-20">
        <div className="ethio-flag-bar absolute inset-x-0 top-0" aria-hidden />
        <div className="ethio-mesh pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            <MapPin className="h-4 w-4 text-[#f5c518]" /> {t.home.badge}
          </div>
          <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">{t.home.title}</h1>
          <p className="mx-auto mb-2 max-w-2xl text-lg text-[#f5c518]/95 sm:text-xl">{t.tagline}</p>
          <p className="mx-auto mb-8 max-w-lg text-sm text-white/85">{t.home.heroHint}</p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/today">
              <Button size="lg" className="w-full bg-[#f5c518] text-[#3d3200] hover:bg-[#e6b800] sm:w-auto">
                <Sun className="h-5 w-5" /> {t.home.todayTitle}
              </Button>
            </Link>
            <Link to="/trip-planner">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/40 bg-white/10 text-white hover:bg-white/20 sm:w-auto"
              >
                <Sparkles className="h-5 w-5" /> {t.home.planMultiDay}
              </Button>
            </Link>
            <Link to="/ai-guide">
              <Button size="lg" variant="ghost" className="w-full text-white hover:bg-white/15 sm:w-auto">
                <Sparkles className="h-5 w-5" /> {t.nav.aiGuide}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <div className="mb-3 flex items-end justify-between gap-2">
          <div>
            <h2 className="ethio-title text-lg sm:text-xl">{t.home.whatNeed}</h2>
            <p className="mt-1.5 text-xs text-slate-500 sm:text-sm">{t.home.whatNeedSub}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
          {desk.map((item) => (
            <Link key={item.to} to={item.to} className="group block">
              <div
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.gradient} p-3.5 text-white shadow-sm transition active:scale-[0.98] group-hover:shadow-md sm:p-4 ${item.ring}`}
              >
                <item.icon className="mb-2 h-6 w-6 opacity-95 sm:h-7 sm:w-7" />
                <p className="text-base font-bold tracking-tight sm:text-lg">{item.title}</p>
                <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-white/85 sm:text-xs">
                  {item.body}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <Link to="/today" className="mt-3 block">
          <div className="flex items-center gap-3 rounded-2xl border border-[#f5c518]/45 bg-gradient-to-r from-[#f5c518]/15 to-[#078930]/8 px-3.5 py-3 transition hover:border-[#f5c518] dark:from-[#f5c518]/10 dark:to-[#078930]/15">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f5c518] text-[#3d3200]">
              <Sun className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.home.todayTitle}</p>
              <p className="truncate text-xs text-slate-500">{t.home.todayBody}</p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-[#056b24] dark:text-[#7dcea0]" />
          </div>
        </Link>
      </section>

      <section className="border-t border-[#078930]/10 bg-[#f3e6c8]/35 px-4 py-8 dark:border-[#078930]/20 dark:bg-slate-900/40">
        <div className="mx-auto max-w-6xl">
          <h2 className="ethio-title mb-4 text-lg text-slate-700 dark:text-slate-200">{t.home.moreTools}</h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
            {moreTools.map((a) => (
              <Link key={a.path + a.label} to={a.path}>
                <Card className="transition hover:shadow-md active:scale-[0.98]">
                  <CardContent className="flex flex-col items-center gap-1.5 p-3 text-center">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.color}`}>
                      <a.icon className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-medium leading-tight text-slate-700 dark:text-slate-300">
                      {a.label}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="ethio-title text-xl">{t.home.happening}</h2>
            <Link to="/events" className="text-sm font-medium text-[#078930] hover:underline">
              {t.home.allEvents}
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {upcoming.map((e) => (
              <Link key={e.id} to="/events">
                <Card className="h-full border-[#078930]/10 transition hover:shadow-md">
                  <CardContent className="p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-[#0b6e99]">{e.dateLabel}</p>
                    <h3 className="mt-1 font-semibold">{e.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">{e.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f3e6c8]/25 px-4 py-10 dark:bg-slate-900/50">
        <div className="mx-auto max-w-6xl">
          <h2 className="ethio-title mb-6 text-xl">{t.home.featured}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link to="/places/lake-tana">
              <Card className="overflow-hidden transition hover:shadow-lg">
                <div className="relative h-40 bg-[#0b6e99]/30">
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
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{t.home.lakeTana}</h3>
                  <p className="text-sm text-slate-500">{t.home.lakeTanaDesc}</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/places/blue-nile-falls-tis-issat">
              <Card className="overflow-hidden transition hover:shadow-lg">
                <div className="relative h-40 bg-[#078930]/20">
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
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{t.home.blueNileFalls}</h3>
                  <p className="text-sm text-slate-500">{t.home.blueNileFallsDesc}</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/todo">
              <Card className="overflow-hidden transition hover:shadow-lg">
                <div className="relative h-40 bg-[#d4a017]/20">
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
                  <h3 className="font-semibold">{t.home.checklist}</h3>
                  <p className="text-sm text-slate-500">
                    {done} / {CITY_TODOS.length} {t.home.checklistDone}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-[#078930]/10 bg-white px-4 py-10 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="ethio-title text-xl">{t.home.travelSmart}</h2>
            <Link to="/directory" className="text-sm font-medium text-[#078930] hover:underline">
              {t.home.fullDirectory}
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {tips.map((tip) => (
              <Card key={tip.id} className="border-[#078930]/10">
                <CardContent className="p-4">
                  <h3 className="font-semibold">{tip.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{tip.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
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

      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="mb-3 text-2xl font-bold">{t.home.ctaTitle}</h2>
        <p className="mb-6 text-slate-600 dark:text-slate-400">{t.home.ctaBody}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/today">
            <Button size="lg">
              <Sun className="h-5 w-5" /> {t.home.startWithToday}
            </Button>
          </Link>
          <Link to="/trip-planner">
            <Button size="lg" variant="outline">
              <Sparkles className="h-5 w-5" /> {t.home.multiDayPlanner}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
