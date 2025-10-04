'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Navigation } from './Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Bell,
    Users,
    MessageSquare,
    Settings,
    Crown,
    Shield,
    Hash,
    AlertTriangle,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Eye,
    Globe
} from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface DashboardStats {
    totalCommunities: number
    totalMessages: number
    unreadNotifications: number
    activeDiscussions: number
    weeklyActivity: number
    monthlyGrowth: number
}

interface Community {
    id: string
    name: string
    description: string
    _count: {
        members: number
        messages: number
    }
    role: string
    lastActivity: string
}

interface Notification {
    id: string
    type: string
    title: string
    message: string
    read: boolean
    createdAt: string
    priority: string
    community?: {
        name: string
    }
}

interface RecentActivity {
    id: string
    type: 'message' | 'join' | 'post'
    content: string
    community: string
    user: string
    timestamp: string
}

export function DashboardPage() {
    const { data: session } = useSession()
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [communities, setCommunities] = useState<Community[]>([])
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (session?.user) {
            fetchDashboardData()
        }
    }, [session])

    const fetchDashboardData = async () => {
        try {
            const [statsRes, communitiesRes, notificationsRes] = await Promise.all([
                fetch('/api/dashboard/stats'),
                fetch('/api/dashboard/communities'),
                fetch('/api/notifications')
            ])

            if (statsRes.ok) {
                const statsData = await statsRes.json()
                setStats(statsData)
            }

            if (communitiesRes.ok) {
                const communitiesData = await communitiesRes.json()
                setCommunities(communitiesData.communities || [])
            }

            if (notificationsRes.ok) {
                const notificationsData = await notificationsRes.json()
                setNotifications(notificationsData.notifications || [])
            }

            // Mock recent activity for now
            setRecentActivity([
                {
                    id: '1',
                    type: 'message',
                    content: 'New message in Downtown Brooklyn',
                    community: 'Downtown Brooklyn',
                    user: 'John Doe',
                    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString()
                },
                {
                    id: '2',
                    type: 'join',
                    content: 'Sarah joined Manhattan West',
                    community: 'Manhattan West',
                    user: 'Sarah Wilson',
                    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
                }
            ])
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return <Badge className="bg-red-100 text-red-800"><Crown className="w-3 h-3 mr-1" />Admin</Badge>
            case 'MODERATOR':
                return <Badge className="bg-blue-100 text-blue-800"><Shield className="w-3 h-3 mr-1" />Moderator</Badge>
            default:
                return <Badge variant="outline">Member</Badge>
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'HIGH':
            case 'URGENT':
                return 'text-red-600'
            case 'NORMAL':
                return 'text-blue-600'
            default:
                return 'text-gray-600'
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <Navigation />
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p>Loading dashboard...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <Navigation />

            <div className="w-full px-4 py-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                            <p className="text-gray-600">Welcome back, {session?.user?.name}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/communities">
                                    <Globe className="w-4 h-4 mr-2" />
                                    View Communities
                                </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/profile">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Settings
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Communities</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.totalCommunities}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Users className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center">
                                        <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                                        <span className="text-sm text-green-600">+12% from last month</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Messages</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.totalMessages}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                            <MessageSquare className="w-6 h-6 text-green-600" />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center">
                                        <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                                        <span className="text-sm text-green-600">+8% from last week</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Notifications</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.unreadNotifications}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                            <Bell className="w-6 h-6 text-yellow-600" />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center">
                                        <span className="text-sm text-gray-600">Unread messages</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Activity</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.weeklyActivity}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <Activity className="w-6 h-6 text-purple-600" />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center">
                                        <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                                        <span className="text-sm text-red-600">-3% from last week</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Communities & Activity */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* My Communities */}
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>My Communities</span>
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="outline">{communities.length}</Badge>
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href="/communities">
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    View All
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {communities.length > 0 ? (
                                            communities.slice(0, 5).map((community) => (
                                                <div key={community.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                                            <Hash className="w-5 h-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold">{community.name}</h3>
                                                            <p className="text-sm text-gray-600">{community._count.members} members • {community._count.messages} messages</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        {getRoleBadge(community.role)}
                                                        <Button variant="ghost" size="sm" asChild>
                                                            <Link href={`/communities/${community.id}`}>
                                                                View
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                                <p>You haven't joined any communities yet.</p>
                                                <Button variant="outline" size="sm" className="mt-2" asChild>
                                                    <Link href="/communities">Browse Communities</Link>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Activity */}
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {recentActivity.map((activity) => (
                                            <div key={activity.id} className="flex items-start space-x-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    {activity.type === 'message' && <MessageSquare className="w-4 h-4 text-blue-600" />}
                                                    {activity.type === 'join' && <Users className="w-4 h-4 text-green-600" />}
                                                    {activity.type === 'post' && <Hash className="w-4 h-4 text-purple-600" />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm">{activity.content}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Notifications */}
                        <div className="space-y-6">
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>Notifications</span>
                                        <Badge variant="outline">{notifications.filter(n => !n.read).length} new</Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-96">
                                        <div className="space-y-4">
                                            {notifications.length > 0 ? (
                                                notifications.slice(0, 10).map((notification) => (
                                                    <div key={notification.id} className={`p-3 rounded-lg border ${!notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}>
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <h4 className="font-medium text-sm">{notification.title}</h4>
                                                                <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                                                                {notification.community && (
                                                                    <p className="text-xs text-blue-600 mt-1">in {notification.community.name}</p>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center space-x-1 ml-2">
                                                                {!notification.read && (
                                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                                )}
                                                                <span className={`text-xs ${getPriorityColor(notification.priority)}`}>
                                                                    {notification.priority}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-gray-400 mt-2">
                                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                        </p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">
                                                    <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                                    <p>No notifications yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    </ScrollArea>
                                    {notifications.length > 0 && (
                                        <div className="mt-4 pt-4 border-t">
                                            <Button variant="outline" size="sm" className="w-full" asChild>
                                                <Link href="/notifications">
                                                    View All Notifications
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}