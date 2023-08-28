import { WebSocketClient } from "./client"
import { WebsocketServer } from "./server"

;(function Main() {
  const wss = new WebsocketServer()
  new WebSocketClient("tiny_plant")
  console.log(`Server is running at port: ${wss.server.port}`)
})()
