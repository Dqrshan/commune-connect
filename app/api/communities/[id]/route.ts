import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const communityId = params.id

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get community with member count and message count
    const community = await prisma.community.findUnique({
      where: { id: communityId },
      include: {
        _count: {
          select: {
            members: true,
            messages: true
          }
        }
      }
    })

    if (!community) {
      return NextResponse.json({ error: 'Community not found' }, { status: 404 })
    }

    if (!community.isActive) {
      return NextResponse.json({ error: 'Community is not active' }, { status: 403 })
    }

    // Check if user is a member
    const membership = await prisma.communityMember.findFirst({
      where: {
        communityId,
        userId: user.id
      }
    })

    return NextResponse.json({
      community,
      isMember: !!membership,
      userRole: membership?.role || null
    })
  } catch (error) {
    console.error('Error fetching community:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}