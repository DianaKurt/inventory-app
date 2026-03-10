import type { NextFunction, Request, Response } from 'express'

export type ApiError = {
  status: number
  message: string
  details?: unknown
}

export function errorMiddleware(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = typeof err?.status === 'number' ? err.status : 500
  const message =
    typeof err?.message === 'string' && err.message.trim()
      ? err.message
      : 'Internal Server Error'

  const payload: ApiError = {
    status,
    message,
    details: err?.details,
  }

  if (status >= 500) {
    // log for server
    console.error(err)
  }

  res.status(status).json(payload)
}
