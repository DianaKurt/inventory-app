import type { Request, Response, NextFunction } from 'express'

export function debugRequest(req: Request, _res: Response, next: NextFunction) {
  const origin = req.headers.origin
  const cookie = req.headers.cookie
  const sid = (req as any).sessionID

  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`,
    {
      origin,
      hasCookieHeader: Boolean(cookie),
      cookiePreview: cookie ? cookie.slice(0, 80) + (cookie.length > 80 ? '…' : '') : null,
      sessionID: sid ?? null,
      sessionUserId: (req.session as any)?.userId ?? null,
      sessionRole: (req.session as any)?.role ?? null,
    },
  )

  next()
}