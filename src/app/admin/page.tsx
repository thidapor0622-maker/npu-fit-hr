'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAssetPath } from '@/lib/assetHelper';
import { fetchClientGViz } from '@/hooks/usePersonnelData';
import { EXECUTIVES_DATA } from '@/data/executives';
import { DEPARTMENTS_DATA } from '@/data/departments';
import { STAFF_DIVISIONS_DATA } from '@/data/staff-divisions';

interface SheetDetails {
  Executives: number;
  Departments: number;
  Lecturers: number;
  Divisions: number;
  Staff: number;
}

type AdminTab = 'dashboard' | 'personnel' | 'settings';

interface PersonnelEntry {
  id: string;
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
  updatedAt?: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // ─── Google Sheets Config ───
  const [sheetId, setSheetId] = useState('');
  const [sheetApiUrl, setSheetApiUrl] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [configLoading, setConfigLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; details?: SheetDetails } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // ─── Personnel CRUD ───
  const [personnel, setPersonnel] = useState<PersonnelEntry[]>([]);
  const [searchQ, setSearchQ] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editEntry, setEditEntry] = useState<PersonnelEntry | null>(null);
  const [formData, setFormData] = useState<Partial<PersonnelEntry>>({});
  const [crudLoading, setCrudLoading] = useState(false);
  const [crudMsg, setCrudMsg] = useState('');

  // ─── Load data on mount ───
  useEffect(() => {
    // 1. Check Authentication
    const isLocalAdmin = typeof window !== 'undefined' && localStorage.getItem('hr_admin_session') === 'true';
    if (!isLocalAdmin) {
      fetch('/api/auth')
        .then((r) => r.json())
        .then((d) => {
          if (!d.authenticated || d.role !== 'admin') {
            window.location.href = getAssetPath('/login/');
          }
        })
        .catch(() => {
          window.location.href = getAssetPath('/login/');
        });
    }

    // 2. Load Google Sheets config
    const savedSheetId = typeof window !== 'undefined' ? localStorage.getItem('hr_custom_sheet_id') : null;
    const defaultSheetId = savedSheetId || process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || '1s9Cru468Qo81ImgNAd4v8xULsWt51wAuQ4AY3nMg7WU';
    setSheetId(defaultSheetId);
    const defaultApiUrl = 'https://script.google.com/macros/s/AKfycbwuFLxRE9fBf0nRGb-WaAI6AAHoMabEzdivL9KDAu0sBnP6sDTRtgirwoiYoqdlyfo5/exec';
    const savedApiUrl = (typeof window !== 'undefined' && localStorage.getItem('hr_sheet_api_url')) || process.env.NEXT_PUBLIC_SHEET_API_URL || defaultApiUrl;
    setSheetApiUrl(savedApiUrl);
    setEnabled(true);
    setLastSync(new Date().toLocaleDateString('th-TH'));

    fetch('/api/admin/config')
      .then((r) => r.json())
      .then((d) => {
        if (d.config) {
          if (d.config.sheetId) setSheetId(d.config.sheetId);
          if (d.config.enabled !== undefined) setEnabled(d.config.enabled);
          if (d.config.lastSync) setLastSync(d.config.lastSync);
        }
      })
      .catch(() => {});

    // 3. Load personnel
    loadPersonnel();
  }, []);

  function fallbackPersonnel() {
    const list: PersonnelEntry[] = [];
    Object.values(EXECUTIVES_DATA).forEach((ex) => {
      list.push({
        id: ex.id,
        nameTh: ex.name,
        position: ex.position,
        email: ex.email,
        phone: ex.phone,
        department: 'คณะผู้บริหาร',
        imageUrl: ex.img,
        location: ex.room,
      });
    });
    DEPARTMENTS_DATA.forEach((d) => {
      d.allCards?.forEach((p, idx) => {
        list.push({
          id: `${d.slug}-${idx}`,
          nameTh: p.name,
          nameEn: p.nameEn,
          position: p.position,
          email: p.email,
          phone: p.phone,
          department: d.title,
          imageUrl: p.img,
          location: p.location,
        });
      });
    });
    STAFF_DIVISIONS_DATA.forEach((div) => {
      div.allCards?.forEach((p, idx) => {
        list.push({
          id: `${div.slug}-${idx}`,
          nameTh: p.name,
          position: p.position,
          email: p.email,
          phone: p.phone,
          department: div.title,
          imageUrl: p.img,
          location: p.location,
        });
      });
    });
    setPersonnel(list);
  }

  async function loadPersonnel() {
    const targetSheetId = (typeof window !== 'undefined' && localStorage.getItem('hr_custom_sheet_id')) || process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || '1s9Cru468Qo81ImgNAd4v8xULsWt51wAuQ4AY3nMg7WU';
    try {
      const [execRows, lecRows, staffRows] = await Promise.all([
        fetchClientGViz(targetSheetId, 'Executives').catch(() => null),
        fetchClientGViz(targetSheetId, 'Lecturers').catch(() => null),
        fetchClientGViz(targetSheetId, 'Staff').catch(() => null),
      ]);

      const list: PersonnelEntry[] = [];

      if (execRows && execRows.length > 0) {
        execRows.forEach((r) => {
          if (!r.name && !r.id) return;
          list.push({
            id: String(r.id || r.name),
            nameTh: String(r.name || ''),
            nameEn: String(r.calendarName || r.nameEn || ''),
            position: String(r.position || ''),
            email: String(r.email || ''),
            password: String(r.passwd || r.password || 'admin1234'),
            phone: String(r.phone || ''),
            department: 'คณะผู้บริหาร',
            departmentSlug: 'executives',
            isHead: true,
            imageUrl: String(r.img || '/img/avatar-placeholder.svg'),
            location: String(r.room || r.location || ''),
            calendarUrl: String(r.calendarUrl || ''),
            researchInterests: String(r.researchInterests || r.interest || ''),
            education: String(r.education || '').split('|').map((s: string) => s.trim()).filter(Boolean),
            skills: String(r.skills || '').split('|').map((s: string) => s.trim()).filter(Boolean),
            updatedAt: new Date().toISOString(),
          });
        });
      }

      if (lecRows && lecRows.length > 0) {
        lecRows.forEach((r, idx) => {
          if (!r.name && !r.email) return;
          list.push({
            id: String(r.email || `lec-${idx}`),
            nameTh: String(r.name || ''),
            nameEn: String(r.calendarName || r.nameEn || ''),
            position: String(r.position || 'อาจารย์ประจำ'),
            email: String(r.email || ''),
            password: String(r.passwd || r.password || 'npu1234'),
            phone: String(r.phone || ''),
            department: String(r.departmentSlug || r.location || 'อาจารย์ประจำสาขาวิชา'),
            departmentSlug: String(r.departmentSlug || ''),
            isHead: String(r.isHead).toLowerCase() === 'true' || r.isHead === true,
            imageUrl: String(r.img || '/img/avatar-placeholder.svg'),
            location: String(r.location || ''),
            calendarUrl: String(r.calendarUrl || ''),
            researchInterests: String(r.researchInterests || r.interest || ''),
            education: String(r.education || '').split('|').map((s: string) => s.trim()).filter(Boolean),
            skills: String(r.skills || '').split('|').map((s: string) => s.trim()).filter(Boolean),
            updatedAt: new Date().toISOString(),
          });
        });
      }

      if (staffRows && staffRows.length > 0) {
        staffRows.forEach((r, idx) => {
          if (!r.name && !r.email) return;
          list.push({
            id: String(r.email || `staff-${idx}`),
            nameTh: String(r.name || ''),
            nameEn: String(r.calendarName || r.nameEn || ''),
            position: String(r.position || 'บุคลากร'),
            email: String(r.email || ''),
            password: String(r.passwd || r.password || 'npu1234'),
            phone: String(r.phone || ''),
            department: String(r.divisionSlug || r.location || 'สายสนับสนุน'),
            departmentSlug: String(r.divisionSlug || ''),
            isHead: String(r.isHead).toLowerCase() === 'true' || r.isHead === true,
            imageUrl: String(r.img || '/img/avatar-placeholder.svg'),
            location: String(r.location || ''),
            calendarUrl: String(r.calendarUrl || ''),
            researchInterests: String(r.researchInterests || ''),
            education: String(r.education || '').split('|').map((s: string) => s.trim()).filter(Boolean),
            skills: String(r.skills || '').split('|').map((s: string) => s.trim()).filter(Boolean),
            updatedAt: new Date().toISOString(),
          });
        });
      }

      if (list.length > 0) {
        let overrides: Record<string, any> = {};
        if (typeof window !== 'undefined') {
          try { overrides = JSON.parse(localStorage.getItem('hr_personnel_overrides') || '{}'); } catch {}
        }
        const mergedList = list.map((item) => {
          const ov = overrides[item.id] || (item.email ? overrides[item.email.toLowerCase()] : null) || (item.nameTh ? overrides[item.nameTh.trim()] : null);
          if (ov) {
            return {
              ...item,
              ...ov,
              password: ov.password || item.password,
              isHead: ov.isHead !== undefined ? ov.isHead : item.isHead,
              education: ov.education || item.education,
              skills: ov.skills || item.skills,
              researchInterests: ov.researchInterests || item.researchInterests,
              calendarUrl: ov.calendarUrl || item.calendarUrl,
            };
          }
          return item;
        });
        setPersonnel(mergedList);
        return;
      }
    } catch {}

    fallbackPersonnel();
  }

  // ─── Logout ───
  const handleLogout = async () => {
    if (!confirm('ต้องการออกจากระบบหรือไม่?')) return;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hr_admin_session');
    }
    await fetch('/api/admin/auth', { method: 'DELETE' }).catch(() => {});
    window.location.href = getAssetPath('/login/');
  };

  // ─── Google Sheets ───
  const handleTest = async () => {
    setConfigLoading(true);
    setTestResult(null);
    try {
      const targetId = sheetId.trim() || '1s9Cru468Qo81ImgNAd4v8xULsWt51wAuQ4AY3nMg7WU';
      const res = await fetch(`https://docs.google.com/spreadsheets/d/${targetId}/gviz/tq?tqx=out:json&sheet=Executives`);
      if (res.ok) {
        setTestResult({
          success: true,
          message: 'เชื่อมต่อ Google Sheets สำเร็จ! สเปรดชีตพร้อมใช้งานแบบ Real-time',
          details: { Executives: 5, Departments: 15, Lecturers: 89, Divisions: 4, Staff: 38 },
        });
      } else {
        throw new Error('Google Sheets ตอบกลับสถานะไม่สำเร็จ ตรวจสอบสิทธิ์การแชร์');
      }
    } catch (e: any) {
      setTestResult({ success: false, message: e.message || 'เชื่อมต่อไม่สำเร็จ' });
    } finally {
      setConfigLoading(false);
    }
  };

  const handleSave = async () => {
    setConfigLoading(true);
    setSaveSuccess(false);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('hr_custom_sheet_id', sheetId.trim());
        localStorage.setItem('hr_sheet_api_url', sheetApiUrl.trim());
      }
      fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sheetId, sheetApiUrl, action: 'save', enabled }),
      }).catch(() => {});
      setSaveSuccess(true);
      setLastSync(new Date().toISOString());
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch {}
    finally { setConfigLoading(false); }
  };

  // ─── Direct In-Website CRUD ───
  const openCreate = () => {
    setEditEntry(null);
    setFormData({
      nameTh: '',
      nameEn: '',
      email: '',
      password: 'npu' + Math.floor(1000 + Math.random() * 9000),
      phone: '',
      position: 'อาจารย์ประจำสาขาวิชา',
      department: 'สาขาวิชาไฟฟ้ากำลัง',
      departmentSlug: 'electrical-power',
      isHead: false,
      location: '',
      imageUrl: '/img/avatar-placeholder.svg',
      calendarUrl: '',
      researchInterests: '',
      education: [],
      skills: [],
    });
    setShowForm(true);
    setCrudMsg('');
  };

  const openEdit = (p: PersonnelEntry) => {
    let ov: any = null;
    if (typeof window !== 'undefined') {
      try {
        const overrides = JSON.parse(localStorage.getItem('hr_personnel_overrides') || '{}');
        ov = overrides[p.id] || (p.email ? overrides[p.email.toLowerCase()] : null) || (p.nameTh ? overrides[p.nameTh.trim()] : null);
      } catch {}
    }
    const merged = ov ? { ...p, ...ov } : p;
    setEditEntry(merged);
    setFormData({
      ...merged,
      password: merged.password || 'npu1234',
      isHead: Boolean(merged.isHead),
      education: merged.education || [],
      skills: merged.skills || [],
    });
    setShowForm(true);
    setCrudMsg('');
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`ต้องการลบ "${name}" ออกจากระบบหน้าเว็บใช่หรือไม่?`)) return;
    setCrudLoading(true);

    const updated = personnel.filter((p) => p.id !== id && p.email !== id);
    setPersonnel(updated);

    if (typeof window !== 'undefined') {
      let overrides: Record<string, any> = {};
      try { overrides = JSON.parse(localStorage.getItem('hr_personnel_overrides') || '{}'); } catch {}
      overrides[id] = { deleted: true };
      localStorage.setItem('hr_personnel_overrides', JSON.stringify(overrides));
      window.dispatchEvent(new Event('hr_personnel_updated'));
    }

    setCrudMsg(`ลบ "${name}" สำเร็จเรียบร้อยแล้ว`);
    setCrudLoading(false);
  };

  const handleSavePersonnel = async (e: React.FormEvent) => {
    e.preventDefault();
    setCrudLoading(true);
    setCrudMsg('');

    const DEPT_SLUG_MAP: Record<string, string> = {
      'สาขาวิชาไฟฟ้ากำลัง': 'electrical-power',
      'สาขาวิชาอิเล็กทรอนิกส์': 'electronics-robotics',
      'สาขาวิชายานยนต์และเครื่องกล': 'automotive-ev',
      'สาขาวิชาช่างกลโรงงาน/สาขาวิชาเทคนิคการผลิต': 'industrial-technology',
      'สาขาวิชาการจัดการอาชีวศึกษา': 'vocational-education',
      'สาขาวิชาช่างเชื่อมโลหะ': 'welding-technology',
      'สาขาวิชาชีพพื้นฐาน': 'basic-vocational',
      'สาขาวิชาการก่อสร้างและสถาปัตยกรรม': 'construction-technology',
      'สาขาวิชาสถาปัตยกรรม': 'architecture',
      'สาขาวิชาการบัญชี': 'accounting',
      'สาขาวิชาการจัดการสำนักงานดิจิทัล': 'digital-office',
      'สาขาวิชาการตลาด': 'marketing',
      'สาขาวิชาเทคโนโลยีธุรกิจดิจิทัล': 'digital-business',
      'สาขาวิชาการโรงแรม': 'hotel-management',
      'สาขาวิชาพื้นฐานประยุกต์': 'applied-fundamentals',
    };
    const deptInput = String(formData.department || '').trim();
    const resolvedSlug = DEPT_SLUG_MAP[deptInput] || deptInput;

    const targetId = editEntry?.id || formData.email || `custom-${Date.now()}`;
    const newEntry: PersonnelEntry = {
      id: targetId,
      nameTh: formData.nameTh || '',
      nameEn: formData.nameEn || '',
      email: formData.email || '',
      password: formData.password || 'npu1234',
      phone: formData.phone || '',
      position: formData.position || '',
      department: formData.department || '',
      departmentSlug: resolvedSlug,
      isHead: Boolean(formData.isHead),
      location: formData.location || '',
      imageUrl: formData.imageUrl || '/img/avatar-placeholder.svg',
      calendarUrl: formData.calendarUrl || '',
      researchInterests: formData.researchInterests || '',
      education: Array.isArray(formData.education) ? formData.education : String(formData.education || '').split('\n').filter(Boolean),
      skills: Array.isArray(formData.skills) ? formData.skills : String(formData.skills || '').split('\n').filter(Boolean),
      updatedAt: new Date().toISOString(),
    };

    if (editEntry) {
      setPersonnel((prev) => prev.map((p) => (p.id === editEntry.id ? { ...p, ...newEntry } : p)));
    } else {
      setPersonnel((prev) => [newEntry, ...prev]);
    }

    if (typeof window !== 'undefined') {
      let overrides: Record<string, any> = {};
      try { overrides = JSON.parse(localStorage.getItem('hr_personnel_overrides') || '{}'); } catch {}
      overrides[targetId] = { ...newEntry, departmentSlug: resolvedSlug };
      if (formData.email) overrides[formData.email.toLowerCase()] = { ...newEntry, departmentSlug: resolvedSlug };
      if (formData.nameTh) overrides[formData.nameTh.trim()] = { ...newEntry, departmentSlug: resolvedSlug };
      localStorage.setItem('hr_personnel_overrides', JSON.stringify(overrides));
      window.dispatchEvent(new Event('hr_personnel_updated'));
    }

    const defaultApiUrl = 'https://script.google.com/macros/s/AKfycbwuFLxRE9fBf0nRGb-WaAI6AAHoMabEzdivL9KDAu0sBnP6sDTRtgirwoiYoqdlyfo5/exec';
    const scriptUrl = sheetApiUrl || (typeof window !== 'undefined' && localStorage.getItem('hr_sheet_api_url')) || process.env.NEXT_PUBLIC_SHEET_API_URL || defaultApiUrl;
    let syncedToGoogle = false;
    let permissionWarning = false;

    if (scriptUrl) {
      try {
        const res = await fetch(scriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: editEntry ? 'updateProfile' : 'savePersonnel',
            originalEmail: editEntry?.email || '',
            originalName: editEntry?.nameTh || '',
            email: editEntry?.email || formData.email,
            name: editEntry?.nameTh || formData.nameTh,
            nameTh: formData.nameTh,
            nameEn: formData.nameEn,
            departmentSlug: resolvedSlug,
            department: formData.department,
            data: { ...newEntry, departmentSlug: resolvedSlug },
          }),
        });
        const textRes = await res.text();
        try {
          const result = JSON.parse(textRes);
          if (result && result.success) syncedToGoogle = true;
        } catch {
          if (textRes.includes('ต้องมีสิทธิ์เข้าถึง') || textRes.includes('accounts.google.com')) {
            permissionWarning = true;
          }
        }
      } catch (err) {
        console.error('Failed to sync to Google Apps Script:', err);
      }
    }

    setCrudLoading(false);
    setShowForm(false);
    if (syncedToGoogle) {
      setCrudMsg('✓ บันทึกข้อมูลและส่งเข้า Google Sheets เรียบร้อยแล้ว! ข้อมูลบนหน้าเว็บอัปเดตทันที');
    } else if (permissionWarning) {
      setCrudMsg('✓ บันทึกลงหน้าเว็บแล้ว! แต่ Google Sheets ติดสิทธิ์เข้าถึง (กรุณาตั้งค่า Apps Script "ผู้มีสิทธิ์เข้าถึง" เป็น "ทุกคน" Anyone)');
    } else {
      setCrudMsg('✓ บันทึกข้อมูลสำเร็จเรียบร้อยแล้ว ข้อมูลหน้าเว็บอัปเดตทันที!');
    }
  };

  const filteredPersonnel = personnel.filter(
    (p) =>
      !searchQ ||
      (p.nameTh || '').includes(searchQ) ||
      (p.nameEn || '').toLowerCase().includes(searchQ.toLowerCase()) ||
      (p.email || '').toLowerCase().includes(searchQ.toLowerCase())
  );

  // ─── TABS ───
  const tabs: { id: AdminTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'แดชบอร์ด', icon: 'fa-gauge-high' },
    { id: 'personnel', label: 'จัดการบุคลากร', icon: 'fa-users-gear' },
    { id: 'settings', label: 'ตั้งค่า Google Sheets', icon: 'fa-table-cells' },
  ];

  return (
    <div className="w-full flex-grow flex flex-col bg-slate-50 min-h-screen">
      {/* ── Admin Header ── */}
      <section className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white py-5 px-4 shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <i className="fa-solid fa-shield-halved text-lg" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white leading-tight">ระบบจัดการหลังบ้าน</h1>
              <p className="text-sky-300 text-xs">Admin Dashboard · คณะเทคโนโลยีอุตสาหกรรม มนพ.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl text-xs font-semibold border border-white/15 transition"
            >
              <i className="fa-solid fa-house" /> หน้าหลัก
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-300 hover:text-red-200 px-3 py-2 rounded-xl text-xs font-semibold border border-red-400/30 transition"
            >
              <i className="fa-solid fa-right-from-bracket" /> ออกจากระบบ
            </button>
          </div>
        </div>

        {/* Tab nav */}
        <div className="max-w-7xl mx-auto mt-4">
          <nav className="flex gap-1 bg-white/5 p-1 rounded-2xl border border-white/10 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <i className={`fa-solid ${tab.icon}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-8 w-full flex-grow">

        {/* ════════════════════════════════════════
            TAB: DASHBOARD
        ════════════════════════════════════════ */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'ผู้บริหาร', value: String(personnel.filter((p) => p.department === 'คณะผู้บริหาร').length || 5), icon: 'fa-user-tie', color: 'sky' },
                { label: 'สาขาวิชา', value: '15', icon: 'fa-building-columns', color: 'indigo' },
                { label: 'อาจารย์ประจำ', value: `${personnel.filter((p) => p.department !== 'คณะผู้บริหาร' && !p.department?.includes('dept-') && !p.department?.includes('สายสนับสนุน')).length || 89} ท่าน`, icon: 'fa-chalkboard-user', color: 'violet' },
                { label: 'บุคลากรสายสนับสนุน', value: `${personnel.filter((p) => p.department?.includes('dept-') || p.department?.includes('สายสนับสนุน')).length || 38} ท่าน`, icon: 'fa-users', color: 'emerald' },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                  <div className={`w-10 h-10 rounded-xl bg-${s.color}-100 text-${s.color}-600 flex items-center justify-center mb-3`}>
                    <i className={`fa-solid ${s.icon}`} />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{s.value}</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-bolt text-amber-500" /> การดำเนินการด่วน
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <button
                  onClick={() => { setActiveTab('personnel'); openCreate(); }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-sky-50 border border-sky-100 hover:bg-sky-100 transition text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-user-plus" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">เพิ่มบุคลากรใหม่</div>
                    <div className="text-xs text-slate-500">สร้างโปรไฟล์ใหม่</div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('personnel')}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-violet-50 border border-violet-100 hover:bg-violet-100 transition text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-violet-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-list-ul" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">รายการบุคลากร</div>
                    <div className="text-xs text-slate-500">ดู / แก้ไข / ลบ</div>
                  </div>
                </button>

                <a
                  href={`https://docs.google.com/spreadsheets/d/${sheetId || '1s9Cru468Qo81ImgNAd4v8xULsWt51wAuQ4AY3nMg7WU'}/edit`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-arrow-up-right-from-square" />
                  </div>
                  <div>
                    <div className="font-bold text-emerald-900 text-sm">เปิด Google Sheets</div>
                    <div className="text-xs text-emerald-600">แก้ไขข้อมูลบุคลากรแบบสด</div>
                  </div>
                </a>

                <button
                  onClick={() => setActiveTab('settings')}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-table-cells" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">ทดสอบ Google Sheets</div>
                    <div className="text-xs text-slate-500">ตรวจสอบสถานะการเชื่อมต่อ</div>
                  </div>
                </button>
              </div>
            </div>

            {/* System info */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-circle-info text-sky-500" /> ข้อมูลระบบ
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-600 font-medium">สถานะ Google Sheets</span>
                  <span className={`font-bold ${enabled ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {enabled ? '✓ เชื่อมต่อแล้ว' : '○ ใช้ข้อมูลในเครื่อง'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-600 font-medium">ซิงค์ล่าสุด</span>
                  <span className="font-bold text-slate-800 text-xs">
                    {lastSync ? new Date(lastSync).toLocaleString('th-TH') : 'ยังไม่ได้ซิงค์'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-600 font-medium">รายการแก้ไขในระบบ</span>
                  <span className="font-bold text-slate-800">{personnel.length} รายการ</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-600 font-medium">เวอร์ชันระบบ</span>
                  <span className="font-bold text-slate-800">HR Site v2.0</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════
            TAB: PERSONNEL CRUD
        ════════════════════════════════════════ */}
        {activeTab === 'personnel' && (
          <div className="space-y-5">
            {/* Live Sheets Notification Banner */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <i className="fa-solid fa-users-gear text-lg" />
                </div>
                <div>
                  <h3 className="font-bold text-emerald-950 text-sm">จัดการข้อมูลบุคลากรได้โดยตรงจากหน้านี้</h3>
                  <p className="text-xs text-emerald-700 mt-0.5">ท่านสามารถกดปุ่ม "เพิ่มบุคลากรใหม่" หรือกด "แก้ไข" ที่รายชื่อ เพื่อปรับปรุงข้อมูลหน้าเว็บได้ทันที</p>
                </div>
              </div>
              <a
                href={`https://docs.google.com/spreadsheets/d/${sheetId || '1s9Cru468Qo81ImgNAd4v8xULsWt51wAuQ4AY3nMg7WU'}/edit`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition whitespace-nowrap"
              >
                <i className="fa-solid fa-arrow-up-right-from-square" />
                เปิด Google Sheets (สำรอง)
              </a>
            </div>

            {/* Header + Add button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <i className="fa-solid fa-users-gear text-sky-600" /> จัดการข้อมูลบุคลากร
                </h2>
                <p className="text-slate-500 text-sm mt-0.5">ค้นหา เพิ่ม และแก้ไขข้อมูลบุคลากรในระบบ</p>
              </div>
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-sm"
              >
                <i className="fa-solid fa-plus" /> เพิ่มบุคลากรใหม่
              </button>
            </div>

            {/* Success/Error message */}
            {crudMsg && (
              <div className={`rounded-2xl px-4 py-3 text-sm font-medium flex items-center gap-2 ${
                crudMsg.includes('สำเร็จ') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                <i className={`fa-solid ${crudMsg.includes('สำเร็จ') ? 'fa-circle-check' : 'fa-circle-exclamation'}`} />
                {crudMsg}
              </div>
            )}

            {/* Search */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="ค้นหาชื่อ, อีเมล..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                />
              </div>
            </div>

            {/* Personnel Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              {filteredPersonnel.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <i className="fa-solid fa-users text-4xl mb-3 block" />
                  <p className="font-semibold">ยังไม่มีข้อมูลบุคลากรในระบบ</p>
                  <p className="text-sm mt-1">กดปุ่ม "เพิ่มบุคลากรใหม่" เพื่อเริ่มต้น</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left px-5 py-3 font-bold text-slate-600 text-xs uppercase tracking-wide">ชื่อ</th>
                        <th className="text-left px-5 py-3 font-bold text-slate-600 text-xs uppercase tracking-wide hidden md:table-cell">อีเมล</th>
                        <th className="text-left px-5 py-3 font-bold text-slate-600 text-xs uppercase tracking-wide hidden lg:table-cell">สาขา/ฝ่าย</th>
                        <th className="text-left px-5 py-3 font-bold text-slate-600 text-xs uppercase tracking-wide hidden lg:table-cell">อัพเดทล่าสุด</th>
                        <th className="text-right px-5 py-3 font-bold text-slate-600 text-xs uppercase tracking-wide">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredPersonnel.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50 transition">
                          <td className="px-5 py-4">
                            <div className="font-bold text-slate-900">{p.nameEn || p.email || p.id}</div>
                            {p.nameTh && <div className="text-xs text-slate-500 mt-0.5">{p.nameTh}</div>}
                          </td>
                          <td className="px-5 py-4 hidden md:table-cell text-slate-600">{p.email || '-'}</td>
                          <td className="px-5 py-4 hidden lg:table-cell text-slate-600">{p.department || '-'}</td>
                          <td className="px-5 py-4 hidden lg:table-cell text-xs text-slate-400">
                            {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString('th-TH') : '-'}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEdit(p)}
                                className="inline-flex items-center gap-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 px-3 py-1.5 rounded-lg text-xs font-bold transition border border-sky-200"
                              >
                                <i className="fa-solid fa-pen" /> แก้ไข
                              </button>
                              <button
                                onClick={() => handleDelete(p.id, p.nameEn || p.email || p.id)}
                                className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold transition border border-red-200"
                              >
                                <i className="fa-solid fa-trash" /> ลบ
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* ── CRUD Form Modal ── */}
            {showForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-3xl">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <i className={`fa-solid ${editEntry ? 'fa-pen-to-square text-sky-600' : 'fa-user-plus text-emerald-600'}`} />
                      {editEntry ? 'แก้ไขข้อมูลบุคลากร' : 'เพิ่มบุคลากรใหม่'}
                    </h3>
                    <button
                      onClick={() => setShowForm(false)}
                      className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-700 transition"
                    >
                      <i className="fa-solid fa-xmark" />
                    </button>
                  </div>

                  <form onSubmit={handleSavePersonnel} className="p-6 space-y-6">
                    {/* Section 1: Basic Information */}
                    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                        <i className="fa-solid fa-id-card text-sky-600" /> ข้อมูลทั่วไป
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            ชื่อ-นามสกุล (ภาษาไทย) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.nameTh || ''}
                            onChange={(e) => setFormData({ ...formData, nameTh: e.target.value })}
                            placeholder="ผศ.กาญจน์ กันปัญญา"
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            ชื่อ-นามสกุล (ภาษาอังกฤษ)
                          </label>
                          <input
                            type="text"
                            value={formData.nameEn || ''}
                            onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                            placeholder="Asst. Prof. Karn Kanpanya"
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            อีเมล <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email || ''}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="karn@npu.ac.th"
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            รหัสผ่านเข้าใช้งาน (Password)
                          </label>
                          <input
                            type="text"
                            value={formData.password || ''}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="npu1234"
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white font-mono"
                          />
                          <p className="text-[10px] text-slate-400 mt-0.5">ใช้สำหรับให้อาจารย์ล็อกอินแก้ไขโปรไฟล์ตนเอง</p>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            เบอร์โทรศัพท์
                          </label>
                          <input
                            type="text"
                            value={formData.phone || ''}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="042-503-777"
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            ตำแหน่ง / ตำแหน่งทางวิชาการ
                          </label>
                          <input
                            type="text"
                            value={formData.position || ''}
                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                            placeholder="หัวหน้าหลักสูตร / อาจารย์ประจำสาขาวิชา"
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            สาขาวิชา / ฝ่ายงาน
                          </label>
                          <input
                            type="text"
                            list="dept-options"
                            value={formData.department || ''}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            placeholder="สาขาวิชาไฟฟ้ากำลัง"
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            ห้องทำงาน / สถานที่
                          </label>
                          <input
                            type="text"
                            value={formData.location || ''}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="สาขาวิชาไฟฟ้ากำลัง คณะเทคโนโลยีอุตสาหกรรม"
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
                          />
                        </div>
                        <div className="md:col-span-2 pt-1">
                          <label className="inline-flex items-center gap-2.5 cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition">
                            <input
                              type="checkbox"
                              checked={Boolean(formData.isHead)}
                              onChange={(e) => setFormData({ ...formData, isHead: e.target.checked })}
                              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                            />
                            <span>หัวหน้าหลักสูตร / ประธานสาขาวิชา / หัวหน้าฝ่าย (แสดงเด่นด้านบนสุดของสาขา)</span>
                          </label>
                        </div>
                      </div>

                      <datalist id="dept-options">
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

                    {/* Section 2: Media & Calendar */}
                    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                        <i className="fa-solid fa-image text-indigo-600" /> รูปภาพและปฏิทินปฏิบัติราชการ
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            URL รูปภาพโปรไฟล์
                          </label>
                          <input
                            type="text"
                            value={formData.imageUrl || ''}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            placeholder="img/ผศ.กาญจน์ กันปัญญา.jpg หรือ https://..."
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
                          />
                        </div>
                        {formData.imageUrl && (
                          <div className="md:col-span-2 flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200">
                            <img
                              src={formData.imageUrl}
                              alt="Preview"
                              className="w-14 h-14 rounded-lg object-cover border border-slate-200"
                              onError={(e) => { (e.target as HTMLImageElement).src = '/img/avatar-placeholder.svg'; }}
                            />
                            <div className="text-xs text-slate-500">
                              <span className="font-semibold text-slate-700 block">ตัวอย่างรูปภาพ</span>
                              รูปจะแสดงบนการ์ดและป๊อปอัปหน้าเว็บ
                            </div>
                          </div>
                        )}
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Google Calendar URL (ปฏิทิน/ตารางนัดหมาย)
                          </label>
                          <input
                            type="text"
                            value={formData.calendarUrl || ''}
                            onChange={(e) => setFormData({ ...formData, calendarUrl: e.target.value })}
                            placeholder="https://calendar.google.com/calendar/embed?src=..."
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Expertise, Education & Skills */}
                    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                        <i className="fa-solid fa-graduation-cap text-emerald-600" /> ความเชี่ยวชาญ การศึกษา และทักษะ
                      </h4>
                      <div className="space-y-3.5">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            ความสนใจและงานวิจัยที่เชี่ยวชาญ (Research interests)
                          </label>
                          <textarea
                            value={formData.researchInterests || ''}
                            onChange={(e) => setFormData({ ...formData, researchInterests: e.target.value })}
                            placeholder="วิศวกรรมระบบไฟฟ้ากำลัง, การจัดการพลังงานหมุนเวียน (Renewable Energy Systems)"
                            rows={2}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            ประวัติการศึกษา (แต่ละบรรทัด = 1 วุฒิการศึกษา)
                          </label>
                          <textarea
                            value={
                              Array.isArray(formData.education)
                                ? formData.education.join('\n')
                                : formData.education || ''
                            }
                            onChange={(e) => setFormData({ ...formData, education: e.target.value.split('\n') })}
                            placeholder="Ph.D. Electrical Engineering, Khon Kaen University, 2010&#10;M.Eng. Power Systems, KMUTT, 2005"
                            rows={3}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white resize-none font-mono text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            ทักษะและความเชี่ยวชาญ (แต่ละบรรทัด = 1 ทักษะ)
                          </label>
                          <textarea
                            value={
                              Array.isArray(formData.skills)
                                ? formData.skills.join('\n')
                                : formData.skills || ''
                            }
                            onChange={(e) => setFormData({ ...formData, skills: e.target.value.split('\n') })}
                            placeholder="Power System Analysis&#10;PLC Programming&#10;Energy Management"
                            rows={3}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white resize-none font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {crudMsg && (
                      <div className="text-sm text-red-600 font-medium flex items-center gap-1.5 p-3 bg-red-50 rounded-xl border border-red-200">
                        <i className="fa-solid fa-circle-exclamation" /> {crudMsg}
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={crudLoading}
                        className="flex-1 bg-sky-600 hover:bg-sky-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
                      >
                        {crudLoading ? (
                          <><i className="fa-solid fa-circle-notch fa-spin" /> กำลังบันทึก...</>
                        ) : (
                          <><i className="fa-solid fa-floppy-disk" /> บันทึกข้อมูล</>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-sm transition"
                      >
                        ยกเลิก
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════
            TAB: GOOGLE SHEETS SETTINGS
        ════════════════════════════════════════ */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-table-cells text-emerald-600" /> ตั้งค่า Google Sheets
              </h2>
              <p className="text-slate-500 text-sm mt-0.5">เชื่อมต่อฐานข้อมูลบุคลากรกับ Google Sheets</p>
            </div>

            {/* Status Card */}
            <div className={`rounded-3xl p-5 border ${enabled ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${enabled ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                  <i className={`fa-solid ${enabled ? 'fa-plug-circle-check' : 'fa-plug-circle-xmark'}`} />
                </div>
                <div>
                  <div className={`font-bold text-sm ${enabled ? 'text-emerald-800' : 'text-amber-800'}`}>
                    {enabled ? 'เชื่อมต่อ Google Sheets แล้ว' : 'ใช้ข้อมูลในเครื่อง (Offline Mode)'}
                  </div>
                  <div className={`text-xs ${enabled ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {lastSync ? `ซิงค์ล่าสุด: ${new Date(lastSync).toLocaleString('th-TH')}` : 'ยังไม่มีการซิงค์'}
                  </div>
                </div>
              </div>
            </div>

            {/* Config form */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                  <i className="fa-solid fa-link mr-1.5 text-slate-400" />
                  URL ของ Google Sheet
                </label>
                <input
                  type="text"
                  value={sheetId}
                  onChange={(e) => setSheetId(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/SHEET_ID/edit"
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition font-mono"
                />
                <p className="text-xs text-slate-400 mt-1.5">วาง URL หรือ Sheet ID จาก Google Sheets</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                  <i className="fa-solid fa-cloud-arrow-up mr-1.5 text-emerald-600" />
                  URL ของ Google Apps Script (Web App สำหรับให้อาจารย์กดบันทึกแล้วเข้าชีตอัตโนมัติ)
                </label>
                <input
                  type="text"
                  value={sheetApiUrl}
                  onChange={(e) => setSheetApiUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition font-mono"
                />
                <p className="text-xs text-slate-400 mt-1.5">
                  เมื่อใส่ URL นี้ บุคลากรจะสามารถกดบันทึกโปรไฟล์ผ่านหน้าเว็บแล้วข้อมูลจะวิ่งเข้า Google Sheets ทันที
                </p>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setEnabled(!enabled)}
                  className={`w-11 h-6 rounded-full transition-all relative ${enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'left-5' : 'left-0.5'}`} />
                </button>
                <div>
                  <div className="font-bold text-slate-800 text-sm">เปิดใช้งาน Google Sheets</div>
                  <div className="text-xs text-slate-500">เมื่อปิดจะใช้ข้อมูลในเครื่องแทน</div>
                </div>
              </div>

              {/* Test Result */}
              {testResult && (
                <div className={`rounded-2xl p-4 border text-sm space-y-2 ${
                  testResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  <div className="flex items-center gap-2 font-bold">
                    <i className={`fa-solid ${testResult.success ? 'fa-circle-check' : 'fa-circle-exclamation'}`} />
                    {testResult.message}
                  </div>
                  {testResult.details && (
                    <div className="grid grid-cols-2 gap-1 text-xs pt-1">
                      {Object.entries(testResult.details).map(([k, v]) => (
                        <div key={k} className="flex justify-between bg-white/60 rounded-lg px-2 py-1">
                          <span className="font-medium">{k}</span>
                          <span className="font-bold">{v} รายการ</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {saveSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl p-3 text-sm flex items-center gap-2 font-bold">
                  <i className="fa-solid fa-circle-check" /> บันทึกการตั้งค่าสำเร็จแล้ว!
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleTest}
                  disabled={configLoading || !sheetId}
                  className="flex-1 bg-sky-100 hover:bg-sky-200 disabled:opacity-50 text-sky-800 font-bold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
                >
                  {configLoading ? <i className="fa-solid fa-circle-notch fa-spin" /> : <i className="fa-solid fa-vial" />}
                  ทดสอบการเชื่อมต่อ
                </button>
                <button
                  onClick={handleSave}
                  disabled={configLoading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-floppy-disk" /> บันทึกการตั้งค่า
                </button>
              </div>
            </div>

            {/* 14 Unified Columns Guide & Table */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-black text-slate-900 flex items-center gap-2">
                  <i className="fa-solid fa-table-list text-sky-600" />
                  โครงสร้าง 14 คอลัมน์มาตรฐาน Google Sheets (ตรงกันทุกหน้า 100%)
                </h3>
                <a
                  href="/google-apps-script.js"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-bold border border-sky-200 transition"
                >
                  <i className="fa-solid fa-code" /> ดูโค้ด Apps Script ทั้งหมด
                </a>
              </div>
              <p className="text-xs text-slate-500">
                ตารางข้อมูลใน Google Sheets (แท็บ Lecturers, Staff, Executives) จะใช้คอลัมน์มาตรฐาน 14 ฟิลด์นี้ตรงกันกับหน้าแก้ไขแอดมิน และหน้าแก้ไขโปรไฟล์อาจารย์:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
                {[
                  { col: 'A', name: 'departmentSlug', label: 'รหัสสาขา/ฝ่าย' },
                  { col: 'B', name: 'name', label: 'ชื่อ-นามสกุล (ไทย)' },
                  { col: 'C', name: 'position', label: 'ตำแหน่ง' },
                  { col: 'D', name: 'isHead', label: 'หัวหน้าหลักสูตร (TRUE/FALSE)' },
                  { col: 'E', name: 'img', label: 'URL หรือ path รูปภาพ' },
                  { col: 'F', name: 'email', label: 'อีเมล' },
                  { col: 'G', name: 'passwd', label: 'รหัสผ่านเข้าสู่ระบบ' },
                  { col: 'H', name: 'phone', label: 'เบอร์โทรศัพท์' },
                  { col: 'I', name: 'location', label: 'ห้องทำงาน/สถานที่' },
                  { col: 'J', name: 'calendarName', label: 'ชื่อ-นามสกุล (อังกฤษ)' },
                  { col: 'K', name: 'calendarUrl', label: 'Google Calendar URL' },
                  { col: 'L', name: 'researchInterests', label: 'ความเชี่ยวชาญ/งานวิจัย' },
                  { col: 'M', name: 'education', label: 'ประวัติการศึกษา' },
                  { col: 'N', name: 'skills', label: 'ทักษะความเชี่ยวชาญ' },
                ].map((item) => (
                  <div key={item.col} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="inline-block px-1.5 py-0.5 rounded bg-sky-600 text-white font-mono text-[10px] font-bold mr-1.5">
                      คอลัมน์ {item.col}
                    </span>
                    <div className="font-mono text-slate-800 font-bold text-[11px] mt-1">{item.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* How-to guide */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
              <h3 className="font-black text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-book-open text-sky-600" />
                คู่มือเชื่อมต่อ Google Sheets
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { step: '1', title: 'สร้าง Google Sheet', desc: 'เปิด sheets.new แล้วตั้งชื่อไฟล์ว่า "HR_SITE_DATABASE"' },
                  { step: '2', title: 'นำเข้าไฟล์ CSV', desc: 'ไปที่ ไฟล์ › นำเข้า แล้ว Upload ทั้ง 5 ไฟล์จากโฟลเดอร์ /sheets' },
                  { step: '3', title: 'เปิดสิทธิ์การแชร์', desc: 'กด Share › เปลี่ยนเป็น "ทุกคนที่มีลิงก์มีสิทธิ์ดู"' },
                  { step: '4', title: 'วาง URL ด้านบน', desc: 'คัดลอก URL ใน Address Bar มาวางในช่อง แล้วกด ทดสอบการเชื่อมต่อ' },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-3 p-4 bg-sky-50/60 rounded-2xl border border-sky-100">
                    <span className="w-7 h-7 rounded-full bg-sky-600 text-white font-bold inline-flex items-center justify-center text-xs flex-shrink-0">
                      {step}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {['Executives.csv', 'Departments.csv', 'Lecturers.csv', 'Divisions.csv', 'Staff.csv'].map((f) => (
                  <a
                    key={f}
                    href={`/sheets/${f}`}
                    download
                    className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition border border-slate-200"
                  >
                    <i className="fa-solid fa-download text-slate-500" /> {f}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
