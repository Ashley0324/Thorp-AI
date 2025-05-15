// News API client for fetching crypto news

export interface NewsItem {
  id: string
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
  sentiment: "positive" | "negative" | "neutral"
  impact: "high" | "medium" | "low"
  priceEffect: "bullish" | "bearish" | "neutral"
  reason?: string
}

export interface EventItem {
  id: string
  title: string
  description: string
  date: string
  type: "regulatory" | "market" | "technical" | "adoption" | "other"
  impact: "high" | "medium" | "low"
  priceEffect: "bullish" | "bearish" | "neutral"
}

// Mock data for news
const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "SEC Approves Bitcoin ETF Applications",
    description:
      "The U.S. Securities and Exchange Commission has approved multiple Bitcoin ETF applications, marking a significant milestone for cryptocurrency adoption.",
    url: "https://example.com/news/1",
    source: "CryptoNews",
    publishedAt: "2023-01-10T14:30:00Z",
    sentiment: "positive",
    impact: "high",
    priceEffect: "bullish",
    reason: "ETF approval increases institutional access to Bitcoin, potentially bringing significant capital inflows.",
  },
  {
    id: "2",
    title: "Major Bank Announces Bitcoin Custody Services",
    description:
      "One of the world's largest banks has announced plans to offer Bitcoin custody services to institutional clients.",
    url: "https://example.com/news/2",
    source: "Financial Times",
    publishedAt: "2023-01-15T09:45:00Z",
    sentiment: "positive",
    impact: "medium",
    priceEffect: "bullish",
    reason: "Increased institutional adoption and legitimacy for Bitcoin as an asset class.",
  },
  {
    id: "3",
    title: "China Reinforces Cryptocurrency Ban",
    description:
      "Chinese authorities have issued new guidelines reinforcing the ban on cryptocurrency trading and mining activities.",
    url: "https://example.com/news/3",
    source: "BBC News",
    publishedAt: "2023-01-20T16:15:00Z",
    sentiment: "negative",
    impact: "medium",
    priceEffect: "bearish",
    reason: "Regulatory crackdowns in major markets can reduce trading volume and investor confidence.",
  },
  {
    id: "4",
    title: "Bitcoin Mining Difficulty Reaches All-Time High",
    description:
      "Bitcoin mining difficulty has adjusted upward to a new all-time high, reflecting increased competition among miners.",
    url: "https://example.com/news/4",
    source: "CoinDesk",
    publishedAt: "2023-01-25T11:20:00Z",
    sentiment: "neutral",
    impact: "low",
    priceEffect: "neutral",
    reason: "Higher mining difficulty indicates network security but may impact miner profitability.",
  },
  {
    id: "5",
    title: "Major Retailer Begins Accepting Bitcoin Payments",
    description:
      "A major global retailer has announced it will begin accepting Bitcoin as payment for goods and services.",
    url: "https://example.com/news/5",
    source: "Reuters",
    publishedAt: "2023-01-30T13:10:00Z",
    sentiment: "positive",
    impact: "medium",
    priceEffect: "bullish",
    reason: "Increased utility and adoption of Bitcoin for everyday transactions.",
  },
]

// Mock data for upcoming events
const mockEvents: EventItem[] = [
  {
    id: "1",
    title: "Bitcoin Halving Event",
    description: "The Bitcoin block reward will be cut in half, reducing the rate at which new bitcoins are created.",
    date: "2024-04-15",
    type: "technical",
    impact: "high",
    priceEffect: "bullish",
  },
  {
    id: "2",
    title: "U.S. Crypto Regulation Bill Vote",
    description: "The U.S. Congress is scheduled to vote on a comprehensive cryptocurrency regulation bill.",
    date: "2023-03-10",
    type: "regulatory",
    impact: "high",
    priceEffect: "neutral",
  },
  {
    id: "3",
    title: "Bitcoin Conference 2023",
    description: "Major annual Bitcoin conference with announcements from industry leaders.",
    date: "2023-06-20",
    type: "market",
    impact: "medium",
    priceEffect: "bullish",
  },
  {
    id: "4",
    title: "Bitcoin Core Update Release",
    description: "Major update to the Bitcoin Core software with new features and improvements.",
    date: "2023-08-05",
    type: "technical",
    impact: "medium",
    priceEffect: "neutral",
  },
  {
    id: "5",
    title: "Central Bank Digital Currency Announcement",
    description:
      "Major central bank expected to announce plans for a digital currency that could compete with Bitcoin.",
    date: "2023-09-15",
    type: "regulatory",
    impact: "high",
    priceEffect: "bearish",
  },
]

export async function getLatestNews(): Promise<NewsItem[]> {
  // In a real app, you would fetch from a news API
  // This is a simplified mock implementation
  return mockNews
}

export async function getUpcomingEvents(): Promise<EventItem[]> {
  // In a real app, you would fetch from an events API or database
  // This is a simplified mock implementation
  return mockEvents
}

export async function analyzeNewsWithAI(newsItem: NewsItem): Promise<{
  sentiment: "positive" | "negative" | "neutral"
  impact: "high" | "medium" | "low"
  priceEffect: "bullish" | "bearish" | "neutral"
  reason: string
}> {
  // In a real app, you would call the FastGPT API here
  // For now, we'll return the mock data
  return {
    sentiment: newsItem.sentiment,
    impact: newsItem.impact,
    priceEffect: newsItem.priceEffect,
    reason: newsItem.reason || "Analysis not available",
  }
}
