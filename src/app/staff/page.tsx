'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePersonnelData } from '@/hooks/usePersonnelData';

export default function StaffPage() {
  const { staffDivisions, isLiveSheet } = usePersonnelData();
  const [searchTerm, setSearchTerm] = useState('');

  const term = searchTerm.trim().toLowerCase();

  const filteredDivisions = useMemo(() => {
    if (!term) return staffDivisions;
    return staffDivisions.filter(
      (div) =>
        div.title.toLowerCase().includes(term) ||
        div.description.toLowerCase().includes(term)
    );
  }, [term, staffDivisions]);

  return (
    <div className="w-full flex-grow flex flex-col">
      {/* Hero Banner Section */}
      <section className="relative bg-gradient-to-br from-[#0a192f] via-slate-900 to-[#0c4a6e] text-white py-10 sm:py-12 px-4 overflow-hidden shadow-sm">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative max-w-3xl mx-auto text-center space-y-3">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-400/10 border border-sky-400/20 text-sky-300 text-xs font-medium tracking-wide backdrop-blur-sm">
              <i className="fa-solid fa-id-card text-sky-400"></i> Support Staff Directory
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white font-heading">
            ทำเนียบบุคลากร / สายสนับสนุน
          </h2>

          <p className="text-sky-100/75 text-xs sm:text-sm max-w-lg mx-auto font-light leading-relaxed">
            สำนักงานคณบดี คณะเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยนครพนม
          </p>

          {/* Search Box */}
          <div className="pt-2 max-w-md mx-auto">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-500 text-sm">
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาฝ่ายงาน หรือคำอธิบายงาน..."
                className="w-full pl-10 pr-9 py-2.5 bg-white/95 backdrop-blur-md text-slate-800 text-xs sm:text-sm rounded-xl shadow-lg border border-white/20 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:bg-white transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <i className="fa-solid fa-circle-xmark text-sm"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 font-heading">
              ฝ่ายงานทั้งหมด
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              เลือกฝ่ายงานเพื่อเปิดดูรายชื่อบุคลากรประจำฝ่าย
            </p>
          </div>
          <span className="inline-flex items-center justify-center gap-2 text-xs font-bold text-sky-900 bg-sky-100/80 px-4 py-2 rounded-xl border border-sky-200/60 shadow-sm">
            <i className="fa-solid fa-sitemap text-sky-600"></i>{' '}
            <span>{filteredDivisions.length}</span> ฝ่ายงาน
          </span>
        </div>

        {/* Divisions Grid */}
        {filteredDivisions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 mt-4 shadow-sm animate-fadeIn">
            <div className="w-16 h-16 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl border border-sky-100">
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
            <h4 className="text-lg font-bold text-slate-700 font-heading">
              ไม่พบฝ่ายงานที่คุณค้นหา
            </h4>
            <p className="text-sm text-slate-400 mt-1 mb-5">
              โปรดตรวจสอบคำค้นหา หรือลองค้นหาด้วยคำใหม่อีกครั้ง
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="px-5 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold rounded-xl text-xs transition-colors border border-sky-200"
            >
              ล้างการค้นหาทั้งหมด
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {filteredDivisions.map((div) => (
              <Link
                key={div.slug}
                href={`/staff/${div.slug}`}
                className="dept-card group bg-white rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col justify-between relative overflow-hidden min-h-[250px] border border-slate-200"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-sky-600"></div>
                <i className={`${div.icon} absolute -bottom-6 -right-6 text-9xl text-slate-100/50 group-hover:text-sky-50/80 transition-colors pointer-events-none`}></i>

                <div className="relative z-10">
                  <div className="w-14 h-14 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center text-2xl mb-5 group-hover:bg-sky-600 group-hover:text-white transition-all shadow-sm border border-sky-100">
                    <i className={div.icon}></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors font-heading">
                    {div.title}
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm font-normal leading-relaxed mb-6">
                    {div.description}
                  </p>
                </div>

                <div className="relative z-10 pt-4 border-t border-slate-100 flex items-center justify-between text-sky-600 font-bold text-xs sm:text-sm group-hover:text-sky-800">
                  <span>เข้าสู่ทำเนียบบุคลากร ({div.allCards.length} ท่าน)</span>
                  <i className="fa-solid fa-arrow-right transform group-hover:translate-x-2 transition-transform"></i>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
