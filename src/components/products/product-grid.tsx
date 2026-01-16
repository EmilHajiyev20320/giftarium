'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { Product } from '@prisma/client'
import { useCartStore } from '@/src/store/cart-store'
import { useCustomBoxStore } from '@/src/store/custom-box-store'
import { Button } from '@/src/components/ui/button'
import { Link } from '@/src/i18n/routing'
import { useSession } from 'next-auth/react'
import { AuthModal } from '@/src/components/auth/auth-modal'

interface ProductGridProps {
  category?: string
  search?: string
  mode?: 'cart' | 'custom-box' // Which store to add to
}

export function ProductGrid({ category, search, mode = 'cart' }: ProductGridProps) {
  const { data: session } = useSession()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const addToCart = useCartStore((state) => state.addItem)
  const addToCustomBox = useCustomBoxStore((state) => state.addItem)
  
  const addItem = mode === 'custom-box' ? addToCustomBox : addToCart

  useEffect(() => {
    let isMounted = true
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams()
        if (category) params.set('category', category)
        if (search) params.set('search', search)

        const response = await fetch(`/api/products?${params}`)
        const data = await response.json()
        if (isMounted) {
          setProducts(data.products || [])
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchProducts()
    
    return () => {
      isMounted = false
    }
  }, [category, search])

  const handleAddToCart = useCallback(async (product: Product) => {
    // Check if user is authenticated
    if (!session) {
      setShowAuthModal(true)
      return
    }

    if (!product.isActive || product.stock <= 0) {
      alert('This product is not available')
      return
    }

    setAddingToCart(product.id)
    
    if (mode === 'custom-box') {
      // Already in custom box mode, just add to box
      addItem({
        productId: product.id,
        quantity: 1,
        price: product.price,
        name: product.name,
        image: product.image || product.images[0],
      })
      
      setTimeout(() => {
        setAddingToCart(null)
      }, 500)
    } else {
      // Adding from products page - must go through custom box flow
      // Add to custom box store and redirect
      const customBoxStore = useCustomBoxStore.getState()
      customBoxStore.addItem({
        productId: product.id,
        quantity: 1,
        price: product.price,
        name: product.name,
        image: product.image || product.images[0],
      })
      
      // Redirect to custom box builder
      setTimeout(() => {
        setAddingToCart(null)
        window.location.href = '/custom-box'
      }, 300)
    }
  }, [session, mode, addItem])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card overflow-hidden animate-pulse">
            <div className="w-full h-60 bg-cosmic-600"></div>
            <div className="p-5 space-y-3">
              <div className="h-4 bg-cosmic-600 rounded w-3/4"></div>
              <div className="h-3 bg-cosmic-600 rounded w-full"></div>
              <div className="h-3 bg-cosmic-600 rounded w-2/3"></div>
              <div className="h-6 bg-cosmic-600 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-24 h-24 bg-gradient-magic rounded-full flex items-center justify-center mb-6 shadow-glow-gold">
          <span className="text-5xl">📦</span>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-neutral-50">No products found</h3>
        <p className="text-neutral-300 text-center max-w-md">
          We couldn't find any products matching your criteria. Try adjusting your filters.
        </p>
      </div>
    )
  }

  return (
    <>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        redirectTo={typeof window !== 'undefined' ? window.location.pathname : undefined}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
        <div
          key={product.id}
          className="card overflow-hidden hover:-translate-y-1"
        >
          {/* Product Image */}
          <div className="relative w-full h-60 bg-gradient-berry overflow-hidden">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
                unoptimized={product.image.startsWith('http')}
              />
            ) : product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
                unoptimized={product.images[0].startsWith('http')}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-6xl opacity-30">🎁</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-6">
            <Link href={`/products/${product.id}`}>
              <h3 className="font-semibold text-xl mb-2 text-neutral-50 hover:text-magic-gold transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>
            
            <p className="text-neutral-300 text-sm mb-4 line-clamp-2 leading-relaxed min-h-[2.5rem]">
              {product.description}
            </p>

            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-2xl text-gold-gradient">{product.price.toFixed(2)} AZN</p>
              {product.stock > 0 ? (
                <span className="text-xs font-medium text-success-500 bg-success-500/20 px-3 py-1 rounded-full border border-success-500/50">
                  In Stock
                </span>
              ) : (
                <span className="text-xs font-medium text-error-500 bg-error-500/20 px-3 py-1 rounded-full border border-error-500/50">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => handleAddToCart(product)}
                disabled={!product.isActive || product.stock <= 0 || addingToCart === product.id}
                className="flex-1"
                size="default"
              >
                {addingToCart === product.id
                  ? 'Adding...'
                  : product.stock > 0
                  ? mode === 'custom-box'
                    ? 'Add to Box'
                    : 'Add to Cart'
                  : 'Out of Stock'}
              </Button>
              <Button
                asChild
                variant="outline"
                size="default"
                className="sm:w-auto w-full"
              >
                <Link href={`/products/${product.id}`}>View</Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
      </div>
    </>
  )
}

