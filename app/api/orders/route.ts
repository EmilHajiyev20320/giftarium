import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth'
import { db } from '@/src/lib/db'
import { OrderType } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orders = await db.order.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        orderType: true,
        status: true,
        subtotal: true,
        tax: true,
        shippingCost: true,
        totalAmount: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                images: true,
                price: true,
              },
            },
          },
        },
        payment: {
          select: {
            id: true,
            amount: true,
            status: true,
            provider: true,
          },
        },
        delivery: {
          select: {
            id: true,
            status: true,
            address: true,
            fullName: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const response = NextResponse.json({ orders })
    // Cache user orders for 30 seconds
    response.headers.set('Cache-Control', 'private, s-maxage=30, stale-while-revalidate=60')
    
    return response
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const body = await request.json()

    // Validate authentication (optional - allow guest orders)
    const userId = session?.user?.id || null

    // Extract order type
    const orderType = body.orderType as OrderType
    if (!orderType || !['PREMADE', 'CUSTOM', 'MYSTERY'].includes(orderType)) {
      return NextResponse.json(
        { error: 'Invalid order type' },
        { status: 400 }
      )
    }

    // Calculate shipping cost (can be made configurable)
    const SHIPPING_COST = 5.0 // 5 AZN default shipping
    const TAX_RATE = 0.18 // 18% tax rate

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
      recipientOccasion?: string | null
      recipientInterests?: string | null
      recipientComments?: string | null
    } = {}

    // Handle different order types
    if (orderType === 'PREMADE') {
      // PREMADE order - from pre-made box selection
      const { premadeBoxId: boxId } = body

      if (!boxId) {
        return NextResponse.json(
          { error: 'Pre-made box ID is required' },
          { status: 400 }
        )
      }

      // Fetch the pre-made box
      const premadeBox = await db.preMadeBox.findUnique({
        where: { id: boxId },
        select: {
          id: true,
          name: true,
          price: true,
          isActive: true,
          items: {
            select: {
              productId: true,
              quantity: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  stock: true,
                },
              },
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

      premadeBoxId = boxId
      subtotal = premadeBox.price

      // Create order items from pre-made box items
      orderItems = premadeBox.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      }))
    } else if (orderType === 'CUSTOM') {
      // CUSTOM order - from cart or custom box builder
      const { items, boxTypeId, postcardText } = body

      if (!items || !Array.isArray(items) || items.length === 0) {
        return NextResponse.json(
          { error: 'Items are required for custom order' },
          { status: 400 }
        )
      }

      // Validate and fetch products
      const productIds = items.map((item: any) => item.productId).filter(Boolean)
      const products = await db.product.findMany({
        where: {
          id: { in: productIds },
          isActive: true,
        },
      })

      // Check stock and calculate totals
      for (const item of items) {
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

        const itemTotal = product.price * item.quantity
        subtotal += itemTotal

        orderItems.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        })
      }
    } else if (orderType === 'MYSTERY') {
      // MYSTERY order - from mystery box form
      const {
        recipientGender,
        recipientAge,
        budget,
        interests,
        occasion,
        comments,
      } = body

      if (!budget || budget < 30) {
        return NextResponse.json(
          { error: 'Budget must be at least 30 AZN' },
          { status: 400 }
        )
      }

      subtotal = budget
      mysteryBoxData = {
        recipientGender,
        recipientAge,
        recipientOccasion: occasion || null,
        recipientInterests: Array.isArray(interests) ? interests.join(', ') : interests,
        recipientComments: comments,
      }

      // For mystery boxes, we don't create order items yet
      // They will be added when the box is curated by admin
    }

    // Validate delivery information (optional for MYSTERY orders)
    const delivery = body.delivery || {}
    if (orderType !== 'MYSTERY' && !delivery.address) {
      return NextResponse.json(
        { error: 'Delivery address is required' },
        { status: 400 }
      )
    }

    // Calculate totals
    // For mystery boxes, no tax or shipping - price varies based on products
    const tax = orderType === 'MYSTERY' ? 0 : subtotal * TAX_RATE
    const shippingCost = orderType === 'MYSTERY' ? 0 : SHIPPING_COST
    const totalAmount = subtotal + tax + shippingCost

    // Create order in a transaction
    const order = await db.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          ...(userId && { userId }),
          orderType,
          status: 'PENDING',
          subtotal,
          tax,
          shippingCost,
          totalAmount,
          ...(premadeBoxId && { premadeBoxId }),
          ...(body.boxTypeId && { boxTypeId: body.boxTypeId }),
          ...(body.postcardText && { postcardText: body.postcardText }),
          ...mysteryBoxData,
        },
      })

      // Create order items (skip for MYSTERY orders - will be added later)
      if (orderType !== 'MYSTERY' && orderItems.length > 0) {
        await tx.orderItem.createMany({
          data: orderItems.map((item) => ({
            orderId: newOrder.id,
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

      // Create delivery record (with placeholder for MYSTERY orders if not provided)
      await tx.delivery.create({
        data: {
          orderId: newOrder.id,
          status: 'PENDING',
          address: delivery.address || 'To be provided',
          fullName: delivery.fullName || null,
          email: delivery.email || null,
          phone: delivery.phone || null,
          placeType: delivery.placeType || null,
          country: delivery.country || 'Azerbaijan',
        },
      })

      // Create payment record
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          amount: totalAmount,
          status: 'PENDING',
          provider: 'WHATSAPP', // Default provider
        },
      })

      return newOrder
    })

    // Return the created order with relations (optimized with select)
    const createdOrder = await db.order.findUnique({
      where: { id: order.id },
      select: {
        id: true,
        orderType: true,
        status: true,
        subtotal: true,
        tax: true,
        shippingCost: true,
        totalAmount: true,
        createdAt: true,
        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                images: true,
                price: true,
              },
            },
          },
        },
        payment: {
          select: {
            id: true,
            amount: true,
            status: true,
            provider: true,
          },
        },
        delivery: {
          select: {
            id: true,
            status: true,
            address: true,
            fullName: true,
            phone: true,
          },
        },
        ...(orderType === 'PREMADE' && {
          premadeBox: {
            select: {
              id: true,
              name: true,
              price: true,
              image: true,
              images: true,
            },
          },
        }),
      },
    })

    return NextResponse.json(
      {
        message: 'Order created successfully',
        order: createdOrder,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

