import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { geocodeLocation, validateLocation } from '@/lib/geocoding'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { name, description, location, radius = 5.0 } = await request.json()

        if (!name || !description || !location) {
            return NextResponse.json({
                error: 'Name, description, and location are required'
            }, { status: 400 })
        }

        // Validate location
        if (!validateLocation(location)) {
            return NextResponse.json({
                error: 'Please provide a valid location (city, neighborhood, or area)'
            }, { status: 400 })
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Convert location to coordinates
        const coordinates = await geocodeLocation(location)

        // Create community request (pending approval)
        const communityRequest = await prisma.community.create({
            data: {
                name,
                description,
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
                radius: parseFloat(radius),
                isActive: false, // Pending admin approval
            }
        })

        // Add the requester as the first member (admin role when approved)
        await prisma.communityMember.create({
            data: {
                userId: user.id,
                communityId: communityRequest.id,
                role: 'ADMIN'
            }
        })

        // Create notification for admins
        const admins = await prisma.user.findMany({
            where: { role: 'ADMIN' }
        })

        for (const admin of admins) {
            await prisma.notification.create({
                data: {
                    type: 'SYSTEM',
                    title: 'New Community Request',
                    message: `${user.name} requested to create "${name}" community`,
                    userId: admin.id,
                    fromUserId: user.id,
                    communityId: communityRequest.id,
                    priority: 'NORMAL',
                    metadata: JSON.stringify({
                        action: 'community_request',
                        requesterId: user.id,
                        communityId: communityRequest.id
                    })
                }
            })
        }

        return NextResponse.json({
            success: true,
            message: 'Community request submitted for approval',
            communityId: communityRequest.id
        })

    } catch (error) {
        console.error('Error creating community request:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}