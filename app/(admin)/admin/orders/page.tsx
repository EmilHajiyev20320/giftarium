import { redirect } from 'next/navigation'
import { auth } from '@/src/lib/auth'
import { db } from '@/src/lib/db'
import Link from 'next/link'
import { Button } from '@/src/components/ui/button'

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }> | { page?: string; limit?: string }
}) {
  const session = await auth()

  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/login?redirect=/admin')
  }

  const params = searchParams instanceof Promise ? await searchParams : searchParams
  const page = parseInt(params?.page || '1', 10)
  const limit = parseInt(params?.limit || '20', 10)
  const skip = (page - 1) * limit

  const [orders, total] = await Promise.all([
    db.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true },
        },
        items: {
          include: {
            product: true,
          },
        },
        payment: true, // Include payment to show payment status
      },
      skip,
      take: limit,
    }),
    db.order.count(),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-900 via-cosmic-800 to-cosmic-900 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gold-gradient mb-2">Manage Orders</h1>
          <p className="text-neutral-300">View and monitor all orders</p>
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cosmic-500/30">
                <th className="text-left py-3 px-4 text-neutral-300 font-medium">Order ID</th>
                <th className="text-left py-3 px-4 text-neutral-300 font-medium">Customer</th>
                <th className="text-left py-3 px-4 text-neutral-300 font-medium">Type</th>
                <th className="text-left py-3 px-4 text-neutral-300 font-medium">Items</th>
                <th className="text-left py-3 px-4 text-neutral-300 font-medium">Total</th>
                <th className="text-left py-3 px-4 text-neutral-300 font-medium">Payment</th>
                <th className="text-left py-3 px-4 text-neutral-300 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-neutral-300 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-neutral-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-cosmic-500/10 hover:bg-cosmic-800/50"
                >
                  <td className="py-3 px-4 text-neutral-200 text-sm font-mono">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="py-3 px-4 text-neutral-200 text-sm">
                    {order.user?.name || order.user?.email || 'Guest'}
                  </td>
                  <td className="py-3 px-4 text-neutral-200 text-sm">{order.orderType}</td>
                  <td className="py-3 px-4 text-neutral-200 text-sm">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </td>
                  <td className="py-3 px-4 text-neutral-200 text-sm font-semibold text-gold-gradient">
                    {order.orderType === 'MYSTERY' ? order.subtotal.toFixed(2) : order.totalAmount.toFixed(2)} AZN
                  </td>
                  <td className="py-3 px-4">
                    {order.payment ? (
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${
                        order.payment.status === 'PAID'
                          ? 'bg-success-500/30 text-success-300 border-success-500/50'
                          : order.payment.status === 'PENDING'
                            ? 'bg-magic-gold/30 text-magic-gold border-magic-gold/50'
                            : order.payment.status === 'FAILED'
                              ? 'bg-error-500/30 text-error-300 border-error-500/50'
                              : order.payment.status === 'CANCELLED'
                                ? 'bg-neutral-600/50 text-neutral-200 border-neutral-500/50'
                                : 'bg-cosmic-700 text-neutral-200'
                      }`}>
                        {order.payment.status}
                      </span>
                    ) : (
                      <span className="text-xs text-neutral-400">No payment</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-neutral-200 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs bg-cosmic-700">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-neutral-200 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/orders/${order.id}`}>View</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-neutral-400">
            Showing {skip + 1}-{Math.min(skip + limit, total)} of {total} orders
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                disabled={page === 1}
              >
                <Link href={`/admin/orders?page=${Math.max(1, page - 1)}`}>
                  Previous
                </Link>
              </Button>
              <span className="text-sm text-neutral-300">
                Page {page} of {totalPages}
              </span>
              <Button
                asChild
                variant="outline"
                size="sm"
                disabled={page === totalPages}
              >
                <Link href={`/admin/orders?page=${Math.min(totalPages, page + 1)}`}>
                  Next
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

