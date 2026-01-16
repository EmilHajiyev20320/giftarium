import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/src/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const box = await db.preMadeBox.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!box) {
      return NextResponse.json(
        { error: 'Pre-made box not found' },
        { status: 404 }
      )
    }

    if (!box.isActive) {
      return NextResponse.json(
        { error: 'Pre-made box is not available' },
        { status: 404 }
      )
    }

    return NextResponse.json({ box })
  } catch (error) {
    console.error('Error fetching premade box:', error)
    return NextResponse.json(
      { error: 'Failed to fetch premade box' },
      { status: 500 }
    )
  }
}

