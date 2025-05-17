import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { requireAuth } from "@/lib/auth"
import Link from "next/link"
import EventsManager from "./events-manager"
import NewsManager from "./news-manager"

export default async function AdminDashboardPage() {
  // 确保用户已认证
  await requireAuth()

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">管理员仪表板</h1>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/">返回首页</Link>
          </Button>
          <form action="/api/admin/logout" method="POST">
            <Button type="submit" variant="destructive">
              登出
            </Button>
          </form>
        </div>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="events">热点事件管理</TabsTrigger>
          <TabsTrigger value="news">新闻管理</TabsTrigger>
        </TabsList>
        <TabsContent value="events" className="mt-6">
          <EventsManager />
        </TabsContent>
        <TabsContent value="news" className="mt-6">
          <NewsManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
