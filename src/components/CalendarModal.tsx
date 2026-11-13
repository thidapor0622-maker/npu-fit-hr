'use client';

import { useEffect } from 'react';

interface CalendarModalProps {
  isOpen: boolean;
  officerName: string;
  onClose: () => void;
}

export default function CalendarModal({ isOpen, officerName, onClose }: CalendarModalProps) {
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center transition-colors"
          title="ปิดหน้าต่าง"
        >
          <i className="fa-solid fa-xmark text-base"></i>
        </button>

        <div className="mb-5 pr-8">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <i className="fa-regular fa-calendar-check text-sky-600 text-xl"></i> ปฏิทินปฏิบัติราชการ
          </h3>
          <p className="text-sky-700 font-bold text-sm mt-0.5">{officerName}</p>
        </div>

        <div className="bg-slate-50 rounded-xl p-2 border border-slate-200 overflow-hidden">
          <iframe
            src="https://calendar.google.com/calendar/embed?src=th.thailand%23holiday%40group.v.calendar.google.com&ctz=Asia%2FBangkok"
            style={{ border: 0 }}
            width="100%"
            height="340"
            frameBorder="0"
            scrolling="no"
            className="rounded-lg w-full"
            title={`ปฏิทินปฏิบัติราชการ - ${officerName}`}
          />
        </div>
      </div>
    </div>
  );
}
