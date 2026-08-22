/**
 * Lightweight HTTP client (Axios-compatible subset).
 * Uses native fetch so we don't require a new dependency for CI.
 * If you prefer real Axios: npm i axios and re-export axios.create(...).
 */

export type HttpConfig = {
  baseURL?: string
  headers?: Record<string, string>
  timeout?: number
  params?: Record<string, string | number | boolean | undefined>
}

export type HttpResponse<T = unknown> = {
  data: T
  status: number
  statusText: string
  headers: Headers
}

function buildUrl(base: string | undefined, url: string, params?: HttpConfig['params']) {
  const u = new URL(url, base || (typeof window !== 'undefined' ? window.location.origin : 'https://localhost'))
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') u.searchParams.set(k, String(v))
    }
  }
  return u.toString()
}

async function request<T>(method: string, url: string, config: HttpConfig = {}, body?: unknown): Promise<HttpResponse<T>> {
  const controller = new AbortController()
  const ms = config.timeout ?? 25_000
  const timer = setTimeout(() => controller.abort(), ms)

  try {
    const res = await fetch(buildUrl(config.baseURL, url, config.params), {
      method,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...config.headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })

    const text = await res.text()
    let data: T
    try {
      data = text ? (JSON.parse(text) as T) : (null as T)
    } catch {
      data = text as unknown as T
    }

    if (!res.ok) {
      const err = new Error(`HTTP ${res.status}: ${res.statusText}`) as Error & { response?: HttpResponse<T> }
      err.response = { data, status: res.status, statusText: res.statusText, headers: res.headers }
      throw err
    }

    return { data, status: res.status, statusText: res.statusText, headers: res.headers }
  } finally {
    clearTimeout(timer)
  }
}

/** Axios-style client */
export const http = {
  get: <T = unknown>(url: string, config?: HttpConfig) => request<T>('GET', url, config),
  post: <T = unknown>(url: string, body?: unknown, config?: HttpConfig) => request<T>('POST', url, config, body),
  create: (defaults: HttpConfig) => ({
    get: <T = unknown>(url: string, config?: HttpConfig) =>
      request<T>('GET', url, { ...defaults, ...config, headers: { ...defaults.headers, ...config?.headers } }),
    post: <T = unknown>(url: string, body?: unknown, config?: HttpConfig) =>
      request<T>('POST', url, { ...defaults, ...config, headers: { ...defaults.headers, ...config?.headers } }, body),
  }),
}

export default http
