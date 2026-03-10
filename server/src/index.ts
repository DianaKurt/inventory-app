import 'dotenv/config'
import http from 'http'
import path from 'node:path'
import express from 'express'

import { env } from './env'
import { createApp } from './app'
import { createWss } from './socket'

const app = createApp()

// Static only in production
if (env.NODE_ENV === 'production') {
  const clientDist = path.resolve(process.cwd(), '../client/dist')
  app.use(express.static(clientDist))

  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'))
  })
}

const server = http.createServer(app)

// WS
createWss(server)

server.listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}`)
  console.log(`WS  listening on ws://localhost:${env.PORT}/ws`)
})