/**
 * Spend Guide — given cash on hand, suggest what a visitor can afford in Bahir Dar.
 * Rates from src/data/bahirDarPrices.ts (research snapshot).
 */

import {
  HOTEL_NIGHT_ETB,
  FOOD_PERSON_DAY_ETB,
  ATTRACTION_DAY_ETB,
  TRANSPORT_DAY_ETB,
  ATTRACTION_ETB,
  PRICE_META,
  type PriceTier,
} from '@/data/bahirDarPrices'

export type SpendTier = PriceTier

export type SpendGuideInput = {
  cash: number
  days: number
  travelers: number
  priority?: 'sleep' | 'food' | 'see' | 'balanced'
}

export type PlaceSuggestion = {
  category: 'hotel' | 'restaurant' | 'attraction' | 'transport' | 'cafe'
  tier: SpendTier
  title: string
  why: string
  estCostPerUnit: number
  unit: string
  tips: string[]
  explorePath: string
}

export type DayPlanItem = {
  time: string
  title: string
  category: string
  estCost: number
  note: string
}

export type SpendGuideResult = {
  tier: SpendTier
  dailyBudget: number
  perPersonTotal: number
  allocation: {
    lodging: number
    food: number
    attractions: number
    transport: number
    buffer: number
  }
  suggestions: PlaceSuggestion[]
  sampleDay: DayPlanItem[]
  warnings: string[]
  summary: string
  priceMeta: typeof PRICE_META
}

function n(v: unknown): number {
  const x = Number(v)
  return Number.isFinite(x) && x >= 0 ? x : 0
}

function pickTier(cashPerPersonPerDay: number): SpendTier {
  // Aligned with mid Ethiopia daily ~3,500–4,000 ETB/person from travel cost surveys
  if (cashPerPersonPerDay < 2500) return 'budget'
  if (cashPerPersonPerDay < 7000) return 'mid'
  return 'comfort'
}

export function buildSpendGuide(input: SpendGuideInput): SpendGuideResult {
  const cash = Math.max(0, n(input.cash))
  const days = Math.max(1, Math.floor(n(input.days)) || 1)
  const travelers = Math.max(1, Math.floor(n(input.travelers)) || 1)
  const priority = input.priority ?? 'balanced'
  const nights = Math.max(1, days)

  const perPersonTotal = cash / travelers
  const dailyBudget = cash / days
  const cashPerPersonPerDay = cash / travelers / days
  const tier = pickTier(cashPerPersonPerDay)

  let w = { lodging: 0.35, food: 0.3, attractions: 0.2, transport: 0.1, buffer: 0.05 }
  if (priority === 'sleep') w = { lodging: 0.45, food: 0.25, attractions: 0.15, transport: 0.1, buffer: 0.05 }
  if (priority === 'food') w = { lodging: 0.28, food: 0.4, attractions: 0.17, transport: 0.1, buffer: 0.05 }
  if (priority === 'see') w = { lodging: 0.28, food: 0.25, attractions: 0.32, transport: 0.1, buffer: 0.05 }

  const allocation = {
    lodging: Math.round(cash * w.lodging),
    food: Math.round(cash * w.food),
    attractions: Math.round(cash * w.attractions),
    transport: Math.round(cash * w.transport),
    buffer: Math.round(cash * w.buffer),
  }

  const rooms = Math.max(1, Math.ceil(travelers / 2))
  const hotelNightBudget = nights > 0 ? allocation.lodging / nights / rooms : 0
  const foodPersonDay = allocation.food / days / travelers
  const attrPerson = allocation.attractions / travelers

  const hotelTier: SpendTier =
    hotelNightBudget >= HOTEL_NIGHT_ETB.comfort.typical * 0.7
      ? 'comfort'
      : hotelNightBudget >= HOTEL_NIGHT_ETB.mid.typical * 0.6
        ? 'mid'
        : 'budget'
  const foodTier: SpendTier =
    foodPersonDay >= FOOD_PERSON_DAY_ETB.comfort.typical * 0.6
      ? 'comfort'
      : foodPersonDay >= FOOD_PERSON_DAY_ETB.mid.typical * 0.6
        ? 'mid'
        : 'budget'
  const attrTier: SpendTier =
    attrPerson / days >= ATTRACTION_DAY_ETB.comfort.typical * 0.4
      ? 'comfort'
      : attrPerson / days >= ATTRACTION_DAY_ETB.mid.typical * 0.4
        ? 'mid'
        : 'budget'

  const suggestions: PlaceSuggestion[] = [
    {
      category: 'hotel',
      tier: hotelTier,
      title:
        hotelTier === 'budget'
          ? 'Guesthouse / simple hotel'
          : hotelTier === 'mid'
            ? 'Mid-range lakeside or city hotel'
            : 'Comfort / lakeside resort-style hotel',
      why: `Your plan allows ~${Math.round(hotelNightBudget).toLocaleString()} ETB per room/night (${rooms} room${rooms > 1 ? 's' : ''}). Typical ${hotelTier}: ${HOTEL_NIGHT_ETB[hotelTier].min.toLocaleString()}–${HOTEL_NIGHT_ETB[hotelTier].max.toLocaleString()} ETB.`,
      estCostPerUnit: HOTEL_NIGHT_ETB[hotelTier].typical,
      unit: 'room / night',
      tips: [
        HOTEL_NIGHT_ETB[hotelTier].note,
        'Ask if breakfast is included; many hotels quote in USD for foreigners.',
        'Confirm Wi‑Fi and hot water before paying.',
      ],
      explorePath: '/hotels',
    },
    {
      category: 'restaurant',
      tier: foodTier,
      title:
        foodTier === 'budget'
          ? 'Local kitfo / injera houses & cafés'
          : foodTier === 'mid'
            ? 'City restaurants + lake fish plates'
            : 'Hotel & lakeside fine dining',
      why: `~${Math.round(foodPersonDay).toLocaleString()} ETB per person/day. Typical band: ${FOOD_PERSON_DAY_ETB[foodTier].min.toLocaleString()}–${FOOD_PERSON_DAY_ETB[foodTier].max.toLocaleString()} ETB.`,
      estCostPerUnit: FOOD_PERSON_DAY_ETB[foodTier].typical,
      unit: 'person / day',
      tips: [
        FOOD_PERSON_DAY_ETB[foodTier].note,
        'Try Lake Tana tilapia / Nile perch where available.',
        'Carry small bills for local places.',
      ],
      explorePath: '/restaurants',
    },
    {
      category: 'attraction',
      tier: attrTier,
      title:
        attrTier === 'budget'
          ? 'Lakeshore walks, market, low-fee viewpoints'
          : attrTier === 'mid'
            ? 'Blue Nile Falls day trip + optional short boat'
            : 'Private boat monasteries + Falls guided day',
      why: `~${Math.round(attrPerson).toLocaleString()} ETB per person total for activities. Falls entry often ${ATTRACTION_ETB.blueNileFallsEntry.typical} ETB; boat tours vary widely.`,
      estCostPerUnit: ATTRACTION_DAY_ETB[attrTier].typical,
      unit: 'person / activity day',
      tips: [
        `Blue Nile Falls entry: ~${ATTRACTION_ETB.blueNileFallsEntry.min}–${ATTRACTION_ETB.blueNileFallsEntry.max} ETB (confirm on site).`,
        `Monastery entry: ~${ATTRACTION_ETB.monasteryEntry.min}–${ATTRACTION_ETB.monasteryEntry.max} ETB each.`,
        `Shared Lake Tana boat half-day: often ${ATTRACTION_ETB.lakeTanaBoatSharedHalfDay.min.toLocaleString()}–${ATTRACTION_ETB.lakeTanaBoatSharedHalfDay.max.toLocaleString()} ETB — agree price before boarding.`,
      ],
      explorePath: '/attractions',
    },
    {
      category: 'transport',
      tier,
      title: tier === 'budget' ? 'Bajaj & walking' : tier === 'mid' ? 'Bajaj + occasional taxi' : 'Taxi / hired car',
      why: `~${Math.round(allocation.transport / days).toLocaleString()} ETB/day transport share. Typical ${tier}: ${TRANSPORT_DAY_ETB[tier].min}–${TRANSPORT_DAY_ETB[tier].max} ETB.`,
      estCostPerUnit: TRANSPORT_DAY_ETB[tier].typical,
      unit: 'day (group)',
      tips: [
        TRANSPORT_DAY_ETB[tier].note,
        'Agree bajaj fare before the ride.',
        `Bus Bahir Dar → Tis Abay historically low; private car for Falls ~${ATTRACTION_ETB.privateCarFallsRoundTrip.min}–${ATTRACTION_ETB.privateCarFallsRoundTrip.max} ETB round trip.`,
      ],
      explorePath: '/transport',
    },
    {
      category: 'cafe',
      tier: foodTier,
      title: 'Coffee ceremony & café stops',
      why: 'Coffee is central to Bahir Dar culture; small daily spend.',
      estCostPerUnit: foodTier === 'budget' ? 50 : foodTier === 'mid' ? 120 : 300,
      unit: 'coffee stop',
      tips: ['Traditional coffee ceremony if offered.', 'Great between sights on the lakeshore.'],
      explorePath: '/explore',
    },
  ]

  const sampleDay: DayPlanItem[] =
    tier === 'budget'
      ? [
          {
            time: 'Morning',
            title: 'Lakeshore walk + coffee',
            category: 'cafe',
            estCost: 80 * travelers,
            note: 'Low cost orientation',
          },
          {
            time: 'Midday',
            title: 'Local lunch (injera / tibs)',
            category: 'restaurant',
            estCost: Math.round(FOOD_PERSON_DAY_ETB.budget.typical * 0.4 * travelers),
            note: '~50–150 ETB per local plate',
          },
          {
            time: 'Afternoon',
            title: 'Pier / market / free views',
            category: 'attraction',
            estCost: 100 * travelers,
            note: 'Mostly free walking',
          },
          {
            time: 'Evening',
            title: 'Simple dinner near hotel',
            category: 'restaurant',
            estCost: Math.round(FOOD_PERSON_DAY_ETB.budget.typical * 0.45 * travelers),
            note: 'Save on transport',
          },
        ]
      : tier === 'mid'
        ? [
            {
              time: 'Morning',
              title: 'Hotel breakfast + lake area',
              category: 'hotel',
              estCost: 0,
              note: 'Often included — confirm',
            },
            {
              time: 'Day',
              title: 'Blue Nile Falls outing',
              category: 'attraction',
              estCost: Math.round(
                ATTRACTION_ETB.blueNileFallsEntry.typical * travelers +
                  ATTRACTION_ETB.privateCarFallsRoundTrip.typical * 0.35 +
                  ATTRACTION_ETB.blueNileFallsGuide.typical * 0.5
              ),
              note: 'Entry + share of car/guide estimates',
            },
            {
              time: 'Lunch',
              title: 'Restaurant meal',
              category: 'restaurant',
              estCost: Math.round(FOOD_PERSON_DAY_ETB.mid.typical * 0.4 * travelers),
              note: 'Fish or tibs plate',
            },
            {
              time: 'Evening',
              title: 'Lakeside dinner',
              category: 'restaurant',
              estCost: Math.round(FOOD_PERSON_DAY_ETB.mid.typical * 0.5 * travelers),
              note: '',
            },
          ]
        : [
            {
              time: 'Morning',
              title: 'Comfort hotel + breakfast',
              category: 'hotel',
              estCost: 0,
              note: 'Included if negotiated',
            },
            {
              time: 'Day',
              title: 'Lake Tana boat + monastery',
              category: 'attraction',
              estCost: Math.round(
                (ATTRACTION_ETB.lakeTanaBoatPrivateHalfDay.typical + ATTRACTION_ETB.monasteryEntry.typical * 2) /
                  Math.max(travelers, 1)
              ),
              note: 'Private boat share + entries',
            },
            {
              time: 'Lunch',
              title: 'Lakeside / hotel restaurant',
              category: 'restaurant',
              estCost: Math.round(FOOD_PERSON_DAY_ETB.comfort.typical * 0.45 * travelers),
              note: '',
            },
            {
              time: 'Evening',
              title: 'Fine local dining',
              category: 'restaurant',
              estCost: Math.round(FOOD_PERSON_DAY_ETB.comfort.typical * 0.5 * travelers),
              note: '',
            },
          ]

  const warnings: string[] = []
  if (cash < 2000) warnings.push('Very low budget — prioritize local meals and free walks; paid lodging may be difficult.')
  if (cashPerPersonPerDay < 2000)
    warnings.push('Under ~2,000 ETB per person per day: focus on guesthouses, local food, and free lakeshore.')
  if (days >= 5 && tier === 'budget')
    warnings.push('Long trip on a tight budget: share rooms, eat local, limit private boats.')
  if (travelers > 4) warnings.push('Larger groups: negotiate room blocks and shared boat/car rates.')
  warnings.push(PRICE_META.disclaimer)

  const summary =
    cash <= 0
      ? 'Enter how much money you have to see a personalized Bahir Dar plan.'
      : `With ${cash.toLocaleString()} ETB for ${travelers} traveler${travelers > 1 ? 's' : ''} over ${days} day${days > 1 ? 's' : ''}, you are in a ${tier} band (~${Math.round(cashPerPersonPerDay).toLocaleString()} ETB per person per day). Prices reviewed ${PRICE_META.lastReviewed} — confirm live rates before you pay.`

  return {
    tier,
    dailyBudget: Math.round(dailyBudget),
    perPersonTotal: Math.round(perPersonTotal),
    allocation,
    suggestions,
    sampleDay,
    warnings,
    summary,
    priceMeta: PRICE_META,
  }
}

export const TIER_LABEL: Record<SpendTier, string> = {
  budget: 'Budget',
  mid: 'Mid-range',
  comfort: 'Comfort',
}
