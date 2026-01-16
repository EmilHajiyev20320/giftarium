import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth'
import { db } from '@/src/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, price, image, images, isActive, items } = body

    // Update box
    const box = await db.preMadeBox.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price: parseFloat(price),
        image: image || null,
        images: images || [],
        isActive: isActive !== false,
      },
    })

    // Update items if provided
    if (items) {
      // Delete existing items
      await db.preMadeBoxItem.deleteMany({
        where: { premadeBoxId: params.id },
      })

      // Create new items
      if (items.length > 0) {
        await db.preMadeBoxItem.createMany({
          data: items.map((item: { productId: string; quantity: number }) => ({
            premadeBoxId: params.id,
            productId: item.productId,
            quantity: item.quantity || 1,
          })),
        })
      }
    }

    const updatedBox = await db.preMadeBox.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json({ box: updatedBox })
  } catch (error) {
    console.error('Error updating premade box:', error)
    return NextResponse.json(
      { error: 'Failed to update premade box' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Soft delete by setting isActive to false
    await db.preMadeBox.update({
      where: { id: params.id },
      data: { isActive: false },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting premade box:', error)
    return NextResponse.json(
      { error: 'Failed to delete premade box' },
      { status: 500 }
    )
  }
}

