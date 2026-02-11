'use client'

export default function Header() {
  return (
    <div className="fixed top-0 left-0 w-screen z-10 pointer-events-none">
      <nav className="flex justify-between items-center p-3 md:p-6">
        <div className="pointer-events-auto">
          {/* Telos logo */}
          <img
            src="https://s3.us-east-2.amazonaws.com/assets.rollbridge.app/a0ed09964cc7edd7cde0e.svg"
            alt="Telos Bridge"
            className="inline-flex h-8 w-auto max-w-36 md:max-w-48"
            draggable={false}
          />
        </div>
        <div className="flex gap-2 pointer-events-auto">
          {/* Activity/history button */}
          <button className="backdrop-blur-sm h-10 px-2.5 gap-1 inline-flex items-center rounded-full transition-all hover:scale-105 shadow-sm"
            style={{ backgroundColor: 'var(--card)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={{ fill: 'var(--foreground)' }}>
              <path d="M21.49 8.52c-.01 1.1-.57 1.63-1.7 1.63H5.02c-1.14.01-1.7-.53-1.71-1.63 0-1.12.58-1.66 1.71-1.67h14.75c1.13.01 1.7.56 1.71 1.67z"/>
              <path d="M19.49 15.52c-.01 1.1-.57 1.63-1.7 1.63H7.02c-1.14.01-1.7-.53-1.71-1.63 0-1.12.58-1.66 1.71-1.67h10.75c1.13.01 1.7.56 1.71 1.67z"/>
            </svg>
          </button>
        </div>
      </nav>
    </div>
  )
}
