/**
 * Bahir Dar reference prices (ETB) — research snapshot for Spend Guide & Trip Planner.
 *
 * Sources cross-checked (2025–2026 guides, traveler reports, hotel averages):
 * - Blue Nile Falls entry ~200 ETB (+ optional camera / guide)
 * - Lake Tana monastery entry ~100–200 ETB each
 * - Shared boat half-day ~800–3,000 ETB/person; private charter ~3,000–12,000+
 * - Hotel averages: budget ~$10–25, mid ~$25–55, comfort/resort ~$50–150+
 * - USD≈155–160 ETB (planning rate 157)
 *
 * IMPORTANT: Planning estimates only. Confirm boats, cars, and hotels on site.
 */

export const PRICE_META = {
  currency: 'ETB' as const,
  lastReviewed: '2026-09-04',
  usdToEtbApprox: 157,
  disclaimer:
    'Illustrative price bands for Bahir Dar planning. Not live booking rates. Verify locally before paying.',
}

/** Room / night (double room, excl. peak surcharges) */
export const HOTEL_NIGHT_ETB = {
  budget: {
    min: 1200,
    typical: 2200,
    max: 4000,
    note: 'Guesthouse / 1–2★ pensions ~$8–25',
  },
  mid: {
    min: 4000,
    typical: 5500,
    max: 9000,
    note: '3★ city & lake-area hotels ~$25–55',
  },
  comfort: {
    min: 9000,
    typical: 14000,
    max: 28000,
    note: '4★ / lakeside resorts (Kuriftu class) ~$55–180+',
  },
} as const

/** Food per person per day (meals + coffee / soft drinks) */
export const FOOD_PERSON_DAY_ETB = {
  budget: {
    min: 350,
    typical: 650,
    max: 1100,
    note: 'Local injera houses 50–180 ETB/meal; coffee 30–80',
  },
  mid: {
    min: 1100,
    typical: 1900,
    max: 3200,
    note: 'Restaurant fish/tibs 180–450 ETB; hotel lunch',
  },
  comfort: {
    min: 3200,
    typical: 4800,
    max: 8500,
    note: 'Resort / lakeside dining 500–1500+ ETB/meal',
  },
} as const

/** Activities — typical one-off costs (foreign visitor bands) */
export const ATTRACTION_ETB = {
  blueNileFallsEntry: {
    min: 100,
    typical: 200,
    max: 300,
    note: 'Tis Issat ticket; confirm on site (camera fee possible)',
  },
  blueNileFallsGuide: {
    min: 300,
    typical: 500,
    max: 1500,
    note: 'Optional local guide per group at the falls',
  },
  blueNileFallsBoatCrossing: {
    min: 20,
    typical: 50,
    max: 200,
    note: 'River crossing boat if operating',
  },
  busToTisAbay: {
    min: 20,
    typical: 40,
    max: 100,
    note: 'Local bus/minibus one way Bahir Dar ↔ Tis Abay',
  },
  privateCarFallsRoundTrip: {
    min: 1200,
    typical: 2000,
    max: 4000,
    note: 'Hotel/agency vehicle round-trip (group shares)',
  },
  monasteryEntry: {
    min: 100,
    typical: 200,
    max: 400,
    note: 'Per monastery on Lake Tana islands / Zege',
  },
  lakeTanaBoatSharedHalfDay: {
    min: 800,
    typical: 1800,
    max: 4000,
    note: 'Shared boat half-day (Zege / 1–2 monasteries); negotiate at pier',
  },
  lakeTanaBoatPrivateHalfDay: {
    min: 3000,
    typical: 5500,
    max: 12000,
    note: 'Private charter half-day; full-day multi-island higher',
  },
  bezawitHill: {
    min: 0,
    typical: 50,
    max: 100,
    note: 'Viewpoint / palace area — often free or small fee',
  },
  hippoBoat: {
    min: 400,
    typical: 800,
    max: 2000,
    note: 'Short hippo / birdwatching boat near outlet',
  },
} as const

/** Local transport per day (group share of bajaj / taxi) */
export const TRANSPORT_DAY_ETB = {
  budget: {
    min: 80,
    typical: 200,
    max: 450,
    note: 'Walking + short bajaj hops',
  },
  mid: {
    min: 350,
    typical: 700,
    max: 1400,
    note: 'Bajaj + occasional taxi',
  },
  comfort: {
    min: 1200,
    typical: 2500,
    max: 5500,
    note: 'Taxi / hired car by the day',
  },
} as const

/** Per-person activity budget “day” for Spend Guide tiers */
export const ATTRACTION_DAY_ETB = {
  budget: {
    min: 100,
    typical: 400,
    max: 900,
    note: 'Walks, small fees, one local site',
  },
  mid: {
    min: 800,
    typical: 2200,
    max: 4500,
    note: 'Falls day trip or short boat + entries',
  },
  comfort: {
    min: 3000,
    typical: 6500,
    max: 13000,
    note: 'Private boat / guided full day',
  },
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
