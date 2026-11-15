// src/app/api/teacher/profile/route.ts
// Teacher self-edit profile
import { NextRequest, NextResponse } from 'next/server';
import { getTeacherSession } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

const OVERRIDES_FILE = path.join(process.cwd(), 'personnel-overrides.json');

function readOverrides(): Record<string, any> {
  try {
    if (fs.existsSync(OVERRIDES_FILE)) {
      return JSON.parse(fs.readFileSync(OVERRIDES_FILE, 'utf-8'));
    }
  } catch {}
  return {};
}

function writeOverrides(data: Record<string, any>) {
  fs.writeFileSync(OVERRIDES_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET(req: NextRequest) {
  const session = await getTeacherSession();
  if (!session) return NextResponse.json({ success: false, message: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });

  const overrides = readOverrides();
  const profile = overrides[session.email] || null;
  return NextResponse.json({ success: true, profile, email: session.email });
}

export async function POST(req: NextRequest) {
  const session = await getTeacherSession();
  if (!session) return NextResponse.json({ success: false, message: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });

  const body = await req.json();
  const overrides = readOverrides();

  // Teachers can only edit their own profile (limited fields)
  const allowedFields = ['nameEn', 'nameTh', 'position', 'phone', 'location', 'researchInterests', 'education', 'skills', 'imageUrl', 'calendarUrl'];
  const filtered: Record<string, any> = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) filtered[field] = body[field];
  }

  overrides[session.email] = {
    ...(overrides[session.email] || {}),
    ...filtered,
    email: session.email,
    updatedAt: new Date().toISOString(),
    updatedBy: 'teacher-self',
  };
  writeOverrides(overrides);

  return NextResponse.json({ success: true, message: 'บันทึกโปรไฟล์สำเร็จ' });
}
