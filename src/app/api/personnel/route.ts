import { NextResponse } from 'next/server';
import { getExecutives, getDepartments, getStaffDivisions, getSheetConfig } from '@/lib/googleSheets';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const OVERRIDES_FILE = path.join(process.cwd(), 'personnel-overrides.json');

function getOverrides(): Record<string, any> {
  try {
    if (fs.existsSync(OVERRIDES_FILE)) {
      return JSON.parse(fs.readFileSync(OVERRIDES_FILE, 'utf-8'));
    }
  } catch {}
  return {};
}

function applyOverridesToPerson(person: any, overrides: Record<string, any>) {
  // Find matching override by email, id, or thai name
  const matchKey = Object.keys(overrides).find(
    (k) =>
      (person.email && k.toLowerCase() === person.email.toLowerCase()) ||
      (overrides[k].email && person.email && overrides[k].email.toLowerCase() === person.email.toLowerCase()) ||
      (overrides[k].nameTh && person.name && overrides[k].nameTh === person.name) ||
      k === person.id
  );

  if (matchKey && overrides[matchKey]) {
    const o = overrides[matchKey];
    return {
      ...person,
      name: o.nameTh || person.name,
      nameEn: o.nameEn || person.nameEn,
      position: o.position || person.position,
      img: o.imageUrl || person.img,
      phone: o.phone || person.phone,
      location: o.location || person.location,
      researchInterests: o.researchInterests || person.researchInterests,
      education: o.education || person.education,
      skills: o.skills || person.skills,
      calendarName: o.calendarUrl || person.calendarName,
    };
  }
  return person;
}

export async function GET() {
  try {
    const config = getSheetConfig();
    const overrides = getOverrides();

    const [execResult, deptResult, staffResult] = await Promise.all([
      getExecutives(),
      getDepartments(),
      getStaffDivisions(),
    ]);

    // Apply overrides to departments
    const patchedDepartments = deptResult.data.map((dept) => {
      const applyList = (list: any[]) => list.map((p) => applyOverridesToPerson(p, overrides));
      return {
        ...dept,
        head: dept.head ? applyOverridesToPerson(dept.head, overrides) : null,
        members: applyList(dept.members || []),
        allCards: applyList(dept.allCards || []),
      };
    });

    // Apply overrides to staff divisions
    const patchedStaffDivisions = staffResult.data.map((div) => {
      const applyList = (list: any[]) => list.map((p) => applyOverridesToPerson(p, overrides));
      return {
        ...div,
        head: div.head ? applyOverridesToPerson(div.head, overrides) : null,
        members: applyList(div.members || []),
        allCards: applyList(div.allCards || []),
      };
    });

    return NextResponse.json({
      success: true,
      config: {
        enabled: config.enabled,
        sheetId: config.sheetId ? `${config.sheetId.slice(0, 8)}...` : null,
      },
      source: execResult.source,
      data: {
        executives: execResult.data,
        departments: patchedDepartments,
        staffDivisions: patchedStaffDivisions,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
