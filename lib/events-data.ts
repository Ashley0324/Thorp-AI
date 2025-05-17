// 添加 'use server' 指令，确保这个文件只在服务器端执行
"use server"

import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

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

// 数据目录和文件路径
const DATA_DIR = path.join(process.cwd(), "data")
const EVENTS_FILE = path.join(DATA_DIR, "events.json")
const NEWS_FILE = path.join(DATA_DIR, "news.json")

// 确保数据目录存在
function ensureDataDirExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// 确保事件文件存在
function ensureEventsFileExists() {
  ensureDataDirExists()
  if (!fs.existsSync(EVENTS_FILE)) {
    fs.writeFileSync(EVENTS_FILE, JSON.stringify([]), "utf8")
  }
}

// 确保新闻文件存在
function ensureNewsFileExists() {
  ensureDataDirExists()
  if (!fs.existsSync(NEWS_FILE)) {
    fs.writeFileSync(NEWS_FILE, JSON.stringify([]), "utf8")
  }
}

// 获取所有事件
export async function getAllEvents(): Promise<Event[]> {
  try {
    ensureEventsFileExists()
    const data = fs.readFileSync(EVENTS_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading events file:", error)
    return []
  }
}

// 获取所有新闻
export async function getAllNews(): Promise<NewsItem[]> {
  try {
    ensureNewsFileExists()
    const data = fs.readFileSync(NEWS_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading news file:", error)
    return []
  }
}

// 添加事件
export async function addEvent(event: Omit<Event, "id">): Promise<Event> {
  const events = await getAllEvents()
  const newEvent = { ...event, id: uuidv4() }
  events.push(newEvent)
  fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2), "utf8")
  return newEvent
}

// 更新事件
export async function updateEvent(id: string, event: Omit<Event, "id">): Promise<Event | null> {
  const events = await getAllEvents()
  const index = events.findIndex((e) => e.id === id)
  if (index === -1) return null

  const updatedEvent = { ...event, id }
  events[index] = updatedEvent
  fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2), "utf8")
  return updatedEvent
}

// 删除事件
export async function deleteEvent(id: string): Promise<boolean> {
  const events = await getAllEvents()
  const filteredEvents = events.filter((e) => e.id !== id)
  if (filteredEvents.length === events.length) return false

  fs.writeFileSync(EVENTS_FILE, JSON.stringify(filteredEvents, null, 2), "utf8")
  return true
}

// 添加新闻
export async function addNews(news: Omit<NewsItem, "id">): Promise<NewsItem> {
  const newsItems = await getAllNews()
  const newNews = { ...news, id: uuidv4() }
  newsItems.push(newNews)
  fs.writeFileSync(NEWS_FILE, JSON.stringify(newsItems, null, 2), "utf8")
  return newNews
}

// 更新新闻
export async function updateNews(id: string, news: Omit<NewsItem, "id">): Promise<NewsItem | null> {
  const newsItems = await getAllNews()
  const index = newsItems.findIndex((n) => n.id === id)
  if (index === -1) return null

  const updatedNews = { ...news, id }
  newsItems[index] = updatedNews
  fs.writeFileSync(NEWS_FILE, JSON.stringify(newsItems, null, 2), "utf8")
  return updatedNews
}

// 删除新闻
export async function deleteNews(id: string): Promise<boolean> {
  const newsItems = await getAllNews()
  const filteredNews = newsItems.filter((n) => n.id !== id)
  if (filteredNews.length === newsItems.length) return false

  fs.writeFileSync(NEWS_FILE, JSON.stringify(filteredNews, null, 2), "utf8")
  return true
}
