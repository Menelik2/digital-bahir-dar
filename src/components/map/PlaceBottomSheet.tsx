import { Link } from 'react-router-dom'
import { MapPin, Navigation, X, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Place } from '@/types/place'
import { formatDistance, walkingMinutes, drivingMinutes } from '@/utils/geo'
import { placeGuideLinks } from '@/constants/guideSites'
import { cn } from '@/lib/utils'

interface Props {
  place: Place | null
  distanceM?: number
  onClose: () => void
  onDirections: (place: Place) => void
  className?: string
}

/** Mobile: iPhone-style sheet above tab bar. Desktop: floating card. */
export function PlaceBottomSheet({ place, distanceM, onClose, onDirections, className }: Props) {
  if (!place) return null

  const name = (place.name || 'Place').replace(' (DEMO)', '')
  const slug = place.slug || place.id
  const links = placeGuideLinks({
    name,
    latitude: place.latitude,
    longitude: place.longitude,
  })

  return (
    <div
      className={cn(
        'absolute left-0 right-0 z-[1100] border border-black/[0.06] bg-white/95 shadow-[0_-8px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl dark:border-white/[0.1] dark:bg-[#1c1c1e]/95',
        // Mobile: sit above tab bar + FAB; iOS continuous corners
        'bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] rounded-t-[1.25rem]',
        // Desktop card
        'lg:bottom-6 lg:left-4 lg:right-auto lg:w-[22rem] lg:rounded-2xl lg:border-black/[0.06]',
        className
      )}
      style={{ WebkitBackdropFilter: 'saturate(180%) blur(20px)' }}
    >
      {/* Drag handle — mobile only */}
      <div className="flex justify-center pt-2.5 lg:hidden" aria-hidden>
        <div className="h-1 w-10 rounded-full bg-black/15 dark:bg-white/25" />
      </div>

      <div className="flex items-start justify-between px-4 pb-1 pt-2 lg:p-4 lg:pb-2">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            {place.category?.name && (
              <span className="rounded-full bg-[#0b6e99]/12 px-2.5 py-0.5 text-[11px] font-semibold text-[#0a5a7e] dark:bg-sky-950 dark:text-sky-300">
                {place.category.name}
              </span>
            )}
            {place.verified && (
              <span className="rounded-full bg-[#078930]/12 px-2.5 py-0.5 text-[11px] font-semibold text-[#056b24] dark:text-[#30d158]">
                Verified
              </span>
            )}
            {place.name?.includes('(DEMO)') && (
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                DEMO
              </span>
            )}
          </div>
          <h3 className="truncate text-[17px] font-semibold tracking-tight text-[#1c1c1e] dark:text-white">
            {name}
          </h3>
          {place.short_description && (
            <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-[#8e8e93]">
              {place.short_description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/[0.05] active:bg-black/10 dark:bg-white/10 dark:active:bg-white/15"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-[#8e8e93]" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 text-[13px] text-[#8e8e93]">
        {distanceM != null && Number.isFinite(distanceM) && (
          <span className="flex items-center gap-1 font-medium text-[#1c1c1e] dark:text-white/90">
            <MapPin className="h-3.5 w-3.5 text-[#078930]" />
            {formatDistance(distanceM)}
          </span>
        )}
        {distanceM != null && Number.isFinite(distanceM) && (
          <span>
            🚶 {walkingMinutes(distanceM)} min · 🚗 {drivingMinutes(distanceM)} min
          </span>
        )}
        {place.address && <span className="w-full truncate sm:w-auto">{place.address}</span>}
      </div>

      <div className="flex flex-col gap-2.5 p-4 pt-3">
        <div className="flex gap-2.5">
          <Button className="min-h-[48px] flex-1 text-[15px]" onClick={() => onDirections(place)}>
            <Navigation className="h-4 w-4" />
            Directions
          </Button>
          <Link to={`/places/${encodeURIComponent(slug)}`} className="flex-1">
            <Button variant="outline" className="min-h-[48px] w-full text-[15px]">
              <ExternalLink className="h-4 w-4" />
              Details
            </Button>
          </Link>
        </div>
        <a href={links.mapcarta} target="_blank" rel="noopener noreferrer" className="w-full">
          <Button variant="secondary" className="min-h-[44px] w-full" size="sm">
            <ExternalLink className="h-3.5 w-3.5" />
            View on Mapcarta
          </Button>
        </a>
      </div>
    </div>
  )
}
