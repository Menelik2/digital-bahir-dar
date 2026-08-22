/**
 * “Things to Do” — Bahir Dar Smart Digital City checklist.
 * Practical visitor + resident actions with deep links into the app.
 */

export type TodoPillar =
  | 'explore'
  | 'stay'
  | 'eat'
  | 'move'
  | 'money'
  | 'safety'
  | 'culture'
  | 'plan'

export type CityTodo = {
  id: string
  title: string
  titleAm?: string
  description: string
  pillar: TodoPillar
  /** Estimated half-days or hours label */
  timeLabel: string
  costLabel: string
  priority: 1 | 2 | 3
  href: string
  mapQuery?: string
  tips?: string
}

export const PILLAR_LABEL: Record<TodoPillar, { en: string; am: string; color: string }> = {
  explore: { en: 'Explore', am: 'አስስ', color: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200' },
  stay: { en: 'Stay', am: 'ማረፊያ', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200' },
  eat: { en: 'Eat & drink', am: 'ምግብ', color: 'bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-200' },
  move: { en: 'Get around', am: 'ትራንስፖርት', color: 'bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-200' },
  money: { en: 'Money', am: 'ገንዘብ', color: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200' },
  safety: { en: 'Safety', am: 'ደህንነት', color: 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200' },
  culture: { en: 'Culture', am: 'ባህል', color: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200' },
  plan: { en: 'Plan', am: 'እቅድ', color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200' },
}

export const CITY_TODOS: CityTodo[] = [
  {
    id: 'todo-lake-tana',
    title: 'Boat trip on Lake Tana',
    titleAm: 'በጣና ሐይቅ ጀልባ ጉዞ',
    description: 'Visit island monasteries (e.g. Ura Kidane Mehret area). Book a reliable boat via hotel or verified guide.',
    pillar: 'explore',
    timeLabel: 'Half–full day',
    costLabel: 'Est. 800–2500 ETB / person',
    priority: 1,
    href: '/attractions',
    tips: 'Start early; agree islands & return time before departure.',
  },
  {
    id: 'todo-falls',
    title: 'Blue Nile Falls (Tis Abay)',
    titleAm: 'የአባይ ፏፏቴ (ጢስ አባይ)',
    description: 'Day trip to the falls. Combine with private car or organized tour; check water levels by season.',
    pillar: 'explore',
    timeLabel: 'Full day',
    costLabel: 'Transport 2500–6000 ETB / vehicle (est.)',
    priority: 1,
    href: '/attractions',
    tips: 'Wear shoes with grip; spray can soak clothes in wet season.',
  },
  {
    id: 'todo-lakeside-walk',
    title: 'Lakeside walk at sunset',
    description: 'Walk the lakeside roads/promenade areas for views and evening air.',
    pillar: 'explore',
    timeLabel: '1–2 hours',
    costLabel: 'Free',
    priority: 2,
    href: '/map',
  },
  {
    id: 'todo-hotel',
    title: 'Book or confirm lodging',
    description: 'Choose a hotel or guesthouse; prefer verified listings and lakeside if you want views.',
    pillar: 'stay',
    timeLabel: '30 min',
    costLabel: 'Varies by star level',
    priority: 1,
    href: '/hotels',
  },
  {
    id: 'todo-injera',
    title: 'Try traditional Ethiopian food',
    description: 'Injera with local stews; fish dishes are common near the lake.',
    pillar: 'eat',
    timeLabel: 'Evening',
    costLabel: 'Budget–mid ETB',
    priority: 1,
    href: '/restaurants',
  },
  {
    id: 'todo-coffee',
    title: 'Coffee ceremony or lakeside café',
    description: 'Ethiopia’s coffee culture — café stop or full ceremony where offered.',
    pillar: 'eat',
    timeLabel: '1 hour',
    costLabel: 'Low–mid',
    priority: 2,
    href: '/discover',
  },
  {
    id: 'todo-bajaj',
    title: 'Learn bajaj & taxi price norms',
    description: 'Agree price before the ride. Use hotel taxis at night if unsure.',
    pillar: 'move',
    timeLabel: '15 min read',
    costLabel: 'See fare guide',
    priority: 1,
    href: '/transport',
  },
  {
    id: 'todo-atm',
    title: 'Withdraw ETB cash',
    description: 'ATMs can run low on weekends — withdraw early for markets and bajaj.',
    pillar: 'money',
    timeLabel: '20 min',
    costLabel: 'Bank fees may apply',
    priority: 1,
    href: '/banks',
  },
  {
    id: 'todo-budget',
    title: 'Set a daily budget',
    description: 'Use the in-app budget tool for lodging, food, boats, and transport.',
    pillar: 'plan',
    timeLabel: '15 min',
    costLabel: '—',
    priority: 2,
    href: '/budget',
  },
  {
    id: 'todo-emergency',
    title: 'Save emergency numbers',
    description: 'Police 991, medical 907, fire 939 — confirm locally if numbers change.',
    pillar: 'safety',
    timeLabel: '5 min',
    costLabel: 'Free',
    priority: 1,
    href: '/directory',
  },
  {
    id: 'todo-market',
    title: 'Visit the open market',
    description: 'Spices, produce, textiles — go in the morning; keep valuables secure.',
    pillar: 'culture',
    timeLabel: '2–3 hours',
    costLabel: 'Free to browse',
    priority: 2,
    href: '/events',
  },
  {
    id: 'todo-guide',
    title: 'Arrange a local guide (optional)',
    description: 'Licensed guides help with monasteries, Falls, and language.',
    pillar: 'plan',
    timeLabel: 'Call / desk',
    costLabel: 'Day rates ~1200–4000 ETB',
    priority: 2,
    href: '/guides',
  },
  {
    id: 'todo-ai',
    title: 'Ask the AI city guide',
    description: 'Get itinerary ideas in English or Amharic for your dates and budget.',
    pillar: 'plan',
    timeLabel: '10 min',
    costLabel: 'Free in-app',
    priority: 2,
    href: '/ai-guide',
  },
  {
    id: 'todo-trip',
    title: 'Build a multi-day trip plan',
    description: 'Save days, stops, and expenses in Trips.',
    pillar: 'plan',
    timeLabel: '20 min',
    costLabel: '—',
    priority: 2,
    href: '/trips',
  },
  {
    id: 'todo-discover',
    title: 'Browse live map places (OSM)',
    description: 'Hotels, cafés, and transport points from OpenStreetMap with Google directions.',
    pillar: 'explore',
    timeLabel: '15 min',
    costLabel: 'Free',
    priority: 3,
    href: '/discover',
  },
]

export const SMART_CITY_MODULES = [
  {
    id: 'tourism',
    title: 'Tourism & map',
    body: 'Places, GPS map, Discover (OSM), attractions.',
    href: '/map',
    icon: 'map',
  },
  {
    id: 'mobility',
    title: 'Mobility',
    body: 'Fares, bajaj/taxi norms, bus & boat tips.',
    href: '/transport',
    icon: 'car',
  },
  {
    id: 'hospitality',
    title: 'Stay & eat',
    body: 'Hotels, restaurants, cafés — verified + live data.',
    href: '/hotels',
    icon: 'hotel',
  },
  {
    id: 'civic',
    title: 'Civic & safety',
    body: 'Directory, emergency contacts, banks & ATMs.',
    href: '/directory',
    icon: 'shield',
  },
  {
    id: 'events',
    title: 'Events & culture',
    body: 'Markets, festivals, lakeside culture.',
    href: '/events',
    icon: 'calendar',
  },
  {
    id: 'intelligence',
    title: 'AI & planning',
    body: 'AI Guide, trips, budgets, Things to Do.',
    href: '/todo',
    icon: 'sparkles',
  },
] as const
