import { Router } from 'express'

export const debugRouter = Router()

debugRouter.get('/session', (req, res) => {
  res.json({
    hasCookieHeader: Boolean(req.headers.cookie),
    cookiePreview: req.headers.cookie?.slice(0, 120) ?? null,
    sid: (req as any).sessionID ?? null,
    userId: (req as any).session?.userId ?? null,
    role: (req as any).session?.role ?? null,
  })
})