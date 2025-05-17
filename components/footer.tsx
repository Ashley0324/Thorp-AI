"use client"

import Link from "next/link"
import Image from "next/image"
import { COMPANY, FEATURES } from "@/lib/constants"
import { useLanguage } from "@/contexts/language-context"
import { Twitter, Github, MessageCircle } from "lucide-react"

export default function Footer() {
  const { t } = useLanguage()

  // Map of feature titles to translation keys
  const featureTranslationKeys: Record<string, string> = {
    实时市场数据: "realTimeMarketData",
    技术指标分析: "technicalAnalysis",
    新闻与事件追踪: "newsTracking",
    衍生品市场数据: "derivativesData",
    AI预测模型: "aiPredictionModel",
  }

  return (
    <footer className="border-t border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="mb-4">
              <Image
                src={COMPANY.logo.path || "/placeholder.svg"}
                alt={COMPANY.logo.alt}
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">{t("copyright")}</p>
            <div className="flex space-x-4">
              <Link
                href={COMPANY.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href={COMPANY.social.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
                aria-label="Telegram"
              >
                <MessageCircle className="h-5 w-5" />
              </Link>
              <Link
                href={COMPANY.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t("contactUs")}</h3>
            <p className="text-sm text-muted-foreground">Email: {COMPANY.contact.email}</p>
            <p className="text-sm text-muted-foreground">{COMPANY.contact.phone}</p>
          </div>
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-medium">{t("features")}</h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {FEATURES.map((feature, index) => {
                const translationKey = featureTranslationKeys[feature.title] || feature.title
                return (
                  <div key={index} className="flex flex-col space-y-1">
                    <h4 className="text-sm font-medium">{t(translationKey)}</h4>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
