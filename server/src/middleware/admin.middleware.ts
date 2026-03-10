import type { Request, Response, NextFunction } from 'express'

export function adminMiddleware(req: Request, _res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return next({ status: 401, message: 'Unauthorized' })
  }

  if (req.session.role !== 'ADMIN') {
    return next({ status: 403, message: 'Forbidden' })
  }

  next()
}
