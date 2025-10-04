'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Navigation } from '../components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import {
    ArrowLeft,
    User,
    Bell,
    Shield,
    MapPin,
    Camera,
    Save,
    Mail,
    Phone,
    Globe,
    Calendar,
    Settings,
    Crown,
    Eye,
    EyeOff,
    Trash2,
    AlertTriangle
} from 'lucide-react'
import Link from 'next/link'

interface UserProfile {
    id: string
    name: string
    email: string
    image?: string
    bio?: string
    location?: string
    phone?: string
    website?: string
    role: string
    subscriptionTier: string
    createdAt: string
    preferences: {
        emailNotifications: boolean
        pushNotifications: boolean
        communityUpdates: boolean
        marketingEmails: boolean
        locationSharing: boolean
        profileVisibility: 'public' | 'private' | 'friends'
    }
}

export default function ProfilePage() {
    const { data: session } = useSession()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState('profile')

    useEffect(() => {
        if (session?.user) {
            fetchProfile()
        }
    }, [session])

    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/profile')
            if (response.ok) {
                const data = await response.json()
                setProfile(data.profile)
            }
        } catch (error) {
            console.error('Error fetching profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const updateProfile = async (updates: Partial<UserProfile>) => {
        setSaving(true)
        try {
            const response = await fetch('/api/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            })

            if (response.ok) {
                const data = await response.json()
                setProfile(data.profile)
            }
        } catch (error) {
            console.error('Error updating profile:', error)
        } finally {
            setSaving(false)
        }
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
    }

    const getSubscriptionBadge = (tier: string) => {
        switch (tier) {
            case 'PERSONAL':
                return <Badge className="bg-blue-100 text-blue-800">Personal</Badge>
            case 'BUSINESS':
                return <Badge className="bg-purple-100 text-purple-800"><Crown className="w-3 h-3 mr-1" />Business</Badge>
            default:
                return <Badge variant="outline">Free</Badge>
        }
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <Navigation />
                <div className="flex items-center justify-center min-h-[80vh]">
                    <Card className="max-w-md w-full mx-4 border-0 shadow-xl">
                        <CardHeader className="text-center">
                            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <CardTitle>Sign In Required</CardTitle>
                            <p className="text-gray-600">Please sign in to access your profile settings.</p>
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <Navigation />
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p>Loading profile...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <Navigation />

            <div className="w-full px-4 py-6">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Dashboard
                                </Link>
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                                <p className="text-gray-600">Manage your account and preferences</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/subscription">
                                    <Crown className="w-4 h-4 mr-2" />
                                    Subscription
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Profile Overview Card */}
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                                <div className="relative">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src={profile?.image} />
                                        <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                            {getInitials(profile?.name || 'U')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full p-2">
                                        <Camera className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h2 className="text-2xl font-bold">{profile?.name}</h2>
                                        {getSubscriptionBadge(profile?.subscriptionTier || 'FREE')}
                                    </div>
                                    <p className="text-gray-600 mb-2">{profile?.email}</p>
                                    <p className="text-sm text-gray-500">
                                        Member since {new Date(profile?.createdAt || '').toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm">
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Public Profile
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Settings Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="profile">Profile</TabsTrigger>
                            <TabsTrigger value="notifications">Notifications</TabsTrigger>
                            <TabsTrigger value="privacy">Privacy</TabsTrigger>
                            <TabsTrigger value="account">Account</TabsTrigger>
                        </TabsList>

                        {/* Profile Tab */}
                        <TabsContent value="profile">
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle>Profile Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Full Name</label>
                                            <Input
                                                value={profile?.name || ''}
                                                onChange={(e) => setProfile(prev => prev ? { ...prev, name: e.target.value } : null)}
                                                placeholder="Enter your full name"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Email</label>
                                            <Input
                                                value={profile?.email || ''}
                                                disabled
                                                className="bg-gray-50"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Phone</label>
                                            <Input
                                                value={profile?.phone || ''}
                                                onChange={(e) => setProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                                                placeholder="Enter your phone number"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Website</label>
                                            <Input
                                                value={profile?.website || ''}
                                                onChange={(e) => setProfile(prev => prev ? { ...prev, website: e.target.value } : null)}
                                                placeholder="https://yourwebsite.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Bio</label>
                                        <Textarea
                                            value={profile?.bio || ''}
                                            onChange={(e) => setProfile(prev => prev ? { ...prev, bio: e.target.value } : null)}
                                            placeholder="Tell us about yourself..."
                                            rows={4}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Location</label>
                                        <Input
                                            value={profile?.location || ''}
                                            onChange={(e) => setProfile(prev => prev ? { ...prev, location: e.target.value } : null)}
                                            placeholder="City, State, Country"
                                        />
                                    </div>

                                    <Button onClick={() => updateProfile(profile || {})} disabled={saving}>
                                        <Save className="w-4 h-4 mr-2" />
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Notifications Tab */}
                        <TabsContent value="notifications">
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle>Notification Preferences</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium">Email Notifications</h3>
                                                <p className="text-sm text-gray-600">Receive notifications via email</p>
                                            </div>
                                            <Switch
                                                checked={profile?.preferences?.emailNotifications || false}
                                                onCheckedChange={(checked) =>
                                                    setProfile(prev => prev ? {
                                                        ...prev,
                                                        preferences: { ...prev.preferences, emailNotifications: checked }
                                                    } : null)
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium">Push Notifications</h3>
                                                <p className="text-sm text-gray-600">Receive push notifications in your browser</p>
                                            </div>
                                            <Switch
                                                checked={profile?.preferences?.pushNotifications || false}
                                                onCheckedChange={(checked) =>
                                                    setProfile(prev => prev ? {
                                                        ...prev,
                                                        preferences: { ...prev.preferences, pushNotifications: checked }
                                                    } : null)
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium">Community Updates</h3>
                                                <p className="text-sm text-gray-600">Get notified about community activity</p>
                                            </div>
                                            <Switch
                                                checked={profile?.preferences?.communityUpdates || false}
                                                onCheckedChange={(checked) =>
                                                    setProfile(prev => prev ? {
                                                        ...prev,
                                                        preferences: { ...prev.preferences, communityUpdates: checked }
                                                    } : null)
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium">Marketing Emails</h3>
                                                <p className="text-sm text-gray-600">Receive updates about new features and promotions</p>
                                            </div>
                                            <Switch
                                                checked={profile?.preferences?.marketingEmails || false}
                                                onCheckedChange={(checked) =>
                                                    setProfile(prev => prev ? {
                                                        ...prev,
                                                        preferences: { ...prev.preferences, marketingEmails: checked }
                                                    } : null)
                                                }
                                            />
                                        </div>
                                    </div>

                                    <Button onClick={() => updateProfile(profile || {})} disabled={saving}>
                                        <Save className="w-4 h-4 mr-2" />
                                        {saving ? 'Saving...' : 'Save Preferences'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Privacy Tab */}
                        <TabsContent value="privacy">
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle>Privacy Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium">Location Sharing</h3>
                                                <p className="text-sm text-gray-600">Allow communities to see your approximate location</p>
                                            </div>
                                            <Switch
                                                checked={profile?.preferences?.locationSharing || false}
                                                onCheckedChange={(checked) =>
                                                    setProfile(prev => prev ? {
                                                        ...prev,
                                                        preferences: { ...prev.preferences, locationSharing: checked }
                                                    } : null)
                                                }
                                            />
                                        </div>

                                        <div>
                                            <h3 className="font-medium mb-2">Profile Visibility</h3>
                                            <p className="text-sm text-gray-600 mb-4">Control who can see your profile information</p>
                                            <div className="space-y-2">
                                                {[
                                                    { value: 'public', label: 'Public', desc: 'Anyone can see your profile' },
                                                    { value: 'private', label: 'Private', desc: 'Only you can see your profile' },
                                                    { value: 'friends', label: 'Community Members', desc: 'Only community members can see your profile' }
                                                ].map((option) => (
                                                    <div key={option.value} className="flex items-center space-x-3">
                                                        <input
                                                            type="radio"
                                                            id={option.value}
                                                            name="visibility"
                                                            value={option.value}
                                                            checked={profile?.preferences?.profileVisibility === option.value}
                                                            onChange={(e) =>
                                                                setProfile(prev => prev ? {
                                                                    ...prev,
                                                                    preferences: { ...prev.preferences, profileVisibility: e.target.value as any }
                                                                } : null)
                                                            }
                                                            className="w-4 h-4 text-blue-600"
                                                        />
                                                        <label htmlFor={option.value} className="flex-1">
                                                            <div className="font-medium">{option.label}</div>
                                                            <div className="text-sm text-gray-600">{option.desc}</div>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <Button onClick={() => updateProfile(profile || {})} disabled={saving}>
                                        <Save className="w-4 h-4 mr-2" />
                                        {saving ? 'Saving...' : 'Save Privacy Settings'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Account Tab */}
                        <TabsContent value="account">
                            <div className="space-y-6">
                                <Card className="border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle>Account Security</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium">Change Password</h3>
                                                <p className="text-sm text-gray-600">Update your account password</p>
                                            </div>
                                            <Button variant="outline">
                                                Change Password
                                            </Button>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium">Two-Factor Authentication</h3>
                                                <p className="text-sm text-gray-600">Add an extra layer of security</p>
                                            </div>
                                            <Button variant="outline">
                                                Enable 2FA
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-lg border-red-200">
                                    <CardHeader>
                                        <CardTitle className="text-red-600 flex items-center">
                                            <AlertTriangle className="w-5 h-5 mr-2" />
                                            Danger Zone
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium text-red-600">Delete Account</h3>
                                                <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                                            </div>
                                            <Button variant="destructive">
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete Account
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}