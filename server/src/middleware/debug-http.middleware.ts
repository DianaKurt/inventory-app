import type { NextFunction, Request, Response } from 'express'

export function debugHttp(req: Request, res: Response, next: NextFunction) {
  const start = Date.now()
  res.on('finish', () => {
    console.log(
      `[HTTP] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - start}ms)`,
      { origin: req.headers.origin, hasCookie: Boolean(req.headers.cookie) },
    )
  })
  next()
}