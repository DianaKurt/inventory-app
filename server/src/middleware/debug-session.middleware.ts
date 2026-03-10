import type { Request, Response, NextFunction } from 'express'

export function debugSession(tag: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    console.log(`[session:${tag}]`, {
      sid: (req as any).sessionID ?? null,
      userId: (req.session as any)?.userId ?? null,
      role: (req.session as any)?.role ?? null,
    })
    next()
  }
}