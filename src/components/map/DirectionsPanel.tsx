import { useState } from 'react'
import { X, Navigation, Footprints, Car, Loader2, Map as MapIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Place } from '@/types/place'
import { formatDistance, walkingMinutes, drivingMinutes } from '@/utils/geo'
import type { TravelMode } from '@/services/routing'
import { GoogleMapsEmbed } from './GoogleMapsEmbed'

interface Props {
  origin: { lat: number; lng: number } | null
  destination: Place
  distanceM: number
  mode: TravelMode
  onModeChange: (mode: TravelMode) => void
  onClose: () => void
  routeLoading?: boolean
  routeError?: boolean
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
  const [showGoogle, setShowGoogle] = useState(true)

  const mins =
    routeDurationSec != null
      ? Math.max(1, Math.round(routeDurationSec / 60))
      : mode === 'walking'
        ? walkingMinutes(distanceM)
        : drivingMinutes(distanceM)

  const name = destination.name.replace(' (DEMO)', '')

  return (
    <div className="absolute left-3 right-3 top-[5.25rem] z-20 flex max-h-[calc(100dvh-9rem)] flex-col overflow-hidden rounded-2xl border border-black/5 bg-white/95 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#1c1c1e]/95 lg:left-auto lg:right-4 lg:w-[22rem]">
      <div className="shrink-0 p-4 pb-2">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Directions
            </p>
            <h3 className="truncate font-semibold text-slate-900 dark:text-white">{name}</h3>
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

        <div className="mb-3 rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800/80">
          {routeLoading ? (
            <p className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading route…
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
                <p className="mt-1 text-xs text-amber-600">Using approximate distance</p>
              )}
              {!origin && (
                <p className="mt-1 text-xs text-amber-600">Enable location for route from you</p>
              )}
            </>
          )}
        </div>

        <div className="mb-2 flex gap-2">
          <Button
            size="sm"
            variant={showGoogle ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => setShowGoogle(true)}
          >
            <MapIcon className="h-3.5 w-3.5" /> Google Map
          </Button>
          <Button
            size="sm"
            variant={!showGoogle ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => setShowGoogle(false)}
          >
            <Navigation className="h-3.5 w-3.5" /> Our map only
          </Button>
        </div>
      </div>

      {showGoogle && (
        <div className="min-h-0 flex-1 px-3 pb-3">
          <GoogleMapsEmbed
            lat={destination.latitude}
            lng={destination.longitude}
            origin={origin}
            mode={mode}
            view="directions"
            title={`Directions to ${name}`}
            className="h-[min(42vh,320px)] w-full"
          />
          <p className="mt-1.5 text-center text-[10px] text-slate-400">
            Google Maps embedded in Digital Bahir Dar — you stay on this site
          </p>
        </div>
      )}
    </div>
  )
}
