'use client'

import { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { Navigation } from '../../components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Send,
    Users,
    Hash,
    Crown,
    Shield,
    MapPin,
    AlertTriangle,
    MessageSquare,
    Settings,
    UserPlus,
    LogOut
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Message {
    id: string
    content: string
    createdAt: string
    aiTags?: string
    aiSummary?: string
    user: {
        id: string
        name: string
        image: string
        role: string
    }
}

interface CommunityMember {
    id: string
    role: string
    joinedAt: string
    user: {
        id: string
        name: string
        image: string
        role: string
    }
}

interface Community {
    id: string
    name: string
    description: string
    latitude: number
    longitude: number
    radius: number
    isActive: boolean
    createdAt: string
    _count: {
        members: number
        messages: number
    }
}

export default function CommunityPage() {
    const { data: session } = useSession()
    const params = useParams()
    const communityId = params.id as string

    const [community, setCommunity] = useState<Community | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [members, setMembers] = useState<CommunityMember[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const [isMember, setIsMember] = useState(false)
    const [userRole, setUserRole] = useState<string | null>(null)
    const [aiResponse, setAiResponse] = useState<string | null>(null)
    const [loadingAi, setLoadingAi] = useState(false)

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const messagesContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (communityId) {
            fetchCommunityData()
        }
    }, [communityId])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        // Poll for new messages every 5 seconds
        if (isMember) {
            const interval = setInterval(() => {
                fetchMessages()
            }, 5000)
            return () => clearInterval(interval)
        }
    }, [isMember, communityId])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const fetchCommunityData = async () => {
        try {
            const [communityRes, messagesRes, membersRes] = await Promise.all([
                fetch(`/api/communities/${communityId}`),
                fetch(`/api/communities/${communityId}/messages`),
                fetch(`/api/communities/${communityId}/members`)
            ])

            if (communityRes.ok) {
                const communityData = await communityRes.json()
                setCommunity(communityData.community)
                setIsMember(communityData.isMember)
                setUserRole(communityData.userRole)
            }

            if (messagesRes.ok) {
                const messagesData = await messagesRes.json()
                setMessages(messagesData.messages || [])
            }

            if (membersRes.ok) {
                const membersData = await membersRes.json()
                setMembers(membersData.members || [])
            }
        } catch (error) {
            console.error('Error fetching community data:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchMessages = async () => {
        try {
            const response = await fetch(`/api/communities/${communityId}/messages`)
            if (response.ok) {
                const data = await response.json()
                setMessages(data.messages || [])
            }
        } catch (error) {
            console.error('Error fetching messages:', error)
        }
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || sending) return

        setSending(true)
        try {
            const response = await fetch(`/api/communities/${communityId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newMessage.trim() })
            })

            if (response.ok) {
                const data = await response.json()
                setMessages(prev => [...prev, data.message])
                setNewMessage('')
                setAiResponse(null) // Clear AI response after sending
            }
        } catch (error) {
            console.error('Error sending message:', error)
        } finally {
            setSending(false)
        }
    }

    const handleJoinCommunity = async () => {
        try {
            const response = await fetch(`/api/communities/${communityId}/join`, {
                method: 'POST'
            })

            if (response.ok) {
                setIsMember(true)
                fetchCommunityData()
            } else {
                const data = await response.json()
                alert(data.error || 'Failed to join community')
            }
        } catch (error) {
            console.error('Error joining community:', error)
            alert('An error occurred while joining the community')
        }
    }

    const handleLeaveCommunity = async () => {
        if (!confirm('Are you sure you want to leave this community? You will lose access to all messages and discussions.')) {
            return
        }

        try {
            const response = await fetch(`/api/communities/${communityId}/leave`, {
                method: 'POST'
            })

            const data = await response.json()

            if (response.ok) {
                setIsMember(false)
                setUserRole(null)
                fetchCommunityData()
            } else {
                alert(data.error || 'Failed to leave community')
            }
        } catch (error) {
            console.error('Error leaving community:', error)
            alert('An error occurred while leaving the community')
        }
    }

    const handleAiAssist = async () => {
        if (!newMessage.trim()) return

        setLoadingAi(true)
        setAiResponse(null)

        try {
            const response = await fetch(`/api/communities/${communityId}/ai-response`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messageContent: newMessage.trim() })
            })

            if (response.ok) {
                const data = await response.json()
                setAiResponse(data.response)
            }
        } catch (error) {
            console.error('Error getting AI response:', error)
        } finally {
            setLoadingAi(false)
        }
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
    }

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return <Crown className="w-3 h-3 text-yellow-600" />
            case 'MODERATOR':
                return <Shield className="w-3 h-3 text-blue-600" />
            default:
                return null
        }
    }

    const getUserRoleBadge = (userRole: string, communityRole: string) => {
        if (userRole === 'ADMIN') {
            return <Badge className="bg-red-100 text-red-800 text-xs">Platform Admin</Badge>
        }
        if (communityRole === 'ADMIN') {
            return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Community Admin</Badge>
        }
        if (communityRole === 'MODERATOR') {
            return <Badge className="bg-blue-100 text-blue-800 text-xs">Moderator</Badge>
        }
        return null
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <Navigation />
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p>Loading community...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!community) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <Navigation />
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Community Not Found</h2>
                        <p className="text-gray-600">This community doesn't exist or you don't have access to it.</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!isMember) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <Navigation />
                <div className="container mx-auto px-4 py-8">
                    <Card className="max-w-2xl mx-auto border-0 shadow-xl">
                        <CardHeader className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Hash className="w-8 h-8 text-white" />
                            </div>
                            <CardTitle className="text-2xl">{community.name}</CardTitle>
                            <p className="text-gray-600">{community.description}</p>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                    <Users className="w-4 h-4" />
                                    <span>{community._count.members} members</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <MessageSquare className="w-4 h-4" />
                                    <span>{community._count.messages} messages</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{community.radius}km radius</span>
                                </div>
                            </div>

                            <Button onClick={handleJoinCommunity} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                <UserPlus className="w-4 h-4 mr-2" />
                                Join Community
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <Navigation />

            <div className="flex h-[calc(100vh-64px)]">
                {/* Members Sidebar */}
                <div className="w-60 bg-white border-r border-gray-200 flex flex-col shadow-lg">
                    {/* Community Header */}
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                        <h2 className="font-semibold text-lg truncate text-gray-800">{community.name}</h2>
                        <p className="text-xs text-gray-600">{members.length} members</p>
                        <div className="mt-2 flex space-x-1">
                            {userRole && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleLeaveCommunity}
                                    className="text-xs"
                                >
                                    <LogOut className="w-3 h-3 mr-1" />
                                    Leave
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Members List */}
                    <ScrollArea className="flex-1 p-2">
                        <div className="space-y-1">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-1">
                                Members - {members.length}
                            </div>
                            {members.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center space-x-2 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
                                >
                                    <div className="relative">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={member.user.image} />
                                            <AvatarFallback className="text-xs bg-gray-200">
                                                {getInitials(member.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-1">
                                            <span className="text-sm truncate text-gray-700">{member.user.name}</span>
                                            {getRoleBadge(member.role)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col bg-white">
                    {/* Chat Header */}
                    <div className="h-12 border-b border-gray-200 flex items-center justify-between px-4 bg-white">
                        <div className="flex items-center space-x-2">
                            <Hash className="w-5 h-5 text-gray-500" />
                            <span className="font-semibold text-gray-800">general</span>
                            <span className="text-sm text-gray-500">|</span>
                            <span className="text-sm text-gray-500">{community.description}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                                <Settings className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <ScrollArea className="flex-1 p-4" ref={messagesContainerRef}>
                        <div className="space-y-4">
                            {messages.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <p>No messages yet. Start the conversation!</p>
                                </div>
                            ) : (
                                messages.map((message, index) => {
                                    const showAvatar = index === 0 || messages[index - 1].user.id !== message.user.id
                                    const isConsecutive = index > 0 && messages[index - 1].user.id === message.user.id

                                    return (
                                        <div key={message.id} className={`flex space-x-3 ${isConsecutive ? 'mt-1' : 'mt-4'}`}>
                                            <div className="w-10">
                                                {showAvatar && (
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src={message.user.image} />
                                                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                                            {getInitials(message.user.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                {showAvatar && (
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <span className="font-semibold text-sm text-gray-800">{message.user.name}</span>
                                                        {getUserRoleBadge(message.user.role, 'MEMBER')}
                                                        <span className="text-xs text-gray-500">
                                                            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="text-sm text-gray-900 break-words">
                                                    {message.content}
                                                </div>
                                                {message.aiTags && (
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {JSON.parse(message.aiTags).map((tag: string, i: number) => (
                                                            <Badge key={i} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </ScrollArea>

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                        {/* AI Response */}
                        {aiResponse && (
                            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-start space-x-2">
                                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-xs font-bold">AI</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-blue-800 font-medium">AI Assistant suggests:</p>
                                        <p className="text-sm text-blue-700 mt-1">{aiResponse}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setAiResponse(null)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        ×
                                    </Button>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSendMessage} className="flex space-x-2">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder={`Message #general`}
                                className="flex-1 border-gray-300 focus:border-blue-500"
                                disabled={sending}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleAiAssist}
                                disabled={loadingAi || !newMessage.trim()}
                                className="border-blue-300 text-blue-600 hover:bg-blue-50"
                            >
                                {loadingAi ? (
                                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <span className="text-xs font-bold">AI</span>
                                )}
                            </Button>
                            <Button
                                type="submit"
                                disabled={sending || !newMessage.trim()}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}