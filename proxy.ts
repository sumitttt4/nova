import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// RBAC Configuration
const ROLE_PERMISSIONS = {
    'admin': ['*'], // Full access
    'manager': ['read', 'write', 'approve', 'reject'], // Can approve/reject but not manage admins
    'viewer': ['read'] // Read only
}

const PROTECTED_ROUTES = [
    '/dashboard',
    '/merchants',
    '/riders',
    '/finance',
    '/api'
]

// Rate Limiting Store (In-memory for demo, use Redis in prod)
const rateLimit = new Map()

export async function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname

    // 1. Basic Security Headers
    const response = NextResponse.next()
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

    // Only apply logic to protected routes
    if (!PROTECTED_ROUTES.some(p => path.startsWith(p))) {
        return response
    }

    // 2. Authentication Check
    const token = request.cookies.get('admin_token')?.value

    // Allow login page access without token
    // TEMPORARILY DISABLED FOR DEV: Uncomment to enable strict auth
    /* 
    if (!token && !path.startsWith('/auth')) {
        // Redirect to login if accessing protected page
        if (!path.startsWith('/api')) {
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    */

    // 3. Rate Limiting for API routes
    if (path.startsWith('/api')) {
        const ip = request.ip || '127.0.0.1'
        const now = Date.now()
        const windowStart = now - 60000 // 1 minute window

        const requestLog = rateLimit.get(ip) || []
        const requestsInWindow = requestLog.filter((time: number) => time > windowStart)

        if (requestsInWindow.length > 100) { // 100 reqs/min
            return NextResponse.json({ message: 'Too Many Requests' }, { status: 429 })
        }

        rateLimit.set(ip, [...requestsInWindow, now])
    }

    // 4. Verify Token & Role (Mock Logic)
    // TEMPORARILY DISABLED FOR DEV: Uncomment to enable strict auth
    /*
    try {
        if (token) {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret-key')
            const { payload } = await jwtVerify(token, secret)
            const role = payload.role as string

            // Basic RBAC Check for Sensitive Actions
            if (path.includes('/approve') || path.includes('/reject')) {
                if (role === 'viewer') {
                    return NextResponse.json({ message: 'Forbidden: Viewers cannot perform actions' }, { status: 403 })
                }
            }
        }
    } catch (error) {
        // Invalid token
        if (!path.startsWith('/api')) {
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }
        return NextResponse.json({ message: 'Invalid Token' }, { status: 401 })
    }
    */

    return response
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/merchants/:path*',
        '/riders/:path*',
        '/finance/:path*',
        '/api/:path*',
    ],
}
