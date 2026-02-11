'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { supportedChains, supportedTokens } from '@/lib/chains'
import { useStargateBridge } from '@/hooks/useStargateBridge'
import { StargateService } from '@/lib/stargate'

const BASE = process.env.NODE_ENV === 'production' ? '/telos-bridge' : ''

const CHAIN_ICONS: Record<number, string> = {
  1: `${BASE}/img/ethereum.svg`,
  40: `${BASE}/img/telos.svg`,
  8453: `${BASE}/img/base.svg`,
  56: `${BASE}/img/bsc.svg`,
  42161: `${BASE}/img/arbitrum.svg`,
  137: `${BASE}/img/polygon.svg`,
  43114: `${BASE}/img/avalanche.svg`,
  10: `${BASE}/img/optimism.svg`,
}

const TOKEN_ICONS: Record<string, string> = {
  USDC: 'https://static.optimism.io/data/USDC/logo.png',
  USDT: 'https://s3.us-east-2.amazonaws.com/assets.rollbridge.app/3a709a5a46c21b802170e.png',
  ETH: 'https://static.optimism.io/data/ETH/logo.svg',
  wBTC: 'https://s3.us-east-2.amazonaws.com/assets.rollbridge.app/f01685ddbd453909e33f9.png',
  TLOS: `${BASE}/img/telos.svg`,
}

export default function BridgeForm() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const [fromChainIdx, setFromChainIdx] = useState(0) // Ethereum
  const [toChainIdx, setToChainIdx] = useState(1)     // Telos
  const [tokenIdx, setTokenIdx] = useState(0)          // USDC
  const [amount, setAmount] = useState('')
  const [showFromChains, setShowFromChains] = useState(false)
  const [showToChains, setShowToChains] = useState(false)
  const [showTokens, setShowTokens] = useState(false)

  const fromChain = supportedChains[fromChainIdx]
  const toChain = supportedChains[toChainIdx]
  const token = supportedTokens[tokenIdx]

  const {
    isQuoting,
    isBridging,
    quote,
    error,
    getQuote,
    executeBridge,
    reset,
  } = useStargateBridge()

  const swapChains = () => {
    const tmp = fromChainIdx
    setFromChainIdx(toChainIdx)
    setToChainIdx(tmp)
    reset()
  }

  const handleAmountChange = async (value: string) => {
    setAmount(value)
    reset()
    if (value && parseFloat(value) > 0) {
      try {
        await getQuote({
          fromChainId: fromChain.id,
          toChainId: toChain.id,
          fromToken: token.symbol,
          toToken: token.symbol,
          amount: value,
          slippage: 0.5,
        })
      } catch {}
    }
  }

  const handleBridge = async () => {
    if (!amount || !isConnected) return
    try {
      await executeBridge({
        fromChainId: fromChain.id,
        toChainId: toChain.id,
        fromToken: token.symbol,
        toToken: token.symbol,
        amount,
        slippage: 0.5,
      })
    } catch {}
  }

  const handleConnect = () => {
    if (connectors[0]) connect({ connector: connectors[0] })
  }

  const protocolFee = amount ? StargateService.calculateProtocolFee(amount) : '0'

  const cardStyle = { backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }
  const mutedStyle = { backgroundColor: 'var(--muted)' }
  const mutedFg = { color: 'var(--muted-foreground)' }
  const primaryBg = { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col gap-3 w-full">

        {/* Top row - activity icons */}
        <div className="flex items-center justify-between gap-2 w-full px-0.5">
          <div className="flex gap-1.5 items-center ml-auto">
            <button className="backdrop-blur-sm group hover:scale-105 transition-all flex items-center gap-1.5 rounded-full py-1.5 px-2 shadow-sm" style={cardStyle}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 41 41" className="w-5 h-5 shrink-0" style={{ fill: 'var(--muted-foreground)' }}>
                <path d="M20.82 0.82C9.79 0.82 0.82 9.79 0.82 20.82C0.82 31.85 9.79 40.82 20.82 40.82C31.85 40.82 40.82 31.85 40.82 20.82C40.82 9.79 31.85 0.82 20.82 0.82ZM20.88 22.08C20.45 22.08 20.09 21.84 19.89 21.49C19.77 21.31 19.71 21.08 19.71 20.86V4.92C19.71 4.25 20.26 3.74 20.93 3.74C21.6 3.74 22.11 4.29 22.11 4.95V19.69H30.13C30.8 19.69 31.35 20.26 31.35 20.89C31.35 21.56 30.76 22.09 30.13 22.09H20.89L20.88 22.08Z"/>
              </svg>
            </button>
            <button className="backdrop-blur-sm group hover:scale-105 transition-all flex items-center justify-center py-1.5 px-2 rounded-full shadow-sm" style={cardStyle}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 40 40" className="w-5 h-5 shrink-0" style={{ fill: 'var(--muted-foreground)' }}>
                <path d="M37.67 15.41L34.19 15C34.01 14.51 33.8 14.03 33.56 13.48L35.73 10.72C36.63 9.6 36.67 8.36 35.86 7.55L32.63 4.33C32.16 3.86 31.56 3.59 30.93 3.59C30.38 3.59 29.83 3.82 29.26 4.27L26.5 6.46C25.89 6.18 25.45 5.97 25 5.81L24.59 2.31C24.43 0.83 23.57 0 22.17 0H17.83C16.43 0 15.57 0.83 15.41 2.31L15 5.81C14.55 5.97 14.11 6.17 13.5 6.46L10.74 4.27C10.17 3.82 9.62 3.59 9.07 3.59C8.44 3.59 7.83 3.86 7.37 4.33L4.14 7.55C3.33 8.36 3.37 9.6 4.27 10.72L6.44 13.48C6.2 14.03 5.99 14.51 5.81 15L2.33 15.41C0.87 15.59 0 16.49 0 17.83V22.17C0 23.51 0.87 24.41 2.33 24.59L5.79 25C5.91 25.36 6.07 25.73 6.44 26.52L4.27 29.28C3.37 30.4 3.33 31.64 4.14 32.45L7.37 35.67C7.84 36.14 8.44 36.41 9.07 36.41C9.62 36.41 10.17 36.18 10.74 35.73L13.5 33.54C14.11 33.82 14.55 34.03 15 34.19L15.41 37.69C15.57 39.17 16.45 40 17.83 40H22.17C23.55 40 24.43 39.17 24.59 37.69L25 34.19C25.45 34.03 25.89 33.83 26.5 33.54L29.26 35.73C29.83 36.18 30.38 36.41 30.93 36.41C31.56 36.41 32.17 36.14 32.63 35.67L35.86 32.45C36.67 31.64 36.63 30.4 35.73 29.28L33.56 26.52C33.92 25.73 34.09 25.36 34.21 25L37.67 24.59C39.13 24.41 40 23.51 40 22.17V17.83C40 16.49 39.13 15.59 37.67 15.41ZM20 28.14C15.51 28.14 11.84 24.47 11.84 19.98C11.84 15.49 15.51 11.84 20 11.84C24.45 11.84 28.14 15.51 28.14 19.98C28.14 24.45 24.47 28.14 20 28.14Z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Main bridge card */}
        <div className="rounded-3xl shadow w-full py-px backdrop-blur-sm" style={cardStyle}>
          <div className="flex flex-col gap-3 p-4 md:p-5">
            <div className="flex flex-col gap-2">

              {/* From/To chain selectors */}
              <div className="relative grid grid-rows-2 md:grid-rows-1 grid-cols-1 md:grid-cols-2 gap-1 select-none pt-0.5">
                {/* From chain */}
                <div
                  className="relative flex gap-3 w-full items-center justify-start p-4 rounded-2xl transition-all cursor-pointer hover:scale-[1.02]"
                  style={mutedStyle}
                  onClick={() => setShowFromChains(!showFromChains)}
                >
                  <img
                    src={CHAIN_ICONS[fromChain.id] || '/img/ethereum.svg'}
                    alt={fromChain.name}
                    className="w-12 h-12 rounded-lg"
                    
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs leading-none" style={mutedFg}>From</span>
                    <span className="text-lg leading-none" style={{ fontFamily: 'sb-button' }}>{fromChain.name}</span>
                  </div>

                  {/* Dropdown */}
                  {showFromChains && (
                    <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl shadow-lg overflow-hidden" style={cardStyle}>
                      {supportedChains.map((c, i) => (
                        <button
                          key={c.id}
                          className="w-full flex items-center gap-3 p-3 hover:opacity-80 transition-opacity text-left"
                          style={i === fromChainIdx ? mutedStyle : {}}
                          onClick={(e) => { e.stopPropagation(); setFromChainIdx(i); setShowFromChains(false); reset() }}
                        >
                          <img src={CHAIN_ICONS[c.id]} alt={c.name} className="w-8 h-8 rounded-lg"  />
                          <span style={{ fontFamily: 'sb-button' }}>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Swap button */}
                <button
                  onClick={swapChains}
                  className="flex justify-center items-center rounded-lg w-7 h-7 absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all scale-[0.8] hover:scale-90 rotate-90 md:rotate-0 overflow-hidden"
                  style={{ boxShadow: '0 0 0 4px var(--card)', backgroundColor: 'var(--muted)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" style={{ fill: 'var(--muted-foreground)' }}>
                    <path d="M6.01 2.03c.21.1.4.25.57.45l2.97 3.47c.3.36.45.71.45 1.05 0 .34-.15.71-.45 1.05l-2.97 3.47c-.17.2-.35.35-.57.46-.21.1-.42.15-.65.15-.23 0-.45-.06-.66-.19-.21-.13-.37-.3-.5-.52-.13-.22-.19-.45-.19-.7 0-.37.14-.73.43-1.06L6.74 7 4.43 4.36C4.14 4.02 4 3.66 4 3.29c0-.25.06-.47.19-.69.13-.22.3-.39.51-.51.21-.13.43-.19.66-.19.23 0 .45.05.66.15z"/>
                  </svg>
                </button>

                {/* To chain */}
                <div
                  className="relative flex gap-3 w-full items-center md:flex-row-reverse p-4 rounded-2xl transition-all cursor-pointer hover:scale-[1.02]"
                  style={mutedStyle}
                  onClick={() => setShowToChains(!showToChains)}
                >
                  <img
                    src={CHAIN_ICONS[toChain.id] || '/img/telos.svg'}
                    alt={toChain.name}
                    className="w-12 h-12 rounded-lg"
                    
                  />
                  <div className="flex flex-col gap-0.5 md:text-right">
                    <span className="text-xs leading-none" style={mutedFg}>To</span>
                    <span className="text-lg leading-none" style={{ fontFamily: 'sb-button' }}>{toChain.name}</span>
                  </div>

                  {/* Dropdown */}
                  {showToChains && (
                    <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl shadow-lg overflow-hidden" style={cardStyle}>
                      {supportedChains.map((c, i) => (
                        <button
                          key={c.id}
                          className="w-full flex items-center gap-3 p-3 hover:opacity-80 transition-opacity text-left"
                          style={i === toChainIdx ? mutedStyle : {}}
                          onClick={(e) => { e.stopPropagation(); setToChainIdx(i); setShowToChains(false); reset() }}
                        >
                          <img src={CHAIN_ICONS[c.id]} alt={c.name} className="w-8 h-8 rounded-lg"  />
                          <span style={{ fontFamily: 'sb-button' }}>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Amount input */}
              <div className="flex flex-col gap-4 relative rounded-2xl px-4 pt-6 pb-5 mb-0.5 md:mb-1 border border-transparent focus-within:border-[var(--border)] transition-colors" style={mutedStyle}>
                <div className="flex gap-2 items-start">
                  <textarea
                    inputMode="decimal"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    rows={1}
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="0"
                    className="min-h-[1lh] mt-0.5 resize-none overflow-hidden ml-0.5 block w-full shadow-none bg-transparent focus:outline-none text-4xl leading-none placeholder:opacity-30"
                    style={{ height: 'auto', minHeight: '1.2em', lineHeight: 1, color: 'var(--foreground)' }}
                  />
                  {/* Token selector */}
                  <div className="relative">
                    <button
                      className="flex shrink-0 gap-1.5 rounded-full py-2 pl-3 pr-3 items-center transition-all hover:scale-105"
                      style={{ ...cardStyle, fontFamily: 'sb-button' }}
                      onClick={() => setShowTokens(!showTokens)}
                    >
                      <img src={TOKEN_ICONS[token.symbol]} alt={token.symbol} className="w-6 h-6 rounded-full" />
                      <span className="text-sm">{token.symbol}</span>
                      <svg width="10" height="6" viewBox="0 0 10 6" className="w-2.5 h-2.5 ml-0.5" style={{ fill: 'var(--muted-foreground)' }}>
                        <path d="M1 1l4 4 4-4"/>
                      </svg>
                    </button>

                    {showTokens && (
                      <div className="absolute top-full right-0 mt-1 z-50 rounded-xl shadow-lg overflow-hidden min-w-[160px]" style={cardStyle}>
                        {supportedTokens.map((t, i) => (
                          <button
                            key={t.symbol}
                            className="w-full flex items-center gap-3 p-3 hover:opacity-80 transition-opacity text-left"
                            style={i === tokenIdx ? mutedStyle : {}}
                            onClick={() => { setTokenIdx(i); setShowTokens(false); reset() }}
                          >
                            <img src={TOKEN_ICONS[t.symbol]} alt={t.symbol} className="w-6 h-6 rounded-full" />
                            <span style={{ fontFamily: 'sb-button' }}>{t.symbol}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Balance / quote info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs" style={mutedFg}>
                    {isQuoting && <span>Getting quote...</span>}
                    {quote && amount && <span>Fee: {protocolFee} {token.symbol} (0.06%)</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="w-full">
          <div className="flex flex-col gap-4 py-4 justify-start items-center w-full">
            {!isConnected ? (
              <button
                onClick={handleConnect}
                className="w-full h-14 rounded-full overflow-hidden gap-2 flex items-center justify-center shadow backdrop-blur-sm transition-all hover:scale-[1.03] relative"
                style={cardStyle}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" className="w-6 h-6 p-0.5" style={{ fill: 'var(--foreground)' }}>
                  <path d="M12.15 2H1.85C0.83 2 0 2.83 0 3.85V10.55C0 11.57 0.83 12.4 1.85 12.4H12.15C13.17 12.4 14 11.57 14 10.55V3.85C14 2.83 13.17 2 12.15 2ZM12.48 5.43C12.48 5.63 12.32 5.79 12.12 5.79H8.49C8.33 5.79 8.18 5.9 8.14 6.06C8.02 6.57 7.55 6.96 7 6.96C6.45 6.96 5.99 6.57 5.87 6.06C5.83 5.9 5.67 5.79 5.51 5.79H1.89C1.69 5.79 1.53 5.63 1.53 5.43V4.2C1.53 3.8 1.85 3.48 2.25 3.48H11.76C12.15 3.48 12.48 3.8 12.48 4.2V5.43Z"/>
                </svg>
                <span style={{ fontFamily: 'sb-button', color: 'var(--foreground)' }}>Connect wallet</span>
              </button>
            ) : (
              <div className="flex flex-col gap-2 w-full">
                <div className="text-center text-sm" style={mutedFg}>
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                  <button onClick={() => disconnect()} className="ml-2 text-xs underline opacity-60 hover:opacity-100">disconnect</button>
                </div>
                <button
                  onClick={handleBridge}
                  disabled={!amount || isBridging}
                  className="w-full h-14 rounded-full flex items-center justify-center transition-all hover:scale-[1.03] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={primaryBg}
                >
                  <span style={{ fontFamily: 'sb-button' }}>
                    {isBridging ? 'Bridging...' : amount ? 'Bridge' : 'Enter amount'}
                  </span>
                </button>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="w-full px-5 py-4 rounded-2xl text-sm" style={{ backgroundColor: 'hsl(0 84% 60% / 0.1)', color: 'hsl(0 84% 60%)' }}>
                {error}
              </div>
            )}

            {/* Migration notice */}
            <div className="flex flex-col gap-2 w-full">
              <div className="w-full px-5 md:px-6 py-5 md:py-6 rounded-[calc(var(--radius)+12px)] shadow text-xs" style={cardStyle}>
                <h5 className="text-sm mb-1 flex justify-between items-center" style={{ fontFamily: 'sb-heading' }}>
                  <span>New USDC, USDT, ETH &amp; wBTC</span>
                  <span className="ml-auto rounded-full p-1 pr-0 inline-flex items-center" style={mutedStyle}>
                    <img src={TOKEN_ICONS.USDC} alt="USDC" className="rounded-full w-4 h-4" />
                    <img src={TOKEN_ICONS.USDT} alt="USDT" className="rounded-full w-4 h-4 -ml-1" />
                    <img src={TOKEN_ICONS.ETH} alt="ETH" className="rounded-full w-4 h-4 -ml-1" />
                    <img src={TOKEN_ICONS.wBTC} alt="wBTC" className="rounded-full w-4 h-4 -ml-1 mr-1.5" />
                  </span>
                </h5>
                <div className="tracking-tighter" style={mutedFg}>
                  <p className="leading-relaxed mb-1">
                    Telos has migrated to the new USDC, USDT, ETH, and wBTC in collaboration with Circle, Stargate, and BitGo. For older assets, please use the legacy bridge…
                  </p>
                  <div className="mt-3">
                    <a
                      href="https://bridgev1.telos.net"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center h-8 rounded-full px-3 text-xs transition-all hover:scale-[1.03]"
                      style={{ ...primaryBg, fontFamily: 'sb-button' }}
                    >
                      Open legacy bridge
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
