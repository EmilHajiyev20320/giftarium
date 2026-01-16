'use client'

import { useEffect, useState } from 'react'
import { formatPrice, formatDate } from '@/src/lib/utils'
import Link from 'next/link'
import { Button } from '@/src/components/ui/button'

interface OrderDetailsProps {
  orderId: string
  userId: string
}

export function OrderDetails({ orderId, userId }: OrderDetailsProps) {
  interface OrderItem {
    id: string
    quantity: number
    price: number
    product: {
      name: string
      image: string | null
    } | null
  }

  interface Order {
    id: string
    orderType: string
    status: string
    totalAmount: number
    subtotal: number
    tax: number | null
    shippingCost: number | null
    createdAt: string
    items: OrderItem[]
    delivery?: {
      address: string
      city?: string
      status: string
      trackingNumber?: string | null
      fullName?: string | null
      phone?: string | null
      email?: string | null
    } | null
    paymentStatus?: string | null
    payment?: {
      id: string
      status: string
      provider: string
      amount: number
      currency: string
      providerRef: string | null
      createdAt: string
    } | null
  }

  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/orders/${orderId}`)
        const data = await response.json()
        setOrder(data.order)
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (isLoading) {
    return <div>Loading order details...</div>
  }

  if (!order) {
    return <div>Order not found.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/orders">Back to Orders</Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Order Information</h2>
          <div className="space-y-2">
            <p>
              <span className="text-muted-foreground">Status:</span>{' '}
              <span className="font-medium">{order.status}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Type:</span>{' '}
              <span className="font-medium">{order.orderType}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Placed:</span>{' '}
              <span className="font-medium">{formatDate(order.createdAt)}</span>
            </p>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Payment</h2>
          {order.payment ? (
            <div className="space-y-2">
              <p>
                <span className="text-muted-foreground">Status:</span>{' '}
                <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                  order.payment.status === 'PAID'
                    ? 'bg-success-500/30 text-success-300'
                    : order.payment.status === 'PENDING'
                      ? 'bg-magic-gold/30 text-magic-gold'
                      : order.payment.status === 'FAILED'
                        ? 'bg-error-500/30 text-error-300'
                        : 'bg-neutral-600/50 text-neutral-200'
                }`}>
                  {order.payment.status}
                </span>
              </p>
              <p>
                <span className="text-muted-foreground">Amount:</span>{' '}
                <span className="font-medium">
                  {formatPrice(order.orderType === 'MYSTERY' ? order.subtotal : order.payment.amount)} {order.payment.currency || 'AZN'}
                </span>
              </p>
              <p>
                <span className="text-muted-foreground">Provider:</span>{' '}
                <span className="font-medium">{order.payment.provider}</span>
              </p>
              {order.payment.providerRef && (
                <p>
                  <span className="text-muted-foreground">Transaction ID:</span>{' '}
                  <span className="font-mono text-sm">{order.payment.providerRef.slice(0, 20)}...</span>
                </p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">Payment not processed yet.</p>
          )}
        </div>
      </div>

      {order.items && order.items.length > 0 && (
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Items</h2>
          <div className="space-y-4">
            {order.items.map((item: { id: string; quantity: number; price: number; product: { name: string; image: string | null } | null }) => (
              <div key={item.id} className="flex justify-between border-b pb-2">
                <div>
                  <p className="font-medium">
                    {item.product?.name || 'Product'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-xl font-semibold">
              <span>Total:</span>
              <span>{formatPrice(order.orderType === 'MYSTERY' ? order.subtotal : order.totalAmount)}</span>
            </div>
          </div>
        </div>
      )}

      {order.delivery && (
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Delivery</h2>
          <div className="space-y-2">
            <p>
              <span className="text-muted-foreground">Status:</span>{' '}
              <span className="font-medium">{order.delivery.status}</span>
            </p>
            {order.delivery.trackingNumber && (
              <p>
                <span className="text-muted-foreground">Tracking:</span>{' '}
                <span className="font-medium">
                  {order.delivery.trackingNumber}
                </span>
              </p>
            )}
            <p>
              <span className="text-muted-foreground">Address:</span>{' '}
              <span className="font-medium">{order.delivery.address}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

