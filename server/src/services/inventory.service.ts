import { prisma } from '../db'
import { FieldType, Prisma } from '@prisma/client'
import {canReadInventory, canWriteInventory} from "./access.service"

const FIELD_LIMITS: Record<FieldType, number> = {
  TEXT_SINGLE: 3,
  TEXT_MULTI: 3,
  NUMBER: 3,
  LINK: 3,
  BOOLEAN: 3,
}

export async function createField(params: {
  userId: string
  inventoryId: string
  type: FieldType
  title: string
  description?: string
  showInTable?: boolean
  required?: boolean 
}) {
  await canWriteInventory(params.userId, params.inventoryId)

  const count = await prisma.field.count({
    where: {
      inventoryId: params.inventoryId,
      type: params.type,
    },
  })

  const limit = FIELD_LIMITS[params.type]

  if (count >= limit) {
    throw {
      status: 400,
      message: `Maximum ${limit} fields allowed for ${params.type}`,
    }
  }

  const maxOrder = await prisma.field.aggregate({
    where: { inventoryId: params.inventoryId },
    _max: { order: true },
  })

  const nextOrder = (maxOrder._max.order ?? 0) + 1

  return prisma.field.create({
    data: {
      inventoryId: params.inventoryId,
      type: params.type,
      title: params.title,
      description: params.description ?? '',
      showInTable: params.showInTable ?? true,
      required: params.required ?? false,  
      order: nextOrder,
    },
  })
}

export async function listInventories(params: { userId: string | null; query?: string }) {
  const q = (params.query ?? '').trim()

  const inventoriesListInclude = {
    owner: { select: { id: true, name: true, email: true } },
    _count: { select: { items: true } },
    tags: { include: { tag: true } },
  } as const

  type InventoryListRow = Prisma.InventoryGetPayload<{
    include: typeof inventoriesListInclude
  }>

  const searchOr: Prisma.InventoryWhereInput =
    q.length > 0
      ? {
          OR: [
            { title: { contains: q, mode: Prisma.QueryMode.insensitive } },
            { description: { contains: q, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : {}

  const where: Prisma.InventoryWhereInput = params.userId
    ? {
        AND: [
          searchOr,
          {
            OR: [
              { isPublic: true },
              { ownerId: params.userId },
              { access: { some: { userId: params.userId } } },
            ],
          },
        ],
      }
    : q.length > 0
      ? {
          AND: [{ isPublic: true }, searchOr],
        }
      : { isPublic: true }

  const inventories: InventoryListRow[] = await prisma.inventory.findMany({
    take: 50,
    orderBy: { updatedAt: 'desc' },
    where,
    include: inventoriesListInclude,
  })

  return inventories.map((i) => ({
    id: i.id,
    title: i.title,
    category: i.category,
    itemsCount: i._count.items,
    ownerName: i.owner.name ?? i.owner.email,
    tags: i.tags.map((t) => t.tag.name),
    updatedAt: i.updatedAt.toISOString().slice(0, 10),
  }))
}

export async function getInventoryDetails(params: { userId: string | null; inventoryId: string }) {
  await canReadInventory(params.userId, params.inventoryId)

  const inv = await prisma.inventory.findUnique({
    where: { id: params.inventoryId },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      tags: { include: { tag: true } },
      fields: { orderBy: { order: 'asc' } },
      _count: { select: { items: true } },
    },
  })

  if (!inv) throw { status: 404, message: 'Inventory not found' }

  return {
    id: inv.id,
    title: inv.title,
    description: inv.description,
    category: inv.category,
    isPublic: inv.isPublic,
    version: inv.version,
    itemsCount: inv._count.items,
    owner: inv.owner,
    tags: inv.tags.map((t) => t.tag.name),
    fields: inv.fields,
    updatedAt: inv.updatedAt,
    customIdFormat: inv.customIdFormat,
    customIdSeq: inv.customIdSeq,
  }
}

export async function createInventory(params: {
  userId: string
  data: { title: string; category: string; description?: string; isPublic?: boolean }
}) {
  return prisma.inventory.create({
    data: {
      title: params.data.title,
      category: params.data.category, // in prisma schema category: String (not null)
      description: params.data.description ?? '',
      isPublic: params.data.isPublic ?? false,
      ownerId: params.userId,
    },
    select: { id: true, title: true, category: true, isPublic: true, version: true, updatedAt: true },
  })
}

export async function updateInventory(params: {
  userId: string
  inventoryId: string
  version: number
  patch: { title?: string; category?: string; description?: string; isPublic?: boolean }
}) {
  const inv = await canWriteInventory(params.userId, params.inventoryId)

  if (inv.version !== params.version) {
    throw { status: 409, message: 'Version conflict' }
  }

  return prisma.inventory.update({
    where: { id: params.inventoryId },
    data: {
      ...params.patch,
      version: { increment: 1 },
    },
    select: { id: true, title: true, category: true, isPublic: true, version: true, updatedAt: true },
  })
}

export async function bulkDeleteInventories(params: { userId: string; inventoryIds: string[] }) {
  const ids = Array.from(new Set(params.inventoryIds.map((x) => String(x).trim()).filter(Boolean)))

  if (ids.length === 0) return { ok: true, deletedCount: 0 }

  // 1) we check that all the inventory exists and get their ids.
  const inventories = await prisma.inventory.findMany({
    where: { id: { in: ids } },
    select: { id: true },
  })

  if (inventories.length !== ids.length) {
    throw { status: 404, message: 'Some inventories not found' }
  }

  // 2) rights verification ( canWriteInventory)
  for (const inventoryId of ids) {
    await canWriteInventory(params.userId, inventoryId)
  }

  // 3) one deletion
  const deleted = await prisma.inventory.deleteMany({
    where: { id: { in: ids } },
  })

  return { ok: true, deletedCount: deleted.count }
}
export async function deleteInventory(params: { userId: string; inventoryId: string }) {
  await canWriteInventory(params.userId, params.inventoryId)

  await prisma.inventory.delete({ where: { id: params.inventoryId } })
  return { ok: true }
}

export async function deleteField(params: { userId: string; inventoryId: string; fieldId: string }) {
  await canWriteInventory(params.userId, params.inventoryId)

  const field = await prisma.field.findUnique({
    where: { id: params.fieldId },
    select: { id: true, inventoryId: true },
  })
  if (!field) throw { status: 404, message: 'Field not found' }
  if (field.inventoryId !== params.inventoryId) throw { status: 400, message: 'Field does not belong to this inventory' }

  await prisma.field.delete({ where: { id: params.fieldId } })
  return { ok: true }
}

export async function reorderFields(params: { userId: string; inventoryId: string; orderedIds: string[] }) {
  await canWriteInventory(params.userId, params.inventoryId)

  // let's check that all fieldids belong to inventory
  const fields = await prisma.field.findMany({
    where: { inventoryId: params.inventoryId },
    select: { id: true },
  })
  const set = new Set(fields.map((f) => f.id))
  for (const id of params.orderedIds) {
    if (!set.has(id)) throw { status: 400, message: 'Invalid field id in reorder list' }
  }

  // transaction: order 1..N
  await prisma.$transaction(
    params.orderedIds.map((id, idx) =>
      prisma.field.update({
        where: { id },
        data: { order: idx + 1 },
      }),
    ),
  )

  return { ok: true }
}
export async function updateCustomIdSettings(params: {
  userId: string
  inventoryId: string
  version: number
  patch: { customIdPrefix?: string }
}) {
  const inv = await canWriteInventory(params.userId, params.inventoryId)

  if (inv.version !== params.version) throw { status: 409, message: 'Version conflict' }

  const prefix = params.patch.customIdPrefix?.trim()
  if (prefix !== undefined) {
    if (!/^[A-Z0-9-]{1,12}$/.test(prefix)) {
      throw { status: 400, message: 'customIdPrefix must be A-Z, 0-9, dash, max 12 chars' }
    }
  }

  return prisma.inventory.update({
    where: { id: params.inventoryId },
    data: {
      ...(prefix !== undefined ? { customIdPrefix: prefix } : {}),
      version: { increment: 1 },
    },
    select: { id: true, customIdPrefix: true, customIdSeq: true, version: true },
  })
}

export function previewCustomId(prefix: string, seq: number) {
  const padded = String(seq).padStart(4, '0')
  const rnd = String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0')
  return `${prefix}-${padded}-${rnd}`
}

export async function getInventoryAccess(params: {
  userId: string
  inventoryId: string
}) {
  await canWriteInventory(params.userId, params.inventoryId)

  const inventory = await prisma.inventory.findUnique({
    where: { id: params.inventoryId },
    select: {
      id: true,
      isPublic: true,
      access: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          user: { email: 'asc' },
        },
      },
    },
  })

  if (!inventory) {
    throw { status: 404, message: 'Inventory not found' }
  }

  return {
    isPublic: inventory.isPublic,
    users: inventory.access.map((a) => ({
      id: a.user.id,
      name: a.user.name ?? a.user.email,
      email: a.user.email,
      canWrite: a.canWrite,
    })),
  }
}

export async function updateInventoryAccessVisibility(params: {
  userId: string
  inventoryId: string
  isPublic: boolean
}) {
  await canWriteInventory(params.userId, params.inventoryId)

  const updated = await prisma.inventory.update({
    where: { id: params.inventoryId },
    data: { isPublic: params.isPublic },
    select: { id: true, isPublic: true },
  })

  return updated
}

export async function addInventoryAccess(params: {
  userId: string
  inventoryId: string
  email: string
}) {
  const inventory = await canWriteInventory(params.userId, params.inventoryId)

  const email = params.email.trim().toLowerCase()
  if (!email) {
    throw { status: 400, message: 'Email is required' }
  }

  const targetUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true },
  })

  if (!targetUser) {
    throw { status: 404, message: 'User not found' }
  }

  if (targetUser.id === inventory.ownerId) {
    throw { status: 400, message: 'Owner already has access' }
  }

  await prisma.inventoryAccess.upsert({
    where: {
      inventoryId_userId: {
        inventoryId: params.inventoryId,
        userId: targetUser.id,
      },
    },
    update: {
      canWrite: true,
    },
    create: {
      inventoryId: params.inventoryId,
      userId: targetUser.id,
      canWrite: true,
    },
  })

  return {
    id: targetUser.id,
    name: targetUser.name ?? targetUser.email,
    email: targetUser.email,
    canWrite: true,
  }
}

export async function removeInventoryAccess(params: {
  userId: string
  inventoryId: string
  targetUserId: string
}) {
  const inventory = await canWriteInventory(params.userId, params.inventoryId)

  if (inventory.ownerId === params.targetUserId) {
    throw { status: 400, message: 'Cannot remove owner access' }
  }

  await prisma.inventoryAccess.delete({
    where: {
      inventoryId_userId: {
        inventoryId: params.inventoryId,
        userId: params.targetUserId,
      },
    },
  })

  return { ok: true }
}


export async function updateInventoryCustomId(params: {
  userId: string
  inventoryId: string
  version: number
  customIdPrefix: string
}) {
  const inv = await canWriteInventory(params.userId, params.inventoryId)

  if (inv.version !== params.version) {
    throw { status: 409, message: 'Version conflict' }
  }

  const prefix = params.customIdPrefix.trim().toUpperCase()
  if (!prefix) throw { status: 400, message: 'customIdPrefix is required' }
  if (!/^[A-Z0-9-]+$/.test(prefix)) {
    throw { status: 400, message: 'customIdPrefix must match /^[A-Z0-9-]+$/' }
  }

  return prisma.inventory.update({
    where: { id: params.inventoryId },
    data: {
      customIdPrefix: prefix,
      version: { increment: 1 },
    },
    select: { id: true, customIdPrefix: true, version: true, updatedAt: true },
  })
}