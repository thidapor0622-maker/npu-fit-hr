import os
import shutil
import json

base_dir = r"C:\Users\220503\Desktop\HR_SITE"
src_data_dir = os.path.join(base_dir, "src", "data")
os.makedirs(src_data_dir, exist_ok=True)

# 2. Departments Data
with open(os.path.join(base_dir, "extracted_meta.json"), "r", encoding="utf-8") as f:
    meta = json.load(f)

with open(os.path.join(base_dir, "extracted_personnel.json"), "r", encoding="utf-8") as f:
    personnel = json.load(f)

dept_list = []
for d in meta["departments"]:
    slug = d["slug"]
    html_file = f"{slug}.html"
    p_info = personnel.get(html_file, {})
    
    cards = p_info.get("allCards", [])
    for c in cards:
        if c.get("img") and not c["img"].startswith("/") and not c["img"].startswith("http"):
            c["img"] = "/" + c["img"]
            
    head = p_info.get("head")
    if head and head.get("img") and not head["img"].startswith("/") and not head["img"].startswith("http"):
        head["img"] = "/" + head["img"]
        
    members = p_info.get("members", [])
    for m in members:
        if m.get("img") and not m["img"].startswith("/") and not m["img"].startswith("http"):
            m["img"] = "/" + m["img"]
            
    dept_obj = {
        "slug": slug,
        "title": d["title"],
        "titleEn": d["titleEn"],
        "icon": d["icon"],
        "searchKeywords": d["searchKeywords"],
        "badge": p_info.get("badge", d["title"]),
        "head": head,
        "members": members,
        "allCards": cards
    }
    dept_list.append(dept_obj)

departments_header = """export interface Personnel {
  name: string;
  position: string;
  img: string;
  email: string;
  phone: string;
  location: string;
  calendarName: string;
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
"""

departments_ts = f"""{departments_header}
export const DEPARTMENTS_DATA: Department[] = {json.dumps(dept_list, ensure_ascii=False, indent=2)};

export function getDepartmentBySlug(slug: string): Department | undefined {{
  return DEPARTMENTS_DATA.find((d) => d.slug === slug);
}}
"""

with open(os.path.join(src_data_dir, "departments.ts"), "w", encoding="utf-8") as f:
    f.write(departments_ts)

# 3. Staff Divisions Data
div_list = []
for div in meta["divisions"]:
    slug = div["slug"]
    html_file = f"{slug}.html"
    p_info = personnel.get(html_file, {})
    
    cards = p_info.get("allCards", [])
    for c in cards:
        if c.get("img") and not c["img"].startswith("/") and not c["img"].startswith("http"):
            c["img"] = "/" + c["img"]
            
    head = p_info.get("head")
    if head and head.get("img") and not head["img"].startswith("/") and not head["img"].startswith("http"):
        head["img"] = "/" + head["img"]
        
    members = p_info.get("members", [])
    for m in members:
        if m.get("img") and not m["img"].startswith("/") and not m["img"].startswith("http"):
            m["img"] = "/" + m["img"]
            
    div_obj = {
        "slug": slug,
        "title": div["title"],
        "description": div["description"],
        "icon": div["icon"],
        "badge": p_info.get("badge", div["title"]),
        "head": head,
        "members": members,
        "allCards": cards
    }
    div_list.append(div_obj)

divisions_header = """import { Personnel } from './departments';

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
"""

divisions_ts = f"""{divisions_header}
export const STAFF_DIVISIONS_DATA: StaffDivision[] = {json.dumps(div_list, ensure_ascii=False, indent=2)};

export function getStaffDivisionBySlug(slug: string): StaffDivision | undefined {{
  return STAFF_DIVISIONS_DATA.find((s) => s.slug === slug);
}}
"""

with open(os.path.join(src_data_dir, "staff-divisions.ts"), "w", encoding="utf-8") as f:
    f.write(divisions_ts)

print("Fixed TypeScript files!")
