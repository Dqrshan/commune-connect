'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Navigation } from '../components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Users,
    MapPin,
    CheckCircle,
    X,
    Crown,
    Shield,
    AlertTriangle,
    MessageSquare,
    TrendingUp,
    Calendar,
    Eye,
    UserCheck,
    UserX,
    Settings
} from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface CommunityRequest {
    id: string
    name: string
    description: string
    latitude: number
    longitude: number
    radius: number
    isActive: boolean
    createdAt: string
    members: {
        user: {
            id: string
            name: string
            email: string
            image: string
        }
        role: string
    }[]
}

interface UserData {
    id: string
    name: string
    email: string
    image: string
    role: string
    subscriptionTier: string
    createdAt: string
    _count: {
        communities: number
        posts: number
    }
}

interface AdminStats {
    totalUsers: number
    totalCommunities: number
    activeCommunities: number
    pendingRequests: number
    totalPosts: number
    recentActivity: number
}

export default function AdminDashboard() {
    const { data: session } = useSession()
    const [stats, setStats] = useState<AdminStats | null>(null)
    const [communityRequests, setCommunityRequests] = useState<CommunityRequest[]>([])
    const [users, setUsers] = useState<UserData[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (session?.user?.role === 'ADMIN') {
            fetchAdminData()
        }
    }, [session])

    const fetchAdminData = async () => {
        try {
            const [statsRes, requestsRes, usersRes] = await Promise.all([
                fetch('/api/admin/stats'),
                fetch('/api/admin/community-requests'),
                fetch('/api/admin/users')
            ])

            const [statsData, requestsData, usersData] = await Promise.all([
                statsRes.json(),
                requestsRes.json(),
                usersRes.json()
            ])

            setStats(statsData)
            setCommunityRequests(requestsData.requests || [])
            setUsers(usersData.users || [])
        } catch (error) {
            console.error('Error fetching admin data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleApproveCommunity = async (communityId: string) => {
        try {
            const response = await fetch('/api/admin/approve-community', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ communityId, action: 'approve' }),
            })

            if (response.ok) {
                fetchAdminData()
            }
        } catch (error) {
            console.error('Error approving community:', error)
        }
    }

    const handleRejectCommunity = async (communityId: string) => {
        try {
            const response = await fetch('/api/admin/approve-community', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ communityId, action: 'reject' }),
            })

            if (response.ok) {
                fetchAdminData()
            }
        } catch (error) {
            console.error('Error rejecting community:', error)
        }
    }

    const handleUpdateUserRole = async (userId: string, newRole: string) => {
        try {
            const response = await fetch('/api/admin/update-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role: newRole }),
            })

            if (response.ok) {
                fetchAdminData()
            }
        } catch (error) {
            console.error('Error updating user role:', error)
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
                return <Badge className="bg-red-100 text-red-800"><Crown className="w-3 h-3 mr-1" />Admin</Badge>
            case 'MODERATOR':
                return <Badge className="bg-blue-100 text-blue-800"><Shield className="w-3 h-3 mr-1" />Moderator</Badge>
            default:
                return <Badge variant="outline">User</Badge>
        }
    }

    const getSubscriptionBadge = (tier: string) => {
        switch (tier) {
            case 'BUSINESS':
                return <Badge className="bg-purple-100 text-purple-800">Business</Badge>
            case 'PERSONAL':
                return <Badge className="bg-blue-100 text-blue-800">Personal</Badge>
            default:
                return <Badge variant="outline">Free</Badge>
        }
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <Navigation />
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold mb-4">Please sign in to access admin dashboard</h1>
                    <Button asChild>
                        <Link href="/auth/signin">Sign In</Link>
                    </Button>
                </div>
            </div>
        )
    }

    if (session.user.role !== 'ADMIN') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <Navigation />
                <div className="container mx-auto px-4 py-16 text-center">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                    <p className="text-muted-foreground mb-4">You don't have permission to access the admin dashboard.</p>
                    <Button asChild>
                        <Link href="/">Go Home</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <Navigation />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                        <p className="text-muted-foreground">Manage communities, users, and platform settings</p>
                    </div>

                    {/* Stats Overview */}
                    {stats && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-4 text-center">
                                    <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                                    <div className="text-xs text-muted-foreground">Total Users</div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-4 text-center">
                                    <MapPin className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                    <div className="text-2xl font-bold">{stats.activeCommunities}</div>
                                    <div className="text-xs text-muted-foreground">Active Communities</div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-4 text-center">
                                    <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                                    <div className="text-2xl font-bold">{stats.pendingRequests}</div>
                                    <div className="text-xs text-muted-foreground">Pending Requests</div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-4 text-center">
                                    <MessageSquare className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                                    <div className="text-2xl font-bold">{stats.totalPosts}</div>
                                    <div className="text-xs text-muted-foreground">Total Posts</div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-4 text-center">
                                    <TrendingUp className="h-8 w-8 text-indigo-500 mx-auto mb-2" />
                                    <div className="text-2xl font-bold">{stats.recentActivity}</div>
                                    <div className="text-xs text-muted-foreground">Recent Activity</div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-4 text-center">
                                    <Calendar className="h-8 w-8 text-pink-500 mx-auto mb-2" />
                                    <div className="text-2xl font-bold">{stats.totalCommunities}</div>
                                    <div className="text-xs text-muted-foreground">All Communities</div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Main Content */}
                    <Tabs defaultValue="requests" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="requests">Community Requests</TabsTrigger>
                            <TabsTrigger value="users">User Management</TabsTrigger>
                            <TabsTrigger value="communities">Communities</TabsTrigger>
                        </TabsList>

                        {/* Community Requests */}
                        <TabsContent value="requests">
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle>Pending Community Requests</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {loading ? (
                                        <div className="text-center py-8">Loading...</div>
                                    ) : communityRequests.length > 0 ? (
                                        <div className="space-y-4">
                                            {communityRequests.filter(req => !req.isActive).map((request) => (
                                                <div key={request.id} className="border rounded-lg p-4">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div>
                                                            <h3 className="font-semibold text-lg">{request.name}</h3>
                                                            <p className="text-muted-foreground text-sm mb-2">{request.description}</p>
                                                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                                <span>📍 {request.latitude.toFixed(4)}, {request.longitude.toFixed(4)}</span>
                                                                <span>📏 {request.radius}km radius</span>
                                                                <span>⏰ {formatDistanceToNow(new Date(request.createdAt))} ago</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleApproveCommunity(request.id)}
                                                                className="bg-green-600 hover:bg-green-700"
                                                            >
                                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => handleRejectCommunity(request.id)}
                                                            >
                                                                <X className="w-4 h-4 mr-1" />
                                                                Reject
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {request.members.length > 0 && (
                                                        <div>
                                                            <p className="text-sm font-medium mb-2">Requested by:</p>
                                                            <div className="flex items-center space-x-2">
                                                                <Avatar className="h-6 w-6">
                                                                    <AvatarImage src={request.members[0].user.image} />
                                                                    <AvatarFallback className="text-xs">
                                                                        {getInitials(request.members[0].user.name)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <span className="text-sm">{request.members[0].user.name}</span>
                                                                <span className="text-xs text-muted-foreground">({request.members[0].user.email})</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            No pending community requests
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* User Management */}
                        <TabsContent value="users">
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle>User Management</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {loading ? (
                                        <div className="text-center py-8">Loading...</div>
                                    ) : (
                                        <div className="space-y-4">
                                            {users.map((user) => (
                                                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                    <div className="flex items-center space-x-4">
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarImage src={user.image} />
                                                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="flex items-center space-x-2">
                                                                <span className="font-medium">{user.name}</span>
                                                                {getRoleBadge(user.role)}
                                                                {getSubscriptionBadge(user.subscriptionTier)}
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                                            <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                                                                <span>{user._count.communities} communities</span>
                                                                <span>{user._count.posts} posts</span>
                                                                <span>Joined {formatDistanceToNow(new Date(user.createdAt))} ago</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex space-x-2">
                                                        {user.role !== 'ADMIN' && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleUpdateUserRole(user.id, 'ADMIN')}
                                                            >
                                                                <Crown className="w-4 h-4 mr-1" />
                                                                Make Admin
                                                            </Button>
                                                        )}
                                                        {user.role === 'USER' && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleUpdateUserRole(user.id, 'MODERATOR')}
                                                            >
                                                                <Shield className="w-4 h-4 mr-1" />
                                                                Make Moderator
                                                            </Button>
                                                        )}
                                                        <Button size="sm" variant="ghost">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Communities */}
                        <TabsContent value="communities">
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle>Active Communities</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {loading ? (
                                        <div className="text-center py-8">Loading...</div>
                                    ) : (
                                        <div className="space-y-4">
                                            {communityRequests.filter(req => req.isActive).map((community) => (
                                                <div key={community.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                    <div>
                                                        <h3 className="font-semibold">{community.name}</h3>
                                                        <p className="text-sm text-muted-foreground mb-2">{community.description}</p>
                                                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                            <span>{community.members.length} members</span>
                                                            <span>{community.radius}km radius</span>
                                                            <span>Created {formatDistanceToNow(new Date(community.createdAt))} ago</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex space-x-2">
                                                        <Button size="sm" variant="outline" asChild>
                                                            <Link href={`/communities/${community.id}`}>
                                                                <Eye className="w-4 h-4 mr-1" />
                                                                View
                                                            </Link>
                                                        </Button>
                                                        <Button size="sm" variant="ghost">
                                                            <Settings className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}