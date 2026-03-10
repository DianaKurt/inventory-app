export type ItemId = string
export type InventoryId = string

export type ItemListRow = {
  id: ItemId
  inventoryId: InventoryId
  customId: string
  version: number
  createdAt: string
  updatedAt: string
}
export type ItemDetails = {
  id: ItemId
  inventoryId: InventoryId
  customId: string
  version: number
  createdAt: string
  updatedAt: string
}