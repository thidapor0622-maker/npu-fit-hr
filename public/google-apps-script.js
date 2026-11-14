/**
 * Google Apps Script for HR Site Database
 * คณะเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยนครพนม
 *
 * ชุดสคริปต์เวอร์ชันล่าสุด (รองรับ 14 ฟิลด์ข้อมูลมาตรฐานตรงกัน 100%):
 * 1. departmentSlug  2. name (ชื่อไทย)  3. position  4. isHead  5. img  6. email
 * 7. passwd (รหัสผ่าน)  8. phone  9. location  10. calendarName (ชื่ออังกฤษ)
 * 11. calendarUrl  12. researchInterests  13. education  14. skills
 *
 * วิธีตั้งค่าใน Google Sheets:
 * 1. เปิด Google Sheets ฐานข้อมูล
 * 2. ไปที่เมนู ส่วนขยาย (Extensions) > Apps Script
 * 3. ลบโค้ดเดิมออกทั้งหมด แล้ววางโค้ดชุดนี้ลงไป
 * 4. กด บันทึก (Ctrl + S)
 * 5. กดปุ่มสีน้ำเงินมุมขวาบน "ทำให้ใช้งานได้" (Deploy) > "การทำให้ใช้งานได้ใหม่" (New deployment)
 * 6. เลือกประเภท: เว็บแอป (Web app)
 *    - ดำเนินการในฐานะ (Execute as): "ฉัน" (Me)
 *    - ผู้มีสิทธิ์เข้าถึง (Who has access): "ทุกคน" (Anyone)
 * 7. กด "ทำให้ใช้งานได้" (Deploy) แล้วคัดลอก URL นำไปวางในระบบ
 */

const STANDARD_LECTURER_COLS = [
  "departmentSlug", "name", "position", "isHead", "img", "email",
  "passwd", "phone", "location", "calendarName", "calendarUrl",
  "researchInterests", "education", "skills"
];

function ensureSheetHeaders(sheet, standardCols) {
  if (!sheet) return;
  const lastCol = Math.max(sheet.getLastColumn(), 1);
  const existingHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(h => String(h).trim());
  const existingLower = existingHeaders.map(h => h.toLowerCase());

  const missing = [];
  standardCols.forEach(col => {
    const isFound = existingLower.some(h => h === col.toLowerCase() || h.includes(col.toLowerCase()));
    if (!isFound) {
      missing.push(col);
    }
  });

  if (missing.length > 0) {
    sheet.getRange(1, lastCol + 1, 1, missing.length).setValues([missing]);
  }
}

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Auto ensure headers
    ensureSheetHeaders(ss.getSheetByName("Lecturers"), STANDARD_LECTURER_COLS);
    ensureSheetHeaders(ss.getSheetByName("Staff"), STANDARD_LECTURER_COLS);
    ensureSheetHeaders(ss.getSheetByName("Executives"), STANDARD_LECTURER_COLS);

    const sheetName = e && e.parameter ? e.parameter.sheet : null;
    if (sheetName) {
      const sheet = ss.getSheetByName(sheetName);
      if (!sheet) return createResponse({ error: "Sheet not found: " + sheetName }, 404);
      return createResponse(readSheetData(sheet));
    }

    const result = {
      Executives: readSheetData(ss.getSheetByName("Executives")),
      Departments: readSheetData(ss.getSheetByName("Departments")),
      Lecturers: readSheetData(ss.getSheetByName("Lecturers")),
      Divisions: readSheetData(ss.getSheetByName("Divisions")),
      Staff: readSheetData(ss.getSheetByName("Staff")),
      timestamp: new Date().toISOString()
    };

    return createResponse(result);
  } catch (err) {
    return createResponse({ error: err.toString() }, 500);
  }
}

function doPost(e) {
  try {
    let postData = {};
    if (e && e.postData && e.postData.contents) {
      postData = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      postData = e.parameter;
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Ensure all 14 headers exist in relevant sheets
    const lecturersSheet = ss.getSheetByName("Lecturers");
    const staffSheet = ss.getSheetByName("Staff");
    const execSheet = ss.getSheetByName("Executives");

    ensureSheetHeaders(lecturersSheet, STANDARD_LECTURER_COLS);
    ensureSheetHeaders(staffSheet, STANDARD_LECTURER_COLS);
    ensureSheetHeaders(execSheet, STANDARD_LECTURER_COLS);

    const data = postData.data || postData;

    // Search keys for targeting existing row
    const targetEmail = String(postData.originalEmail || postData.email || data.email || "").toLowerCase().trim();
    const targetName = String(postData.originalName || postData.name || data.nameTh || data.name || "").trim();
    const targetId = String(postData.id || data.id || "").toLowerCase().trim();

    const sheetsToCheck = ["Lecturers", "Executives", "Staff"];
    let found = false;
    let updatedSheetName = "";

    // 1. UPDATE EXISTING ROW
    for (let s = 0; s < sheetsToCheck.length; s++) {
      const sheet = ss.getSheetByName(sheetsToCheck[s]);
      if (!sheet) continue;

      const values = sheet.getDataRange().getValues();
      if (values.length <= 1) continue;

      const headers = values[0].map(h => String(h).trim().toLowerCase());
      const emailCol = headers.findIndex(h => h.includes("email") || h.includes("อีเมล"));
      const idCol = headers.findIndex(h => h === "id" || h.includes("รหัส"));
      const nameCol = headers.findIndex(h => h === "name" || h.includes("ชื่อ"));

      for (let rowIdx = 1; rowIdx < values.length; rowIdx++) {
        const rowEmail = emailCol >= 0 ? String(values[rowIdx][emailCol]).toLowerCase().trim() : "";
        const rowId = idCol >= 0 ? String(values[rowIdx][idCol]).toLowerCase().trim() : "";
        const rowName = nameCol >= 0 ? String(values[rowIdx][nameCol]).trim() : "";

        const isMatch = (targetEmail && rowEmail && rowEmail === targetEmail) ||
                        (targetName && rowName && (rowName === targetName || rowName.includes(targetName) || targetName.includes(rowName))) ||
                        (targetId && rowId && rowId === targetId);

        if (isMatch) {
          headers.forEach((h, colIdx) => {
            const cell = sheet.getRange(rowIdx + 1, colIdx + 1);

            if ((h.includes("nameen") || h.includes("calendarname") || h.includes("ภาษาอังกฤษ")) && (data.nameEn !== undefined || postData.nameEn !== undefined)) {
              cell.setValue(data.nameEn || postData.nameEn);
            } else if ((h === "name" || h.includes("nameth") || h.includes("ชื่อ")) && (data.nameTh !== undefined || data.name !== undefined || postData.nameTh !== undefined)) {
              cell.setValue(data.nameTh || data.name || postData.nameTh);
            } else if ((h.includes("position") || h.includes("ตำแหน่ง")) && data.position !== undefined) {
              cell.setValue(data.position);
            } else if ((h.includes("departmentslug") || h.includes("divisionslug") || h.includes("สาขา")) && (data.departmentSlug !== undefined || postData.departmentSlug !== undefined || data.department !== undefined)) {
              cell.setValue(data.departmentSlug || postData.departmentSlug || data.department);
            } else if (h.includes("ishead") && (data.isHead !== undefined || postData.isHead !== undefined)) {
              cell.setValue(Boolean(data.isHead !== undefined ? data.isHead : postData.isHead));
            } else if ((h.includes("phone") || h.includes("โทร")) && data.phone !== undefined) {
              cell.setValue(data.phone);
            } else if ((h.includes("room") || h.includes("location") || h.includes("ห้อง")) && (data.location !== undefined || data.room !== undefined)) {
              cell.setValue(data.location || data.room);
            } else if ((h.includes("img") || h.includes("image") || h.includes("รูป")) && (data.imageUrl !== undefined || data.img !== undefined)) {
              cell.setValue(data.imageUrl || data.img);
            } else if ((h.includes("pass") || h.includes("รหัสผ่าน")) && (data.password !== undefined || data.passwd !== undefined)) {
              cell.setValue(data.password || data.passwd);
            } else if (h.includes("email") && (data.email !== undefined || postData.email !== undefined)) {
              cell.setValue(data.email || postData.email);
            } else if (h.includes("calendarurl") && data.calendarUrl !== undefined) {
              cell.setValue(data.calendarUrl);
            } else if (h.includes("education") || h.includes("การศึกษา")) {
              const edu = Array.isArray(data.education) ? data.education.join(" | ") : data.education;
              if (edu !== undefined) cell.setValue(edu);
            } else if (h.includes("skill") || h.includes("ความเชี่ยวชาญ")) {
              const sk = Array.isArray(data.skills) ? data.skills.join(" | ") : data.skills;
              if (sk !== undefined) cell.setValue(sk);
            } else if (h.includes("interest") || h.includes("งานวิจัย") || h.includes("research")) {
              if (data.researchInterests !== undefined) cell.setValue(data.researchInterests);
            }
          });
          found = true;
          updatedSheetName = sheetsToCheck[s];
          break;
        }
      }
      if (found) break;
    }

    if (found) {
      return createResponse({
        success: true,
        message: "อัปเดตข้อมูลบุคลากรสำเร็จในชีต " + updatedSheetName,
        sheet: updatedSheetName
      });
    }

    // 2. APPEND NEW ROW
    let targetSheetName = "Lecturers";
    const dept = String(data.department || data.departmentSlug || postData.departmentSlug || "").toLowerCase();
    if (dept.includes("ผู้บริหาร") || dept.includes("exec")) {
      targetSheetName = "Executives";
    } else if (dept.includes("สนับสนุน") || dept.includes("staff")) {
      targetSheetName = "Staff";
    }

    const targetSheet = ss.getSheetByName(targetSheetName);
    if (!targetSheet) {
      return createResponse({ error: "ไม่พบชีตเป้าหมาย: " + targetSheetName }, 404);
    }

    const headers = targetSheet.getRange(1, 1, 1, targetSheet.getLastColumn()).getValues()[0];
    const newRow = headers.map(h => {
      const col = String(h).trim().toLowerCase();
      if (col.includes("departmentslug") || col.includes("divisionslug") || col.includes("สาขา")) return data.departmentSlug || postData.departmentSlug || data.department || "";
      if (col === "name" || col.includes("ชื่อ") || col.includes("nameth")) return data.nameTh || data.name || postData.nameTh || "";
      if (col.includes("calendarname") || col.includes("nameen") || col.includes("ภาษาอังกฤษ")) return data.nameEn || postData.nameEn || data.nameTh || "";
      if (col.includes("position") || col.includes("ตำแหน่ง")) return data.position || "อาจารย์ประจำสาขาวิชา";
      if (col.includes("ishead")) return Boolean(data.isHead !== undefined ? data.isHead : postData.isHead);
      if (col.includes("img") || col.includes("image") || col.includes("รูป")) return data.imageUrl || data.img || "/img/avatar-placeholder.svg";
      if (col.includes("email") || col.includes("อีเมล")) return data.email || postData.email || "";
      if (col.includes("pass") || col.includes("รหัสผ่าน")) return data.password || data.passwd || "npu1234";
      if (col.includes("phone") || col.includes("โทร")) return data.phone || "";
      if (col.includes("location") || col.includes("room") || col.includes("ห้อง")) return data.location || "";
      if (col.includes("calendarurl")) return data.calendarUrl || "";
      if (col.includes("education") || col.includes("การศึกษา")) return Array.isArray(data.education) ? data.education.join(" | ") : (data.education || "");
      if (col.includes("skill") || col.includes("ความเชี่ยวชาญ")) return Array.isArray(data.skills) ? data.skills.join(" | ") : (data.skills || "");
      if (col.includes("interest") || col.includes("งานวิจัย") || col.includes("research")) return data.researchInterests || "";
      return "";
    });

    targetSheet.appendRow(newRow);
    return createResponse({
      success: true,
      message: "เพิ่มข้อมูลอาจารย์ใหม่ลงในชีต " + targetSheetName + " สำเร็จแล้ว",
      sheet: targetSheetName
    });
  } catch (err) {
    return createResponse({ error: err.toString() }, 500);
  }
}

function readSheetData(sheet) {
  if (!sheet) return [];
  const range = sheet.getDataRange();
  const values = range.getValues();
  if (values.length <= 1) return [];
  const headers = values[0];
  const rows = [];
  for (let i = 1; i < values.length; i++) {
    const row = {};
    headers.forEach((header, index) => { row[header] = values[i][index]; });
    rows.push(row);
  }
  return rows;
}

function createResponse(data, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
