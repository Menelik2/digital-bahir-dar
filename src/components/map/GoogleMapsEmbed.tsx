import { useMemo } from 'react'
import { cn } from '@/lib/utils'

export type GoogleMapsEmbedMode = 'place' | 'directions'

type Props = {
  lat: number
  lng: number
  /** When set with view=directions, shows route from origin to the place */
  origin?: { lat: number; lng: number } | null
  mode?: 'walking' | 'driving'
  view?: GoogleMapsEmbedMode
  placeName?: string
  title?: string
  className?: string
}

/**
 * Google Maps iframe embed.
 * Always prefers exact coordinates so the pin matches the place, not a nearby shop.
 */
export function GoogleMapsEmbed({
  lat,
  lng,
  origin = null,
  mode = 'walking',
  view = 'place',
  placeName,
  title = 'Google Map',
  className,
}: Props) {
  const coordsOk =
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    !(lat === 0 && lng === 0)

  const effectiveView: GoogleMapsEmbedMode =
    view === 'directions' && origin && Number.isFinite(origin.lat) && Number.isFinite(origin.lng)
      ? 'directions'
      : 'place'

  const src = useMemo(
    () => buildEmbedSrc({ lat, lng, origin, mode, view: effectiveView, placeName }),
    [lat, lng, origin, mode, effectiveView, placeName]
  )

  if (!coordsOk) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-2xl border border-black/10 bg-slate-100 text-sm text-slate-500 dark:border-white/10 dark:bg-slate-900',
          className
        )}
      >
        Map location unavailable
      </div>
    )
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-black/10 bg-slate-100 shadow-inner dark:border-white/10 dark:bg-slate-900',
        className
      )}
    >
      <iframe
        title={title}
        src={src}
        className="h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  )
}

function getEmbedKey(): string | null {
  const k = import.meta.env.VITE_GOOGLE_MAPS_EMBED_KEY as string | undefined
  if (!k || !k.trim() || k.includes('your-')) return null
  return k.trim()
}

function buildEmbedSrc(opts: {
  lat: number
  lng: number
  origin?: { lat: number; lng: number } | null
  mode: 'walking' | 'driving'
  view: GoogleMapsEmbedMode
  placeName?: string
}): string {
  const key = getEmbedKey()
  const { lat, lng, origin, mode, view, placeName } = opts
  const travelmode = mode === 'walking' ? 'walking' : 'driving'
  const coord = `${lat.toFixed(6)},${lng.toFixed(6)}`
  // placeName kept for future label use; pin always uses pure coordinates
  void placeName

  // Official Embed API — pin by coordinates so marker matches the place, not a nearby shop
  if (key) {
    if (view === 'directions' && origin) {
      return (
        `https://www.google.com/maps/embed/v1/directions` +
        `?key=${encodeURIComponent(key)}` +
        `&origin=${origin.lat.toFixed(6)},${origin.lng.toFixed(6)}` +
        `&destination=${coord}` +
        `&mode=${travelmode}`
      )
    }
    // q=lat,lng is the reliable pin; name-only search often lands on the wrong POI
    return (
      `https://www.google.com/maps/embed/v1/place` +
      `?key=${encodeURIComponent(key)}` +
      `&q=${encodeURIComponent(coord)}` +
      `&zoom=17`
    )
  }

  // Key-free: pin the exact coordinates
  if (view === 'directions' && origin) {
    return (
      `https://maps.google.com/maps` +
      `?saddr=${origin.lat.toFixed(6)},${origin.lng.toFixed(6)}` +
      `&daddr=${encodeURIComponent(coord)}` +
      `&dirflg=${mode === 'walking' ? 'w' : 'd'}` +
      `&hl=en&output=embed`
    )
  }

  // Pure coordinates — name search often pins a nearby shop instead of the place
  return (
    `https://maps.google.com/maps` +
    `?q=${encodeURIComponent(coord)}` +
    `&ll=${coord}` +
    `&z=17` +
    `&hl=en` +
    `&output=embed`
  )
}
