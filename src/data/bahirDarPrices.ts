/**
 * Bahir Dar reference prices (ETB) — research snapshot for Spend Guide & planning.
 *
 * Sources (cross-checked Aug 2026):
 * - BudgetYourTrip / Kayak / Momondo hotel averages (USD converted ~1 USD ≈ 155–160 ETB)
 * - Travel guides: Blue Nile Falls entry, bus, guide fees
 * - Local meal & boat tour ranges reported by recent guides
 *
 * IMPORTANT: These are planning estimates only. Hotels quote in USD or ETB;
 * rates change by season, nationality, and negotiation. Always confirm on site.
 */

export const PRICE_META = {
  currency: 'ETB' as const,
  lastReviewed: '2026-08-22',
  /** Approximate market conversion used for USD→ETB bands */
  usdToEtbApprox: 157,
  disclaimer:
    'Illustrative price bands for Bahir Dar planning. Not live booking rates. Verify locally before paying.',
}

/** Room / night (double room, excl. peak surcharges) */
export const HOTEL_NIGHT_ETB = {
  budget: { min: 1500, typical: 2500, max: 4000, note: 'Guesthouse / 1–2★; local pensions from ~$10–25' },
  mid: { min: 4000, typical: 5500, max: 9000, note: '3★ city & lake-area hotels ~$25–55' },
  comfort: { min: 8000, typical: 12000, max: 25000, note: '4★ / lakeside resorts (e.g. Unison, Kuriftu class) ~$50–150+' },
} as const

/** Food per person per day (mix of meals + coffee) */
export const FOOD_PERSON_DAY_ETB = {
  budget: { min: 400, typical: 700, max: 1200, note: 'Local injera houses 50–150 ETB/meal; coffee 30–80' },
  mid: { min: 1200, typical: 2000, max: 3500, note: 'Restaurant fish/tibs 180–450 ETB; hotel lunch' },
  comfort: { min: 3500, typical: 5000, max: 9000, note: 'Resort / lakeside fine dining 500–1500+ ETB/meal' },
} as const

/** Activities — typical one-off costs */
export const ATTRACTION_ETB = {
  blueNileFallsEntry: { min: 50, typical: 200, max: 300, note: 'Tis Abay ticket; fees reported 50–200+ ETB — confirm on site' },
  blueNileFallsGuide: { min: 300, typical: 500, max: 1500, note: 'Optional local guide per group' },
  blueNileFallsBoatCrossing: { min: 20, typical: 50, max: 200, note: 'River crossing boat if operating' },
  busToTisAbay: { min: 15, typical: 30, max: 80, note: 'Local bus one way (older fares ~15 ETB; expect inflation)' },
  privateCarFallsRoundTrip: { min: 800, typical: 1500, max: 3500, note: 'Hotel/agency vehicle Bahir Dar ↔ Tis Abay' },
  monasteryEntry: { min: 100, typical: 200, max: 400, note: 'Per monastery on Lake Tana islands' },
  lakeTanaBoatSharedHalfDay: { min: 800, typical: 2000, max: 5000, note: 'Shared boat ~$5–40; ask at pier' },
  lakeTanaBoatPrivateHalfDay: { min: 3000, typical: 6000, max: 15000, note: 'Private charter half day; full day higher' },
  bezawitHill: { min: 0, typical: 50, max: 100, note: 'Viewpoint / palace area — often free or small fee' },
} as const

/** Local transport per day (group share of bajaj/taxi) */
export const TRANSPORT_DAY_ETB = {
  budget: { min: 100, typical: 250, max: 500, note: 'Walking + bajaj short hops' },
  mid: { min: 400, typical: 800, max: 1500, note: 'Bajaj + occasional taxi' },
  comfort: { min: 1500, typical: 3000, max: 6000, note: 'Taxi / hired car by the day' },
} as const

/** Per-person activity budget “day” for Spend Guide tiers */
export const ATTRACTION_DAY_ETB = {
  budget: { min: 100, typical: 400, max: 800, note: 'Walks, small fees, one local site' },
  mid: { min: 800, typical: 2000, max: 4000, note: 'Falls day trip or short boat + entries' },
  comfort: { min: 3000, typical: 6000, max: 12000, note: 'Private boat / guided full day' },
} as const

export type PriceTier = 'budget' | 'mid' | 'comfort'

export function hotelTypical(tier: PriceTier): number {
  return HOTEL_NIGHT_ETB[tier].typical
}

export function foodTypical(tier: PriceTier): number {
  return FOOD_PERSON_DAY_ETB[tier].typical
}

export function attractionDayTypical(tier: PriceTier): number {
  return ATTRACTION_DAY_ETB[tier].typical
}

export function transportDayTypical(tier: PriceTier): number {
  return TRANSPORT_DAY_ETB[tier].typical
}
