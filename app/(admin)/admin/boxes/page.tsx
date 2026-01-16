'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/src/components/ui/button'

interface PreMadeBox {
  id: string
  name: string
  description: string | null
  price: number
  image: string | null
  images: string[]
  isActive: boolean
  items?: {
    id: string
    productId: string
    quantity: number
    product: {
      id: string
      name: string
      price: number
    }
  }[]
}

interface Product {
  id: string
  name: string
  description: string | null
  price: number
}

export default function AdminBoxesPage() {
  const [boxes, setBoxes] = useState<PreMadeBox[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBox, setEditingBox] = useState<PreMadeBox | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 20

  useEffect(() => {
    fetchBoxes()
  }, [search])

  const fetchBoxes = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      const response = await fetch(`/api/admin/premade-boxes?${params}`)
      const data = await response.json()
      setBoxes(data.boxes || [])
    } catch (error) {
      console.error('Error fetching boxes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this box?')) return

    try {
      const response = await fetch(`/api/admin/premade-boxes/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchBoxes()
      }
    } catch (error) {
      console.error('Error deleting box:', error)
      alert('Failed to delete box')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-900 via-cosmic-800 to-cosmic-900 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gold-gradient mb-2">Manage Pre-Made Boxes</h1>
            <p className="text-neutral-300">Add, edit, or delete pre-made gift boxes</p>
          </div>
          <Button onClick={() => {
            setEditingBox(null)
            setShowForm(true)
          }}>
            + Add Box
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search boxes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field w-full max-w-md"
          />
        </div>

        {/* Box Form Modal */}
        {showForm && (
          <BoxForm
            box={editingBox}
            onClose={() => {
              setShowForm(false)
              setEditingBox(null)
            }}
            onSuccess={() => {
              setShowForm(false)
              setEditingBox(null)
              fetchBoxes()
            }}
          />
        )}

        {/* Boxes List */}
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
        ) : boxes.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-neutral-400">No boxes found</p>
          </div>
        ) : (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boxes.map((box) => (
              <div key={box.id} className="card p-6 flex flex-col h-full">
                {/* Image - Fixed height */}
                {box.image && (
                  <div className="w-full aspect-square bg-cosmic-800/50 rounded-lg mb-4 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img
                      src={box.image}
                      alt={box.name}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                )}
                
                {/* Variable content area - Fixed height with overflow */}
                <div className="flex-1 flex flex-col min-h-0 mb-4">
                  <h3 className="text-xl font-semibold text-neutral-50 mb-2 line-clamp-2 min-h-[3rem]">
                    {box.name}
                  </h3>
                  <p className="text-sm text-neutral-300 mb-2 line-clamp-3 flex-shrink-0">
                    {box.description}
                  </p>
                  {box.items && box.items.length > 0 && (
                    <div className="mb-3 flex-shrink-0">
                      <span className="text-xs text-neutral-400 font-medium">Products:</span>
                      <span className="text-xs text-neutral-200 font-semibold ml-1">
                        {box.items.length} item{box.items.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Fixed bottom section */}
                <div className="mt-auto space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gold-gradient">
                      {box.price.toFixed(2)} AZN
                    </span>
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border whitespace-nowrap ${
                      box.isActive
                        ? 'bg-success-500/30 text-success-300 border-success-500/50'
                        : 'bg-neutral-600/50 text-neutral-200 border-neutral-500/50'
                    }`}>
                      {box.isActive ? 'Active' : 'Inactive (Hidden from users)'}
                    </span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingBox(box)
                        setShowForm(true)
                      }}
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDelete(box.id)}
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

// Box Form Component
function BoxForm({
  box,
  onClose,
  onSuccess,
}: {
  box: PreMadeBox | null
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState({
    name: box?.name || '',
    description: box?.description || '',
    price: box?.price || 0,
    image: box?.image || '',
    images: box?.images || [],
    isActive: box?.isActive !== false,
    items: box?.items?.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
    })) || [],
  })
  const [products, setProducts] = useState<Product[]>([])
  const [uploading, setUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showProductSelector, setShowProductSelector] = useState(false)
  const [productSearch, setProductSearch] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

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

  const handleAddProduct = (productId: string, quantity: number = 1) => {
    const existingItem = formData.items.find(item => item.productId === productId)
    if (existingItem) {
      setFormData({
        ...formData,
        items: formData.items.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ),
      })
    } else {
      setFormData({
        ...formData,
        items: [...formData.items, { productId, quantity }],
      })
    }
    setShowProductSelector(false)
    setProductSearch('')
  }

  const handleRemoveProduct = (productId: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter(item => item.productId !== productId),
    })
  }

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveProduct(productId)
      return
    }
    setFormData({
      ...formData,
      items: formData.items.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      ),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = box
        ? `/api/admin/premade-boxes/${box.id}`
        : '/api/admin/premade-boxes'
      const method = box ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onSuccess()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to save box')
      }
    } catch (error) {
      console.error('Error saving box:', error)
      alert('Failed to save box')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedProducts = formData.items.map(item => {
    const product = products.find(p => p.id === item.productId)
    return product ? { ...item, product } : null
  }).filter(Boolean) as Array<{ productId: string; quantity: number; product: Product }>

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-50">
            {box ? 'Edit Pre-Made Box' : 'Add Pre-Made Box'}
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

          {/* Products in Box */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-neutral-200">
                Products in Box
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowProductSelector(true)}
              >
                + Add Product
              </Button>
            </div>
            {selectedProducts.length === 0 ? (
              <p className="text-sm text-neutral-400 py-4 text-center border border-cosmic-500/30 rounded-lg">
                No products added yet
              </p>
            ) : (
              <div className="space-y-2 border border-cosmic-500/30 rounded-lg p-4">
                {selectedProducts.map((item) => (
                  <div key={item.productId} className="bg-cosmic-800/50 p-3 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-neutral-200 mb-1">
                          {item.product.name}
                          {item.quantity > 1 && <span className="text-neutral-400 ml-2">(×{item.quantity})</span>}
                        </p>
                        {item.product.description && (
                          <p className="text-xs text-neutral-300 line-clamp-2">
                            {item.product.description}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(item.productId)}
                        className="ml-2 text-xs text-error-500 hover:text-error-400 whitespace-nowrap"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                        className="px-2 py-1 border border-cosmic-500/50 rounded text-xs hover:bg-cosmic-700"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs text-neutral-300">Qty: {item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                        className="px-2 py-1 border border-cosmic-500/50 rounded text-xs hover:bg-cosmic-700"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
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
              {isSubmitting ? 'Saving...' : box ? 'Update' : 'Create'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>

        {/* Product Selector Modal */}
        {showProductSelector && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
            <div className="card p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-neutral-50">Select Product</h3>
                <button
                  onClick={() => {
                    setShowProductSelector(false)
                    setProductSearch('')
                  }}
                  className="text-neutral-400 hover:text-neutral-200"
                >
                  ✕
                </button>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="input-field w-full"
                />
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {products
                  .filter(product => {
                    if (!productSearch) return true
                    const search = productSearch.toLowerCase()
                    return product.name.toLowerCase().includes(search) ||
                           product.description?.toLowerCase().includes(search)
                  })
                  .map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 bg-cosmic-800/50 rounded-lg hover:bg-cosmic-700/50 cursor-pointer"
                    onClick={() => handleAddProduct(product.id, 1)}
                  >
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-200 truncate">{product.name}</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddProduct(product.id, 1)
                      }}
                    >
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

