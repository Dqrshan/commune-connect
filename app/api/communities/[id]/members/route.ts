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

        // Check if user is a member of the community
        const membership = await prisma.communityMember.findFirst({
            where: {
                userId: user.id,
                communityId: communityId
            }
        })

        if (!membership) {
            return NextResponse.json({ error: 'Not a member of this community' }, { status: 403 })
        }

        // Get community members
        const members = await prisma.communityMember.findMany({
            where: { communityId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        role: true
                    }
                }
            },
            orderBy: [
                { role: 'asc' }, // Admins first, then moderators, then members
                { joinedAt: 'asc' }
            ]
        })

        return NextResponse.json({ members })

    } catch (error) {
        console.error('Error fetching community members:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}