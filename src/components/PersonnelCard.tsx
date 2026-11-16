'use client';

import { useState, useEffect } from 'react';
import { getAssetPath } from '@/lib/assetHelper';
import { Personnel } from '@/data/departments';
import {
  formatEnglishName,
  formatThaiName,
  getResearchInterests,
  getPersonnelCode,
} from '@/lib/personnelHelper';

interface PersonnelCardProps {
  person: Personnel;
  deptTitle?: string;
  deptTitleEn?: string;
  deptSlug?: string;
  index?: number;
  isSelected?: boolean;
  isCurrentUser?: boolean;
  onClick?: () => void;
  onOpenCalendar?: (name: string) => void;
  onOpenProfile?: (person: Personnel) => void;
  onEdit?: (person: Personnel) => void;
  isClickable?: boolean;
  variant?: 'academic' | 'executive';
}

export default function PersonnelCard({
  person,
  deptTitle,
  deptTitleEn,
  deptSlug,
  index = 0,
  isSelected = false,
  isCurrentUser = false,
  onClick,
  onOpenCalendar,
  onOpenProfile,
  onEdit,
  isClickable = false,
  variant = 'academic',
}: PersonnelCardProps) {
  const [imgSrc, setImgSrc] = useState(getAssetPath(person.img || '/img/avatar-placeholder.svg'));
  const [isSelf, setIsSelf] = useState(isCurrentUser);

  useEffect(() => {
    if (isCurrentUser) {
      setIsSelf(true);
      return;
    }
    if (typeof window !== 'undefined') {
      try {
        const raw = (localStorage.getItem('hr_user_session') || '').toLowerCase();
        if (raw) {
          const pEmail = String(person.email || '').toLowerCase().trim();
          const pName = String(person.name || '');
          const pCal = String(person.calendarName || '');
          if (raw.includes('kowit') && (pName.includes('โกวิท') || pCal.includes('โกวิท') || pEmail.includes('kowit'))) {
            setIsSelf(true);
          } else if (pEmail && raw.includes(pEmail.split('@')[0])) {
            setIsSelf(true);
          }
        }
      } catch {}
    }
  }, [isCurrentUser, person]);

  const englishName = formatEnglishName(person);
  const thaiName = formatThaiName(person.name);
  const majorTitle = deptTitleEn || deptTitle || person.location || 'Faculty Member';
  const personCode = getPersonnelCode(person, index);
  const research = getResearchInterests(person, deptSlug, index);

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenProfile) {
      onOpenProfile(person);
    } else if (onClick) {
      onClick();
    }
  };

  const handleEmailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // If executive variant is explicitly requested (e.g. for Dean console on index page)
  if (variant === 'executive') {
    const execInner = (
      <div className="p-5 flex flex-col items-center text-center flex-grow">
        <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden border border-slate-200 mb-3 bg-slate-50 shadow-inner mx-auto relative">
          <img
            src={imgSrc}
            alt={person.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgSrc(getAssetPath('/img/avatar-placeholder.svg'))}
          />
        </div>

        <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-1 leading-snug font-heading">
          {person.name}
        </h4>

        <p className="text-sky-900 font-semibold text-xs mb-3 min-h-[40px] flex items-center justify-center bg-sky-50 w-full rounded-xl py-1.5 px-2 border border-sky-100">
          {person.position}
        </p>

        <div className="w-full flex items-center justify-center gap-2 mt-auto pt-2">
          {person.email && (
            <a
              href={`mailto:${person.email}`}
              onClick={handleEmailClick}
              className="w-10 h-10 rounded-xl border border-slate-700 hover:border-sky-600 hover:bg-sky-50 text-slate-800 hover:text-sky-600 flex items-center justify-center transition-all"
              title={`ส่งอีเมลถึง ${person.name}`}
            >
              <i className="fa-regular fa-envelope text-sm"></i>
            </a>
          )}

          <button
            type="button"
            onClick={handleProfileClick}
            className="flex-grow px-4 py-2 rounded-xl border-2 border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <i className="fa-regular fa-id-badge text-sm"></i>
            <span>Profile</span>
          </button>
        </div>
      </div>
    );

    if (isCurrentUser || isSelf) {
      return (
        <div
          id="current-user-card"
          style={{
            padding: '4px',
            borderRadius: '28px',
            background: 'linear-gradient(180deg, #059669 0%, #10b981 40%, #34d399 75%, #a7f3d0 100%)',
            boxShadow: '0 12px 35px rgba(16, 185, 129, 0.45)',
          }}
          className="w-full max-w-[284px] flex flex-col transition-all relative transform hover:scale-[1.01]"
        >
          <div
            style={{
              background: 'linear-gradient(90deg, #059669 0%, #10b981 50%, #14b8a6 100%)',
            }}
            className="absolute -top-3.5 right-4 z-30 flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-[11px] font-extrabold shadow-lg shadow-emerald-600/40 border-2 border-white"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <i className="fa-solid fa-circle-user text-xs" />
            <span>โปรไฟล์ของคุณ</span>
          </div>
          <div
            onClick={isClickable && onClick ? onClick : undefined}
            style={{ borderRadius: '24px' }}
            className={`personnel-card group bg-white shadow-sm flex flex-col h-full w-full overflow-hidden ${
              isClickable ? 'cursor-pointer' : ''
            }`}
          >
            {execInner}
          </div>
        </div>
      );
    }

    return (
      <div
        onClick={isClickable && onClick ? onClick : undefined}
        className={`personnel-card group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all border flex flex-col h-full w-full max-w-[280px] overflow-hidden ${
          isClickable ? 'cursor-pointer' : ''
        } ${
          isSelected
            ? 'selected-card border-sky-500 ring-2 ring-sky-400'
            : 'border-slate-200 hover:border-sky-400'
        }`}
      >
        {execInner}
      </div>
    );
  }

  // Academic Variant Content
  const academicContent = (
    <div className="flex flex-col flex-grow">
      {/* 1. Portrait Image (Aspect ratio 4:5 with rounded-2xl as in picture) */}
      <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden border border-slate-200/80 mb-4 bg-slate-50 shadow-inner relative flex-shrink-0">
        <img
          src={imgSrc}
          alt={person.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgSrc(getAssetPath('/img/avatar-placeholder.svg'))}
        />
      </div>

      {/* 2. Names & Department Details */}
      <div className="space-y-1 mb-4">
        {/* English Name / Title (Bold dark as in picture) */}
        <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug font-heading line-clamp-1">
          {englishName}
        </h4>

        {/* Thai Name & Academic Title */}
        <p className="text-xs sm:text-sm text-slate-700 font-medium leading-tight line-clamp-1">
          {thaiName}
        </p>

        {/* Major / Department (e.g. Civil Engineering) */}
        <p className="text-xs sm:text-sm text-slate-600 font-medium line-clamp-1 pt-0.5">
          {majorTitle}
        </p>

        {/* Employee ID / Phone Ext */}
        <p className="text-[11px] text-slate-400 font-medium">
          {personCode}
        </p>
      </div>

      {/* 3. Action Buttons Row (Right under the name/id): [Email Icon] [Profile Button] */}
      <div className="flex items-center justify-end gap-2 mb-4">
        {/* Square Email Button */}
        {person.email && (
          <a
            href={`mailto:${person.email}`}
            onClick={handleEmailClick}
            className="w-9 h-9 rounded-xl border border-slate-700 hover:border-sky-600 hover:bg-sky-50 text-slate-800 hover:text-sky-600 flex items-center justify-center transition-all flex-shrink-0"
            title={`ส่งอีเมล: ${person.email}`}
          >
            <i className="fa-regular fa-envelope text-sm"></i>
          </a>
        )}

        {/* Profile Button with ID Badge Icon */}
        <button
          type="button"
          onClick={handleProfileClick}
          className="flex-grow px-3.5 py-2 rounded-xl border-2 border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all"
          title="เปิดดูประวัติและผลงาน (Profile)"
        >
          <i className="fa-regular fa-id-badge text-sm"></i>
          <span>Profile</span>
        </button>
      </div>

      {/* 4. Research interests Section (Outlined Pill Tag + Description as in picture) */}
      <div className="pt-2 border-t border-slate-100 mt-auto">
        <span className="inline-block border border-slate-700 rounded-full px-3 py-0.5 text-[11px] font-semibold text-slate-800 mb-1.5">
          Research interests
        </span>
        <p
          className="text-xs text-slate-600 line-clamp-2 leading-relaxed"
          title={research}
        >
          {research}
        </p>
      </div>
    </div>
  );

  // If this card belongs to the currently logged in user: Wrap with a vibrant 4px green gradient border!
  if (isCurrentUser || isSelf) {
    return (
      <div
        id="current-user-card"
        style={{
          padding: '4px',
          borderRadius: '28px',
          background: 'linear-gradient(180deg, #059669 0%, #10b981 40%, #34d399 75%, #a7f3d0 100%)',
          boxShadow: '0 12px 35px rgba(16, 185, 129, 0.45)',
        }}
        className="w-full max-w-[314px] flex flex-col transition-all relative transform hover:scale-[1.01]"
      >
        {/* Floating User Badge */}
        <div
          style={{
            background: 'linear-gradient(90deg, #059669 0%, #10b981 50%, #14b8a6 100%)',
          }}
          className="absolute -top-3.5 right-4 z-30 flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-[11px] font-extrabold shadow-lg shadow-emerald-600/40 border-2 border-white"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <i className="fa-solid fa-circle-user text-xs" />
          <span>โปรไฟล์ของคุณ</span>
        </div>

        <div
          onClick={isClickable && onClick ? onClick : undefined}
          style={{ borderRadius: '24px' }}
          className={`bg-white p-5 flex flex-col justify-between h-full w-full relative overflow-hidden ${
            isClickable ? 'cursor-pointer' : ''
          }`}
        >
          {academicContent}
        </div>
      </div>
    );
  }

  // Normal Academic Card
  return (
    <div
      onClick={isClickable && onClick ? onClick : undefined}
      className={`group bg-white rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all border border-slate-200/90 hover:border-sky-400 flex flex-col justify-between h-full w-full max-w-[310px] relative overflow-hidden ${
        isClickable ? 'cursor-pointer' : ''
      }`}
    >
      {academicContent}
    </div>
  );
}
