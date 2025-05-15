// Derivatives API client for fetching BTC derivatives data

export interface DerivativeProduct {
  symbol: string
  type: "futures" | "options" | "perpetual"
  exchange: string
  price: number
  markPrice: number
  fundingRate?: number
  openInterest: number
  volume24h: number
  expiryDate?: string
  strikePrice?: number
}

export interface ArbitrageOpportunity {
  product1: DerivativeProduct
  product2: DerivativeProduct
  priceDifference: number
  percentageDifference: number
  estimatedProfit: number
  strategy: string
}

// Mock data for derivatives products
const mockDerivatives: DerivativeProduct[] = [
  {
    symbol: "BTCUSDT",
    type: "perpetual",
    exchange: "Binance",
    price: 40000,
    markPrice: 40050,
    fundingRate: 0.0001,
    openInterest: 1200000000,
    volume24h: 5000000000,
  },
  {
    symbol: "BTCUSDT",
    type: "perpetual",
    exchange: "Bybit",
    price: 40100,
    markPrice: 40080,
    fundingRate: 0.0002,
    openInterest: 800000000,
    volume24h: 3000000000,
  },
  {
    symbol: "BTCUSDT_240628",
    type: "futures",
    exchange: "Binance",
    price: 41200,
    markPrice: 41150,
    openInterest: 500000000,
    volume24h: 1500000000,
    expiryDate: "2024-06-28",
  },
  {
    symbol: "BTCUSDT_240628",
    type: "futures",
    exchange: "OKX",
    price: 41300,
    markPrice: 41250,
    openInterest: 400000000,
    volume24h: 1200000000,
    expiryDate: "2024-06-28",
  },
  {
    symbol: "BTC-28JUN24-45000-C",
    type: "options",
    exchange: "Deribit",
    price: 2500,
    markPrice: 2550,
    openInterest: 200000000,
    volume24h: 500000000,
    expiryDate: "2024-06-28",
    strikePrice: 45000,
  },
]

export async function getDerivativesProducts(): Promise<DerivativeProduct[]> {
  // In a real app, you would fetch from exchange APIs
  // This is a simplified mock implementation
  return mockDerivatives
}

export async function calculateArbitrageOpportunities(): Promise<ArbitrageOpportunity[]> {
  const derivatives = await getDerivativesProducts()
  const opportunities: ArbitrageOpportunity[] = []

  // Find perpetual vs perpetual arbitrage opportunities
  const perpetuals = derivatives.filter((d) => d.type === "perpetual")

  for (let i = 0; i < perpetuals.length; i++) {
    for (let j = i + 1; j < perpetuals.length; j++) {
      const product1 = perpetuals[i]
      const product2 = perpetuals[j]

      const priceDifference = product1.price - product2.price
      const percentageDifference = (priceDifference / product1.price) * 100

      // Only consider significant differences (more than 0.1%)
      if (Math.abs(percentageDifference) > 0.1) {
        opportunities.push({
          product1,
          product2,
          priceDifference,
          percentageDifference,
          estimatedProfit: Math.abs(priceDifference) * 0.9, // Accounting for fees
          strategy:
            priceDifference > 0
              ? `Sell on ${product1.exchange}, Buy on ${product2.exchange}`
              : `Buy on ${product1.exchange}, Sell on ${product2.exchange}`,
        })
      }
    }
  }

  // Find futures vs spot arbitrage opportunities
  const futures = derivatives.filter((d) => d.type === "futures")

  for (const future of futures) {
    // Assume spot price is the average of perpetual prices
    const spotPrice = perpetuals.reduce((sum, p) => sum + p.price, 0) / perpetuals.length

    const priceDifference = future.price - spotPrice
    const percentageDifference = (priceDifference / spotPrice) * 100

    // Only consider significant differences (more than 0.5%)
    if (Math.abs(percentageDifference) > 0.5) {
      opportunities.push({
        product1: future,
        product2: {
          symbol: "BTC/USDT",
          type: "perpetual",
          exchange: "Spot Market",
          price: spotPrice,
          markPrice: spotPrice,
          openInterest: 0,
          volume24h: 0,
        },
        priceDifference,
        percentageDifference,
        estimatedProfit: Math.abs(priceDifference) * 0.9, // Accounting for fees
        strategy:
          priceDifference > 0
            ? `Sell ${future.symbol} on ${future.exchange}, Buy BTC spot`
            : `Buy ${future.symbol} on ${future.exchange}, Sell BTC spot`,
      })
    }
  }

  return opportunities.sort((a, b) => Math.abs(b.percentageDifference) - Math.abs(a.percentageDifference))
}
