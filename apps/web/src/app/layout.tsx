import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QA Playwright Dashboard',
  description: 'Dashboard per gestire test Playwright automatizzati',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // TODO: Implement actual authentication check
  // For now, we'll determine auth status based on the current path
  // In a real app, this would come from a context provider or auth service
  const isAuthenticated = false // This should be dynamic based on actual auth state
  
  return (
    <html lang="it">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          {/* Header */}
          <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h1 className="text-xl font-bold text-foreground">
                    QA Playwright
                  </h1>
                </div>
                <Navigation isAuthenticated={isAuthenticated} />
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <main className={`${isAuthenticated ? 'container mx-auto px-4 py-8' : ''}`}>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}