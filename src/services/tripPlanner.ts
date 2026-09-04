/**
 * Offline-first Bahir Dar trip planner.
 * Realistic day sequencing + local price bands (ETB).
 *
 * Classic patterns:
 * - 1 day both: morning boat (short Zege) + afternoon Falls (tight)
 * - 2 days both: Day 1 monasteries boat, Day 2 Blue Nile Falls
 * - 3+ days: city orientation → boat → Falls → flexible
 */

import {
  ATTRACTION_ETB,
  FOOD_PERSON_DAY_ETB,
  HOTEL_NIGHT_ETB,
  TRANSPORT_DAY_ETB,
} from '@/data/bahirDarPrices'
import { BAHIR_DAR_ITINERARIES, type GuideItinerary } from '@/data/itineraries'
import { estimateTripBudget } from '@/utils/budget'
import { sendGuideMessage } from '@/services/aiGuide'
import type { ChatMessage } from '@/types/ai'

export type PlannerBudget = 'budget' | 'mid' | 'comfort'
export type PlannerPace = 'relaxed' | 'moderate' | 'active'
export type PlannerInterest =
  | 'nature'
  | 'culture'
  | 'food'
  | 'shopping'
  | 'photography'
  | 'family'

export type PlannerInput = {
  days: number
  travelers: number
  budget: PlannerBudget
  pace: PlannerPace
  interests: PlannerInterest[]
  includeFalls: boolean
  includeBoat: boolean
  nights?: number
}

export type PlannerStop = {
  name: string
  time?: string
  duration?: string
  notes?: string
  estimatedCostEtb?: number
  placeSlug?: string
  kind: 'sight' | 'food' | 'transport' | 'rest' | 'shop'
}

export type PlannerDay = {
  dayNumber: number
  title: string
  summary: string
  stops: PlannerStop[]
  mealsTip?: string
  transportTip?: string
}

export type BudgetLine = {
  key: string
  label: string
  amount: number
  note?: string
}

export type PlannerResult = {
  title: string
  subtitle: string
  days: PlannerDay[]
  tips: string[]
  budget: {
    total: number
    perPerson: number
    perDay: number
    lodging: number
    food: number
    transport: number
    attraction: number
    shopping: number
    other: number
    currency: 'ETB'
    disclaimer: string
    lines: BudgetLine[]
    travelers: number
    nights: number
    daysCount: number
  }
  matchedGuideId?: string
  interests: PlannerInterest[]
}

function clampDays(d: number) {
  return Math.min(7, Math.max(1, Math.floor(d) || 1))
}

function lodgingRate(tier: PlannerBudget) {
  if (tier === 'budget') return HOTEL_NIGHT_ETB.budget.typical
  if (tier === 'comfort') return HOTEL_NIGHT_ETB.comfort.typical
  return HOTEL_NIGHT_ETB.mid.typical
}

function foodRate(tier: PlannerBudget) {
  if (tier === 'budget') return FOOD_PERSON_DAY_ETB.budget.typical
  if (tier === 'comfort') return FOOD_PERSON_DAY_ETB.comfort.typical
  return FOOD_PERSON_DAY_ETB.mid.typical
}

function transportDay(tier: PlannerBudget) {
  if (tier === 'budget') return TRANSPORT_DAY_ETB.budget.typical
  if (tier === 'comfort') return TRANSPORT_DAY_ETB.comfort.typical
  return TRANSPORT_DAY_ETB.mid.typical
}

/** Per-person boat cost by tier (shared vs private) */
function boatCostPerPerson(tier: PlannerBudget): number {
  if (tier === 'budget') return ATTRACTION_ETB.lakeTanaBoatSharedHalfDay.min + 200
  if (tier === 'comfort') return ATTRACTION_ETB.lakeTanaBoatPrivateHalfDay.typical
  return ATTRACTION_ETB.lakeTanaBoatSharedHalfDay.typical
}

/** Falls transport per person (bus vs share of private car) */
function fallsTransportPerPerson(tier: PlannerBudget, travelers: number): number {
  if (tier === 'budget') {
    return ATTRACTION_ETB.busToTisAbay.typical * 2 // round trip bus
  }
  // mid/comfort: share private car round-trip
  const car = tier === 'comfort'
    ? ATTRACTION_ETB.privateCarFallsRoundTrip.max
    : ATTRACTION_ETB.privateCarFallsRoundTrip.typical
  return Math.round(car / Math.max(1, travelers))
}

function bestGuideMatch(input: PlannerInput): GuideItinerary | undefined {
  const days = clampDays(input.days)
  let best: { g: GuideItinerary; score: number } | null = null

  for (const g of BAHIR_DAR_ITINERARIES) {
    let score = 0
    score += Math.max(0, 10 - Math.abs(g.days - days) * 3)
    if (input.budget === 'budget' && g.tags.includes('budget')) score += 8
    if (input.budget === 'comfort' && g.tags.includes('comfort')) score += 6
    if (input.pace === g.pace) score += 5
    if (input.interests.includes('nature') && g.tags.includes('nature')) score += 4
    if (input.interests.includes('culture') && g.tags.includes('culture')) score += 4
    if (input.interests.includes('family') && g.tags.includes('family')) score += 4
    if (days <= 2 && g.tags.includes('weekend')) score += 3
    if (days === 1 && g.days === 1) score += 5
    if (!best || score > best.score) best = { g, score }
  }
  return best?.g
}

function cityDay(opts: {
  food: number
  withMarket: boolean
  withViewpoint: boolean
  pace: PlannerPace
}): PlannerDay {
  const stops: PlannerStop[] = [
    {
      name: 'Lake Tana shore / pier area',
      time: '08:00',
      duration: '1–1.5 h',
      notes:
        'Palm promenade, fishing boats, birds. Good orientation and photos in soft morning light.',
      estimatedCostEtb: 0,
      placeSlug: 'lake-tana',
      kind: 'sight',
    },
    {
      name: 'Coffee break',
      time: '09:30',
      duration: '30–45 min',
      notes: 'Macchiato or full coffee ceremony — ask hotels for a quiet café.',
      estimatedCostEtb: 80,
      kind: 'food',
    },
  ]
  if (opts.withViewpoint) {
    stops.push({
      name: 'Bezawit Palace Viewpoint',
      time: '11:00',
      duration: '1–1.5 h',
      notes: 'Panorama over Lake Tana and the Blue Nile outlet. Small fee possible.',
      estimatedCostEtb: ATTRACTION_ETB.bezawitHill.typical,
      placeSlug: 'bezawit-palace-viewpoint',
      kind: 'sight',
    })
  }
  stops.push({
    name: 'Lunch — lake fish or injera',
    time: '13:00',
    duration: '1 h',
    notes: 'Try Nile perch or traditional tibs / shiro with injera.',
    estimatedCostEtb: Math.round(opts.food / 2),
    kind: 'food',
  })
  if (opts.withMarket) {
    stops.push({
      name: 'Bahir Dar Central Market',
      time: '15:00',
      duration: '1–1.5 h',
      notes: 'Spices, coffee, produce, crafts. Keep bags secure; bargain politely.',
      estimatedCostEtb: 200,
      placeSlug: 'bahir-dar-central-market',
      kind: 'shop',
    })
  }
  stops.push({
    name: 'Sunset lakeside + dinner',
    time: '17:30',
    duration: '2 h',
    notes: 'Promenade walk; dinner near the lake or in town.',
    estimatedCostEtb: Math.round(opts.food / 2),
    kind: 'food',
  })
  return {
    dayNumber: 1,
    title: 'City · Lake · Viewpoint',
    summary:
      'Shore walk, viewpoint, market energy, and a proper dinner — ideal first day to settle in.',
    stops,
    mealsTip: `Food band ~${Math.round(opts.food * 0.8)}–${Math.round(opts.food * 1.2)} ETB/person today.`,
    transportTip: 'Walk + short bajaj hops. Agree the price before you start.',
  }
}

function boatDay(opts: {
  food: number
  budget: PlannerBudget
  short?: boolean
}): PlannerDay {
  const boat = boatCostPerPerson(opts.budget)
  const entry = ATTRACTION_ETB.monasteryEntry.typical
  const duration = opts.short ? '3–3.5 h' : '4–5.5 h'
  return {
    dayNumber: 2,
    title: opts.short
      ? 'Lake Tana monasteries (short)'
      : 'Lake Tana monasteries (boat day)',
    summary: opts.short
      ? 'Morning boat to Zege Peninsula (Ura Kidane Mehret). Afternoon free for Falls if same day.'
      : 'Full morning boat to Zege / island monasteries; afternoon rest by the shore.',
    stops: [
      {
        name: 'Lake Tana Boat Pier',
        time: '07:45',
        duration: '20–30 min',
        notes:
          'Compare 2–3 operators. Agree price, islands, and return time in ETB before boarding. Hotels often arrange trusted boats.',
        estimatedCostEtb: 0,
        placeSlug: 'lake-tana-boat-pier',
        kind: 'transport',
      },
      {
        name: 'Boat + monastery (Ura Kidane Mehret / Zege)',
        time: '08:15',
        duration,
        notes:
          'Modest dress required; shoes off inside churches. Entry is usually separate from the boat fee. Frescoes & manuscripts are the highlight.',
        estimatedCostEtb: boat + entry,
        placeSlug: 'ura-kidane-mehret',
        kind: 'sight',
      },
      {
        name: opts.short ? 'Quick lunch near pier' : 'Late lunch + rest',
        time: opts.short ? '12:00' : '14:00',
        duration: opts.short ? '45 min' : '2 h',
        notes: opts.short
          ? 'Eat quickly if continuing to the Falls the same afternoon.'
          : 'Shade and water after the boat — heat builds fast.',
        estimatedCostEtb: Math.round(opts.food / 2),
        kind: 'food',
      },
      ...(opts.short
        ? []
        : [
            {
              name: 'Optional Bezawit or hippo boat',
              time: '16:30',
              duration: '1–1.5 h',
              notes: 'Skip if tired. Short hippo/bird boat near the outlet is popular.',
              estimatedCostEtb: ATTRACTION_ETB.hippoBoat.typical,
              placeSlug: 'bezawit-palace-viewpoint',
              kind: 'sight' as const,
            },
          ]),
    ],
    mealsTip: 'Keep dinner lighter after a long boat morning.',
    transportTip: 'Bajaj hotel → pier. Morning departures are calmer and cooler.',
  }
}

function fallsDay(opts: {
  food: number
  budget: PlannerBudget
  travelers: number
  afternoonOnly?: boolean
}): PlannerDay {
  const road = fallsTransportPerPerson(opts.budget, opts.travelers)
  const entry = ATTRACTION_ETB.blueNileFallsEntry.typical
  const start = opts.afternoonOnly ? '13:00' : '07:30'
  return {
    dayNumber: 3,
    title: opts.afternoonOnly
      ? 'Blue Nile Falls (afternoon)'
      : 'Blue Nile Falls (Tis Issat)',
    summary: opts.afternoonOnly
      ? 'Afternoon drive ~30–40 km to Tis Abay after a morning boat. Tight schedule — start early if combining.'
      : 'Full day trip ~30–40 km to Tis Abay. Strongest flow after rains (Jun–Oct); paths can be steep and muddy.',
    stops: [
      {
        name: 'Depart for Tis Abay',
        time: start,
        duration: '45–75 min each way',
        notes:
          opts.budget === 'budget'
            ? 'Local bus/minibus is cheapest. Confirm return times.'
            : 'Private car from hotel is easier for groups and flexible timing.',
        estimatedCostEtb: Math.round(road),
        kind: 'transport',
      },
      {
        name: 'Blue Nile Falls (Tis Issat)',
        time: opts.afternoonOnly ? '14:15' : '09:00',
        duration: opts.afternoonOnly ? '2–2.5 h' : '2.5–4 h',
        notes:
          'Entry ticket + optional local guide. Wear grip shoes; pack water. Portuguese bridge viewpoint is classic. Hydro diversion can reduce flow in dry months.',
        estimatedCostEtb: entry,
        placeSlug: 'blue-nile-falls-tis-issat',
        kind: 'sight',
      },
      {
        name: opts.afternoonOnly ? 'Return + dinner' : 'Return + city dinner',
        time: opts.afternoonOnly ? '17:00' : '15:00',
        duration: '—',
        notes: 'Buffer for showers and a proper meal back in Bahir Dar.',
        estimatedCostEtb: Math.round(opts.food / 2),
        kind: 'food',
      },
    ],
    mealsTip: 'Pack a snack — options near the falls village are limited.',
    transportTip: 'Confirm return time with your driver or bus. Roads can be slow after rain.',
  }
}

function combinedOneDay(opts: {
  food: number
  budget: PlannerBudget
  travelers: number
}): PlannerDay {
  const boat = boatCostPerPerson(opts.budget)
  const entryM = ATTRACTION_ETB.monasteryEntry.typical
  const road = fallsTransportPerPerson(opts.budget, opts.travelers)
  const entryF = ATTRACTION_ETB.blueNileFallsEntry.typical
  return {
    dayNumber: 1,
    title: 'Boat + Falls (packed day)',
    summary:
      'Classic but tight: morning Zege boat, afternoon Blue Nile Falls. Start by 07:30. Best with a private driver.',
    stops: [
      {
        name: 'Early boat from Lake Tana pier',
        time: '07:30',
        duration: '3 h',
        notes: 'Short Zege run (Ura Kidane Mehret). Agree return by ~11:00.',
        estimatedCostEtb: boat + entryM,
        placeSlug: 'ura-kidane-mehret',
        kind: 'sight',
      },
      {
        name: 'Quick lunch',
        time: '11:15',
        duration: '40 min',
        notes: 'Eat near the pier or hotel before the road trip.',
        estimatedCostEtb: Math.round(opts.food * 0.4),
        kind: 'food',
      },
      {
        name: 'Drive to Tis Abay + Blue Nile Falls',
        time: '12:00',
        duration: '3–3.5 h on site incl. drive',
        notes: 'Entry + walk to viewpoints / Portuguese bridge. Return before dark.',
        estimatedCostEtb: road + entryF,
        placeSlug: 'blue-nile-falls-tis-issat',
        kind: 'sight',
      },
      {
        name: 'Dinner in Bahir Dar',
        time: '18:30',
        duration: '1.5 h',
        notes: 'Reward yourself — this is a full active day.',
        estimatedCostEtb: Math.round(opts.food * 0.5),
        kind: 'food',
      },
    ],
    mealsTip: 'Carry water and a snack; little time for long meals.',
    transportTip: 'Private car recommended when packing both into one day.',
  }
}

function slowDay(opts: { food: number; interest: PlannerInterest[] }): PlannerDay {
  const foodFocus = opts.interest.includes('food')
  const shopFocus = opts.interest.includes('shopping')
  const photoFocus = opts.interest.includes('photography')
  return {
    dayNumber: 4,
    title: foodFocus
      ? 'Food & coffee culture'
      : shopFocus
        ? 'Market & crafts day'
        : photoFocus
          ? 'Photo walk · lake light'
          : 'Slow city day',
    summary: foodFocus
      ? 'Injera houses, lake fish, and coffee — no long road trips.'
      : 'Market, crafts, and lake time at an easy pace.',
    stops: [
      {
        name: 'Morning coffee & people-watching',
        time: '09:00',
        duration: '45 min',
        estimatedCostEtb: 80,
        kind: 'food',
        notes: 'Traditional ceremony or lakeside café.',
      },
      {
        name: shopFocus ? 'Crafts & souvenirs' : 'Central Market',
        time: '10:30',
        duration: '1.5 h',
        placeSlug: 'bahir-dar-central-market',
        estimatedCostEtb: shopFocus ? 500 : 150,
        kind: 'shop',
        notes: 'Bargain politely; compare quality on coffee, textiles, and baskets.',
      },
      {
        name: foodFocus ? 'Lake fish lunch' : 'Traditional lunch',
        time: '13:00',
        duration: '1 h',
        estimatedCostEtb: Math.round(opts.food / 2),
        kind: 'food',
      },
      {
        name: photoFocus ? 'Golden-hour lake photos' : 'Lake shore rest',
        time: '16:00',
        duration: '1.5 h',
        placeSlug: 'lake-tana',
        estimatedCostEtb: 0,
        kind: 'rest',
        notes: 'Promenade and pier area are best near sunset.',
      },
      {
        name: 'Dinner',
        time: '19:00',
        duration: '1.5 h',
        estimatedCostEtb: Math.round(opts.food / 2),
        kind: 'food',
      },
    ],
    transportTip: 'Mostly walkable from center hotels.',
  }
}

export function dayActivityTotal(day: PlannerDay): number {
  return day.stops.reduce((sum, s) => sum + (s.estimatedCostEtb ?? 0), 0)
}

/**
 * Build a realistic Bahir Dar plan from preferences.
 * Sequencing rules (real tourist patterns):
 * 1d boat only → boat day
 * 1d falls only → falls day
 * 1d both → packed combined day
 * 2d both → Day1 boat, Day2 falls (classic weekend)
 * 3d+ → city → boat → falls → flexible
 */
export function buildTripPlan(input: PlannerInput): PlannerResult {
  const days = clampDays(input.days)
  const travelers = Math.max(1, Math.floor(input.travelers) || 1)
  const nights =
    input.nights != null ? Math.max(0, input.nights) : Math.max(0, days - 1)
  const foodPer = foodRate(input.budget)
  const wantBoat = input.includeBoat !== false
  const wantFalls = input.includeFalls !== false
  const matched = bestGuideMatch(input)

  const planDays: PlannerDay[] = []

  // ——— 1-day special cases ———
  if (days === 1) {
    if (wantBoat && wantFalls) {
      planDays.push(
        combinedOneDay({ food: foodPer, budget: input.budget, travelers })
      )
    } else if (wantBoat) {
      const d = boatDay({ food: foodPer, budget: input.budget, short: false })
      d.dayNumber = 1
      planDays.push(d)
    } else if (wantFalls) {
      const d = fallsDay({
        food: foodPer,
        budget: input.budget,
        travelers,
      })
      d.dayNumber = 1
      planDays.push(d)
    } else {
      planDays.push(
        cityDay({
          food: foodPer,
          withMarket: true,
          withViewpoint: true,
          pace: input.pace,
        })
      )
    }
  }

  // ——— 2-day classic weekend: boat then falls ———
  else if (days === 2 && wantBoat && wantFalls) {
    const d1 = boatDay({ food: foodPer, budget: input.budget })
    d1.dayNumber = 1
    planDays.push(d1)
    const d2 = fallsDay({ food: foodPer, budget: input.budget, travelers })
    d2.dayNumber = 2
    planDays.push(d2)
  }

  // ——— 2-day boat only / falls only / neither ———
  else if (days === 2) {
    const d1 = cityDay({
      food: foodPer,
      withMarket: true,
      withViewpoint: true,
      pace: input.pace,
    })
    d1.dayNumber = 1
    planDays.push(d1)
    if (wantBoat) {
      const d2 = boatDay({ food: foodPer, budget: input.budget })
      d2.dayNumber = 2
      planDays.push(d2)
    } else if (wantFalls) {
      const d2 = fallsDay({ food: foodPer, budget: input.budget, travelers })
      d2.dayNumber = 2
      planDays.push(d2)
    } else {
      const d2 = slowDay({ food: foodPer, interest: input.interests })
      d2.dayNumber = 2
      planDays.push(d2)
    }
  }

  // ——— 3+ days: city → boat → falls → fill ———
  else {
    planDays.push(
      cityDay({
        food: foodPer,
        withMarket:
          input.interests.includes('shopping') ||
          input.interests.includes('food') ||
          true,
        withViewpoint: input.pace !== 'relaxed',
        pace: input.pace,
      })
    )

    if (wantBoat) {
      const d = boatDay({ food: foodPer, budget: input.budget })
      planDays.push(d)
    }

    if (wantFalls) {
      const d = fallsDay({ food: foodPer, budget: input.budget, travelers })
      planDays.push(d)
    }

    while (planDays.length < days) {
      const d = slowDay({ food: foodPer, interest: input.interests })
      d.title = `Flexible day ${planDays.length + 1}`
      planDays.push(d)
    }
  }

  const finalDays = planDays.slice(0, days).map((d, i) => ({
    ...d,
    dayNumber: i + 1,
  }))

  // ——— Realistic per-person attraction total ———
  let attractionPer = 0
  if (wantBoat) {
    attractionPer += boatCostPerPerson(input.budget) + ATTRACTION_ETB.monasteryEntry.typical
  }
  if (wantFalls) {
    attractionPer +=
      ATTRACTION_ETB.blueNileFallsEntry.typical +
      fallsTransportPerPerson(input.budget, travelers)
  }
  attractionPer += 150
  if (!wantBoat && !wantFalls) attractionPer = 250

  const shoppingTotal = input.interests.includes('shopping')
    ? 600 * travelers
    : 200 * travelers
  const otherTotal = 350 * travelers

  const localTransport =
    transportDay(input.budget) * days * Math.max(1, Math.ceil(travelers / 2))

  const est = estimateTripBudget({
    travelers,
    nights,
    lodgingPerNight: lodgingRate(input.budget),
    foodPerDay: foodPer,
    transportTotal: localTransport,
    attractionsPerPerson: attractionPer,
    shopping: shoppingTotal,
    other: otherTotal,
    foodDays: days,
  })

  const lodging = Math.round(est.lodging)
  const food = Math.round(est.food)
  const transport = Math.round(est.transport)
  const attraction = Math.round(est.attraction)
  const shopping = Math.round(est.shopping)
  const other = Math.round(est.other)
  const total = Math.round(est.total)

  const rooms = Math.max(1, Math.ceil(travelers / 2))
  const lines: BudgetLine[] = [
    {
      key: 'lodging',
      label: 'Lodging / hotel',
      amount: lodging,
      note:
        nights > 0
          ? `${nights} night(s) × ${rooms} room(s) × ~${lodgingRate(input.budget).toLocaleString()} ETB`
          : 'Day trip — little or no lodging',
    },
    {
      key: 'food',
      label: 'Food & drinks',
      amount: food,
      note: `~${foodPer.toLocaleString()} ETB/person/day × ${days} day(s)`,
    },
    {
      key: 'transport',
      label: 'Local transport (bajaj)',
      amount: transport,
      note: 'City hops only — Falls/boat road costs are under Activities',
    },
    {
      key: 'attraction',
      label: 'Activities & entries',
      amount: attraction,
      note: wantBoat || wantFalls
        ? [
            wantBoat ? 'Lake Tana boat + monastery entry' : null,
            wantFalls ? 'Falls ticket + road transport' : null,
          ]
            .filter(Boolean)
            .join(' · ')
        : 'City sights & small fees',
    },
    {
      key: 'shopping',
      label: 'Shopping / souvenirs',
      amount: shopping,
      note: input.interests.includes('shopping')
        ? 'Higher — shopping focus'
        : 'Light buffer',
    },
    {
      key: 'other',
      label: 'Misc / buffer',
      amount: other,
      note: 'ATM fees, tips, water, unexpected costs',
    },
  ]

  const tips = [
    'Prices are estimates in ETB — confirm boats, cars, and meals on site before paying.',
    'Carry cash; ATMs can run dry on busy days. Larger hotels often take cards.',
    'Start boat and Falls trips early; midday heat is strong and boats fill up.',
    'Modest dress for monasteries (shoulders/knees covered); shoes off inside churches.',
    wantFalls
      ? 'Blue Nile Falls flow is strongest Jun–Oct; dry season can look weak due to hydro diversion.'
      : 'Ask your hotel about current lake conditions and trusted boat operators.',
    input.budget === 'budget'
      ? 'Share boats and guides when you can; walk more than bajaj to save.'
      : 'Hotels can arrange trusted drivers for the Falls day — agree a fixed ETB price.',
  ]

  const title =
    days === 1 ? 'Your 1-day Bahir Dar plan' : `Your ${days}-day Bahir Dar plan`

  const interestLabels = input.interests.length
    ? input.interests.join(', ')
    : 'classic highlights'

  return {
    title,
    subtitle: `${travelers} traveler${travelers > 1 ? 's' : ''} · ${input.budget} budget · ${input.pace} pace · focus: ${interestLabels}`,
    days: finalDays,
    tips,
    budget: {
      total,
      perPerson: Math.round(est.perPerson),
      perDay: Math.round(est.perDay),
      lodging,
      food,
      transport,
      attraction,
      shopping,
      other,
      currency: 'ETB',
      disclaimer:
        'Planning estimate only — not a quote. Boat, car, and hotel rates change; verify locally.',
      lines,
      travelers,
      nights,
      daysCount: days,
    },
    matchedGuideId: matched?.id,
    interests: input.interests,
  }
}

export async function narrateTripPlan(
  plan: PlannerResult,
  locale = 'en'
): Promise<{ text: string; fallback: boolean }> {
  const outline = plan.days
    .map(
      (d) =>
        `Day ${d.dayNumber}: ${d.title} — ` + d.stops.map((s) => s.name).join('; ')
    )
    .join('\n')

  const prompt =
    `Write a friendly short trip narrative (max 180 words) for Bahir Dar based on this plan.\n` +
    `${plan.title}\n${plan.subtitle}\n${outline}\n` +
    `Mention rough budget ~${plan.budget.total} ETB total for the group. Remind to verify prices locally. No markdown tables.`

  const history: ChatMessage[] = [
    {
      id: '1',
      role: 'user',
      content: prompt,
      createdAt: new Date().toISOString(),
    },
  ]

  try {
    const res = await sendGuideMessage(history, locale)
    return { text: res.reply, fallback: !!res.fallback }
  } catch {
    return {
      text:
        `Here's your plan in plain words: over ${plan.days.length} day(s) you'll mix lake time, ` +
        `city life, and the classic Bahir Dar highlights. Budget about ` +
        `${plan.budget.total.toLocaleString()} ETB for the group (${plan.budget.perPerson.toLocaleString()} per person). ` +
        `Confirm boat and transport prices at the pier and with drivers.`,
      fallback: true,
    }
  }
}

export function planToPlainText(plan: PlannerResult): string {
  const lines: string[] = [
    plan.title,
    plan.subtitle,
    '',
    'PRICING BREAKDOWN (ETB, estimates)',
    ...plan.budget.lines.map(
      (l) =>
        `  ${l.label}: ${l.amount.toLocaleString()}` +
        (l.note ? ` — ${l.note}` : '')
    ),
    `  TOTAL: ${plan.budget.total.toLocaleString()}  (~${plan.budget.perPerson.toLocaleString()} / person)`,
    plan.budget.disclaimer,
    '',
  ]
  for (const d of plan.days) {
    lines.push(`Day ${d.dayNumber}: ${d.title}`, d.summary)
    for (const s of d.stops) {
      const cost =
        s.estimatedCostEtb != null ? ` (~${s.estimatedCostEtb} ETB)` : ''
      lines.push(`  • ${s.time ? s.time + ' ' : ''}${s.name}${cost}`)
      if (s.notes) lines.push(`    ${s.notes}`)
    }
    lines.push('')
  }
  lines.push('Tips:', ...plan.tips.map((t) => `• ${t}`))
  return lines.join('\n')
}
