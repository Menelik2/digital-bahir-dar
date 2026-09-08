/**
 * Practical visitor essentials for Bahir Dar — offline-friendly content.
 * Confirm prices and hours on site; numbers can change.
 */

export type Phrase = {
  id: string
  en: string
  am: string
  pronounce?: string
}

export type ArrivalStep = {
  id: string
  titleEn: string
  titleAm: string
  bodyEn: string
  bodyAm: string
  link?: string
}

export type TipBlock = {
  id: string
  titleEn: string
  titleAm: string
  itemsEn: string[]
  itemsAm: string[]
}

/** First hours after landing or arriving by bus */
export const ARRIVAL_STEPS: ArrivalStep[] = [
  {
    id: 'airport',
    titleEn: 'From the airport (BJR)',
    titleAm: 'ከአውሮፕላን ማረፊያ (BJR)',
    bodyEn:
      'Take a bajaj or hotel pickup into town (about 15–25 minutes). Agree the price before you start. Keep bags with you.',
    bodyAm:
      'ባጃጅ ወይም የሆቴል መውሰጃ ወደ ከተማ ይውሰዱ (15–25 ደቂቃ)። ከመነሳትዎ በፊት ዋጋውን ይስማሙ። ቦርሳዎን ከእርስዎ ጋር ያቆዩ።',
    link: '/transport',
  },
  {
    id: 'cash',
    titleEn: 'Get cash (ETB)',
    titleAm: 'ጥሬ ገንዘብ (ብር) ያግኙ',
    bodyEn:
      'Use a bank ATM in town for Ethiopian Birr. Tell your bank you will travel. Small notes help for bajaj and markets.',
    bodyAm:
      'በከተማ ውስጥ የባንክ ኤቲኤም ይጠቀሙ። ለባንክዎ እንደሚጓዙ ያሳውቁ። ለባጃጅ እና ገበያ ትናንሽ ኖቶች ጠቃሚ ናቸው።',
    link: '/banks',
  },
  {
    id: 'sim',
    titleEn: 'Phone / SIM (optional)',
    titleAm: 'ስልክ / ሲም (አማራጭ)',
    bodyEn:
      'Ethio Telecom and Safaricom Ethiopia sell tourist SIMs with passport. Hotels can point you to the nearest shop.',
    bodyAm:
      'ኢትዮ ቴሌኮም እና ሳፋሪኮም ኢትዮጵያ በፓስፖርት የቱሪስት ሲም ይሸጣሉ። ሆቴልዎ ቅርብ መደብር ያሳያል።',
  },
  {
    id: 'plan-day',
    titleEn: 'Plan one clear day',
    titleAm: 'አንድ ግልጽ ቀን ያቅዱ',
    bodyEn:
      'Open “Today in Bahir Dar” for a simple morning–evening plan with cost hints — lake, viewpoint, food.',
    bodyAm:
      'ለቀላል የጠዋት–ማታ እቅድ «ዛሬ በባሕር ዳር»ን ይክፈቱ — ሐይቅ፣ እይታ፣ ምግብ ከወጪ ምክር ጋር።',
    link: '/today',
  },
  {
    id: 'map',
    titleEn: 'Save the map',
    titleAm: 'ካርታውን ያስቀምጡ',
    bodyEn:
      'Open the Map page, allow location once, and search hotels, food, ATMs, and hospitals near you.',
    bodyAm:
      'የካርታ ገጹን ይክፈቱ፣ አካባቢ አንዴ ይፍቀዱ፣ በአቅራቢያ ሆቴል፣ ምግብ፣ ኤቲኤም እና ሆስፒታል ይፈልጉ።',
    link: '/map',
  },
]

export const PHRASES: Phrase[] = [
  { id: 'hello', en: 'Hello', am: 'ሰላም', pronounce: 'selam' },
  { id: 'thanks', en: 'Thank you', am: 'አመሰግናለሁ', pronounce: 'ameseginalehu' },
  { id: 'please', en: 'Please', am: 'እባክዎ', pronounce: 'ebakwo' },
  { id: 'yes', en: 'Yes', am: 'አዎ', pronounce: 'awo' },
  { id: 'no', en: 'No', am: 'አይ', pronounce: 'ay' },
  { id: 'how-much', en: 'How much is this?', am: 'ይህ ስንት ነው?', pronounce: 'yih sint new?' },
  { id: 'too-much', en: 'Too expensive', am: 'በጣም ውድ ነው', pronounce: 'betam wid new' },
  { id: 'where-toilet', en: 'Where is the toilet?', am: 'ሽንት ቤት የት ነው?', pronounce: 'shint bet yet new?' },
  { id: 'help', en: 'Help me please', am: 'እባክዎ እርዱኝ', pronounce: 'ebakwo erdugn' },
  { id: 'water', en: 'Water', am: 'ውሃ', pronounce: 'wuha' },
  { id: 'food', en: 'Food / restaurant', am: 'ምግብ / ምግብ ቤት', pronounce: 'migib / migib bet' },
  { id: 'hotel', en: 'Hotel', am: 'ሆቴል', pronounce: 'hotel' },
  { id: 'taxi', en: 'Bajaj / taxi', am: 'ባጃጅ / ታክሲ', pronounce: 'bajaj / taxi' },
  { id: 'stop', en: 'Stop here', am: 'እዚህ አቁም', pronounce: 'ezih akum' },
  { id: 'no-amharic', en: 'I don’t speak Amharic', am: 'አማርኛ አልችልም', pronounce: 'amarigna alchilim' },
]

export const MONEY_TIPS: TipBlock = {
  id: 'money',
  titleEn: 'Money & payments',
  titleAm: 'ገንዘብ እና ክፍያ',
  itemsEn: [
    'Ethiopian Birr (ETB) is the main currency. Cards work in some hotels; cash is king for bajaj and markets.',
    'Agree bajaj fares before the trip starts.',
    'Keep a small daily cash amount separate from your passport.',
    'ATMs: try Commercial Bank, Awash, or Dashen in the center — see Banks page.',
  ],
  itemsAm: [
    'ዋናው ምንዛሬ የኢትዮጵያ ብር (ETB) ነው። በአንዳንድ ሆቴሎች ካርድ ይሰራል፤ ለባጃጅ እና ገበያ ጥሬ ገንዘብ ይመረጣል።',
    'የባጃጅ ታሪፍ ከመጀመርዎ በፊት ይስማሙ።',
    'ትንሽ የዕለት ጥሬ ገንዘብ ከፓስፖርትዎ ለይተው ያቆዩ።',
    'ኤቲኤም፡ በማዕከሉ Commercial Bank፣ Awash ወይም Dashen ይሞክሩ — የባንኮች ገጽ ይመልከቱ።',
  ],
}

export const SAFETY_TIPS: TipBlock = {
  id: 'safety',
  titleEn: 'Stay safe',
  titleAm: 'ደህንነትዎን ይጠብቁ',
  itemsEn: [
    'Use official boats from the main pier; confirm return time and islands before paying.',
    'At Blue Nile Falls, wear steady shoes — paths can be muddy after rain.',
    'Drink sealed bottled water if you have a sensitive stomach.',
    'Emergency: Police 991 · Ambulance 907 · Fire 939 — also save your hotel number.',
  ],
  itemsAm: [
    'ከዋናው የጀልባ ማረፊያ ኦፊሴላዊ ጀልባዎችን ይጠቀሙ፤ ከመክፈልዎ በፊት መመለሻ እና ደሴቶችን ያረጋግጡ።',
    'በአባይ ፏፏቴ ጠንካራ ጫማ ይልበሱ — ከዝናብ በኋላ መንገዱ ጭቃማ ሊሆን ይችላል።',
    'ሆድዎ ስሜታዊ ከሆነ የታሸገ የውሃ ጠርሙስ ይጠጡ።',
    'አደጋ ጊዜ፡ ፖሊስ 991 · አምቡላንስ 907 · እሳት 939 — የሆቴልዎን ቁጥርም ያስቀምጡ።',
  ],
}

export const GETTING_AROUND: TipBlock = {
  id: 'around',
  titleEn: 'Getting around town',
  titleAm: 'በከተማ መንቀሳቀስ',
  itemsEn: [
    'Bajaj (tuk-tuk) for short trips — agree the fare first.',
    'Walking is easy near the lake pier and many central hotels.',
    'Lake Tana monasteries: morning shared boats from the pier.',
    'Blue Nile Falls (Tis Issat): day trip by bajaj, minibus, or private car (~30–40 min).',
  ],
  itemsAm: [
    'ለአጭር ጉዞ ባጃጅ — ታሪፉን መጀመሪያ ይስማሙ።',
    'ከሐይቁ ማረፊያ እና ከማዕከላዊ ሆቴሎች በአቅራቢያ በእግር መሄድ ቀላል ነው።',
    'የጣና ገዳማት፡ ጠዋት ከማረፊያው የጋራ ጀልባዎች።',
    'የአባይ ፏፏቴ (ጢስ እሳት)፡ በባጃጅ፣ ሚኒባስ ወይም ግል መኪና (~30–40 ደቂቃ)።',
  ],
}

export const QUICK_LINKS = [
  { path: '/today', labelEn: 'Today plan', labelAm: 'የዛሬ እቅድ' },
  { path: '/map', labelEn: 'Live map', labelAm: 'ቀጥታ ካርታ' },
  { path: '/hotels', labelEn: 'Hotels', labelAm: 'ሆቴሎች' },
  { path: '/restaurants', labelEn: 'Food', labelAm: 'ምግብ' },
  { path: '/transport', labelEn: 'Transport', labelAm: 'ትራንስፖርት' },
  { path: '/attractions', labelEn: 'Sights', labelAm: 'መስህቦች' },
  { path: '/banks', labelEn: 'Banks & ATMs', labelAm: 'ባንኮች' },
  { path: '/trip-planner', labelEn: 'Multi-day plan', labelAm: 'ብዙ ቀናት' },
  { path: '/ai-guide', labelEn: 'Ask AI Guide', labelAm: 'AI መመሪያ' },
  { path: '/directory', labelEn: 'Full directory', labelAm: 'ሙሉ ማውጫ' },
] as const
