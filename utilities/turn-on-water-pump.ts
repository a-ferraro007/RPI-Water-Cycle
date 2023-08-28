import { spawn } from "bun"
import getUTCTimestamp from "./get-timestamp"

async function turnOnWaterPump(timeInSeconds: string = "1") {
    try {
      spawn({
        cmd: ["sudo", "python3", "python/water.py", timeInSeconds],
        stdout: "pipe",
       onExit(_, __, ___, error) {
          if (error) console.error("ERROR",error)
          else console.log(`Water Pump Successful\ntimestamp: ${getUTCTimestamp()}`)
        },
      })
    } catch (error) {
      console.error("ERR", error)
    }
  }
  
  export default turnOnWaterPump