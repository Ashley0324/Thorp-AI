"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { addEvent, updateEvent, deleteEvent, addNews, updateNews, deleteNews } from "@/lib/events-data"
import { isAuthenticated } from "@/lib/auth"

// 登出操作
export async function logoutAction() {
  const { logout } = await import("@/lib/auth")
  await logout()
  redirect("/admin/login")
}

// 事件操作
export async function createEvent(formData: FormData) {
  const isAuth = await isAuthenticated()
  if (!isAuth) {
    return { success: false, message: "未授权" }
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const date = formData.get("date") as string
  const type = formData.get("type") as string
  const impact = formData.get("impact") as string
  const priceEffect = formData.get("priceEffect") as string

  if (!title || !description || !date || !type || !impact || !priceEffect) {
    return { success: false, message: "所有字段都是必填的" }
  }

  try {
    await addEvent({
      title,
      description,
      date,
      type,
      impact,
      priceEffect,
    })

    revalidatePath("/admin/dashboard")
    revalidatePath("/news")
    return { success: true }
  } catch (error) {
    console.error("Error creating event:", error)
    return { success: false, message: "创建事件失败" }
  }
}

export async function updateEventAction(id: string, formData: FormData) {
  const isAuth = await isAuthenticated()
  if (!isAuth) {
    return { success: false, message: "未授权" }
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const date = formData.get("date") as string
  const type = formData.get("type") as string
  const impact = formData.get("impact") as string
  const priceEffect = formData.get("priceEffect") as string

  if (!title || !description || !date || !type || !impact || !priceEffect) {
    return { success: false, message: "所有字段都是必填的" }
  }

  try {
    await updateEvent(id, {
      title,
      description,
      date,
      type,
      impact,
      priceEffect,
    })

    revalidatePath("/admin/dashboard")
    revalidatePath("/news")
    return { success: true }
  } catch (error) {
    console.error("Error updating event:", error)
    return { success: false, message: "更新事件失败" }
  }
}

export async function deleteEventAction(id: string) {
  const isAuth = await isAuthenticated()
  if (!isAuth) {
    return { success: false, message: "未授权" }
  }

  try {
    await deleteEvent(id)
    revalidatePath("/admin/dashboard")
    revalidatePath("/news")
    return { success: true }
  } catch (error) {
    console.error("Error deleting event:", error)
    return { success: false, message: "删除事件失败" }
  }
}

// 新闻操作
export async function createNews(formData: FormData) {
  const isAuth = await isAuthenticated()
  if (!isAuth) {
    return { success: false, message: "未授权" }
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const url = formData.get("url") as string
  const source = formData.get("source") as string
  const date = formData.get("date") as string
  const analysis = formData.get("analysis") as string

  if (!title || !description || !url || !source || !date) {
    return { success: false, message: "除分析外，所有字段都是必填的" }
  }

  try {
    await addNews({
      title,
      description,
      url,
      source,
      date,
      analysis: analysis || undefined,
    })

    revalidatePath("/admin/dashboard")
    revalidatePath("/news")
    return { success: true }
  } catch (error) {
    console.error("Error creating news:", error)
    return { success: false, message: "创建新闻失败" }
  }
}

export async function updateNewsAction(id: string, formData: FormData) {
  const isAuth = await isAuthenticated()
  if (!isAuth) {
    return { success: false, message: "未授权" }
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const url = formData.get("url") as string
  const source = formData.get("source") as string
  const date = formData.get("date") as string
  const analysis = formData.get("analysis") as string

  if (!title || !description || !url || !source || !date) {
    return { success: false, message: "除分析外，所有字段都是必填的" }
  }

  try {
    await updateNews(id, {
      title,
      description,
      url,
      source,
      date,
      analysis: analysis || undefined,
    })

    revalidatePath("/admin/dashboard")
    revalidatePath("/news")
    return { success: true }
  } catch (error) {
    console.error("Error updating news:", error)
    return { success: false, message: "更新新闻失败" }
  }
}

export async function deleteNewsAction(id: string) {
  const isAuth = await isAuthenticated()
  if (!isAuth) {
    return { success: false, message: "未授权" }
  }

  try {
    await deleteNews(id)
    revalidatePath("/admin/dashboard")
    revalidatePath("/news")
    return { success: true }
  } catch (error) {
    console.error("Error deleting news:", error)
    return { success: false, message: "删除新闻失败" }
  }
}
