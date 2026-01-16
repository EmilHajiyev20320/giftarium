import { redirect } from 'next/navigation'
import { auth } from '@/src/lib/auth'
import { db } from '@/src/lib/db'
import { ProductCategory } from '@prisma/client'
import { CategoryManagement } from '@/src/components/admin/category-management'

export default async function AdminCategoriesPage() {
  const session = await auth()

  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/login?redirect=/admin')
  }

  // Get all categories and their usage counts
  const categories = Object.values(ProductCategory)
  const categoryCounts = await Promise.all(
    categories.map(async (category) => {
      const count = await db.product.count({
        where: { category },
      })
      return { category, count }
    })
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-900 via-cosmic-800 to-cosmic-900 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gold-gradient mb-2">Manage Product Categories</h1>
          <p className="text-neutral-300">
            Manage product categories used for filtering and organization. Note: Adding or removing categories requires a database migration.
          </p>
        </div>

        <CategoryManagement categories={categoryCounts} />
      </div>
    </div>
  )
}

