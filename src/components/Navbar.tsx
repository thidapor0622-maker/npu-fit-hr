'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getAssetPath } from '@/lib/assetHelper';

interface AuthState {
  authenticated: boolean;
  role?: 'admin' | 'teacher';
  email?: string;
  name?: string;
  user?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [logoErr, setLogoErr] = useState(false);
  const [auth, setAuth] = useState<AuthState>({ authenticated: false });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isExecutives = pathname === '/';
  const isLecturers = pathname.startsWith('/lecturers');
  const isStaff = pathname.startsWith('/staff');

  // Check login state on mount & route change
  useEffect(() => {
    fetch('/api/auth')
      .then((r) => r.json())
      .then((d) => setAuth(d))
      .catch(() => setAuth({ authenticated: false }));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    setAuth({ authenticated: false });
    setDropdownOpen(false);
    router.push('/');
    router.refresh();
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap md:flex-nowrap justify-between items-center gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3.5">
          <a
            href="https://www.npu.ac.th"
            target="_blank"
            rel="noopener noreferrer"
            title="ไปยังเว็บไซต์หลัก มหาวิทยาลัยนครพนม"
            className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 rounded-2xl flex items-center justify-center p-2 border border-white/10 hover:scale-105 transition-transform flex-shrink-0"
          >
            <img
              src={logoErr ? 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Nakhon_Phanom_University_Logo.svg' : getAssetPath('/img/โลโก้.png')}
              alt="ตรามหาวิทยาลัยนครพนม"
              className="w-full h-full object-contain"
              onError={() => setLogoErr(true)}
            />
          </a>

          <div>
            <Link href="/" className="group">
              <h1 className="text-base sm:text-lg md:text-xl font-black text-white group-hover:text-sky-300 transition-colors">
                คณะเทคโนโลยีอุตสาหกรรม
              </h1>
            </Link>
            <a
              href="https://www.npu.ac.th"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm text-sky-400 hover:text-sky-300 font-bold block mt-0.5 transition-colors"
            >
              มหาวิทยาลัยนครพนม
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 sm:gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60 w-full md:w-auto overflow-x-auto justify-center sm:justify-start">
          {/* Tab 1: Executives */}
          <Link
            href="/"
            className={`flex-1 md:flex-none px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              isExecutives
                ? 'bg-sky-600 text-white shadow-md border border-sky-400/30 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/70'
            }`}
          >
            <i className={`fa-solid fa-user-tie ${isExecutives ? 'text-white' : 'text-sky-400'}`} />
            <span>คณะผู้บริหาร</span>
          </Link>

          {/* Tab 2: Lecturers */}
          <Link
            href="/lecturers"
            className={`flex-1 md:flex-none px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              isLecturers
                ? 'bg-sky-600 text-white shadow-md border border-sky-400/30 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/70'
            }`}
          >
            <i className={`fa-solid fa-chalkboard-user ${isLecturers ? 'text-white' : 'text-sky-400'}`} />
            <span>อาจารย์ประจำสาขาวิชา</span>
          </Link>

          {/* Tab 3: Staff */}
          <Link
            href="/staff"
            className={`flex-1 md:flex-none px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              isStaff
                ? 'bg-sky-600 text-white shadow-md border border-sky-400/30 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/70'
            }`}
          >
            <i className={`fa-solid fa-users ${isStaff ? 'text-white' : 'text-sky-400'}`} />
            <span>บุคลากร / สายสนับสนุน</span>
          </Link>

          {/* Single Unified "เข้าระบบ" / Logged-in User Menu */}
          {auth.authenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap border shadow-sm ${
                  auth.role === 'admin'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400/40'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400/40'
                }`}
              >
                <i className={`fa-solid ${auth.role === 'admin' ? 'fa-shield-halved' : 'fa-circle-user'}`} />
                <span className="max-w-[110px] truncate">
                  {auth.role === 'admin' ? 'Admin' : (auth.email?.split('@')[0] || 'อาจารย์')}
                </span>
                <i className="fa-solid fa-chevron-down text-[10px]" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-fadeIn">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                    <p className="text-[11px] text-slate-500 font-medium">เข้าสู่ระบบในฐานะ</p>
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {auth.role === 'admin' ? 'ผู้ดูแลระบบ (Admin)' : auth.email}
                    </p>
                  </div>

                  {auth.role === 'admin' ? (
                    <Link
                      href="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 font-semibold transition"
                    >
                      <i className="fa-solid fa-gauge text-emerald-600" />
                      หน้าจัดการ Admin
                    </Link>
                  ) : (
                    <Link
                      href="/profile/edit"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 font-semibold transition"
                    >
                      <i className="fa-solid fa-user-pen text-indigo-600" />
                      แก้ไขโปรไฟล์ของฉัน
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-xs sm:text-sm text-red-600 hover:bg-red-50 font-semibold transition border-t border-slate-100 text-left"
                  >
                    <i className="fa-solid fa-right-from-bracket" />
                    ออกจากระบบ
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              title="เข้าสู่ระบบ Admin หรืออาจารย์"
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
                pathname === '/login'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
              }`}
            >
              <i className="fa-solid fa-right-to-bracket text-sky-400" />
              <span>เข้าระบบ</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
