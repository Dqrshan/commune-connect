'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Navigation } from '../components/Navigation'
import { RequestCommunityModal } from '../components/RequestCommunityModal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
    MapPin,
    Users,
    MessageSquare,
    Plus,
    Hash,
    Clock,
    Search,
    Filter,
    Grid,
    List,
    ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

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

export default function CommunitiesPage() {
    const { data: session } = useSession()
    const [communities, setCommunities] = useState<Community[]>([])
    const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([])
    const [loading, setLoading] = useState(true)
    const [showRequestModal, setShowRequestModal] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    useEffect(() => {
        fetchCommunities()
    }, [])

    useEffect(() => {
        // Filter communities based on search term
        const filtered = communities.filter(community =>
            community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            community.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredCommunities(filtered)
    }, [communities, searchTerm])

    const fetchCommunities = async () => {
        try {
            const response = await fetch('/api/communities')
            if (response.ok) {
                const data = await response.json()
                setCommunities(data.communities || [])
            }
        } catch (error) {
            console.error('Error fetching communities:', error)
        } finally {
            setLoading(false)
        }
    }

    const CommunityCard = ({ community }: { community: Community }) => (
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Hash className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">{community.name}</CardTitle>
                            <Badge variant="outline" className="text-xs mt-1">
                                {community.isActive ? 'Active' : 'Pending'}
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-3">
                    {community.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
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
                        <span>{community.radius}km</span>
                    </div>
                </div>

                <div className="flex items-center space-x-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>Created {formatDistanceToNow(new Date(community.createdAt), { addSuffix: true })}</span>
                </div>

                {community.isActive && (
                    <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        <Link href={`/communities/${community.id}`}>
                            Join Community
                        </Link>
                    </Button>
                )}
            </CardContent>
        </Card>
    )

    const CommunityListItem = ({ community }: { community: Community }) => (
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                            <Hash className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-lg font-semibold">{community.name}</h3>
                                <Badge variant="outline" className="text-xs">
                                    {community.isActive ? 'Active' : 'Pending'}
                                </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{community.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                                <div className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{formatDistanceToNow(new Date(community.createdAt), { addSuffix: true })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {community.isActive && (
                        <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                            <Link href={`/communities/${community.id}`}>
                                Join Community
                            </Link>
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <Navigation />

            <div className="w-full px-4 py-6">
                <div className="max-w-7xl mx-auto space-y-6">
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
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Communities
                                </h1>
                                <p className="text-gray-600">Discover and join local communities near you</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            {session && (
                                <Button
                                    onClick={() => setShowRequestModal(true)}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Request Community
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Search communities..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setViewMode('grid')}
                                    >
                                        <Grid className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === 'list' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setViewMode('list')}
                                    >
                                        <List className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Communities */}
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p>Loading communities...</p>
                        </div>
                    ) : filteredCommunities.length > 0 ? (
                        <div className={viewMode === 'grid'
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            : "space-y-4"
                        }>
                            {filteredCommunities.map((community) => (
                                viewMode === 'grid' ? (
                                    <CommunityCard key={community.id} community={community} />
                                ) : (
                                    <CommunityListItem key={community.id} community={community} />
                                )
                            ))}
                        </div>
                    ) : (
                        <Card className="border-0 shadow-lg">
                            <CardContent className="text-center py-12">
                                {searchTerm ? (
                                    <>
                                        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold mb-2">No communities found</h3>
                                        <p className="text-gray-600 mb-6">
                                            No communities match your search for "{searchTerm}". Try a different search term.
                                        </p>
                                        <Button variant="outline" onClick={() => setSearchTerm('')}>
                                            Clear Search
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold mb-2">No Communities Yet</h3>
                                        <p className="text-gray-600 mb-6">
                                            Be the first to create a community in your area!
                                        </p>
                                        {session && (
                                            <Button
                                                onClick={() => setShowRequestModal(true)}
                                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Request New Community
                                            </Button>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Stats */}
                    {!loading && filteredCommunities.length > 0 && (
                        <Card className="border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-blue-600">{filteredCommunities.length}</div>
                                        <div className="text-sm text-gray-600">Active Communities</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-green-600">
                                            {filteredCommunities.reduce((sum, c) => sum + c._count.members, 0)}
                                        </div>
                                        <div className="text-sm text-gray-600">Total Members</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-purple-600">
                                            {filteredCommunities.reduce((sum, c) => sum + c._count.messages, 0)}
                                        </div>
                                        <div className="text-sm text-gray-600">Total Messages</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Request Community Modal */}
            <RequestCommunityModal
                isOpen={showRequestModal}
                onClose={() => setShowRequestModal(false)}
                onSuccess={() => {
                    fetchCommunities()
                    setShowRequestModal(false)
                }}
            />
        </div>
    )
}