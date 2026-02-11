import { Chain } from 'viem'

export const telos: Chain = {
  id: 40,
  name: 'Telos',
  nativeCurrency: {
    decimals: 18,
    name: 'Telos',
    symbol: 'TLOS',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.telos.net'],
    },
    public: {
      http: ['https://rpc.telos.net'],
    },
  },
  blockExplorers: {
    default: { name: 'TelosEVM Explorer', url: 'https://teloscan.io/' },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 246530709,
    },
  },
}

export const supportedChains = [
  {
    id: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    logo: 'https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/81d9f/eth-diamond-black.png',
  },
  {
    id: 40,
    name: 'Telos',
    symbol: 'TLOS',
    logo: 'https://logo.telos.net/telos.png',
  },
  {
    id: 8453,
    name: 'Base',
    symbol: 'ETH',
    logo: 'https://avatars.githubusercontent.com/u/108554348?s=280&v=4',
  },
  {
    id: 56,
    name: 'BNB Chain',
    symbol: 'BNB',
    logo: 'https://assets.coingecko.com/coins/images/825/standard/bnb-icon2_2x.png',
  },
  {
    id: 42161,
    name: 'Arbitrum',
    symbol: 'ETH',
    logo: 'https://avatars.githubusercontent.com/u/37784886?s=200&v=4',
  },
  {
    id: 137,
    name: 'Polygon',
    symbol: 'MATIC',
    logo: 'https://wallet-asset.matic.network/img/tokens/matic.svg',
  },
  {
    id: 43114,
    name: 'Avalanche',
    symbol: 'AVAX',
    logo: 'https://cryptologos.cc/logos/avalanche-avax-logo.png',
  },
  {
    id: 10,
    name: 'Optimism',
    symbol: 'ETH',
    logo: 'https://avatars.githubusercontent.com/u/108554348?s=280&v=4',
  },
]

export const supportedTokens = [
  {
    symbol: 'USDC',
    name: 'USD Coin',
    logo: '🪙',
    addresses: {
      1: '0xA0b86a33E6441f8FB2F96C37b6bf4E4c81D17b2B',
      40: '0x6Bd193Ee6D2104F14F94E2cA6efefae561A4334B',
      // Add other chain addresses
    },
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    logo: '💵',
    addresses: {
      1: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      40: '0x975Ed13fa16857E83e7C493C7741D556eaaD4A3f',
      // Add other chain addresses
    },
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    logo: '⟠',
    addresses: {
      1: '0x0000000000000000000000000000000000000000',
      40: '0xa9F9088040B0140d9a6b157E05E0F1e78A33446e',
      // Add other chain addresses
    },
  },
  {
    symbol: 'wBTC',
    name: 'Wrapped Bitcoin',
    logo: '₿',
    addresses: {
      1: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      40: '0xf390830df829cf22c53c8840554b98eafC5dCBc2',
      // Add other chain addresses
    },
  },
  // TLOS requires OFT bridge (LayerZero) — not available via Stargate yet
]