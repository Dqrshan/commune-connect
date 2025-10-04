'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    Users,
    MapPin,
    Clock,
    CheckCircle,
    TrendingUp,
    MessageSquare
} from 'lucide-react'

interface Community {
    id: string
    name: string
    description: string
    memberCount: number
    distance: number
    isJoined: boolean
    postCount?: number
    lastActivity?: string
    isActive?: boolean
}

interface CommunityCardProps {
    community: Community
    onJoin: () => void
}

export function CommunityCard({ community, onJoin }: CommunityCardProps) {
    const [isJoining, setIsJoining] = useState(false)

    const handleJoin = async () => {
        setIsJoining(true)
        try {
            const response = await fetch('/api/communities/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ communityId: community.id }),
            })

            if (response.ok) {
                onJoin()
            }
        } catch (error) {
            console.error('Error joining community:', error)
        } finally {
            setIsJoining(false)
        }
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
    }

    const getDistanceColor = (distance: number) => {
        if (distance < 2) return 'text-green-600'
        if (distance < 5) return 'text-yellow-600'
        return 'text-orange-600'
    }

    return (
        <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-0 shadow-md">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12 bg-gradient-to-br from-primary to-purple-600">
                            <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-semibold">
                                {getInitials(community.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                                {community.name}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                                {community.isActive && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse" />
                                        Active
                                    </Badge>
                                )}
                                <Badge variant="outline" className="text-xs">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    Growing
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pb-4">
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                    {community.description}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{community.memberCount.toLocaleString()}</span>
                        <span className="text-muted-foreground">members</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <MapPin className={`h-4 w-4 ${getDistanceColor(community.distance)}`} />
                        <span className={`font-medium ${getDistanceColor(community.distance)}`}>
                            {community.distance.toFixed(1)} km
                        </span>
                    </div>

                    {community.postCount !== undefined && (
                        <div className="flex items-center space-x-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{community.postCount}</span>
                            <span className="text-muted-foreground">posts</span>
                        </div>
                    )}

                    {community.lastActivity && (
                        <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground text-xs">{community.lastActivity}</span>
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="pt-0">
                {community.isJoined ? (
                    <Button
                        variant="secondary"
                        className="w-full bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                        disabled
                    >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Joined
                    </Button>
                ) : (
                    <Button
                        onClick={handleJoin}
                        disabled={isJoining}
                        className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-md hover:shadow-lg transition-all"
                    >
                        {isJoining ? (
                            <>
                                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Joining...
                            </>
                        ) : (
                            <>
                                <Users className="w-4 h-4 mr-2" />
                                Join Community
                            </>
                        )}
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}