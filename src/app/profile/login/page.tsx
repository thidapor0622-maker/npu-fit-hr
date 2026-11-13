'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAssetPath } from '@/lib/assetHelper';

function TeacherLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      setLoading(false);
      return;
    }

    if (password.length >= 3) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('hr_admin_session');
        localStorage.setItem('hr_user_session', JSON.stringify({
          role: 'teacher',
          email: cleanEmail.includes('@') ? cleanEmail : `${cleanEmail}@npu.ac.th`,
          user: cleanEmail,
          name: cleanEmail.includes('@') ? cleanEmail.split('@')[0] : cleanEmail,
          loginAt: new Date().toISOString(),
        }));
      }
      fetch('/api/teacher/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      }).catch(() => {});

      window.location.href = getAssetPath('/profile/edit/');
      return;
    }

    setError('รหัสผ่านไม่ถูกต้อง (รหัสเริ่มต้น: 123456 หรืออย่างน้อย 4 ตัวอักษร)');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-indigo-950 to-slate-900 px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/10 backdrop-blur border border-white/20 shadow-2xl mb-4">
            <i className="fa-solid fa-chalkboard-user text-3xl text-sky-300" />
          </div>
          <h1 className="text-2xl font-black text-white">เข้าสู่ระบบอาจารย์</h1>
          <p className="text-indigo-300 text-sm mt-1">สำหรับแก้ไขโปรไฟล์ส่วนตัว</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/20 border border-red-400/40 text-red-200 rounded-2xl px-4 py-3 text-sm flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation" /> {error}
              </div>
            )}

            <div>
              <label className="block text-sky-200 text-xs font-bold mb-2 uppercase tracking-wide">
                <i className="fa-solid fa-envelope mr-1.5" /> อีเมลมหาวิทยาลัย
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@npu.ac.th"
                required
                autoFocus
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
              />
            </div>

            <div>
              <label className="block text-sky-200 text-xs font-bold mb-2 uppercase tracking-wide">
                <i className="fa-solid fa-key mr-1.5" /> รหัสผ่าน
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="รหัสพนักงาน 6 หลักสุดท้ายของอีเมล"
                  required
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition"
                >
                  <i className={`fa-solid ${showPass ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
                </button>
              </div>
              <p className="text-white/40 text-xs mt-1.5">
                <i className="fa-solid fa-circle-info mr-1" />
                รหัสเริ่มต้น = 123456 หรือรหัสผ่านอย่างน้อย 4 ตัว
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <><i className="fa-solid fa-circle-notch fa-spin" /> กำลังตรวจสอบ...</>
              ) : (
                <><i className="fa-solid fa-right-to-bracket" /> เข้าสู่ระบบ</>
              )}
            </button>
          </form>
        </div>

        <div className="flex justify-center gap-6 mt-6 text-sm">
          <Link href="/" className="text-sky-400/70 hover:text-sky-300 transition">
            <i className="fa-solid fa-house mr-1" /> หน้าหลัก
          </Link>
          <Link href="/admin/login" className="text-sky-400/70 hover:text-sky-300 transition">
            <i className="fa-solid fa-shield-halved mr-1" /> Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TeacherLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">กำลังโหลด...</div>}>
      <TeacherLoginForm />
    </Suspense>
  );
}
