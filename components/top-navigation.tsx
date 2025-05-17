"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NAV_ITEMS } from "@/lib/constants"
import { useLanguage } from "@/contexts/language-context"
import dynamic from "next/dynamic"

// Import icons dynamically
const DynamicIcon = dynamic(
  () =>
    import("lucide-react").then((mod) => {
      const LucideIcons = mod as any
      return ({ name, ...props }: { name: string; [key: string]: any }) => {
        const Icon = LucideIcons[name]
        return Icon ? <Icon {...props} /> : null
      }
    }),
  { ssr: false },
)

export default function TopNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { t } = useLanguage()

  // Map of navigation item names to translation keys
  const navTranslationKeys: Record<string, string> = {
    市场概况: "marketOverview",
    BTC指标分析: "btcIndicators",
    热点事件: "hotEvents",
    BTC衍生品: "btcDerivatives",
    AI预测: "aiPrediction",
  }

  return (
    <div className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Thorp.AI</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-4 lg:space-x-6">
            {NAV_ITEMS.map((item) => {
              const translationKey = navTranslationKeys[item.name] || item.name
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {t(translationKey)}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex flex-1 items-center justify-end md:hidden">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle Menu"
            className="mr-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border/40">
          <div className="container py-2">
            {NAV_ITEMS.map((item) => {
              const translationKey = navTranslationKeys[item.name] || item.name
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center py-3 text-base font-medium transition-colors hover:text-primary ${
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <DynamicIcon name={item.icon} className="mr-3 h-5 w-5" />
                  {t(translationKey)}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
