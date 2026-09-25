import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Compass,
  Landmark,
  Loader2,
  MapPin,
  Play,
  Square,
  ExternalLink,
} from 'lucide-react'
import { Explore3DScene } from '@/components/explore3d/Scene'
import { usePlaces } from '@/hooks/usePlaces'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Place } from '@/types/place'

const TOUR_SLUGS_HINT = [
  'blue-nile-falls',
  'tis-isat',
  'lake-tana',
  'zege',
  'monastery',
  'palace',
  'market',
  'boardwalk',
]

export default function Explore3DPage() {
  const { data: attractions = [], isLoading: loadingAttr } = usePlaces('attraction')
  const { data: hotels = [], isLoading: loadingHotels } = usePlaces('hotel')
  const loading = loadingAttr || loadingHotels

  const places = useMemo(() => {
    const merged = [...attractions, ...hotels.slice(0, 12)]
    return merged
      .filter((p) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude))
      .sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || a.name.localeCompare(b.name))
  }, [attractions, hotels])

  const [selected, setSelected] = useState<Place | null>(null)
  const [flyTo, setFlyTo] = useState<Place | null>(null)
  const [tourIndex, setTourIndex] = useState<number | null>(null)
  const [panelOpen, setPanelOpen] = useState(true)

  const tourStops = useMemo(() => {
    const scored = places.map((p) => {
      const name = p.name.toLowerCase()
      const hit = TOUR_SLUGS_HINT.some((h) => name.includes(h) || (p.slug || '').includes(h))
      return { p, score: (p.featured ? 2 : 0) + (hit ? 3 : 0) + (p.category?.slug === 'attraction' ? 1 : 0) }
    })
    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((s) => s.p)
  }, [places])

  const onSelect = useCallback((place: Place) => {
    setSelected(place)
    setFlyTo(place)
    setPanelOpen(true)
    setTourIndex(null)
  }, [])

  const startTour = () => {
    if (tourStops.length === 0) return
    setTourIndex(0)
    setSelected(tourStops[0])
    setFlyTo(tourStops[0])
    setPanelOpen(true)
  }

  const nextTourStop = () => {
    if (tourIndex === null || tourStops.length === 0) return
    const next = (tourIndex + 1) % tourStops.length
    setTourIndex(next)
    setSelected(tourStops[next])
    setFlyTo(tourStops[next])
  }

  const stopTour = () => setTourIndex(null)

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-slate-900">
      <div className="absolute inset-0">
        {loading ? (
          <div className="flex h-full items-center justify-center bg-gradient-to-b from-sky-300 to-emerald-700">
            <Loader2 className="h-10 w-10 animate-spin text-white" />
          </div>
        ) : (
          <Explore3DScene
            places={places}
            selectedId={selected?.id ?? null}
            onSelect={onSelect}
            flyTo={flyTo}
          />
        )}
      </div>

      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-2 p-3 sm:p-4">
        <div className="pointer-events-auto flex items-center gap-2">
          <Link
            to="/map"
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white/90 px-3.5 text-xs font-semibold text-[#056b24] shadow-md backdrop-blur dark:bg-slate-900/90 dark:text-[#7dcea0]"
          >
            <ArrowLeft className="h-4 w-4" />
            Map
          </Link>
          <div className="hidden rounded-lg bg-white/90 px-3 py-1.5 text-sm font-semibold text-slate-800 shadow-md backdrop-blur sm:block dark:bg-slate-900/90 dark:text-slate-100">
            <span className="inline-flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-sky-600" />
              3D Bahir Dar · Virtual Tour
            </span>
          </div>
        </div>
        <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-2">
          {tourIndex === null ? (
            <Button
              size="sm"
              onClick={startTour}
              disabled={tourStops.length === 0}
              className="bg-emerald-600 text-white shadow-md hover:bg-emerald-700"
            >
              <Play className="h-3.5 w-3.5" />
              Guided tour
            </Button>
          ) : (
            <>
              <Button size="sm" variant="secondary" onClick={nextTourStop} className="shadow-md">
                Next stop
              </Button>
              <Button size="sm" variant="outline" onClick={stopTour} className="bg-white/90 shadow-md">
                <Square className="h-3.5 w-3.5" />
                Stop
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 shadow-md sm:hidden"
            onClick={() => setPanelOpen((v) => !v)}
          >
            {panelOpen ? 'Hide' : 'List'}
          </Button>
        </div>
      </header>

      <aside
        className={cn(
          'absolute z-20 flex max-h-[46vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white/95 shadow-2xl backdrop-blur transition-transform dark:bg-slate-900/95 sm:bottom-4 sm:right-4 sm:max-h-[70vh] sm:w-80 sm:rounded-2xl',
          'bottom-0 left-0 sm:left-auto',
          panelOpen ? 'translate-y-0' : 'translate-y-[110%] sm:translate-y-0 sm:translate-x-[110%]'
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2 dark:border-slate-700">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold">
            <Landmark className="h-4 w-4 text-emerald-600" />
            Attractions & stays
          </h2>
          <span className="text-xs text-slate-500">{places.length}</span>
        </div>

        {selected && (
          <div className="border-b border-slate-100 bg-sky-50/80 px-3 py-3 dark:border-slate-800 dark:bg-sky-950/40">
            <p className="font-medium text-slate-900 dark:text-white">{selected.name}</p>
            {selected.name_am && (
              <p className="text-sm text-slate-600 dark:text-slate-300">{selected.name_am}</p>
            )}
            <p className="mt-1 line-clamp-2 text-xs text-slate-500">
              {selected.short_description || selected.description || selected.address || '—'}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Link
                to={`/places/${selected.slug}`}
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#078930] px-3.5 text-xs font-semibold text-white shadow-sm"
              >
                Details <ExternalLink className="h-3.5 w-3.5" />
              </Link>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setFlyTo(selected)
                }}
              >
                <MapPin className="h-3.5 w-3.5" /> Fly to
              </Button>
            </div>
            {tourIndex !== null && (
              <p className="mt-2 text-[11px] text-emerald-700 dark:text-emerald-300">
                Tour stop {tourIndex + 1} of {tourStops.length}
              </p>
            )}
          </div>
        )}

        <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {places.slice(0, 40).map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => onSelect(p)}
                className={cn(
                  'flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800/80',
                  selected?.id === p.id && 'bg-sky-50 dark:bg-sky-950/50'
                )}
              >
                <span
                  className={cn(
                    'mt-1 h-2 w-2 shrink-0 rounded-full',
                    p.category?.slug === 'hotel' ? 'bg-sky-500' : 'bg-emerald-500'
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{p.name}</span>
                  <span className="block truncate text-xs text-slate-500">
                    {p.category?.name || p.address || 'Place'}
                  </span>
                </span>
              </button>
            </li>
          ))}
          {places.length === 0 && !loading && (
            <li className="px-3 py-6 text-center text-sm text-slate-500">
              No places with coordinates yet.
            </li>
          )}
        </ul>
      </aside>

      <p className="pointer-events-none absolute bottom-2 left-1/2 z-10 hidden -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-[11px] text-white/90 sm:block">
        Drag to orbit · Scroll to zoom · Tap markers
      </p>
    </div>
  )
}
