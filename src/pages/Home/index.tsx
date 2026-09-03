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
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CITY_EVENTS, PRACTICAL_TIPS } from '@/data/cityLife'
import { CITY_TODOS } from '@/data/thingsToDo'
import { useTodoStore } from '@/store/todoStore'
import { useT } from '@/hooks/useT'
import { cn } from '@/lib/utils'

const LAKE_TANA_IMG = '/images/lake-tana.jpg'
const FALLS_IMG = '/images/blue-nile-falls.jpg'
const CITY_IMG = '/images/bahir-dar.jpg'
const LAKE_TANA_FALLBACK =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/ET_Amhara_asv2018-02_img112_Lake_Tana_at_Bahir_Dar.jpg/800px-ET_Amhara_asv2018-02_img112_Lake_Tana_at_Bahir_Dar.jpg'
const FALLS_FALLBACK =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Blue_Nile_Falls-03%2C_by_CT_Snow.jpg/1280px-Blue_Nile_Falls-03%2C_by_CT_Snow.jpg'
const CITY_FALLBACK =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/The_city_of_Bahir_Dar%2C_Ethiopia.jpg/800px-The_city_of_Bahir_Dar%2C_Ethiopia.jpg'

const HERO_LOCAL = '/images/hero-bahir-dar.jpg'
const HERO_FALLS = FALLS_FALLBACK

function CoverImg({
  src,
  fallback,
  alt,
}: {
  src: string
  fallback: string
  alt: string
}) {
  return (
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
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
      tint: 'bg-[#0b6e99]/12 text-[#0a5a7e] dark:bg-[#0b6e99]/25 dark:text-[#7dd3fc]',
      tintHover: 'group-hover:bg-[#0b6e99]/18 dark:group-hover:bg-[#0b6e99]/35',
      accent: 'bg-[#0b6e99]',
    },
    {
      to: '/restaurants',
      title: t.home.eat,
      body: t.home.eatBody,
      icon: UtensilsCrossed,
      gradient: 'from-[#c4a574] to-[#6f4e37]',
      tint: 'bg-[#c4a574]/20 text-[#6f4e37] dark:bg-[#c4a574]/20 dark:text-[#e8d5b5]',
      tintHover: 'group-hover:bg-[#c4a574]/30 dark:group-hover:bg-[#c4a574]/30',
      accent: 'bg-[#c4a574]',
    },
    {
      to: '/transport',
      title: t.home.go,
      body: t.home.goBody,
      icon: Car,
      gradient: 'from-[#078930] to-[#056b24]',
      tint: 'bg-[#078930]/12 text-[#056b24] dark:bg-[#078930]/25 dark:text-[#86efac]',
      tintHover: 'group-hover:bg-[#078930]/18 dark:group-hover:bg-[#078930]/35',
      accent: 'bg-[#078930]',
    },
    {
      to: '/today',
      title: t.home.see,
      body: t.home.seeBody,
      icon: Sun,
      gradient: 'from-[#d4a017] to-[#b8860b]',
      tint: 'bg-[#f5c518]/20 text-[#8a6d0b] dark:bg-[#f5c518]/20 dark:text-[#fde68a]',
      tintHover: 'group-hover:bg-[#f5c518]/30 dark:group-hover:bg-[#f5c518]/30',
      accent: 'bg-[#f5c518]',
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
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0">
          <img
            src={HERO_FALLS}
            alt="Blue Nile Falls near Bahir Dar"
            className="h-full w-full object-cover"
            fetchPriority="high"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const el = e.currentTarget
              if (el.dataset.fb !== '1') {
                el.dataset.fb = '1'
                el.src = HERO_LOCAL
              }
            }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-br from-black/75 via-[#0a4d6e]/55 to-[#056b24]/50"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/30"
            aria-hidden
          />
        </div>

        <div className="ethio-flag-bar absolute inset-x-0 top-0 z-10" aria-hidden />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-12 lg:py-24 xl:px-8">
          <div className="text-center lg:text-left">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3.5 py-1.5 text-[12px] font-semibold backdrop-blur-md sm:text-sm">
              <MapPin className="h-3.5 w-3.5 text-[#f5c518] sm:h-4 sm:w-4" /> {t.home.badge}
            </div>
            <h1 className="mb-3 text-[32px] font-bold leading-[1.08] tracking-tight drop-shadow-sm sm:text-5xl lg:text-6xl xl:text-[3.5rem]">
              {t.home.title}
            </h1>
            <p className="mx-auto mb-2 max-w-xl text-[15px] font-medium text-[#f5c518] sm:text-xl lg:mx-0">
              {t.tagline}
            </p>
            <p className="mx-auto mb-7 max-w-md text-[13px] leading-relaxed text-white/85 sm:text-sm lg:mx-0 lg:max-w-lg lg:text-[15px]">
              {t.home.heroHint}
            </p>
            <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start">
              <Link to="/today" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="h-12 w-full rounded-full bg-[#f5c518] px-7 text-[#3d3200] shadow-lg shadow-black/25 transition active:scale-[0.98] hover:bg-[#e6b800] sm:w-auto"
                >
                  <Sun className="h-5 w-5" /> {t.home.todayTitle}
                </Button>
              </Link>
              <Link ento="/trip-planner" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-full rounded-full border-white/40 bg-white/15 px-7 text-white backdrop-blur-md transition active:scale-[0.98] hover:bg-white/25 sm:w-auto"
                >
                  <Sparkles className="h-5 w-5" /> {t.home.planMultiDay}
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden lg:grid lg:grid-cols-2 lg:gap-3">
            {desk.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group relative overflow-hidden rounded-[1.25rem] bg-white/12 p-4 shadow-lg ring-1 ring-white/25 backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:bg-white/20 hover:shadow-xl hover:ring-white/40 active:translate-y-0 active:scale-[0.98] active:bg-white/14"
              >
                <div
                  className={cn(
                    'mb-3 flex h-10 w-10 items-center justify-center rounded-[0.85rem] bg-gradient-to-br text-white shadow-inner transition group-hover:scale-105 group-active:scale-95',
                    item.gradient
                  )}
                >
                  <item.icon className="h-5 w-5" strokeWidth={2.25} />
                </div>
                <p className="text-[15px] font-semibold tracking-tight">{item.title}</p>
                <p className="mt-0.5 line-clamp-2 text-[12px] text-white/80">{item.body}</p>
                <ArrowRight className="absolute bottom-4 right-4 h-4 w-4 opacity-0 transition group-hover:opacity-90" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:py-14 xl:px-8">
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h2 className="text-[20px] font-bold tracking-tight text-[#1c1c1e] dark:text-white sm:text-2xl lg:text-[28px]">
            {t.home.whatNeed}
          </h2>
          <p className="mt-1 text-[13px] text-[#8e8e93] sm:text-sm lg:text-[15px]">{t.home.whatNeedSub}</p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:hidden">
          {desk.map((item) => (
            <Link key={item.to} to={item.to} className="group block">
              <div
                className={cn(
                  'ios-tile relative flex min-h-[88px] flex-col justify-end overflow-hidden rounded-[1.15rem] bg-gradient-to-br px-3 py-3 text-white shadow-sm',
                  'sm:min-h-[110px] sm:px-4 sm:py-4',
                  item.gradient
                )}
              >
                <item.icon className="mb-1.5 h-5 w-5 opacity-95 sm:h-6 sm:w-6" strokeWidth={2.25} />
                <p className="text-[14px] font-bold leading-tight tracking-tight sm:text-[15px]">{item.title}</p>
                <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-white/85">{item.body}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-4 xl:gap-5">
          {desk.map((item) => (
            <Link key={item.to} to={item.to} className="group block">
              <div
                className={cn(
                  'ios-card relative flex h-full min-h-[168px] flex-col rounded-[1.35rem] border border-black/[0.04]',
                  'bg-white/90 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)]',
                  'backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#1c1c1e]/90'
                )}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className={cn('flex h-12 w-12 items-center justify-center rounded-[0.95rem] transition group-hover:scale-110', item.tint, item.tintHover)}>
                    <item.icon className="h-6 w-6" strokeWidth={2.1} />
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#c7c7cc] transition group-hover:translate-x-1" />
                </div>
                <p className="text-[18px] font-semibold tracking-tight text-[#1c1c1e] dark:text-white">{item.title}</p>
                <p className="mt-1.5 line-clamp-2 flex-1 text-[13px] leading-relaxed text-[#8e8e93]">{item.body}</p>
                <div className={cn('mt-4 h-1 w-10 rounded-full opacity-80 transition group-hover:w-14', item.accent)} />
              </div>
            </Link>
          ))}
        </div>

        <Link to="/today" className="mt-3 block sm:mt-4 lg:mt-5">
          <div className="ios-card flex items-center gap-3 rounded-[1.15rem] border border-black/[0.04] bg-white px-3.5 py-3 shadow-sm dark:border-white/[0.08] dark:bg-[#1c1c1e] sm:gap-4 sm:rounded-[1.25rem] sm:px-5 sm:py-4 lg:rounded-[1.35rem] lg:px-6 lg:py-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f5c518] text-[#3d3200] sm:h-12 sm:w-12 lg:h-14 lg:w-14">
              <Sun className="h-5 w-5 lg:h-6 lg:w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold tracking-tight text-[#1c1c1e] dark:text-white lg:text-[17px]">{t.home.todayTitle}</p>
              <p className="truncate text-[12px] text-[#8e8e93] sm:text-[13px] lg:text-[14px]">{t.home.todayBody}</p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-[#c7c7cc]" />
          </div>
        </Link>
      </section>

      <section className="border-y border-black/[0.03] bg-white/60 px-4 py-6 dark:border-white/[0.06] dark:bg-[#0c0c0e]/80 sm:px-6 sm:py-10 xl:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-4 text-[20px] font-bold tracking-tight text-[#1c1c1e] dark:text-white sm:mb-6 sm:text-2xl">{t.home.moreTools}</h2>
          <div className="grid grid-cols-4 gap-x-2 gap-y-5 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-7">
            {moreTools.map((a) => (
              <Link key={a.path + a.label} to={a.path} className="ios-press group">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className={cn('flex h-12 w-12 items-center justify-center rounded-[1.15rem] shadow-sm transition group-hover:scale-110 lg:h-14 lg:w-14 lg:rounded-2xl', a.color)}>
                    <a.icon className="h-5 w-5 lg:h-[22px] lg:w-[22px]" strokeWidth={2} />
                  </div>
                  <span className="line-clamp-2 max-w-[5rem] text-[11px] font-medium leading-tight text-[#3c3c43] dark:text-white/80 sm:max-w-none sm:text-[12px]">{a.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 sm:py-12 xl:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-[20px] font-bold tracking-tight text-[#1c1c1e] dark:text-white sm:text-2xl">{t.home.happening}</h2>
            <Link to="/events" className="text-[14px] font-semibold text-[#078930] hover:underline dark:text-[#30d158] sm:text-[15px]">{t.home.allEvents}</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {upcoming.map((e) => (
              <Link key={e.id} to="/events" className="group block">
                <Card className="ios-card h-full border-black/[0.04] shadow-sm dark:border-white/[0.08]">
                  <CardContent className="p-4 sm:p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#0b6e99]">{e.dateLabel}</p>
                    <h3 className="mt-1.5 text-[16px] font-semibold leading-snug group-hover:text-[#056b24] dark:group-hover:text-[#30d158]">{e.title}</h3>
                    <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-[#8e8e93]">{e.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 sm:py-10 xl:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-5 text-[20px] font-bold tracking-tight text-[#1c1c1e] dark:text-white sm:mb-6 sm:text-2xl">{t.home.featured}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            <Link to="/places/lake-tana" className="group block">
              <Card className="ios-card overflow-hidden border-black/[0.04] shadow-sm dark:border-white/[0.08]">
                <div className="relative h-40 overflow-hidden bg-[#0b6e99]/30 sm:h-48 lg:h-56">
                  <CoverImg src={LAKE_TANA_IMG} fallback={LAKE_TANA_FALLBACK} alt="Lake Tana" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                </div>
                <CardContent className="p-4 sm:p-5">
                  <h3 className="text-[16px] font-semibold">{t.home.lakeTana}</h3>
                  <p className="mt-1 text-[13px] text-[#8e8e93]">{t.home.lakeTanaDesc}</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/places/blue-nile-falls-tis-issat" className="group block">
              <Card className="ios-card overflow-hidden border-black/[0.04] shadow-sm dark:border-white/[0.08]">
                <div className="relative h-40 overflow-hidden bg-[#078930]/20 sm:h-48 lg:h-56">
                  <CoverImg src={FALLS_IMG} fallback={FALLS_FALLBACK} alt="Blue Nile Falls" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                </div>
                <CardContent className="p-4 sm:p-5">
                  <h3 className="text-[16px] font-semibold">{t.home.blueNileFalls}</h3>
                  <p className="mt-1 text-[13px] text-[#8e8e93]">{t.home.blueNileFallsDesc}</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/todo" className="group block sm:col-span-2 lg:col-span-1">
              <Card className="ios-card overflow-hidden border-black/[0.04] shadow-sm dark:border-white/[0.08]">
                <div className="relative h-40 overflow-hidden bg-[#d4a017]/20 sm:h-48 lg:h-56">
                  <CoverImg src={CITY_IMG} fallback={CITY_FALLBACK} alt="Bahir Dar" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <CardContent className="p-4 sm:p-5">
                  <h3 className="text-[16px] font-semibold">{t.home.checklist}</h3>
                  <p className="mt-1 text-[13px] text-[#8e8e93]">{done} / {CITY_TODOS.length} {t.home.checklistDone}</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-black/[0.03] bg-white/50 px-4 py-8 dark:border-white/[0.06] dark:bg-[#0c0c0e]/60 sm:px-6 sm:py-12 xl:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-[20px] font-bold tracking-tight text-[#1c1c1e] dark:text-white sm:text-2xl">{t.home.travelSmart}</h2>
            <Link to="/directory" className="text-[14px] font-semibold text-[#078930] hover:underline dark:text-[#30d158] sm:text-[15px]">{t.home.fullDirectory}</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {tips.map((tip) => (
              <Card key={tip.id} className="border-black/[0.04] shadow-sm dark:border-white/[0.08]">
                <CardContent className="p-4 sm:p-5">
                  <h3 className="text-[15px] font-semibold sm:text-[16px]">{tip.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[#8e8e93] sm:text-[14px]">{tip.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link to="/transport"><Button variant="outline" size="sm" className="rounded-full"><Car className="h-4 w-4" /> {t.home.fares}</Button></Link>
            <Link to="/directory#emergency"><Button variant="outline intr inter" size="sm" className="rounded-full"><Hospital className="h-4 w-4" /> {t.home.emergency}</Button></Link>
            <Link to="/budget"><Button variant="outline" size="sm" className="rounded-full"><Wallet className="h-4 w-4" /> {t.home.budget}</Button></Link>
            <Link to="/map"><Button variant="outline" size="sm" className="rounded-full"><Navigation className="h-4 w-4" /> {t.home.map}</Button></Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-20">
        <h2 className="mb-3 text-[24px] font-bold tracking-tight text-[#1c1c1e] dark:text-white sm:text-3xl">{t.home.ctaTitle}</h2>
        <p className="mx-auto mb-8 max-w-lg text-[15px] text-[#8e8e93] sm:text-base">{t.home.ctaBody}</p>
        <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link to="/today"><Button size="lg" className="h-12 w-full rounded-full px-8 sm:w-auto"><Sun className="h-5 w-5" /> {t.home.startWithToday}</Button></Link>
          <Link to="/trip-planner"><Button size="lg" variant="outline" className="h-12 w-full rounded-full px-8 sm:w-auto"><Sparkles className="h-5 w-5" /> {t.home.multiDayPlanner}</Button></Link>
        </div>
      </section>
    </div>
  )
}
