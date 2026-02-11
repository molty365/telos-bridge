export interface BridgeQuote {
  route: string
  srcAmount: string
  dstAmount: string
  dstAmountMin: string
  duration: { estimated: number }
  fees: Array<{ token: string; chainKey: string; amount: string; type: string }>
  nativeFee?: string
  error: string | null
}

export interface BridgeParams {
  fromChainId: number
  toChainId: number
  fromToken: string
  toToken: string
  amount: string
  slippage: number
  srcAddress?: string
  dstAddress?: string
}

const STARGATE_API_BASE = 'https://stargate.finance/api'

// Chain ID to Stargate chainKey mapping
export const CHAIN_KEYS: Record<number, string> = {
  1: 'ethereum',
  40: 'telos',
  8453: 'base',
  56: 'bsc',
  42161: 'arbitrum',
  137: 'polygon',
  43114: 'avalanche',
  10: 'optimism',
}

// Token contract addresses per chain (Stargate-supported)
export const TOKEN_ADDRESSES: Record<string, Record<number, string>> = {
  USDC: {
    1: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    40: '0xF1815bd50389c46847f0Bda824eC8da914045D14', // USDC.e on Telos (Stargate)
    8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    56: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    42161: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    137: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
    43114: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
    10: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
  },
  USDT: {
    1: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    40: '0x674843C06FF83502ddb4D37c2E09C01cdA38cbc8', // Stargate USDT on Telos
    56: '0x55d398326f99059fF775485246999027B3197955',
    42161: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    137: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    43114: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
    10: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
  },
  ETH: {
    1: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    40: '0xBAb93B7ad7fE8692A878B95a8e689423437cc500', // WETH on Telos (Stargate)
    8453: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    42161: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    10: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  },
  wBTC: {
    1: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    40: '0x0555E30da8f98308EdB960aa94C0Db47230d2B9c', // WBTC on Telos (Stargate), 8 decimals
  },
  TLOS: {
    40: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  },
}

export class StargateService {
  static async getQuote(params: BridgeParams): Promise<BridgeQuote> {
    const srcChainKey = CHAIN_KEYS[params.fromChainId]
    const dstChainKey = CHAIN_KEYS[params.toChainId]
    const srcToken = TOKEN_ADDRESSES[params.fromToken]?.[params.fromChainId]
    const dstToken = TOKEN_ADDRESSES[params.toToken]?.[params.toChainId]

    if (!srcChainKey || !dstChainKey) {
      throw new Error('Unsupported chain')
    }
    if (!srcToken || !dstToken) {
      throw new Error(`${params.fromToken} not available on selected chains`)
    }

    // Get token decimals (USDC/USDT = 6, others = 18)
    const decimals = ['USDC', 'USDT'].includes(params.fromToken) ? 6 : 18
    const srcAmount = BigInt(Math.floor(parseFloat(params.amount) * (10 ** decimals))).toString()
    const slippageBps = Math.floor(params.slippage * 100) // 0.5% = 50 bps
    const dstAmountMin = BigInt(Math.floor(parseFloat(srcAmount) * (1 - params.slippage / 100))).toString()

    const dummyAddr = params.srcAddress || '0x1504482b4D3E5ec88acc21bdBE0e8632d8408840'

    const queryParams = new URLSearchParams({
      srcToken,
      dstToken,
      srcAddress: dummyAddr,
      dstAddress: params.dstAddress || dummyAddr,
      srcChainKey,
      dstChainKey,
      srcAmount,
      dstAmountMin,
    })

    const response = await fetch(`${STARGATE_API_BASE}/v1/quotes?${queryParams.toString()}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch quote: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error.message || 'Quote failed')
    }

    if (!data.quotes || data.quotes.length === 0) {
      throw new Error('No routes available for this transfer')
    }

    const quote = data.quotes[0]

    // Extract native fee from fees array
    const messageFee = quote.fees?.find((f: any) => f.type === 'message')
    const nativeFee = messageFee?.amount || '0'

    return {
      ...quote,
      nativeFee,
    }
  }

  static calculateProtocolFee(amount: string): string {
    const amountNum = parseFloat(amount)
    const protocolFeeRate = 0.0006 // 6 basis points (0.06%)
    return (amountNum * protocolFeeRate).toFixed(6)
  }

  static getTokenDecimals(symbol: string): number {
    if (['USDC', 'USDT'].includes(symbol)) return 6
    if (symbol === 'wBTC') return 8
    return 18
  }
}
