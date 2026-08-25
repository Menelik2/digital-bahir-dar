// Supabase Edge Function: AI Guide for Digital Bahir Dar
// Deploy: supabase functions deploy ai-guide
// Secrets (Supabase only — never VITE_*):
//   AI_API_KEY  = Groq API key from https://console.groq.com/keys
//   AI_MODEL    = optional (default: llama-3.3-70b-versatile)
//   AI_BASE_URL = optional (default: https://api.groq.com/openai/v1)
//   SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY for place context

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
- You are not a booking engine; direct users to the app's map, places, and trip planner for details.
- When CONTEXT places are provided, prefer recommending those names/slugs and mention if verified/featured.
- Do not invent places that are not in CONTEXT or widely known public landmarks.`

async function loadPlaceContext(queryHint: string): Promise<string> {
  try {
    const url = Deno.env.get('SUPABASE_URL')
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY')
    if (!url || !key) return ''

    const sb = createClient(url, key)
    let q = sb
      .from('places')
      .select('name, slug, short_description, address, verified, featured, price_level, entrance_fee, status')
      .eq('status', 'published')
      .is('deleted_at', null)
      .order('featured', { ascending: false })
      .limit(18)

    const hint = queryHint.trim()
    if (hint.length >= 3) {
      const { data: searchData } = await sb.rpc('search_places', { q: hint, lim: 12 })
      if (searchData && Array.isArray(searchData) && searchData.length > 0) {
        const lines = searchData.map((p: Record<string, unknown>) => {
          const flags = [p.verified ? 'verified' : null, p.featured ? 'featured' : null].filter(Boolean).join(', ')
          return `- ${p.name} (/places/${p.slug})${flags ? ` [${flags}]` : ''}${p.short_description ? `: ${p.short_description}` : ''}`
        })
        return 'CONTEXT — matching places from Digital Bahir Dar database:\n' + lines.join('\n')
      }
    }

    const { data } = await q
    if (!data?.length) return ''
    const lines = data.map((p: Record<string, unknown>) => {
      const flags = [p.verified ? 'verified' : null, p.featured ? 'featured' : null].filter(Boolean).join(', ')
      return `- ${p.name} (/places/${p.slug})${flags ? ` [${flags}]` : ''}${p.short_description ? `: ${p.short_description}` : ''}`
    })
    return 'CONTEXT — featured / published places in Digital Bahir Dar:\n' + lines.join('\n')
  } catch (e) {
    console.warn('loadPlaceContext', e)
    return ''
  }
}

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

    const lastUser = [...messages].reverse().find((m: { role?: string }) => m.role === 'user')
    const hint = typeof lastUser?.content === 'string' ? lastUser.content : ''
    const placeContext = await loadPlaceContext(hint)

    let systemContent =
      locale === 'am'
        ? SYSTEM_PROMPT + '\nPrefer Amharic (አማርኛ) when the user writes in Amharic.'
        : SYSTEM_PROMPT
    if (placeContext) {
      systemContent += '\n\n' + placeContext
    }

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
        temperature: 0.65,
        max_tokens: 900,
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

    return new Response(
      JSON.stringify({
        reply,
        model: data.model || model,
        grounded: !!placeContext,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
