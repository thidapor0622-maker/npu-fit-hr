'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getAssetPath } from '@/lib/assetHelper';
import { Suspense } from 'react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin';

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

    if (cleanUser === 'admin' && password === 'admin1234') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('hr_admin_session', 'true');
      }
      fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser, password }),
      }).catch(() => {});

      window.location.href = getAssetPath('/admin/');
      return;
    }

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser, password }),
      });
      const data = await res.json();
      if (data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('hr_admin_session', 'true');
        }
        router.push(from);
        router.refresh();
      } else {
        setError(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
      }
    } catch {
      setError('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง (แอดมิน: admin / รหัสผ่าน: admin1234)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 px-4">
      {/* Background decorative */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo + Title */}
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
          <h1 className="text-2xl font-black text-white">ระบบจัดการหลังบ้าน</h1>
          <p className="text-sky-300 text-sm mt-1 font-medium">
            คณะเทคโนโลยีอุตสาหกรรม มนพ.
          </p>
          <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-red-500/15 border border-red-400/30 text-red-300 text-xs font-semibold">
            <i className="fa-solid fa-shield-halved" />
            เข้าได้เฉพาะผู้ดูแลระบบ (Admin Only)
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <div className="bg-red-500/20 border border-red-400/40 text-red-200 rounded-2xl px-4 py-3 text-sm flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation" />
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-sky-200 text-xs font-bold mb-2 tracking-wide uppercase">
                <i className="fa-solid fa-user mr-1.5" />
                ชื่อผู้ใช้งาน
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
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
                >
                  <i className={`fa-solid ${showPass ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-sky-800 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin" />
                  กำลังตรวจสอบ...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket" />
                  เข้าสู่ระบบ Admin
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/15" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-transparent px-3 text-white/40 text-xs">หรือ</span>
            </div>
          </div>

          {/* Teacher login link */}
          <Link
            href="/profile/login"
            className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-sky-300 hover:text-sky-200 rounded-xl py-3 text-sm font-semibold transition"
          >
            <i className="fa-solid fa-chalkboard-user" />
            เข้าสู่ระบบสำหรับอาจารย์ / เจ้าหน้าที่
          </Link>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sky-400/70 hover:text-sky-300 text-sm transition">
            <i className="fa-solid fa-arrow-left mr-1.5" />
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">กำลังโหลด...</div>}>
      <LoginForm />
    </Suspense>
  );
}
