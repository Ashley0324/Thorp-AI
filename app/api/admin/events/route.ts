import { addEvent, updateEvent, deleteEvent, getAllEvents } from "@/lib/events-data"
import { isAuthenticated } from "@/lib/auth"
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

// 获取所有事件
export async function GET(request: Request) {
  try {
    const events = await getAllEvents()
    return NextResponse.json({ success: true, events })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ success: false, message: "获取事件失败" }, { status: 500 })
  }
}

// 添加事件
export async function POST(request: Request) {
  try {
    const isAuth = await isAuthenticated()
    if (!isAuth) {
      return NextResponse.json({ success: false, message: "未授权" }, { status: 401 })
    }

    const eventData = await request.json()
    const newEvent = await addEvent(eventData)

    // 重新验证相关路径
    revalidatePath("/news")
    revalidatePath("/admin/dashboard")

    return NextResponse.json({ success: true, event: newEvent })
  } catch (error) {
    console.error("Error adding event:", error)
    return NextResponse.json({ success: false, message: "添加事件失败" }, { status: 500 })
  }
}

// 更新事件
export async function PUT(request: Request) {
  try {
    const isAuth = await isAuthenticated()
    if (!isAuth) {
      return NextResponse.json({ success: false, message: "未授权" }, { status: 401 })
    }

    const { id, ...eventData } = await request.json()
    const updatedEvent = await updateEvent(id, eventData)

    if (!updatedEvent) {
      return NextResponse.json({ success: false, message: "事件不存在" }, { status: 404 })
    }

    // 重新验证相关路径
    revalidatePath("/news")
    revalidatePath("/admin/dashboard")

    return NextResponse.json({ success: true, event: updatedEvent })
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json({ success: false, message: "更新事件失败" }, { status: 500 })
  }
}

// 删除事件
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

    const success = await deleteEvent(id)

    if (!success) {
      return NextResponse.json({ success: false, message: "事件不存在" }, { status: 404 })
    }

    // 重新验证相关路径
    revalidatePath("/news")
    revalidatePath("/admin/dashboard")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json({ success: false, message: "删除事件失败" }, { status: 500 })
  }
}
