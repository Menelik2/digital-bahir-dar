/**
 * Hero background for Home header — Blue Nile Falls (Tis Issat).
 * Prefer local public asset; fall back to Wikimedia high-res photo.
 */
export const HERO_BLUE_NILE_LOCAL = '/images/hero-bahir-dar.jpg' as const

/** Dramatic falls photo (same subject as user asset) — used when local file missing */
export const HERO_BLUE_NILE_FALLBACK =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Blue_Nile_Falls-03%2C_by_CT_Snow.jpg/1280px-Blue_Nile_Falls-03%2C_by_CT_Snow.jpg' as const

/** Primary hero source (local first for production when image is deployed) */
export const HERO_BLUE_NILE_DATA_URL = HERO_BLUE_NILE_LOCAL
