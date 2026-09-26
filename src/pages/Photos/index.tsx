import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Camera, ExternalLink, MapPin } from 'lucide-react'
import { useT } from '@/hooks/useT'
import { EXPLORE_HERO_IMAGES, BAHIR_DAR_CITY_COVER } from '@/utils/placeImage'
import { CURATED_HOTELS } from '@/services/curatedHotels'
import { placeCoverImage } from '@/utils/placeImage'
import { cn } from '@/lib/utils'

const LANDMARKS = [
  { title: 'Lake Tana', titleAm: 'ጣና ሐይቅ', blurb: 'Largest lake in Ethiopia', to: '/places/lake-tana' },
  { title: 'Blue Nile Falls', titleAm: 'ጢስ አባይ', blurb: 'Tis Issat waterfall', to: '/places/blue-nile-falls-tis-issat' },
  { title: 'Bezawit viewpoint', titleAm: 'በዛዊት', blurb: 'Hilltop city & Nile views', to: '/places/bezawit-palace-viewpoint' },
  { title: 'Lakeside dining', titleAm: 'የባህር ዳር ምግብ', blurb: 'Shore restaurants', to: '/restaurants' },
  { title: 'Boat pier', titleAm: 'ጀልባ ማረፊያ', blurb: 'Lake Tana boats', to: '/places/lake-tana-boat-pier' },
  { title: 'City streets', titleAm: 'ከተማ', blurb: 'Bahir Dar center', to: '/places/bahir-dar-center' },
] as const

export default function PhotosPage() {
  const t = useT()
  const [active, setActive] = useState<string | null>(null)

  const hotelCovers = useMemo(
    () =>
      CURATED_HOTELS.slice(0, 12).map((h) => ({
        name: h.name,
        src: placeCoverImage(h),
        to: `/places/${h.slug || encodeURIComponent(h.name)}`,
      })),
    [],
  )

  const heroStrip = EXPLORE_HERO_IMAGES.length ? EXPLORE_HERO_IMAGES : [BAHIR_DAR_CITY_COVER]

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-black dark:to-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800 dark:bg-orange-950 dark:text-orange-200">
              <Camera className="h-3.5 w-3.5" />
              {t.nav?.photos || 'Photos'}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {t.nav?.photos || 'Bahir Dar photos'}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-400">
              Real scenes from Lake Tana, the Blue Nile, and the city — hotels, landmarks, and lakeside life.
            </p>
          </div>
          <Link
            to="/map"
            className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-700"
          >
            <MapPin className="h-4 w-4" />
            {t.nav?.map || 'Open map'}
          </Link>
        </div>

        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Highlights</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {heroStrip.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => setActive(src)}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-200 ring-1 ring-black/5 dark:bg-slate-800"
              >
                <img
                  src={src}
                  alt={`Bahir Dar highlight ${i + 1}`}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Landmarks</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LANDMARKS.map((item, i) => {
              const src = heroStrip[i % heroStrip.length]
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group flex overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80 transition hover:shadow-md dark:bg-slate-900 dark:ring-white/10"
                >
                  <div className="relative h-28 w-28 shrink-0 sm:h-32 sm:w-32">
                    <img
                      src={src}
                      alt={item.title}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center p-3 sm:p-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="text-xs text-slate-500">{item.titleAm}</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.blurb}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Hotels</h2>
            <Link to="/hotels" className="text-sm font-medium text-sky-700 hover:underline dark:text-sky-400">
              {t.common?.seeAll || 'See all'}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {hotelCovers.map((h) => (
              <Link
                key={h.to}
                to={h.to}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80 transition hover:shadow-md dark:bg-slate-900 dark:ring-white/10"
              >
                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={h.src}
                    alt={h.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="truncate p-2.5 text-sm font-semibold text-slate-800 dark:text-slate-100">{h.name}</p>
              </Link>
            ))}
          </div>
        </section>

        <p className="flex flex-wrap items-center gap-2 text-center text-xs text-slate-500 sm:text-left">
          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          Photos from Wikimedia Commons (Bahir Dar / Lake Tana). Hotel cards use curated covers; open a place for Google Maps galleries.
        </p>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
        >
          <img
            src={active}
            alt="Bahir Dar"
            className={cn('max-h-[90vh] max-w-full rounded-lg object-contain shadow-2xl')}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/25"
            onClick={() => setActive(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}
