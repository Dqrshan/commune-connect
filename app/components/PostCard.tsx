'use client'

import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
    Heart,
    MessageCircle,
    Share2,
    AlertTriangle,
    HelpCircle,
    Construction,
    Megaphone,
    MessageSquare,
    Clock,
    MapPin,
    TrendingUp,
    Flame
} from 'lucide-react'

interface Post {
    id: string
    title: string
    content: string
    type: string
    priority: string
    aiTags: string[]
    createdAt: string
    user: {
        name: string
        image: string
    }
    community: {
        name: string
    }
    _count: {
        comments: number
    }
}

interface PostCardProps {
    post: Post
}

export function PostCard({ post }: PostCardProps) {
    const getPriorityConfig = (priority: string) => {
        switch (priority) {
            case 'URGENT':
                return {
                    color: 'bg-red-100 text-red-800 border-red-200',
                    icon: <Flame className="w-3 h-3" />,
                    label: 'Urgent'
                }
            case 'HIGH':
                return {
                    color: 'bg-orange-100 text-orange-800 border-orange-200',
                    icon: <TrendingUp className="w-3 h-3" />,
                    label: 'High'
                }
            case 'NORMAL':
                return {
                    color: 'bg-blue-100 text-blue-800 border-blue-200',
                    icon: <Clock className="w-3 h-3" />,
                    label: 'Normal'
                }
            case 'LOW':
                return {
                    color: 'bg-gray-100 text-gray-800 border-gray-200',
                    icon: <Clock className="w-3 h-3" />,
                    label: 'Low'
                }
            default:
                return {
                    color: 'bg-gray-100 text-gray-800 border-gray-200',
                    icon: <Clock className="w-3 h-3" />,
                    label: 'Normal'
                }
        }
    }

    const getTypeConfig = (type: string) => {
        switch (type) {
            case 'ALERT':
                return {
                    icon: <AlertTriangle className="w-4 h-4" />,
                    color: 'text-red-600',
                    bg: 'bg-red-50',
                    label: 'Alert'
                }
            case 'QUESTION':
                return {
                    icon: <HelpCircle className="w-4 h-4" />,
                    color: 'text-blue-600',
                    bg: 'bg-blue-50',
                    label: 'Question'
                }
            case 'ROADBLOCK':
                return {
                    icon: <Construction className="w-4 h-4" />,
                    color: 'text-orange-600',
                    bg: 'bg-orange-50',
                    label: 'Roadblock'
                }
            case 'PROTEST':
                return {
                    icon: <Megaphone className="w-4 h-4" />,
                    color: 'text-purple-600',
                    bg: 'bg-purple-50',
                    label: 'Protest'
                }
            default:
                return {
                    icon: <MessageSquare className="w-4 h-4" />,
                    color: 'text-gray-600',
                    bg: 'bg-gray-50',
                    label: 'General'
                }
        }
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
    }

    const priorityConfig = getPriorityConfig(post.priority)
    const typeConfig = getTypeConfig(post.type)

    return (
        <Card className="group hover:shadow-lg transition-all duration-200 border-0 shadow-md">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={post.user.image || ''} alt={post.user.name} />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white">
                                {getInitials(post.user.name)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-sm">{post.user.name}</span>
                                <span className="text-muted-foreground text-xs">•</span>
                                <div className="flex items-center space-x-1 text-muted-foreground text-xs">
                                    <MapPin className="w-3 h-3" />
                                    <span>{post.community.name}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${typeConfig.bg}`}>
                            <span className={typeConfig.color}>{typeConfig.icon}</span>
                            <span className={`text-xs font-medium ${typeConfig.color}`}>
                                {typeConfig.label}
                            </span>
                        </div>
                        <Badge variant="outline" className={`${priorityConfig.color} border text-xs`}>
                            {priorityConfig.icon}
                            <span className="ml-1">{priorityConfig.label}</span>
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
                            {post.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {post.content}
                        </p>
                    </div>

                    {post.aiTags && post.aiTags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {post.aiTags.map((tag, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs"
                                >
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    )}

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-600 hover:bg-red-50">
                                <Heart className="w-4 h-4 mr-2" />
                                <span className="text-sm">Like</span>
                            </Button>

                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-600 hover:bg-blue-50">
                                <MessageCircle className="w-4 h-4 mr-2" />
                                <span className="text-sm">{post._count.comments} Comments</span>
                            </Button>

                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-green-600 hover:bg-green-50">
                                <Share2 className="w-4 h-4 mr-2" />
                                <span className="text-sm">Share</span>
                            </Button>
                        </div>

                        <div className="text-xs text-muted-foreground">
                            {post._count.comments > 0 && (
                                <span>{post._count.comments} {post._count.comments === 1 ? 'reply' : 'replies'}</span>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}