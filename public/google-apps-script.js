/**
 * Google Apps Script for HR Site Database
 * คณะเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยนครพนม
 *
 * วิธีใช้งาน:
 * 1. เปิด Google Sheets ที่สร้างไว้
 * 2. ไปที่เมนู ส่วนขยาย (Extensions) > Apps Script
 * 3. ลบโค้ดเดิมทั้งหมดออก แล้ววางโค้ดชุดนี้ลงไป
 * 4. กด บันทึก (Ctrl+S)
 * 5. กด ทำให้ใช้งานได้ (Deploy) > การทำให้ใช้งานได้ใหม่ (New deployment)
 * 6. เลือกประเภท: เว็บแอป (Web app)
 * 7. ตั้งค่า "ผู้มีสิทธิ์เข้าถึง" (Who has access) เป็น "ทุกคน" (Anyone)
 * 8. คัดลอก Web App URL ไปใส่ในระบบหลังบ้าน HR Site
 */

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = e.parameter.sheet;

    if (sheetName) {
      const sheet = ss.getSheetByName(sheetName);
      if (!sheet) {
        return createResponse({ error: "Sheet not found: " + sheetName }, 404);
      }
      return createResponse(readSheetData(sheet));
    }

    // Return all sheets if no specific sheet requested
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
    const postData = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = postData.sheet;

    if (!sheetName) {
      return createResponse({ error: "Sheet name is required" }, 400);
    }

    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      return createResponse({ error: "Sheet not found: " + sheetName }, 404);
    }

    // Append new row
    if (postData.action === "append" && postData.row) {
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      const rowData = headers.map(h => postData.row[h] !== undefined ? postData.row[h] : "");
      sheet.appendRow(rowData);
      return createResponse({ success: true, message: "Row added successfully" });
    }

    // Update row by id or name
    if (postData.action === "update" && postData.key && postData.keyValue && postData.row) {
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const keyColIdx = headers.indexOf(postData.key);
      if (keyColIdx === -1) {
        return createResponse({ error: "Key column not found: " + postData.key }, 400);
      }

      for (let i = 1; i < data.length; i++) {
        if (String(data[i][keyColIdx]) === String(postData.keyValue)) {
          headers.forEach((h, hIdx) => {
            if (postData.row[h] !== undefined) {
              sheet.getRange(i + 1, hIdx + 1).setValue(postData.row[h]);
            }
          });
          return createResponse({ success: true, message: "Row updated successfully" });
        }
      }
      return createResponse({ error: "Record not found with " + postData.key + "=" + postData.keyValue }, 404);
    }

    return createResponse({ error: "Invalid action" }, 400);
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
    headers.forEach((header, index) => {
      row[header] = values[i][index];
    });
    rows.push(row);
  }

  return rows;
}

function createResponse(data, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
