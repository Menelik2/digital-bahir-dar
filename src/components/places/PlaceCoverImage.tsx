import { useEffect, useState } from 'react'
import { placeCoverImage, placeImageAlt } from '@/utils/placeImage'
import { fetchGooglePlacePhotoUrl, googlePlacesApiEnabled } from '@/utils/googlePlacePhoto'
import { cn } from '@/lib/utils'

type PlaceLike = {
  id?: string
  slug?: string
  name?: string
  image_url?: string | null
  latitude?: number | null
  longitude?: number | null
  category?: { slug?: string } | null
  category_id?: string
}

type Props = {
  place: PlaceLike
  className?: string
  preferGoogle?: boolean
  alt?: string
  loading?: 'lazy' | 'eager'
}

/**
 * Cover image for a place. Starts with curated/Wikimedia URL, then optionally
 * upgrades to an official Google Places photo if VITE_GOOGLE_PLACES_API_KEY is set.
 */
export function PlaceCoverImage({
  place,
  className,
  preferGoogle = true,
  alt,
  loading = 'lazy',
}: Props) {
  const fallback = placeCoverImage(place)
  const [src, setSrc] = useState(fallback)

  useEffect(() => {
    setSrc(fallback)
    if (!preferGoogle || !googlePlacesApiEnabled() || !place.name) return
    let cancelled = false
    fetchGooglePlacePhotoUrl(place.name, {
      lat: place.latitude ?? undefined,
      lng: place.longitude ?? undefined,
    }).then((url) => {
      if (!cancelled && url) setSrc(url)
    })
    return () => {
      cancelled = true
    }
  }, [fallback, place.name, place.latitude, place.longitude, preferGoogle])

  return (
    <img
      src={src}
      alt={alt || placeImageAlt({ name: place.name || 'Bahir Dar' })}
      className={cn('object-cover bg-slate-100', className)}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={(e) => {
        const el = e.currentTarget
        if (el.src !== fallback) el.src = fallback
      }}
    />
  )
}
