'use client'

import { useState } from 'react'
import { OrderStatus } from '@prisma/client'
import { Button } from '@/src/components/ui/button'

interface OrderStatusUpdateFormProps {
  orderId: string
  currentStatus: OrderStatus
}

const orderStatuses: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
]

export function OrderStatusUpdateForm({ orderId, currentStatus }: OrderStatusUpdateFormProps) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleUpdate = async () => {
    setIsUpdating(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update order status')
      }

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        window.location.reload()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-200 mb-2">
          Order Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
          className="input-field w-full bg-cosmic-800 text-neutral-50"
          disabled={isUpdating}
        >
          {orderStatuses.map((statusOption) => (
            <option key={statusOption} value={statusOption}>
              {statusOption}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="p-3 bg-error-500/20 border border-error-500/50 rounded-lg">
          <p className="text-sm text-error-300">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-3 bg-success-500/20 border border-success-500/50 rounded-lg">
          <p className="text-sm text-success-300">Order status updated successfully!</p>
        </div>
      )}

      <Button
        onClick={handleUpdate}
        disabled={isUpdating || status === currentStatus}
        className="w-full"
      >
        {isUpdating ? 'Updating...' : 'Update Status'}
      </Button>
    </div>
  )
}

