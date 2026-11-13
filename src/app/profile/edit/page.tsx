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
  position?: string;
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
          setProfile((prev) => ({
            nameTh: prev.nameTh || found.name || '',
            nameEn: prev.nameEn || found.calendarName || found.nameEn || '',
            position: prev.position || found.position || '',
            email: prev.email || found.email || userEmail,
            phone: prev.phone || found.phone || '',
            location: prev.location || found.location || found.room || '',
            imageUrl: prev.imageUrl || found.img || '',
            researchInterests: prev.researchInterests || found.researchInterests || '',
            education: prev.education && prev.education.length > 0 ? prev.education : (found.education ? String(found.education).split('|').map((s: string) => s.trim()).filter(Boolean) : []),
            skills: prev.skills && prev.skills.length > 0 ? prev.skills : (found.skills ? String(found.skills).split('|').map((s: string) => s.trim()).filter(Boolean) : []),
          }));

          if (!savedCustom) {
            if (found.education) {
              setEducationText(String(found.education).split('|').map((s: string) => s.trim()).filter(Boolean).join('\n'));
            }
            if (found.skills) {
              setSkillsText(String(found.skills).split('|').map((s: string) => s.trim()).filter(Boolean).join('\n'));
            }
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
      const payload: ProfileData = {
        ...profile,
        education: educationText.split('\n').map((s) => s.trim()).filter(Boolean),
        skills: skillsText.split('\n').map((s) => s.trim()).filter(Boolean),
      };

      if (typeof window !== 'undefined' && email) {
        localStorage.setItem(`hr_custom_profile_${email}`, JSON.stringify(payload));

        // Save into unified personnel overrides so website updates everywhere
        let overrides: Record<string, any> = {};
        try { overrides = JSON.parse(localStorage.getItem('hr_personnel_overrides') || '{}'); } catch {}
        overrides[email.toLowerCase()] = {
          id: email,
          nameTh: profile.nameTh,
          nameEn: profile.nameEn,
          position: profile.position,
          email,
          phone: profile.phone,
          location: profile.location,
          imageUrl: profile.imageUrl,
          calendarUrl: profile.calendarUrl,
          researchInterests: profile.researchInterests,
          education: educationText.split('\n').map((s) => s.trim()).filter(Boolean),
          skills: skillsText.split('\n').map((s) => s.trim()).filter(Boolean),
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem('hr_personnel_overrides', JSON.stringify(overrides));
        window.dispatchEvent(new Event('hr_personnel_updated'));
      }

      // 1. Try sending to Google Apps Script Web App if configured
      const scriptUrl = typeof window !== 'undefined' ? localStorage.getItem('hr_sheet_api_url') : '';
      let syncedToGoogle = false;

      if (scriptUrl) {
        try {
          const res = await fetch(scriptUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
              action: 'updateProfile',
              email,
              data: {
                nameTh: profile.nameTh,
                nameEn: profile.nameEn,
                position: profile.position,
                phone: profile.phone,
                location: profile.location,
                imageUrl: profile.imageUrl,
                education: educationText.split('\n').map((s) => s.trim()).filter(Boolean),
                skills: skillsText.split('\n').map((s) => s.trim()).filter(Boolean),
                researchInterests: profile.researchInterests,
              },
            }),
          });
          const result = await res.json().catch(() => null);
          if (result && result.success) {
            syncedToGoogle = true;
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
          text: '✓ บันทึกข้อมูลและส่งไปอัปเดตลง Google Sheets เรียบร้อยแล้ว! ข้อมูลบนหน้าเว็บอัปเดตทันที',
          ok: true,
        });
      } else {
        setMsg({
          text: '✓ บันทึกข้อมูลโปรไฟล์จากหน้าเว็บไซต์เรียบร้อยแล้ว! ข้อมูลบนหน้าเว็บอัปเดตทันที',
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

  const field = (key: keyof ProfileData, label: string, placeholder = '') => (
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-1">{label}</label>
      <input
        type="text"
        value={(profile as any)[key] || ''}
        onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
        placeholder={placeholder}
        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-5 px-4 shadow-md sticky top-0 z-30">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <i className="fa-solid fa-user-pen text-lg" />
            </div>
            <div>
              <h1 className="text-base font-black text-white">แก้ไขโปรไฟล์ของฉัน</h1>
              <p className="text-indigo-300 text-xs">{email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl text-xs font-semibold border border-white/15 transition">
              <i className="fa-solid fa-house" /> หน้าหลัก
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-300 px-3 py-2 rounded-xl text-xs font-semibold border border-red-400/30 transition"
            >
              <i className="fa-solid fa-right-from-bracket" /> ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-3xl mx-auto px-4 py-8 w-full flex-grow">
        {/* Profile Edit Banner */}
        <div className="bg-sky-50 border border-sky-200 rounded-3xl p-5 mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <i className="fa-solid fa-pen-to-square text-lg" />
            </div>
            <div>
              <h3 className="font-bold text-sky-950 text-sm">แก้ไขข้อมูลโปรไฟล์ของท่านได้จากหน้านี้โดยตรง</h3>
              <p className="text-xs text-sky-700 mt-0.5">กรอกข้อมูลในช่องด้านล่าง แล้วกดปุ่ม "บันทึกโปรไฟล์" ด้านล่าง ข้อมูลบนหน้าเว็บจะเปลี่ยนทันที</p>
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
          {/* Success / Error */}
          {msg.text && (
            <div className={`rounded-2xl px-4 py-3 text-sm font-bold flex items-center gap-2 ${msg.ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              <i className={`fa-solid ${msg.ok ? 'fa-circle-check' : 'fa-circle-exclamation'}`} />
              {msg.text}
            </div>
          )}

          {/* Basic Info */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h2 className="font-black text-slate-900 flex items-center gap-2 pb-1 border-b border-slate-100">
              <i className="fa-solid fa-id-card text-sky-500" /> ข้อมูลทั่วไป
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {field('nameEn', 'ชื่อ-นามสกุล (ภาษาอังกฤษ)', 'Assoc. Prof. Somchai Chai')}
              {field('nameTh', 'ชื่อ-นามสกุล (ภาษาไทย)', 'รศ.ดร. สมชาย ใจดี')}
              {field('position', 'ตำแหน่ง', 'อาจารย์ประจำ')}
              {field('phone', 'โทรศัพท์', '042-500000 ต่อ 1234')}
              {field('location', 'ห้องทำงาน', 'อาคาร 1 ชั้น 2 ห้อง 201')}
            </div>
          </div>

          {/* Media */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h2 className="font-black text-slate-900 flex items-center gap-2 pb-1 border-b border-slate-100">
              <i className="fa-solid fa-image text-violet-500" /> รูปภาพและลิงก์
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {field('imageUrl', 'URL รูปภาพโปรไฟล์', 'https://example.com/photo.jpg')}
              {field('calendarUrl', 'Google Calendar (ตารางสอน/นัดหมาย)', 'https://calendar.google.com/calendar/embed?src=...')}
            </div>
            {profile.imageUrl && (
              <div className="mt-2">
                <p className="text-xs text-slate-500 mb-2 font-medium">ตัวอย่างรูปภาพ:</p>
                <img
                  src={profile.imageUrl}
                  alt="Preview"
                  className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shadow-sm"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/img/avatar-placeholder.svg'; }}
                />
              </div>
            )}
          </div>

          {/* Research */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h2 className="font-black text-slate-900 flex items-center gap-2 pb-1 border-b border-slate-100">
              <i className="fa-solid fa-flask text-amber-500" /> ความสนใจและงานวิจัย
            </h2>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ความสนใจในการวิจัย</label>
              <textarea
                value={profile.researchInterests || ''}
                onChange={(e) => setProfile({ ...profile, researchInterests: e.target.value })}
                placeholder="วิศวกรรมระบบไฟฟ้า, พลังงานทดแทน, Smart Grid, ..."
                rows={2}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition resize-none"
              />
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h2 className="font-black text-slate-900 flex items-center gap-2 pb-1 border-b border-slate-100">
              <i className="fa-solid fa-graduation-cap text-emerald-500" /> ประวัติการศึกษา
            </h2>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">แต่ละบรรทัด = 1 วุฒิการศึกษา</label>
              <textarea
                value={educationText}
                onChange={(e) => setEducationText(e.target.value)}
                placeholder={'Ph.D. Electrical Engineering, Khon Kaen University, 2015\nM.Eng. Power Systems, KMUTT, 2010\nB.Eng. Electrical Engineering, NPU, 2008'}
                rows={4}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition resize-none font-mono"
              />
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h2 className="font-black text-slate-900 flex items-center gap-2 pb-1 border-b border-slate-100">
              <i className="fa-solid fa-star text-sky-500" /> ทักษะและความเชี่ยวชาญ
            </h2>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">แต่ละบรรทัด = 1 ทักษะ</label>
              <textarea
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder={'Power System Analysis\nPLC Programming\nEnergy Management\nMATLAB / Simulink'}
                rows={4}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition resize-none font-mono"
              />
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
                <><i className="fa-solid fa-circle-notch fa-spin" /> กำลังบันทึก...</>
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
