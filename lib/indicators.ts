// Technical indicators calculation

export function calculateRSI(prices: number[], period = 14): number[] {
  const rsiValues: number[] = []
  const gains: number[] = []
  const losses: number[] = []

  // Calculate price changes
  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1]
    gains.push(change > 0 ? change : 0)
    losses.push(change < 0 ? Math.abs(change) : 0)
  }

  // Calculate initial average gain and loss
  let avgGain = gains.slice(0, period).reduce((sum, gain) => sum + gain, 0) / period
  let avgLoss = losses.slice(0, period).reduce((sum, loss) => sum + loss, 0) / period

  // Calculate RSI values
  for (let i = period; i < prices.length; i++) {
    // For the first RSI value
    if (i === period) {
      const rs = avgGain / (avgLoss === 0 ? 0.001 : avgLoss) // Avoid division by zero
      rsiValues.push(100 - 100 / (1 + rs))
      continue
    }

    // For subsequent RSI values using smoothed averages
    avgGain = (avgGain * (period - 1) + gains[i - 1]) / period
    avgLoss = (avgLoss * (period - 1) + losses[i - 1]) / period

    const rs = avgGain / (avgLoss === 0 ? 0.001 : avgLoss) // Avoid division by zero
    rsiValues.push(100 - 100 / (1 + rs))
  }

  return rsiValues
}

export function calculateMACD(
  prices: number[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9,
): {
  macdLine: number[]
  signalLine: number[]
  histogram: number[]
} {
  // Calculate EMAs
  const fastEMA = calculateEMA(prices, fastPeriod)
  const slowEMA = calculateEMA(prices, slowPeriod)

  // Calculate MACD line (fast EMA - slow EMA)
  const macdLine: number[] = []
  for (let i = 0; i < prices.length; i++) {
    if (i < slowPeriod - 1) {
      macdLine.push(0) // Not enough data yet
    } else {
      macdLine.push(fastEMA[i] - slowEMA[i])
    }
  }

  // Calculate signal line (EMA of MACD line)
  const signalLine = calculateEMA(macdLine.slice(slowPeriod - 1), signalPeriod)

  // Pad signal line with zeros to match the length of macdLine
  const paddedSignalLine = Array(slowPeriod + signalPeriod - 2)
    .fill(0)
    .concat(signalLine)

  // Calculate histogram (MACD line - signal line)
  const histogram: number[] = []
  for (let i = 0; i < macdLine.length; i++) {
    histogram.push(macdLine[i] - paddedSignalLine[i])
  }

  return { macdLine, signalLine: paddedSignalLine, histogram }
}

export function calculateEMA(prices: number[], period: number): number[] {
  const ema: number[] = []
  const multiplier = 2 / (period + 1)

  // Calculate SMA for the first EMA value
  let sma = 0
  for (let i = 0; i < period; i++) {
    sma += prices[i]
  }
  sma /= period

  // Set first EMA value
  ema.push(sma)

  // Calculate subsequent EMA values
  for (let i = period; i < prices.length; i++) {
    ema.push((prices[i] - ema[ema.length - 1]) * multiplier + ema[ema.length - 1])
  }

  // Pad with zeros to match the input length
  return Array(period - 1)
    .fill(0)
    .concat(ema)
}

export function calculateBollingerBands(
  prices: number[],
  period = 20,
  stdDev = 2,
): {
  upper: number[]
  middle: number[]
  lower: number[]
} {
  const upper: number[] = []
  const middle: number[] = []
  const lower: number[] = []

  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      // Not enough data yet
      upper.push(0)
      middle.push(0)
      lower.push(0)
      continue
    }

    // Calculate SMA
    let sum = 0
    for (let j = i - period + 1; j <= i; j++) {
      sum += prices[j]
    }
    const sma = sum / period

    // Calculate standard deviation
    let sumSquaredDiff = 0
    for (let j = i - period + 1; j <= i; j++) {
      sumSquaredDiff += Math.pow(prices[j] - sma, 2)
    }
    const standardDeviation = Math.sqrt(sumSquaredDiff / period)

    // Calculate Bollinger Bands
    middle.push(sma)
    upper.push(sma + standardDeviation * stdDev)
    lower.push(sma - standardDeviation * stdDev)
  }

  return { upper, middle, lower }
}

export function calculatePiCycleTop(prices: number[]): {
  piCycle: number[]
  buySignal: boolean
} {
  // Pi Cycle Top indicator uses 111-day SMA and 350-day SMA * 2
  const sma111 = calculateSMA(prices, 111)
  const sma350 = calculateSMA(prices, 350).map((val) => val * 2)

  // Calculate Pi Cycle (difference between 111-day SMA and 350-day SMA * 2)
  const piCycle: number[] = []
  for (let i = 0; i < prices.length; i++) {
    if (i < 350 - 1) {
      piCycle.push(0) // Not enough data yet
    } else {
      piCycle.push(sma111[i] - sma350[i])
    }
  }

  // Buy signal when 111-day SMA crosses above 350-day SMA * 2
  const buySignal = piCycle.length >= 2 && piCycle[piCycle.length - 2] <= 0 && piCycle[piCycle.length - 1] > 0

  return { piCycle, buySignal }
}

export function calculateSMA(prices: number[], period: number): number[] {
  const sma: number[] = []

  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      sma.push(0) // Not enough data yet
    } else {
      let sum = 0
      for (let j = i - period + 1; j <= i; j++) {
        sum += prices[j]
      }
      sma.push(sum / period)
    }
  }

  return sma
}

export function calculateMayerMultiple(prices: number[]): {
  mayerMultiple: number[]
  buySignal: boolean
  sellSignal: boolean
} {
  // Mayer Multiple is the ratio of price to 200-day SMA
  const sma200 = calculateSMA(prices, 200)

  // Calculate Mayer Multiple
  const mayerMultiple: number[] = []
  for (let i = 0; i < prices.length; i++) {
    if (i < 200 - 1) {
      mayerMultiple.push(0) // Not enough data yet
    } else {
      mayerMultiple.push(prices[i] / sma200[i])
    }
  }

  // Buy signal when Mayer Multiple is below 0.8
  // Sell signal when Mayer Multiple is above 2.4
  const currentMayer = mayerMultiple[mayerMultiple.length - 1]
  const buySignal = currentMayer < 0.8
  const sellSignal = currentMayer > 2.4

  return { mayerMultiple, buySignal, sellSignal }
}

export function calculateAltcoinSeason(btcDominance: number[]): {
  altcoinIndex: number
  isAltcoinSeason: boolean
} {
  // Simplified Altcoin Season Index
  // In a real implementation, this would compare BTC dominance to historical ranges
  const currentDominance = btcDominance[btcDominance.length - 1]
  const altcoinIndex = 100 - currentDominance

  // Altcoin season when BTC dominance is below 50%
  const isAltcoinSeason = currentDominance < 50

  return { altcoinIndex, isAltcoinSeason }
}

export function generateSignals(prices: number[]): {
  rsi: { value: number; signal: "buy" | "sell" | "neutral" }
  macd: { signal: "buy" | "sell" | "neutral" }
  bollingerBands: { signal: "buy" | "sell" | "neutral" }
  piCycle: { signal: "buy" | "sell" | "neutral" }
  mayerMultiple: { value: number; signal: "buy" | "sell" | "neutral" }
} {
  // Calculate indicators
  const rsiValues = calculateRSI(prices)
  const currentRSI = rsiValues[rsiValues.length - 1]

  const { macdLine, signalLine, histogram } = calculateMACD(prices)
  const currentHistogram = histogram[histogram.length - 1]
  const previousHistogram = histogram[histogram.length - 2]

  const { upper, middle, lower } = calculateBollingerBands(prices)
  const currentPrice = prices[prices.length - 1]
  const currentUpper = upper[upper.length - 1]
  const currentLower = lower[lower.length - 1]

  const { buySignal: piCycleBuySignal } = calculatePiCycleTop(prices)

  const { mayerMultiple, buySignal: mayerBuySignal, sellSignal: mayerSellSignal } = calculateMayerMultiple(prices)
  const currentMayer = mayerMultiple[mayerMultiple.length - 1]

  // Generate signals
  return {
    rsi: {
      value: currentRSI,
      signal: currentRSI < 30 ? "buy" : currentRSI > 70 ? "sell" : "neutral",
    },
    macd: {
      signal:
        previousHistogram < 0 && currentHistogram > 0
          ? "buy"
          : previousHistogram > 0 && currentHistogram < 0
            ? "sell"
            : "neutral",
    },
    bollingerBands: {
      signal: currentPrice <= currentLower ? "buy" : currentPrice >= currentUpper ? "sell" : "neutral",
    },
    piCycle: {
      signal: piCycleBuySignal ? "buy" : "neutral",
    },
    mayerMultiple: {
      value: currentMayer,
      signal: mayerBuySignal ? "buy" : mayerSellSignal ? "sell" : "neutral",
    },
  }
}
