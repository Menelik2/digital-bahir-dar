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

export function PlaceBottomSheet({ place, distanceM, onClose, onDirections, className }: Props) {
  if (!place) return null

  const links = placeGuideLinks(place)

  return (
    <div
      className={cn(
        'absolute bottom-0 left-0 right-0 z-20 rounded-t-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900',
        'lg:bottom-6 lg:left-4 lg:right-auto lg:w-96 lg:rounded-2xl',
        className
      )}
    >
      <div className="flex items-start justify-between p-4 pb-2">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            {place.category && (
              <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                {place.category.name}
              </span>
            )}
            {place.verified && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Verified</span>
            )}
            {place.name.includes('(DEMO)') && (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">DEMO</span>
            )}
          </div>
          <h3 className="truncate text-lg font-semibold text-slate-900 dark:text-white">{place.name.replace(' (DEMO)', '')}</h3>
          {place.short_description && (
            <p className="mt-0.5 line-clamp-2 text-sm text-slate-500">{place.short_description}</p>
          )}
        </div>
        <button type="button" onClick={onClose} className="ml-2 rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close">
          <X className="h-5 w-5 text-slate-400" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 px-4 text-sm text-slate-600 dark:text-slate-400">
        {distanceM != null && (
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {formatDistance(distanceM)}
          </span>
        )}
        {distanceM != null && (
          <span className="text-slate-400">
            🚶 {walkingMinutes(distanceM)} min · 🚗 {drivingMinutes(distanceM)} min
          </span>
        )}
        {place.address && <span className="truncate">{place.address}</span>}
      </div>

      <div className="flex flex-col gap-2 p-4">
        <div className="flex gap-2">
          <Button className="flex-1" onClick={() => onDirections(place)}>
            <Navigation className="h-4 w-4" />
            Directions
          </Button>
          <Link to={`/places/${place.slug}`} className="flex-1">
            <Button variant="outline" className="w-full">
              <ExternalLink className="h-4 w-4" />
              Details
            </Button>
          </Link>
        </div>
        <a href={links.mapcarta} target="_blank" rel="noopener noreferrer" className="w-full">
          <Button variant="secondary" className="w-full" size="sm">
            <ExternalLink className="h-3.5 w-3.5" />
            View on Mapcarta
          </Button>
        </a>
      </div>
    </div>
  )
}
