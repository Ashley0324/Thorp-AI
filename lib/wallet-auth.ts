"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// 检查钱包是否已认证
export async function isWalletAuthenticated(): Promise<boolean> {
  const walletAuth = cookies().get("wallet_auth")
  return !!walletAuth?.value
}

// 获取已认证的钱包地址
export async function getAuthenticatedWallet(): Promise<string | null> {
  const walletAuth = cookies().get("wallet_auth")
  return walletAuth?.value || null
}

// 要求钱包认证，否则重定向到登录页面
export async function requireWalletAuth() {
  if (!(await isWalletAuthenticated())) {
    redirect("/wallet-login")
  }
}

// 钱包登出
export async function walletLogout() {
  cookies().delete("wallet_auth")
}
