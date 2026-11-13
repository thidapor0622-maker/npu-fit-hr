// src/app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createAdminToken, createTeacherToken, ADMIN_COOKIE, TEACHER_COOKIE, verifyAdminToken, verifyTeacherToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

const TEACHER_ACCOUNTS_FILE = path.join(process.cwd(), 'teacher-accounts.json');

function readTeacherAccounts(): Record<string, { password: string; name: string }> {
  try {
    if (fs.existsSync(TEACHER_ACCOUNTS_FILE)) {
      return JSON.parse(fs.readFileSync(TEACHER_ACCOUNTS_FILE, 'utf-8'));
    }
  } catch {}
  return {};
}

// Check current login session (Admin or Teacher)
export async function GET() {
  const cookieStore = cookies();
  const adminToken = cookieStore.get(ADMIN_COOKIE)?.value;
  if (adminToken && verifyAdminToken(adminToken)) {
    return NextResponse.json({ authenticated: true, role: 'admin', user: 'admin' });
  }

  const teacherToken = cookieStore.get(TEACHER_COOKIE)?.value;
  if (teacherToken) {
    const teacher = verifyTeacherToken(teacherToken);
    if (teacher) {
      return NextResponse.json({ authenticated: true, role: 'teacher', email: teacher.email, name: teacher.name });
    }
  }

  return NextResponse.json({ authenticated: false });
}

// Unified Login for both Admin and Teachers
export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const validAdminUser = process.env.ADMIN_USERNAME || 'admin';
  const validAdminPass = process.env.ADMIN_PASSWORD || 'admin1234';

  // 1. Check Admin
  if (username === validAdminUser && password === validAdminPass) {
    const token = createAdminToken();
    const res = NextResponse.json({ success: true, role: 'admin', redirectTo: '/admin' });
    res.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8,
      path: '/',
    });
    // Remove teacher cookie if any
    res.cookies.delete(TEACHER_COOKIE);
    return res;
  }

  // 2. Check Teacher (email-based)
  const isEmail = username.includes('@');
  if (isEmail) {
    const accounts = readTeacherAccounts();
    const account = accounts[username];
    const defaultPassword = username.split('@')[0].slice(-6);

    const isValid = account ? account.password === password : password === defaultPassword;

    if (isValid) {
      const name = account?.name || username.split('@')[0];
      const token = createTeacherToken(username, name);
      const res = NextResponse.json({ success: true, role: 'teacher', email: username, name, redirectTo: '/profile/edit' });
      res.cookies.set(TEACHER_COOKIE, token, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 6,
        path: '/',
      });
      // Remove admin cookie if any
      res.cookies.delete(ADMIN_COOKIE);
      return res;
    }
  }

  return NextResponse.json(
    { success: false, message: 'ชื่อผู้ใช้/อีเมล หรือรหัสผ่านไม่ถูกต้อง' },
    { status: 401 }
  );
}

// Unified Logout
export async function DELETE() {
  const res = NextResponse.json({ success: true, message: 'ออกจากระบบแล้ว' });
  res.cookies.delete(ADMIN_COOKIE);
  res.cookies.delete(TEACHER_COOKIE);
  return res;
}
