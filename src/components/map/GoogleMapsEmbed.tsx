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
  /** place = pin only; directions = route (when origin set and near destination) */
  view?: GoogleMapsEmbedMode
  className?: string
  title?: string
}

/** Bahir Dar / Lake Tana region — reject VPN/global GPS for route embed */
function inBahirDarRegion(lat: number, lng: number): boolean {
  return lat >= 10.8 && lat <= 12.3 && lng >= 36.6 && lng <= 38.2
}

function normalizeCoords(lat: number, lng: number): { lat: number; lng: number } {
  // If values look swapped (Ethiopia: lat~11, lng~37)
  if (lat > 20 && lng < 20 && lng > 5) {
    return { lat: lng, lng: lat }
  }
  return { lat, lng }
}

function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const la1 = (a.lat * Math.PI) / 180
  const la2 = (b.lat * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)))
}

/**
 * Google Maps embedded in our site (iframe) — user never leaves Digital Bahir Dar.
 * Always pins the place accurately. Directions only when origin is near the place.
 */
export function GoogleMapsEmbed({
  lat: rawLat,
  lng: rawLng,
  origin: rawOrigin,
  mode = 'walking',
  view = 'place',
  className,
  title = 'Google Map',
}: Props) {
  const { lat, lng } = normalizeCoords(Number(rawLat), Number(rawLng))
  const origin = useMemo(() => {
    if (!rawOrigin) return null
    const o = normalizeCoords(Number(rawOrigin.lat), Number(rawOrigin.lng))
    if (!Number.isFinite(o.lat) || !Number.isFinite(o.lng)) return null
    // Reject far-away GPS (VPN, another city) so map stays on the real place
    if (!inBahirDarRegion(o.lat, o.lng)) return null
    if (haversineKm(o, { lat, lng }) > 80) return null
    return o
  }, [rawOrigin, lat, lng])

  const effectiveView: GoogleMapsEmbedMode =
    view === 'directions' && origin ? 'directions' : 'place'

  const src = useMemo(
    () => buildEmbedSrc({ lat, lng, origin, mode, view: effectiveView }),
    [lat, lng, origin, mode, effectiveView]
  )

  if (!Number.isFinite(lat) || !Number.isFinite(lng) || (lat === 0 && lng === 0)) {
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
}): string {
  const key = getEmbedKey()
  const { lat, lng, origin, mode, view } = opts
  const travelmode = mode === 'walking' ? 'walking' : 'driving'
  const q = `${lat.toFixed(6)},${lng.toFixed(6)}`

  // Official Embed API — use place (pin), not view (no marker)
  if (key) {
    if (view === 'directions' && origin) {
      return (
        `https://www.google.com/maps/embed/v1/directions` +
        `?key=${encodeURIComponent(key)}` +
        `&origin=${origin.lat.toFixed(6)},${origin.lng.toFixed(6)}` +
        `&destination=${q}` +
        `&mode=${travelmode}`
      )
    }
    return (
      `https://www.google.com/maps/embed/v1/place` +
      `?key=${encodeURIComponent(key)}` +
      `&q=${encodeURIComponent(q)}` +
      `&zoom=16`
    )
  }

  // Key-free: pin the exact coordinates (ll + q keeps marker on place)
  if (view === 'directions' && origin) {
    return (
      `https://maps.google.com/maps` +
      `?saddr=${origin.lat.toFixed(6)},${origin.lng.toFixed(6)}` +
      `&daddr=${q}` +
      `&dirflg=${mode === 'walking' ? 'w' : 'd'}` +
      `&hl=en&output=embed`
    )
  }

  // Accurate place pin — force lat,lng query (not address search)
  return (
    `https://maps.google.com/maps` +
    `?q=${encodeURIComponent(q)}` +
    `&ll=${q}` +
    `&z=16` +
    `&hl=en` +
    `&output=embed`
  )
}
