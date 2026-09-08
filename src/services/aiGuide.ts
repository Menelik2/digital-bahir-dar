import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { ChatMessage, AIGuideResponse, GuideAction } from '@/types/ai'

/** Offline knowledge — used when live AI is unavailable */
const DEMO_KNOWLEDGE: { keys: string[]; reply: string; priority?: number; actions?: GuideAction[] }[] = [
  {
    keys: ['hello', 'hi', 'hey', 'selam', 'ሰላም', 'good morning', 'good evening'],
    priority: 10,
    reply:
      "Selam! I'm your Bahir Dar guide.\n\nAsk me anything about:\n• **Where to go** (Lake Tana, Blue Nile Falls, viewpoints)\n• **Food** (injera, lake fish, coffee)\n• **Hotels & budget**\n• **Transport** (bajaj, boats, airport)\n• **A 1–3 day itinerary**\n\nPrices are estimates only — always verify locally.",
    actions: [
      { label: 'Trip planner', to: '/trip-planner' },
      { label: 'Map', to: '/map' },
      { label: 'Attractions', to: '/attractions' },
    ],
  },
  {
    keys: [
      'where', 'where to go', 'where should', 'where can i', 'where do i',
      'places to visit', 'place to visit', 'what to see', 'what to do', 'things to do',
      'sightseeing', 'recommend', 'recommendation', 'best place', 'must see', 'must-see',
      'tourist', 'visit', 'go first', 'first day', 'attractions', 'በየት', 'የት',
    ],
    priority: 5,
    reply:
      "**Where to go in Bahir Dar**\n\n**Top picks (start here)**\n1. **Lake Tana** — Ethiopia's largest lake. Morning boat to island monasteries (e.g. Zege / Ura Kidane Mehret). Agree boat price in ETB before leaving the pier.\n2. **Blue Nile Falls (Tis Issat)** — day trip ~30 km toward Tis Abay. Best after rains; wear good shoes. Entry + optional guide + car are separate costs.\n3. **Bezawit viewpoint** — hilltop views over the Nile outlet and lake. Short outing, great at sunset.\n4. **Central market** — spices, coffee, everyday life. Go in the morning; keep bags secure.\n5. **Lakeside promenade** — walk, coffee, lake fish for lunch or dinner.\n\n**Simple plan**\n• **Half day:** lakeside + market + coffee\n• **1 day:** Lake Tana boat + fish lunch + Bezawit\n• **2 days:** Day 1 boat/monasteries · Day 2 Blue Nile Falls\n\nOpen **Map**, **Attractions**, and **Trip Planner** in the app. Tell me your days (1 / 2 / 3) and budget (low / mid) for a tighter plan.",
    actions: [
      { label: 'Attractions', to: '/attractions' },
      { label: 'Trip planner', to: '/trip-planner' },
      { label: 'Map', to: '/map' },
    ],
  },
  {
    keys: ['boat', 'lake tana', 'monastery', 'zege', 'ura kidane', 'island'],
    priority: 6,
    reply:
      '**Lake Tana boat**\n\n• Go in the **morning** for calmer water and more time at monasteries.\n• Shared boats are cheaper; private costs more — **agree the price in ETB before boarding**.\n• Zege / Ura Kidane Mehret are classic short trips; ask which islands are included.\n• Bring water, sun protection, and small bills.\n• Schedules and prices change — confirm at the pier.',
    actions: [
      { label: 'Attractions', to: '/attractions' },
      { label: 'Map', to: '/map' },
    ],
  },
  {
    keys: ['falls', 'blue nile', 'tis', 'tis abay', 'tis issat', 'waterfall'],
    priority: 6,
    reply:
      '**Blue Nile Falls (Tis Issat)**\n\n• About **30 km** from Bahir Dar toward Tis Abay.\n• Plan a **half to full day**; start early.\n• Entry, guide, and transport are usually **separate** costs.\n• Stronger flow after rains; paths can be slippery — wear proper shoes.\n• Combine with a local driver or organized trip if you prefer not to negotiate bajaj/taxi yourself.',
    actions: [
      { label: 'Map', to: '/map' },
      { label: 'Transport', to: '/transport' },
    ],
  },
  {
    keys: ['food', 'eat', 'restaurant', 'injera', 'fish', 'coffee', 'lunch', 'dinner'],
    priority: 5,
    reply:
      '**Food in Bahir Dar**\n\n• **Injera** with stews — everyday local meals.\n• **Lake fish** — lakeside restaurants are popular.\n• **Coffee ceremony** — cultural and social.\n• Rough per-meal range: light ~80–200 ETB; fuller meals ~150–500+ ETB (estimates).\n\nOpen **Restaurants** in the app for places and map links.',
    actions: [
      { label: 'Restaurants', to: '/restaurants' },
      { label: 'Map', to: '/map' },
    ],
  },
  {
    keys: ['hotel', 'hotels', 'lodge', 'stay', 'sleep', 'accommodation', 'room'],
    priority: 5,
    reply:
      '**Hotels & lodges**\n\n• **Lakeside** = views; **central** often cheaper and closer to services.\n• Budget / mid / comfort tiers exist; prices move with season.\n• Compare ranges in the app **Hotels** page and verify the night rate before paying.\n\nUse **Budget** tools for a rough trip total.',
    actions: [
      { label: 'Hotels', to: '/hotels' },
      { label: 'Budget', to: '/budget' },
    ],
  },
  {
    keys: ['bajaj', 'taxi', 'transport', 'bus', 'airport', 'how to get', 'get around'],
    priority: 5,
    reply:
      '**Getting around**\n\n• **Bajaj** is the main in-city option — **agree the fare before you sit**.\n• Boats for Lake Tana; car/taxi or tour for the Falls.\n• Airport is close to town relative to many cities.\n\nOpen **Transport** and **Map** (enable location) in the app.',
    actions: [
      { label: 'Transport', to: '/transport' },
      { label: 'Map', to: '/map?locate=1' },
    ],
  },
  {
    keys: ['budget', 'price', 'cost', 'money', 'etb', 'birr', 'expensive', 'cheap'],
    priority: 5,
    reply:
      '**Rough budget (per person, estimates)**\n\n• Hotel / night: budget ~1,500–4,500 · mid ~4,000–9,500 · comfort higher\n• Food / day: ~400–2,000+\n• Boat: shared cheaper · private higher\n• Short bajaj: tens to a few hundred ETB depending on distance\n\nUse **Budget** and **Trip Planner** for structured estimates. Always verify locally.',
    actions: [
      { label: 'Budget', to: '/budget' },
      { label: 'Trip planner', to: '/trip-planner' },
    ],
  },
  {
    keys: ['itinerary', 'plan', '2 day', '3 day', 'two day', 'three day', 'schedule'],
    priority: 6,
    reply:
      '**1–3 day sketch**\n\n• **1 day:** morning boat + lakeside lunch + sunset walk\n• **2 days:** Day 1 boat/monasteries · Day 2 Blue Nile Falls\n• **3 days:** arrive + lakeside · full boat day · Falls or Bezawit + market\n\nOpen **Trip Planner**, set days and budget, then **Build plan**.',
    actions: [
      { label: 'Trip planner', to: '/trip-planner' },
      { label: 'Today', to: '/today' },
    ],
  },
]

function scoreMatch(text: string, keys: string[]): number {
  let score = 0
  for (const k of keys) {
    if (text.includes(k)) score += k.length > 8 ? 3 : 2
  }
  return score
}

/** Amharic offline replies */
const DEMO_AM: Record<string, { reply: string; actions?: GuideAction[] }> = {
  hello: {
    reply:
      'ሰላም! የባሕር ዳር መመሪያዎ ነኝ።\n\nመጠየቅ ይችላሉ፦\n• **የት መሄድ** (ጣና ሐይቅ፣ ጥሶ አባይ፣ እይታ)\n• **ምግብ** (እንጀራ፣ ዓሳ፣ ቡና)\n• **ሆቴልና በጀት**\n• **ትራንስፖርት** (ባጃጅ፣ ጀልባ)\n• **1–3 ቀን እቅድ**\n\nዋጋዎች ግምት ናቸው — በቦታው ያረጋግጡ።',
    actions: [
      { label: 'የጉዞ እቅድ', to: '/trip-planner' },
      { label: 'ካርታ', to: '/map' },
      { label: 'መስህቦች', to: '/attractions' },
    ],
  },
  where: {
    reply:
      '**በባሕር ዳር የት ይሂዱ**\n\n1. **ጣና ሐይቅ** — ጠዋት ጀልባ ወደ ገዳም ደሴቶች። ዋጋ በብር ከመነሳት በፊት ይደራደሩ።\n2. **ጥሶ አባይ (ፏፏቴ)** — ~30 ኪ.ሜ። ጫማ ይልበሱ።\n3. **በዛዊት እይታ** — የሐይቅና ናይል እይታ፤ ፀሐይ ግባት።\n4. **ገበያ** — ቅመም፣ ቡና፤ ጠዋት ይሂዱ።\n5. **የሐይቅ ዳር** — መሄድ፣ ቡና፣ ዓሳ።\n\n**አጭር እቅድ**\n• ግማሽ ቀን፦ ሐይቅ ዳር + ገበያ\n• 1 ቀን፦ ጀልባ + ምግብ + በዛዊት\n• 2 ቀን፦ ቀን1 ጀልባ · ቀን2 ፏፏቴ',
    actions: [
      { label: 'መስህቦች', to: '/attractions' },
      { label: 'የጉዞ እቅድ', to: '/trip-planner' },
      { label: 'ካርታ', to: '/map' },
    ],
  },
  boat: {
    reply:
      '**የጣና ሐይቅ ጀልባ**\n\n• ጠዋት ይመረጣል።\n• የጋራ ወይም ግል ጀልባ — ዋጋ ይለያያል።\n• ደሴት/ገዳም ከመነሳት በፊት ያረጋግጡ።\n• ውሃ፣ ባርኔጣ፣ ትንሽ ብር ይያዙ።\n• ዋጋ **በፊት** በብር ይደራደሩ።',
    actions: [
      { label: 'መስህቦች', to: '/attractions' },
      { label: 'ካርታ', to: '/map' },
    ],
  },
  falls: {
    reply:
      '**ጥሶ አባይ (Blue Nile Falls)**\n\n• ከባሕር ዳር ~30 ኪ.ሜ።\n• ባጃጅ/ታክሲ ወይም የተደራጀ ጉዞ።\n• መግቢያ + አማራጭ መመሪያ + ትራንስፖርት ተለያይተው ናቸው።\n• በዝናብ ወቅት ውሃ ይጎላል — ጫማ ያስፈልጋል።\n• ጠዋት ይጀምሩ።',
    actions: [
      { label: 'ካርታ', to: '/map' },
      { label: 'ትራንስፖርት', to: '/transport' },
    ],
  },
  food: {
    reply:
      '**ምግብ በባሕር ዳር**\n\n• **እንጀራ** ከወጥ ጋር።\n• **የሐይቅ ዓሳ** — የሐይቅ ዳር ሬስቶራንቶች።\n• **ቡና ሥርዓት**።\n• ግምት፦ ቀላል ምግብ ~80–200 ብር፤ ሙሉ ~150–500+።\n\n**Restaurants** ገጽን ይክፈቱ።',
    actions: [
      { label: 'ምግብ ቤቶች', to: '/restaurants' },
      { label: 'ካርታ', to: '/map' },
    ],
  },
  hotel: {
    reply:
      '**ሆቴልና ማረፊያ**\n\n• ሐይቅ ዳር = እይታ፤ ከተማ መሃል ብዙ ጊዜ ርካሽ።\n• በጀት / መካከለኛ / ምቹ።\n• ዋጋ በወቅት ይለዋወጣል — በHotels ገጽ ያረጋግጡ።',
    actions: [
      { label: 'ሆቴሎች', to: '/hotels' },
      { label: 'በጀት', to: '/budget' },
    ],
  },
  transport: {
    reply:
      '**ትራንስፖርት**\n\n• **ባጃጅ** — ዋጋ **ከመቀመጥ በፊት** ይደራደሩ።\n• **ጀልባ** — ጣና ሐይቅ።\n• **ወደ ፏፏቴ** — ታክሲ ወይም የተደራጀ ጉዞ።\n• አውሮፕላን ማረፊያ ከከተማ ቅርብ ነው።',
    actions: [
      { label: 'ትራንስፖርት', to: '/transport' },
      { label: 'ካርታ', to: '/map?locate=1' },
    ],
  },
  budget: {
    reply:
      '**በጀት (ግምት በሰው)**\n\n• ሆቴል/ሌሊት፦ በጀት ~1,500–4,500 · መካከለኛ ~4,000–9,500\n• ምግብ/ቀን፦ ~400–2,000+\n• ጀልባ፦ የጋራ ርካሽ · ግል ውድ\n• ባጃጅ አጭር፦ በአስርዎች–መቶዎች ብር\n\n**Budget** እና **Trip Planner** ይጠቀሙ።',
    actions: [
      { label: 'በጀት', to: '/budget' },
      { label: 'የጉዞ እቅድ', to: '/trip-planner' },
    ],
  },
  plan: {
    reply:
      '**1–3 ቀን እቅድ**\n\n**1 ቀን:** ጀልባ + የሐይቅ ዳር ምግብ + ፀሐይ ግባት\n**2 ቀን:** ቀን1 ሐይቅ/ገዳም · ቀን2 ጥሶ አባይ\n**3 ቀን:** መድረስ+ሐይቅ · ጀልባ · ፏፏቴ ወይም በዛዊት\n\nበ**Trip Planner** ቀናትና በጀት ይምረጡ።',
    actions: [
      { label: 'የጉዞ እቅድ', to: '/trip-planner' },
      { label: 'ዛሬ', to: '/today' },
    ],
  },
}

function hasAmharic(text: string) {
  return /[\u1200-\u137F]/.test(text)
}

function matchDemoAm(userText: string): { reply: string; actions?: GuideAction[] } | null {
  const t = userText.toLowerCase()
  if (!hasAmharic(userText)) return null

  if (/ሰላም|ታዲያስ|ሄሎ|ሃይ/.test(userText) || t.includes('selam')) return DEMO_AM.hello
  if (/ጀልባ|ሐይቅ|ጣና|ደሴት|ገዳም/.test(userText)) return DEMO_AM.boat
  if (/ፏፏቴ|ጥሶ|አባይ|ቲስ/.test(userText)) return DEMO_AM.falls
  if (/ምግብ|እንጀራ|ዓሳ|ቡና|ሬስቶራንት|በል/.test(userText)) return DEMO_AM.food
  if (/ሆቴል|ማረፊያ|እንየት|ሌሊት/.test(userText)) return DEMO_AM.hotel
  if (/ባጃጅ|ትራንስፖርት|ታክሲ|መኪና|አውሮፕላን/.test(userText)) return DEMO_AM.transport
  if (/በጀት|ዋጋ|ብር|ወጪ/.test(userText)) return DEMO_AM.budget
  if (/እቅድ|ቀን|ጉዞ|ቱሪስት|መሄድ የት|የት መሄድ|የት እሄድ/.test(userText)) return DEMO_AM.plan
  if (/የት|ቦታ|መስህብ|እይታ|በዛዊት/.test(userText)) return DEMO_AM.where
  return DEMO_AM.hello
}

function matchDemo(userText: string): { reply: string; actions?: GuideAction[] } {
  const am = matchDemoAm(userText)
  if (am) return am

  const lower = userText.toLowerCase().trim()

  let best: { reply: string; score: number; actions?: GuideAction[] } | null = null
  for (const entry of DEMO_KNOWLEDGE) {
    const s = scoreMatch(lower, entry.keys) * (entry.priority ?? 5)
    if (s <= 0) continue
    if (!best || s > best.score) best = { reply: entry.reply, score: s, actions: entry.actions }
  }
  if (best && best.score > 0) return { reply: best.reply, actions: best.actions }

  if (/\b(go|see|visit|do|plan|trip|tour|place|places)\b/.test(lower) || /where/.test(lower)) {
    const whereEntry = DEMO_KNOWLEDGE.find((e) => e.keys.includes('where to go'))
    if (whereEntry) return { reply: whereEntry.reply, actions: whereEntry.actions }
  }

  return {
    reply:
      "**Here's how I can help**\n\n" +
      'Try asking in plain words, for example:\n' +
      '• "Where should I go in Bahir Dar?"\n' +
      '• "Plan a 2-day itinerary"\n' +
      '• "Lake Tana boat tips"\n' +
      '• "Where to eat fish and injera?"\n' +
      '• "Rough budget for 2 nights"\n' +
      '• "How do I get to the Blue Nile Falls?"\n\n' +
      'Or open **Map**, **Attractions**, **Restaurants**, and **Trip Planner** in the app.\n\n' +
      '_Offline tips always work. Live AI uses Vercel `/api/ai-guide` when AI_API_KEY is set._',
    actions: [
      { label: 'Trip planner', to: '/trip-planner' },
      { label: 'Map', to: '/map' },
      { label: 'Attractions', to: '/attractions' },
    ],
  }
}

function topicActions(userText: string): GuideAction[] | undefined {
  return matchDemo(userText).actions
}

function isLiveSuccess(data: AIGuideResponse | null | undefined): boolean {
  if (!data) return false
  return Boolean(data.reply && typeof data.reply === 'string' && !data.fallback && !data.error)
}

async function invokeVercelApi(
  messages: { role: string; content: string }[],
  locale: string
): Promise<AIGuideResponse | null> {
  try {
    const res = await fetch('/api/ai-guide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, locale }),
    })
    if (!res.ok) {
      if (res.status === 404 || res.status === 405) return null
      const text = await res.text()
      try {
        return JSON.parse(text) as AIGuideResponse
      } catch {
        return null
      }
    }
    return (await res.json()) as AIGuideResponse
  } catch {
    return null
  }
}

async function invokeSupabase(
  messages: { role: string; content: string }[],
  locale: string
): Promise<AIGuideResponse | null> {
  if (!isSupabaseConfigured || !supabase) return null
  try {
    const { data, error } = await supabase.functions.invoke('ai-guide', {
      body: { messages, locale },
    })
    if (error) return null
    return data as AIGuideResponse
  } catch {
    return null
  }
}

function toLiveResponse(
  data: AIGuideResponse,
  lastUser: ChatMessage | undefined
): AIGuideResponse {
  return {
    reply: data.reply,
    model: data.model,
    grounded: data.grounded,
    actions: lastUser ? topicActions(lastUser.content) : undefined,
  }
}

export async function sendGuideMessage(
  history: ChatMessage[],
  locale: string = 'en'
): Promise<AIGuideResponse> {
  const messages = history
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ role: m.role, content: m.content }))

  const lastUser = [...history].reverse().find((m) => m.role === 'user')
  const offline = (): AIGuideResponse => {
    if (!lastUser) {
      return { reply: DEMO_KNOWLEDGE[0].reply, actions: DEMO_KNOWLEDGE[0].actions, fallback: true }
    }
    const m = matchDemo(lastUser.content)
    return { reply: m.reply, actions: m.actions, fallback: true }
  }

  try {
    const vercel: AIGuideResponse | null = await invokeVercelApi(messages, locale)
    if (isLiveSuccess(vercel) && vercel) {
      return toLiveResponse(vercel, lastUser)
    }

    const edge: AIGuideResponse | null = await invokeSupabase(messages, locale)
    if (isLiveSuccess(edge) && edge) {
      return toLiveResponse(edge, lastUser)
    }

    const soft = vercel || edge
    if (soft?.reply) {
      const reply = String(soft.reply)
      const looksLikeConfigError =
        /not configured|API key|provider|Model or endpoint|not fully configured/i.test(reply)
      if (looksLikeConfigError || soft.fallback) {
        const fb = offline()
        return { ...fb, error: soft.error || 'fallback' }
      }
      return {
        reply: soft.reply,
        model: soft.model,
        grounded: soft.grounded,
        fallback: true,
        error: soft.error,
        actions: lastUser ? topicActions(lastUser.content) : undefined,
      }
    }

    return offline()
  } catch (e) {
    console.warn('aiGuide network:', e)
    const fb = offline()
    return {
      ...fb,
      error: e instanceof Error ? e.message : 'network',
    }
  }
}

export const SUGGESTED_PROMPTS = [
  'Where should I go in Bahir Dar?',
  'Plan a 2-day itinerary',
  'Lake Tana boat trip tips',
  'Blue Nile Falls day trip',
  'Where to eat fish and injera?',
  'Rough budget for 2 nights',
  'How to get around the city?',
]

const SUGGESTED_PROMPTS_AM = [
  'በባሕር ዳር የት መሄድ አለብኝ?',
  'የ2 ቀን እቅድ አውጣልኝ',
  'የጣና ሐይቅ ጀልባ ምክር',
  'ጥሶ አባይ እንዴት እሄዳለሁ?',
  'ዓሳ እና እንጀራ የት በላለሁ?',
  'የ2 ሌሊት በጀት ግምት',
  'በከተማ ውስጥ እንዴት እሄዳለሁ?',
]

export function getSuggestedPrompts(locale: string): string[] {
  return locale === 'am' ? SUGGESTED_PROMPTS_AM : SUGGESTED_PROMPTS
}
