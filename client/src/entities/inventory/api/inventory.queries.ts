import { useQuery } from '@tanstack/react-query'
import { getInventories, getInventoryById } from './inventory.api'
import type { InventoryId } from '../model/inventory.types'

export const inventoryKeys = {
  all: ['inventories'] as const,
  list: (query?: string) => [...inventoryKeys.all, 'list', query ?? ''] as const,
  byId: (id: InventoryId) => [...inventoryKeys.all, 'byId', id] as const,
}

export function useInventories(query?: string) {
  return useQuery({
    queryKey: inventoryKeys.list(query),
    queryFn: () => getInventories({ query }),
  })
}

export function useInventory(id: InventoryId) {
  return useQuery({
    queryKey: inventoryKeys.byId(id),
    queryFn: () => getInventoryById(id),
    enabled: Boolean(id),
  })
}
