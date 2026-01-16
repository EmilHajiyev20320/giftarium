import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth'
import { db } from '@/src/lib/db'
import { ContactCategory } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    // Get session if user is authenticated
    let session
    try {
      session = await auth()
    } catch (authError) {
      // Continue without session - allow guest submissions
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

    const { name, email, subject, category, orderId, message } = body

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    if (name.trim().length < 2 || name.trim().length > 100) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 100 characters' },
        { status: 400 }
      )
    }

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    if (message.trim().length < 20) {
      return NextResponse.json(
        { error: 'Message must be at least 20 characters' },
        { status: 400 }
      )
    }

    if (message.trim().length > 5000) {
      return NextResponse.json(
        { error: 'Message must be less than 5000 characters' },
        { status: 400 }
      )
    }

    // Validate category
    if (!category || !Object.values(ContactCategory).includes(category as ContactCategory)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    // Validate subject if provided
    if (subject && typeof subject === 'string' && subject.trim().length > 200) {
      return NextResponse.json(
        { error: 'Subject must be less than 200 characters' },
        { status: 400 }
      )
    }

    // TODO: Add rate limiting here (e.g., max 5 messages per email per hour)
    // For now, we'll just save the message

    // Create contact message
    let contactMessage
    try {
      contactMessage = await db.contactMessage.create({
        data: {
          userId: session?.user?.id || null,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          subject: subject && subject.trim().length > 0 ? subject.trim() : null,
          category: category as ContactCategory,
          orderId: orderId && orderId.trim().length > 0 ? orderId.trim() : null,
          message: message.trim(),
          status: 'NEW',
        },
      })
    } catch (dbError) {
      console.error('Database error creating contact message:', dbError)
      return NextResponse.json(
        {
          error: 'Failed to save message',
          message: dbError instanceof Error ? dbError.message : 'Database error',
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'Contact message sent successfully',
        id: contactMessage.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Unexpected error processing contact form:', error)
    return NextResponse.json(
      {
        error: 'Failed to process request',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

