import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('adminToken')?.value;
  const pathname = request.nextUrl.pathname;

  // Allow login page without token
  if (pathname === '/login') {
    return NextResponse.next();
  }

  // If no token, redirect to login (even for root "/")
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
};
