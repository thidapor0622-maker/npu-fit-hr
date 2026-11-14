export interface Personnel {
  name: string;
  nameEn?: string;
  position: string;
  img: string;
  email: string;
  phone: string;
  location: string;
  calendarName: string;
  researchInterests?: string;
  education?: string[];
  skills?: string[];
  isHead?: boolean;
  departmentSlug?: string;
}

export interface Department {
  slug: string;
  title: string;
  titleEn: string;
  icon: string;
  searchKeywords: string;
  badge: string;
  head: Personnel | null;
  members: Personnel[];
  allCards: Personnel[];
}

export const DEPARTMENTS_DATA: Department[] = [
  {
    "slug": "electrical-power",
    "title": "สาขาวิชาไฟฟ้ากำลัง",
    "titleEn": "Electrical Power / Industrial Electrical Tech",
    "icon": "fa-solid fa-bolt",
    "searchKeywords": "สาขาวิชาไฟฟ้ากำลัง ไฟฟ้า electrical power industrial electrical tech",
    "badge": "",
    "head": {
      "name": "ผศ.กาญจน์ กันปัญญา",
      "position": "หัวหน้าหลักสูตร / อาจารย์ประจำสาขาวิชา",
      "img": "/img/ผศ.กาญจน์ กันปัญญา.jpg",
      "email": "karn@npu.ac.th",
      "phone": "042-503-777",
      "location": "สาขาวิชาไฟฟ้ากำลัง",
      "calendarName": "ผู้ช่วยศาสตราจารย์กาญจน์ กันปัญญา"
    },
    "members": [
      {
        "name": "นายสมยศ สีแสนซุย",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/สมยศ.jpg",
        "email": "somyos@npu.ac.th",
        "phone": "042-503-777",
        "location": "สาขาวิชาไฟฟ้ากำลัง",
        "calendarName": "นายสมยศ สีแสนซุย"
      },
      {
        "name": "นายบุญเติม อุ่นวิเศษ",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/บุญเติม.jpg",
        "email": "boonterm@npu.ac.th",
        "phone": "042-503-777",
        "location": "สาขาวิชาไฟฟ้ากำลัง",
        "calendarName": "นายบุญเติม อุ่นวิเศษ"
      },
      {
        "name": "ผศ.ธราธิป ภู่ระหงษ์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ธราธิป.jpg",
        "email": "tharathip@npu.ac.th",
        "phone": "042-503-777",
        "location": "สาขาวิชาไฟฟ้ากำลัง",
        "calendarName": "ผู้ช่วยศาสตราจารย์ธราธิป ภู่ระหงษ์"
      },
      {
        "name": "ผศ.ดร.สิทธิพงศ์ อินทรายุทธ",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/สิทธิพงศ์.jpg",
        "email": "sittiphong@npu.ac.th",
        "phone": "042-503-777",
        "location": "สาขาวิชาไฟฟ้ากำลัง",
        "calendarName": "ผู้ช่วยศาสตราจารย์ ดร.สิทธิพงศ์ อินทรายุทธ"
      },
      {
        "name": "ผศ.โกวิท ยอดมงคล",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/โกวิท.jpg",
        "email": "kowit@npu.ac.th",
        "phone": "042-503-777",
        "location": "สาขาวิชาไฟฟ้ากำลัง",
        "calendarName": "ผู้ช่วยศาสตราจารย์โกวิท ยอดมงคล"
      },
      {
        "name": "รศ.ดร.ศุภชัย ปลายเนตร",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ศุภชัย.jpg",
        "email": "suphachai@npu.ac.th",
        "phone": "042-503-777",
        "location": "สาขาวิชาไฟฟ้ากำลัง",
        "calendarName": "รองศาสตราจารย์ ดร.ศุภชัย ปลายเนตร"
      },
      {
        "name": "ผศ.สิริวัฒน์ นิลวัฒน์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/สิริวัฒน์.jpg",
        "email": "siriwat@npu.ac.th",
        "phone": "042-503-777",
        "location": "สาขาวิชาไฟฟ้ากำลัง",
        "calendarName": "ผู้ช่วยศาสตราจารย์สิริวัฒน์ นิลวัฒน์"
      },
      {
        "name": "ผศ.ดร.เจษฎา สารสุข",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/เจษฎา.jpg",
        "email": "jetsada@npu.ac.th",
        "phone": "042-503-777",
        "location": "สาขาวิชาไฟฟ้ากำลัง",
        "calendarName": "ผู้ช่วยศาสตราจารย์ ดร.เจษฎา สารสุข"
      },
      {
        "name": "นายคจรศักดิ์ สิงหันต์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/คจรศักดิ์.jpg",
        "email": "kajornsak@npu.ac.th",
        "phone": "042-503-777",
        "location": "สาขาวิชาไฟฟ้ากำลัง",
        "calendarName": "นายคจรศักดิ์ สิงหันต์"
      },
      {
        "name": "นายสมศักดิ์ แสนเมือง",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/สมศักดิ์.jpg",
        "email": "somsak@npu.ac.th",
        "phone": "042-503-777",
        "location": "สาขาวิชาไฟฟ้ากำลัง",
        "calendarName": "นายสมศักดิ์ แสนเมือง"
      }
    ],
    "allCards": [
      {
        "name": "ผศ.กาญจน์ กันปัญญา",
        "position": "หัวหน้าหลักสูตร / อาจารย์ประจำสาขาวิชา",
        "img": "/img/ผศ.กาญจน์ กันปัญญา.jpg",
        "email": "karn@npu.ac.th",
        "phone": "042-503-777",
        "location": "สาขาวิชาไฟฟ้ากำลัง",
        "calendarName": "ผู้ช่วยศาสตราจารย์กาญจน์ กันปัญญา"
      },
      {
        "name": "นายสมยศ สีแสนซุย",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/สมยศ.jpg",
        "email": "somyos@npu.ac.th",
        "phone": "042-503-777",
        "location": "สาขาวิชาไฟฟ้ากำลัง",
        "calendarName": "นายสมยศ สีแสนซุย"
      },
      {
        "name": "นายบุญเติม อุ่นวิเศษ",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/บุญเติม.jpg",
        "email": "boonterm@npu.ac.th",
        "phone": "042-503-777",
        "location": "สาขาวิชาไฟฟ้ากำลัง",
        "calendarName": "นายบุญเติม อุ่นวิเศษ"
      },
      {
        "name": "ผศ.ธราธิป ภู่ระหงษ์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ธราธิป.jpg",
        "email": "tharathip@npu.ac.th",
        "phone": "042-503-777",
        "location": "สาขาวิชาไฟฟ้ากำลัง",
        "calendarName": "ผู้ช่วยศาสตราจารย์ธราธิป ภู่ระหงษ์"
      },
      {
        "name": "ผศ.ดร.สิทธิพงศ์ อินทรายุทธ",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/สิทธิพงศ์.jpg",
        "email": "sittiphong@npu.ac.th",
        "phone": "042-503-777",
        "location": "สาขาวิชาไฟฟ้ากำลัง",
        "calendarName": "ผู้ช่วยศาสตราจารย์ ดร.สิทธิพงศ์ อินทรายุทธ"
      },
      {
        "name": "ผศ.โกวิท ยอดมงคล",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/โกวิท.jpg",
        "email": "kowit@npu.ac.th",
        "phone": "042-503-777",
        "location": "สาขาวิชาไฟฟ้ากำลัง",
        "calendarName": "ผู้ช่วยศาสตราจารย์โกวิท ยอดมงคล"
      },
      {
        "name": "รศ.ดร.ศุภชัย ปลายเนตร",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ศุภชัย.jpg",
        "email": "suphachai@npu.ac.th",
        "phone": "042-503-777",
        "location": "สาขาวิชาไฟฟ้ากำลัง",
        "calendarName": "รองศาสตราจารย์ ดร.ศุภชัย ปลายเนตร"
      },
      {
        "name": "ผศ.สิริวัฒน์ นิลวัฒน์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/สิริวัฒน์.jpg",
        "email": "siriwat@npu.ac.th",
        "phone": "042-503-777",
        "location": "สาขาวิชาไฟฟ้ากำลัง",
        "calendarName": "ผู้ช่วยศาสตราจารย์สิริวัฒน์ นิลวัฒน์"
      },
      {
        "name": "ผศ.ดร.เจษฎา สารสุข",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/เจษฎา.jpg",
        "email": "jetsada@npu.ac.th",
        "phone": "042-503-777",
        "location": "สาขาวิชาไฟฟ้ากำลัง",
        "calendarName": "ผู้ช่วยศาสตราจารย์ ดร.เจษฎา สารสุข"
      },
      {
        "name": "นายคจรศักดิ์ สิงหันต์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/คจรศักดิ์.jpg",
        "email": "kajornsak@npu.ac.th",
        "phone": "042-503-777",
        "location": "สาขาวิชาไฟฟ้ากำลัง",
        "calendarName": "นายคจรศักดิ์ สิงหันต์"
      },
      {
        "name": "นายสมศักดิ์ แสนเมือง",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/สมศักดิ์.jpg",
        "email": "somsak@npu.ac.th",
        "phone": "042-503-777",
        "location": "สาขาวิชาไฟฟ้ากำลัง",
        "calendarName": "นายสมศักดิ์ แสนเมือง"
      }
    ]
  },
  {
    "slug": "electronics-robotics",
    "title": "สาขาวิชาอิเล็กทรอนิกส์ฯ",
    "titleEn": "Electronics & Robotics Engineering",
    "icon": "fa-solid fa-robot",
    "searchKeywords": "สาขาวิชาอิเล็กทรอนิกส์ หุ่นยนต์ electronics robotics engineering",
    "badge": "",
    "head": {
      "name": "รศ.ดร.ชูธง สัมมัตตะ",
      "position": "ประธานหลักสูตร / อาจารย์ประจำสาขาวิชา",
      "img": "/img/รศ.ดร.ชูธง สัมมัตตะ.jpg",
      "email": "choothong@npu.ac.th",
      "phone": "042-XXX-XXXX",
      "location": "สาขาวิชาอิเล็กทรอนิกส์",
      "calendarName": "รองศาสตราจารย์ ดร.ชูธง สัมมัตตะ"
    },
    "members": [
      {
        "name": "รศ.ดร.ดนุพัฒน์ ดวงมาลัย",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/รศ.ดร.ดนุพัฒน์ ดวงมาลัย.jpg",
        "email": "danupat@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาอิเล็กทรอนิกส์",
        "calendarName": "รศ.ดร.ดนุพัฒน์ ดวงมาลัย"
      },
      {
        "name": "ผศ.นรเศรษฐ ไทยแท้",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ผศ.นรเศรษฐ ไทยแท้.jpg",
        "email": "noraset@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาอิเล็กทรอนิกส์",
        "calendarName": "ผศ.นรเศรษฐ ไทยแท้"
      },
      {
        "name": "ผศ.ปรัชญา พนมอุปถัมภ์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ผศ.ปรัชญา พนมอุปถัมภ์.jpg",
        "email": "pratchaya@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาอิเล็กทรอนิกส์",
        "calendarName": "ผศ.ปรัชญา พนมอุปถัมภ์"
      },
      {
        "name": "นายรชต ตามา",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นายรชต ตามา.jpg",
        "email": "rachata@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาอิเล็กทรอนิกส์",
        "calendarName": "นายรชต ตามา"
      },
      {
        "name": "รศ.ดร.สมชาติ โสนะแสง",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/รศ.ดร.สมชาติ โสนะแสง.jpg",
        "email": "somchart@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาอิเล็กทรอนิกส์",
        "calendarName": "รศ.ดร.สมชาติ โสนะแสง"
      },
      {
        "name": "ผศ.พัชรณัฏฐ์ แสงอ่อน",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ผศ.พัชรณัฏฐ์ แสงอ่อน.jpg",
        "email": "patcharanat@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาอิเล็กทรอนิกส์",
        "calendarName": "ผศ.พัชรณัฏฐ์ แสงอ่อน"
      },
      {
        "name": "ผศ.พงศ์พัทธ์ มังคละคีรี",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ผศ.พงศ์พัทธ์ มังคละคีรี.jpg",
        "email": "pongpat@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาอิเล็กทรอนิกส์",
        "calendarName": "ผศ.พงศ์พัทธ์ มังคละคีรี"
      },
      {
        "name": "ผศ.ธนภัทร มาลีลัย",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ผศ.ธนภัทร มาลีลัย.jpg",
        "email": "thanapat@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาอิเล็กทรอนิกส์",
        "calendarName": "ผศ.ธนภัทร มาลีลัย"
      },
      {
        "name": "ผศ.ทศพล มานะศรี",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ผศ.ทศพล มานะศรี.jpg",
        "email": "thotsapol@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาอิเล็กทรอนิกส์",
        "calendarName": "ผศ.ทศพล มานะศรี"
      },
      {
        "name": "นายกฤษดา สิทธิดา",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นายกฤษดา สิทธิดา.jpg",
        "email": "kritsada@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาอิเล็กทรอนิกส์",
        "calendarName": "นายกฤษดา สิทธิดา"
      },
      {
        "name": "นายมานะพันธ์ พ่อยันต์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นายมานะพันธ์ พ่อยันต์.jpg",
        "email": "manapan@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาอิเล็กทรอนิกส์",
        "calendarName": "นายมานะพันธ์ พ่อยันต์"
      }
    ],
    "allCards": [
      {
        "name": "รศ.ดร.ชูธง สัมมัตตะ",
        "position": "ประธานหลักสูตร / อาจารย์ประจำสาขาวิชา",
        "img": "/img/รศ.ดร.ชูธง สัมมัตตะ.jpg",
        "email": "choothong@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาอิเล็กทรอนิกส์",
        "calendarName": "รองศาสตราจารย์ ดร.ชูธง สัมมัตตะ"
      },
      {
        "name": "รศ.ดร.ดนุพัฒน์ ดวงมาลัย",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/รศ.ดร.ดนุพัฒน์ ดวงมาลัย.jpg",
        "email": "danupat@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาอิเล็กทรอนิกส์",
        "calendarName": "รศ.ดร.ดนุพัฒน์ ดวงมาลัย"
      },
      {
        "name": "ผศ.นรเศรษฐ ไทยแท้",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ผศ.นรเศรษฐ ไทยแท้.jpg",
        "email": "noraset@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาอิเล็กทรอนิกส์",
        "calendarName": "ผศ.นรเศรษฐ ไทยแท้"
      },
      {
        "name": "ผศ.ปรัชญา พนมอุปถัมภ์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ผศ.ปรัชญา พนมอุปถัมภ์.jpg",
        "email": "pratchaya@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาอิเล็กทรอนิกส์",
        "calendarName": "ผศ.ปรัชญา พนมอุปถัมภ์"
      },
      {
        "name": "นายรชต ตามา",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นายรชต ตามา.jpg",
        "email": "rachata@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาอิเล็กทรอนิกส์",
        "calendarName": "นายรชต ตามา"
      },
      {
        "name": "รศ.ดร.สมชาติ โสนะแสง",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/รศ.ดร.สมชาติ โสนะแสง.jpg",
        "email": "somchart@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาอิเล็กทรอนิกส์",
        "calendarName": "รศ.ดร.สมชาติ โสนะแสง"
      },
      {
        "name": "ผศ.พัชรณัฏฐ์ แสงอ่อน",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ผศ.พัชรณัฏฐ์ แสงอ่อน.jpg",
        "email": "patcharanat@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาอิเล็กทรอนิกส์",
        "calendarName": "ผศ.พัชรณัฏฐ์ แสงอ่อน"
      },
      {
        "name": "ผศ.พงศ์พัทธ์ มังคละคีรี",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ผศ.พงศ์พัทธ์ มังคละคีรี.jpg",
        "email": "pongpat@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาอิเล็กทรอนิกส์",
        "calendarName": "ผศ.พงศ์พัทธ์ มังคละคีรี"
      },
      {
        "name": "ผศ.ธนภัทร มาลีลัย",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ผศ.ธนภัทร มาลีลัย.jpg",
        "email": "thanapat@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาอิเล็กทรอนิกส์",
        "calendarName": "ผศ.ธนภัทร มาลีลัย"
      },
      {
        "name": "ผศ.ทศพล มานะศรี",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ผศ.ทศพล มานะศรี.jpg",
        "email": "thotsapol@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาอิเล็กทรอนิกส์",
        "calendarName": "ผศ.ทศพล มานะศรี"
      },
      {
        "name": "นายกฤษดา สิทธิดา",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นายกฤษดา สิทธิดา.jpg",
        "email": "kritsada@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาอิเล็กทรอนิกส์",
        "calendarName": "นายกฤษดา สิทธิดา"
      },
      {
        "name": "นายมานะพันธ์ พ่อยันต์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นายมานะพันธ์ พ่อยันต์.jpg",
        "email": "manapan@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาอิเล็กทรอนิกส์",
        "calendarName": "นายมานะพันธ์ พ่อยันต์"
      }
    ]
  },
  {
    "slug": "automotive-ev",
    "title": "สาขาวิชายานยนต์และเครื่องกล",
    "titleEn": "Automotive & EV Technology",
    "icon": "fa-solid fa-car-battery",
    "searchKeywords": "สาขาวิชายานยนต์และเครื่องกล ช่างยนต์ ยานยนต์ เครื่องกล automotive ev technology",
    "badge": "",
    "head": {
      "name": "นายภานุวัฒน์ นาคพงษ์",
      "position": "หัวหน้าหลักสูตร / อาจารย์ประจำสาขาวิชา",
      "img": "/img/นายภานุวัฒน์ นาคพงษ์.jpg",
      "email": "uraiwan@npu.ac.th",
      "phone": "042-000-000",
      "location": "สาขาวิชาช่างยนต์ (พิกัด)",
      "calendarName": "นายภานุวัฒน์ นาคพงษ์"
    },
    "members": [
      {
        "name": "ผศ.สุจิน สุนีย์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ผศ.สุจิน สุนีย์.jpg",
        "email": "sujin@npu.ac.th",
        "phone": "042-000-000",
        "location": "สาขาวิชาช่างยนต์ (พิกัด)",
        "calendarName": "ผศ.สุจิน สุนีย์"
      },
      {
        "name": "ผศ.ดร.ไพศาล ศุภิรัตนกุล",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ผศ.ดร.ไพศาล ศุภิรัตนกุล.jpg",
        "email": "phaisan@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างยนต์",
        "calendarName": "ผศ.ดร.ไพศาล ศุภิรัตนกุล"
      },
      {
        "name": "นายนพฤทธิ์ พรหมลัง",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นพฤทธิ์ พรหมลัง.jpg",
        "email": "noppharit@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างยนต์",
        "calendarName": "นายนพฤทธิ์ พรหมลัง"
      },
      {
        "name": "นายทรงพล วิจารณ์จักร",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ทรงพล วิจารณ์จักร.jpg",
        "email": "songphon@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างยนต์",
        "calendarName": "นายทรงพล วิจารณ์จักร"
      },
      {
        "name": "นายกิติพงษ์ แซ่เฮ็ง",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/กิติพงษ์ แซ่เฮ็ง.jpg",
        "email": "kitipong@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างยนต์",
        "calendarName": "นายกิติพงษ์ แซ่เฮ็ง"
      },
      {
        "name": "ดร.กานต์ กอมณี",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/กานต์ กอมณี.jpg",
        "email": "karn.k@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างยนต์",
        "calendarName": "ดร.กานต์ กอมณี"
      },
      {
        "name": "นายบุญโชค พ่อตาแสง",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/บุญโชค พ่อตาแสง.jpg",
        "email": "boonchok@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างยนต์",
        "calendarName": "นายบุญโชค พ่อตาแสง"
      },
      {
        "name": "นายรณศักดิ์ วิวัฒน์ปรีชานนท์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/รณศักดิ์ วิวัฒน์ปรีชานนท์.jpg",
        "email": "ronnasak@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างยนต์",
        "calendarName": "นายรณศักดิ์ วิวัฒน์ปรีชานนท์"
      },
      {
        "name": "นางสาววราภรณ์ อักโขวงศ์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/วราภรณ์ อักโขวงศ์.jpg",
        "email": "waraporn@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างยนต์",
        "calendarName": "นางสาววราภรณ์ อักโขวงศ์"
      },
      {
        "name": "นายอนุรักษ์ ตัณฑวรา",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/อนุรักษ์ ตัณฑวรา.jpg",
        "email": "anurak@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างยนต์",
        "calendarName": "นายอนุรักษ์ ตัณฑวรา"
      }
    ],
    "allCards": [
      {
        "name": "นายภานุวัฒน์ นาคพงษ์",
        "position": "หัวหน้าหลักสูตร / อาจารย์ประจำสาขาวิชา",
        "img": "/img/นายภานุวัฒน์ นาคพงษ์.jpg",
        "email": "uraiwan@npu.ac.th",
        "phone": "042-000-000",
        "location": "สาขาวิชาช่างยนต์ (พิกัด)",
        "calendarName": "นายภานุวัฒน์ นาคพงษ์"
      },
      {
        "name": "ผศ.สุจิน สุนีย์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ผศ.สุจิน สุนีย์.jpg",
        "email": "sujin@npu.ac.th",
        "phone": "042-000-000",
        "location": "สาขาวิชาช่างยนต์ (พิกัด)",
        "calendarName": "ผศ.สุจิน สุนีย์"
      },
      {
        "name": "ผศ.ดร.ไพศาล ศุภิรัตนกุล",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ผศ.ดร.ไพศาล ศุภิรัตนกุล.jpg",
        "email": "phaisan@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างยนต์",
        "calendarName": "ผศ.ดร.ไพศาล ศุภิรัตนกุล"
      },
      {
        "name": "นายนพฤทธิ์ พรหมลัง",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นพฤทธิ์ พรหมลัง.jpg",
        "email": "noppharit@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างยนต์",
        "calendarName": "นายนพฤทธิ์ พรหมลัง"
      },
      {
        "name": "นายทรงพล วิจารณ์จักร",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ทรงพล วิจารณ์จักร.jpg",
        "email": "songphon@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างยนต์",
        "calendarName": "นายทรงพล วิจารณ์จักร"
      },
      {
        "name": "นายกิติพงษ์ แซ่เฮ็ง",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/กิติพงษ์ แซ่เฮ็ง.jpg",
        "email": "kitipong@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างยนต์",
        "calendarName": "นายกิติพงษ์ แซ่เฮ็ง"
      },
      {
        "name": "ดร.กานต์ กอมณี",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/กานต์ กอมณี.jpg",
        "email": "karn.k@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างยนต์",
        "calendarName": "ดร.กานต์ กอมณี"
      },
      {
        "name": "นายบุญโชค พ่อตาแสง",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/บุญโชค พ่อตาแสง.jpg",
        "email": "boonchok@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างยนต์",
        "calendarName": "นายบุญโชค พ่อตาแสง"
      },
      {
        "name": "นายรณศักดิ์ วิวัฒน์ปรีชานนท์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/รณศักดิ์ วิวัฒน์ปรีชานนท์.jpg",
        "email": "ronnasak@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างยนต์",
        "calendarName": "นายรณศักดิ์ วิวัฒน์ปรีชานนท์"
      },
      {
        "name": "นางสาววราภรณ์ อักโขวงศ์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/วราภรณ์ อักโขวงศ์.jpg",
        "email": "waraporn@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างยนต์",
        "calendarName": "นางสาววราภรณ์ อักโขวงศ์"
      },
      {
        "name": "นายอนุรักษ์ ตัณฑวรา",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/อนุรักษ์ ตัณฑวรา.jpg",
        "email": "anurak@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างยนต์",
        "calendarName": "นายอนุรักษ์ ตัณฑวรา"
      }
    ]
  },
  {
    "slug": "industrial-technology",
    "title": "สาขาวิชาช่างกลโรงงาน/สาขาวิชาเทคนิคการผลิต",
    "titleEn": "Industrial & Machine Shop Tech",
    "icon": "fa-solid fa-industry",
    "searchKeywords": "สาขาวิชาช่างกลโรงงาน สาขาวิชาเทคนิคการผลิต ช่างกล ช่างกลโรงงาน เทคนิคการผลิต เทคโนโลยีอุตสาหการ industrial machine shop tech mechanical",
    "badge": "",
    "head": {
      "name": "นายอภิสิทธิ์ แก้วชาลุน",
      "position": "หัวหน้าหลักสูตร / อาจารย์ประจำสาขาวิชา",
      "img": "/img/นายอภิสิทธิ์ แก้วชาลุน.jpg",
      "email": "apisit@npu.ac.th",
      "phone": "042-XXX-XXXX",
      "location": "สาขาวิชาช่างกลโรงงาน",
      "calendarName": "นายอภิสิทธิ์ แก้วชาลุน"
    },
    "members": [
      {
        "name": "นายพฤกษ์อนันต์ สุวรรณไตรย์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นายพฤกษ์อนันต์ สุวรรณไตรย์.jpg",
        "email": "phruekanan@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างกลโรงงาน",
        "calendarName": "นายพฤกษ์อนันต์ สุวรรณไตรย์"
      },
      {
        "name": "นายสุทัศน์ คำพันธ์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นายสุทัศน์ คำพันธ์.jpg",
        "email": "sutat@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างกลโรงงาน",
        "calendarName": "นายสุทัศน์ คำพันธ์"
      },
      {
        "name": "ผศ.สิทธิชัย เจริญราช",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ผศ.สิทธิชัย เจริญราช.jpg",
        "email": "sittichai@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างกลโรงงาน",
        "calendarName": "ผศ.สิทธิชัย เจริญราช"
      },
      {
        "name": "ผศ.ดร.สุริยา ประสมทอง",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ผศ.ดร.สุริยา ประสมทอง.jpg",
        "email": "suriya@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างกลโรงงาน",
        "calendarName": "ผศ.ดร.สุริยา ประสมทอง"
      },
      {
        "name": "นายไพศาล เดชป้องหา",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นายไพศาล เดชป้องหา.jpg",
        "email": "phaisan.d@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างกลโรงงาน",
        "calendarName": "นายไพศาล เดชป้องหา"
      },
      {
        "name": "นายภาณุวัช โทษา",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นายภาณุวัช โทษา.jpg",
        "email": "panuwat.t@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างกลโรงงาน",
        "calendarName": "นายภาณุวัช โทษา"
      },
      {
        "name": "นายสิทธิพงษ์ อุดมบุญญานุภาพ",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นายสิทธิพงษ์ อุดมบุญญานุภาพ.jpg",
        "email": "sittiphong@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างกลโรงงาน",
        "calendarName": "นายสิทธิพงษ์ อุดมบุญญานุภาพ"
      },
      {
        "name": "นายวิโรจน์ ฉัตรเกษ",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นายวิโรจน์ ฉัตรเกษ.jpg",
        "email": "wiroj@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างกลโรงงาน",
        "calendarName": "นายวิโรจน์ ฉัตรเกษ"
      }
    ],
    "allCards": [
      {
        "name": "นายอภิสิทธิ์ แก้วชาลุน",
        "position": "หัวหน้าหลักสูตร / อาจารย์ประจำสาขาวิชา",
        "img": "/img/นายอภิสิทธิ์ แก้วชาลุน.jpg",
        "email": "apisit@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างกลโรงงาน",
        "calendarName": "นายอภิสิทธิ์ แก้วชาลุน"
      },
      {
        "name": "นายพฤกษ์อนันต์ สุวรรณไตรย์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นายพฤกษ์อนันต์ สุวรรณไตรย์.jpg",
        "email": "phruekanan@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างกลโรงงาน",
        "calendarName": "นายพฤกษ์อนันต์ สุวรรณไตรย์"
      },
      {
        "name": "นายสุทัศน์ คำพันธ์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นายสุทัศน์ คำพันธ์.jpg",
        "email": "sutat@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างกลโรงงาน",
        "calendarName": "นายสุทัศน์ คำพันธ์"
      },
      {
        "name": "ผศ.สิทธิชัย เจริญราช",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ผศ.สิทธิชัย เจริญราช.jpg",
        "email": "sittichai@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างกลโรงงาน",
        "calendarName": "ผศ.สิทธิชัย เจริญราช"
      },
      {
        "name": "ผศ.ดร.สุริยา ประสมทอง",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ผศ.ดร.สุริยา ประสมทอง.jpg",
        "email": "suriya@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างกลโรงงาน",
        "calendarName": "ผศ.ดร.สุริยา ประสมทอง"
      },
      {
        "name": "นายไพศาล เดชป้องหา",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นายไพศาล เดชป้องหา.jpg",
        "email": "phaisan.d@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างกลโรงงาน",
        "calendarName": "นายไพศาล เดชป้องหา"
      },
      {
        "name": "นายภาณุวัช โทษา",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นายภาณุวัช โทษา.jpg",
        "email": "panuwat.t@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างกลโรงงาน",
        "calendarName": "นายภาณุวัช โทษา"
      },
      {
        "name": "นายสิทธิพงษ์ อุดมบุญญานุภาพ",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นายสิทธิพงษ์ อุดมบุญญานุภาพ.jpg",
        "email": "sittiphong@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างกลโรงงาน",
        "calendarName": "นายสิทธิพงษ์ อุดมบุญญานุภาพ"
      },
      {
        "name": "นายวิโรจน์ ฉัตรเกษ",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นายวิโรจน์ ฉัตรเกษ.jpg",
        "email": "wiroj@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างกลโรงงาน",
        "calendarName": "นายวิโรจน์ ฉัตรเกษ"
      }
    ]
  },
  {
    "slug": "vocational-education",
    "title": "สาขาวิชาการจัดการอาชีวศึกษา",
    "titleEn": "Educational & Vocational Management",
    "icon": "fa-solid fa-graduation-cap",
    "searchKeywords": "สาขาวิชาการจัดการอาชีวศึกษา สาขาการจัดการอาชีวศึกษา การจัดการ อาชีวศึกษา educational vocational management",
    "badge": "",
    "head": {
      "name": "ดร.ปัณณธรณัฐ อาปะโม",
      "position": "หัวหน้าหลักสูตร / อาจารย์ประจำสาขาวิชา",
      "img": "/img/ดร.ปัณณธรณัฐ อาปะโม.jpg",
      "email": "pannatornnat@npu.ac.th",
      "phone": "042-XXX-XXXX",
      "location": "สาขาวิชาการจัดการศึกษาและอาชีวศึกษา",
      "calendarName": "ดร.ปัณณธรณัฐ อาปะโม"
    },
    "members": [
      {
        "name": "ดร.อรอุมา นาทสีทา",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ดร.อรอุมา นาทสีทา.jpg",
        "email": "onuma@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาการจัดการศึกษาและอาชีวศึกษา",
        "calendarName": "ดร.อรอุมา นาทสีทา"
      }
    ],
    "allCards": [
      {
        "name": "ดร.ปัณณธรณัฐ อาปะโม",
        "position": "หัวหน้าหลักสูตร / อาจารย์ประจำสาขาวิชา",
        "img": "/img/ดร.ปัณณธรณัฐ อาปะโม.jpg",
        "email": "pannatornnat@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาการจัดการศึกษาและอาชีวศึกษา",
        "calendarName": "ดร.ปัณณธรณัฐ อาปะโม"
      },
      {
        "name": "ดร.อรอุมา นาทสีทา",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ดร.อรอุมา นาทสีทา.jpg",
        "email": "onuma@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาการจัดการศึกษาและอาชีวศึกษา",
        "calendarName": "ดร.อรอุมา นาทสีทา"
      }
    ]
  },
  {
    "slug": "welding-technology",
    "title": "สาขาวิชาช่างเชื่อมโลหะ",
    "titleEn": "Welding & Metal Technology",
    "icon": "fa-solid fa-fire-burner",
    "searchKeywords": "สาขาวิชาช่างเชื่อมโลหะ ช่างเชื่อม เชื่อมโลหะ welding metal technology",
    "badge": "",
    "head": {
      "name": "สิบเอกตีเพชร ไชยศล",
      "position": "หัวหน้าหลักสูตร / อาจารย์ประจำสาขา",
      "img": "/img/สิบเอกตีเพชร ไชยศล.jpg",
      "email": "teepetch@npu.ac.th",
      "phone": "042-XXX-XXXX",
      "location": "สาขาวิชาช่างเชื่อมโลหะ (ดูพิกัด)",
      "calendarName": "สิบเอกตีเพชร ไชยศล"
    },
    "members": [
      {
        "name": "นายหาญณรงค์ บำรุงศิริ",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นายหาญณรงค์ บำรุงศิริ.jpg",
        "email": "harnnarong@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างเชื่อมโลหะ (ดูพิกัด)",
        "calendarName": "นายหาญณรงค์ บำรุงศิริ"
      },
      {
        "name": "นายชัยกร บางศิริ",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นายชัยกร บางศิริ.jpg",
        "email": "chaikorn@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างเชื่อมโลหะ (ดูพิกัด)",
        "calendarName": "นายชัยกร บางศิริ"
      },
      {
        "name": "ดร.ไชยา โฉมเฉลา",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ดร.ไชยา โฉมเฉลา.jpg",
        "email": "chaiya@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างเชื่อมโลหะ (ดูพิกัด)",
        "calendarName": "ดร.ไชยา โฉมเฉลา"
      }
    ],
    "allCards": [
      {
        "name": "สิบเอกตีเพชร ไชยศล",
        "position": "หัวหน้าหลักสูตร / อาจารย์ประจำสาขา",
        "img": "/img/สิบเอกตีเพชร ไชยศล.jpg",
        "email": "teepetch@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างเชื่อมโลหะ (ดูพิกัด)",
        "calendarName": "สิบเอกตีเพชร ไชยศล"
      },
      {
        "name": "นายหาญณรงค์ บำรุงศิริ",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นายหาญณรงค์ บำรุงศิริ.jpg",
        "email": "harnnarong@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างเชื่อมโลหะ (ดูพิกัด)",
        "calendarName": "นายหาญณรงค์ บำรุงศิริ"
      },
      {
        "name": "นายชัยกร บางศิริ",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นายชัยกร บางศิริ.jpg",
        "email": "chaikorn@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างเชื่อมโลหะ (ดูพิกัด)",
        "calendarName": "นายชัยกร บางศิริ"
      },
      {
        "name": "ดร.ไชยา โฉมเฉลา",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ดร.ไชยา โฉมเฉลา.jpg",
        "email": "chaiya@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาช่างเชื่อมโลหะ (ดูพิกัด)",
        "calendarName": "ดร.ไชยา โฉมเฉลา"
      }
    ]
  },
  {
    "slug": "basic-vocational",
    "title": "สาขาวิชาชีพพื้นฐาน",
    "titleEn": "Basic Vocational Subjects",
    "icon": "fa-solid fa-toolbox",
    "searchKeywords": "สาขาวิชาชีพพื้นฐาน วิชาชีพพื้นฐาน basic vocational subjects",
    "badge": "",
    "head": {
      "name": "ผู้ช่วยศาสตราจารย์สำเนียง ไข่มุกข์",
      "position": "หัวหน้าหลักสูตร / อาจารย์ประจำสาขาวิชา",
      "img": "/img/ผู้ช่วยศาสตราจารย์สำเนียง ไข่มุกข์.jpg",
      "email": "uraiwan@npu.ac.th",
      "phone": "042-000-000",
      "location": "สาขาวิชาพื้นฐาน (พิกัด)",
      "calendarName": "ผู้ช่วยศาสตราจารย์สำเนียง ไข่มุกข์"
    },
    "members": [
      {
        "name": "ว่าที่ ร้อยตรีรักษิต เสียงล้ำ",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ว่าที่ ร้อยตรีรักษิต เสียงล้ำ.jpg",
        "email": "raikit@npu.ac.th",
        "phone": "042-000-000",
        "location": "สาขาวิชาพื้นฐาน (พิกัด)",
        "calendarName": "ว่าที่ ร้อยตรีรักษิต เสียงล้ำ"
      },
      {
        "name": "นายกฤษฏพล คำลุน",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นายกฤษฏพล คำลุน.jpg",
        "email": "kritsatapol@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาชีพพื้นฐาน",
        "calendarName": "นายกฤษฏพล คำลุน"
      },
      {
        "name": "นายอนันตชิน คำสุภา",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นายอนันตชิน คำสุภา.jpg",
        "email": "anantachin@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาชีพพื้นฐาน",
        "calendarName": "นายอนันตชิน คำสุภา"
      }
    ],
    "allCards": [
      {
        "name": "ผู้ช่วยศาสตราจารย์สำเนียง ไข่มุกข์",
        "position": "หัวหน้าหลักสูตร / อาจารย์ประจำสาขาวิชา",
        "img": "/img/ผู้ช่วยศาสตราจารย์สำเนียง ไข่มุกข์.jpg",
        "email": "uraiwan@npu.ac.th",
        "phone": "042-000-000",
        "location": "สาขาวิชาพื้นฐาน (พิกัด)",
        "calendarName": "ผู้ช่วยศาสตราจารย์สำเนียง ไข่มุกข์"
      },
      {
        "name": "ว่าที่ ร้อยตรีรักษิต เสียงล้ำ",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ว่าที่ ร้อยตรีรักษิต เสียงล้ำ.jpg",
        "email": "raikit@npu.ac.th",
        "phone": "042-000-000",
        "location": "สาขาวิชาพื้นฐาน (พิกัด)",
        "calendarName": "ว่าที่ ร้อยตรีรักษิต เสียงล้ำ"
      },
      {
        "name": "นายกฤษฏพล คำลุน",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นายกฤษฏพล คำลุน.jpg",
        "email": "kritsatapol@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาชีพพื้นฐาน",
        "calendarName": "นายกฤษฏพล คำลุน"
      },
      {
        "name": "นายอนันตชิน คำสุภา",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นายอนันตชิน คำสุภา.jpg",
        "email": "anantachin@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาชีพพื้นฐาน",
        "calendarName": "นายอนันตชิน คำสุภา"
      }
    ]
  },
  {
    "slug": "construction-technology",
    "title": "สาขาวิชาการก่อสร้างและสถาปัตยกรรม",
    "titleEn": "Construction & Architecture Tech",
    "icon": "fa-solid fa-helmet-safety",
    "searchKeywords": "สาขาวิชาการก่อสร้างและสถาปัตยกรรม การก่อสร้าง ก่อสร้าง construction architecture tech",
    "badge": "",
    "head": {
      "name": "นายวีระพล นามวงค์",
      "position": "หัวหน้าหลักสูตร / อาจารย์ประจำสาขาวิชา",
      "img": "/img/วีระพล นามวงค์.jpg",
      "email": "weeraphon@npu.ac.th",
      "phone": "042-XXX-XXXX",
      "location": "สาขาวิชาการก่อสร้าง",
      "calendarName": "นายวีระพล นามวงค์"
    },
    "members": [
      {
        "name": "นายณธายุ ชวพัฒนโยธา",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ณธายุ ชวพัฒนโยธา.jpg",
        "email": "nathayu@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาการก่อสร้าง",
        "calendarName": "นายณธายุ ชวพัฒนโยธา"
      },
      {
        "name": "นายอัครพล วะชุม",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/อัครพล วะชุม.jpg",
        "email": "akarapol@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาการก่อสร้าง",
        "calendarName": "นายอัครพล วะชุม"
      },
      {
        "name": "นางสาวโชษิตา สุขคะนนท์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/โชษิตา สุขคะนนท์.jpg",
        "email": "chosita@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาการก่อสร้าง",
        "calendarName": "นางสาวโชษิตา สุขคะนนท์"
      }
    ],
    "allCards": [
      {
        "name": "นายวีระพล นามวงค์",
        "position": "หัวหน้าหลักสูตร / อาจารย์ประจำสาขาวิชา",
        "img": "/img/วีระพล นามวงค์.jpg",
        "email": "weeraphon@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาการก่อสร้าง",
        "calendarName": "นายวีระพล นามวงค์"
      },
      {
        "name": "นายณธายุ ชวพัฒนโยธา",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ณธายุ ชวพัฒนโยธา.jpg",
        "email": "nathayu@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาการก่อสร้าง",
        "calendarName": "นายณธายุ ชวพัฒนโยธา"
      },
      {
        "name": "นายอัครพล วะชุม",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/อัครพล วะชุม.jpg",
        "email": "akarapol@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาการก่อสร้าง",
        "calendarName": "นายอัครพล วะชุม"
      },
      {
        "name": "นางสาวโชษิตา สุขคะนนท์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/โชษิตา สุขคะนนท์.jpg",
        "email": "chosita@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาการก่อสร้าง",
        "calendarName": "นางสาวโชษิตา สุขคะนนท์"
      }
    ]
  },
  {
    "slug": "architecture",
    "title": "สาขาวิชาสถาปัตยกรรม",
    "titleEn": "Architecture",
    "icon": "fa-solid fa-building",
    "searchKeywords": "สาขาวิชาสถาปัตยกรรม สถาปัตย์ architecture",
    "badge": "",
    "head": {
      "name": "นายบรรจง ภูละคร",
      "position": "ประธานหลักสูตร / อาจารย์ประจำสาขาวิชา",
      "img": "/img/นายบรรจง ภูละคร.jpg",
      "email": "uraiwan@npu.ac.th",
      "phone": "042-000-000",
      "location": "สาขาวิชาสถาปัตยกรรม (พิกัด)",
      "calendarName": "นายบรรจง ภูละคร"
    },
    "members": [
      {
        "name": "นางสาววัชราภรณ์ เครือพันธ์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/วัชราภรณ์ เครือพันธ์.jpg",
        "email": "uraiwan@npu.ac.th",
        "phone": "042-000-000",
        "location": "สาขาวิชาสถาปัตยกรรม (พิกัด)",
        "calendarName": "นางสาววัชราภรณ์ เครือพันธ์"
      },
      {
        "name": "นางสาวพัฒณิฌาย์ พูนทองอินทร์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/พัฒณิฌาย์ พูนทองอินทร์.jpg",
        "email": "pattanit@npu.ac.th",
        "phone": "042-000-000",
        "location": "สาขาวิชาสถาปัตยกรรม (พิกัด)",
        "calendarName": "นางสาวพัฒณิฌาย์ พูนทองอินทร์"
      },
      {
        "name": "นายศิวัช มังคละคีรี",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ศิวัช มังคละคีรี.jpg",
        "email": "siwat@npu.ac.th",
        "phone": "042-000-000",
        "location": "สาขาวิชาสถาปัตยกรรม",
        "calendarName": "นายศิวัช มังคละคีรี"
      }
    ],
    "allCards": [
      {
        "name": "นายบรรจง ภูละคร",
        "position": "ประธานหลักสูตร / อาจารย์ประจำสาขาวิชา",
        "img": "/img/นายบรรจง ภูละคร.jpg",
        "email": "uraiwan@npu.ac.th",
        "phone": "042-000-000",
        "location": "สาขาวิชาสถาปัตยกรรม (พิกัด)",
        "calendarName": "นายบรรจง ภูละคร"
      },
      {
        "name": "นางสาววัชราภรณ์ เครือพันธ์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/วัชราภรณ์ เครือพันธ์.jpg",
        "email": "uraiwan@npu.ac.th",
        "phone": "042-000-000",
        "location": "สาขาวิชาสถาปัตยกรรม (พิกัด)",
        "calendarName": "นางสาววัชราภรณ์ เครือพันธ์"
      },
      {
        "name": "นางสาวพัฒณิฌาย์ พูนทองอินทร์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/พัฒณิฌาย์ พูนทองอินทร์.jpg",
        "email": "pattanit@npu.ac.th",
        "phone": "042-000-000",
        "location": "สาขาวิชาสถาปัตยกรรม (พิกัด)",
        "calendarName": "นางสาวพัฒณิฌาย์ พูนทองอินทร์"
      },
      {
        "name": "นายศิวัช มังคละคีรี",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ศิวัช มังคละคีรี.jpg",
        "email": "siwat@npu.ac.th",
        "phone": "042-000-000",
        "location": "สาขาวิชาสถาปัตยกรรม",
        "calendarName": "นายศิวัช มังคละคีรี"
      }
    ]
  },
  {
    "slug": "accounting",
    "title": "สาขาวิชาการบัญชี",
    "titleEn": "Accounting",
    "icon": "fa-solid fa-calculator",
    "searchKeywords": "สาขาวิชาการบัญชี บัญชี accounting",
    "badge": "",
    "head": {
      "name": "นางวันเพ็ญ อุไรวงศ์",
      "position": "หัวหน้าหลักสูตร / อาจารย์ประจำสาขาวิชา",
      "img": "/img/นางวันเพ็ญ อุไรวงศ์.jpg",
      "email": "wanphen@npu.ac.th",
      "phone": "042-XXX-XXXX",
      "location": "สาขาวิชาการบัญชี",
      "calendarName": "นางวันเพ็ญ อุไรวงศ์"
    },
    "members": [
      {
        "name": "ผศ.ปุณยนุช ภู่ระหงษ์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ผศ.ปุณยนุช ภู่ระหงษ์.jpg",
        "email": "poonyanuch@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาการบัญชี",
        "calendarName": "ผศ.ปุณยนุช ภู่ระหงษ์"
      },
      {
        "name": "น.ส.มงคลรัตน์ สุวรรณทรัพย์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/น.ส.มงคลรัตน์ สุวรรณทรัพย์.jpg",
        "email": "mongkonrat@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาการบัญชี",
        "calendarName": "น.ส.มงคลรัตน์ สุวรรณทรัพย์"
      },
      {
        "name": "น.ส.หัทยา ภูน้ำเย็น",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/น.ส.หัทยา ภูน้ำเย็น.jpg",
        "email": "hattaya@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาการบัญชี",
        "calendarName": "น.ส.หัทยา ภูน้ำเย็น"
      },
      {
        "name": "นายอาทิตย์ โสภา",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นายอาทิตย์ โสภา.jpg",
        "email": "arthit@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาการบัญชี",
        "calendarName": "นายอาทิตย์ โสภา"
      }
    ],
    "allCards": [
      {
        "name": "นางวันเพ็ญ อุไรวงศ์",
        "position": "หัวหน้าหลักสูตร / อาจารย์ประจำสาขาวิชา",
        "img": "/img/นางวันเพ็ญ อุไรวงศ์.jpg",
        "email": "wanphen@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาการบัญชี",
        "calendarName": "นางวันเพ็ญ อุไรวงศ์"
      },
      {
        "name": "ผศ.ปุณยนุช ภู่ระหงษ์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ผศ.ปุณยนุช ภู่ระหงษ์.jpg",
        "email": "poonyanuch@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาการบัญชี",
        "calendarName": "ผศ.ปุณยนุช ภู่ระหงษ์"
      },
      {
        "name": "น.ส.มงคลรัตน์ สุวรรณทรัพย์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/น.ส.มงคลรัตน์ สุวรรณทรัพย์.jpg",
        "email": "mongkonrat@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาการบัญชี",
        "calendarName": "น.ส.มงคลรัตน์ สุวรรณทรัพย์"
      },
      {
        "name": "น.ส.หัทยา ภูน้ำเย็น",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/น.ส.หัทยา ภูน้ำเย็น.jpg",
        "email": "hattaya@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาการบัญชี",
        "calendarName": "น.ส.หัทยา ภูน้ำเย็น"
      },
      {
        "name": "นายอาทิตย์ โสภา",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นายอาทิตย์ โสภา.jpg",
        "email": "arthit@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาการบัญชี",
        "calendarName": "นายอาทิตย์ โสภา"
      }
    ]
  },
  {
    "slug": "digital-office",
    "title": "สาขาวิชาการจัดการสำนักงานดิจิทัล",
    "titleEn": "Digital Office Management",
    "icon": "fa-solid fa-file-invoice",
    "searchKeywords": "สาขาวิชาการจัดการสำนักงานดิจิทัล สาขาการจัดการสำนักงานด้วยดิจิทัล การจัดการ สำนักงาน ดิจิทัล digital office management",
    "badge": "",
    "head": {
      "name": "นางสาวศิริณ เข็มปัญญา",
      "position": "หัวหน้าหลักสูตร / อาจารย์ประจำสาขาวิชา",
      "img": "/img/ศิริณ เข็มปัญญา.jpg",
      "email": "sirin@npu.ac.th",
      "phone": "042-XXX-XXXX",
      "location": "สาขาการจัดการสำนักงานด้วยดิจิทัล",
      "calendarName": "นางสาวศิริณ เข็มปัญญา"
    },
    "members": [
      {
        "name": "นางสาวประคองศิลป์ เลิศพีรพงศกุล",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ประคองศิลป์ เลิศพีรพงศกุล.jpg",
        "email": "prakongsilp@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาการจัดการสำนักงานด้วยดิจิทัล",
        "calendarName": "นางสาวประคองศิลป์ เลิศพีรพงศกุล"
      },
      {
        "name": "นางสาวประจิตรา หม่อมพะเนาว์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ประจิตรา หม่อมพะเนาว์.jpg",
        "email": "prajitra@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาการจัดการสำนักงานด้วยดิจิทัล",
        "calendarName": "นางสาวประจิตรา หม่อมพะเนาว์"
      }
    ],
    "allCards": [
      {
        "name": "นางสาวศิริณ เข็มปัญญา",
        "position": "หัวหน้าหลักสูตร / อาจารย์ประจำสาขาวิชา",
        "img": "/img/ศิริณ เข็มปัญญา.jpg",
        "email": "sirin@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาการจัดการสำนักงานด้วยดิจิทัล",
        "calendarName": "นางสาวศิริณ เข็มปัญญา"
      },
      {
        "name": "นางสาวประคองศิลป์ เลิศพีรพงศกุล",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ประคองศิลป์ เลิศพีรพงศกุล.jpg",
        "email": "prakongsilp@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาการจัดการสำนักงานด้วยดิจิทัล",
        "calendarName": "นางสาวประคองศิลป์ เลิศพีรพงศกุล"
      },
      {
        "name": "นางสาวประจิตรา หม่อมพะเนาว์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ประจิตรา หม่อมพะเนาว์.jpg",
        "email": "prajitra@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาการจัดการสำนักงานด้วยดิจิทัล",
        "calendarName": "นางสาวประจิตรา หม่อมพะเนาว์"
      }
    ]
  },
  {
    "slug": "marketing",
    "title": "สาขาวิชาการตลาด",
    "titleEn": "Marketing",
    "icon": "fa-solid fa-bullhorn",
    "searchKeywords": "สาขาวิชาการตลาด การตลาด marketing",
    "badge": "",
    "head": {
      "name": "นางภัทรอร ดวงมาลัย",
      "position": "อาจารย์ประจำสาขาวิชา",
      "img": "/img/นางภัทรอร ดวงมาลัย.jpg",
      "email": "pattaraon@npu.ac.th",
      "phone": "042-XXX-XXXX",
      "location": "สาขาวิชาการตลาด",
      "calendarName": "นางภัทรอร ดวงมาลัย"
    },
    "members": [
      {
        "name": "นางสาวชุติภา คำพันธ์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นางสาวชุติภา คำพันธ์.jpg",
        "email": "chutipa@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาการตลาด",
        "calendarName": "นางสาวชุติภา คำพันธ์"
      },
      {
        "name": "นางสาวชุติมา บุญจงรักษ์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นางสาวชุติมา บุญจงรักษ์.jpg",
        "email": "chutima@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาการตลาด",
        "calendarName": "นางสาวชุติมา บุญจงรักษ์"
      }
    ],
    "allCards": [
      {
        "name": "นางภัทรอร ดวงมาลัย",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นางภัทรอร ดวงมาลัย.jpg",
        "email": "pattaraon@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาการตลาด",
        "calendarName": "นางภัทรอร ดวงมาลัย"
      },
      {
        "name": "นางสาวชุติภา คำพันธ์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นางสาวชุติภา คำพันธ์.jpg",
        "email": "chutipa@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาการตลาด",
        "calendarName": "นางสาวชุติภา คำพันธ์"
      },
      {
        "name": "นางสาวชุติมา บุญจงรักษ์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นางสาวชุติมา บุญจงรักษ์.jpg",
        "email": "chutima@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาการตลาด",
        "calendarName": "นางสาวชุติมา บุญจงรักษ์"
      }
    ]
  },
  {
    "slug": "digital-business",
    "title": "สาขาวิชาเทคโนโลยีธุรกิจดิจิทัล",
    "titleEn": "Digital Business Technology",
    "icon": "fa-solid fa-laptop-code",
    "searchKeywords": "สาขาวิชาเทคโนโลยีธุรกิจดิจิทัล ธุรกิจดิจิทัล digital business technology",
    "badge": "",
    "head": {
      "name": "นางสาววราภรณ์ อุ้มอังวะ",
      "position": "หัวหน้าหลักสูตร / อาจารย์ประจำสาขาวิชา",
      "img": "/img/วราภรณ์ อุ้มอังวะ.jpg",
      "email": "waraporn@npu.ac.th",
      "phone": "042-XXX-XXXX",
      "location": "สาขาเทคโนโลยีธุรกิจดิจิทัล",
      "calendarName": "นางสาววราภรณ์ อุ้มอังวะ"
    },
    "members": [
      {
        "name": "นางอรุณี บุญสว่าง",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/อรุณี บุญสว่าง.jpg",
        "email": "arunee@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาเทคโนโลยีธุรกิจดิจิทัล",
        "calendarName": "นางอรุณี บุญสว่าง"
      },
      {
        "name": "นางจันทร์เพ็ญ ไตรมงคลเจริญ",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/จันทร์เพ็ญ ไตรมงคลเจริญ.jpg",
        "email": "janpen@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาเทคโนโลยีธุรกิจดิจิทัล",
        "calendarName": "นางจันทร์เพ็ญ ไตรมงคลเจริญ"
      },
      {
        "name": "นายญาณภัทร ซองทอง",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ญาณภัทร ซองทอง.jpg",
        "email": "yanapat@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาเทคโนโลยีธุรกิจดิจิทัล",
        "calendarName": "นายญาณภัทร ซองทอง"
      },
      {
        "name": "นางสาวภัทร์พิชา พานทอง",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ภัทร์พิชา พานทอง.jpg",
        "email": "patpicha@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาเทคโนโลยีธุรกิจดิจิทัล",
        "calendarName": "นางสาวภัทร์พิชา พานทอง"
      }
    ],
    "allCards": [
      {
        "name": "นางสาววราภรณ์ อุ้มอังวะ",
        "position": "หัวหน้าหลักสูตร / อาจารย์ประจำสาขาวิชา",
        "img": "/img/วราภรณ์ อุ้มอังวะ.jpg",
        "email": "waraporn@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาเทคโนโลยีธุรกิจดิจิทัล",
        "calendarName": "นางสาววราภรณ์ อุ้มอังวะ"
      },
      {
        "name": "นางอรุณี บุญสว่าง",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/อรุณี บุญสว่าง.jpg",
        "email": "arunee@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาเทคโนโลยีธุรกิจดิจิทัล",
        "calendarName": "นางอรุณี บุญสว่าง"
      },
      {
        "name": "นางจันทร์เพ็ญ ไตรมงคลเจริญ",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/จันทร์เพ็ญ ไตรมงคลเจริญ.jpg",
        "email": "janpen@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาเทคโนโลยีธุรกิจดิจิทัล",
        "calendarName": "นางจันทร์เพ็ญ ไตรมงคลเจริญ"
      },
      {
        "name": "นายญาณภัทร ซองทอง",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ญาณภัทร ซองทอง.jpg",
        "email": "yanapat@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาเทคโนโลยีธุรกิจดิจิทัล",
        "calendarName": "นายญาณภัทร ซองทอง"
      },
      {
        "name": "นางสาวภัทร์พิชา พานทอง",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ภัทร์พิชา พานทอง.jpg",
        "email": "patpicha@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาเทคโนโลยีธุรกิจดิจิทัล",
        "calendarName": "นางสาวภัทร์พิชา พานทอง"
      }
    ]
  },
  {
    "slug": "hotel-management",
    "title": "สาขาวิชาการโรงแรม",
    "titleEn": "Hotel Management",
    "icon": "fa-solid fa-hotel",
    "searchKeywords": "สาขาวิชาการโรงแรม การโรงแรม ท่องเที่ยว การท่องเที่ยว การจัดการ hotel management tourism",
    "badge": "",
    "head": {
      "name": "นางสาวธารารัตน์ มหาพันธ์",
      "position": "อาจารย์ประจำสาขาวิชา",
      "img": "/img/นางสาวธารารัตน์ มหาพันธ์.jpg",
      "email": "thararat@npu.ac.th",
      "phone": "042-XXX-XXXX",
      "location": "สาขาวิชาการโรงแรม",
      "calendarName": "นางสาวธารารัตน์ มหาพันธ์"
    },
    "members": [
      {
        "name": "นางสาวกีรติกา บุษมงคล",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นางสาวกีรติกา บุษมงคล.jpg",
        "email": "keeratika@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาการโรงแรม",
        "calendarName": "นางสาวกีรติกา บุษมงคล"
      },
      {
        "name": "นางนิรมล สัมมัตตะ",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นิรมล.jpg",
        "email": "niramol@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาการโรงแรม",
        "calendarName": "นางนิรมล สัมมัตตะ"
      }
    ],
    "allCards": [
      {
        "name": "นางสาวธารารัตน์ มหาพันธ์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นางสาวธารารัตน์ มหาพันธ์.jpg",
        "email": "thararat@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาการโรงแรม",
        "calendarName": "นางสาวธารารัตน์ มหาพันธ์"
      },
      {
        "name": "นางสาวกีรติกา บุษมงคล",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นางสาวกีรติกา บุษมงคล.jpg",
        "email": "keeratika@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาการโรงแรม",
        "calendarName": "นางสาวกีรติกา บุษมงคล"
      },
      {
        "name": "นางนิรมล สัมมัตตะ",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/นิรมล.jpg",
        "email": "niramol@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สาขาวิชาการโรงแรม",
        "calendarName": "นางนิรมล สัมมัตตะ"
      }
    ]
  },
  {
    "slug": "applied-fundamentals",
    "title": "สาขาวิชาพื้นฐานประยุกต์",
    "titleEn": "Applied Fundamental Sciences",
    "icon": "fa-solid fa-book-bookmark",
    "searchKeywords": "สาขาวิชาพื้นฐานประยุกต์ พื้นฐานประยุกต์ วิทยาศาสตร์ applied fundamental sciences",
    "badge": "",
    "head": {
      "name": "ผศ.ดร.ธนภร วัฒนนวลสกุล",
      "position": "หัวหน้าหลักสูตร / อาจารย์ประจำสาขาวิชา",
      "img": "/img/ผศ.ดร.ธนภร วัฒนนวลสกุล.jpg",
      "email": "uraiwan@npu.ac.th",
      "phone": "042-000-000",
      "location": "สาขาวิชาพื้นฐานประยุกต์ (พิกัด)",
      "calendarName": "ผศ.ดร.ธนภร วัฒนนวลสกุล"
    },
    "members": [
      {
        "name": "นางปราณี ยตะโคตร",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ปราณี ยตะโคตร.jpg",
        "email": "uraiwan@npu.ac.th",
        "phone": "042-000-000",
        "location": "สาขาวิชาพื้นฐานประยุกต์ (พิกัด)",
        "calendarName": "นางปราณี ยตะโคตร"
      },
      {
        "name": "นายสมศักดิ์ ไชยมาโย",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/สมศักดิ์ ไชยมาโย.jpg",
        "email": "uraiwan@npu.ac.th",
        "phone": "042-000-000",
        "location": "สาขาวิชาพื้นฐานประยุกต์ (พิกัด)",
        "calendarName": "นายสมศักดิ์ ไชยมาโย"
      },
      {
        "name": "ดร.สุทธิรักษ์ ไพโรจน์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/สุทธิรักษ์ ไพโรจน์.jpg",
        "email": "uraiwan@npu.ac.th",
        "phone": "042-000-000",
        "location": "สาขาวิชาพื้นฐานประยุกต์ (พิกัด)",
        "calendarName": "ดร.สุทธิรักษ์ ไพโรจน์"
      },
      {
        "name": "ดร.เจนจิรา ตรั่นถิ",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/เจนจิรา ตรั่นถิ.jpg",
        "email": "uraiwan@npu.ac.th",
        "phone": "042-000-000",
        "location": "สาขาวิชาพื้นฐานประยุกต์ (พิกัด)",
        "calendarName": "ดร.เจนจิรา ตรั่นถิ"
      },
      {
        "name": "นางสาวพรพิรุณ แม้นประเสริฐ",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/พรพิรุณ แม้นประเสริฐ.jpg",
        "email": "uraiwan@npu.ac.th",
        "phone": "042-000-000",
        "location": "สาขาวิชาพื้นฐานประยุกต์ (พิกัด)",
        "calendarName": "นางสาวพรพิรุณ แม้นประเสริฐ"
      },
      {
        "name": "นายพูลสวัสดิ์ โคตพรหม",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/พูลสวัสดิ์ โคตพรหม.jpg",
        "email": "uraiwan@npu.ac.th",
        "phone": "042-000-000",
        "location": "สาขาวิชาพื้นฐานประยุกต์ (พิกัด)",
        "calendarName": "นายพูลสวัสดิ์ โคตพรหม"
      },
      {
        "name": "นางสาวอุไรวรรณ คำพิลา",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/อุไรวรรณ คำพิลา.jpg",
        "email": "uraiwan@npu.ac.th",
        "phone": "042-000-000",
        "location": "สาขาวิชาพื้นฐานประยุกต์ (พิกัด)",
        "calendarName": "นางสาวอุไรวรรณ คำพิลา"
      },
      {
        "name": "นายศุภกร อุปฮาต",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ศุภกร อุปฮาต.jpg",
        "email": "yodprem@npu.ac.th",
        "phone": "042-XXX-XXXX ต่อ 105",
        "location": "สำนักงานคณบดี",
        "calendarName": "นายศุภกร อุปฮาต"
      },
      {
        "name": "นายศรพิทักษ์ นาคสี",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ศรพิทักษ์ นาคสี.jpg",
        "email": "sarapit@npu.ac.th",
        "phone": "042-XXX-XXXX ต่อ 105",
        "location": "สำนักงานคณบดี",
        "calendarName": "นายศรพิทักษ์ นาคสี"
      }
    ],
    "allCards": [
      {
        "name": "ผศ.ดร.ธนภร วัฒนนวลสกุล",
        "position": "หัวหน้าหลักสูตร / อาจารย์ประจำสาขาวิชา",
        "img": "/img/ผศ.ดร.ธนภร วัฒนนวลสกุล.jpg",
        "email": "uraiwan@npu.ac.th",
        "phone": "042-000-000",
        "location": "สาขาวิชาพื้นฐานประยุกต์ (พิกัด)",
        "calendarName": "ผศ.ดร.ธนภร วัฒนนวลสกุล"
      },
      {
        "name": "นางปราณี ยตะโคตร",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ปราณี ยตะโคตร.jpg",
        "email": "uraiwan@npu.ac.th",
        "phone": "042-000-000",
        "location": "สาขาวิชาพื้นฐานประยุกต์ (พิกัด)",
        "calendarName": "นางปราณี ยตะโคตร"
      },
      {
        "name": "นายสมศักดิ์ ไชยมาโย",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/สมศักดิ์ ไชยมาโย.jpg",
        "email": "uraiwan@npu.ac.th",
        "phone": "042-000-000",
        "location": "สาขาวิชาพื้นฐานประยุกต์ (พิกัด)",
        "calendarName": "นายสมศักดิ์ ไชยมาโย"
      },
      {
        "name": "ดร.สุทธิรักษ์ ไพโรจน์",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/สุทธิรักษ์ ไพโรจน์.jpg",
        "email": "uraiwan@npu.ac.th",
        "phone": "042-000-000",
        "location": "สาขาวิชาพื้นฐานประยุกต์ (พิกัด)",
        "calendarName": "ดร.สุทธิรักษ์ ไพโรจน์"
      },
      {
        "name": "ดร.เจนจิรา ตรั่นถิ",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/เจนจิรา ตรั่นถิ.jpg",
        "email": "uraiwan@npu.ac.th",
        "phone": "042-000-000",
        "location": "สาขาวิชาพื้นฐานประยุกต์ (พิกัด)",
        "calendarName": "ดร.เจนจิรา ตรั่นถิ"
      },
      {
        "name": "นางสาวพรพิรุณ แม้นประเสริฐ",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/พรพิรุณ แม้นประเสริฐ.jpg",
        "email": "uraiwan@npu.ac.th",
        "phone": "042-000-000",
        "location": "สาขาวิชาพื้นฐานประยุกต์ (พิกัด)",
        "calendarName": "นางสาวพรพิรุณ แม้นประเสริฐ"
      },
      {
        "name": "นายพูลสวัสดิ์ โคตพรหม",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/พูลสวัสดิ์ โคตพรหม.jpg",
        "email": "uraiwan@npu.ac.th",
        "phone": "042-000-000",
        "location": "สาขาวิชาพื้นฐานประยุกต์ (พิกัด)",
        "calendarName": "นายพูลสวัสดิ์ โคตพรหม"
      },
      {
        "name": "นางสาวอุไรวรรณ คำพิลา",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/อุไรวรรณ คำพิลา.jpg",
        "email": "uraiwan@npu.ac.th",
        "phone": "042-000-000",
        "location": "สาขาวิชาพื้นฐานประยุกต์ (พิกัด)",
        "calendarName": "นางสาวอุไรวรรณ คำพิลา"
      },
      {
        "name": "นายศุภกร อุปฮาต",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ศุภกร อุปฮาต.jpg",
        "email": "yodprem@npu.ac.th",
        "phone": "042-XXX-XXXX ต่อ 105",
        "location": "สำนักงานคณบดี",
        "calendarName": "นายศุภกร อุปฮาต"
      },
      {
        "name": "นายศรพิทักษ์ นาคสี",
        "position": "อาจารย์ประจำสาขาวิชา",
        "img": "/img/ศรพิทักษ์ นาคสี.jpg",
        "email": "sarapit@npu.ac.th",
        "phone": "042-XXX-XXXX ต่อ 105",
        "location": "สำนักงานคณบดี",
        "calendarName": "นายศรพิทักษ์ นาคสี"
      }
    ]
  }
];

export function getDepartmentBySlug(slug: string): Department | undefined {
  return DEPARTMENTS_DATA.find((d) => d.slug === slug);
}
