/**
 * Curated Bahir Dar local food recommendations for visitors.
 * Not live bookings. Confirm hours, menus, and prices on site.
 * Prefer asking your hotel for the week’s reliable spots.
 */

export type FoodPick = {
  id: string
  name: string
  /** Link to in-app place slug when seeded */
  slug?: string
  area: string
  cuisine: string
  tags: string[]
  priceLabel: string
  mustTry: string[]
  why: string
  tip?: string
  featured?: boolean
}

export type FoodNeighborhood = {
  id: string
  title: string
  blurb: string
}

export const FOOD_NEIGHBORHOODS: FoodNeighborhood[] = [
  {
    id: 'lakeside',
    title: 'Lakeside & pier',
    blurb: 'Fish, views, and tourist-friendly menus. Slightly higher prices; good for first nights.',
  },
  {
    id: 'center',
    title: 'City center',
    blurb: 'Injera houses, cafés, and everyday local meals. Best value; more Amharic, less English.',
  },
  {
    id: 'market',
    title: 'Near the market',
    blurb: 'Quick bites, coffee, and spices. Go for atmosphere more than formal dining.',
  },
]

export const LOCAL_RESTAURANT_PICKS: FoodPick[] = [
  {
    id: 'rec-fish',
    name: 'Lakeside fish (tilapia / Nile perch)',
    slug: 'lake-fish-grill-demo',
    area: 'Lake Tana shore',
    cuisine: 'Seafood · Ethiopian lakeside',
    tags: ['fish', 'lakeside', 'lunch', 'dinner'],
    priceLabel: '~180–500 ETB / main (est.)',
    mustTry: ['Fried or grilled tilapia', 'Fish tibs', 'Fresh juice'],
    why: 'Bahir Dar is famous for lake fish. A simple grilled or fried plate is a local classic after a boat trip.',
    tip: 'Ask whether the catch is from the lake that day. Agree the size/price if not on a fixed menu.',
    featured: true,
  },
  {
    id: 'rec-injera',
    name: 'Traditional injera house',
    slug: 'tana-traditional-restaurant-demo',
    area: 'City center / near pier',
    cuisine: 'Ethiopian traditional',
    tags: ['injera', 'vegetarian-friendly', 'local'],
    priceLabel: '~80–350 ETB / plate (est.)',
    mustTry: ['Beyaynetu (veg combo)', 'Doro or key tibs', 'Shiro', 'Ethiopian coffee'],
    why: 'Shared injera platters are the heart of Amhara hospitality. Beyaynetu is ideal if you want many flavors at once.',
    tip: 'Eat with the right hand. “Sinzer” (extra injera) is normal to request.',
    featured: true,
  },
  {
    id: 'rec-family',
    name: 'Neighborhood family kitchen',
    slug: 'abay-family-kitchen-demo',
    area: 'Inner city',
    cuisine: 'Home-style Ethiopian',
    tags: ['budget', 'local', 'lunch'],
    priceLabel: '~50–200 ETB (est.)',
    mustTry: ['Shiro', 'Firfir', 'Omelette / scrambled eggs with injera'],
    why: 'Everyday Bahir Dar meals — filling, fast, and far cheaper than hotel restaurants.',
    tip: 'Look for busy lunch crowds. English menus may be limited; pointing works.',
    featured: true,
  },
  {
    id: 'rec-coffee',
    name: 'City coffee stop',
    slug: 'city-cafe-demo',
    area: 'Main road / center',
    cuisine: 'Café',
    tags: ['coffee', 'snack', 'wifi-maybe'],
    priceLabel: 'Coffee ~30–80 ETB (est.)',
    mustTry: ['Bunna (coffee)', 'Macchiato', 'Pastry or sambusa'],
    why: 'Ethiopia’s coffee culture is part of any Bahir Dar day. A mid-morning bunna break is local routine.',
    tip: 'Ceremony-style coffee is slower and social; espresso bars are faster for travelers.',
    featured: true,
  },
  {
    id: 'rec-zege-coffee',
    name: 'Specialty / “Zege” style café',
    slug: 'zege-coffee-house-demo',
    area: 'Center',
    cuisine: 'Café · light bites',
    tags: ['coffee', 'chat', 'afternoon'],
    priceLabel: '~40–200 ETB (est.)',
    mustTry: ['Single-origin style coffee', 'Tea', 'Light sandwich or cake'],
    why: 'Zege peninsula is tied to coffee stories; cafés lean into that narrative for visitors and students.',
    tip: 'Good place to plan boat trips or rest after the market.',
  },
  {
    id: 'rec-hotel-buffet',
    name: 'Hotel restaurant (reliable fallback)',
    area: 'Lakeside hotels',
    cuisine: 'Mixed · international + Ethiopian',
    tags: ['hotel', 'safe-choice', 'dinner'],
    priceLabel: 'Higher · ~300–1500+ ETB/meal',
    mustTry: ['Breakfast buffet', 'Lake fish', 'Pasta / grilled meat'],
    why: 'When you want predictable hygiene, English menus, and card payment options, hotel dining is the practical choice.',
    tip: 'Still walk out for at least one real injera meal — hotels alone miss the local flavor.',
  },
  {
    id: 'rec-breakfast',
    name: 'Local breakfast',
    area: 'Anywhere busy in the morning',
    cuisine: 'Ethiopian breakfast',
    tags: ['breakfast', 'budget'],
    priceLabel: '~40–150 ETB (est.)',
    mustTry: ['Firfir', 'Chechebsa / kita firfir', 'Ful', 'Tea or coffee'],
    why: 'Start early like locals before boat or Falls day trips. Filling and cheap.',
    tip: 'Many places open early; hotel breakfast is later and pricier.',
  },
  {
    id: 'rec-juice',
    name: 'Fresh juice stalls',
    area: 'Center & lakeside',
    cuisine: 'Juice · snacks',
    tags: ['juice', 'snack', 'hot-day'],
    priceLabel: '~30–100 ETB (est.)',
    mustTry: ['Avocado juice', 'Mango', 'Mixed “special”'],
    why: 'Popular in the heat after walking the shore. Refreshing and widely available.',
    tip: 'Prefer busy stalls; ask for less sugar if you want.',
  },
]

export const FOOD_ETIQUETTE = [
  'Eat injera with the right hand; tear small pieces and scoop stews.',
  'Sharing from one platter is normal among friends and family.',
  '“Ameseginalehu” (thank you) and a smile go far in small kitchens.',
  'Friday fasting periods matter for many Orthodox Christians — fish and veg options increase.',
  'Tipping is appreciated in tourist restaurants; not always expected in tiny local houses.',
]

export const FOOD_SAFETY = [
  'Choose busy kitchens with high turnover for local meals.',
  'Bottled water only; be cautious with ice and raw salads if your stomach is sensitive.',
  'Hotel and well-reviewed lakeside spots are safer bets on day one.',
  'If you have allergies, ask clearly — English varies by venue.',
]
