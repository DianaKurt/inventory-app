import type { Request, Response, NextFunction } from 'express'
import type { Role } from '@prisma/client'

export type ReqUser = { id: string; role: Role }

//Request
declare global {
  namespace Express {
    interface Request {
      user?: ReqUser
    }
  }
}

// вытаскиваем userId из сессии
export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  // хранить userId в req.session.userId 
  const userId = (req.session as any)?.userId as string | undefined
  const role = (req.session as any)?.role as Role | undefined

  if (!userId) return next({ status: 401, message: 'Unauthorized' })

  req.user = { id: userId, role: role ?? 'USER' }
  next()
}
