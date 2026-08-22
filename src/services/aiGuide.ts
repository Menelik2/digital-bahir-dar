import { supabase } from '@/lib/supabase'
import type { ChatMessage, AIGuideResponse } from '@/types/ai'

const DEMO_KNOWLEDGE: { keys: string[]; reply: string }[] = [
  {
    keys: ['hello', 'hi', 'hey', 'selam', 'ሰላም'],
    reply:
      "Selam! I'm your Bahir Dar guide (DEMO mode). Ask about Lake Tana, Blue Nile Falls, hotels, food, transport, safety, or a 1–3 day itinerary. Prices below are estimates only — verify locally.\n\nWhen the AI Edge Function is configured, answers will use a live model.",
  },
  {
    keys: ['lake tana', 'tana', 'boat', 'island', 'monastery'],
    reply:
      "**Lake Tana (DEMO tips)**\n• Ethiopia's largest lake; source of the Blue Nile.\n• Popular boat trips visit island monasteries — book with a known operator and confirm times the same day.\n• Morning trips are often calmer; bring sun protection and water.\n• Agree on price in ETB before departure; ask about park/monastery fees.\n\nUse the **Map** and **Attractions** pages in the app for places and directions.",
  },
  {
    keys: ['blue nile', 'falls', 'tis', 'abay'],
    reply:
      '**Blue Nile Falls (DEMO tips)**\n• Seasonal flow varies a lot — ask locals or your hotel about current conditions.\n• Day trip from Bahir Dar is common; roads and access can change — confirm transport.\n• Wear shoes suitable for uneven paths; carry cash for entry/parking if required.\n• Combine with Lake Tana only if you have a full day and an early start.\n\nOpen **Attractions** in the app for the listing and directions.',
  },
  {
    keys: ['food', 'eat', 'restaurant', 'injera', 'coffee'],
    reply:
      '**Food in Bahir Dar (DEMO)**\n• Expect injera, stews (wot), fresh lake fish, and coffee ceremonies.\n• Budget range (very rough): local meal ~150–400 ETB; mid-range lakeside ~400–900+ ETB per person.\n• Ask about spice level; vegetarian options are often available.\n\nBrowse **Restaurants** in the app. Mark favorites after you sign in.',
  },
  {
    keys: ['hotel', 'stay', 'sleep', 'lodge'],
    reply:
      '**Where to stay (DEMO)**\n• Lakeside and city-centre options exist; prices vary by season and facilities.\n• Rough planning band: modest ~1,500–3,500 ETB/night; mid-range higher — always confirm current rates.\n• Check distance to the lake pier if you plan boat trips.\n\nUse **Hotels** + **Map** in the app. Create a trip under **My Trips** to track lodging in your budget.',
  },
  {
    keys: ['transport', 'taxi', 'bajaj', 'bus', 'airport'],
    reply:
      '**Getting around (DEMO)**\n• Bajaj and taxis are common in town — agree on the fare before you start.\n• For Falls or longer trips, arrange a driver via hotel or a trusted contact.\n• Walking is fine in central areas during the day; plan evenings carefully.\n\nSee **Transport** and **Map** in the app for more.',
  },
  {
    keys: ['budget', 'cost', 'price', 'money', 'etb'],
    reply:
      '**Rough 2-night budget for 2 people (DEMO estimates, ETB)**\n• Lodging: 5,000–12,000+\n• Food: 2,000–5,000\n• Boat / Falls / activities: 2,000–6,000\n• Local transport: 500–2,000\n• Buffer: 1,000–2,000\n\nOpen the **Budget** planner to tune numbers, then save a trip under **My Trips**.',
  },
  {
    keys: ['itinerary', 'day', 'plan', 'weekend', 'schedule'],
    reply:
      '**Sample 2-day plan (DEMO)**\n**Day 1:** Morning Lake Tana boat (monastery visit) → lakeside lunch → city / market stroll → dinner.\n**Day 2:** Early Blue Nile Falls day trip → return afternoon → coffee and rest.\n\nAdjust for weather, energy, and boat availability. Build this under **My Trips** and pin places from the map.',
  },
  {
    keys: ['safety', 'safe', 'scam', 'health'],
    reply:
      "**Safety basics (DEMO)**\n• Use registered boats and clear prices.\n• Keep copies of important documents; don't flash large amounts of cash.\n• Drink sealed water; sun and dehydration are common risks.\n• For medical needs, ask your hotel for current clinic recommendations.\n\nThis is general advice, not emergency guidance. In an emergency, use local emergency services.",
  },
  {
    keys: ['amharic', 'language', 'አማርኛ'],
    reply:
      '**Language (DEMO)**\n• Amharic is widely spoken; English is common in hotels and tourism.\n• Useful: Selam (hello), Ameseginalehu (thank you), Sira? (how much?).\n• In the app Profile you can switch UI language preference (EN / አማርኛ).\n\nWhen the live AI is enabled, it can reply more fully in Amharic.',
  },
]

function matchDemoReply(userText: string): string {
  const lower = userText.toLowerCase()
  for (const entry of DEMO_KNOWLEDGE) {
    if (entry.keys.some((k) => lower.includes(k))) return entry.reply
  }
  return (
    "**DEMO guide reply**\nI don't have a specific offline tip for that yet. Try asking about:\n" +
    '• Lake Tana / boat trips\n• Blue Nile Falls\n• Food & restaurants\n• Hotels & budget\n• Transport or a 2-day itinerary\n\n' +
    'Or explore **Map**, **Explore**, and **Budget** in the app. Live AI answers need the `ai-guide` Edge Function and `AI_API_KEY`.'
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

  try {
    const { data, error } = await supabase.functions.invoke('ai-guide', {
      body: { messages, locale },
    })

    if (error) {
      console.warn('ai-guide invoke:', error.message)
      return {
        reply: lastUser ? matchDemoReply(lastUser.content) : DEMO_KNOWLEDGE[0].reply,
        fallback: true,
        error: error.message,
      }
    }

    if (data?.fallback || data?.error) {
      return {
        reply: data.reply || (lastUser ? matchDemoReply(lastUser.content) : DEMO_KNOWLEDGE[0].reply),
        fallback: true,
        error: data.error,
      }
    }

    if (data?.reply) {
      return { reply: data.reply, model: data.model }
    }

    return {
      reply: lastUser ? matchDemoReply(lastUser.content) : DEMO_KNOWLEDGE[0].reply,
      fallback: true,
    }
  } catch (e) {
    console.warn('aiGuide network:', e)
    return {
      reply: lastUser ? matchDemoReply(lastUser.content) : DEMO_KNOWLEDGE[0].reply,
      fallback: true,
      error: e instanceof Error ? e.message : 'network',
    }
  }
}

export const SUGGESTED_PROMPTS = [
  'Plan a 2-day Bahir Dar itinerary',
  'Lake Tana boat trip tips',
  'Blue Nile Falls day trip',
  'Rough budget for 2 people, 2 nights',
  'Where to eat traditional food?',
  'How to get around the city?',
]
