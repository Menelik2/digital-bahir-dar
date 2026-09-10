import { useState } from 'react'
import { GoogleMapsEmbed } from './GoogleMapsEmbed'
import { formatDistance, walkingMinutes } from '@/utils/geo'
import { MapPin, Navigation, Route } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  lat: number
  lng: number
  name?: string
  /** User GPS — only used for route when near Bahir Dar */
  origin?: { lat: number; lng: number } | null
  distanceM?: number | null
  isAm?: boolean
  className?: string
}

function inBahirDarRegion(lat: number, lng: number): boolean {
  return lat >= 10.8 && lat <= 12.3 && lng >= 36.6 && lng <= 38.2
}

/**
 * Large place map: always shows the real place pin.
 * Route from you is optional and only when GPS is near Bahir Dar.
 */
export function PlaceGoogleEmbed({
  lat,
  lng,
  name,
  origin,
  distanceM,
  isAm = false,
  className,
}: Props) {
  const coordsOk =
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    !(lat === 0 && lng === 0) &&
    inBahirDarRegion(lat, lng)

  const originNear =
    origin &&
    Number.isFinite(origin.lat) &&
    Number.isFinite(origin.lng) &&
    inBahirDarRegion(origin.lat, origin.lng)

  const [showRoute, setShowRoute] = useState(false)

  const useDirections = Boolean(showRoute && originNear)

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex flex-wrap items-center gap-2 text-[13px] text-[#3a3a3c] dark:text-white/80">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0b6e99]/12 px-2.5 py-1 font-medium text-[#0a5a7e] dark:bg-sky-950 dark:text-sky-300">
          <MapPin className="h-3.5 w-3.5" />
          {isAm ? 'የቦታው ትክክለኛ ቦታ' : 'Exact place location'}
        </span>
        {distanceM != null && Number.isFinite(distanceM) && originNear && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.05] px-2.5 py-1 font-medium dark:bg-white/10">
            <Navigation className="h-3.5 w-3.5 text-[#078930]" />
            {formatDistance(distanceM)}
            <span className="text-[#8e8e93]">
              · 🚶 {walkingMinutes(distanceM)} {isAm ? 'ደቂቃ' : 'min'}
            </span>
          </span>
        )}
        {originNear && (
          <button
            type="button"
            onClick={() => setShowRoute((v) => !v)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-medium transition',
              useDirections
                ? 'bg-[#078930] text-white'
                : 'bg-black/[0.05] text-[#1c1c1e] dark:bg-white/10 dark:text-white'
            )}
          >
            <Route className="h-3.5 w-3.5" />
            {useDirections
              ? isAm
                ? 'መንገድ ይታያል'
                : 'Showing route'
              : isAm
                ? 'ከእኔ መንገድ አሳይ'
                : 'Show route from me'}
          </button>
        )}
      </div>

      {coordsOk ? (
        <GoogleMapsEmbed
          lat={lat}
          lng={lng}
          origin={useDirections ? origin : null}
          view={useDirections ? 'directions' : 'place'}
          mode="walking"
          title={name ? `Map of ${name}` : 'Google Map'}
          className={cn(
            'h-[min(52vh,420px)] w-full min-h-[280px] sm:h-[min(56vh,480px)] sm:min-h-[320px] lg:h-[min(60vh,520px)]'
          )}
        />
      ) : (
        <div className="flex h-[min(40vh,320px)] items-center justify-center rounded-2xl border border-black/10 bg-slate-100 text-sm text-slate-500 dark:border-white/10 dark:bg-slate-900">
          {isAm ? 'የካርታ መጋጠሚያ አልተገኘም' : 'Map coordinates missing for this place'}
        </div>
      )}

      <p className="text-center text-[11px] leading-snug text-slate-400">
        {useDirections
          ? isAm
            ? 'ካርታው ከእርስዎ ወደ ቦታው መንገድ ያሳያል'
            : 'Map shows the route from your location to this place'
          : isAm
            ? 'ካርታው የቦታውን ትክክለኛ ቦታ ያሳያል (ፒን)'
            : 'Map shows the exact place pin — not a search guess'}
      </p>
      {coordsOk && (
        <p className="text-center font-mono text-[10px] text-slate-400/80">
          {lat.toFixed(5)}, {lng.toFixed(5)}
        </p>
      )}
    </div>
  )
}
