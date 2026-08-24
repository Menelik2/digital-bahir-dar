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

const LAKE_TANA_IMG =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Lake_Tana_from_the_air_%28Ethiopia%29.jpg/640px-Lake_Tana_from_the_air_%28Ethiopia%29.jpg'
const FALLS_IMG =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Blue_Nile_Falls.jpg/640px-Blue_Nile_Falls.jpg'
const CITY_IMG =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Bahir_Dar_Ethiopia.jpg/640px-Bahir_Dar_Ethiopia.jpg'

/** Four primary visitor paths — answer “what do I need?” in one tap */
const DESK = [
  {
    to: '/hotels',
    title: 'Stay',
    body: 'Hotels by budget · near lake or center',
    icon: Hotel,
    gradient: 'from-blue-500 to-sky-600',
    ring: 'hover:ring-blue-300',
  },
  {
    to: '/restaurants',
    title: 'Eat',
    body: 'Injera, lake fish, coffee · price bands',
    icon: UtensilsCrossed,
    gradient: 'from-orange-500 to-amber-600',
    ring: 'hover:ring-orange-300',
  },
  {
    to: '/transport',
    title: 'Go',
    body: 'Airport, bajaj, boats, falls day trip',
    icon: Car,
    gradient: 'from-violet-500 to-purple-600',
    ring: 'hover:ring-violet-300',
  },
  {
    to: '/today',
    title: 'See',
    body: 'Today’s plan · lake, viewpoint, market',
    icon: Sun,
    gradient: 'from-teal-500 to-emerald-600',
    ring: 'hover:ring-teal-300',
  },
] as const

export default function HomePage() {
  const t = useT()
  const upcoming = CITY_EVENTS.filter((e) => e.featured).slice(0, 3)
  const tips = PRACTICAL_TIPS.slice(0, 3)
  const completed = useTodoStore((s) => s.completed)
  const done = CITY_TODOS.filter((x) => completed[x.id]).length

  const moreTools = [
    { label: 'Today', icon: Sun, path: '/today', color: 'bg-amber-50 text-amber-700' },
    { label: 'Planner', icon: Sparkles, path: '/trip-planner', color: 'bg-sky-50 text-sky-700' },
    { label: t.home.thingsToDo, icon: ListTodo, path: '/todo', color: 'bg-sky-50 text-sky-700' },
    { label: t.nav.discover, icon: Compass, path: '/discover', color: 'bg-teal-50 text-teal-700' },
    { label: t.nav.explore, icon: Search, path: '/explore', color: 'bg-sky-50 text-sky-700' },
    { label: t.nav.map, icon: Navigation, path: '/map', color: 'bg-emerald-50 text-emerald-700' },
    { label: t.nav.attractions, icon: Landmark, path: '/attractions', color: 'bg-emerald-50 text-emerald-600' },
    { label: t.nav.banks, icon: Building2, path: '/banks', color: 'bg-indigo-50 text-indigo-600' },
    { label: 'ATM', icon: CreditCard, path: '/banks', color: 'bg-cyan-50 text-cyan-600' },
    { label: t.nav.city, icon: Building, path: '/city', color: 'bg-slate-100 text-slate-700' },
    { label: t.nav.events, icon: Calendar, path: '/events', color: 'bg-purple-50 text-purple-600' },
    { label: t.nav.guides, icon: Users, path: '/guides', color: 'bg-teal-50 text-teal-600' },
    { label: t.home.emergency, icon: AlertTriangle, path: '/directory#emergency', color: 'bg-rose-50 text-rose-600' },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-600 via-sky-500 to-teal-600 px-4 py-14 text-white sm:py-20">
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium">
            <MapPin className="h-4 w-4" /> {t.home.badge}
          </div>
          <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">{t.home.title}</h1>
          <p className="mx-auto mb-6 max-w-2xl text-lg text-sky-100 sm:text-xl">{t.tagline}</p>
          <p className="mx-auto mb-8 max-w-lg text-sm text-sky-100/90">
            Start with one question: where to sleep, eat, get around, or what to do today.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/today">
              <Button size="lg" className="w-full bg-white text-sky-700 hover:bg-sky-50 sm:w-auto">
                <Sun className="h-5 w-5" /> Today in Bahir Dar
              </Button>
            </Link>
            <Link to="/trip-planner">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/40 bg-white/10 text-white hover:bg-white/20 sm:w-auto"
              >
                <Sparkles className="h-5 w-5" /> Plan 2–5 days
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

      {/* Visitor desk — Stay / Eat / Go / See */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold sm:text-2xl">What do you need?</h2>
            <p className="text-sm text-slate-500">Four clear paths — the rest is optional</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {DESK.map((item) => (
            <Link key={item.to} to={item.to} className="group block h-full">
              <Card
                className={`h-full overflow-hidden transition hover:shadow-lg hover:ring-2 ${item.ring}`}
              >
                <div className={`bg-gradient-to-br ${item.gradient} px-4 py-5 text-white`}>
                  <item.icon className="mb-2 h-8 w-8 opacity-95" />
                  <p className="text-2xl font-bold tracking-tight">{item.title}</p>
                </div>
                <CardContent className="flex items-center justify-between gap-2 p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-300">{item.body}</p>
                  <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:text-sky-500" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Today highlight strip */}
        <Link to="/today" className="mt-4 block">
          <Card className="overflow-hidden border-amber-200 bg-gradient-to-r from-amber-50 to-sky-50 transition hover:border-amber-400 dark:border-amber-900 dark:from-amber-950/30 dark:to-sky-950/30">
            <CardContent className="flex flex-wrap items-center gap-4 p-4 sm:p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/90 text-amber-950">
                <Sun className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900 dark:text-white">Today in Bahir Dar</p>
                <p className="text-sm text-slate-500">
                  Morning lake → viewpoint → market → sunset dinner. Roughly ~1,200 ETB/person.
                </p>
              </div>
              <span className="text-sm font-medium text-amber-800 dark:text-amber-200">Open plan →</span>
            </CardContent>
          </Card>
        </Link>
      </section>

      {/* More tools — secondary */}
      <section className="border-t border-slate-100 bg-slate-50 px-4 py-8 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-lg font-semibold text-slate-700 dark:text-slate-200">More tools</h2>
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

      {/* Events */}
      <section className="px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t.home.happening}</h2>
            <Link to="/events" className="text-sm font-medium text-sky-600 hover:underline">
              {t.home.allEvents}
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {upcoming.map((e) => (
              <Link key={e.id} to="/events">
                <Card className="h-full transition hover:shadow-md">
                  <CardContent className="p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-sky-600">{e.dateLabel}</p>
                    <h3 className="mt-1 font-semibold">{e.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">{e.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured places */}
      <section className="bg-slate-50 px-4 py-10 dark:bg-slate-900/50">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-xl font-semibold">{t.home.featured}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link to="/places/lake-tana">
              <Card className="overflow-hidden transition hover:shadow-lg">
                <div className="relative h-40 bg-sky-200">
                  <img src={LAKE_TANA_IMG} alt="Lake Tana" className="h-full w-full object-cover" loading="lazy" />
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
                <div className="relative h-40 bg-emerald-200">
                  <img src={FALLS_IMG} alt="Blue Nile Falls" className="h-full w-full object-cover" loading="lazy" />
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
                <div className="relative h-40 bg-violet-200">
                  <img src={CITY_IMG} alt="Bahir Dar" className="h-full w-full object-cover" loading="lazy" />
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

      {/* Travel smart */}
      <section className="border-t border-slate-200 bg-white px-4 py-10 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t.home.travelSmart}</h2>
            <Link to="/directory" className="text-sm font-medium text-sky-600 hover:underline">
              {t.home.fullDirectory}
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {tips.map((tip) => (
              <Card key={tip.id}>
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
              <Sun className="h-5 w-5" /> Start with today
            </Button>
          </Link>
          <Link to="/trip-planner">
            <Button size="lg" variant="outline">
              <Sparkles className="h-5 w-5" /> Multi-day planner
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
