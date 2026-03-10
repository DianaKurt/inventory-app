import { apiGet, apiPost, apiPatch, apiDelete } from '@/shared/api/http'
import type { InventoryId } from '@/entities/inventory/model/inventory.types'
import type { ItemId, ItemListRow, ItemDetails } from '../model/item.types'

export function getItemsByInventory(inventoryId: InventoryId) {
  const qs = `?inventoryId=${encodeURIComponent(inventoryId)}`
  return apiGet<ItemListRow[]>(`/items${qs}`)
}

export function createItem(input: { inventoryId: InventoryId; customId: string }) {
  return apiPost<ItemDetails>(`/items`, input)
}

export function updateItem(itemId: ItemId, patch: { customId?: string; version: number }) {
  return apiPatch<ItemDetails>(`/items/${encodeURIComponent(itemId)}`, patch)
}

export function deleteItem(itemId: ItemId) {
  return apiDelete<{ ok: true }>(`/items/${encodeURIComponent(itemId)}`)
}