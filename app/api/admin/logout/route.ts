import { logout } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    await logout()
    return NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"))
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ success: false, message: "登出失败" }, { status: 500 })
  }
}
