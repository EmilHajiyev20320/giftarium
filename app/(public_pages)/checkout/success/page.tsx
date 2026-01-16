import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/src/components/ui/button'
import { CheckoutSuccess } from '@/src/components/checkout/checkout-success'

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; whatsapp?: string }>
}) {
  return (
    <div className="bg-cosmic-gradient min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-magic-lavender rounded-full filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-magic-fairy rounded-full filter blur-3xl opacity-10"></div>
      <div className="container mx-auto px-4 py-12 relative z-10">
        <Suspense fallback={
          <div className="card p-8 text-center">
            <p className="text-neutral-300">Loading...</p>
          </div>
        }>
          <CheckoutSuccessWrapper searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}

async function CheckoutSuccessWrapper({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; whatsapp?: string }>
}) {
  const params = await searchParams
  return <CheckoutSuccess orderId={params.orderId} />
}

