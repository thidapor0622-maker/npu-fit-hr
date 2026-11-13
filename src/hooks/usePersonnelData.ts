'use client';

import { useState, useEffect } from 'react';
import { EXECUTIVES_DATA, ExecutiveDetail } from '@/data/executives';
import { DEPARTMENTS_DATA, Department, Personnel } from '@/data/departments';
import { STAFF_DIVISIONS_DATA, StaffDivision } from '@/data/staff-divisions';

// Parse GViz response from Google Sheets directly in browser (CORS-friendly)
async function fetchClientGViz(sheetId: string, sheetName: string): Promise<Record<string, any>[]> {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Fetch failed');
  const text = await res.text();
  const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\);/);
  if (!jsonMatch || !jsonMatch[1]) throw new Error('Invalid GViz response');
  const data = JSON.parse(jsonMatch[1]);
  if (data.status === 'error') throw new Error('GViz Error');

  const cols: string[] = data.table.cols.map((col: any) => col.label || col.id || '');
  const rows: any[] = data.table.rows || [];

  return rows.map((row: any) => {
    const item: Record<string, any> = {};
    row.c?.forEach((cell: any, index: number) => {
      const colName = cols[index] || `col_${index}`;
      item[colName] = cell && cell.v !== null && cell.v !== undefined ? cell.v : '';
    });
    return item;
  });
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
    const sheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID;

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
            if (Object.keys(execMap).length > 0) {
              setExecutives(execMap);
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
              lecByDept[dSlug].push({
                name: String(r.name || ''),
                position: String(r.position || ''),
                img: String(r.img || '/img/avatar-placeholder.svg'),
                email: String(r.email || ''),
                phone: String(r.phone || ''),
                location: String(r.location || ''),
                calendarName: String(r.calendarName || r.name || ''),
              });
            }

            const parsedDepts: Department[] = deptRows.map((d: any) => {
              const slug = String(d.slug || '').trim();
              const allCards = lecByDept[slug] || [];
              return {
                slug,
                title: String(d.title || slug),
                titleEn: String(d.titleEn || ''),
                icon: String(d.icon || 'fa-solid fa-graduation-cap'),
                searchKeywords: String(d.searchKeywords || d.title || ''),
                badge: String(d.badge || d.title || ''),
                head: allCards.length > 0 ? allCards[0] : null,
                members: allCards.length > 1 ? allCards.slice(1) : [],
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
              staffByDiv[divSlug].push({
                name: String(r.name || ''),
                position: String(r.position || ''),
                img: String(r.img || '/img/avatar-placeholder.svg'),
                email: String(r.email || ''),
                phone: String(r.phone || ''),
                location: String(r.location || ''),
                calendarName: String(r.calendarName || r.name || ''),
              });
            }

            const parsedDivs: StaffDivision[] = divRows.map((d: any) => {
              const slug = String(d.slug || '').trim();
              const allCards = staffByDiv[slug] || [];
              return {
                slug,
                title: String(d.title || slug),
                description: String(d.description || ''),
                icon: String(d.icon || 'fa-solid fa-briefcase'),
                badge: String(d.badge || d.title || ''),
                head: allCards.length > 0 ? allCards[0] : null,
                members: allCards.length > 1 ? allCards.slice(1) : [],
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
