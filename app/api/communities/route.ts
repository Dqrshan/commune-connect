import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Get all active communities with member and message counts
    const communities = await prisma.community.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            members: true,
            messages: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ communities })
  } catch (error) {
    console.error('Error fetching communities:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}