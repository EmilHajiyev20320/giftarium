'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/src/components/ui/button'

interface ProfileFormProps {
  user: {
    id: string
    email: string
    name?: string | null
    image?: string | null
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter()
  const { data: session, update } = useSession()
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile')
  
  // Profile form state
  const [name, setName] = useState(user.name || '')
  const [email] = useState(user.email) // Email is read-only
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')
  
  // Password form state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '')
    }
  }, [session])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingProfile(true)
    setProfileError('')
    setProfileSuccess('')

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      const data = await response.json()

      if (!response.ok) {
        setProfileError(data.error || 'Failed to update profile')
        return
      }

      setProfileSuccess('Profile updated successfully!')
      // Update session to reflect changes
      await update()
      router.refresh()
    } catch (err) {
      setProfileError('An error occurred. Please try again.')
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    setIsChangingPassword(true)

    try {
      const response = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setPasswordError(data.error || 'Failed to change password')
        return
      }

      setPasswordSuccess('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPasswordError('An error occurred. Please try again.')
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-cosmic-500/30">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-4 px-6 font-semibold transition-all relative ${
            activeTab === 'profile'
              ? 'text-magic-gold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Profile Information
          {activeTab === 'profile' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-magic-gold to-magic-amber"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`pb-4 px-6 font-semibold transition-all relative ${
            activeTab === 'password'
              ? 'text-magic-gold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Change Password
          {activeTab === 'password' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-magic-gold to-magic-amber"></span>
          )}
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="card p-8">
          <h2 className="text-2xl font-semibold mb-6 text-neutral-50">Update Profile</h2>
          
          {profileError && (
            <div className="p-4 bg-error-500/20 border border-error-500/50 rounded-lg text-error-300 text-sm mb-6">
              {profileError}
            </div>
          )}
          
          {profileSuccess && (
            <div className="p-4 bg-success-500/20 border border-success-500/50 rounded-lg text-success-300 text-sm mb-6">
              {profileSuccess}
            </div>
          )}

          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2 text-neutral-200">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-neutral-200">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                disabled
                className="input-field bg-cosmic-900/50 border-cosmic-600/50 text-neutral-400 cursor-not-allowed opacity-60"
              />
              <p className="text-xs text-neutral-400 mt-2">Email cannot be changed</p>
            </div>

            {user.image && (
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-200">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4 p-4 bg-cosmic-800/30 rounded-lg border border-cosmic-500/30">
                  <img
                    src={user.image}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-2 border-magic-gold/30"
                  />
                  <p className="text-sm text-neutral-300">
                    Profile picture is managed by your authentication provider
                  </p>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-magic-gold to-magic-amber hover:from-magic-amber hover:to-magic-gold text-neutral-900 font-semibold shadow-lg shadow-magic-gold/20" 
              disabled={isUpdatingProfile}
              size="lg"
            >
              {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="card p-8">
          <h2 className="text-2xl font-semibold mb-6 text-neutral-50">Change Password</h2>
          
          {passwordError && (
            <div className="p-4 bg-error-500/20 border border-error-500/50 rounded-lg text-error-300 text-sm mb-6">
              {passwordError}
            </div>
          )}
          
          {passwordSuccess && (
            <div className="p-4 bg-success-500/20 border border-success-500/50 rounded-lg text-success-300 text-sm mb-6">
              {passwordSuccess}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium mb-2 text-neutral-200">
                Current Password
              </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input-field"
                  required
                />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium mb-2 text-neutral-200">
                New Password
              </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field"
                  required
                  minLength={6}
                />
              <p className="text-xs text-neutral-400 mt-2">Must be at least 6 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-neutral-200">
                Confirm New Password
              </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field"
                  required
                  minLength={6}
                />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-magic-gold to-magic-amber hover:from-magic-amber hover:to-magic-gold text-neutral-900 font-semibold shadow-lg shadow-magic-gold/20" 
              disabled={isChangingPassword}
              size="lg"
            >
              {isChangingPassword ? 'Changing Password...' : 'Change Password'}
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}

