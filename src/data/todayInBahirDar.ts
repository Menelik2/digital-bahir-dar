/**
 * “Today in Bahir Dar” — one clear day plan for first-time visitors.
 * Costs are rough ETB planning estimates (confirm on site).
 */

export type TodayStep = {
  id: string
  period: 'morning' | 'midday' | 'afternoon' | 'evening'
  time: string
  title: string
  description: string
  placeSlug?: string
  mapHint?: string
  costEtb?: { min: number; typical: number; max: number }
  costNote?: string
  duration?: string
}

export type TodayPlan = {
  id: string
  title: string
  subtitle: string
  totalEtbTypical: number
  steps: TodayStep[]
  optionalExtra: {
    title: string
    body: string
    href: string
  }
  tips: string[]
}

/** Default perfect day — works without login or GPS */
export const TODAY_CLASSIC: TodayPlan = {
  id: 'today-classic',
  title: 'Today in Bahir Dar',
  subtitle: 'One simple day: lake, viewpoint, market, good food — no overwhelm.',
  totalEtbTypical: 1200,
  steps: [
    {
      id: 'lake',
      period: 'morning',
      time: '07:30 – 09:00',
      title: 'Lake Tana shore',
      description:
        'Start at the lake. Watch boats, birds, and morning life. Optional short boat only if you have energy.',
      placeSlug: 'lake-tana',
      mapHint: 'Lake shore / pier area',
      costEtb: { min: 0, typical: 0, max: 2000 },
      costNote: 'Shore is free; boat is optional and negotiated',
      duration: '1–1.5 h',
    },
    {
      id: 'coffee',
      period: 'morning',
      time: '09:00 – 09:45',
      title: 'Coffee break',
      description: 'Ethiopian coffee or a simple macchiato. Sit, cool down, plan the rest of the day.',
      costEtb: { min: 30, typical: 60, max: 120 },
      duration: '30–45 min',
    },
    {
      id: 'bezawit',
      period: 'morning',
      time: '10:30 – 12:00',
      title: 'Bezawit viewpoint',
      description: 'Hilltop views over the Blue Nile outlet and the lake. Great photos; small fee possible.',
      placeSlug: 'bezawit-palace-viewpoint',
      costEtb: { min: 0, typical: 50, max: 150 },
      duration: '1–1.5 h',
    },
    {
      id: 'lunch',
      period: 'midday',
      time: '12:30 – 13:45',
      title: 'Lunch — fish or injera',
      description:
        'Try lake fish if available, or injera with shiro / tibs. Lakeside for views; city center for lower prices.',
      costEtb: { min: 80, typical: 250, max: 500 },
      duration: '1 h',
    },
    {
      id: 'market',
      period: 'afternoon',
      time: '15:00 – 16:30',
      title: 'Central market',
      description: 'Spices, coffee, everyday Bahir Dar. Keep bags zipped; bargain politely.',
      placeSlug: 'bahir-dar-central-market',
      costEtb: { min: 0, typical: 200, max: 800 },
      costNote: 'Only if you buy snacks or small goods',
      duration: '1–1.5 h',
    },
    {
      id: 'sunset',
      period: 'evening',
      time: '17:30 – 20:00',
      title: 'Sunset lake walk + dinner',
      description: 'Golden hour on the shore, then a proper dinner nearby. Easy end to the day.',
      placeSlug: 'lake-tana',
      costEtb: { min: 100, typical: 350, max: 700 },
      duration: '2–2.5 h',
    },
  ],
  optionalExtra: {
    title: 'Have a second day?',
    body: 'Add a Lake Tana monastery boat in the morning, or a Blue Nile Falls day trip.',
    href: '/trip-planner',
  },
  tips: [
    'Carry small ETB notes for bajaj and snacks.',
    'Start early — midday sun is strong near the lake.',
    'Agree bajaj/taxi prices before you start.',
    'ATMs can run dry; withdraw when you can.',
  ],
}

export const PERIOD_LABEL: Record<TodayStep['period'], string> = {
  morning: 'Morning',
  midday: 'Midday',
  afternoon: 'Afternoon',
  evening: 'Evening',
}
