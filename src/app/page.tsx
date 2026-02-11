import Header from '@/components/Header'
import BridgeForm from '@/components/BridgeForm'

export default function Home() {
  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark text-text-primary dark:text-primary-dark">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <BridgeForm />
      </div>
    </main>
  )
}