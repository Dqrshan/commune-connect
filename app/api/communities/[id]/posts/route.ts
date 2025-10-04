import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
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

    // Check if user is a member of the community
    const membership = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId: user.id,
          communityId: communityId
        }
      }
    })

    if (!membership) {
      return NextResponse.json({ error: 'Not a member of this community' }, { status: 403 })
    }

    // Get posts from the community
    const posts = await prisma.post.findMany({
      where: { communityId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true
          }
        },
        _count: {
          select: { comments: true }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' } // Chronological order like Discord
      ]
    })

    // Parse AI tags and format response
    const formattedPosts = posts.map(post => ({
      ...post,
      aiTags: post.aiTags ? JSON.parse(post.aiTags) : []
    }))

    return NextResponse.json({ posts: formattedPosts })

  } catch (error) {
    console.error('Error fetching community posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}