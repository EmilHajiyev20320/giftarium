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
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const search = searchParams.get('search')

    const where: any = {}
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ]
    }

    let orderBy: any = {}
    if (sortBy === 'orders') {
      // Sort by order count requires a different approach
      const users = await db.user.findMany({
        where,
        include: {
          _count: {
            select: { orders: true },
          },
        },
      })

      const sortedUsers = users.sort((a, b) => {
        const aCount = a._count.orders
        const bCount = b._count.orders
        return sortOrder === 'asc' ? aCount - bCount : bCount - aCount
      })

      return NextResponse.json({ users: sortedUsers })
    } else {
      orderBy[sortBy] = sortOrder
    }

    const users = await db.user.findMany({
      where,
      orderBy,
      include: {
        _count: {
          select: { orders: true },
        },
      },
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

