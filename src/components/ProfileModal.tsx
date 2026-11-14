'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Personnel } from '@/data/departments';
import { formatEnglishName, formatThaiName, getResearchInterests } from '@/lib/personnelHelper';
import { getAssetPath } from '@/lib/assetHelper';

interface ProfileModalProps {
  person: Personnel | null;
  deptTitle?: string;
  deptTitleEn?: string;
  deptSlug?: string;
  isOpen: boolean;
  onClose: () => void;
  onOpenCalendar?: (name: string) => void;
  onEdit?: (person: Personnel) => void;
}

export default function ProfileModal({
  person,
  deptTitle,
  deptTitleEn,
  deptSlug,
  isOpen,
  onClose,
  onOpenCalendar,
  onEdit,
}: ProfileModalProps) {
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !person) return null;

  const englishName = formatEnglishName(person);
  const thaiName = formatThaiName(person.name);
  const research = getResearchInterests(person, deptSlug);
  const displayDept = deptTitle || person.location || 'คณะเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยนครพนม';
  const displayDeptEn = deptTitleEn || 'Faculty of Industrial Technology';

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gradient Stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-500 via-blue-600 to-sky-700"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors z-10"
          title="ปิดหน้าต่าง"
        >
          <i className="fa-solid fa-xmark text-base"></i>
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto pr-1 space-y-6 pt-2">
          {/* Header Info: Portrait & Names */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Portrait Image */}
            <div className="w-36 h-48 sm:w-44 sm:h-56 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-md bg-slate-50 flex-shrink-0">
              <img
                src={imgErr ? getAssetPath('/img/avatar-placeholder.svg') : getAssetPath(person.img || '/img/avatar-placeholder.svg')}
                alt={person.name}
                className="w-full h-full object-cover"
                onError={() => setImgErr(true)}
              />
            </div>

            {/* Names & Department */}
            <div className="flex-grow text-center sm:text-left space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold">
                <i className="fa-solid fa-graduation-cap"></i> บุคลากรประจำสาขาวิชา
              </span>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading leading-tight">
                {englishName}
              </h3>
              <h4 className="text-base sm:text-lg font-semibold text-slate-700 leading-snug">
                {thaiName}
              </h4>

              <p className="text-sky-700 font-medium text-xs sm:text-sm">
                {person.position}
              </p>

              <p className="text-slate-500 text-xs">
                {displayDept} {deptTitleEn ? `(${displayDeptEn})` : ''}
              </p>

              {/* Quick Contacts */}
              <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                {person.email && (
                  <a
                    href={`mailto:${person.email}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-600 text-xs transition border border-slate-200"
                  >
                    <i className="fa-solid fa-envelope text-sky-600"></i>
                    <span>{person.email}</span>
                  </a>
                )}

                {person.phone && (
                  <a
                    href={`tel:${person.phone.replace(/[^0-9+]/g, '')}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-600 text-xs transition border border-slate-200"
                  >
                    <i className="fa-solid fa-phone text-sky-600"></i>
                    <span>{person.phone}</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Research Interests Section (As in reference image) */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="inline-block border border-slate-800 rounded-full px-3 py-0.5 text-xs font-semibold text-slate-800">
                Research interests
              </span>
              <span className="text-xs text-slate-400 font-medium">ความเชี่ยวชาญและงานวิจัย</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {research}
            </p>
          </div>

          {/* Education (if available) */}
          {person.education && person.education.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <i className="fa-solid fa-graduation-cap text-emerald-600"></i> ประวัติการศึกษา
              </h5>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                {person.education.map((edu, idx) => (
                  <li key={idx} className="leading-relaxed">{edu}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills (if available) */}
          {person.skills && person.skills.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <i className="fa-solid fa-star text-amber-500"></i> ทักษะและความเชี่ยวชาญ
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {person.skills.map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-sky-50 text-sky-800 border border-sky-200 rounded-xl text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Office Location & Details */}
          {person.location && (
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <i className="fa-solid fa-location-dot text-sky-600"></i> สถานที่ติดต่อ / ห้องทำงาน
              </h5>
              <p className="text-xs text-slate-600">
                {person.location} คณะเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยนครพนม
              </p>
            </div>
          )}

          {/* Action Row at Bottom: View Calendar & (Admin only) Edit */}
          <div className="pt-3 flex flex-col sm:flex-row gap-2 justify-end items-center border-t border-slate-100">
            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(person);
                }}
                className="w-full sm:w-auto bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 border border-amber-300"
              >
                <i className="fa-solid fa-pen-to-square text-amber-600"></i>
                <span>แก้ไขข้อมูลอาจารย์ (เฉพาะผู้ดูแลระบบ)</span>
              </button>
            )}

            {onOpenCalendar && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCalendar(person.calendarName || person.name);
                }}
                className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <i className="fa-regular fa-calendar-days text-sm"></i>
                <span>ดูปฏิทินปฏิบัติราชการ</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-5 py-2.5 rounded-xl transition"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
