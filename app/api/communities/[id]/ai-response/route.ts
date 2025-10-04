import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { suggestResponse } from '@/lib/gemini'

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
        const { messageContent } = await request.json()

        if (!messageContent?.trim()) {
            return NextResponse.json({ error: 'Message content is required' }, { status: 400 })
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Check if user is member of community
        const membership = await prisma.communityMember.findFirst({
            where: {
                communityId,
                userId: user.id
            }
        })

        if (!membership) {
            return NextResponse.json({ error: 'Not a member of this community' }, { status: 403 })
        }

        // Get community context
        const community = await prisma.community.findUnique({
            where: { id: communityId }
        })

        if (!community) {
            return NextResponse.json({ error: 'Community not found' }, { status: 404 })
        }

        // Get recent messages for context
        const recentMessages = await prisma.message.findMany({
            where: { communityId },
            include: {
                user: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 10
        })

        // Build context
        const context = `
Community: ${community.name}
Description: ${community.description}
Location: ${community.latitude}, ${community.longitude}
Recent messages: ${recentMessages.map(m => `${m.user.name}: ${m.content}`).join('\n')}
`

        // Get AI response
        const aiResponse = await suggestResponse(messageContent, context)

        return NextResponse.json({
            response: aiResponse,
            success: true
        })
    } catch (error) {
        console.error('Error generating AI response:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}