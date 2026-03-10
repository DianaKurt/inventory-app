import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import {
  createInventory,
  deleteInventory,
  getInventoryDetails,
  listInventories,
  updateInventory,
  createField, 
  deleteField, 
  reorderFields,
  bulkDeleteInventories
} from '../services/inventory.service'
import { createPost, listPosts } from '../services/post.service'
import {
  getInventoryAccess,
  updateInventoryAccessVisibility,
  addInventoryAccess,
  removeInventoryAccess
} from '../services/inventory.service'
import { updateCustomIdSettings, previewCustomId, updateInventoryCustomId } from '../services/inventory.service'



export const inventoriesRouter = Router()

// GET /api/inventories?query=...
// public:(show public), logged in: public + owned + shared
inventoriesRouter.get('/', async (req, res, next) => {
  try {
    const query = req.query.query ? String(req.query.query) : undefined
    const userId = req.session?.userId ?? null

    const data = await listInventories({ userId, query })
    res.json(data)
  } catch (e) {
    next(e)
  }
})
// POST /api/inventories/bulk-delete
// body: { ids: string[] }
inventoriesRouter.post('/bulk-delete', authMiddleware, async (req, res, next) => {
  try {
    const ids = req.body?.ids
    if (!Array.isArray(ids) || ids.length === 0) {
      throw { status: 400, message: 'ids must be a non-empty array' }
    }

    const inventoryIds = ids.map((x) => String(x).trim()).filter(Boolean)
    if (inventoryIds.length === 0) throw { status: 400, message: 'ids must be non-empty strings' }

    const out = await bulkDeleteInventories({
      userId: req.session.userId!,
      inventoryIds,
    })

    res.json(out)
  } catch (e) {
    next(e)
  }
})

// GET /api/inventories/:id
inventoriesRouter.get('/:id', async (req, res, next) => {
  try {
    const userId = req.session?.userId ?? null
    const inventoryId = String(req.params.id)

    const inv = await getInventoryDetails({ userId, inventoryId })
    res.json(inv)
  } catch (e) {
    next(e)
  }
})

// POST /api/inventories
inventoriesRouter.post('/', authMiddleware, async (req, res, next) => {
  try {
    const title = String(req.body?.title ?? '').trim()
    const category = String(req.body?.category ?? '').trim()
    const description = req.body?.description === undefined ? undefined : String(req.body.description)
    const isPublic = req.body?.isPublic === undefined ? undefined : Boolean(req.body.isPublic)

    if (!title) throw { status: 400, message: 'title is required' }
    if (!category) throw { status: 400, message: 'category is required' }

    const inv = await createInventory({
      userId: req.session.userId!,
      data: { title, category, description, isPublic },
    })

    res.status(201).json(inv)
  } catch (e) {
    next(e)
  }
})

// PATCH /api/inventories/:id
// body: { version, title?, category?, description?, isPublic? }
inventoriesRouter.patch('/:id', authMiddleware, async (req, res, next) => {
  try {
    const inventoryId = String(req.params.id)
    const versionRaw = req.body?.version
    if (versionRaw === undefined || versionRaw === null) throw { status: 400, message: 'version is required' }

    const version = Number(versionRaw)
    if (!Number.isFinite(version)) throw { status: 400, message: 'version must be a number' }

    const patch: {
      title?: string
      category?: string
      description?: string
      isPublic?: boolean
    } = {}

    if (req.body?.title !== undefined) patch.title = String(req.body.title)
    if (req.body?.category !== undefined) patch.category = String(req.body.category)
    if (req.body?.description !== undefined) patch.description = String(req.body.description)
    if (req.body?.isPublic !== undefined) patch.isPublic = Boolean(req.body.isPublic)

    const out = await updateInventory({
      userId: req.session.userId!,
      inventoryId,
      version,
      patch,
    })

    res.json(out)
  } catch (e) {
    next(e)
  }
})


// DELETE /api/inventories/:id/fields/:fieldId
inventoriesRouter.delete('/:id/fields/:fieldId', authMiddleware, async (req, res, next) => {
  try {
    const inventoryId = String(req.params.id)
    const fieldId = String(req.params.fieldId)

    const out = await deleteField({
      userId: req.session.userId!,
      inventoryId,
      fieldId, })
    res.json(out)
  } catch (e) {
    next(e)
  }
})

// DELETE /api/inventories/:id
inventoriesRouter.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const inventoryId = String(req.params.id)
    const out = await deleteInventory({ userId: req.session.userId!, inventoryId })
    res.json(out)
  } catch (e) {
    next(e)
  }
})
// POST /api/inventories/:id/fields
inventoriesRouter.post('/:id/fields', authMiddleware, async (req, res, next) => {
  try {
    const inventoryId = req.params.id

    const field = await createField({
      userId: req.session.userId!,
      inventoryId,
      type: req.body.type,
      title: req.body.title,
      description: req.body.description,
      showInTable: req.body.showInTable,
      required: req.body.required,
    })

    res.status(201).json(field)
  } catch (e) {
    next(e)
  }
})

// PATCH /api/inventories/:id/fields/reorder
// body: { orderedIds: string[] }
inventoriesRouter.patch('/:id/fields/reorder', authMiddleware, async (req, res, next) => {
  try {
    const inventoryId = req.params.id
    const orderedIds = req.body?.orderedIds
    if (!Array.isArray(orderedIds) || orderedIds.some((x) => typeof x !== 'string')) {
      throw { status: 400, message: 'orderedIds must be string[]' }
    }

    const out = await reorderFields({
      userId: req.session.userId!,
      inventoryId,
      orderedIds,
    })

    res.json(out)
  } catch (e) {
    next(e)
  }
})

// PATCH /api/inventories/:id/custom-id
// body: { version, customIdPrefix }
inventoriesRouter.patch('/:id/custom-id', authMiddleware, async (req, res, next) => {
  try {
    const inventoryId = String(req.params.id)
    const version = Number(req.body?.version)
    if (!Number.isFinite(version)) throw { status: 400, message: 'version is required' }

    const customIdPrefix = String(req.body?.customIdPrefix ?? '')

    const out = await updateInventoryCustomId({
      userId: req.session.userId!,
      inventoryId,
      version,
      customIdPrefix,
    })

    res.json(out)
  } catch (e) {
    next(e)
  }
})

// GET /api/inventories/:id/posts
inventoriesRouter.get('/:id/posts', async (req, res, next) => {
  try {
    const userId = req.session?.userId ?? null
    const inventoryId = String(req.params.id)

    const out = await listPosts({ userId, inventoryId })
    res.json(out)
  } catch (e) {
    next(e)
  }
})

// POST /api/inventories/:id/posts
inventoriesRouter.post('/:id/posts', authMiddleware, async (req, res, next) => {
  try {
    const inventoryId = String(req.params.id)
    const bodyMd = String(req.body?.bodyMd ?? '')

    const out = await createPost({
      userId: req.session.userId!,
      inventoryId,
      bodyMd,
    })

    res.status(201).json(out)
  } catch (e) {
    next(e)
  }
})

// GET /api/inventories/:id/custom-id/preview
inventoriesRouter.get('/:id/custom-id/preview', authMiddleware, async (req, res, next) => {
  try {
    const inventoryId = String(req.params.id)
    const userId = req.session.userId!

    const inv = await getInventoryDetails({ userId, inventoryId }) // или отдельный prisma.inventory.findUnique
    const prefix = (inv as any).customIdPrefix ?? 'INV'
    const seq = (inv as any).customIdSeq ?? 0

    res.json({ example: previewCustomId(prefix, seq + 1) })
  } catch (e) {
    next(e)
  }
})

// GET /api/inventories/:id/access
inventoriesRouter.get('/:id/access', authMiddleware, async (req, res, next) => {
  try {
    const inventoryId = String(req.params.id)

    const out = await getInventoryAccess({
      userId: req.session.userId!,
      inventoryId,
    })

    res.json(out)
  } catch (e) {
    next(e)
  }
})


// PATCH /api/inventories/:id/access/visibility
inventoriesRouter.patch('/:id/access/visibility', authMiddleware, async (req, res, next) => {
  try {
    const inventoryId = String(req.params.id)
    const isPublic = Boolean(req.body?.isPublic)

    const out = await updateInventoryAccessVisibility({
      userId: req.session.userId!,
      inventoryId,
      isPublic,
    })

    res.json(out)
  } catch (e) {
    next(e)
  }
})

// POST /api/inventories/:id/access
inventoriesRouter.post('/:id/access', authMiddleware, async (req, res, next) => {
  try {
    const inventoryId = String(req.params.id)
    const email = String(req.body?.email ?? '').trim()

    if (!email) {
      throw { status: 400, message: 'email is required' }
    }

    const out = await addInventoryAccess({
      userId: req.session.userId!,
      inventoryId,
      email,
    })

    res.status(201).json(out)
  } catch (e) {
    next(e)
  }
})

// DELETE /api/inventories/:id/access/:userId
inventoriesRouter.delete('/:id/access/:userId', authMiddleware, async (req, res, next) => {
  try {
    const inventoryId = String(req.params.id)
    const targetUserId = String(req.params.userId)

    const out = await removeInventoryAccess({
      userId: req.session.userId!,
      inventoryId,
      targetUserId,
    })

    res.json(out)
  } catch (e) {
    next(e)
  }
})