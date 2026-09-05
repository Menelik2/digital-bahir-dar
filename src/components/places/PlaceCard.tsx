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

const CITY_FALLBACK =
  'https://commons.wikimedia.org/wiki/Special:FilePath/The%20city%20of%20Bahir%20Dar%2C%20Ethiopia.jpg?width=640'

function CoverImage({ place, className }: { place: Place; className?: string }) {
  const primary = placeCoverImage(place)
  const [src, setSrc] = useState(primary)
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={cn('bg-gradient-to-br from-sky-400 via-sky-500 to-teal-600', className)}
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
      <Link to={detailTo} onClick={onNavigateDetail} className="block ios-press">
        <Card className={cn('overflow-hidden', className)}>
          <CardContent className="flex min-h-[64px] items-center gap-3 p-3 sm:p-3.5">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-sky-100 sm:h-12 sm:w-12 sm:rounded-lg">
              <CoverImage place={place} className="h-full w-full" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-[15px] font-semibold tracking-tight sm:text-sm sm:font-medium">{name}</p>
                {place.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-500" />}
                {isOsm && (
                  <span className="shrink-0 rounded-md bg-slate-100 px-1.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800">
                    OSM
                  </span>
                )}
              </div>
              <p className="truncate text-[13px] text-[#8e8e93]">
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
    <Card className={cn('place-card-mobile overflow-hidden ios-press', className)}>
      <Link to={detailTo} onClick={onNavigateDetail} className="block">
        <div className="relative h-44 bg-slate-200 sm:h-40 dark:bg-slate-800">
          <CoverImage place={place} className="h-full w-full" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
          {place.featured && (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-amber-400 px-2.5 py-1 text-[11px] font-bold text-amber-950 shadow-sm">
              Featured
            </span>
          )}
          {isDemo && (
            <span className="absolute right-2.5 top-2.5 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-medium text-amber-800">
              DEMO
            </span>
          )}
          {isOsm && !isDemo && (
            <span className="absolute right-2.5 top-2.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-sm">
              OpenStreetMap
            </span>
          )}
        </div>
        <CardContent className="p-4 sm:p-4">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="text-[16px] font-semibold leading-snug tracking-tight sm:text-[15px]">{name}</h3>
            {place.verified && <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />}
          </div>
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[#0b6e99] dark:text-sky-400">
            {place.category?.name}
          </p>
          {place.short_description && (
            <p className="mb-3 line-clamp-2 text-[14px] leading-relaxed text-[#8e8e93]">{place.short_description}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#8e8e93]">
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
        <div className="flex flex-wrap gap-2 border-t border-black/[0.06] px-3 py-2.5 dark:border-white/[0.08]">
          {showDirections && onDirections && (
            <Button variant="ghost" size="sm" className="min-h-[40px] flex-1" onClick={() => onDirections(place)}>
              <Navigation className="h-4 w-4" /> Directions
            </Button>
          )}
          {isOsm && (
            <>
              <a
                href={guides.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-1 rounded-full px-2 text-[13px] font-semibold text-sky-700 active:bg-sky-50 dark:text-sky-300 dark:active:bg-sky-950"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Maps
              </a>
              <a
                href={guides.googleDirections}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-1 rounded-full px-2 text-[13px] font-semibold text-teal-700 active:bg-teal-50 dark:text-teal-300 dark:active:bg-teal-950"
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
