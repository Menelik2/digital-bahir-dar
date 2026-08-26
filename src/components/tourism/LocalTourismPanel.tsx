import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Landmark, Clock, Wallet, MapPin, ChevronRight, Info } from 'lucide-react'
import {
  LOCAL_TOURISM_SITES,
  TOURISM_CATEGORIES,
  TOURISM_QUICK_FACTS,
  TOURISM_TIPS_AM,
  TOURISM_TIPS_EN,
  type TourismCategory,
} from '@/data/localTourism'
import { cn } from '@/lib/utils'

export function LocalTourismPanel({ amharic = false }: { amharic?: boolean }) {
  const [cat, setCat] = useState<TourismCategory | 'all'>('all')

  const sites = useMemo(() => {
    if (cat === 'all') return LOCAL_TOURISM_SITES
    return LOCAL_TOURISM_SITES.filter((s) => s.category === cat)
  }, [cat])

  const tips = amharic ? TOURISM_TIPS_AM : TOURISM_TIPS_EN

  return (
    <div className="space-y-5">
      {/* Quick facts */}
      <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-sky-50 p-4 dark:border-emerald-900 dark:from-emerald-950/40 dark:to-sky-950/30">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
          {amharic ? 'የአካባቢ ቱሪዝም' : 'Local tourism'}
        </p>
        <h2 className="mt-0.5 text-lg font-bold text-slate-900 dark:text-white">
          {amharic ? 'ባሕር ዳር መመሪያ' : 'Bahir Dar visitor guide'}
        </h2>
        <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
          <li>· {TOURISM_QUICK_FACTS.lake}</li>
          <li>· {amharic ? 'ደረቅ ወቅት' : 'Dry season'}: {TOURISM_QUICK_FACTS.bestSeasonDry}</li>
          <li>· {amharic ? 'ፏፏቴ' : 'Falls peak'}: {TOURISM_QUICK_FACTS.bestSeasonFalls}</li>
          <li>· {TOURISM_QUICK_FACTS.airport}</li>
        </ul>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setCat('all')}
          className={cn(
            'shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium',
            cat === 'all'
              ? 'border-emerald-600 bg-emerald-600 text-white'
              : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
          )}
        >
          {amharic ? 'ሁሉም' : 'All'}
        </button>
        {TOURISM_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCat(c.id)}
            className={cn(
              'shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium',
              cat === c.id
                ? 'border-emerald-600 bg-emerald-600 text-white'
                : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
            )}
          >
            {amharic ? c.labelAm : c.label}
          </button>
        ))}
      </div>

      {/* Sites */}
      <div className="space-y-3">
        {sites.map((s) => {
          const title = amharic && s.nameAm ? `${s.nameAm} · ${s.name}` : s.name
          const body = amharic && s.descriptionAm ? s.descriptionAm : s.description
          const short = amharic && s.shortAm ? s.shortAm : s.short
          const href = s.href ?? `/map?to=${s.lat},${s.lng}&name=${encodeURIComponent(s.name)}`
          return (
            <Link
              key={s.id}
              to={href}
              className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition active:scale-[0.99] dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                  <Landmark className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
                  <p className="text-xs text-slate-500">{short}</p>
                  <p className="mt-1.5 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{body}</p>
                  <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {s.duration}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Wallet className="h-3 w-3" /> {s.costHint}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {s.bestTime}
                    </span>
                  </div>
                </div>
                <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-slate-300" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Practical tips */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
        <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
          <Info className="h-4 w-4 text-sky-600" />
          {amharic ? 'ተግባራዊ ምክሮች' : 'Practical tips'}
        </p>
        <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
          {tips.map((tip) => (
            <li key={tip}>· {tip}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
