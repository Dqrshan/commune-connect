import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession()
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check if user is admin
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
        }

        // Get admin statistics
        const [
            totalUsers,
            totalCommunities,
            activeCommunities,
            pendingRequests,
            totalPosts,
            recentActivity
        ] = await Promise.all([
            prisma.user.count(),
            prisma.community.count(),
            prisma.community.count({ where: { isActive: true } }),
            prisma.community.count({ where: { isActive: false } }),
            prisma.post.count(),
            prisma.post.count({
                where: {
                    createdAt: {
                        gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
                    }
                }
            })
        ])

        const stats = {
            totalUsers,
            totalCommunities,
            activeCommunities,
            pendingRequests,
            totalPosts,
            recentActivity
        }

        return NextResponse.json(stats)

    } catch (error) {
        console.error('Error fetching admin stats:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}