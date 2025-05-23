"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, Tooltip } from "recharts"
import { getBTC24hTicker, getBTCKlines, getExchangePrices, getFundingRates } from "@/lib/binance-api"
import { getBTCDominance, getFearGreedIndex } from "@/lib/market-api"
import { formatCurrency, formatPercent } from "@/lib/utils"
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  TrendingUp,
  TrendingDown,
  Gauge,
  Bitcoin,
  BarChart3,
  AlertCircle,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"

interface MarketData {
  ticker: any
  klines: any[]
  exchanges: { exchange: string; price: number }[]
  fundingRates: { exchange: string; rate: number }[]
  fearGreedIndex: number
  btcDominance: number
}

export default function MarketOverview() {
  const { t } = useLanguage()
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [timeframe, setTimeframe] = useState<string>("1d")
  const [loading, setLoading] = useState<boolean>(true)
  const [apiErrors, setApiErrors] = useState<{
    fearGreed: boolean
    dominance: boolean
  }>({
    fearGreed: false,
    dominance: false,
  })

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [ticker, klines, exchanges, fundingRates, fearGreedIndex, btcDominance] = await Promise.all([
          getBTC24hTicker(),
          getBTCKlines(timeframe, 30),
          getExchangePrices(),
          getFundingRates(),
          getFearGreedIndex().catch((err) => {
            console.error("Error fetching Fear & Greed Index:", err)
            setApiErrors((prev) => ({ ...prev, fearGreed: true }))
            return 50 // Fallback value
          }),
          getBTCDominance().catch((err) => {
            console.error("Error fetching BTC dominance:", err)
            setApiErrors((prev) => ({ ...prev, dominance: true }))
            return 50 // Fallback value
          }),
        ])

        setMarketData({
          ticker,
          klines,
          exchanges,
          fundingRates,
          fearGreedIndex,
          btcDominance,
        })
      } catch (error) {
        console.error("Error fetching market data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [timeframe])

  // Format kline data for charts
  const chartData =
    marketData?.klines.map((kline) => ({
      time: new Date(kline.openTime).toLocaleDateString(),
      price: Number.parseFloat(kline.close),
      volume: Number.parseFloat(kline.volume) / 1000, // Convert to thousands for better display
    })) || []

  // Calculate price change direction
  const priceChange = marketData?.ticker ? Number.parseFloat(marketData.ticker.priceChangePercent) : 0
  const priceDirection = priceChange > 0 ? "up" : priceChange < 0 ? "down" : "neutral"

  // Format fear & greed index status
  const getFearGreedStatus = (value: number) => {
    if (value <= 25) return t("extremeFear")
    if (value <= 45) return t("fear")
    if (value <= 55) return t("neutral")
    if (value <= 75) return t("greed")
    return t("extremeGreed")
  }

  const getFearGreedColor = (value: number) => {
    if (value <= 25) return "text-red-500"
    if (value <= 45) return "text-orange-500"
    if (value <= 55) return "text-yellow-500"
    if (value <= 75) return "text-green-500"
    return "text-green-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-foreground">{t("marketOverview")}</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{t("dataUpdateTime")}:</span>
          <span className="text-sm">{new Date().toLocaleString()}</span>
        </div>
      </div>

      {/* Price Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-hover border-border/40 bg-background/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Bitcoin className="h-4 w-4 text-primary" />
              {t("currentPrice")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="text-2xl font-bold">
                {marketData?.ticker ? formatCurrency(Number.parseFloat(marketData.ticker.lastPrice)) : "N/A"}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="card-hover border-border/40 bg-background/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              {priceDirection === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : priceDirection === "down" ? (
                <TrendingDown className="h-4 w-4 text-red-500" />
              ) : (
                <ArrowRightIcon className="h-4 w-4" />
              )}
              {t("24hChange")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="flex items-center">
                <span
                  className={`text-2xl font-bold ${
                    priceDirection === "up" ? "text-green-500" : priceDirection === "down" ? "text-red-500" : ""
                  }`}
                >
                  {marketData?.ticker
                    ? formatPercent(Number.parseFloat(marketData.ticker.priceChangePercent) / 100)
                    : "N/A"}
                </span>
                <span className="ml-2">
                  {priceDirection === "up" ? (
                    <ArrowUpIcon className="h-5 w-5 text-green-500" />
                  ) : priceDirection === "down" ? (
                    <ArrowDownIcon className="h-5 w-5 text-red-500" />
                  ) : (
                    <ArrowRightIcon className="h-5 w-5" />
                  )}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="card-hover border-border/40 bg-background/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              {t("24hHigh")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="text-2xl font-bold">
                {marketData?.ticker ? formatCurrency(Number.parseFloat(marketData.ticker.highPrice)) : "N/A"}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="card-hover border-border/40 bg-background/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-primary" />
              {t("24hLow")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="text-2xl font-bold">
                {marketData?.ticker ? formatCurrency(Number.parseFloat(marketData.ticker.lowPrice)) : "N/A"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Market Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="card-hover border-border/40 bg-background/60 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              {t("btcDominance")}
            </CardTitle>
            {apiErrors.dominance && (
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/50">
                <AlertCircle className="h-3 w-3 mr-1" />
                {t("apiError")}
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold mb-2 text-foreground">
                  {marketData ? formatPercent(marketData.btcDominance / 100) : "N/A"}
                </div>
                <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full"
                    style={{ width: `${marketData?.btcDominance || 0}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{t("btcDominanceDesc")}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="card-hover border-border/40 bg-background/60 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-primary" />
              {t("fearGreedIndex")}
            </CardTitle>
            {apiErrors.fearGreed && (
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/50">
                <AlertCircle className="h-3 w-3 mr-1" />
                {t("apiError")}
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <div className="flex flex-col items-center">
                <div
                  className={`text-4xl font-bold mb-2 ${marketData ? getFearGreedColor(marketData.fearGreedIndex) : ""}`}
                >
                  {marketData?.fearGreedIndex || "N/A"}
                </div>
                <div className="w-full h-4 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white dark:bg-black opacity-30 rounded-full"
                    style={{
                      width: `${100 - (marketData?.fearGreedIndex || 0)}%`,
                      marginLeft: `${marketData?.fearGreedIndex || 0}%`,
                    }}
                  ></div>
                </div>
                <p
                  className={`text-sm mt-2 font-medium ${marketData ? getFearGreedColor(marketData.fearGreedIndex) : ""}`}
                >
                  {marketData ? getFearGreedStatus(marketData.fearGreedIndex) : "N/A"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Price Chart */}
      <Card className="border-border/40 bg-background/60 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" />
              {t("priceChart")}
            </CardTitle>
            <Tabs defaultValue="1d" className="w-full sm:w-auto">
              <TabsList className="bg-background/50">
                <TabsTrigger
                  value="1h"
                  onClick={() => setTimeframe("1h")}
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  {t("1hour")}
                </TabsTrigger>
                <TabsTrigger
                  value="4h"
                  onClick={() => setTimeframe("4h")}
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  {t("4hour")}
                </TabsTrigger>
                <TabsTrigger
                  value="1d"
                  onClick={() => setTimeframe("1d")}
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  {t("daily")}
                </TabsTrigger>
                <TabsTrigger
                  value="1w"
                  onClick={() => setTimeframe("1w")}
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  {t("weekly")}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <div className="h-[300px] md:h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8400FF" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8400FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.5)" }} />
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
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#8400FF"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, fill: "#8400FF", stroke: "#fff", strokeWidth: 2 }}
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Volume Chart */}
      <Card className="border-border/40 bg-background/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            {t("volume")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <div className="h-[250px] md:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a743ff" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#a743ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.5)" }} />
                  <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.5)" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(30, 30, 30, 0.8)",
                      borderColor: "#a743ff",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#fff" }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="volume"
                    stroke="#a743ff"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorVolume)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Exchange Prices and Funding Rates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="card-hover border-border/40 bg-background/60 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bitcoin className="h-5 w-5 text-primary" />
              {t("exchangePriceComparison")}
            </CardTitle>
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/50">
              <AlertCircle className="h-3 w-3 mr-1" />
              {t("partialMockData")}
            </Badge>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-primary/5">
                      <TableHead className="text-foreground">{t("exchange")}</TableHead>
                      <TableHead className="text-right text-foreground">{t("price")}</TableHead>
                      <TableHead className="text-right text-foreground">{t("diffFromAvg")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {marketData?.exchanges.map((exchange) => {
                      const avgPrice =
                        marketData.exchanges.reduce((sum, e) => sum + e.price, 0) / marketData.exchanges.length
                      const diff = ((exchange.price - avgPrice) / avgPrice) * 100

                      return (
                        <TableRow key={exchange.exchange} className="hover:bg-primary/5 border-b border-border/40">
                          <TableCell className="font-medium">{exchange.exchange}</TableCell>
                          <TableCell className="text-right">{formatCurrency(exchange.price)}</TableCell>
                          <TableCell
                            className={`text-right ${diff > 0 ? "text-green-500" : diff < 0 ? "text-red-500" : ""}`}
                          >
                            {diff > 0 ? "+" : ""}
                            {diff.toFixed(3)}%
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="card-hover border-border/40 bg-background/60 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {t("fundingRate")}
            </CardTitle>
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/50">
              <AlertCircle className="h-3 w-3 mr-1" />
              {t("partialMockData")}
            </Badge>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-primary/5">
                      <TableHead className="text-foreground">{t("exchange")}</TableHead>
                      <TableHead className="text-right text-foreground">{t("rate")}</TableHead>
                      <TableHead className="text-right text-foreground">{t("annualized")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {marketData?.fundingRates.map((item) => {
                      // Funding rate is typically paid every 8 hours, so multiply by 3 for daily and 365*3 for annual
                      const annualRate = item.rate * 3 * 365 * 100

                      return (
                        <TableRow key={item.exchange} className="hover:bg-primary/5 border-b border-border/40">
                          <TableCell className="font-medium">{item.exchange}</TableCell>
                          <TableCell
                            className={`text-right ${item.rate > 0 ? "text-green-500" : item.rate < 0 ? "text-red-500" : ""}`}
                          >
                            {(item.rate * 100).toFixed(4)}%
                          </TableCell>
                          <TableCell
                            className={`text-right ${annualRate > 0 ? "text-green-500" : annualRate < 0 ? "text-red-500" : ""}`}
                          >
                            {annualRate.toFixed(2)}%
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground border-t border-border/40 px-6 py-3">
            {t("fundingRateDesc")}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
