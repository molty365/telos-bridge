'use client'

import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Header() {
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <header className="w-full px-6 py-4 bg-white dark:bg-card-dark border-b border-border-light dark:border-border-dark">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold bg-gradient-to-r from-telos-cyan via-telos-blue to-telos-purple bg-clip-text text-transparent">
            telos
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* RainbowKit Connect Button */}
          <div className="hidden sm:block">
            <ConnectButton 
              label="Connect"
              showBalance={false}
              chainStatus="icon"
            />
          </div>
          
          {/* Dark/Light mode toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isDark ? (
              <span className="text-xl">☀️</span>
            ) : (
              <span className="text-xl">🌙</span>
            )}
          </button>
          
          {/* Settings button */}
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="text-xl">⚙️</span>
          </button>
          
          {/* Menu button */}
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
              <div className="w-4 h-0.5 bg-current"></div>
              <div className="w-4 h-0.5 bg-current"></div>
              <div className="w-4 h-0.5 bg-current"></div>
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}