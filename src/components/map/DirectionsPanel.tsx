import { X, Navigation, Footprints, Car } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Place } from '@/types/place'
import { formatDistance, walkingMinutes, drivingMinutes } from '@/utils/geo'

interface Props {
  origin: { lat: number; lng: number } | null
  destination: Place
  distanceM: number
  mode: 'walking' | 'driving'
  onModeChange: (mode: 'walking' | 'driving') => void
  onClose: () => void
  onStartNavigation: () => void
}

export function DirectionsPanel({
  origin,
  destination,
  distanceM,
  mode,
  onModeChange,
  onClose,
  onStartNavigation,
}: Props) {
  const mins = mode === 'walking' ? walkingMinutes(distanceM) : drivingMinutes(distanceM)

  return (
    <div className="absolute left-4 right-4 top-20 z-20 rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900 lg:left-auto lg:right-4 lg:w-80">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Directions to</p>
          <h3 className="font-semibold text-slate-900 dark:text-white">{destination.name.replace(' (DEMO)', '')}</h3>
        </div>
        <button type="button" onClick={onClose} className="rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
          <X className="h-5 w-5 text-slate-400" />
        </button>
      </div>

      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={() => onModeChange('walking')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-sm font-medium ${
            mode === 'walking' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 text-slate-600'
          }`}
        >
          <Footprints className="h-4 w-4" /> Walk
        </button>
        <button
          type="button"
          onClick={() => onModeChange('driving')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-sm font-medium ${
            mode === 'driving' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 text-slate-600'
          }`}
        >
          <Car className="h-4 w-4" /> Drive
        </button>
      </div>

      <div className="mb-4 rounded-lg bg-slate-50 p-3 text-center dark:bg-slate-800">
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatDistance(distanceM)}</p>
        <p className="text-sm text-slate-500">≈ {mins} min {mode === 'walking' ? 'walking' : 'driving'}</p>
        {!origin && <p className="mt-1 text-xs text-amber-600">Enable location for accurate route</p>}
      </div>

      <Button className="w-full" onClick={onStartNavigation}>
        <Navigation className="h-4 w-4" />
        Open in Google Maps
      </Button>
    </div>
  )
}
