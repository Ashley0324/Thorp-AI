import { addNews, updateNews, deleteNews, getAllNews } from "@/lib/events-data"
import { isAuthenticated } from "@/lib/auth"
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

// 获取所有新闻
export async function GET(request: Request) {
  try {
    const news = await getAllNews()
    return NextResponse.json({ success: true, news })
  } catch (error) {
    console.error("Error fetching news:", error)
    return NextResponse.json({ success: false, message: "获取新闻失败" }, { status: 500 })
  }
}

// 添加新闻
export async function POST(request: Request) {
  try {
    const isAuth = await isAuthenticated()
    if (!isAuth) {
      return NextResponse.json({ success: false, message: "未授权" }, { status: 401 })
    }

    const newsData = await request.json()
    const newNews = await addNews(newsData)

    // 重新验证相关路径
    revalidatePath("/news")
    revalidatePath("/admin/dashboard")

    return NextResponse.json({ success: true, news: newNews })
  } catch (error) {
    console.error("Error adding news:", error)
    return NextResponse.json({ success: false, message: "添加新闻失败" }, { status: 500 })
  }
}

// 更新新闻
export async function PUT(request: Request) {
  try {
    const isAuth = await isAuthenticated()
    if (!isAuth) {
      return NextResponse.json({ success: false, message: "未授权" }, { status: 401 })
    }

    const { id, ...newsData } = await request.json()
    const updatedNews = await updateNews(id, newsData)

    if (!updatedNews) {
      return NextResponse.json({ success: false, message: "新闻不存在" }, { status: 404 })
    }

    // 重新验证相关路径
    revalidatePath("/news")
    revalidatePath("/admin/dashboard")

    return NextResponse.json({ success: true, news: updatedNews })
  } catch (error) {
    console.error("Error updating news:", error)
    return NextResponse.json({ success: false, message: "更新新闻失败" }, { status: 500 })
  }
}

// 删除新闻
export async function DELETE(request: Request) {
  try {
    const isAuth = await isAuthenticated()
    if (!isAuth) {
      return NextResponse.json({ success: false, message: "未授权" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, message: "缺少ID参数" }, { status: 400 })
    }

    const success = await deleteNews(id)

    if (!success) {
      return NextResponse.json({ success: false, message: "新闻不存在" }, { status: 404 })
    }

    // 重新验证相关路径
    revalidatePath("/news")
    revalidatePath("/admin/dashboard")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting news:", error)
    return NextResponse.json({ success: false, message: "删除新闻失败" }, { status: 500 })
  }
}
