"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type LanguageContextType = {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string
}

const defaultLanguage = "zh-CN"

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  t: (key: string) => key,
})

export function useLanguage() {
  return useContext(LanguageContext)
}

import { translations } from "@/lib/i18n/translations"

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<string>(defaultLanguage)
  const [mounted, setMounted] = useState(false)

  // Load saved language preference on mount
  useEffect(() => {
    setMounted(true)
    const savedLanguage = localStorage.getItem("language") || defaultLanguage
    setLanguageState(savedLanguage)
  }, [])

  // Save language preference when it changes
  const setLanguage = (lang: string) => {
    setLanguageState(lang)
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang)
    }
  }

  // Translation function
  const t = (key: string): string => {
    if (!mounted) return key

    const langTranslations = translations[language as keyof typeof translations]
    if (!langTranslations) return key

    return (langTranslations as any)[key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}
