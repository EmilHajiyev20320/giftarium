import { redirect } from 'next/navigation'
import { auth } from '@/src/lib/auth'
import { db } from '@/src/lib/db'
import Link from 'next/link'
import { Button } from '@/src/components/ui/button'

export default async function AdminDashboard() {
  const session = await auth()

  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/login?redirect=/admin')
  }

  // Get statistics
  const [productCount, boxCount, userCount, orderCount, recentOrders] = await Promise.all([
    db.product.count(),
    db.preMadeBox.count(),
    db.user.count(),
    db.order.count(),
    db.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    }),
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-900 via-cosmic-800 to-cosmic-900 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gold-gradient mb-2">Admin Dashboard</h1>
          <p className="text-neutral-300">Manage your gift box platform</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400 mb-1">Total Products</p>
                <p className="text-3xl font-bold text-gold-gradient">{productCount}</p>
              </div>
              <div className="w-12 h-12 bg-magic-gold/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400 mb-1">Pre-Made Boxes</p>
                <p className="text-3xl font-bold text-gold-gradient">{boxCount}</p>
              </div>
              <div className="w-12 h-12 bg-magic-gold/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎁</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gold-gradient">{userCount}</p>
              </div>
              <div className="w-12 h-12 bg-magic-gold/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-gold-gradient">{orderCount}</p>
              </div>
              <div className="w-12 h-12 bg-magic-gold/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🛒</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/products" className="card p-6 hover:shadow-glow-gold transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-magic-gold/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-50 mb-1">Manage Products</h3>
                <p className="text-sm text-neutral-400">Add, edit, or delete products</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/boxes" className="card p-6 hover:shadow-glow-gold transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-magic-gold/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎁</span>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-50 mb-1">Manage Pre-Made Boxes</h3>
                <p className="text-sm text-neutral-400">Create and manage gift boxes</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/contact" className="card p-6 hover:shadow-glow-gold transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-magic-gold/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-50 mb-1">Contact Messages</h3>
                <p className="text-sm text-neutral-400">View and manage customer inquiries</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/users" className="card p-6 hover:shadow-glow-gold transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-magic-gold/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-50 mb-1">Manage Users</h3>
                <p className="text-sm text-neutral-400">View and manage user accounts</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/orders" className="card p-6 hover:shadow-glow-gold transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-magic-gold/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🛒</span>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-50 mb-1">View Orders</h3>
                <p className="text-sm text-neutral-400">Monitor and manage orders</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/categories" className="card p-6 hover:shadow-glow-gold transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-magic-gold/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏷️</span>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-50 mb-1">Manage Categories</h3>
                <p className="text-sm text-neutral-400">View and manage product categories</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-neutral-50">Recent Orders</h2>
            <Button asChild variant="outline">
              <Link href="/admin/orders">View All</Link>
            </Button>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-neutral-400 text-center py-8">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cosmic-500/30">
                    <th className="text-left py-3 px-4 text-neutral-300 font-medium">Order ID</th>
                    <th className="text-left py-3 px-4 text-neutral-300 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 text-neutral-300 font-medium">Type</th>
                    <th className="text-left py-3 px-4 text-neutral-300 font-medium">Total</th>
                    <th className="text-left py-3 px-4 text-neutral-300 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-neutral-300 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-cosmic-500/10 hover:bg-cosmic-800/50">
                      <td className="py-3 px-4 text-neutral-200 text-sm">{order.id.slice(0, 8)}...</td>
                      <td className="py-3 px-4 text-neutral-200 text-sm">
                        {order.user?.name || order.user?.email || 'Guest'}
                      </td>
                      <td className="py-3 px-4 text-neutral-200 text-sm">{order.orderType}</td>
                      <td className="py-3 px-4 text-neutral-200 text-sm font-semibold text-gold-gradient">
                        {order.orderType === 'MYSTERY' ? order.subtotal.toFixed(2) : order.totalAmount.toFixed(2)} AZN
                      </td>
                      <td className="py-3 px-4 text-neutral-200 text-sm">
                        <span className="px-2 py-1 rounded-full text-xs bg-cosmic-700">
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-200 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

