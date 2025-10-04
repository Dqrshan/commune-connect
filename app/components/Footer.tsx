import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
    MapPin,
    Twitter,
    Github,
    Linkedin,
    Mail,
    Heart
} from 'lucide-react'

export function Footer() {
    const footerLinks = {
        product: [
            { name: 'Features', href: '/features' },
            { name: 'Pricing', href: '/pricing' },
            { name: 'API', href: '/api-docs' },
            { name: 'Integrations', href: '/integrations' },
        ],
        company: [
            { name: 'About', href: '/about' },
            { name: 'Blog', href: '/blog' },
            { name: 'Careers', href: '/careers' },
            { name: 'Press', href: '/press' },
        ],
        resources: [
            { name: 'Documentation', href: '/docs' },
            { name: 'Help Center', href: '/help' },
            { name: 'Community', href: '/community' },
            { name: 'Status', href: '/status' },
        ],
        legal: [
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Terms of Service', href: '/terms' },
            { name: 'Cookie Policy', href: '/cookies' },
            { name: 'GDPR', href: '/gdpr' },
        ],
    }

    const socialLinks = [
        { name: 'Twitter', href: '#', icon: Twitter },
        { name: 'GitHub', href: '#', icon: Github },
        { name: 'LinkedIn', href: '#', icon: Linkedin },
        { name: 'Email', href: 'mailto:hello@communeconnect.com', icon: Mail },
    ]

    return (
        <footer className="bg-muted/30 border-t">
            <div className="container mx-auto px-4 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
                    {/* Brand Column */}
                    <div className="col-span-2">
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                <MapPin className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                CommuneConnect
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
                            Building stronger communities through real-time connections,
                            AI-powered insights, and location-based discovery.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => {
                                const Icon = social.icon
                                return (
                                    <Button
                                        key={social.name}
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                        asChild
                                    >
                                        <Link href={social.href}>
                                            <Icon className="h-4 w-4" />
                                            <span className="sr-only">{social.name}</span>
                                        </Link>
                                    </Button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="font-semibold text-sm mb-4">Product</h3>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="font-semibold text-sm mb-4">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h3 className="font-semibold text-sm mb-4">Resources</h3>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="font-semibold text-sm mb-4">Legal</h3>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <Separator className="my-8" />

                {/* Bottom Footer */}
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>© 2024 CommuneConnect. All rights reserved.</span>
                    </div>

                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <span>Made with</span>
                        <Heart className="h-4 w-4 text-red-500 fill-current" />
                        <span>for stronger communities</span>
                    </div>
                </div>

                {/* Newsletter Signup */}
                <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-lg border">
                    <div className="text-center max-w-md mx-auto">
                        <h3 className="font-semibold mb-2">Stay Updated</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Get the latest updates on new features and community insights.
                        </p>
                        <div className="flex space-x-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-3 py-2 text-sm border border-input rounded-md bg-background"
                            />
                            <Button size="sm">Subscribe</Button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}