import { Link } from 'react-router-dom'
import { MapPin, Star, BadgeCheck, Navigation } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Place } from '@/types/place'
import { formatDistance } from '@/utils/geo'
import { cn } from '@/lib/utils'

interface PlaceCardProps {
  place: Place
  variant?: 'default' | 'compact' | 'horizontal'
  showDirections?: boolean
  onDirections?: (place: Place) => void
  className?: string
}

export function PlaceCard({ place, variant = 'default', showDirections, onDirections, className }: PlaceCardProps) {
  const isDemo = place.name.includes('(DEMO)')
  const name = place.name.replace(' (DEMO)', '')

  if (variant === 'compact') {
    return (
      <Link to={`/places/${place.slug}`}>
        <Card className={cn('transition hover:shadow-md', className)}>
          <CardContent className="flex items-center gap-3 p-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate font-medium">{name}</p>
                {place.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-500" />}
              </div>
              <p className="truncate text-xs text-slate-500">
                {place.category?.name}
                {place.distance_m != null && ` · ${formatDistance(place.distance_m)}`}
              </p>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <Card className={cn('overflow-hidden transition hover:shadow-lg', className)}>
      <Link to={`/places/${place.slug}`}>
        <div className="relative h-40 bg-gradient-to-br from-sky-400 via-sky-500 to-teal-600">
          {place.featured && (
            <span className="absolute left-2 top-2 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-amber-950">Featured</span>
          )}
          {isDemo && (
            <span className="absolute right-2 top-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800">DEMO</span>
          )}
        </div>
        <CardContent className="p-4">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight">{name}</h3>
            {place.verified && <BadgeCheck className="h-5 w-5 shrink-0 text-emerald-500" />}
          </div>
          <p className="mb-2 text-xs font-medium text-sky-600">{place.category?.name}</p>
          {place.short_description && (
            <p className="mb-3 line-clamp-2 text-sm text-slate-500">{place.short_description}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            {place.distance_m != null && (
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{formatDistance(place.distance_m)}</span>
            )}
            {place.hotel?.star_rating && (
              <span className="flex items-center gap-0.5"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{place.hotel.star_rating}★</span>
            )}
            {place.restaurant?.cuisine_type && <span>{place.restaurant.cuisine_type}</span>}
            {place.attraction?.attraction_type && <span className="capitalize">{place.attraction.attraction_type}</span>}
          </div>
        </CardContent>
      </Link>
      {showDirections && onDirections && (
        <div className="border-t border-slate-100 px-4 py-2 dark:border-slate-800">
          <Button variant="ghost" size="sm" className="w-full" onClick={() => onDirections(place)}>
            <Navigation className="h-4 w-4" /> Directions
          </Button>
        </div>
      )}
    </Card>
  )
}
