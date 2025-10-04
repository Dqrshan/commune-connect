import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { analyzePost } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, content, type, communityId } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content required' }, { status: 400 })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Community ID is required
    if (!communityId) {
      return NextResponse.json({ error: 'Community ID is required' }, { status: 400 })
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
      return NextResponse.json({ error: 'You must be a member of this community to post' }, { status: 403 })
    }

    let targetCommunityId = communityId

    // Analyze post with AI
    const analysis = await analyzePost(content, title)

    // Create post
    const post = await prisma.post.create({
      data: {
        title,
        content,
        type: type || 'GENERAL',
        userId: user.id,
        communityId: targetCommunityId,
        priority: analysis.priority || 'NORMAL',
        aiTags: JSON.stringify(analysis.tags || [])
      },
      include: {
        user: {
          select: { name: true, image: true }
        },
        community: {
          select: { name: true }
        },
        _count: {
          select: { comments: true }
        }
      }
    })

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}