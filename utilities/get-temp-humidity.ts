import { spawn } from "bun"
import { TempHumidityLevel } from "../types"

async function getTempHumidityLevel() {
  try {
    const process = spawn({
      cmd: ["sudo", "python3", "python/tempHumidity.py"],
      stdout: "pipe",
    })
    const str = await new Response(process.stdout).text()
    const j = JSON.parse(str) 
    return {
      ...j, 
      timestamp: new Date(Date.now())
    } as TempHumidityLevel
  } catch (error) {
    console.error(error)
  }
}

export default getTempHumidityLevel
