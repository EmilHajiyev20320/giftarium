import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/src/lib/db'

export async function GET(request: NextRequest) {
  try {
    const boxTypes = await db.boxType.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    })

    return NextResponse.json({ boxTypes })
  } catch (error) {
    console.error('Error fetching box types:', error)
    return NextResponse.json(
      { error: 'Failed to fetch box types' },
      { status: 500 }
    )
  }
}

