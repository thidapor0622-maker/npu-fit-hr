import { EXECUTIVES_DATA, ExecutiveDetail } from '@/data/executives';
import { DEPARTMENTS_DATA, Department, Personnel } from '@/data/departments';
import { STAFF_DIVISIONS_DATA, StaffDivision } from '@/data/staff-divisions';
import fs from 'fs';
import path from 'path';

// Load optional runtime sheet config from config.json or environment
const CONFIG_PATH = path.join(process.cwd(), 'sheet-config.json');

export interface SheetConfig {
  sheetId: string;
  appsScriptUrl?: string;
  enabled: boolean;
  lastSync?: string;
}

export function getSheetConfig(): SheetConfig {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const content = fs.readFileSync(CONFIG_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('Error reading sheet config:', e);
  }

  return {
    sheetId: process.env.GOOGLE_SHEET_ID || '',
    appsScriptUrl: process.env.GOOGLE_APPS_SCRIPT_URL || '',
    enabled: Boolean(process.env.GOOGLE_SHEET_ID),
  };
}

export function saveSheetConfig(config: SheetConfig): void {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving sheet config:', e);
  }
}

/**
 * Fetch rows from Google Sheets via GViz API without needing GCP API keys.
 * Sheet must be shared as "Anyone with link can view".
 */
export async function fetchGVizSheet(sheetId: string, sheetName: string): Promise<Record<string, any>[]> {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;

  const response = await fetch(url, {
    next: { revalidate: 30 }, // Cache for 30s
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sheet ${sheetName}: ${response.statusText}`);
  }

  const text = await response.text();

  // GViz returns /*O_o*/\ngoogle.visualization.Query.setResponse({...});
  const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\);/);
  if (!jsonMatch || !jsonMatch[1]) {
    throw new Error(`Invalid GViz response format from sheet ${sheetName}`);
  }

  const data = JSON.parse(jsonMatch[1]);
  if (data.status === 'error') {
    throw new Error(`Google Sheets Error: ${data.errors?.[0]?.message || 'Unknown error'}`);
  }

  const cols: string[] = data.table.cols.map((col: any) => col.label || col.id || '');
  const rows: any[] = data.table.rows || [];

  return rows.map((row: any) => {
    const item: Record<string, any> = {};
    row.c.forEach((cell: any, index: number) => {
      const colName = cols[index] || `col_${index}`;
      item[colName] = cell && cell.v !== null && cell.v !== undefined ? cell.v : '';
    });
    return item;
  });
}

/**
 * Fetch Executives from Google Sheet or fallback to local
 */
export async function getExecutives(): Promise<{ data: Record<string, ExecutiveDetail>; source: 'google_sheets' | 'local_fallback' }> {
  const config = getSheetConfig();

  if (!config.enabled || !config.sheetId) {
    return { data: EXECUTIVES_DATA, source: 'local_fallback' };
  }

  try {
    const rows = await fetchGVizSheet(config.sheetId, 'Executives');
    if (!rows || rows.length === 0) {
      return { data: EXECUTIVES_DATA, source: 'local_fallback' };
    }

    const executives: Record<string, ExecutiveDetail> = {};

    for (const r of rows) {
      const id = String(r.id || r.name || '').trim();
      if (!id) continue;

      executives[id] = {
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
        education: String(r.education || '')
          .split('|')
          .map((s) => s.trim())
          .filter(Boolean),
        skills: String(r.skills || '')
          .split('|')
          .map((s) => s.trim())
          .filter(Boolean),
        works: String(r.works || '')
          .split('|')
          .map((s) => s.trim())
          .filter(Boolean),
      };
    }

    return {
      data: Object.keys(executives).length > 0 ? executives : EXECUTIVES_DATA,
      source: 'google_sheets',
    };
  } catch (error) {
    console.warn('Failed to load executives from Google Sheets, using fallback:', error);
    return { data: EXECUTIVES_DATA, source: 'local_fallback' };
  }
}

/**
 * Fetch Departments and Lecturers from Google Sheets or fallback to local
 */
export async function getDepartments(): Promise<{ data: Department[]; source: 'google_sheets' | 'local_fallback' }> {
  const config = getSheetConfig();

  if (!config.enabled || !config.sheetId) {
    return { data: DEPARTMENTS_DATA, source: 'local_fallback' };
  }

  try {
    // 1. Fetch departments meta
    const deptRows = await fetchGVizSheet(config.sheetId, 'Departments');
    // 2. Fetch lecturers roster
    const lecRows = await fetchGVizSheet(config.sheetId, 'Lecturers');

    if (!deptRows || deptRows.length === 0) {
      return { data: DEPARTMENTS_DATA, source: 'local_fallback' };
    }

    // Group lecturers by departmentSlug
    const lecByDept: Record<string, Personnel[]> = {};
    for (const r of lecRows) {
      const deptSlug = String(r.departmentSlug || '').trim();
      if (!deptSlug) continue;

      if (!lecByDept[deptSlug]) {
        lecByDept[deptSlug] = [];
      }

      lecByDept[deptSlug].push({
        name: String(r.name || ''),
        position: String(r.position || ''),
        img: String(r.img || '/img/avatar-placeholder.svg'),
        email: String(r.email || ''),
        phone: String(r.phone || ''),
        location: String(r.location || ''),
        calendarName: String(r.calendarName || r.name || ''),
      });
    }

    const departments: Department[] = deptRows.map((d: any) => {
      const slug = String(d.slug || '').trim();
      const allCards = lecByDept[slug] || [];
      const head = allCards.length > 0 ? allCards[0] : null;
      const members = allCards.length > 1 ? allCards.slice(1) : [];

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

    return {
      data: departments.length > 0 ? departments : DEPARTMENTS_DATA,
      source: 'google_sheets',
    };
  } catch (error) {
    console.warn('Failed to load departments from Google Sheets, using fallback:', error);
    return { data: DEPARTMENTS_DATA, source: 'local_fallback' };
  }
}

/**
 * Fetch Staff Divisions and Staff from Google Sheets or fallback to local
 */
export async function getStaffDivisions(): Promise<{ data: StaffDivision[]; source: 'google_sheets' | 'local_fallback' }> {
  const config = getSheetConfig();

  if (!config.enabled || !config.sheetId) {
    return { data: STAFF_DIVISIONS_DATA, source: 'local_fallback' };
  }

  try {
    const divRows = await fetchGVizSheet(config.sheetId, 'Divisions');
    const staffRows = await fetchGVizSheet(config.sheetId, 'Staff');

    if (!divRows || divRows.length === 0) {
      return { data: STAFF_DIVISIONS_DATA, source: 'local_fallback' };
    }

    const staffByDiv: Record<string, Personnel[]> = {};
    for (const r of staffRows) {
      const divSlug = String(r.divisionSlug || '').trim();
      if (!divSlug) continue;

      if (!staffByDiv[divSlug]) {
        staffByDiv[divSlug] = [];
      }

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

    const divisions: StaffDivision[] = divRows.map((d: any) => {
      const slug = String(d.slug || '').trim();
      const allCards = staffByDiv[slug] || [];
      const head = allCards.length > 0 ? allCards[0] : null;
      const members = allCards.length > 1 ? allCards.slice(1) : [];

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

    return {
      data: divisions.length > 0 ? divisions : STAFF_DIVISIONS_DATA,
      source: 'google_sheets',
    };
  } catch (error) {
    console.warn('Failed to load staff divisions from Google Sheets, using fallback:', error);
    return { data: STAFF_DIVISIONS_DATA, source: 'local_fallback' };
  }
}
