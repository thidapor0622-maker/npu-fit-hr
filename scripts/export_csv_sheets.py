import os
import csv
import json

base_dir = r"C:\Users\220503\Desktop\HR_SITE"
output_dir = os.path.join(base_dir, "public", "sheets")
os.makedirs(output_dir, exist_ok=True)

with open(os.path.join(base_dir, "scripts", "extracted_personnel.json"), "r", encoding="utf-8") as f:
    personnel = json.load(f)

with open(os.path.join(base_dir, "scripts", "extracted_meta.json"), "r", encoding="utf-8") as f:
    meta = json.load(f)

# 1. Executives CSV
executives_data = [
    {
        "id": "boonlert",
        "name": "ดร.บุญเลิศ โพธิ์ขำ",
        "position": "คณบดีคณะเทคโนโลยีอุตสาหกรรม",
        "img": "/img/คณบดี.png",
        "email": "boonlert@npu.ac.th",
        "phone": "042-XXX-XXXX ต่อ 101",
        "room": "สำนักงานคณบดี ชั้น 2 อาคารคณะเทคโนโลยีอุตสาหกรรม",
        "dutyStatus": "ปฏิบัติราชการ ณ สำนักงานคณบดี",
        "workingHours": "จันทร์ - ศุกร์ (08:30 - 16:30 น.)",
        "education": "ปร.ด. (การบริหารการศึกษา / เทคโนโลยีอุตสาหกรรม) | วศ.ม. (วิศวกรรมศาสตร์) | วศ.บ. (วิศวกรรมอุตสาหการ)",
        "skills": "การบริหารและกำหนดยุทธศาสตร์องค์กร | ระบบการจัดการเทคโนโลยีอุตสาหกรรม | ระบบการผลิตขั้นสูงและระบบอัตโนมัติ | การประกันคุณภาพการศึกษาระดับสากล (AUN-QA)",
        "works": "กำกับนโยบายยุทธศาสตร์การพัฒนาคณะสู่ความเป็นเลิศด้านเทคโนโลยี | ผู้นำโครงการความร่วมมือทางวิชาการและอุตสาหกรรมอนุภูมิภาคลุ่มน้ำโขง | ผลักดันการพัฒนาหลักสูตรตามกรอบมาตรฐานวิชาชีพ",
        "mapQuery": "https://www.google.com/maps/search/?api=1&query=สำนักงานคณบดี+คณะเทคโนโลยีอุตสาหกรรม+มหาวิทยาลัยนครพนม"
    },
    {
        "id": "weeratham",
        "name": "ผศ.วีรธรรม ไชยยงค์",
        "position": "รองคณบดีฝ่ายบริหาร",
        "img": "/img/รอง1.png",
        "email": "weeratham@npu.ac.th",
        "phone": "042-XXX-XXXX ต่อ 102",
        "room": "ห้องรองคณบดีฝ่ายบริหาร อาคารคณะเทคโนโลยีอุตสาหกรรม",
        "dutyStatus": "ปฏิบัติราชการตามปกติ",
        "workingHours": "จันทร์ - ศุกร์ (08:30 - 16:30 น.)",
        "education": "วศ.ม. (วิศวกรรมไฟฟ้า) | ค.อ.บ. (วิศวกรรมไฟฟ้าสื่อสาร)",
        "skills": "การบริหารงานบุคคลและงบประมาณภาครัฐ | วิศวกรรมระบบไฟฟ้ากำลังและการอนุรักษ์พลังงาน | การบริหารอาคารสถานที่และโครงสร้างพื้นฐาน",
        "works": "กำกับดูแลระบบบริหารงานบุคคล งานพัสดุ และยานพาหนะของคณะ | โครงการยกระดับประสิทธิภาพพลังงานหมุนเวียนภายในคณะฯ | พัฒนาระบบเอกสารดิจิทัลแบบไร้กระดาษ (E-Document)",
        "mapQuery": "https://www.google.com/maps/search/?api=1&query=สำนักงานคณบดี+คณะเทคโนโลยีอุตสาหกรรม+มหาวิทยาลัยนครพนม"
    },
    {
        "id": "boonyiem",
        "name": "ผศ.บุญเยี่ยม ยศเรืองศักดิ์",
        "position": "รองคณบดีฝ่ายวิชาการ",
        "img": "/img/รอง2.png",
        "email": "boonyiem@npu.ac.th",
        "phone": "042-XXX-XXXX ต่อ 103",
        "room": "ห้องฝ่ายวิชาการและบริการการศึกษา ชั้น 2",
        "dutyStatus": "ปฏิบัติราชการตามปกติ / มีภารกิจสอนภาคปฏิบัติ",
        "workingHours": "จันทร์ - ศุกร์ (08:30 - 16:30 น.)",
        "education": "วศ.ม. (วิศวกรรมเครื่องกล) | วศ.บ. (วิศวกรรมเครื่องกล)",
        "skills": "การพัฒนาและบริหารหลักสูตรแบบ OBE | ระบบปรับอากาศและเครื่องทำความเย็นอุตสาหกรรม | กลศาสตร์วิศวกรรมและการออกแบบชิ้นส่วนเครื่องจักรกล",
        "works": "กำกับดูแลงานวิชาการ การจัดการเรียนการสอน 15 สาขาวิชา | โครงการผลิตบัณฑิตพันธุ์ใหม่ตอบโจทย์อุตสาหกรรมเป้าหมาย | ที่ปรึกษาโครงงานสิ่งประดิษฐ์และนวัตกรรมเครื่องกล",
        "mapQuery": "https://www.google.com/maps/search/?api=1&query=สำนักงานคณบดี+คณะเทคโนโลยีอุตสาหกรรม+มหาวิทยาลัยนครพนม"
    },
    {
        "id": "weera",
        "name": "ผศ.ดร.วีระ รัตนงาม",
        "position": "รองคณบดีฝ่ายวิจัย",
        "img": "/img/รอง3.png",
        "email": "weera@npu.ac.th",
        "phone": "042-XXX-XXXX ต่อ 104",
        "room": "ห้องศูนย์วิจัยและบริการวิชาการ ชั้น 3",
        "dutyStatus": "ปฏิบัติราชการ / งานพิจารณาทุนวิจัย",
        "workingHours": "จันทร์ - ศุกร์ (08:30 - 16:30 น.)",
        "education": "ปร.ด. (วิศวกรรมวัสดุและการผลิต) | วศ.ม. (วิศวกรรมอุตสาหการ) | วศ.บ. (วิศวกรรมการผลิต)",
        "skills": "วิศวกรรมวัสดุและกระบวนการผลิตขั้นสูง | การจัดการทรัพย์สินทางปัญญาและสิทธิบัตร | การวิจัยเชิงพื้นที่และการถ่ายทอดเทคโนโลยีสู่ชุมชน",
        "works": "ส่งเสริมผลงานวิจัยคณาจารย์ตีพิมพ์ในวารสารระดับนานาชาติ | โครงการบริการวิชาการยกระดับวิสาหกิจชุมชนด้วยเทคโนโลยี | ประสานงานการจดทะเบียนสิทธิบัตร/อนุสิทธิบัตรนวัตกรรม",
        "mapQuery": "https://www.google.com/maps/search/?api=1&query=สำนักงานคณบดี+คณะเทคโนโลยีอุตสาหกรรม+มหาวิทยาลัยนครพนม"
    },
    {
        "id": "yodprem",
        "name": "ผศ.ยอดเปรม ภูกำเนิด",
        "position": "รองคณบดีฝ่ายพัฒนานักศึกษา",
        "img": "/img/รอง4.png",
        "email": "yodprem@npu.ac.th",
        "phone": "042-XXX-XXXX ต่อ 105",
        "room": "ห้องกิจการนักศึกษาและสโมสรนักศึกษา ชั้น 1",
        "dutyStatus": "ปฏิบัติราชการตามปกติ",
        "workingHours": "จันทร์ - ศุกร์ (08:30 - 16:30 น.)",
        "education": "ค.อ.ม. (เทคโนโลยีอุตสาหกรรม / วิศวกรรมโยธา) | ค.อ.บ. (วิศวกรรมโยธาและสถาปัตยกรรม)",
        "skills": "กิจกรรมพัฒนานักศึกษาและภาวะผู้นำ | วิศวกรรมสำรวจและโครงสร้างพื้นฐาน | การพัฒนาทักษะ Soft Skills และการแนะแนวอาชีพ",
        "works": "กำกับดูแลงานสโมสรนักศึกษา ทุนการศึกษา และสวัสดิการ | ส่งเสริมนักศึกษาเข้าร่วมแข่งขันทักษะวิชาชีพในระดับชาติ | โครงการจิตอาสาพัฒนาสังคมของนักศึกษาช่างอุตสาหกรรม",
        "mapQuery": "https://www.google.com/maps/search/?api=1&query=สำนักงานคณบดี+คณะเทคโนโลยีอุตสาหกรรม+มหาวิทยาลัยนครพนม"
    }
]

with open(os.path.join(output_dir, "Executives.csv"), "w", encoding="utf-8-sig", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=list(executives_data[0].keys()))
    writer.writeheader()
    writer.writerows(executives_data)

# 2. Departments CSV
dept_csv_rows = []
for d in meta["departments"]:
    dept_csv_rows.append({
        "slug": d["slug"],
        "title": d["title"],
        "titleEn": d["titleEn"],
        "icon": d["icon"],
        "searchKeywords": d["searchKeywords"]
    })

with open(os.path.join(output_dir, "Departments.csv"), "w", encoding="utf-8-sig", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["slug", "title", "titleEn", "icon", "searchKeywords"])
    writer.writeheader()
    writer.writerows(dept_csv_rows)

# 3. Lecturers CSV
lecturers_rows = []
for d in meta["departments"]:
    slug = d["slug"]
    html_f = f"{slug}.html"
    p_info = personnel.get(html_f, {})
    cards = p_info.get("allCards", [])
    for idx, c in enumerate(cards):
        lecturers_rows.append({
            "departmentSlug": slug,
            "name": c["name"],
            "position": c["position"],
            "isHead": "TRUE" if idx == 0 else "FALSE",
            "img": c.get("img", ""),
            "email": c.get("email", ""),
            "phone": c.get("phone", ""),
            "location": c.get("location", ""),
            "calendarName": c.get("calendarName", c["name"])
        })

with open(os.path.join(output_dir, "Lecturers.csv"), "w", encoding="utf-8-sig", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["departmentSlug", "name", "position", "isHead", "img", "email", "phone", "location", "calendarName"])
    writer.writeheader()
    writer.writerows(lecturers_rows)

# 4. Divisions CSV
div_csv_rows = []
for div in meta["divisions"]:
    div_csv_rows.append({
        "slug": div["slug"],
        "title": div["title"],
        "description": div["description"],
        "icon": div["icon"]
    })

with open(os.path.join(output_dir, "Divisions.csv"), "w", encoding="utf-8-sig", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["slug", "title", "description", "icon"])
    writer.writeheader()
    writer.writerows(div_csv_rows)

# 5. Staff CSV
staff_rows = []
for div in meta["divisions"]:
    slug = div["slug"]
    html_f = f"{slug}.html"
    p_info = personnel.get(html_f, {})
    cards = p_info.get("allCards", [])
    for idx, c in enumerate(cards):
        staff_rows.append({
            "divisionSlug": slug,
            "name": c["name"],
            "position": c["position"],
            "isHead": "TRUE" if idx == 0 else "FALSE",
            "img": c.get("img", ""),
            "email": c.get("email", ""),
            "phone": c.get("phone", ""),
            "location": c.get("location", ""),
            "calendarName": c.get("calendarName", c["name"])
        })

with open(os.path.join(output_dir, "Staff.csv"), "w", encoding="utf-8-sig", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["divisionSlug", "name", "position", "isHead", "img", "email", "phone", "location", "calendarName"])
    writer.writeheader()
    writer.writerows(staff_rows)

print("Generated all 5 CSV files in public/sheets/ successfully!")
