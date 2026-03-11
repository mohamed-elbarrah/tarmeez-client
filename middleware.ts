import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('access_token')

  if (pathname.startsWith('/merchant') || pathname.startsWith('/superadmin')) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (pathname.includes('/account')) {
    if (!accessToken) {
      const parts = pathname.split('/')
      const storeSlug = parts[2] || ''
      return NextResponse.redirect(new URL(`/store/${storeSlug}/login`, request.url))
    }
  }
}

export const config = {
  matcher: ['/merchant/:path*', '/superadmin/:path*', '/store/:path*/account/:path*'],
}
