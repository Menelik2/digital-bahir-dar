import { Link } from 'react-router-dom'
import {
  MapPin,
  Hotel,
  UtensilsCrossed,
  Car,
  Building2,
  CreditCard,
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
import { CITY_EVENTS } from '@/data/cityLife'
import { CITY_TODOS } from '@/data/thingsToDo'
import { useTodoStore } from '@/store/todoStore'
import { useT } from '@/hooks/useT'
import { cn } from '@/lib/utils'
import { HERO_BLUE_NILE_DATA_URL } from '@/data/heroBlueNile'

const LAKE_TANA_IMG = '/images/lake-tana.jpg'
const FALLS_IMG = '/images/blue-nile-falls.jpg'
const CITY_IMG = '/images/bahir-dar.jpg'
const LAKE_TANA_FALLBACK =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/ET_Amhara_asv2018-02_img112_Lake_Tana_at_Bahir_Dar.jpg/800px-ET_Amhara_asv2018-02_img112_Lake_Tana_at_Bahir_Dar.jpg'
const FALLS_FALLBACK =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Blue_Nile_Falls-03%2C_by_CT_Snow.jpg/1280px-Blue_Nile_Falls-03%2C_by_CT_Snow.jpg'
const CITY_FALLBACK =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/The_city_of_Bahir_Dar%2C_Ethiopia.jpg/800px-The_city_of_Bahir_Dar%2C_Ethiopia.jpg'

/** Path cards — photography + soft 3D depth (Unsplash / Wikimedia with fallbacks) */
const PATH_STAY_IMG =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80'
const PATH_EAT_IMG =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80'
const PATH_GO_IMG =
  'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1000&q=80'
const PATH_SEE_IMG =
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80'
const PATH_STAY_FB =
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80'
const PATH_EAT_FB =
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=80'
const PATH_GO_FB =
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80'
const PATH_SEE_FB =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Blue_Nile_Falls-03%2C_by_CT_Snow.jpg/960px-Blue_Nile_Falls-03%2C_by_CT_Snow.jpg'

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
  const completed = useTodoStore((s) => s.completed)
  const done = CITY_TODOS.filter((x) => completed[x.id]).length

  const desk = [
    {
      to: '/hotels',
      title: t.home.stay,
      body: t.home.stayBody,
      icon: Hotel,
      image: PATH_STAY_IMG,
      imageFb: PATH_STAY_FB,
      gradient: 'from-[#0a4d6e]/95 via-[#0b6e99]/55 to-transparent',
      accent: 'bg-[#0b6e99]',
      ring: 'ring-[#0b6e99]/30',
    },
    {
      to: '/restaurants',
      title: t.home.eat,
      body: t.home.eatBody,
      icon: UtensilsCrossed,
      image: PATH_EAT_IMG,
      imageFb: PATH_EAT_FB,
      gradient: 'from-[#4a2c1a]/95 via-[#6f4e37]/55 to-transparent',
      accent: 'bg-[#c4a574]',
      ring: 'ring-[#c4a574]/35',
    },
    {
      to: '/transport',
      title: t.home.go,
      body: t.home.goBody,
      icon: Car,
      image: PATH_GO_IMG,
      imageFb: PATH_GO_FB,
      gradient: 'from-[#034a18]/95 via-[#078930]/55 to-transparent',
      accent: 'bg-[#078930]',
      ring: 'ring-[#078930]/30',
    },
    {
      to: '/attractions',
      title: t.home.see,
      body: t.home.seeBody,
      icon: Sun,
      image: PATH_SEE_IMG,
      imageFb: PATH_SEE_FB,
      gradient: 'from-[#5c4508]/95 via-[#b8860b]/50 to-transparent',
      accent: 'bg-[#f5c518]',
      ring: 'ring-[#f5c518]/35',
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
      <section className="relative min-h-[320px] overflow-hidden text-white sm:min-h-[380px] lg:min-h-[440px]">
        <div className="absolute inset-0">
          <img
            src={HERO_BLUE_NILE_DATA_URL}
            alt="Blue Nile Falls (Tis Issat) near Bahir Dar — the roaring Blue Nile under dramatic light"
            className="h-full w-full scale-105 object-cover object-[center_40%] sm:object-center"
            fetchPriority="high"
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
          <div
            className="absolute inset-0 bg-gradient-to-br from-black/55 via-[#0a4d6e]/35 to-[#056b24]/30"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/15"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_0%,_rgba(0,0,0,0.25)_70%)]"
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
              <Link to="/trip-planner" className="w-full sm:w-auto">
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
                className="group relative overflow-hidden rounded-[1.25rem] p-4 shadow-lg ring-1 ring-white/25 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:ring-white/40 active:translate-y-0 active:scale-[0.98]"
              >
                <img
                  src={item.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const el = e.currentTarget
                    if (el.dataset.fb !== '1') {
                      el.dataset.fb = '1'
                      el.src = item.imageFb
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20" aria-hidden />
                <div className="relative z-10">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[0.85rem] bg-white/20 text-white shadow-inner backdrop-blur-md ring-1 ring-white/30 transition group-hover:scale-105">
                    <item.icon className="h-5 w-5" strokeWidth={2.25} />
                  </div>
                  <p className="text-[15px] font-semibold tracking-tight">{item.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-[12px] text-white/85">{item.body}</p>
                </div>
                <ArrowRight className="absolute bottom-4 right-4 z-10 h-4 w-4 opacity-0 transition group-hover:opacity-90" />
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

        {/* Mobile + tablet: photo + 3D depth tiles */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:hidden">
          {desk.map((item) => (
            <Link key={item.to} to={item.to} className="ios-press group block [perspective:900px]">
              <div
                className={cn(
                  'relative flex min-h-[140px] flex-col justify-end overflow-hidden rounded-[1.4rem] text-white sm:min-h-[160px]',
                  'shadow-[0_10px_28px_-8px_rgba(0,0,0,0.45),0_2px_6px_rgba(0,0,0,0.2)]',
                  'ring-1 ring-black/10 transition duration-300',
                  'group-hover:[transform:rotateX(2deg)_translateY(-2px)] group-active:scale-[0.97]',
                  item.ring
                )}
              >
                <img
                  src={item.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const el = e.currentTarget
                    if (el.dataset.fb !== '1') {
                      el.dataset.fb = '1'
                      el.src = item.imageFb
                    }
                  }}
                />
                <div className={cn('absolute inset-0 bg-gradient-to-t', item.gradient)} aria-hidden />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.22)_0%,_transparent_55%)]" aria-hidden />
                <div className="relative z-10 flex flex-col p-3.5 sm:p-4">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 shadow-[0_8px_16px_rgba(0,0,0,0.25)] backdrop-blur-md ring-1 ring-white/40">
                    <item.icon className="h-5 w-5 drop-shadow-sm" strokeWidth={2.25} />
                  </div>
                  <p className="text-[16px] font-bold leading-tight tracking-tight drop-shadow-sm sm:text-[17px]">{item.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-white/90 sm:text-[12px]">{item.body}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop: large photo cards with 3D hover */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-4 xl:gap-5">
          {desk.map((item) => (
            <Link key={item.to} to={item.to} className="ios-press group block [perspective:1200px]">
              <div
                className={cn(
                  'relative flex h-full min-h-[220px] flex-col overflow-hidden rounded-[1.6rem] text-white',
                  'shadow-[0_14px_40px_-12px_rgba(0,0,0,0.4),0_4px_12px_rgba(0,0,0,0.15)]',
                  'ring-1 ring-black/10 transition duration-300 ease-out',
                  'group-hover:-translate-y-1.5 group-hover:shadow-[0_22px_50px_-14px_rgba(0,0,0,0.5)]',
                  'group-hover:[transform:translateY(-6px)_rotateX(3deg)]',
                  item.ring
                )}
              >
                <img
                  src={item.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const el = e.currentTarget
                    if (el.dataset.fb !== '1') {
                      el.dataset.fb = '1'
                      el.src = item.imageFb
                    }
                  }}
                />
                <div className={cn('absolute inset-0 bg-gradient-to-t', item.gradient)} aria-hidden />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.18)_0%,_transparent_50%)]" aria-hidden />
                <div className="relative z-10 mt-auto flex flex-col p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[1.05rem] bg-white/20 shadow-[0_10px_24px_rgba(0,0,0,0.3)] backdrop-blur-md ring-1 ring-white/45">
                      <item.icon className="h-6 w-6 drop-shadow" strokeWidth={2.1} />
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/25 backdrop-blur-sm ring-1 ring-white/25">
                      <ChevronRight className="h-4 w-4 text-white/90 transition group-hover:translate-x-0.5" />
                    </div>
                  </div>
                  <p className="text-[22px] font-bold tracking-tight drop-shadow-sm">{item.title}</p>
                  <p className="mt-1 line-clamp-2 text-[14px] leading-relaxed text-white/90">{item.body}</p>
                  <div className={cn('mt-4 h-1 w-12 rounded-full opacity-95 transition-all duration-300 group-hover:w-20', item.accent)} />
                </div>
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
            <Link to="/places/blue-nile-falls-tis-issat" className="group block sm:col-span-2 lg:col-span-1">
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
                  <p className="mt-1 text-[13px] text-[#8e8e93]">
                    {done} / {CITY_TODOS.length} {t.home.checklistDone}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 pt-2 sm:px-6 sm:pb-16 xl:px-8">
        <div className="mx-auto max-w-7xl">
          <Card className="ios-card overflow-hidden border-black/[0.04] bg-gradient-to-br from-[#0b6e99]/10 via-white to-[#078930]/10 shadow-sm dark:border-white/[0.08] dark:from-[#0b6e99]/20 dark:via-[#1c1c1e] dark:to-[#078930]/15">
            <CardContent className="flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <h2 className="text-[20px] font-bold tracking-tight text-[#1c1c1e] dark:text-white sm:text-2xl">{t.home.ctaTitle}</h2>
                <p className="mt-1 max-w-xl text-[14px] text-[#8e8e93]">{t.home.ctaBody}</p>
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <Link to="/explore" className="w-full sm:w-auto">
                  <Button className="h-11 w-full rounded-full bg-[#078930] px-6 hover:bg-[#056b24] sm:w-auto">{t.home.openExplore}</Button>
                </Link>
                <Link to="/map" className="w-full sm:w-auto">
                  <Button variant="outline" className="h-11 w-full rounded-full sm:w-auto">{t.home.openMap}</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
