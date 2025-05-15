"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, BarChart, Bar } from "recharts"
import { getBTCKlines } from "@/lib/binance-api"
import { calculateRSI, calculateMACD, calculateBollingerBands, generateSignals } from "@/lib/indicators"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, CheckCircle, XCircle, LineChartIcon, Activity, TrendingUp, Gauge } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function IndicatorsPage() {
  const [timeframe, setTimeframe] = useState<string>("1d")
  const [klineData, setKlineData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [signals, setSignals] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<string>("rsi")

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        // Fetch a larger dataset for better indicator calculation
        const klines = await getBTCKlines(timeframe, 200)
        setKlineData(klines)

        // Calculate signals
        const prices = klines.map((k) => Number.parseFloat(k.close))
        const calculatedSignals = generateSignals(prices)
        setSignals(calculatedSignals)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeframe])

  // Format data for charts
  const formatChartData = () => {
    if (klineData.length === 0) return []

    const prices = klineData.map((k) => Number.parseFloat(k.close))
    const dates = klineData.map((k) => new Date(k.openTime).toLocaleDateString())

    // Calculate indicators
    const rsiValues = calculateRSI(prices)
    const { macdLine, signalLine, histogram } = calculateMACD(prices)
    const { upper, middle, lower } = calculateBollingerBands(prices)

    // Create chart data based on active tab
    switch (activeTab) {
      case "rsi":
        return dates
          .map((date, i) => ({
            date,
            price: prices[i],
            rsi: i < prices.length - rsiValues.length ? null : rsiValues[i - (prices.length - rsiValues.length)],
          }))
          .slice(-30) // Show last 30 data points

      case "macd":
        return dates
          .map((date, i) => ({
            date,
            price: prices[i],
            macd: i < prices.length - macdLine.length ? null : macdLine[i - (prices.length - macdLine.length)],
            signal: i < prices.length - signalLine.length ? null : signalLine[i - (prices.length - signalLine.length)],
            histogram: i < prices.length - histogram.length ? null : histogram[i - (prices.length - histogram.length)],
          }))
          .slice(-30)

      case "bollinger":
        return dates
          .map((date, i) => ({
            date,
            price: prices[i],
            upper: i < prices.length - upper.length ? null : upper[i - (prices.length - upper.length)],
            middle: i < prices.length - middle.length ? null : middle[i - (prices.length - middle.length)],
            lower: i < prices.length - lower.length ? null : lower[i - (prices.length - lower.length)],
          }))
          .slice(-30)

      default:
        return dates
          .map((date, i) => ({
            date,
            price: prices[i],
          }))
          .slice(-30)
    }
  }

  const chartData = formatChartData()

  // Helper function to render signal badge
  const renderSignalBadge = (signal: "buy" | "sell" | "neutral") => {
    switch (signal) {
      case "buy":
        return <Badge className="bg-green-500 hover:bg-green-600">买入</Badge>
      case "sell":
        return <Badge className="bg-red-500 hover:bg-red-600">卖出</Badge>
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">中性</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-300">
          BTC指标分析
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">数据更新时间:</span>
          <span className="text-sm">{new Date().toLocaleString()}</span>
        </div>
      </div>

      {/* Timeframe selector */}
      <Card className="border-border/40 bg-background/60 backdrop-blur-sm">
        <CardContent className="p-4">
          <Tabs defaultValue="1d" className="w-full">
            <TabsList className="bg-background/50 w-full sm:w-auto grid grid-cols-4 sm:flex">
              <TabsTrigger
                value="1h"
                onClick={() => setTimeframe("1h")}
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                1小时
              </TabsTrigger>
              <TabsTrigger
                value="4h"
                onClick={() => setTimeframe("4h")}
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                4小时
              </TabsTrigger>
              <TabsTrigger
                value="1d"
                onClick={() => setTimeframe("1d")}
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                日线
              </TabsTrigger>
              <TabsTrigger
                value="1w"
                onClick={() => setTimeframe("1w")}
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                周线
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Signal Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="card-hover border-border/40 bg-background/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              RSI
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="flex flex-col">
                <div className="text-2xl font-bold mb-1 text-primary">{signals?.rsi.value.toFixed(2)}</div>
                {renderSignalBadge(signals?.rsi.signal)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="card-hover border-border/40 bg-background/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <LineChartIcon className="h-4 w-4 text-primary" />
              MACD
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="flex flex-col">
                <div className="text-2xl font-bold mb-1 text-primary">信号线交叉</div>
                {renderSignalBadge(signals?.macd.signal)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="card-hover border-border/40 bg-background/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              布林带
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="flex flex-col">
                <div className="text-2xl font-bold mb-1 text-primary">价格位置</div>
                {renderSignalBadge(signals?.bollingerBands.signal)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="card-hover border-border/40 bg-background/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-primary" />
              Pi Cycle Top
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="flex flex-col">
                <div className="text-2xl font-bold mb-1 text-primary">周期顶部</div>
                {renderSignalBadge(signals?.piCycle.signal)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="card-hover border-border/40 bg-background/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Mayer Multiple
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="flex flex-col">
                <div className="text-2xl font-bold mb-1 text-primary">{signals?.mayerMultiple.value.toFixed(2)}</div>
                {renderSignalBadge(signals?.mayerMultiple.signal)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Overall Signal */}
      {!loading && signals && (
        <Alert
          className={
            Object.values(signals).filter((s: any) => s.signal === "buy").length >
            Object.values(signals).filter((s: any) => s.signal === "sell").length
              ? "bg-green-500/10 border-green-500"
              : Object.values(signals).filter((s: any) => s.signal === "sell").length >
                  Object.values(signals).filter((s: any) => s.signal === "buy").length
                ? "bg-red-500/10 border-red-500"
                : "bg-gray-500/10 border-gray-500"
          }
        >
          {Object.values(signals).filter((s: any) => s.signal === "buy").length >
          Object.values(signals).filter((s: any) => s.signal === "sell").length ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : Object.values(signals).filter((s: any) => s.signal === "sell").length >
            Object.values(signals).filter((s: any) => s.signal === "buy").length ? (
            <XCircle className="h-5 w-5 text-red-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-gray-500" />
          )}
          <AlertTitle>
            {Object.values(signals).filter((s: any) => s.signal === "buy").length >
            Object.values(signals).filter((s: any) => s.signal === "sell").length
              ? "买入信号"
              : Object.values(signals).filter((s: any) => s.signal === "sell").length >
                  Object.values(signals).filter((s: any) => s.signal === "buy").length
                ? "卖出信号"
                : "中性信号"}
          </AlertTitle>
          <AlertDescription>
            {Object.values(signals).filter((s: any) => s.signal === "buy").length} 个买入信号，
            {Object.values(signals).filter((s: any) => s.signal === "sell").length} 个卖出信号，
            {Object.values(signals).filter((s: any) => s.signal === "neutral").length} 个中性信号
          </AlertDescription>
        </Alert>
      )}

      {/* Indicator Charts */}
      <Tabs defaultValue="rsi" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="bg-background/50 w-full sm:w-auto grid grid-cols-2 sm:grid-cols-5 sm:flex">
          <TabsTrigger value="rsi" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            RSI
          </TabsTrigger>
          <TabsTrigger value="macd" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            MACD
          </TabsTrigger>
          <TabsTrigger value="bollinger" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            布林带
          </TabsTrigger>
          <TabsTrigger value="rainbow" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            彩虹图
          </TabsTrigger>
          <TabsTrigger value="mayer" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Mayer Multiple
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rsi">
          <Card className="border-border/40 bg-background/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                相对强弱指数 (RSI)
              </CardTitle>
              <CardDescription>
                RSI是一种动量指标，测量价格变化的速度和变化的幅度。RSI值在0到100之间波动。
                传统上，RSI高于70被认为是超买状态，低于30被认为是超卖状态。
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              {loading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <div className="space-y-8">
                  <div className="h-[180px] md:h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8400FF" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8400FF" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.5)" }} />
                        <YAxis
                          domain={["auto", "auto"]}
                          tickFormatter={(value) => `$${value.toLocaleString()}`}
                          stroke="rgba(255,255,255,0.5)"
                          tick={{ fill: "rgba(255,255,255,0.5)" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(30, 30, 30, 0.8)",
                            borderColor: "#8400FF",
                            borderRadius: "8px",
                          }}
                          labelStyle={{ color: "#fff" }}
                          itemStyle={{ color: "#fff" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="price"
                          name="价格"
                          stroke="#8400FF"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6, fill: "#8400FF", stroke: "#fff", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="h-[180px] md:h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.5)" }} />
                        <YAxis
                          domain={[0, 100]}
                          stroke="rgba(255,255,255,0.5)"
                          tick={{ fill: "rgba(255,255,255,0.5)" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(30, 30, 30, 0.8)",
                            borderColor: "#8400FF",
                            borderRadius: "8px",
                          }}
                          labelStyle={{ color: "#fff" }}
                          itemStyle={{ color: "#fff" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="rsi"
                          name="RSI"
                          stroke="#8400FF"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6, fill: "#8400FF", stroke: "#fff", strokeWidth: 2 }}
                        />
                        {/* Overbought line */}
                        <Line
                          type="monotone"
                          dataKey={() => 70}
                          name="超买"
                          stroke="rgba(255,107,0,0.5)"
                          strokeWidth={1}
                          strokeDasharray="3 3"
                          dot={false}
                        />
                        {/* Oversold line */}
                        <Line
                          type="monotone"
                          dataKey={() => 30}
                          name="超卖"
                          stroke="rgba(0,184,255,0.5)"
                          strokeWidth={1}
                          strokeDasharray="3 3"
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="macd">
          <Card className="border-border/40 bg-background/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChartIcon className="h-5 w-5 text-primary" />
                移动平均线收敛散度 (MACD)
              </CardTitle>
              <CardDescription>
                MACD是一种趋势跟踪动量指标，显示两条移动平均线之间的关系。
                当MACD线穿过信号线时，可能表示买入或卖出信号。
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              {loading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <div className="space-y-8">
                  <div className="h-[180px] md:h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.5)" }} />
                        <YAxis
                          domain={["auto", "auto"]}
                          tickFormatter={(value) => `$${value.toLocaleString()}`}
                          stroke="rgba(255,255,255,0.5)"
                          tick={{ fill: "rgba(255,255,255,0.5)" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(30, 30, 30, 0.8)",
                            borderColor: "#8400FF",
                            borderRadius: "8px",
                          }}
                          labelStyle={{ color: "#fff" }}
                          itemStyle={{ color: "#fff" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="price"
                          name="价格"
                          stroke="#8400FF"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6, fill: "#8400FF", stroke: "#fff", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="h-[180px] md:h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.5)" }} />
                        <YAxis
                          domain={["auto", "auto"]}
                          stroke="rgba(255,255,255,0.5)"
                          tick={{ fill: "rgba(255,255,255,0.5)" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(30, 30, 30, 0.8)",
                            borderColor: "#8400FF",
                            borderRadius: "8px",
                          }}
                          labelStyle={{ color: "#fff" }}
                          itemStyle={{ color: "#fff" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="macd"
                          name="MACD线"
                          stroke="#8400FF"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6, fill: "#8400FF", stroke: "#fff", strokeWidth: 2 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="signal"
                          name="信号线"
                          stroke="#ff6b00"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6, fill: "#ff6b00", stroke: "#fff", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="h-[120px] md:h-[150px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.5)" }} />
                        <YAxis
                          domain={["auto", "auto"]}
                          stroke="rgba(255,255,255,0.5)"
                          tick={{ fill: "rgba(255,255,255,0.5)" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(30, 30, 30, 0.8)",
                            borderColor: "#8400FF",
                            borderRadius: "8px",
                          }}
                          labelStyle={{ color: "#fff" }}
                          itemStyle={{ color: "#fff" }}
                        />
                        <Bar
                          dataKey="histogram"
                          name="柱状图"
                          fill={(entry) => (entry.histogram >= 0 ? "#8400FF" : "#ff6b00")}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bollinger">
          <Card className="border-border/40 bg-background/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                布林带
              </CardTitle>
              <CardDescription>
                布林带是一种波动性指标，由中轨（通常是20日移动平均线）和上下轨（中轨加减两个标准差）组成。
                价格接近上轨可能表示超买，接近下轨可能表示超卖。
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              {loading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <div className="h-[300px] md:h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.5)" }} />
                      <YAxis
                        domain={["auto", "auto"]}
                        tickFormatter={(value) => `$${value.toLocaleString()}`}
                        stroke="rgba(255,255,255,0.5)"
                        tick={{ fill: "rgba(255,255,255,0.5)" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(30, 30, 30, 0.8)",
                          borderColor: "#8400FF",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "#fff" }}
                        itemStyle={{ color: "#fff" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="upper"
                        name="上轨"
                        stroke="#ff6b00"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6, fill: "#ff6b00", stroke: "#fff", strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="middle"
                        name="中轨"
                        stroke="#8400FF"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6, fill: "#8400FF", stroke: "#fff", strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="lower"
                        name="下轨"
                        stroke="#00b8ff"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6, fill: "#00b8ff", stroke: "#fff", strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        name="价格"
                        stroke="#fff"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6, fill: "#fff", stroke: "#8400FF", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rainbow">
          <Card className="border-border/40 bg-background/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                比特币彩虹图
              </CardTitle>
              <CardDescription>
                比特币彩虹图是一种长期价格分析工具，使用对数回归和标准差带来可视化比特币的价格周期。
                不同颜色区域代表不同的市场状态，从"极度低估"到"极度高估"。
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              {loading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">彩虹图需要更长时间的历史数据，请稍后查看</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mayer">
          <Card className="border-border/40 bg-background/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-primary" />
                Mayer Multiple
              </CardTitle>
              <CardDescription>
                Mayer Multiple是比特币价格与200日移动平均线的比率。
                历史上，低于0.8的值表示可能是买入机会，高于2.4的值表示可能是卖出机会。
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              {loading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <div className="space-y-8">
                  <div className="h-[180px] md:h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.5)" }} />
                        <YAxis
                          domain={["auto", "auto"]}
                          tickFormatter={(value) => `$${value.toLocaleString()}`}
                          stroke="rgba(255,255,255,0.5)"
                          tick={{ fill: "rgba(255,255,255,0.5)" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(30, 30, 30, 0.8)",
                            borderColor: "#8400FF",
                            borderRadius: "8px",
                          }}
                          labelStyle={{ color: "#fff" }}
                          itemStyle={{ color: "#fff" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="price"
                          name="价格"
                          stroke="#8400FF"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6, fill: "#8400FF", stroke: "#fff", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <Alert className="bg-primary/5 border-primary/20">
                    <Gauge className="h-5 w-5 text-primary" />
                    <AlertTitle>当前 Mayer Multiple: {signals?.mayerMultiple.value.toFixed(2)}</AlertTitle>
                    <AlertDescription>
                      {signals?.mayerMultiple.value < 0.8
                        ? "当前值低于0.8，历史上这通常是买入比特币的良好时机。"
                        : signals?.mayerMultiple.value > 2.4
                          ? "当前值高于2.4，历史上这通常表明比特币可能被高估。"
                          : "当前值在正常范围内，既不明显高估也不明显低估。"}
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
