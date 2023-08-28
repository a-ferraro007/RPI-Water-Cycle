import { SoilMoistureLevel, TempHumidityLevel, MESSAGE_REQUESTS, Action } from "./types"
import { getSoilMoisture } from "./utilities"
import { WorkerThread } from "./worker"

class WebSocketClient {
  socket: WebSocket
  BASE_URL = process.env.HOSTNAME ?? "127.0.0.1"
  lastTempHumidityReading: TempHumidityLevel
  lastSoilMoistureReading: SoilMoistureLevel
  interval: Timer
  WAIT_TEN_MINUTES = 10
  WAIT_FIVE_MINUTES = 5
  WAIT_THIRTY_SECONDS = 30
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
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  send = (message: string | BufferSource | Action) => {
    this.socket.send(JSON.stringify(message))
  }

  async #startMonitoring() {
    this.lastSoilMoistureReading = await getSoilMoisture()
    this.send(JSON.stringify(this.lastSoilMoistureReading))

    this.thread.worker.postMessage({ action: "START" })
    this.thread.status = true

    this.interval = setInterval(() => {
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
