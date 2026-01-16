'use client'

import { useEffect, useState } from 'react'
import { Product } from '@prisma/client'
import { useCartStore } from '@/src/store/cart-store'
import { useCustomBoxStore } from '@/src/store/custom-box-store'
import { Button } from '@/src/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { AuthModal } from '@/src/components/auth/auth-modal'

interface ProductDetailsProps {
  productId: string
}

export function ProductDetails({ productId }: ProductDetailsProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const addToCart = useCartStore((state) => state.addItem)
  const addToCustomBox = useCustomBoxStore((state) => state.addItem)

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/products/${productId}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data.product)
        } else {
          router.push('/products')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        router.push('/products')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [productId, router])

  const handleAddToCart = () => {
    // Check if user is authenticated
    if (!session) {
      setShowAuthModal(true)
      return
    }

    if (!product || !product.isActive || product.stock <= 0) {
      alert('This product is not available')
      return
    }

    setAddingToCart(true)
    
    // Products must be in a box - add to custom box and redirect
    addToCustomBox({
      productId: product.id,
      quantity,
      price: product.price,
      name: product.name,
      image: product.image || product.images[0],
    })

    setTimeout(() => {
      setAddingToCart(false)
      // Redirect to custom box builder
      router.push('/custom-box')
    }, 300)
  }

  if (isLoading) {
    return <div className="text-center py-12 text-neutral-200">Loading product...</div>
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-300 mb-4">Product not found.</p>
        <Button asChild>
          <Link href="/products">Back to Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        redirectTo={`/products/${productId}`}
      />
      <div className="max-w-5xl mx-auto min-h-screen py-8 px-4">
      <Button variant="outline" asChild className="mb-8">
        <Link href="/products">← Back to Products</Link>
      </Button>

      <div className="grid md:grid-cols-2 gap-8 card">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative w-full h-96 bg-gradient-berry rounded-lg overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-8xl opacity-20">🎁</span>
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((img, idx) => (
                <div key={idx} className="relative w-full h-20 bg-gradient-berry rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                  <img
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-4 text-neutral-50 font-display">{product.name}</h1>
            <p className="text-3xl font-bold text-gold-gradient mb-6">
              {product.price.toFixed(2)} AZN
            </p>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {product.stock > 0 ? (
                <span className="text-sm font-medium text-success-500 bg-success-500/20 px-4 py-2 rounded-full border border-success-500/50">
                  ✓ In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-sm font-medium text-error-500 bg-error-500/20 px-4 py-2 rounded-full border border-error-500/50">✗ Out of Stock</span>
              )}
              <span className="text-sm text-neutral-300">
                Category: {product.category}
              </span>
            </div>
          </div>

          {product.description && (
            <div>
              <h2 className="font-semibold mb-3 text-neutral-50">Description</h2>
              <p className="text-neutral-300 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Add to Cart */}
          {product.isActive && product.stock > 0 && (
            <div className="space-y-6 border-t border-cosmic-500/30 pt-6">
              <div className="flex flex-wrap items-center gap-4">
                <label className="font-medium text-neutral-200">Quantity:</label>
                <div className="flex items-center gap-2 border border-cosmic-500/50 rounded-lg p-1 bg-cosmic-800/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-8 w-8 p-0 text-neutral-200 hover:text-magic-gold"
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-medium text-neutral-50">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="h-8 w-8 p-0 text-neutral-200 hover:text-magic-gold"
                  >
                    +
                  </Button>
                </div>
                <span className="text-sm text-neutral-400">
                  (Max: {product.stock})
                </span>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full shadow-soft"
                size="lg"
              >
                {addingToCart ? 'Adding to Cart...' : `Add to Cart - ${(product.price * quantity).toFixed(2)} AZN`}
              </Button>
            </div>
          )}

          {(!product.isActive || product.stock <= 0) && (
            <div className="border-t border-cosmic-500/30 pt-6">
              <p className="text-neutral-400 text-center">
                This product is currently unavailable.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

