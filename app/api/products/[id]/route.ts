import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/src/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Validate ID format
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      )
    }

    let product
    try {
      product = await db.product.findUnique({
        where: { id: id.trim() },
      })
    } catch (dbError) {
      console.error('Database error fetching product:', dbError)
      return NextResponse.json(
        { 
          error: 'Failed to fetch product',
          message: dbError instanceof Error ? dbError.message : 'Database error'
        },
        { status: 500 }
      )
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Only return active products for public API
    if (!product.isActive) {
      return NextResponse.json(
        { error: 'Product not available' },
        { status: 404 }
      )
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Unexpected error fetching product:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch product',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

