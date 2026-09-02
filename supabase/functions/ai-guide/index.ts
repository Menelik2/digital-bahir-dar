// Supabase Edge Function: AI Guide for Digital Bahir Dar
// Deploy: supabase functions deploy ai-guide --no-verify-jwt
// Secrets (Dashboard → Edge Functions → Secrets — never VITE_*):
//   AI_API_KEY  = Groq API key from https://console.groq.com/keys
//   AI_MODEL    = optional (default: llama-3.3-70b-versatile)
//   AI_BASE_URL = optional (default: https://api.groq.com/openai/v1)
// Auto: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function loadPlaceContext(queryHint: string): Promise<string> {
  try {
    const url = Deno.env.get('SUPABASE_URL')
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY')
    if (!url || !key) return ''

    const sb = createClient(url, key)
    const hint = queryHint.trim()

    if (hint.length >= 3) {
      try {
        const { data: searchData } = await sb.rpc('search_places', { q: hint, lim: 12 })
        if (searchData && Array.isArray(searchData) && searchData.length > 0) {
          const lines = searchData.map((p: Record<string, unknown>) => {
            const flags = [p.verified ? 'verified' : null, p.featured ? 'featured' : null]
              .filter(Boolean)
              .join(', ')
            return `- ${p.name} (/places/${p.slug})${flags ? ` [${flags}]` : ''}${p.short_description ? `: ${p.short_description}` : ''}`
          })
          return 'CONTEXT — matching places from Digital Bahir Dar database:\n' + lines.join('\n')
        }
      } catch (rpcErr) {
        console.warn('search_places rpc skipped', rpcErr)
      }
    }

    const { data } = await sb
      .from('places')
      .select('name, slug, short_description, address, verified, featured, price_level, entrance_fee, status')
      .eq('status', 'published')
      .is('deleted_at', null)
      .order('featured', { ascending: false })
      .limit(18)

    if (!data?.length) return ''
    const lines = data.map((p: Record<string, unknown>) => {
      const flags = [p.verified ? 'verified' : null, p.featured ? 'featured' : null]
        .filter(Boolean)
        .join(', ')
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

  if (req.method !== 'POST') {
    return json({ error: 'POST only' }, 405)
  }

  try {
    let body: { messages?: unknown; locale?: string }
    try {
      body = await req.json()
    } catch {
      return json({ error: 'Invalid JSON body', fallback: true }, 400)
    }

    const { messages, locale } = body
    if (!Array.isArray(messages) || messages.length === 0) {
      return json({ error: 'messages required', fallback: true }, 400)
    }

    const apiKey = Deno.env.get('AI_API_KEY')
    if (!apiKey) {
      return json({
        error: 'AI_API_KEY not configured',
        fallback: true,
        debug: 'Set secret AI_API_KEY in Supabase Dashboard → Project Settings → Edge Functions → Secrets',
        reply:
          'The AI guide is not fully configured on the server yet. Offline tips still work in the app. Ask an admin to set AI_API_KEY (Groq) on the Edge Function.',
      })
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

    let res: Response
    try {
      res = await fetch(`${baseUrl}/chat/completions`, {
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
    } catch (netErr) {
      console.error('AI fetch failed', netErr)
      return json({
        error: 'AI network error',
        fallback: true,
        debug: String(netErr),
        reply:
          'Could not reach the AI provider. Check Edge Function logs and AI_BASE_URL. Offline guide tips are still available in the app.',
      })
    }

    if (!res.ok) {
      const errText = await res.text()
      console.error('AI provider error', res.status, errText)
      // 200 + fallback so the mobile client always receives a body (no hard 502)
      return json({
        error: 'AI provider error',
        status: res.status,
        detail: errText.slice(0, 400),
        fallback: true,
        reply:
          res.status === 401 || res.status === 403
            ? 'AI API key was rejected. Update AI_API_KEY (Groq) in Supabase secrets.'
            : 'AI provider returned an error. Try again later — offline tips still work in the app.',
      })
    }

    const data = await res.json()
    const reply = data.choices?.[0]?.message?.content ?? 'Sorry, I could not generate a reply.'

    return json({
      reply,
      model: data.model || model,
      grounded: !!placeContext,
    })
  } catch (e) {
    console.error(e)
    return json({
      error: String(e),
      fallback: true,
      reply: 'Server error in AI guide. Please try again or use Map / Attractions offline tips.',
    })
  }
})
