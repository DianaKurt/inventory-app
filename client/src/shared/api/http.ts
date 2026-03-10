export type ApiError = {
  status: number
  message: string
  details?: unknown
}

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

function normalizeMessage(body: unknown, fallback: string) {
  const msg = (body as any)?.message
  if (typeof msg === 'string' && msg.trim()) return msg
  return fallback
}

async function parseBodySafe(res: Response) {
  if (res.status === 204) return null

  const ct = res.headers.get('content-type') ?? ''
  if (ct.includes('application/json')) {
    try {
      return await res.json()
    } catch {
      return null
    }
  }

  const text = await res.text()
  return text ? text : null
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init.headers ?? {}),
    },
  })

  const body = await parseBodySafe(res)

  if (!res.ok) {
    throw {
      status: res.status,
      message: normalizeMessage(body, res.statusText),
      details: body,
    } satisfies ApiError
  }

  return (body == null ? undefined : body) as T
}

export function apiGet<T>(path: string, init?: RequestInit) {
  return request<T>(path, { method: 'GET', ...init })
}

export function apiPost<T>(path: string, body?: unknown, init?: RequestInit) {
  const hasBody = body != null
  return request<T>(path, {
    method: 'POST',
    ...init,
    body: hasBody ? JSON.stringify(body) : undefined,
    headers: {
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...(init?.headers ?? {}),
    },
  })
}

export function apiPatch<T>(path: string, body?: unknown, init?: RequestInit) {
  const hasBody = body != null
  return request<T>(path, {
    method: 'PATCH',
    ...init,
    body: hasBody ? JSON.stringify(body) : undefined,
    headers: {
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...(init?.headers ?? {}),
    },
  })
}

export function apiDelete<T>(path: string, init?: RequestInit) {
  return request<T>(path, { method: 'DELETE', ...init })
}