import { BAHIR_DAR_CENTER } from '@/constants'
import { latLngToLocal } from '@/lib/geo3d'

export type OsmBuilding = {
  id: number
  /** Local XZ ring (closed), y unused */
  ring: { x: number; z: number }[]
  height: number
  levels?: number
}

const OVERPASS_ENDPOINTS = [
  'https://overpass.openstreetmap.fr/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://overpass-api.de/api/interpreter',
]

const CACHE_KEY = 'dbd-osm-buildings-v1'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000
const MAX_BUILDINGS = 700

/** Tight city core (~3.5 km box) for performant footprints */
function cityBbox(): { s: number; w: number; n: number; e: number } {
  const mPerDegLat = 111_320
  const mPerDegLng = 111_320 * Math.cos((BAHIR_DAR_CENTER.lat * Math.PI) / 180)
  const halfM = 1750
  const dLat = halfM / mPerDegLat
  const dLng = halfM / mPerDegLng
  return {
    s: BAHIR_DAR_CENTER.lat - dLat,
    n: BAHIR_DAR_CENTER.lat + dLat,
    w: BAHIR_DAR_CENTER.lng - dLng,
    e: BAHIR_DAR_CENTER.lng + dLng,
  }
}

type OverpassEl = {
  type: string
  id: number
  geometry?: { lat: number; lon: number }[]
  tags?: Record<string, string>
}

function parseHeight(tags?: Record<string, string>): number {
  if (!tags) return 8
  if (tags.height) {
    const h = parseFloat(tags.height)
    if (Number.isFinite(h) && h > 1 && h < 80) return h
  }
  if (tags['building:levels']) {
    const lv = parseFloat(tags['building:levels'])
    if (Number.isFinite(lv) && lv > 0) return Math.min(60, lv * 3.2)
  }
  const t = (tags.building || '').toLowerCase()
  if (t === 'apartments' || t === 'yes') return 9 + Math.random() * 4
  if (t === 'house' || t === 'residential') return 5 + Math.random() * 3
  if (t === 'commercial' || t === 'retail') return 8 + Math.random() * 5
  if (t === 'church' || t === 'cathedral') return 14
  return 7 + Math.random() * 3
}

function readCache(): OsmBuilding[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { at: number; buildings: OsmBuilding[] }
    if (Date.now() - parsed.at > CACHE_TTL_MS) return null
    return parsed.buildings
  } catch {
    return null
  }
}

function writeCache(buildings: OsmBuilding[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), buildings }))
  } catch {
    /* quota */
  }
}

/**
 * Load real OSM building footprints for central Bahir Dar and convert to local 3D rings.
 */
export async function fetchOsmBuildings(): Promise<OsmBuilding[]> {
  const cached = typeof localStorage !== 'undefined' ? readCache() : null
  if (cached?.length) return cached

  const { s, w, n, e } = cityBbox()
  const query = `
[out:json][timeout:25];
(
  way["building"](${s},${w},${n},${e});
);
out body geom;
`.trim()

  let data: { elements?: OverpassEl[] } | null = null
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: `data=${encodeURIComponent(query)}`,
      })
      if (!res.ok) continue
      data = (await res.json()) as { elements?: OverpassEl[] }
      if (data.elements?.length) break
    } catch {
      /* try next mirror */
    }
  }

  if (!data?.elements?.length) return []

  const buildings: OsmBuilding[] = []
  for (const el of data.elements) {
    if (el.type !== 'way' || !el.geometry || el.geometry.length < 3) continue
    const ring = el.geometry.map((g) => {
      const p = latLngToLocal(g.lat, g.lon)
      return { x: p.x, z: p.z }
    })
    const xs = ring.map((p) => p.x)
    const zs = ring.map((p) => p.z)
    const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...zs) - Math.min(...zs))
    if (span < 0.05 || span > 25) continue

    const heightM = parseHeight(el.tags)
    buildings.push({
      id: el.id,
      ring,
      height: heightM / 80,
      levels: el.tags?.['building:levels'] ? parseFloat(el.tags['building:levels']) : undefined,
    })
    if (buildings.length >= MAX_BUILDINGS) break
  }

  if (typeof localStorage !== 'undefined' && buildings.length) writeCache(buildings)
  return buildings
}
