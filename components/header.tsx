"use client"

import { useState, useEffect } from "react"
import { MoonIcon, SunIcon, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"

export default function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [currentPrice, setCurrentPrice] = useState<string | null>(null)
  const [priceChange, setPriceChange] = useState<number>(0)

  useEffect(() => {
    setMounted(true)

    // Fetch current BTC price
    const fetchPrice = async () => {
      try {
        const response = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT")
        const data = await response.json()
        setCurrentPrice(
          Number.parseFloat(data.price).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        )

        // Mock price change
        setPriceChange(Math.random() * 4 - 2) // Random between -2% and 2%
      } catch (error) {
        console.error("Error fetching BTC price:", error)
      }
    }

    fetchPrice()
    const interval = setInterval(fetchPrice, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <header className="sticky top-16 z-40 border-b border-b-border/40 bg-background/80 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4">
        <div></div>

        <div className="flex items-center gap-4">
          {currentPrice && (
            <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-full border border-border/40">
              <span className="text-sm font-medium">BTC:</span>
              <span className="text-sm font-bold text-primary">{currentPrice}</span>
              <Badge
                className={
                  priceChange >= 0
                    ? "bg-green-500/20 text-green-500 hover:bg-green-500/30"
                    : "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                }
              >
                {priceChange >= 0 ? "+" : ""}
                {priceChange.toFixed(2)}%
              </Badge>
            </div>
          )}

          <Button variant="ghost" size="icon" className="rounded-full relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {mounted && theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
