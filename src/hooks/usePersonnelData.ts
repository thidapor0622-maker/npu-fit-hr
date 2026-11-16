'use client';

import { useState, useEffect } from 'react';
import { EXECUTIVES_DATA, ExecutiveDetail } from '@/data/executives';
import { DEPARTMENTS_DATA, Department, Personnel } from '@/data/departments';
import { STAFF_DIVISIONS_DATA, StaffDivision } from '@/data/staff-divisions';
import { isSamePersonnel, normalizeThaiNameForMatch } from '@/lib/personnelHelper';

// Resolve any department or division string to standard staff division slug
export function resolveStaffDivisionSlug(raw?: string): string {
  const str = String(raw || '').toLowerCase().trim();
  if (!str) return '';
  if (str === 'dept-admin' || str.includes('admin') || str.includes('บริหาร') || str.includes('คณบดี') || str.includes('สารบรรณ')) return 'dept-admin';
  if (str === 'dept-academic' || str.includes('academic') || str.includes('วิชาการ')) return 'dept-academic';
  if (str === 'dept-finance' || str.includes('finance') || str.includes('วิจัย') || str.includes('แผนงาน') || str.includes('งบประมาณ') || str.includes('ประกัน')) return 'dept-finance';
  if (str === 'dept-facility' || str.includes('facility') || str.includes('พัฒนา') || str.includes('อาคาร') || str.includes('บริการการศึกษา')) return 'dept-facility';
  return str;
}

// Parse GViz response from Google Sheets directly in browser (CORS-friendly with real-time cache-busting)
export async function fetchClientGViz(sheetId: string, sheetName: string): Promise<Record<string, any>[]> {
  const ts = Date.now();
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}&tq=&_=${ts}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Fetch failed');
  const text = await res.text();
  const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\);/);
  if (!jsonMatch || !jsonMatch[1]) throw new Error('Invalid GViz response');
  const data = JSON.parse(jsonMatch[1]);
  if (data.status === 'error') throw new Error('GViz Error');

  let rows: any[] = data.table?.rows || [];
  if (rows.length === 0) return [];

  // Determine headers: if col.label is empty, row 0 contains the header names
  let headers: string[] = (data.table.cols || []).map((col: any) => String(col.label || '').trim());
  const hasLabels = headers.some((h) => h.length > 0);

  if (!hasLabels && rows.length > 0) {
    headers = (rows[0].c || []).map((cell: any) => String(cell?.v ?? '').trim());
    rows = rows.slice(1);
  }

  return rows.map((row: any) => {
    const item: Record<string, any> = {};
    row.c?.forEach((cell: any, index: number) => {
      const colName = headers[index] || `col_${index}`;
      item[colName] = cell && cell.v !== null && cell.v !== undefined ? cell.v : '';
    });
    return item;
  });
}

function getLocalOverrides(): Record<string, any> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = JSON.parse(localStorage.getItem('hr_personnel_overrides') || '{}');
    if (!raw || typeof raw !== 'object') return {};

    // Sanitize and consolidate duplicate keys in localStorage
    const clean: Record<string, any> = {};
    const seenIdentities = new Set<string>();

    Object.entries(raw).forEach(([k, val]: [string, any]) => {
      if (!val || typeof val !== 'object') return;
      if (val.deleted) {
        clean[k] = val;
        return;
      }

      // Purge any corrupted override where Weeratham was mistakenly saved over Boonlert
      const nameTh = String(val.nameTh || val.name || '');
      const keyStr = String(k || '').toLowerCase();
      const valEmail = String(val.email || '').toLowerCase().trim();
      const valId = String(val.id || '').toLowerCase().trim();

      if ((keyStr === 'boonlert' || keyStr === 'boonlert@npu.ac.th' || valId === 'boonlert' || valEmail === 'boonlert@npu.ac.th') && nameTh.includes('วีรธรรม')) {
        return;
      }

      // Automatically clean trailing 'vvv' from Weeratham if present
      if (nameTh.includes('วีรธรรม')) {
        val.nameTh = nameTh.replace(/v+$/i, '').trim();
        if (val.name) val.name = String(val.name).replace(/v+$/i, '').trim();
        if (val.position && val.position.includes('คณะเทคโนโลยีอุตสาหกรรม') && !val.position.includes('ฝ่าย')) {
          val.position = 'รองคณบดีฝ่ายบริหาร';
        }
        val.email = 'weeratham@npu.ac.th';
        val.imageUrl = '/img/รอง1.png';
      }

      // Automatically purge any temporary test records
      const nameEn = String(val.nameEn || val.calendarName || '');
      if (nameEn.toLowerCase().includes('test') || nameTh.toLowerCase().includes('test') || keyStr.includes('test')) {
        return;
      }

      const emailKey = (val.email || '').toLowerCase().trim();
      const nameKey = normalizeThaiNameForMatch(val.nameTh || val.name || k);
      const identKey = emailKey || nameKey;

      if (!identKey) {
        clean[k] = val;
        return;
      }

      // If already seen this person under another key, don't store multiple duplicate keys
      if (!seenIdentities.has(identKey)) {
        seenIdentities.add(identKey);
        const canonicalKey = emailKey || val.id || k;
        clean[canonicalKey] = val;
      }
    });

    // Write back cleaned version to localStorage
    if (Object.keys(clean).length !== Object.keys(raw).length) {
      localStorage.setItem('hr_personnel_overrides', JSON.stringify(clean));
    }

    return clean;
  } catch {
    return {};
  }
}

function applyOverridesToExecs(execMap: Record<string, ExecutiveDetail>, overrides: Record<string, any>): Record<string, ExecutiveDetail> {
  const result: Record<string, ExecutiveDetail> = {};
  for (const [key, ex] of Object.entries(execMap)) {
    // Look up override specifically matching this executive by id, exact name, or compatible email
    let ov = overrides[ex.id] || (ex.name ? overrides[ex.name.trim()] : null);
    if (!ov && ex.email) {
      const emailOv = overrides[ex.email.toLowerCase()];
      if (emailOv && isSamePersonnel(ex, emailOv)) {
        ov = emailOv;
      }
    }

    if (ov && ov.deleted) continue;
    if (ov) {
      let finalName = ov.nameTh || ex.name;
      let finalPos = ov.position || ex.position;
      let finalEmail = ov.email || ex.email;
      let finalImg = ov.imageUrl || ex.img;

      // Enforce Dean Dr. Boonlert protection
      if (ex.id === 'boonlert' || key === 'boonlert') {
        if (finalName.includes('วีรธรรม') || !finalName.includes('บุญเลิศ')) {
          finalName = 'ดร.บุญเลิศ โพธิ์ขำ';
        }
        if (finalPos.includes('รอง') || !finalPos.includes('คณบดี')) {
          finalPos = 'คณบดีคณะเทคโนโลยีอุตสาหกรรม';
        }
        finalEmail = 'boonlert@npu.ac.th';
        finalImg = '/img/คณบดี.png';
      }

      // Enforce Weeratham clean name
      if (ex.id === 'weeratham' || key === 'weeratham' || finalName.includes('วีรธรรม')) {
        finalName = finalName.replace(/v+$/i, '').trim();
        if (!finalName) finalName = 'ผศ.วีรธรรม ไชยยงค์';
        if (!finalPos || finalPos.includes('คณะเทคโนโลยีอุตสาหกรรม')) finalPos = 'รองคณบดีฝ่ายบริหาร';
        finalEmail = 'weeratham@npu.ac.th';
        finalImg = '/img/รอง1.png';
      }

      result[key] = {
        ...ex,
        name: finalName,
        position: finalPos,
        phone: ov.phone || ex.phone,
        email: finalEmail,
        room: ov.location || ex.room,
        img: finalImg,
        education: ov.education || ex.education,
        skills: ov.skills || ex.skills,
      };
    } else {
      result[key] = ex;
    }
  }
  return result;
}

export function splitHeadAndMembers(allCards: Personnel[]): { head: Personnel | null; members: Personnel[] } {
  if (allCards.length === 0) return { head: null, members: [] };

  // Find head: prefer explicit isHead === true, then title containing 'หัวหน้า' / 'ประธาน' / 'ผู้อำนวยการ'
  const head =
    allCards.find((p: any) => p.isHead === true) ||
    allCards.find((p: any) => p.isHead !== false && p.position && (p.position.includes('หัวหน้า') || p.position.includes('ประธาน') || p.position.includes('ผู้อำนวยการ'))) ||
    allCards[0];

  // Members must exclude the head by reference AND by identity (email/name)
  const members = allCards.filter((p) => {
    if (!head) return true;
    if (p === head) return false;
    if (isSamePersonnel(p, head)) return false;
    return true;
  });

  return { head, members };
}

export function applyOverridesToPersonnel(list: Personnel[], overrides: Record<string, any>, deptOrDivSlug?: string): Personnel[] {
  const consumedKeys = new Set<string>();
  const result: Personnel[] = [];

  // Helper to mark all aliases of an override record as consumed
  const markConsumed = (ov: any, matchedKey?: string) => {
    if (matchedKey) consumedKeys.add(matchedKey);
    Object.entries(overrides).forEach(([k, item]) => {
      if (item === ov || isSamePersonnel(item, ov) || isSamePersonnel({ name: k, email: k }, ov)) {
        consumedKeys.add(k);
      }
    });
  };

  // Phase 1: Apply overrides to existing personnel in list
  list.forEach((p) => {
    // Find matching override: check direct key first, then identity matching
    let matchedKey =
      (p.email && overrides[p.email.toLowerCase().trim()] ? p.email.toLowerCase().trim() : null) ||
      (p.name && overrides[p.name.trim()] ? p.name.trim() : null);

    let ov = matchedKey ? overrides[matchedKey] : null;

    if (!ov) {
      const foundEntry = Object.entries(overrides).find(([k, item]) => {
        if (!item || item.deleted) return false;
        return isSamePersonnel(p, item) || isSamePersonnel(p, { name: k, email: k });
      });
      if (foundEntry) {
        matchedKey = foundEntry[0];
        ov = foundEntry[1];
      }
    }

    if (ov) {
      markConsumed(ov, matchedKey || undefined);
    }

    if (ov && ov.deleted) return;

    if (ov) {
      let finalName = ov.nameTh || ov.name || p.name;
      let finalEmail = ov.email || p.email;
      let finalPos = ov.position || p.position;
      let finalImg = ov.imageUrl || ov.img || p.img;

      if (finalName.includes('วีรธรรม') || (p.email && p.email.toLowerCase() === 'weeratham@npu.ac.th')) {
        finalName = finalName.replace(/v+$/i, '').trim();
        finalEmail = 'weeratham@npu.ac.th';
        finalImg = '/img/รอง1.png';
        if (finalPos.includes('คณะเทคโนโลยีอุตสาหกรรม') && !finalPos.includes('ฝ่าย')) {
          finalPos = 'รองคณบดีฝ่ายบริหาร';
        }
      }

      result.push({
        ...p,
        name: finalName,
        nameEn: ov.nameEn || p.nameEn,
        position: finalPos,
        phone: ov.phone || p.phone,
        email: finalEmail,
        location: ov.location || p.location,
        img: finalImg,
        calendarName: ov.nameEn || p.calendarName || finalName,
        calendarUrl: ov.calendarUrl || (p as any).calendarUrl || '',
        education: ov.education || p.education || [],
        skills: ov.skills || p.skills || [],
        researchInterests: ov.researchInterests || p.researchInterests || '',
        isHead: ov.isHead !== undefined ? Boolean(ov.isHead) : (p as any).isHead,
        departmentSlug: ov.departmentSlug || (p as any).departmentSlug,
      });
    } else {
      result.push(p);
    }
  });

  // Phase 2: Append genuinely NEW personnel added for this department/division
  if (deptOrDivSlug) {
    const currentSlug = deptOrDivSlug.toLowerCase().trim();

    Object.entries(overrides).forEach(([key, ov]) => {
      if (!ov || ov.deleted || consumedKeys.has(key)) return;

      const rawTarget = String(ov.departmentSlug || ov.department || ov.divisionSlug || '').toLowerCase().trim();
      const resolvedTarget = resolveStaffDivisionSlug(rawTarget) || rawTarget;
      const isDeptMatch = resolvedTarget && (resolvedTarget === currentSlug || resolvedTarget.includes(currentSlug) || currentSlug.includes(resolvedTarget));
      if (!isDeptMatch) return;

      // CRITICAL: Check if this person is already in result!
      const existingIdx = result.findIndex((existing) => isSamePersonnel(existing, ov) || isSamePersonnel(existing, { name: key, email: key }));

      if (existingIdx !== -1) {
        // Person ALREADY exists in result! Update in-place, DO NOT APPEND A NEW CARD!
        markConsumed(ov, key);
        const existing = result[existingIdx];
        result[existingIdx] = {
          ...existing,
          name: ov.nameTh || ov.name || existing.name,
          nameEn: ov.nameEn || existing.nameEn,
          position: ov.position || existing.position,
          phone: ov.phone || existing.phone,
          email: ov.email || existing.email,
          location: ov.location || existing.location,
          img: ov.imageUrl || ov.img || existing.img,
          calendarName: ov.nameEn || existing.calendarName || ov.nameTh || existing.name,
          calendarUrl: ov.calendarUrl || (existing as any).calendarUrl || '',
          education: ov.education || existing.education || [],
          skills: ov.skills || existing.skills || [],
          researchInterests: ov.researchInterests || existing.researchInterests || '',
          isHead: ov.isHead !== undefined ? Boolean(ov.isHead) : (existing as any).isHead,
          departmentSlug: ov.departmentSlug || deptOrDivSlug,
        };
        return;
      }

      // Truly new person: append once and mark consumed
      markConsumed(ov, key);
      result.push({
        name: ov.nameTh || ov.name || 'อาจารย์ใหม่',
        nameEn: ov.nameEn || '',
        position: ov.position || 'อาจารย์ประจำสาขาวิชา',
        img: ov.imageUrl || ov.img || '/img/avatar-placeholder.svg',
        email: ov.email || '',
        phone: ov.phone || '',
        location: ov.location || deptOrDivSlug,
        calendarName: ov.nameEn || ov.nameTh || '',
        calendarUrl: ov.calendarUrl || '',
        education: ov.education || [],
        skills: ov.skills || [],
        researchInterests: ov.researchInterests || '',
        isHead: Boolean(ov.isHead),
        departmentSlug: ov.departmentSlug || deptOrDivSlug,
      } as any);
    });
  }

  // Final Pass: Deduplicate entire result list by identity to guarantee 0% duplicates
  const finalUnique: Personnel[] = [];
  for (const person of result) {
    const isDup = finalUnique.some((u) => isSamePersonnel(u, person));
    if (!isDup) {
      finalUnique.push(person);
    }
  }

  return finalUnique;
}

export function usePersonnelData() {
  const [executives, setExecutives] = useState<Record<string, ExecutiveDetail>>(EXECUTIVES_DATA);
  const [departments, setDepartments] = useState<Department[]>(DEPARTMENTS_DATA);
  const [staffDivisions, setStaffDivisions] = useState<StaffDivision[]>(STAFF_DIVISIONS_DATA);
  const [source, setSource] = useState<'google_sheets' | 'local_fallback'>('local_fallback');
  const [isLiveSheet, setIsLiveSheet] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const customSheetId = typeof window !== 'undefined' ? localStorage.getItem('hr_custom_sheet_id') : null;
    const sheetId = customSheetId || process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || '1s9Cru468Qo81ImgNAd4v8xULsWt51wAuQ4AY3nMg7WU';

    const handleUpdate = () => {
      const ov = getLocalOverrides();
      setExecutives((prev) => applyOverridesToExecs(prev, ov));
      setDepartments((prev) =>
        prev.map((d) => {
          const allCards = applyOverridesToPersonnel(d.allCards, ov, d.slug);
          const { head, members } = splitHeadAndMembers(allCards);
          return {
            ...d,
            allCards,
            head,
            members,
          };
        })
      );
      setStaffDivisions((prev) =>
        prev.map((div) => {
          const allCards = applyOverridesToPersonnel(div.allCards, ov, div.slug);
          const { head, members } = splitHeadAndMembers(allCards);
          return {
            ...div,
            allCards,
            head,
            members,
          };
        })
      );
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('hr_personnel_updated', handleUpdate);
      // Apply existing overrides on mount
      handleUpdate();
    }

    // 1. If Google Sheet ID is provided via env, fetch directly in browser
    if (sheetId) {
      setLoading(true);
      Promise.all([
        fetchClientGViz(sheetId, 'Executives').catch(() => null),
        fetchClientGViz(sheetId, 'Departments').catch(() => null),
        fetchClientGViz(sheetId, 'Lecturers').catch(() => null),
        fetchClientGViz(sheetId, 'Divisions').catch(() => null),
        fetchClientGViz(sheetId, 'Staff').catch(() => null),
      ])
        .then(([execRows, deptRows, lecRows, divRows, staffRows]) => {
          if (!isMounted) return;

          // Parse Executives (Live Sync with Google Sheets)
          if (execRows && execRows.length > 0) {
            const baseExecMap: Record<string, ExecutiveDetail> = { ...EXECUTIVES_DATA };
            for (const r of execRows) {
              const rawName = String(r.name || r.nameTh || '').trim();
              const rawPos = String(r.position || '').trim();
              const rawEmail = String(r.email || '').trim().toLowerCase();
              const rawId = String(r.id || '').trim().toLowerCase();
              if (!rawName && !rawPos && !rawEmail && !rawId) continue;

              // Identify matching executive key in baseExecMap
              let targetKey = Object.keys(baseExecMap).find((k) => {
                const ex = baseExecMap[k];
                if (rawId && ex.id.toLowerCase() === rawId) return true;
                if (rawName && rawName.includes('บุญเลิศ') && ex.id === 'boonlert') return true;
                if (rawName && rawName.includes('วีรธรรม') && ex.id === 'weeratham') return true;
                if (rawName && rawName.includes('บุญเยี่ยม') && ex.id === 'boonyiem') return true;
                if (rawName && rawName.includes('วีระ') && ex.id === 'weera') return true;
                if (rawName && (rawName.includes('ยอดเปรม') || rawName.includes('สายันต์')) && (ex.id === 'yodprem' || ex.id === 'sayan')) return true;
                if (rawPos && rawPos.includes('คณบดี') && !rawPos.includes('รอง') && ex.id === 'boonlert') return true;
                if (rawPos && rawPos.includes('ฝ่ายบริหาร') && ex.id === 'weeratham') return true;
                if (rawPos && rawPos.includes('ฝ่ายวิชาการ') && ex.id === 'boonyiem') return true;
                if (rawPos && rawPos.includes('ฝ่ายวิจัย') && ex.id === 'weera') return true;
                if (rawPos && (rawPos.includes('พัฒนานักศึกษา') || rawPos.includes('แผน')) && (ex.id === 'yodprem' || ex.id === 'sayan')) return true;
                if (rawEmail && ex.email.toLowerCase() === rawEmail) {
                  if (rawEmail === 'boonlert@npu.ac.th') {
                    return !rawName.includes('วีรธรรม') && ex.id === 'boonlert';
                  }
                  return true;
                }
                return false;
              });

              if (!targetKey) {
                targetKey = String(rawId || rawEmail || `exec-${Object.keys(baseExecMap).length}`);
              }

              const prev = baseExecMap[targetKey] || ({} as ExecutiveDetail);
              let safeName = rawName || prev.name || '';
              let safePos = rawPos || prev.position || '';
              let safeEmail = rawEmail || prev.email || '';
              let safeImg = String(r.img || prev.img || '/img/avatar-placeholder.svg');

              // Guard Dean Boonlert
              if (targetKey === 'boonlert') {
                if (safeName.includes('วีรธรรม') || !safeName.includes('บุญเลิศ')) {
                  safeName = 'ดร.บุญเลิศ โพธิ์ขำ';
                }
                if (safePos.includes('รอง') || !safePos.includes('คณบดี')) {
                  safePos = 'คณบดีคณะเทคโนโลยีอุตสาหกรรม';
                }
                safeEmail = 'boonlert@npu.ac.th';
                safeImg = '/img/คณบดี.png';
              }

              // Guard Weeratham
              if (targetKey === 'weeratham' || safeName.includes('วีรธรรม')) {
                safeName = safeName.replace(/v+$/i, '').trim();
                if (!safeName) safeName = 'ผศ.วีรธรรม ไชยยงค์';
                if (!safePos || safePos.includes('คณะเทคโนโลยีอุตสาหกรรม')) safePos = 'รองคณบดีฝ่ายบริหาร';
                safeEmail = 'weeratham@npu.ac.th';
                safeImg = '/img/รอง1.png';
              }

              baseExecMap[targetKey] = {
                id: prev.id || targetKey,
                name: safeName,
                position: safePos,
                img: safeImg,
                email: safeEmail,
                phone: String(r.phone || prev.phone || ''),
                mapQuery: String(r.mapQuery || prev.mapQuery || ''),
                room: String(r.room || r.location || prev.room || ''),
                dutyStatus: String(r.dutyStatus || prev.dutyStatus || 'ปฏิบัติราชการตามปกติ'),
                workingHours: String(r.workingHours || prev.workingHours || 'จันทร์ - ศุกร์ (08:30 - 16:30 น.)'),
                education: r.education ? String(r.education).split('|').map((s: string) => s.trim()).filter(Boolean) : (prev.education || []),
                skills: r.skills ? String(r.skills).split('|').map((s: string) => s.trim()).filter(Boolean) : (prev.skills || []),
                works: r.works ? String(r.works).split('|').map((s: string) => s.trim()).filter(Boolean) : (prev.works || []),
              };
            }
            const ov = getLocalOverrides();
            if (Object.keys(baseExecMap).length > 0) {
              setExecutives(applyOverridesToExecs(baseExecMap, ov));
              setIsLiveSheet(true);
              setSource('google_sheets');
            }
          }

          // Parse Departments & Lecturers
          if (lecRows && lecRows.length > 0) {
            const resolveDeptSlug = (rawSlug?: string, rawLocation?: string): string => {
              const str = String(rawSlug || rawLocation || '').toLowerCase().trim();
              if (!str) return '';
              for (const dept of DEPARTMENTS_DATA) {
                if (dept.slug.toLowerCase() === str) return dept.slug;
                if (dept.title.toLowerCase().includes(str) || str.includes(dept.title.toLowerCase())) return dept.slug;
                if (dept.titleEn && (dept.titleEn.toLowerCase().includes(str) || str.includes(dept.titleEn.toLowerCase()))) return dept.slug;
              }
              return str;
            };

            const lecByDept: Record<string, Personnel[]> = {};
            for (const r of lecRows) {
              const dSlug = resolveDeptSlug(r.departmentSlug, r.location);
              if (!dSlug) continue;
              if (!lecByDept[dSlug]) lecByDept[dSlug] = [];
              const edu = r.education ? String(r.education).split('|').map((s: string) => s.trim()).filter(Boolean) : [];
              const sk = r.skills ? String(r.skills).split('|').map((s: string) => s.trim()).filter(Boolean) : [];
              const research = String(r.researchInterests || r.interest || '');
              const calUrl = String(r.calendarUrl || '');
              lecByDept[dSlug].push({
                name: String(r.name || r.nameTh || ''),
                nameEn: String(r.calendarName || r.nameEn || r.name || ''),
                position: String(r.position || 'อาจารย์ประจำสาขาวิชา'),
                img: String(r.img || '/img/avatar-placeholder.svg'),
                email: String(r.email || ''),
                phone: String(r.phone || ''),
                location: String(r.location || ''),
                calendarName: String(r.calendarName || r.name || ''),
                calendarUrl: calUrl,
                researchInterests: research,
                education: edu,
                skills: sk,
                isHead: String(r.isHead).toLowerCase() === 'true' || r.isHead === true,
                departmentSlug: dSlug,
              } as any);
            }

            const ov = getLocalOverrides();
            const baseDepts = DEPARTMENTS_DATA.map((baseD) => {
              const fromSheet = deptRows ? deptRows.find((sd: any) => String(sd.slug || '').trim().toLowerCase() === baseD.slug.toLowerCase()) : null;
              return fromSheet ? { ...baseD, ...fromSheet, slug: baseD.slug } : baseD;
            });

            const parsedDepts: Department[] = baseDepts.map((d: any) => {
              const slug = d.slug;
              const sheetCards = lecByDept[slug] || [];
              const baseCards: Personnel[] = d.allCards || [];
              // Merge base cards with sheet cards to preserve all 90 lecturers while syncing live updates
              const mergedCards = baseCards.map((bp) => {
                const matchedSheetCard = sheetCards.find((sc) => isSamePersonnel(sc, bp));
                return matchedSheetCard ? { ...bp, ...matchedSheetCard } : bp;
              });
              sheetCards.forEach((sc) => {
                if (!mergedCards.some((mc) => isSamePersonnel(mc, sc))) {
                  mergedCards.push(sc);
                }
              });
              const rawCards = mergedCards.length > 0 ? mergedCards : baseCards;
              const allCards = applyOverridesToPersonnel(rawCards, ov, slug);
              const { head, members } = splitHeadAndMembers(allCards);
              return {
                ...d,
                head: head || d.head,
                members: members.length > 0 ? members : d.members,
                allCards: allCards.length > 0 ? allCards : d.allCards,
              };
            });

            if (parsedDepts.length > 0) {
              setDepartments(parsedDepts);
              setIsLiveSheet(true);
              setSource('google_sheets');
            }
          }

          // Parse Staff Divisions & Staff (Live Sync with Google Sheets)
          if (staffRows && staffRows.length > 0) {
            const staffByDiv: Record<string, Personnel[]> = {};
            for (const r of staffRows) {
              const rawDiv = r.divisionSlug || r.departmentSlug || r.department || r.division || r.location || '';
              let divSlug = resolveStaffDivisionSlug(rawDiv);
              if (!divSlug) {
                // If division is not explicitly specified, check which division this person belongs to in base data
                for (const baseDiv of STAFF_DIVISIONS_DATA) {
                  if (baseDiv.allCards.some((c) => isSamePersonnel(c, r))) {
                    divSlug = baseDiv.slug;
                    break;
                  }
                }
              }
              if (!divSlug) divSlug = 'dept-admin';
              if (!staffByDiv[divSlug]) staffByDiv[divSlug] = [];
              const edu = r.education ? String(r.education).split('|').map((s: string) => s.trim()).filter(Boolean) : [];
              const sk = r.skills ? String(r.skills).split('|').map((s: string) => s.trim()).filter(Boolean) : [];
              staffByDiv[divSlug].push({
                name: String(r.name || r.nameTh || ''),
                nameEn: String(r.calendarName || r.nameEn || r.name || ''),
                position: String(r.position || ''),
                img: String(r.img || r.imageUrl || '/img/avatar-placeholder.svg'),
                email: String(r.email || ''),
                phone: String(r.phone || ''),
                location: String(r.location || r.room || ''),
                calendarName: String(r.calendarName || r.name || ''),
                calendarUrl: String(r.calendarUrl || ''),
                researchInterests: String(r.researchInterests || r.interest || ''),
                education: edu,
                skills: sk,
                isHead: String(r.isHead).toLowerCase() === 'true' || r.isHead === true,
                departmentSlug: divSlug,
              } as any);
            }

            const ov = getLocalOverrides();
            const parsedDivs: StaffDivision[] = STAFF_DIVISIONS_DATA.map((baseDiv) => {
              const slug = baseDiv.slug;
              const sheetDiv = divRows && divRows.length > 0 ? divRows.find((d: any) => String(d.slug || '').trim().toLowerCase() === slug.toLowerCase()) : null;
              const sheetCards = staffByDiv[slug] || [];
              const baseCards: Personnel[] = baseDiv.allCards || [];
              // Merge base cards with sheet cards to preserve all staff while syncing live updates
              const mergedCards = baseCards.map((bp) => {
                const matchedSheetCard = sheetCards.find((sc) => isSamePersonnel(sc, bp));
                return matchedSheetCard ? { ...bp, ...matchedSheetCard, departmentSlug: slug } : { ...bp, departmentSlug: slug };
              });
              sheetCards.forEach((sc) => {
                if (!mergedCards.some((mc) => isSamePersonnel(mc, sc))) {
                  mergedCards.push(sc);
                }
              });
              const rawCards = mergedCards.length > 0 ? mergedCards : baseCards;
              const allCards = applyOverridesToPersonnel(rawCards, ov, slug);
              const { head, members } = splitHeadAndMembers(allCards);
              return {
                ...baseDiv,
                ...(sheetDiv ? {
                  title: String(sheetDiv.title || baseDiv.title),
                  description: String(sheetDiv.description || baseDiv.description),
                  icon: String(sheetDiv.icon || baseDiv.icon),
                  badge: String(sheetDiv.badge || baseDiv.badge),
                } : {}),
                head: head || baseDiv.head,
                members: members.length > 0 ? members : baseDiv.members,
                allCards: allCards.length > 0 ? allCards : baseDiv.allCards,
              };
            });

            if (parsedDivs.length > 0) {
              setStaffDivisions(parsedDivs);
              setIsLiveSheet(true);
              setSource('google_sheets');
            }
          }
        })
        .catch((err) => {
          console.warn('Google Sheets client sync error, using fallback:', err);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }

    return () => {
      isMounted = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener('hr_personnel_updated', handleUpdate);
      }
    };
  }, []);

  return {
    executives,
    departments,
    staffDivisions,
    source,
    isLiveSheet,
    loading,
  };
}
