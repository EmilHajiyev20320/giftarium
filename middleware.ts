import createMiddleware from 'next-intl/middleware'
import { routing } from './src/i18n/routing'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/src/lib/auth'

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle admin routes separately (they don't need locale prefix)
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    // Protect admin routes
    if (pathname.startsWith('/admin')) {
      const session = await auth()

      if (!session) {
        return NextResponse.redirect(new URL('/login?redirect=/admin', request.url))
      }

      if (session.user?.role !== 'ADMIN') {
        // Redirect to default locale home
        return NextResponse.redirect(new URL(`/${routing.defaultLocale}`, request.url))
      }
    }

    return NextResponse.next()
  }

  // Apply next-intl middleware for all other routes
  // This handles locale detection and redirects / to /en automatically
  return intlMiddleware(request)
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/admin`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)'],
}
