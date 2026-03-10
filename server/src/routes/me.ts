import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import { prisma } from '../db'

export const meRouter = Router()

// GET /api/me/inventories/owned
meRouter.get('/inventories/owned', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.session.userId!

    const inventories = await prisma.inventory.findMany({
      where: { ownerId: userId },
      take: 50,
      orderBy: { updatedAt: 'desc' },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { items: true } },
        tags: { include: { tag: true } },
      },
    })

    res.json(
      inventories.map((i) => ({
        id: i.id,
        title: i.title,
        category: i.category,
        itemsCount: i._count.items,
        ownerName: i.owner.name ?? i.owner.email,
        tags: i.tags.map((t) => t.tag.name),
        updatedAt: i.updatedAt.toISOString().slice(0, 10),
      })),
    )
  } catch (e) {
    next(e)
  }
})

// GET /api/me/inventories/write-access
meRouter.get('/inventories/write-access', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.session.userId!

    const inventories = await prisma.inventory.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { access: { some: { userId, canWrite: true } } },
        ],
      },
      take: 50,
      orderBy: { updatedAt: 'desc' },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { items: true } },
        tags: { include: { tag: true } },
      },
    })

    res.json(
      inventories.map((i) => ({
        id: i.id,
        title: i.title,
        category: i.category,
        itemsCount: i._count.items,
        ownerName: i.owner.name ?? i.owner.email,
        tags: i.tags.map((t) => t.tag.name),
        updatedAt: i.updatedAt.toISOString().slice(0, 10),
      })),
    )
  } catch (e) {
    next(e)
  }
})