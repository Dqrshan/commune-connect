import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession()
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check if user is admin
        const adminUser = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!adminUser || adminUser.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
        }

        const { userId, role } = await request.json()

        if (!userId || !role) {
            return NextResponse.json({
                error: 'User ID and role are required'
            }, { status: 400 })
        }

        if (!['USER', 'MODERATOR', 'ADMIN'].includes(role)) {
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
        }

        // Update user role
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role: role as any },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        })

        // Notify the user about role change
        await prisma.notification.create({
            data: {
                type: 'SYSTEM',
                title: 'Role Updated',
                message: `Your role has been updated to ${role.toLowerCase()} by an administrator.`,
                userId: userId,
                fromUserId: adminUser.id,
                priority: 'NORMAL'
            }
        })

        return NextResponse.json({
            success: true,
            message: `User role updated to ${role}`,
            user: updatedUser
        })

    } catch (error) {
        console.error('Error updating user role:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}