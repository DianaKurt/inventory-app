import type { Server as HttpServer } from 'http'
import { WebSocketServer } from 'ws'


export function createWss(server: HttpServer) {
  const wss = new WebSocketServer({ server, path: '/ws' })
  wss.on('connection', (ws) => {
    ws.send(JSON.stringify({ type: 'hello', payload: 'connected' }))

    ws.on('message', (raw) => {
      ws.send(raw.toString())
    })
  })

  return wss
}
