import { type NextRequest, NextResponse } from "next/server"
import { ethers } from "ethers"
import { cookies } from "next/headers"

// 生成随机的 nonce 用于签名
function generateNonce() {
  return Math.floor(Math.random() * 1000000).toString()
}

// 验证签名
function verifySignature(message: string, signature: string, address: string): boolean {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature)
    return recoveredAddress.toLowerCase() === address.toLowerCase()
  } catch (error) {
    console.error("Error verifying signature:", error)
    return false
  }
}

// 获取 nonce
export async function GET(request: NextRequest) {
  const nonce = generateNonce()

  // 将 nonce 存储在 cookie 中，用于后续验证
  cookies().set("auth_nonce", nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 300, // 5分钟有效期
    path: "/",
  })

  return NextResponse.json({ nonce })
}

// 验证签名并登录
export async function POST(request: NextRequest) {
  try {
    const { address, signature, message } = await request.json()

    // 获取存储的 nonce
    const storedNonce = cookies().get("auth_nonce")?.value

    // 验证消息格式和 nonce
    const expectedMessage = `Sign this message to authenticate with Thorp.AI: ${storedNonce}`
    if (message !== expectedMessage || !storedNonce) {
      return NextResponse.json({ success: false, error: "Invalid authentication request" }, { status: 400 })
    }

    // 验证签名
    const isValid = verifySignature(message, signature, address)

    if (isValid) {
      // 清除 nonce cookie
      cookies().delete("auth_nonce")

      // 设置认证 cookie
      cookies().set("wallet_auth", address, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7天有效期
        path: "/",
      })

      return NextResponse.json({ success: true, address })
    } else {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 401 })
    }
  } catch (error) {
    console.error("Error in wallet authentication:", error)
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 })
  }
}

// 登出
export async function DELETE() {
  cookies().delete("wallet_auth")
  return NextResponse.json({ success: true })
}
