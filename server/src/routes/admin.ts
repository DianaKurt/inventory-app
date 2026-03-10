import { Router } from 'express'
import { prisma } from '../db'
import { authMiddleware } from '../middleware/auth.middleware'

export const adminRouter = Router()

type ApiError = { status: number; message: string; details?: unknown }

function badRequest(message: string, details?: unknown): ApiError {
  return { status: 400, message, details }
}

function forbidden(message = 'Forbidden'): ApiError {
  return { status: 403, message }
}

function notFound(message = 'Not found'): ApiError {
  return { status: 404, message }
}

/**
admin or not?
 */
async function requireAdmin(req: any): Promise<{ adminId: string }> {
  const adminId = req.session?.userId
  if (!adminId) throw { status: 401, message: 'Unauthorized' }

  const user = await prisma.user.findUnique({
    where: { id: adminId },
    select: { role: true, blocked: true },
  })

  if (!user) throw { status: 401, message: 'Unauthorized' }
  if (user.blocked) throw { status: 403, message: 'User is blocked' }
  if (user.role !== 'ADMIN') throw forbidden()

  return { adminId }
}

/**
stats
 */

// GET /api/admin/stats
adminRouter.get('/stats', authMiddleware, async (req, res, next) => {
  try {
    await requireAdmin(req)

    const [usersCount, adminsCount, inventoriesCount, itemsCount, tagsCount] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: 'ADMIN' } }),
        prisma.inventory.count(),
        prisma.item.count(),
        prisma.tag.count(),
      ])

    res.json({ usersCount, adminsCount, inventoriesCount, itemsCount, tagsCount })
  } catch (e) {
    next(e)
  }
})

/**
 * USERS MANAGEMENT
 */

// GET /api/admin/users?query=&take=50&skip=0&sortBy=createdAt&sortDir=desc
adminRouter.get('/users', authMiddleware, async (req, res, next) => {
  try {
    await requireAdmin(req)

    const query = typeof req.query.query === 'string' ? req.query.query.trim() : ''
    const takeRaw = typeof req.query.take === 'string' ? Number(req.query.take) : 50
    const skipRaw = typeof req.query.skip === 'string' ? Number(req.query.skip) : 0

    const take = Number.isFinite(takeRaw) ? Math.min(Math.max(takeRaw, 1), 200) : 50
    const skip = Number.isFinite(skipRaw) ? Math.max(skipRaw, 0) : 0

    const sortBy = typeof req.query.sortBy === 'string' ? req.query.sortBy : 'createdAt'
    const sortDir = typeof req.query.sortDir === 'string' ? req.query.sortDir : 'desc'

    const allowedSortBy = new Set(['createdAt', 'email', 'name', 'role', 'blocked'])
    const allowedSortDir = new Set(['asc', 'desc'])

    const orderByField = allowedSortBy.has(sortBy) ? sortBy : 'createdAt'
    const orderByDir = allowedSortDir.has(sortDir) ? sortDir : 'desc'

    const where =
      query.length > 0
        ? {
            OR: [
              { email: { contains: query, mode: 'insensitive' as const } },
              { name: { contains: query, mode: 'insensitive' as const } },
            ],
          }
        : {}

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        take,
        skip,
        orderBy:
          orderByField === 'name'
            ? { name: orderByDir as any }
            : orderByField === 'email'
              ? { email: orderByDir as any }
              : orderByField === 'role'
                ? { role: orderByDir as any }
                : orderByField === 'blocked'
                  ? { blocked: orderByDir as any }
                  : { createdAt: orderByDir as any },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          blocked: true,
          createdAt: true,
          _count: {
            select: {
              inventoriesOwned: true,
              itemsCreated: true,
              posts: true,
              likes: true,
            },
          },
        },
      }),
    ])

    res.json({
      total,
      take,
      skip,
      items: users.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        blocked: u.blocked,
        createdAt: u.createdAt,
        counts: u._count,
      })),
    })
  } catch (e) {
    next(e)
  }
})

// GET /api/admin/users/:id
adminRouter.get('/users/:id', authMiddleware, async (req, res, next) => {
  try {
    await requireAdmin(req)

    const id = String(req.params.id)
    if (!id) throw badRequest('id is required')

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        blocked: true,
        createdAt: true,
        _count: {
          select: {
            inventoriesOwned: true,
            itemsCreated: true,
            posts: true,
            likes: true,
          },
        },
      },
    })

    if (!user) throw notFound('User not found')

    res.json({
      ...user,
      counts: user._count,
    })
  } catch (e) {
    next(e)
  }
})

/**
 * PATCH /api/admin/users/:id
 * body: { blocked?: boolean, role?: "USER"|"ADMIN", name?: string|null }
 *
 /block /unblock /make-admin /remove-admin.
 */
adminRouter.patch('/users/:id', authMiddleware, async (req, res, next) => {
  try {
    const { adminId } = await requireAdmin(req)

    const id = String(req.params.id)
    if (!id) throw badRequest('id is required')

    const patch: any = {}

    if (req.body?.blocked !== undefined) {
      patch.blocked = Boolean(req.body.blocked)
    }

    if (req.body?.role !== undefined) {
      const role = String(req.body.role)
      if (role !== 'USER' && role !== 'ADMIN') {
        throw badRequest('role must be USER or ADMIN')
      }
      patch.role = role
    }

    if (req.body?.name !== undefined) {
      const raw = req.body.name
      if (raw === null) patch.name = null
      else patch.name = String(raw).trim() || null
    }

    if (Object.keys(patch).length === 0) {
      throw badRequest('No fields to update')
    }

    const exists = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    })
    if (!exists) throw notFound('User not found')

    const updated = await prisma.user.update({
      where: { id },
      data: patch,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        blocked: true,
        createdAt: true,
      },
    })

    res.json({ ok: true, updated, performedBy: adminId })
  } catch (e) {
    next(e)
  }
})

// PATCH /api/admin/users/:id/block
adminRouter.patch('/users/:id/block', authMiddleware, async (req, res, next) => {
  try {
    await requireAdmin(req)

    const id = String(req.params.id)
    if (!id) throw badRequest('id is required')

    const user = await prisma.user.findUnique({ where: { id }, select: { id: true } })
    if (!user) throw notFound('User not found')

    const updated = await prisma.user.update({
      where: { id },
      data: { blocked: true },
      select: { id: true, email: true, name: true, role: true, blocked: true },
    })

    res.json({ ok: true, user: updated })
  } catch (e) {
    next(e)
  }
})

// PATCH /api/admin/users/:id/unblock
adminRouter.patch('/users/:id/unblock', authMiddleware, async (req, res, next) => {
  try {
    await requireAdmin(req)

    const id = String(req.params.id)
    if (!id) throw badRequest('id is required')

    const user = await prisma.user.findUnique({ where: { id }, select: { id: true } })
    if (!user) throw notFound('User not found')

    const updated = await prisma.user.update({
      where: { id },
      data: { blocked: false },
      select: { id: true, email: true, name: true, role: true, blocked: true },
    })

    res.json({ ok: true, user: updated })
  } catch (e) {
    next(e)
  }
})

// PATCH /api/admin/users/:id/make-admin
adminRouter.patch('/users/:id/make-admin', authMiddleware, async (req, res, next) => {
  try {
    await requireAdmin(req)

    const id = String(req.params.id)
    if (!id) throw badRequest('id is required')

    const user = await prisma.user.findUnique({ where: { id }, select: { id: true } })
    if (!user) throw notFound('User not found')

    const updated = await prisma.user.update({
      where: { id },
      data: { role: 'ADMIN' },
      select: { id: true, email: true, name: true, role: true, blocked: true },
    })

    res.json({ ok: true, user: updated })
  } catch (e) {
    next(e)
  }
})

// PATCH /api/admin/users/:id/remove-admin
adminRouter.patch('/users/:id/remove-admin', authMiddleware, async (req, res, next) => {
  try {
    await requireAdmin(req)

    const id = String(req.params.id)
    if (!id) throw badRequest('id is required')

    const user = await prisma.user.findUnique({ where: { id }, select: { id: true } })
    if (!user) throw notFound('User not found')

    const updated = await prisma.user.update({
      where: { id },
      data: { role: 'USER' },
      select: { id: true, email: true, name: true, role: true, blocked: true },
    })

    res.json({ ok: true, user: updated })
  } catch (e) {
    next(e)
  }
})

adminRouter.delete('/users/:id', authMiddleware, async (req, res, next) => {
  try {
    await requireAdmin(req)

    const id = String(req.params.id)
    if (!id) throw badRequest('id is required')

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        _count: {
          select: {
            inventoriesOwned: true,
          },
        },
      },
    })

    if (!user) throw notFound('User not found')

    if (user._count.inventoriesOwned > 0) {
      throw {
        status: 409,
        message: 'Cannot delete user who owns inventories. Transfer or delete inventories first.',
        details: { inventoriesOwned: user._count.inventoriesOwned },
      }
    }

    await prisma.$transaction([
      prisma.like.deleteMany({ where: { userId: id } }),
      prisma.post.deleteMany({ where: { userId: id } }),
      prisma.inventoryAccess.deleteMany({ where: { userId: id } }),
    ])

    const createdItemsCount = await prisma.item.count({ where: { createdById: id } })
    if (createdItemsCount > 0) {
      throw {
        status: 409,
        message: 'Cannot delete user who created items. Delete items or reassign createdBy first.',
        details: { itemsCreated: createdItemsCount },
      }
    }

    await prisma.user.delete({ where: { id } })

    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
})