'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '@/src/i18n/routing'
import { Button } from '@/src/components/ui/button'

interface CheckoutSuccessProps {
  orderId?: string
}

function CheckoutSuccessContent({ orderId }: CheckoutSuccessProps) {
  const t = useTranslations('checkout.success')
  const searchParams = useSearchParams()
  const isWhatsAppFlow = searchParams.get('whatsapp') === 'true'
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(!!orderId)

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const fetchOrder = async () => {
    if (!orderId) return

    try {
      const response = await fetch(`/api/orders/${orderId}`)
      const data = await response.json()

      if (response.ok && data.order) {
        setOrder(data.order)
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-8 text-center">
        <div className="w-20 h-20 bg-gradient-magic rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow-gold">
          <svg className="w-12 h-12 text-cosmic-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-4xl font-bold mb-4 font-display">{t('title')}</h1>
        {isWhatsAppFlow ? (
          <div className="mb-6">
            <p className="text-lg text-neutral-300 mb-4">
              {t('description')}
            </p>
            <div className="bg-magic-gold/20 border border-magic-gold/50 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📱</span>
                <div>
                  <p className="text-sm font-semibold text-magic-gold mb-1">{t('whatsappPayment.title')}</p>
                  <p className="text-xs text-neutral-300">
                    {t('whatsappPayment.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-lg text-neutral-300 mb-6">
            {t('paymentReceived')}
          </p>
        )}

        {isLoading ? (
          <div className="py-4">
            <p className="text-neutral-400">{t('loading')}</p>
          </div>
        ) : order ? (
          <div className="bg-cosmic-800/50 border border-cosmic-500/30 rounded-lg p-6 mb-6 text-left">
            <h2 className="text-lg font-semibold mb-4 text-neutral-50">{t('orderSummary.title')}</h2>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-neutral-400">{t('orderSummary.orderId')}</span>
              <span className="text-sm font-mono text-neutral-200">{order.id.slice(0, 12)}...</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-neutral-400">{t('orderSummary.totalAmount')}</span>
              <span className="text-lg font-bold text-gold-gradient">
                {order.orderType === 'MYSTERY' ? order.subtotal.toFixed(2) : order.totalAmount.toFixed(2)} AZN
              </span>
            </div>
            {order.payment?.status && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-400">{t('orderSummary.paymentStatus')}</span>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  order.payment.status === 'PAID'
                    ? 'bg-success-500/30 text-success-300 border border-success-500/50'
                    : order.payment.status === 'PENDING'
                      ? 'bg-magic-gold/30 text-magic-gold border border-magic-gold/50'
                      : 'bg-error-500/30 text-error-300 border border-error-500/50'
                }`}>
                  {t(`orderSummary.paymentStatuses.${order.payment.status.toLowerCase()}`)}
                </span>
              </div>
            )}
          </div>
        ) : orderId ? (
          <div className="bg-cosmic-800/50 border border-cosmic-500/30 rounded-lg p-6 mb-6">
            <p className="text-neutral-300 mb-2">{t('orderSummary.orderId')}: {orderId}</p>
            <p className="text-sm text-neutral-400">
              {isWhatsAppFlow 
                ? t('whatsappContact')
                : t('emailConfirmation')}
            </p>
          </div>
        ) : null}

        <div className="space-y-4">
          {isWhatsAppFlow ? (
            <>
              <p className="text-neutral-300">
                {t('whatsappContactDetails')}
              </p>
              <div className="bg-cosmic-800/50 border border-cosmic-500/30 rounded-lg p-4">
                <p className="text-sm text-neutral-300 mb-2">
                  <span className="font-semibold">{t('whatHappensNext.title')}</span>
                </p>
                <ul className="text-sm text-neutral-400 space-y-1 list-disc list-inside">
                  <li>{t('whatHappensNext.step1')}</li>
                  <li>{t('whatHappensNext.step2')}</li>
                  <li>{t('whatHappensNext.step3')}</li>
                </ul>
              </div>
            </>
          ) : (
            <p className="text-neutral-300">
              {t('emailShipping')}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {orderId && (
              <Button asChild variant="outline">
                <Link href={`/orders/${orderId}`}>{t('viewOrderDetails')}</Link>
              </Button>
            )}
            <Button asChild>
              <Link href="/">{t('continueShopping')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CheckoutSuccess({ orderId }: CheckoutSuccessProps) {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 text-center">
          <p className="text-neutral-300">Loading...</p>
        </div>
      </div>
    }>
      <CheckoutSuccessContent orderId={orderId} />
    </Suspense>
  )
}
