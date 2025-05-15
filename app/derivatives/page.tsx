"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  getDerivativesProducts,
  calculateArbitrageOpportunities,
  type DerivativeProduct,
  type ArbitrageOpportunity,
} from "@/lib/derivatives-api"
import { formatCurrency, formatPercent } from "@/lib/utils"
import { AlertCircle, ArrowRightLeft, TrendingUp, Bitcoin } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DerivativesPage() {
  const [derivatives, setDerivatives] = useState<DerivativeProduct[]>([])
  const [arbitrageOpportunities, setArbitrageOpportunities] = useState<ArbitrageOpportunity[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<string>("perpetual")

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [derivativesData, arbitrageData] = await Promise.all([
          getDerivativesProducts(),
          calculateArbitrageOpportunities(),
        ])

        setDerivatives(derivativesData)
        setArbitrageOpportunities(arbitrageData)
      } catch (error) {
        console.error("Error fetching derivatives data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  // Filter derivatives by type
  const filteredDerivatives = derivatives.filter((d) => {
    switch (activeTab) {
      case "perpetual":
        return d.type === "perpetual"
      case "futures":
        return d.type === "futures"
      case "options":
        return d.type === "options"
      default:
        return true
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-300">
          BTC衍生品价格
        </h1>
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/50">
          <AlertCircle className="h-3 w-3 mr-1" />
          模拟数据
        </Badge>
      </div>

      <Tabs defaultValue="perpetual" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="bg-background/50 w-full sm:w-auto grid grid-cols-2 sm:grid-cols-4 sm:flex">
          <TabsTrigger value="perpetual" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            永续合约
          </TabsTrigger>
          <TabsTrigger value="futures" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            期货合约
          </TabsTrigger>
          <TabsTrigger value="options" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            期权合约
          </TabsTrigger>
          <TabsTrigger value="arbitrage" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            套利机会
          </TabsTrigger>
        </TabsList>

        <TabsContent value="perpetual">
          <Card className="border-border/40 bg-background/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bitcoin className="h-5 w-5 text-primary" />
                永续合约
              </CardTitle>
              <CardDescription>
                永续合约是一种没有到期日的衍生品合约，通过资金费率机制保持价格与现货市场接近。
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-primary/5">
                        <TableHead className="text-primary">交易所</TableHead>
                        <TableHead className="text-primary">合约</TableHead>
                        <TableHead className="text-right text-primary">价格</TableHead>
                        <TableHead className="text-right text-primary">标记价格</TableHead>
                        <TableHead className="text-right text-primary">资金费率</TableHead>
                        <TableHead className="text-right text-primary">持仓量</TableHead>
                        <TableHead className="text-right text-primary">24小时成交量</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDerivatives.map((derivative) => (
                        <TableRow
                          key={`${derivative.exchange}-${derivative.symbol}`}
                          className="hover:bg-primary/5 border-b border-border/40"
                        >
                          <TableCell className="font-medium">{derivative.exchange}</TableCell>
                          <TableCell>{derivative.symbol}</TableCell>
                          <TableCell className="text-right">{formatCurrency(derivative.price)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(derivative.markPrice)}</TableCell>
                          <TableCell
                            className={`text-right ${
                              derivative.fundingRate && derivative.fundingRate > 0
                                ? "text-green-500"
                                : derivative.fundingRate && derivative.fundingRate < 0
                                  ? "text-red-500"
                                  : ""
                            }`}
                          >
                            {derivative.fundingRate ? `${(derivative.fundingRate * 100).toFixed(4)}%` : "N/A"}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(derivative.openInterest, "USD", 0)}
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(derivative.volume24h, "USD", 0)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="futures">
          <Card className="border-border/40 bg-background/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                期货合约
              </CardTitle>
              <CardDescription>
                期货合约是一种有到期日的衍生品合约，允许交易者在未来特定日期以预定价格买卖比特币。
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-primary/5">
                        <TableHead className="text-primary">交易所</TableHead>
                        <TableHead className="text-primary">合约</TableHead>
                        <TableHead className="text-right text-primary">价格</TableHead>
                        <TableHead className="text-right text-primary">标记价格</TableHead>
                        <TableHead className="text-right text-primary">到期日</TableHead>
                        <TableHead className="text-right text-primary">持仓量</TableHead>
                        <TableHead className="text-right text-primary">24小时成交量</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDerivatives.map((derivative) => (
                        <TableRow
                          key={`${derivative.exchange}-${derivative.symbol}`}
                          className="hover:bg-primary/5 border-b border-border/40"
                        >
                          <TableCell className="font-medium">{derivative.exchange}</TableCell>
                          <TableCell>{derivative.symbol}</TableCell>
                          <TableCell className="text-right">{formatCurrency(derivative.price)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(derivative.markPrice)}</TableCell>
                          <TableCell className="text-right">{derivative.expiryDate || "N/A"}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(derivative.openInterest, "USD", 0)}
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(derivative.volume24h, "USD", 0)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="options">
          <Card className="border-border/40 bg-background/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                期权合约
              </CardTitle>
              <CardDescription>
                期权合约赋予持有者在特定日期以特定价格买入（看涨期权）或卖出（看跌期权）比特币的权利，但没有义务。
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-primary/5">
                        <TableHead className="text-primary">交易所</TableHead>
                        <TableHead className="text-primary">合约</TableHead>
                        <TableHead className="text-right text-primary">价格</TableHead>
                        <TableHead className="text-right text-primary">标记价格</TableHead>
                        <TableHead className="text-right text-primary">行权价</TableHead>
                        <TableHead className="text-right text-primary">到期日</TableHead>
                        <TableHead className="text-right text-primary">持仓量</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDerivatives.map((derivative) => (
                        <TableRow
                          key={`${derivative.exchange}-${derivative.symbol}`}
                          className="hover:bg-primary/5 border-b border-border/40"
                        >
                          <TableCell className="font-medium">{derivative.exchange}</TableCell>
                          <TableCell>{derivative.symbol}</TableCell>
                          <TableCell className="text-right">{formatCurrency(derivative.price)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(derivative.markPrice)}</TableCell>
                          <TableCell className="text-right">
                            {derivative.strikePrice ? formatCurrency(derivative.strikePrice) : "N/A"}
                          </TableCell>
                          <TableCell className="text-right">{derivative.expiryDate || "N/A"}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(derivative.openInterest, "USD", 0)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="arbitrage">
          <Card className="border-border/40 bg-background/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-primary" />
                套利机会
              </CardTitle>
              <CardDescription>
                套利是利用不同市场或产品之间的价格差异进行无风险或低风险交易，获取利润的策略。
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : arbitrageOpportunities.length > 0 ? (
                <div className="space-y-4">
                  {arbitrageOpportunities.map((opportunity, index) => (
                    <Card key={index} className="card-hover border-primary/20 bg-background/40">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <ArrowRightLeft className="h-5 w-5 text-primary" />
                            套利机会 #{index + 1}
                          </CardTitle>
                          <Badge
                            className={
                              Math.abs(opportunity.percentageDifference) > 0.5 ? "bg-green-500" : "bg-blue-500"
                            }
                          >
                            {Math.abs(opportunity.percentageDifference) > 0.5 ? "高收益" : "低收益"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                            <p className="font-semibold">
                              {opportunity.product1.exchange} - {opportunity.product1.symbol}
                            </p>
                            <p className="text-sm text-muted-foreground">类型: {opportunity.product1.type}</p>
                            <p className="text-lg mt-1">{formatCurrency(opportunity.product1.price)}</p>
                          </div>
                          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                            <p className="font-semibold">
                              {opportunity.product2.exchange} - {opportunity.product2.symbol}
                            </p>
                            <p className="text-sm text-muted-foreground">类型: {opportunity.product2.type}</p>
                            <p className="text-lg mt-1">{formatCurrency(opportunity.product2.price)}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                          <div className="flex flex-col items-center p-3 bg-primary/5 rounded-lg border border-primary/20">
                            <p className="text-sm text-muted-foreground">价格差异</p>
                            <p className="text-lg font-semibold text-primary">
                              {formatCurrency(Math.abs(opportunity.priceDifference))}
                            </p>
                          </div>
                          <div className="flex flex-col items-center p-3 bg-primary/5 rounded-lg border border-primary/20">
                            <p className="text-sm text-muted-foreground">百分比差异</p>
                            <p className="text-lg font-semibold text-primary">
                              {formatPercent(Math.abs(opportunity.percentageDifference) / 100)}
                            </p>
                          </div>
                          <div className="flex flex-col items-center p-3 bg-primary/5 rounded-lg border border-primary/20">
                            <p className="text-sm text-muted-foreground">估计利润</p>
                            <p className="text-lg font-semibold text-green-500">
                              {formatCurrency(opportunity.estimatedProfit)}
                            </p>
                          </div>
                        </div>

                        <Alert className="bg-primary/5 border-primary/20">
                          <AlertCircle className="h-4 w-4 text-primary" />
                          <AlertTitle>套利策略</AlertTitle>
                          <AlertDescription>{opportunity.strategy}</AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">当前没有显著的套利机会</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
