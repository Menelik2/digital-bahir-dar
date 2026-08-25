import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, MapPin, X, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { serverSearchPlaces } from '@/services/search'
import { cacheOsmPlaceForDetail, isOsmPlaceId } from '@/services/osmPlaces'
import { useT } from '@/hooks/useT'
import { cn } from '@/lib/utils'
import type { Place } from '@/types/place'

const QUICK = [
  { to: '/explore', labelKey: 'explore' as const },
  { to: '/discover', label: 'Discover (live map)' },
  { to: '/hotels', labelKey: 'hotels' as const },
  { to: '/restaurants', labelKey: 'restaurants' as const },
  { to: '/attractions', labelKey: 'attractions' as const },
  { to: '/transport', labelKey: 'transport' as const },
  { to: '/map', labelKey: 'map' as const },
  { to: '/ai-guide', labelKey: 'aiGuide' as const },
]

export function GlobalSearch({ className }: { className?: string }) {
  const t = useT()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const tmr = window.setTimeout(() => setDebouncedQ(q.trim()), 220)
    return () => window.clearTimeout(tmr)
  }, [q])

  const { data: results = [], isFetching } = useQuery({
    queryKey: ['server-search', debouncedQ],
    queryFn: () => serverSearchPlaces(debouncedQ, 10),
    enabled: open && debouncedQ.length >= 1,
    staleTime: 15_000,
  })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
        setTimeout(() => inputRef.current?.focus(), 0)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0)
  }, [open])

  const goExplore = () => {
    setOpen(false)
    navigate(`/explore?q=${encodeURIComponent(q.trim())}`)
  }

  const onPickPlace = (p: Place) => {
    if (isOsmPlaceId(p.id)) cacheOsmPlaceForDetail(p)
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-500 transition hover:border-sky-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800',
          className
        )}
        aria-label={t.search.globalPlaceholder}
      >
        <Search className="h-4 w-4" />
        <span className="hidden max-w-[140px] truncate md:inline">{t.search.globalPlaceholder}</span>
        <kbd className="ml-1 hidden rounded border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-400 dark:border-slate-600 lg:inline">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/40 p-4 pt-[12vh] backdrop-blur-sm dark:bg-black/60">
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-950"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center gap-2 border-b border-slate-200 px-3 py-2 dark:border-slate-800">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && q.trim()) goExplore()
                }}
                placeholder={t.search.globalPlaceholder}
                className="flex-1 bg-transparent py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
              />
              {isFetching && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
              <button
                type="button"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setOpen(false)}
                aria-label={t.common.close}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-2">
              {!q.trim() && (
                <div className="p-2">
                  <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {t.search.recent}
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {QUICK.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-sky-50 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        {'label' in item && item.label
                          ? item.label
                          : t.nav[item.labelKey!]}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {q.trim() && results.length === 0 && !isFetching && (
                <p className="px-3 py-6 text-center text-sm text-slate-500">{t.search.noResults}</p>
              )}

              {results.map((p) => (
                <Link
                  key={p.id}
                  to={`/places/${p.slug}`}
                  onClick={() => onPickPlace(p)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                      {p.name.replace(' (DEMO)', '')}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {p.category?.name}
                      {p.verified ? ' · verified' : ''}
                      {p.featured ? ' · featured' : ''}
                      {isOsmPlaceId(p.id) ? ' · OSM' : ''}
                    </p>
                  </div>
                </Link>
              ))}

              {q.trim() && (
                <button
                  type="button"
                  onClick={goExplore}
                  className="mt-1 w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-sky-600 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950/40"
                >
                  {t.search.viewAll} →
                </button>
              )}
            </div>
          </div>
          <button
            type="button"
            className="absolute inset-0 -z-10 cursor-default"
            aria-label={t.common.close}
            onClick={() => setOpen(false)}
          />
        </div>
      )}
    </>
  )
}
