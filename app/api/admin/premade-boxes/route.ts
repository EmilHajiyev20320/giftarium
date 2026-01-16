import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth'
import { db } from '@/src/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)

    // Validate pagination
    if (isNaN(page) || page < 1) {
      return NextResponse.json(
        { error: 'Invalid page parameter' },
        { status: 400 }
      )
    }
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid limit parameter. Must be between 1 and 100.' },
        { status: 400 }
      )
    }

    const where: {
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' }
        description?: { contains: string; mode: 'insensitive' }
      }>
    } = {}
    
    if (search && search.trim().length > 0) {
      const searchTerm = search.trim()
      if (searchTerm.length > 100) {
        return NextResponse.json(
          { error: 'Search term too long. Maximum 100 characters.' },
          { status: 400 }
        )
      }
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ]
    }

    const [boxes, total] = await Promise.all([
      db.preMadeBox.findMany({
        where,
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.preMadeBox.count({ where }),
    ])

    return NextResponse.json({
      boxes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching premade boxes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch premade boxes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('Error parsing request body:', parseError)
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const { name, description, price, image, images, isActive, items } = body

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    if (price === undefined || price === null || isNaN(parseFloat(String(price)))) {
      return NextResponse.json(
        { error: 'Valid price is required' },
        { status: 400 }
      )
    }

    const priceValue = parseFloat(String(price))
    if (priceValue < 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      )
    }

    // Validate items if provided
    if (items && !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Items must be an array' },
        { status: 400 }
      )
    }

    let box
    try {
      box = await db.preMadeBox.create({
        data: {
          name: String(name).trim(),
          description: description ? String(description).trim() : null,
          price: priceValue,
          image: image ? String(image) : null,
          images: Array.isArray(images) ? images.map(String) : [],
          isActive: isActive !== false,
          items: items && Array.isArray(items)
            ? {
                create: items.map((item: { productId: string; quantity?: number }) => ({
                  productId: String(item.productId),
                  quantity: item.quantity && item.quantity > 0 ? item.quantity : 1,
                })),
              }
            : undefined,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })
    } catch (dbError) {
      console.error('Database error creating premade box:', dbError)
      return NextResponse.json(
        { 
          error: 'Failed to create premade box',
          message: dbError instanceof Error ? dbError.message : 'Database error'
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ box })
  } catch (error) {
    console.error('Unexpected error creating premade box:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create premade box',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

