import Header from '@/components/Header'
import BridgeForm from '@/components/BridgeForm'

export default function Home() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Background pattern */}
      <div className="bg-pattern fixed inset-0 pointer-events-none" />
      
      {/* Header */}
      <Header />
      
      {/* Main content */}
      <div className="fixed inset-0 flex items-start justify-center overflow-y-auto overflow-x-hidden">
        <div className="w-full max-w-xl px-2 md:px-0 mt-24 sm:mt-28 mb-24">
          <BridgeForm />
        </div>
      </div>
    </div>
  )
}
