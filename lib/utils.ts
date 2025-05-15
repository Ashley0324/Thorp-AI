import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(value: number, options: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat("en-US", options).format(value)
}

export function formatCurrency(value: number, currency = "USD", decimals = 2) {
  return formatNumber(value, {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatPercent(value: number, decimals = 2) {
  return formatNumber(value, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function calculateChange(current: number, previous: number) {
  if (previous === 0) return 0
  return (current - previous) / previous
}
