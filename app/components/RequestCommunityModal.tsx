'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    MapPin,
    X,
    Send,
    AlertCircle,
    CheckCircle
} from 'lucide-react'

interface RequestCommunityModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

export function RequestCommunityModal({ isOpen, onClose, onSuccess }: RequestCommunityModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        radius: '5.0'
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name.trim() || !formData.description.trim()) return

        setIsSubmitting(true)
        setMessage({ type: '', text: '' })

        try {
            const response = await fetch('/api/communities/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (response.ok) {
                setMessage({ type: 'success', text: 'Community request submitted for approval!' })
                setTimeout(() => {
                    onClose()
                    onSuccess?.()
                    setFormData({
                        name: '',
                        description: '',
                        location: '',
                        radius: '5.0'
                    })
                    setMessage({ type: '', text: '' })
                }, 2000)
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to submit request' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred' })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md border-0 shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span>Request New Community</span>
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>

                <CardContent>
                    {message.text && (
                        <div className={`flex items-center space-x-2 p-3 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                            }`}>
                            {message.type === 'success' ? (
                                <CheckCircle className="h-4 w-4" />
                            ) : (
                                <AlertCircle className="h-4 w-4" />
                            )}
                            <span className="text-sm">{message.text}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Community Name</label>
                            <Input
                                placeholder="e.g., Downtown Brooklyn"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Description</label>
                            <Textarea
                                placeholder="Describe your community and what makes it special..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Location</label>
                            <Input
                                placeholder="e.g., Downtown Brooklyn, NY or Manhattan, New York"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Enter your neighborhood, city, or area name
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Radius (km)</label>
                            <Input
                                type="number"
                                step="0.1"
                                min="0.5"
                                max="50"
                                value={formData.radius}
                                onChange={(e) => setFormData({ ...formData, radius: e.target.value })}
                                required
                            />
                        </div>

                        <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-blue-800">
                                Your request will be reviewed by our team. You'll be notified once it's approved and the community is live.
                            </p>
                        </div>

                        <div className="flex space-x-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-gradient-to-r from-primary to-purple-600 text-white"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Submit Request
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}