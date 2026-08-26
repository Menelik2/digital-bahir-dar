import { useMemo } from 'react'
import { cn } from '@/lib/utils'

export type GoogleMapsEmbedMode = 'place' | 'directions'

type Props = {
  /** Destination lat */
  lat: number
  /** Destination lng */
  lng: number
  /** Optional origin for directions */
  origin?: { lat: number; lng: number } | null
  mode?: 'walking' | 'driving'
  /** place = pin only; directions = route (when origin set) */
  view?: GoogleMapsEmbedMode
  className?: string
  title?: string
}

/**
 * Google Maps embedded in our site (iframe) — user never leaves Digital Bahir Dar.
 * Uses the public embed URL pattern (no API key required for basic q= / saddr-daddr).
 * Optional VITE_GOOGLE_MAPS_EMBED_KEY enables official Embed API v1.
 */
export function GoogleMapsEmbed({
  lat,
  lng,
  origin,
  mode = 'driving',
  view = 'place',
  className,
  title = 'Google Map',
}: Props) {
  const src = useMemo(() => buildEmbedSrc({ lat, lng, origin, mode, view }), [lat, lng, origin, mode, view])

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
}): string {
  const key = getEmbedKey()
  const { lat, lng, origin, mode, view } = opts
  const travelmode = mode === 'walking' ? 'walking' : 'driving'

  // Official Embed API (best quality) when key is set
  if (key) {
    if (view === 'directions' && origin) {
      return (
        `https://www.google.com/maps/embed/v1/directions` +
        `?key=${encodeURIComponent(key)}` +
        `&origin=${origin.lat},${origin.lng}` +
        `&destination=${lat},${lng}` +
        `&mode=${travelmode}`
      )
    }
    return (
      `https://www.google.com/maps/embed/v1/view` +
      `?key=${encodeURIComponent(key)}` +
      `&center=${lat},${lng}` +
      `&zoom=16` +
      `&maptype=roadmap`
    )
  }

  // Key-free embed (works in most browsers for place + simple directions)
  if (view === 'directions' && origin) {
    return (
      `https://maps.google.com/maps` +
      `?saddr=${origin.lat},${origin.lng}` +
      `&daddr=${lat},${lng}` +
      `&dirflg=${mode === 'walking' ? 'w' : 'd'}` +
      `&hl=en&output=embed`
    )
  }

  if (view === 'directions') {
    return `https://maps.google.com/maps?daddr=${lat},${lng}&hl=en&z=15&output=embed`
  }

  return `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=16&output=embed`
}
