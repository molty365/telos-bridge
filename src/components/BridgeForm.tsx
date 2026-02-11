'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { supportedChains, supportedTokens } from '@/lib/chains'
import { useStargateBridge } from '@/hooks/useStargateBridge'
import { StargateService } from '@/lib/stargate'

export default function BridgeForm() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  
  const [fromChain, setFromChain] = useState(supportedChains[0])
  const [toChain, setToChain] = useState(supportedChains[1])
  const [selectedToken, setSelectedToken] = useState(supportedTokens[3]) // wBTC as shown in screenshot
  const [amount, setAmount] = useState('')
  
  const { 
    isQuoting, 
    isBridging, 
    quote, 
    error, 
    getQuote, 
    executeBridge,
    reset 
  } = useStargateBridge()

  const swapChains = () => {
    const temp = fromChain
    setFromChain(toChain)
    setToChain(temp)
  }

  const handleAmountChange = async (value: string) => {
    setAmount(value)
    reset()
    
    if (value && parseFloat(value) > 0) {
      try {
        await getQuote({
          fromChainId: fromChain.id,
          toChainId: toChain.id,
          fromToken: selectedToken.symbol,
          toToken: selectedToken.symbol,
          amount: value,
          slippage: 0.5, // 0.5%
        })
      } catch (error) {
        console.error('Failed to get quote:', error)
      }
    }
  }

  const handleBridge = async () => {
    if (!amount || !isConnected) return

    try {
      await executeBridge({
        fromChainId: fromChain.id,
        toChainId: toChain.id,
        fromToken: selectedToken.symbol,
        toToken: selectedToken.symbol,
        amount,
        slippage: 0.5,
      })
    } catch (error) {
      console.error('Bridge failed:', error)
    }
  }

  const handleConnect = () => {
    if (connectors[0]) {
      connect({ connector: connectors[0] })
    }
  }

  const protocolFee = amount ? StargateService.calculateProtocolFee(amount) : '0'

  return (
    <div className="max-w-md mx-auto">
      {/* Bridge Form Card */}
      <div className="bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-4xl p-6 shadow-card dark:shadow-card-dark">
        
        {/* From Chain Selector */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary dark:text-secondary-dark">From</span>
          </div>
          <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-bold mr-3">
              {fromChain.symbol.slice(0, 2)}
            </div>
            <div className="flex-1">
              <div className="font-medium text-text-primary dark:text-primary-dark">{fromChain.name}</div>
            </div>
            <span className="text-gray-400">📋</span>
          </div>
        </div>

        {/* Swap Direction Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={swapChains}
            className="w-10 h-10 bg-white dark:bg-card-dark border-2 border-gray-200 dark:border-gray-600 rounded-xl flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <span className="text-lg">🔄</span>
          </button>
        </div>

        {/* To Chain Selector */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary dark:text-secondary-dark">To</span>
          </div>
          <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-telos-cyan to-telos-blue rounded-lg flex items-center justify-center text-white text-xs font-bold mr-3">
              {toChain.symbol.slice(0, 2)}
            </div>
            <div className="flex-1">
              <div className="font-medium text-text-primary dark:text-primary-dark">{toChain.name}</div>
            </div>
            <span className="text-gray-400">📋</span>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <input
                type="number"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0"
                className="flex-1 bg-transparent text-2xl font-medium text-text-primary dark:text-primary-dark placeholder-gray-400 border-none outline-none"
              />
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <span className="text-lg">{selectedToken.logo}</span>
                  <span className="font-medium text-text-primary dark:text-primary-dark">{selectedToken.symbol}</span>
                  <span className="text-gray-400">▼</span>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-text-secondary dark:text-secondary-dark">
                {isConnected ? '0 ' + selectedToken.symbol + ' available' : 'Connect wallet to view balance'}
              </span>
              <button className="text-sm text-gray-400 hover:text-text-secondary dark:hover:text-secondary-dark">Max</button>
            </div>
          </div>
        </div>

        {/* Connect Wallet / Bridge Button */}
        {!isConnected ? (
          <button
            onClick={handleConnect}
            className="w-full py-4 bg-gradient-to-r from-telos-cyan via-telos-blue to-telos-purple text-white font-medium rounded-2xl hover:opacity-90 transition-opacity"
          >
            Connect wallet
          </button>
        ) : (
          <div className="space-y-3">
            {isConnected && (
              <div className="text-center">
                <p className="text-sm text-text-secondary dark:text-secondary-dark">
                  Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
                <button
                  onClick={() => disconnect()}
                  className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mt-1"
                >
                  Disconnect
                </button>
              </div>
            )}
            
            <button
              onClick={handleBridge}
              disabled={!amount || isQuoting || isBridging}
              className="w-full py-4 bg-gradient-to-r from-telos-cyan via-telos-blue to-telos-purple text-white font-medium rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBridging ? 'Bridging...' : isQuoting ? 'Getting quote...' : amount ? 'Bridge' : 'Enter amount'}
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
            <div className="text-sm text-red-800 dark:text-red-200">
              {error}
            </div>
          </div>
        )}

        {/* Quote Information */}
        {quote && amount && (
          <div className="mt-4 space-y-2">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="text-sm text-blue-800 dark:text-blue-200">
                Protocol fee: {protocolFee} {selectedToken.symbol} (0.06%)
              </div>
            </div>
            
            {quote.nativeFee && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  Estimated gas: {parseFloat(quote.nativeFee).toFixed(4)} {fromChain.symbol}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Migration Notice Card */}
      <div className="mt-6 bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-4xl p-6 shadow-card dark:shadow-card-dark">
        <div className="flex items-start space-x-3">
          <div className="flex space-x-1 mt-1">
            <span className="text-lg">🪙</span>
            <span className="text-lg">💵</span>
            <span className="text-lg">⟠</span>
            <span className="text-lg">₿</span>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-text-primary dark:text-primary-dark mb-2">
              New USDC, USDT, ETH & wBTC
            </h3>
            <p className="text-sm text-text-secondary dark:text-secondary-dark mb-4">
              Telos has migrated to the new USDC, USDT, ETH, and wBTC in collaboration with Circle, 
              Stargate, and Ethena. For older assets, please use the legacy bridge.
            </p>
            <button className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              Open legacy bridge
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}