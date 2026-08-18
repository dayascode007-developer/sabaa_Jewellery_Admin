import { NextResponse } from 'next/server';

export async function POST(request) {
  const { email, password } = await request.json();

  // Static credentials validation
  const validEmail = 'admin@sabaa.com';
  const validPassword = 'admin123';

  if (email === validEmail && password === validPassword) {
    // Create response with auth cookie
    const response = NextResponse.json(
      { success: true, message: 'Login successful' },
      { status: 200 }
    );

    // Set secure auth cookie (expires in 24 hours)
    response.cookies.set('adminAuth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    return response;
  }

  return NextResponse.json(
    { success: false, message: 'Invalid credentials' },
    { status: 401 }
  );
}
