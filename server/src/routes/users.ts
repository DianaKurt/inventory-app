import { Router } from 'express'
import { adminMiddleware } from '../middleware/admin.middleware'
import { listUsers } from '../services/user.service'

export const usersRouter = Router()

usersRouter.get('/', adminMiddleware, async (_req, res, next) => {
  try {
    const users = await listUsers()
    res.json(users)
  } catch (e) {
    next(e)
  }
})
