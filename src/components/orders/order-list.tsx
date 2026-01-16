'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/src/i18n/routing'
import { formatPrice, formatDate } from '@/src/lib/utils'

interface Order {
  id: string
  orderType: string
  status: string
  totalAmount: number
  createdAt: string
}

interface OrderListProps {
  userId: string
}

export function OrderList({ userId }: OrderListProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const fetchOrders = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/orders')
        const data = await response.json()
        if (isMounted) {
          setOrders(data.orders || [])
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchOrders()
    
    return () => {
      isMounted = false
    }
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="space-y-3">
              <div className="h-6 bg-cosmic-700 rounded w-1/4"></div>
              <div className="h-4 bg-cosmic-700 rounded w-1/2"></div>
              <div className="h-4 bg-cosmic-700 rounded w-1/3"></div>
              <div className="h-10 bg-cosmic-700 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-300 mb-4">You haven't placed any orders yet.</p>
        <Link href="/products" className="text-magic-gold hover:text-magic-amber transition-colors underline">
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/orders/${order.id}`}
          className="block card hover:border-magic-gold/50 transition-all"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <p className="font-semibold text-neutral-50 mb-2">Order #{order.id.slice(0, 8)}</p>
              <p className="text-sm text-neutral-300 mb-1">
                {formatDate(order.createdAt)}
              </p>
              <p className="text-sm text-neutral-400">
                Type: {order.orderType} | Status: {order.status}
              </p>
            </div>
            <div className="text-right sm:text-left">
              <p className="font-semibold text-lg text-gold-gradient">
                {formatPrice(order.totalAmount)}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

