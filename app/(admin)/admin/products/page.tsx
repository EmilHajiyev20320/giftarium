'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/src/components/ui/button'
import { ProductCategory } from '@prisma/client'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category: ProductCategory
  stock: number
  image: string | null
  images: string[]
  isActive: boolean
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 20

  useEffect(() => {
    fetchProducts()
  }, [search])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      params.set('page', page.toString())
      params.set('limit', limit.toString())
      const response = await fetch(`/api/admin/products?${params}`)
      const data = await response.json()
      setProducts(data.products || [])
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [page, search])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this product? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchProducts()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-900 via-cosmic-800 to-cosmic-900 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gold-gradient mb-2">Manage Products</h1>
            <p className="text-neutral-300">Add, edit, or delete products</p>
          </div>
          <Button onClick={() => {
            setEditingProduct(null)
            setShowForm(true)
          }}>
            + Add Product
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field w-full max-w-md"
          />
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <ProductForm
            product={editingProduct}
            onClose={() => {
              setShowForm(false)
              setEditingProduct(null)
            }}
            onSuccess={() => {
              setShowForm(false)
              setEditingProduct(null)
              fetchProducts()
            }}
          />
        )}

        {/* Products List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="w-full aspect-square bg-cosmic-700 rounded-lg mb-4"></div>
                <div className="space-y-3">
                  <div className="h-5 bg-cosmic-700 rounded w-3/4"></div>
                  <div className="h-4 bg-cosmic-700 rounded w-full"></div>
                  <div className="h-8 bg-cosmic-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-neutral-400">No products found</p>
          </div>
        ) : (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className={`card p-6 flex flex-col h-full ${!product.isActive ? 'opacity-75 border-neutral-500/50' : ''}`}>
                {/* Image - Fixed height */}
                {product.image && (
                  <div className="w-full aspect-square bg-cosmic-800/50 rounded-lg mb-4 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                )}
                
                {/* Variable content area - Fixed height with overflow */}
                <div className="flex-1 flex flex-col min-h-0 mb-4">
                  <h3 className="text-xl font-semibold text-neutral-50 mb-2 line-clamp-2 min-h-[3rem]">
                    {product.name}
                  </h3>
                  <p className="text-sm text-neutral-300 mb-4 line-clamp-3 flex-shrink-0">
                    {product.description}
                  </p>
                </div>
                
                {/* Fixed bottom section */}
                <div className="mt-auto space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gold-gradient">
                      {product.price.toFixed(2)} AZN
                    </span>
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border whitespace-nowrap ${
                      product.isActive
                        ? 'bg-success-500/30 text-success-300 border-success-500/50'
                        : 'bg-neutral-600/50 text-neutral-200 border-neutral-500/50'
                    }`}>
                      {product.isActive ? 'Active' : 'Inactive (Hidden from users)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="text-neutral-400 font-medium">Category:</span>
                      <span className="text-neutral-200 font-semibold">{product.category}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-neutral-400 font-medium">Stock:</span>
                      <span className={`font-semibold ${
                        product.stock > 10 
                          ? 'text-success-400' 
                          : product.stock > 0 
                            ? 'text-magic-amber' 
                            : 'text-error-400'
                      }`}>
                        {product.stock}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingProduct(product)
                        setShowForm(true)
                      }}
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 text-error-500 hover:text-error-400"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
              >
                Previous
              </Button>
              <span className="text-neutral-300">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isLoading}
              >
                Next
              </Button>
            </div>
          )}
          </>
        )}
      </div>
    </div>
  )
}

// Product Form Component
function ProductForm({
  product,
  onClose,
  onSuccess,
}: {
  product: Product | null
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    category: product?.category || ProductCategory.OTHER,
    stock: product?.stock || 0,
    image: product?.image || '',
    images: product?.images || [],
    isActive: product?.isActive !== false,
  })
  const [uploading, setUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (data.url) {
        setFormData((prev) => ({
          ...prev,
          image: data.url,
          images: prev.images.includes(data.url) ? prev.images : [...prev.images, data.url],
        }))
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = product
        ? `/api/admin/products/${product.id}`
        : '/api/admin/products'
      const method = product ? 'PUT' : 'POST'

      // Prepare data for submission
      const submitData = {
        name: formData.name.trim(),
        description: formData.description?.trim() || null,
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock) || 0,
        image: formData.image || null,
        images: Array.isArray(formData.images) ? formData.images : [],
        isActive: formData.isActive,
      }

      console.log('Submitting product data:', submitData)

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      })

      console.log('Response status:', response.status, response.statusText)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      if (response.ok) {
        const result = await response.json()
        console.log('Product saved successfully:', result)
        onSuccess()
      } else {
        let errorMessage = 'Failed to save product'
        try {
          const contentType = response.headers.get('content-type')
          console.log('Response content-type:', contentType)
          
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json()
            console.error('Error response data:', data)
            errorMessage = data.error || errorMessage
          } else {
            // If response is not JSON, get text
            const text = await response.text()
            console.error('Non-JSON error response (first 500 chars):', text.substring(0, 500))
            errorMessage = `Server error (${response.status}): ${response.statusText}. Check console for details.`
          }
        } catch (e: any) {
          console.error('Error parsing error response:', e)
          errorMessage = `Server error: ${response.status} ${response.statusText}. Parse error: ${e.message}`
        }
        alert(errorMessage)
      }
    } catch (error: any) {
      console.error('Error saving product:', error)
      alert(`Failed to save product: ${error.message || 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-50">
            {product ? 'Edit Product' : 'Add Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="input-field w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-200 mb-2">
                Price (AZN) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                required
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-200 mb-2">
                Stock
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                className="input-field w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
              required
              className="input-field w-full"
            >
              {Object.values(ProductCategory).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-2">
              Main Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="input-field w-full"
            />
            {uploading && <p className="text-sm text-neutral-400 mt-1">Uploading...</p>}
            {formData.image && (
              <div className="mt-2 w-32 h-32 bg-cosmic-800/50 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-2">
              Active
            </label>
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Saving...' : product ? 'Update' : 'Create'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

