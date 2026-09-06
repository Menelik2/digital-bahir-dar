import { useState } from 'react'
import { Car, Footprints, Loader2, Map as MapIcon, Navigation, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GoogleMapsEmbed } from '@/components/map/GoogleMapsEmbed'
import type { Place } from '@/types/place'
import type { TravelMode } from '@/services/routing'
import { formatDistance } from '@/utils/geo'
import { useT, useLang } from '@/hooks/useT'
import { placeName } from '@/utils/placeLocale'
import { cn } from '@/lib/utils'

interface Props {
  origin: { lat: number; lng: number } | null
  destination: Place
  distanceM?: number | null
  mode: TravelMode
  onModeChange: (mode: TravelMode) => void
  onClose: () => void
  routeLoading?: boolean
  routeError?: string | null
  routeDurationSec?: number | null
  /** Request browser geolocation so route can start from the user */
  onEnableLocation?: () => void
  locationLoading?: boolean
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
  onEnableLocation,
  locationLoading,
}: Props) {
  const t = useT()
  const { language } = useLang()
  const [showGoogle, setShowGoogle] = useState(false)

  const name = placeName(destination, language)
  const distLabel =
    distanceM != null && Number.isFinite(distanceM) ? formatDistance(distanceM) : '—'

  const mins =
    routeDurationSec != null && Number.isFinite(routeDurationSec)
      ? Math.max(1, Math.round(routeDurationSec / 60))
      : distanceM != null && Number.isFinite(distanceM)
        ? Math.max(1, Math.round((distanceM / 1000) * (mode === 'walking' ? 12 : 2.5)))
        : null

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[1100] flex max-h-[min(70vh,520px)] flex-col overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:left-auto sm:right-4 sm:bottom-4 sm:max-w-md sm:rounded-2xl">
      <div className="shrink-0 border-b border-slate-100 px-4 pb-3 pt-3 dark:border-slate-800">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{t.map.directions}</p>
            <h2 className="truncate text-lg font-semibold text-slate-900 dark:text-white">{name}</h2>
          </div>
          <Button size="icon" variant="ghost" className="h-9 w-9 shrink-0" onClick={onClose} aria-label={t.common.close}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="mb-3 flex gap-2">
          <button
            type="button"
            onClick={() => onModeChange('walking')}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2.5 text-sm font-medium transition',
              mode === 'walking'
                ? 'border-[#078930] bg-[#078930]/10 text-[#056b24]'
                : 'border-slate-200 text-slate-600 dark:border-slate-700'
            )}
          >
            <Footprints className="h-4 w-4" /> {t.map.walk}
          </button>
          <button
            type="button"
            onClick={() => onModeChange('driving')}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2.5 text-sm font-medium transition',
              mode === 'driving'
                ? 'border-[#078930] bg-[#078930]/10 text-[#056b24]'
                : 'border-slate-200 text-slate-600 dark:border-slate-700'
            )}
          >
            <Car className="h-4 w-4" /> {t.map.drive}
          </button>
        </div>

        <div className="mb-3 rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800/80">
          {routeLoading ? (
            <p className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" /> {t.map.loadingRoute}
            </p>
          ) : (
            <>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{distLabel}</p>
              {mins != null && (
                <p className="text-sm text-slate-500">
                  ≈ {mins} {language === 'am' ? 'ደቂቃ' : 'min'}{' '}
                  {mode === 'walking' ? t.map.walk : t.map.drive}
                </p>
              )}
              {routeError && (
                <p className="mt-1 text-xs text-amber-600">{t.map.approxDistance}</p>
              )}
              {!origin && (
                <div className="mt-2 space-y-2">
                  <p className="text-xs text-amber-700 dark:text-amber-400">{t.map.enableLocation}</p>
                  {onEnableLocation && (
                    <Button
                      size="sm"
                      className="w-full min-h-[44px] rounded-full bg-[#078930] hover:bg-[#056b24]"
                      onClick={() => onEnableLocation()}
                      disabled={locationLoading}
                    >
                      {locationLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> {t.common.loading}
                        </>
                      ) : (
                        <>
                          <Navigation className="h-4 w-4" />{' '}
                          {t.map.useMyLocation || t.map.myLocation || t.map.enableLocation}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="mb-2 flex gap-2">
          <Button
            size="sm"
            variant={!showGoogle ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => setShowGoogle(false)}
          >
            <Navigation className="h-3.5 w-3.5" /> {t.map.ourMap}
          </Button>
          <Button
            size="sm"
            variant={showGoogle ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => setShowGoogle(true)}
          >
            <MapIcon className="h-3.5 w-3.5" /> {t.map.googleMap}
          </Button>
        </div>
      </div>

      {showGoogle &&
        Number.isFinite(destination.latitude) &&
        Number.isFinite(destination.longitude) && (
          <div className="min-h-0 flex-1 px-3 pb-3">
            <GoogleMapsEmbed
              lat={destination.latitude}
              lng={destination.longitude}
              origin={origin}
              mode={mode}
              view="directions"
              title={`${t.map.directions} — ${name}`}
              className="h-[min(36vh,280px)] w-full"
            />
            <p className="mt-1.5 text-center text-[10px] text-slate-400">{t.map.googleInside}</p>
          </div>
        )}
    </div>
  )
}
