import type { Server as HttpServer } from 'http'
import { WebSocketServer, WebSocket } from 'ws'

export function createWss(server: HttpServer) {
  const wss = new WebSocketServer({ server, path: '/ws' })

  wss.on('connection', (ws: WebSocket) => {
    ws.send(
      JSON.stringify({
        type: 'hello',
        payload: 'connected',
      }),
    )

    ws.on('message', (raw: Buffer) => {
      ws.send(raw.toString())
    })
  })

  return wss
}