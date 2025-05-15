// AI prediction service using FastGPT API

export interface PredictionResult {
  timestamp: string
  prediction: "up" | "down" | "sideways"
  confidence: number
  priceChange: number
  reasoning: string
}

export interface HistoricalPrediction extends PredictionResult {
  actual: "up" | "down" | "sideways"
  actualChange: number
  wasCorrect: boolean
}

export async function getPrediction(timeframe: "24h" | "7d" | "30d"): Promise<PredictionResult> {
  try {
    const response = await fetch("/api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ timeframe }),
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting prediction:", error)
    return {
      timestamp: new Date().toISOString(),
      prediction: "sideways",
      confidence: 0.5,
      priceChange: 0,
      reasoning: "Failed to get prediction",
    }
  }
}

export async function getHistoricalPredictions(timeframe: "24h" | "7d" | "30d"): Promise<HistoricalPrediction[]> {
  // In a real app, you would fetch from a database
  // This is a simplified mock implementation

  const mockData: HistoricalPrediction[] = []
  const today = new Date()

  // Generate 30 days of mock historical predictions
  for (let i = 30; i > 0; i--) {
    const predictionDate = new Date(today)
    predictionDate.setDate(today.getDate() - i)

    const prediction: "up" | "down" | "sideways" =
      Math.random() > 0.6 ? "up" : Math.random() > 0.5 ? "down" : "sideways"
    const priceChange =
      prediction === "up" ? Math.random() * 5 : prediction === "down" ? -Math.random() * 5 : Math.random() * 0.5 - 0.25

    const actual: "up" | "down" | "sideways" = Math.random() > 0.6 ? "up" : Math.random() > 0.5 ? "down" : "sideways"
    const actualChange =
      actual === "up" ? Math.random() * 5 : actual === "down" ? -Math.random() * 5 : Math.random() * 0.5 - 0.25

    mockData.push({
      timestamp: predictionDate.toISOString(),
      prediction,
      confidence: 0.5 + Math.random() * 0.4,
      priceChange,
      reasoning: `Based on ${timeframe} analysis of market trends and indicators`,
      actual,
      actualChange,
      wasCorrect: prediction === actual,
    })
  }

  return mockData
}

export function calculateAccuracy(predictions: HistoricalPrediction[]): number {
  if (predictions.length === 0) return 0

  const correctPredictions = predictions.filter((p) => p.wasCorrect).length
  return (correctPredictions / predictions.length) * 100
}
