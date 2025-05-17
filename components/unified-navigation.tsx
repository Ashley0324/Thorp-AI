"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, MoonIcon, SunIcon, Globe, Bitcoin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NAV_ITEMS } from "@/lib/constants"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "next-themes"
import { WalletConnectButton } from "@/components/wallet-connect-button"

export default function UnifiedNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const pathname = usePathname()
  const { t, language, setLanguage } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [currentPrice, setCurrentPrice] = useState<string | null>(null)

  // Language options
  const languages = [
    { name: "简体中文", code: "zh-CN" },
    { name: "繁體中文", code: "zh-TW" },
    { name: "English", code: "en" },
  ]

  // Map of navigation item names to translation keys
  const navTranslationKeys: Record<string, string> = {
    市场概况: "marketOverview",
    指标分析: "btcIndicators",
    热点事件: "hotEvents",
    衍生品: "btcDerivatives",
    AI预测: "aiPrediction",
  }

  useEffect(() => {
    setMounted(true)

    // Fetch current BTC price
    const fetchPrice = async () => {
      try {
        const response = await fetch("https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT")
        const data = await response.json()
        setCurrentPrice(
          Number.parseFloat(data.lastPrice).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        )
      } catch (error) {
        console.error("Error fetching BTC price:", error)
        // Fallback to mock data if API fails
        setCurrentPrice("$60,123.45")
      }
    }

    fetchPrice()
    const interval = setInterval(fetchPrice, 30000) // Update every 30 seconds

    // Add click outside listener to close language menu
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".lang-menu-container") && isLangMenuOpen) {
        setIsLangMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      clearInterval(interval)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isLangMenuOpen])

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode)
    setIsLangMenuOpen(false)
  }

  const toggleLangMenu = () => {
    setIsLangMenuOpen(!isLangMenuOpen)
  }

  return (
    <div className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2 mr-8">
            <span className="font-bold text-xl">Thorp.AI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
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
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* BTC Price Display - Simplified */}
          {currentPrice && mounted && (
            <div className="hidden sm:flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-full border border-border/40">
              <Bitcoin className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-primary">{currentPrice}</span>
            </div>
          )}

          {/* Language Menu */}
          <div className="relative lang-menu-container">
            <Button variant="ghost" size="icon" className="rounded-full relative" onClick={toggleLangMenu}>
              <Globe className="h-5 w-5" />
            </Button>

            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-background border border-border z-50">
                <div className="py-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-accent ${
                        language === lang.code ? "bg-primary/10 text-primary" : ""
                      }`}
                      onClick={() => handleLanguageChange(lang.code)}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {mounted && theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </Button>

          {/* Wallet Connect Button */}
          {mounted && <WalletConnectButton />}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle Menu"
            className="md:hidden"
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
            {/* Mobile BTC Price - Simplified */}
            {currentPrice && (
              <div className="flex items-center gap-2 py-3 border-b border-border/40">
                <Bitcoin className="h-5 w-5 text-primary" />
                <span className="text-sm font-bold text-primary">{currentPrice}</span>
              </div>
            )}

            {/* Mobile Navigation Links */}
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
