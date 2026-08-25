import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Calendar, MapPin, Ticket, Sparkles, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { useT } from '@/hooks/useT'
import { Button } from '@/components/ui/button'
import { EVENT_CATEGORY_LABEL, type CityEvent } from '@/data/cityLife'
import { fetchCityEvents } from '@/services/events'
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

export default function EventsPage() {
  const t = useT()
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
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Featured</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {featured.map((e) => (
              <Card key={e.id} className="overflow-hidden border-sky-100 bg-gradient-to-br from-sky-50 to-white dark:from-slate-900 dark:to-slate-950">
                <CardContent className="p-5">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-sky-600 px-2.5 py-0.5 text-xs font-medium text-white">
                      {EVENT_CATEGORY_LABEL[e.category]}
                    </span>
                    <span className="text-xs text-slate-500">{e.dateLabel}</span>
                  </div>
                  <h3 className="text-lg font-semibold">{e.title}</h3>
                  {e.titleAm && <p className="text-sm text-slate-500">{e.titleAm}</p>}
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{e.description}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {e.venue}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Ticket className="h-3.5 w-3.5" /> {e.priceLabel}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              'shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium capitalize',
              filter === f
                ? 'border-sky-500 bg-sky-500 text-white'
                : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
            )}
          >
            {f === 'all' ? t.events.all : EVENT_CATEGORY_LABEL[f]}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((e) => (
          <Card key={e.id} className="transition hover:shadow-md">
            <CardContent className="flex h-full flex-col p-5">
              <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="h-3.5 w-3.5" />
                <span>{e.dateLabel}</span>
                {e.timeLabel && <span>· {e.timeLabel}</span>}
              </div>
              <h3 className="font-semibold">{e.title}</h3>
              <p className="mt-1 line-clamp-3 flex-1 text-sm text-slate-600 dark:text-slate-400">{e.description}</p>
              <div className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800">
                <p className="flex items-start gap-1">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {e.venue}
                </p>
                <p className="mt-1 flex items-start gap-1">
                  <Ticket className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {e.priceLabel}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!isLoading && events.length === 0 && (
        <p className="py-12 text-center text-sm text-slate-500">No events match this filter.</p>
      )}

      <p className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100">
        Schedules change. Prefer hotel or official tourism desks for same-day confirmation. Business owners can claim listings in the{' '}
        <Link to="/business" className="font-medium underline">
          Business portal
        </Link>
        .
      </p>
    </div>
  )
}
