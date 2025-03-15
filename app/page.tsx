"use client"

import { useEffect, useState } from "react"
import { ArrowDown, ArrowUp, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { MaterialPriceChart } from "./material-price-chart"
import { Navbar } from "./components/navbar"
import { motion, AnimatePresence } from "framer-motion"

// Define the types for our price data
interface PriceData {
  symbol: string
  price: string
  priceChange: number
  priceChangePercent: number
  high24h: string
  low24h: string
  lastUpdated: string
}

interface MarketData {
  prices: Record<string, PriceData>
  timestamp: string
}

// Map of symbols to display names for materials
const symbolMap: Record<string, string> = {
  XAU: "Gold",
  XAG: "Silver",
  XPT: "Platinum",
  XPD: "Palladium",
  HG: "Copper",
  ALI: "Aluminum",
  ZNC: "Zinc",
  NI: "Nickel",
}

export default function Dashboard() {
  const [prices, setPrices] = useState<Record<string, PriceData>>({})
  const [currentMarket, setCurrentMarket] = useState<MarketData | null>(null)
  const [pastMarket, setPastMarket] = useState<MarketData | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSymbol, setSelectedSymbol] = useState("XAU") // Default to Gold
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Gemini AI chat state
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "Hello! I'm Gemini AI. How can I help you with information about materials today?" },
  ])
  const [isSending, setIsSending] = useState(false)

  // Filter the prices based on search term
  const filteredPrices = Object.entries(prices)
    .filter(([symbol]) => symbolMap[symbol]?.toLowerCase().includes(searchTerm.toLowerCase()))
    .map(([symbol, data]) => ({
      symbol,
      ...data,
    }))

  // Fetch material prices
  useEffect(() => {
    const fetchMaterialPrices = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // In a real app, you would fetch from a metals API
        // For this demo, we'll generate mock data
        const mockPrices: Record<string, PriceData> = {}

        Object.keys(symbolMap).forEach((symbol) => {
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
          const priceChange = (Math.random() * 2 - 1) * basePrice * 0.02 // -2% to +2%
          const priceChangePercent = (priceChange / basePrice) * 100

          mockPrices[symbol] = {
            symbol,
            price: (basePrice + priceChange).toFixed(2),
            priceChange,
            priceChangePercent,
            high24h: (basePrice * (1 + Math.random() * 0.03)).toFixed(2),
            low24h: (basePrice * (1 - Math.random() * 0.03)).toFixed(2),
            lastUpdated: new Date().toLocaleTimeString(),
          }
        })

        // Set current market data
        setCurrentMarket({
          prices: mockPrices,
          timestamp: new Date().toISOString()
        })

        // Generate past market data (one month ago with ~10% difference)
        const pastMockPrices: Record<string, PriceData> = {}
        Object.entries(mockPrices).forEach(([symbol, data]) => {
          const pastPrice = parseFloat(data.price) * (0.9 + Math.random() * 0.2) // ±10% variation
          pastMockPrices[symbol] = {
            ...data,
            price: pastPrice.toFixed(2),
            lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleTimeString()
          }
        })

        setPastMarket({
          prices: pastMockPrices,
          timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        })

        setPrices(mockPrices)
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching material prices:", err)
        setError("Failed to load material prices. Please try again later.")
        setIsLoading(false)
      }
    }

    fetchMaterialPrices()

    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchMaterialPrices()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Send message to Gemini AI
  const sendMessage = async () => {
    if (!message.trim()) return

    const userMessage = message.trim()
    setMessage("")
    setChatHistory((prev) => [...prev, { role: "user", content: userMessage }])
    setIsSending(true)

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history: chatHistory.slice(-10), // Send last 10 messages for context
          marketData: {
            current: currentMarket,
            past: pastMarket
          }
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from Gemini")
      }

      const data = await response.json()
      setChatHistory((prev) => [...prev, { role: "assistant", content: data.response }])
    } catch (err) {
      console.error("Error calling Gemini API:", err)
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error processing your request. Please try again.",
        },
      ])
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-background/90">
      <Navbar />

      <main className="flex-1 container py-6 mt-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Materials Price Dashboard
          </h1>
        </motion.div>

        {error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg border border-destructive p-4 text-destructive"
          >
            {error}
          </motion.div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <motion.div
                className="mb-2 h-10 w-10 rounded-full border-4 border-primary border-t-transparent mx-auto"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
              <p className="text-muted-foreground">Loading material prices...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <AnimatePresence>
                {Object.entries(symbolMap)
                  .slice(0, 4)
                  .map(([symbol, name], index) => {
                    const data = prices[symbol]
                    if (!data) return null

                    const isPositive = data.priceChangePercent >= 0

                    return (
                      <motion.div
                        key={symbol}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                      >
                        <Card className="overflow-hidden border-none shadow-lg bg-card/50 backdrop-blur-sm">
                          <CardHeader className="pb-2">
                            <CardTitle className="flex items-center">
                              <span className="mr-2">{name}</span>
                              <span className="text-xs text-muted-foreground ml-auto">
                                Last updated: {data.lastUpdated}
                              </span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold">${data.price}</div>
                            <div
                              className={`flex items-center text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}
                            >
                              {isPositive ? (
                                <motion.div
                                  initial={{ y: 0 }}
                                  animate={{ y: [0, -4, 0] }}
                                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                                >
                                  <ArrowUp className="mr-1 h-4 w-4" />
                                </motion.div>
                              ) : (
                                <motion.div
                                  initial={{ y: 0 }}
                                  animate={{ y: [0, 4, 0] }}
                                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                                >
                                  <ArrowDown className="mr-1 h-4 w-4" />
                                </motion.div>
                              )}
                              <span>
                                {isPositive ? "+" : ""}
                                {data.priceChangePercent.toFixed(2)}%
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
              </AnimatePresence>
            </div>

            <div className="grid gap-8 md:grid-cols-5">
              <motion.div
                className="md:col-span-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm h-full">
                  <CardHeader>
                    <CardTitle>Price Charts</CardTitle>
                    <CardDescription>Historical price data for materials</CardDescription>
                    <Tabs defaultValue={selectedSymbol} onValueChange={setSelectedSymbol} className="mt-2">
                      <TabsList className="grid grid-cols-4 md:grid-cols-8">
                        {Object.entries(symbolMap).map(([symbol, name]) => (
                          <TabsTrigger key={symbol} value={symbol} className="text-xs md:text-sm">
                            {name}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  </CardHeader>
                  <CardContent>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedSymbol}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="h-[350px]"
                      >
                        <MaterialPriceChart symbol={selectedSymbol} />
                      </motion.div>
                    </AnimatePresence>

                    {prices[selectedSymbol] && (
                      <motion.div
                        className="grid grid-cols-3 gap-4 mt-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <div className="bg-primary/5 p-3 rounded-lg">
                          <h3 className="text-sm font-medium text-muted-foreground">Current Price</h3>
                          <p className="text-lg font-semibold">${prices[selectedSymbol].price}</p>
                        </div>
                        <div className="bg-primary/5 p-3 rounded-lg">
                          <h3 className="text-sm font-medium text-muted-foreground">24h High</h3>
                          <p className="text-lg font-semibold">${prices[selectedSymbol].high24h}</p>
                        </div>
                        <div className="bg-primary/5 p-3 rounded-lg">
                          <h3 className="text-sm font-medium text-muted-foreground">24h Low</h3>
                          <p className="text-lg font-semibold">${prices[selectedSymbol].low24h}</p>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                className="md:col-span-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm h-full flex flex-col">
                  <CardHeader>
                    <CardTitle>Gemini AI Assistant</CardTitle>
                    <CardDescription>Ask questions about materials, prices, or market trends</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                    <div className="space-y-4">
                      <AnimatePresence initial={false}>
                        {chatHistory.map((chat, index) => (
                          <motion.div
                            key={index}
                            className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div
                              className={`rounded-lg px-4 py-2 max-w-[80%] ${
                                chat.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}
                            >
                              {chat.content}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {isSending && (
                        <motion.div
                          className="flex justify-start"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="rounded-lg px-4 py-2 bg-muted">
                            <div className="flex space-x-1">
                              <motion.div
                                className="h-2 w-2 rounded-full bg-muted-foreground"
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                              />
                              <motion.div
                                className="h-2 w-2 rounded-full bg-muted-foreground"
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                              />
                              <motion.div
                                className="h-2 w-2 rounded-full bg-muted-foreground"
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                  <Separator />
                  <CardFooter className="pt-4">
                    <form
                      className="flex w-full gap-2"
                      onSubmit={(e) => {
                        e.preventDefault()
                        sendMessage()
                      }}
                    >
                      <Textarea
                        placeholder="Ask about materials, prices, or market trends..."
                        className="flex-1 min-h-10 resize-none bg-background/50"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={isSending}
                      />
                      <Button
                        type="submit"
                        size="icon"
                        disabled={isSending || !message.trim()}
                        className="bg-primary/90 hover:bg-primary transition-all duration-300"
                      >
                        <motion.div whileTap={{ scale: 0.9 }} whileHover={{ rotate: 15 }}>
                          <Search className="h-4 w-4" />
                        </motion.div>
                      </Button>
                    </form>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>All Materials</CardTitle>
                    <CardDescription>Complete list of material prices</CardDescription>
                  </div>
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search materials..."
                      className="w-full pl-8 bg-background/50"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Material</th>
                          <th className="text-right py-3 px-4">Price</th>
                          <th className="text-right py-3 px-4">24h Change</th>
                          <th className="text-right py-3 px-4">24h High</th>
                          <th className="text-right py-3 px-4">24h Low</th>
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence>
                          {filteredPrices.map((price, index) => {
                            const isPositive = price.priceChangePercent >= 0

                            return (
                              <motion.tr
                                key={price.symbol}
                                className="border-b"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                whileHover={{ backgroundColor: "rgba(var(--primary), 0.05)" }}
                              >
                                <td className="py-3 px-4 font-medium">{symbolMap[price.symbol] || price.symbol}</td>
                                <td className="text-right py-3 px-4">${price.price}</td>
                                <td
                                  className={`text-right py-3 px-4 ${isPositive ? "text-green-500" : "text-red-500"}`}
                                >
                                  <div className="flex items-center justify-end">
                                    {isPositive ? (
                                      <ArrowUp className="mr-1 h-4 w-4" />
                                    ) : (
                                      <ArrowDown className="mr-1 h-4 w-4" />
                                    )}
                                    <span>
                                      {isPositive ? "+" : ""}
                                      {price.priceChangePercent.toFixed(2)}%
                                    </span>
                                  </div>
                                </td>
                                <td className="text-right py-3 px-4">${price.high24h}</td>
                                <td className="text-right py-3 px-4">${price.low24h}</td>
                              </motion.tr>
                            )
                          })}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  )
}

