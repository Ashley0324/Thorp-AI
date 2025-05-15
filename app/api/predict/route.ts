import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { timeframe } = await req.json()

    if (!process.env.FASTGPT_API_KEY || !process.env.FASTGPT_API_URL) {
      throw new Error("Missing FastGPT API credentials")
    }

    // Mock response for now (in a real app we would call FastGPT API)
    const prediction = mockPrediction(timeframe)

    return NextResponse.json(prediction)
  } catch (error) {
    console.error("Prediction API error:", error)
    return NextResponse.json({ error: "Failed to generate prediction" }, { status: 500 })
  }
}

// Mock prediction function
function mockPrediction(timeframe: string) {
  // Generate a random prediction
  const predictions = ["up", "down", "sideways"]
  const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)] as "up" | "down" | "sideways"

  // Generate a random confidence value between 0.6 and 0.95
  const confidence = 0.6 + Math.random() * 0.35

  // Generate a random price change based on the prediction
  let priceChange = 0
  if (randomPrediction === "up") {
    priceChange = 1 + Math.random() * 5
  } else if (randomPrediction === "down") {
    priceChange = -1 - Math.random() * 5
  } else {
    priceChange = Math.random() * 0.5 - 0.25
  }

  // Generate reasoning based on timeframe and prediction
  let reasoning = ""
  if (timeframe === "24h") {
    reasoning = `根据24小时市场数据分析，BTC ${randomPrediction === "up" ? "短期动能增强，可能突破阻力位" : randomPrediction === "down" ? "短期动能减弱，可能跌破支撑位" : "将在当前区间内震荡"}`
  } else if (timeframe === "7d") {
    reasoning = `7天周期分析显示BTC ${randomPrediction === "up" ? "形成上升趋势，成交量有所增加" : randomPrediction === "down" ? "形成下降趋势，减仓信号明显" : "处于蓄势阶段，未形成明确趋势"}`
  } else {
    reasoning = `30天长周期分析表明BTC ${randomPrediction === "up" ? "有望进入上升通道，指标显示超跌反弹" : randomPrediction === "down" ? "可能进入下行通道，多项指标显示高位回落" : "将保持在较大的价格区间内波动"}`
  }

  return {
    timestamp: new Date().toISOString(),
    prediction: randomPrediction,
    confidence,
    priceChange,
    reasoning,
  }
}
