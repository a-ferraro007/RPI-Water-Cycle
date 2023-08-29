import { SoilMoistureLevel } from "../types"
import diffTime from "./diff-time"
import getSoilMoisture from "./get-soil-moisture"
import turnOnWaterPump from "./turn-on-water-pump"
const TEN_MINUTES = 10
const THREE_MINUTES = 3
const FORTY_PERCENT = 40

const water = async () => {
  let complete = false
  let firstTick = true
  const inRange = new Array<number>()
  const map = new Map<string, SoilMoistureLevel>()
  const reading: SoilMoistureLevel = await getSoilMoisture()
  map.set('LAST_READING', reading)


  while (!complete) {
    const { mean, median, timestamp } = map.get('LAST_READING')
    const timeDiff = diffTime(new Date(Date.now()), timestamp, 60)
    const water = needsWater(parseInt(median, 10), parseInt(mean, 10))
    if (water && firstTick) await turnOnWaterPump()
    else complete = false

    if (timeDiff > TEN_MINUTES && !complete) {
      const reading = await getSoilMoisture()
      const mean = parseInt(reading.mean, 10) 
      const median = parseInt(reading.median, 10)
      const water = needsWater(median, mean)
      const lastReading = parseInt(map.get("LAST_READING").median, 10)
      if(Math.abs(median - lastReading ) >= THREE_MINUTES ) inRange.push(1)
      const end = inRange.length >= 10
      
      if(water && !end) {
        await turnOnWaterPump()
        map.set('LAST_READING', reading)
      } else if(end) {
        complete = true 
      }
    }
    firstTick = false
  }
  //@ts-ignore
  self.postMessage({ action: "COMPLETE", data: reading })
  console.log("CYCLE COMPLETE")
}

//@ts-ignore
self.onmessage = async (e: MessageEvent<any>) => {
  const action = e.data.action
  if (action === "START") {
    await water()
  }
}

const needsWater = (median: number, mean: number) => {
  return mean <= FORTY_PERCENT || median <= FORTY_PERCENT ? true : false
}
