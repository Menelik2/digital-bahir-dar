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
    <div
      className={cn(
        'absolute left-0 right-0 z-[1100] flex max-h-[70vh] flex-col border border-black/[0.06] bg-white/95 shadow-[0_-8px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl dark:border-white/[0.1] dark:bg-[#1c1c1e]/95',
        'bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] rounded-t-[1.25rem]',
        'lg:bottom-6 lg:left-4 lg:right-auto lg:w-[22rem] lg:rounded-2xl'
      )}
      style={{ WebkitBackdropFilter: 'saturate(180%) blur(20px)' }}
      role="dialog"
      aria-label={t.map.directions}
    >
      <div className="flex justify-center pt-2.5 lg:hidden" aria-hidden>
        <div className="h-1 w-10 rounded-full bg-black/15 dark:bg-white/25" />
      </div>

      <div className="flex items-start justify-between px-4 pb-1 pt-2">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#078930]">
            {t.map.directions}
          </p>
          <h3 className="truncate text-[17px] font-semibold tracking-tight text-[#1c1c1e] dark:text-white">
            {name}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/[0.05] transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#078930]/45 dark:bg-white/10"
          aria-label={t.map.close}
        >
          <X className="h-5 w-5 text-[#8e8e93]" />
        </button>
      </div>

      <div className="px-4 pb-3">
        <div className="mb-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onModeChange('walking')}
            className={cn(
              'flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border py-2.5 text-sm font-medium transition active:scale-[0.97]',
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
              'flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border py-2.5 text-sm font-medium transition active:scale-[0.97]',
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
                <p className="mt-1 text-xs text-amber-600">{t.map.enableLocation}</p>
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
