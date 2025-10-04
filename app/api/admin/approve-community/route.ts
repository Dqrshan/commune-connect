import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
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

        const { communityId, action } = await request.json()

        if (!communityId || !action) {
            return NextResponse.json({
                error: 'Community ID and action are required'
            }, { status: 400 })
        }

        if (action === 'approve') {
            // Approve the community
            const community = await prisma.community.update({
                where: { id: communityId },
                data: { isActive: true },
                include: {
                    members: {
                        include: {
                            user: true
                        }
                    }
                }
            })

            // Notify the requester
            const requester = community.members.find(m => m.role === 'ADMIN')
            if (requester) {
                await prisma.notification.create({
                    data: {
                        type: 'SYSTEM',
                        title: 'Community Approved!',
                        message: `Your community "${community.name}" has been approved and is now live!`,
                        userId: requester.userId,
                        communityId: community.id,
                        priority: 'HIGH'
                    }
                })
            }

            return NextResponse.json({
                success: true,
                message: 'Community approved successfully'
            })

        } else if (action === 'reject') {
            // Get community details before deletion
            const community = await prisma.community.findUnique({
                where: { id: communityId },
                include: {
                    members: {
                        include: {
                            user: true
                        }
                    }
                }
            })

            if (community) {
                // Notify the requester
                const requester = community.members.find(m => m.role === 'ADMIN')
                if (requester) {
                    await prisma.notification.create({
                        data: {
                            type: 'SYSTEM',
                            title: 'Community Request Rejected',
                            message: `Your community request "${community.name}" was not approved. Please contact support for more information.`,
                            userId: requester.userId,
                            priority: 'NORMAL'
                        }
                    })
                }

                // Delete the community and its members
                await prisma.communityMember.deleteMany({
                    where: { communityId }
                })

                await prisma.community.delete({
                    where: { id: communityId }
                })
            }

            return NextResponse.json({
                success: true,
                message: 'Community request rejected'
            })
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

    } catch (error) {
        console.error('Error processing community approval:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}