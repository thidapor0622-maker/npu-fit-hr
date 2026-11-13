'use client';

import { useState, useMemo, useRef } from 'react';
import { usePersonnelData } from '@/hooks/usePersonnelData';
import { ExecutiveDetail } from '@/data/executives';
import PersonnelCard from '@/components/PersonnelCard';
import PersonDetailConsole from '@/components/PersonDetailConsole';
import CalendarModal from '@/components/CalendarModal';

export default function HomePage() {
  const { executives, isLiveSheet } = usePersonnelData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExecutiveId, setSelectedExecutiveId] = useState<string | null>(null);
  const [calendarModalName, setCalendarModalName] = useState<string | null>(null);

  const detailConsoleRef = useRef<HTMLDivElement>(null);

  const dean = executives['boonlert'] || Object.values(executives)[0];
  const viceDeans = useMemo(() => {
    return Object.values(executives).filter((p) => p.id !== 'boonlert');
  }, [executives]);

  const term = searchTerm.trim().toLowerCase();

  const isPersonMatch = (p: ExecutiveDetail | undefined) => {
    if (!p) return false;
    if (!term) return true;
    return (
      p.name.toLowerCase().includes(term) ||
      p.position.toLowerCase().includes(term) ||
      p.email.toLowerCase().includes(term) ||
      p.phone.toLowerCase().includes(term)
    );
  };

  const isDeanVisible = isPersonMatch(dean);
  const matchedViceDeans = viceDeans.filter(isPersonMatch);
  const isViceDeansVisible = matchedViceDeans.length > 0;
  const hasResults = isDeanVisible || isViceDeansVisible;

  const handleCardClick = (id: string) => {
    setSelectedExecutiveId(id);
    setTimeout(() => {
      detailConsoleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleCloseDetail = () => {
    setSelectedExecutiveId(null);
  };

  const selectedPerson = selectedExecutiveId ? executives[selectedExecutiveId] : null;

  return (
    <div className="w-full flex-grow flex flex-col">
      {/* Hero / Banner Section */}
      <section className="bg-gradient-to-b from-slate-900 via-sky-950 to-blue-950 border-b border-sky-900/40 py-8 px-4 text-center relative shadow-md">
        <div className="relative z-10 max-w-2xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-2 bg-sky-900/80 border border-sky-500/30 text-sky-300 text-xs px-3.5 py-1 rounded-full font-bold uppercase">
              <i className="fa-solid fa-graduation-cap text-sky-400"></i> Faculty of Industrial Technology
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-heading">
            ทำเนียบคณะผู้บริหาร
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto">
            คณะเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยนครพนม
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
      <main className="w-full flex-grow py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {!hasResults ? (
          <div className="text-center py-16 animate-fadeIn">
            <div className="bg-white/80 backdrop-blur-md max-w-md mx-auto p-8 rounded-3xl shadow-md border border-slate-200">
              <i className="fa-solid fa-triangle-exclamation text-amber-500 text-4xl mb-3"></i>
              <h3 className="text-base font-bold text-slate-800 font-heading">ไม่พบข้อมูลบุคลากรที่ค้นหา</h3>
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
          <div className="space-y-14">
            {/* 1. คณบดี */}
            {isDeanVisible && dean && (
              <section className="flex flex-col items-center">
                <div className="mb-5 text-center">
                  <span className="inline-flex items-center gap-2 bg-sky-800 text-white font-bold text-xs sm:text-sm px-6 py-2 rounded-full shadow-md">
                    ผู้บริหารสูงสุด
                  </span>
                </div>

                <div className="flex justify-center w-full">
                  <PersonnelCard
                    person={{
                      name: dean.name,
                      position: dean.position,
                      img: dean.img,
                      email: dean.email,
                      phone: dean.phone,
                      location: dean.room,
                      calendarName: dean.name,
                    }}
                    variant="executive"
                    isSelected={selectedExecutiveId === dean.id}
                    isClickable
                    onClick={() => handleCardClick(dean.id)}
                    onOpenProfile={() => handleCardClick(dean.id)}
                    onOpenCalendar={(name) => setCalendarModalName(name)}
                  />
                </div>
              </section>
            )}

            {/* 2. รองคณบดี */}
            {isViceDeansVisible && (
              <section>
                <div className="text-center mb-8">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 inline-block relative font-heading after:content-[''] after:block after:w-12 after:h-1 after:bg-sky-600 after:mx-auto after:mt-2 after:rounded-full">
                    รองคณบดี
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch justify-items-center">
                  {matchedViceDeans.map((vd) => (
                    <PersonnelCard
                      key={vd.id}
                      person={{
                        name: vd.name,
                        position: vd.position,
                        img: vd.img,
                        email: vd.email,
                        phone: vd.phone,
                        location: vd.room,
                        calendarName: vd.name,
                      }}
                      variant="executive"
                      isSelected={selectedExecutiveId === vd.id}
                      isClickable
                      onClick={() => handleCardClick(vd.id)}
                      onOpenProfile={() => handleCardClick(vd.id)}
                      onOpenCalendar={(name) => setCalendarModalName(name)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Translucent Glassmorphism Console Detail */}
            <div ref={detailConsoleRef}>
              <PersonDetailConsole
                person={selectedPerson}
                onClose={handleCloseDetail}
                onOpenCalendar={(name) => setCalendarModalName(name)}
              />
            </div>
          </div>
        )}
      </main>

      {/* Calendar Modal */}
      <CalendarModal
        isOpen={!!calendarModalName}
        officerName={calendarModalName || ''}
        onClose={() => setCalendarModalName(null)}
      />
    </div>
  );
}
