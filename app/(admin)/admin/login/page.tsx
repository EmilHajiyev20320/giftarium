'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to regular login page
    router.replace('/login?redirect=/admin')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cosmic-900 via-cosmic-800 to-cosmic-900">
      <div className="text-center">
        <p className="text-neutral-300">Redirecting to login...</p>
      </div>
    </div>
  )
}

