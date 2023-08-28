import { SoilMoistureLevel } from "../types"
import diffTime from "./diff-time"
import getSoilMoisture from "./get-soil-moisture"
import turnOnWaterPump from "./turn-on-water-pump"

const water = async () => {
  let complete = false
  const map = new Map<string, SoilMoistureLevel>()
  const reading: SoilMoistureLevel = await getSoilMoisture()
  map.set('LAST_READING', reading)


  while (!complete) {
    const { mean, median, timestamp } = map.get('LAST_READING')
    const timeDiff = diffTime(new Date(Date.now()), timestamp, 1)
    const water = needsWater(parseInt(median, 10), parseInt(mean, 10))
    if (water) await turnOnWaterPump()
    else complete = false

    if (timeDiff > 3 && !complete) {
      const reading = await getSoilMoisture()
      const { mean, median, timestamp } = reading
      const water = needsWater(parseInt(median, 10), parseInt(mean, 10))
      const end = diffTime(timestamp, map.get('LAST_READING').timestamp, 1) > 10 // check every 5 - 10 mins

      if(water) {
        await turnOnWaterPump()
        map.set('LAST_READING', reading)
      } else if(end) {
        complete = true 
      }
    }
  }
  console.log("COMPLETEE")
  self.postMessage({ action: "COMPLETE", data: reading })
}

self.onmessage = async (e: MessageEvent<any>) => {
  const action = e.data.action
  if (action === "START") {
    await water()
  }
}

const needsWater = (median: number, mean: number) => {
  return mean <= 40 || median <= 40 ? true : false
}
