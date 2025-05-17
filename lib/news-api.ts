import { getAllEvents, getAllNews, type Event } from "./events-data"
import type { EventItem, NewsItem } from "./news-types" // 新增导入接口文件

// 模拟数据，当没有真实数据时使用
const mockEvents: Event[] = [
  {
    id: "1",
    title: "美联储加息25个基点",
    date: "2023-07-26",
    description: "美联储宣布加息25个基点，将基准利率上调至5.25%-5.5%区间，为2001年以来的最高水平。",
    type: "negative",
    impact: "high",
    priceEffect: "-2.5%",
  },
  {
    id: "2",
    title: "比特币ETF申请获SEC初步审核通过",
    date: "2023-08-15",
    description: "多家机构提交的比特币现货ETF申请获得SEC初步审核通过，市场预期年内有望正式获批。",
    type: "positive",
    impact: "high",
    priceEffect: "+8.3%",
  },
  // 更多模拟数据...
]

const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "MicroStrategy再次增持比特币",
    description: "企业软件公司MicroStrategy宣布再次购入5,000枚比特币，总持仓量超过15万枚。",
    url: "https://example.com/news/1",
    source: "CoinDesk",
    date: "2023-09-10",
    analysis: "机构持续增持显示长期信心，短期可能提振市场情绪。",
  },
  {
    id: "2",
    title: "El Salvador总统宣布每日购买比特币计划",
    description: "El Salvador总统Nayib Bukele宣布该国将开始执行每日购买比特币的计划，进一步增加国家储备。",
    url: "https://example.com/news/2",
    source: "Bitcoin Magazine",
    date: "2023-09-05",
    analysis: "主权国家持续购买比特币将为市场带来新的需求来源。",
  },
  // 更多模拟数据...
]

// 获取热点事件
export async function getEvents(): Promise<EventItem[]> {
  try {
    // 尝试获取真实数据
    const realEvents = await getAllEvents()

    // 如果有真实数据，则返回真实数据，否则返回模拟数据
    return realEvents.length > 0 ? realEvents : mockEvents
  } catch (error) {
    console.error("Error fetching events:", error)
    // 出错时返回模拟数据
    return mockEvents
  }
}

// 获取新闻
export async function getNews(): Promise<NewsItem[]> {
  try {
    // 尝试获取真实数据
    const realNews = await getAllNews()

    // 如果有真实数据，则返回真实数据，否则返回模拟数据
    return realNews.length > 0 ? realNews : mockNews
  } catch (error) {
    console.error("Error fetching news:", error)
    // 出错时返回模拟数据
    return mockNews
  }
}

// 添加缺失的导出函数，保持向后兼容性
export const getLatestNews = getNews
export const getUpcomingEvents = getEvents
