import type { ApiError } from './api.types'

export function isApiError(e: unknown): e is ApiError {
  if (!e || typeof e !== 'object') return false
  const x = e as any
  return typeof x.status === 'number' && typeof x.message === 'string'
}
