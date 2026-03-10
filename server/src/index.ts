import 'dotenv/config'
import http from 'http'
import { env } from './env'
import { createApp } from './app'
import { createWss } from './socket'

const app = createApp()

const server = http.createServer(app)

// WS
createWss(server)

server.listen(env.PORT, () => {

  console.log(`API listening on port ${env.PORT}`)

  console.log(`WS  listening on ws://localhost:${env.PORT}/ws`)
})