'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
    Send,
    Image,
    MapPin,
    AlertTriangle,
    HelpCircle,
    Construction,
    Megaphone,
    MessageSquare,
    X,
    Sparkles
} from 'lucide-react'

interface CreatePostProps {
    onPostCreated: () => void
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
    const { data: session } = useSession()
    const [isExpanded, setIsExpanded] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        type: 'GENERAL',
        communityId: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const postTypes = [
        { value: 'GENERAL', label: 'General', icon: MessageSquare, color: 'text-gray-600' },
        { value: 'QUESTION', label: 'Question', icon: HelpCircle, color: 'text-blue-600' },
        { value: 'ALERT', label: 'Alert', icon: AlertTriangle, color: 'text-red-600' },
        { value: 'ROADBLOCK', label: 'Roadblock', icon: Construction, color: 'text-orange-600' },
        { value: 'PROTEST', label: 'Protest', icon: Megaphone, color: 'text-purple-600' },
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.title.trim() || !formData.content.trim()) return

        setIsSubmitting(true)
        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                setFormData({ title: '', content: '', type: 'GENERAL', communityId: '' })
                setIsExpanded(false)
                onPostCreated()
            }
        } catch (error) {
            console.error('Error creating post:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
    }

    const selectedType = postTypes.find(type => type.value === formData.type)

    if (!isExpanded) {
        return (
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setIsExpanded(true)}>
                <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white">
                                {getInitials(session?.user?.name || 'U')}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 bg-muted rounded-full px-4 py-3 text-muted-foreground hover:bg-muted/80 transition-colors">
                            What's happening in your community?
                        </div>
                        <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" className="text-muted-foreground">
                                <Image className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="shadow-lg border-0">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white">
                                {getInitials(session?.user?.name || 'U')}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <span className="font-medium">{session?.user?.name}</span>
                            <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    AI Enhanced
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsExpanded(false)}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="What's the title of your post?"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="text-lg font-medium border-0 px-0 focus-visible:ring-0 placeholder:text-muted-foreground"
                        required
                    />

                    <Textarea
                        placeholder="Share what's on your mind..."
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={4}
                        className="border-0 px-0 focus-visible:ring-0 resize-none placeholder:text-muted-foreground"
                        required
                    />

                    {/* Post Type Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-muted-foreground">Post Type</label>
                        <div className="flex flex-wrap gap-2">
                            {postTypes.map((type) => {
                                const Icon = type.icon
                                const isSelected = formData.type === type.value
                                return (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: type.value })}
                                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all ${isSelected
                                                ? 'bg-primary text-primary-foreground border-primary shadow-md'
                                                : 'bg-background hover:bg-muted border-border'
                                            }`}
                                    >
                                        <Icon className={`w-4 h-4 ${isSelected ? 'text-primary-foreground' : type.color}`} />
                                        <span className="text-sm font-medium">{type.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" type="button" className="text-muted-foreground">
                                <Image className="w-4 h-4 mr-2" />
                                Photo
                            </Button>
                            <Button variant="ghost" size="sm" type="button" className="text-muted-foreground">
                                <MapPin className="w-4 h-4 mr-2" />
                                Location
                            </Button>
                        </div>

                        <div className="flex space-x-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsExpanded(false)}
                                className="text-muted-foreground"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
                                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-md"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Posting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Post
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}