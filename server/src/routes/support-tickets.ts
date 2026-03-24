import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import { createSupportTicket } from '../services/support-ticket.service'

export const supportTicketsRouter = Router()

// POST /api/support-tickets
supportTicketsRouter.post('/', authMiddleware, async (req, res, next) => {
  try {
    const out = await createSupportTicket({
      summary: req.body?.summary,
      priority: req.body?.priority,
      reportedBy: req.body?.reportedBy,
      inventory: req.body?.inventory,
      link: req.body?.link,
      createdAt: req.body?.createdAt,
    })

    res.status(201).json(out)
  } catch (e) {
    next(e)
  }
})