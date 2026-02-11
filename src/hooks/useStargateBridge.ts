'use client'

import { useState, useCallback } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { parseUnits, encodeFunctionData } from 'viem'
import { type BridgeParams, type BridgeQuote, StargateService } from '@/lib/stargate'

export interface BridgeState {
  isQuoting: boolean
  isBridging: boolean
  quote: BridgeQuote | null
  error: string | null
  txHash: string | null
}

// Stargate V2 OFT send ABI
const STARGATE_SEND_ABI = [
  {
    name: 'send',
    type: 'function',
    inputs: [
      {
        name: '_sendParam',
        type: 'tuple',
        components: [
          { name: 'dstEid', type: 'uint32' },
          { name: 'to', type: 'bytes32' },
          { name: 'amountLD', type: 'uint256' },
          { name: 'minAmountLD', type: 'uint256' },
          { name: 'extraOptions', type: 'bytes' },
          { name: 'composeMsg', type: 'bytes' },
          { name: 'oftCmd', type: 'bytes' },
        ],
      },
      {
        name: '_fee',
        type: 'tuple',
        components: [
          { name: 'nativeFee', type: 'uint256' },
          { name: 'lzTokenFee', type: 'uint256' },
        ],
      },
      { name: '_refundAddress', type: 'address' },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
] as const

export function useStargateBridge() {
  const { address, isConnected } = useAccount()
  const { writeContract } = useWriteContract()
  const [state, setState] = useState<BridgeState>({
    isQuoting: false,
    isBridging: false,
    quote: null,
    error: null,
    txHash: null,
  })

  const getQuote = useCallback(async (params: BridgeParams) => {
    setState(prev => ({ ...prev, isQuoting: true, error: null }))

    try {
      const quote = await StargateService.getQuote(params)
      setState(prev => ({ ...prev, quote, isQuoting: false }))
      return quote
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get quote'
      setState(prev => ({ ...prev, error: errorMessage, isQuoting: false }))
      throw error
    }
  }, [])

  const executeBridge = useCallback(async (params: BridgeParams) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected')
    }

    setState(prev => ({ ...prev, isBridging: true, error: null }))

    try {
      // Get a fresh quote for the transaction
      const quote = await StargateService.getQuote(params)

      // Pad address to bytes32
      const toBytes32 = ('0x' + address.slice(2).padStart(64, '0')) as `0x${string}`
      const amountLD = parseUnits(params.amount, 18)
      const minAmountLD = (amountLD * 995n) / 1000n // 0.5% slippage
      const nativeFee = quote.nativeFee ? BigInt(quote.nativeFee) : 0n

      const txHash = await writeContract({
        address: '0x8731d54E9D02c286767d56ac03e8037C07e01e98' as `0x${string}`, // Stargate router
        abi: STARGATE_SEND_ABI,
        functionName: 'send',
        args: [
          {
            dstEid: params.toChainId,
            to: toBytes32,
            amountLD,
            minAmountLD,
            extraOptions: '0x' as `0x${string}`,
            composeMsg: '0x' as `0x${string}`,
            oftCmd: '0x' as `0x${string}`,
          },
          {
            nativeFee,
            lzTokenFee: 0n,
          },
          address,
        ],
        value: nativeFee,
      })

      setState(prev => ({ ...prev, txHash: txHash as unknown as string, isBridging: false }))
      return txHash
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bridge transaction failed'
      setState(prev => ({ ...prev, error: errorMessage, isBridging: false }))
      throw error
    }
  }, [address, isConnected, writeContract])

  const reset = useCallback(() => {
    setState({
      isQuoting: false,
      isBridging: false,
      quote: null,
      error: null,
      txHash: null,
    })
  }, [])

  return {
    ...state,
    getQuote,
    executeBridge,
    reset,
  }
}
