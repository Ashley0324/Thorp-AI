// Market API client for fetching global market data

/**
 * Fetches Bitcoin dominance percentage from CoinGecko API
 * @returns Bitcoin dominance percentage
 */
export async function getBTCDominance(): Promise<number> {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/global", {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch BTC dominance: ${response.status}`)
    }

    const data = await response.json()
    const dominance = data.data.market_cap_percentage.btc
    return Number(dominance.toFixed(2))
  } catch (error) {
    console.error("Error fetching BTC dominance:", error)
    // Return a reasonable fallback value
    return 50.0
  }
}

/**
 * Fetches Fear & Greed Index from Alternative.me API
 * @returns Fear & Greed Index value (0-100)
 */
export async function getFearGreedIndex(): Promise<number> {
  try {
    const response = await fetch("https://api.alternative.me/fng/", {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch Fear & Greed Index: ${response.status}`)
    }

    const data = await response.json()
    const value = Number(data.data[0].value)
    return value
  } catch (error) {
    console.error("Error fetching Fear & Greed Index:", error)
    // Return a reasonable fallback value
    return 50
  }
}
