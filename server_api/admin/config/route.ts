import { NextResponse } from 'next/server';
import { getSheetConfig, saveSheetConfig, fetchGVizSheet } from '@/lib/googleSheets';

export const dynamic = 'force-dynamic';

export async function GET() {
  const config = getSheetConfig();
  return NextResponse.json({
    success: true,
    config,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sheetId, action, enabled, appsScriptUrl } = body;

    // Clean sheetId if user pasted full URL
    let cleanSheetId = sheetId ? sheetId.trim() : '';
    const match = cleanSheetId.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match) {
      cleanSheetId = match[1];
    }

    if (action === 'test') {
      if (!cleanSheetId) {
        return NextResponse.json(
          { success: false, message: 'กรุณากรอก Google Sheet ID หรือ URL ของแผ่นงาน' },
          { status: 400 }
        );
      }

      // Try fetching tab rows
      try {
        const [execRows, deptRows, lecRows, divRows, staffRows] = await Promise.all([
          fetchGVizSheet(cleanSheetId, 'Executives').catch(() => []),
          fetchGVizSheet(cleanSheetId, 'Departments').catch(() => []),
          fetchGVizSheet(cleanSheetId, 'Lecturers').catch(() => []),
          fetchGVizSheet(cleanSheetId, 'Divisions').catch(() => []),
          fetchGVizSheet(cleanSheetId, 'Staff').catch(() => []),
        ]);

        const totalRows =
          execRows.length + deptRows.length + lecRows.length + divRows.length + staffRows.length;

        if (totalRows === 0) {
          return NextResponse.json({
            success: false,
            message:
              'เชื่อมต่อได้แต่ไม่พบข้อมูล หรือชื่อแผ่นงาน (Tabs) ไม่ตรงกับแบบฟอร์ม (ต้องมี Executives, Departments, Lecturers, Divisions, Staff) และต้องตั้งสิทธิ์แชร์เป็น "ทุกคนที่มีลิงก์มีสิทธิ์ดู"',
            details: {
              Executives: execRows.length,
              Departments: deptRows.length,
              Lecturers: lecRows.length,
              Divisions: divRows.length,
              Staff: staffRows.length,
            },
          });
        }

        return NextResponse.json({
          success: true,
          message: `เชื่อมต่อ Google Sheet สำเร็จ! ตรวจพบข้อมูลรวม ${totalRows} แถว`,
          cleanSheetId,
          details: {
            Executives: execRows.length,
            Departments: deptRows.length,
            Lecturers: lecRows.length,
            Divisions: divRows.length,
            Staff: staffRows.length,
          },
        });
      } catch (err: any) {
        return NextResponse.json(
          {
            success: false,
            message: `ไม่สามารถเข้าถึง Google Sheet ได้: ${err.message || 'โปรดตรวจสอบสิทธิ์การแชร์ (ต้องเปิดเป็น Everyone with link can view)'}`,
          },
          { status: 400 }
        );
      }
    }

    if (action === 'save') {
      const newConfig = {
        sheetId: cleanSheetId,
        appsScriptUrl: appsScriptUrl ? appsScriptUrl.trim() : '',
        enabled: enabled !== undefined ? enabled : true,
        lastSync: new Date().toISOString(),
      };

      saveSheetConfig(newConfig);

      return NextResponse.json({
        success: true,
        message: 'บันทึกการตั้งค่า Google Sheet เรียบร้อยแล้ว!',
        config: newConfig,
      });
    }

    return NextResponse.json({ success: false, message: 'Action ไม่ถูกต้อง' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'เกิดข้อผิดพลาดในการประมวลผล' },
      { status: 500 }
    );
  }
}
