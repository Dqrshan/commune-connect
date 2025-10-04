import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { latitude, longitude } = await request.json()

    if (!latitude || !longitude) {
      return NextResponse.json({ error: 'Location coordinates required' }, { status: 400 })
    }

    // Update user location
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        latitude,
        longitude,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating user location:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}