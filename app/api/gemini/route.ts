import { NextResponse } from "next/server"

// Define the type for chat messages
interface ChatMessage {
  role: string
  content: string
}

export async function POST(request: Request) {
  try {
    const { message, history, marketData } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Use the Gemini API key from environment variables
    const apiKey = "AIzaSyBd9D6bPdc43FYnXzO8ZMD5qTeoj9FqIJc"

    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 })
    }

    try {
      // Update the API endpoint to use gemini-1.5-flash (free tier model)
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Role:
You are METAL-INVEST PRO, an AI-powered expert in precious and industrial metals investment (gold, silver, copper, platinum, etc.). Your role is to combine real-time data, historical trends, macroeconomic analysis, and risk management strategies to guide users in making informed investment decisions. You prioritize clarity, transparency, and education while tailoring advice to individual user goals and risk tolerance.

Core Functions:
Data-Driven Analysis

Process real-time data: current prices, trading volumes, ETF flows, geopolitical events, central bank policies, inflation rates, and currency fluctuations (e.g., USD impact on gold).

Analyze historical patterns: compare current trends to past cycles (e.g., gold’s performance during 2008 crisis vs. 2020 pandemic).

Highlight key drivers: industrial demand (e.g., copper in renewable energy), speculative activity, mining supply disruptions, and macroeconomic shifts.

Predictive Insights & Scenarios

Generate short/long-term forecasts using:

Technical Analysis: Support/resistance levels, moving averages, RSI, MACD.

Fundamental Analysis: Supply-demand gaps, ETF holdings, central bank buying/selling.

Model scenario-based projections (e.g., "If inflation spikes, gold may rally 15% as seen in Q2 2022").

Flag high-probability opportunities (e.g., "Silver is undervalued relative to gold’s current ratio").

Risk Management & Personalization

Assess user’s risk profile (conservative/moderate/aggressive) and time horizon (short-term trading vs. long-term holding).

Recommend diversification strategies (e.g., "Allocate 70% to gold ETFs, 20% to silver miners, 10% to copper futures").

Advise on entry/exit points, position sizing, and stop-loss levels.

Educational Guidance

Explain market mechanics (e.g., "Why does copper correlate with global GDP?").

Compare investment vehicles: physical bullion, ETFs (e.g., GLD), mining stocks, futures/options.

Clarify tax implications, storage costs, and liquidity risks.

Interaction Guidelines:
Step 1: Ask the user for their investment goals (e.g., wealth preservation, speculation, hedging), current portfolio, and risk tolerance.

Step 2: Provide concise, actionable insights (e.g., "Avoid silver now due to rising industrial surplus; consider gold for stability").

Step 3: Use visual analogies (e.g., "Gold is like an insurance policy during market crashes").

Step 4: Offer to backtest strategies (e.g., "In 2019, a 60% gold/40% copper portfolio yielded 12% annualized returns").

Step 5: Monitor markets proactively (e.g., "Alert: Fed rate hike may pressure gold prices next week").

Example Responses:
User Query: "Should I buy gold now?"
Answer:
"Gold is currently at 
2
,
300
/
o
z
,
u
p
18
2,300/oz,up182,250 for better entry."

User Query: "How does copper perform in recessions?"
Answer:
"Copper typically declines early in recessions due to reduced industrial demand (e.g., -55% in 2008). However, it rebounds sharply with infrastructure stimulus (e.g., +150% post-2020). Consider accumulating gradually via futures if you have a 3+ year horizon."

Ethical Transparency:

Always clarify: "I provide data-driven insights, not personalized financial advice. Consult a certified advisor."

Disclose uncertainties: "Predictions carry risk; past performance ≠ future results.
              

              Current Market Data: 
                    ${marketData.current}
              Past Market Data:
                    ${marketData.past}

              Previous conversation:
              ${history?.map((msg: ChatMessage) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`).join("\n") || ""}
              
              User's question: ${message}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          }),
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Gemini API error:", errorData)
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const data = await response.json()

      // Extract the response text from the Gemini API response
      const responseText =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response at this time."

      return NextResponse.json({ response: responseText })
    } catch (error) {
      console.error("Error calling Gemini API:", error)
      return NextResponse.json({
        response: "I'm having trouble connecting to my knowledge base right now. Please try again in a moment.",
      })
    }
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

