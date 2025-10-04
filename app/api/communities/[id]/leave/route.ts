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

        // Check if community exists
        const community = await prisma.community.findUnique({
            where: { id: communityId }
        })

        if (!community) {
            return NextResponse.json({ error: 'Community not found' }, { status: 404 })
        }

        // Check if user is a member
        const membership = await prisma.communityMember.findFirst({
            where: {
                communityId,
                userId: user.id
            }
        })

        if (!membership) {
            return NextResponse.json({ error: 'Not a member of this community' }, { status: 400 })
        }

        // Don't allow community admin to leave if they're the only admin
        if (membership.role === 'ADMIN') {
            const adminCount = await prisma.communityMember.count({
                where: {
                    communityId,
                    role: 'ADMIN'
                }
            })

            if (adminCount === 1) {
                return NextResponse.json({
                    error: 'Cannot leave community as the only admin. Please assign another admin first.'
                }, { status: 400 })
            }
        }

        // Remove membership
        await prisma.communityMember.delete({
            where: { id: membership.id }
        })

        return NextResponse.json({
            success: true,
            message: 'Successfully left community'
        })
    } catch (error) {
        console.error('Error leaving community:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}