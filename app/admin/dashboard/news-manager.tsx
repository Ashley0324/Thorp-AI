"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import type { NewsItem } from "@/lib/events-data"

export default function NewsManager() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null)
  const { toast } = useToast()

  // 表单状态
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [url, setUrl] = useState("")
  const [source, setSource] = useState("")
  const [date, setDate] = useState("")
  const [analysis, setAnalysis] = useState("")

  // 加载新闻数据
  const loadNews = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/news")
      if (!response.ok) throw new Error("Failed to fetch news")

      const data = await response.json()
      setNews(data.news || [])
    } catch (error) {
      console.error("Error loading news:", error)
      toast({
        title: "加载失败",
        description: "无法加载新闻数据",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 初始加载
  useEffect(() => {
    loadNews()
  }, [])

  // 重置表单
  const resetForm = () => {
    setTitle("")
    setDescription("")
    setUrl("")
    setSource("")
    setDate("")
    setAnalysis("")
    setEditingNews(null)
  }

  // 打开编辑表单
  const openEditForm = (newsItem: NewsItem) => {
    setEditingNews(newsItem)
    setTitle(newsItem.title)
    setDescription(newsItem.description)
    setUrl(newsItem.url)
    setSource(newsItem.source)
    setDate(newsItem.date)
    setAnalysis(newsItem.analysis || "")
    setFormOpen(true)
  }

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newsData = {
      title,
      description,
      url,
      source,
      date,
      analysis: analysis || undefined,
    }

    try {
      let response

      if (editingNews) {
        // 更新新闻
        response = await fetch("/api/admin/news", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingNews.id, ...newsData }),
        })
      } else {
        // 添加新新闻
        response = await fetch("/api/admin/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newsData),
        })
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "操作失败")
      }

      // 重新加载新闻
      await loadNews()

      // 关闭表单并重置
      setFormOpen(false)
      resetForm()

      toast({
        title: editingNews ? "更新成功" : "添加成功",
        description: editingNews ? "新闻已更新" : "新新闻已添加",
      })
    } catch (error) {
      console.error("Error submitting news:", error)
      toast({
        title: "操作失败",
        description: error instanceof Error ? error.message : "发生未知错误",
        variant: "destructive",
      })
    }
  }

  // 删除新闻
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/news?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "删除失败")
      }

      // 重新加载新闻
      await loadNews()

      toast({
        title: "删除成功",
        description: "新闻已删除",
      })
    } catch (error) {
      console.error("Error deleting news:", error)
      toast({
        title: "删除失败",
        description: error instanceof Error ? error.message : "发生未知错误",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">新闻管理</h2>
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>添加新闻</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingNews ? "编辑新闻" : "添加新闻"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">标题</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source">来源</Label>
                  <Input id="source" value={source} onChange={(e) => setSource(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">日期</Label>
                  <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">链接</Label>
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/news"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">描述</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="analysis">分析（可选）</Label>
                <Textarea
                  id="analysis"
                  value={analysis}
                  onChange={(e) => setAnalysis(e.target.value)}
                  rows={3}
                  placeholder="对该新闻的分析和影响评估"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                  取消
                </Button>
                <Button type="submit">{editingNews ? "更新" : "添加"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>新闻列表</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">加载中...</div>
          ) : news.length === 0 ? (
            <div className="text-center py-4">暂无新闻数据</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>标题</TableHead>
                  <TableHead>来源</TableHead>
                  <TableHead>日期</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {news.map((newsItem) => (
                  <TableRow key={newsItem.id}>
                    <TableCell className="font-medium">{newsItem.title}</TableCell>
                    <TableCell>{newsItem.source}</TableCell>
                    <TableCell>{newsItem.date}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditForm(newsItem)}>
                          编辑
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              删除
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>确认删除</AlertDialogTitle>
                              <AlertDialogDescription>
                                您确定要删除新闻 "{newsItem.title}" 吗？此操作无法撤销。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(newsItem.id)}>删除</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
