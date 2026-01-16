import { redirect } from 'next/navigation'
import { auth, signOut } from '@/src/lib/auth'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // Debug: Log session for troubleshooting
  if (process.env.NODE_ENV === 'development') {
    console.log('Admin Layout - Session:', {
      hasSession: !!session,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
      userRole: session?.user?.role,
    })
  }

  if (!session) {
    redirect('/login?redirect=/admin')
  }

  if (session.user?.role !== 'ADMIN') {
    redirect('/login?redirect=/admin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-900 via-cosmic-800 to-cosmic-900">
      {/* Admin Navbar */}
      <nav className="bg-cosmic-800/95 border-b border-cosmic-500/30 fixed top-0 left-0 right-0 z-50 shadow-lg">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="text-lg font-bold text-gold-gradient">
                Giftarium Admin
              </Link>
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/admin"
                  className="text-sm text-neutral-300 hover:text-magic-gold transition-colors px-2 py-1"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/products"
                  className="text-sm text-neutral-300 hover:text-magic-gold transition-colors px-2 py-1"
                >
                  Products
                </Link>
                <Link
                  href="/admin/boxes"
                  className="text-sm text-neutral-300 hover:text-magic-gold transition-colors px-2 py-1"
                >
                  Boxes
                </Link>
                <Link
                  href="/admin/users"
                  className="text-sm text-neutral-300 hover:text-magic-gold transition-colors px-2 py-1"
                >
                  Users
                </Link>
                <Link
                  href="/admin/contact"
                  className="text-sm text-neutral-300 hover:text-magic-gold transition-colors px-2 py-1"
                >
                  Contact
                </Link>
                <Link
                  href="/admin/orders"
                  className="text-sm text-neutral-300 hover:text-magic-gold transition-colors px-2 py-1"
                >
                  Orders
                </Link>
                <Link
                  href="/admin/categories"
                  className="text-sm text-neutral-300 hover:text-magic-gold transition-colors px-2 py-1"
                >
                  Categories
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-400">
                {session.user?.email}
              </span>
              <form
                action={async () => {
                  'use server'
                  await signOut({ redirectTo: '/' })
                }}
              >
                <button
                  type="submit"
                  className="text-sm text-neutral-300 hover:text-magic-gold transition-colors"
                >
                  Sign Out
                </button>
              </form>
              <Link
                href="/"
                className="text-sm text-neutral-300 hover:text-magic-gold transition-colors"
              >
                View Site
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-14 pb-8">
        {children}
      </div>
    </div>
  )
}

