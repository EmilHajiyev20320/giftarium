'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useCustomBoxStore } from '@/src/store/custom-box-store'
import { Button } from '@/src/components/ui/button'
import { Link } from '@/src/i18n/routing'
import { ProductGrid } from '@/src/components/products/product-grid'
import { PostcardStep } from './postcard-step'

type Step = 'products' | 'postcard'

export function CustomBoxBuilder() {
  const t = useTranslations('customBox')
  const { items, postcardText, removeItem, updateQuantity, getTotal, clearBox } = useCustomBoxStore()
  const [currentStep, setCurrentStep] = useState<Step>('products')
  const [mounted, setMounted] = useState(false)

  // Fix hydration error by only rendering after client-side mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Always start from the beginning - no auto-advance

  const handlePostcardComplete = () => {
    // Navigate to checkout after postcard
    window.location.href = '/checkout'
  }

  const handlePostcardSkip = () => {
    // Navigate to checkout after skipping postcard
    window.location.href = '/checkout'
  }

  const handleGoToPostcard = () => {
    // Go to postcard step
    setCurrentStep('postcard')
  }

  const handleSkipPostcard = () => {
    // Skip postcard and go to checkout
    window.location.href = '/checkout'
  }

  const canProceedToPostcard = items.length > 0
  const canProceedToCheckout = items.length > 0

  return (
    <div>
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setCurrentStep('products')}
            disabled={currentStep === 'products'}
            className={`flex items-center transition-all ${
              currentStep === 'products' 
                ? 'text-magic-gold cursor-default' 
                : items.length > 0
                  ? 'text-magic-gold hover:text-magic-amber cursor-pointer' 
                  : 'text-neutral-400 cursor-not-allowed'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
              currentStep === 'products' 
                ? 'border-magic-gold bg-cosmic-700 shadow-glow-gold' 
                : items.length > 0
                  ? 'border-magic-gold bg-cosmic-700 hover:shadow-glow-purple' 
                  : 'border-cosmic-500/30 bg-cosmic-800/50'
            }`}>
              {items.length > 0 && currentStep !== 'products' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span>1</span>
              )}
            </div>
            <span className="ml-2 font-medium hidden sm:inline">{t('steps.products')}</span>
          </button>
          
          <div className={`w-12 sm:w-16 h-0.5 transition-colors ${
            currentStep === 'postcard' && items.length > 0
              ? 'bg-gradient-magic' 
              : 'bg-cosmic-500/30'
          }`} />
          
          <button
            onClick={() => items.length > 0 && setCurrentStep('postcard')}
            disabled={!items.length || currentStep === 'postcard'}
            className={`flex items-center transition-all ${
              currentStep === 'postcard' 
                ? 'text-magic-gold cursor-default' 
                : items.length > 0
                  ? 'text-magic-gold hover:text-magic-amber cursor-pointer' 
                  : 'text-neutral-400 cursor-not-allowed'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
              currentStep === 'postcard' 
                ? 'border-magic-gold bg-cosmic-700 shadow-glow-gold' 
                : items.length > 0
                  ? 'border-magic-gold bg-cosmic-700 hover:shadow-glow-purple' 
                  : 'border-cosmic-500/30 bg-cosmic-800/50'
            }`}>
              {postcardText ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span>2</span>
              )}
            </div>
            <span className="ml-2 font-medium hidden sm:inline">{t('steps.postcard')}</span>
          </button>
        </div>
      </div>

      {/* Step Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {currentStep === 'products' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-neutral-50">{t('selectProducts.title')}</h2>
                  <p className="text-neutral-300 mt-1">
                    {t('selectProducts.description')}
                  </p>
                </div>
              </div>
              <ProductGrid mode="custom-box" />
            </div>
          )}

          {currentStep === 'postcard' && (
            <div>
              <div className="mb-4">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep('products')}
                  className="mb-4"
                >
                  ← {t('postcard.back')}
                </Button>
              </div>
              <PostcardStep
                onComplete={handlePostcardComplete}
                onSkip={handlePostcardSkip}
              />
            </div>
          )}

        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h2 className="text-2xl font-semibold mb-6 text-neutral-50">{t('yourBox.title')}</h2>
            
            {/* Products */}
            {items.length === 0 ? (
              <p className="text-neutral-300 mb-4">
                {t('yourBox.empty')}
              </p>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.productId} className="bg-cosmic-800/50 border border-cosmic-500/30 rounded-lg p-4 relative">
                      <div className="flex items-center justify-between mb-3 relative z-10">
                        <div className="flex-1">
                          <p className="font-semibold text-neutral-50 text-sm">{item.name}</p>
                          <p className="text-xs text-neutral-300">
                            {item.price.toFixed(2)} AZN × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 relative z-10" style={{ pointerEvents: 'auto' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            updateQuantity(item.productId, item.quantity - 1)
                          }}
                          className="px-2 py-1 border border-cosmic-500/50 rounded-lg hover:bg-cosmic-700 transition-colors text-sm text-neutral-200"
                          style={{ pointerEvents: 'auto' }}
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-neutral-50">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            updateQuantity(item.productId, item.quantity + 1)
                          }}
                          className="px-2 py-1 border border-cosmic-500/50 rounded-lg hover:bg-cosmic-700 transition-colors text-sm text-neutral-200"
                          style={{ pointerEvents: 'auto' }}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            if (window.confirm(t('yourBox.removeConfirm', { name: item.name || 'item' }))) {
                              removeItem(item.productId)
                            }
                          }}
                          className="text-error-500 hover:text-error-400 ml-auto text-xs font-medium transition-colors cursor-pointer px-2 py-1"
                          style={{ pointerEvents: 'auto' }}
                        >
                          {t('yourBox.remove')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Postcard Preview */}
            {postcardText && (
              <div className="bg-cosmic-800/50 border border-cosmic-500/30 rounded-lg p-4 mb-4">
                <p className="text-xs text-neutral-400 mb-1">Postcard</p>
                <p className="text-sm text-neutral-200 line-clamp-2">{postcardText}</p>
              </div>
            )}

            {/* Total */}
            <div className="border-t-2 border-cosmic-500/30 pt-6 mb-6">
              <div className="flex justify-between text-2xl font-bold text-gold-gradient">
                <span>{t('yourBox.total')}</span>
                <span>{mounted ? getTotal().toFixed(2) : '0.00'} AZN</span>
              </div>
            </div>


            {/* Actions */}
            {currentStep === 'products' && canProceedToPostcard && (
              <div className="space-y-4">
                <div className="p-6 bg-gradient-to-br from-cosmic-800/80 to-cosmic-700/50 border border-magic-gold/20 rounded-xl shadow-lg">
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-2xl mr-2">💝</span>
                    <p className="text-base font-semibold text-neutral-100">
                      {t('yourBox.postcardQuestion')}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Button 
                      onClick={handleGoToPostcard}
                      className="w-full bg-gradient-to-r from-magic-gold to-magic-amber hover:from-magic-amber hover:to-magic-gold text-neutral-900 font-semibold shadow-lg shadow-magic-gold/20"
                      size="lg"
                    >
                      {t('yourBox.yesAddPostcard')}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleSkipPostcard}
                      className="w-full border-magic-gold/40 hover:bg-magic-gold/10 hover:border-magic-gold text-neutral-200"
                      size="lg"
                    >
                      {t('yourBox.noSkip')}
                    </Button>
                  </div>
                </div>
                {items.length > 0 && (
                  <Button 
                    variant="outline" 
                    className="w-full text-neutral-300 border-cosmic-500/40 hover:text-error-500 hover:border-error-500/50 hover:bg-error-500/10 transition-colors" 
                    onClick={clearBox}
                  >
                    {t('yourBox.clearBox')}
                  </Button>
                )}
              </div>
            )}
            {currentStep === 'postcard' && canProceedToCheckout && (
              <div className="space-y-3">
                <Button 
                  asChild 
                  className="w-full bg-gradient-to-r from-magic-gold to-magic-amber hover:from-magic-amber hover:to-magic-gold text-neutral-900 font-semibold shadow-lg shadow-magic-gold/20"
                  size="lg"
                >
                  <Link href="/checkout">{t('yourBox.proceedToCheckout')}</Link>
                </Button>
                {items.length > 0 && (
                  <Button 
                    variant="outline" 
                    className="w-full text-neutral-300 border-cosmic-500/40 hover:text-error-500 hover:border-error-500/50 hover:bg-error-500/10 transition-colors" 
                    onClick={clearBox}
                  >
                    {t('yourBox.clearBox')}
                  </Button>
                )}
              </div>
            )}
            {currentStep === 'products' && items.length > 0 && !canProceedToPostcard && (
              <Button 
                variant="outline" 
                className="w-full text-neutral-300 border-cosmic-500/40 hover:text-error-500 hover:border-error-500/50 hover:bg-error-500/10 transition-colors" 
                onClick={clearBox}
              >
                {t('yourBox.clearBox')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

