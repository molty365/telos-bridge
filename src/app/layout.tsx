import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from '@/components/providers/WagmiProvider'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Telos Bridge",
  description: "Cross-chain bridge for Telos network powered by Stargate",
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}