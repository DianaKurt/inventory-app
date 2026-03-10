import { apiPost, apiGet} from '@/shared/api/http'

export type PublicUser = { id: string; name: string; email: string; role: 'USER' | 'ADMIN' }

export type LoginDto = { email: string; password: string }
export type RegisterDto = { email: string; password: string; name?: string }

export function apiLogin(dto: LoginDto) {
  return apiPost<PublicUser>('/auth/login', dto)
}

export function apiRegister(dto: RegisterDto) {
  return apiPost<PublicUser>('/auth/register', dto)
}

export function apiMe() {
  return apiGet<PublicUser>('/auth/me', { cache: 'no-store' as any })
}

export function apiLogout() {
  return apiPost<{ ok: true }>('/auth/logout')
}
