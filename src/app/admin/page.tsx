'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
  position?: string;
  department?: string;
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
    // Load sheet config
    fetch('/api/admin/config')
      .then((r) => r.json())
      .then((d) => {
        if (d.config) {
          setSheetId(d.config.sheetId || '');
          setEnabled(d.config.enabled || false);
          setLastSync(d.config.lastSync || null);
        }
      })
      .catch(() => {});

    // Load personnel overrides
    loadPersonnel();
  }, []);

  function loadPersonnel() {
    fetch('/api/admin/personnel')
      .then((r) => r.json())
      .then((d) => {
        if (d.data) {
          setPersonnel(Object.values(d.data) as PersonnelEntry[]);
        }
      })
      .catch(() => {});
  }

  // ─── Logout ───
  const handleLogout = async () => {
    if (!confirm('ต้องการออกจากระบบหรือไม่?')) return;
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  // ─── Google Sheets ───
  const handleTest = async () => {
    setConfigLoading(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sheetId, action: 'test' }),
      });
      setTestResult(await res.json());
    } catch (e: any) {
      setTestResult({ success: false, message: e.message });
    } finally {
      setConfigLoading(false);
    }
  };

  const handleSave = async () => {
    setConfigLoading(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sheetId, action: 'save', enabled }),
      });
      const d = await res.json();
      if (d.success) {
        setSaveSuccess(true);
        setLastSync(new Date().toISOString());
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch {}
    finally { setConfigLoading(false); }
  };

  // ─── CRUD ───
  const openCreate = () => {
    setEditEntry(null);
    setFormData({});
    setShowForm(true);
    setCrudMsg('');
  };

  const openEdit = (p: PersonnelEntry) => {
    setEditEntry(p);
    setFormData({ ...p });
    setShowForm(true);
    setCrudMsg('');
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`ลบ "${name}" ออกจากระบบหรือไม่?`)) return;
    setCrudLoading(true);
    try {
      await fetch(`/api/admin/personnel/${id}`, { method: 'DELETE' });
      loadPersonnel();
      setCrudMsg('ลบข้อมูลสำเร็จ');
    } catch { setCrudMsg('เกิดข้อผิดพลาด'); }
    finally { setCrudLoading(false); }
  };

  const handleSavePersonnel = async (e: React.FormEvent) => {
    e.preventDefault();
    setCrudLoading(true);
    setCrudMsg('');
    try {
      const id = editEntry?.id;
      const url = id ? `/api/admin/personnel/${id}` : '/api/admin/personnel';
      const method = id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const d = await res.json();
      if (d.success) {
        setCrudMsg(d.message);
        setShowForm(false);
        loadPersonnel();
      } else {
        setCrudMsg(d.message || 'เกิดข้อผิดพลาด');
      }
    } catch (e: any) { setCrudMsg(e.message); }
    finally { setCrudLoading(false); }
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
                { label: 'ผู้บริหาร', value: '5', icon: 'fa-user-tie', color: 'sky' },
                { label: 'สาขาวิชา', value: '15', icon: 'fa-building-columns', color: 'indigo' },
                { label: 'อาจารย์ประจำ', value: '90+', icon: 'fa-chalkboard-user', color: 'violet' },
                { label: 'บุคลากรสายสนับสนุน', value: '39+', icon: 'fa-users', color: 'emerald' },
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

                <button
                  onClick={() => setActiveTab('settings')}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-table-cells" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">Google Sheets</div>
                    <div className="text-xs text-slate-500">ตั้งค่าฐานข้อมูล</div>
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
            {/* Header + Add button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <i className="fa-solid fa-users-gear text-sky-600" /> จัดการข้อมูลบุคลากร
                </h2>
                <p className="text-slate-500 text-sm mt-0.5">สร้าง แก้ไข และลบข้อมูลบุคลากร</p>
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

                  <form onSubmit={handleSavePersonnel} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { key: 'nameEn', label: 'ชื่อ-นามสกุล (ภาษาอังกฤษ)', placeholder: 'Assoc. Prof. Somchai Chai' },
                        { key: 'nameTh', label: 'ชื่อ-นามสกุล (ภาษาไทย)', placeholder: 'รศ.ดร. สมชาย ใจดี' },
                        { key: 'email', label: 'อีเมล', placeholder: 'somchai@npu.ac.th' },
                        { key: 'phone', label: 'โทรศัพท์', placeholder: '042-500000' },
                        { key: 'position', label: 'ตำแหน่ง', placeholder: 'อาจารย์ประจำ' },
                        { key: 'department', label: 'สาขาวิชา / ฝ่าย', placeholder: 'วิศวกรรมไฟฟ้ากำลัง' },
                        { key: 'location', label: 'ห้องทำงาน / สถานที่', placeholder: 'อาคาร 1 ชั้น 2' },
                        { key: 'imageUrl', label: 'URL รูปภาพ', placeholder: 'https://...' },
                        { key: 'calendarUrl', label: 'Google Calendar URL', placeholder: 'https://calendar.google.com/...' },
                      ].map(({ key, label, placeholder }) => (
                        <div key={key} className={key === 'imageUrl' || key === 'calendarUrl' ? 'md:col-span-2' : ''}>
                          <label className="block text-xs font-bold text-slate-700 mb-1">{label}</label>
                          <input
                            type="text"
                            value={(formData as any)[key] || ''}
                            onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                            placeholder={placeholder}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                          />
                        </div>
                      ))}

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">ความสนใจในการวิจัย</label>
                        <textarea
                          value={(formData as any).researchInterests || ''}
                          onChange={(e) => setFormData({ ...formData, researchInterests: e.target.value })}
                          placeholder="วิศวกรรมระบบไฟฟ้า, พลังงานทดแทน, ..."
                          rows={2}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition resize-none"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">ประวัติการศึกษา (คั่นด้วยบรรทัดใหม่)</label>
                        <textarea
                          value={
                            Array.isArray((formData as any).education)
                              ? (formData as any).education.join('\n')
                              : (formData as any).education || ''
                          }
                          onChange={(e) => setFormData({ ...formData, education: e.target.value.split('\n') })}
                          placeholder="Ph.D. Electrical Engineering, Khon Kaen University, 2010&#10;M.Eng. ..., 2005"
                          rows={3}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition resize-none"
                        />
                      </div>
                    </div>

                    {crudMsg && (
                      <div className="text-sm text-red-600 font-medium flex items-center gap-1.5">
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
