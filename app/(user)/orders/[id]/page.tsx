import { auth } from '@/src/lib/auth'
import { redirect } from 'next/navigation'
import { OrderDetails } from '@/src/components/orders/order-details'

export default async function OrderDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <OrderDetails orderId={params.id} userId={session.user.id} />
    </div>
  )
}

