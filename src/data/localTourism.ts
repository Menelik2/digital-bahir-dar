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
  /** Approximate entry fee in ETB (null = free / variable) */
  entryFeeEtb?: number | null
  tips: string[]
  tipsAm?: string[]
  howToGet: string
  whatToBring?: string[]
  nearby?: string[]
  highlights?: string[]
  dressCode?: string
  featured?: boolean
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
      'Lake Tana is Ethiopia’s largest lake and the source region of the Blue Nile. It hosts island monasteries, rich birdlife, papyrus shorelines, and traditional tankwa reed boats. Most visitors stay in Bahir Dar and take a morning boat to the Zege Peninsula or selected islands. Lake Tana is also a UNESCO Biosphere Reserve.',
    lat: 11.6167,
    lng: 37.4,
    address: 'Southern shore / Bahir Dar waterfront',
    duration: 'Half day – full day',
    bestTime: 'Morning boats; Oct–May for calmer weather',
    costHint: 'Shared half-day boat often ~800–5000 ETB/person',
    entryFeeEtb: null,
    tips: [
      'Book via hotel or a known boat operator',
      'Bring sun protection, water, and cash in ETB',
      'Confirm which monasteries are open to visitors that day',
      'Morning departures are usually cooler and calmer',
    ],
    howToGet: 'Walk or bajaj to the Lake Tana boat pier area on the Bahir Dar shore. Hotel desks can arrange shared or private boats.',
    whatToBring: ['Hat / sunscreen', 'Water', 'Modest clothing for churches', 'Cash ETB'],
    nearby: ['Lake Tana Boat Pier', 'Lakeside promenade walk', 'Blue Nile Bridge / Outlet'],
    highlights: ['Island monasteries', 'Birdwatching', 'Blue Nile source region'],
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
      'One of the most visited Lake Tana monasteries. Known for vivid wall paintings and a circular thatched church. Reached by boat to the Zege Peninsula, then a walk through coffee forest. Often combined with Azuwa Maryam on the same tour.',
    lat: 11.695,
    lng: 37.335,
    address: 'Zege Peninsula, Lake Tana',
    duration: '2–4 hours with boat',
    bestTime: 'Morning',
    costHint: 'Entry ~50–300 ETB each + boat share',
    entryFeeEtb: 100,
    tips: [
      'Modest dress — cover shoulders and knees',
      'Remove shoes inside the church',
      'Ask before photographing interiors or priests',
      'Keep noise low; this is an active religious site',
    ],
    howToGet: 'Boat from Bahir Dar pier to Zege landing, then footpath through forest (15–40 min walk depending on pace).',
    whatToBring: ['Modest clothes', 'Socks (shoes off)', 'Water', 'Small bills for entry'],
    nearby: ['Azuwa Maryam Monastery', 'Lake Tana'],
    highlights: ['Wall paintings', 'Circular architecture', 'Coffee forest walk'],
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
      'Monastery on the Zege Peninsula often paired with Ura Kidane Mehret. Traditional circular form, thatched roof, and interior paintings. Suitable for a shared half-day boat itinerary.',
    lat: 11.69,
    lng: 37.34,
    address: 'Zege Peninsula, Lake Tana',
    duration: 'Part of half-day boat tour',
    bestTime: 'Morning',
    costHint: 'Entry + shared boat (confirm on site)',
    entryFeeEtb: 100,
    tips: ['Usually visited with Ura on the same tour', 'Modest dress required'],
    howToGet: 'Same boat landing as other Zege monasteries from Bahir Dar pier.',
    nearby: ['Ura Kidane Mehret Monastery'],
    highlights: ['Thatched circular church', 'Paintings'],
    dressCode: 'Modest dress',
    featured: true,
    href: '/places/azuwa-maryam-monastery',
  },
  {
    id: 'tour-falls',
    name: 'Blue Nile Falls (Tis Issat)',
    nameAm: 'ጢስ አባይ / ጢስ እሳት',
    category: 'nature',
    short: 'Tis Abay · day trip from Bahir Dar',
    shortAm: 'ከባሕር ዳር የቀን ጉዞ',
    description:
      'Locally Tis Abay / Tis Issat (“smoking water”). About 30–35 km southeast of Bahir Dar. The falls are most dramatic after the rains; hydro diversion can reduce flow in the dry season. Classic outing includes a walk, viewpoints, and often the historic Portuguese bridge area.',
    lat: 11.489,
    lng: 37.587,
    address: 'Tis Abay area, SE of Bahir Dar',
    duration: 'Half–full day',
    bestTime: 'Jun–Sep for stronger flow',
    costHint: 'Entry + guide + car/tour (confirm on site)',
    entryFeeEtb: 150,
    tips: [
      'Wear shoes with good grip',
      'Expect spray and mud in wet season',
      'Road can be rough — allow 1–1.5 h each way',
      'Ask hotel about current water levels before you go',
    ],
    howToGet: 'Private car, organized tour, or shared transport toward Tis Abay town, then walk to viewpoints.',
    whatToBring: ['Grippy shoes', 'Light rain jacket', 'Water', 'Cash for entry/guide'],
    nearby: ['Portuguese Bridge (near Falls)'],
    highlights: ['Waterfall viewpoints', 'Mist in high season', 'Portuguese bridge'],
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
      'Hill overlooking the Blue Nile outlet and Lake Tana. Popular for sunrise and sunset photos of the city, river, and lake. Short outing that pairs well with the Blue Nile Bridge / Outlet.',
    lat: 11.6015,
    lng: 37.4025,
    address: 'Bezawit Hill, Bahir Dar',
    duration: '45–90 minutes',
    bestTime: 'Sunrise or sunset',
    costHint: 'Often free or small fee',
    entryFeeEtb: 0,
    tips: ['Paths can be steep after rain', 'Go late day for soft light'],
    howToGet: 'Bajaj or walk from central Bahir Dar toward Bezawit Hill; ask locals for “Bezawit”.',
    nearby: ['Blue Nile Bridge / Outlet', 'Lakeside promenade walk'],
    highlights: ['Panoramic views', 'Sunset photography'],
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
      'Where Lake Tana feeds the Blue Nile. Popular photo stop near town. Combine with Bezawit viewpoint for a short outing. Good orientation point for understanding how the lake becomes the river that eventually joins the White Nile.',
    lat: 11.605,
    lng: 37.405,
    address: 'Blue Nile outlet, Bahir Dar',
    duration: '20–40 minutes',
    bestTime: 'Late afternoon',
    costHint: 'Free',
    entryFeeEtb: 0,
    tips: [
      'Combine with Bezawit for higher views',
      'Watch traffic near the bridge',
      'Nice light near sunset',
    ],
    howToGet: 'Short bajaj or walk from lakeside / central Bahir Dar toward the Blue Nile bridge area.',
    whatToBring: ['Camera', 'Water'],
    nearby: ['Bezawit Palace Viewpoint', 'Lake Tana', 'Lakeside promenade walk'],
    highlights: ['Nile outlet views', 'Bridge photos', 'Easy city stop'],
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
      'Main shore area for shared and private boats to Lake Tana monasteries. Agree price, islands, and return time in ETB before boarding. Hotels can arrange trusted operators if you prefer not to negotiate at the pier.',
    lat: 11.605,
    lng: 37.39,
    address: 'Lake Tana shore, Bahir Dar',
    duration: 'Departure hub',
    bestTime: 'Early morning departures',
    costHint: 'Shared cheaper; private higher — agree first',
    entryFeeEtb: null,
    tips: [
      'Prefer hotel-arranged or known operators',
      'Write down the agreed price',
      'Confirm fuel / island list / return time',
    ],
    howToGet: 'Bajaj or walk to the lakeshore pier zone; ask for “boat” or “monastery boat”.',
    nearby: ['Lake Tana', 'Lakeside promenade walk'],
    highlights: ['Boat booking', 'Lake access'],
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
      'Busy local market for produce, spices, coffee, textiles, and household goods. Best in the morning. Bargain politely and keep valuables secure in crowded aisles. Saturday is often busiest.',
    lat: 11.5925,
    lng: 37.388,
    address: 'Central Bahir Dar',
    duration: '1–3 hours',
    bestTime: 'Morning; Saturday peak',
    costHint: 'Free to browse',
    entryFeeEtb: 0,
    tips: ['Go early for best selection', 'Keep bags zipped', 'Start lower when bargaining'],
    howToGet: 'Central Bahir Dar — ask bajaj for the main market / “gebeya”.',
    nearby: ['Lakeside promenade walk'],
    highlights: ['Spices & coffee', 'Local life', 'Textiles'],
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
      'Walk lakeside roads and green avenues for Lake Tana views, local life, and evening light. One of the easiest free activities in Bahir Dar — pair with coffee or lake fish.',
    lat: 11.598,
    lng: 37.385,
    address: 'Lakeside Bahir Dar',
    duration: '1–2 hours',
    bestTime: 'Late afternoon / sunset',
    costHint: 'Free',
    entryFeeEtb: 0,
    tips: ['Combine with a café stop', 'Safe general evening stroll; still use normal city caution'],
    howToGet: 'Start from hotels near the lake or the pier and walk along the shore roads.',
    nearby: ['Lake Tana Boat Pier', 'Blue Nile Bridge / Outlet'],
    highlights: ['Sunset', 'Palm avenues', 'Free activity'],
    featured: true,
    href: '/places/lakeside-promenade-walk',
  },
  {
    id: 'tour-portuguese',
    name: 'Portuguese Bridge (near Falls)',
    nameAm: 'ፖርቱጋላዊ ድልድይ',
    category: 'culture',
    short: 'Historic bridge on Falls day trip',
    description:
      'Historic stone bridge area often visited with Blue Nile Falls. Part of the classic Tis Abay excursion. Surfaces can be slippery when wet.',
    lat: 11.492,
    lng: 37.58,
    address: 'Near Tis Abay / Blue Nile Falls approach',
    duration: 'With Falls visit',
    bestTime: 'Same day as Falls',
    costHint: 'Usually included in Falls day trip',
    entryFeeEtb: null,
    tips: ['Slippery when wet', 'Wear grippy shoes'],
    howToGet: 'On the approach path / road used for Blue Nile Falls day trips.',
    nearby: ['Blue Nile Falls (Tis Issat)'],
    highlights: ['Historic bridge', 'Falls combo'],
    featured: true,
    href: '/places/portuguese-bridge-near-falls',
  },
  {
    id: 'tour-debre-maryam',
    name: 'Debre Maryam Monastery',
    nameAm: 'ደብረ ማርያም',
    category: 'religious',
    short: 'Island monastery · short boat hop',
    description:
      'Island monastery on Lake Tana, often reachable on a shorter boat ride from Bahir Dar compared with distant islands. Known for religious heritage; confirm visitor access and dress rules before departure.',
    lat: 11.62,
    lng: 37.41,
    address: 'Lake Tana island near Bahir Dar',
    duration: '2–3 hours with boat',
    bestTime: 'Morning',
    costHint: 'Boat + entry (confirm locally)',
    entryFeeEtb: 100,
    tips: ['Modest dress', 'Confirm open hours with boatman', 'Combine with lakeside lunch'],
    howToGet: 'Boat from Bahir Dar pier — ask for Debre Maryam.',
    nearby: ['Lake Tana', 'Lake Tana Boat Pier'],
    highlights: ['Island setting', 'Shorter boat option'],
    dressCode: 'Modest dress',
    featured: true,
    href: '/places/debre-maryam-monastery',
  },
  {
    id: 'tour-st-george',
    name: 'St. George Church (Bahir Dar)',
    nameAm: 'ቅዱስ ጊዮርጊስ',
    category: 'religious',
    short: 'City church · local worship',
    description:
      'Important Orthodox church in Bahir Dar used by the local community. Visitors should dress modestly, keep quiet during services, and ask before taking photos inside.',
    lat: 11.593,
    lng: 37.391,
    address: 'Bahir Dar city',
    duration: '30–60 minutes',
    bestTime: 'Outside major service times unless invited',
    costHint: 'Usually free; donations welcome',
    entryFeeEtb: 0,
    tips: ['Modest dress', 'Remove shoes if required', 'Ask before photos'],
    howToGet: 'Central Bahir Dar — bajaj drivers know major churches.',
    nearby: ['Bahir Dar Central Market'],
    highlights: ['Local worship life', 'City culture'],
    dressCode: 'Modest dress',
    featured: true,
    href: '/places/st-george-church-bahir-dar',
  },
  {
    id: 'tour-martyrs',
    name: 'Martyrs Memorial Monument',
    nameAm: 'የሰማዕታት መታሰቢያ',
    category: 'culture',
    short: 'Memorial · city landmark',
    description:
      'Public memorial monument in Bahir Dar. A short stop for context on local history. Combine with a city walk or market visit.',
    lat: 11.591,
    lng: 37.387,
    address: 'Bahir Dar',
    duration: '20–40 minutes',
    bestTime: 'Daytime',
    costHint: 'Usually free',
    entryFeeEtb: 0,
    tips: ['Respectful behavior at memorial sites'],
    howToGet: 'City center — ask for the martyrs memorial / monument.',
    nearby: ['Bahir Dar Central Market'],
    highlights: ['Local history', 'Photo stop'],
    featured: true,
    href: '/places/martyrs-memorial-monument',
  },
  {
    id: 'tour-fish-market',
    name: 'Lakeside fish stalls',
    nameAm: 'የሐይቅ ዓሳ',
    category: 'market',
    short: 'Fresh lake fish · local food',
    description:
      'Area near the lake where fresh fish is sold and prepared. Good place to see daily lake economy and try tilapia or other lake fish at nearby eateries. Confirm hygiene and cooking on site.',
    lat: 11.601,
    lng: 37.388,
    address: 'Near Lake Tana shore, Bahir Dar',
    duration: '45–90 minutes',
    bestTime: 'Late morning to afternoon',
    costHint: 'Meals often ~180–500 ETB',
    entryFeeEtb: 0,
    tips: ['Eat at busy stalls', 'Agree meal price first'],
    howToGet: 'Lakeside zone near the pier and shore restaurants.',
    nearby: ['Lake Tana Boat Pier', 'Lakeside promenade walk'],
    highlights: ['Lake fish', 'Local food culture'],
    featured: true,
    href: '/places/lakeside-fish-stalls',
  },
  {
    id: 'tour-university',
    name: 'Bahir Dar University area',
    nameAm: 'ባሕር ዳር ዩኒቨርሲቲ',
    category: 'culture',
    short: 'Campus zone · city energy',
    description:
      'University area reflecting Bahir Dar’s role as a regional education hub. Useful orientation stop if you want a sense of modern city life beyond the tourist shore.',
    lat: 11.574,
    lng: 37.361,
    address: 'Bahir Dar University area',
    duration: '1–2 hours',
    bestTime: 'Daytime',
    costHint: 'Free to pass through public roads',
    entryFeeEtb: 0,
    tips: ['Respect campus rules', 'Combine with transport toward airport side of town'],
    howToGet: 'Bajaj or minibus toward Bahir Dar University.',
    nearby: [],
    highlights: ['Modern city life', 'Student energy'],
    featured: false,
    href: '/places/bahir-dar-university-area',
  },
  {
    id: 'tour-abay-mado',
    name: 'Abay / Nile Avenue stretch',
    nameAm: 'አባይ መንገድ',
    category: 'activity',
    short: 'Main roads · hotels & services',
    description:
      'Key avenue corridors with hotels, services, and traffic toward the lake and bridge. Practical for orientation, bajaj negotiation practice, and finding ATMs or cafés.',
    lat: 11.595,
    lng: 37.392,
    address: 'Main avenues, Bahir Dar',
    duration: 'Flexible',
    bestTime: 'Daytime',
    costHint: 'Free',
    entryFeeEtb: 0,
    tips: ['Agree bajaj price before starting', 'ATMs along main roads'],
    howToGet: 'Central road network — most hotel taxis and bajaj use these corridors.',
    nearby: ['Bahir Dar Central Market', 'Blue Nile Bridge / Outlet'],
    highlights: ['Orientation', 'Services corridor'],
    featured: false,
    href: '/places/abay-nile-avenue-stretch',
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
