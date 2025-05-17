"use client"

import { useState } from "react"
import { useWeb3 } from "@/contexts/web3-context"
import { Button } from "@/components/ui/button"
import { Loader2, Wallet, LogOut, ExternalLink, Copy, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

export function WalletConnectButton() {
  const { account, connecting, connected, connectWallet, disconnectWallet } = useWeb3()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  // 格式化地址显示
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  // 复制地址到剪贴板
  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      toast({
        title: "地址已复制",
        description: "钱包地址已复制到剪贴板",
      })
    }
  }

  // 在区块浏览器中查看
  const viewOnExplorer = () => {
    if (account) {
      window.open(`https://etherscan.io/address/${account}`, "_blank")
    }
  }

  if (!connected) {
    return (
      <Button onClick={connectWallet} disabled={connecting} className="rounded-full">
        {connecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            连接中...
          </>
        ) : (
          <>
            <Wallet className="mr-2 h-4 w-4" />
            连接钱包
          </>
        )}
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full">
          <Wallet className="mr-2 h-4 w-4" />
          {account && formatAddress(account)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>已连接钱包</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyAddress}>
          {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
          复制地址
        </DropdownMenuItem>
        <DropdownMenuItem onClick={viewOnExplorer}>
          <ExternalLink className="mr-2 h-4 w-4" />
          在区块浏览器中查看
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={disconnectWallet}>
          <LogOut className="mr-2 h-4 w-4" />
          断开连接
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
