'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Navigation } from '../components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Bell,
    ArrowLeft,
    CheckCircle,
    AlertTriangle,
    MessageSquare,
    Users,
    Crown,
    Settings,
    Trash2,
    Mail,
    Check,
    Filter,
    Search
} from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface Notification {
    id: string
    type: string
    title: string
    message: string
    read: boolean
    createdAt: string
    priority: string
    community?: {
        id: string
        name: string
    }
    fromUser?: {
        id: string
        name: string
        image: string
    }
    post?: {
        id: string
        title: string
    }
}

export default function NotificationsPage() {
    const { data: session } = useSession()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

    useEffect(() => {
        if (session?.user) {
            fetchNotifications()
        }
    }, [session])

    const fetchNotifications = async () => {
        try {
            const response = await fetch('/api/notifications')
            if (response.ok) {
                const data = await response.json()
                setNotifications(data.notifications || [])
            }
        } catch (error) {
            console.error('Error fetching notifications:', error)
        } finally {
            setLoading(false)
        }
    }

    const markAsRead = async (notificationId: string) => {
        try {
            const response = await fetch(`/api/notifications/${notificationId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ read: true })
            })

            if (response.ok) {
                setNotifications(prev =>
                    prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
                )
            }
        } catch (error) {
            console.error('Error marking notification as read:', error)
        }
    }

    const markAsUnread = async (notificationId: string) => {
        try {
            const response = await fetch(`/api/notifications/${notificationId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ read: false })
            })

            if (response.ok) {
                setNotifications(prev =>
                    prev.map(n => n.id === notificationId ? { ...n, read: false } : n)
                )
            }
        } catch (error) {
            console.error('Error marking notification as unread:', error)
        }
    }

    const markAllAsRead = async () => {
        try {
            const response = await fetch('/api/notifications/read-all', {
                method: 'POST'
            })

            if (response.ok) {
                setNotifications(prev =>
                    prev.map(n => ({ ...n, read: true }))
                )
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error)
        }
    }

    const deleteNotification = async (notificationId: string) => {
        try {
            const response = await fetch(`/api/notifications/${notificationId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                setNotifications(prev =>
                    prev.filter(n => n.id !== notificationId)
                )
            }
        } catch (error) {
            console.error('Error deleting notification:', error)
        }
    }

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'MENTION':
            case 'REPLY':
                return <MessageSquare className="w-5 h-5 text-blue-600" />
            case 'COMMUNITY_JOIN':
                return <Users className="w-5 h-5 text-green-600" />
            case 'ALERT':
                return <AlertTriangle className="w-5 h-5 text-red-600" />
            case 'SYSTEM':
                return <Settings className="w-5 h-5 text-gray-600" />
            case 'SUBSCRIPTION':
                return <Crown className="w-5 h-5 text-purple-600" />
            default:
                return <Bell className="w-5 h-5 text-gray-600" />
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'HIGH':
            case 'URGENT':
                return 'border-l-red-500 bg-red-50'
            case 'NORMAL':
                return 'border-l-blue-500 bg-blue-50'
            default:
                return 'border-l-gray-300 bg-gray-50'
        }
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
    }

    const filteredNotifications = notifications.filter(notification => {
        if (filter === 'unread') return !notification.read
        if (filter === 'read') return notification.read
        return true
    })

    const unreadCount = notifications.filter(n => !n.read).length

    if (!session) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <Navigation />
                <div className="flex items-center justify-center min-h-[80vh]">
                    <Card className="max-w-md w-full mx-4 border-0 shadow-xl">
                        <CardHeader className="text-center">
                            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <CardTitle>Sign In Required</CardTitle>
                            <p className="text-gray-600">Please sign in to view your notifications.</p>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full">
                                <Link href="/auth/signin">Sign In</Link>
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

            <div className="w-full px-4 py-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex flex-col justify-start items-start space-x-4">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Dashboard
                                </Link>
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                                <p className="text-gray-600">
                                    {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            {unreadCount > 0 && (
                                <Button variant="outline" onClick={markAllAsRead}>
                                    <Check className="w-4 h-4 mr-2" />
                                    Mark All Read
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Filters */}
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant={filter === 'all' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFilter('all')}
                                >
                                    All ({notifications.length})
                                </Button>
                                <Button
                                    variant={filter === 'unread' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFilter('unread')}
                                >
                                    Unread ({unreadCount})
                                </Button>
                                <Button
                                    variant={filter === 'read' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFilter('read')}
                                >
                                    Read ({notifications.length - unreadCount})
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notifications */}
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p>Loading notifications...</p>
                        </div>
                    ) : filteredNotifications.length > 0 ? (
                        <div className="space-y-4">
                            {filteredNotifications.map((notification) => (
                                <Card key={notification.id} className={`border-0 shadow-md border-l-4 ${getPriorityColor(notification.priority)} ${!notification.read ? 'ring-2 ring-blue-100' : ''}`}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-4 flex-1">
                                                <div className="flex-shrink-0">
                                                    {getNotificationIcon(notification.type)}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                                                        {!notification.read && (
                                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                        )}
                                                        <Badge variant="outline" className="text-xs">
                                                            {notification.priority}
                                                        </Badge>
                                                    </div>

                                                    <p className="text-gray-700 mb-2">{notification.message}</p>

                                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                        <span>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>

                                                        {notification.community && (
                                                            <Link
                                                                href={`/communities/${notification.community.id}`}
                                                                className="text-blue-600 hover:text-blue-800"
                                                            >
                                                                in {notification.community.name}
                                                            </Link>
                                                        )}

                                                        {notification.fromUser && (
                                                            <div className="flex items-center space-x-1">
                                                                <Avatar className="h-4 w-4">
                                                                    <AvatarImage src={notification.fromUser.image} />
                                                                    <AvatarFallback className="text-xs">
                                                                        {getInitials(notification.fromUser.name)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <span>from {notification.fromUser.name}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2 ml-4">
                                                {notification.read ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => markAsUnread(notification.id)}
                                                        title="Mark as unread"
                                                    >
                                                        <Mail className="w-4 h-4" />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => markAsRead(notification.id)}
                                                        title="Mark as read"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </Button>
                                                )}

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => deleteNotification(notification.id)}
                                                    title="Delete notification"
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="border-0 shadow-lg">
                            <CardContent className="text-center py-12">
                                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">
                                    {filter === 'unread' ? 'No unread notifications' :
                                        filter === 'read' ? 'No read notifications' : 'No notifications'}
                                </h3>
                                <p className="text-gray-600">
                                    {filter === 'unread' ? 'All caught up! You have no unread notifications.' :
                                        filter === 'read' ? 'No read notifications to show.' :
                                            'You have no notifications yet. Join some communities to get started!'}
                                </p>
                                {filter !== 'all' && (
                                    <Button variant="outline" className="mt-4" onClick={() => setFilter('all')}>
                                        View All Notifications
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}