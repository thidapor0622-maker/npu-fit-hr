'use client';

import { useState } from 'react';
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
    return (
      <div
        id={isCurrentUser ? 'current-user-card' : undefined}
        onClick={isClickable && onClick ? onClick : undefined}
        style={isCurrentUser ? {
          border: '3.5px solid transparent',
          backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #059669 0%, #10b981 35%, #34d399 70%, #a7f3d0 100%)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          boxShadow: '0 16px 36px -6px rgba(16, 185, 129, 0.35), 0 4px 12px -2px rgba(16, 185, 129, 0.15)',
        } : undefined}
        className={`personnel-card group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all border flex flex-col h-full w-full max-w-[280px] relative overflow-hidden ${
          isClickable ? 'cursor-pointer' : ''
        } ${
          isCurrentUser
            ? 'ring-2 ring-emerald-400/50 ring-offset-2 ring-offset-emerald-50 scale-[1.02]'
            : isSelected
              ? 'selected-card border-sky-500 ring-2 ring-sky-400'
              : 'border-slate-200 hover:border-sky-400'
        }`}
      >
        {isCurrentUser && (
          <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 text-white text-[11px] font-bold shadow-md shadow-emerald-600/30">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <i className="fa-solid fa-circle-user text-xs" />
            <span>โปรไฟล์ของคุณ</span>
          </div>
        )}
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
      </div>
    );
  }

  // Academic Variant (Exact Match to User's Uploaded Sample Image)
  return (
    <div
      id={isCurrentUser ? 'current-user-card' : undefined}
      onClick={isClickable && onClick ? onClick : undefined}
      style={isCurrentUser ? {
        border: '3.5px solid transparent',
        backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #059669 0%, #10b981 35%, #34d399 70%, #a7f3d0 100%)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
        boxShadow: '0 16px 36px -6px rgba(16, 185, 129, 0.35), 0 4px 12px -2px rgba(16, 185, 129, 0.15)',
      } : undefined}
      className={`group bg-white rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between h-full w-full max-w-[310px] relative overflow-hidden ${
        isClickable ? 'cursor-pointer' : ''
      } ${
        isCurrentUser
          ? 'ring-2 ring-emerald-400/50 ring-offset-2 ring-offset-emerald-50 scale-[1.02]'
          : 'border border-slate-200/90 hover:border-sky-400'
      }`}
    >
      {/* Current Logged-in User Badge */}
      {isCurrentUser && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 text-white text-[11px] font-bold shadow-md shadow-emerald-600/30">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <i className="fa-solid fa-circle-user text-xs" />
          <span>โปรไฟล์ของคุณ</span>
        </div>
      )}

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
    </div>
  );
}
