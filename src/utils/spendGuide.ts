/**
 * Spend Guide — given cash on hand, suggest what a visitor can afford in Bahir Dar.
 * Estimates are planning defaults in ETB, not live prices.
 */

export type SpendTier = 'budget' | 'mid' | 'comfort'

export type SpendGuideInput = {
  /** Total money available for the trip (ETB) */
  cash: number
  /** Number of full days in the city */
  days: number
  travelers: number
  /** Prefer more lodging comfort vs more activities */
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
}

function n(v: unknown): number {
  const x = Number(v)
  return Number.isFinite(x) && x >= 0 ? x : 0
}

/** Rough Bahir Dar price bands (ETB) — illustrative */
const RATES = {
  hotel: { budget: 800, mid: 2500, comfort: 5000 }, // per room / night
  foodPerPersonDay: { budget: 350, mid: 800, comfort: 1500 },
  attractionDay: { budget: 200, mid: 800, comfort: 2000 }, // per person activities
  localTransportDay: { budget: 100, mid: 300, comfort: 800 }, // bajaj/taxi shared-ish
}

function pickTier(cashPerPersonPerDay: number): SpendTier {
  if (cashPerPersonPerDay < 1200) return 'budget'
  if (cashPerPersonPerDay < 3500) return 'mid'
  return 'comfort'
}

export function buildSpendGuide(input: SpendGuideInput): SpendGuideResult {
  const cash = Math.max(0, n(input.cash))
  const days = Math.max(1, Math.floor(n(input.days)) || 1)
  const travelers = Math.max(1, Math.floor(n(input.travelers)) || 1)
  const priority = input.priority ?? 'balanced'
  const nights = Math.max(1, days) // assume overnight stay for multi-day; 1 day still counts 1 night soft

  const perPersonTotal = cash / travelers
  const dailyBudget = cash / days
  const cashPerPersonPerDay = cash / travelers / days
  const tier = pickTier(cashPerPersonPerDay)

  // Allocation weights by priority
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
    hotelNightBudget >= RATES.hotel.comfort * 0.8
      ? 'comfort'
      : hotelNightBudget >= RATES.hotel.mid * 0.7
        ? 'mid'
        : 'budget'
  const foodTier: SpendTier =
    foodPersonDay >= RATES.foodPerPersonDay.comfort * 0.7
      ? 'comfort'
      : foodPersonDay >= RATES.foodPerPersonDay.mid * 0.7
        ? 'mid'
        : 'budget'
  const attrTier: SpendTier =
    attrPerson / days >= RATES.attractionDay.comfort * 0.5
      ? 'comfort'
      : attrPerson / days >= RATES.attractionDay.mid * 0.5
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
            : 'Comfort / lakeside hotel',
      why: `~${Math.round(hotelNightBudget).toLocaleString()} ETB per room/night from your plan (${rooms} room${rooms > 1 ? 's' : ''}).`,
      estCostPerUnit: RATES.hotel[hotelTier],
      unit: 'room / night',
      tips: [
        'Ask for room rate including breakfast.',
        'Confirm Wi‑Fi and hot water before paying.',
        hotelTier === 'budget' ? 'Shared facilities are common — check reviews locally.' : 'Book lakeside early in peak season.',
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
            ? 'Mix of local restaurants and hotel meals'
            : 'Hotel restaurants + lakeside dining',
      why: `~${Math.round(foodPersonDay).toLocaleString()} ETB per person per day for meals.`,
      estCostPerUnit: RATES.foodPerPersonDay[foodTier],
      unit: 'person / day',
      tips: [
        'Try shiro, tibs, lake fish where available.',
        'Street coffee is cheap; hotel breakfast often fills the morning.',
        'Carry small bills for local places.',
      ],
      explorePath: '/restaurants',
    },
    {
      category: 'attraction',
      tier: attrTier,
      title:
        attrTier === 'budget'
          ? 'City viewpoints, pier walks, free lakeshore'
          : attrTier === 'mid'
            ? 'Blue Nile Falls day trip + one boat option'
            : 'Falls, monasteries boat tour, guided day',
      why: `~${Math.round(attrPerson).toLocaleString()} ETB per person total for activities.`,
      estCostPerUnit: RATES.attractionDay[attrTier],
      unit: 'person / activity day',
      tips: [
        'Blue Nile Falls access fees change — confirm on site.',
        'Boat to monasteries: agree price before boarding.',
        'Combine nearby stops to save transport.',
      ],
      explorePath: '/attractions',
    },
    {
      category: 'transport',
      tier,
      title: tier === 'budget' ? 'Bajaj & walking' : tier === 'mid' ? 'Bajaj + occasional taxi' : 'Taxi / hired car days',
      why: `~${Math.round(allocation.transport / days).toLocaleString()} ETB / day shared transport budget.`,
      estCostPerUnit: RATES.localTransportDay[tier],
      unit: 'day (group)',
      tips: ['Agree bajaj fare before the ride.', 'Walk the lakeshore when safe and daylight.'],
      explorePath: '/transport',
    },
    {
      category: 'cafe',
      tier: foodTier,
      title: 'Coffee culture stops',
      why: 'Bahir Dar coffee is part of the experience; small daily spend.',
      estCostPerUnit: foodTier === 'budget' ? 50 : foodTier === 'mid' ? 120 : 250,
      unit: 'coffee stop',
      tips: ['Traditional coffee ceremony if offered.', 'Great for rest between sights.'],
      explorePath: '/explore',
    },
  ]

  const sampleDay: DayPlanItem[] =
    tier === 'budget'
      ? [
          { time: 'Morning', title: 'Lakeshore walk + coffee', category: 'cafe', estCost: 80 * travelers, note: 'Low cost, great orientation' },
          { time: 'Midday', title: 'Local lunch (injera)', category: 'restaurant', estCost: Math.round(foodPersonDay * 0.4 * travelers), note: 'Fill up at local prices' },
          { time: 'Afternoon', title: 'City / pier views', category: 'attraction', estCost: 100 * travelers, note: 'Mostly free walking' },
          { time: 'Evening', title: 'Simple dinner near hotel', category: 'restaurant', estCost: Math.round(foodPersonDay * 0.45 * travelers), note: 'Stay close to save transport' },
        ]
      : tier === 'mid'
        ? [
            { time: 'Morning', title: 'Hotel breakfast + lake view', category: 'hotel', estCost: 0, note: 'Often included — confirm' },
            { time: 'Day', title: 'Blue Nile Falls outing', category: 'attraction', estCost: Math.round((attrPerson / Math.max(days, 1)) * 0.7), note: 'Transport + entry estimates' },
            { time: 'Lunch', title: 'Restaurant near falls or return city', category: 'restaurant', estCost: Math.round(foodPersonDay * 0.45 * travelers), note: '' },
            { time: 'Evening', title: 'Lakeside dinner', category: 'restaurant', estCost: Math.round(foodPersonDay * 0.5 * travelers), note: 'Mid-range' },
          ]
        : [
            { time: 'Morning', title: 'Comfort hotel + breakfast', category: 'hotel', estCost: 0, note: 'Included if negotiated' },
            { time: 'Day', title: 'Private boat / monastery visit', category: 'attraction', estCost: Math.round(attrPerson / Math.max(days, 1)), note: 'Agree full price upfront' },
            { time: 'Lunch', title: 'Hotel or lakeside restaurant', category: 'restaurant', estCost: Math.round(foodPersonDay * 0.5 * travelers), note: '' },
            { time: 'Evening', title: 'Fine local dining', category: 'restaurant', estCost: Math.round(foodPersonDay * 0.5 * travelers), note: 'Reserve if busy' },
          ]

  const warnings: string[] = []
  if (cash < 500) warnings.push('Very low budget — prioritize food and free walks; lodging may not be realistic.')
  if (cashPerPersonPerDay < 800) warnings.push('Under ~800 ETB per person per day: focus on guesthouses and local meals.')
  if (days >= 5 && tier === 'budget') warnings.push('Long trip on a tight budget: cook or eat local, share rooms, limit paid tours.')
  if (travelers > 4) warnings.push('Larger groups: negotiate room blocks and shared bajaj/taxi rates.')

  const summary =
    cash <= 0
      ? 'Enter how much money you have to see a personalized Bahir Dar plan.'
      : `With ${cash.toLocaleString()} ETB for ${travelers} traveler${travelers > 1 ? 's' : ''} over ${days} day${days > 1 ? 's' : ''}, you are in a **${tier}** band (~${Math.round(cashPerPersonPerDay).toLocaleString()} ETB per person per day). Use the plan below for hotels, food, and visits — then confirm real prices on site.`

  return {
    tier,
    dailyBudget: Math.round(dailyBudget),
    perPersonTotal: Math.round(perPersonTotal),
    allocation,
    suggestions,
    sampleDay,
    warnings,
    summary,
  }
}

export const TIER_LABEL: Record<SpendTier, string> = {
  budget: 'Budget',
  mid: 'Mid-range',
  comfort: 'Comfort',
}
