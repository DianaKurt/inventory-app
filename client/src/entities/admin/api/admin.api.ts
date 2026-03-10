import { apiGet, apiPatch, apiDelete } from '@/shared/api/http'

export type AdminUser = {
  id: string
  email: string
  name: string | null
  role: 'USER' | 'ADMIN'
  blocked: boolean
  createdAt: string
  counts?: {
    inventoriesOwned: number
    itemsCreated: number
    posts: number
    likes: number
  }
}

export async function apiAdminGetUsers() {
  return apiGet<{ items: AdminUser[] }>('/admin/users')
}

export async function apiBlockUser(id: string) {
  return apiPatch(`/admin/users/${id}/block`)
}

export async function apiUnblockUser(id: string) {
  return apiPatch(`/admin/users/${id}/unblock`)
}

export async function apiMakeAdmin(id: string) {
  return apiPatch(`/admin/users/${id}/make-admin`)
}

export async function apiRemoveAdmin(id: string) {
  return apiPatch(`/admin/users/${id}/remove-admin`)
}

export async function apiDeleteUser(id: string) {
  return apiDelete(`/admin/users/${id}`)
}