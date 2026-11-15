'use client';

import { useState, useEffect } from 'react';
import { EXECUTIVES_DATA, ExecutiveDetail } from '@/data/executives';
import { DEPARTMENTS_DATA, Department, Personnel } from '@/data/departments';
import { STAFF_DIVISIONS_DATA, StaffDivision } from '@/data/staff-divisions';
import { isSamePersonnel, normalizeThaiNameForMatch } from '@/lib/personnelHelper';

// Parse GViz response from Google Sheets directly in browser (CORS-friendly)
export async function fetchClientGViz(sheetId: string, sheetName: string): Promise<Record<string, any>[]> {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
  const res = await fetch(url);
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

      // Automatically purge any temporary test records
      const nameEn = String(val.nameEn || val.calendarName || '');
      const nameTh = String(val.nameTh || val.name || '');
      const keyStr = String(k || '');
      if (nameEn.toLowerCase().includes('test') || nameTh.toLowerCase().includes('test') || keyStr.toLowerCase().includes('test')) {
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
    const ov = overrides[ex.id] || (ex.email ? overrides[ex.email.toLowerCase()] : null) || (ex.name ? overrides[ex.name.trim()] : null);
    if (ov && ov.deleted) continue;
    if (ov) {
      result[key] = {
        ...ex,
        name: ov.nameTh || ex.name,
        position: ov.position || ex.position,
        phone: ov.phone || ex.phone,
        email: ov.email || ex.email,
        room: ov.location || ex.room,
        img: ov.imageUrl || ex.img,
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
      result.push({
        ...p,
        name: ov.nameTh || ov.name || p.name,
        nameEn: ov.nameEn || p.nameEn,
        position: ov.position || p.position,
        phone: ov.phone || p.phone,
        email: ov.email || p.email,
        location: ov.location || p.location,
        img: ov.imageUrl || ov.img || p.img,
        calendarName: ov.nameEn || p.calendarName || ov.nameTh || p.name,
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

      const targetSlug = String(ov.departmentSlug || ov.department || ov.divisionSlug || '').toLowerCase().trim();
      const isDeptMatch = targetSlug && (targetSlug === currentSlug || targetSlug.includes(currentSlug) || currentSlug.includes(targetSlug));
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

          // Parse Executives
          if (execRows && execRows.length > 0) {
            const execMap: Record<string, ExecutiveDetail> = {};
            for (const r of execRows) {
              const id = String(r.id || r.name || '').trim();
              if (!id) continue;
              execMap[id] = {
                id,
                name: String(r.name || ''),
                position: String(r.position || ''),
                img: String(r.img || '/img/avatar-placeholder.svg'),
                email: String(r.email || ''),
                phone: String(r.phone || ''),
                mapQuery: String(r.mapQuery || ''),
                room: String(r.room || ''),
                dutyStatus: String(r.dutyStatus || 'ปฏิบัติราชการตามปกติ'),
                workingHours: String(r.workingHours || 'จันทร์ - ศุกร์ (08:30 - 16:30 น.)'),
                education: String(r.education || '').split('|').map((s) => s.trim()).filter(Boolean),
                skills: String(r.skills || '').split('|').map((s) => s.trim()).filter(Boolean),
                works: String(r.works || '').split('|').map((s) => s.trim()).filter(Boolean),
              };
            }
            const ov = getLocalOverrides();
            if (Object.keys(execMap).length > 0) {
              setExecutives(applyOverridesToExecs(execMap, ov));
              setIsLiveSheet(true);
              setSource('google_sheets');
            }
          }

          // Parse Departments & Lecturers
          if (deptRows && deptRows.length > 0 && lecRows) {
            const lecByDept: Record<string, Personnel[]> = {};
            for (const r of lecRows) {
              const dSlug = String(r.departmentSlug || '').trim();
              if (!dSlug) continue;
              if (!lecByDept[dSlug]) lecByDept[dSlug] = [];
              const edu = r.education ? String(r.education).split('|').map((s: string) => s.trim()).filter(Boolean) : [];
              const sk = r.skills ? String(r.skills).split('|').map((s: string) => s.trim()).filter(Boolean) : [];
              const research = String(r.researchInterests || r.interest || '');
              const calUrl = String(r.calendarUrl || '');
              lecByDept[dSlug].push({
                name: String(r.name || ''),
                nameEn: String(r.calendarName || r.nameEn || ''),
                position: String(r.position || ''),
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
            const parsedDepts: Department[] = deptRows.map((d: any) => {
              const slug = String(d.slug || '').trim();
              const rawCards = lecByDept[slug] || [];
              const allCards = applyOverridesToPersonnel(rawCards, ov, slug);
              const { head, members } = splitHeadAndMembers(allCards);
              return {
                slug,
                title: String(d.title || slug),
                titleEn: String(d.titleEn || ''),
                icon: String(d.icon || 'fa-solid fa-graduation-cap'),
                searchKeywords: String(d.searchKeywords || d.title || ''),
                badge: String(d.badge || d.title || ''),
                head,
                members,
                allCards,
              };
            });

            if (parsedDepts.length > 0) {
              setDepartments(parsedDepts);
              setIsLiveSheet(true);
              setSource('google_sheets');
            }
          }

          // Parse Staff Divisions & Staff
          if (divRows && divRows.length > 0 && staffRows) {
            const staffByDiv: Record<string, Personnel[]> = {};
            for (const r of staffRows) {
              const divSlug = String(r.divisionSlug || '').trim();
              if (!divSlug) continue;
              if (!staffByDiv[divSlug]) staffByDiv[divSlug] = [];
              const edu = r.education ? String(r.education).split('|').map((s: string) => s.trim()).filter(Boolean) : [];
              const sk = r.skills ? String(r.skills).split('|').map((s: string) => s.trim()).filter(Boolean) : [];
              staffByDiv[divSlug].push({
                name: String(r.name || ''),
                nameEn: String(r.calendarName || r.nameEn || ''),
                position: String(r.position || ''),
                img: String(r.img || '/img/avatar-placeholder.svg'),
                email: String(r.email || ''),
                phone: String(r.phone || ''),
                location: String(r.location || ''),
                calendarName: String(r.calendarName || r.name || ''),
                calendarUrl: String(r.calendarUrl || ''),
                researchInterests: String(r.researchInterests || ''),
                education: edu,
                skills: sk,
                isHead: String(r.isHead).toLowerCase() === 'true' || r.isHead === true,
              });
            }

            const ov = getLocalOverrides();
            const parsedDivs: StaffDivision[] = divRows.map((d: any) => {
              const slug = String(d.slug || '').trim();
              const rawCards = staffByDiv[slug] || [];
              const allCards = applyOverridesToPersonnel(rawCards, ov, slug);
              const { head, members } = splitHeadAndMembers(allCards);
              return {
                slug,
                title: String(d.title || slug),
                description: String(d.description || ''),
                icon: String(d.icon || 'fa-solid fa-briefcase'),
                badge: String(d.badge || d.title || ''),
                head,
                members,
                allCards,
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
