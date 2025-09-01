import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/navigation'
import { Providers } from '@/components/providers'

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
  return (
    <html lang="it">
      <body className={inter.className}>
        <Providers>
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
                  <Navigation />
                </div>
              </div>
            </header>
            
            {/* Main Content */}
            <main>
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}