'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface Location {
    latitude: number
    longitude: number
}

interface LocationContextType {
    location: Location | null
    error: string | null
    requestLocation: () => void
}

const LocationContext = createContext<LocationContextType>({
    location: null,
    error: null,
    requestLocation: () => { },
})

export function LocationProvider({ children }: { children: React.ReactNode }) {
    const [location, setLocation] = useState<Location | null>(null)
    const [error, setError] = useState<string | null>(null)

    const requestLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by this browser.')
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                })
                setError(null)

                // Update user location in database
                updateUserLocation(position.coords.latitude, position.coords.longitude)
            },
            (error) => {
                setError('Unable to retrieve your location.')
                console.error('Geolocation error:', error)
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000, // 5 minutes
            }
        )
    }

    const updateUserLocation = async (latitude: number, longitude: number) => {
        try {
            await fetch('/api/user/location', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ latitude, longitude }),
            })
        } catch (error) {
            console.error('Error updating user location:', error)
        }
    }

    useEffect(() => {
        requestLocation()
    }, [])

    return (
        <LocationContext.Provider value={{ location, error, requestLocation }}>
            {children}
        </LocationContext.Provider>
    )
}

export const useLocation = () => useContext(LocationContext)