import { apiGet, apiPatch, apiPost, apiDelete  } from '@/shared/api/http'
import type { InventoryDetails, InventoryListRow, InventoryId } from '../model/inventory.types'

export function getInventories(params?: { query?: string }) {
  const q = params?.query?.trim()
  const qs = q ? `?query=${encodeURIComponent(q)}` : ''
  return apiGet<InventoryListRow[]>(`/inventories${qs}`)
}

export function getInventoryById(id: InventoryId) {
  return apiGet<InventoryDetails>(`/inventories/${encodeURIComponent(id)}`)
}

export function getInventoryDetails(id: string) {
  return apiGet<any>(`/inventories/${encodeURIComponent(id)}`)
}

export type InventoryAccessUser = {
  id: string
  name: string
  email: string
  canWrite: boolean
}

export type InventoryAccessDto = {
  isPublic: boolean
  users: InventoryAccessUser[]
}

export function getInventoryAccess(id: string) {
  return apiGet<InventoryAccessDto>(`/inventories/${encodeURIComponent(id)}/access`)
}

export function updateInventoryVisibility(id: string, isPublic: boolean) {
  return apiPatch<{ id: string; isPublic: boolean }>(
    `/inventories/${encodeURIComponent(id)}/access/visibility`,
    { isPublic },
  )
}

export function addInventoryAccess(id: string, email: string) {
  return apiPost<InventoryAccessUser>(
    `/inventories/${encodeURIComponent(id)}/access`,
    { email },
  )
}

export function removeInventoryAccess(id: string, userId: string) {
  return apiDelete<{ ok: true }>(
    `/inventories/${encodeURIComponent(id)}/access/${encodeURIComponent(userId)}`,
  )
}