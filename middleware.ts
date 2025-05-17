import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const AUTH_COOKIE_NAME = "thorp-admin-auth"
const AUTH_COOKIE_VALUE = "authenticated-admin-session"

export function middleware(request: NextRequest) {
  // 只在管理员仪表板路由上运行，不在登录页面上运行
  if (request.nextUrl.pathname.startsWith("/admin/dashboard")) {
    const authCookie = request.cookies.get(AUTH_COOKIE_NAME)

    // 如果未认证，重定向到登录
    if (!authCookie || authCookie.value !== AUTH_COOKIE_VALUE) {
      const loginUrl = new URL("/admin/login", request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
