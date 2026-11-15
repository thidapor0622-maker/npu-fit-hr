'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StaffDivision, STAFF_DIVISIONS_DATA } from '@/data/staff-divisions';
import { Personnel } from '@/data/departments';
import { usePersonnelData } from '@/hooks/usePersonnelData';
import PersonnelCard from '@/components/PersonnelCard';
import CalendarModal from '@/components/CalendarModal';
import ProfileModal from '@/components/ProfileModal';

interface StaffDivisionDetailClientProps {
  division: StaffDivision;
}

export default function StaffDivisionDetailClient({
  division: initialDivision,
}: StaffDivisionDetailClientProps) {
  const { staffDivisions: liveDivisions, isLiveSheet } = usePersonnelData();
  const [searchTerm, setSearchTerm] = useState('');
  const [calendarModalName, setCalendarModalName] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<Personnel | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const division =
    liveDivisions.find((d) => d.slug === initialDivision.slug) || initialDivision;

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

  const isHeadVisible = division.head ? isPersonMatch(division.head) : false;
  const matchedMembers = division.members.filter(isPersonMatch);
  const isMembersVisible = matchedMembers.length > 0;
  const hasResults = isHeadVisible || isMembersVisible;

  return (
    <div className="w-full flex-grow flex flex-col">
      {/* Sub-header navigation */}
      <div className="bg-slate-900 border-b border-slate-800 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link
            href="/staff"
            className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>กลับหน้าฝ่ายงานบุคลากร</span>
          </Link>

          {/* Division switcher dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-sm"
            >
              <i className="fa-solid fa-briefcase text-sky-400"></i>
              <span className="hidden sm:inline">เปลี่ยนฝ่ายงาน</span>
              <i
                className={`fa-solid fa-chevron-down text-[10px] transition-transform ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
              ></i>
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 text-slate-700 text-xs"
                onClick={() => setDropdownOpen(false)}
              >
                <div className="px-4 py-2 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  ฝ่ายงานทั้งหมด
                </div>
                {(liveDivisions.length > 0 ? liveDivisions : STAFF_DIVISIONS_DATA).map((d) => (
                  <Link
                    key={d.slug}
                    href={`/staff/${d.slug}`}
                    className={`flex items-center gap-2 px-4 py-2.5 hover:bg-sky-50 transition ${
                      d.slug === division.slug
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
      <section className="bg-gradient-to-b from-slate-900 via-sky-950 to-slate-900 border-b border-sky-900/40 py-8 px-4 relative shadow-md">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-sky-900/90 to-blue-900/90 border border-sky-400/30 text-sky-300 text-xs px-3.5 py-1 rounded-full font-bold uppercase tracking-wider shadow-md">
              <i className={division.icon}></i> {division.badge || division.title}
            </span>

            {isLiveSheet && (
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs px-3 py-1 rounded-full font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Google Sheet Live</span>
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-heading">
            ทำเนียบบุคลากร
          </h2>
          <h3 className="text-xl sm:text-2xl font-bold text-sky-200 font-heading">
            {division.title}
          </h3>
          <p className="text-sky-200/80 text-xs sm:text-sm max-w-lg mx-auto">
            {division.description}
          </p>

          {/* Search Box */}
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
            {/* Head of Division */}
            {isHeadVisible && division.head && (
              <section className="flex flex-col items-center">
                <div className="mb-4 text-center">
                  <span className="inline-flex items-center gap-2 bg-sky-800 text-white font-bold text-xs sm:text-sm px-6 py-2 rounded-full shadow-md">
                    หัวหน้า{division.title}
                  </span>
                </div>

                <div className="flex justify-center w-full">
                  <PersonnelCard
                    person={division.head}
                    deptTitle={division.title}
                    deptSlug={division.slug}
                    index={0}
                    onOpenProfile={(p) => setSelectedProfile(p)}
                    onOpenCalendar={(name) => setCalendarModalName(name)}
                  />
                </div>
              </section>
            )}

            {division.head &&
              division.members.length > 0 &&
              isHeadVisible &&
              isMembersVisible && <hr className="border-sky-200/60 max-w-5xl mx-auto" />}

            {/* Division Staff Members */}
            {isMembersVisible && (
              <section className="space-y-8">
                <div className="text-center">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 inline-block relative font-heading after:content-[''] after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-sky-500 after:to-blue-600 after:mx-auto after:mt-2.5 after:rounded-full">
                    เจ้าหน้าที่และบุคลากร
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch justify-items-center max-w-6xl mx-auto">
                  {matchedMembers.map((person, idx) => (
                    <PersonnelCard
                      key={idx}
                      person={person}
                      deptTitle={division.title}
                      deptSlug={division.slug}
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
        deptTitle={division.title}
        deptSlug={division.slug}
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
