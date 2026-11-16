'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAssetPath } from '@/lib/assetHelper';
import { fetchClientGViz, resolveStaffDivisionSlug } from '@/hooks/usePersonnelData';
import { STAFF_DIVISIONS_DATA } from '@/data/staff-divisions';
import { DEPARTMENTS_DATA } from '@/data/departments';
import { EXECUTIVES_DATA } from '@/data/executives';
import { isSamePersonnel } from '@/lib/personnelHelper';

interface ProfileData {
  nameEn?: string;
  nameTh?: string;
  email?: string;
  password?: string;
  position?: string;
  department?: string;
  departmentSlug?: string;
  divisionSlug?: string;
  isHead?: boolean;
  phone?: string;
  location?: string;
  researchInterests?: string;
  education?: string[];
  skills?: string[];
  imageUrl?: string;
  calendarUrl?: string;
}

const DEPT_MAP: Record<string, string> = {
  'electrical-power': 'electrical-power',
  'สาขาวิชาไฟฟ้ากำลัง': 'electrical-power',
  'ไฟฟ้ากำลัง': 'electrical-power',
  'electronics-robotics': 'electronics-robotics',
  'สาขาวิชาอิเล็กทรอนิกส์': 'electronics-robotics',
  'อิเล็กทรอนิกส์': 'electronics-robotics',
  'automotive-ev': 'automotive-ev',
  'สาขาวิชายานยนต์และเครื่องกล': 'automotive-ev',
  'ยานยนต์': 'automotive-ev',
  'industrial-technology': 'industrial-technology',
  'สาขาวิชาช่างกลโรงงาน/สาขาวิชาเทคนิคการผลิต': 'industrial-technology',
  'เทคนิคการผลิต': 'industrial-technology',
  'civil-engineering': 'civil-engineering',
  'สาขาวิชาเทคโนโลยีโยธา': 'civil-engineering',
  'โยธา': 'civil-engineering',
  'welding-metallurgy': 'welding-metallurgy',
  'สาขาวิชาเทคโนโลยีการเชื่อมและโลหะ': 'welding-metallurgy',
  'เชื่อมและโลหะ': 'welding-metallurgy',
  'computer-technology': 'computer-technology',
  'สาขาวิชาเทคโนโลยีสารสนเทศ/คอมพิวเตอร์': 'computer-technology',
  'คอมพิวเตอร์': 'computer-technology',
  'architecture-design': 'architecture-design',
  'สาขาวิชาสถาปัตยกรรมและการออกแบบ': 'architecture-design',
  'สถาปัตยกรรม': 'architecture-design',
  'business-computer': 'business-computer',
  'สาขาวิชาคอมพิวเตอร์ธุรกิจ': 'business-computer',
  'คอมพิวเตอร์ธุรกิจ': 'business-computer',
  'accounting': 'accounting',
  'สาขาวิชาการบัญชี': 'accounting',
  'การบัญชี': 'accounting',
  'marketing': 'marketing',
  'สาขาวิชาการตลาด': 'marketing',
  'การตลาด': 'marketing',
  'management': 'management',
  'สาขาวิชาการจัดการ': 'management',
  'การจัดการ': 'management',
  'hotel-tourism': 'hotel-tourism',
  'สาขาวิชาการท่องเที่ยวและการโรงแรม': 'hotel-tourism',
  'ท่องเที่ยว': 'hotel-tourism',
  'logistics-supply-chain': 'logistics-supply-chain',
  'สาขาวิชาการจัดการโลจิสติกส์': 'logistics-supply-chain',
  'โลจิสติกส์': 'logistics-supply-chain',
  'industrial-crafts': 'industrial-crafts',
  'สาขาวิชาหัตถกรรมอุตสาหกรรม': 'industrial-crafts',
  'หัตถกรรม': 'industrial-crafts',
};

function getPersonnelTargetUrl(departmentSlug?: string, department?: string): string {
  const raw = String(departmentSlug || department || '').toLowerCase().trim();
  const rawDept = String(department || '').toLowerCase().trim();

  // 1. Staff divisions
  if (
    raw.includes('admin') || raw.includes('บริหารทั่วไป') || raw.includes('ฝ่ายบริหาร') || raw.includes('สำนักงานคณบดี') ||
    raw === 'dept-admin' || rawDept.includes('บริหารทั่วไป') || rawDept.includes('ฝ่ายบริหาร')
  ) {
    return getAssetPath('/staff/dept-admin/');
  }
  if (
    raw.includes('academic') || raw.includes('วิชาการ') || raw === 'dept-academic' ||
    rawDept.includes('วิชาการ')
  ) {
    return getAssetPath('/staff/dept-academic/');
  }
  if (
    raw.includes('finance') || raw.includes('วิจัย') || raw.includes('แผนงาน') || raw.includes('งบประมาณ') || raw.includes('ประกัน') ||
    raw === 'dept-finance' || rawDept.includes('วิจัย') || rawDept.includes('แผนงาน')
  ) {
    return getAssetPath('/staff/dept-finance/');
  }
  if (
    raw.includes('facility') || raw.includes('พัฒนา') || raw.includes('อาคาร') || raw.includes('บริการการศึกษา') ||
    raw === 'dept-facility' || rawDept.includes('พัฒนา') || rawDept.includes('อาคาร')
  ) {
    return getAssetPath('/staff/dept-facility/');
  }
  if (raw.startsWith('dept-') || raw.includes('สนับสนุน') || raw.includes('staff')) {
    return getAssetPath('/staff/');
  }

  // 2. Executives
  if (raw.includes('exec') || raw.includes('ผู้บริหาร') || rawDept.includes('ผู้บริหาร')) {
    return getAssetPath('/');
  }

  // 3. Lecturer departments
  for (const [key, slug] of Object.entries(DEPT_MAP)) {
    if (raw.includes(key) || rawDept.includes(key)) {
      return getAssetPath(`/lecturers/${slug}/`);
    }
  }

  if (raw && !raw.includes('สาขาวิชา') && !raw.includes('ฝ่าย')) {
    return getAssetPath(`/lecturers/${raw}/`);
  }

  return getAssetPath('/staff/');
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

    // Load from Google Sheets live data + fallback to static data
    Promise.all([
      fetchClientGViz(targetSheetId, 'Executives').catch(() => []),
      fetchClientGViz(targetSheetId, 'Lecturers').catch(() => []),
      fetchClientGViz(targetSheetId, 'Staff').catch(() => []),
    ])
      .then(([execs, lecs, staffs]) => {
        const all = [...execs, ...lecs, ...staffs];
        let found: any = all.find((item) => {
          const itemEmail = String(item.email || '').toLowerCase().trim();
          const itemName = String(item.name || item.nameTh || '').trim();
          const itemId = String(item.id || '').toLowerCase().trim();
          return (
            (userEmail && itemEmail === userEmail) ||
            (u.name && itemName.includes(u.name)) ||
            (u.user && (itemId === u.user.toLowerCase() || itemEmail.startsWith(u.user.toLowerCase())))
          );
        });

        // Fallback to static staff divisions if not found in GViz
        if (!found) {
          for (const div of STAFF_DIVISIONS_DATA) {
            const match = div.allCards.find((c) =>
              (userEmail && c.email?.toLowerCase().trim() === userEmail) ||
              (u.name && c.name?.includes(u.name)) ||
              (u.user && (c.email?.toLowerCase().includes(u.user) || c.name?.includes(u.user)))
            );
            if (match) {
              found = { ...match, divisionSlug: div.slug, departmentSlug: div.slug, department: div.title };
              break;
            }
          }
        }

        // Fallback to static departments if still not found
        if (!found) {
          for (const dept of DEPARTMENTS_DATA) {
            const match = dept.allCards.find((c) =>
              (userEmail && c.email?.toLowerCase().trim() === userEmail) ||
              (u.name && c.name?.includes(u.name)) ||
              (u.user && (c.email?.toLowerCase().includes(u.user) || c.name?.includes(u.user)))
            );
            if (match) {
              found = { ...match, departmentSlug: dept.slug, department: dept.title };
              break;
            }
          }
        }

        // Fallback to executives if still not found
        if (!found) {
          for (const [k, ex] of Object.entries(EXECUTIVES_DATA)) {
            if (
              (userEmail && ex.email?.toLowerCase().trim() === userEmail) ||
              (u.name && ex.name?.includes(u.name)) ||
              (u.user && ex.id.toLowerCase() === u.user.toLowerCase())
            ) {
              found = { ...ex, department: 'คณะผู้บริหาร', departmentSlug: 'executives' };
              break;
            }
          }
        }

        if (found) {
          // Accurately deduce department and slug for staff vs lecturer
          let initialSlug = found.divisionSlug || found.departmentSlug || '';
          let initialDept = found.department || '';

          // Auto-detect staff division from position, location, or email
          const checkStr = (initialDept + ' ' + (found.position || '') + ' ' + (found.location || '') + ' ' + (found.room || '') + ' ' + userEmail).toLowerCase();
          if (
            initialSlug === 'dept-admin' || checkStr.includes('บริหารทั่วไป') || checkStr.includes('เจ้าหน้าที่บริหาร') ||
            checkStr.includes('สำนักงานคณบดี') || userEmail.includes('suwat')
          ) {
            initialSlug = 'dept-admin';
            if (!initialDept || initialDept.includes('ไฟฟ้า')) initialDept = 'ฝ่ายบริหารทั่วไป';
          } else if (initialSlug === 'dept-academic' || (checkStr.includes('วิชาการ') && !checkStr.includes('สาขาวิชา'))) {
            initialSlug = 'dept-academic';
            if (!initialDept || initialDept.includes('ไฟฟ้า')) initialDept = 'ฝ่ายวิชาการ';
          } else if (initialSlug === 'dept-finance' || checkStr.includes('ฝ่ายวิจัย') || checkStr.includes('แผนงาน') || checkStr.includes('งบประมาณ')) {
            initialSlug = 'dept-finance';
            if (!initialDept || initialDept.includes('ไฟฟ้า')) initialDept = 'ฝ่ายวิจัย';
          } else if (initialSlug === 'dept-facility' || checkStr.includes('ฝ่ายพัฒนา') || checkStr.includes('อาคารสถานที่') || checkStr.includes('บริการการศึกษา')) {
            initialSlug = 'dept-facility';
            if (!initialDept || initialDept.includes('ไฟฟ้า')) initialDept = 'ฝ่ายพัฒนา';
          }

          if (!initialSlug) initialSlug = 'electrical-power';
          if (!initialDept) initialDept = 'สาขาวิชาไฟฟ้ากำลัง';

          const loadedProfile: ProfileData = {
            nameTh: found.name || found.nameTh || '',
            nameEn: found.calendarName || found.nameEn || '',
            email: found.email || userEmail,
            password: found.passwd || found.password || u.currentPassword || 'npu1234',
            position: found.position || '',
            department: initialDept,
            departmentSlug: initialSlug,
            divisionSlug: initialSlug,
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
            divisionSlug: prev.divisionSlug || loadedProfile.divisionSlug,
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
      const deptText = String(profile.department || '').trim();
      const posText = String(profile.position || '').trim();

      // Resolve finalSlug accurately
      let finalSlug = profile.departmentSlug || '';
      if (
        deptText.includes('บริหารทั่วไป') || deptText.includes('admin') || deptText.includes('สำนักงานคณบดี') ||
        posText.includes('บริหารงานทั่วไป') || activeEmail.includes('suwat') || deptText === 'ฝ่ายบริหารทั่วไป'
      ) {
        finalSlug = 'dept-admin';
      } else if (deptText.includes('วิชาการ') || deptText.includes('academic') || deptText === 'ฝ่ายวิชาการ') {
        finalSlug = 'dept-academic';
      } else if (deptText.includes('วิจัย') || deptText.includes('finance') || deptText.includes('แผนงาน') || deptText.includes('งบประมาณ') || deptText.includes('ประกัน')) {
        finalSlug = 'dept-finance';
      } else if (deptText.includes('พัฒนา') || deptText.includes('facility') || deptText.includes('อาคาร') || deptText.includes('บริการการศึกษา')) {
        finalSlug = 'dept-facility';
      } else if (!finalSlug || finalSlug === 'electrical-power' || finalSlug.startsWith('dept-')) {
        for (const [k, s] of Object.entries(DEPT_MAP)) {
          if (deptText.includes(k)) {
            finalSlug = s;
            break;
          }
        }
      }

      const payload: ProfileData = {
        ...profile,
        email: activeEmail,
        departmentSlug: finalSlug,
        divisionSlug: finalSlug,
        education: educationText.split('\n').map((s) => s.trim()).filter(Boolean),
        skills: skillsText.split('\n').map((s) => s.trim()).filter(Boolean),
      };

      if (typeof window !== 'undefined' && activeEmail) {
        localStorage.setItem(`hr_custom_profile_${activeEmail}`, JSON.stringify(payload));

        // Save into unified personnel overrides so website updates everywhere
        let overrides: Record<string, any> = {};
        try { overrides = JSON.parse(localStorage.getItem('hr_personnel_overrides') || '{}'); } catch {}

        // Remove old email key if changed or Thai name alias key to prevent duplicates
        if (email && email.toLowerCase() !== activeEmail) {
          delete overrides[email.toLowerCase().trim()];
        }
        if (profile.nameTh && overrides[profile.nameTh.trim()]) {
          delete overrides[profile.nameTh.trim()];
        }

        overrides[activeEmail] = {
          id: activeEmail,
          nameTh: profile.nameTh,
          nameEn: profile.nameEn,
          position: profile.position,
          email: activeEmail,
          password: profile.password,
          phone: profile.phone,
          department: profile.department,
          departmentSlug: finalSlug,
          divisionSlug: finalSlug,
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

      // 1. Send directly to Google Apps Script Web App to sync into Google Sheets (with keepalive for instant background sync)
      const DEFAULT_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwlkKm94MbwsFcL0s-KTqnEV3hIyEbo-1GSXd7tIQKM-uAW1lpKbfs4sSXimK-ZQaOCrQ/exec';
      const scriptUrl = (typeof window !== 'undefined' && localStorage.getItem('hr_sheet_api_url')) || process.env.NEXT_PUBLIC_SHEET_API_URL || DEFAULT_APPS_SCRIPT_URL;

      if (scriptUrl) {
        try {
          fetch(scriptUrl, {
            method: 'POST',
            keepalive: true,
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
              action: 'updateProfile',
              originalEmail: email,
              email: activeEmail,
              name: profile.nameTh,
              nameTh: profile.nameTh,
              nameEn: profile.nameEn,
              departmentSlug: finalSlug,
              divisionSlug: finalSlug,
              department: profile.department,
              data: {
                nameTh: profile.nameTh,
                nameEn: profile.nameEn,
                email: activeEmail,
                password: profile.password || 'npu1234',
                position: profile.position,
                department: profile.department,
                departmentSlug: finalSlug,
                divisionSlug: finalSlug,
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
          }).catch((err) => console.log('Background sync err:', err));
        } catch (scriptErr) {
          console.log('Sync to Google Apps Script:', scriptErr);
        }
      }

      fetch('/api/teacher/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {});

      const targetUrl = getPersonnelTargetUrl(finalSlug, payload.department);
      setMsg({
        text: '✓ บันทึกข้อมูลสำเร็จ! ระบบกำลังนำท่านกลับไปยังหน้าฝ่ายงานทันที...',
        ok: true,
      });

      // Immediate smooth redirect to division page (no waiting for slow Google servers)
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 600);
    } catch (e: any) {
      setMsg({ text: e.message || 'เกิดข้อผิดพลาด', ok: false });
    } finally {
      setSaving(false);
    }
  };
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
              <option value="ฝ่ายบริหารทั่วไป" />
              <option value="ฝ่ายวิชาการ" />
              <option value="ฝ่ายวิจัย" />
              <option value="ฝ่ายพัฒนา" />
              <option value="สายสนับสนุน" />
              <option value="คณะผู้บริหาร" />
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
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>ความสนใจและงานวิจัยที่เชี่ยวชาญ (Research interests)</span>
                  <span className="text-[11px] text-slate-400 font-normal">↘ ลากมุมขวาล่างเพื่อขยายช่องได้</span>
                </label>
                <textarea
                  value={profile.researchInterests || ''}
                  onChange={(e) => setProfile({ ...profile, researchInterests: e.target.value })}
                  placeholder="วิศวกรรมระบบไฟฟ้ากำลัง, การจัดการพลังงานหมุนเวียน (Renewable Energy Systems)"
                  rows={3}
                  style={{ resize: 'vertical' }}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white min-h-[85px] leading-relaxed transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>ประวัติการศึกษา (แต่ละบรรทัด = 1 วุฒิการศึกษา)</span>
                  <span className="text-[11px] text-slate-400 font-normal">↘ ลากมุมขวาล่างเพื่อขยายช่องได้</span>
                </label>
                <textarea
                  value={educationText}
                  onChange={(e) => setEducationText(e.target.value)}
                  placeholder={'Ph.D. Electrical Engineering, Khon Kaen University, 2010\nM.Eng. Power Systems, KMUTT, 2005'}
                  rows={4}
                  style={{ resize: 'vertical' }}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white min-h-[105px] font-mono text-xs leading-relaxed transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>ทักษะและความเชี่ยวชาญ (แต่ละบรรทัด = 1 ทักษะ)</span>
                  <span className="text-[11px] text-slate-400 font-normal">↘ ลากมุมขวาล่างเพื่อขยายช่องได้</span>
                </label>
                <textarea
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  placeholder={'Power System Analysis\nPLC Programming\nEnergy Management'}
                  rows={4}
                  style={{ resize: 'vertical' }}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white min-h-[105px] font-mono text-xs leading-relaxed transition"
                />
              </div>
            </div>
          </div>

          {/* Success / Error Notification directly at the Save button */}
          {msg.text && (
            <div
              id="save-result-box"
              className={`rounded-2xl p-4 text-sm sm:text-base font-bold flex items-center gap-3 animate-fadeIn shadow-lg transition-all ${
                msg.ok
                  ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-400 ring-4 ring-emerald-500/10'
                  : 'bg-red-50 text-red-700 border-2 border-red-300 ring-4 ring-red-500/10'
              }`}
            >
              <i className={`fa-solid ${msg.ok ? 'fa-circle-check text-emerald-600' : 'fa-circle-exclamation text-red-600'} text-2xl flex-shrink-0`} />
              <div>
                <p className="font-extrabold text-sm sm:text-base">{msg.text}</p>
                {msg.ok && (
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <p className="text-xs text-emerald-700 font-normal">
                      ข้อมูลถูกบันทึกและซิงค์ตรงไปยัง Google Sheets เรียบร้อยแล้ว กำลังนำท่านกลับไปที่หน้าสาขา...
                    </p>
                    <a
                      href={getPersonnelTargetUrl(profile.departmentSlug, profile.department)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded-lg transition"
                    >
                      คลิกเพื่อไปทันที &rarr;
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

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
