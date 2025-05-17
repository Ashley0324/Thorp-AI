"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import type { Event } from "@/lib/events-data"

export default function EventsManager() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const { toast } = useToast()

  // 表单状态
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<"positive" | "negative" | "neutral">("neutral")
  const [impact, setImpact] = useState<"high" | "medium" | "low">("medium")
  const [priceEffect, setPriceEffect] = useState("")

  // 加载事件数据
  const loadEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/events")
      if (!response.ok) throw new Error("Failed to fetch events")

      const data = await response.json()
      setEvents(data.events || [])
    } catch (error) {
      console.error("Error loading events:", error)
      toast({
        title: "加载失败",
        description: "无法加载事件数据",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 初始加载
  useEffect(() => {
    loadEvents()
  }, [])

  // 重置表单
  const resetForm = () => {
    setTitle("")
    setDate("")
    setDescription("")
    setType("neutral")
    setImpact("medium")
    setPriceEffect("")
    setEditingEvent(null)
  }

  // 打开编辑表单
  const openEditForm = (event: Event) => {
    setEditingEvent(event)
    setTitle(event.title)
    setDate(event.date)
    setDescription(event.description)
    setType(event.type)
    setImpact(event.impact)
    setPriceEffect(event.priceEffect)
    setFormOpen(true)
  }

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const eventData = {
      title,
      date,
      description,
      type,
      impact,
      priceEffect,
    }

    try {
      let response

      if (editingEvent) {
        // 更新事件
        response = await fetch("/api/admin/events", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingEvent.id, ...eventData }),
        })
      } else {
        // 添加新事件
        response = await fetch("/api/admin/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        })
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "操作失败")
      }

      // 重新加载事件
      await loadEvents()

      // 关闭表单并重置
      setFormOpen(false)
      resetForm()

      toast({
        title: editingEvent ? "更新成功" : "添加成功",
        description: editingEvent ? "事件已更新" : "新事件已添加",
      })
    } catch (error) {
      console.error("Error submitting event:", error)
      toast({
        title: "操作失败",
        description: error instanceof Error ? error.message : "发生未知错误",
        variant: "destructive",
      })
    }
  }

  // 删除事件
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/events?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "删除失败")
      }

      // 重新加载事件
      await loadEvents()

      toast({
        title: "删除成功",
        description: "事件已删除",
      })
    } catch (error) {
      console.error("Error deleting event:", error)
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
        <h2 className="text-2xl font-bold">热点事件管理</h2>
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>添加新事件</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingEvent ? "编辑事件" : "添加新事件"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">标题</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">日期</Label>
                  <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
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

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">类型</Label>
                  <Select value={type} onValueChange={(value: any) => setType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="positive">利好</SelectItem>
                      <SelectItem value="negative">利空</SelectItem>
                      <SelectItem value="neutral">中性</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="impact">影响程度</Label>
                  <Select value={impact} onValueChange={(value: any) => setImpact(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择影响程度" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">高</SelectItem>
                      <SelectItem value="medium">中</SelectItem>
                      <SelectItem value="low">低</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priceEffect">价格影响</Label>
                  <Input
                    id="priceEffect"
                    value={priceEffect}
                    onChange={(e) => setPriceEffect(e.target.value)}
                    placeholder="例如: +2.5%"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                  取消
                </Button>
                <Button type="submit">{editingEvent ? "更新" : "添加"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>事件列表</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">加载中...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-4">暂无事件数据</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>标题</TableHead>
                  <TableHead>日期</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>影响</TableHead>
                  <TableHead>价格影响</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>{event.date}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          event.type === "positive"
                            ? "bg-green-100 text-green-800"
                            : event.type === "negative"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {event.type === "positive" ? "利好" : event.type === "negative" ? "利空" : "中性"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          event.impact === "high"
                            ? "bg-orange-100 text-orange-800"
                            : event.impact === "medium"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {event.impact === "high" ? "高" : event.impact === "medium" ? "中" : "低"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-medium ${
                          event.priceEffect.startsWith("+")
                            ? "text-green-600"
                            : event.priceEffect.startsWith("-")
                              ? "text-red-600"
                              : "text-gray-600"
                        }`}
                      >
                        {event.priceEffect}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditForm(event)}>
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
                                您确定要删除事件 "{event.title}" 吗？此操作无法撤销。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(event.id)}>删除</AlertDialogAction>
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
