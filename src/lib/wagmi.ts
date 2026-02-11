import { createConfig, http } from 'wagmi'
import { mainnet, base, bsc, arbitrum, polygon, avalanche, optimism } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { telos } from './chains'

export const config = getDefaultConfig({
  appName: 'Telos Bridge',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'default-project-id',
  chains: [mainnet, telos, base, bsc, arbitrum, polygon, avalanche, optimism],
  transports: {
    [mainnet.id]: http('https://eth-mainnet.g.alchemy.com/v2/demo'),
    [telos.id]: http('https://rpc.telos.net'),
    [base.id]: http('https://mainnet.base.org'),
    [bsc.id]: http('https://bsc-dataseed.binance.org'),
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
    [polygon.id]: http('https://polygon-rpc.com'),
    [avalanche.id]: http('https://api.avax.network/ext/bc/C/rpc'),
    [optimism.id]: http('https://mainnet.optimism.io'),
  },
  ssr: true,
})