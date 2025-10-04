import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(
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

        // Check if community exists and is active
        const community = await prisma.community.findUnique({
            where: { id: communityId }
        })

        if (!community) {
            return NextResponse.json({ error: 'Community not found' }, { status: 404 })
        }

        if (!community.isActive) {
            return NextResponse.json({ error: 'Community is not active' }, { status: 403 })
        }

        // Check if user is already a member
        const existingMembership = await prisma.communityMember.findFirst({
            where: {
                communityId,
                userId: user.id
            }
        })

        if (existingMembership) {
            return NextResponse.json({ error: 'Already a member of this community' }, { status: 400 })
        }

        // Add user as member
        const membership = await prisma.communityMember.create({
            data: {
                userId: user.id,
                communityId,
                role: 'MEMBER'
            }
        })

        // Create welcome notification
        await prisma.notification.create({
            data: {
                type: 'WELCOME',
                title: `Welcome to ${community.name}!`,
                message: `You've successfully joined the ${community.name} community. Start connecting with your neighbors!`,
                userId: user.id,
                communityId,
                priority: 'NORMAL'
            }
        })

        return NextResponse.json({
            success: true,
            membership,
            message: 'Successfully joined community'
        })
    } catch (error) {
        console.error('Error joining community:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}