'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

  useEffect(() => {
    fetch('/api/teacher/profile')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setProfile(d.profile || {});
          setEmail(d.email || '');
          setEducationText((d.profile?.education || []).join('\n'));
          setSkillsText((d.profile?.skills || []).join('\n'));
        } else {
          // Not logged in
          router.push('/profile/login');
        }
      })
      .catch(() => router.push('/profile/login'))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/teacher/auth', { method: 'DELETE' });
    router.push('/profile/login');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ text: '', ok: true });
    try {
      const payload: ProfileData = {
        ...profile,
        education: educationText.split('\n').filter(Boolean),
        skills: skillsText.split('\n').filter(Boolean),
      };
      const res = await fetch('/api/teacher/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const d = await res.json();
      setMsg({ text: d.message || (d.success ? 'บันทึกสำเร็จ' : 'เกิดข้อผิดพลาด'), ok: d.success });
    } catch (e: any) {
      setMsg({ text: e.message, ok: false });
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
