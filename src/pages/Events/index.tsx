import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Calendar, MapPin, Ticket, Sparkles, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { useT } from '@/hooks/useT'
import { Button } from '@/components/ui/button'
import { eventCategoryLabel, type CityEvent } from '@/data/cityLife'
import { fetchCityEvents } from '@/services/events'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'

const filters: Array<CityEvent['category'] | 'all'> = [
  'all',
  'culture',
  'music',
  'market',
  'seasonal',
  'sports',
  'community',
]

function pickAm(en: string, am: string | undefined, isAm: boolean) {
  return isAm && am ? am : en
}

export default function EventsPage() {
  const t = useT()
  const language = useAppStore((s) => s.language)
  const isAm = language === 'am'
  const [filter, setFilter] = useState<(typeof filters)[number]>('all')
  const { data: allEvents = [], isLoading } = useQuery({
    queryKey: ['city-events'],
    queryFn: fetchCityEvents,
    staleTime: 60_000,
  })

  const events = useMemo(() => {
    if (filter === 'all') return allEvents
    return allEvents.filter((e) => e.category === filter)
  }, [filter, allEvents])

  const featured = allEvents.filter((e) => e.featured)
  const lang = isAm ? 'am' : 'en'

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl">{t.events.title}</h1>
          <p className="max-w-2xl text-slate-500">{t.events.subtitle}</p>
        </div>
        <Link to="/ai-guide">
          <Button variant="outline" size="sm">
            <Sparkles className="h-4 w-4" /> {t.events.askAi}
          </Button>
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
        </div>
      )}

      {!isLoading && featured.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            {t.events.featured}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {featured.map((e) => (
              <Card
                key={e.id}
                className="overflow-hidden border-sky-100 bg-gradient-to-br from-sky-50 to-white dark:from-slate-900 dark:to-slate-950"
              >
                <CardContent className="p-5">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-sky-600 px-2.5 py-0.5 text-xs font-medium text-white">
                      {eventCategoryLabel(e.category, lang)}
                    </span>
                    {e.featured && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                        {t.events.featured}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {pickAm(e.title, e.titleAm, isAm)}
                  </h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    {pickAm(e.dateLabel, e.dateLabelAm, isAm)}
                    {e.timeLabel ? ` · ${e.timeLabel}` : ''}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {pickAm(e.venue, e.venueAm, isAm)}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {pickAm(e.description, e.descriptionAm, isAm)}
                  </p>
                  <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-teal-700 dark:text-teal-400">
                    <Ticket className="h-3.5 w-3.5 shrink-0" />
                    {pickAm(e.priceLabel, e.priceLabelAm, isAm)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-sm font-medium transition',
              filter === f
                ? 'border-sky-600 bg-sky-600 text-white'
                : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
            )}
          >
            {f === 'all' ? t.events.all : eventCategoryLabel(f, lang)}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((e) => (
          <Card key={e.id}>
            <CardContent className="p-4">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {eventCategoryLabel(e.category, lang)}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {pickAm(e.title, e.titleAm, isAm)}
              </h3>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                {pickAm(e.dateLabel, e.dateLabelAm, isAm)}
                {e.timeLabel ? ` · ${e.timeLabel}` : ''}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {pickAm(e.venue, e.venueAm, isAm)}
              </p>
              <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">
                {pickAm(e.description, e.descriptionAm, isAm)}
              </p>
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-teal-700 dark:text-teal-400">
                <Ticket className="h-3.5 w-3.5 shrink-0" />
                {pickAm(e.priceLabel, e.priceLabelAm, isAm)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {!isLoading && events.length === 0 && (
        <p className="py-12 text-center text-sm text-slate-500">{t.events.emptyFilter}</p>
      )}

      <p className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100">
        {t.events.disclaimer}{' '}
        <Link to="/business" className="font-medium underline">
          {t.events.businessPortal}
        </Link>
        .
      </p>
    </div>
  )
}
