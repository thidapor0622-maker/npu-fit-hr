// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_COOKIE = 'hr_admin_session';
const TEACHER_COOKIE = 'hr_teacher_session';
const SECRET = process.env.JWT_SECRET || 'hr-npu-secret-key-2024';

function verifyToken(token: string, expectedRole: string): boolean {
  try {
    const [data, sig] = token.split('.');
    if (!data || !sig) return false;
    const expectedSig = Buffer.from(SECRET + data).toString('base64url').slice(0, 16);
    if (sig !== expectedSig) return false;
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString());
    return payload?.role === expectedRole;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Protect /admin routes (only Admin)
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (!token || !verifyToken(token, 'admin')) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Protect /profile/edit route (only logged in Teacher)
  if (pathname.startsWith('/profile/edit')) {
    const token = request.cookies.get(TEACHER_COOKIE)?.value;
    if (!token || !verifyToken(token, 'teacher')) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. If someone goes to old /admin/login or /profile/login, redirect to unified /login
  if (pathname === '/admin/login' || pathname === '/profile/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/profile/edit', '/admin/login', '/profile/login'],
};
