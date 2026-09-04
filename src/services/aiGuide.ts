import { supabase } from '@/lib/supabase'
import type { ChatMessage, AIGuideResponse, GuideAction } from '@/types/ai'

/** Offline knowledge — used when Edge Function / AI_API_KEY is unavailable */
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
    keys: ['lake tana', 'tana', 'boat', 'island', 'monastery', 'zege', 'ura kidane', 'debre maryam'],
    priority: 8,
    reply:
      "**Lake Tana & monasteries**\n• Ethiopia's largest lake; source of the Blue Nile.\n• Shared half-day boats often ~1,500–2,500 ETB/person (2025–26 range); private charters higher — negotiate at the pier or via hotel.\n• Popular stops: Zege peninsula monasteries (e.g. Ura Kidane Mehret) — modest dress, shoes off in churches.\n• Morning departures are usually calmer; bring sun protection, water, and cash.\n• Confirm which islands, return time, and whether monastery entry is included.\n\nUse **Map** → boat pier / Lake Tana, and **Trip Planner** for a full day that packs boat + falls.",
    actions: [
      { label: 'Map', to: '/map' },
      { label: 'Trip planner', to: '/trip-planner' },
      { label: 'Attractions', to: '/attractions' },
    ],
  },
  {
    keys: ['blue nile', 'falls', 'tis', 'abay', 'tissisat', 'tis issat', 'waterfall'],
    priority: 8,
    reply:
      '**Blue Nile Falls (Tis Issat)**\n• About 30 km from Bahir Dar toward Tis Abay.\n• Entry often ~150–300 ETB; local guide ~300–1,500 ETB/group; private car/taxi round trip ~1,500–3,500 ETB (estimates).\n• Flow is strongest after the rainy season; ask your hotel about current conditions.\n• Paths can be steep and slippery — proper shoes required.\n• Full day recommended if combining with sightseeing stops; on a **2-day** trip, classic order is boat Day 1 → falls Day 2.\n\nSee **Attractions**, **Transport**, and **Trip Planner**.',
    actions: [
      { label: 'Trip planner', to: '/trip-planner' },
      { label: 'Transport', to: '/transport' },
      { label: 'Attractions', to: '/attractions' },
    ],
  },
  {
    keys: ['food', 'eat', 'restaurant', 'injera', 'coffee', 'fish', 'dinner', 'lunch', 'breakfast', 'cafe', 'café'],
    priority: 7,
    reply:
      '**Food in Bahir Dar**\n• **Must try:** lake fish (tilapia), injera with wot/shiro, beyaynetu (veg combo), Ethiopian coffee.\n• **Rough prices:** local plate ~80–350 ETB; lakeside fish ~200–600 ETB; coffee ~40–100 ETB.\n• **Where:** lakeside for fish & views; city center for budget injera houses; hotels when you want English menus.\n• Eat with the right hand from shared platters. Busy kitchens are usually safer.\n\nOpen **Restaurants** in the app for local recommendations and listings.',
    actions: [
      { label: 'Restaurants', to: '/restaurants' },
      { label: 'Spend guide', to: '/spend-guide' },
    ],
  },
  {
    keys: ['hotel', 'stay', 'sleep', 'lodge', 'accommodation', 'resort', 'guesthouse'],
    priority: 7,
    reply:
      '**Where to stay**\n• **Budget:** ~1,500–4,000 ETB/night (guesthouse / simple hotel)\n• **Mid:** ~4,000–9,000 ETB/night\n• **Comfort / lakeside:** ~8,000–25,000+ ETB/night\n• Stay near the lake if you plan boat trips; city center is fine for markets and bajaj access.\n• Always confirm current rates — seasonal and nationality pricing vary.\n\nBrowse **Hotels** + **Map**. Track costs under **Budget** and **Trip Planner**.',
    actions: [
      { label: 'Hotels', to: '/hotels' },
      { label: 'Budget', to: '/budget' },
      { label: 'Map', to: '/map' },
    ],
  },
  {
    keys: ['transport', 'taxi', 'bajaj', 'bus', 'airport', 'driver', 'car', 'how to get', 'getting around'],
    priority: 7,
    reply:
      '**Getting around**\n• **Bajaj:** short hops often ~50–200 ETB — agree price before you start.\n• **Taxi:** across town ~150–500 ETB (est.).\n• **Minibus:** cheapest fixed routes.\n• **Airport (BJR) ↔ city:** ~300–1,500 ETB; 15–40 min.\n• **Falls day car:** ~1,500–3,500 ETB vehicle round trip (est.).\n• **Boats:** negotiate at the Lake Tana pier; hotel can arrange trusted operators.\n\nSee **Transport** and **Map** in the app.',
    actions: [
      { label: 'Transport', to: '/transport' },
      { label: 'Map', to: '/map' },
    ],
  },
  {
    keys: ['budget', 'cost', 'price', 'money', 'etb', 'expensive', 'cheap', 'how much'],
    priority: 7,
    reply:
      '**Rough 2-night budget for 2 people (ETB estimates)**\n• Lodging: 5,000–12,000+\n• Food: 2,000–5,000\n• Boat / Falls / activities: 2,000–6,000\n• Local transport: 500–2,000\n• Buffer: 1,000–2,000\n\nCarry cash (ATMs can run dry). Open the **Budget** planner or **Trip Planner** to adjust days and tiers, then save under **My Trips**.',
    actions: [
      { label: 'Budget', to: '/budget' },
      { label: 'Trip planner', to: '/trip-planner' },
      { label: 'Spend guide', to: '/spend-guide' },
    ],
  },
  {
    keys: ['itinerary', 'day plan', '1-day', 'one day', '2-day', 'two day', '3-day', 'three day', 'weekend', 'schedule', 'trip plan', 'plan my'],
    priority: 9,
    reply:
      '**Sample plans (realistic sequencing)**\n\n**1 packed day:** Morning Lake Tana boat → fish lunch → afternoon Blue Nile Falls *only if you start very early and accept a long day*; otherwise keep falls for day 2.\n\n**2 classic days:**\n• **Day 1:** Boat + monasteries + lakeside evening\n• **Day 2:** Early Blue Nile Falls day trip → return for coffee\n\n**3+ days:** Add city/market morning, Bezawit sunset, second shorter boat, or a rest day.\n\nUse the in-app **Trip Planner** for day-by-day costs in ETB.',
    actions: [
      { label: 'Trip planner', to: '/trip-planner' },
      { label: 'Things to do', to: '/todo' },
      { label: 'Map', to: '/map' },
    ],
  },
  {
    keys: ['safety', 'safe', 'scam', 'health', 'hospital', 'emergency', 'police'],
    priority: 8,
    reply:
      '**Safety & help**\n• Use known boat operators; agree prices before departure.\n• Keep valuables discrete; careful in crowded markets.\n• Drink sealed bottled water only.\n• **Emergency (Ethiopia):** Police **991** · Ambulance **907** · Fire **939**\n• Main hospital orientation: **Felege Hiwot Referral Hospital** — ask hotel for the best current route.\n\nSee **Directory** in the app. This is general advice, not a substitute for local emergency services.',
    actions: [{ label: 'Directory', to: '/directory' }],
  },
  {
    keys: ['amharic', 'language', 'አማርኛ', 'speak'],
    priority: 6,
    reply:
      '**Language**\n• Amharic is primary; English is common in hotels and tourism.\n• Useful phrases: **Selam** (hello) · **Ameseginalehu** (thank you) · **Sint new?** (how much?)\n• Switch the app language in **Profile** (EN / አማርኛ).',
    actions: [{ label: 'Profile', to: '/profile' }],
  },
  {
    keys: ['market', 'shopping', 'souvenir', 'craft'],
    priority: 6,
    reply:
      '**Market & shopping**\n• Central market is best in the morning for produce, spices, and coffee.\n• Bargain politely; start lower than the first price.\n• Keep bags zipped in crowds.\n• Craft/souvenir stalls near tourist routes — compare quality before buying.\n\nPin **Bahir Dar Central Market** from **Explore** or **Map**.',
    actions: [
      { label: 'Explore', to: '/explore' },
      { label: 'Map', to: '/map' },
    ],
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

function matchDemo(userText: string): { reply: string; actions?: GuideAction[] } {
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
      '_Offline guide tips work without a server key. Live AI needs the `ai-guide` Edge Function + `AI_API_KEY` (Groq)._',
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

export async function sendGuideMessage(
  history: ChatMessage[],
  locale: string = 'en'
): Promise<AIGuideResponse> {
  const messages = history
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ role: m.role, content: m.content }))

  const lastUser = [...history].reverse().find((m) => m.role === 'user')
  const offline = () => {
    if (!lastUser) return { reply: DEMO_KNOWLEDGE[0].reply, actions: DEMO_KNOWLEDGE[0].actions }
    return matchDemo(lastUser.content)
  }

  try {
    const { data, error } = await supabase.functions.invoke('ai-guide', {
      body: { messages, locale },
    })

    if (error) {
      console.warn('ai-guide invoke:', error.message, data)
      const body = data as AIGuideResponse | null
      if (body?.reply && typeof body.reply === 'string' && !body.reply.includes('not fully configured')) {
        return {
          reply: body.reply,
          fallback: true,
          error: error.message,
          actions: lastUser ? topicActions(lastUser.content) : undefined,
          grounded: body.grounded,
        }
      }
      const fb = offline()
      return { reply: fb.reply, fallback: true, error: error.message, actions: fb.actions }
    }

    if (data?.fallback || data?.error) {
      const useOffline =
        !data.reply || String(data.reply).includes('not fully configured')
      const fb = offline()
      return {
        reply: useOffline ? fb.reply : data.reply,
        fallback: true,
        error: data.error ?? data.debug,
        actions: fb.actions,
        grounded: data.grounded,
      }
    }

    if (data?.reply) {
      return {
        reply: data.reply,
        model: data.model,
        grounded: data.grounded,
        actions: lastUser ? topicActions(lastUser.content) : undefined,
      }
    }

    const fb = offline()
    return { reply: fb.reply, fallback: true, actions: fb.actions }
  } catch (e) {
    console.warn('aiGuide network:', e)
    const fb = offline()
    return {
      reply: fb.reply,
      fallback: true,
      error: e instanceof Error ? e.message : 'network',
      actions: fb.actions,
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
