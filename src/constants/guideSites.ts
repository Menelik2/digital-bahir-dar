/**
 * Trusted sites to help users discover places in Bahir Dar.
 * Used for “Open in …” actions and travel research links.
 */

export type GuideSite = {
  id: string
  name: string
  description: string
  /** Home / city page */
  url: string
  categories: Array<'hotel' | 'restaurant' | 'cafe' | 'attraction' | 'transport' | 'travel' | 'map' | 'all'>
}

/** Mapcarta city page — primary external map for POIs */
export const MAPCARTA_BAHIR_DAR = 'https://mapcarta.com/Bahir_Dar'

export const GUIDE_SITES: GuideSite[] = [
  {
    id: 'mapcarta',
    name: 'Mapcarta — Bahir Dar',
    description: 'Places of interest map for Bahir Dar (open geo data).',
    url: MAPCARTA_BAHIR_DAR,
    categories: ['map', 'attraction', 'travel', 'hotel', 'restaurant', 'cafe', 'transport', 'all'],
  },
  {
    id: 'wikivoyage',
    name: 'Wikivoyage — Bahir Dar',
    description: 'Free travel guide: sleep, eat, see, transport tips for Bahir Dar.',
    url: 'https://en.wikivoyage.org/wiki/Bahir_Dar',
    categories: ['hotel', 'restaurant', 'attraction', 'transport', 'travel', 'all'],
  },
  {
    id: 'osm',
    name: 'OpenStreetMap',
    description: 'Community map of hotels, cafés, bus stops, and POIs (source for live fetch).',
    url: 'https://www.openstreetmap.org/#map=13/11.5936/37.3908',
    categories: ['map', 'hotel', 'restaurant', 'cafe', 'transport', 'all'],
  },
  {
    id: 'google-maps',
    name: 'Google Maps — Bahir Dar',
    description: 'Search hotels, restaurants, cafés, and directions in Bahir Dar.',
    url: 'https://www.google.com/maps/search/Bahir+Dar+Ethiopia',
    categories: ['map', 'hotel', 'restaurant', 'cafe', 'attraction', 'transport', 'all'],
  },
  {
    id: 'traveloethiopia',
    name: 'Travelo Ethiopia — Bahir Dar',
    description: 'Top places to visit around Lake Tana and the Blue Nile Falls.',
    url: 'https://www.traveloethiopia.com/places-to-visit/travel-bahir-dar-top-10-places-to-visit/',
    categories: ['attraction', 'travel', 'all'],
  },
  {
    id: 'overpass-turbo',
    name: 'Overpass Turbo',
    description: 'Run live OpenStreetMap queries (hotels, cafés, transport) for Bahir Dar.',
    url: 'https://overpass-turbo.eu/',
    categories: ['map', 'all'],
  },
]

/** Deep links for a single place (name + coordinates) */
export function placeGuideLinks(place: {
  name: string
  latitude: number
  longitude: number
}) {
  const q = encodeURIComponent(`${place.name} Bahir Dar`)
  const nameOnly = encodeURIComponent(place.name.replace(/\s*\(DEMO\)\s*/gi, '').trim())
  const { latitude: lat, longitude: lng } = place
  return {
    mapcarta: MAPCARTA_BAHIR_DAR,
    mapcartaSearch: `https://mapcarta.com/?q=${nameOnly}`,
    googleMaps: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    googleDirections: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
    openStreetMap: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}`,
    osmSearch: `https://www.openstreetmap.org/search?query=${q}`,
    wikivoyageCity: 'https://en.wikivoyage.org/wiki/Bahir_Dar',
  }
}

export function categoryGuideSearch(category: string) {
  const term = encodeURIComponent(`${category} Bahir Dar Ethiopia`)
  return {
    mapcarta: MAPCARTA_BAHIR_DAR,
    googleMaps: `https://www.google.com/maps/search/${term}`,
    openStreetMap: `https://www.openstreetmap.org/search?query=${term}`,
  }
}

/** Open Mapcarta Bahir Dar (optionally focused via search query). */
export function openMapcarta(query?: string) {
  const url = query?.trim()
    ? `https://mapcarta.com/?q=${encodeURIComponent(query.trim())}`
    : MAPCARTA_BAHIR_DAR
  window.open(url, '_blank', 'noopener,noreferrer')
}
