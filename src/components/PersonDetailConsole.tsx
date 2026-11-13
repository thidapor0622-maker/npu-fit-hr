'use client';

import { useState } from 'react';
import { ExecutiveDetail } from '@/data/executives';
import { getAssetPath } from '@/lib/assetHelper';

interface PersonDetailConsoleProps {
  person: ExecutiveDetail | null;
  onClose: () => void;
  onOpenCalendar: (name: string) => void;
}

export default function PersonDetailConsole({
  person,
  onClose,
  onOpenCalendar,
}: PersonDetailConsoleProps) {
  const [imgErr, setImgErr] = useState(false);

  if (!person) return null;

  return (
    <section id="personDetailSection" className="mt-14 relative animate-fadeIn">
      {/* Ambient Glow Lights */}
      <div className="ambient-glow absolute -top-12 -left-10 w-72 h-72 rounded-full bg-sky-400"></div>
      <div className="ambient-glow absolute -bottom-10 -right-10 w-80 h-80 rounded-full bg-blue-500"></div>

      {/* Main Glassmorphic Container */}
      <div className="relative bg-white/70 backdrop-blur-2xl rounded-[2.5rem] p-6 sm:p-9 lg:p-11 shadow-[0_25px_60px_-15px_rgba(2,132,199,0.25)] border border-white/60 overflow-hidden">
        {/* Neon Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-80"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-500 hover:text-slate-900 w-10 h-10 rounded-2xl bg-white/70 hover:bg-white shadow-sm flex items-center justify-center transition-all hover:scale-105 z-10"
          title="ปิดรายละเอียด"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        <div className="flex flex-col lg:flex-row gap-9 items-start relative z-10">
          {/* Left Column: Image & Basic Info */}
          <div className="w-full lg:w-1/3 flex flex-col items-center text-center">
            {/* Image Box */}
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden shadow-xl bg-sky-900/5 mb-3.5 relative group border-2 border-white">
              <img
                src={imgErr ? getAssetPath('/img/avatar-placeholder.svg') : getAssetPath(person.img)}
                alt={person.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={() => setImgErr(true)}
              />
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-0.5 tracking-tight">
              {person.name}
            </h3>
            <p className="text-sky-900 font-bold text-xs bg-sky-200/60 backdrop-blur-md px-4 py-1.5 rounded-full mb-4 inline-block shadow-sm">
              {person.position}
            </p>

            {/* Duty Status Card */}
            <div className="w-full bg-white/70 backdrop-blur-md rounded-2xl p-4 text-left space-y-2 shadow-sm border border-white/60">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <i className="fa-solid fa-signal text-sky-600"></i> สถานะการปฏิบัติงาน
                </span>
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  พร้อมติดต่อ
                </span>
              </div>
              <p className="text-xs font-bold text-slate-800">{person.dutyStatus}</p>
              <p className="text-[11px] text-slate-600 flex items-center gap-1.5">
                <i className="fa-regular fa-clock text-sky-600"></i> {person.workingHours}
              </p>
              <p className="text-[11px] text-slate-600 flex items-center gap-1.5">
                <i className="fa-solid fa-door-open text-sky-600"></i> {person.room}
              </p>
            </div>

            {/* Contact Details Card */}
            <div className="w-full bg-white/60 backdrop-blur-md rounded-2xl p-4 mt-3 text-left text-xs space-y-2 text-slate-700 shadow-sm border border-white/60">
              <p className="truncate">
                <i className="fa-solid fa-envelope text-sky-600 w-4"></i>{' '}
                <a href={`mailto:${person.email}`} className="hover:text-sky-600 transition-colors">
                  {person.email}
                </a>
              </p>
              <p>
                <i className="fa-solid fa-phone text-sky-600 w-4"></i>{' '}
                <a
                  href={`tel:${person.phone.replace(/[^0-9+]/g, '')}`}
                  className="hover:text-sky-600 transition-colors"
                >
                  {person.phone}
                </a>
              </p>
              <p className="truncate">
                <a
                  href={person.mapQuery}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sky-600 inline-flex items-center gap-1.5 text-sky-700 font-semibold transition-colors"
                >
                  <i className="fa-solid fa-location-dot text-sky-600 w-4"></i> แผนที่พิกัดสำนักงาน
                </a>
              </p>
            </div>
          </div>

          {/* Right Column: Bio, Skills, Education, Works */}
          <div className="w-full lg:w-2/3 space-y-5">
            <div>
              <span className="text-[11px] font-extrabold text-sky-700 tracking-wider uppercase flex items-center gap-1.5">
                <i className="fa-solid fa-bolt text-sky-500 text-xs"></i> Personnel Comprehensive Data
              </span>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 tracking-tight font-heading">
                ข้อมูลประวัติและความเชี่ยวชาญ
              </h4>
            </div>

            {/* Skills Badges */}
            <div className="bg-white/65 backdrop-blur-md p-5 sm:p-6 rounded-3xl shadow-sm border border-white/60 hover:bg-white/80 transition-all">
              <h5 className="text-xs font-extrabold text-slate-700 mb-3 flex items-center gap-2">
                <i className="fa-solid fa-microchip text-sky-600"></i> ความถนัดและความเชี่ยวชาญเฉพาะด้าน
              </h5>
              <div className="flex flex-wrap gap-2">
                {person.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-white/90 hover:bg-white text-sky-900 text-xs font-semibold px-3.5 py-1.5 rounded-xl shadow-sm backdrop-blur-sm flex items-center gap-1.5 hover:scale-105 transition-all border border-sky-100"
                  >
                    <i className="fa-solid fa-bolt text-sky-500 text-[10px]"></i> {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="bg-white/65 backdrop-blur-md p-5 sm:p-6 rounded-3xl shadow-sm border border-white/60 hover:bg-white/80 transition-all">
              <h5 className="text-xs font-extrabold text-slate-700 mb-3 flex items-center gap-2">
                <i className="fa-solid fa-graduation-cap text-sky-600"></i> ประวัติการศึกษา
              </h5>
              <ul className="text-xs sm:text-sm text-slate-700 space-y-2">
                {person.education.map((edu, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <i className="fa-solid fa-angle-right text-sky-500 text-xs"></i>
                    <span>{edu}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Works / Responsibilities */}
            <div className="bg-white/65 backdrop-blur-md p-5 sm:p-6 rounded-3xl shadow-sm border border-white/60 hover:bg-white/80 transition-all">
              <h5 className="text-xs font-extrabold text-slate-700 mb-3 flex items-center gap-2">
                <i className="fa-solid fa-chart-line text-sky-600"></i> ภาระหน้าที่และผลงานขับเคลื่อนคณะ
              </h5>
              <ul className="text-xs sm:text-sm text-slate-700 space-y-2">
                {person.works.map((work, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <i className="fa-solid fa-check text-sky-600 mt-1 text-xs"></i>
                    <span>{work}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Open Calendar Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => onOpenCalendar(person.name)}
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-lg shadow-sky-600/25 hover:shadow-sky-600/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <i className="fa-regular fa-calendar-check text-sm"></i> ดูตารางปฏิทินปฏิบัติราชการ
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
