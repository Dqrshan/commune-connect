import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect admin routes
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'ADMIN'
        }
        
        // Protect API routes (except auth)
        if (req.nextUrl.pathname.startsWith('/api') && 
            !req.nextUrl.pathname.startsWith('/api/auth')) {
          return !!token
        }
        
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
    '/profile/:path*',
    '/subscription/:path*'
  ]
}