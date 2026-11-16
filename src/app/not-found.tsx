'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { getAssetPath } from '@/lib/assetHelper';

export default function NotFound() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const path = decodeURIComponent(window.location.pathname || '').toLowerCase();
        if (path.includes('บริหาร') || path.includes('dept-admin') || path.includes('admin') || path.includes('สำนักงานคณบดี')) {
          window.location.replace(getAssetPath('/staff/dept-admin/'));
          return;
        }
        if (path.includes('วิชาการ') || path.includes('dept-academic')) {
          window.location.replace(getAssetPath('/staff/dept-academic/'));
          return;
        }
        if (path.includes('วิจัย') || path.includes('dept-finance') || path.includes('แผนงาน') || path.includes('งบประมาณ')) {
          window.location.replace(getAssetPath('/staff/dept-finance/'));
          return;
        }
        if (path.includes('พัฒนา') || path.includes('dept-facility') || path.includes('อาคาร') || path.includes('บริการการศึกษา')) {
          window.location.replace(getAssetPath('/staff/dept-facility/'));
          return;
        }
        if (path.includes('สนับสนุน') || path.includes('staff')) {
          window.location.replace(getAssetPath('/staff/'));
          return;
        }
      } catch {}
    }
  }, []);

  return (
    <div className="flex-grow flex items-center justify-center p-6 text-center">
      <div className="bg-white/80 backdrop-blur-md max-w-md w-full p-8 rounded-3xl shadow-lg border border-slate-200">
        <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
          <i className="fa-solid fa-compass"></i>
        </div>
        <h2 className="text-2xl font-black text-slate-800 font-heading mb-2">
          ไม่พบหน้าที่คุณต้องการ
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          หน้าเว็บที่คุณกำลังเรียกดูอาจถูกย้าย หรือไม่มีอยู่ในระบบ กำลังนำท่านกลับสู่หน้าหลัก...
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all hover:scale-105"
        >
          <i className="fa-solid fa-house"></i>
          <span>กลับสู่หน้าหลัก</span>
        </Link>
      </div>
    </div>
  );
}
