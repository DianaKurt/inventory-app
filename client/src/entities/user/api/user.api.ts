import { apiGet } from '@/shared/api/http'
import type { User, UserPublic } from '../model/user.types'

import { apiMe } from '@/entities/user/api/auth.api'
export const fetchMe = apiMe

export async function fetchUserById(id: string): Promise<UserPublic> {
  return apiGet<UserPublic>(`/users/${encodeURIComponent(id)}`)
}
