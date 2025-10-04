import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@communeconnect.com' },
    update: {},
    create: {
      email: 'admin@communeconnect.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      subscriptionTier: 'BUSINESS',
      latitude: 40.7128,
      longitude: -74.0060,
    },
  })

  // Create test users
  const users = []
  for (let i = 1; i <= 10; i++) {
    const password = await bcrypt.hash('password123', 12)
    const user = await prisma.user.upsert({
      where: { email: `user${i}@example.com` },
      update: {},
      create: {
        email: `user${i}@example.com`,
        name: `User ${i}`,
        password: password,
        role: 'USER',
        subscriptionTier: i <= 3 ? 'PERSONAL' : i <= 6 ? 'BUSINESS' : 'FREE',
        latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
        longitude: -74.0060 + (Math.random() - 0.5) * 0.1,
      },
    })
    users.push(user)
  }

  // Create communities
  const communities = [
    {
      name: 'Manhattan Central',
      description: 'Central Manhattan community for commuters, residents, and local businesses. Share updates about events, road conditions, and neighborhood news.',
      latitude: 40.7589,
      longitude: -73.9851,
      radius: 5.0,
      isActive: true,
    },
    {
      name: 'Brooklyn Heights',
      description: 'Historic Brooklyn Heights neighborhood community. Connect with neighbors, share local recommendations, and stay informed about community events.',
      latitude: 40.6962,
      longitude: -73.9961,
      radius: 3.0,
      isActive: true,
    },
    {
      name: 'Queens Plaza',
      description: 'Queens Plaza area community hub for residents and workers. Discuss local issues, share commute tips, and organize neighborhood activities.',
      latitude: 40.7505,
      longitude: -73.9934,
      radius: 4.0,
      isActive: true,
    },
    {
      name: 'Financial District',
      description: 'Lower Manhattan Financial District community. Perfect for professionals working in the area to share lunch spots, networking events, and local news.',
      latitude: 40.7074,
      longitude: -74.0113,
      radius: 2.5,
      isActive: true,
    },
    {
      name: 'Williamsburg',
      description: 'Trendy Williamsburg community for artists, young professionals, and families. Share local events, restaurant recommendations, and neighborhood updates.',
      latitude: 40.7081,
      longitude: -73.9571,
      radius: 3.5,
      isActive: true,
    },
    {
      name: 'Upper East Side',
      description: 'Upscale Upper East Side neighborhood community. Connect with neighbors, share family-friendly activities, and discuss local amenities.',
      latitude: 40.7736,
      longitude: -73.9566,
      radius: 4.0,
      isActive: true,
    },
  ]

  const createdCommunities = []
  for (const communityData of communities) {
    const community = await prisma.community.upsert({
      where: { name: communityData.name },
      update: {},
      create: communityData,
    })
    createdCommunities.push(community)
  }

  // Add users to communities
  for (const community of createdCommunities) {
    // Add admin as admin of all communities
    await prisma.communityMember.upsert({
      where: {
        userId_communityId: {
          userId: admin.id,
          communityId: community.id,
        },
      },
      update: {},
      create: {
        userId: admin.id,
        communityId: community.id,
        role: 'ADMIN',
      },
    })

    // Add random users to each community
    const shuffledUsers = users.sort(() => 0.5 - Math.random())
    const membersToAdd = shuffledUsers.slice(0, Math.floor(Math.random() * 6) + 3)

    for (const user of membersToAdd) {
      await prisma.communityMember.upsert({
        where: {
          userId_communityId: {
            userId: user.id,
            communityId: community.id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          communityId: community.id,
          role: 'MEMBER',
        },
      })
    }
  }

  // Create sample posts
  const postTypes = ['GENERAL', 'QUESTION', 'ALERT', 'ROADBLOCK', 'PROTEST']
  const priorities = ['LOW', 'NORMAL', 'HIGH', 'URGENT']
  
  const samplePosts = [
    {
      title: 'Welcome to Manhattan Central!',
      content: 'Hey everyone! Welcome to our community. Feel free to share local news, ask questions, and connect with your neighbors. Let\'s make our neighborhood even better together!',
      type: 'GENERAL',
      priority: 'NORMAL',
      tags: ['welcome', 'community', 'introduction'],
    },
    {
      title: 'Road Construction on 5th Avenue',
      content: 'Heads up! There\'s major construction on 5th Avenue between 42nd and 50th Street. Expect delays during rush hour. Alternative routes: 6th Ave or Park Ave.',
      type: 'ALERT',
      priority: 'HIGH',
      tags: ['traffic', 'construction', '5th-avenue', 'commute'],
    },
    {
      title: 'Best Coffee Shops in the Area?',
      content: 'New to the neighborhood and looking for good coffee recommendations. What are your favorite local spots? Bonus points for places with good WiFi for remote work!',
      type: 'QUESTION',
      priority: 'NORMAL',
      tags: ['coffee', 'recommendations', 'local-business', 'remote-work'],
    },
    {
      title: 'Community Cleanup Event - Saturday',
      content: 'Join us this Saturday at 9 AM for our monthly community cleanup! We\'ll be focusing on the park area. Bring gloves and water bottles. Coffee and bagels provided!',
      type: 'GENERAL',
      priority: 'NORMAL',
      tags: ['event', 'cleanup', 'volunteer', 'community-service'],
    },
    {
      title: 'Subway Delays on 6 Train',
      content: 'The 6 train is experiencing significant delays due to signal problems. Consider taking the 4/5 express or bus alternatives. Updates: mta.info',
      type: 'ALERT',
      priority: 'HIGH',
      tags: ['subway', 'delays', 'mta', 'commute', '6-train'],
    },
    {
      title: 'Lost Cat - Orange Tabby',
      content: 'Our orange tabby cat "Milo" went missing yesterday evening near Central Park. He\'s very friendly and has a blue collar. Please contact me if you see him!',
      type: 'ALERT',
      priority: 'URGENT',
      tags: ['lost-pet', 'cat', 'central-park', 'help'],
    },
    {
      title: 'Farmers Market This Weekend',
      content: 'Don\'t forget about the weekend farmers market at Union Square! Great selection of local produce, artisanal goods, and food trucks. Open Saturday & Sunday 8 AM - 6 PM.',
      type: 'GENERAL',
      priority: 'NORMAL',
      tags: ['farmers-market', 'union-square', 'local-food', 'weekend'],
    },
    {
      title: 'Noise Complaint - Construction Hours',
      content: 'Is anyone else bothered by the early morning construction noise? It starts at 6 AM which seems too early. Does anyone know the legal construction hours in our area?',
      type: 'QUESTION',
      priority: 'NORMAL',
      tags: ['noise', 'construction', 'legal', 'early-morning'],
    },
  ]

  for (const community of createdCommunities) {
    const communityMembers = await prisma.communityMember.findMany({
      where: { communityId: community.id },
      include: { user: true },
    })

    // Create 3-5 posts per community
    const postsToCreate = samplePosts.slice(0, Math.floor(Math.random() * 3) + 3)
    
    for (const postData of postsToCreate) {
      const randomMember = communityMembers[Math.floor(Math.random() * communityMembers.length)]
      
      await prisma.post.create({
        data: {
          title: postData.title,
          content: postData.content,
          type: postData.type as any,
          priority: postData.priority as any,
          aiTags: JSON.stringify(postData.tags),
          userId: randomMember.userId,
          communityId: community.id,
        },
      })
    }
  }

  // Create some businesses
  const businesses = [
    {
      name: 'Central Perk Coffee',
      description: 'Cozy neighborhood coffee shop with the best espresso in Manhattan. Free WiFi, comfortable seating, and fresh pastries daily.',
      website: 'https://centralperk.com',
      phone: '(555) 123-4567',
      email: 'hello@centralperk.com',
      isVerified: true,
    },
    {
      name: 'Brooklyn Bites Deli',
      description: 'Family-owned deli serving authentic New York sandwiches and salads. Fresh ingredients, quick service, and catering available.',
      website: 'https://brooklynbites.com',
      phone: '(555) 987-6543',
      email: 'info@brooklynbites.com',
      isVerified: true,
    },
    {
      name: 'Queens Fitness Studio',
      description: 'Modern fitness studio offering yoga, pilates, and strength training classes. New member specials available!',
      website: 'https://queensfitness.com',
      phone: '(555) 456-7890',
      email: 'contact@queensfitness.com',
      isVerified: false,
    },
  ]

  for (let i = 0; i < businesses.length; i++) {
    const businessOwner = users[i % users.length]
    const business = await prisma.business.create({
      data: {
        ...businesses[i],
        ownerId: businessOwner.id,
      },
    })

    // Partner with random communities
    const partneredCommunities = createdCommunities.slice(0, Math.floor(Math.random() * 3) + 1)
    for (const community of partneredCommunities) {
      await prisma.businessCommunity.create({
        data: {
          businessId: business.id,
          communityId: community.id,
        },
      })
    }
  }

  console.log('✅ Seed completed successfully!')
  console.log(`Created:`)
  console.log(`- 1 admin user`)
  console.log(`- ${users.length} regular users`)
  console.log(`- ${createdCommunities.length} communities`)
  console.log(`- ${businesses.length} businesses`)
  console.log(`- Multiple posts and community memberships`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })