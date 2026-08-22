// Supabase Edge Function: AI Guide for Digital Bahir Dar
// Deploy: supabase functions deploy ai-guide
// Secrets (Supabase only — never VITE_*):
//   AI_API_KEY  = Groq API key from https://console.groq.com/keys
//   AI_MODEL    = optional (default: llama-3.3-70b-versatile)
//   AI_BASE_URL = optional (default: https://api.groq.com/openai/v1)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SYSTEM_PROMPT = `You are the Digital Bahir Dar AI travel guide for Bahir Dar, Ethiopia (Lake Tana, Blue Nile Falls, monasteries, local food, transport, safety).

Rules:
- Answer in the user's language (English or Amharic) when possible.
- Be practical, concise, and honest. Prefer ETB for prices; mark uncertain prices as estimates.
- Never invent real-time data (weather, exact boat schedules, current road closures). Say when something should be verified locally.
- Encourage verified operators and local guides. Do not promote unsafe activities.
- If asked for itineraries or budgets, structure with days and rough ETB ranges.
- You are not a booking engine; direct users to the app's map, places, and trip planner for details.`

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messages, locale } = await req.json()
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'messages required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const apiKey = Deno.env.get('AI_API_KEY')
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: 'AI_API_KEY not configured',
          fallback: true,
          reply:
            'The AI guide is not fully configured on the server yet. Use the in-app demo tips, map, and trip planner. Ask an admin to set AI_API_KEY (Groq) on the Edge Function.',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const systemContent =
      locale === 'am'
        ? SYSTEM_PROMPT + '\nPrefer Amharic (አማርኛ) when the user writes in Amharic.'
        : SYSTEM_PROMPT

    // Groq is OpenAI-compatible. Override with AI_BASE_URL if needed.
    const baseUrl = (Deno.env.get('AI_BASE_URL') || 'https://api.groq.com/openai/v1').replace(/\/$/, '')
    const model = Deno.env.get('AI_MODEL') || 'llama-3.3-70b-versatile'

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: systemContent }, ...messages.slice(-20)],
        temperature: 0.7,
        max_tokens: 800,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('AI provider error', res.status, errText)
      return new Response(JSON.stringify({ error: 'AI provider error', status: res.status, detail: errText.slice(0, 500) }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const data = await res.json()
    const reply = data.choices?.[0]?.message?.content ?? 'Sorry, I could not generate a reply.'

    return new Response(JSON.stringify({ reply, model: data.model || model }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
