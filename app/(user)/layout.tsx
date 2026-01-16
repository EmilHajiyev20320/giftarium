import { auth } from '@/src/lib/auth'
import { redirect } from 'next/navigation'

// User pages require authentication
export default async function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }

  return <>{children}</>
}

