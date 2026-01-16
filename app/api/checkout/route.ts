import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth'
import { db } from '@/src/lib/db'
import { OrderType, PaymentStatus, PaymentProvider } from '@prisma/client'
import { z } from 'zod'

const SHIPPING_COST = 5.0 // 5 AZN default shipping
const TAX_RATE = 0.18 // 18% tax rate

// Validation schema
const checkoutSchema = z.object({
  orderType: z.enum(['PREMADE', 'CUSTOM', 'MYSTERY']),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
  })).optional(),
  premadeBoxId: z.string().optional(),
  boxTypeId: z.string().optional(),
  postcardText: z.string().optional(),
  // Mystery box fields
  recipientGender: z.string().optional(),
  recipientAge: z.number().int().positive().optional(),
  recipientInterests: z.string().optional(),
  recipientComments: z.string().optional(),
  // Delivery info
  delivery: z.object({
    fullName: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().min(7),
    address: z.string().min(5).max(200),
    placeType: z.string().max(50).optional(),
    country: z.string().default('Azerbaijan'),
  }),
})

export async function POST(request: NextRequest) {
  try {
    // Check authentication (allow guest checkout)
    let session
    try {
      session = await auth()
    } catch (authError) {
      // Continue without session for guest checkout
    }

    const userId = session?.user?.id || null

    // Parse and validate request body
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

    // Validate with Zod
    const validationResult = checkoutSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const data = validationResult.data
    const orderType = data.orderType as OrderType

    // Calculate totals on the server
    let subtotal = 0
    let orderItems: Array<{
      productId: string | null
      quantity: number
      price: number
    }> = []
    let premadeBoxId: string | null = null
    let mysteryBoxData: {
      recipientGender?: string | null
      recipientAge?: number | null
      recipientInterests?: string | null
      recipientComments?: string | null
    } = {}

    // Handle different order types
    if (orderType === 'PREMADE') {
      if (!data.premadeBoxId) {
        return NextResponse.json(
          { error: 'Pre-made box ID is required' },
          { status: 400 }
        )
      }

      const premadeBox = await db.preMadeBox.findUnique({
        where: { id: data.premadeBoxId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })

      if (!premadeBox || !premadeBox.isActive) {
        return NextResponse.json(
          { error: 'Pre-made box not found or inactive' },
          { status: 404 }
        )
      }

      premadeBoxId = data.premadeBoxId
      subtotal = premadeBox.price

      orderItems = premadeBox.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      }))
    } else if (orderType === 'CUSTOM') {
      if (!data.items || data.items.length === 0) {
        return NextResponse.json(
          { error: 'Items are required for custom order' },
          { status: 400 }
        )
      }

      // Box type will be determined by the system, not by user selection
      // For now, box type price is 0 - it will be assigned later by admin
      let boxTypePrice = 0

      // Fetch products from database to get current prices
      const productIds = data.items.map((item) => item.productId).filter(Boolean)
      const products = await db.product.findMany({
        where: {
          id: { in: productIds },
          isActive: true,
        },
      })

      // Recalculate prices from database (don't trust client)
      subtotal = boxTypePrice // Start with box type price
      for (const item of data.items) {
        const product = products.find((p) => p.id === item.productId)
        if (!product) {
          return NextResponse.json(
            { error: `Product ${item.productId} not found` },
            { status: 404 }
          )
        }

        if (product.stock < item.quantity) {
          return NextResponse.json(
            { error: `Insufficient stock for ${product.name}` },
            { status: 400 }
          )
        }

        // Use price from database, not from client
        const itemTotal = product.price * item.quantity
        subtotal += itemTotal

        orderItems.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price, // Use DB price
        })
      }
    } else if (orderType === 'MYSTERY') {
      // Mystery box - budget should be provided or calculated
      // For now, we'll require a budget in the request or use a default
      const budget = body.budget || 50 // Default budget
      if (budget < 10) {
        return NextResponse.json(
          { error: 'Budget must be at least 10 AZN' },
          { status: 400 }
        )
      }

      subtotal = budget
      mysteryBoxData = {
        recipientGender: data.recipientGender || null,
        recipientAge: data.recipientAge || null,
        recipientInterests: data.recipientInterests || null,
        recipientComments: data.recipientComments || null,
      }
    }

    // Calculate totals
    const tax = subtotal * TAX_RATE
    const shippingCost = SHIPPING_COST
    const totalAmount = subtotal + tax + shippingCost

    // Create order and payment in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create the order
      const order = await tx.order.create({
        data: {
          userId,
          orderType,
          status: 'PENDING',
          subtotal,
          tax,
          shippingCost,
          totalAmount,
          paymentStatus: 'PENDING',
          premadeBoxId,
          boxTypeId: data.boxTypeId || null,
          postcardText: data.postcardText || null,
          ...mysteryBoxData,
        },
      })

      // Create order items (skip for MYSTERY orders)
      if (orderType !== 'MYSTERY' && orderItems.length > 0) {
        await tx.orderItem.createMany({
          data: orderItems.map((item) => ({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        })

        // Update product stock for CUSTOM orders
        if (orderType === 'CUSTOM') {
          for (const item of orderItems) {
            if (item.productId) {
              await tx.product.update({
                where: { id: item.productId },
                data: {
                  stock: {
                    decrement: item.quantity,
                  },
                },
              })
            }
          }
        }
      }

      // Create delivery record
      await tx.delivery.create({
        data: {
          orderId: order.id,
          status: 'PENDING',
          fullName: data.delivery.fullName,
          email: data.delivery.email,
          phone: data.delivery.phone,
          address: data.delivery.address,
          placeType: data.delivery.placeType || null,
          country: data.delivery.country || 'Azerbaijan',
        },
      })

      // Create payment record
      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          amount: totalAmount,
          currency: 'AZN',
          status: 'PENDING',
          provider: 'WHATSAPP',
        },
      })

      return { order, payment }
    })

    // For WhatsApp payment flow, we don't create a payment session
    // Instead, we just return the order ID
    // The admin will contact the user via WhatsApp for payment
    
    // Update payment with a note that it's pending WhatsApp contact
    await db.payment.update({
      where: { id: result.payment.id },
      data: {
        providerRef: `whatsapp_pending_${Date.now()}`,
        metadata: {
          paymentMethod: 'WHATSAPP',
          note: 'Awaiting WhatsApp contact for payment',
          customerPhone: data.delivery.phone,
        },
      },
    })

    // Return order ID (no payment URL redirect)
    return NextResponse.json(
      {
        orderId: result.order.id,
        message: 'Order created successfully. You will be contacted via WhatsApp for payment.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Unexpected error in checkout:', error)
    return NextResponse.json(
      {
        error: 'Failed to process checkout',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

