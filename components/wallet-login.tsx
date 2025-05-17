"use client"

import { useState } from "react"
import { useWeb3 } from "@/contexts/web3-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Wallet } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function WalletLogin() {
  const { account, connecting, connected, connectWallet, signMessage } = useWeb3()
  const [authenticating, setAuthenticating] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleLogin = async () => {
    if (!connected) {
      await connectWallet()
      return
    }

    if (!account) {
      toast({
        title: "错误",
        description: "钱包未连接，请先连接钱包",
        variant: "destructive",
      })
      return
    }

    try {
      setAuthenticating(true)

      // 获取 nonce
      const nonceResponse = await fetch("/api/auth/wallet")
      const { nonce } = await nonceResponse.json()

      // 创建要签名的消息
      const message = `Sign this message to authenticate with Thorp.AI: ${nonce}`

      // 请求用户签名
      const signature = await signMessage(message)

      // 发送签名到服务器进行验证
      const authResponse = await fetch("/api/auth/wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: account,
          signature,
          message,
        }),
      })

      const authResult = await authResponse.json()

      if (authResult.success) {
        toast({
          title: "登录成功",
          description: "您已成功使用钱包登录",
        })

        // 重定向到主页或仪表板
        router.push("/")
        router.refresh()
      } else {
        toast({
          title: "登录失败",
          description: authResult.error || "验证签名时出错",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "登录失败",
        description: "登录过程中发生错误，请重试",
        variant: "destructive",
      })
    } finally {
      setAuthenticating(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>使用钱包登录</CardTitle>
        <CardDescription>连接您的 MetaMask 钱包以安全地登录到 Thorp.AI</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="rounded-full bg-primary/10 p-6">
          <Wallet className="h-12 w-12 text-primary" />
        </div>
        <div className="text-center">
          {connected && account ? (
            <p className="text-sm text-muted-foreground">
              已连接钱包: {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">连接您的 MetaMask 钱包以继续</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleLogin} disabled={connecting || authenticating}>
          {authenticating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              验证中...
            </>
          ) : connected ? (
            "使用钱包登录"
          ) : (
            <>
              <Wallet className="mr-2 h-4 w-4" />
              连接钱包
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
