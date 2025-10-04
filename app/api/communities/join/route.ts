import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { communityId } = await request.json()

    if (!communityId) {
      return NextResponse.json({ error: 'Community ID required' }, { status: 400 })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if community exists and is active
    const community = await prisma.community.findUnique({
      where: { id: communityId }
    })

    if (!community || !community.isActive) {
      return NextResponse.json({ error: 'Community not found or inactive' }, { status: 404 })
    }

    // Check if user is already a member
    const existingMembership = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId: user.id,
          communityId: communityId
        }
      }
    })

    if (existingMembership) {
      return NextResponse.json({ error: 'Already a member' }, { status: 400 })
    }

    // Create membership
    await prisma.communityMember.create({
      data: {
        userId: user.id,
        communityId: communityId,
        role: 'MEMBER'
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error joining community:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}