import { supabase } from '@/lib/supabase'
import type { ChatMessage, AIGuideResponse } from '@/types/ai'

/** Offline knowledge — used when Edge Function / AI_API_KEY is unavailable */
const DEMO_KNOWLEDGE: { keys: string[]; reply: string; priority?: number }[] = [
  {
    keys: ['hello', 'hi', 'hey', 'selam', 'ሰላም', 'good morning', 'good evening'],
    priority: 10,
    reply:
      "Selam! I'm your Bahir Dar guide.\n\nAsk me anything about:\n• **Where to go** (Lake Tana, Blue Nile Falls, viewpoints)\n• **Food** (injera, lake fish, coffee)\n• **Hotels & budget**\n• **Transport** (bajaj, boats, airport)\n• **A 1–3 day itinerary**\n\nPrices are estimates only — always verify locally.",
  },
  {
    keys: [
      'where',
      'where to go',
      'where should',
      'where can i',
      'where do i',
      'places to visit',
      'place to visit',
      'what to see',
      'what to do',
      'things to do',
      'sightseeing',
      'recommend',
      'recommendation',
      'best place',
      'must see',
      'must-see',
      'tourist',
      'visit',
      'go first',
      'first day',
      'attractions',
      'በየት',
      'የት',
    ],
    priority: 5,
    reply:
      "**Where to go in Bahir Dar**\n\n**Top picks (start here)**\n1. **Lake Tana** — Ethiopia’s largest lake. Morning boat to island monasteries (e.g. Zege / Ura Kidane Mehret). Agree boat price in ETB before leaving the pier.\n2. **Blue Nile Falls (Tis Issat)** — day trip ~30 km toward Tis Abay. Best after rains; wear good shoes. Entry + optional guide + car are separate costs.\n3. **Bezawit viewpoint** — hilltop views over the Nile outlet and lake. Short outing, great at sunset.\n4. **Central market** — spices, coffee, everyday life. Go in the morning; keep bags secure.\n5. **Lakeside promenade** — walk, coffee, lake fish for lunch or dinner.\n\n**Simple plan**\n• **Half day:** lakeside + market + coffee\n• **1 day:** Lake Tana boat + fish lunch + Bezawit\n• **2 days:** Day 1 boat/monasteries · Day 2 Blue Nile Falls\n\nOpen **Map**, **Attractions**, and **Things to Do** in the app for pins and a checklist. Tell me your days (1 / 2 / 3) and budget (low / mid) for a tighter plan.",
  },
  {
    keys: ['lake tana', 'tana', 'boat', 'island', 'monastery', 'zege', 'ura kidane', 'debre maryam'],
    priority: 8,
    reply:
      "**Lake Tana & monasteries**\n• Ethiopia’s largest lake; source of the Blue Nile.\n• Shared half-day boats often ~800–5000 ETB/person (wide range); private charters much higher — negotiate at the pier or via hotel.\n• Popular stops: Zege peninsula monasteries (e.g. Ura Kidane Mehret) — modest dress, shoes off in churches.\n• Morning departures are usually calmer; bring sun protection, water, and cash.\n• Confirm which islands, return time, and whether monastery entry is included.\n\nUse **Map** → boat pier / Lake Tana, and **Attractions** in the app.",
  },
  {
    keys: ['blue nile', 'falls', 'tis', 'abay', 'tissisat', 'tis issat', 'waterfall'],
    priority: 8,
    reply:
      '**Blue Nile Falls (Tis Issat)**\n• About 30 km from Bahir Dar toward Tis Abay.\n• Entry often ~50–300 ETB; local guide ~300–1500 ETB/group; private car round trip ~800–3500 ETB (all estimates).\n• Flow is strongest after the rainy season; ask your hotel about current conditions.\n• Paths can be steep and slippery — proper shoes required.\n• Full day recommended if combining with sightseeing stops.\n\nSee **Attractions** and **Transport** in the app.',
  },
  {
    keys: ['food', 'eat', 'restaurant', 'injera', 'coffee', 'fish', 'dinner', 'lunch', 'breakfast', 'cafe', 'café'],
    priority: 7,
    reply:
      '**Food in Bahir Dar**\n• **Must try:** lake fish (tilapia), injera with wot/shiro, beyaynetu (veg combo), Ethiopian coffee.\n• **Rough prices:** local plate ~50–350 ETB; lakeside fish ~180–500 ETB; coffee ~30–80 ETB.\n• **Where:** lakeside for fish & views; city center for budget injera houses; hotels when you want English menus.\n• Eat with the right hand from shared platters. Busy kitchens are usually safer.\n\nOpen **Restaurants** in the app for local recommendations and listings.',
  },
  {
    keys: ['hotel', 'stay', 'sleep', 'lodge', 'accommodation', 'resort', 'guesthouse'],
    priority: 7,
    reply:
      '**Where to stay**\n• **Budget:** ~1500–4000 ETB/night (guesthouse / simple hotel)\n• **Mid:** ~4000–9000 ETB/night\n• **Comfort / lakeside:** ~8000–25000+ ETB/night\n• Stay near the lake if you plan boat trips; city center is fine for markets and bajaj access.\n• Always confirm current rates — seasonal and nationality pricing vary.\n\nBrowse **Hotels** + **Map**. Track costs under **Budget** and **My Trips**.',
  },
  {
    keys: ['transport', 'taxi', 'bajaj', 'bus', 'airport', 'driver', 'car', 'how to get', 'getting around'],
    priority: 7,
    reply:
      '**Getting around**\n• **Bajaj:** short hops often ~50–200 ETB — agree price before you start.\n• **Taxi:** across town ~150–500 ETB (est.).\n• **Minibus:** cheapest fixed routes.\n• **Airport (BJR) ↔ city:** ~300–1500 ETB; 15–40 min.\n• **Falls day car:** ~800–3500 ETB vehicle round trip (est.).\n• **Boats:** negotiate at the Lake Tana pier; hotel can arrange trusted operators.\n\nSee **Transport** and **Map** in the app.',
  },
  {
    keys: ['budget', 'cost', 'price', 'money', 'etb', 'expensive', 'cheap', 'how much'],
    priority: 7,
    reply:
      '**Rough 2-night budget for 2 people (ETB estimates)**\n• Lodging: 5,000–12,000+\n• Food: 2,000–5,000\n• Boat / Falls / activities: 2,000–6,000\n• Local transport: 500–2,000\n• Buffer: 1,000–2,000\n\nCarry cash (ATMs can run dry). Open the **Budget** planner to adjust tiers, then save a trip under **My Trips**.',
  },
  {
    keys: ['itinerary', 'day plan', '2-day', 'two day', '3-day', 'three day', 'weekend', 'schedule', 'trip plan', 'plan my'],
    priority: 9,
    reply:
      '**Sample plans**\n\n**1 day:** Morning Lake Tana boat → fish lunch lakeside → Bezawit or market → dinner.\n\n**2 days:**\n• **Day 1:** Boat + monasteries + lakeside evening\n• **Day 2:** Early Blue Nile Falls day trip → return for coffee\n\n**3 days:** Add a slow market/coffee morning, university area stroll, or a second shorter boat.\n\nStart early for boats and the Falls. Build your checklist under **Things to Do** and pin places on **Map**.',
  },
  {
    keys: ['safety', 'safe', 'scam', 'health', 'hospital', 'emergency', 'police'],
    priority: 8,
    reply:
      '**Safety & help**\n• Use known boat operators; agree prices before departure.\n• Keep valuables discrete; careful in crowded markets.\n• Drink sealed bottled water only.\n• **Emergency (Ethiopia):** Police **991** · Ambulance **907** · Fire **939**\n• Main hospital orientation: **Felege Hiwot Referral Hospital** — ask hotel for the best current route.\n\nSee **Directory → Emergency** in the app. This is general advice, not a substitute for local emergency services.',
  },
  {
    keys: ['amharic', 'language', 'አማርኛ', 'speak'],
    priority: 6,
    reply:
      '**Language**\n• Amharic is primary; English is common in hotels and tourism.\n• Useful phrases: **Selam** (hello) · **Ameseginalehu** (thank you) · **Sint new?** (how much?)\n• Switch the app language in **Profile** (EN / አማርኛ).',
  },
  {
    keys: ['market', 'shopping', 'souvenir', 'craft'],
    priority: 6,
    reply:
      '**Market & shopping**\n• Central market is best in the morning for produce, spices, and coffee.\n• Bargain politely; start lower than the first price.\n• Keep bags zipped in crowds.\n• Craft/souvenir stalls near tourist routes — compare quality before buying.\n\nPin **Bahir Dar Central Market** from **Explore** or **Map**.',
  },
  {
    keys: ['weather', 'rain', 'hot', 'season', 'when to visit'],
    priority: 6,
    reply:
      '**When to visit (general)**\n• Dry months are easier for boats and road trips; the Falls are often more dramatic after the rains.\n• Mornings are cooler for walking and boat departures.\n• Pack sun protection year-round and a light layer for lakeside evenings.\n\nAlways check a current forecast before a Falls day trip.',
  },
]

function scoreMatch(lower: string, keys: string[]): number {
  let score = 0
  for (const k of keys) {
    if (lower.includes(k)) {
      score += Math.max(1, k.length / 4)
    }
  }
  return score
}

function matchDemoReply(userText: string): string {
  const lower = userText.toLowerCase().trim()

  let best: { reply: string; score: number } | null = null
  for (const entry of DEMO_KNOWLEDGE) {
    const s = scoreMatch(lower, entry.keys) * (entry.priority ?? 5)
    if (s <= 0) continue
    if (!best || s > best.score) best = { reply: entry.reply, score: s }
  }
  if (best && best.score > 0) return best.reply

  if (
    /\b(go|see|visit|do|plan|trip|tour|place|places)\b/.test(lower) ||
    /where/.test(lower)
  ) {
    const whereEntry = DEMO_KNOWLEDGE.find((e) => e.keys.includes('where to go'))
    if (whereEntry) return whereEntry.reply
  }

  return (
    "**Here's how I can help**\n\n" +
    'Try asking in plain words, for example:\n' +
    '• "Where should I go in Bahir Dar?"\n' +
    '• "Plan a 2-day itinerary"\n' +
    '• "Lake Tana boat tips"\n' +
    '• "Where to eat fish and injera?"\n' +
    '• "Rough budget for 2 nights"\n' +
    '• "How do I get to the Blue Nile Falls?"\n\n' +
    'Or open **Map**, **Attractions**, **Restaurants**, and **Things to Do** in the app.\n\n' +
    '_Offline guide tips work without a server key. Live AI needs the `ai-guide` Edge Function + `AI_API_KEY`._'
  )
}

export async function sendGuideMessage(
  history: ChatMessage[],
  locale: string = 'en'
): Promise<AIGuideResponse> {
  const messages = history
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ role: m.role, content: m.content }))

  const lastUser = [...history].reverse().find((m) => m.role === 'user')
  const offline = () =>
    lastUser ? matchDemoReply(lastUser.content) : DEMO_KNOWLEDGE[0].reply

  try {
    const { data, error } = await supabase.functions.invoke('ai-guide', {
      body: { messages, locale },
    })

    if (error) {
      console.warn('ai-guide invoke:', error.message, data)
      // Prefer server body when FunctionsHttpError still carries JSON
      const body = data as AIGuideResponse | null
      if (body?.reply && typeof body.reply === 'string') {
        return {
          reply: body.reply.includes('not fully configured') ? offline() : body.reply,
          fallback: true,
          error: error.message,
        }
      }
      return { reply: offline(), fallback: true, error: error.message }
    }

    if (data?.fallback || data?.error) {
      return {
        reply:
          data.reply && !String(data.reply).includes('not fully configured')
            ? data.reply
            : offline(),
        fallback: true,
        error: data.error ?? data.debug,
      }
    }

    if (data?.reply) {
      return { reply: data.reply, model: data.model }
    }

    return { reply: offline(), fallback: true }
  } catch (e) {
    console.warn('aiGuide network:', e)
    return {
      reply: offline(),
      fallback: true,
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
