import { X, Navigation, Footprints, Car, Loader2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Place } from '@/types/place'
import { formatDistance, walkingMinutes, drivingMinutes } from '@/utils/geo'
import { googleMapsDirectionsUrl, type TravelMode } from '@/services/routing'

interface Props {
  origin: { lat: number; lng: number } | null
  destination: Place
  distanceM: number
  mode: TravelMode
  onModeChange: (mode: TravelMode) => void
  onClose: () => void
  /** True while OSRM route is loading */
  routeLoading?: boolean
  /** Route failed */
  routeError?: boolean
  /** Duration from real route (seconds) when available */
  routeDurationSec?: number | null
}

export function DirectionsPanel({
  origin,
  destination,
  distanceM,
  mode,
  onModeChange,
  onClose,
  routeLoading,
  routeError,
  routeDurationSec,
}: Props) {
  const mins =
    routeDurationSec != null
      ? Math.max(1, Math.round(routeDurationSec / 60))
      : mode === 'walking'
        ? walkingMinutes(distanceM)
        : drivingMinutes(distanceM)

  const gmapsUrl = googleMapsDirectionsUrl(
    { latitude: destination.latitude, longitude: destination.longitude },
    origin,
    mode
  )

  return (
    <div className="absolute left-3 right-3 top-[5.5rem] z-20 rounded-2xl border border-black/5 bg-white/95 p-4 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#1c1c1e]/95 lg:left-auto lg:right-4 lg:w-80">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Directions in app
          </p>
          <h3 className="truncate font-semibold text-slate-900 dark:text-white">
            {destination.name.replace(' (DEMO)', '')}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-slate-400" />
        </button>
      </div>

      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={() => onModeChange('walking')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-full border py-2.5 text-sm font-medium ${
            mode === 'walking'
              ? 'border-[#078930] bg-[#078930]/10 text-[#056b24]'
              : 'border-slate-200 text-slate-600 dark:border-slate-700'
          }`}
        >
          <Footprints className="h-4 w-4" /> Walk
        </button>
        <button
          type="button"
          onClick={() => onModeChange('driving')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-full border py-2.5 text-sm font-medium ${
            mode === 'driving'
              ? 'border-[#078930] bg-[#078930]/10 text-[#056b24]'
              : 'border-slate-200 text-slate-600 dark:border-slate-700'
          }`}
        >
          <Car className="h-4 w-4" /> Drive
        </button>
      </div>

      <div className="mb-4 rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800/80">
        {routeLoading ? (
          <p className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Drawing route…
          </p>
        ) : (
          <>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatDistance(distanceM)}
            </p>
            <p className="text-sm text-slate-500">
              ≈ {mins} min {mode === 'walking' ? 'walking' : 'driving'}
            </p>
            {routeError && (
              <p className="mt-1 text-xs text-amber-600">
                Could not load road route — showing straight-line distance
              </p>
            )}
            {!origin && (
              <p className="mt-1 text-xs text-amber-600">Enable location for a route from you</p>
            )}
          </>
        )}
      </div>

      <p className="mb-2 flex items-center justify-center gap-1.5 text-xs font-medium text-[#078930]">
        <Navigation className="h-3.5 w-3.5" />
        Route stays on this map
      </p>

      {/* Optional: native / external maps — secondary only */}
      <a href={gmapsUrl} target="_blank" rel="noopener noreferrer" className="block">
        <Button variant="outline" size="sm" className="w-full">
          <ExternalLink className="h-3.5 w-3.5" />
          Optional: Google Maps app
        </Button>
      </a>
    </div>
  )
}
