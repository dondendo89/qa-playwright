'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { BarChart3, FolderOpen, Settings, Target, LogOut } from 'lucide-react'

// Navigation for authenticated users
const authenticatedNavigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: BarChart3,
  },
  {
    name: 'Progetti',
    href: '/projects',
    icon: FolderOpen,
  },
  {
    name: 'Target',
    href: '/targets',
    icon: Target,
  },
  {
    name: 'Impostazioni',
    href: '/settings',
    icon: Settings,
  },
]

// Navigation for public pages
const publicNavigation = [
  {
    name: 'Demo',
    href: '/demo',
    icon: BarChart3,
  },
  {
    name: 'Prezzi',
    href: '/pricing',
    icon: Target,
  },
]

export function Navigation() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const isAuthenticated = !!session
  const navigation = isAuthenticated ? authenticatedNavigation : publicNavigation

  return (
    <nav className="flex space-x-8 lg:space-x-6">
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors',
              isActive
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            )}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.name}
          </Link>
        )
      })}
      
      {/* Auth buttons for public navigation */}
      {!isAuthenticated && (
        <div className="flex items-center space-x-4 ml-8">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Accedi
          </Link>
          <Link
            href="/auth/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Registrati
          </Link>
        </div>
      )}
      
      {/* User menu for authenticated navigation */}
      {isAuthenticated && (
        <div className="flex items-center space-x-4 ml-8">
          <div className="text-sm text-muted-foreground">
            Ciao, <span className="font-medium text-foreground">{session?.user?.name || session?.user?.email}</span>
          </div>
          <Link
            href="/pricing"
            className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Upgrade
          </Link>
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="mr-1 h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}