/** Bahir Dar city services content — practical visitor information.
 *  National emergency numbers are real. Local facility details should be confirmed on site.
 *  Transport fares are planning estimates (ETB), not fixed tariffs.
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
    dateLabel: 'Often Saturdays (seasonal)',
    timeLabel: '18:00 – 21:00',
    venue: 'Lakeside hotels & cultural venues',
    category: 'culture',
    description:
      'Music, coffee ceremony, and traditional dance evenings are common by the lake. Ask your hotel for this week’s venue — schedules change by season and holidays.',
    priceLabel: 'Often free entry · food/drink extra',
    featured: true,
  },
  {
    id: 'ev-2',
    title: 'Central Market mornings',
    dateLabel: 'Daily · busiest morning',
    timeLabel: '07:00 – 14:00',
    venue: 'Bahir Dar central market area',
    category: 'market',
    description:
      'Produce, spices, coffee, textiles, and household goods. Go early for selection. Keep bags closed; agree prices calmly before paying.',
    priceLabel: 'Free to browse',
    featured: true,
  },
  {
    id: 'ev-3',
    title: 'Timket (Epiphany)',
    dateLabel: 'January (Ethiopian calendar · ~19 Jan Gregorian often)',
    venue: 'City-wide · churches & processions',
    category: 'seasonal',
    description:
      'Major religious festival with processions and crowded streets. Book lodging early; dress modestly near churches; expect transport delays.',
    priceLabel: 'Public celebrations',
  },
  {
    id: 'ev-4',
    title: 'Meskel (Finding of the True Cross)',
    dateLabel: 'September (Ethiopian calendar)',
    venue: 'Public squares & church compounds',
    category: 'seasonal',
    description:
      'Bonfires (demera) and community gatherings. Confirm exact public sites with locals or hotel staff each year.',
    priceLabel: 'Public',
  },
  {
    id: 'ev-5',
    title: 'Lakeside morning walks',
    dateLabel: 'Daily',
    timeLabel: 'Before 09:00 recommended',
    venue: 'Lake Tana shore / promenade areas',
    category: 'sports',
    description:
      'Locals and visitors walk or jog along the lake before heat builds. Stay alert where paths meet roads or boat traffic.',
    priceLabel: 'Free',
  },
  {
    id: 'ev-6',
    title: 'Weekend hotel live music',
    dateLabel: 'Fri – Sat evenings',
    venue: 'Selected hotels & restaurants',
    category: 'music',
    description:
      'Some hotels host bands on weekends. Ask reception for the current schedule — not every venue performs every week.',
    priceLabel: 'Entry often free · consume on-site',
  },
]

export const TOUR_GUIDES: TourGuide[] = [
  {
    id: 'g-1',
    name: 'Licensed monastery guides',
    languages: ['Amharic', 'English'],
    specialties: ['Lake Tana monasteries', 'Boat operators', 'History'],
    yearsExperience: 5,
    rating: 4.7,
    reviewCount: 0,
    dayRateEtb: { min: 1500, max: 4000 },
    phoneHint: 'Ask hotel tourism desk or pier office',
    verified: false,
    bio: 'Use licensed guides recommended by hotels or the boat pier. Day rates depend on islands, group size, and season. Agree itinerary and price in writing when possible.',
  },
  {
    id: 'g-2',
    name: 'Blue Nile Falls day guides',
    languages: ['Amharic', 'English'],
    specialties: ['Tis Issat / Blue Nile Falls', 'Local transport'],
    yearsExperience: 5,
    rating: 4.6,
    reviewCount: 0,
    dayRateEtb: { min: 500, max: 2000 },
    phoneHint: 'Often arranged with car hire or at Tis Abay',
    verified: false,
    bio: 'Optional local guides at the Falls help with paths and timing. Path fees and guide fees are separate from vehicle hire — confirm each cost before starting.',
  },
  {
    id: 'g-3',
    name: 'City & market walking guides',
    languages: ['Amharic', 'English'],
    specialties: ['Markets', 'Coffee culture', 'City orientation'],
    yearsExperience: 3,
    rating: 4.5,
    reviewCount: 0,
    dayRateEtb: { min: 800, max: 2500 },
    phoneHint: 'Book via hotel or tourist information',
    verified: false,
    bio: 'Half-day walks covering market, lakeside, and practical tips. Prefer introductions through your hotel rather than street solicitation.',
  },
]

export const TRANSPORT_FARES: TransportFare[] = [
  {
    id: 'tf-1',
    mode: 'Bajaj (tuk-tuk)',
    route: 'Short hop · city center',
    priceMin: 50,
    priceMax: 200,
    unit: 'ETB / trip',
    notes: 'Agree price before boarding. Night and rain can cost more.',
    verified: false,
  },
  {
    id: 'tf-2',
    mode: 'Taxi',
    route: 'Across Bahir Dar town',
    priceMin: 150,
    priceMax: 500,
    unit: 'ETB / trip',
    notes: 'Hotel-arranged taxis reduce haggling on arrival.',
    verified: false,
  },
  {
    id: 'tf-3',
    mode: 'Minibus',
    route: 'Fixed urban routes',
    priceMin: 10,
    priceMax: 50,
    unit: 'ETB / seat',
    notes: 'Cheapest in-town option; ask locals for the correct line.',
    verified: false,
  },
  {
    id: 'tf-4',
    mode: 'Boat (Lake Tana)',
    route: 'Island monasteries · shared / private',
    priceMin: 800,
    priceMax: 15000,
    unit: 'ETB (shared person – private half day)',
    notes: 'Highly variable. Shared half-day often lower; private charter much higher. Confirm islands and return time.',
    verified: false,
  },
  {
    id: 'tf-5',
    mode: 'Private car + driver',
    route: 'Bahir Dar ↔ Blue Nile Falls (Tis Abay)',
    priceMin: 800,
    priceMax: 3500,
    unit: 'ETB / vehicle round trip (est.)',
    notes: 'Include waiting time. Entry/guide fees at Falls are extra.',
    verified: false,
  },
  {
    id: 'tf-6',
    mode: 'Airport transfer',
    route: 'Bahir Dar Airport (BJR) ↔ city',
    priceMin: 300,
    priceMax: 1500,
    unit: 'ETB / trip',
    notes: '15–40 minutes depending on traffic. Hotel pickup is simplest after landing.',
    verified: false,
  },
  {
    id: 'tf-7',
    mode: 'Intercity bus',
    route: 'Bahir Dar bus station · regional',
    priceMin: 100,
    priceMax: 800,
    unit: 'ETB / seat (route-dependent)',
    notes: 'Gondar, Addis, and other routes. Buy tickets early for busy days; keep valuables close.',
    verified: false,
  },
]

/** Ethiopia national emergency short codes + local orientation */
export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'em-1',
    name: 'Police',
    role: 'National emergency police',
    phone: '991',
    priority: 'critical',
    hours: '24/7',
  },
  {
    id: 'em-2',
    name: 'Ambulance / medical',
    role: 'National emergency medical',
    phone: '907',
    priority: 'critical',
    hours: '24/7',
  },
  {
    id: 'em-3',
    name: 'Fire',
    role: 'National fire service',
    phone: '939',
    priority: 'critical',
    hours: '24/7',
  },
  {
    id: 'em-4',
    name: 'Felege Hiwot Referral Hospital',
    role: 'Main public referral hospital · Bahir Dar',
    phone: '907',
    altPhone: 'Ask hotel for direct line',
    address: 'Felege Hiwot area, Bahir Dar',
    priority: 'high',
    hours: 'Emergency 24/7 · outpatient hours vary',
  },
  {
    id: 'em-5',
    name: 'Tourist / hotel assistance',
    role: 'First point of contact for visitors',
    phone: 'Hotel front desk',
    address: 'Your hotel or guesthouse',
    priority: 'normal',
    hours: 'Reception hours · night duty often available',
  },
  {
    id: 'em-6',
    name: 'Lake Tana boat pier',
    role: 'Monastery boats · operator desk',
    phone: 'Ask on site',
    address: 'Lake Tana shore, Bahir Dar',
    priority: 'normal',
    hours: 'Daytime · weather dependent',
  },
]

export const PRACTICAL_TIPS: PracticalTip[] = [
  {
    id: 'tip-1',
    title: 'Cash (ETB)',
    body: 'Carry Ethiopian Birr for bajaj, markets, and small cafés. ATMs (CBE, Dashen, Abyssinia, etc.) exist but can run dry — withdraw on weekdays when possible.',
    icon: 'cash',
  },
  {
    id: 'tip-2',
    title: 'SIM & data',
    body: 'Ethio Telecom shops register SIMs with passport. Data packages are widely available; keep the registration receipt.',
    icon: 'sim',
  },
  {
    id: 'tip-3',
    title: 'Drinking water',
    body: 'Use sealed bottled water. Do not drink untreated lake or tap water. Ice in street drinks may be unsafe.',
    icon: 'water',
  },
  {
    id: 'tip-4',
    title: 'Climate & timing',
    body: 'Mornings are best for boats and the Falls. Pack sun protection and a light layer for breezy lakeside evenings.',
    icon: 'sun',
  },
  {
    id: 'tip-5',
    title: 'Boats & monasteries',
    body: 'Agree price, islands, and return time before departure. Modest dress for churches; remove shoes when required.',
    icon: 'boat',
  },
  {
    id: 'tip-6',
    title: 'Language',
    body: 'Amharic is primary; English is common in hotels and tourism. Useful words: Selam (hello), Ameseginalehu (thank you), Sint new? (how much?).',
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
