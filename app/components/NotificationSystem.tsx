'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Bell,
    X,
    MessageSquare,
    Users,
    AlertTriangle,
    CheckCircle,
    Clock,
    MapPin
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Notification {
    id: string
    type: 'mention' | 'reply' | 'community_join' | 'post_like' | 'alert' | 'system'
    title: string
    message: string
    read: boolean
    createdAt: string
    userId?: string
    userName?: string
    userImage?: string
    communityId?: string
    communityName?: string
    postId?: string
    priority: 'low' | 'normal' | 'high' | 'urgent'
}

export function NotificationSystem() {
    const { data: session } = useSession()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        if (session?.user) {
            fetchNotifications()
            // Set up real-time notifications
            const interval = setInterval(fetchNotifications, 30000) // Poll every 30 seconds
            return () => clearInterval(interval)
        }
    }, [session])

    const fetchNotifications = async () => {
        try {
            const response = await fetch('/api/notifications')
            const data = await response.json()
            setNotifications(data.notifications || [])
            setUnreadCount(data.unreadCount || 0)
        } catch (error) {
            console.error('Error fetching notifications:', error)
        }
    }

    const markAsRead = async (notificationId: string) => {
        try {
            await fetch(`/api/notifications/${notificationId}/read`, {
                method: 'POST'
            })

            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
            )
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (error) {
            console.error('Error marking notification as read:', error)
        }
    }

    const markAllAsRead = async () => {
        try {
            await fetch('/api/notifications/read-all', {
                method: 'POST'
            })

            setNotifications(prev => prev.map(n => ({ ...n, read: true })))
            setUnreadCount(0)
        } catch (error) {
            console.error('Error marking all notifications as read:', error)
        }
    }

    const deleteNotification = async (notificationId: string) => {
        try {
            await fetch(`/api/notifications/${notificationId}`, {
                method: 'DELETE'
            })

            setNotifications(prev => prev.filter(n => n.id !== notificationId))
            if (!notifications.find(n => n.id === notificationId)?.read) {
                setUnreadCount(prev => Math.max(0, prev - 1))
            }
        } catch (error) {
            console.error('Error deleting notification:', error)
        }
    }

    const getNotificationIcon = (type: string, priority: string) => {
        const iconClass = priority === 'urgent' ? 'text-red-500' :
            priority === 'high' ? 'text-orange-500' :
                'text-blue-500'

        switch (type) {
            case 'mention':
            case 'reply':
                return <MessageSquare className={`h-4 w-4 ${iconClass}`} />
            case 'community_join':
                return <Users className={`h-4 w-4 ${iconClass}`} />
            case 'alert':
                return <AlertTriangle className={`h-4 w-4 ${iconClass}`} />
            case 'system':
                return <CheckCircle className={`h-4 w-4 ${iconClass}`} />
            default:
                return <Bell className={`h-4 w-4 ${iconClass}`} />
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'bg-red-100 border-red-200'
            case 'high': return 'bg-orange-100 border-orange-200'
            case 'normal': return 'bg-blue-100 border-blue-200'
            default: return 'bg-gray-100 border-gray-200'
        }
    }

    if (!session) return null

    return (
        <div className="relative">
            {/* Notification Bell */}
            <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                    <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                )}
            </Button>

            {/* Notification Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg border shadow-lg z-50 max-h-96 overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b flex items-center justify-between">
                        <h3 className="font-semibold">Notifications</h3>
                        <div className="flex items-center space-x-2">
                            {unreadCount > 0 && (
                                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                                    Mark all read
                                </Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''
                                            }`}
                                    >
                                        <div className="flex items-start space-x-3">
                                            {/* Avatar or Icon */}
                                            {notification.userImage ? (
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={notification.userImage} alt={notification.userName} />
                                                    <AvatarFallback>
                                                        {notification.userName?.charAt(0) || 'U'}
                                                    </AvatarFallback>
                                                </Avatar>
                                            ) : (
                                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                                    {getNotificationIcon(notification.type, notification.priority)}
                                                </div>
                                            )}

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {notification.title}
                                                        </p>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {notification.message}
                                                        </p>

                                                        {/* Meta info */}
                                                        <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                                                            <Clock className="h-3 w-3" />
                                                            <span>{formatDistanceToNow(new Date(notification.createdAt))} ago</span>

                                                            {notification.communityName && (
                                                                <>
                                                                    <span>•</span>
                                                                    <MapPin className="h-3 w-3" />
                                                                    <span>{notification.communityName}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center space-x-1 ml-2">
                                                        {!notification.read && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => markAsRead(notification.id)}
                                                                className="h-6 w-6 p-0"
                                                            >
                                                                <CheckCircle className="h-3 w-3" />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => deleteNotification(notification.id)}
                                                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Priority indicator */}
                                                {notification.priority !== 'normal' && (
                                                    <div className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${getPriorityColor(notification.priority)}`}>
                                                        {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)} Priority
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="p-3 border-t bg-gray-50">
                            <Button variant="ghost" size="sm" className="w-full">
                                View All Notifications
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}