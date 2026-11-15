// src/app/api/admin/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createAdminToken, ADMIN_COOKIE } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const validUser = process.env.ADMIN_USERNAME || 'admin';
  const validPass = process.env.ADMIN_PASSWORD || 'admin1234';

  if (username === validUser && password === validPass) {
    const token = createAdminToken();
    const res = NextResponse.json({ success: true, message: 'เข้าสู่ระบบสำเร็จ' });
    res.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    });
    return res;
  }

  return NextResponse.json(
    { success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' },
    { status: 401 }
  );
}

export async function DELETE() {
  const res = NextResponse.json({ success: true, message: 'ออกจากระบบแล้ว' });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
