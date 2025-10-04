import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Fetch notifications from database
    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        community: {
          select: {
            id: true,
            name: true
          }
        },
        post: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    // Format notifications for frontend
    const formattedNotifications = notifications.map((notification: any) => ({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      read: notification.read,
      createdAt: notification.createdAt.toISOString(),
      priority: notification.priority,
      fromUser: notification.fromUser ? {
        id: notification.fromUser.id,
        name: notification.fromUser.name,
        image: notification.fromUser.image
      } : null,
      community: notification.community ? {
        id: notification.community.id,
        name: notification.community.name
      } : null,
      post: notification.post ? {
        id: notification.post.id,
        title: notification.post.title
      } : null
    }))

    const unreadCount = notifications.filter((n: any) => !n.read).length

    return NextResponse.json({
      notifications: formattedNotifications,
      unreadCount
    })

  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      type,
      title,
      message,
      targetUserId,
      fromUserId,
      communityId,
      postId,
      priority = 'NORMAL',
      metadata
    } = await request.json()

    if (!type || !title || !message || !targetUserId) {
      return NextResponse.json({
        error: 'Type, title, message, and targetUserId are required'
      }, { status: 400 })
    }

    // Create notification in database
    const notification = await prisma.notification.create({
      data: {
        type: type.toUpperCase(),
        title,
        message,
        userId: targetUserId,
        fromUserId,
        communityId,
        postId,
        priority: priority.toUpperCase(),
        metadata: metadata ? JSON.stringify(metadata) : null
      },
      include: {
        fromUser: {
          select: { name: true, image: true }
        },
        community: {
          select: { name: true }
        }
      }
    })

    // Here you would trigger real-time notifications (WebSocket, Server-Sent Events, etc.)

    return NextResponse.json({
      success: true,
      notification
    })

  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}