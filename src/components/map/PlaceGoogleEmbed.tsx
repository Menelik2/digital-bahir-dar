import { GoogleMapsEmbed } from './GoogleMapsEmbed'

/** Compact Google Maps embed for place detail pages */
export function PlaceGoogleEmbed({
  lat,
  lng,
  name,
}: {
  lat: number
  lng: number
  name?: string
}) {
  return (
    <div className="space-y-2">
      <GoogleMapsEmbed
        lat={lat}
        lng={lng}
        view="place"
        title={name ? `Map of ${name}` : 'Google Map'}
        className="h-56 w-full sm:h-64"
      />
      <p className="text-center text-[11px] text-slate-400">
        Google Map on this page — no redirect to maps.google.com
      </p>
    </div>
  )
}
