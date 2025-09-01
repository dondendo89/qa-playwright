import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/projects',
  '/targets',
  '/settings'
]

// Routes that require an active subscription
const subscriptionRoutes = [
  '/projects/new',
  '/projects/[id]/test',
  '/api/test'
]

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Check if route requires subscription
    const requiresSubscription = subscriptionRoutes.some(route => {
      if (route.includes('[id]')) {
        const pattern = route.replace('[id]', '[^/]+');
        return new RegExp(`^${pattern}$`).test(pathname)
      }
      return pathname.startsWith(route)
    })

    if (requiresSubscription) {
      // Check if user has active subscription
      const hasActiveSubscription = token?.subscriptionStatus === 'active'
      
      if (!hasActiveSubscription) {
        // Redirect to pricing page with paywall message
        const url = req.nextUrl.clone()
        url.pathname = '/pricing'
        url.searchParams.set('paywall', 'true')
        url.searchParams.set('redirect', pathname)
        return NextResponse.redirect(url)
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow access to public routes
        if (!protectedRoutes.some(route => pathname.startsWith(route))) {
          return true
        }
        
        // Require authentication for protected routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
}