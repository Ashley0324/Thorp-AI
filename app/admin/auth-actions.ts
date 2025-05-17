"use server"

import { redirect } from "next/navigation"
import { login, logout } from "@/lib/auth"

export async function loginAction(formData: FormData) {
  const password = formData.get("password") as string

  if (!password) {
    return { success: false, message: "密码是必填的" }
  }

  try {
    const result = await login(password)
    return result
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "登录过程中发生错误" }
  }
}

export async function logoutAction() {
  await logout()
  redirect("/admin/login")
}
