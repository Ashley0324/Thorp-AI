"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  getPrediction,
  getHistoricalPredictions,
  calculateAccuracy,
  type PredictionResult,
  type HistoricalPrediction,
} from "@/lib/ai-prediction"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BrainCircuit,
  CheckCircle,
  XCircle,
  Calendar,
  AlertCircle,
  Clock,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function PredictionPage() {
  const [predictions, setPredictions] = useState<{
    "24h": PredictionResult | null
    "7d": PredictionResult | null
    "30d": PredictionResult | null
  }>({
    "24h": null,
    "7d": null,
    "30d": null,
  })

  const [historicalPredictions, setHistoricalPredictions] = useState<{
    "24h": HistoricalPrediction[]
    "7d": HistoricalPrediction[]
    "30d": HistoricalPrediction[]
  }>({
    "24h": [],
    "7d": [],
    "30d": [],
  })

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"24h" | "7d" | "30d">("24h")

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        // Fetch predictions for all timeframes
        const [prediction24h, prediction7d, prediction30d, history24h, history7d, history30d] = await Promise.all([
          getPrediction("24h"),
          getPrediction("7d"),
          getPrediction("30d"),
          getHistoricalPredictions("24h"),
          getHistoricalPredictions("7d"),
          getHistoricalPredictions("30d"),
        ])

        setPredictions({
          "24h": prediction24h,
          "7d": prediction7d,
          "30d": prediction30d,
        })

        setHistoricalPredictions({
          "24h": history24h,
          "7d": history7d,
          "30d": history30d,
        })
      } catch (error) {
        console.error("Error fetching prediction data:", error)
        setError("Failed to fetch prediction data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Helper function to render prediction icon
  const renderPredictionIcon = (prediction: "up" | "down" | "sideways", size = 5) => {
    switch (prediction) {
      case "up":
        return <TrendingUp className={`h-${size} w-${size} text-green-500`} />
      case "down":
        return <TrendingDown className={`h-${size} w-${size} text-red-500`} />
      default:
        return <Minus className={`h-${size} w-${size} text-gray-500`} />
    }
  }

  // Calculate accuracy for the current timeframe
  const accuracy =
    historicalPredictions[activeTab]?.length > 0 ? calculateAccuracy(historicalPredictions[activeTab]) : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-foreground">AI预测</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs
        defaultValue="24h"
        className="w-full"
        onValueChange={(value) => setActiveTab(value as "24h" | "7d" | "30d")}
      >
        <TabsList className="bg-background/50 w-full grid grid-cols-3 overflow-x-auto">
          <TabsTrigger value="24h" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            24小时预测
          </TabsTrigger>
          <TabsTrigger value="7d" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            7天预测
          </TabsTrigger>
          <TabsTrigger value="30d" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            30天预测
          </TabsTrigger>
        </TabsList>

        <TabsContent value="24h">
          <PredictionContent
            prediction={predictions["24h"]}
            historicalPredictions={historicalPredictions["24h"] || []}
            accuracy={accuracy}
            loading={loading}
            timeframe="24h"
          />
        </TabsContent>

        <TabsContent value="7d">
          <PredictionContent
            prediction={predictions["7d"]}
            historicalPredictions={historicalPredictions["7d"] || []}
            accuracy={accuracy}
            loading={loading}
            timeframe="7d"
          />
        </TabsContent>

        <TabsContent value="30d">
          <PredictionContent
            prediction={predictions["30d"]}
            historicalPredictions={historicalPredictions["30d"] || []}
            accuracy={accuracy}
            loading={loading}
            timeframe="30d"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface PredictionContentProps {
  prediction: PredictionResult | null
  historicalPredictions: HistoricalPrediction[]
  accuracy: number
  loading: boolean
  timeframe: "24h" | "7d" | "30d"
}

function PredictionContent({
  prediction,
  historicalPredictions,
  accuracy,
  loading,
  timeframe,
}: PredictionContentProps) {
  // Helper function to render prediction icon
  const renderPredictionIcon = (prediction: "up" | "down" | "sideways", size = 5) => {
    switch (prediction) {
      case "up":
        return <TrendingUp className={`h-${size} w-${size} text-green-500`} />
      case "down":
        return <TrendingDown className={`h-${size} w-${size} text-red-500`} />
      default:
        return <Minus className={`h-${size} w-${size} text-gray-500`} />
    }
  }

  // Format timeframe for display
  const formatTimeframe = (timeframe: "24h" | "7d" | "30d") => {
    switch (timeframe) {
      case "24h":
        return "24小时"
      case "7d":
        return "7天"
      case "30d":
        return "30天"
    }
  }

  // Generate calendar data starting from May 1st
  const generateCalendarData = () => {
    // Start from May 1st, 2025
    const startDate = new Date(2025, 4, 1) // Month is 0-indexed, so 4 = May
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    // Create calendar grid
    const calendarDays = []

    // Get the first day of May (for spacing)
    const firstDayOfMay = startDate.getDay()

    // Add empty cells for days before May 1st
    for (let i = 0; i < firstDayOfMay; i++) {
      calendarDays.push({ day: null, predictions: [] })
    }

    // Map of dates to predictions for quick lookup
    const predictionsByDate = new Map()
    historicalPredictions.forEach((pred) => {
      const date = new Date(pred.timestamp)
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
      predictionsByDate.set(dateKey, pred)
    })

    // Add days from May 1st to today
    for (let date = new Date(startDate); date <= today; date.setDate(date.getDate() + 1)) {
      const day = date.getDate()
      const month = date.getMonth()
      const year = date.getFullYear()
      const dateKey = `${year}-${month}-${day}`

      // Get prediction for this day if available
      const dayPrediction = predictionsByDate.get(dateKey)
      const predictions = dayPrediction ? [dayPrediction] : []

      calendarDays.push({
        day,
        date: new Date(date),
        predictions,
      })
    }

    return calendarDays
  }

  const calendarData = generateCalendarData()

  // Calculate success and failure counts
  const successCount = historicalPredictions.filter((p) => p.wasCorrect === true).length
  const failureCount = historicalPredictions.filter((p) => p.wasCorrect === false).length
  const pendingCount = historicalPredictions.filter((p) => p.wasCorrect === null).length

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Current Prediction */}
      <Card className="lg:col-span-2 border-border/40 bg-background/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            {formatTimeframe(timeframe)}预测
          </CardTitle>
          <CardDescription>基于市场数据和技术指标的AI预测</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : prediction ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20">
                  {renderPredictionIcon(prediction.prediction, 8)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-center sm:text-left">
                    {prediction.prediction === "up" ? "上涨" : prediction.prediction === "down" ? "下跌" : "横盘"}
                  </h3>
                  <p className="text-muted-foreground text-center sm:text-left">
                    预计价格变化: {prediction.priceChange > 0 ? "+" : ""}
                    {prediction.priceChange.toFixed(2)}%
                  </p>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">置信度</span>
                  <span className="text-sm font-medium">{(prediction.confidence * 100).toFixed(1)}%</span>
                </div>
                <Progress
                  value={prediction.confidence * 100}
                  className="h-2 bg-primary/20"
                  indicatorClassName="bg-primary"
                />
              </div>

              <Alert className="bg-primary/5 border-primary/20">
                <BrainCircuit className="h-4 w-4 text-primary" />
                <AlertTitle>AI分析</AlertTitle>
                <AlertDescription>{prediction.reasoning}</AlertDescription>
              </Alert>

              <div className="text-xs text-muted-foreground">
                预测生成时间: {new Date(prediction.timestamp).toLocaleString()}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <BrainCircuit className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">无法获取预测</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Accuracy Card */}
      <Card className="border-border/40 bg-background/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            预测准确度
          </CardTitle>
          <CardDescription>预测统计 (5月1日至今)</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{accuracy.toFixed(1)}%</span>
                </div>
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#8400FF"
                    strokeWidth="10"
                    strokeDasharray={`${accuracy * 2.83} 283`}
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-col items-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <span className="text-sm text-muted-foreground">成功预测</span>
                  <span className="text-xl font-bold text-green-500">{successCount}</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <span className="text-sm text-muted-foreground">失败预测</span>
                  <span className="text-xl font-bold text-red-500">{failureCount}</span>
                </div>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-4">
                基于 {historicalPredictions.length - pendingCount} 个历史预测
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Calendar View */}
      <Card className="lg:col-span-3 border-border/40 bg-background/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            预测日历 (5月1日至今)
          </CardTitle>
          <CardDescription>历史预测记录和结果</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-1 text-center font-medium">
                <div className="p-2">周日</div>
                <div className="p-2">周一</div>
                <div className="p-2">周二</div>
                <div className="p-2">周三</div>
                <div className="p-2">周四</div>
                <div className="p-2">周五</div>
                <div className="p-2">周六</div>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarData.map((day, index) => {
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  const isToday =
                    day.day &&
                    day.date &&
                    today.getDate() === day.date.getDate() &&
                    today.getMonth() === day.date.getMonth() &&
                    today.getFullYear() === day.date.getFullYear()

                  return (
                    <div
                      key={index}
                      className={`min-h-[100px] p-2 border rounded-lg ${
                        day.day ? "border-border/40" : "border-transparent"
                      } ${isToday ? "bg-primary/5 border-primary/40" : ""}`}
                    >
                      {day.day && (
                        <>
                          <div className="text-right mb-1">{day.day}</div>
                          <div className="space-y-1">
                            {day.predictions.map((pred, i) => (
                              <div key={i} className="flex flex-col space-y-1">
                                {/* 预测方向 */}
                                <div
                                  className={`text-xs p-1 rounded flex items-center justify-center gap-1 ${
                                    pred.prediction === "up"
                                      ? "bg-green-500/20 text-green-500"
                                      : pred.prediction === "down"
                                        ? "bg-red-500/20 text-red-500"
                                        : "bg-gray-500/20 text-gray-500"
                                  }`}
                                >
                                  {pred.prediction === "up" ? (
                                    <TrendingUp className="h-3 w-3" />
                                  ) : pred.prediction === "down" ? (
                                    <TrendingDown className="h-3 w-3" />
                                  ) : (
                                    <Minus className="h-3 w-3" />
                                  )}
                                  <span>
                                    {pred.prediction === "up" ? "上涨" : pred.prediction === "down" ? "下跌" : "横盘"}
                                  </span>
                                </div>

                                {/* 预测结果 */}
                                {pred.wasCorrect !== null ? (
                                  <div
                                    className={`text-xs p-1 rounded flex justify-center ${
                                      pred.wasCorrect ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                    }`}
                                  >
                                    {pred.wasCorrect ? (
                                      <CheckCircle className="h-4 w-4" />
                                    ) : (
                                      <XCircle className="h-4 w-4" />
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-xs p-1 rounded flex justify-center bg-yellow-500/10 text-yellow-500">
                                    <Clock className="h-4 w-4" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground border-t border-border/40 px-6 py-3 flex flex-wrap justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>上涨预测</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>下跌预测</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span>横盘预测</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span>预测成功</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-3 w-3 text-red-500" />
            <span>预测失败</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-yellow-500" />
            <span>等待结果</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
