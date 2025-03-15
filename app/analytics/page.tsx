"use client"

import { PageTransition } from "../components/page-transition"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Navbar } from "../components/navbar"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts"
import { useState } from "react"

// Sample data for analytics
const monthlyData = [
  { name: "Jan", Gold: 1850, Silver: 24.5, Copper: 3.8, Platinum: 1050 },
  { name: "Feb", Gold: 1830, Silver: 23.8, Copper: 3.9, Platinum: 1030 },
  { name: "Mar", Gold: 1910, Silver: 25.2, Copper: 4.1, Platinum: 1080 },
  { name: "Apr", Gold: 1950, Silver: 26.0, Copper: 4.3, Platinum: 1100 },
  { name: "May", Gold: 1980, Silver: 26.5, Copper: 4.5, Platinum: 1120 },
  { name: "Jun", Gold: 2010, Silver: 27.2, Copper: 4.6, Platinum: 1150 },
  { name: "Jul", Gold: 2050, Silver: 28.0, Copper: 4.7, Platinum: 1180 },
  { name: "Aug", Gold: 2080, Silver: 28.5, Copper: 4.8, Platinum: 1200 },
  { name: "Sep", Gold: 2030, Silver: 27.8, Copper: 4.6, Platinum: 1170 },
  { name: "Oct", Gold: 2000, Silver: 27.0, Copper: 4.5, Platinum: 1140 },
  { name: "Nov", Gold: 2020, Silver: 27.5, Copper: 4.6, Platinum: 1160 },
  { name: "Dec", Gold: 2050, Silver: 28.2, Copper: 4.7, Platinum: 1190 },
]

const yearlyData = [
  { name: "2018", Gold: 1280, Silver: 15.5, Copper: 2.8, Platinum: 880 },
  { name: "2019", Gold: 1520, Silver: 18.0, Copper: 3.0, Platinum: 920 },
  { name: "2020", Gold: 1770, Silver: 20.5, Copper: 3.2, Platinum: 950 },
  { name: "2021", Gold: 1830, Silver: 23.0, Copper: 3.5, Platinum: 1000 },
  { name: "2022", Gold: 1880, Silver: 24.0, Copper: 3.7, Platinum: 1020 },
  { name: "2023", Gold: 1950, Silver: 25.5, Copper: 4.0, Platinum: 1080 },
  { name: "2024", Gold: 2050, Silver: 28.0, Copper: 4.7, Platinum: 1190 },
]

const correlationData = [
  { name: "Gold-Silver", value: 0.85, fill: "#8884d8" },
  { name: "Gold-Copper", value: 0.72, fill: "#82ca9d" },
  { name: "Gold-Platinum", value: 0.78, fill: "#ffc658" },
  { name: "Silver-Copper", value: 0.68, fill: "#ff8042" },
  { name: "Silver-Platinum", value: 0.65, fill: "#0088fe" },
  { name: "Copper-Platinum", value: 0.58, fill: "#00C49F" },
]

const marketShareData = [
  { name: "Gold", value: 45 },
  { name: "Silver", value: 25 },
  { name: "Copper", value: 15 },
  { name: "Platinum", value: 10 },
  { name: "Others", value: 5 },
]

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("monthly")

  const chartData = timeframe === "monthly" ? monthlyData : yearlyData

  return (
    <PageTransition>
      <Navbar />
      <div className="container py-6 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Materials Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive analytics and insights for precious metals and materials
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-4 mb-6">
          {[
            { title: "Gold", value: "$2,050.75", change: "+2.3%", color: "from-yellow-500 to-amber-300" },
            { title: "Silver", value: "$28.15", change: "+1.8%", color: "from-slate-400 to-slate-300" },
            { title: "Copper", value: "$4.72", change: "+0.5%", color: "from-orange-600 to-orange-400" },
            { title: "Platinum", value: "$1,190.50", change: "+1.2%", color: "from-blue-500 to-blue-300" },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <Card className="overflow-hidden border-none shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${item.color.split(" ")[1]}, ${item.color.split(" ")[3]})`,
                    }}
                  >
                    {item.value}
                  </div>
                  <div className="text-sm text-green-500 flex items-center">{item.change}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-none shadow-lg h-full">
              <CardHeader>
                <CardTitle>Price Trends</CardTitle>
                <CardDescription>Historical price movements</CardDescription>
                <div className="flex justify-end">
                  <Tabs defaultValue="monthly" onValueChange={setTimeframe}>
                    <TabsList>
                      <TabsTrigger value="monthly">Monthly</TabsTrigger>
                      <TabsTrigger value="yearly">Yearly</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" opacity={0.3} />
                      <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                      <YAxis stroke="var(--muted-foreground)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          borderColor: "var(--border)",
                          color: "var(--card-foreground)",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="Gold"
                        stroke="#FFD700"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Silver"
                        stroke="#C0C0C0"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Copper"
                        stroke="#B87333"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Platinum"
                        stroke="#E5E4E2"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-none shadow-lg h-full">
              <CardHeader>
                <CardTitle>Correlation Analysis</CardTitle>
                <CardDescription>Relationship between different materials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={correlationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" opacity={0.3} />
                      <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                      <YAxis stroke="var(--muted-foreground)" domain={[0, 1]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          borderColor: "var(--border)",
                          color: "var(--card-foreground)",
                        }}
                        formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, "Correlation"]}
                      />
                      <Legend />
                      <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Market Insights</CardTitle>
              <CardDescription>Key market indicators and analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Market Share by Trading Volume</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={marketShareData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" opacity={0.3} />
                        <XAxis type="number" stroke="var(--muted-foreground)" />
                        <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--card)",
                            borderColor: "var(--border)",
                            color: "var(--card-foreground)",
                          }}
                          formatter={(value) => [`${value}%`, "Market Share"]}
                        />
                        <Bar dataKey="value" fill="var(--primary)" radius={[0, 4, 4, 0]}>
                          {marketShareData.map((entry, index) => (
                            <motion.cell
                              key={`cell-${index}`}
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 1, delay: 0.1 * index }}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Key Market Indicators</h3>
                    <div className="space-y-4">
                      {[
                        { name: "Market Volatility", value: "Medium", trend: "Decreasing" },
                        { name: "Trading Volume", value: "1.2M contracts", trend: "Increasing" },
                        { name: "Investor Sentiment", value: "Bullish", trend: "Stable" },
                        { name: "Economic Impact", value: "Moderate", trend: "Stable" },
                      ].map((indicator, index) => (
                        <motion.div
                          key={indicator.name}
                          className="flex justify-between items-center p-3 rounded-lg bg-accent/50"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 * index }}
                          whileHover={{ backgroundColor: "var(--accent)" }}
                        >
                          <div>
                            <div className="font-medium">{indicator.name}</div>
                            <div className="text-sm text-muted-foreground">Trend: {indicator.trend}</div>
                          </div>
                          <div className="text-right font-semibold">{indicator.value}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  )
}

