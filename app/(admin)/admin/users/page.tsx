'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/src/components/ui/button'

interface User {
  id: string
  email: string
  name: string | null
  role: string
  createdAt: Date
  _count: {
    orders: number
  }
}

type SortBy = 'createdAt' | 'orders'
type SortOrder = 'asc' | 'desc'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortBy>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [sortBy, sortOrder, search])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('sortBy', sortBy)
      params.set('sortOrder', sortOrder)
      if (search) params.set('search', search)
      const response = await fetch(`/api/admin/users?${params}`)
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSort = (field: SortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-900 via-cosmic-800 to-cosmic-900 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gold-gradient mb-2">Manage Users</h1>
          <p className="text-neutral-300">View and manage user accounts</p>
        </div>

        {/* Search and Sort */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search users by email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field flex-1"
          />
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'createdAt' ? 'default' : 'outline'}
              onClick={() => handleSort('createdAt')}
            >
              Sort by Date {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
            </Button>
            <Button
              variant={sortBy === 'orders' ? 'default' : 'outline'}
              onClick={() => handleSort('orders')}
            >
              Sort by Orders {sortBy === 'orders' && (sortOrder === 'asc' ? '↑' : '↓')}
            </Button>
          </div>
        </div>

        {/* Users Table */}
        {isLoading ? (
          <div className="text-center py-12 text-neutral-300">Loading...</div>
        ) : users.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-neutral-400">No users found</p>
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cosmic-500/30">
                  <th className="text-left py-3 px-4 text-neutral-300 font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-neutral-300 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-neutral-300 font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-neutral-300 font-medium">Orders</th>
                  <th className="text-left py-3 px-4 text-neutral-300 font-medium">Registered</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-cosmic-500/10 hover:bg-cosmic-800/50"
                  >
                    <td className="py-3 px-4 text-neutral-200">
                      {user.name || 'No name'}
                    </td>
                    <td className="py-3 px-4 text-neutral-200">{user.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.role === 'ADMIN'
                            ? 'bg-magic-gold/20 text-magic-gold'
                            : 'bg-cosmic-700 text-neutral-300'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-200 font-semibold">
                      {user._count.orders}
                    </td>
                    <td className="py-3 px-4 text-neutral-200 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 text-sm text-neutral-400">
          Total users: {users.length}
        </div>
      </div>
    </div>
  )
}

