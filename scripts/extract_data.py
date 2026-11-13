import os
import re
import json

base_dir = r"C:\Users\220503\Desktop\HR_SITE"

def parse_cards_from_html(html_content):
    cards = []
    # Split by personnel-card
    parts = re.split(r'class="[^"]*personnel-card[^"]*"', html_content)
    for part in parts[1:]:
        # img
        img_match = re.search(r'<img[^>]+src="([^">]+)"', part)
        img = img_match.group(1).strip() if img_match else ""
        
        # name
        name_match = re.search(r'<h4[^>]*>(.*?)</h4>', part, re.DOTALL)
        name = re.sub(r'<[^>]+>', '', name_match.group(1)).strip() if name_match else ""
        
        # position
        pos_match = re.search(r'<p[^>]*class="[^"]*min-h-[^"]*"[^>]*>(.*?)</p>', part, re.DOTALL)
        if not pos_match:
            pos_match = re.search(r'<p[^>]*class="[^"]*text-sky-900[^"]*"[^>]*>(.*?)</p>', part, re.DOTALL)
        pos = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', pos_match.group(1))).strip() if pos_match else ""
        
        # email
        email_match = re.search(r'href="mailto:([^">]+)"', part)
        email = email_match.group(1).strip() if email_match else ""
        
        # phone
        phone = ""
        phone_match = re.search(r'href="tel:([^">]+)"', part)
        if phone_match:
            phone = phone_match.group(1).strip()
        phone_text_match = re.search(r'href="tel:[^">]+"[^>]*>.*?fa-phone[^<]*</i>\s*([^<]+)</a>', part, re.DOTALL)
        if phone_text_match:
            phone = phone_text_match.group(1).strip()
            
        # location
        location = ""
        loc_match = re.search(r'href="https?://[^">]+"[^>]*>.*?fa-location-dot[^<]*</i>\s*([^<]+)</a>', part, re.DOTALL)
        if loc_match:
            location = loc_match.group(1).strip()
        
        # calendar name
        cal_match = re.search(r'openCalendarModal\([\'"]([^\'"]+)[\'"]\)', part)
        cal_name = cal_match.group(1).strip() if cal_match else name
        
        if name:
            cards.append({
                "name": name,
                "position": pos,
                "img": img,
                "email": email,
                "phone": phone,
                "location": location,
                "calendarName": cal_name
            })
    return cards

dept_files = [
    "electrical-power.html",
    "electronics-robotics.html",
    "automotive-ev.html",
    "industrial-technology.html",
    "vocational-education.html",
    "welding-technology.html",
    "architecture.html",
    "construction-technology.html",
    "digital-business.html",
    "digital-office.html",
    "marketing.html",
    "hotel-management.html",
    "accounting.html",
    "applied-fundamentals.html",
    "basic-vocational.html",
    "dept-admin.html",
    "dept-academic.html",
    "dept-finance.html",
    "dept-facility.html"
]

results = {}
summary = []
for fname in dept_files:
    fpath = os.path.join(base_dir, fname)
    if os.path.exists(fpath):
        with open(fpath, "r", encoding="utf-8") as f:
            content = f.read()
        cards = parse_cards_from_html(content)
        
        # Find hero badge / category title
        badge_match = re.search(r'<span[^>]*class="[^"]*rounded-full[^"]*"[^>]*>(.*?)</span>', content, re.DOTALL)
        badge = re.sub(r'<[^>]+>', '', badge_match.group(1)).strip() if badge_match else ""
        
        # Find main h3 / h2 titles
        h_titles = re.findall(r'<h[23][^>]*class="[^"]*font-extrabold[^"]*"[^>]*>(.*?)</h[23]>', content, re.DOTALL)
        h_titles_clean = [re.sub(r'<[^>]+>', '', t).strip() for t in h_titles]
        
        results[fname] = {
            "file": fname,
            "badge": badge,
            "titles": h_titles_clean,
            "count": len(cards),
            "head": cards[0] if cards else None,
            "members": cards[1:] if len(cards) > 1 else [],
            "allCards": cards
        }
        summary.append(f"{fname}: {len(cards)} personnel")

with open(os.path.join(base_dir, "extracted_personnel.json"), "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

with open(os.path.join(base_dir, "summary.txt"), "w", encoding="utf-8") as f:
    f.write("\n".join(summary))

print("Successfully extracted all personnel data!")
