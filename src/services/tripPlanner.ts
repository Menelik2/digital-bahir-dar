/** Offline-first Bahir Dar trip planner — realistic day sequencing. */

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
  if (tier === 'comfort') return FOOD_PERSON_DAY_ETB.mid.max
  return FOOD_PERSON_DAY_ETB.mid.typical
}

function transportDay(tier: PlannerBudget) {
  if (tier === 'budget') return TRANSPORT_DAY_ETB.budget.typical
  if (tier === 'comfort') return TRANSPORT_DAY_ETB.mid.max
  return TRANSPORT_DAY_ETB.mid.typical
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

function cityDay(opts: { food: number; withMarket: boolean; withViewpoint: boolean }): PlannerDay {
  const stops: PlannerStop[] = [
    {
      name: 'Lake Tana shore / pier area',
      time: '08:00',
      duration: '1–1.5 h',
      notes: 'Morning light, boats, birds. Easy orientation walk.',
      estimatedCostEtb: 0,
      placeSlug: 'lake-tana',
      kind: 'sight',
    },
    {
      name: 'Coffee break',
      time: '09:30',
      duration: '30–45 min',
      notes: 'Local café — macchiato or traditional coffee.',
      estimatedCostEtb: 60,
      kind: 'food',
    },
  ]
  if (opts.withViewpoint) {
    stops.push({
      name: 'Bezawit Palace Viewpoint',
      time: '11:00',
      duration: '1–1.5 h',
      notes: 'Lake + Blue Nile outlet panorama. Small fee possible.',
      estimatedCostEtb: ATTRACTION_ETB.bezawitHill.typical,
      placeSlug: 'bezawit-palace-viewpoint',
      kind: 'sight',
    })
  }
  stops.push({
    name: 'Lunch — fish or injera',
    time: '13:00',
    duration: '1 h',
    notes: 'Lakeside fish or traditional tibs / shiro.',
    estimatedCostEtb: Math.round(opts.food / 2),
    kind: 'food',
  })
  if (opts.withMarket) {
    stops.push({
      name: 'Bahir Dar Central Market',
      time: '15:00',
      duration: '1–1.5 h',
      notes: 'Spices, coffee, produce. Keep bags secure; bargain politely.',
      estimatedCostEtb: 150,
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
    summary: 'Shore walk, viewpoint, market energy, and a proper dinner — ideal first day.',
    stops,
    mealsTip: `Food band ~${Math.round(opts.food * 0.8)}–${Math.round(opts.food * 1.2)} ETB/person today.`,
    transportTip: 'Walk + short bajaj hops. Agree price before you start.',
  }
}

function boatDay(opts: { food: number; budget: PlannerBudget }): PlannerDay {
  const boat =
    opts.budget === 'budget'
      ? ATTRACTION_ETB.lakeTanaBoatSharedHalfDay.min
      : opts.budget === 'comfort'
        ? ATTRACTION_ETB.lakeTanaBoatSharedHalfDay.max
        : ATTRACTION_ETB.lakeTanaBoatSharedHalfDay.typical
  return {
    dayNumber: 2,
    title: 'Lake Tana monasteries',
    summary: 'Morning boat to Zege / island monasteries; afternoon rest by the shore.',
    stops: [
      {
        name: 'Lake Tana Boat Pier',
        time: '08:00',
        duration: '30 min',
        notes: 'Compare 2–3 operators. Agree price, islands, and return time in ETB before boarding.',
        estimatedCostEtb: 0,
        placeSlug: 'lake-tana-boat-pier',
        kind: 'transport',
      },
      {
        name: 'Boat + monastery (e.g. Ura Kidane Mehret)',
        time: '08:30',
        duration: '4–5 h',
        notes: 'Modest dress (cover shoulders & knees); shoes off in churches. Entry often separate from boat fee.',
        estimatedCostEtb: boat + ATTRACTION_ETB.monasteryEntry.typical,
        placeSlug: 'ura-kidane-mehret',
        kind: 'sight',
      },
      {
        name: 'Late lunch + rest',
        time: '14:00',
        duration: '2 h',
        notes: 'Shade and water after the boat.',
        estimatedCostEtb: Math.round(opts.food / 2),
        kind: 'food',
      },
      {
        name: 'Optional Bezawit sunset',
        time: '17:00',
        duration: '1 h',
        notes: 'Skip if tired — heat adds up.',
        estimatedCostEtb: ATTRACTION_ETB.bezawitHill.typical,
        placeSlug: 'bezawit-palace-viewpoint',
        kind: 'sight',
      },
    ],
    mealsTip: 'Keep dinner lighter after a big late lunch.',
    transportTip: 'Bajaj hotel → pier. Morning departures are calmer.',
  }
}

function fallsDay(opts: { food: number; budget: PlannerBudget }): PlannerDay {
  const road =
    opts.budget === 'budget'
      ? ATTRACTION_ETB.busToTisAbay.typical * 2
      : ATTRACTION_ETB.privateCarFallsRoundTrip.typical / 3
  return {
    dayNumber: 3,
    title: 'Blue Nile Falls (Tis Issat)',
    summary: 'Day trip ~30 km to Tis Abay. Strongest flow after rains; paths can be steep.',
    stops: [
      {
        name: 'Depart for Tis Abay',
        time: '07:30',
        duration: '45–75 min each way',
        notes: 'Bus/minibus is cheapest; private car is easier in a group — split the vehicle fee.',
        estimatedCostEtb: Math.round(road),
        kind: 'transport',
      },
      {
        name: 'Blue Nile Falls (Tis Issat)',
        time: '09:00',
        duration: '2–4 h',
        notes: 'Entry + optional guide. Grip shoes; pack water. Strongest flow Jun–Sep.',
        estimatedCostEtb: ATTRACTION_ETB.blueNileFallsEntry.typical,
        placeSlug: 'blue-nile-falls-tis-issat',
        kind: 'sight',
      },
      {
        name: 'Return + city dinner',
        time: '15:00',
        duration: '—',
        notes: 'Buffer for showers and a proper meal back in Bahir Dar.',
        estimatedCostEtb: Math.round(opts.food / 2),
        kind: 'food',
      },
    ],
    mealsTip: 'Pack a snack — village options are limited near the falls.',
    transportTip: 'Confirm return time with your driver or bus.',
  }
}

function slowDay(opts: { food: number; interest: PlannerInterest[] }): PlannerDay {
  const foodFocus = opts.interest.includes('food')
  const shopFocus = opts.interest.includes('shopping')
  return {
    dayNumber: 4,
    title: foodFocus ? 'Food & coffee culture' : 'Slow city day',
    summary: foodFocus
      ? 'Injera houses, lake fish, and coffee — no long road trips.'
      : 'Market, crafts, and lake time at an easy pace.',
    stops: [
      { name: 'Morning coffee & people-watching', time: '09:00', estimatedCostEtb: 80, kind: 'food' },
      {
        name: shopFocus ? 'Crafts & souvenirs' : 'Central Market',
        time: '10:30',
        placeSlug: 'bahir-dar-central-market',
        estimatedCostEtb: shopFocus ? 400 : 150,
        kind: 'shop',
        notes: 'Bargain politely; compare quality.',
      },
      {
        name: foodFocus ? 'Lake fish lunch' : 'Traditional lunch',
        time: '13:00',
        estimatedCostEtb: Math.round(opts.food / 2),
        kind: 'food',
      },
      { name: 'Lake shore rest / photos', time: '16:00', placeSlug: 'lake-tana', estimatedCostEtb: 0, kind: 'rest' },
      { name: 'Dinner', time: '19:00', estimatedCostEtb: Math.round(opts.food / 2), kind: 'food' },
    ],
    transportTip: 'Mostly walkable from center hotels.',
  }
}

export function dayActivityTotal(day: PlannerDay): number {
  return day.stops.reduce((sum, s) => sum + (s.estimatedCostEtb ?? 0), 0)
}

export function buildTripPlan(input: PlannerInput): PlannerResult {
  const days = clampDays(input.days)
  const travelers = Math.max(1, Math.floor(input.travelers) || 1)
  const nights = input.nights != null ? Math.max(0, input.nights) : Math.max(0, days - 1)
  const foodPer = foodRate(input.budget)
  const matched = bestGuideMatch(input)

  const planDays: PlannerDay[] = []
  let dayNum = 1

  if (days === 1 && input.includeBoat && !input.includeFalls) {
    const d = boatDay({ food: foodPer, budget: input.budget })
    d.dayNumber = 1
    planDays.push(d)
  } else if (days === 1 && input.includeFalls && !input.includeBoat) {
    const d = fallsDay({ food: foodPer, budget: input.budget })
    d.dayNumber = 1
    planDays.push(d)
  } else if (days === 2 && input.includeBoat !== false && input.includeFalls !== false) {
    // Classic weekend: boat day 1, Falls day 2 (no wasted full city day)
  } else {
    const d = cityDay({
      food: foodPer,
      withMarket: input.interests.includes('shopping') || input.interests.includes('food') || days <= 2,
      withViewpoint: input.pace !== 'relaxed' || days === 1,
    })
    d.dayNumber = dayNum++
    planDays.push(d)
  }

  if (days >= 2) {
    if (input.includeBoat !== false) {
      const d = boatDay({ food: foodPer, budget: input.budget })
      d.dayNumber = dayNum++
      planDays.push(d)
    } else if (input.includeFalls) {
      const d = fallsDay({ food: foodPer, budget: input.budget })
      d.dayNumber = dayNum++
      planDays.push(d)
    } else {
      const d = slowDay({ food: foodPer, interest: input.interests })
      d.dayNumber = dayNum++
      planDays.push(d)
    }
  }

  // Falls on day 2 when both boat+falls on a 2-day trip, or day 3+ for longer trips
  if (input.includeFalls !== false && planDays.length < days) {
    const needFalls = days >= 3 || (days === 2 && input.includeBoat !== false)
    if (needFalls) {
      const d = fallsDay({ food: foodPer, budget: input.budget })
      d.dayNumber = dayNum++
      planDays.push(d)
    }
  }

  while (planDays.length < days) {
    const d = slowDay({ food: foodPer, interest: input.interests })
    d.dayNumber = dayNum++
    d.title = `Flexible city day ${d.dayNumber}`
    planDays.push(d)
  }

  const finalDays = planDays.slice(0, days).map((d, i) => ({ ...d, dayNumber: i + 1 }))

  const attractionPer =
    (input.includeBoat !== false ? ATTRACTION_ETB.lakeTanaBoatSharedHalfDay.typical * 0.7 : 0) +
    (input.includeFalls !== false && days >= 2
      ? ATTRACTION_ETB.blueNileFallsEntry.typical + ATTRACTION_ETB.busToTisAbay.typical
      : 200)

  const shoppingTotal = input.interests.includes('shopping') ? 500 * travelers : 200 * travelers
  const otherTotal = 300 * travelers

  const est = estimateTripBudget({
    travelers,
    nights,
    lodgingPerNight: lodgingRate(input.budget),
    foodPerDay: foodPer,
    transportTotal: transportDay(input.budget) * days * Math.max(1, Math.ceil(travelers / 2)),
    attractionsPerPerson: attractionPer,
    shopping: shoppingTotal,
    other: otherTotal,
  })

  const lodging = Math.round(est.lodging)
  const food = Math.round(est.food)
  const transport = Math.round(est.transport)
  const attraction = Math.round(est.attraction)
  const shopping = Math.round(est.shopping)
  const other = Math.round(est.other)
  const total = Math.round(est.total)

  const lines: BudgetLine[] = [
    {
      key: 'lodging',
      label: 'Lodging / hotel',
      amount: lodging,
      note: nights > 0 ? `${nights} night(s) × ${Math.max(1, Math.ceil(travelers / 2))} room(s) × ~${lodgingRate(input.budget).toLocaleString()} ETB` : 'Day trip — little or no lodging',
    },
    {
      key: 'food',
      label: 'Food & drinks',
      amount: food,
      note: `~${foodPer.toLocaleString()} ETB/person/day × ${days} day(s)`,
    },
    {
      key: 'transport',
      label: 'Local transport',
      amount: transport,
      note: 'Bajaj, taxis, local hops (shared estimate)',
    },
    {
      key: 'attraction',
      label: 'Activities & entries',
      amount: attraction,
      note: 'Boats, falls, viewpoints (per-person band scaled to group)',
    },
    {
      key: 'shopping',
      label: 'Shopping / souvenirs',
      amount: shopping,
      note: input.interests.includes('shopping') ? 'Higher — shopping focus' : 'Light buffer',
    },
    {
      key: 'other',
      label: 'Misc / buffer',
      amount: other,
      note: 'ATM fees, tips, unexpected costs',
    },
  ]

  const tips = [
    'Prices are estimates in ETB — confirm boats, cars, and meals on site before paying.',
    'Carry cash; ATMs can run dry on weekends and holidays.',
    'Start boat and Falls trips early; midday heat is strong year-round.',
    'Modest dress for monasteries; shoes off in churches.',
    'Rainy season (Jun–Sep): Falls are strongest but trails are muddier.',
    input.budget === 'budget'
      ? 'Share boats and walk more than bajaj to keep costs down.'
      : 'Hotels can arrange trusted drivers for the Falls day — often worth it for a group.',
  ]

  const title = days === 1 ? 'Your 1-day Bahir Dar plan' : `Your ${days}-day Bahir Dar plan`
  const interestLabels = input.interests.length ? input.interests.join(', ') : 'classic highlights'

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
      disclaimer: 'Planning estimate only — not a quote. Verify boat, entry, and room rates locally.',
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
    .map((d) => `Day ${d.dayNumber}: ${d.title} — ` + d.stops.map((s) => s.name).join('; '))
    .join('\n')

  const prompt =
    `Write a friendly short trip narrative (max 180 words) for Bahir Dar based on this plan.\n` +
    `${plan.title}\n${plan.subtitle}\n${outline}\n` +
    `Mention rough budget ~${plan.budget.total} ETB total for the group. Remind to verify prices locally. No markdown tables.`

  const history: ChatMessage[] = [
    { id: '1', role: 'user', content: prompt, createdAt: new Date().toISOString() },
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
      (l) => `  ${l.label}: ${l.amount.toLocaleString()}` + (l.note ? ` — ${l.note}` : '')
    ),
    `  TOTAL: ${plan.budget.total.toLocaleString()}  (~${plan.budget.perPerson.toLocaleString()} / person)`,
    plan.budget.disclaimer,
    '',
  ]
  for (const d of plan.days) {
    lines.push(`Day ${d.dayNumber}: ${d.title}`, d.summary)
    for (const s of d.stops) {
      const cost = s.estimatedCostEtb != null ? ` (~${s.estimatedCostEtb} ETB)` : ''
      lines.push(`  • ${s.time ? s.time + ' ' : ''}${s.name}${cost}`)
      if (s.notes) lines.push(`    ${s.notes}`)
    }
    lines.push('')
  }
  lines.push('Tips:', ...plan.tips.map((t) => `• ${t}`))
  return lines.join('\n')
}
