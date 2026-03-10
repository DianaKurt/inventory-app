import { Router } from 'express'
import { prisma } from '../db'

export const searchRouter = Router()

searchRouter.get('/', async (req, res) => {
  const q = String(req.query.q ?? '').trim()
  const type = String(req.query.type ?? 'all') // all | inventories | items
  const category = String(req.query.category ?? '').trim()
  const sort = String(req.query.sort ?? 'updated') // updated | created | title

  if (!q) {
    return res.json({ inventories: [], items: [], tags: [] })
  }

  // sort mapping
  const inventoryOrderBy =
    sort === 'title'
      ? ({ title: 'asc' } as const)
      : sort === 'created'
        ? ({ createdAt: 'desc' } as const)
        : ({ updatedAt: 'desc' } as const)

  const itemOrderBy =
    sort === 'title'
      ? ({ customId: 'asc' } as const) // for items "title" no, then sort  customId
      : sort === 'created'
        ? ({ createdAt: 'desc' } as const)
        : ({ updatedAt: 'desc' } as const)

  const inventoriesPromise =
    type === 'items'
      ? Promise.resolve([])
      : prisma.inventory.findMany({
          where: {
            ...(category ? { category: { equals: category } } : {}),
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
              { category: { contains: q, mode: 'insensitive' } },
              { tags: { some: { tag: { name: { contains: q, mode: 'insensitive' } } } } },
            ],
          },
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            isPublic: true,
            createdAt: true,
            updatedAt: true,
            owner: { select: { name: true, email: true } },
            tags: { select: { tag: { select: { name: true } } } },
          },
          orderBy: inventoryOrderBy,
          take: 50,
        })

  const itemsPromise =
    type === 'inventories'
      ? Promise.resolve([])
      : prisma.item.findMany({
          where: {
            OR: [
              { customId: { contains: q, mode: 'insensitive' } },
              { inventory: { title: { contains: q, mode: 'insensitive' } } },
              { inventory: { description: { contains: q, mode: 'insensitive' } } },
              { fields: { some: { textValue: { contains: q, mode: 'insensitive' } } } },
            ],
          },
          select: {
            id: true,
            inventoryId: true,
            customId: true,
            createdAt: true,
            updatedAt: true,
            inventory: { select: { id: true, title: true } },
          },
          orderBy: itemOrderBy,
          take: 50,
        })

  const tagsPromise = prisma.tag.findMany({
    where: { name: { contains: q, mode: 'insensitive' } },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
    take: 20,
  })

  const [inventories, items, tags] = await Promise.all([
    inventoriesPromise,
    itemsPromise,
    tagsPromise,
  ])

  const inventoriesDto = inventories.map((inv) => ({
    id: inv.id,
    title: inv.title,
    description: inv.description,
    category: inv.category,
    isPublic: inv.isPublic,
    createdAt: inv.createdAt,
    updatedAt: inv.updatedAt,
    ownerName: inv.owner.name ?? inv.owner.email,
    tags: inv.tags.map((t) => t.tag.name),
  }))

  return res.json({ inventories: inventoriesDto, items, tags })
})