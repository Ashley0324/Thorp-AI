"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LineChart, Newspaper, TrendingUp, BrainCircuit, Home, Bitcoin } from "lucide-react"

const navItems = [
  {
    name: "市场概况",
    href: "/",
    icon: Home,
  },
  {
    name: "BTC指标分析",
    href: "/indicators",
    icon: LineChart,
  },
  {
    name: "热点事件",
    href: "/news",
    icon: Newspaper,
  },
  {
    name: "BTC衍生品价格",
    href: "/derivatives",
    icon: TrendingUp,
  },
  {
    name: "AI预测",
    href: "/prediction",
    icon: BrainCircuit,
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-[80] bg-background/80 backdrop-blur-sm border-r border-r-border/40">
      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
        <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-b-border/40">
          <div className="flex items-center gap-2">
            <Bitcoin className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-300">
              BTC量化分析平台
            </h1>
          </div>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary",
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary",
                  )}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 mt-auto">
          <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Bitcoin className="h-5 w-5 text-primary" />
              <h3 className="font-medium text-sm">BTC 实时价格</h3>
            </div>
            <div className="text-xl font-bold text-primary animate-pulse">$42,856.32</div>
            <div className="text-xs text-muted-foreground mt-1">更新于 1分钟前</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function MobileSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-background/95 backdrop-blur-sm">
      <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-b-border/40">
        <div className="flex items-center gap-2">
          <Bitcoin className="h-7 w-7 text-primary" />
          <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-300">
            BTC量化分析平台
          </h1>
        </div>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary",
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary",
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 mt-auto">
        <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Bitcoin className="h-5 w-5 text-primary" />
            <h3 className="font-medium text-sm">BTC 实时价格</h3>
          </div>
          <div className="text-xl font-bold text-primary animate-pulse">$42,856.32</div>
          <div className="text-xs text-muted-foreground mt-1">更新于 1分钟前</div>
        </div>
      </div>
    </div>
  )
}
