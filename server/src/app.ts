import express from 'express'
import cors from 'cors'
import session from 'express-session'
import connectPgSimple from 'connect-pg-simple'
import { Pool } from 'pg'
import { env } from './env'
import { apiRouter } from './routes'
import { errorMiddleware } from './middleware/error.middleware'
import { debugRequest } from './middleware/debug-request.middleware'
import { debugSession } from './middleware/debug-session.middleware'
import { debugHttp } from './middleware/debug-http.middleware'

const ALLOWED_ORIGINS = new Set(
  [
    env.CLIENT_ORIGIN,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5555',
    'http://127.0.0.1:5555',
  ].filter(Boolean),
)

const PgSession = connectPgSimple(session)

const pgPool = new Pool({
  connectionString: env.DATABASE_URL,
})

export function createApp() {
  const app = express()

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) return callback(null, true)
        if (ALLOWED_ORIGINS.has(origin)) return callback(null, true)
        return callback(new Error(`CORS blocked for origin: ${origin}`))
      },
      credentials: true,
    }),
  )

  app.use(express.json({ limit: '2mb' }))

  app.use(debugRequest)

  app.use(
    session({
      store: new PgSession({
        pool: pgPool,
        tableName: 'user_sessions',
        createTableIfMissing: true,
      }),
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    }),
  )

  app.use(debugHttp)

  app.use(debugSession('after-session'))
  app.use('/api/auth', debugSession('before-/api/auth'))
  app.use('/api/me', debugSession('before-/api/me'))
  app.use('/api/admin', debugSession('before-/api/admin'))

  app.get('/health', (_req, res) => res.json({ ok: true }))

  app.use('/api', apiRouter)

  app.use(errorMiddleware)

  return app
}