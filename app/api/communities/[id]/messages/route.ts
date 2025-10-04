import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { analyzeMessage, generateAutoResponse } from '@/lib/gemini'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const communityId = (await params).id
        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '50')
        const offset = parseInt(searchParams.get('offset') || '0')

        // Check if user is member of community
        const membership = await prisma.communityMember.findFirst({
            where: {
                communityId,
                user: { email: session.user.email }
            }
        })

        if (!membership) {
            return NextResponse.json({ error: 'Not a member of this community' }, { status: 403 })
        }

        const messages = await prisma.message.findMany({
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
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset
        })

        return NextResponse.json({ messages: messages.reverse() })
    } catch (error) {
        console.error('Error fetching messages:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

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
        const { content } = await request.json()

        if (!content?.trim()) {
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

        // Get community info for AI analysis
        const community = await prisma.community.findUnique({
            where: { id: communityId },
            select: { name: true }
        })

        // Create message
        const message = await prisma.message.create({
            data: {
                content: content.trim(),
                userId: user.id,
                communityId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        role: true
                    }
                }
            }
        })

        // Analyze message with AI in background (don't await)
        if (community) {
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

            // Get full community details for AI context
            const fullCommunity = await prisma.community.findUnique({
                where: { id: communityId }
            })

            analyzeMessage(
                content,
                community.name,
                fullCommunity?.description,
                fullCommunity ? { latitude: fullCommunity.latitude, longitude: fullCommunity.longitude } : undefined,
                recentMessages
            )
                .then(async (analysis) => {
                    await prisma.message.update({
                        where: { id: message.id },
                        data: {
                            aiProcessed: true,
                            aiTags: JSON.stringify(analysis.tags),
                            aiSummary: analysis.summary
                        }
                    })

                    // Generate automatic AI response for urgent messages
                    const aiResponse = await generateAutoResponse(
                        content,
                        analysis,
                        community.name,
                        fullCommunity?.description,
                        fullCommunity ? { latitude: fullCommunity.latitude, longitude: fullCommunity.longitude } : undefined,
                        recentMessages
                    )

                    // Post AI response if needed
                    if (aiResponse.shouldRespond && aiResponse.confidence > 0.5) {
                        // Find or create AI user
                        let aiUser = await prisma.user.findFirst({
                            where: { email: 'ai-assistant@communeconnect.ai' }
                        })

                        if (!aiUser) {
                            aiUser = await prisma.user.create({
                                data: {
                                    email: 'ai-assistant@communeconnect.ai',
                                    name: 'AI Assistant',
                                    role: 'USER'
                                }
                            })
                        }

                        // Create AI response message
                        await prisma.message.create({
                            data: {
                                content: `🤖 ${aiResponse.response}`,
                                userId: aiUser.id,
                                communityId,
                                aiProcessed: true,
                                aiTags: JSON.stringify(['ai-response', 'automated', 'help']),
                                aiSummary: 'AI assistant response to urgent message'
                            }
                        })
                    }

                    // Create notifications for urgent messages
                    if (analysis.priority === 'URGENT' || analysis.actionRequired) {
                        const communityMembers = await prisma.communityMember.findMany({
                            where: {
                                communityId,
                                userId: { not: user.id } // Don't notify the sender
                            },
                            include: { user: true }
                        })

                        for (const member of communityMembers) {
                            await prisma.notification.create({
                                data: {
                                    type: 'ALERT',
                                    title: `Urgent message in ${community.name}`,
                                    message: analysis.summary,
                                    userId: member.userId,
                                    fromUserId: user.id,
                                    communityId,
                                    priority: analysis.priority,
                                    metadata: JSON.stringify({
                                        messageId: message.id,
                                        category: analysis.category,
                                        tags: analysis.tags
                                    })
                                }
                            })
                        }
                    }
                })
                .catch(error => {
                    console.error('Error processing message with AI:', error)
                })
        }

        return NextResponse.json({ message })
    } catch (error) {
        console.error('Error creating message:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}