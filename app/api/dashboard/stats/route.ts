import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
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

        // Get user's community memberships
        const userCommunities = await prisma.communityMember.findMany({
            where: { userId: user.id },
            include: { community: true }
        })

        // Get total messages in user's communities
        const totalMessages = await prisma.message.count({
            where: {
                communityId: {
                    in: userCommunities.map(uc => uc.communityId)
                }
            }
        })

        // Get unread notifications
        const unreadNotifications = await prisma.notification.count({
            where: {
                userId: user.id,
                read: false
            }
        })

        // Get weekly activity (messages in last 7 days)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)

        const weeklyActivity = await prisma.message.count({
            where: {
                communityId: {
                    in: userCommunities.map(uc => uc.communityId)
                },
                createdAt: {
                    gte: weekAgo
                }
            }
        })

        const stats = {
            totalCommunities: userCommunities.length,
            totalMessages,
            unreadNotifications,
            activeDiscussions: userCommunities.filter(uc => uc.community.isActive).length,
            weeklyActivity,
            monthlyGrowth: 12 // Mock data for now
        }

        return NextResponse.json(stats)
    } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}