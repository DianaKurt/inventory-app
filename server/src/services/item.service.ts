// server/services/item.service.ts
import { prisma } from '../db'
import { canReadInventory, canWriteInventory } from './access.service'


export async function getItemDetails(params: { userId: string | null; itemId: string }) {
  const item = await prisma.item.findUnique({
    where: { id: params.itemId },
    include: {
      inventory: {
        select: {
          id: true,
          ownerId: true,
          isPublic: true,
          access: params.userId ? { where: { userId: params.userId } } : false,
          fields: { orderBy: { order: 'asc' } },
        },
      },
      fields: true, // ItemFieldValue[]
    },
  })

  if (!item) throw { status: 404, message: 'Item not found' }
//local
  const canRead =
    item.inventory.isPublic ||
    (params.userId && item.inventory.ownerId === params.userId) ||
    (params.userId && Array.isArray(item.inventory.access) && item.inventory.access.length > 0)

  if (!canRead) throw { status: 403, message: 'Forbidden' }

  const valuesByFieldId: Record<
    string,
    { textValue: string | null; numberValue: number | null; boolValue: boolean | null; linkValue: string | null }
  > = {}

  // values that are actually in the database
  for (const v of item.fields) {
    valuesByFieldId[v.fieldId] = {
      textValue: v.textValue ?? null,
      numberValue: v.numberValue ?? null,
      boolValue: v.boolValue ?? null,
      linkValue: v.linkValue ?? null,
    }
  }

  // so that the UI always sees the keys of all fields
  for (const f of item.inventory.fields) {
    if (!valuesByFieldId[f.id]) {
      valuesByFieldId[f.id] = { textValue: null, numberValue: null, boolValue: null, linkValue: null }
    }
  }

  return {
    item: {
      id: item.id,
      inventoryId: item.inventoryId,
      customId: item.customId,
      version: item.version,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    },
    fields: item.inventory.fields.map((f) => ({
      id: f.id,
      title: f.title,
      description: f.description,
      type: f.type,
      order: f.order,
      showInTable: f.showInTable,
    })),
    valuesByFieldId,
  }
}

export async function listItems(params: {
  userId: string | null
  inventoryId: string
}) {
  const { userId, inventoryId } = params

  await canReadInventory(userId, inventoryId)

  const items = await prisma.item.findMany({
    where: { inventoryId },
    orderBy: { createdAt: 'desc' },
    include: {
      fields: {
        include: {
          field: true,
        },
      },
    },
  })

  return items.map((item) => {
    const values: Record<string, any> = {}

    for (const fv of item.fields) {
      const key = fv.field.title

      if (fv.textValue !== null) values[key] = fv.textValue
      else if (fv.numberValue !== null) values[key] = fv.numberValue
      else if (fv.boolValue !== null) values[key] = fv.boolValue
      else if (fv.linkValue !== null) values[key] = fv.linkValue
      else values[key] = null
    }

    return {
      id: item.id,
      customId: item.customId,
      version: item.version,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      values,
    }
  })
}

export async function updateItem(params: {
  userId: string
  itemId: string
  version: number
  patch: { customId?: string }
}) {
  const item = await prisma.item.findUnique({
    where: { id: params.itemId },
    select: { id: true, inventoryId: true, customId: true, version: true },
  })
  if (!item) throw { status: 404, message: 'Item not found' }

  await canWriteInventory(params.userId, item.inventoryId)

  if (item.version !== params.version) throw { status: 409, message: 'Version conflict' }

  const customId = params.patch.customId?.trim()

  try {
    return await prisma.item.update({
      where: { id: params.itemId },
      data: {
        ...(customId !== undefined ? { customId } : {}),
        version: { increment: 1 },
      },
      select: { id: true, inventoryId: true, customId: true, version: true, updatedAt: true },
    })
  } catch (e: any) {
    if (e?.code === 'P2002') throw { status: 400, message: 'customId must be unique inside inventory' }
    throw e
  }
}



export async function bulkDeleteItems(params: { userId: string; itemIds: string[] }) {
  // 1) inventoryId for all item
  const items = await prisma.item.findMany({
    where: { id: { in: params.itemIds } },
    select: { id: true, inventoryId: true },
  })

  if (items.length === 0) {
    return { ok: true, deletedCount: 0 }
  }

  // 2) if id not  — 404
  if (items.length !== params.itemIds.length) {
    throw { status: 404, message: 'Some items not found' }
  }

  // 3) check write 
  const uniqueInventoryIds = Array.from(new Set(items.map((x) => x.inventoryId)))
  for (const inventoryId of uniqueInventoryIds) {
    await canWriteInventory(params.userId, inventoryId)
  }

  // 4) delete all
  const deleted = await prisma.item.deleteMany({
    where: { id: { in: params.itemIds } },
  })

  return { ok: true, deletedCount: deleted.count }
}


export async function deleteItem(params: { userId: string; itemId: string }) {
  const item = await prisma.item.findUnique({
    where: { id: params.itemId },
    select: { id: true, inventoryId: true },
  })
  if (!item) throw { status: 404, message: 'Item not found' }

  await canWriteInventory(params.userId, item.inventoryId)

  await prisma.item.delete({ where: { id: params.itemId } })
  return { ok: true }
}


export async function setItemFieldValue(params: { userId: string; itemId: string; fieldId: string; value: any }) {
  const item = await prisma.item.findUnique({
    where: { id: params.itemId },
    select: { id: true, inventoryId: true },
  })
  if (!item) throw { status: 404, message: 'Item not found' }

  await canWriteInventory(params.userId, item.inventoryId)

  const field = await prisma.field.findUnique({
    where: { id: params.fieldId },
    select: { id: true, type: true, inventoryId: true },
  })
  if (!field || field.inventoryId !== item.inventoryId) throw { status: 400, message: 'Invalid fieldId' }

  const patch: any = { textValue: null, numberValue: null, boolValue: null, linkValue: null }

  switch (field.type) {
    case 'TEXT_SINGLE':
    case 'TEXT_MULTI':
      patch.textValue = params.value == null ? null : String(params.value)
      break
    case 'NUMBER': {
      const v = params.value
      patch.numberValue = v === '' || v === null || v === undefined ? null : Number(v)
      if (patch.numberValue !== null && !Number.isFinite(patch.numberValue)) throw { status: 400, message: 'Invalid number' }
      break
    }
    case 'LINK':
      patch.linkValue = params.value === null || params.value === undefined ? '' : String(params.value)
      break
    case 'BOOLEAN':
      patch.boolValue = Boolean(params.value)
      break
  }

  return prisma.itemFieldValue.upsert({
    where: { itemId_fieldId: { itemId: params.itemId, fieldId: params.fieldId } },
    create: { itemId: params.itemId, fieldId: params.fieldId, ...patch },
    update: patch,
  })

}



export async function createItem(params: { userId: string; inventoryId: string; customId?: string }) {
  await canWriteInventory(params.userId, params.inventoryId)

  const manual = params.customId?.trim()
  if (manual) {
    try {
      return await prisma.item.create({
        data: { inventoryId: params.inventoryId, customId: manual, createdById: params.userId },
        select: { id: true, inventoryId: true, customId: true, version: true, createdAt: true, updatedAt: true },
      })
    } catch (e: any) {
      if (e?.code === 'P2002') throw { status: 400, message: 'customId must be unique inside inventory' }
      throw e
    }
  }

  // auto: prefix + seq(4) + random(6)
  try {
    return await prisma.$transaction(async (tx) => {
      const inv = await tx.inventory.update({
        where: { id: params.inventoryId },
        data: { customIdSeq: { increment: 1 } },
        select: { customIdPrefix: true, customIdSeq: true },
      })

      const padded = String(inv.customIdSeq).padStart(4, '0')
      const rnd = String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0')
      const generated = `${inv.customIdPrefix}-${padded}-${rnd}`

      return tx.item.create({
        data: { inventoryId: params.inventoryId, customId: generated, createdById: params.userId },
        select: { id: true, inventoryId: true, customId: true, version: true, createdAt: true, updatedAt: true },
      })
    })
  } catch (e: any) {
    if (e?.code === 'P2002') throw { status: 400, message: 'customId must be unique inside inventory' }
    throw e
  }
}


export async function getItemLikes(params: {
  userId: string | null
  itemId: string
}) {
  const item = await prisma.item.findUnique({
    where: { id: params.itemId },
    select: {
      id: true,
      inventoryId: true,
      _count: { select: { likes: true } },
    },
  })

  if (!item) {
    throw { status: 404, message: 'Item not found' }
  }

  await canReadInventory(params.userId, item.inventoryId)

  let likedByMe = false

  if (params.userId) {
    const like = await prisma.like.findUnique({
      where: {
        itemId_userId: {
          itemId: params.itemId,
          userId: params.userId,
        },
      },
      select: { itemId: true },
    })

    likedByMe = Boolean(like)
  }

  return {
    itemId: item.id,
    count: item._count.likes,
    likedByMe,
  }
}

export async function toggleItemLike(params: {
  userId: string
  itemId: string
}) {
  const item = await prisma.item.findUnique({
    where: { id: params.itemId },
    select: {
      id: true,
      inventoryId: true,
    },
  })

  if (!item) {
    throw { status: 404, message: 'Item not found' }
  }

  await canReadInventory(params.userId, item.inventoryId)

  const existing = await prisma.like.findUnique({
    where: {
      itemId_userId: {
        itemId: params.itemId,
        userId: params.userId,
      },
    },
    select: { itemId: true },
  })

  if (existing) {
    await prisma.like.delete({
      where: {
        itemId_userId: {
          itemId: params.itemId,
          userId: params.userId,
        },
      },
    })
  } else {
    await prisma.like.create({
      data: {
        itemId: params.itemId,
        userId: params.userId,
      },
    })
  }

  const count = await prisma.like.count({
    where: { itemId: params.itemId },
  })

  return {
    itemId: params.itemId,
    count,
    likedByMe: !existing,
  }
}