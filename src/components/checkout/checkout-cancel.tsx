'use client'

import Link from 'next/link'
import { Button } from '@/src/components/ui/button'

interface CheckoutCancelProps {
  orderId?: string
}

export function CheckoutCancel({ orderId }: CheckoutCancelProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-8 text-center">
        <div className="w-20 h-20 bg-error-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-error-500/50">
          <svg className="w-12 h-12 text-error-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-4xl font-bold mb-4 font-display">Payment Cancelled</h1>
        <p className="text-lg text-neutral-300 mb-6">
          Your payment was not completed. No charges have been made.
        </p>

        {orderId && (
          <div className="bg-cosmic-800/50 border border-cosmic-500/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-neutral-400 mb-1">Order ID</p>
            <p className="text-sm font-mono text-neutral-200">{orderId.slice(0, 12)}...</p>
            <p className="text-xs text-neutral-400 mt-2">
              Your order has been saved. You can complete the payment later.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-neutral-300">
            If you'd like to complete your purchase, you can try again or contact us for assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {orderId && (
              <Button asChild variant="outline">
                <Link href={`/orders/${orderId}`}>View Order</Link>
              </Button>
            )}
            <Button asChild>
              <Link href="/checkout">Try Again</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

