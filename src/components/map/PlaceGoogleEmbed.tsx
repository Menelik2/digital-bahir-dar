import { GoogleMapsEmbed } from './GoogleMapsEmbed'
import { formatDistance, walkingMinutes } from '@/utils/geo'
import { MapPin, Navigation } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  lat: number
  lng: number
  name?: string
  /** User GPS — shows route + distance on the map */
  origin?: { lat: number; lng: number } | null
  distanceM?: number | null
  isAm?: boolean
  className?: string
}

/**
 * Large place map: destination pin, optional route from user location.
 * Mobile + desktop friendly heights.
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
  const hasOrigin =
    origin &&
    Number.isFinite(origin.lat) &&
    Number.isFinite(origin.lng)

  const view = hasOrigin ? 'directions' : 'place'

  return (
    <div className={cn('space-y-2', className)}>
      {(hasOrigin || distanceM != null) && (
        <div className="flex flex-wrap items-center gap-2 text-[13px] text-[#3a3a3c] dark:text-white/80">
          {hasOrigin && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#078930]/12 px-2.5 py-1 font-medium text-[#056b24] dark:bg-[#30d158]/15 dark:text-[#30d158]">
              <Navigation className="h-3.5 w-3.5" />
              {isAm ? 'ከእርስዎ ወደ ቦታው' : 'You → place'}
            </span>
          )}
          {distanceM != null && Number.isFinite(distanceM) && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.05] px-2.5 py-1 font-medium dark:bg-white/10">
              <MapPin className="h-3.5 w-3.5 text-[#078930]" />
              {formatDistance(distanceM)}
              <span className="text-[#8e8e93]">
                · 🚶 {walkingMinutes(distanceM)} {isAm ? 'ደቂቃ' : 'min'}
              </span>
            </span>
          )}
        </div>
      )}

      <GoogleMapsEmbed
        lat={lat}
        lng={lng}
        origin={hasOrigin ? origin : null}
        view={view}
        mode="walking"
        title={name ? `Map of ${name}` : 'Google Map'}
        className={cn(
          // Much taller than the old h-56 box — mobile & desktop
          'h-[min(52vh,420px)] w-full min-h-[280px] sm:h-[min(56vh,480px)] sm:min-h-[320px] lg:h-[min(60vh,520px)]'
        )}
      />

      <p className="text-center text-[11px] leading-snug text-slate-400">
        {hasOrigin
          ? isAm
            ? 'ካርታው የእርስዎን ቦታ እና መድረሻ ያሳያል — ከጣቢያው አይወጡም'
            : 'Map shows your location and the place — you stay on this site'
          : isAm
            ? 'Google ካርታ በዚህ ገጽ — ወደ maps.google.com አይወስድዎትም'
            : 'Google Map on this page — no redirect to maps.google.com'}
      </p>
    </div>
  )
}
