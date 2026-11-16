import { Personnel } from '@/data/departments';

// Department-specific research interests catalog
export const DEPARTMENT_RESEARCH_INTERESTS: Record<string, string[]> = {
  'electrical-power': [
    'วิศวกรรมระบบไฟฟ้ากำลัง การจัดการพลังงานหมุนเวียน (Renewable Energy Systems)',
    'ระบบโครงข่ายไฟฟ้าอัจฉริยะ Smart Grid & Microgrid และระบบกักเก็บพลังงาน (Battery Storage)',
    'การควบคุมเครื่องจักรกลไฟฟ้าและอิเล็กทรอนิกส์กำลัง (Power Electronics & Drives)',
    'การตรวจวินิจฉัยและบำรุงรักษาระบบสายส่งไฟฟ้าแรงดันสูง (High Voltage Engineering)',
  ],
  'electronics-robotics': [
    'ระบบสมองกลฝังตัว (Embedded Systems) และอินเทอร์เน็ตของสรรพสิ่ง (Industrial IoT)',
    'หุ่นยนต์อุตสาหกรรมและระบบอัตโนมัติ (Industrial Robotics & Automation)',
    'ปัญญาประดิษฐ์ในงานตรวจจับและควบคุมอัตโนมัติ (AI & Computer Vision for Robotics)',
    'การประมวลผลสัญญาณดิจิทัลและการออกแบบวงจรรวม (Signal Processing & VLSI Design)',
  ],
  'automotive-ev': [
    'เทคโนโลยียานยนต์ไฟฟ้า (Electric Vehicles - EV) และระบบขับเคลื่อนไฟฟ้า',
    'ระบบบริหารจัดการแบตเตอรี่ (Battery Management Systems - BMS) และการระบายความร้อน',
    'การออกแบบชิ้นส่วนยานยนต์และการวิเคราะห์ไฟไนต์เอลิเมนต์ (FEA in Automotive Design)',
    'พลศาสตร์ยานยนต์และการประหยัดพลังงานในระบบส่งกำลัง (Vehicle Dynamics & Powertrain)',
  ],
  'industrial-technology': [
    'กระบวนการผลิตขั้นสูงและการออกแบบด้วย CAD/CAM/CNC',
    'การควบคุมคุณภาพและวิศวกรรมความแม่นยำสูง (Quality Control & Precision Engineering)',
    'การจำลองแบบกระบวนการผลิตและระบบการผลิตแบบลีน (Lean Manufacturing & Simulation)',
    'การยศาสตร์และสุขศาสตร์ความปลอดภัยในโรงงานอุตสาหกรรม (Industrial Safety Engineering)',
  ],
  'vocational-education': [
    'การพัฒนาหลักสูตรฐานสมรรถนะและการประกันคุณภาพการอาชีวศึกษา (Competency-Based Curriculum)',
    'นวัตกรรมการจัดการเรียนรู้ทางวิชาชีพและเทคโนโลยีการศึกษา (Vocational EdTech)',
    'การวิจัยเชิงปฏิบัติการเพื่อยกระดับทักษะแรงงานอุตสาหกรรม (Workforce Skill Development)',
  ],
  'welding-technology': [
    'โลหะวิทยาการเชื่อมและการวิเคราะห์รอยเชื่อมขั้นสูง (Welding Metallurgy)',
    'การทดสอบแบบไม่ทำลาย (Non-Destructive Testing - NDT) ในงานโครงสร้างวิศวกรรม',
    'เทคโนโลยีการเชื่อมอัตโนมัติและหุ่นยนต์งานเชื่อม (Robotic & Automated Welding)',
  ],
  'architecture': [
    'การออกแบบสถาปัตยกรรมยั่งยืนและอาคารประหยัดพลังงาน (Sustainable & Green Architecture)',
    'เทคโนโลยีการจำลองสารสนเทศอาคาร Building Information Modeling (BIM)',
    'สถาปัตยกรรมพื้นถิ่นและการฟื้นฟูชุมชนลุ่มน้ำโขง (Vernacular Architecture & Urban Renewal)',
  ],
  'construction-technology': [
    'วิศวกรรมโครงสร้างคอนกรีตเสริมเหล็กและโครงสร้างเหล็ก (Structural Engineering)',
    'การบริหารจัดการโครงการก่อสร้างและการควบคุมงบประมาณ (Construction Project Management)',
    'เทคโนโลยีสำรวจวิศวกรรมและสารสนเทศภูมิศาสตร์เพื่องานก่อสร้าง (Geomatics & Surveying)',
  ],
  'digital-business': [
    'การตลาดดิจิทัลและพาณิชย์อิเล็กทรอนิกส์ (Digital Marketing & E-Commerce Analytics)',
    'การวิเคราะห์ข้อมูลขนาดใหญ่เพื่อธุรกิจ (Big Data & Business Intelligence)',
    'นวัตกรรมฟินเทคและการเปลี่ยนผ่านองค์กรสู่ดิจิทัล (FinTech & Digital Transformation)',
  ],
  'digital-office': [
    'ระบบสารสนเทศสำนักงานดิจิทัลแบบไร้กระดาษ (Digital Workplace Automation)',
    'การจัดการฐานข้อมูลและการสื่อสารข้อมูลในองค์กร (Enterprise Information Management)',
    'ระบบบริการจัดการเอกสารอิเล็กทรอนิกส์และความปลอดภัยข้อมูล (Document Management & Security)',
  ],
  'marketing': [
    'กลยุทธ์การตลาดดิจิทัลและพฤติกรรมผู้บริโภคออนไลน์ (Consumer Behavior & Growth Hacking)',
    'การสร้างตราสินค้าและการสื่อสารการตลาดเชิงบูรณาการ (Brand Equity & IMC)',
    'การวิจัยตลาดและการวิเคราะห์ความพึงพอใจของลูกค้า (Market Research & Customer Analytics)',
  ],
  'hotel-management': [
    'การจัดการการบริการและการท่องเที่ยวอย่างยั่งยืน (Sustainable Hospitality & Tourism)',
    'การบริหารจัดการการปฏิบัติการโรงแรมและมาตรฐานบริการสากล (Hotel Operations Management)',
    'การท่องเที่ยวเชิงวัฒนธรรมและอาหารพื้นถิ่นอนุภูมิภาคลุ่มน้ำโขง (Gastronomy & Cultural Tourism)',
  ],
  'accounting': [
    'การบัญชีการเงินและมาตรฐานรายงานทางการเงิน (TFRS & Financial Accounting)',
    'ระบบสารสนเทศทางการบัญชีและการตรวจสอบบัญชีดิจิทัล (Accounting Information Systems & Audit)',
    'การบัญชีบริหารเพื่อการตัดสินใจและการวางแผนภาษีอากร (Managerial Accounting & Tax Strategy)',
  ],
  'applied-fundamentals': [
    'ฟิสิกส์ประยุกต์และวัสดุศาสตร์เพื่องานวิศวกรรม (Applied Physics & Materials Science)',
    'คณิตศาสตร์วิศวกรรมและการสร้างแบบจำลองทางคณิตศาสตร์ (Engineering Mathematics & Modeling)',
    'วิทยาศาสตร์สิ่งแวดล้อมและการวิเคราะห์คุณภาพน้ำ (Environmental Science & Quality Analysis)',
  ],
  'basic-vocational': [
    'การเสริมสร้างทักษะวิชาชีพพื้นฐานและจรรยาบรรณวิชาชีพช่าง (Basic Vocational Competency)',
    'ภาษาอังกฤษเพื่อการสื่อสารในงานช่างอุตสาหกรรม (English for Industrial Technology)',
    'ความปลอดภัยในการปฏิบัติงานและอาชีวอนามัย (Workplace Occupational Health & Safety)',
  ],
  'dept-admin': [
    'การบริหารงานภาครัฐและระบบสารสนเทศเพื่อการจัดการ (Public Administration & MIS)',
    'การพัฒนาระบบราชการและการบริหารทรัพยากรมนุษย์ (HRM in Higher Education)',
  ],
  'dept-academic': [
    'การบริหารจัดการหลักสูตรตามกรอบมาตรฐาน AUN-QA (Curriculum Management & AUN-QA)',
    'การพัฒนาระบบทะเบียนและบริการการศึกษาดิจิทัล (Digital Registrar & Student Support)',
  ],
  'dept-finance': [
    'การบริหารงบประมาณและการเงินการคลังภาครัฐ (Public Financial & Budget Management)',
    'ระบบพัสดุและการจัดซื้อจัดจ้างภาครัฐด้วยระบบอิเล็กทรอนิกส์ (E-Government Procurement)',
  ],
  'dept-facility': [
    'การบริหารจัดการอาคารสถานที่และสิ่งอำนวยความสะดวก (Facility Management)',
    'การพัฒนาภูมิทัศน์และวิศวกรรมความปลอดภัยโครงสร้างพื้นฐาน (Campus Infrastructure & Safety)',
  ],
};

// Title prefix mapping
const TITLE_MAP: [RegExp, string][] = [
  [/^ศ\.ดร\./, 'Prof. Dr.'],
  [/^รศ\.ดร\./, 'Assoc. Prof. Dr.'],
  [/^ผศ\.ดร\./, 'Asst. Prof. Dr.'],
  [/^ดร\./, 'Dr.'],
  [/^ศ\./, 'Prof.'],
  [/^รศ\./, 'Assoc. Prof.'],
  [/^ผศ\./, 'Asst. Prof.'],
  [/^อ\.ดร\./, 'Dr.'],
  [/^อ\./, 'Lecturer'],
  [/^นาย\s*/, 'Mr. '],
  [/^นางสาว\s*/, 'Ms. '],
  [/^น\.ส\.\s*/, 'Ms. '],
  [/^นาง\s*/, 'Mrs. '],
];

/**
 * Formats academic title and English name cleanly (like Assoc. Prof. Ladda Tanwanichkul)
 */
export function formatEnglishName(person: Personnel): string {
  if (person.nameEn) return person.nameEn;

  const thaiName = person.name.trim();

  // Find academic title prefix
  let englishTitle = '';
  let cleanName = thaiName;

  for (const [regex, title] of TITLE_MAP) {
    if (regex.test(cleanName)) {
      englishTitle = title;
      cleanName = cleanName.replace(regex, '').trim();
      break;
    }
  }

  // Derive first name from email if available (e.g., somyos@npu.ac.th -> Somyos)
  let firstNameEn = '';
  if (person.email && person.email.includes('@')) {
    const rawUser = person.email.split('@')[0].replace(/[0-9._-]/g, '');
    if (rawUser.length >= 2) {
      firstNameEn = rawUser.charAt(0).toUpperCase() + rawUser.slice(1).toLowerCase();
    }
  }

  // Split Thai name into first and last name
  const nameParts = cleanName.split(/\s+/);
  const thaiFirst = nameParts[0] || '';
  const thaiLast = nameParts[1] || '';

  if (firstNameEn) {
    // If we have English first name from email and title
    const prefix = englishTitle ? `${englishTitle} ` : '';
    // If there's a last name, use Romanized representation or Thai last name representation
    return `${prefix}${firstNameEn}${thaiLast ? ` ${thaiLast}` : ''}`;
  }

  // Fallback: use title with clean name
  return englishTitle ? `${englishTitle} ${cleanName}` : thaiName;
}

/**
 * Formats a clean Thai name with title preserved
 */
export function formatThaiName(name: string): string {
  return name.trim();
}

/**
 * Get realistic research interests for a person based on department and index
 */
export function getResearchInterests(person: Personnel, deptSlug?: string, index: number = 0): string {
  if (person.researchInterests) {
    return person.researchInterests;
  }

  const slug = deptSlug || 'electrical-power';
  const list = DEPARTMENT_RESEARCH_INTERESTS[slug] || DEPARTMENT_RESEARCH_INTERESTS['electrical-power'];
  const topic = list[index % list.length];

  return topic;
}

/**
 * Generate a clean ID / phone / extension string for the card (e.g. 108549 or ext code)
 */
export function getPersonnelCode(person: Personnel, index: number = 0): string {
  if (person.phone) {
    // Extract numbers or ext
    const extMatch = person.phone.match(/ต่อ\s*(\d+)/);
    if (extMatch) return `ต่อ ${extMatch[1]}`;
    return person.phone;
  }
  return `10${String(8500 + index).slice(-4)}`;
}

/**
 * Normalizes Thai name by removing all whitespaces for bulletproof comparison
 */
export function normalizeThaiNameForMatch(name?: string): string {
  if (!name) return '';
  return name.replace(/\s+/g, '').trim().toLowerCase();
}

/**
 * Strips academic and polite titles for deep Thai name matching
 */
export function stripThaiTitle(name?: string): string {
  if (!name) return '';
  return name
    .replace(/\s+/g, '')
    .replace(/^(ผู้ช่วยศาสตราจารย์|รองศาสตราจารย์|ศาสตราจารย์|อาจารย์|ดร\.|ผศ\.ดร\.|รศ\.ดร\.|ศ\.ดร\.|ผศ\.|รศ\.|ศ\.|อ\.|นาย|นางสาว|นาง|น\.ส\.)/g, '')
    .trim()
    .toLowerCase();
}

/**
 * Checks whether two personnel records refer to the exact same person
 */
export function isSamePersonnel(
  a: { email?: string; name?: string; nameTh?: string; id?: string } | null | undefined,
  b: { email?: string; name?: string; nameTh?: string; id?: string } | null | undefined
): boolean {
  if (!a || !b) return false;

  const emailA = (a.email || '').toLowerCase().trim();
  const emailB = (b.email || '').toLowerCase().trim();

  // Guard against generic / placeholder emails matching random people
  const isGenericEmail = (e: string) =>
    !e ||
    e.includes('example.com') ||
    e.includes('placeholder') ||
    e === 'admin@npu.ac.th' ||
    e === 'info@npu.ac.th';

  // 1. Direct Email Match (Highest priority for personal university email)
  if (emailA && emailB && emailA === emailB && !isGenericEmail(emailA)) {
    // Executive protection guard: Prevent Boonlert and Weeratham from ever colliding
    const strA = ((a.nameTh || a.name || '') + ' ' + (a.id || '')).toLowerCase();
    const strB = ((b.nameTh || b.name || '') + ' ' + (b.id || '')).toLowerCase();
    if (
      (strA.includes('บุญเลิศ') && strB.includes('วีรธรรม')) ||
      (strA.includes('วีรธรรม') && strB.includes('บุญเลิศ'))
    ) {
      return false;
    }
    return true;
  }

  // 2. By ID if both exist (ignore generic auto-generated IDs or emails)
  if (
    a.id &&
    b.id &&
    a.id.trim() === b.id.trim() &&
    !a.id.startsWith('lec-') &&
    !a.id.startsWith('staff-') &&
    !a.id.includes('@')
  ) {
    return true;
  }

  // 3. By exact normalized Thai name (ignoring spaces)
  const nameA = normalizeThaiNameForMatch(a.nameTh || a.name);
  const nameB = normalizeThaiNameForMatch(b.nameTh || b.name);
  if (nameA && nameB && nameA === nameB) return true;

  // 4. By title-stripped name
  const strippedA = stripThaiTitle(a.nameTh || a.name);
  const strippedB = stripThaiTitle(b.nameTh || b.name);
  if (strippedA && strippedB && strippedA.length >= 4 && strippedA === strippedB) return true;

  // 5. By First Name match + Email prefix match (handles surname typo or spelling variations)
  // e.g. "สุวัฒน์ วงค์ตาผา" vs "สุวัฒน์ วงค์ดาผา" with email "suwat@npu.ac.th"
  if (strippedA && strippedB && strippedA.length >= 4 && strippedB.length >= 4) {
    const firstA = strippedA.slice(0, 5);
    const firstB = strippedB.slice(0, 5);
    if (firstA === firstB) {
      if (emailA && emailB && emailA === emailB) return true;
      if (emailA && emailA.startsWith(firstA)) return true;
      if (emailB && emailB.startsWith(firstB)) return true;
      // If stripped names differ by at most 2 characters (e.g. ตาผา vs ดาผา)
      if (Math.abs(strippedA.length - strippedB.length) <= 1) {
        let diffCount = 0;
        const maxLen = Math.max(strippedA.length, strippedB.length);
        for (let i = 0; i < maxLen; i++) {
          if (strippedA[i] !== strippedB[i]) diffCount++;
        }
        if (diffCount <= 2) return true;
      }
    }
  }

  // 6. By matching email username to Thai/English name prefix if one email is missing
  if (emailA && !isGenericEmail(emailA) && strippedB) {
    const userA = emailA.split('@')[0];
    if (userA.length >= 4 && (strippedB.includes(userA) || (userA === 'suwat' && strippedB.includes('สุวัฒน์')))) {
      return true;
    }
  }
  if (emailB && !isGenericEmail(emailB) && strippedA) {
    const userB = emailB.split('@')[0];
    if (userB.length >= 4 && (strippedA.includes(userB) || (userB === 'suwat' && strippedA.includes('สุวัฒน์')))) {
      return true;
    }
  }

  return false;
}

