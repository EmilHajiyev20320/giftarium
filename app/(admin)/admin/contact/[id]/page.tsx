'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/src/components/ui/button'
import { ContactStatus, ContactCategory } from '@prisma/client'

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string | null
  category: ContactCategory
  orderId: string | null
  message: string
  status: ContactStatus
  adminNote: string | null
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string | null
    email: string
  } | null
  handledBy: {
    id: string
    name: string | null
    email: string
  } | null
}

export default function ContactMessageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [message, setMessage] = useState<ContactMessage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState<ContactStatus>('NEW')
  const [adminNote, setAdminNote] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [messageId, setMessageId] = useState<string | null>(null)

  useEffect(() => {
    params.then(({ id }) => {
      setMessageId(id)
      fetchMessage(id)
    })
  }, [params])

  const fetchMessage = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/contact-messages/${id}`)
      const data = await response.json()

      if (response.ok && data.message) {
        setMessage(data.message)
        setStatus(data.message.status)
        setAdminNote(data.message.adminNote || '')
      } else {
        setError(data.error || 'Failed to load message')
      }
    } catch (error) {
      console.error('Error fetching message:', error)
      setError('Failed to load message')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!messageId) return

    setIsSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/admin/contact-messages/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          adminNote: adminNote.trim() || null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Changes saved successfully')
        if (message) {
          setMessage({ ...message, status, adminNote: adminNote.trim() || null })
        }
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error || 'Failed to save changes')
      }
    } catch (error) {
      console.error('Error saving message:', error)
      setError('Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusColor = (status: ContactStatus) => {
    switch (status) {
      case 'NEW':
        return 'bg-magic-gold/30 text-magic-gold border-magic-gold/50'
      case 'IN_PROGRESS':
        return 'bg-magic-lavender/30 text-magic-lavender border-magic-lavender/50'
      case 'RESOLVED':
        return 'bg-success-500/30 text-success-300 border-success-500/50'
      case 'CLOSED':
        return 'bg-neutral-600/50 text-neutral-200 border-neutral-500/50'
      default:
        return 'bg-neutral-600/50 text-neutral-200 border-neutral-500/50'
    }
  }

  const getCategoryLabel = (category: ContactCategory) => {
    switch (category) {
      case 'WEBSITE':
        return 'Website Issue'
      case 'ORDER':
        return 'Order Problem'
      case 'BOX_REQUEST':
        return 'Box Request / Idea'
      case 'PAYMENT':
        return 'Payment'
      case 'DELIVERY':
        return 'Delivery'
      case 'OTHER':
        return 'Other'
      default:
        return category
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cosmic-900 via-cosmic-800 to-cosmic-900 py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="card p-8 text-center">
            <p className="text-neutral-300">Loading message...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !message) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cosmic-900 via-cosmic-800 to-cosmic-900 py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="card p-8 text-center">
            <p className="text-error-400 mb-4">{error}</p>
            <Button onClick={() => router.push('/admin/contact')} variant="outline">
              Back to Messages
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!message) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-900 via-cosmic-800 to-cosmic-900 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Button onClick={() => router.push('/admin/contact')} variant="outline" size="sm">
            ← Back to Messages
          </Button>
        </div>

        <div className="card p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gold-gradient mb-2">Contact Message Details</h1>
            <p className="text-neutral-400 text-sm">
              Created: {new Date(message.createdAt).toLocaleString()}
              {message.updatedAt !== message.createdAt && (
                <> • Updated: {new Date(message.updatedAt).toLocaleString()}</>
              )}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-error-500/20 border border-error-500/50 rounded-lg">
              <p className="text-error-400 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-success-500/20 border border-success-500/50 rounded-lg">
              <p className="text-success-300 text-sm">{success}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Message Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">Name</label>
                <p className="text-neutral-50">{message.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">Email</label>
                <p className="text-neutral-50">{message.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">Category</label>
                <p className="text-neutral-50">{getCategoryLabel(message.category)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">Order ID</label>
                <p className="text-neutral-50 font-mono">{message.orderId || '-'}</p>
              </div>
              {message.user && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-300">User Account</label>
                  <p className="text-neutral-50">
                    {message.user.name || message.user.email} ({message.user.email})
                  </p>
                </div>
              )}
              {message.handledBy && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-300">Handled By</label>
                  <p className="text-neutral-50">
                    {message.handledBy.name || message.handledBy.email}
                  </p>
                </div>
              )}
            </div>

            {message.subject && (
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">Subject</label>
                <p className="text-neutral-50">{message.subject}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-300">Message</label>
              <div className="bg-cosmic-800/50 border border-cosmic-500/30 rounded-lg p-4">
                <p className="text-neutral-200 whitespace-pre-wrap">{message.message}</p>
              </div>
            </div>

            {/* Admin Controls */}
            <div className="border-t border-cosmic-500/30 pt-6">
              <h2 className="text-xl font-semibold mb-4 text-neutral-50">Admin Actions</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-300">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ContactStatus)}
                    className="input-field w-full text-neutral-50 bg-cosmic-800"
                  >
                    <option value="NEW">New</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-300">Admin Note</label>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    className="input-field w-full"
                    rows={4}
                    placeholder="Internal notes about this message..."
                  />
                  <p className="text-xs text-neutral-400 mt-1">
                    Internal notes - not visible to the customer
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

