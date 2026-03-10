export type InventoryId = string

export type InventoryListRow = {
  id: InventoryId
  title: string
  category: string | null
  itemsCount: number
  ownerName: string
  tags: string[]
  updatedAt: string // YYYY-MM-DD
}

export type InventoryDetails = {
  id: InventoryId
  title: string
  description: string | null
  category: string | null
  isPublic: boolean
  version: number
  itemsCount: number
  owner: { id: string; name: string | null; email: string }
  tags: string[]
  fields: unknown[] // Field types
  updatedAt: string
}
