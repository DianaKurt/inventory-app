type Env = {
  NODE_ENV: 'development' | 'production' | 'test'
  PORT: number
  DATABASE_URL: string
  CLIENT_ORIGIN: string
  SESSION_SECRET: string
  DROPBOX_ACCESS_TOKEN?: string
  DROPBOX_SUPPORT_TICKETS_PATH: string
}

function must(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env: ${name}`)
  return v
}

export const env: Env = {
  NODE_ENV: (process.env.NODE_ENV as Env['NODE_ENV']) ?? 'development',
  PORT: Number(process.env.PORT ?? 3001),

  DATABASE_URL: must('DATABASE_URL'),

  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',

  SESSION_SECRET: must('SESSION_SECRET'),

  DROPBOX_ACCESS_TOKEN: process.env.DROPBOX_ACCESS_TOKEN,
  DROPBOX_SUPPORT_TICKETS_PATH:
    process.env.DROPBOX_SUPPORT_TICKETS_PATH ?? '/support-tickets',
}