import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import { createItem, deleteItem, listItems, updateItem, setItemFieldValue } from '../services/item.service'
import { getItemDetails, toggleItemLike, getItemLikes, bulkDeleteItems} from '../services/item.service'


export const itemsRouter = Router()

// GET /api/items?inventoryId=xxx
// read: public/owner/shared
itemsRouter.get('/', async (req, res, next) => {
  try {
    const inventoryId = String(req.query.inventoryId ?? '').trim()
    if (!inventoryId) throw { status: 400, message: 'inventoryId is required' }

    const userId = req.session?.userId ?? null
    const data = await listItems({ userId, inventoryId })

    res.json(data)
  } catch (e) {
    next(e)
  }
})
// POST /api/items/bulk-delete
// body: { ids: string[] }
itemsRouter.post('/bulk-delete', authMiddleware, async (req, res, next) => {
  try {
    const ids = req.body?.ids
    if (!Array.isArray(ids) || ids.length === 0) {
      throw { status: 400, message: 'ids must be a non-empty array' }
    }
    const itemIds = ids.map((x) => String(x).trim()).filter(Boolean)
    if (itemIds.length === 0) throw { status: 400, message: 'ids must be non-empty strings' }

    const out = await bulkDeleteItems({
      userId: req.session.userId!,
      itemIds,
    })

    res.json(out)
  } catch (e) {
    next(e)
  }
})

// GET /api/items/:id
// read: public/owner/shared (как и listItems)
itemsRouter.get('/:id', async (req, res, next) => {
  try {
    const itemId = String(req.params.id).trim()
    if (!itemId) throw { status: 400, message: 'id is required' }

    const userId = req.session?.userId ?? null
    const out = await getItemDetails({ userId, itemId })

    res.json(out)
  } catch (e) {
    next(e)
  }
})

// PATCH /api/items/:id
// body: { version, customId? }
itemsRouter.patch('/:id', authMiddleware, async (req, res, next) => {
  try {
    const itemId = String(req.params.id).trim()
    if (!itemId) throw { status: 400, message: 'id is required' }

    const versionRaw = req.body?.version
    if (versionRaw === undefined || versionRaw === null) throw { status: 400, message: 'version is required' }

    const version = Number(versionRaw)
    if (!Number.isFinite(version)) throw { status: 400, message: 'version must be a number' }

    const patch = {
      customId: req.body?.customId === undefined ? undefined : String(req.body.customId).trim(),
    }

    const out = await updateItem({
      userId: req.session.userId!,
      itemId,
      version,
      patch,
    })

    res.json(out)
  } catch (e) {
    next(e)
  }
})

// DELETE /api/items/:id
itemsRouter.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const itemId = String(req.params.id).trim()
    if (!itemId) throw { status: 400, message: 'id is required' }

    const out = await deleteItem({ userId: req.session.userId!, itemId })
    res.json(out)
  } catch (e) {
    next(e)
  }
})
// POST /api/items/:id/values
itemsRouter.post('/:id/values', authMiddleware, async (req, res, next) => {
  try {
    const itemId = req.params.id

   const out = await setItemFieldValue({
      userId: req.session.userId!,
      itemId,
      fieldId: req.body.fieldId,
      value: req.body.value,
    })

    res.json(out)
  } catch (e) {
    next(e)
  }
})
// POST /api/items
// body: { inventoryId, customId? }
itemsRouter.post('/', authMiddleware, async (req, res, next) => {
  try {
    const inventoryId = String(req.body?.inventoryId ?? '').trim()
    const customIdRaw = req.body?.customId
const customId = customIdRaw === undefined ? undefined : String(customIdRaw).trim()


    if (!inventoryId) throw { status: 400, message: 'inventoryId is required' }

const item = await createItem({
  userId: req.session.userId!,
  inventoryId,
  customId,
    })

    res.status(201).json(item)
  } catch (e) {
    next(e)
  }
})


// GET /api/items/:id/likes
itemsRouter.get('/:id/likes', async (req, res, next) => {
  try {
    const itemId = String(req.params.id)
    const userId = req.session?.userId ?? null

    const out = await getItemLikes({ userId, itemId })
    res.json(out)
  } catch (e) {
    next(e)
  }
})

// POST /api/items/:id/likes/toggle
itemsRouter.post('/:id/likes/toggle', authMiddleware, async (req, res, next) => {
  try {
    const itemId = String(req.params.id)

    const out = await toggleItemLike({
      userId: req.session.userId!,
      itemId,
    })

    res.json(out)
  } catch (e) {
    next(e)
  }
})