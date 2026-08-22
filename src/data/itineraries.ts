/**
 * Curated Bahir Dar trip plans — real landmarks & practical pacing.
 * Price bands are planning estimates (see bahirDarPrices). Confirm on site.
 */

import {
  ATTRACTION_ETB,
  FOOD_PERSON_DAY_ETB,
  HOTEL_NIGHT_ETB,
  TRANSPORT_DAY_ETB,
  PRICE_META,
} from '@/data/bahirDarPrices'
import type { Trip, TripDay, TripExpense } from '@/types/trip'

export type ItineraryTag =
  | 'first-visit'
  | 'nature'
  | 'culture'
  | 'budget'
  | 'comfort'
  | 'family'
  | 'weekend'
  | 'slow'

export interface GuideStop {
  name: string
  time?: string
  duration?: string
  notes?: string
  estimatedCostEtb?: number
  placeSlug?: string
}

export interface GuideDay {
  dayNumber: number
  title: string
  summary: string
  stops: GuideStop[]
  mealsTip?: string
  transportTip?: string
}

export interface GuideItinerary {
  id: string
  title: string
  subtitle: string
  days: number
  tags: ItineraryTag[]
  bestFor: string
  pace: 'relaxed' | 'moderate' | 'active'
  budgetPerPersonEtb: { min: number; typical: number; max: number }
  highlights: string[]
  tips: string[]
  dayPlans: GuideDay[]
}

export const BAHIR_DAR_ITINERARIES: GuideItinerary[] = [
  {
    id: 'guide-perfect-day',
    title: 'Perfect 1 Day in Bahir Dar',
    subtitle: 'Lake shore, viewpoint, market energy, and a proper Ethiopian dinner',
    days: 1,
    tags: ['first-visit', 'weekend'],
    bestFor: 'Transit stops, first-timers, short layovers',
    pace: 'moderate',
    budgetPerPersonEtb: { min: 1500, typical: 3500, max: 7000 },
    highlights: ['Lake Tana shore walk', 'Bezawit viewpoint', 'Central market', 'Fish or injera dinner'],
    tips: [
      'Start early — midday sun is strong near the lake.',
      'Carry small ETB notes for bajaj and market snacks.',
      'Dress modestly if combining with a monastery visit another day.',
    ],
    dayPlans: [
      {
        dayNumber: 1,
        title: 'Lake · Viewpoint · City',
        summary: 'Morning lake air, midday viewpoint, afternoon town, evening food.',
        stops: [
          {
            name: 'Lake Tana shore / pier area',
            time: '07:30',
            duration: '1–1.5 h',
            notes: 'Watch boats, birds, lakeside life. Optional short boat only if time allows.',
            estimatedCostEtb: 0,
            placeSlug: 'lake-tana',
          },
          {
            name: 'Coffee break (local café)',
            time: '09:00',
            duration: '30–45 min',
            notes: 'Ethiopian coffee ceremony style or simple macchiato.',
            estimatedCostEtb: 80,
          },
          {
            name: 'Bezawit Palace Viewpoint',
            time: '10:30',
            duration: '1–1.5 h',
            notes: 'Blue Nile outlet + lake panorama. Small fee possible.',
            estimatedCostEtb: ATTRACTION_ETB.bezawitHill.typical,
            placeSlug: 'bezawit-palace-viewpoint',
          },
          {
            name: 'Blue Nile Bridge / outlet photos',
            time: '12:00',
            duration: '30 min',
            notes: 'Combine with Bezawit on the same loop.',
            estimatedCostEtb: 0,
            placeSlug: 'blue-nile-bridge-outlet',
          },
          {
            name: 'Lunch — fish or tibs',
            time: '13:00',
            duration: '1 h',
            notes: 'Try lake fish if available; injera + shiro for budget.',
            estimatedCostEtb: FOOD_PERSON_DAY_ETB.mid.typical / 2,
          },
          {
            name: 'Bahir Dar Central Market',
            time: '15:00',
            duration: '1–1.5 h',
            notes: 'Spices, coffee, produce. Keep bags zipped; bargain politely.',
            estimatedCostEtb: 200,
            placeSlug: 'bahir-dar-central-market',
          },
          {
            name: 'Sunset lakeside stroll + dinner',
            time: '17:30',
            duration: '2 h',
            notes: 'Golden hour on the shore; dinner near the lake or in town.',
            estimatedCostEtb: FOOD_PERSON_DAY_ETB.mid.typical / 2,
          },
        ],
        mealsTip: `Day food band ~${FOOD_PERSON_DAY_ETB.budget.typical}–${FOOD_PERSON_DAY_ETB.mid.typical} ETB/person.`,
        transportTip: `Bajaj hops; day transport ~${TRANSPORT_DAY_ETB.budget.typical}–${TRANSPORT_DAY_ETB.mid.typical} ETB.`,
      },
    ],
  },
  {
    id: 'guide-weekend-classic',
    title: 'Classic Weekend (2 Days)',
    subtitle: 'Day 1 lake & monasteries · Day 2 Blue Nile Falls',
    days: 2,
    tags: ['first-visit', 'nature', 'culture', 'weekend'],
    bestFor: 'The classic Bahir Dar combination most travelers want',
    pace: 'moderate',
    budgetPerPersonEtb: { min: 4000, typical: 9000, max: 18000 },
    highlights: ['Lake Tana monastery boat', 'Tis Issat (Blue Nile Falls)', 'Lakeside evenings'],
    tips: [
      'Book boats at the pier; agree shared vs private price before boarding.',
      'Falls are strongest after rainy season; paths can be slippery.',
      'Modest dress for monasteries; shoes off in churches.',
    ],
    dayPlans: [
      {
        dayNumber: 1,
        title: 'Lake Tana & monasteries',
        summary: 'Morning boat to island/Zege monasteries; afternoon rest and shore.',
        stops: [
          {
            name: 'Lake Tana Boat Pier',
            time: '08:00',
            duration: '30 min',
            notes: 'Compare operators; shared half-day is usually enough for first visit.',
            estimatedCostEtb: 0,
            placeSlug: 'lake-tana-boat-pier',
          },
          {
            name: 'Boat to monasteries (e.g. Ura Kidane Mehret / Zege)',
            time: '08:30',
            duration: '4–5 h',
            notes: `Boat often ${ATTRACTION_ETB.lakeTanaBoatSharedHalfDay.min}–${ATTRACTION_ETB.lakeTanaBoatSharedHalfDay.max} ETB shared; entry extra per site.`,
            estimatedCostEtb:
              ATTRACTION_ETB.lakeTanaBoatSharedHalfDay.typical + ATTRACTION_ETB.monasteryEntry.typical,
            placeSlug: 'ura-kidane-mehret',
          },
          {
            name: 'Late lunch + rest',
            time: '14:00',
            duration: '2 h',
            notes: 'Hydrate; shade after the boat.',
            estimatedCostEtb: FOOD_PERSON_DAY_ETB.mid.typical / 2,
          },
          {
            name: 'Evening lake promenade',
            time: '17:00',
            duration: '1.5 h',
            notes: 'Optional handicraft shopping near tourist strip.',
            estimatedCostEtb: 0,
          },
        ],
        mealsTip: 'Keep dinner lighter if you had a big late lunch.',
        transportTip: 'Walk + bajaj from hotel to pier.',
      },
      {
        dayNumber: 2,
        title: 'Blue Nile Falls (Tis Issat)',
        summary: 'Full or half-day trip to Tis Abay / Tis Issat falls.',
        stops: [
          {
            name: 'Depart for Tis Abay',
            time: '07:30',
            duration: '45–75 min each way',
            notes: `Bus cheap; private car ~${ATTRACTION_ETB.privateCarFallsRoundTrip.min}–${ATTRACTION_ETB.privateCarFallsRoundTrip.max} ETB round trip for the vehicle.`,
            estimatedCostEtb: ATTRACTION_ETB.busToTisAbay.typical * 2,
          },
          {
            name: 'Blue Nile Falls (Tis Issat)',
            time: '09:00',
            duration: '2–4 h',
            notes: `Entry ~${ATTRACTION_ETB.blueNileFallsEntry.min}–${ATTRACTION_ETB.blueNileFallsEntry.max} ETB; optional guide ~${ATTRACTION_ETB.blueNileFallsGuide.typical} ETB/group.`,
            estimatedCostEtb: ATTRACTION_ETB.blueNileFallsEntry.typical,
            placeSlug: 'blue-nile-falls-tis-issat',
          },
          {
            name: 'Return + city dinner',
            time: '14:00',
            duration: '—',
            notes: 'Back in Bahir Dar for showers and a proper meal.',
            estimatedCostEtb: FOOD_PERSON_DAY_ETB.mid.typical / 2,
          },
        ],
        mealsTip: 'Pack water and a snack; village options are limited.',
        transportTip: 'Shared transport or hotel car; confirm return time.',
      },
    ],
  },
  {
    id: 'guide-3-day-complete',
    title: 'Complete Bahir Dar (3 Days)',
    subtitle: 'City immersion + monasteries + falls — the balanced trip',
    days: 3,
    tags: ['first-visit', 'nature', 'culture'],
    bestFor: 'Most visitors with a long weekend',
    pace: 'moderate',
    budgetPerPersonEtb: {
      min: HOTEL_NIGHT_ETB.budget.typical * 2 + 3000,
      typical: HOTEL_NIGHT_ETB.mid.typical * 2 + 8000,
      max: HOTEL_NIGHT_ETB.comfort.typical * 2 + 16000,
    },
    highlights: ['Deep lake day', 'Falls day', 'Free city morning', 'Night markets & food'],
    tips: [
      `Lodging bands ~${HOTEL_NIGHT_ETB.budget.typical}–${HOTEL_NIGHT_ETB.mid.typical} ETB/night mid-range.`,
      'Put the falls on the clearest weather day.',
      'Leave buffer for ATMs and rest — heat adds up.',
    ],
    dayPlans: [
      {
        dayNumber: 1,
        title: 'Arrive · City & lake shore',
        summary: 'Settle in, orient at the lake, viewpoint if energy allows.',
        stops: [
          {
            name: 'Check-in + rest',
            time: 'Morning / afternoon',
            notes: 'From BJR airport allow 15–40 min into town.',
            placeSlug: 'bahir-dar-airport-bjr',
          },
          {
            name: 'Lake Tana shore walk',
            time: '16:00',
            duration: '1–2 h',
            placeSlug: 'lake-tana',
            estimatedCostEtb: 0,
          },
          {
            name: 'Welcome dinner',
            time: '19:00',
            estimatedCostEtb: FOOD_PERSON_DAY_ETB.mid.typical / 2,
          },
        ],
      },
      {
        dayNumber: 2,
        title: 'Monastery boat day',
        summary: 'Full classic Lake Tana cultural day.',
        stops: [
          {
            name: 'Boat + monasteries',
            time: '08:00',
            duration: '5–6 h',
            estimatedCostEtb:
              ATTRACTION_ETB.lakeTanaBoatSharedHalfDay.typical +
              ATTRACTION_ETB.monasteryEntry.typical * 2,
            placeSlug: 'ura-kidane-mehret',
          },
          {
            name: 'Bezawit sunset (optional)',
            time: '17:00',
            placeSlug: 'bezawit-palace-viewpoint',
            estimatedCostEtb: ATTRACTION_ETB.bezawitHill.typical,
          },
        ],
      },
      {
        dayNumber: 3,
        title: 'Blue Nile Falls + depart',
        summary: 'Tis Issat in the morning; afternoon travel buffer.',
        stops: [
          {
            name: 'Blue Nile Falls',
            time: '07:30',
            duration: 'Half day',
            placeSlug: 'blue-nile-falls-tis-issat',
            estimatedCostEtb:
              ATTRACTION_ETB.blueNileFallsEntry.typical + ATTRACTION_ETB.busToTisAbay.typical * 2,
          },
          {
            name: 'Souvenirs / coffee + transfer',
            time: 'Afternoon',
            notes: 'Market spices and coffee beans travel well.',
            placeSlug: 'bahir-dar-central-market',
          },
        ],
      },
    ],
  },
  {
    id: 'guide-budget-backpacker',
    title: 'Budget Explorer (2–3 Days)',
    subtitle: 'Bajaj, local food, shared boats — maximum Bahir Dar for less',
    days: 3,
    tags: ['budget', 'first-visit'],
    bestFor: 'Backpackers and students',
    pace: 'active',
    budgetPerPersonEtb: { min: 2500, typical: 5000, max: 8000 },
    highlights: ['Guesthouse lodging', 'Injera meals', 'Shared falls transport', 'Walking tours'],
    tips: [
      `Aim ~${HOTEL_NIGHT_ETB.budget.typical} ETB/night or less for beds.`,
      `Food can stay near ${FOOD_PERSON_DAY_ETB.budget.typical} ETB/day with local houses.`,
      'Share boat and guide costs with other travelers at the pier.',
    ],
    dayPlans: [
      {
        dayNumber: 1,
        title: 'Free city highlights',
        summary: 'Walk the shore, market, and viewpoint with minimal paid activities.',
        stops: [
          { name: 'Lake shore + people-watching', time: 'Morning', estimatedCostEtb: 0, placeSlug: 'lake-tana' },
          { name: 'Central Market', time: 'Midday', placeSlug: 'bahir-dar-central-market', estimatedCostEtb: 100 },
          {
            name: 'Bezawit Viewpoint',
            time: 'Afternoon',
            placeSlug: 'bezawit-palace-viewpoint',
            estimatedCostEtb: ATTRACTION_ETB.bezawitHill.typical,
          },
          { name: 'Injera dinner', time: 'Evening', estimatedCostEtb: 120 },
        ],
        transportTip: `Walk first; bajaj only when tired (~${TRANSPORT_DAY_ETB.budget.typical} ETB/day).`,
      },
      {
        dayNumber: 2,
        title: 'Shared monastery boat',
        summary: 'Join a shared boat; skip private charter.',
        stops: [
          {
            name: 'Shared Lake Tana boat',
            time: '08:00',
            estimatedCostEtb: ATTRACTION_ETB.lakeTanaBoatSharedHalfDay.min,
            placeSlug: 'lake-tana-boat-pier',
          },
          {
            name: 'Monastery entry',
            estimatedCostEtb: ATTRACTION_ETB.monasteryEntry.min,
            placeSlug: 'ura-kidane-mehret',
          },
        ],
      },
      {
        dayNumber: 3,
        title: 'Falls on a budget',
        summary: 'Public-style transport to Tis Abay if available; walk the falls circuit.',
        stops: [
          {
            name: 'Bus/minibus to Tis Abay',
            estimatedCostEtb: ATTRACTION_ETB.busToTisAbay.typical * 2,
          },
          {
            name: 'Falls entry',
            placeSlug: 'blue-nile-falls-tis-issat',
            estimatedCostEtb: ATTRACTION_ETB.blueNileFallsEntry.min,
          },
        ],
      },
    ],
  },
  {
    id: 'guide-slow-culture',
    title: 'Slow Culture (4 Days)',
    subtitle: 'More lake time, craft, food, and rest — less rushing between icons',
    days: 4,
    tags: ['culture', 'slow', 'comfort', 'family'],
    bestFor: 'Couples, families, return visitors',
    pace: 'relaxed',
    budgetPerPersonEtb: { min: 8000, typical: 16000, max: 35000 },
    highlights: [
      'Two lighter boat outings',
      'Market & coffee culture',
      'Optional second monastery',
      'Falls without dawn alarm',
    ],
    tips: [
      'Book a lakeside hotel if budget allows — sunsets are the show.',
      'One full rest afternoon prevents heat fatigue.',
      'Ask hotels about reliable drivers for falls day.',
    ],
    dayPlans: [
      {
        dayNumber: 1,
        title: 'Arrive & settle',
        summary: 'No big tickets — only lake and dinner.',
        stops: [
          { name: 'Hotel check-in & lake walk', placeSlug: 'lake-tana' },
          { name: 'Lakeside dinner', estimatedCostEtb: FOOD_PERSON_DAY_ETB.mid.typical / 2 },
        ],
      },
      {
        dayNumber: 2,
        title: 'Main monastery day',
        summary: 'Best-known Zege / island circuit at a calm pace.',
        stops: [
          {
            name: 'Monastery boat day',
            placeSlug: 'ura-kidane-mehret',
            estimatedCostEtb: ATTRACTION_ETB.lakeTanaBoatPrivateHalfDay.typical / 3,
            notes: 'Private boat split 3–4 ways is often worth it for families.',
          },
        ],
      },
      {
        dayNumber: 3,
        title: 'Falls day (flex start)',
        summary: 'Tis Issat with time for photos and a slow return.',
        stops: [
          {
            name: 'Blue Nile Falls',
            placeSlug: 'blue-nile-falls-tis-issat',
            estimatedCostEtb: ATTRACTION_ETB.blueNileFallsEntry.typical,
          },
        ],
      },
      {
        dayNumber: 4,
        title: 'City, crafts, depart',
        summary: 'Market, viewpoint if missed, buffer for flights/buses.',
        stops: [
          { name: 'Central Market', placeSlug: 'bahir-dar-central-market' },
          { name: 'Bezawit Viewpoint', placeSlug: 'bezawit-palace-viewpoint' },
          { name: 'Airport / bus station', placeSlug: 'bahir-dar-bus-station' },
        ],
      },
    ],
  },
  {
    id: 'guide-nature-focus',
    title: 'Nature Focus (2 Days)',
    subtitle: 'Birds, lake edges, falls — less shopping, more outdoors',
    days: 2,
    tags: ['nature', 'weekend'],
    bestFor: 'Photographers and outdoor travelers',
    pace: 'active',
    budgetPerPersonEtb: { min: 3500, typical: 8000, max: 15000 },
    highlights: ['Dawn lake light', 'Falls spray zone', 'Birdlife along the shore'],
    tips: [
      'Bring rain jacket for falls spray even in dry season mist.',
      'Binoculars help for lake birds.',
      'Waterproof phone pouch on boats.',
    ],
    dayPlans: [
      {
        dayNumber: 1,
        title: 'Lake ecology morning',
        summary: 'Early shore + optional short boat for open water views.',
        stops: [
          { name: 'Sunrise at Lake Tana', time: '06:00', placeSlug: 'lake-tana', estimatedCostEtb: 0 },
          {
            name: 'Short boat or longer shore hike',
            time: '08:00',
            estimatedCostEtb: ATTRACTION_ETB.lakeTanaBoatSharedHalfDay.min,
            placeSlug: 'lake-tana-boat-pier',
          },
          { name: 'Bezawit for landscape context', placeSlug: 'bezawit-palace-viewpoint' },
        ],
      },
      {
        dayNumber: 2,
        title: 'Tis Issat deep dive',
        summary: 'Full walking circuit around the falls when paths are open.',
        stops: [
          {
            name: 'Blue Nile Falls full visit',
            placeSlug: 'blue-nile-falls-tis-issat',
            estimatedCostEtb:
              ATTRACTION_ETB.blueNileFallsEntry.typical + ATTRACTION_ETB.blueNileFallsGuide.typical / 2,
          },
        ],
      },
    ],
  },
]

export function getItinerary(id: string): GuideItinerary | undefined {
  return BAHIR_DAR_ITINERARIES.find((x) => x.id === id)
}

export function itineraryToTrip(guide: GuideItinerary, userId = 'guide'): Trip {
  const now = new Date().toISOString()
  const days: TripDay[] = guide.dayPlans.map((d) => ({
    id: `${guide.id}-day-${d.dayNumber}`,
    trip_id: guide.id,
    day_number: d.dayNumber,
    date: null,
    title: d.title,
    notes: [d.summary, d.mealsTip, d.transportTip].filter(Boolean).join('\n\n') || null,
    created_at: now,
    stops: d.stops.map((s, i) => ({
      id: `${guide.id}-d${d.dayNumber}-s${i}`,
      trip_day_id: `${guide.id}-day-${d.dayNumber}`,
      place_id: null,
      custom_name: s.name,
      sort_order: i,
      start_time: s.time ?? null,
      end_time: null,
      notes: [s.duration ? `Duration: ${s.duration}` : null, s.notes].filter(Boolean).join(' · ') || null,
      estimated_cost: s.estimatedCostEtb ?? null,
      created_at: now,
    })),
  }))

  const expenses: TripExpense[] = [
    {
      id: `${guide.id}-exp-lodge`,
      trip_id: guide.id,
      category: 'lodging',
      title: `Lodging (~${guide.days - 1 || 1} nights, planning band)`,
      amount: HOTEL_NIGHT_ETB.mid.typical * Math.max(1, guide.days - 1),
      currency: 'ETB',
      expense_date: null,
      notes: PRICE_META.disclaimer,
      is_estimated: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: `${guide.id}-exp-food`,
      trip_id: guide.id,
      category: 'food',
      title: `Food (${guide.days} days, mid band)`,
      amount: FOOD_PERSON_DAY_ETB.mid.typical * guide.days,
      currency: 'ETB',
      expense_date: null,
      notes: 'Per person estimate',
      is_estimated: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: `${guide.id}-exp-act`,
      trip_id: guide.id,
      category: 'attraction',
      title: 'Activities & entries (planning)',
      amount: Math.round(guide.budgetPerPersonEtb.typical * 0.35),
      currency: 'ETB',
      expense_date: null,
      notes: 'Boats, falls, viewpoints',
      is_estimated: true,
      created_at: now,
      updated_at: now,
    },
  ]

  return {
    id: guide.id,
    user_id: userId,
    title: guide.title,
    description: `${guide.subtitle}\n\nBest for: ${guide.bestFor}\n\nTips:\n• ${guide.tips.join('\n• ')}`,
    start_date: null,
    end_date: null,
    traveler_count: 1,
    budget_total: guide.budgetPerPersonEtb.typical,
    currency: 'ETB',
    status: 'planning',
    is_public: true,
    created_at: now,
    updated_at: now,
    days,
    expenses,
  }
}

export function allGuideTrips(userId = 'guide'): Trip[] {
  return BAHIR_DAR_ITINERARIES.map((g) => itineraryToTrip(g, userId))
}
