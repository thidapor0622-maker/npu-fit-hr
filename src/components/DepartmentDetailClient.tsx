'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Department, DEPARTMENTS_DATA, Personnel } from '@/data/departments';
import { usePersonnelData } from '@/hooks/usePersonnelData';
import PersonnelCard from '@/components/PersonnelCard';
import CalendarModal from '@/components/CalendarModal';
import ProfileModal from '@/components/ProfileModal';

interface DepartmentDetailClientProps {
  department: Department;
}

export default function DepartmentDetailClient({
  department: initialDepartment,
}: DepartmentDetailClientProps) {
  const { departments: liveDepartments, isLiveSheet } = usePersonnelData();
  const [searchTerm, setSearchTerm] = useState('');
  const [calendarModalName, setCalendarModalName] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<Personnel | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // If live data has this department, use it; otherwise fallback to initial
  const department =
    liveDepartments.find((d) => d.slug === initialDepartment.slug) || initialDepartment;

  const term = searchTerm.trim().toLowerCase();

  const isPersonMatch = (p: Personnel | null) => {
    if (!p) return false;
    if (!term) return true;
    return (
      p.name.toLowerCase().includes(term) ||
      p.position.toLowerCase().includes(term) ||
      p.email.toLowerCase().includes(term) ||
      p.phone.toLowerCase().includes(term) ||
      p.location.toLowerCase().includes(term)
    );
  };

  const isHeadVisible = department.head ? isPersonMatch(department.head) : false;
  const matchedMembers = department.members.filter(isPersonMatch);
  const isMembersVisible = matchedMembers.length > 0;
  const hasResults = isHeadVisible || isMembersVisible;

  return (
    <div className="w-full flex-grow flex flex-col">
      {/* Sub-header navigation with Department Dropdown */}
      <div className="bg-slate-900 border-b border-slate-800 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link
            href="/lecturers"
            className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>กลับหน้ารายชื่อสาขาวิชา</span>
          </Link>

          {/* Department switcher dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-sm"
            >
              <i className="fa-solid fa-graduation-cap text-sky-400"></i>
              <span className="hidden sm:inline">เปลี่ยนสาขาวิชา</span>
              <i
                className={`fa-solid fa-chevron-down text-[10px] transition-transform ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
              ></i>
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 text-slate-700 text-xs max-h-[380px] overflow-y-auto"
                onClick={() => setDropdownOpen(false)}
              >
                <div className="px-4 py-2 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  สาขาวิชาทั้งหมด
                </div>
                {(liveDepartments.length > 0 ? liveDepartments : DEPARTMENTS_DATA).map((d) => (
                  <Link
                    key={d.slug}
                    href={`/lecturers/${d.slug}`}
                    className={`flex items-center gap-2 px-4 py-2.5 hover:bg-sky-50 transition ${
                      d.slug === department.slug
                        ? 'bg-sky-50 text-sky-900 font-bold border-l-4 border-sky-600'
                        : 'text-slate-700'
                    }`}
                  >
                    <i className={`${d.icon} w-5 text-sky-600`}></i>
                    <span className="truncate">{d.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero / Banner Section */}
      <section className="bg-gradient-to-b from-slate-900 via-sky-950 to-blue-950 border-b border-sky-900/40 py-8 px-4 relative shadow-md">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-sky-900/80 border border-sky-500/30 text-sky-300 text-xs px-3.5 py-1 rounded-full font-bold uppercase">
              <i className={department.icon}></i> {department.badge || department.title}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-heading">
            ทำเนียบบุคลากร
          </h2>
          <h3 className="text-xl sm:text-2xl font-bold text-sky-200 font-heading">
            {department.title}
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto">
            คณะเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยนครพนม
          </p>

          {/* Search Input */}
          <div className="max-w-sm mx-auto relative pt-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อ, ตำแหน่ง, อีเมล..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl text-slate-800 text-xs sm:text-sm shadow-md bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 translate-y-[-30%] text-slate-400 text-sm"></i>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 translate-y-[-30%] text-slate-400 hover:text-slate-600"
              >
                <i className="fa-solid fa-circle-xmark text-sm"></i>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="w-full flex-grow py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-14">
        {!hasResults ? (
          <div className="text-center py-16 animate-fadeIn">
            <div className="bg-white/80 backdrop-blur-md max-w-md mx-auto p-8 rounded-3xl shadow-md border border-slate-200">
              <i className="fa-solid fa-triangle-exclamation text-amber-500 text-4xl mb-3"></i>
              <h3 className="text-base font-bold text-slate-800 font-heading">
                ไม่พบข้อมูลบุคลากรที่ค้นหา
              </h3>
              <p className="text-xs text-slate-500 mt-1">กรุณาตรวจสอบคำสะกดใหม่อีกครั้ง</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 px-4 py-2 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-xl text-xs font-semibold border border-sky-200 transition-colors"
              >
                ล้างการค้นหา
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Head of Department */}
            {isHeadVisible && department.head && (
              <section className="flex flex-col items-center">
                <div className="mb-4 text-center">
                  <span className="inline-flex items-center gap-2 bg-sky-800 text-white font-bold text-xs sm:text-sm px-6 py-2 rounded-full shadow-md">
                    หัวหน้าหลักสูตรสาขาวิชา
                  </span>
                </div>

                <div className="flex justify-center w-full">
                  <PersonnelCard
                    person={department.head}
                    deptTitle={department.title}
                    deptTitleEn={department.titleEn}
                    deptSlug={department.slug}
                    index={0}
                    onOpenProfile={(p) => setSelectedProfile(p)}
                    onOpenCalendar={(name) => setCalendarModalName(name)}
                  />
                </div>
              </section>
            )}

            {department.head &&
              department.members.length > 0 &&
              isHeadVisible &&
              isMembersVisible && <hr className="border-sky-200/60 max-w-5xl mx-auto" />}

            {/* Department Faculty Members */}
            {isMembersVisible && (
              <section className="space-y-8">
                <div className="text-center">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 inline-block relative font-heading after:content-[''] after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-sky-500 after:to-blue-600 after:mx-auto after:mt-2.5 after:rounded-full">
                    คณะอาจารย์ประจำสาขาวิชา
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch justify-items-center max-w-6xl mx-auto">
                  {matchedMembers.map((person, idx) => (
                    <PersonnelCard
                      key={idx}
                      person={person}
                      deptTitle={department.title}
                      deptTitleEn={department.titleEn}
                      deptSlug={department.slug}
                      index={idx + 1}
                      onOpenProfile={(p) => setSelectedProfile(p)}
                      onOpenCalendar={(name) => setCalendarModalName(name)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={!!selectedProfile}
        person={selectedProfile}
        deptTitle={department.title}
        deptTitleEn={department.titleEn}
        deptSlug={department.slug}
        onClose={() => setSelectedProfile(null)}
        onOpenCalendar={(name) => setCalendarModalName(name)}
      />

      {/* Calendar Modal */}
      <CalendarModal
        isOpen={!!calendarModalName}
        officerName={calendarModalName || ''}
        onClose={() => setCalendarModalName(null)}
      />
    </div>
  );
}
