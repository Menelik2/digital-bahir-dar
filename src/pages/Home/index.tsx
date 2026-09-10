import { Link } from 'react-router-dom'
import {
  MapPin,
  Hotel,
  UtensilsCrossed,
  Bus,
  Landmark,
  Sparkles,
  Calendar,
  Navigation,
  Wallet,
  ListTodo,
  Compass,
  Sun,
  AlertTriangle,
  ArrowRight,
  Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CITY_EVENTS } from '@/data/cityLife'
import { CITY_TODOS } from '@/data/thingsToDo'
import { useTodoStore } from '@/store/todoStore'
import { useT } from '@/hooks/useT'
import { cn } from '@/lib/utils'
import { HERO_BLUE_NILE_DATA_URL } from '@/data/heroBlueNile'

export default function HomePage() {
  const t = useT()
  const completed = useTodoStore((s) => s.completed)
  const done = CITY_TODOS.filter((x) => completed[x.id]).length
  const featuredEvents = CITY_EVENTS.filter((e) => e.featured).slice(0, 3)

  const primaryPaths = [
    {
      title: t.home.stay,
      body: t.home.stayBody,
      path: '/hotels',
      icon: Hotel,
      color: 'bg-[#078930]/12 text-[#078930]',
      ring: 'ring-[#078930]/20',
    },
    {
      title: t.home.eat,
      body: t.home.eatBody,
      path: '/restaurants',
      icon: UtensilsCrossed,
      color: 'bg-[#0b6e99]/12 text-[#0b6e99]',
      ring: 'ring-[#0b6e99]/20',
    },
    {
      title: t.home.go,
      body: t.home.goBody,
      path: '/transport',
      icon: Bus,
      color: 'bg-[#d4a017]/15 text-[#9a7b0a]',
      ring: 'ring-[#d4a017]/25',
    },
    {
      title: t.home.see,
      body: t.home.seeBody,
      path: '/attractions',
      icon: Landmark,
      color: 'bg-[#5b4b8a]/12 text-[#5b4b8a]',
      ring: 'ring-[#5b4b8a]/20',
    },
  ]

  const moreTools = [
    { label: t.home.budget, icon: Wallet, path: '/budget', color: 'bg-[#0b6e99]/12 text-[#0b6e99]' },
    { label: t.home.thingsToDo, icon: ListTodo, path: '/todo', color: 'bg-[#078930]/12 text-[#078930]' },
    { label: t.nav.discover, icon: Compass, path: '/discover', color: 'bg-[#078930]/10 text-[#056b24]' },
    { label: t.nav.map, icon: MapPin, path: '/map?locate=1', color: 'bg-[#0b6e99]/12 text-[#0b6e99]' },
    { label: t.nav.aiGuide, icon: Sparkles, path: '/ai-guide', color: 'bg-[#5b4b8a]/12 text-[#5b4b8a]' },
    { label: t.nav.events, icon: Calendar, path: '/events', color: 'bg-[#d4a017]/15 text-[#9a7b0a]' },
    { label: t.nav.planner, icon: Navigation, path: '/trip-planner', color: 'bg-[#078930]/12 text-[#078930]' },
    {
      label: t.home.emergency,
      icon: AlertTriangle,
      path: '/help#emergency',
      color: 'bg-[#da121a]/12 text-[#da121a]',
    },
    { label: t.nav.directory, icon: Shield, path: '/help', color: 'bg-[#0b6e99]/12 text-[#0b6e99]' },
  ]

  return (
    <div className="bg-[#f2f2f7] dark:bg-black">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_BLUE_NILE_DATA_URL}
            alt=""
            className="h-full w-full scale-105 object-cover object-[center_40%] sm:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-[#f2f2f7] dark:to-black" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 sm:pb-14 sm:pt-16 lg:px-8 lg:pb-16 lg:pt-20">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[12px] font-medium text-white/95 backdrop-blur-sm">
              <MapPin className="h-3.5 w-3.5" /> Bahir Dar Smart Digital City
            </p>
            <h1 className="text-[34px] font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t.home.heroTitle}
            </h1>
            <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-white/90 sm:text-lg">
              {t.home.heroSubtitle}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/today" className="w-full sm:w-auto">
                <Button className="h-12 w-full rounded-full bg-[#f5c518] px-6 text-[15px] font-semibold text-[#1c1c1e] hover:bg-[#e6b800] sm:w-auto">
                  <Sun className="h-5 w-5" /> {t.home.todayCta}
                </Button>
              </Link>
              <Link to="/trip-planner" className="w-full sm:w-auto">
                <Button className="h-12 w-full rounded-full border border-white/30 bg-white/15 px-6 text-[15px] font-semibold text-white backdrop-blur hover:bg-white/25 sm:w-auto">
                  <Sparkles className="h-5 w-5" /> {t.home.planMultiDay}
                </Button>
              </Link>
            </div>
            <p className="mt-3 text-[13px] text-white/70">{t.home.simpleHint}</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
        <section className="-mt-2 mb-8 sm:mb-10">
          <p className="mb-2 inline-flex items-center rounded-full bg-[#078930]/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#078930]">
            {t.home.startHere}
          </p>
          <h2 className="text-[22px] font-bold tracking-tight text-[#1c1c1e] dark:text-white sm:text-2xl">
            {t.home.whatNeed}
          </h2>
          <p className="mt-1 max-w-2xl text-[14px] text-[#8e8e93] sm:text-[15px]">{t.home.whatNeedSub}</p>
          <p className="mt-1 text-[13px] text-[#8e8e93]">{t.home.startHereSub}</p>

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-2 sm:gap-3 md:grid-cols-4 md:gap-3">
            {primaryPaths.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.path} to={item.path} className="group block">
                  <div
                    className={cn(
                      'flex min-h-[92px] flex-col justify-between rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/[0.04] transition duration-200 active:scale-[0.98] group-hover:-translate-y-0.5 group-hover:shadow-md dark:bg-[#1c1c1e] dark:ring-white/10 sm:min-h-[100px] sm:p-3.5',
                      item.ring
                    )}
                  >
                    <span
                      className={cn(
                        'mb-2 flex h-9 w-9 items-center justify-center rounded-full sm:h-10 sm:w-10',
                        item.color
                      )}
                    >
                      <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" strokeWidth={2} />
                    </span>
                    <div>
                      <p className="text-[14px] font-bold leading-tight text-[#1c1c1e] dark:text-white sm:text-[15px]">
                        {item.title}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-[#8e8e93] sm:text-[12px]">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        <Link to="/today" className="group mb-8 block sm:mb-10">
          <Card className="overflow-hidden border-0 bg-white shadow-sm ring-1 ring-black/[0.04] transition group-hover:shadow-md dark:bg-[#1c1c1e] dark:ring-white/10">
            <CardContent className="flex items-center gap-3 p-4 sm:gap-4 sm:p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f5c518]/20 text-[#9a7b0a]">
                <Sun className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-bold text-[#1c1c1e] dark:text-white">{t.home.todayTitle}</p>
                <p className="mt-0.5 text-[12px] text-[#8e8e93] sm:text-[13px] lg:text-[14px]">{t.home.todayBody}</p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-[#8e8e93] transition group-hover:translate-x-0.5 group-hover:text-[#078930]" />
            </CardContent>
          </Card>
        </Link>

        <section className="mb-10 sm:mb-12">
          <h2 className="mb-4 text-[20px] font-bold tracking-tight text-[#1c1c1e] dark:text-white sm:text-2xl">
            {t.home.moreTools}
          </h2>
          <div className="grid grid-cols-3 gap-2 min-[400px]:grid-cols-3 sm:grid-cols-4 sm:gap-3 lg:grid-cols-5 xl:grid-cols-5">
            {moreTools.map((tool) => {
              const Icon = tool.icon
              return (
                <Link key={tool.path} to={tool.path} className="group">
                  <div className="flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-[1.15rem] bg-white p-3 text-center shadow-sm ring-1 ring-black/[0.04] transition active:scale-[0.98] group-hover:shadow-md dark:bg-[#1c1c1e] dark:ring-white/10 sm:min-h-[100px]">
                    <span className={cn('flex h-10 w-10 items-center justify-center rounded-full', tool.color)}>
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <span className="text-[12px] font-semibold leading-tight text-[#1c1c1e] dark:text-white sm:text-[13px]">
                      {tool.label}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {featuredEvents.length > 0 && (
          <section className="mb-10 sm:mb-12">
            <div className="mb-4 flex items-end justify-between gap-2">
              <h2 className="text-[20px] font-bold tracking-tight text-[#1c1c1e] dark:text-white sm:text-2xl">
                {t.home.happening}
              </h2>
              <Link to="/events" className="text-[13px] font-semibold text-[#078930]">
                {t.common.seeAll}
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featuredEvents.map((ev) => (
                <Link key={ev.id} to="/events" className="block">
                  <Card className="h-full border-0 shadow-sm ring-1 ring-black/[0.04] transition hover:shadow-md dark:ring-white/10">
                    <CardContent className="p-4">
                      <p className="text-[15px] font-bold text-[#1c1c1e] dark:text-white">{ev.title}</p>
                      <p className="mt-1 line-clamp-2 text-[13px] text-[#8e8e93]">{ev.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-6">
          <div className="mb-4 flex items-end justify-between gap-2">
            <h2 className="text-[20px] font-bold tracking-tight text-[#1c1c1e] dark:text-white sm:text-2xl">
              {t.home.checklist}
            </h2>
            <Link to="/todo" className="text-[13px] font-semibold text-[#078930]">
              {done}/{CITY_TODOS.length}
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {CITY_TODOS.slice(0, 6).map((todo) => (
              <Link key={todo.id} to="/todo" className="block">
                <Card className="border-0 shadow-sm ring-1 ring-black/[0.04] dark:ring-white/10">
                  <CardContent className="flex items-start gap-3 p-4">
                    <span
                      className={cn(
                        'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px]',
                        completed[todo.id]
                          ? 'border-[#078930] bg-[#078930] text-white'
                          : 'border-slate-300 text-transparent'
                      )}
                    >
                      ✓
                    </span>
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-[#1c1c1e] dark:text-white">{todo.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-[12px] text-[#8e8e93]">{todo.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
