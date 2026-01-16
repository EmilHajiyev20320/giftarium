import { NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth'

export async function GET() {
  const session = await auth()
  
  return NextResponse.json({
    hasSession: !!session,
    session: session ? {
      user: {
        id: session.user?.id,
        email: session.user?.email,
        name: session.user?.name,
        role: session.user?.role,
      },
    } : null,
  })
}

