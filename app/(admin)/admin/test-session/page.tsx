import { auth } from '@/src/lib/auth'
import { db } from '@/src/lib/db'

export default async function TestSessionPage() {
  const session = await auth()
  
  let dbUser = null
  if (session?.user?.id) {
    dbUser = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        role: true,
      },
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-900 via-cosmic-800 to-cosmic-900 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="card p-8">
          <h1 className="text-3xl font-bold text-gold-gradient mb-6">Session Debug Info</h1>
          
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-neutral-50 mb-2">Session Data:</h2>
              <pre className="bg-cosmic-800 p-4 rounded-lg text-sm text-neutral-200 overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neutral-50 mb-2">Database User:</h2>
              <pre className="bg-cosmic-800 p-4 rounded-lg text-sm text-neutral-200 overflow-auto">
                {JSON.stringify(dbUser, null, 2)}
              </pre>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neutral-50 mb-2">Role Check:</h2>
              <div className="bg-cosmic-800 p-4 rounded-lg">
                <p className="text-neutral-200 mb-2">
                  Session Role: <span className="font-bold">{session?.user?.role || 'NOT SET'}</span>
                </p>
                <p className="text-neutral-200 mb-2">
                  Database Role: <span className="font-bold">{dbUser?.role || 'NOT FOUND'}</span>
                </p>
                <p className="text-neutral-200 mb-2">
                  Is Admin? <span className="font-bold">{session?.user?.role === 'ADMIN' ? 'YES ✅' : 'NO ❌'}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

