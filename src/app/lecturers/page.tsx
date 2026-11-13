'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePersonnelData } from '@/hooks/usePersonnelData';

export default function LecturersPage() {
  const { departments, isLiveSheet } = usePersonnelData();
  const [searchTerm, setSearchTerm] = useState('');

  const term = searchTerm.trim().toLowerCase();

  const filteredDepartments = useMemo(() => {
    if (!term) return departments;
    return departments.filter(
      (dept) =>
        dept.title.toLowerCase().includes(term) ||
        dept.titleEn.toLowerCase().includes(term) ||
        dept.searchKeywords.toLowerCase().includes(term)
    );
  }, [term, departments]);

  return (
    <div className="w-full flex-grow flex flex-col">
      {/* Hero Banner Section */}
      <section className="relative bg-gradient-to-b from-[#002855] via-sky-950 to-slate-900 text-white py-12 sm:py-14 px-4 overflow-hidden shadow-md">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-4xl mx-auto text-center space-y-3">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-medium tracking-wide">
              <i className="fa-solid fa-graduation-cap"></i> Faculty of Industrial Technology
            </span>

            {isLiveSheet && (
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs px-3 py-1 rounded-full font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Google Sheet Live</span>
              </span>
            )}
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-heading">
            ทำเนียบคณะอาจารย์ประจำสาขาวิชา
          </h2>
          <p className="text-sky-100/80 text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed">
            เลือกสาขาวิชาเพื่อเข้าชมข้อมูล รายชื่อ และบุคลากรผู้สอนประจำสาขา
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        {/* Controls & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b-2 border-slate-300/80">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 font-heading">
              สาขาวิชาทั้งหมด
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              เลือกสาขาวิชาเพื่อดูข้อมูลอาจารย์ประจำหลักสูตร
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input Field */}
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาสาขาวิชา..."
                className="w-full pl-10 pr-9 py-2.5 bg-white border-2 border-slate-300 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition shadow-sm font-medium"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <i className="fa-solid fa-circle-xmark"></i>
                </button>
              )}
            </div>

            {/* Department Counter */}
            <span className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-sky-800 bg-sky-100 px-3.5 py-2.5 rounded-xl border border-sky-300 shadow-sm whitespace-nowrap">
              <i className="fa-solid fa-layer-group"></i>{' '}
              <span>{filteredDepartments.length}</span> สาขาวิชา
            </span>
          </div>
        </div>

        {/* Cards Grid */}
        {filteredDepartments.length === 0 ? (
          <div className="text-center py-16 bg-white/70 backdrop-blur-md rounded-2xl border border-dashed border-slate-300 shadow-sm animate-fadeIn">
            <div className="w-16 h-16 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl border border-sky-100">
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
            <h4 className="text-lg font-bold text-slate-700 font-heading">
              ไม่พบสาขาวิชาที่คุณค้นหา
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepartments.map((dept) => (
              <Link
                key={dept.slug}
                href={`/lecturers/${dept.slug}`}
                className="academic-card group bg-white rounded-2xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden border-2 border-slate-200"
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-sky-500"></div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50 rounded-bl-full -z-0 transition-all group-hover:scale-110 group-hover:bg-sky-100/60"></div>

                <div className="relative z-10 pt-1">
                  <div className="w-14 h-14 bg-sky-100 text-sky-700 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-sky-600 group-hover:text-white transition-all shadow-sm border border-sky-200">
                    <i className={dept.icon}></i>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-sky-600 transition font-heading">
                    {dept.title}
                  </h4>
                  <p className="text-slate-500 text-xs font-medium mb-6">
                    {dept.titleEn}
                  </p>
                </div>

                <div className="relative z-10 pt-3 border-t border-slate-200 flex items-center justify-between text-sky-600 font-bold text-xs group-hover:text-sky-800">
                  <span>เข้าสู่ทำเนียบอาจารย์ ({dept.allCards.length} ท่าน)</span>
                  <i className="fa-solid fa-arrow-right transform group-hover:translate-x-1 transition-transform"></i>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
