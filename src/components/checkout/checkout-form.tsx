'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCartStore } from '@/src/store/cart-store'
import { useCustomBoxStore } from '@/src/store/custom-box-store'
import { Button } from '@/src/components/ui/button'

export function CheckoutForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('checkout')
  const tCommon = useTranslations('common')
  const cartItems = useCartStore((state) => state.items)
  const cartTotal = useCartStore((state) => state.getTotal())
  const clearCart = useCartStore((state) => state.clearCart)
  
  const customBoxItems = useCustomBoxStore((state) => state.items)
  const customBoxTotal = useCustomBoxStore((state) => state.getTotal())
  const customBoxPostcard = useCustomBoxStore((state) => state.postcardText)
  const clearCustomBox = useCustomBoxStore((state) => state.clearBox)

  // Check if we're completing a mystery box order
  const pendingOrderId = searchParams.get('orderId')
  const isMysteryOrder = !!pendingOrderId
  const [mysteryOrder, setMysteryOrder] = useState<any>(null)
  const [isLoadingMysteryOrder, setIsLoadingMysteryOrder] = useState(false)
  
  // Check if we're ordering a pre-made box
  const premadeBoxId = searchParams.get('premadeBoxId')
  const [premadeBox, setPreMadeBox] = useState<any>(null)
  const [isLoadingBox, setIsLoadingBox] = useState(false)

  // Use custom box items if available, otherwise use cart items
  const items = customBoxItems.length > 0 ? customBoxItems : cartItems
  const getTotal = () => {
    if (mysteryOrder) return mysteryOrder.subtotal // Use budget (subtotal) for mystery boxes
    if (premadeBox) return premadeBox.price
    return customBoxItems.length > 0 ? customBoxTotal : cartTotal
  }

  // Fetch mystery order details if orderId is in URL
  useEffect(() => {
    if (pendingOrderId) {
      setIsLoadingMysteryOrder(true)
      fetch(`/api/orders/${pendingOrderId}`)
        .then(res => res.json())
        .then(data => {
          if (data.order) {
            setMysteryOrder(data.order)
          }
        })
        .catch(err => console.error('Error fetching mystery order:', err))
        .finally(() => setIsLoadingMysteryOrder(false))
    }
  }, [pendingOrderId])

  // Fetch pre-made box if ID is in URL
  useEffect(() => {
    if (premadeBoxId) {
      setIsLoadingBox(true)
      fetch(`/api/premade-boxes/${premadeBoxId}`)
        .then(res => res.json())
        .then(data => {
          if (data.box) {
            setPreMadeBox(data.box)
          }
        })
        .catch(err => console.error('Error fetching box:', err))
        .finally(() => setIsLoadingBox(false))
    }
  }, [premadeBoxId])

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    placeType: '',
    country: 'Azerbaijan',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters'
    } else if (formData.fullName.trim().length > 100) {
      newErrors.fullName = 'Full name must be less than 100 characters'
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address'
      }
    }

    // Phone validation (basic - at least 7 digits)
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else {
      const phoneDigits = formData.phone.replace(/\D/g, '')
      if (phoneDigits.length < 7) {
        newErrors.phone = 'Phone number must contain at least 7 digits'
      }
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    } else if (formData.address.trim().length < 5) {
      newErrors.address = 'Address must be at least 5 characters'
    } else if (formData.address.trim().length > 200) {
      newErrors.address = 'Address must be less than 200 characters'
    }

    // Place type validation (optional)
    if (formData.placeType && formData.placeType.trim().length > 50) {
      newErrors.placeType = 'Place type must be less than 50 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form before submission
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setErrors({}) // Clear previous errors

    try {
      let checkoutData: any

      if (isMysteryOrder) {
        // For mystery orders, we need to complete the order first, then create payment
        // This is a special case - we'll handle it differently
        const completeResponse = await fetch(`/api/orders/${pendingOrderId}/complete`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            delivery: formData,
          }),
        })

        if (!completeResponse.ok) {
          const errorData = await completeResponse.json()
          setErrors({ _general: errorData.error || 'Failed to complete order' })
          window.scrollTo({ top: 0, behavior: 'smooth' })
          return
        }

        // After completing mystery order, redirect to success page
        router.push(`/checkout/success?orderId=${pendingOrderId}&whatsapp=true`)
        return
      } else if (premadeBoxId && premadeBox) {
        // PREMADE order
        checkoutData = {
          orderType: 'PREMADE',
          premadeBoxId: premadeBoxId,
          delivery: formData,
        }
      } else {
        // CUSTOM order
        checkoutData = {
          orderType: 'CUSTOM',
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price, // Will be recalculated on server
          })),
          delivery: formData,
        }

        // Add postcard if this is a custom box order
        if (customBoxItems.length > 0) {
          if (customBoxPostcard) {
            checkoutData.postcardText = customBoxPostcard
          }
        }
      }

      // Call checkout API to create order and payment session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutData),
      })

      const data = await response.json()

      if (response.ok && data.orderId) {
        // Clear stores after successful order creation
        if (customBoxItems.length > 0) {
          clearCustomBox()
        } else if (!premadeBoxId) {
          clearCart()
        }
        
        // Clear pending mystery order from storage
        if (isMysteryOrder) {
          sessionStorage.removeItem('pendingMysteryOrderId')
        }
        
        // Redirect to success page with WhatsApp message
        router.push(`/checkout/success?orderId=${data.orderId}&whatsapp=true`)
      } else {
        // Error handling - show detailed error if available
        let errorMessage = data.error || data.message || 'Failed to process checkout'
        
        // Include validation details if available
        if (data.details && Array.isArray(data.details)) {
          const detailMessages = data.details.map((d: any) => `${d.path.join('.')}: ${d.message}`).join(', ')
          errorMessage = `${errorMessage}. ${detailMessages}`
        }
        
        setErrors({ _general: errorMessage })
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (error) {
      console.error('Error during checkout:', error)
      const errorMessage = error instanceof Error ? error.message : 'An error occurred. Please try again.'
      setErrors({ _general: errorMessage })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingBox) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-300">Loading box details...</p>
      </div>
    )
  }

  if (!isMysteryOrder && !premadeBoxId && items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-300 mb-4">Your cart is empty.</p>
        <Button asChild>
          <a href="/products">Browse Products</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="card">
        <h2 className="text-3xl font-semibold mb-4 text-neutral-50 font-display">{t('title')}</h2>
        <p className="text-sm text-neutral-300 mb-6">
          {t('description')}
        </p>
        {errors._general && (
          <div className="mb-6 p-4 bg-error-500/20 border border-error-500/50 rounded-lg">
            <p className="text-error-400 text-sm">{errors._general}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-200">{t('fullName')} *</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                if (errors.fullName) {
                  setErrors((prev) => ({ ...prev, fullName: '' }))
                }
              }}
              className={`input-field ${errors.fullName ? 'border-error-500' : ''}`}
              required
            />
            {errors.fullName && (
              <p className="text-sm text-error-500 mt-1">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-200">{t('email')} *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, email: e.target.value }))
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: '' }))
                }
              }}
              className={`input-field ${errors.email ? 'border-error-500' : ''}`}
              required
            />
            {errors.email && (
              <p className="text-sm text-error-500 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-200">{t('phone')} *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
                if (errors.phone) {
                  setErrors((prev) => ({ ...prev, phone: '' }))
                }
              }}
              className={`input-field ${errors.phone ? 'border-error-500' : ''}`}
              placeholder="+994501234567"
              required
            />
            <p className="text-xs text-neutral-200 mt-1 flex items-start gap-1.5">
              <span className="text-magic-gold">⚠️</span>
              <span>{t('phoneHint')}</span>
            </p>
            {errors.phone && (
              <p className="text-sm text-error-500 mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-200">{t('address')} *</label>
            <textarea
              value={formData.address}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, address: e.target.value }))
                if (errors.address) {
                  setErrors((prev) => ({ ...prev, address: '' }))
                }
              }}
              className={`input-field ${errors.address ? 'border-error-500' : ''}`}
              rows={3}
              required
            />
            {errors.address && (
              <p className="text-sm text-error-500 mt-1">{errors.address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-200">{t('placeType')}</label>
            <select
              value={formData.placeType}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, placeType: e.target.value }))
                if (errors.placeType) {
                  setErrors((prev) => ({ ...prev, placeType: '' }))
                }
              }}
              className="input-field"
            >
              <option value="">{t('placeTypeOptions.select')}</option>
              <option value="apartment">{t('placeTypeOptions.apartment')}</option>
              <option value="house">{t('placeTypeOptions.house')}</option>
              <option value="office">{t('placeTypeOptions.office')}</option>
              <option value="other">{t('placeTypeOptions.other')}</option>
            </select>
            {errors.placeType && (
              <p className="text-sm text-error-500 mt-1">{errors.placeType}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t('submitting') : t('submitOrder')}
          </Button>
          <p className="text-xs text-center text-neutral-200 mt-2">
            {t('afterSubmit')}
          </p>
        </form>
      </div>

      <div className="card sticky top-24">
        <h2 className="text-2xl font-semibold mb-6 text-neutral-50">Order Summary</h2>
        {isLoadingMysteryOrder && (
          <div className="py-4 text-center text-neutral-400">Loading order details...</div>
        )}
        <div className="space-y-4 mb-6">
          {/* Mystery Box Summary */}
          {isMysteryOrder && mysteryOrder && (
            <div className="pb-4 border-b border-cosmic-500/30">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <p className="font-semibold text-neutral-50 text-lg">🎁 Mystery Gift Box</p>
                  <p className="text-xs text-neutral-400 mt-1">We'll curate a special surprise box for you</p>
                </div>
                <span className="font-semibold text-gold-gradient ml-4">{mysteryOrder.subtotal.toFixed(2)} AZN</span>
              </div>
              <div className="space-y-2 text-sm">
                {mysteryOrder.recipientGender && (
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Recipient Gender:</span>
                    <span className="text-neutral-200 capitalize">{mysteryOrder.recipientGender}</span>
                  </div>
                )}
                {mysteryOrder.recipientAge && (
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Recipient Age:</span>
                    <span className="text-neutral-200">{mysteryOrder.recipientAge} years</span>
                  </div>
                )}
                {mysteryOrder.recipientOccasion && (
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Occasion:</span>
                    <span className="text-neutral-200 capitalize">{mysteryOrder.recipientOccasion.replace(/_/g, ' ')}</span>
                  </div>
                )}
                {mysteryOrder.recipientInterests && (
                  <div>
                    <span className="text-neutral-400">Interests: </span>
                    <span className="text-neutral-200">{mysteryOrder.recipientInterests}</span>
                  </div>
                )}
                {mysteryOrder.recipientComments && (
                  <div className="pt-2 border-t border-cosmic-500/20">
                    <p className="text-xs text-neutral-400 mb-1">Additional Comments:</p>
                    <p className="text-xs text-neutral-300 line-clamp-3">{mysteryOrder.recipientComments}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pre-Made Box */}
          {premadeBox && !isMysteryOrder && (
            <div className="pb-4 border-b border-cosmic-500/30">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="font-semibold text-neutral-50">{premadeBox.name}</p>
                  {premadeBox.description && (
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{premadeBox.description}</p>
                  )}
                </div>
                <span className="font-semibold text-gold-gradient ml-4">{premadeBox.price.toFixed(2)} AZN</span>
              </div>
              <div className="mt-3">
                <p className="text-xs font-medium text-neutral-300 mb-2">Products Included:</p>
                <div className="space-y-1">
                  {premadeBox.items?.map((item: { id: string; quantity: number; product: { name: string; price: number } }) => (
                    <div key={item.id} className="text-xs text-neutral-300 flex justify-between">
                      <span>{item.product.name} {item.quantity > 1 && `× ${item.quantity}`}</span>
                      <span className="text-neutral-400">{(item.product.price * item.quantity).toFixed(2)} AZN</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Products (for custom boxes or cart) */}
          {!premadeBox && !isMysteryOrder && items.map((item) => (
            <div key={item.productId} className="flex justify-between items-center py-3 border-b border-cosmic-500/30 last:border-0">
              <span className="text-neutral-200">
                {item.name} × {item.quantity}
              </span>
              <span className="font-semibold text-gold-gradient">{(item.price * item.quantity).toFixed(2)} AZN</span>
            </div>
          ))}
          
          {/* Postcard */}
          {customBoxPostcard && !premadeBox && !isMysteryOrder && (
            <div className="py-3 border-b border-cosmic-500/30">
              <p className="text-xs text-neutral-400 mb-1">Postcard Message</p>
              <p className="text-sm text-neutral-200 line-clamp-2">{customBoxPostcard}</p>
            </div>
          )}
        </div>
        <div className="border-t-2 border-cosmic-500/30 pt-6">
          <div className="flex justify-between text-2xl font-bold text-gold-gradient">
            <span>Total:</span>
            <span>{getTotal().toFixed(2)} AZN</span>
          </div>
        </div>
      </div>
    </div>
  )
}

