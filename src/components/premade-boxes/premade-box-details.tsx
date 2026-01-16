'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/src/components/ui/button'
import Link from 'next/link'
import { AuthModal } from '@/src/components/auth/auth-modal'

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image: string | null
  images: string[]
  category: string
}

interface PreMadeBoxItem {
  id: string
  quantity: number
  product: Product
}

interface PreMadeBox {
  id: string
  name: string
  description: string | null
  price: number
  image: string | null
  images: string[]
  items: PreMadeBoxItem[]
}

interface PreMadeBoxDetailsProps {
  boxId: string
}

export function PreMadeBoxDetails({ boxId }: PreMadeBoxDetailsProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [box, setBox] = useState<PreMadeBox | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    const fetchBox = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/premade-boxes/${boxId}`)
        if (response.ok) {
          const data = await response.json()
          setBox(data.box)
        } else {
          router.push('/premade-boxes')
        }
      } catch (error) {
        console.error('Error fetching box:', error)
        router.push('/premade-boxes')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBox()
  }, [boxId, router])

  const handleAddToCart = async () => {
    // Check if user is authenticated
    if (!session) {
      setShowAuthModal(true)
      return
    }

    if (!box) return

    setIsAddingToCart(true)

    try {
      // For pre-made boxes, we'll create the order directly or add to a special cart
      // Since pre-made boxes are handled differently, we'll redirect to checkout with the box ID
      router.push(`/checkout?premadeBoxId=${box.id}`)
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add box to cart. Please try again.')
    } finally {
      setIsAddingToCart(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto min-h-screen py-8 px-4">
        <div className="text-center py-12 text-neutral-200">Loading box details...</div>
      </div>
    )
  }

  if (!box) {
    return (
      <div className="max-w-5xl mx-auto min-h-screen py-8 px-4">
        <div className="text-center py-12">
          <p className="text-neutral-300 mb-4">Box not found.</p>
          <Button asChild>
            <Link href="/premade-boxes">Back to Pre-Made Boxes</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        redirectTo={`/premade-boxes/${boxId}`}
      />
      <div className="max-w-5xl mx-auto min-h-screen py-8 px-4">
        <Button variant="outline" asChild className="mb-8">
          <Link href="/premade-boxes">← Back to Pre-Made Boxes</Link>
        </Button>

        <div className="grid md:grid-cols-2 gap-8 card">
          {/* Box Image */}
          <div className="space-y-4">
            <div className="relative w-full h-96 bg-gradient-berry rounded-lg overflow-hidden">
              {box.image ? (
                <img
                  src={box.image}
                  alt={box.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : box.images && box.images.length > 0 ? (
                <img
                  src={box.images[0]}
                  alt={box.name}
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
            {box.images && box.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {box.images.slice(0, 4).map((img, idx) => (
                  <div key={idx} className="relative w-full h-20 bg-gradient-berry rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                    <img
                      src={img}
                      alt={`${box.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Box Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-neutral-50 font-display">{box.name}</h1>
              <p className="text-3xl font-bold text-gold-gradient mb-6">
                {box.price.toFixed(2)} AZN
              </p>
            </div>

            {box.description && (
              <div>
                <h2 className="font-semibold mb-3 text-neutral-50">Description</h2>
                <p className="text-neutral-300 leading-relaxed">{box.description}</p>
              </div>
            )}

            {/* Products Included */}
            <div>
              <h2 className="font-semibold mb-4 text-neutral-50">Products Included</h2>
              <div className="space-y-3">
                {box.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 bg-cosmic-800/50 rounded-lg border border-cosmic-500/30"
                  >
                    {item.product.image && (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-neutral-50">
                        {item.product.name}
                        {item.quantity > 1 && <span className="text-neutral-400 ml-2">(×{item.quantity})</span>}
                      </p>
                    </div>
                    <Link
                      href={`/products/${item.product.id}`}
                      className="text-magic-gold hover:text-magic-amber text-sm font-medium transition-colors"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <div className="border-t border-cosmic-500/30 pt-6">
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="w-full shadow-soft"
                size="lg"
              >
                {isAddingToCart ? 'Adding to Cart...' : `Add to Cart - ${box.price.toFixed(2)} AZN`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

