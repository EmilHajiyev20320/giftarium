import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth'
import { db } from '@/src/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const body = await request.json()
    const { delivery } = body
    const { id } = await params

    // Find the order
    const order = await db.order.findUnique({
      where: { id },
      include: { delivery: true },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Verify ownership (if user is logged in)
    if (session?.user?.id && order.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Validate delivery information
    if (!delivery || !delivery.address) {
      return NextResponse.json(
        { error: 'Delivery address is required' },
        { status: 400 }
      )
    }

    // Update delivery information
    const updatedDelivery = await db.delivery.update({
      where: { orderId: order.id },
      data: {
        address: delivery.address,
        fullName: delivery.fullName || null,
        email: delivery.email || null,
        phone: delivery.phone || null,
        placeType: delivery.placeType || null,
        country: delivery.country || 'Azerbaijan',
      },
    })

    // Return updated order
    const updatedOrder = await db.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
        delivery: true,
      },
    })

    return NextResponse.json({
      message: 'Order completed successfully',
      order: updatedOrder,
    })
  } catch (error) {
    console.error('Error completing order:', error)
    return NextResponse.json(
      { error: 'Failed to complete order' },
      { status: 500 }
    )
  }
}

