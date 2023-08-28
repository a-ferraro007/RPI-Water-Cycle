import { spawn } from "bun"
import { SoilMoistureLevel } from "../types"

async function getSoilMoisture() {
  try {
    // const process = spawn({
    //   cmd: ["sudo", "python3", "python/soilMoisture.py"],
    //   stdout: "pipe",
    // })
    // const str = await new Response(process.stdout).text()
    const j = {} as any//JSON.parse(str)
    j.mean = "49" //Math.round(100 * (j.mean / 2000) * 100) / 100
    j.median = "49" //Math.round(100 * (j.median / 2000) * 100) / 100
    return {
      ...j,
       timestamp: new Date(Date.now())
    } as SoilMoistureLevel
    
  } catch (error) {
    console.error(error)
  }
}

export default getSoilMoisture