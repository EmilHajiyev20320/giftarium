import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth'
import { db } from '@/src/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    let session
    try {
      session = await auth()
    } catch (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Validate ID format
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      )
    }

    // Fetch order
    let order
    try {
      order = await db.order.findUnique({
        where: { id: id.trim() },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          payment: true,
          delivery: true,
          premadeBox: true,
          boxType: true,
        },
      })
    } catch (dbError) {
      console.error('Database error fetching order:', dbError)
      return NextResponse.json(
        { 
          error: 'Failed to fetch order',
          message: dbError instanceof Error ? dbError.message : 'Database error'
        },
        { status: 500 }
      )
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Allow access for guest orders (no userId) - needed for mystery box checkout
    // For orders with userId, require authentication and ownership/admin
    if (order.userId) {
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: 'Unauthorized. Please sign in to view orders.' },
          { status: 401 }
        )
      }

      const isAdmin = session.user.role === 'ADMIN'
      const isOwner = order.userId === session.user.id

      if (!isAdmin && !isOwner) {
        return NextResponse.json(
          { error: 'Forbidden. You do not have permission to view this order.' },
          { status: 403 }
        )
      }
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Unexpected error fetching order:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch order',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

