export type TempHumidityLevel = {
  temp: string
  humidity: string
  timestamp: Date
}

export type SoilMoistureLevel = {
  mean: string // 0 - 100
  median: string // 0 - 100
  timestamp: Date
}

export type WebSocketServerData = {
  id: string;
  sender: string;
}

export type Action = {
  type: string, 
  action: string, 
  message: string
}

export const MESSAGE_REQUESTS = {
  MOISTURE_LEVEL: "MOISTURE_LEVEL",
} as const;
export type MESSAGE_REQUESTS = typeof MESSAGE_REQUESTS[keyof typeof MESSAGE_REQUESTS];