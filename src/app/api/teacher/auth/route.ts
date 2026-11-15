// src/app/api/teacher/auth/route.ts
// Teacher self-login by employee ID + password
import { NextRequest, NextResponse } from 'next/server';
import { createTeacherToken, TEACHER_COOKIE } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

const TEACHER_ACCOUNTS_FILE = path.join(process.cwd(), 'teacher-accounts.json');

function readAccounts(): Record<string, { password: string; name: string }> {
  try {
    if (fs.existsSync(TEACHER_ACCOUNTS_FILE)) {
      return JSON.parse(fs.readFileSync(TEACHER_ACCOUNTS_FILE, 'utf-8'));
    }
  } catch {}
  return {};
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const accounts = readAccounts();
  const account = accounts[email];

  // Default: any lecturer email with password = their employee code (last 6 digits of email prefix)
  // Admin can override via teacher-accounts.json
  const defaultPassword = email.split('@')[0].slice(-6);

  const isValid =
    account
      ? account.password === password
      : password === defaultPassword;

  if (isValid) {
    const name = account?.name || email.split('@')[0];
    const token = createTeacherToken(email, name);
    const res = NextResponse.json({ success: true, name, email });
    res.cookies.set(TEACHER_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 4, // 4 hours
      path: '/',
    });
    return res;
  }

  return NextResponse.json(
    { success: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
    { status: 401 }
  );
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(TEACHER_COOKIE);
  return res;
}
