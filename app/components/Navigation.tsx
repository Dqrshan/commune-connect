'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { NotificationSystem } from './NotificationSystem'
import {
    MapPin,
    Users,
    MessageSquare,
    Settings,
    LogOut,
    Crown,
    Menu,
    X,
    Bell
} from 'lucide-react'

export function Navigation() {
    const { data: session } = useSession()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

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
                return <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">Personal</Badge>
            case 'BUSINESS':
                return <Badge variant="default" className="ml-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    Business
                </Badge>
            default:
                return null
        }
    }

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <MapPin className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            CommuneConnect
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/communities"
                            className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Users className="h-4 w-4" />
                            <span>Communities</span>
                        </Link>
                        {session?.user?.role === 'ADMIN' && (
                            <Link
                                href="/admin"
                                className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Settings className="h-4 w-4" />
                                <span>Admin</span>
                            </Link>
                        )}
                    </div>

                    {/* User Menu */}
                    {session ? (
                        <div className="flex items-center space-x-4">
                            {/* Notifications */}
                            <NotificationSystem />

                            {/* User Avatar Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="flex items-center space-x-3 rounded-lg p-2 hover:bg-accent transition-colors"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                                        <AvatarFallback className="bg-primary text-primary-foreground">
                                            {getInitials(session.user.name || 'U')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="hidden md:block text-left">
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium">{session.user.name}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{session.user.email}</span>
                                    </div>
                                </button>

                                {/* Dropdown Menu */}
                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-64 rounded-lg border bg-popover p-1 shadow-lg">
                                        <div className="px-3 py-2 border-b">
                                            <div className="flex items-center space-x-2">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                                        {getInitials(session.user.name || 'U')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="flex items-center">
                                                        <span className="font-medium">{session.user.name}</span>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">{session.user.email}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="py-1">
                                            <Link
                                                href="/profile"
                                                className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <Settings className="h-4 w-4" />
                                                <span>Profile Settings</span>
                                            </Link>
                                            <Link
                                                href="/subscription"
                                                className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <Crown className="h-4 w-4" />
                                                <span>Subscription</span>
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setIsMenuOpen(false)
                                                    signOut()
                                                }}
                                                className="flex w-full items-center space-x-2 rounded-md px-3 py-2 text-sm hover:bg-accent text-red-600"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Mobile menu button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" asChild>
                                <Link href="/auth/signin">Sign In</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/auth/signup">Get Started</Link>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Mobile Navigation Menu */}
                {isMenuOpen && session && (
                    <div className="md:hidden border-t py-4">
                        <div className="space-y-2">
                            <Link
                                href="/communities"
                                className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Users className="h-4 w-4" />
                                <span>Communities</span>
                            </Link>
                            {session.user.role === 'ADMIN' && (
                                <Link
                                    href="/admin"
                                    className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Settings className="h-4 w-4" />
                                    <span>Admin</span>
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}