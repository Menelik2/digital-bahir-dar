/**
 * Curated Bahir Dar local food recommendations for visitors.
 * Not live bookings. Confirm hours, menus, and prices on site.
 */

export type FoodPick = {
  id: string
  name: string
  nameAm?: string
  slug?: string
  area: string
  areaAm?: string
  cuisine: string
  cuisineAm?: string
  tags: string[]
  priceLabel: string
  mustTry: string[]
  mustTryAm?: string[]
  why: string
  whyAm?: string
  tip?: string
  tipAm?: string
  featured?: boolean
}

export type FoodNeighborhood = {
  id: string
  title: string
  titleAm: string
  blurb: string
  blurbAm: string
}

export const FOOD_NEIGHBORHOODS: FoodNeighborhood[] = [
  {
    id: 'lakeside',
    title: 'Lakeside & pier',
    titleAm: 'በሐይቅ ዳር እና ማረፊያ',
    blurb: 'Fish, views, and tourist-friendly menus. Slightly higher prices; good for first nights.',
    blurbAm: 'አሳ፣ እይታ እና ለጎብኝዎች ምቹ ምናሌ። በትንሹ ከፍ ያለ ዋጋ፤ ለመጀመሪያ ሌሊቶች ጥሩ።',
  },
  {
    id: 'center',
    title: 'City center',
    titleAm: 'የከተማ መሃል',
    blurb: 'Injera houses, cafés, and everyday local meals. Best value; more Amharic, less English.',
    blurbAm: 'የእንጀራ ቤቶች፣ ካፌዎች እና የዕለት ተዕለት የአካባቢ ምግብ። ምርጥ ዋጋ፤ ብዙ አማርኛ።',
  },
  {
    id: 'market',
    title: 'Near the market',
    titleAm: 'በገበያ አጠገብ',
    blurb: 'Quick bites, coffee, and spices. Go for atmosphere more than formal dining.',
    blurbAm: 'ፈጣን መክሰስ፣ ቡና እና ቅመሞች። ከመደበኛ ምግብ ይልቅ ለከባቢያዊ ስሜት።',
  },
]

export const LOCAL_RESTAURANT_PICKS: FoodPick[] = [
  {
    id: 'rec-fish',
    name: 'Lakeside fish (tilapia / Nile perch)',
    nameAm: 'የሐይቅ አሳ (ጥሉፒያ / ናይል ፐርች)',
    slug: 'lake-fish-grill-demo',
    area: 'Lake Tana shore',
    areaAm: 'የጣና ሐይቅ ዳር',
    cuisine: 'Seafood · Ethiopian lakeside',
    cuisineAm: 'የባህር ምግብ · የኢትዮጵያ ሐይቅ',
    tags: ['fish', 'lakeside', 'lunch', 'dinner'],
    priceLabel: '~180–500 ETB / main (est.)',
    mustTry: ['Fried or grilled tilapia', 'Fish tibs', 'Fresh juice'],
    mustTryAm: ['የተጠበሰ ወይም የተጠበሰ ጥሉፒያ', 'የአሳ ጥብስ', 'ትኩስ ጭማቂ'],
    why: 'Bahir Dar is famous for lake fish. A simple grilled or fried plate is a local classic after a boat trip.',
    whyAm: 'ባሕር ዳር በሐይቅ አሳ ታዋቂ ነው። ከጀልባ በኋላ ቀላል የተጠበሰ ወይም የተጠበሰ ሳህን የአካባቢ ክላሲክ ነው።',
    tip: 'Ask whether the catch is from the lake that day. Agree the size/price if not on a fixed menu.',
    tipAm: 'አሳው በዚያ ቀን ከሐይቁ መሆኑን ይጠይቁ። በቋሚ ምናሌ ካልሆነ መጠን/ዋጋ ይስማሙ።',
    featured: true,
  },
  {
    id: 'rec-injera',
    name: 'Traditional injera house',
    nameAm: 'ባህላዊ የእንጀራ ቤት',
    slug: 'tana-traditional-restaurant-demo',
    area: 'City center / near pier',
    areaAm: 'መሃል ከተማ / በማረፊያ አጠገብ',
    cuisine: 'Ethiopian traditional',
    cuisineAm: 'ባህላዊ ኢትዮጵያዊ',
    tags: ['injera', 'vegetarian-friendly', 'local'],
    priceLabel: '~80–350 ETB / plate (est.)',
    mustTry: ['Beyaynetu (veg combo)', 'Doro or key tibs', 'Shiro', 'Ethiopian coffee'],
    mustTryAm: ['በያይነቱ (አትክልት)', 'ዶሮ ወይም ቀይ ጥብስ', 'ሽሮ', 'የኢትዮጵያ ቡና'],
    why: 'Shared injera platters are the heart of Amhara hospitality. Beyaynetu is ideal if you want many flavors at once.',
    whyAm: 'የጋራ እንጀራ ሳህኖች የአማራ እንግዳ ተቀባይነት ልብ ናቸው። በያይነቱ ብዙ ጣዕም በአንድ ጊዜ ለሚፈልጉ ምርጥ ነው።',
    tip: 'Eat with the right hand. “Sinzer” (extra injera) is normal to request.',
    tipAm: 'በቀኝ እጅ ይብሉ። «ስንዘር» (ተጨማሪ እንጀራ) መጠየቅ የተለመደ ነው።',
    featured: true,
  },
  {
    id: 'rec-family',
    name: 'Neighborhood family kitchen',
    nameAm: 'የአካባቢ የቤተሰብ ኩሽና',
    slug: 'abay-family-kitchen-demo',
    area: 'Inner city',
    areaAm: 'ውስጥ ከተማ',
    cuisine: 'Home-style Ethiopian',
    cuisineAm: 'የቤት ስታይል ኢትዮጵያዊ',
    tags: ['budget', 'local', 'lunch'],
    priceLabel: '~50–200 ETB (est.)',
    mustTry: ['Shiro', 'Firfir', 'Omelette / scrambled eggs with injera'],
    mustTryAm: ['ሽሮ', 'ፍርፍር', 'ኦሜሌት / እንቁላል ከእንጀራ ጋር'],
    why: 'Everyday Bahir Dar meals — filling, fast, and far cheaper than hotel restaurants.',
    whyAm: 'የዕለት ተዕለት የባሕር ዳር ምግብ — ሙሉ፣ ፈጣን፣ ከሆቴል ምግብ ቤት ርካሽ።',
    tip: 'Look for busy lunch crowds. English menus may be limited; pointing works.',
    tipAm: 'በሰዓት የተጨናነቁ ቦታዎችን ይፈልጉ። የእንግሊዝኛ ምናሌ ሊገድብ ይችላል፤ ማመላከት ይሰራል።',
    featured: true,
  },
  {
    id: 'rec-coffee',
    name: 'City coffee stop',
    nameAm: 'የከተማ ቡና ማቆሚያ',
    slug: 'city-cafe-demo',
    area: 'Main road / center',
    areaAm: 'ዋና መንገድ / መሃል',
    cuisine: 'Café',
    cuisineAm: 'ካፌ',
    tags: ['coffee', 'snack', 'wifi-maybe'],
    priceLabel: 'Coffee ~30–80 ETB (est.)',
    mustTry: ['Bunna (coffee)', 'Macchiato', 'Pastry or sambusa'],
    mustTryAm: ['ቡና', 'ማኪያቶ', 'ፓስትሪ ወይም ሳምቡሳ'],
    why: 'Ethiopia’s coffee culture is part of any Bahir Dar day. A mid-morning bunna break is local routine.',
    whyAm: 'የኢትዮጵያ የቡና ባህል የማንኛውም የባሕር ዳር ቀን ክፍል ነው። የጠዋት ቡና የአካባቢ ልማድ ነው።',
    tip: 'Ceremony-style coffee is slower and social; espresso bars are faster for travelers.',
    tipAm: 'የቡና ሥርዓት ቀርፋፋ እና ማኅበራዊ ነው፤ ኤስፕረሶ ባሮች ለተጓዦች ፈጣን ናቸው።',
    featured: true,
  },
  {
    id: 'rec-zege-coffee',
    name: 'Specialty / “Zege” style café',
    nameAm: 'ልዩ / «ዘገ» ስታይል ካፌ',
    slug: 'zege-coffee-house-demo',
    area: 'Center',
    areaAm: 'መሃል',
    cuisine: 'Café · light bites',
    cuisineAm: 'ካፌ · ቀላል መክሰስ',
    tags: ['coffee', 'chat', 'afternoon'],
    priceLabel: '~40–200 ETB (est.)',
    mustTry: ['Single-origin style coffee', 'Tea', 'Light sandwich or cake'],
    mustTryAm: ['ልዩ ቡና', 'ሻይ', 'ቀላል ሳንድዊች ወይም ኬክ'],
    why: 'Zege peninsula is tied to coffee stories; cafés lean into that narrative for visitors and students.',
    whyAm: 'የዘገ ባሕረ ገብ መሬት ከቡና ታሪኮች ጋር የተያያዘ ነው፤ ካፌዎች ለጎብኝዎች እና ተማሪዎች ያንን ያጎላሉ።',
    tip: 'Good place to plan boat trips or rest after the market.',
    tipAm: 'የጀልባ ጉዞ ለማቀድ ወይም ከገበያ በኋላ ለማረፍ ጥሩ ቦታ።',
  },
  {
    id: 'rec-hotel-buffet',
    name: 'Hotel restaurant (reliable fallback)',
    nameAm: 'የሆቴል ምግብ ቤት (አስተማማኝ አማራጭ)',
    area: 'Lakeside hotels',
    areaAm: 'በሐይቅ ዳር ሆቴሎች',
    cuisine: 'Mixed · international + Ethiopian',
    cuisineAm: 'ድብልቅ · ዓለም አቀፍ + ኢትዮጵያዊ',
    tags: ['hotel', 'safe-choice', 'dinner'],
    priceLabel: 'Higher · ~300–1500+ ETB/meal',
    mustTry: ['Breakfast buffet', 'Lake fish', 'Pasta / grilled meat'],
    mustTryAm: ['የቁርስ ቡፌ', 'የሐይቅ አሳ', 'ፓስታ / የተጠበሰ ሥጋ'],
    why: 'When you want predictable hygiene, English menus, and card payment options, hotel dining is the practical choice.',
    whyAm: 'የተረጋገጠ ንፅህና፣ የእንግሊዝኛ ምናሌ እና የካርድ ክፍያ ሲፈልጉ የሆቴል ምግብ ተግባራዊ ምርጫ ነው።',
    tip: 'Still walk out for at least one real injera meal — hotels alone miss the local flavor.',
    tipAm: 'ቢያንስ አንድ እውነተኛ የእንጀራ ምግብ በውጭ ይብሉ — ሆቴል ብቻውን የአካባቢ ጣዕም ያጣል።',
  },
  {
    id: 'rec-breakfast',
    name: 'Local breakfast',
    nameAm: 'የአካባቢ ቁርስ',
    area: 'Anywhere busy in the morning',
    areaAm: 'በጠዋት የተጨናነቀ ቦታ',
    cuisine: 'Ethiopian breakfast',
    cuisineAm: 'የኢትዮጵያ ቁርስ',
    tags: ['breakfast', 'budget'],
    priceLabel: '~40–150 ETB (est.)',
    mustTry: ['Firfir', 'Chechebsa / kita firfir', 'Ful', 'Tea or coffee'],
    mustTryAm: ['ፍርፍር', 'ጨጨብሳ / ኪታ ፍርፍር', 'ፉል', 'ሻይ ወይም ቡና'],
    why: 'Start early like locals before boat or Falls day trips. Filling and cheap.',
    whyAm: 'ከጀልባ ወይም ፏፏቴ ጉዞ በፊት እንደ አካባቢው ቀደም ብለው ይጀምሩ። ሙሉ እና ርካሽ።',
    tip: 'Many places open early; hotel breakfast is later and pricier.',
    tipAm: 'ብዙ ቦታዎች ቀደም ብለው ይከፈታሉ፤ የሆቴል ቁርስ ዘግይቶ እና ውድ ነው።',
  },
  {
    id: 'rec-juice',
    name: 'Fresh juice stalls',
    nameAm: 'ትኩስ ጭማቂ መሸጫዎች',
    area: 'Center & lakeside',
    areaAm: 'መሃል እና ሐይቅ ዳር',
    cuisine: 'Juice · snacks',
    cuisineAm: 'ጭማቂ · መክሰስ',
    tags: ['juice', 'snack', 'hot-day'],
    priceLabel: '~30–100 ETB (est.)',
    mustTry: ['Avocado juice', 'Mango', 'Mixed “special”'],
    mustTryAm: ['የአቮካዶ ጭማቂ', 'ማንጎ', 'ድብልቅ «ስፔሻል»'],
    why: 'Popular in the heat after walking the shore. Refreshing and widely available.',
    whyAm: 'ከባሕር ዳር በኋላ በሙቀት ውስጥ ተወዳጅ። ማደስ እና በሰፊው ይገኛል።',
    tip: 'Prefer busy stalls; ask for less sugar if you want.',
    tipAm: 'የተጨናነቁ መሸጫዎችን ይምረጡ፤ ስኳር ብዙ ካልፈለጉ ይጠይቁ።',
  },
]

export const FOOD_ETIQUETTE = [
  'Eat injera with the right hand; tear small pieces and scoop stews.',
  'Sharing from one platter is normal among friends and family.',
  '“Ameseginalehu” (thank you) and a smile go far in small kitchens.',
  'Friday fasting periods matter for many Orthodox Christians — fish and veg options increase.',
  'Tipping is appreciated in tourist restaurants; not always expected in tiny local houses.',
]

export const FOOD_ETIQUETTE_AM = [
  'እንጀራን በቀኝ እጅ ይብሉ፤ ትናንሽ ቁርጥራጮች ቀድደው ወጥ ይወስዱ።',
  'ከአንድ ሳህን መጋራት በጓደኞች እና ቤተሰብ መካከል የተለመደ ነው።',
  '«አመሰግናለሁ» እና ፈገግታ በትናንሽ ኩሽናዎች ብዙ ያደርጋል።',
  'የአርብ ጾም ለብዙ ኦርቶዶክስ ክርስቲያኖች አስፈላጊ ነው — የአሳ እና አትክልት አማራጮች ይጨምራሉ።',
  'በጎብኝ ምግብ ቤቶች ቲፕ ይደነቃል፤ በትንንሽ የአካባቢ ቤቶች ሁልጊዜ አይጠበቅም።',
]

export const FOOD_SAFETY = [
  'Choose busy kitchens with high turnover for local meals.',
  'Bottled water only; be cautious with ice and raw salads if your stomach is sensitive.',
  'Hotel and well-reviewed lakeside spots are safer bets on day one.',
  'If you have allergies, ask clearly — English varies by venue.',
]

export const FOOD_SAFETY_AM = [
  'ለአካባቢያዊ ምግብ ከፍተኛ እንቅስቃሴ ያላቸው የተጨናነቁ ኩሽናዎችን ይምረጡ።',
  'የታሸገ ውሃ ብቻ፤ ሆድዎ ስሜታዊ ከሆነ ከበረዶ እና ጥሬ ሰላጣ ይጠንቀቁ።',
  'በመጀመሪያ ቀን ሆቴል እና በደንብ የተገመገሙ የሐይቅ ዳር ቦታዎች ደህንነታቸው የተጠበቀ ነው።',
  'አለርጂ ካለዎት በግልጽ ይጠይቁ — እንግሊዝኛ በቦታ ይለያያል።',
]
