import { BAHIR_DAR_CENTER } from '@/constants'

export type HeightGrid = {
  /** rows of elevations in metres (north → south) */
  elevations: number[][]
  /** grid resolution (same for rows & cols) */
  size: number
  minElev: number
  maxElev: number
  /** world extent in local 3D units (half-size each side from origin) */
  halfExtent: number
  south: number
  west: number
  north: number
  east: number
}

const CACHE_KEY = 'dbd-srtm-grid-v1'
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000

/** Scene covers ~±18 km (city + lake shore + approach to falls). */
const HALF_KM = 18
const GRID = 33 // 33² = 1089 points → ~11 batches of 100

function buildLocations(): { lats: number[]; lngs: number[]; south: number; west: number; north: number; east: number } {
  const mPerDegLat = 111_320
  const mPerDegLng = 111_320 * Math.cos((BAHIR_DAR_CENTER.lat * Math.PI) / 180)
  const dLat = (HALF_KM * 1000) / mPerDegLat
  const dLng = (HALF_KM * 1000) / mPerDegLng
  const south = BAHIR_DAR_CENTER.lat - dLat
  const north = BAHIR_DAR_CENTER.lat + dLat
  const west = BAHIR_DAR_CENTER.lng - dLng
  const east = BAHIR_DAR_CENTER.lng + dLng
  const lats: number[] = []
  const lngs: number[] = []
  for (let r = 0; r < GRID; r++) {
    const lat = north - (r / (GRID - 1)) * (north - south)
    for (let c = 0; c < GRID; c++) {
      const lng = west + (c / (GRID - 1)) * (east - west)
      lats.push(lat)
      lngs.push(lng)
    }
  }
  return { lats, lngs, south, west, north, east }
}

async function fetchBatch(locations: string): Promise<number[]> {
  const url = `https://api.opentopodata.org/v1/srtm90m?locations=${encodeURIComponent(locations)}&interpolation=bilinear`
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`elevation HTTP ${res.status}`)
  const data = (await res.json()) as {
    status: string
    results?: { elevation: number | null }[]
  }
  if (data.status !== 'OK' || !data.results) throw new Error('elevation bad status')
  return data.results.map((r) => (typeof r.elevation === 'number' ? r.elevation : 1785))
}

function readCache(): HeightGrid | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { at: number; grid: HeightGrid }
    if (Date.now() - parsed.at > CACHE_TTL_MS) return null
    return parsed.grid
  } catch {
    return null
  }
}

function writeCache(grid: HeightGrid) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), grid }))
  } catch {
    /* quota */
  }
}

/**
 * Fetch SRTM90m elevations for a grid around Bahir Dar (OpenTopoData).
 * Falls back to a smooth synthetic bowl if the API is unavailable.
 */
export async function fetchSrtmHeightGrid(): Promise<HeightGrid> {
  const cached = typeof localStorage !== 'undefined' ? readCache() : null
  if (cached) return cached

  const { lats, lngs, south, west, north, east } = buildLocations()
  const all: number[] = []
  const BATCH = 100

  try {
    for (let i = 0; i < lats.length; i += BATCH) {
      const slice = []
      for (let j = i; j < Math.min(i + BATCH, lats.length); j++) {
        slice.push(`${lats[j].toFixed(5)},${lngs[j].toFixed(5)}`)
      }
      const elevs = await fetchBatch(slice.join('|'))
      all.push(...elevs)
      if (i + BATCH < lats.length) await new Promise((r) => setTimeout(r, 350))
    }
  } catch {
    return syntheticGrid(south, west, north, east)
  }

  const elevations: number[][] = []
  let minElev = Infinity
  let maxElev = -Infinity
  for (let r = 0; r < GRID; r++) {
    const row: number[] = []
    for (let c = 0; c < GRID; c++) {
      const e = all[r * GRID + c] ?? 1785
      row.push(e)
      if (e < minElev) minElev = e
      if (e > maxElev) maxElev = e
    }
    elevations.push(row)
  }

  const halfExtent = (HALF_KM * 1000) / 80
  const grid: HeightGrid = {
    elevations,
    size: GRID,
    minElev,
    maxElev,
    halfExtent,
    south,
    west,
    north,
    east,
  }
  if (typeof localStorage !== 'undefined') writeCache(grid)
  return grid
}

function syntheticGrid(south: number, west: number, north: number, east: number): HeightGrid {
  const elevations: number[][] = []
  let minElev = Infinity
  let maxElev = -Infinity
  for (let r = 0; r < GRID; r++) {
    const row: number[] = []
    for (let c = 0; c < GRID; c++) {
      const u = c / (GRID - 1)
      const v = r / (GRID - 1)
      const edge = Math.max(0, Math.hypot(u - 0.5, v - 0.5) - 0.25) * 180
      const lake = Math.exp(-((u - 0.28) ** 2 + (v - 0.35) ** 2) / 0.08) * -25
      const e = 1785 + edge + lake
      row.push(e)
      if (e < minElev) minElev = e
      if (e > maxElev) maxElev = e
    }
    elevations.push(row)
  }
  return {
    elevations,
    size: GRID,
    minElev,
    maxElev,
    halfExtent: (HALF_KM * 1000) / 80,
    south,
    west,
    north,
    east,
  }
}
