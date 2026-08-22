/** Haversine distance in meters between two lat/lng points */
export function distanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`
  return `${(meters / 1000).toFixed(1)} km`
}

/** Approximate walking time in minutes (4.5 km/h) */
export function walkingMinutes(meters: number): number {
  return Math.max(1, Math.round(meters / 75))
}

/** Approximate driving time in minutes (urban ~25 km/h avg) */
export function drivingMinutes(meters: number): number {
  return Math.max(1, Math.round(meters / 417))
}
