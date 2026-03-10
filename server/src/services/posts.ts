import { authMiddleware } from '../middleware/auth.middleware'
import { createPost, listPosts } from '../services/post.service'
import { Request, Response, NextFunction, Router} from 'express'

export const postsRouter = Router()

// GET /api/posts?inventoryId=xxx
postsRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inventoryId = String(req.query.inventoryId ?? '').trim()
    if (!inventoryId) throw { status: 400, message: 'inventoryId is required' }

    const userId = req.session?.userId ?? null
    const out = await listPosts({ userId, inventoryId })
    res.json(out)
  } catch (e) {
    next(e)
  }
})

// POST /api/posts
// body: { inventoryId, bodyMd }
postsRouter.post('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inventoryId = String(req.body?.inventoryId ?? '').trim()
    const bodyMd = String(req.body?.bodyMd ?? '')

    if (!inventoryId) throw { status: 400, message: 'inventoryId is required' }

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