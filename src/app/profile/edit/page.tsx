'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAssetPath } from '@/lib/assetHelper';
import { fetchClientGViz } from '@/hooks/usePersonnelData';

interface ProfileData {
  nameEn?: string;
  nameTh?: string;
  email?: string;
  password?: string;
  position?: string;
  department?: string;
  departmentSlug?: string;
  isHead?: boolean;
  phone?: string;
  location?: string;
  researchInterests?: string;
  education?: string[];
  skills?: string[];
  imageUrl?: string;
  calendarUrl?: string;
}

export default function TeacherEditPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({});
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState({ text: '', ok: true });
  const [educationText, setEducationText] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [sheetId, setSheetId] = useState('1s9Cru468Qo81ImgNAd4v8xULsWt51wAuQ4AY3nMg7WU');

  useEffect(() => {
    const userSessionStr = typeof window !== 'undefined' ? localStorage.getItem('hr_user_session') : null;
    const isAdmin = typeof window !== 'undefined' && localStorage.getItem('hr_admin_session') === 'true';

    if (!userSessionStr && !isAdmin) {
      window.location.href = getAssetPath('/login/');
      return;
    }

    const u = userSessionStr ? JSON.parse(userSessionStr) : { email: 'admin@npu.ac.th', name: 'admin' };
    const userEmail = (u.email || '').trim().toLowerCase();
    setEmail(userEmail);

    const targetSheetId = (typeof window !== 'undefined' && localStorage.getItem('hr_custom_sheet_id')) || process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || '1s9Cru468Qo81ImgNAd4v8xULsWt51wAuQ4AY3nMg7WU';
    setSheetId(targetSheetId);

    // Check localStorage custom profile first
    const savedCustom = typeof window !== 'undefined' ? localStorage.getItem(`hr_custom_profile_${userEmail}`) : null;
    if (savedCustom) {
      try {
        const parsed = JSON.parse(savedCustom);
        setProfile(parsed);
        setEducationText((parsed.education || []).join('\n'));
        setSkillsText((parsed.skills || []).join('\n'));
      } catch {}
    }

    // Load from Google Sheets live data
    Promise.all([
      fetchClientGViz(targetSheetId, 'Executives').catch(() => []),
      fetchClientGViz(targetSheetId, 'Lecturers').catch(() => []),
      fetchClientGViz(targetSheetId, 'Staff').catch(() => []),
    ])
      .then(([execs, lecs, staffs]) => {
        const all = [...execs, ...lecs, ...staffs];
        const found = all.find((item) => {
          const itemEmail = String(item.email || '').toLowerCase().trim();
          const itemName = String(item.name || '').trim();
          const itemId = String(item.id || '').toLowerCase().trim();
          return (
            (userEmail && itemEmail === userEmail) ||
            (u.name && itemName.includes(u.name)) ||
            (u.user && itemId === u.user.toLowerCase())
          );
        });

        if (found) {
          const loadedProfile: ProfileData = {
            nameTh: found.name || found.nameTh || '',
            nameEn: found.calendarName || found.nameEn || '',
            email: found.email || userEmail,
            password: found.passwd || found.password || u.currentPassword || 'npu1234',
            position: found.position || '',
            department: found.departmentSlug || found.divisionSlug || found.department || 'สาขาวิชาไฟฟ้ากำลัง',
            departmentSlug: found.departmentSlug || found.divisionSlug || 'electrical-power',
            isHead: String(found.isHead).toLowerCase() === 'true' || found.isHead === true,
            phone: found.phone || '',
            location: found.location || found.room || '',
            imageUrl: found.img || found.imageUrl || '/img/avatar-placeholder.svg',
            calendarUrl: found.calendarUrl || '',
            researchInterests: found.researchInterests || found.interest || '',
            education: found.education ? String(found.education).split('|').map((s: string) => s.trim()).filter(Boolean) : [],
            skills: found.skills ? String(found.skills).split('|').map((s: string) => s.trim()).filter(Boolean) : [],
          };

          setProfile((prev) => ({
            ...loadedProfile,
            ...prev,
            nameTh: prev.nameTh || loadedProfile.nameTh,
            nameEn: prev.nameEn || loadedProfile.nameEn,
            email: prev.email || loadedProfile.email,
            password: prev.password || loadedProfile.password,
            position: prev.position || loadedProfile.position,
            department: prev.department || loadedProfile.department,
            departmentSlug: prev.departmentSlug || loadedProfile.departmentSlug,
            location: prev.location || loadedProfile.location,
            imageUrl: prev.imageUrl || loadedProfile.imageUrl,
            calendarUrl: prev.calendarUrl || loadedProfile.calendarUrl,
            researchInterests: prev.researchInterests || loadedProfile.researchInterests,
          }));

          if (!savedCustom) {
            setEducationText(loadedProfile.education?.join('\n') || '');
            setSkillsText(loadedProfile.skills?.join('\n') || '');
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hr_admin_session');
      localStorage.removeItem('hr_user_session');
    }
    await fetch('/api/teacher/auth', { method: 'DELETE' }).catch(() => {});
    window.location.href = getAssetPath('/login/');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ text: '', ok: true });
    try {
      const activeEmail = (profile.email || email).trim().toLowerCase();
      const payload: ProfileData = {
        ...profile,
        email: activeEmail,
        education: educationText.split('\n').map((s) => s.trim()).filter(Boolean),
        skills: skillsText.split('\n').map((s) => s.trim()).filter(Boolean),
      };

      if (typeof window !== 'undefined' && activeEmail) {
        localStorage.setItem(`hr_custom_profile_${activeEmail}`, JSON.stringify(payload));

        // Save into unified personnel overrides so website updates everywhere
        let overrides: Record<string, any> = {};
        try { overrides = JSON.parse(localStorage.getItem('hr_personnel_overrides') || '{}'); } catch {}
        overrides[activeEmail] = {
          id: activeEmail,
          nameTh: profile.nameTh,
          nameEn: profile.nameEn,
          position: profile.position,
          email: activeEmail,
          password: profile.password,
          phone: profile.phone,
          department: profile.department,
          departmentSlug: profile.departmentSlug || profile.department,
          isHead: Boolean(profile.isHead),
          location: profile.location,
          imageUrl: profile.imageUrl,
          calendarUrl: profile.calendarUrl,
          researchInterests: profile.researchInterests,
          education: payload.education,
          skills: payload.skills,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem('hr_personnel_overrides', JSON.stringify(overrides));
        window.dispatchEvent(new Event('hr_personnel_updated'));
      }

      // 1. Send directly to Google Apps Script Web App to sync into Google Sheets
      const DEFAULT_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwuFLxRE9fBf0nRGb-WaAI6AAHoMabEzdivL9KDAu0sBnP6sDTRtgirwoiYoqdlyfo5/exec';
      const scriptUrl = (typeof window !== 'undefined' && localStorage.getItem('hr_sheet_api_url')) || process.env.NEXT_PUBLIC_SHEET_API_URL || DEFAULT_APPS_SCRIPT_URL;
      let syncedToGoogle = false;
      let permissionWarning = false;

      if (scriptUrl) {
        try {
          const res = await fetch(scriptUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
              action: 'updateProfile',
              originalEmail: email,
              email: activeEmail,
              name: profile.nameTh,
              nameTh: profile.nameTh,
              nameEn: profile.nameEn,
              departmentSlug: profile.departmentSlug || profile.department,
              department: profile.department,
              data: {
                nameTh: profile.nameTh,
                nameEn: profile.nameEn,
                email: activeEmail,
                password: profile.password || 'npu1234',
                position: profile.position,
                department: profile.department,
                departmentSlug: profile.departmentSlug || profile.department,
                isHead: Boolean(profile.isHead),
                phone: profile.phone,
                location: profile.location,
                imageUrl: profile.imageUrl,
                calendarUrl: profile.calendarUrl,
                researchInterests: profile.researchInterests,
                education: payload.education,
                skills: payload.skills,
              },
            }),
          });
          const textRes = await res.text();
          try {
            const result = JSON.parse(textRes);
            if (result && result.success) {
              syncedToGoogle = true;
            }
          } catch {
            if (textRes.includes('ต้องมีสิทธิ์เข้าถึง') || textRes.includes('accounts.google.com')) {
              permissionWarning = true;
            }
          }
        } catch (scriptErr) {
          console.log('Sync to Google Apps Script:', scriptErr);
        }
      }

      fetch('/api/teacher/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {});

      if (syncedToGoogle) {
        setMsg({
          text: '✓ บันทึกข้อมูลสำเร็จ! ข้อมูลถูกส่งไปอัปเดตลง Google Sheets และเว็บไซต์เรียบร้อยแล้วทันที',
          ok: true,
        });
      } else if (permissionWarning) {
        setMsg({
          text: '✓ บันทึกลงเว็บไซต์แล้ว! แต่ Google Sheets ติดสิทธิ์เข้าถึง (กรุณาไปที่ Google Apps Script แล้วตั้งค่า "ผู้มีสิทธิ์เข้าถึง" เป็น "ทุกคน" Anyone)',
          ok: false,
        });
      } else {
        setMsg({
          text: '✓ บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว! ข้อมูลบนหน้าเว็บอัปเดตทันที',
          ok: true,
        });
      }
    } catch (e: any) {
      setMsg({ text: e.message || 'เกิดข้อผิดพลาด', ok: false });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center text-slate-500">
          <i className="fa-solid fa-circle-notch fa-spin text-3xl mb-3 block text-sky-500" />
          กำลังโหลดข้อมูล...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-5 px-4 shadow-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <i className="fa-solid fa-user-pen text-lg" />
            </div>
            <div>
              <h1 className="text-base font-black text-white">แก้ไขโปรไฟล์ของฉัน</h1>
              <p className="text-indigo-300 text-xs">{email || profile.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-semibold border border-white/15 transition">
              <i className="fa-solid fa-house" /> หน้าหลัก
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-300 px-3.5 py-2 rounded-xl text-xs font-semibold border border-red-400/30 transition"
            >
              <i className="fa-solid fa-right-from-bracket" /> ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Form */}
      <main className="max-w-4xl mx-auto px-4 py-8 w-full flex-grow">
        {/* Profile Edit Banner */}
        <div className="bg-sky-50 border border-sky-200 rounded-3xl p-5 mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <i className="fa-solid fa-pen-to-square text-lg" />
            </div>
            <div>
              <h3 className="font-bold text-sky-950 text-sm">แก้ไขข้อมูลโปรไฟล์ของท่านได้จากหน้านี้โดยตรง</h3>
              <p className="text-xs text-sky-700 mt-0.5">กรอกข้อมูลในช่องด้านล่าง แล้วกดปุ่ม "บันทึกโปรไฟล์" ด้านล่าง ข้อมูลบนหน้าเว็บและ Google Sheets จะเปลี่ยนทันที</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('save-profile-btn');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition whitespace-nowrap"
          >
            <i className="fa-solid fa-arrow-down" />
            เลื่อนไปปุ่มบันทึก
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Success / Error Notification */}
          {msg.text && (
            <div className={`rounded-2xl px-4 py-3.5 text-sm font-bold flex items-center gap-2.5 ${msg.ok ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              <i className={`fa-solid ${msg.ok ? 'fa-circle-check text-emerald-600' : 'fa-circle-exclamation text-red-600'} text-base`} />
              {msg.text}
            </div>
          )}

          {/* ════════════════════════════════════════
              SECTION 1: ข้อมูลทั่วไป (ตรงกับหน้าแอดมิน 100%)
          ════════════════════════════════════════ */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h2 className="font-black text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100 text-sm sm:text-base">
              <i className="fa-solid fa-id-card text-sky-500" /> ข้อมูลทั่วไป
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อ-นามสกุล (ภาษาไทย) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={profile.nameTh || ''}
                  onChange={(e) => setProfile({ ...profile, nameTh: e.target.value })}
                  placeholder="ผศ.กาญจน์ กันปัญญา"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อ-นามสกุล (ภาษาอังกฤษ)
                </label>
                <input
                  type="text"
                  value={profile.nameEn || ''}
                  onChange={(e) => setProfile({ ...profile, nameEn: e.target.value })}
                  placeholder="Asst. Prof. Karn Kanpanya"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  อีเมล (Email) <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={profile.email || email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="karn@npu.ac.th"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>รหัสผ่านเข้าใช้งาน (Password)</span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-sky-600 hover:text-sky-800 font-semibold"
                  >
                    {showPassword ? 'ซ่อนรหัส' : 'แสดงรหัส'}
                  </button>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={profile.password || ''}
                    onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                    placeholder="npu1234"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">ใช้สำหรับเข้าสู่ระบบแก้ไขโปรไฟล์ของท่าน</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="text"
                  value={profile.phone || ''}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="042-503-777"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ตำแหน่ง / ตำแหน่งทางวิชาการ
                </label>
                <input
                  type="text"
                  value={profile.position || ''}
                  onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                  placeholder="หัวหน้าหลักสูตร / อาจารย์ประจำสาขาวิชา"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  สาขาวิชา / ฝ่ายงาน
                </label>
                <input
                  type="text"
                  list="profile-dept-options"
                  value={profile.department || ''}
                  onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                  placeholder="สาขาวิชาไฟฟ้ากำลัง"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ห้องทำงาน / สถานที่ติดต่อ
                </label>
                <input
                  type="text"
                  value={profile.location || ''}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  placeholder="สาขาวิชาไฟฟ้ากำลัง คณะเทคโนโลยีอุตสาหกรรม"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
                />
              </div>

              <div className="md:col-span-2 pt-1">
                <label className="inline-flex items-center gap-2.5 cursor-pointer bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition">
                  <input
                    type="checkbox"
                    checked={Boolean(profile.isHead)}
                    onChange={(e) => setProfile({ ...profile, isHead: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <span>หัวหน้าหลักสูตร / ประธานสาขาวิชา / หัวหน้าฝ่าย</span>
                </label>
              </div>
            </div>

            <datalist id="profile-dept-options">
              <option value="สาขาวิชาไฟฟ้ากำลัง" />
              <option value="สาขาวิชาอิเล็กทรอนิกส์" />
              <option value="สาขาวิชายานยนต์และเครื่องกล" />
              <option value="สาขาวิชาช่างกลโรงงาน/สาขาวิชาเทคนิคการผลิต" />
              <option value="สาขาวิชาการจัดการอาชีวศึกษา" />
              <option value="สาขาวิชาช่างเชื่อมโลหะ" />
              <option value="สาขาวิชาชีพพื้นฐาน" />
              <option value="สาขาวิชาการก่อสร้างและสถาปัตยกรรม" />
              <option value="สาขาวิชาสถาปัตยกรรม" />
              <option value="สาขาวิชาการบัญชี" />
              <option value="สาขาวิชาการจัดการสำนักงานดิจิทัล" />
              <option value="สาขาวิชาการตลาด" />
              <option value="สาขาวิชาเทคโนโลยีธุรกิจดิจิทัล" />
              <option value="สาขาวิชาการโรงแรม" />
              <option value="สาขาวิชาพื้นฐานประยุกต์" />
              <option value="คณะผู้บริหาร" />
              <option value="สายสนับสนุน" />
            </datalist>
          </div>

          {/* ════════════════════════════════════════
              SECTION 2: รูปภาพและปฏิทินปฏิบัติราชการ (ตรงกับหน้าแอดมิน 100%)
          ════════════════════════════════════════ */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h2 className="font-black text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100 text-sm sm:text-base">
              <i className="fa-solid fa-image text-indigo-500" /> รูปภาพและปฏิทินปฏิบัติราชการ
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL รูปภาพโปรไฟล์
                </label>
                <input
                  type="text"
                  value={profile.imageUrl || ''}
                  onChange={(e) => setProfile({ ...profile, imageUrl: e.target.value })}
                  placeholder="img/ผศ.กาญจน์ กันปัญญา.jpg หรือ https://..."
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
                />
              </div>

              {profile.imageUrl && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <img
                    src={profile.imageUrl}
                    alt="Preview"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/img/avatar-placeholder.svg'; }}
                  />
                  <div className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-700 block">ตัวอย่างรูปภาพโปรไฟล์</span>
                    รูปนี้จะแสดงบนการ์ดบุคลากรและป๊อปอัปหน้าเว็บ
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Google Calendar URL (ปฏิทิน/ตารางนัดหมาย/iframe)
                </label>
                <input
                  type="text"
                  value={profile.calendarUrl || ''}
                  onChange={(e) => setProfile({ ...profile, calendarUrl: e.target.value })}
                  placeholder="https://calendar.google.com/calendar/embed?src=..."
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════
              SECTION 3: ความเชี่ยวชาญ การศึกษา และทักษะ (ตรงกับหน้าแอดมิน 100%)
          ════════════════════════════════════════ */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h2 className="font-black text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100 text-sm sm:text-base">
              <i className="fa-solid fa-graduation-cap text-emerald-500" /> ความเชี่ยวชาญ การศึกษา และทักษะ
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ความสนใจและงานวิจัยที่เชี่ยวชาญ (Research interests)
                </label>
                <textarea
                  value={profile.researchInterests || ''}
                  onChange={(e) => setProfile({ ...profile, researchInterests: e.target.value })}
                  placeholder="วิศวกรรมระบบไฟฟ้ากำลัง, การจัดการพลังงานหมุนเวียน (Renewable Energy Systems)"
                  rows={2}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ประวัติการศึกษา (แต่ละบรรทัด = 1 วุฒิการศึกษา)
                </label>
                <textarea
                  value={educationText}
                  onChange={(e) => setEducationText(e.target.value)}
                  placeholder={'Ph.D. Electrical Engineering, Khon Kaen University, 2010\nM.Eng. Power Systems, KMUTT, 2005'}
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white resize-none font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ทักษะและความเชี่ยวชาญ (แต่ละบรรทัด = 1 ทักษะ)
                </label>
                <textarea
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  placeholder={'Power System Analysis\nPLC Programming\nEnergy Management'}
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white resize-none font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Save button */}
          <div className="flex gap-3 pb-6">
            <button
              id="save-profile-btn"
              type="submit"
              disabled={saving}
              className="flex-1 bg-sky-600 hover:bg-sky-500 disabled:opacity-60 text-white font-black py-4 rounded-2xl text-base transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {saving ? (
                <><i className="fa-solid fa-circle-notch fa-spin" /> กำลังบันทึกข้อมูล...</>
              ) : (
                <><i className="fa-solid fa-floppy-disk" /> บันทึกโปรไฟล์</>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
