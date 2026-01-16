'use client'

import { useState } from 'react'
import { ProductCategory } from '@prisma/client'
import { Button } from '@/src/components/ui/button'

interface CategoryInfo {
  category: ProductCategory
  count: number
}

interface CategoryManagementProps {
  categories: CategoryInfo[]
}

export function CategoryManagement({ categories: initialCategories }: CategoryManagementProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async (category: ProductCategory) => {
    if (!confirm(`Are you sure you want to delete the category "${category}"? This will affect all products using this category.`)) {
      return
    }

    setIsDeleting(category)
    setError(null)

    try {
      const response = await fetch(`/api/admin/categories/${category}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete category')
      }

      // Remove from local state
      setCategories(categories.filter((c) => c.category !== category))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsDeleting(null)
    }
  }

  const categoryLabels: Record<ProductCategory, string> = {
    TOYS: 'Toys',
    ACCESSORIES: 'Accessories',
    COSMETICS: 'Cosmetics',
    SWEETS: 'Sweets',
    HYGIENE: 'Hygiene',
    OTHER: 'Other',
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="card p-4 bg-error-500/20 border border-error-500/50">
          <p className="text-error-300">{error}</p>
        </div>
      )}

      <div className="card p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-neutral-50 mb-2">Current Categories</h2>
          <p className="text-sm text-neutral-400">
            These are the product categories currently available in the system. Categories are defined as enums in the database schema.
          </p>
        </div>

        <div className="space-y-3">
          {categories.map(({ category, count }) => (
            <div
              key={category}
              className="flex items-center justify-between p-4 bg-cosmic-800/50 rounded-lg border border-cosmic-500/30"
            >
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-semibold text-neutral-50">{categoryLabels[category] || category}</p>
                  <p className="text-sm text-neutral-400">
                    {count} product{count !== 1 ? 's' : ''} using this category
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {count > 0 && (
                  <span className="text-xs text-neutral-400 px-2 py-1 bg-cosmic-700 rounded">
                    In use
                  </span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(category)}
                  disabled={isDeleting === category || count > 0}
                  className="text-error-400 border-error-500/50 hover:bg-error-500/10"
                >
                  {isDeleting === category ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6 bg-magic-gold/10 border border-magic-gold/30">
        <h3 className="text-lg font-semibold text-neutral-50 mb-2">Adding New Categories</h3>
        <p className="text-sm text-neutral-300 mb-4">
          To add a new category, you need to:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-sm text-neutral-300">
          <li>Update the <code className="bg-cosmic-800 px-1 py-0.5 rounded">ProductCategory</code> enum in <code className="bg-cosmic-800 px-1 py-0.5 rounded">prisma/schema.prisma</code></li>
          <li>Run <code className="bg-cosmic-800 px-1 py-0.5 rounded">npx prisma migrate dev --name add_new_category</code></li>
          <li>Update the category labels in the codebase</li>
        </ol>
        <p className="text-sm text-neutral-400 mt-4">
          Note: Categories cannot be deleted if they are in use by any products.
        </p>
      </div>
    </div>
  )
}

