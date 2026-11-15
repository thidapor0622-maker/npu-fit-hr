// src/app/api/admin/personnel/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ success: false, message: 'ไม่มีสิทธิ์' }, { status: 401 });

  const body = await req.json();
  const overrides = readOverrides();
  overrides[params.id] = { ...body, id: params.id, updatedAt: new Date().toISOString() };
  writeOverrides(overrides);

  return NextResponse.json({ success: true, message: 'อัพเดทสำเร็จ' });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ success: false, message: 'ไม่มีสิทธิ์' }, { status: 401 });

  const overrides = readOverrides();
  delete overrides[params.id];
  writeOverrides(overrides);

  return NextResponse.json({ success: true, message: 'ลบข้อมูลสำเร็จ' });
}
