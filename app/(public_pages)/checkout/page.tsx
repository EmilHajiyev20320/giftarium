import { Suspense } from 'react'
import { auth } from '@/src/lib/auth'
import { redirect } from 'next/navigation'
import { CheckoutForm } from '@/src/components/checkout/checkout-form'

export default async function CheckoutPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/login?redirect=' + encodeURIComponent('/checkout'))
  }

  return (
    <div className="bg-cosmic-gradient min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-magic-lavender rounded-full filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-magic-fairy rounded-full filter blur-3xl opacity-10"></div>
      <div className="container mx-auto px-4 py-12 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 font-display">Checkout</h1>
        <Suspense fallback={<div className="text-center py-8 text-neutral-200">Loading checkout form...</div>}>
          <CheckoutForm />
        </Suspense>
      </div>
    </div>
  )
}

