export interface BridgeQuote {
  amountLD: string
  eqFee: string
  eqReward: string
  lpFee: string
  protocolFee: string
  lzTokenFee: string
  nativeFee: string
  minAmountLD: string
}

export interface BridgeParams {
  fromChainId: number
  toChainId: number
  fromToken: string
  toToken: string
  amount: string
  slippage: number
}

const STARGATE_API_BASE = 'https://stargate.finance/api'

export class StargateService {
  static async getQuote(params: BridgeParams): Promise<BridgeQuote> {
    const response = await fetch(`${STARGATE_API_BASE}/v1/quotes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        srcChainId: params.fromChainId,
        dstChainId: params.toChainId,
        srcTokenSymbol: params.fromToken,
        dstTokenSymbol: params.toToken,
        amountLD: params.amount,
        slippage: params.slippage,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch quote: ${response.statusText}`)
    }

    return response.json()
  }

  static async getAllRoutes(): Promise<any> {
    const response = await fetch(`${STARGATE_API_BASE}/v2/routes`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch routes: ${response.statusText}`)
    }

    return response.json()
  }

  static calculateProtocolFee(amount: string): string {
    const amountNum = parseFloat(amount)
    const protocolFeeRate = 0.0006 // 6 basis points (0.06%)
    return (amountNum * protocolFeeRate).toFixed(6)
  }

  static formatAmount(amount: string, decimals: number = 18): string {
    const amountNum = parseFloat(amount)
    const factor = Math.pow(10, decimals)
    return Math.floor(amountNum * factor).toString()
  }
}

// Chain ID to Stargate chain mapping
export const STARGATE_CHAIN_IDS: Record<number, number> = {
  1: 101,    // Ethereum
  40: 158,   // Telos (might need verification)
  8453: 184, // Base
  56: 102,   // BSC
  42161: 110, // Arbitrum
  137: 109,   // Polygon
  43114: 106, // Avalanche
  10: 111,    // Optimism
}

// Token addresses for Stargate pools
export const STARGATE_TOKENS: Record<number, Record<string, string>> = {
  1: { // Ethereum
    USDC: '0xA0b86a33E6441f8FB2F96C37b6bf4E4c81D17b2B',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    ETH: '0x0000000000000000000000000000000000000000',
  },
  40: { // Telos
    USDC: '0x6Bd193Ee6D2104F14F94E2cA6efefae561A4334B',
    USDT: '0x975Ed13fa16857E83e7C493C7741D556eaaD4A3f',
    ETH: '0xa9F9088040B0140d9a6b157E05E0F1e78A33446e',
    wBTC: '0xf390830df829cf22c53c8840554b98eafC5dCBc2',
  },
  // Add other chains as needed
}