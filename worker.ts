import { Action, SoilMoistureLevel } from "./types"

class WorkerThread {
  worker: any
  #status: boolean
  data: SoilMoistureLevel
  #send: (message: string | BufferSource | Action) => void

  constructor(url: string) {
    const workerURL = new URL(url, import.meta.url).href
    this.worker = new Worker(workerURL)
    this.worker.addEventListener("open", this.HandleOpen)
    this.worker.addEventListener("close", this.HandleOnClose)
    this.worker.onmessage = this.HandleMessage
    this.#status = false
  }

  set status(state: boolean) {
    this.#status = state
  }

  get status() {
    return this.#status
  }

  set send(send: (message: string | BufferSource | Action)=>void) {
    this.#send = send
  }

  HandleOpen = () => {
    console.log("Open Worker: ", this.worker.threadId)
  }

  HandleMessage = (e: MessageEvent<any>) => {
    const {action, data} = e.data
    if(action === "COMPLETE") {
      this.#status = false
      this.data = data
      this.#send({type: "workerAction", action, message: "Watering Cylce Complete"})
    } else if(action === "WATER") {
      this.#send({type: "workerAction", action,
        message: "Water Pump Successful"})
    }
  }

  HandleOnClose = () => {
    console.log(`Closing Worker: ${this.worker.threadId}`)
  }
}

export { WorkerThread }
