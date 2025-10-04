'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { PostCard } from './PostCard'
import { CreatePost } from './CreatePost'
import { LoadingSpinner } from './LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    MessageSquare,
    TrendingUp,
    Clock,
    Filter,
    RefreshCw,
    Sparkles
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

export function PostFeed() {
    const { data: session } = useSession()
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/posts/feed')
            const data = await response.json()
            setPosts(data.posts || [])
        } catch (error) {
            console.error('Error fetching posts:', error)
        } finally {
            setLoading(false)
        }
    }

    const handlePostCreated = () => {
        fetchPosts()
    }

    const handleRefresh = async () => {
        setRefreshing(true)
        await fetchPosts()
        setRefreshing(false)
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <Card className="border-0 shadow-lg">
                    <CardContent className="p-8">
                        <LoadingSpinner />
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Create Post Card */}
            <CreatePost onPostCreated={handlePostCreated} />

            {/* Feed Header */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <CardTitle className="flex items-center space-x-2">
                                <MessageSquare className="h-5 w-5 text-primary" />
                                <span>Community Feed</span>
                            </CardTitle>
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                                <Sparkles className="w-3 h-3 mr-1" />
                                AI Enhanced
                            </Badge>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                <Filter className="w-4 h-4 mr-2" />
                                Filter
                            </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Posts */}
            {posts.length > 0 ? (
                <div className="space-y-6">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}

                    {/* Load More */}
                    <Card className="border-0 shadow-lg">
                        <CardContent className="text-center py-8">
                            <Button variant="outline" className="border-2">
                                <TrendingUp className="w-4 h-4 mr-2" />
                                Load More Posts
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <Card className="border-0 shadow-lg">
                    <CardContent className="text-center py-12">
                        <div className="max-w-md mx-auto">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                            <p className="text-muted-foreground mb-6">
                                Be the first to share something with your community! Start a conversation,
                                ask a question, or share an important update.
                            </p>
                            <Button className="bg-gradient-to-r from-primary to-purple-600 text-white">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Create Your First Post
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}