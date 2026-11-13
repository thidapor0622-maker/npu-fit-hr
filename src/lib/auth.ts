// src/lib/auth.ts
// Simple JWT-free cookie-based auth using base64 signed tokens

import { cookies } from 'next/headers';

const ADMIN_SESSION_COOKIE = 'hr_admin_session';
const TEACHER_SESSION_COOKIE = 'hr_teacher_session';
const SECRET = process.env.JWT_SECRET || 'hr-npu-secret-key-2024';

function sign(payload: object): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = Buffer.from(SECRET + data).toString('base64url').slice(0, 16);
  return `${data}.${sig}`;
}

function verify(token: string): object | null {
  try {
    const [data, sig] = token.split('.');
    const expectedSig = Buffer.from(SECRET + data).toString('base64url').slice(0, 16);
    if (sig !== expectedSig) return null;
    return JSON.parse(Buffer.from(data, 'base64url').toString());
  } catch {
    return null;
  }
}

export function createAdminToken(): string {
  return sign({ role: 'admin', iat: Date.now() });
}

export function createTeacherToken(email: string, name: string): string {
  return sign({ role: 'teacher', email, name, iat: Date.now() });
}

export function verifyAdminToken(token: string): boolean {
  const payload = verify(token) as any;
  return payload?.role === 'admin';
}

export function verifyTeacherToken(token: string): { email: string; name: string } | null {
  const payload = verify(token) as any;
  if (payload?.role === 'teacher') {
    return { email: payload.email, name: payload.name };
  }
  return null;
}

// Server-side helpers
export async function getAdminSession() {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminToken(token) ? { role: 'admin' } : null;
}

export async function getTeacherSession() {
  const cookieStore = cookies();
  const token = cookieStore.get(TEACHER_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyTeacherToken(token);
}

export const ADMIN_COOKIE = ADMIN_SESSION_COOKIE;
export const TEACHER_COOKIE = TEACHER_SESSION_COOKIE;
