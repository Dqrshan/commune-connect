import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { latitude, longitude } = await request.json()

    if (!latitude || !longitude) {
      return NextResponse.json({ error: 'Location required' }, { status: 400 })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate distance using Haversine formula (simplified for demo)
    const communities = await prisma.community.findMany({
      where: { isActive: true },
      include: {
        members: {
          where: { userId: user.id }
        },
        _count: {
          select: { members: true }
        }
      }
    })

    const nearbyCommunities = communities
      .map(community => {
        const distance = calculateDistance(
          latitude,
          longitude,
          community.latitude,
          community.longitude
        )
        
        return {
          id: community.id,
          name: community.name,
          description: community.description,
          memberCount: community._count.members,
          distance,
          isJoined: community.members.length > 0
        }
      })
      .filter(community => community.distance <= community.radius || 10) // Default 10km radius
      .sort((a, b) => a.distance - b.distance)

    return NextResponse.json({ communities: nearbyCommunities })
  } catch (error) {
    console.error('Error fetching nearby communities:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}