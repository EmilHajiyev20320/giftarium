import { redirect } from 'next/navigation'
import { auth } from '@/src/lib/auth'
import { db } from '@/src/lib/db'
import Link from 'next/link'
import { Button } from '@/src/components/ui/button'
import { OrderStatusUpdateForm } from '@/src/components/admin/order-status-update-form'

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()

  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/login?redirect=/admin')
  }

  const { id } = await params

  const order = await db.order.findUnique({
    where: { id },
    include: {
      user: {
        select: { name: true, email: true },
      },
      items: {
        include: {
          product: true,
        },
      },
      payment: true,
      delivery: true,
      premadeBox: true,
      boxType: true,
    },
  })

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cosmic-900 via-cosmic-800 to-cosmic-900 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="card p-8 text-center">
            <h1 className="text-2xl font-bold text-neutral-50 mb-4">Order Not Found</h1>
            <Button asChild variant="outline">
              <Link href="/admin/orders">Back to Orders</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-900 via-cosmic-800 to-cosmic-900 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/orders">← Back to Orders</Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gold-gradient mb-2">Order Details</h1>
          <p className="text-neutral-300">Order ID: {order.id}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Update */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-neutral-50 mb-4">Order Status</h2>
              <OrderStatusUpdateForm orderId={order.id} currentStatus={order.status} />
            </div>

            {/* Mystery Box Details or Order Items */}
            {order.orderType === 'MYSTERY' ? (
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-neutral-50 mb-4">🎁 Mystery Box Details</h2>
                <div className="space-y-4">
                  {order.recipientGender && (
                    <div className="p-4 bg-cosmic-800/50 rounded-lg">
                      <p className="text-sm text-neutral-400 mb-1">Recipient Gender</p>
                      <p className="font-semibold text-neutral-50 capitalize">{order.recipientGender}</p>
                    </div>
                  )}
                  {order.recipientAge && (
                    <div className="p-4 bg-cosmic-800/50 rounded-lg">
                      <p className="text-sm text-neutral-400 mb-1">Recipient Age</p>
                      <p className="font-semibold text-neutral-50">{order.recipientAge} years</p>
                    </div>
                  )}
                  {order.recipientOccasion && (
                    <div className="p-4 bg-cosmic-800/50 rounded-lg">
                      <p className="text-sm text-neutral-400 mb-1">Occasion</p>
                      <p className="font-semibold text-neutral-50 capitalize">{order.recipientOccasion.replace(/_/g, ' ')}</p>
                    </div>
                  )}
                  {order.recipientInterests && (
                    <div className="p-4 bg-cosmic-800/50 rounded-lg">
                      <p className="text-sm text-neutral-400 mb-1">Interests</p>
                      <p className="font-semibold text-neutral-50">{order.recipientInterests}</p>
                    </div>
                  )}
                  {order.recipientComments && (
                    <div className="p-4 bg-cosmic-800/50 rounded-lg">
                      <p className="text-sm text-neutral-400 mb-1">Additional Comments</p>
                      <p className="font-semibold text-neutral-50 whitespace-pre-wrap">{order.recipientComments}</p>
                    </div>
                  )}
                  <div className="p-4 bg-gradient-to-r from-magic-gold/20 to-magic-amber/20 border border-magic-gold/30 rounded-lg">
                    <p className="text-sm text-neutral-400 mb-1">Budget</p>
                    <p className="font-bold text-2xl text-gold-gradient">{order.subtotal.toFixed(2)} AZN</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-neutral-50 mb-4">Order Items</h2>
                <div className="space-y-4">
                  {order.items.length > 0 ? (
                    order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-cosmic-800/50 rounded-lg">
                        <div>
                          <p className="font-semibold text-neutral-50">
                            {item.product?.name || 'Product (removed)'}
                          </p>
                          <p className="text-sm text-neutral-400">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-gold-gradient">
                          {item.price.toFixed(2)} AZN
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-neutral-400">No items in this order</p>
                  )}
                </div>
              </div>
            )}

            {/* Customer Information */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-neutral-50 mb-4">Customer Information</h2>
              <div className="space-y-2">
                <p className="text-neutral-300">
                  <span className="font-medium">Name:</span> {order.user?.name || 'Guest'}
                </p>
                <p className="text-neutral-300">
                  <span className="font-medium">Email:</span> {order.user?.email || 'N/A'}
                </p>
              </div>
            </div>

            {/* Delivery Information */}
            {order.delivery && (
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-neutral-50 mb-4">Delivery Information</h2>
                <div className="space-y-2 text-neutral-300">
                  <p><span className="font-medium">Full Name:</span> {order.delivery.fullName || 'N/A'}</p>
                  <p><span className="font-medium">Email:</span> {order.delivery.email || 'N/A'}</p>
                  <p><span className="font-medium">Phone:</span> {order.delivery.phone || 'N/A'}</p>
                  <p><span className="font-medium">Address:</span> {order.delivery.address || 'N/A'}</p>
                  {order.delivery.placeType && (
                    <p><span className="font-medium">Place Type:</span> {order.delivery.placeType}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-neutral-50 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-neutral-300">
                  <span>Subtotal:</span>
                  <span>{order.subtotal.toFixed(2)} AZN</span>
                </div>
                {order.tax && order.tax > 0 && (
                  <div className="flex justify-between text-neutral-300">
                    <span>Tax:</span>
                    <span>{order.tax.toFixed(2)} AZN</span>
                  </div>
                )}
                {order.shippingCost && order.shippingCost > 0 && (
                  <div className="flex justify-between text-neutral-300">
                    <span>Shipping:</span>
                    <span>{order.shippingCost.toFixed(2)} AZN</span>
                  </div>
                )}
                <div className="border-t border-cosmic-500/30 pt-3 flex justify-between">
                  <span className="font-semibold text-neutral-50">Total:</span>
                  <span className="font-bold text-2xl text-gold-gradient">
                    {order.orderType === 'MYSTERY' ? order.subtotal.toFixed(2) : order.totalAmount.toFixed(2)} AZN
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            {order.payment && (
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-neutral-50 mb-4">Payment Information</h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-neutral-300">
                    <span>Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.payment.status === 'PAID'
                        ? 'bg-success-500/30 text-success-300 border border-success-500/50'
                        : order.payment.status === 'PENDING'
                          ? 'bg-magic-gold/30 text-magic-gold border border-magic-gold/50'
                          : 'bg-error-500/30 text-error-300 border border-error-500/50'
                    }`}>
                      {order.payment.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>Amount:</span>
                    <span>{order.orderType === 'MYSTERY' ? order.subtotal.toFixed(2) : order.payment.amount.toString()} {order.payment.currency}</span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>Provider:</span>
                    <span>{order.payment.provider}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Order Metadata */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-neutral-50 mb-4">Order Information</h2>
              <div className="space-y-2 text-sm text-neutral-300">
                <p><span className="font-medium">Type:</span> {order.orderType}</p>
                <p><span className="font-medium">Status:</span> {order.status}</p>
                <p><span className="font-medium">Created:</span> {new Date(order.createdAt).toLocaleString()}</p>
                <p><span className="font-medium">Updated:</span> {new Date(order.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

