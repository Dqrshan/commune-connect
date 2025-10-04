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

        // Get user's communities with counts
        const communities = await prisma.communityMember.findMany({
            where: { userId: user.id },
            include: {
                community: {
                    include: {
                        _count: {
                            select: {
                                members: true,
                                messages: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                joinedAt: 'desc'
            }
        })

        const formattedCommunities = communities.map(membership => ({
            id: membership.community.id,
            name: membership.community.name,
            description: membership.community.description,
            _count: membership.community._count,
            role: membership.role,
            lastActivity: membership.joinedAt.toISOString()
        }))

        return NextResponse.json({ communities: formattedCommunities })
    } catch (error) {
        console.error('Error fetching user communities:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}