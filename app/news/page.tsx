"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getLatestNews, getUpcomingEvents, type NewsItem, type EventItem } from "@/lib/news-api"
import { Calendar } from "@/components/ui/calendar"
import { TrendingUp, TrendingDown, Minus, AlertCircle, CalendarIcon } from "lucide-react"

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [newsData, eventsData] = await Promise.all([getLatestNews(), getUpcomingEvents()])

        setNews(newsData)
        setEvents(eventsData)
      } catch (error) {
        console.error("Error fetching news data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter events by selected date
  const filteredEvents = selectedDate
    ? events.filter((event) => {
        const eventDate = new Date(event.date)
        return eventDate.toDateString() === selectedDate.toDateString()
      })
    : []

  // Helper function to render sentiment icon
  const renderSentimentIcon = (sentiment: "positive" | "negative" | "neutral", size = 5) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className={`h-${size} w-${size} text-green-500`} />
      case "negative":
        return <TrendingDown className={`h-${size} w-${size} text-red-500`} />
      default:
        return <Minus className={`h-${size} w-${size} text-gray-500`} />
    }
  }

  // Helper function to render impact badge
  const renderImpactBadge = (impact: "high" | "medium" | "low") => {
    switch (impact) {
      case "high":
        return <Badge className="bg-red-500 hover:bg-red-600">高影响</Badge>
      case "medium":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">中等影响</Badge>
      default:
        return <Badge className="bg-blue-500 hover:bg-blue-600">低影响</Badge>
    }
  }

  // Helper function to render event type badge
  const renderEventTypeBadge = (type: string) => {
    switch (type) {
      case "regulatory":
        return <Badge className="bg-purple-500 hover:bg-purple-600">监管</Badge>
      case "market":
        return <Badge className="bg-blue-500 hover:bg-blue-600">市场</Badge>
      case "technical":
        return <Badge className="bg-green-500 hover:bg-green-600">技术</Badge>
      case "adoption":
        return <Badge className="bg-orange-500 hover:bg-orange-600">采用</Badge>
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">其他</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-foreground">热点事件</h1>
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/50">
          <AlertCircle className="h-3 w-3 mr-1" />
          模拟数据
        </Badge>
      </div>

      <Tabs defaultValue="news" className="w-full">
        <TabsList className="bg-background/50 w-full grid grid-cols-2 overflow-x-auto">
          <TabsTrigger value="news" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            最新新闻
          </TabsTrigger>
          <TabsTrigger value="events" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            事件日历
          </TabsTrigger>
        </TabsList>

        <TabsContent value="news">
          <div className="grid grid-cols-1 gap-6">
            {loading
              ? Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="border-border/40 bg-background/60 backdrop-blur-sm">
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/4 mt-2" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full mt-2" />
                        <Skeleton className="h-4 w-2/3 mt-2" />
                      </CardContent>
                      <CardFooter>
                        <Skeleton className="h-4 w-1/3" />
                      </CardFooter>
                    </Card>
                  ))
              : news.map((item) => (
                  <Card
                    key={item.id}
                    className={`card-hover border-border/40 bg-background/60 backdrop-blur-sm ${
                      item.priceEffect === "bullish"
                        ? "border-l-4 border-l-green-500"
                        : item.priceEffect === "bearish"
                          ? "border-l-4 border-l-red-500"
                          : "border-l-4 border-l-gray-500"
                    }`}
                  >
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div>
                          <CardTitle className="text-xl">{item.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <span>{item.source}</span>
                            <span>•</span>
                            <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                          {renderSentimentIcon(item.sentiment)}
                          {renderImpactBadge(item.impact)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="px-2 sm:px-6">
                      <p className="text-muted-foreground">{item.description}</p>

                      <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-5 w-5 text-primary" />
                          <h4 className="font-semibold">AI 分析</h4>
                        </div>
                        <p className="text-sm">
                          <span className="font-semibold">价格影响: </span>
                          <span
                            className={`
                          ${
                            item.priceEffect === "bullish"
                              ? "text-green-500"
                              : item.priceEffect === "bearish"
                                ? "text-red-500"
                                : ""
                          }
                        `}
                          >
                            {item.priceEffect === "bullish" ? "看涨" : item.priceEffect === "bearish" ? "看跌" : "中性"}
                          </span>
                        </p>
                        <p className="text-sm mt-1">{item.reason}</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm"
                      >
                        阅读原文 →
                      </a>
                    </CardFooter>
                  </Card>
                ))}
          </div>
        </TabsContent>

        <TabsContent value="events">
          <div className="flex flex-col gap-6">
            <Card className="border-border/40 bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  事件日历
                </CardTitle>
                <CardDescription>选择日期查看事件</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center sm:justify-start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border border-border/40 max-w-full"
                    classNames={{
                      day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                      day_today: "bg-primary/10 text-primary",
                      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                      month: "space-y-4 w-full",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex w-full",
                      row: "flex w-full mt-2",
                      head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] sm:w-10",
                      cell: "h-9 w-9 text-center text-sm p-0 relative sm:w-10 sm:h-10",
                      day: "h-9 w-9 p-0 font-normal sm:w-10 sm:h-10",
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-background/60 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{selectedDate ? selectedDate.toLocaleDateString() : "所有事件"}</CardTitle>
                  <CardDescription>{filteredEvents.length} 个事件</CardDescription>
                </div>
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/50">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  模拟数据
                </Badge>
              </CardHeader>
              <CardContent>
                {loading ? (
                  Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="mb-4">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full mt-2" />
                        <Skeleton className="h-4 w-2/3 mt-2" />
                      </div>
                    ))
                ) : filteredEvents.length > 0 ? (
                  <div className="space-y-4">
                    {filteredEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`p-4 rounded-lg border card-hover ${
                          event.priceEffect === "bullish"
                            ? "border-l-4 border-l-green-500"
                            : event.priceEffect === "bearish"
                              ? "border-l-4 border-l-red-500"
                              : "border-l-4 border-l-gray-500"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          <div className="flex flex-wrap items-center gap-2">
                            {renderEventTypeBadge(event.type)}
                            {renderImpactBadge(event.impact)}
                          </div>
                        </div>
                        <p className="text-muted-foreground mt-2">{event.description}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-sm font-medium">预期价格影响:</span>
                          <span
                            className={`text-sm ${
                              event.priceEffect === "bullish"
                                ? "text-green-500"
                                : event.priceEffect === "bearish"
                                  ? "text-red-500"
                                  : ""
                            }`}
                          >
                            {event.priceEffect === "bullish"
                              ? "看涨"
                              : event.priceEffect === "bearish"
                                ? "看跌"
                                : "中性"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">所选日期没有事件</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
