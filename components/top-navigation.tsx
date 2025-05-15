"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { NAV_ITEMS } from "@/lib/constants"
import { Menu, Home, LineChart, Newspaper, TrendingUp, BrainCircuit, Bitcoin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"

export default function TopNavigation() {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Map of icon names to components
  const iconMap = {
    Home: Home,
    LineChart: LineChart,
    Newspaper: Newspaper,
    TrendingUp: TrendingUp,
    BrainCircuit: BrainCircuit,
    Bitcoin: Bitcoin,
  }

  return (
    <div className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-b-border/40">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-2 mr-6">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-300">
            Thorp.AI
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            const IconComponent = iconMap[item.icon as keyof typeof iconMap]
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary",
                )}
              >
                {IconComponent && <IconComponent className="h-5 w-5 mr-2" />}
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden ml-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-2 mt-8">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href
                  const IconComponent = iconMap[item.icon as keyof typeof iconMap]
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-primary/5 hover:text-primary",
                      )}
                    >
                      {IconComponent && <IconComponent className="h-5 w-5 mr-2" />}
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}
