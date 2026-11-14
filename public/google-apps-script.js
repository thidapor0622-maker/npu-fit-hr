/**
 * Google Apps Script for HR Site Database
 * คณะเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยนครพนม
 *
 * วิธีตั้งค่าเพื่อให้หน้าเว็บส่งข้อมูลบันทึกลง Google Sheets ได้อัตโนมัติ:
 * 1. เปิด Google Sheets
 * 2. ไปที่เมนู ส่วนขยาย (Extensions) > Apps Script
 * 3. ลบโค้ดเดิมทั้งหมดออก แล้ววางโค้ดชุดนี้ลงไปทั้งหมด
 * 4. กด บันทึก (Ctrl + S)
 * 5. กดปุ่มสีน้ำเงินมุมขวาบน "ทำให้ใช้งานได้" (Deploy) > "การทำให้ใช้งานได้ใหม่" (New deployment)
 *    (หรือ "จัดการการทำให้ใช้งานได้" > แก้ไข > เลือกเวอร์ชันใหม่)
 * 6. เลือกประเภท: เว็บแอป (Web app)
 * 7. สำคัญมาก!! 
 *    - ดำเนินการในฐานะ (Execute as): "ฉัน" (Me / อีเมลของคุณ)
 *    - ผู้มีสิทธิ์เข้าถึง (Who has access): "ทุกคน" (Anyone)
 * 8. กด "ทำให้ใช้งานได้" (Deploy)
 */

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
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
    const targetEmail = String(postData.email || "").toLowerCase().trim();
    const targetId = String(postData.id || "").toLowerCase().trim();
    const targetName = String(postData.name || postData.nameTh || "").trim();
    const data = postData.data || postData;

    const sheetsToCheck = ["Executives", "Lecturers", "Staff"];
    let found = false;
    let updatedSheetName = "";

    // 1. ค้นหาแถวที่มีอยู่แล้วเพื่อแก้ไข (Update)
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
                        (targetId && rowId && rowId === targetId) ||
                        (targetName && rowName && (rowName === targetName || rowName.includes(targetName)));

        if (isMatch) {
          headers.forEach((h, colIdx) => {
            const cell = sheet.getRange(rowIdx + 1, colIdx + 1);
            if ((h.includes("nameen") || h.includes("calendarname") || h.includes("ภาษาอังกฤษ")) && data.nameEn !== undefined) {
              cell.setValue(data.nameEn);
            } else if ((h.includes("nameth") || h === "name" || h.includes("ชื่อ")) && (data.nameTh !== undefined || data.name !== undefined)) {
              cell.setValue(data.nameTh || data.name);
            } else if ((h.includes("position") || h.includes("ตำแหน่ง")) && data.position !== undefined) {
              cell.setValue(data.position);
            } else if ((h.includes("departmentslug") || h.includes("สาขา")) && (data.departmentSlug !== undefined || data.department !== undefined)) {
              cell.setValue(data.departmentSlug || data.department);
            } else if (h.includes("ishead") && data.isHead !== undefined) {
              cell.setValue(Boolean(data.isHead));
            } else if ((h.includes("phone") || h.includes("โทร")) && data.phone !== undefined) {
              cell.setValue(data.phone);
            } else if ((h.includes("room") || h.includes("location") || h.includes("ห้อง")) && (data.location !== undefined || data.room !== undefined)) {
              cell.setValue(data.location || data.room);
            } else if ((h.includes("img") || h.includes("image") || h.includes("รูป")) && (data.imageUrl !== undefined || data.img !== undefined)) {
              cell.setValue(data.imageUrl || data.img);
            } else if ((h.includes("pass") || h.includes("รหัสผ่าน")) && data.password !== undefined) {
              cell.setValue(data.password);
            } else if (h.includes("email") && data.email !== undefined && data.email !== "") {
              cell.setValue(data.email);
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
      return createResponse({ success: true, message: "อัปเดตข้อมูลสำเร็จในชีต " + updatedSheetName, sheet: updatedSheetName });
    }

    // 2. ถ้าไม่พบข้อมูลเดิม ให้เพิ่มแถวใหม่ (Append New Row) ลงในชีตอาจารย์หรือชีตที่เลือก
    let targetSheetName = "Lecturers";
    const dept = String(data.department || data.departmentSlug || "").toLowerCase();
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
      if (col.includes("departmentslug") || col.includes("สาขา")) return data.departmentSlug || data.department || "";
      if (col === "name" || col.includes("ชื่อ") || col.includes("nameth")) return data.nameTh || data.name || "";
      if (col.includes("calendarname") || col.includes("nameen") || col.includes("ภาษาอังกฤษ")) return data.nameEn || data.nameTh || data.name || "";
      if (col.includes("position") || col.includes("ตำแหน่ง")) return data.position || "อาจารย์ประจำสาขาวิชา";
      if (col.includes("ishead")) return Boolean(data.isHead);
      if (col.includes("img") || col.includes("image") || col.includes("รูป")) return data.imageUrl || data.img || "/img/avatar-placeholder.svg";
      if (col.includes("email") || col.includes("อีเมล")) return data.email || "";
      if (col.includes("pass") || col.includes("รหัสผ่าน")) return data.password || "npu1234";
      if (col.includes("phone") || col.includes("โทร")) return data.phone || "";
      if (col.includes("location") || col.includes("room") || col.includes("ห้อง")) return data.location || "";
      return "";
    });

    targetSheet.appendRow(newRow);
    return createResponse({ success: true, message: "เพิ่มข้อมูลอาจารย์ใหม่ลงในชีต " + targetSheetName + " สำเร็จแล้ว", sheet: targetSheetName });
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
