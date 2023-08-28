import { serve, Server, ServerWebSocket } from "bun"
import { WebSocketServerData } from "./types"

class WebsocketServer {
  server: Server
  constructor() {
    this.server = serve({
      hostname: process.env.HOSTNAME || "127.0.0.1",
      fetch: this.fetch,
      websocket: {
        open: (ws) => {
          const {id: pool, sender} = ws.data as WebSocketServerData
          ws.subscribe(pool)
        },
        message: (ws, message) => {
          const { id: pool } = ws.data as WebSocketServerData
          ws.publish(pool, message, true)
        },
        close: (ws, code, reason) => {
          const {id: pool} = ws.data as WebSocketServerData
          ws.unsubscribe(pool)
          console.log(
            `Websocket connection ${pool} disconnected \n with code: ${code} \n with reason: ${reason}`
          )
        },
        drain: (ws) => {
          console.log("Please send me data. I am ready to receive it.")
        },
      },
    })
  }

  async fetch(req: Request, server: Server) {
    const url = new URL(req.url)
    const PATHNAME = url.pathname
    const params = url.searchParams

    switch (PATHNAME) {
      case "/ws":
        const success = server.upgrade(req, {
          data: { id: params.get("id"), sender: params.get("sender") },
        })
        if (success) return undefined
        break

      default:
        break
    }
  }
}

export { WebsocketServer }
