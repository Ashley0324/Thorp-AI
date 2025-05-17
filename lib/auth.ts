"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// 简单的管理员密码 - 在生产环境中应该更改为更安全的密码
const ADMIN_PASSWORD = "thorp-admin-2025"
const AUTH_COOKIE_NAME = "thorp-admin-auth"
const AUTH_COOKIE_VALUE = "authenticated-admin-session"

// 登录函数
export async function login(password: string): Promise<{ success: boolean; message?: string }> {
  console.log("Attempting login with password")

  if (password === ADMIN_PASSWORD) {
    // 设置认证cookie
    cookies().set({
      name: AUTH_COOKIE_NAME,
      value: AUTH_COOKIE_VALUE,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1周
      path: "/",
    })

    console.log("Login successful, cookie set")
    return { success: true }
  }

  console.log("Login failed: incorrect password")
  return { success: false, message: "密码错误" }
}

// 登出函数
export async function logout() {
  cookies().delete(AUTH_COOKIE_NAME)
}

// 检查是否已认证 - 这个函数需要是异步的，因为它在服务器操作文件中
export async function isAuthenticated(): Promise<boolean> {
  const authCookie = cookies().get(AUTH_COOKIE_NAME)
  return authCookie?.value === AUTH_COOKIE_VALUE
}

// 要求认证，否则重定向到登录页面 - 这个函数需要是异步的，因为它在服务器操作文件中
export async function requireAuth() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login")
  }
}

// 添加缺失的导出函数，保持向后兼容性
export const serverLogin = login
export const serverLogout = logout
export const serverRequireAuth = requireAuth
