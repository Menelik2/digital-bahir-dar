/**
 * Vercel Serverless Function — Digital Bahir Dar AI Guide
 * Works without Supabase Edge Function deploy.
 *
 * Vercel → Settings → Environment Variables (Production):
 *   AI_API_KEY   = Gemini key from https://aistudio.google.com/apikey
 *   AI_BASE_URL  = https://generativelanguage.googleapis.com/v1beta/openai
 *   AI_MODEL     = gemini-3.6-flash
 *
 * Aliases: GEMINI_API_KEY, GROQ_API_KEY, OPENAI_API_KEY
 * Redeploy after adding env vars.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ReqReq = any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ReqRes = any

const SYSTEM_PROMPT = `You are the Digital Bahir Dar AI travel guide for Bahir Dar, Ethiopia (Lake Tana, Blue Nile Falls, monasteries, local food, transport, safety).

Rules:
- Answer in the user's language (English or Amharic) when possible.
- Be practical, concise, and honest. Prefer ETB for prices; mark uncertain prices as estimates.
- Never invent real-time data (weather, exact boat schedules, current road closures). Say when something should be verified locally.
- Encourage verified operators and local guides. Do not promote unsafe activities.
- If asked for itineraries or budgets, structure with days and rough ETB ranges.
- You are not a booking engine; direct users to the app's map, places, and trip planner for details.
- Do not invent places that are not widely known public landmarks in Bahir Dar / Lake Tana.`

function setCors(res: ReqRes) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

export default async function handler(req: ReqReq, res: ReqRes) {
  setCors(res)

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only', fallback: true })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const messages = body.messages
    const locale = body.locale || 'en'

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages required', fallback: true })
    }

    const apiKey =
      process.env.AI_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.GROQ_API_KEY ||
      process.env.OPENAI_API_KEY

    if (!apiKey) {
      return res.status(200).json({
        error: 'AI_API_KEY not configured on Vercel',
        fallback: true,
        debug:
          'Set AI_API_KEY, AI_BASE_URL, AI_MODEL in Vercel Project Settings → Environment Variables, then Redeploy.',
        reply:
          'Live AI is not configured on the server yet. Offline tips still work in the app.',
      })
    }

    const rawBase =
      process.env.AI_BASE_URL ||
      process.env.OPENAI_BASE_URL ||
      'https://generativelanguage.googleapis.com/v1beta/openai'
    const baseUrl = String(rawBase).replace(/\/+$/, '')
    const model =
      process.env.AI_MODEL || process.env.OPENAI_MODEL || 'gemini-3.6-flash'

    const systemContent =
      locale === 'am'
        ? SYSTEM_PROMPT + '\nPrefer Amharic (አማርኛ) when the user writes in Amharic.'
        : SYSTEM_PROMPT

    const upstream = await fetch(`${baseUrl}/chat/completions`, {
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

    if (!upstream.ok) {
      const errText = await upstream.text()
      console.error('AI provider error', upstream.status, errText)
      return res.status(200).json({
        error: 'AI provider error',
        status: upstream.status,
        detail: errText.slice(0, 400),
        fallback: true,
        reply:
          upstream.status === 401 || upstream.status === 403
            ? 'AI API key was rejected. Update AI_API_KEY on Vercel (Gemini key from aistudio.google.com).'
            : upstream.status === 404
              ? 'Model or endpoint not found. Check AI_MODEL (e.g. gemini-3.6-flash) and AI_BASE_URL.'
              : 'AI provider returned an error. Offline tips still work in the app.',
      })
    }

    const data = await upstream.json()
    const reply =
      data?.choices?.[0]?.message?.content ?? 'Sorry, I could not generate a reply.'

    return res.status(200).json({
      reply,
      model: data.model || model,
      provider: /generativelanguage\.googleapis\.com/i.test(baseUrl) ? 'gemini' : 'openai-compat',
    })
  } catch (e) {
    console.error(e)
    return res.status(200).json({
      error: String(e),
      fallback: true,
      reply: 'Server error in AI guide. Please try again — offline tips still work.',
    })
  }
}
