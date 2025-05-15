// Binance API client for fetching market data

export interface KlineData {
  openTime: number
  open: string
  high: string
  low: string
  close: string
  volume: string
  closeTime: number
  quoteAssetVolume: string
  trades: number
  takerBuyBaseAssetVolume: string
  takerBuyQuoteAssetVolume: string
  ignored: string
}

export interface TickerData {
  symbol: string
  priceChange: string
  priceChangePercent: string
  weightedAvgPrice: string
  prevClosePrice: string
  lastPrice: string
  lastQty: string
  bidPrice: string
  bidQty: string
  askPrice: string
  askQty: string
  openPrice: string
  highPrice: string
  lowPrice: string
  volume: string
  quoteVolume: string
  openTime: number
  closeTime: number
  firstId: number
  lastId: number
  count: number
}

export interface FundingRateData {
  symbol: string
  markPrice: string
  indexPrice: string
  estimatedSettlePrice: string
  lastFundingRate: string
  nextFundingTime: number
  interestRate: string
  time: number
}

export async function getBTCPrice(): Promise<{ price: string }> {
  const response = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT")
  return response.json()
}

export async function getBTC24hTicker(): Promise<TickerData> {
  const response = await fetch("https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT")
  return response.json()
}

export async function getBTCKlines(interval = "1d", limit = 30): Promise<KlineData[]> {
  const response = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${interval}&limit=${limit}`,
  )
  const data = await response.json()

  return data.map((kline: any[]) => ({
    openTime: kline[0],
    open: kline[1],
    high: kline[2],
    low: kline[3],
    close: kline[4],
    volume: kline[5],
    closeTime: kline[6],
    quoteAssetVolume: kline[7],
    trades: kline[8],
    takerBuyBaseAssetVolume: kline[9],
    takerBuyQuoteAssetVolume: kline[10],
    ignored: kline[11],
  }))
}

export async function getBTCFundingRate(): Promise<FundingRateData> {
  const response = await fetch("https://fapi.binance.com/fapi/v1/premiumIndex?symbol=BTCUSDT")
  return response.json()
}

export async function getExchangePrices(): Promise<{ exchange: string; price: number }[]> {
  // In a real app, you would fetch from multiple exchange APIs
  // This is a simplified mock implementation
  const binancePrice = await getBTCPrice()

  return [
    { exchange: "Binance", price: Number.parseFloat(binancePrice.price) },
    { exchange: "Coinbase", price: Number.parseFloat(binancePrice.price) * (1 + (Math.random() * 0.01 - 0.005)) },
    { exchange: "Kraken", price: Number.parseFloat(binancePrice.price) * (1 + (Math.random() * 0.01 - 0.005)) },
    { exchange: "Huobi", price: Number.parseFloat(binancePrice.price) * (1 + (Math.random() * 0.01 - 0.005)) },
    { exchange: "OKX", price: Number.parseFloat(binancePrice.price) * (1 + (Math.random() * 0.01 - 0.005)) },
  ]
}

export async function getFundingRates(): Promise<{ exchange: string; rate: number }[]> {
  // In a real app, you would fetch from multiple exchange APIs
  // This is a simplified mock implementation
  const binanceFunding = await getBTCFundingRate()

  return [
    { exchange: "Binance", rate: Number.parseFloat(binanceFunding.lastFundingRate) },
    { exchange: "Bybit", rate: Number.parseFloat(binanceFunding.lastFundingRate) * (1 + (Math.random() * 0.5 - 0.25)) },
    { exchange: "OKX", rate: Number.parseFloat(binanceFunding.lastFundingRate) * (1 + (Math.random() * 0.5 - 0.25)) },
    { exchange: "dYdX", rate: Number.parseFloat(binanceFunding.lastFundingRate) * (1 + (Math.random() * 0.5 - 0.25)) },
    {
      exchange: "BitMEX",
      rate: Number.parseFloat(binanceFunding.lastFundingRate) * (1 + (Math.random() * 0.5 - 0.25)),
    },
  ]
}
