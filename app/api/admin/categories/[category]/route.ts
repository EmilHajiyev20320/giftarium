import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth'
import { db } from '@/src/lib/db'
import { ProductCategory } from '@prisma/client'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const session = await auth()

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { category } = await params

    // Validate category
    if (!Object.values(ProductCategory).includes(category as ProductCategory)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    // Check if category is in use
    const productCount = await db.product.count({
      where: { category: category as ProductCategory },
    })

    if (productCount > 0) {
      return NextResponse.json(
        { 
          error: `Cannot delete category. ${productCount} product(s) are using this category.`,
          productCount 
        },
        { status: 400 }
      )
    }

    // Note: We can't actually delete enum values from Prisma without a migration
    // This endpoint just validates and returns success
    // The actual deletion would require a database migration
    return NextResponse.json({ 
      message: 'Category can be removed. Note: This requires a database migration to remove the enum value.',
      requiresMigration: true 
    })
  } catch (error) {
    console.error('Error checking category:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

