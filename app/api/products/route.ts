import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/src/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    
    // Validate and parse pagination parameters
    let page = 1
    let limit = 20
    
    try {
      const pageParam = searchParams.get('page')
      const limitParam = searchParams.get('limit')
      
      if (pageParam) {
        page = parseInt(pageParam, 10)
        if (isNaN(page) || page < 1) {
          return NextResponse.json(
            { error: 'Invalid page parameter. Must be a positive integer.' },
            { status: 400 }
          )
        }
      }
      
      if (limitParam) {
        limit = parseInt(limitParam, 10)
        if (isNaN(limit) || limit < 1 || limit > 100) {
          return NextResponse.json(
            { error: 'Invalid limit parameter. Must be between 1 and 100.' },
            { status: 400 }
          )
        }
      }
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      )
    }

    // Build where clause with proper typing
    const where: {
      isActive: boolean
      category?: string
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' }
        description?: { contains: string; mode: 'insensitive' }
      }>
    } = {
      isActive: true,
    }

    if (category) {
      // Validate category
      const validCategories = ['TOYS', 'ACCESSORIES', 'COSMETICS', 'SWEETS', 'HYGIENE', 'OTHER']
      if (!validCategories.includes(category)) {
        return NextResponse.json(
          { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
          { status: 400 }
        )
      }
      where.category = category
    }

    if (search && search.trim().length > 0) {
      const searchTerm = search.trim()
      // Limit search length to prevent abuse
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

    // Fetch products with error handling
    let products, total
    try {
      [products, total] = await Promise.all([
        db.product.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        db.product.count({ where }),
      ])
    } catch (dbError) {
      console.error('Database error fetching products:', dbError)
      return NextResponse.json(
        { 
          error: 'Failed to fetch products',
          message: dbError instanceof Error ? dbError.message : 'Database error'
        },
        { status: 500 }
      )
    }

    const response = NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })

    // Add caching headers for better performance
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    
    return response
  } catch (error) {
    console.error('Unexpected error fetching products:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch products',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

