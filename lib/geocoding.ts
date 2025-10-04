// Simple geocoding utility
// In a production app, you'd use a real geocoding service like Google Maps API

interface Coordinates {
    latitude: number
    longitude: number
}

// Mock geocoding function - in production, use a real geocoding service
export async function geocodeLocation(location: string): Promise<Coordinates> {
    // For demo purposes, return coordinates based on common location patterns
    const locationLower = location.toLowerCase()

    // Major cities mapping
    const cityCoordinates: Record<string, Coordinates> = {
        'new york': { latitude: 40.7128, longitude: -74.0060 },
        'brooklyn': { latitude: 40.6782, longitude: -73.9442 },
        'manhattan': { latitude: 40.7831, longitude: -73.9712 },
        'queens': { latitude: 40.7282, longitude: -73.7949 },
        'bronx': { latitude: 40.8448, longitude: -73.8648 },
        'los angeles': { latitude: 34.0522, longitude: -118.2437 },
        'chicago': { latitude: 41.8781, longitude: -87.6298 },
        'houston': { latitude: 29.7604, longitude: -95.3698 },
        'phoenix': { latitude: 33.4484, longitude: -112.0740 },
        'philadelphia': { latitude: 39.9526, longitude: -75.1652 },
        'san antonio': { latitude: 29.4241, longitude: -98.4936 },
        'san diego': { latitude: 32.7157, longitude: -117.1611 },
        'dallas': { latitude: 32.7767, longitude: -96.7970 },
        'san jose': { latitude: 37.3382, longitude: -121.8863 },
        'austin': { latitude: 30.2672, longitude: -97.7431 },
        'jacksonville': { latitude: 30.3322, longitude: -81.6557 },
        'san francisco': { latitude: 37.7749, longitude: -122.4194 },
        'columbus': { latitude: 39.9612, longitude: -82.9988 },
        'charlotte': { latitude: 35.2271, longitude: -80.8431 },
        'fort worth': { latitude: 32.7555, longitude: -97.3308 },
        'detroit': { latitude: 42.3314, longitude: -83.0458 },
        'el paso': { latitude: 31.7619, longitude: -106.4850 },
        'memphis': { latitude: 35.1495, longitude: -90.0490 },
        'seattle': { latitude: 47.6062, longitude: -122.3321 },
        'denver': { latitude: 39.7392, longitude: -104.9903 },
        'washington': { latitude: 38.9072, longitude: -77.0369 },
        'boston': { latitude: 42.3601, longitude: -71.0589 },
        'nashville': { latitude: 36.1627, longitude: -86.7816 },
        'baltimore': { latitude: 39.2904, longitude: -76.6122 },
        'oklahoma city': { latitude: 35.4676, longitude: -97.5164 },
        'portland': { latitude: 45.5152, longitude: -122.6784 },
        'las vegas': { latitude: 36.1699, longitude: -115.1398 },
        'milwaukee': { latitude: 43.0389, longitude: -87.9065 },
        'albuquerque': { latitude: 35.0844, longitude: -106.6504 },
        'tucson': { latitude: 32.2226, longitude: -110.9747 },
        'fresno': { latitude: 36.7378, longitude: -119.7871 },
        'sacramento': { latitude: 38.5816, longitude: -121.4944 },
        'mesa': { latitude: 33.4152, longitude: -111.8315 },
        'kansas city': { latitude: 39.0997, longitude: -94.5786 },
        'atlanta': { latitude: 33.7490, longitude: -84.3880 },
        'long beach': { latitude: 33.7701, longitude: -118.1937 },
        'colorado springs': { latitude: 38.8339, longitude: -104.8214 },
        'raleigh': { latitude: 35.7796, longitude: -78.6382 },
        'miami': { latitude: 25.7617, longitude: -80.1918 },
        'virginia beach': { latitude: 36.8529, longitude: -75.9780 },
        'omaha': { latitude: 41.2565, longitude: -95.9345 },
        'oakland': { latitude: 37.8044, longitude: -122.2711 },
        'minneapolis': { latitude: 44.9778, longitude: -93.2650 },
        'tulsa': { latitude: 36.1540, longitude: -95.9928 },
        'arlington': { latitude: 32.7357, longitude: -97.1081 },
        'tampa': { latitude: 27.9506, longitude: -82.4572 }
    }

    // Check for exact city matches
    for (const [city, coords] of Object.entries(cityCoordinates)) {
        if (locationLower.includes(city)) {
            return coords
        }
    }

    // Check for neighborhood patterns
    if (locationLower.includes('downtown')) {
        if (locationLower.includes('brooklyn')) {
            return { latitude: 40.6892, longitude: -73.9442 }
        }
        if (locationLower.includes('manhattan')) {
            return { latitude: 40.7589, longitude: -73.9851 }
        }
        // Default downtown coordinates (NYC)
        return { latitude: 40.7128, longitude: -74.0060 }
    }

    // Default to NYC coordinates if no match found
    return { latitude: 40.7128, longitude: -74.0060 }
}

export function validateLocation(location: string): boolean {
    // Basic validation - ensure location is not empty and has reasonable length
    return location.trim().length >= 2 && location.trim().length <= 100
}