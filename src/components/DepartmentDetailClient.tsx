'use client';

import { useState, useEffect } from 'react';
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

  // Auth State
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Edit / Add Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Personnel | null>(null);
  const [formData, setFormData] = useState({
    nameTh: '',
    nameEn: '',
    position: 'อาจารย์ประจำสาขาวิชา',
    isHead: false,
    email: '',
    phone: '',
    location: '',
    imageUrl: '',
    calendarUrl: '',
    researchInterests: '',
    education: '',
    skills: '',
  });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState({ text: '', ok: true });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const admin = localStorage.getItem('hr_admin_session') === 'true';
      setIsAdmin(admin);
      const userStr = localStorage.getItem('hr_user_session');
      if (userStr) {
        try {
          const u = JSON.parse(userStr);
          setUserEmail((u.email || '').toLowerCase().trim());
        } catch {}
      }
    }
  }, []);

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

  // ─── Modal Openers ───
  const openAddLecturer = () => {
    setEditingPerson(null);
    setFormData({
      nameTh: '',
      nameEn: '',
      position: 'อาจารย์ประจำสาขาวิชา',
      isHead: false,
      email: '',
      phone: '042-503-777',
      location: department.title,
      imageUrl: '/img/avatar-placeholder.svg',
      calendarUrl: '',
      researchInterests: '',
      education: '',
      skills: '',
    });
    setSaveMsg({ text: '', ok: true });
    setShowEditModal(true);
  };

  const openEditLecturer = (p: Personnel) => {
    setEditingPerson(p);
    const isHead = department.head?.name === p.name || (p as any).isHead === true;
    setFormData({
      nameTh: p.name || '',
      nameEn: p.nameEn || p.calendarName || '',
      position: p.position || 'อาจารย์ประจำสาขาวิชา',
      isHead: Boolean(isHead),
      email: p.email || '',
      phone: p.phone || '',
      location: p.location || department.title,
      imageUrl: p.img || '',
      calendarUrl: '',
      researchInterests: p.researchInterests || '',
      education: Array.isArray(p.education) ? p.education.join('\n') : p.education || '',
      skills: Array.isArray(p.skills) ? p.skills.join('\n') : p.skills || '',
    });
    setSaveMsg({ text: '', ok: true });
    setShowEditModal(true);
  };

  // ─── Save to Local Overrides & Google Sheets ───
  const handleSaveLecturer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg({ text: '', ok: true });

    const key = formData.email ? formData.email.toLowerCase().trim() : (formData.nameTh.trim() || `lec-${Date.now()}`);
    const originalKey = editingPerson ? (editingPerson.email ? editingPerson.email.toLowerCase().trim() : editingPerson.name.trim()) : key;

    const payload = {
      id: key,
      nameTh: formData.nameTh.trim(),
      name: formData.nameTh.trim(),
      nameEn: formData.nameEn.trim(),
      calendarName: formData.nameEn.trim() || formData.nameTh.trim(),
      position: formData.position.trim(),
      departmentSlug: department.slug,
      department: department.title,
      isHead: formData.isHead,
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      location: formData.location.trim(),
      imageUrl: formData.imageUrl.trim() || '/img/avatar-placeholder.svg',
      img: formData.imageUrl.trim() || '/img/avatar-placeholder.svg',
      researchInterests: formData.researchInterests.trim(),
      education: formData.education.split('\n').map((s) => s.trim()).filter(Boolean),
      skills: formData.skills.split('\n').map((s) => s.trim()).filter(Boolean),
      updatedAt: new Date().toISOString(),
    };

    // 1. Update localStorage overrides
    if (typeof window !== 'undefined') {
      let overrides: Record<string, any> = {};
      try { overrides = JSON.parse(localStorage.getItem('hr_personnel_overrides') || '{}'); } catch {}
      overrides[key] = payload;
      if (originalKey && originalKey !== key) {
        overrides[originalKey] = payload;
      }
      if (formData.nameTh) {
        overrides[formData.nameTh.trim()] = payload;
      }
      localStorage.setItem('hr_personnel_overrides', JSON.stringify(overrides));
      window.dispatchEvent(new Event('hr_personnel_updated'));
    }

    // 2. Sync to Google Apps Script Web App
    const defaultApiUrl = 'https://script.google.com/macros/s/AKfycbwlkKm94MbwsFcL0s-KTqnEV3hIyEbo-1GSXd7tIQKM-uAW1lpKbfs4sSXimK-ZQaOCrQ/exec';
    const scriptUrl = (typeof window !== 'undefined' && localStorage.getItem('hr_sheet_api_url')) || process.env.NEXT_PUBLIC_SHEET_API_URL || defaultApiUrl;
    let syncedToGoogle = false;
    let errorDetail = '';

    if (scriptUrl) {
      try {
        const res = await fetch(scriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: editingPerson ? 'updateProfile' : 'savePersonnel',
            originalEmail: editingPerson?.email || '',
            originalName: editingPerson?.name || '',
            email: editingPerson?.email || formData.email,
            name: editingPerson?.name || formData.nameTh,
            nameTh: formData.nameTh,
            nameEn: formData.nameEn,
            departmentSlug: department.slug,
            data: payload,
          }),
        });
        const textRes = await res.text();
        try {
          const r = JSON.parse(textRes);
          if (r && r.success) {
            syncedToGoogle = true;
          } else if (r && r.error) {
            errorDetail = r.error;
          }
        } catch {
          if (textRes.includes('ต้องมีสิทธิ์เข้าถึง') || textRes.includes('accounts.google.com')) {
            errorDetail = 'ติดสิทธิ์เข้าถึงใน Google Apps Script';
          }
        }
      } catch (err: any) {
        errorDetail = err?.message || 'เชื่อมต่อเครือข่ายล้มเหลว';
      }
    }

    setSaving(false);
    if (syncedToGoogle) {
      setSaveMsg({ text: '✓ ข้อมูลถูกบันทึกลงใน Google Sheets และหน้าเว็บเรียบร้อยแล้ว!', ok: true });
      setTimeout(() => {
        setShowEditModal(false);
      }, 1500);
    } else {
      setSaveMsg({
        text: `⚠️ ข้อมูลอัปเดตบนหน้าเว็บแล้ว แต่ Google Sheets ยังไม่บันทึก (${errorDetail || 'ไม่พบข้อมูล'}) กรุณานำโค้ด Apps Script ชุดล่าสุดไปวางในชีต`,
        ok: false,
      });
    }
  };

  return (
    <div className="w-full flex-grow flex flex-col">
      {/* Sub-header navigation with Department Dropdown */}
      <div className="bg-slate-900 border-b border-slate-800 text-white py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link
            href="/lecturers"
            className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>กลับหน้ารายชื่อสาขาวิชา</span>
          </Link>

          <div className="flex items-center gap-2.5">
            {/* Add Lecturer Button (ONLY visible to Admin) */}
            {isAdmin && (
              <button
                onClick={openAddLecturer}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-sm"
                title="เพิ่มอาจารย์ประจำสาขาวิชานี้ (เฉพาะผู้ดูแลระบบ)"
              >
                <i className="fa-solid fa-user-plus text-xs"></i>
                <span>เพิ่มอาจารย์ในสาขานี้</span>
              </button>
            )}

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
              <div className="flex justify-center gap-2 mt-4">
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-xl text-xs font-semibold border border-sky-200 transition-colors"
                >
                  ล้างการค้นหา
                </button>
                {isAdmin && (
                  <button
                    onClick={openAddLecturer}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    + เพิ่มอาจารย์ใหม่
                  </button>
                )}
              </div>
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
                    onEdit={isAdmin ? (p) => openEditLecturer(p) : undefined}
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
                      onEdit={isAdmin ? (p) => openEditLecturer(p) : undefined}
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
        onEdit={isAdmin ? (p) => openEditLecturer(p) : undefined}
      />

      {/* Calendar Modal */}
      <CalendarModal
        isOpen={!!calendarModalName}
        officerName={calendarModalName || ''}
        onClose={() => setCalendarModalName(null)}
      />

      {/* ─── In-Page Add / Edit Lecturer Modal ─── */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-fadeIn">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300">
                  <i className={`fa-solid ${editingPerson ? 'fa-user-pen' : 'fa-user-plus'}`} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    {editingPerson ? 'แก้ไขข้อมูลอาจารย์' : 'เพิ่มอาจารย์ใหม่'}
                  </h3>
                  <p className="text-xs text-sky-300">{department.title}</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveLecturer} className="p-6 overflow-y-auto space-y-4 flex-grow">
              {saveMsg.text && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    saveMsg.ok ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  <i className={`fa-solid ${saveMsg.ok ? 'fa-circle-check' : 'fa-circle-exclamation'}`} />
                  {saveMsg.text}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ชื่อ-นามสกุล (ภาษาไทย) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameTh}
                    onChange={(e) => setFormData({ ...formData, nameTh: e.target.value })}
                    placeholder="ผศ.ดร. สมชาย ใจดี"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ชื่อ-นามสกุล (ภาษาอังกฤษ)
                  </label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="Asst. Prof. Dr. Somchai Jaidee"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ตำแหน่ง</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="อาจารย์ประจำสาขาวิชา"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isHead}
                      onChange={(e) => setFormData({ ...formData, isHead: e.target.checked })}
                      className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-400"
                    />
                    <span className="text-xs font-bold text-slate-800">เป็นหัวหน้าหลักสูตรสาขาวิชา</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">อีเมล (@npu.ac.th)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="somchai@npu.ac.th"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">เบอร์โทรศัพท์</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="042-503-777"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">ห้องทำงาน / สถานที่</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder={department.title}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">URL รูปภาพโปรไฟล์</label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="/img/somchai.jpg หรือ https://..."
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">ความเชี่ยวชาญ / งานวิจัย</label>
                  <input
                    type="text"
                    value={formData.researchInterests}
                    onChange={(e) => setFormData({ ...formData, researchInterests: e.target.value })}
                    placeholder="วิศวกรรมไฟฟ้า, พลังงานหมุนเวียน, ..."
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white transition flex items-center gap-1.5 shadow-md disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin" />
                      <span>กำลังบันทึก...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-cloud-arrow-up" />
                      <span>บันทึกข้อมูลลงชีต</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
