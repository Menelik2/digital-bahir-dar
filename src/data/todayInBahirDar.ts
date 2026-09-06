/**
 * “Today in Bahir Dar” — one clear day plan for first-time visitors.
 * Costs are rough ETB planning estimates (confirm on site).
 * English + Amharic fields; UI picks by active language.
 */

export type TodayStep = {
  id: string
  period: 'morning' | 'midday' | 'afternoon' | 'evening'
  time: string
  title: string
  titleAm: string
  description: string
  descriptionAm: string
  placeSlug?: string
  mapHint?: string
  mapHintAm?: string
  costEtb?: { min: number; typical: number; max: number }
  costNote?: string
  costNoteAm?: string
  duration?: string
  durationAm?: string
}

export type TodayPlan = {
  id: string
  title: string
  titleAm: string
  subtitle: string
  subtitleAm: string
  totalEtbTypical: number
  steps: TodayStep[]
  optionalExtra: {
    title: string
    titleAm: string
    body: string
    bodyAm: string
    href: string
  }
  tips: string[]
  tipsAm: string[]
}

/** Default perfect day — works without login or GPS */
export const TODAY_CLASSIC: TodayPlan = {
  id: 'today-classic',
  title: 'Today in Bahir Dar',
  titleAm: 'ዛሬ በባሕር ዳር',
  subtitle: 'One simple day: lake, viewpoint, market, good food — no overwhelm.',
  subtitleAm: 'አንድ ቀላል ቀን፡ ሐይቅ፣ እይታ፣ ገበያ፣ ጥሩ ምግብ — ያለ ጫና።',
  totalEtbTypical: 1200,
  steps: [
    {
      id: 'lake',
      period: 'morning',
      time: '07:30 – 09:00',
      title: 'Lake Tana shore',
      titleAm: 'የጣና ሐይቅ ዳር',
      description:
        'Start at the lake. Watch boats, birds, and morning life. Optional short boat only if you have energy.',
      descriptionAm:
        'ከሐይቁ ይጀምሩ። ጀልባዎችን፣ ወፎችን እና የጠዋት ሕይወትን ይመልከቱ። ኃይል ካለዎት አጭር የጀልባ ጉዞ አማራጭ ነው።',
      placeSlug: 'lake-tana',
      mapHint: 'Lake shore / pier area',
      mapHintAm: 'የሐይቅ ዳር / የጀልባ ማረፊያ',
      costEtb: { min: 0, typical: 0, max: 2000 },
      costNote: 'Shore is free; boat is optional and negotiated',
      costNoteAm: 'ዳር ነጻ ነው፤ ጀልባ አማራጭ ነው እና ዋጋ ይደራደራል',
      duration: '1–1.5 h',
      durationAm: '1–1.5 ሰ'
    },
    {
      id: 'coffee',
      period: 'morning',
      time: '09:00 – 09:45',
      title: 'Coffee break',
      titleAm: 'የቡና እረፍት',
      description: 'Ethiopian coffee or a simple macchiato. Sit, cool down, plan the rest of the day.',
      descriptionAm: 'ኢትዮጵያዊ ቡና ወይም ማኪያቶ። ይቀመጡ፣ ይቀዘቅዙ፣ የቀሩትን ቀን ያቅዱ።',
      costEtb: { min: 30, typical: 60, max: 120 },
      duration: '30–45 min',
      durationAm: '30–45 ደቂቃ',
    },
    {
      id: 'bezawit',
      period: 'morning',
      time: '10:30 – 12:00',
      title: 'Bezawit viewpoint',
      titleAm: 'የበዛዊት እይታ',
      description: 'Hilltop views over the Blue Nile outlet and the lake. Great photos; small fee possible.',
      descriptionAm: 'ከተራራ ላይ የአባይ መውጫ እና ሐይቅ እይታ። ጥሩ ፎቶዎች፤ ትንሽ ክፍያ ሊኖር ይችላል።',
      placeSlug: 'bezawit-palace-viewpoint',
      costEtb: { min: 0, typical: 50, max: 150 },
      duration: '1–1.5 h',
      durationAm: '1–1.5 ሰ',
    },
    {
      id: 'lunch',
      period: 'midday',
      time: '12:30 – 13:45',
      title: 'Lunch — fish or injera',
      titleAm: 'ምሳ — አሳ ወይም እንጀራ',
      description:
        'Try lake fish if available, or injera with shiro / tibs. Lakeside for views; city center for lower prices.',
      descriptionAm:
        'የሐይቅ አሳ ካለ ይሞክሩ፣ ወይም እንጀራ ከሽሮ / ጥብስ ጋር። ለእይታ በሐይቅ ዳር፤ ለዝቅተኛ ዋጋ በከተማ መሃል።',
      costEtb: { min: 80, typical: 250, max: 500 },
      duration: '1 h',
      durationAm: '1 ሰ',
    },
    {
      id: 'market',
      period: 'afternoon',
      time: '15:00 – 16:30',
      title: 'Central market',
      titleAm: 'ማዕከላዊ ገበያ',
      description: 'Spices, coffee, everyday Bahir Dar. Keep bags zipped; bargain politely.',
      descriptionAm: 'ቅመሞች፣ ቡና፣ የዕለት ተዕለት ባሕር ዳር። ቦርሳዎን ይዝጉ፤ በሥነ ምግባር ይደራደሩ።',
      placeSlug: 'bahir-dar-central-market',
      costEtb: { min: 0, typical: 200, max: 800 },
      costNote: 'Only if you buy snacks or small goods',
      costNoteAm: 'መክሰስ ወይም ትናንሽ ዕቃዎች ከገዙ ብቻ',
      duration: '1–1.5 h',
      durationAm: '1–1.5 ሰ',
    },
    {
      id: 'sunset',
      period: 'evening',
      time: '17:30 – 20:00',
      title: 'Sunset lake walk + dinner',
      titleAm: 'የፀሐይ መጥለቅ የሐይቅ ጉዞ + እራት',
      description: 'Golden hour on the shore, then a proper dinner nearby. Easy end to the day.',
      descriptionAm: 'በሐይቅ ዳር የወርቅ ሰዓት፣ ከዚያ በአቅራቢያ ጥሩ እራት። ቀኑን በቀላሉ ያጠናቁ።',
      placeSlug: 'lake-tana',
      costEtb: { min: 100, typical: 350, max: 700 },
      duration: '2–2.5 h',
      durationAm: '2–2.5 ሰ',
    },
  ],
  optionalExtra: {
    title: 'Have a second day?',
    titleAm: 'ሁለተኛ ቀን አለዎት?',
    body: 'Add a Lake Tana monastery boat in the morning, or a Blue Nile Falls day trip.',
    bodyAm: 'ጠዋት የጣና ሐይቅ ገዳም ጀልባ ያክሉ፣ ወይም የአባይ ፏፏቴ የቀን ጉዞ።',
    href: '/trip-planner',
  },
  tips: [
    'Carry small ETB notes for bajaj and snacks.',
    'Start early — midday sun is strong near the lake.',
    'Agree bajaj/taxi prices before you start.',
    'ATMs can run dry; withdraw when you can.',
  ],
  tipsAm: [
    'ለባጃጅ እና መክሰስ ትንንሽ የብር ኖቶች ይያዙ።',
    'ቀደም ብለው ይጀምሩ — በቀትር ፀሐይ በሐይቅ አጠገብ ጠንካራ ነው።',
    'ከመነሳትዎ በፊት የባጃጅ/ታክሲ ዋጋ ይስማሙ።',
    'ኤቲኤሞች ገንዘብ ሊያልቁ ይችላሉ፤ ሲችሉ ያውጡ።',
  ],
}

export const PERIOD_LABEL: Record<TodayStep['period'], string> = {
  morning: 'Morning',
  midday: 'Midday',
  afternoon: 'Afternoon',
  evening: 'Evening',
}

export const PERIOD_LABEL_AM: Record<TodayStep['period'], string> = {
  morning: 'ጠዋት',
  midday: 'ቀትር',
  afternoon: 'ከሰዓት',
  evening: 'ማታ',
}
