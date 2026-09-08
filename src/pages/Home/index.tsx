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

/** Real Bahir Dar / Lake Tana / Blue Nile (Wikimedia Commons) */
const BD = {
  lake:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/ET_Amhara_asv2018-02_img112_Lake_Tana_at_Bahir_Dar.jpg/800px-ET_Amhara_asv2018-02_img112_Lake_Tana_at_Bahir_Dar.jpg',
  falls:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Blue_Nile_Falls-03%2C_by_CT_Snow.jpg/1280px-Blue_Nile_Falls-03%2C_by_CT_Snow.jpg',
  city:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/The_city_of_Bahir_Dar%2C_Ethiopia.jpg/800px-The_city_of_Bahir_Dar%2C_Ethiopia.jpg',
} as const

/** Path cards — photography + soft 3D depth (Unsplash / Wikimedia with fallbacks) */
const IMG = {
  stay:
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
  eat:
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
  go:
    'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1000&q=80',
  see:
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80',
  stayFb:
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80',
  eatFb:
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=80',
  goFb:
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80',
  seeFb:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Blue_Nile_Falls-03%2C_by_CT_Snow.jpg/960px-Blue_Nile_Falls-03%2C_by_CT_Snow.jpg',
} as const

function PathPhoto({
  src,
  fallback,
  className,
}: {
  src: string
  fallback: string
  className?: string
}) {
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      className={cn(
        'h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]',
        className
      )}
      onError={(e) => {
        const el = e.currentTarget
        if (el.dataset.fb !== '1') {
          el.dataset.fb = '1'
          el.src = fallback
        }
      }}
    />
  )
}

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
      image: IMG.stay,
      imageFb: IMG.stayFb,
      accent: 'from-[#078930]/90 to-black/50',
    },
    {
      title: t.home.eat,
      body: t.home.eatBody,
      path: '/restaurants',
      icon: UtensilsCrossed,
      image: IMG.eat,
      imageFb: IMG.eatFb,
      accent: 'from-[#0b6e99]/90 to-black/50',
    },
    {
      title: t.home.go,
      body: t.home.goBody,
      path: '/transport',
      icon: Bus,
      image: IMG.go,
      imageFb: IMG.goFb,
      accent: 'from-[#d4a017]/90 to-black/50',
    },
    {
      title: t.home.see,
      body: t.home.seeBody,
      path: '/attractions',
      icon: Landmark,
      image: IMG.see,
      imageFb: IMG.seeFb,
      accent: 'from-[#5b4b8a]/90 to-black/50',
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
      path: '/directory#emergency',
      color: 'bg-[#da121a]/12 text-[#da121a]',
    },
    { label: t.nav.directory, icon: Shield, path: '/help', color: 'bg-[#0b6e99]/12 text-[#0b6e99]' },
  ]

  return (
    <div className="bg-[#f2f2f7] dark:bg-black">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_BLUE_NILE_DATA_URL}
            alt=""
            className="h-full w-full scale-105 object-cover object-[center_40%] sm:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-[#f2f2f7] dark:to-black" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-12 sm:pb-14 sm:pt-16 lg:pb-16 lg:pt-20">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold text-white backdrop-blur-sm sm:text-[13px]">
              <MapPin className="h-3.5 w-3.5 text-[#f5c518] sm:h-4 sm:w-4" /> {t.home.badge}
            </p>
            <h1 className="text-[32px] font-bold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t.home.title}
            </h1>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/90 sm:text-[16px]">
              {t.home.heroHint}
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Link to="/today" className="w-full sm:w-auto">
                <Button className="h-12 w-full rounded-full bg-[#f5c518] px-6 text-[15px] font-semibold text-[#3d3200] hover:bg-[#e6b800] sm:w-auto">
                  <Sun className="h-5 w-5" /> {t.home.todayTitle}
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

      <div className="mx-auto max-w-6xl px-4 pb-12 sm:pb-16">
        {/* Start here */}
        <section className="-mt-2 mb-8 sm:mb-10">
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[#8e8e93]">
            {t.home.startHere}
          </p>
          <h2 className="text-[22px] font-bold tracking-tight text-[#1c1c1e] dark:text-white sm:text-2xl">
            {t.home.whatNeed}
          </h2>
          <p className="mt-1 max-w-2xl text-[14px] text-[#8e8e93] sm:text-[15px]">{t.home.whatNeedSub}</p>
          <p className="mt-1 text-[13px] text-[#8e8e93]">{t.home.startHereSub}</p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {primaryPaths.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.path} to={item.path} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-slate-200 shadow-sm ring-1 ring-black/[0.04] transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg dark:ring-white/10 sm:aspect-[3/4]">
                    <PathPhoto src={item.image} fallback={item.imageFb} />
                    <div className={cn('absolute inset-0 bg-gradient-to-t', item.accent)} />
                    <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
                      <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
                        <Icon className="h-4.5 w-4.5" strokeWidth={2} />
                      </span>
                      <p className="text-[16px] font-bold text-white sm:text-[17px]">{item.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-white/85 sm:text-[13px]">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Today strip */}
        <Link to="/today" className="group mb-8 block sm:mb-10">
          <Card className="overflow-hidden border-0 bg-white shadow-sm ring-1 ring-black/[0.04] transition group-hover:shadow-md dark:bg-[#1c1c1e] dark:ring-white/10">
            <CardContent className="flex items-center gap-3 p-4 sm:gap-4 sm:p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f5c518]/20 text-[#9a7b0a]">
                <Sun className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold tracking-tight text-[#1c1c1e] dark:text-white lg:text-[17px]">
                  {t.home.todayTitle}
                </p>
                <p className="truncate text-[12px] text-[#8e8e93] sm:text-[13px] lg:text-[14px]">{t.home.todayBody}</p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-[#8e8e93] transition group-hover:translate-x-0.5 group-hover:text-[#078930]" />
            </CardContent>
          </Card>
        </Link>

        {/* More tools */}
        <section className="mb-10 sm:mb-12">
          <h2 className="mb-4 text-[20px] font-bold tracking-tight text-[#1c1c1e] dark:text-white sm:text-2xl">
            {t.home.moreTools}
          </h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-5">
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

        {/* Events */}
        {featuredEvents.length > 0 && (
          <section className="mb-10 sm:mb-12">
            <div className="mb-4 flex items-end justify-between gap-2">
              <h2 className="text-[20px] font-bold tracking-tight text-[#1c1c1e] dark:text-white sm:text-2xl">
                {t.home.happening}
              </h2>
              <Link
                to="/events"
                className="text-[14px] font-semibold text-[#078930] hover:underline dark:text-[#30d158] sm:text-[15px]"
              >
                {t.home.allEvents}
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {featuredEvents.map((e) => (
                <Link key={e.id} to="/events" className="block">
                  <Card className="h-full border-0 shadow-sm ring-1 ring-black/[0.04] transition hover:shadow-md dark:ring-white/10">
                    <CardContent className="p-4">
                      <p className="text-[12px] font-semibold text-[#0b6e99]">{e.dateLabel}</p>
                      <p className="mt-1 text-[15px] font-semibold text-[#1c1c1e] dark:text-white">{e.title}</p>
                      <p className="mt-1 line-clamp-2 text-[13px] text-[#8e8e93]">{e.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured places */}
        <section className="mb-10 sm:mb-12">
          <h2 className="mb-5 text-[20px] font-bold tracking-tight text-[#1c1c1e] dark:text-white sm:mb-6 sm:text-2xl">
            {t.home.featured}
          </h2>
          <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
            <Link to="/map" className="group block overflow-hidden rounded-[1.25rem] bg-white shadow-sm ring-1 ring-black/[0.04] dark:bg-[#1c1c1e] dark:ring-white/10">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={BD.lake} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
              </div>
              <div className="p-4">
                <h3 className="text-[16px] font-semibold">{t.home.lakeTana}</h3>
                <p className="mt-1 text-[13px] text-[#8e8e93]">{t.home.lakeTanaDesc}</p>
              </div>
            </Link>
            <Link to="/map" className="group block overflow-hidden rounded-[1.25rem] bg-white shadow-sm ring-1 ring-black/[0.04] dark:bg-[#1c1c1e] dark:ring-white/10">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={BD.falls} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
              </div>
              <div className="p-4">
                <h3 className="text-[16px] font-semibold">{t.home.blueNileFalls}</h3>
                <p className="mt-1 text-[13px] text-[#8e8e93]">{t.home.blueNileFallsDesc}</p>
              </div>
            </Link>
            <Link to="/todo" className="group block overflow-hidden rounded-[1.25rem] bg-white shadow-sm ring-1 ring-black/[0.04] dark:bg-[#1c1c1e] dark:ring-white/10">
              <div className="aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#078930] to-[#0b6e99]">
                <div className="flex h-full items-center justify-center">
                  <ListTodo className="h-12 w-12 text-white/90" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-[16px] font-semibold">{t.home.checklist}</h3>
                <p className="mt-1 text-[13px] text-[#8e8e93]">
                  {done} / {CITY_TODOS.length} {t.home.checklistDone}
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-[1.5rem] bg-gradient-to-br from-[#0b6e99]/15 to-[#078930]/20 p-6 sm:p-8 dark:from-[#0b6e99]/25 dark:to-[#078930]/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[20px] font-bold tracking-tight text-[#1c1c1e] dark:text-white sm:text-2xl">
                {t.home.ctaTitle}
              </h2>
              <p className="mt-1 max-w-xl text-[14px] text-[#8e8e93]">{t.home.ctaBody}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link to="/explore">
                <Button className="h-11 w-full rounded-full bg-[#078930] px-6 hover:bg-[#056b24] sm:w-auto">
                  {t.home.openExplore}
                </Button>
              </Link>
              <Link to="/map">
                <Button variant="outline" className="h-11 w-full rounded-full sm:w-auto">
                  {t.home.openMap}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
