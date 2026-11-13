'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getAssetPath } from '@/lib/assetHelper';
import { fetchClientGViz } from '@/hooks/usePersonnelData';

function UnifiedLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const cleanUser = username.trim().toLowerCase();

    // 1. Direct Admin authentication
    if (cleanUser === 'admin' && password === 'admin1234') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('hr_admin_session', 'true');
        localStorage.removeItem('hr_user_session');
      }
      fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser, password }),
      }).catch(() => {});

      const dest = from || '/admin/';
      const targetUrl = getAssetPath(dest.endsWith('/') ? dest : `${dest}/`);
      window.location.href = targetUrl;
      return;
    }

    // 2. Personnel / Teacher authentication with Google Sheets Password Check
    const targetSheetId = (typeof window !== 'undefined' && localStorage.getItem('hr_custom_sheet_id')) || process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || '1s9Cru468Qo81ImgNAd4v8xULsWt51wAuQ4AY3nMg7WU';
    try {
      const [execs, lecs, staffs] = await Promise.all([
        fetchClientGViz(targetSheetId, 'Executives').catch(() => []),
        fetchClientGViz(targetSheetId, 'Lecturers').catch(() => []),
        fetchClientGViz(targetSheetId, 'Staff').catch(() => []),
      ]);
      const allPersonnel = [...execs, ...lecs, ...staffs];
      const matched = allPersonnel.find((p) => {
        const pEmail = String(p.email || '').toLowerCase().trim();
        const pId = String(p.id || '').toLowerCase().trim();
        const pName = String(p.name || '').trim();
        return pEmail === cleanUser || pId === cleanUser || (cleanUser.includes('@') && pEmail === cleanUser) || pName.toLowerCase() === cleanUser;
      });

      if (matched) {
        const sheetPassword = String(matched.password || '').trim();
        const defaultSuffixPass = cleanUser.includes('@') ? cleanUser.split('@')[0].slice(-6) : cleanUser;

        // If admin set password in Google Sheets, verify strictly
        const isPassCorrect = sheetPassword
          ? password === sheetPassword
          : password === '123456' || password === defaultSuffixPass || password === 'admin1234' || password.length >= 4;

        if (isPassCorrect) {
          const userEmail = matched.email || (cleanUser.includes('@') ? cleanUser : `${cleanUser}@npu.ac.th`);
          const displayName = matched.name || matched.calendarName || cleanUser;

          if (typeof window !== 'undefined') {
            localStorage.removeItem('hr_admin_session');
            localStorage.setItem('hr_user_session', JSON.stringify({
              role: 'teacher',
              email: userEmail,
              user: matched.id || cleanUser,
              name: displayName,
              currentPassword: password,
              loginAt: new Date().toISOString(),
            }));
          }
          const dest = from || '/profile/edit/';
          const targetUrl = getAssetPath(dest.endsWith('/') ? dest : `${dest}/`);
          window.location.href = targetUrl;
          return;
        } else {
          setError('รหัสผ่านไม่ถูกต้อง (กรุณาใช้รหัสที่แอดมินตั้งใน Google ชีต หรือติดต่อแอดมิน)');
          setLoading(false);
          return;
        }
      }
    } catch {}

    // Fallback: If not found in sheet or offline, allow email login
    if (cleanUser.includes('@') || cleanUser.length >= 3) {
      if (password && password.length >= 4) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('hr_admin_session');
          localStorage.setItem('hr_user_session', JSON.stringify({
            role: 'teacher',
            email: cleanUser.includes('@') ? cleanUser : `${cleanUser}@npu.ac.th`,
            user: cleanUser,
            name: cleanUser.includes('@') ? cleanUser.split('@')[0] : cleanUser,
            loginAt: new Date().toISOString(),
          }));
        }
        const dest = from || '/profile/edit/';
        const targetUrl = getAssetPath(dest.endsWith('/') ? dest : `${dest}/`);
        window.location.href = targetUrl;
        return;
      }
    }

    setError('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง (สำหรับแอดมิน: admin / admin1234)');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 px-4">
      {/* Background ambient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/10 backdrop-blur border border-white/20 shadow-2xl mb-4">
            <img
              src={getAssetPath('/img/โลโก้.png')}
              alt="NPU Logo"
              className="w-14 h-14 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://upload.wikimedia.org/wikipedia/commons/e/e0/Nakhon_Phanom_University_Logo.svg';
              }}
            />
          </div>
          <h1 className="text-2xl font-black text-white font-heading">เข้าสู่ระบบ</h1>
          <p className="text-sky-300 text-sm mt-1">
            คณะเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยนครพนม
          </p>
          <p className="text-slate-400 text-xs mt-1">
            สำหรับผู้ดูแลระบบ (Admin) และอาจารย์/บุคลากร
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/20 border border-red-400/40 text-red-200 rounded-2xl px-4 py-3 text-sm flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Username / Email */}
            <div>
              <label className="block text-sky-200 text-xs font-bold mb-2 tracking-wide uppercase">
                <i className="fa-solid fa-user mr-1.5" />
                ชื่อผู้ใช้ หรือ อีเมล (@npu.ac.th)
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin หรือ yourname@npu.ac.th"
                required
                autoFocus
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sky-200 text-xs font-bold mb-2 tracking-wide uppercase">
                <i className="fa-solid fa-lock mr-1.5" />
                รหัสผ่าน
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition"
                  title={showPass ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                >
                  <i className={`fa-solid ${showPass ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
                </button>
              </div>
            </div>

            {/* Hint Box */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-[11px] text-sky-200/80 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-sky-300">
                <i className="fa-solid fa-circle-info" /> ข้อมูลสำหรับการเข้าสู่ระบบ:
              </div>
              <p>• <b>ผู้ดูแลระบบ (Admin):</b> ชื่อผู้ใช้ <code>admin</code> (รหัส: <code>admin1234</code>)</p>
              <p>• <b>อาจารย์ / บุคลากร:</b> ใช้อีเมลมหาวิทยาลัย (เช่น <code>yourname@npu.ac.th</code>) หรือชื่อผู้ใช้ (รหัสเริ่มต้น: <code>123456</code> หรือรหัสอย่างน้อย 4 ตัว)</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 hover:bg-sky-500 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin" />
                  กำลังตรวจสอบ...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket" />
                  เข้าสู่ระบบ
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sky-400/80 hover:text-sky-300 text-sm font-semibold transition inline-flex items-center gap-1.5">
            <i className="fa-solid fa-arrow-left" />
            กลับสู่หน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">กำลังโหลด...</div>}>
      <UnifiedLoginForm />
    </Suspense>
  );
}
