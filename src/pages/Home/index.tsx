import { Link } from 'react-router-dom'
import {
  MapPin,
  Hotel,
  UtensilsCrossed,
  Landmark,
  Compass,
  Star,
  ChevronRight,
  Sparkles,
  Camera,
  Waves,
} from 'lucide-react'
import { useT } from '@/hooks/useT'
import { CURATED_HOTELS } from '@/services/curatedHotels'
import { placeCoverImage } from '@/utils/placeImage'
import { formatEtbRange } from '@/utils/placePro'
import { HERO_BLUE_NILE_DATA_URL } from '@/data/heroBlueNile'

const STATS = [
  { key: 'hotels', icon: Hotel, value: '40+' },
  { key: 'attractions', icon: Landmark, value: '25+' },
  { key: 'restaurants', icon: UtensilsCrossed, value: '60+' },
  { key: 'islands', icon: Waves, value: '7' },
] as const

export default function Home() {
  const t = useT()
  const featured = CURATED_HOTELS.slice(0, 8)

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50/40">
      {/* Hero — Blue Nile Falls photo */}
      <section className="relative isolate overflow-hidden min-h-[420px] sm:min-h-[480px] md:min-h-[520px]">
        <img
          src={HERO_BLUE_NILE_DATA_URL}
          alt="Blue Nile Falls near Bahir Dar, Ethiopia"
          className="absolute inset-0 h-full w-full object-cover object-center"
          fetchPriority="high"
        />
        {/* Readable overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/55 to-slate-900/25"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-900/30"
          aria-hidden
        />

        <div className="relative mx-auto flex min-h-[420px] sm:min-h-[480px] md:min-h-[520px] max-w-6xl flex-col justify-end px-4 pb-10 pt-16 sm:pb-14 sm:pt-20">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/25 backdrop-blur-sm mb-4">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            {t.home?.proBadge || 'Bahir Dar · Lake Tana · Blue Nile'}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white max-w-2xl leading-tight drop-shadow-sm">
            {t.home?.heroTitle || 'Discover Bahir Dar'}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-white/90 max-w-xl">
            {t.home?.heroSubtitle ||
              'Hotels, islands, waterfalls, and lakeside culture — plan your trip with maps and local guides.'}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/map"
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-900/30 hover:bg-sky-400 transition"
            >
              <MapPin className="h-4 w-4" />
              {t.home?.quickMap || 'Open Map'}
            </Link>
            <Link
              to="/trip-planner"
              className="inline-flex items-center gap-2 rounded-xl bg-white/95 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-lg hover:bg-white transition"
            >
              <Compass className="h-4 w-4 text-emerald-600" />
              {t.home?.planTrip || 'Plan a Trip'}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-slate-100 bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STATS.map(({ key, icon: Icon, value }) => (
            <div key={key} className="flex items-center gap-3 rounded-xl px-3 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900 leading-none">{value}</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {t.home?.stats?.[key] || key}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured hotels */}
      <section className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t.home?.featuredHotels || 'Featured hotels'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {t.home?.featuredHotelsSub || 'Lakeside stays and city favorites'}
            </p>
          </div>
          <Link
            to="/hotels"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-sky-700 hover:text-sky-900"
          >
            {t.common?.seeAll || 'See all'}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1 snap-x snap-mandatory scrollbar-thin">
          {featured.map((h) => {
            const cover = placeCoverImage(h)
            const minP = h.hotel?.minimum_price
            const maxP = h.hotel?.maximum_price
            const price =
              minP != null || maxP != null ? formatEtbRange(minP ?? null, maxP ?? null) : null
            return (
              <Link
                key={h.slug || h.name}
                to={`/places/${h.slug || encodeURIComponent(h.name)}`}
                className="snap-start shrink-0 w-[240px] sm:w-[260px] group rounded-2xl bg-white ring-1 ring-slate-200/80 shadow-sm overflow-hidden hover:shadow-md hover:ring-sky-300/60 transition"
              >
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img
                    src={cover}
                    alt={h.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {h.rating != null && (
                    <div className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-xs font-semibold text-slate-800 shadow">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {Number(h.rating).toFixed(1)}
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-sky-800">
                    {h.name}
                  </h3>
                  {h.address && (
                    <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{h.address}</span>
                    </p>
                  )}
                  {price && (
                    <p className="mt-2 text-xs font-medium text-emerald-700">
                      {t.common?.from || 'From'} {price}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-4 sm:hidden">
          <Link
            to="/hotels"
            className="inline-flex items-center gap-1 text-sm font-medium text-sky-700"
          >
            {t.common?.seeAll || 'See all hotels'}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Quick links grid */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-5">
          {t.home?.explore || 'Explore'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: '/hotels', icon: Hotel, label: t.nav?.hotels || 'Hotels', color: 'bg-sky-50 text-sky-700' },
            { to: '/attractions', icon: Landmark, label: t.nav?.attractions || 'Attractions', color: 'bg-amber-50 text-amber-700' },
            { to: '/restaurants', icon: UtensilsCrossed, label: t.nav?.restaurants || 'Food', color: 'bg-rose-50 text-rose-700' },
            { to: '/map', icon: MapPin, label: t.nav?.map || 'Map', color: 'bg-emerald-50 text-emerald-700' },
            { to: '/trip-planner', icon: Compass, label: t.nav?.planner || t.nav?.tripPlanner || 'Trip Planner', color: 'bg-cyan-50 text-cyan-700' },
            { to: '/ai-guide', icon: Sparkles, label: t.nav?.aiGuide || 'AI Guide', color: 'bg-fuchsia-50 text-fuchsia-700' },
            { to: '/photos', icon: Camera, label: t.nav?.photos || 'Photos', color: 'bg-orange-50 text-orange-700' },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex flex-col items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200/80 shadow-sm hover:shadow-md hover:ring-sky-200 transition"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold text-slate-800">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-slate-100 bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h2 className="text-lg font-semibold">
              {t.home?.gmapsCta || 'Explore on Google Maps'}
            </h2>
            <p className="mt-1 text-sm text-slate-300 max-w-md">
              {t.home?.gmapsCtaSub ||
                'Open Bahir Dar hotels, attractions, and lakeside spots with real reviews and photos.'}
            </p>
          </div>
          <a
            href="https://www.google.com/maps/search/Bahir+Dar+Ethiopia+hotels"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition shrink-0"
          >
            <MapPin className="h-4 w-4 text-sky-600" />
            Google Maps
          </a>
        </div>
      </section>
    </div>
  )
}
