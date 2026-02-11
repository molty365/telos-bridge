'use client'

import { useState, useCallback } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, parseUnits } from 'viem'
import { StargateService, BridgeParams, BridgeQuote } from '@/lib/stargate'

export interface BridgeState {
  isQuoting: boolean
  isBridging: boolean
  quote: BridgeQuote | null
  error: string | null
  txHash: string | null
}

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
      // This is a simplified example - in a real implementation,
      // you would need to interact with the actual Stargate contracts
      const txHash = await writeContract({
        address: '0x8731d54E9D02c286767d56ac03e8037C07e01e98', // Example Stargate Router address
        abi: [
          {
            name: 'swap',
            type: 'function',
            inputs: [
              { name: 'dstChainId', type: 'uint16' },
              { name: 'srcPoolId', type: 'uint256' },
              { name: 'dstPoolId', type: 'uint256' },
              { name: 'refundAddress', type: 'address' },
              { name: 'amountLD', type: 'uint256' },
              { name: 'minAmountLD', type: 'uint256' },
              { name: 'lzTxParams', type: 'tuple' },
              { name: 'to', type: 'bytes' },
              { name: 'payload', type: 'bytes' }
            ],
            outputs: [],
            stateMutability: 'payable'
          }
        ],
        functionName: 'swap',
        args: [
          params.toChainId,
          1, // srcPoolId - would be determined by token
          1, // dstPoolId - would be determined by token
          address,
          parseUnits(params.amount, 18),
          parseUnits('0', 18), // minAmountLD - should be calculated with slippage
          { dstGasForCall: 0, dstNativeAmount: 0, dstNativeAddr: '0x' },
          address,
          '0x'
        ],
        value: parseEther('0.01'), // Estimated gas fee
      })

      setState(prev => ({ ...prev, txHash: txHash.toString(), isBridging: false }))
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