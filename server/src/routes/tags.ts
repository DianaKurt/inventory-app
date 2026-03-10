import { Router } from 'express'
import { prisma } from '../db'

export const tagsRouter = Router()

tagsRouter.get('/', async (_req, res, next) => {
  try {
    const tags = await prisma.tag.findMany({ orderBy: { name: 'asc' } } as any)
    res.json(tags)
  } catch (e) {
    next(e)
  }
})
