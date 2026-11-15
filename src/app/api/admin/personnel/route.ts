// src/app/api/admin/personnel/route.ts
// CRUD API for personnel management
import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src/data/departments.ts');
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

export async function GET() {
  // Return all personnel from overrides file for admin table
  const overrides = readOverrides();
  return NextResponse.json({ success: true, data: overrides });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, message: 'ไม่มีสิทธิ์เข้าถึง' }, { status: 401 });
  }

  const body = await req.json();
  const overrides = readOverrides();
  const id = body.id || `person_${Date.now()}`;

  overrides[id] = { ...body, id, updatedAt: new Date().toISOString() };
  writeOverrides(overrides);

  return NextResponse.json({ success: true, message: 'บันทึกข้อมูลสำเร็จ', id });
}
