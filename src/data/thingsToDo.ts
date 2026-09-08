/**
 * Real visitor checklist for Bahir Dar — practical order of importance.
 * Times/costs are typical ranges (ETB) and vary by season and negotiation.
 */

export type TodoPillar = 'must' | 'see' | 'eat' | 'move' | 'money' | 'plan'

export interface CityTodo {
  id: string
  title: string
  titleAm: string
  description: string
  descriptionAm: string
  tip?: string
  tipAm?: string
  pillar: TodoPillar
  timeLabel: string
  timeLabelAm: string
  costLabel: string
  costLabelAm: string
  /** Lower = do sooner */
  priority: number
  href?: string
}

export const PILLAR_LABEL: Record<TodoPillar, { en: string; am: string }> = {
  must: { en: 'Must do', am: 'አስፈላጊ' },
  see: { en: 'See & experience', am: 'ይጎብኙ' },
  eat: { en: 'Eat & drink', am: 'ምግብ' },
  move: { en: 'Getting around', am: 'መጓጓዣ' },
  money: { en: 'Money & safety', am: 'ገንዘብና ደህንነት' },
  plan: { en: 'Plan more', am: 'እቅድ' },
}

/** Ordered by real visitor priority for Bahir Dar */
export const CITY_TODOS: CityTodo[] = [
  {
    id: 'todo-lake-boat',
    title: 'Take a Lake Tana boat trip',
    titleAm: 'የጣና ሐይቅ ጀልባ ጉዞ ይውሰዱ',
    description:
      'Visit island monasteries (e.g. Ura Kidane Mehret). Morning departures are calmer; agree the price and islands before boarding.',
    descriptionAm:
      'የደሴት ገዳማትን ይጎብኙ (ኡራ ኪዳነ ምሕረት ወዘተ)። ጠዋት ጸጥ ያለ ነው። ከመነሳት በፊት ዋጋና ደሴቶችን ያረጋግጡ።',
    tip: 'Book at the main lakeside pier near the hotels strip. Shared boats cost less than private.',
    tipAm: 'ከሆቴሎች አጠገብ ካለው ዋና ጀልባ ማረፊያ ይያዙ። የጋራ ጀልባ ከግል ይረከሳል።',
    pillar: 'must',
    timeLabel: 'Half day',
    timeLabelAm: 'ግማሽ ቀን',
    costLabel: '~300–1500 ETB/person',
    costLabelAm: '~300–1500 ብር/ሰው',
    priority: 1,
    href: '/map?filter=attraction',
  },
  {
    id: 'todo-falls',
    title: 'Day trip to Blue Nile Falls (Tis Abay)',
    titleAm: 'ወደ ጥሶ አባይ (ሰማያዊ ናይል ፏፏቴ) ቀን ጉዞ',
    description:
      'About 30 km south of Bahir Dar. Water volume depends on season — more impressive in/after rains. Wear shoes for the walk and short bridge sections.',
    descriptionAm:
      'ከባሕር ዳር ወደ ደቡብ ~30 ኪ.ሜ። ውሃው በዝናብ ወቅት ይጎላል። ለእግር መንገድ ጫማ ይልበሱ።',
    tip: 'Combine with a driver or organized tour; confirm entrance fees on arrival.',
    tipAm: 'ከሹፌር ወይም ጉብኝት ጋር ይያዙ፤ የመግቢያ ክፍያን በቦታው ያረጋግጡ።',
    pillar: 'must',
    timeLabel: '4–6 hours',
    timeLabelAm: '4–6 ሰዓት',
    costLabel: 'Transport + entrance',
    costLabelAm: 'ትራንስፖርት + መግቢያ',
    priority: 1,
    href: '/map',
  },
  {
    id: 'todo-lakeside',
    title: 'Walk the lakeside promenade at sunset',
    titleAm: 'በፀሐይ ግባት የሐይቁን ዳር ይራመዱ',
    description:
      'Free and iconic. Path along the shore near the palace and hotels — safe in early evening with others around.',
    descriptionAm:
      'ነጻ እና የሚታወቅ ነው። ከቤተ መንግሥትና ሆቴሎች አጠገብ። በመጀመሪያ ማታ ከሰዎች ጋር ደህንነቱ የተጠበቀ ነው።',
    pillar: 'must',
    timeLabel: '1–2 hours',
    timeLabelAm: '1–2 ሰዓት',
    costLabel: 'Free',
    costLabelAm: 'ነጻ',
    priority: 1,
    href: '/map?locate=1',
  },
  {
    id: 'todo-fish',
    title: 'Eat fresh lake fish',
    titleAm: 'የጣና ሐይቅ ትኩስ ዓሳ ይቅመሱ',
    description:
      'Try fried or stewed fish at lakeside restaurants. Ask the day’s price; fish is a Bahir Dar specialty.',
    descriptionAm:
      'በሐይቁ ዳር ሬስቶራንቶች የተጠበሰ ወይም የተቀቀለ ዓሳ ይሞክሩ። የዕለቱን ዋጋ ይጠይቁ።',
    pillar: 'eat',
    timeLabel: '1–2 hours',
    timeLabelAm: '1–2 ሰዓት',
    costLabel: '~200–500 ETB',
    costLabelAm: '~200–500 ብር',
    priority: 2,
    href: '/restaurants',
  },
  {
    id: 'todo-injera',
    title: 'Have a full Ethiopian meal (injera)',
    titleAm: 'ሙሉ የኢትዮጵያ ምግብ (እንጀራ) ይብሉ',
    description:
      'Order a combo platter to share: shiro, key wet, gomen, and local specialties. Wash hands; eat with right hand traditionally.',
    descriptionAm:
      'የጋራ ጭማቂ ይዘዙ፦ ሽሮ፣ ቀይ ወጥ፣ ጎመን። እጅ ይታጠቡ፤ በባህል በቀኝ እጅ ይበላል።',
    pillar: 'eat',
    timeLabel: '1 hour',
    timeLabelAm: '1 ሰዓት',
    costLabel: '~150–400 ETB',
    costLabelAm: '~150–400 ብር',
    priority: 2,
    href: '/restaurants',
  },
  {
    id: 'todo-coffee',
    title: 'Join a traditional coffee ceremony',
    titleAm: 'ባህላዊ የቡና ሥርዓት ይሳተፉ',
    description:
      'Roasting, grinding, and three rounds of coffee. Many hotels and cultural restaurants offer it — ask before ordering.',
    descriptionAm:
      'መቁጠር፣ መፍጨት እና ሦስት ዙር ቡና። ብዙ ሆቴሎችና ባህላዊ ቦታዎች ያቀርባሉ — ከመዘዝ በፊት ይጠይቁ።',
    pillar: 'eat',
    timeLabel: '45–90 min',
    timeLabelAm: '45–90 ደቂቃ',
    costLabel: '~50–200 ETB',
    costLabelAm: '~50–200 ብር',
    priority: 2,
    href: '/restaurants',
  },
  {
    id: 'todo-hotel',
    title: 'Choose a hotel by area & budget',
    titleAm: 'በአካባቢና በበጀት ሆቴል ይምረጡ',
    description:
      'Lakeside = views & higher price. Town centre = cheaper and closer to shops. Compare star bands and nightly ETB estimates in the app.',
    descriptionAm:
      'የሐይቅ ዳር = እይታና ከፍተኛ ዋጋ። ከተማ መሃል = ርካሽና ከሱቆች ቅርብ። በመተግበሪያው ዋጋዎችን ያወዳድሩ።',
    pillar: 'plan',
    timeLabel: '20 min',
    timeLabelAm: '20 ደቂቃ',
    costLabel: 'See Hotels page',
    costLabelAm: 'የሆቴል ገጽ ይመልከቱ',
    priority: 1,
    href: '/hotels',
  },
  {
    id: 'todo-bajaj',
    title: 'Learn bajaj (tuk-tuk) fares',
    titleAm: 'የባጃጅ ዋጋ ይረዱ',
    description:
      'Agree the price before you sit. Short central rides are often 50–150 ETB; longer trips more. Night fares can be higher.',
    descriptionAm:
      'ከመቀመጥ በፊት ዋጋ ያውሩ። አጭር ከተማ ውስጥ ብዙ ጊዜ 50–150 ብር ነው። ማታ ሊጨምር ይችላል።',
    tip: 'Open Transport page for typical ranges; point on the map if language is hard.',
    tipAm: 'የትራንስፖርት ገጽን ይክፈቱ፤ ቋንቋ ካልተመቸ ካርታ ላይ ያሳዩ።',
    pillar: 'move',
    timeLabel: '5 min',
    timeLabelAm: '5 ደቂቃ',
    costLabel: '50–150+ ETB short',
    costLabelAm: 'አጭር 50–150+ ብር',
    priority: 1,
    href: '/transport',
  },
  {
    id: 'todo-atm',
    title: 'Find a working ATM or bank',
    titleAm: 'የሚሰራ ኤቲኤም ወይም ባንክ ያግኙ',
    description:
      'CBE, Dashen, Awash and others operate in town. Machines can run out of cash — try another branch. Keep small notes for bajaj and tips.',
    descriptionAm:
      'ሲቢኢ፣ ዳሽን፣ አዋሽ ወዘተ አሉ። ገንዘብ ሊያልቅ ይችላል — ሌላ ቅርንጫፍ ይሞክሩ። ለባጃጅ ትንሽ ብር ይያዙ።',
    pillar: 'money',
    timeLabel: '15–30 min',
    timeLabelAm: '15–30 ደቂቃ',
    costLabel: 'Bank fees may apply',
    costLabelAm: 'የባንክ ክፍያ ሊኖር ይችላል',
    priority: 1,
    href: '/directory',
  },
  {
    id: 'todo-emergency',
    title: 'Save emergency numbers',
    titleAm: 'የአደጋ ጊዜ ቁጥሮችን ያስቀምጡ',
    description:
      'National police/ambulance lines plus local hospital contacts. Also ask your hotel’s front desk for the nearest clinic.',
    descriptionAm:
      'ብሔራዊ ፖሊስ/አምቡላንስ እና የአካባቢ ሆስፒታል። የሆቴልዎን ፊት ለፊት ዴስክም ይጠይቁ።',
    pillar: 'money',
    timeLabel: '2 min',
    timeLabelAm: '2 ደቂቃ',
    costLabel: 'Free',
    costLabelAm: 'ነጻ',
    priority: 1,
    href: '/help#emergency',
  },
  {
    id: 'todo-market',
    title: 'Visit the local market',
    titleAm: 'የአካባቢ ገበያ ይጎብኙ',
    description:
      'Spices, coffee, textiles, and everyday goods. Keep valuables close; bargain politely for souvenirs.',
    descriptionAm:
      'ቅመም፣ ቡና፣ ጨርቅ እና የዕለት ተዕለት ዕቃ። ንብረትዎን ይጠብቁ፤ በሟችነት ዋጋ ይደራደሩ።',
    pillar: 'see',
    timeLabel: '1–2 hours',
    timeLabelAm: '1–2 ሰዓት',
    costLabel: 'As you buy',
    costLabelAm: 'እንደ ግዢዎ',
    priority: 3,
    href: '/map',
  },
  {
    id: 'todo-viewpoint',
    title: 'See the city from a viewpoint',
    titleAm: 'ከእይታ ቦታ ከተማውን ይመልከቱ',
    description:
      'Hill viewpoints (e.g. areas toward Bezawit) give a wide view of the lake and town — best late afternoon.',
    descriptionAm:
      'ከኮረብታ እይታዎች (እንደ በዛዊት አቅጣጫ) ሐይቁንና ከተማውን ያያሉ — ከሰዓት በኋላ ይመረጣል።',
    pillar: 'see',
    timeLabel: '1–2 hours',
    timeLabelAm: '1–2 ሰዓት',
    costLabel: 'Transport only',
    costLabelAm: 'ትራንስፖርት ብቻ',
    priority: 3,
    href: '/map',
  },
  {
    id: 'todo-today',
    title: 'Open “Today in Bahir Dar” plan',
    titleAm: 'የ«ዛሬ በባሕር ዳር» እቅድ ይክፈቱ',
    description:
      'Weather-aware suggestions for one day: boat, falls, food, and rest — built for first-time visitors.',
    descriptionAm:
      'ለአንድ ቀን የአየር ሁኔታ ግምት ያለው እቅድ፦ ጀልባ፣ ፏፏቴ፣ ምግብ — ለመጀመሪያ ጎብኝዎች።',
    pillar: 'plan',
    timeLabel: '5 min',
    timeLabelAm: '5 ደቂቃ',
    costLabel: 'Free',
    costLabelAm: 'ነጻ',
    priority: 2,
    href: '/today',
  },
  {
    id: 'todo-ai',
    title: 'Ask the AI guide in Amharic or English',
    titleAm: 'AI መመሪያን በአማርኛ ወይም እንግሊዝኛ ይጠይቁ',
    description:
      'Get a custom day plan for your budget, mobility, and interests without leaving the app.',
    descriptionAm:
      'በበጀትዎ፣ እንቅስቃሴዎ እና ፍላጎትዎ የቀን እቅድ ያግኙ።',
    pillar: 'plan',
    timeLabel: '10 min',
    timeLabelAm: '10 ደቂቃ',
    costLabel: 'Free in-app',
    costLabelAm: 'በመተግበሪያ ነጻ',
    priority: 2,
    href: '/ai-guide',
  },
  {
    id: 'todo-help',
    title: 'Read visitor help (arrival & phrases)',
    titleAm: 'የጎብኝ እርዳታ (መድረስና ሐረጎች) ያንብቡ',
    description:
      'First steps after the airport/bus, useful Amharic phrases, money tips, and safety notes.',
    descriptionAm:
      'ከአውሮፕላን/አውቶቡስ በኋላ ደረጃዎች፣ ጠቃሚ አማርኛ፣ የገንዘብ ምክር እና ደህንነት።',
    pillar: 'money',
    timeLabel: '10 min',
    timeLabelAm: '10 ደቂቃ',
    costLabel: 'Free',
    costLabelAm: 'ነጻ',
    priority: 1,
    href: '/help',
  },
]

export const SMART_CITY_MODULES = [
  {
    id: 'tourism',
    title: 'Tourism & map',
    titleAm: 'ቱሪዝምና ካርታ',
    body: 'Places, GPS map, Discover, attractions.',
    bodyAm: 'ቦታዎች፣ ካርታ፣ መስህቦች።',
    href: '/map',
    icon: 'map',
  },
  {
    id: 'mobility',
    title: 'Mobility',
    titleAm: 'መጓጓዣ',
    body: 'Fares, bajaj, bus & boat tips.',
    bodyAm: 'ዋጋ፣ ባጃጅ፣ አውቶቡስና ጀልባ።',
    href: '/transport',
    icon: 'car',
  },
  {
    id: 'hospitality',
    title: 'Stay & eat',
    titleAm: 'መጠለያና ምግብ',
    body: 'Hotels, restaurants, cafés.',
    bodyAm: 'ሆቴሎች፣ ሬስቶራንቶች፣ ካፌዎች።',
    href: '/hotels',
    icon: 'hotel',
  },
  {
    id: 'civic',
    title: 'Civic & safety',
    titleAm: 'ደህንነትና አገልግሎት',
    body: 'Directory, emergency, banks.',
    bodyAm: 'ማውጫ፣ አደጋ ጊዜ፣ ባንኮች።',
    href: '/directory',
    icon: 'shield',
  },
  {
    id: 'events',
    title: 'Events & culture',
    titleAm: 'ዝግጅቶችና ባህል',
    body: 'Markets, festivals, lakeside culture.',
    bodyAm: 'ገበያ፣ በዓላት፣ የሐይቅ ባህል።',
    href: '/events',
    icon: 'calendar',
  },
  {
    id: 'intelligence',
    title: 'AI & planning',
    titleAm: 'AI እና እቅድ',
    body: 'AI Guide, trips, budgets, to-do list.',
    bodyAm: 'AI መመሪያ፣ ጉዞ፣ በጀት፣ ዝርዝር።',
    href: '/todo',
    icon: 'sparkles',
  },
] as const
