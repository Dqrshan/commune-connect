import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from './providers/AuthProvider'
import { LocationProvider } from './providers/LocationProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Community Network',
    description: 'Live, self-organizing network of local communities',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider>
                    <LocationProvider>
                        {children}
                    </LocationProvider>
                </AuthProvider>
            </body>
        </html>
    )
}