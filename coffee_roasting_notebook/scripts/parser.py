#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import re
import json
import io
import shutil
from datetime import datetime

# 強制控制台輸出為 UTF-8 以防亂碼
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# 預設路徑配置
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSON_PATH = r"D:\2026coffeewebsite\Gemini Apps\MyActivity.json"
GEMINI_APPS_DIR = r"D:\2026coffeewebsite\Gemini Apps"
ATTACHMENTS_DIR = os.path.join(BASE_DIR, "attachments")
GREEN_BEANS_DIR = os.path.join(BASE_DIR, "01_Green_Beans")
ROASTING_LOGS_DIR = os.path.join(BASE_DIR, "02_Roasting_Logs")
ROASTING_PROFILES_DIR = os.path.join(BASE_DIR, "03_Roasting_Profiles")
SCA_THEORY_DIR = os.path.join(BASE_DIR, "04_SCA_Theory")

# 確保目錄存在
for d in [ATTACHMENTS_DIR, GREEN_BEANS_DIR, ROASTING_LOGS_DIR, ROASTING_PROFILES_DIR, SCA_THEORY_DIR]:
    os.makedirs(d, exist_ok=True)

def sanitize_filename(name):
    """將不合法字元過濾以建立安全檔名"""
    name = re.sub(r'[\/:*?"<>|#\s]', '_', name)
    return name[:60].strip()

def format_date(iso_time):
    """將 ISO 時間格式轉為 YYYY-MM-DD"""
    try:
        dt = datetime.strptime(iso_time.split('.')[0], "%Y-%m-%dT%H:%M:%S")
        return dt.strftime("%Y-%m-%d")
    except:
        return datetime.now().strftime("%Y-%m-%d")

def convert_table(match):
    """將 HTML table 區塊轉換為 GFM Markdown table"""
    table_content = match.group(1)
    rows = re.findall(r'<tr[^>]*>(.*?)</tr>', table_content, flags=re.DOTALL)
    if not rows:
        return ""
    md_rows = []
    is_first_row = True
    for row in rows:
        cells = re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', row, flags=re.DOTALL)
        cells_clean = []
        for cell in cells:
            cell_clean = re.sub(r'<[^>]+>', '', cell).strip().replace('\n', ' ')
            cells_clean.append(cell_clean)
        if cells_clean:
            row_md = '| ' + ' | '.join(cells_clean) + ' |'
            md_rows.append(row_md)
            if is_first_row:
                divider = '| ' + ' | '.join(['---'] * len(cells_clean)) + ' |'
                md_rows.append(divider)
                is_first_row = False
    return '\n' + '\n'.join(md_rows) + '\n'

def html_to_markdown(html):
    """使用原生 regex 將 HTML 轉為高品質 Markdown"""
    if not html:
        return ""
    
    # 轉換 Table
    html = re.sub(r'<table[^>]*>(.*?)</table>', convert_table, html, flags=re.DOTALL)
    
    # 轉換 List
    def convert_ul(match):
        content = match.group(1)
        items = re.findall(r'<li[^>]*>(.*?)</li>', content, flags=re.DOTALL)
        return '\n' + '\n'.join(f'- {item.strip()}' for item in items if item.strip()) + '\n'
        
    def convert_ol(match):
        content = match.group(1)
        items = re.findall(r'<li[^>]*>(.*?)</li>', content, flags=re.DOTALL)
        return '\n' + '\n'.join(f'{i+1}. {item.strip()}' for i, item in enumerate(items) if item.strip()) + '\n'
        
    html = re.sub(r'<ul[^>]*>(.*?)</ul>', convert_ul, html, flags=re.DOTALL)
    html = re.sub(r'<ol[^>]*>(.*?)</ol>', convert_ol, html, flags=re.DOTALL)
    
    # 轉換標題
    html = re.sub(r'<h1[^>]*>(.*?)</h1>', r'\n# \1\n', html, flags=re.DOTALL)
    html = re.sub(r'<h2[^>]*>(.*?)</h2>', r'\n## \1\n', html, flags=re.DOTALL)
    html = re.sub(r'<h3[^>]*>(.*?)</h3>', r'\n### \1\n', html, flags=re.DOTALL)
    html = re.sub(r'<h4[^>]*>(.*?)</h4>', r'\n#### \1\n', html, flags=re.DOTALL)
    
    # 轉換引用
    html = re.sub(r'<blockquote[^>]*>(.*?)</blockquote>', lambda m: '\n' + '\n'.join(f'> {line}' for line in m.group(1).strip().split('\n')) + '\n', html, flags=re.DOTALL)
    
    # 轉換段落與換行
    html = re.sub(r'<p[^>]*>(.*?)</p>', r'\n\1\n', html, flags=re.DOTALL)
    html = re.sub(r'<br\s*/?>', r'\n', html)
    
    # 轉換粗體與斜體
    html = re.sub(r'<strong[^>]*>(.*?)</strong>', r'**\1**', html, flags=re.DOTALL)
    html = re.sub(r'<b[^>]*>(.*?)</b>', r'**\1**', html, flags=re.DOTALL)
    html = re.sub(r'<em[^>]*>(.*?)</em>', r'*\1*', html, flags=re.DOTALL)
    html = re.sub(r'<i[^>]*>(.*?)</i>', r'*\1*', html, flags=re.DOTALL)
    
    # 轉換水平分隔線
    html = re.sub(r'<hr\s*/?>', r'\n---\n', html)
    
    # 移除剩餘 HTML tags
    html = re.sub(r'<[^>]+>', ' ', html)
    
    # 反解 HTML Entities
    html = html.replace('&quot;', '\"').replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>').replace('&#39;', '\'').replace('&nbsp;', ' ')
    
    # 整理空行
    html = re.sub(r'\n{3,}', '\n\n', html)
    
    return html.strip()

def find_matching_files(text, gemini_apps_dir):
    """
    模糊匹配對話中的圖片與文件附件，回傳實體檔名列表。
    """
    tokens = re.findall(r'\b(\d{3,}|[a-zA-Z0-9_-]+[-_][a-zA-Z0-9_-]+|\b[a-zA-Z_]\w*\b)\b', text)
    matched_files = []
    
    try:
        all_files = os.listdir(gemini_apps_dir)
    except Exception as e:
        print(f"[-] 無法讀取目錄: {e}")
        return []
        
    for token in tokens:
        if len(token) < 3:
            continue
        for f in all_files:
            if f.lower() in ["myactivity.json", "gemini_gems_data.html"]:
                continue
            f_base = f.split('.')[0]
            if f_base.lower().startswith(token.lower()) or f.lower().startswith(token.lower()):
                if f not in matched_files:
                    matched_files.append(f)
                    
    return matched_files

def parse_txt_chat(file_path):
    """
    相容原有文字格式對話檔解析
    """
    print(f"正在解析文字檔案: {file_path} ...")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    paragraphs = content.split("\n\n")
    records_found = 0
    
    for idx, p in enumerate(paragraphs):
        p_clean = p.strip()
        if not p_clean:
            continue
            
        if "產區" in p_clean and "處理法" in p_clean and ("品種" in p_clean or "海拔" in p_clean):
            # 綠色生豆特徵
            name_match = re.search(r'(?:名稱|品名|豆款|生豆)[:：]\s*([^\n]+)', p_clean)
            name = name_match.group(1).strip() if name_match else f"手動匯入生豆_{idx}"
            
            origin = re.search(r'產區[:：]\s*([^\n]+)', p_clean)
            estate = re.search(r'(?:莊園|處理廠)[:：]\s*([^\n]+)', p_clean)
            process = re.search(r'處理法[:：]\s*([^\n]+)', p_clean)
            variety = re.search(r'品種[:：]\s*([^\n]+)', p_clean)
            altitude = re.search(r'海拔[:：]\s*([^\n]+)', p_clean)
            
            bean_file = os.path.join(GREEN_BEANS_DIR, f"{sanitize_filename(name)}.md")
            with open(bean_file, "w", encoding="utf-8") as bf:
                bf.write(f"""---
type: green_bean
name: "{name}"
origin: "{origin.group(1).strip() if origin else ""}"
estate: "{estate.group(1).strip() if estate else ""}"
process: "{process.group(1).strip() if process else ""}"
variety: "{variety.group(1).strip() if variety else ""}"
altitude: "{altitude.group(1).strip() if altitude else ""}"
tags: [coffee/green_bean, imported/manual]
---

# 🟢 匯入生豆：{name}

## 📋 對話擷取之生豆屬性
{p_clean}
""")
            print(f"  [+] 手動生豆卡片: {name}")
            records_found += 1

        elif "入豆" in p_clean and "出豆" in p_clean and ("DTR" in p_clean or "時間" in p_clean or "火力" in p_clean):
            # 烘焙操作日誌
            title_match = re.search(r'(?:品名|標題|日誌|日期)[:：]\s*([^\n]+)', p_clean)
            title = title_match.group(1).strip() if title_match else f"手動烘焙日誌_{idx}"
            
            machine = re.search(r'(?:烘豆機|設備)[:：]\s*([^\n]+)', p_clean)
            charge_temp = re.search(r'入豆溫(?:度)?[:：]\s*([0-9.]+)', p_clean)
            drop_temp = re.search(r'出豆溫(?:度)?[:：]\s*([0-9.]+)', p_clean)
            dtr = re.search(r'(?:DTR|發展比)[:：]\s*([0-9.]+%?)', p_clean)
            
            log_file = os.path.join(ROASTING_LOGS_DIR, f"{sanitize_filename(title)}.md")
            with open(log_file, "w", encoding="utf-8") as lf:
                lf.write(f"""---
type: roasting_log
date: {datetime.now().strftime("%Y-%m-%d")}
machine: "{machine.group(1).strip() if machine else ""}"
charge_temp: {charge_temp.group(1).strip() if charge_temp else ""}
drop_temp: {drop_temp.group(1).strip() if drop_temp else ""}
dtr_ratio: "{dtr.group(1).strip() if dtr else ""}"
tags: [coffee/roasting_log, imported/manual]
---

# ☕ 匯入日誌：{title}

## 📊 對話擷取之烘焙數據
{p_clean}
""")
            print(f"  [+] 手動烘焙日誌: {title}")
            records_found += 1

def parse_json_takeout():
    """
    深度解析 Google Takeout JSON 並建立高互動 Obsidian 知識網絡。
    """
    print(f"==================================================")
    print(f"正在執行 Google Takeout JSON 對話庫深度整合解析...")
    print(f"JSON 檔案路徑: {JSON_PATH}")
    print(f"==================================================")

    if not os.path.exists(JSON_PATH):
        print(f"[-] 錯誤：找不到 Takeout JSON 檔案：'{JSON_PATH}'")
        return

    with open(JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    print(f"[+] 載入 Takeout 完成，共 {len(data)} 筆紀錄。")

    imported_logs = 0
    imported_beans = 0
    imported_theory = 0
    copied_attachments = 0
    copied_filenames = set()

    # 咖啡烘焙核心關鍵字
    coffee_kws = ['咖啡', '烘焙', '烘豆', 'ror', 'dtr', 'sca', '莫札特', '巴哈', '蕭邦', '貝多芬', '藝伎', 'gesha', 'giesen', 'diedrich', 'bullet', '轉黃', '一爆', '回溫點', '火力', '風門', '下豆', '入豆']

    for idx, item in enumerate(data):
        title = item.get("title", "")
        time_str = item.get("time", "")
        date_str = format_date(time_str)

        # 1. 提取 HTML 並轉為高品質 Markdown
        html_content = ""
        if "safeHtmlItem" in item and len(item["safeHtmlItem"]) > 0:
            html_content = item["safeHtmlItem"][0].get("html", "")
        
        body_text = html_to_markdown(html_content)
        
        # 相容無 html 的 subtitles 情況
        if not body_text:
            subtitles_list = item.get("subtitles", [])
            body_text = "\n".join([sub.get("name", "") for sub in subtitles_list])

        # 2. 咖啡主題過濾
        combined_text = (title + "\n" + body_text).lower()
        if not any(kw in combined_text for kw in coffee_kws):
            continue

        # 3. 處理附件檔案 (複製至 Obsidian attachments 目錄)
        attachments = find_matching_files(body_text + "\n" + title, GEMINI_APPS_DIR)
        attachment_links_md = []
        for att in attachments:
            source_file = os.path.join(GEMINI_APPS_DIR, att)
            if os.path.exists(source_file):
                dest_file = os.path.join(ATTACHMENTS_DIR, att)
                try:
                    if att not in copied_filenames:
                        shutil.copy2(source_file, dest_file)
                        copied_attachments += 1
                        copied_filenames.add(att)
                    if att.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
                        attachment_links_md.append(f"![[{att}]]")
                    else:
                        attachment_links_md.append(f"[[{att}]] (附件)")
                except Exception as e:
                    pass

        # 4. 清理並標記檔名 (加入日期與 Index 防重複)
        clean_title = re.sub(r'^(Prompted|Created Gemini Canvas titled)\s*', '', title)
        clean_title = re.sub(r'^[\u201c\u201d""\'\u300c\u300d]', '', clean_title)
        clean_title = re.sub(r'[\u201c\u201d""\'\u300c\u300d]$', '', clean_title)
        
        san_title = sanitize_filename(clean_title)
        if not san_title:
            san_title = f"咖啡對話"
        
        # 檔名規格：[YYYY-MM-DD]_[主題]_[Index].md
        final_filename = f"{date_str}_{san_title}_{idx}.md"

        # 5. 寬鬆而強大的自動分類演算法
        # A. 綠色生豆特徵
        if '產區' in combined_text and '處理法' in combined_text and ('品種' in combined_text or '海拔' in combined_text):
            imported_beans += 1
            green_bean_file = os.path.join(GREEN_BEANS_DIR, final_filename)
            
            # 從文本中自動提取 YAML 屬性
            origin_match = re.search(r'產區[:：]\s*([^\n|]+)', body_text)
            process_match = re.search(r'處理法[:：]\s*([^\n|]+)', body_text)
            variety_match = re.search(r'品種[:：]\s*([^\n|]+)', body_text)
            altitude_match = re.search(r'海拔[:：]\s*([^\n|]+)', body_text)
            
            with open(green_bean_file, "w", encoding="utf-8") as f_out:
                f_out.write(f"""---
type: green_bean
name: "{clean_title[:40]}"
origin: "{origin_match.group(1).strip() if origin_match else ''}"
process: "{process_match.group(1).strip() if process_match else ''}"
variety: "{variety_match.group(1).strip() if variety_match else ''}"
altitude: "{altitude_match.group(1).strip() if altitude_match else ''}"
date: {date_str}
tags: [coffee/green_bean, imported/takeout]
---

# 🟢 匯入生豆：{clean_title[:50]}

## 📋 考官引導對話
{body_text}

## 🖼️ 實體檔案與圖檔
{" ".join(attachment_links_md) if attachment_links_md else "*無附圖*"}
""")

        # B. 烘焙日誌分類 (Relaxed & Mozart Friendly)
        elif any(x in combined_text for x in ['入豆溫', '出豆溫', '下豆溫', '回溫點', 'dtr', '發展比', '烘焙日誌', '烘焙紀錄']) or \
             (any(x in combined_text for x in ['第一鍋', '第二鍋', '第三鍋', '第四鍋', '最後一鍋', '第1鍋', '第2鍋', '第3鍋', '第4鍋', '烘3鍋', '烘4鍋']) and any(y in combined_text for y in ['分', '秒', '度', '火', '風', 'bbp', '鍋'])):
            
            imported_logs += 1
            roasting_log_file = os.path.join(ROASTING_LOGS_DIR, final_filename)
            
            # 從文本中自動提取物理控制指標
            machine_match = re.search(r'(?:烘豆機|設備)[:：]\s*([^\n|]+)', body_text)
            charge_match = re.search(r'(?:入豆溫|入豆溫度)[:：]\s*([0-9.]+)', body_text)
            if not charge_match:
                charge_match = re.search(r'入豆\s*([0-9.]+)\s*度', body_text)
                
            drop_match = re.search(r'(?:出豆溫|下豆溫|出豆溫度|下豆溫度)[:：]\s*([0-9.]+)', body_text)
            if not drop_match:
                drop_match = re.search(r'下豆\s*([0-9.]+)\s*度', body_text)
                
            dtr_match = re.search(r'(?:DTR|發展比)[:：]\s*([0-9.]+%?)', body_text)
            
            with open(roasting_log_file, "w", encoding="utf-8") as f_out:
                f_out.write(f"""---
type: roasting_log
date: {date_str}
machine: "{machine_match.group(1).strip() if machine_match else ''}"
charge_temp: "{charge_match.group(1).strip() if charge_match else ''}"
drop_temp: "{drop_match.group(1).strip() if drop_match else ''}"
dtr_ratio: "{dtr_match.group(1).strip() if dtr_match else ''}"
tags: [coffee/roasting_log, imported/takeout]
---

# ☕ 烘焙日誌：{clean_title[:50]}

## 📊 對話烘焙紀錄數據
{body_text}

## 🖼️ ROR 曲線與實體翻拍圖
{" ".join(attachment_links_md) if attachment_links_md else "*無附圖*"}
""")

        # C. SCA 烘焙理論與學術筆記
        else:
            imported_theory += 1
            theory_file = os.path.join(SCA_THEORY_DIR, final_filename)
            
            with open(theory_file, "w", encoding="utf-8") as f_out:
                f_out.write(f"""---
type: sca_theory
title: "{clean_title[:40]}"
date: {date_str}
tags: [coffee/sca_theory, imported/takeout]
---

# 📚 SCA 考官理論：{clean_title[:60]}

## 📋 對話理論筆記
{body_text}

## 🖼️ 理論參考圖片
{" ".join(attachment_links_md) if attachment_links_md else "*無附圖*"}
""")

    print(f"\n==================================================")
    print(f"🎉 Google Takeout 深度解析圓滿完成！")
    print(f"==================================================")
    print(f"[+] 匯出並建立生豆卡片 (Green Beans): {imported_beans} 個")
    print(f"[+] 匯出並建立烘焙日誌 (Roasting Logs): {imported_logs} 個")
    print(f"[+] 匯出並建立 SCA 考官理論 (SCA Theory): {imported_theory} 個")
    print(f"[+] 成功複製並連結之實體 ROR 曲線圖片: {copied_attachments} 張")
    print(f"==================================================")

def main():
    if len(sys.argv) > 1:
        # 手動指定檔案
        file_path = sys.argv[1]
        if file_path.endswith(".json"):
            global JSON_PATH
            JSON_PATH = file_path
            parse_json_takeout()
        else:
            parse_txt_chat(file_path)
    else:
        # 預設直接跑 Takeout
        parse_json_takeout()

if __name__ == "__main__":
    main()
