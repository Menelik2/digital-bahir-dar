/**
 * Vercel Serverless Function — Digital Bahir Dar AI Guide
 *
 * Vercel → Settings → Environment Variables (Production):
 *   AI_API_KEY   = Gemini key from https://aistudio.google.com/apikey
 *   AI_BASE_URL  = https://generativelanguage.googleapis.com/v1beta/openai
 *   AI_MODEL     = gemini-3.6-flash   (optional; code tries modern models)
 *
 * Aliases: GEMINI_API_KEY, GROQ_API_KEY, OPENAI_API_KEY
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EnvReq = any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EnvRes = any

const SYSTEM_PROMPT = `You are the Digital Bahir Dar AI travel guide for Bahir Dar, Ethiopia (Lake Tana, Blue Nile Falls, monasteries, local food, transport, safety).

Rules:
- Answer in the user's language (English or Amharic) when possible.
- Be practical, concise, and honest. Prefer ETB for prices; mark uncertain prices as estimates.
- Never invent real-time data (weather, exact boat schedules, current road closures). Say when something should be verified locally.
- Encourage verified operators and local guides. Do not promote unsafe activities.
- If asked for itineraries or budgets, structure with days and rough ETB ranges.
- You are not a booking engine; direct users to the app's map, places, and trip planner for details.
- Do not invent places that are not widely known public landmarks in Bahir Dar / Lake Tana.`

/** Models known to be retired for new callers — never send these upstream. */
const RETIRED_MODELS = new Set([
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-pro',
])

/** Prefer current Gemini OpenAI-compat models, then common aliases. */
const MODEL_CANDIDATES = [
  'gemini-3.6-flash',
  'gemini-3-flash-preview',
  'gemini-2.5-flash-lite',
  'gemini-flash-latest',
]

function setCors(res: EnvRes) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

function resolveModels(): string[] {
  const fromEnv = (process.env.AI_MODEL || process.env.OPENAI_MODEL || '').trim()
  const list: string[] = []
  if (fromEnv && !RETIRED_MODELS.has(fromEnv)) list.push(fromEnv)
  for (const m of MODEL_CANDIDATES) {
    if (!list.includes(m)) list.push(m)
  }
  return list
}

async function callUpstream(
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: unknown[]
): Promise<{ ok: boolean; status: number; body: string; json?: Record<string, unknown> }> {
  const upstream = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.65,
      max_tokens: 900,
    }),
  })
  const body = await upstream.text()
  let json: Record<string, unknown> | undefined
  try {
    json = JSON.parse(body) as Record<string, unknown>
  } catch {
    /* non-json */
  }
  return { ok: upstream.ok, status: upstream.status, body, json }
}

export default async function handler(req: EnvReq, res: EnvRes) {
  setCors(res)

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only', fallback: true })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const messages = Array.isArray(body.messages) ? body.messages : []
    const locale = body.locale === 'am' ? 'am' : 'en'

    const apiKey =
      process.env.AI_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.GROQ_API_KEY ||
      process.env.OPENAI_API_KEY ||
      ''

    if (!apiKey) {
      return res.status(200).json({
        error: 'AI_API_KEY not configured on Vercel',
        fallback: true,
        debug:
          'Set AI_API_KEY (Gemini key from aistudio.google.com) in Vercel → Environment Variables, then Redeploy.',
        reply: 'Live AI is not configured yet. Offline tips still work in the app.',
      })
    }

    const rawBase =
      process.env.AI_BASE_URL ||
      process.env.OPENAI_BASE_URL ||
      'https://generativelanguage.googleapis.com/v1beta/openai'
    const baseUrl = String(rawBase).replace(/\/+$/, '')

    const systemContent =
      locale === 'am'
        ? SYSTEM_PROMPT + '\nPrefer Amharic (አማርኛ) when the user writes in Amharic.'
        : SYSTEM_PROMPT

    const chatMessages = [{ role: 'system', content: systemContent }, ...messages.slice(-20)]
    const models = resolveModels()

    let lastStatus = 0
    let lastDetail = ''
    let usedModel = models[0]

    for (const model of models) {
      usedModel = model
      const result = await callUpstream(baseUrl, apiKey, model, chatMessages)

      if (result.ok) {
        const reply =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (result.json as any)?.choices?.[0]?.message?.content ??
          'Sorry, I could not generate a reply.'
        return res.status(200).json({
          reply,
          model,
          grounded: true,
          fallback: false,
        })
      }

      lastStatus = result.status
      lastDetail = result.body.slice(0, 400)

      // Retry next model on not-found, retired, or temporary capacity errors
      const detailLower = result.body.toLowerCase()
      const retryable =
        result.status === 404 ||
        result.status === 429 ||
        result.status === 503 ||
        detailLower.includes('no longer available') ||
        detailLower.includes('not found') ||
        detailLower.includes('is not found') ||
        detailLower.includes('high demand') ||
        detailLower.includes('unavailable') ||
        detailLower.includes('resource_exhausted')
      if (!retryable) break
      console.error('AI model failed, trying next', model, result.status)
    }

    console.error('AI provider error', lastStatus, lastDetail)
    return res.status(200).json({
      error: 'AI provider error',
      status: lastStatus,
      detail: lastDetail,
      model: usedModel,
      fallback: true,
      reply:
        lastStatus === 401 || lastStatus === 403
          ? 'AI API key was rejected. Update AI_API_KEY on Vercel (Gemini key from aistudio.google.com).'
          : lastStatus === 404
            ? 'Model not available. Set AI_MODEL=gemini-3.6-flash on Vercel and redeploy.'
            : lastStatus === 503 || lastStatus === 429
              ? 'Live AI is busy right now. Please try again in a moment — offline tips still work.'
              : 'AI provider returned an error. Offline tips still work in the app.',
    })
  } catch (e) {
    console.error('ai-guide handler', e)
    return res.status(200).json({
      error: e instanceof Error ? e.message : 'server error',
      fallback: true,
      reply: 'AI service error. Offline tips still work in the app.',
    })
  }
}
