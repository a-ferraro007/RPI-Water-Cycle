import {
  SoilMoistureLevel,
  TempHumidityLevel,
  MESSAGE_REQUESTS,
  Action,
} from "./types"
import { getSoilMoisture } from "./utilities"
import { WorkerThread } from "./worker"

class WebSocketClient {
  socket: WebSocket
  BASE_URL = process.env.HOSTNAME ?? "127.0.0.1"
  lastTempHumidityReading: TempHumidityLevel
  lastSoilMoistureReading: SoilMoistureLevel
  cycleInterval: Timer
  soilReadingInterval: Timer
  thread: WorkerThread

  constructor(id: string) {
    this.socket = new WebSocket(
      `ws://${this.BASE_URL}:3000/ws?id=${id}&sender=${id}_server`
    )
    this.socket.addEventListener("open", this.HandleOpen)
    this.socket.addEventListener("message", this.HandleMessage)
    this.socket.addEventListener("close", this.HandleOnClose)
    this.thread = new WorkerThread("/utilities/start-monitoring.ts")
  }

  HandleOpen = () => {
    this.thread.send = this.send
    this.#startMonitoring()
  }

  HandleMessage = (event: MessageEvent<string>) => {
    const { request } = JSON.parse(event.data)
    if (
      request === MESSAGE_REQUESTS.MOISTURE_LEVEL &&
      this.lastSoilMoistureReading
    ) {
      this.socket.send(JSON.stringify(this.lastSoilMoistureReading))
    }
  }

  HandleOnClose = () => {
    if (this.cycleInterval) {
      clearInterval(this.cycleInterval)
    }
  }

  send = (message: string | BufferSource | Action) => {
    this.socket.send(JSON.stringify(message))
  }

  async #startMonitoring() {
    this.soilReadingInterval = setInterval(async () => {
      this.lastSoilMoistureReading = await getSoilMoisture()
      this.send(JSON.stringify(this.lastSoilMoistureReading))
    }, 5000)

    this.thread.worker.postMessage({ action: "START" })
    this.thread.status = true

    this.cycleInterval = setInterval(() => {
      this.send(JSON.stringify(this.lastSoilMoistureReading))
      if (!this.thread.status) {
        this.lastSoilMoistureReading = this.thread.data
        this.thread.worker.postMessage({ action: "START" })
        this.thread.status = true
      }
    }, 1.2e6) //Interval should be longer, somewhere in the hourly range
  }
}

export { WebSocketClient }
