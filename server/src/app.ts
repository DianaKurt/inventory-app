import express from 'express'
import cors from 'cors'
import session from 'express-session'
import { env } from './env'
import { apiRouter } from './routes'
import { errorMiddleware } from './middleware/error.middleware'
import { debugRequest } from './middleware/debug-request.middleware'
import { debugSession } from './middleware/debug-session.middleware'
import { debugHttp } from './middleware/debug-http.middleware'

import type { Server as HttpServer } from 'http'
import { WebSocketServer } from 'ws'

const ALLOWED_ORIGINS = new Set([
  env.CLIENT_ORIGIN,        
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5555',
  'http://127.0.0.1:5555'
].filter(Boolean))

export function createApp() {
  const app = express()

  app.use(cors(/* ... */))
  app.use(express.json({ limit: '2mb' }))

  // before session — log the headers
  app.use(debugRequest)

  app.use(
    session({
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: env.NODE_ENV === 'production',
      },
    }),
  )

app.use(debugHttp)
app.use(express.json({ limit: '2mb' }))
app.use(session(/*...*/))
app.use('/api', apiRouter)

  // after session — we see what is real in req.session
  app.use(debugSession('after-session'))

  // spot trap on auth/me
  app.use('/api/auth', debugSession('before-/api/auth'))
  app.use('/api/me', debugSession('before-/api/me'))
  app.use('/api/admin', debugSession('before-/api/admin'))

  app.get('/health', (_req, res) => res.json({ ok: true }))
  app.use('/api', apiRouter)

  app.use(errorMiddleware)
  return app
}