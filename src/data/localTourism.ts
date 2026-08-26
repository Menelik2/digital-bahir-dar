/**
 * Local tourism knowledge base for Bahir Dar (Amhara, Ethiopia).
 * Practical visitor info — confirm fees, boat prices, and hours on site.
 */

export type TourismCategory =
  | 'nature'
  | 'religious'
  | 'viewpoint'
  | 'culture'
  | 'market'
  | 'activity'

export type LocalTourismSite = {
  id: string
  name: string
  nameAm?: string
  category: TourismCategory
  short: string
  shortAm?: string
  description: string
  descriptionAm?: string
  lat: number
  lng: number
  address: string
  duration: string
  bestTime: string
  costHint: string
  tips: string[]
  tipsAm?: string[]
  dressCode?: string
  featured?: boolean
  /** Optional deep link inside app */
  href?: string
}

export const TOURISM_QUICK_FACTS = {
  city: 'Bahir Dar',
  region: 'Amhara Regional State',
  elevationM: 1840,
  timezone: 'Africa/Addis_Ababa (EAT, UTC+3)',
  lake: 'Lake Tana — Ethiopia’s largest lake; source of the Blue Nile; UNESCO Biosphere Reserve',
  bestSeasonDry: 'October–May (clearer skies, easier roads)',
  bestSeasonFalls: 'June–September (Blue Nile Falls strongest flow)',
  airport: 'Bahir Dar Dejazmach Belay Zeleke (BJR)',
  language: 'Amharic · English widely useful for tourism',
  currency: 'ETB (cash preferred for boats, markets, bajaj)',
} as const

export const TOURISM_TIPS_EN = [
  'Agree boat or guide price in ETB before departure; confirm islands and return time.',
  'Modest dress for monasteries: cover shoulders and knees; remove shoes where required.',
  'ATMs can run low on weekends — withdraw ETB early.',
  'Rainy season trails can be muddy; wear shoes with grip at the Falls.',
  'Photography rules vary by monastery — always ask before photographing interiors or people.',
] as const

export const TOURISM_TIPS_AM = [
  'የጀልባ ወይም መመሪያ ዋጋን በብር አስቀድመው ይስማሙ፤ ደሴቶችንና መመለሻን ያረጋግጡ።',
  'በገዳሞች ላይ መጠነኛ አለባበስ፤ ጫማ ማውጣት ሊጠበቅ ይችላል።',
  'በሳምንቱ መጨረሻ ኤቲኤም ገንዘብ ሊያልቅ ይችላል — ብር ቀደም ብለው ያውጡ።',
  'በዝናብ ወቅት መንገዶች ጭቃማ ሊሆኑ ይችላሉ።',
  'በገዳም ውስጥ ፎቶ ከማንሳት በፊት ይጠይቁ።',
] as const

export const LOCAL_TOURISM_SITES: LocalTourismSite[] = [
  {
    id: 'tour-lake-tana',
    name: 'Lake Tana',
    nameAm: 'ጣና ሐይቅ',
    category: 'nature',
    short: 'Largest lake in Ethiopia · Blue Nile source',
    shortAm: 'የኢትዮጵያ ትልቁ ሐይቅ',
    description:
      'Lake Tana is Ethiopia’s largest lake and the source region of the Blue Nile. It hosts island monasteries, birdlife, and papyrus shorelines. Most visitors base in Bahir Dar and take a boat to selected islands or the Zege Peninsula.',
    descriptionAm:
      'ጣና ሐይቅ የኢትዮጵያ ትልቁ ሐይቅ ሲሆን የአባይ ምንጭ ነው። የደሴት ገዳሞችና የወፍ ህይወት አሉት።',
    lat: 11.6167,
    lng: 37.4,
    address: 'Southern shore / Bahir Dar waterfront',
    duration: 'Half day – full day',
    bestTime: 'Morning for boats; Oct–May for calmer weather',
    costHint: 'Boat shared half-day often ~800–5000 ETB/person (wide range)',
    tips: [
      'Book via hotel or a known operator',
      'Bring sun protection, water, cash',
      'Confirm which monasteries are open to visitors',
    ],
    featured: true,
    href: '/places/lake-tana',
  },
  {
    id: 'tour-ura',
    name: 'Ura Kidane Mehret Monastery',
    nameAm: 'ኡራ ኪዳነ ምሕረት',
    category: 'religious',
    short: 'Zege Peninsula · famous murals',
    shortAm: 'ዘጌ · ግድግዳ ሥዕሎች',
    description:
      'One of the most visited Lake Tana monasteries, known for vivid wall paintings and a circular thatched church. Reached by boat then a walk through coffee forest on the Zege Peninsula.',
    lat: 11.695,
    lng: 37.335,
    address: 'Zege Peninsula, Lake Tana',
    duration: '2–4 hours with boat',
    bestTime: 'Morning',
    costHint: 'Monastery entry ~50–300 ETB each + boat share',
    tips: [
      'Modest dress required',
      'Shoes off inside churches',
      'Ask before photographing interiors',
    ],
    dressCode: 'Cover shoulders and knees',
    featured: true,
    href: '/places/ura-kidane-mehret',
  },
  {
    id: 'tour-azuwa',
    name: 'Azuwa Maryam Monastery',
    nameAm: 'አዝዋ ማርያም',
    category: 'religious',
    short: 'Zege · circular thatched church',
    description:
      'Monastery on the Zege Peninsula often combined with Ura Kidane Mehret on the same boat trip. Known for traditional circular architecture and paintings.',
    lat: 11.69,
    lng: 37.34,
    address: 'Zege Peninsula, Lake Tana',
    duration: 'Part of half-day boat tour',
    bestTime: 'Morning',
    costHint: 'Included in multi-monastery boat itinerary + entry',
    tips: ['Usually paired with Ura on shared tours'],
    dressCode: 'Modest dress',
    featured: true,
  },
  {
    id: 'tour-falls',
    name: 'Blue Nile Falls (Tis Issat)',
    nameAm: 'ጢስ አባይ / ጢስ እሳት',
    category: 'nature',
    short: 'Tis Abay · day trip from Bahir Dar',
    shortAm: 'ከባሕር ዳር የቀን ጉዞ',
    description:
      'Locally Tis Abay / Tis Issat (“smoking water”). About 30–35 km from Bahir Dar. Flow is strongest in the rainy season; a hydro diversion can reduce volume in the dry season. Includes a walk and often the historic Portuguese bridge area.',
    lat: 11.489,
    lng: 37.587,
    address: 'Tis Abay area, SE of Bahir Dar',
    duration: 'Half–full day',
    bestTime: 'Jun–Sep for stronger flow; dry season can be weaker',
    costHint: 'Entry + guide + private car or shared tour (confirm on site)',
    tips: [
      'Wear shoes with grip',
      'Expect spray in high season',
      'Road can be bumpy — allow 1–1.5 h each way',
    ],
    featured: true,
    href: '/places/blue-nile-falls-tis-issat',
  },
  {
    id: 'tour-bezawit',
    name: 'Bezawit Palace Viewpoint',
    nameAm: 'በዛዊት',
    category: 'viewpoint',
    short: 'Hilltop view of Nile outlet & lake',
    description:
      'Hill overlooking the Blue Nile outlet and Lake Tana. Popular at sunrise or sunset for photos of the city and river.',
    lat: 11.6015,
    lng: 37.4025,
    address: 'Bezawit Hill, Bahir Dar',
    duration: '45–90 minutes',
    bestTime: 'Sunrise or sunset',
    costHint: 'Often free or small fee',
    tips: ['Paths can be steep after rain'],
    featured: true,
    href: '/places/bezawit-palace-viewpoint',
  },
  {
    id: 'tour-outlet',
    name: 'Blue Nile Bridge / Outlet',
    nameAm: 'የአባይ ድልድይ',
    category: 'viewpoint',
    short: 'Where Lake Tana feeds the Blue Nile',
    description:
      'Area near the Blue Nile bridge / outlet — a classic photo stop and orientation point for the start of the Blue Nile’s long journey.',
    lat: 11.605,
    lng: 37.405,
    address: 'Blue Nile outlet, Bahir Dar',
    duration: '30–60 minutes',
    bestTime: 'Daytime',
    costHint: 'Free',
    tips: ['Combine with Bezawit for views'],
    featured: true,
    href: '/places/blue-nile-bridge-outlet',
  },
  {
    id: 'tour-pier',
    name: 'Lake Tana Boat Pier',
    nameAm: 'የጀልባ ማረፊያ',
    category: 'activity',
    short: 'Departure point for monastery boats',
    description:
      'Shore area used for shared and private boats to Lake Tana monasteries. Negotiate shared vs private, islands, and return time before boarding.',
    lat: 11.605,
    lng: 37.39,
    address: 'Lake Tana shore, Bahir Dar',
    duration: 'Departure hub',
    bestTime: 'Early morning departures common',
    costHint: 'Shared boat cheaper; private higher — agree first',
    tips: [
      'Prefer hotel-arranged or known operators',
      'Write down the agreed price',
    ],
    featured: true,
    href: '/places/lake-tana-boat-pier',
  },
  {
    id: 'tour-market',
    name: 'Bahir Dar Central Market',
    nameAm: 'የባሕር ዳር ገበያ',
    category: 'market',
    short: 'Produce, spices, coffee, crafts',
    description:
      'Busy local market for produce, spices, coffee, and household goods. Best in the morning; keep valuables secure and bargain politely.',
    lat: 11.5925,
    lng: 37.388,
    address: 'Central Bahir Dar',
    duration: '1–3 hours',
    bestTime: 'Morning; Saturday often busier',
    costHint: 'Free to browse',
    tips: ['Go early', 'Watch pickpockets in crowds'],
    featured: true,
    href: '/places/bahir-dar-central-market',
  },
  {
    id: 'tour-lakeside',
    name: 'Lakeside promenade walk',
    nameAm: 'የሐይቅ ዳር ጉዞ',
    category: 'activity',
    short: 'Palm avenues · sunset air',
    description:
      'Walk lakeside roads and green avenues for views of Lake Tana, local life, and evening light — one of the easiest free activities in the city.',
    lat: 11.598,
    lng: 37.385,
    address: 'Lakeside Bahir Dar',
    duration: '1–2 hours',
    bestTime: 'Late afternoon / sunset',
    costHint: 'Free',
    tips: ['Combine with a café stop'],
    featured: false,
  },
  {
    id: 'tour-portuguese',
    name: 'Portuguese Bridge (near Falls)',
    nameAm: 'ፖርቱጋላዊ ድልድይ',
    category: 'culture',
    short: 'Historic bridge on Falls day trip',
    description:
      'Historic stone bridge area often visited on the same outing as Blue Nile Falls — part of the classic Tis Abay excursion.',
    lat: 11.492,
    lng: 37.58,
    address: 'Near Tis Abay / Blue Nile Falls approach',
    duration: 'With Falls visit',
    bestTime: 'Same day as Falls',
    costHint: 'Usually part of Falls day trip',
    tips: ['Slippery when wet'],
    featured: false,
  },
]

export const TOURISM_CATEGORIES: {
  id: TourismCategory
  label: string
  labelAm: string
}[] = [
  { id: 'nature', label: 'Nature', labelAm: 'ተፈጥሮ' },
  { id: 'religious', label: 'Monasteries', labelAm: 'ገዳሞች' },
  { id: 'viewpoint', label: 'Viewpoints', labelAm: 'እይታ' },
  { id: 'activity', label: 'Activities', labelAm: 'እንቅስቃሴ' },
  { id: 'market', label: 'Market', labelAm: 'ገበያ' },
  { id: 'culture', label: 'Heritage', labelAm: 'ቅርስ' },
]
