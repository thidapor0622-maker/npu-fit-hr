import os
import re
import json

base_dir = r"C:\Users\220503\Desktop\HR_SITE"

# 1. Parse lecturers.html
with open(os.path.join(base_dir, "lecturers.html"), "r", encoding="utf-8") as f:
    lec_html = f.read()

departments_meta = []
# Match academic-card
card_matches = re.finditer(r'<a\s+href="([^"]+)"\s+class="[^"]*academic-card[^"]*".*?data-name="([^"]*)".*?data-name-en="([^"]*)"(.*?)</a>', lec_html, re.DOTALL)
for m in card_matches:
    href = m.group(1).replace(".html", "")
    data_name = m.group(2)
    data_name_en = m.group(3)
    inner = m.group(4)
    
    icon_match = re.search(r'<i\s+class="([^"]+)"', inner)
    icon = icon_match.group(1) if icon_match else "fa-solid fa-graduation-cap"
    
    h4_match = re.search(r'<h4[^>]*>(.*?)</h4>', inner)
    title = h4_match.group(1).strip() if h4_match else ""
    
    p_match = re.search(r'<p[^>]*class="[^"]*text-slate-500[^"]*"[^>]*>(.*?)</p>', inner)
    title_en = p_match.group(1).strip() if p_match else ""
    
    departments_meta.append({
        "slug": href,
        "title": title,
        "titleEn": title_en,
        "icon": icon,
        "searchKeywords": f"{data_name} {data_name_en}".strip()
    })

print(f"Extracted {len(departments_meta)} departments from lecturers.html")

# 2. Parse staff.html
with open(os.path.join(base_dir, "staff.html"), "r", encoding="utf-8") as f:
    staff_html = f.read()

divisions_meta = []
staff_matches = re.finditer(r'<a\s+href="([^"]+)"\s+class="[^"]*dept-card[^"]*"(.*?)</a>', staff_html, re.DOTALL)
for m in staff_matches:
    href = m.group(1).replace(".html", "")
    inner = m.group(2)
    
    icon_match = re.search(r'<div[^>]*class="[^"]*w-14[^"]*"[^>]*>\s*<i\s+class="([^"]+)"', inner)
    icon = icon_match.group(1) if icon_match else "fa-solid fa-briefcase"
    
    h3_match = re.search(r'<h3[^>]*>(.*?)</h3>', inner)
    title = h3_match.group(1).strip() if h3_match else ""
    
    p_match = re.search(r'<p[^>]*class="[^"]*text-slate-500[^"]*"[^>]*>(.*?)</p>', inner)
    desc = p_match.group(1).strip() if p_match else ""
    
    divisions_meta.append({
        "slug": href,
        "title": title,
        "description": desc,
        "icon": icon
    })

print(f"Extracted {len(divisions_meta)} divisions from staff.html")

meta_data = {
    "departments": departments_meta,
    "divisions": divisions_meta
}

with open(os.path.join(base_dir, "extracted_meta.json"), "w", encoding="utf-8") as f:
    json.dump(meta_data, f, ensure_ascii=False, indent=2)
