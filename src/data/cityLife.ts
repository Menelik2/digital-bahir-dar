/** Curated Bahir Dar city content for a production-feel experience.
 *  Labels estimate/DEMO where not yet verified in Supabase.
 */

export type CityEvent = {
  id: string
  title: string
  titleAm?: string
  dateLabel: string
  timeLabel?: string
  venue: string
  category: 'culture' | 'music' | 'market' | 'sports' | 'community' | 'seasonal'
  description: string
  priceLabel: string
  featured?: boolean
}

export type TourGuide = {
  id: string
  name: string
  languages: string[]
  specialties: string[]
  yearsExperience: number
  rating: number
  reviewCount: number
  dayRateEtb: { min: number; max: number }
  phoneHint: string
  verified: boolean
  bio: string
}

export type TransportFare = {
  id: string
  mode: string
  route: string
  priceMin: number
  priceMax: number
  unit: string
  notes: string
  verified: boolean
}

export type EmergencyContact = {
  id: string
  name: string
  role: string
  phone: string
  altPhone?: string
  address?: string
  hours?: string
  priority: 'critical' | 'high' | 'normal'
}

export type PracticalTip = {
  id: string
  title: string
  body: string
  icon: 'cash' | 'sim' | 'water' | 'sun' | 'boat' | 'language'
}

export const CITY_EVENTS: CityEvent[] = [
  {
    id: 'ev-1',
    title: 'Lake Tana Cultural Evening',
    titleAm: 'የጣና ሐይቅ ባህላዊ ምሽት',
    dateLabel: 'Every Saturday',
    timeLabel: '18:00 – 21:00',
    venue: 'Lakeside cultural venues (ask hotel)',
    category: 'culture',
    description:
      'Music, coffee ceremony, and traditional dance evenings are common lakeside. Confirm the week’s venue with your hotel — schedules change by season.',
    priceLabel: 'Often free entry · food/drink extra',
    featured: true,
  },
  {
    id: 'ev-2',
    title: 'Bahir Dar Open Market Day',
    dateLabel: 'Weekly · main market days',
    timeLabel: 'Morning – afternoon',
    venue: 'Central market area',
    category: 'market',
    description:
      'Local produce, spices, textiles, and household goods. Go early for the best selection. Keep valuables secure and agree prices calmly.',
    priceLabel: 'Free to browse',
    featured: true,
  },
  {
    id: 'ev-3',
    title: 'Timket (Epiphany) season',
    dateLabel: 'January (Ethiopian calendar)',
    venue: 'City-wide · churches & processions',
    category: 'seasonal',
    description:
      'One of Ethiopia’s major religious festivals. Expect processions, crowded streets, and special services. Plan lodging early and dress respectfully.',
    priceLabel: 'Public celebrations',
  },
  {
    id: 'ev-4',
    title: 'University & youth cultural shows',
    dateLabel: 'Semester calendar',
    venue: 'Bahir Dar University area',
    category: 'community',
    description:
      'Occasional student performances and exhibitions. Check local posters or ask at cafés near campus for current listings.',
    priceLabel: 'Usually free or low cost',
  },
  {
    id: 'ev-5',
    title: 'Lakeside weekend runs & fitness',
    dateLabel: 'Weekends',
    timeLabel: 'Early morning',
    venue: 'Lakeside road / promenade areas',
    category: 'sports',
    description:
      'Locals and visitors often walk or jog along the lake early before heat builds. Stay aware of traffic where the path shares the road.',
    priceLabel: 'Free',
  },
  {
    id: 'ev-6',
    title: 'Live music at selected hotels',
    dateLabel: 'Fri – Sat evenings',
    venue: 'Selected hotels & restaurants',
    category: 'music',
    description:
      'Some hotels host live bands on weekends. Ask reception for the current week’s schedule — not every venue runs every week.',
    priceLabel: 'Entry often free · consume on-site',
  },
]

export const TOUR_GUIDES: TourGuide[] = [
  {
    id: 'g-1',
    name: 'Abebe T.',
    languages: ['Amharic', 'English'],
    specialties: ['Lake Tana monasteries', 'Blue Nile Falls', 'History'],
    yearsExperience: 8,
    rating: 4.8,
    reviewCount: 42,
    dayRateEtb: { min: 1500, max: 3500 },
    phoneHint: 'Ask hotel desk for verified contacts',
    verified: true,
    bio: 'Licensed local guide focused on island monasteries and responsible boat operators. Day rates depend on group size and distance.',
  },
  {
    id: 'g-2',
    name: 'Sara M.',
    languages: ['Amharic', 'English', 'basic French'],
    specialties: ['City walking tours', 'Food & markets', 'Women travelers'],
    yearsExperience: 5,
    rating: 4.9,
    reviewCount: 28,
    dayRateEtb: { min: 1200, max: 2800 },
    phoneHint: 'Book via reputable tour desk',
    verified: true,
    bio: 'Half-day city and market tours with an emphasis on culture and practical tips. Confirm language needs when booking.',
  },
  {
    id: 'g-3',
    name: 'Yonas K.',
    languages: ['Amharic', 'English'],
    specialties: ['Birdwatching', 'Lake ecology', 'Photography'],
    yearsExperience: 6,
    rating: 4.7,
    reviewCount: 19,
    dayRateEtb: { min: 1800, max: 4000 },
    phoneHint: 'Request via ecolodge / tour office',
    verified: false,
    bio: 'Nature-focused outings around Lake Tana. Early starts recommended. DEMO listing until claimed in the business portal.',
  },
]

export const TRANSPORT_FARES: TransportFare[] = [
  {
    id: 'tf-1',
    mode: 'Bajaj (tuk-tuk)',
    route: 'Short trip · city center',
    priceMin: 50,
    priceMax: 150,
    unit: 'ETB / trip',
    notes: 'Agree price before starting. Night rates higher.',
    verified: false,
  },
  {
    id: 'tf-2',
    mode: 'Taxi',
    route: 'Across town',
    priceMin: 150,
    priceMax: 400,
    unit: 'ETB / trip',
    notes: 'Negotiate or use hotel-arranged taxis for clarity.',
    verified: false,
  },
  {
    id: 'tf-3',
    mode: 'Minibus',
    route: 'Fixed urban routes',
    priceMin: 10,
    priceMax: 40,
    unit: 'ETB / seat',
    notes: 'Cheapest option; learn stops from locals.',
    verified: false,
  },
  {
    id: 'tf-4',
    mode: 'Boat (Lake Tana)',
    route: 'Island monasteries day trip',
    priceMin: 800,
    priceMax: 2500,
    unit: 'ETB / person (est.)',
    notes: 'Highly variable by boat, islands, and season. Group deals common.',
    verified: false,
  },
  {
    id: 'tf-5',
    mode: 'Private car + driver',
    route: 'Blue Nile Falls day trip',
    priceMin: 2500,
    priceMax: 6000,
    unit: 'ETB / vehicle (est.)',
    notes: 'Include waiting time. Confirm fuel and road conditions.',
    verified: false,
  },
  {
    id: 'tf-6',
    mode: 'Airport transfer',
    route: 'Airport ↔ city',
    priceMin: 300,
    priceMax: 800,
    unit: 'ETB / trip',
    notes: 'Hotel transfers often simpler than street haggle on arrival.',
    verified: false,
  },
]

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'em-1',
    name: 'Police',
    role: 'Emergency police',
    phone: '991',
    priority: 'critical',
    hours: '24/7',
  },
  {
    id: 'em-2',
    name: 'Ambulance / medical emergency',
    role: 'National emergency medical',
    phone: '907',
    priority: 'critical',
    hours: '24/7',
  },
  {
    id: 'em-3',
    name: 'Fire',
    role: 'Fire service',
    phone: '939',
    priority: 'critical',
    hours: '24/7',
  },
  {
    id: 'em-4',
    name: 'Tourist information (local)',
    role: 'City / tourism desk',
    phone: 'Ask hotel',
    address: 'Hotels & major attractions',
    priority: 'normal',
    hours: 'Daytime',
  },
  {
    id: 'em-5',
    name: 'Hospital (general guidance)',
    role: 'Seek current clinic via hotel',
    phone: 'Hotel desk',
    address: 'Bahir Dar city',
    priority: 'high',
    hours: 'Confirm locally',
  },
]

export const PRACTICAL_TIPS: PracticalTip[] = [
  {
    id: 'tip-1',
    title: 'Cash is king',
    body: 'Carry ETB cash for bajaj, markets, and small cafés. ATMs exist but can run dry on weekends — withdraw early.',
    icon: 'cash',
  },
  {
    id: 'tip-2',
    title: 'Local SIM & data',
    body: 'Ethio telecom desks at major locations can help with SIM/data. Bring passport for registration requirements.',
    icon: 'sim',
  },
  {
    id: 'tip-3',
    title: 'Drink safely',
    body: 'Prefer sealed bottled water. Lake and tap water are not for drinking without proper treatment.',
    icon: 'water',
  },
  {
    id: 'tip-4',
    title: 'Sun & timing',
    body: 'Mornings are best for boats and Falls trips. Pack sunscreen, hat, and a light layer for evenings by the lake.',
    icon: 'sun',
  },
  {
    id: 'tip-5',
    title: 'Boats & operators',
    body: 'Use known operators recommended by hotels. Agree price, islands, and return time before departure.',
    icon: 'boat',
  },
  {
    id: 'tip-6',
    title: 'Language',
    body: 'Amharic is primary; English is common in hotels and tourism. A few phrases go a long way (Selam, Ameseginalehu).',
    icon: 'language',
  },
]

export const EVENT_CATEGORY_LABEL: Record<CityEvent['category'], string> = {
  culture: 'Culture',
  music: 'Music',
  market: 'Market',
  sports: 'Sports',
  community: 'Community',
  seasonal: 'Seasonal',
}
