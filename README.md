# Dynamic Community Platform

A live, self-organizing network of local communities with real-time chat, AI-powered message analysis, and admin management.

## Features

### 🏘️ Community Management
- **Request New Communities**: Users can request new communities with location-based setup
- **Admin Approval System**: Admins can approve/reject community requests through a dedicated dashboard
- **Discord-Style Chat**: Real-time messaging with member sidebar and chronological message display

### 🤖 AI Integration (Gemini AI)
- **Message Analysis**: Every message is analyzed for tags, sentiment, and priority
- **Smart Notifications**: Urgent messages trigger automatic notifications to community members
- **Community Summaries**: AI-generated summaries of community activity

### 👥 User & Admin Features
- **Role-Based Access**: Users, Moderators, and Admins with different permissions
- **Admin Dashboard**: Comprehensive management interface for communities and users
- **Real-time Notifications**: Database-driven notification system

### 💳 Subscription Management
- **DodoPayments Integration**: Dynamic subscription management with test-mode support
- **Tiered Features**: Personal and Business subscription tiers

## Quick Start

1. **Setup Environment Variables**
   ```bash
   cp .env.example .env
   # Fill in your database URL, API keys, and secrets
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Key Components

### Discord-Style Community Chat (`/communities/[id]`)
- Real-time messaging with member sidebar
- AI-powered message tagging and analysis
- Role-based member display with badges
- Automatic scrolling and message grouping

### Admin Dashboard (`/admin`)
- Community request approval/rejection
- User role management
- Platform statistics and analytics
- Real-time data updates

### Request Community System
- Location-based community creation
- Admin approval workflow
- Automatic notifications for status updates

## API Routes

### Communities
- `GET /api/communities` - List all active communities
- `POST /api/communities/request` - Request new community
- `GET /api/communities/[id]` - Get community details
- `POST /api/communities/[id]/join` - Join community
- `GET /api/communities/[id]/messages` - Get messages
- `POST /api/communities/[id]/messages` - Send message

### Admin
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/community-requests` - Pending requests
- `POST /api/admin/approve-community` - Approve/reject communities
- `GET /api/admin/users` - User management
- `POST /api/admin/update-user` - Update user roles

## AI Features

The platform uses Google Gemini AI for:

1. **Message Analysis**: Automatic tagging, categorization, and sentiment analysis
2. **Priority Detection**: Identifies urgent messages that need immediate attention
3. **Community Summaries**: Generates activity summaries for premium users
4. **Smart Routing**: Routes messages to relevant community members

## Database Schema

Key models:
- `User` - User accounts with roles and subscriptions
- `Community` - Location-based communities
- `Message` - Real-time chat messages with AI analysis
- `CommunityMember` - User-community relationships
- `Notification` - System notifications

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **AI**: Google Gemini AI
- **Payments**: DodoPayments API
- **UI**: Tailwind CSS + Radix UI components

## Development Notes

- All messages are logged and analyzed by AI in real-time
- Community requests require admin approval before going live
- The system supports role-based access control
- Real-time features use standard HTTP polling (can be upgraded to WebSockets)

## Environment Variables Required

```env
DATABASE_URL="mysql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GEMINI_API_KEY="..."
DODO_API_KEY="..."
```