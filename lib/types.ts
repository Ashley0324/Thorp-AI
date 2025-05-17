// 定义事件类型
export interface Event {
  id: string
  title: string
  date: string
  description: string
  type: string
  impact: string
  priceEffect: string
}

// 定义新闻类型
export interface NewsItem {
  id: string
  title: string
  description: string
  url: string
  source: string
  date: string
  analysis?: string
}
