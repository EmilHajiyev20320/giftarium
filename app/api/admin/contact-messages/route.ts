import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth'
import { db } from '@/src/lib/db'
import { ContactStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') as ContactStatus | null
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

    // Build where clause
    const where: {
      status?: ContactStatus
    } = {}

    if (status && Object.values(ContactStatus).includes(status)) {
      where.status = status
    }

    // Fetch messages
    let messages, total
    try {
      [messages, total] = await Promise.all([
        db.contactMessage.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            handledBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        db.contactMessage.count({ where }),
      ])
    } catch (dbError) {
      console.error('Database error fetching contact messages:', dbError)
      return NextResponse.json(
        {
          error: 'Failed to fetch contact messages',
          message: dbError instanceof Error ? dbError.message : 'Database error',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Unexpected error fetching contact messages:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch contact messages',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

