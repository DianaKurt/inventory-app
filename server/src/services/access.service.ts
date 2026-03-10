import { prisma } from '../db'

export async function canReadInventory(userId: string | null, inventoryId: string) {
  const inventory = await prisma.inventory.findUnique({
    where: { id: inventoryId },
    include: { access: true },
  })

  if (!inventory) throw { status: 404, message: 'Inventory not found' }

  // public
  if (inventory.isPublic) return inventory

  // not logged in
  if (!userId) throw { status: 401, message: 'Unauthorized' }

  // owner
  if (inventory.ownerId === userId) return inventory

  // shared read (any record)
  const shared = inventory.access.find((a) => a.userId === userId)
  if (shared) return inventory

  throw { status: 403, message: 'Forbidden' }
}

export async function canWriteInventory(userId: string, inventoryId: string) {
  const inventory = await prisma.inventory.findUnique({
    where: { id: inventoryId },
    include: { access: true },
  })

  if (!inventory) throw { status: 404, message: 'Inventory not found' }

  // owner
  if (inventory.ownerId === userId) return inventory

  // shared write
  const shared = inventory.access.find((a) => a.userId === userId)
  if (shared?.canWrite) return inventory

  throw { status: 403, message: 'Forbidden' }
}