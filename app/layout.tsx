import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { Web3Provider } from "@/contexts/web3-context"
import UnifiedNavigation from "@/components/unified-navigation"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

export const metadata = {
  title: "Thorp.AI - Bitcoin Analysis Platform",
  description: "Advanced Bitcoin market analysis platform with technical indicators, news tracking, and AI predictions",
  icons: {
    icon: "/images/favicon.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <LanguageProvider>
            <Web3Provider>
              <div className="relative flex min-h-screen flex-col">
                <UnifiedNavigation />
                <main className="flex-1 container py-6">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </Web3Provider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
