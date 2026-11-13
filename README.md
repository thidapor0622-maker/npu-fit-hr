# ทำเนียบบุคลากร คณะเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยนครพนม (GitHub Pages Ready)

ระบบทำเนียบบุคลากร คณะผู้บริหาร คณาจารย์ประจำ 15 สาขาวิชา และสายสนับสนุน 4 ฝ่ายงาน คณะเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยนครพนม พัฒนาด้วย **Next.js 14 (App Router) + TypeScript + Tailwind CSS** ออกแบบและปรับแต่งเป็น **Static Site** พร้อมสำหรับการ Deploy และรันบน **GitHub Pages** ได้ทันที 100%

---

## 🌐 ฟีเจอร์ที่รองรับบน GitHub Pages

- ✅ **Static Export (`output: 'export'`)**: ส่งออกไฟล์ HTML, CSS, JavaScript และ Assets ทั้งหมดเข้าสู่โฟลเดอร์ `out/`
- ✅ **Auto BasePath Detection**: คำนวณ Subpath ตามชื่อ Repository อัตโนมัติ (เช่น `https://<username>.github.io/<repo-name>/`)
- ✅ **Bypass Jekyll Processing**: มีไฟล์ `.nojekyll` ป้องกันปัญหาโหลดไฟล์ JavaScript/CSS จากโฟลเดอร์ `_next/` ไม่ติด
- ✅ **Zero-Downtime Fallback**: มีฐานข้อมูลคณาจารย์และบุคลากรกว่า 130+ คนฝังในตัว แสดงผลได้ทันที
- ✅ **Client-side Google Sheets Sync**: รองรับการดึงข้อมูลสดจาก Google Sheets แบบเรียลไทม์ผ่าน GViz API บนหน้าเว็บโดยตรง
- ✅ **Backward-Compatible Redirects**: มีไฟล์ Redirect HTML ใน `public/` รองรับ URL เดิม (เช่น `/electrical-power.html`, `/staff.html`) ไม่ทำให้ลิงก์เดิมเสีย
- ✅ **Automated GitHub Actions CI/CD**: มี Workflow `.github/workflows/deploy.yml` อัปเดตและ Deploy ขึ้น GitHub Pages อัตโนมัติเมื่อ Push โค้ด

---

## 🚀 ขั้นตอนการนำขึ้น GitHub และเปิดใช้งาน GitHub Pages

### ขั้นตอนที่ 1: สร้าง Repository บน GitHub
1. เข้าไปที่ [https://github.com/new](https://github.com/new)
2. ตั้งชื่อ Repository (เช่น `HR_SITE` หรือ `npu-fit-hr`)
3. เลือกระดับเป็น **Public** (เพื่อให้ใช้ GitHub Pages ได้ฟรี)
4. **ไม่ต้อง** ติ๊กถูกที่ "Add a README file" จากนั้นกด **Create repository**

---

### ขั้นตอนที่ 2: อัปโหลดโค้ดขึ้น GitHub

เปิด Command Prompt หรือ PowerShell ในโฟลเดอร์นี้ แล้วพิมพ์คำสั่ง:

```bash
# 1. เริ่มต้น Git Repository
git init

# 2. เพิ่มไฟล์ทั้งหมด
git add .

# 3. บันทึก Commit แรก
git commit -m "Initial commit - Next.js for GitHub Pages"

# 4. ตั้งชื่อ Branch หลักเป็น main
git branch -M main

# 5. เชื่อมโยงกับ GitHub Repository ของคุณ (เปลี่ยน URL ให้เป็นของคุณ)
git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/<YOUR-REPO-NAME>.git

# 6. Push โค้ดขึ้นสู่ GitHub
git push -u origin main
```

> **กรณีใช้ GitHub Desktop:** คุณสามารถเปิดโปรแกรม GitHub Desktop แล้วเลือก **Add Local Repository** มาที่โฟลเดอร์นี้ จากนั้นกด **Publish repository** ได้ทันที

---

### ขั้นตอนที่ 3: เปิดใช้งาน GitHub Pages

1. ในหน้า GitHub Repository ของคุณ ไปที่แถบ **Settings** (การตั้งค่า)
2. ที่เมนูด้านซ้าย เลือกหัวข้อ **Pages**
3. ใต้หัวข้อ **Build and deployment**:
   - ในช่อง **Source** ให้เลือกเป็น: **GitHub Actions**
4. หลังจากเลือกแล้ว GitHub Actions จะเริ่มทำงาน (คุณสามารถดูสถานะได้ที่แถบ **Actions**)
5. รอประมาณ 1–2 นาที หน้าเว็บจะเสร็จสมบูรณ์และแสดง URL ประจำเว็บไซต์:
   ```
   https://<YOUR-GITHUB-USERNAME>.github.io/<YOUR-REPO-NAME>/
   ```

---

## 🛠️ การรันและทดสอบในเครื่อง (Local Development)

```bash
# ติดตั้ง dependencies
npm install

# รันโหมด Development
npm run dev

# ทดสอบ Export เป็น Static HTML
npm run build
```

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```
HR_SITE/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions Auto Deploy to Pages
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Template หลัก, Navbar, Footer, Fonts
│   │   ├── globals.css         # Styling, Glassmorphism
│   │   ├── page.tsx            # ทำเนียบคณะผู้บริหาร (Executive Board)
│   │   ├── lecturers/
│   │   │   ├── page.tsx        # รวมอาจารย์ 15 สาขาวิชา
│   │   │   └── [slug]/page.tsx # รายละเอียดอาจารย์ประจำสาขา (Static Generation)
│   │   └── staff/
│   │       ├── page.tsx        # รวมบุคลากรสายสนับสนุน 4 ฝ่าย
│   │       └── [slug]/page.tsx # รายละเอียดบุคลากรประจำฝ่าย (Static Generation)
│   ├── components/             # React Components (PersonnelCard, Console, Modal)
│   ├── data/                   # ฐานข้อมูลบุคลากรในเครื่อง (Local Fallback)
│   └── lib/                    # Helper Functions (Asset Path, Formatter)
├── public/
│   ├── .nojekyll               # ไฟล์สำหรับบอกให้ GitHub Pages เสิร์ฟ _next
│   ├── img/                    # รูปภาพบุคลากรและโลโก้
│   └── *.html                  # ไฟล์ Redirect ย้อนหลัง
├── server_api/                 # รวบรวม API สำหรับ Node.js / Vercel (สำรองไว้)
├── next.config.js              # กำหนดค่า Static Export และ Auto BasePath
└── package.json
```
