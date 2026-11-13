import { Personnel } from './departments';

export interface StaffDivision {
  slug: string;
  title: string;
  description: string;
  icon: string;
  badge: string;
  head: Personnel | null;
  members: Personnel[];
  allCards: Personnel[];
}

export const STAFF_DIVISIONS_DATA: StaffDivision[] = [
  {
    "slug": "dept-admin",
    "title": "ฝ่ายบริหารทั่วไป",
    "description": "กำกับดูแลงานสารบรรณ งานสารสนเทศ ประชาสัมพันธ์ และงานบริหารงานทั่วไปของคณะ",
    "icon": "fa-solid fa-briefcase",
    "badge": "General Administration",
    "head": {
      "name": "ผศ.วีรธรรม ไชยยงค์",
      "position": "รองคณบดีคณะเทคโนโลยีอุตสาหกรรม",
      "img": "/img/รอง1.png",
      "email": "boonlert@npu.ac.th",
      "phone": "042-XXX-XXXX ต่อ 101",
      "location": "สำนักงานคณบดี",
      "calendarName": "ผศ.วีรธรรม ไชยยงค์"
    },
    "members": [
      {
        "name": "นายสุวัฒน์ วงค์ตาผา",
        "position": "เจ้าหน้าที่บริหารงานทั่วไป",
        "img": "/img/นายสุวัฒน์ วงค์ตาผา.jpg",
        "email": "suwat@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สำนักงานคณบดี",
        "calendarName": "นายสุวัฒน์ วงค์ตาผา"
      },
      {
        "name": "นางสุนันทา เอ๊ฟวา",
        "position": "บุคลากร",
        "img": "/img/สุนันทา เอ๊ฟวา.jpg",
        "email": "sunanta@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นางสุนันทา เอ๊ฟวา"
      },
      {
        "name": "นางสาววนิดา ไชยวรรณ",
        "position": "บุคลากร",
        "img": "/img/วนิดา ไชยวรรณ.jpg",
        "email": "wanida@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นางสาววนิดา ไชยวรรณ"
      },
      {
        "name": "นางสาวจันจิรา สีกาลัง",
        "position": "บุคลากร",
        "img": "/img/จันจิรา สีกาลัง.jpg",
        "email": "janjira@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นางสาวจันจิรา สีกาลัง"
      },
      {
        "name": "นางสาวเจณิสตา ตรีภัทรพัฒน์",
        "position": "บุคลากร",
        "img": "/img/เจณิสตา ตรีภัทรพัฒน์.jpg",
        "email": "janista@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นางสาวเจณิสตา ตรีภัทรพัฒน์"
      },
      {
        "name": "นางสาวคชาภรณ์ เหมือนสีเลา",
        "position": "บุคลากร",
        "img": "/img/คชาภรณ์ เหมือนสีเลา.jpg",
        "email": "kachaporn@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นางสาวคชาภรณ์ เหมือนสีเลา"
      },
      {
        "name": "นางสาวถนอมวรรณ ศรีวงษา",
        "position": "บุคลากร",
        "img": "/img/ถนอมวรรณ ศรีวงษา.jpg",
        "email": "thanomwan@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นางสาวถนอมวรรณ ศรีวงษา"
      },
      {
        "name": "นางสาวศิรินภา ไชยกว้าง",
        "position": "บุคลากร",
        "img": "/img/ศิรินภา ไชยกว้าง.jpg",
        "email": "sirinapa@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นางสาวศิรินภา ไชยกว้าง"
      },
      {
        "name": "นางสาวกวิสรา ศรีนาค",
        "position": "บุคลากร",
        "img": "/img/กวิสรา ศรีนาค.jpg",
        "email": "kawisara@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นางสาวกวิสรา ศรีนาค"
      },
      {
        "name": "นางสาวอรุณรัตน์ อันเตวาสิก",
        "position": "บุคลากร",
        "img": "/img/อรุณรัตน์ อันเตวาสิก.jpg",
        "email": "arunrat@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นางสาวอรุณรัตน์ อันเตวาสิก"
      },
      {
        "name": "นายวิชัย ล้านเอ๊ะ",
        "position": "บุคลากร",
        "img": "/img/วิชัย ล้านเอ๊ะ.jpg",
        "email": "wichai@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นายวิชัย ล้านเอ๊ะ"
      },
      {
        "name": "นายมธุกร ภาษา",
        "position": "บุคลากร",
        "img": "/img/มธุกร ภาษา.jpg",
        "email": "mathukorn@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นายมธุกร ภาษา"
      },
      {
        "name": "นายเสมา พันเทศ",
        "position": "บุคลากร",
        "img": "/img/เสมา พันเทศ.jpg",
        "email": "sema@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นายเสมา พันเทศ"
      },
      {
        "name": "นายอดิศักดิ์ ขันหอม",
        "position": "บุคลากร",
        "img": "/img/อดิศักดิ์ ขันหอม.jpg",
        "email": "adisak@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นายอดิศักดิ์ ขันหอม"
      },
      {
        "name": "นายสวาด ไม่แพง",
        "position": "บุคลากร",
        "img": "/img/สวาด ไม่แพง.jpg",
        "email": "sawad@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นายสวาด ไม่แพง"
      },
      {
        "name": "นางวิลัยพร แก่นจันทร์",
        "position": "บุคลากร",
        "img": "/img/วิลัยพร แก่นจันทร์.jpg",
        "email": "wilaiporn@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นางวิลัยพร แก่นจันทร์"
      },
      {
        "name": "นางศิริรัตน์ คำเพชรดี",
        "position": "บุคลากร",
        "img": "/img/ศิริรัตน์ คำเพชรดี.jpg",
        "email": "sirirat@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นางศิริรัตน์ คำเพชรดี"
      },
      {
        "name": "นางสาวบุญมี ขุนษานนท์",
        "position": "บุคลากร",
        "img": "/img/บุญมี ขุนษานนท์.jpg",
        "email": "boonmee@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นางสาวบุญมี ขุนษานนท์"
      },
      {
        "name": "นายประเสริฐ ปัญญะ",
        "position": "บุคลากร",
        "img": "/img/ประเสริฐ ปัญญะ.jpg",
        "email": "prasert@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นายประเสริฐ ปัญญะ"
      },
      {
        "name": "นายประศาด ศรีวรรณ์",
        "position": "บุคลากร",
        "img": "/img/ประศาด ศรีวรรณ์.jpg",
        "email": "prasad@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นายประศาด ศรีวรรณ์"
      },
      {
        "name": "นายรัชพงศ์ สุนโท",
        "position": "บุคลากร",
        "img": "/img/รัชพงศ์ สุนโท.jpg",
        "email": "ratchapong@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นายรัชพงศ์ สุนโท"
      }
    ],
    "allCards": [
      {
        "name": "ผศ.วีรธรรม ไชยยงค์",
        "position": "รองคณบดีคณะเทคโนโลยีอุตสาหกรรม",
        "img": "/img/รอง1.png",
        "email": "boonlert@npu.ac.th",
        "phone": "042-XXX-XXXX ต่อ 101",
        "location": "สำนักงานคณบดี",
        "calendarName": "ผศ.วีรธรรม ไชยยงค์"
      },
      {
        "name": "นายสุวัฒน์ วงค์ตาผา",
        "position": "เจ้าหน้าที่บริหารงานทั่วไป",
        "img": "/img/นายสุวัฒน์ วงค์ตาผา.jpg",
        "email": "suwat@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "สำนักงานคณบดี",
        "calendarName": "นายสุวัฒน์ วงค์ตาผา"
      },
      {
        "name": "นางสุนันทา เอ๊ฟวา",
        "position": "บุคลากร",
        "img": "/img/สุนันทา เอ๊ฟวา.jpg",
        "email": "sunanta@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นางสุนันทา เอ๊ฟวา"
      },
      {
        "name": "นางสาววนิดา ไชยวรรณ",
        "position": "บุคลากร",
        "img": "/img/วนิดา ไชยวรรณ.jpg",
        "email": "wanida@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นางสาววนิดา ไชยวรรณ"
      },
      {
        "name": "นางสาวจันจิรา สีกาลัง",
        "position": "บุคลากร",
        "img": "/img/จันจิรา สีกาลัง.jpg",
        "email": "janjira@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นางสาวจันจิรา สีกาลัง"
      },
      {
        "name": "นางสาวเจณิสตา ตรีภัทรพัฒน์",
        "position": "บุคลากร",
        "img": "/img/เจณิสตา ตรีภัทรพัฒน์.jpg",
        "email": "janista@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นางสาวเจณิสตา ตรีภัทรพัฒน์"
      },
      {
        "name": "นางสาวคชาภรณ์ เหมือนสีเลา",
        "position": "บุคลากร",
        "img": "/img/คชาภรณ์ เหมือนสีเลา.jpg",
        "email": "kachaporn@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นางสาวคชาภรณ์ เหมือนสีเลา"
      },
      {
        "name": "นางสาวถนอมวรรณ ศรีวงษา",
        "position": "บุคลากร",
        "img": "/img/ถนอมวรรณ ศรีวงษา.jpg",
        "email": "thanomwan@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นางสาวถนอมวรรณ ศรีวงษา"
      },
      {
        "name": "นางสาวศิรินภา ไชยกว้าง",
        "position": "บุคลากร",
        "img": "/img/ศิรินภา ไชยกว้าง.jpg",
        "email": "sirinapa@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นางสาวศิรินภา ไชยกว้าง"
      },
      {
        "name": "นางสาวกวิสรา ศรีนาค",
        "position": "บุคลากร",
        "img": "/img/กวิสรา ศรีนาค.jpg",
        "email": "kawisara@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นางสาวกวิสรา ศรีนาค"
      },
      {
        "name": "นางสาวอรุณรัตน์ อันเตวาสิก",
        "position": "บุคลากร",
        "img": "/img/อรุณรัตน์ อันเตวาสิก.jpg",
        "email": "arunrat@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นางสาวอรุณรัตน์ อันเตวาสิก"
      },
      {
        "name": "นายวิชัย ล้านเอ๊ะ",
        "position": "บุคลากร",
        "img": "/img/วิชัย ล้านเอ๊ะ.jpg",
        "email": "wichai@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นายวิชัย ล้านเอ๊ะ"
      },
      {
        "name": "นายมธุกร ภาษา",
        "position": "บุคลากร",
        "img": "/img/มธุกร ภาษา.jpg",
        "email": "mathukorn@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นายมธุกร ภาษา"
      },
      {
        "name": "นายเสมา พันเทศ",
        "position": "บุคลากร",
        "img": "/img/เสมา พันเทศ.jpg",
        "email": "sema@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นายเสมา พันเทศ"
      },
      {
        "name": "นายอดิศักดิ์ ขันหอม",
        "position": "บุคลากร",
        "img": "/img/อดิศักดิ์ ขันหอม.jpg",
        "email": "adisak@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นายอดิศักดิ์ ขันหอม"
      },
      {
        "name": "นายสวาด ไม่แพง",
        "position": "บุคลากร",
        "img": "/img/สวาด ไม่แพง.jpg",
        "email": "sawad@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นายสวาด ไม่แพง"
      },
      {
        "name": "นางวิลัยพร แก่นจันทร์",
        "position": "บุคลากร",
        "img": "/img/วิลัยพร แก่นจันทร์.jpg",
        "email": "wilaiporn@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นางวิลัยพร แก่นจันทร์"
      },
      {
        "name": "นางศิริรัตน์ คำเพชรดี",
        "position": "บุคลากร",
        "img": "/img/ศิริรัตน์ คำเพชรดี.jpg",
        "email": "sirirat@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นางศิริรัตน์ คำเพชรดี"
      },
      {
        "name": "นางสาวบุญมี ขุนษานนท์",
        "position": "บุคลากร",
        "img": "/img/บุญมี ขุนษานนท์.jpg",
        "email": "boonmee@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นางสาวบุญมี ขุนษานนท์"
      },
      {
        "name": "นายประเสริฐ ปัญญะ",
        "position": "บุคลากร",
        "img": "/img/ประเสริฐ ปัญญะ.jpg",
        "email": "prasert@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นายประเสริฐ ปัญญะ"
      },
      {
        "name": "นายประศาด ศรีวรรณ์",
        "position": "บุคลากร",
        "img": "/img/ประศาด ศรีวรรณ์.jpg",
        "email": "prasad@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นายประศาด ศรีวรรณ์"
      },
      {
        "name": "นายรัชพงศ์ สุนโท",
        "position": "บุคลากร",
        "img": "/img/รัชพงศ์ สุนโท.jpg",
        "email": "ratchapong@npu.ac.th",
        "phone": "042-711-000",
        "location": "สำนักงานคณบดี",
        "calendarName": "นายรัชพงศ์ สุนโท"
      }
    ]
  },
  {
    "slug": "dept-academic",
    "title": "ฝ่ายวิชาการ",
    "description": "ดูแลการเรียนการสอน งานหลักสูตร ทะเบียนนักศึกษา และสนับสนุนกิจการนักศึกษา",
    "icon": "fa-solid fa-graduation-cap",
    "badge": "Academic Affairs",
    "head": {
      "name": "ผศ.บุญเยี่ยม ยศเรืองศักดิ์",
      "position": "หัวหน้าฝ่ายวิชาการ",
      "img": "/img/รอง2.png",
      "email": "boonyiem@npu.ac.th",
      "phone": "042-XXX-XXXX",
      "location": "ฝ่ายวิชาการ",
      "calendarName": "ผู้ช่วยศาสตราจารย์บุญเยี่ยม ยศเรืองศักดิ์"
    },
    "members": [
      {
        "name": "นางสาวกชกร ศิลาศรี",
        "position": "เจ้าหน้าที่ฝ่ายวิชาการ",
        "img": "/img/กชกร ศิลาศรี.jpg",
        "email": "kodchakorn@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "ฝ่ายวิชาการ",
        "calendarName": "นางสาวกชกร ศิลาศรี"
      },
      {
        "name": "ว่าที่ ร.ต.หญิงเนตรนภา แสงเชื้อพ่อ",
        "position": "เจ้าหน้าที่ฝ่ายวิชาการ",
        "img": "/img/เนตรนภา แสงเชื้อพ่อ.jpg",
        "email": "netnapa@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "ฝ่ายวิชาการ",
        "calendarName": "ว่าที่ ร.ต.หญิงเนตรนภา แสงเชื้อพ่อ"
      },
      {
        "name": "นางพัชรีภรณ์ ไชยยงค์",
        "position": "เจ้าหน้าที่ฝ่ายวิชาการ",
        "img": "/img/พัชรีภรณ์ ไชยยงค์.jpg",
        "email": "patchareeporn@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "ฝ่ายวิชาการ",
        "calendarName": "นางพัชรีภรณ์ ไชยยงค์"
      },
      {
        "name": "นางสาวกาญดา สุริรมย์",
        "position": "เจ้าหน้าที่ฝ่ายวิชาการ",
        "img": "/img/กาญดา สุริรมย์.jpg",
        "email": "kanda@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "ฝ่ายวิชาการ",
        "calendarName": "นางสาวกาญดา สุริรมย์"
      },
      {
        "name": "นายสุรศักดิ์ เข็มปัญญา",
        "position": "เจ้าหน้าที่ฝ่ายวิชาการ",
        "img": "/img/สุรศักดิ์ เข็มปัญญา.jpg",
        "email": "surasak@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "ฝ่ายวิชาการ",
        "calendarName": "นายสุรศักดิ์ เข็มปัญญา"
      },
      {
        "name": "นางสาวคณิตา จันทร์ศรีเมือง",
        "position": "เจ้าหน้าที่ฝ่ายวิชาการ",
        "img": "/img/คณิตา จันทร์ศรีเมือง.jpg",
        "email": "kanita@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "ฝ่ายวิชาการ",
        "calendarName": "นางสาวคณิตา จันทร์ศรีเมือง"
      },
      {
        "name": "นายพีรวิชญ์ ปารีพันธ์",
        "position": "เจ้าหน้าที่ฝ่ายวิชาการ",
        "img": "/img/พีรวิชญ์ ปารีพันธ์.jpg",
        "email": "peerawich@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "ฝ่ายวิชาการ",
        "calendarName": "นายพีรวิชญ์ ปารีพันธ์"
      }
    ],
    "allCards": [
      {
        "name": "ผศ.บุญเยี่ยม ยศเรืองศักดิ์",
        "position": "หัวหน้าฝ่ายวิชาการ",
        "img": "/img/รอง2.png",
        "email": "boonyiem@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "ฝ่ายวิชาการ",
        "calendarName": "ผู้ช่วยศาสตราจารย์บุญเยี่ยม ยศเรืองศักดิ์"
      },
      {
        "name": "นางสาวกชกร ศิลาศรี",
        "position": "เจ้าหน้าที่ฝ่ายวิชาการ",
        "img": "/img/กชกร ศิลาศรี.jpg",
        "email": "kodchakorn@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "ฝ่ายวิชาการ",
        "calendarName": "นางสาวกชกร ศิลาศรี"
      },
      {
        "name": "ว่าที่ ร.ต.หญิงเนตรนภา แสงเชื้อพ่อ",
        "position": "เจ้าหน้าที่ฝ่ายวิชาการ",
        "img": "/img/เนตรนภา แสงเชื้อพ่อ.jpg",
        "email": "netnapa@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "ฝ่ายวิชาการ",
        "calendarName": "ว่าที่ ร.ต.หญิงเนตรนภา แสงเชื้อพ่อ"
      },
      {
        "name": "นางพัชรีภรณ์ ไชยยงค์",
        "position": "เจ้าหน้าที่ฝ่ายวิชาการ",
        "img": "/img/พัชรีภรณ์ ไชยยงค์.jpg",
        "email": "patchareeporn@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "ฝ่ายวิชาการ",
        "calendarName": "นางพัชรีภรณ์ ไชยยงค์"
      },
      {
        "name": "นางสาวกาญดา สุริรมย์",
        "position": "เจ้าหน้าที่ฝ่ายวิชาการ",
        "img": "/img/กาญดา สุริรมย์.jpg",
        "email": "kanda@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "ฝ่ายวิชาการ",
        "calendarName": "นางสาวกาญดา สุริรมย์"
      },
      {
        "name": "นายสุรศักดิ์ เข็มปัญญา",
        "position": "เจ้าหน้าที่ฝ่ายวิชาการ",
        "img": "/img/สุรศักดิ์ เข็มปัญญา.jpg",
        "email": "surasak@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "ฝ่ายวิชาการ",
        "calendarName": "นายสุรศักดิ์ เข็มปัญญา"
      },
      {
        "name": "นางสาวคณิตา จันทร์ศรีเมือง",
        "position": "เจ้าหน้าที่ฝ่ายวิชาการ",
        "img": "/img/คณิตา จันทร์ศรีเมือง.jpg",
        "email": "kanita@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "ฝ่ายวิชาการ",
        "calendarName": "นางสาวคณิตา จันทร์ศรีเมือง"
      },
      {
        "name": "นายพีรวิชญ์ ปารีพันธ์",
        "position": "เจ้าหน้าที่ฝ่ายวิชาการ",
        "img": "/img/พีรวิชญ์ ปารีพันธ์.jpg",
        "email": "peerawich@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "ฝ่ายวิชาการ",
        "calendarName": "นายพีรวิชญ์ ปารีพันธ์"
      }
    ]
  },
  {
    "slug": "dept-finance",
    "title": "ฝ่ายวิจัย",
    "description": "บริหารงบประมาณ งานการเงินและบัญชี งานพัสดุ และการวางแผนยุทธศาสตร์",
    "icon": "fa-solid fa-coins",
    "badge": "Research & Quality Assurance",
    "head": {
      "name": "รศ.ดร.วีระ รัตนงาม",
      "position": "หัวหน้าฝ่ายวิจัยและประกันฯ",
      "img": "/img/รอง3.png",
      "email": "weera@npu.ac.th",
      "phone": "042-XXX-XXXX",
      "location": "ฝ่ายวิจัยและประกันฯ",
      "calendarName": "รองศาสตราจารย์ ดร.วีระ รัตนงาม"
    },
    "members": [
      {
        "name": "นายวิชญ อภิบาลศรี",
        "position": "เจ้าหน้าที่ฝ่ายวิจัยและประกันฯ",
        "img": "/img/วิชญ อภิบาลศรี.jpg",
        "email": "witchaya@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "ฝ่ายวิจัยและประกันฯ",
        "calendarName": "นายวิชญ อภิบาลศรี"
      },
      {
        "name": "นางรุ่งรัตน์ จรคำ",
        "position": "เจ้าหน้าที่ฝ่ายวิจัยและประกันฯ",
        "img": "/img/รุ่งรัตน์ จรคำ.jpg",
        "email": "rungrat@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "ฝ่ายวิจัยและประกันฯ",
        "calendarName": "นางรุ่งรัตน์ จรคำ"
      },
      {
        "name": "นางสาวถนอม ขุนษานนท์",
        "position": "เจ้าหน้าที่ฝ่ายวิจัยและประกันฯ",
        "img": "/img/ถนอม ขุนษานนท์.jpg",
        "email": "thanom@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "ฝ่ายวิจัยและประกันฯ",
        "calendarName": "นางสาวถนอม ขุนษานนท์"
      },
      {
        "name": "นายเจษฎา หงษ์ณี",
        "position": "เจ้าหน้าที่ฝ่ายวิจัยและประกันฯ",
        "img": "/img/เจษฎา หงษ์ณี.jpg",
        "email": "jetsada@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "ฝ่ายวิจัยและประกันฯ",
        "calendarName": "นายเจษฎา หงษ์ณี"
      }
    ],
    "allCards": [
      {
        "name": "รศ.ดร.วีระ รัตนงาม",
        "position": "หัวหน้าฝ่ายวิจัยและประกันฯ",
        "img": "/img/รอง3.png",
        "email": "weera@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "ฝ่ายวิจัยและประกันฯ",
        "calendarName": "รองศาสตราจารย์ ดร.วีระ รัตนงาม"
      },
      {
        "name": "นายวิชญ อภิบาลศรี",
        "position": "เจ้าหน้าที่ฝ่ายวิจัยและประกันฯ",
        "img": "/img/วิชญ อภิบาลศรี.jpg",
        "email": "witchaya@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "ฝ่ายวิจัยและประกันฯ",
        "calendarName": "นายวิชญ อภิบาลศรี"
      },
      {
        "name": "นางรุ่งรัตน์ จรคำ",
        "position": "เจ้าหน้าที่ฝ่ายวิจัยและประกันฯ",
        "img": "/img/รุ่งรัตน์ จรคำ.jpg",
        "email": "rungrat@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "ฝ่ายวิจัยและประกันฯ",
        "calendarName": "นางรุ่งรัตน์ จรคำ"
      },
      {
        "name": "นางสาวถนอม ขุนษานนท์",
        "position": "เจ้าหน้าที่ฝ่ายวิจัยและประกันฯ",
        "img": "/img/ถนอม ขุนษานนท์.jpg",
        "email": "thanom@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "ฝ่ายวิจัยและประกันฯ",
        "calendarName": "นางสาวถนอม ขุนษานนท์"
      },
      {
        "name": "นายเจษฎา หงษ์ณี",
        "position": "เจ้าหน้าที่ฝ่ายวิจัยและประกันฯ",
        "img": "/img/เจษฎา หงษ์ณี.jpg",
        "email": "jetsada@npu.ac.th",
        "phone": "042-XXX-XXXX",
        "location": "ฝ่ายวิจัยและประกันฯ",
        "calendarName": "นายเจษฎา หงษ์ณี"
      }
    ]
  },
  {
    "slug": "dept-facility",
    "title": "ฝ่ายพัฒนา",
    "description": "ดูแลและซ่อมบำรุงอาคารสถานที่ จัดระบบยานพาหนะ และพัฒนาภูมิทัศน์",
    "icon": "fa-solid fa-wrench",
    "badge": "Development Affairs",
    "head": {
      "name": "ผศ.ยอดเปรม ภูกำเนิด",
      "position": "รองคณบดีคณะเทคโนโลยีอุตสาหกรรม",
      "img": "/img/รอง4.png",
      "email": "boonlert@npu.ac.th",
      "phone": "042-XXX-XXXX ต่อ 101",
      "location": "สำนักงานคณบดี",
      "calendarName": "ผศ.ยอดเปรม ภูกำเนิด"
    },
    "members": [
      {
        "name": "นางสาวประณีวัน วงค์รุ่งเรืองโชค",
        "position": "เจ้าหน้าที่งานบริการการศึกษา",
        "img": "/img/ประณีวัน วงค์รุ่งเรืองโชค.jpg",
        "email": "praneewan@npu.ac.th",
        "phone": "042-532-477 ต่อ 102",
        "location": "งานบริการการศึกษา ชั้น 1",
        "calendarName": "นางสาวประณีวัน วงค์รุ่งเรืองโชค"
      },
      {
        "name": "นางสาวเสาวรส โพธิ์ชัยเจริญ",
        "position": "เจ้าหน้าที่งานบริการการศึกษา",
        "img": "/img/เสาวรส โพธิ์ชัยเจริญ.jpg",
        "email": "saowaros@npu.ac.th",
        "phone": "042-532-477 ต่อ 103",
        "location": "งานบริการการศึกษา ชั้น 1",
        "calendarName": "นางสาวเสาวรส โพธิ์ชัยเจริญ"
      },
      {
        "name": "นางรุ่งฤดี โพธิ์ขำ",
        "position": "เจ้าหน้าที่งานบริการการศึกษา",
        "img": "/img/รุ่งฤดี โพธิ์ขำ.jpg",
        "email": "rungrudee@npu.ac.th",
        "phone": "042-532-477 ต่อ 104",
        "location": "งานบริการการศึกษา ชั้น 1",
        "calendarName": "นางรุ่งฤดี โพธิ์ขำ"
      }
    ],
    "allCards": [
      {
        "name": "ผศ.ยอดเปรม ภูกำเนิด",
        "position": "รองคณบดีคณะเทคโนโลยีอุตสาหกรรม",
        "img": "/img/รอง4.png",
        "email": "boonlert@npu.ac.th",
        "phone": "042-XXX-XXXX ต่อ 101",
        "location": "สำนักงานคณบดี",
        "calendarName": "ผศ.ยอดเปรม ภูกำเนิด"
      },
      {
        "name": "นางสาวประณีวัน วงค์รุ่งเรืองโชค",
        "position": "เจ้าหน้าที่งานบริการการศึกษา",
        "img": "/img/ประณีวัน วงค์รุ่งเรืองโชค.jpg",
        "email": "praneewan@npu.ac.th",
        "phone": "042-532-477 ต่อ 102",
        "location": "งานบริการการศึกษา ชั้น 1",
        "calendarName": "นางสาวประณีวัน วงค์รุ่งเรืองโชค"
      },
      {
        "name": "นางสาวเสาวรส โพธิ์ชัยเจริญ",
        "position": "เจ้าหน้าที่งานบริการการศึกษา",
        "img": "/img/เสาวรส โพธิ์ชัยเจริญ.jpg",
        "email": "saowaros@npu.ac.th",
        "phone": "042-532-477 ต่อ 103",
        "location": "งานบริการการศึกษา ชั้น 1",
        "calendarName": "นางสาวเสาวรส โพธิ์ชัยเจริญ"
      },
      {
        "name": "นางรุ่งฤดี โพธิ์ขำ",
        "position": "เจ้าหน้าที่งานบริการการศึกษา",
        "img": "/img/รุ่งฤดี โพธิ์ขำ.jpg",
        "email": "rungrudee@npu.ac.th",
        "phone": "042-532-477 ต่อ 104",
        "location": "งานบริการการศึกษา ชั้น 1",
        "calendarName": "นางรุ่งฤดี โพธิ์ขำ"
      }
    ]
  }
];

export function getStaffDivisionBySlug(slug: string): StaffDivision | undefined {
  return STAFF_DIVISIONS_DATA.find((s) => s.slug === slug);
}
