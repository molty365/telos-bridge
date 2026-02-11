import Header from '@/components/Header'
import BridgeForm from '@/components/BridgeForm'

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Background pattern */}
      <div className="bg-pattern fixed inset-0 pointer-events-none" />
      
      {/* Header */}
      <Header />
      
      {/* Main content - centered with proper mobile spacing */}
      <main className="relative z-[1] flex justify-center w-full pt-20 sm:pt-28 pb-12 px-3 sm:px-4">
        <div className="w-full max-w-[480px]">
          <BridgeForm />
        </div>
      </main>
    </div>
  )
}
