import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get("symbol")
  const interval = searchParams.get("interval") || "1h"
  const limit = searchParams.get("limit") || "100"

  if (!symbol) {
    return NextResponse.json({ error: "Symbol parameter is required" }, { status: 400 })
  }

  try {
    console.log(`Fetching data for symbol: ${symbol}`)
    const response = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
      { next: { revalidate: 60 } }, // Cache for 60 seconds
    )

    if (!response.ok) {
      console.error(`Binance API error: ${response.status} ${response.statusText}`)
      // If we get a 400 error, fall back to mock data
      return NextResponse.json(generateMockData(Number.parseInt(limit as string), symbol))
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching from Binance:", error)

    // Return mock data for demonstration purposes
    return NextResponse.json(generateMockData(Number.parseInt(limit as string), symbol))
  }
}

// Generate mock data for demonstration when API fails
function generateMockData(limit: number, symbol: string) {
  const now = Date.now()
  const hourMs = 60 * 60 * 1000
  const data = []

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

  // Add some randomness to make the chart look realistic
  let currentPrice = basePrice * (0.95 + 0.1 * Math.random())

  for (let i = 0; i < limit; i++) {
    const time = now - (limit - i) * hourMs

    // Create a random walk with some trend
    const trend = Math.sin(i / 10) * 0.01 // Add a slight sine wave pattern
    const randomChange = (Math.random() - 0.5) * 0.02 // Random noise

    // Update the current price with the trend and random change
    currentPrice = currentPrice * (1 + trend + randomChange)

    const open = currentPrice
    const high = open * (1 + 0.005 * Math.random())
    const low = open * (1 - 0.005 * Math.random())
    const close = (high + low) / 2 + (Math.random() - 0.5) * (high - low) * 0.5
    const volume = Math.random() * 1000 * basePrice

    data.push([
      time, // Open time
      open.toFixed(2), // Open
      high.toFixed(2), // High
      low.toFixed(2), // Low
      close.toFixed(2), // Close
      volume.toFixed(2), // Volume
      time + hourMs, // Close time
      "0", // Quote asset volume
      0, // Number of trades
      "0", // Taker buy base asset volume
      "0", // Taker buy quote asset volume
      "0", // Ignore
    ])
  }

  return data
}

