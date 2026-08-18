import { NextResponse } from 'next/server';

export function middleware() {
  // Middleware disabled - route protection handled client-side
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
