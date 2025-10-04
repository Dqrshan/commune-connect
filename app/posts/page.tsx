'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Navigation } from '../components/Navigation'
import { PostCard } from '../components/PostCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Search,
    Filter,
    TrendingUp,
    Clock,
    MessageSquare,
    AlertTriangle,
    HelpCircle,
    Construction,
    Megaphone,
    Globe,
    Users,
    MapPin
} from 'lucide-react'
import Link from 'next/link'

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
        id: string
        name: string
    }
    _count: {
        comments: number
    }
}

export default function Posts() {
    const { data: session } = useSession()
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filter, setFilter] = useState<'all' | 'trending' | 'recent' | 'alerts'>('all')
    const [typeFilter, setTypeFilter] = useState<string>('all')

    useEffect(() => {
        if (session?.user) {
            fetchPosts()
        }
    }, [session, filter, typeFilter])

    const fetchPosts = async () => {
        try {
            const params = new URLSearchParams({
                filter,
                type: typeFilter,
                search: searchQuery
            })

            const response = await fetch(`/api/posts/feed?${params}`)
            const data = await response.json()
            setPosts(data.posts || [])
        } catch (error) {
            console.error('Error fetching posts:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = () => {
        fetchPosts()
    }

    const filteredPosts = posts.filter(post =>
        searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.community.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const postTypes = [
        { value: 'all', label: 'All Posts', icon: Globe, count: posts.length },
        { value: 'GENERAL', label: 'General', icon: MessageSquare, count: posts.filter(p => p.type === 'GENERAL').length },
        { value: 'QUESTION', label: 'Questions', icon: HelpCircle, count: posts.filter(p => p.type === 'QUESTION').length },
        { value: 'ALERT', label: 'Alerts', icon: AlertTriangle, count: posts.filter(p => p.type === 'ALERT').length },
        { value: 'ROADBLOCK', label: 'Roadblocks', icon: Construction, count: posts.filter(p => p.type === 'ROADBLOCK').length },
        { value: 'PROTEST', label: 'Protests', icon: Megaphone, count: posts.filter(p => p.type === 'PROTEST').length },
    ]

    if (!session) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <Navigation />
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold mb-4">Please sign in to view posts</h1>
                    <Button asChild>
                        <Link href="/auth/signin">Sign In</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <Navigation />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Community Posts</h1>
                            <p className="text-muted-foreground">Stay updated with the latest from your communities</p>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <Card className="mb-8 border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-4 mb-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search posts, communities, or content..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        className="pl-10"
                                    />
                                </div>
                                <Button onClick={handleSearch}>
                                    <Search className="w-4 h-4 mr-2" />
                                    Search
                                </Button>
                            </div>

                            {/* Filter Buttons */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {[
                                    { key: 'all', label: 'All', icon: Globe },
                                    { key: 'trending', label: 'Trending', icon: TrendingUp },
                                    { key: 'recent', label: 'Recent', icon: Clock },
                                    { key: 'alerts', label: 'Alerts', icon: AlertTriangle },
                                ].map((filterOption) => {
                                    const Icon = filterOption.icon
                                    return (
                                        <Button
                                            key={filterOption.key}
                                            variant={filter === filterOption.key ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setFilter(filterOption.key as any)}
                                        >
                                            <Icon className="w-4 h-4 mr-2" />
                                            {filterOption.label}
                                        </Button>
                                    )
                                })}
                            </div>

                            {/* Post Type Filters */}
                            <div className="flex flex-wrap gap-2">
                                {postTypes.map((type) => {
                                    const Icon = type.icon
                                    return (
                                        <Button
                                            key={type.value}
                                            variant={typeFilter === type.value ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setTypeFilter(type.value)}
                                            className="flex items-center space-x-2"
                                        >
                                            <Icon className="w-3 h-3" />
                                            <span>{type.label}</span>
                                            <Badge variant="secondary" className="ml-1 text-xs">
                                                {type.count}
                                            </Badge>
                                        </Button>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <Card className="border-0 shadow-lg sticky top-24">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <TrendingUp className="h-5 w-5 text-primary" />
                                        <span>Trending Topics</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {[
                                        { tag: 'traffic', count: 12 },
                                        { tag: 'construction', count: 8 },
                                        { tag: 'events', count: 6 },
                                        { tag: 'safety', count: 5 },
                                        { tag: 'local-business', count: 4 },
                                    ].map((topic) => (
                                        <div key={topic.tag} className="flex items-center justify-between p-2 rounded hover:bg-accent cursor-pointer">
                                            <span className="text-sm font-medium">#{topic.tag}</span>
                                            <Badge variant="secondary" className="text-xs">
                                                {topic.count}
                                            </Badge>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg mt-6">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Users className="h-5 w-5 text-primary" />
                                        <span>Active Communities</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {[
                                        { name: 'Manhattan Central', posts: 24 },
                                        { name: 'Brooklyn Heights', posts: 18 },
                                        { name: 'Queens Plaza', posts: 15 },
                                        { name: 'Financial District', posts: 12 },
                                    ].map((community) => (
                                        <Link
                                            key={community.name}
                                            href={`/communities/${community.name.toLowerCase().replace(' ', '-')}`}
                                            className="flex items-center justify-between p-2 rounded hover:bg-accent cursor-pointer"
                                        >
                                            <span className="text-sm font-medium">{community.name}</span>
                                            <Badge variant="outline" className="text-xs">
                                                {community.posts} posts
                                            </Badge>
                                        </Link>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Posts Feed */}
                        <div className="lg:col-span-3">
                            {loading ? (
                                <div className="space-y-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Card key={i} className="border-0 shadow-lg animate-pulse">
                                            <CardContent className="p-6">
                                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                                                <div className="h-20 bg-gray-200 rounded"></div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : filteredPosts.length > 0 ? (
                                <div className="space-y-6">
                                    {filteredPosts.map((post) => (
                                        <PostCard key={post.id} post={post} />
                                    ))}

                                    {/* Load More */}
                                    <Card className="border-0 shadow-lg">
                                        <CardContent className="text-center py-8">
                                            <Button variant="outline" className="border-2">
                                                <Clock className="w-4 h-4 mr-2" />
                                                Load More Posts
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            ) : (
                                <Card className="border-0 shadow-lg">
                                    <CardContent className="text-center py-12">
                                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">No posts found</h3>
                                        <p className="text-muted-foreground mb-6">
                                            {searchQuery ?
                                                `No posts match "${searchQuery}"` :
                                                'No posts available with the current filters'
                                            }
                                        </p>
                                        <Button asChild>
                                            <Link href="/communities">
                                                <Users className="w-4 h-4 mr-2" />
                                                Join Communities
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}