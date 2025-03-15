"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface MaterialPriceChartProps {
  symbol: string
}

interface PriceData {
  time: string
  value: number
}

export function MaterialPriceChart({ symbol }: MaterialPriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [priceData, setPriceData] = useState<PriceData[]>([])

  useEffect(() => {
    if (!chartContainerRef.current) return

    setIsLoading(true)
    setError(null)
    setPriceData([])

    // Generate historical data for the material
    const generateHistoricalData = () => {
      try {
        // Base prices for different materials (approximate USD values)
        const basePrices: Record<string, number> = {
          XAU: 2000, // Gold per oz
          XAG: 25, // Silver per oz
          XPT: 950, // Platinum per oz
          XPD: 1100, // Palladium per oz
          HG: 4.5, // Copper per lb
          ALI: 1.2, // Aluminum per lb
          ZNC: 1.5, // Zinc per lb
          NI: 8.5, // Nickel per lb
        }

        const basePrice = basePrices[symbol] || 100
        const data: PriceData[] = []
        const now = new Date()

        // Generate 90 days of historical data
        for (let i = 90; i >= 0; i--) {
          const date = new Date(now)
          date.setDate(date.getDate() - i)

          // Create a realistic price pattern with trends
          // Use sine waves and random noise for natural-looking price movements
          const trend = Math.sin(i / 15) * 0.1 // Long-term trend
          const mediumTrend = Math.sin(i / 5) * 0.05 // Medium-term trend
          const noise = (Math.random() - 0.5) * 0.03 // Random noise

          // Calculate price with all components
          const priceMultiplier = 1 + trend + mediumTrend + noise
          const price = basePrice * priceMultiplier

          data.push({
            time: date.toLocaleDateString(),
            value: price,
          })
        }

        setPriceData(data)
        setIsLoading(false)
      } catch (err) {
        console.error("Error generating chart data:", err)
        setError("Failed to generate chart data")
        setIsLoading(false)
      }
    }

    generateHistoricalData()
  }, [symbol])

  return (
    <div className="relative h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="mb-2 h-8 w-8 rounded-full border-3 border-primary border-t-transparent mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            <p>Loading chart data...</p>
          </motion.div>
        </div>
      )}

      {error && (
        <motion.div
          className="absolute top-0 right-0 m-4 p-2 bg-destructive/10 text-destructive rounded-md text-sm"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.div>
      )}

      <div ref={chartContainerRef} className="h-full">
        {priceData.length > 0 && (
          <motion.div
            className="h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <svg viewBox="0 0 1000 300" className="h-full w-full">
              {/* Define the chart area */}
              <g transform="translate(50, 20)">
                {/* Calculate min and max for scaling */}
                {(() => {
                  const values = priceData.map((d) => d.value)
                  const min = Math.min(...values) * 0.99
                  const max = Math.max(...values) * 1.01
                  const width = 900
                  const height = 260

                  // Create the line path with animation
                  const points = priceData
                    .map((d, i) => {
                      const x = (i / (priceData.length - 1)) * width
                      const y = height - ((d.value - min) / (max - min)) * height
                      return `${x},${y}`
                    })
                    .join(" ")

                  // Create the area under the line
                  const areaPoints = `${points} ${width},${height} 0,${height}`

                  return (
                    <>
                      {/* Y-axis labels */}
                      <text x="-40" y="0" className="text-xs fill-muted-foreground">
                        ${max.toFixed(2)}
                      </text>
                      <text x="-40" y={height / 2} className="text-xs fill-muted-foreground">
                        ${((max + min) / 2).toFixed(2)}
                      </text>
                      <text x="-40" y={height} className="text-xs fill-muted-foreground">
                        ${min.toFixed(2)}
                      </text>

                      {/* X-axis labels - show every 30 days */}
                      {[0, 30, 60, 90].map((idx) => (
                        <text
                          key={idx}
                          x={idx * (width / 90)}
                          y={height + 20}
                          className="text-xs fill-muted-foreground"
                          textAnchor="middle"
                        >
                          {priceData[idx]?.time}
                        </text>
                      ))}

                      {/* Grid lines */}
                      <line x1="0" y1="0" x2={width} y2="0" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" />
                      <line
                        x1="0"
                        y1={height / 2}
                        x2={width}
                        y2={height / 2}
                        stroke="currentColor"
                        strokeOpacity="0.1"
                        strokeWidth="1"
                      />
                      <line
                        x1="0"
                        y1={height}
                        x2={width}
                        y2={height}
                        stroke="currentColor"
                        strokeOpacity="0.1"
                        strokeWidth="1"
                      />

                      {/* Vertical grid lines */}
                      {[0, 30, 60, 90].map((idx) => (
                        <line
                          key={idx}
                          x1={idx * (width / 90)}
                          y1="0"
                          x2={idx * (width / 90)}
                          y2={height}
                          stroke="currentColor"
                          strokeOpacity="0.1"
                          strokeWidth="1"
                        />
                      ))}

                      {/* The area under the line with gradient */}
                      <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>

                      <motion.polygon
                        fill="url(#areaGradient)"
                        points={areaPoints}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                      />

                      {/* The line chart with animation */}
                      <motion.polyline
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        points={points}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                      />

                      {/* Current price indicator */}
                      <motion.circle
                        cx={width}
                        cy={height - ((priceData[priceData.length - 1].value - min) / (max - min)) * height}
                        r="4"
                        fill="currentColor"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 1 }}
                      />

                      {/* Current price text */}
                      <motion.text
                        x={width - 5}
                        y={height - ((priceData[priceData.length - 1].value - min) / (max - min)) * height - 10}
                        className="text-sm font-medium fill-primary"
                        textAnchor="end"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                      >
                        ${priceData[priceData.length - 1].value.toFixed(2)}
                      </motion.text>
                    </>
                  )
                })()}
              </g>
            </svg>
          </motion.div>
        )}
      </div>
    </div>
  )
}

