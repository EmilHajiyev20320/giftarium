import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth'
import { db } from '@/src/lib/db'
import { ContactStatus } from '@prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Validate ID
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid message ID' },
        { status: 400 }
      )
    }

    // Fetch message
    let message
    try {
      message = await db.contactMessage.findUnique({
        where: { id: id.trim() },
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
      })
    } catch (dbError) {
      console.error('Database error fetching contact message:', dbError)
      return NextResponse.json(
        {
          error: 'Failed to fetch contact message',
          message: dbError instanceof Error ? dbError.message : 'Database error',
        },
        { status: 500 }
      )
    }

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message })
  } catch (error) {
    console.error('Unexpected error fetching contact message:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch contact message',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Validate ID
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid message ID' },
        { status: 400 }
      )
    }

    // Parse request body
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

    const { status, adminNote } = body

    // Validate status if provided
    if (status !== undefined) {
      if (!Object.values(ContactStatus).includes(status as ContactStatus)) {
        return NextResponse.json(
          { error: 'Invalid status' },
          { status: 400 }
        )
      }
    }

    // Validate adminNote if provided
    if (adminNote !== undefined && adminNote !== null) {
      if (typeof adminNote !== 'string') {
        return NextResponse.json(
          { error: 'Admin note must be a string' },
          { status: 400 }
        )
      }
      if (adminNote.trim().length > 5000) {
        return NextResponse.json(
          { error: 'Admin note must be less than 5000 characters' },
          { status: 400 }
        )
      }
    }

    // Update message
    let updatedMessage
    try {
      const updateData: {
        status?: ContactStatus
        adminNote?: string | null
        handledById?: string | null
      } = {}

      if (status !== undefined) {
        updateData.status = status as ContactStatus
      }

      if (adminNote !== undefined) {
        updateData.adminNote = adminNote && adminNote.trim().length > 0 ? adminNote.trim() : null
      }

      // If status is being changed to IN_PROGRESS or RESOLVED, set handledById
      if (status === 'IN_PROGRESS' || status === 'RESOLVED') {
        updateData.handledById = session.user.id
      }

      updatedMessage = await db.contactMessage.update({
        where: { id: id.trim() },
        data: updateData,
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
      })
    } catch (dbError) {
      console.error('Database error updating contact message:', dbError)
      return NextResponse.json(
        {
          error: 'Failed to update contact message',
          message: dbError instanceof Error ? dbError.message : 'Database error',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: updatedMessage })
  } catch (error) {
    console.error('Unexpected error updating contact message:', error)
    return NextResponse.json(
      {
        error: 'Failed to update contact message',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

