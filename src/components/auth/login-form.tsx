'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/src/components/ui/button'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const redirectTo = searchParams.get('redirect') || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        // Wait for session to update
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // Check session to determine redirect
        try {
          const sessionResponse = await fetch('/api/auth/session', { 
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache',
            }
          })
          const session = await sessionResponse.json()
          
          // If user is admin, always redirect to admin panel (ignore redirect param)
          if (session?.user?.role === 'ADMIN') {
            router.push('/admin')
            router.refresh()
            return // Exit early to prevent double navigation
          }
        } catch (err) {
          console.error('Error checking session:', err)
        }
        
        // Regular user - use redirect param or go to home
        router.push(redirectTo)
        router.refresh()
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    // For Google sign-in, we'll handle redirect in the callback
    // If user is admin, they'll be redirected to /admin via middleware/auth callback
    signIn('google', { callbackUrl: redirectTo })
  }

  return (
    <div className="card max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-error-500/20 border border-error-500/50 rounded-lg text-error-500 text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2 text-neutral-200">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (error) setError('')
            }}
            required
            className="input-field"
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2 text-neutral-200">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (error) setError('')
            }}
            required
            className="input-field"
            autoComplete="current-password"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-cosmic-500/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-cosmic-700 px-2 text-neutral-400">Or continue with</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
        >
          Sign in with Google
        </Button>

        <p className="text-center text-sm text-neutral-300">
          Don't have an account?{' '}
          <a href="/register" className="text-magic-gold hover:text-magic-amber font-medium">
            Sign up
          </a>
        </p>
      </form>
    </div>
  )
}

