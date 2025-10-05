'use client'

import { useSession } from 'next-auth/react'
import { Navigation } from './components/Navigation'
import { LandingPage } from './components/LandingPage'
import { DashboardPage } from './components/DashboardPage'
import { Header } from './components/Header'

export default function HomePage() {
    const { data: session, status } = useSession()

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <Header />
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        )
    }

    // Show dashboard for authenticated users, landing page for others
    return session ? <DashboardPage /> : <LandingPage />
}
