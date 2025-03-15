"use client"

import { useEffect, useRef, useState } from "react"

interface PriceChartProps {
  symbol: string
}

interface PriceData {
  time: number
  value: number
}

export function PriceChart({ symbol }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [priceData, setPriceData] = useState<PriceData[]>([])

  useEffect(() => {
    if (!chartContainerRef.current) return

    setIsLoading(true)
    setError(null)
    setPriceData([])

    // Fetch historical data from our Next.js API route
    const fetchHistoricalData = async () => {
      try {
        console.log(`Fetching data for symbol: ${symbol}`)
        // Use our own API route to avoid CORS issues
        const response = await fetch(`/api/binance?symbol=${symbol}&interval=1h&limit=100`)

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`)
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        // Transform the data for the chart
        const lineData = data.map((item: any) => ({
          time: new Date(Number.parseInt(item[0])).toLocaleString(),
          value: Number.parseFloat(item[4]), // Close price
        }))

        setPriceData(lineData)
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching historical data:", err)
        setError("Failed to load chart data. Using simulated data instead.")

        // Generate some mock data as a fallback
        const mockData = generateMockChartData(symbol)
        setPriceData(mockData)
        setIsLoading(false)
      }
    }

    fetchHistoricalData()

    // Set up WebSocket connection with error handling and reconnection
    let ws: WebSocket | null = null
    let reconnectAttempts = 0
    let isUsingMockData = false
    const maxReconnectAttempts = 5
    const reconnectDelay = 3000 // 3 seconds

    const connectWebSocket = () => {
      try {
        ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_1h`)

        ws.onopen = () => {
          console.log(`WebSocket connected for ${symbol}`)
          reconnectAttempts = 0 // Reset reconnect attempts on successful connection
        }

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)

            if (data.k) {
              setPriceData((prev) => {
                // Only add new data point if it's not already in the array
                const exists = prev.some((item) => new Date(item.time).getTime() === data.k.t)

                if (!exists) {
                  return [
                    ...prev,
                    {
                      time: new Date(data.k.t).toLocaleString(),
                      value: Number.parseFloat(data.k.c),
                    },
                  ].slice(-100) // Keep only the last 100 points
                }

                return prev
              })
            }
          } catch (err) {
            console.error("Error processing WebSocket message:", err)
          }
        }

        ws.onerror = (error) => {
          console.error("WebSocket error:", error)
          if (!isUsingMockData) {
            startMockDataUpdates()
            isUsingMockData = true
          }
        }

        ws.onclose = () => {
          console.log("WebSocket connection closed")

          // Attempt to reconnect if we haven't exceeded max attempts
          if (reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++
            console.log(`Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts})...`)
            setTimeout(connectWebSocket, reconnectDelay)
          } else {
            console.log("Max reconnect attempts reached")
            if (!isUsingMockData) {
              startMockDataUpdates()
              isUsingMockData = true
            }
          }
        }
      } catch (err) {
        console.error("Error setting up WebSocket:", err)
        if (!isUsingMockData) {
          startMockDataUpdates()
          isUsingMockData = true
        }
      }
    }

    // Fallback to simulated real-time updates if WebSocket fails
    let mockUpdateInterval: NodeJS.Timeout | null = null

    const startMockDataUpdates = () => {
      console.log("Starting mock data updates")
      mockUpdateInterval = setInterval(() => {
        setPriceData((prev) => {
          if (prev.length === 0) return prev

          const lastValue = prev[prev.length - 1].value
          const change = lastValue * (Math.random() * 0.01 - 0.005) // -0.5% to +0.5%
          const newValue = lastValue + change

          return [
            ...prev,
            {
              time: new Date().toLocaleString(),
              value: newValue,
            },
          ].slice(-100)
        })
      }, 5000) // Update every 5 seconds
    }

    connectWebSocket()

    // Clean up
    return () => {
      if (ws && [WebSocket.OPEN, WebSocket.CONNECTING].includes(ws.readyState)) {
        ws.close()
      }
      if (mockUpdateInterval) {
        clearInterval(mockUpdateInterval)
      }
    }
  }, [symbol])

  // Generate mock chart data as a fallback
  function generateMockChartData(symbol: string): PriceData[] {
    const data: PriceData[] = []
    const now = Date.now()
    const hourMs = 60 * 60 * 1000

    // Base price depends on the symbol
    let basePrice = 0
    if (symbol.includes("BTC")) basePrice = 50000
    else if (symbol.includes("ETH")) basePrice = 3000
    else if (symbol.includes("BNB")) basePrice = 500
    else if (symbol.includes("ADA")) basePrice = 1.2
    else if (symbol.includes("DOGE")) basePrice = 0.15
    else if (symbol.includes("XRP")) basePrice = 0.5
    else if (symbol.includes("SOL")) basePrice = 100
    else if (symbol.includes("DOT")) basePrice = 20
    else basePrice = 100

    let currentPrice = basePrice

    for (let i = 0; i < 100; i++) {
      const time = now - (100 - i) * hourMs

      // Create a random walk with some trend
      const trend = Math.sin(i / 10) * 0.01
      const randomChange = (Math.random() - 0.5) * 0.02

      currentPrice = currentPrice * (1 + trend + randomChange)

      data.push({
        time: new Date(time).toLocaleString(),
        value: currentPrice,
      })
    }

    return data
  }

  return (
    <div className="relative h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="text-center">
            <div className="mb-2 h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto"></div>
            <p>Loading chart data...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-0 right-0 m-4 p-2 bg-yellow-100 text-yellow-800 rounded text-sm">{error}</div>
      )}

      <div ref={chartContainerRef} className="h-full">
        {priceData.length > 0 && (
          <div className="h-full w-full">
            <svg viewBox="0 0 1000 400" className="h-full w-full">
              {/* Define the chart area */}
              <g transform="translate(50, 20)">
                {/* Calculate min and max for scaling */}
                {(() => {
                  const values = priceData.map((d) => d.value)
                  const min = Math.min(...values) * 0.99
                  const max = Math.max(...values) * 1.01
                  const width = 900
                  const height = 360

                  // Create the line path
                  const points = priceData
                    .map((d, i) => {
                      const x = (i / (priceData.length - 1)) * width
                      const y = height - ((d.value - min) / (max - min)) * height
                      return `${x},${y}`
                    })
                    .join(" ")

                  return (
                    <>
                      {/* Y-axis labels */}
                      <text x="-40" y="0" className="text-xs fill-muted-foreground">
                        {max.toFixed(2)}
                      </text>
                      <text x="-40" y={height / 2} className="text-xs fill-muted-foreground">
                        {((max + min) / 2).toFixed(2)}
                      </text>
                      <text x="-40" y={height} className="text-xs fill-muted-foreground">
                        {min.toFixed(2)}
                      </text>

                      {/* X-axis labels */}
                      <text x="0" y={height + 20} className="text-xs fill-muted-foreground">
                        {priceData[0].time.split(",")[0]}
                      </text>
                      <text x={width - 100} y={height + 20} className="text-xs fill-muted-foreground">
                        {priceData[priceData.length - 1].time.split(",")[0]}
                      </text>

                      {/* Grid lines */}
                      <line x1="0" y1="0" x2={width} y2="0" stroke="#27272a" strokeWidth="1" />
                      <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#27272a" strokeWidth="1" />
                      <line x1="0" y1={height} x2={width} y2={height} stroke="#27272a" strokeWidth="1" />

                      {/* The line chart */}
                      <polyline fill="none" stroke="#3b82f6" strokeWidth="2" points={points} />

                      {/* Current price indicator */}
                      <circle
                        cx={width}
                        cy={height - ((priceData[priceData.length - 1].value - min) / (max - min)) * height}
                        r="4"
                        fill="#3b82f6"
                      />

                      {/* Current price text */}
                      <text
                        x={width - 5}
                        y={height - ((priceData[priceData.length - 1].value - min) / (max - min)) * height - 10}
                        className="text-sm font-medium fill-primary"
                        textAnchor="end"
                      >
                        ${priceData[priceData.length - 1].value.toFixed(2)}
                      </text>
                    </>
                  )
                })()}
              </g>
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}

