import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Star, BadgeCheck, Navigation, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Place } from '@/types/place'
import { formatDistance } from '@/utils/geo'
import { isOsmPlaceId, cacheOsmPlaceForDetail } from '@/services/osmPlaces'
import { placeGuideLinks } from '@/constants/guideSites'
import { placeCoverImage, placeImageAlt } from '@/utils/placeImage'
import { cn } from '@/lib/utils'

interface PlaceCardProps {
  place: Place
  variant?: 'default' | 'compact' | 'horizontal'
  showDirections?: boolean
  onDirections?: (place: Place) => void
  className?: string
}

/** City skyline fallback if primary cover 404s */
const CITY_FALLBACK =
  'https://commons.wikimedia.org/wiki/Special:FilePath/The%20city%20of%20Bahir%20Dar%2C%20Ethiopia.jpg?width=640'

function CoverImage({ place, className }: { place: Place; className?: string }) {
  const primary = placeCoverImage(place)
  const [src, setSrc] = useState(primary)
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={cn(
          'bg-gradient-to-br from-sky-400 via-sky-500 to-teal-600',
          className
        )}
        role="img"
        aria-label={placeImageAlt(place)}
      />
    )
  }

  return (
    <img
      src={src}
      alt={placeImageAlt(place)}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      className={cn('object-cover', className)}
      onError={() => {
        if (src !== CITY_FALLBACK) {
          setSrc(CITY_FALLBACK)
        } else {
          setFailed(true)
        }
      }}
    />
  )
}

export function PlaceCard({
  place,
  variant = 'default',
  showDirections,
  onDirections,
  className,
}: PlaceCardProps) {
  const isDemo = place.name.includes('(DEMO)')
  const isOsm = isOsmPlaceId(place.id) || place.slug.startsWith('osm-')
  const name = place.name.replace(' (DEMO)', '')
  const guides = placeGuideLinks(place)
  const detailTo = `/places/${place.slug}`

  const onNavigateDetail = () => {
    if (isOsm) cacheOsmPlaceForDetail(place)
  }

  if (variant === 'compact') {
    return (
      <Link to={detailTo} onClick={onNavigateDetail}>
        <Card className={cn('transition hover:shadow-md', className)}>
          <CardContent className="flex items-center gap-3 p-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-sky-100">
              <CoverImage place={place} className="h-full w-full" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate font-medium">{name}</p>
                {place.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-500" />}
                {isOsm && (
                  <span className="shrink-0 rounded bg-slate-100 px-1 text-[10px] font-medium text-slate-500 dark:bg-slate-800">
                    OSM
                  </span>
                )}
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
      <Link to={detailTo} onClick={onNavigateDetail}>
        <div className="relative h-40 bg-slate-200 dark:bg-slate-800">
          <CoverImage place={place} className="h-full w-full" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
          {place.featured && (
            <span className="absolute left-2 top-2 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-amber-950">
              Featured
            </span>
          )}
          {isDemo && (
            <span className="absolute right-2 top-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800">
              DEMO
            </span>
          )}
          {isOsm && !isDemo && (
            <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-slate-700">
              OpenStreetMap
            </span>
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
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {formatDistance(place.distance_m)}
              </span>
            )}
            {place.hotel?.star_rating && (
              <span className="flex items-center gap-0.5">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {place.hotel.star_rating}★
              </span>
            )}
            {place.restaurant?.cuisine_type && <span>{place.restaurant.cuisine_type}</span>}
            {place.attraction?.attraction_type && (
              <span className="capitalize">{place.attraction.attraction_type}</span>
            )}
          </div>
        </CardContent>
      </Link>
      {(showDirections && onDirections) || isOsm ? (
        <div className="flex flex-wrap gap-2 border-t border-slate-100 px-4 py-2 dark:border-slate-800">
          {showDirections && onDirections && (
            <Button variant="ghost" size="sm" className="flex-1" onClick={() => onDirections(place)}>
              <Navigation className="h-4 w-4" /> Directions
            </Button>
          )}
          {isOsm && (
            <>
              <a
                href={guides.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-sky-700 hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-sky-950"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Maps
              </a>
              <a
                href={guides.googleDirections}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-teal-700 hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-teal-950"
              >
                <Navigation className="h-3.5 w-3.5" /> Go
              </a>
            </>
          )}
        </div>
      ) : null}
    </Card>
  )
}
