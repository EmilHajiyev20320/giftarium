'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/src/components/ui/button'
import Link from 'next/link'
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

export default function AdminContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<ContactStatus | 'ALL'>('ALL')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 20

  useEffect(() => {
    fetchMessages()
  }, [statusFilter, page])

  const fetchMessages = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'ALL') {
        params.set('status', statusFilter)
      }
      params.set('page', page.toString())
      params.set('limit', limit.toString())

      const response = await fetch(`/api/admin/contact-messages?${params}`)
      const data = await response.json()

      if (response.ok) {
        setMessages(data.messages || [])
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1)
        }
      } else {
        console.error('Error fetching messages:', data.error)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setIsLoading(false)
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
        return 'Website'
      case 'ORDER':
        return 'Order'
      case 'BOX_REQUEST':
        return 'Box Request'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-900 via-cosmic-800 to-cosmic-900 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gold-gradient mb-2">Contact Messages</h1>
          <p className="text-neutral-300">Manage customer inquiries and support requests</p>
        </div>

        {/* Status Filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <Button
            variant={statusFilter === 'ALL' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setStatusFilter('ALL')
              setPage(1)
            }}
          >
            All
          </Button>
          {(['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as ContactStatus[]).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setStatusFilter(status)
                setPage(1)
              }}
            >
              {status.replace('_', ' ')}
            </Button>
          ))}
        </div>

        {/* Messages List */}
        {isLoading ? (
          <div className="card p-8 text-center">
            <p className="text-neutral-300">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-neutral-400">No messages found</p>
          </div>
        ) : (
          <>
            <div className="card overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cosmic-500/30">
                    <th className="text-left py-3 px-4 text-neutral-300 font-medium">Date</th>
                    <th className="text-left py-3 px-4 text-neutral-300 font-medium">Name</th>
                    <th className="text-left py-3 px-4 text-neutral-300 font-medium">Email</th>
                    <th className="text-left py-3 px-4 text-neutral-300 font-medium">Category</th>
                    <th className="text-left py-3 px-4 text-neutral-300 font-medium">Subject</th>
                    <th className="text-left py-3 px-4 text-neutral-300 font-medium">Order ID</th>
                    <th className="text-left py-3 px-4 text-neutral-300 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-neutral-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((message) => (
                    <tr
                      key={message.id}
                      className="border-b border-cosmic-500/10 hover:bg-cosmic-800/50"
                    >
                      <td className="py-3 px-4 text-neutral-200 text-sm">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-neutral-200 text-sm">{message.name}</td>
                      <td className="py-3 px-4 text-neutral-200 text-sm">{message.email}</td>
                      <td className="py-3 px-4 text-neutral-200 text-sm">
                        {getCategoryLabel(message.category)}
                      </td>
                      <td className="py-3 px-4 text-neutral-200 text-sm">
                        {message.subject || '-'}
                      </td>
                      <td className="py-3 px-4 text-neutral-200 text-sm font-mono">
                        {message.orderId ? message.orderId.slice(0, 8) + '...' : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${getStatusColor(message.status)}`}>
                          {message.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/contact/${message.id}`}>View</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1 || isLoading}
                >
                  Previous
                </Button>
                <span className="text-neutral-300">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || isLoading}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

