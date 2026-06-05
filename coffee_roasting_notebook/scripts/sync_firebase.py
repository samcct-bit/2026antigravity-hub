#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re
import sys
import io
import json
import urllib.request
import time

# Force console to UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Base Firestore REST API URL
FIRESTORE_URL = "https://firestore.googleapis.com/v1/projects/my-teaching-tools-01/databases/(default)/documents/coffee_roasts"

def clean_name(name):
    # Remove non-alphanumeric and spaces
    name = re.sub(r'[^\w\s]', '', name)
    name = name.replace(' ', '').replace('_', '').lower()
    name = name.replace('批次', '').replace('gesha', '藝伎').replace('gesha', '藝妓')
    return name

def extract_batch_and_keywords(name):
    name = name.lower()
    
    # Extract batch number
    batch = None
    m = re.search(r'(?:批次|#|#\s*|batch\s*|no|no\s*)(\d+)', name)
    if m:
        batch = int(m.group(1))
    else:
        m2 = re.search(r'(\d+)\s*(?:\.md)?$', name)
        if m2:
            batch = int(m2.group(1))
            
    # Keywords
    kws = set()
    for w in ["kenya", "gesha", "mozart", "肯亞", "尼亞里", "克安尤古", "古吉", "藝伎", "藝妓", "莫札特"]:
        if w in name:
            kws.add(w)
            
    return batch, kws

def parse_markdown_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"[-] 無法讀取檔案 {filepath}: {e}")
        return None
    
    # Extract frontmatter
    parts = content.split('---', 2)
    if len(parts) < 3:
        return None
    
    frontmatter_str = parts[1]
    body = parts[2]
    
    # Parse frontmatter simple yaml
    frontmatter = {}
    for line in frontmatter_str.splitlines():
        line = line.strip()
        if not line or ':' not in line:
            continue
        k, v = line.split(':', 1)
        k = k.strip()
        v = v.strip()
        if (v.startswith('"') and v.endswith('"')) or (v.startswith("'") and v.endswith("'")):
            v = v[1:-1]
        if v.startswith('[') and v.endswith(']') and not (v.startswith('[[') and v.endswith(']]')):
            items = [item.strip() for item in v[1:-1].split(',')]
            items = [i[1:-1] if (i.startswith('"') or i.startswith("'")) else i for i in items]
            v = items
        else:
            try:
                if '.' in v:
                    v = float(v)
                else:
                    v = int(v)
            except ValueError:
                pass
        frontmatter[k] = v
        
    if frontmatter.get('type') != 'roasting_log':
        return None
        
    images = re.findall(r'!\[\[(.*?)\]\]', body)
    
    timeline_actions = []
    ror_datapoints = []
    
    lines = body.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if "## 🔥 實體風火操作設定 (Timeline SOP)" in line:
            i += 1
            while i < len(lines) and not lines[i].strip().startswith('|'):
                i += 1
            if i < len(lines) and lines[i].strip().startswith('|'):
                i += 1
            if i < len(lines) and (':---' in lines[i] or '---' in lines[i]):
                i += 1
            while i < len(lines) and lines[i].strip().startswith('|'):
                row_cells = [cell.strip() for cell in lines[i].strip().split('|')][1:-1]
                if len(row_cells) >= 5:
                    time_str = row_cells[0]
                    temp_str = row_cells[1].replace('°C', '').strip()
                    burner = row_cells[2]
                    damper = row_cells[3]
                    note = row_cells[4]
                    try:
                        temp_val = float(temp_str)
                    except ValueError:
                        temp_val = 0.0
                    timeline_actions.append({
                        "time": time_str,
                        "temp": temp_val,
                        "burner": burner,
                        "damper": damper,
                        "note": note
                    })
                i += 1
        elif "## 📈 ROR 升溫率與實體豆溫歷程節點" in line:
            i += 1
            while i < len(lines) and not lines[i].strip().startswith('|'):
                i += 1
            if i < len(lines) and lines[i].strip().startswith('|'):
                i += 1
            if i < len(lines) and (':---' in lines[i] or '---' in lines[i]):
                i += 1
            while i < len(lines) and lines[i].strip().startswith('|'):
                row_cells = [cell.strip() for cell in lines[i].strip().split('|')][1:-1]
                if len(row_cells) >= 4:
                    time_str = row_cells[0]
                    temp_str = row_cells[1].replace('°C', '').strip()
                    ror_str = row_cells[2].replace('°C/min', '').strip()
                    note = row_cells[3]
                    try:
                        temp_val = float(temp_str)
                    except ValueError:
                        temp_val = 0.0
                    try:
                        ror_val = float(ror_str)
                    except ValueError:
                        ror_val = 0.0
                    
                    time_s = 0
                    if ":" in time_str:
                        t_parts = time_str.split(':')
                        try:
                            time_s = int(t_parts[0]) * 60 + int(t_parts[1])
                        except ValueError:
                            pass
                    else:
                        try:
                            time_s = int(float(time_str) * 60)
                        except ValueError:
                            pass
                    
                    ror_datapoints.append({
                        "timeStr": time_str,
                        "timeS": time_s,
                        "beanTemp": temp_val,
                        "ror": ror_val,
                        "note": note
                    })
                i += 1
        else:
            i += 1
            
    bean_raw = frontmatter.get('bean', '')
    bean_name = bean_raw.replace('[[', '').replace(']]', '')
    
    # Try to extract "origin" and "roastLevel" from body markdown
    origin = frontmatter.get('origin', '')
    roast_level = frontmatter.get('roast_level', '')
    match_origin = re.search(r'-\s*\*\*產區\s*/\s*焙度\*\*:\s*([^/]+)\s*/\s*(.*)', body)
    if match_origin:
        if not origin:
            origin = match_origin.group(1).strip()
        if not roast_level:
            roast_level = match_origin.group(2).strip()
            
    db_record = {
        "id": frontmatter.get('id', ''),
        "beanName": bean_name,
        "origin": origin,
        "machine": frontmatter.get('machine', ''),
        "roastDate": str(frontmatter.get('date', '')),
        "roastLevel": roast_level,
        "chargeMassG": frontmatter.get('charge_mass_g', 0),
        "dropMassG": frontmatter.get('drop_mass_g', 0),
        "chargeTemp": frontmatter.get('charge_temp', 0.0),
        "tpTemp": frontmatter.get('tp_temp', 0.0),
        "tpTime": frontmatter.get('tp_time', ''),
        "fcTemp": frontmatter.get('fc_temp', 0.0),
        "fcTime": frontmatter.get('fc_time', ''),
        "dropTemp": frontmatter.get('drop_temp', 0.0),
        "dropTime": frontmatter.get('drop_time', ''),
        "dtrRatio": frontmatter.get('dtr_ratio', ''),
        "lossRatio": frontmatter.get('loss_ratio', ''),
        "tags": frontmatter.get('tags', []),
        "rorDatapoints": ror_datapoints,
        "timelineActions": timeline_actions,
        "images": images,
        "filepath": filepath,
        "filename": os.path.basename(filepath),
        "date": str(frontmatter.get('date', ''))
    }
    
    return db_record

def to_firestore_payload(record):
    fields = {}
    
    text_fields = ["id", "beanName", "origin", "machine", "roastDate", "roastLevel", "tpTime", "fcTime", "dropTime", "dtrRatio", "lossRatio"]
    num_fields = ["chargeMassG", "dropMassG", "chargeTemp", "tpTemp", "fcTemp", "dropTemp"]
    
    for field in text_fields:
        val = record.get(field, "")
        if val is None:
            val = ""
        fields[field] = {"stringValue": str(val)}
        
    for field in num_fields:
        val = record.get(field, 0)
        try:
            val_float = float(val) if val is not None and str(val).strip() != "" else 0.0
            if val_float.is_integer():
                fields[field] = {"integerValue": str(int(val_float))}
            else:
                fields[field] = {"doubleValue": val_float}
        except ValueError:
            fields[field] = {"integerValue": "0"}
            
    if "rorDatapoints" in record:
        fields["rorDatapointsJson"] = {"stringValue": json.dumps(record["rorDatapoints"], ensure_ascii=False)}
    elif "rorDatapointsJson" in record:
         fields["rorDatapointsJson"] = {"stringValue": record["rorDatapointsJson"]}
         
    if "timelineActions" in record:
        fields["timelineActionsJson"] = {"stringValue": json.dumps(record["timelineActions"], ensure_ascii=False)}
    elif "timelineActionsJson" in record:
         fields["timelineActionsJson"] = {"stringValue": record["timelineActionsJson"]}
         
    if "images" in record:
        fields["imagesJson"] = {"stringValue": json.dumps(record["images"], ensure_ascii=False)}
    elif "imagesJson" in record:
         fields["imagesJson"] = {"stringValue": record["imagesJson"]}
         
    if "tags" in record:
        fields["tagsJson"] = {"stringValue": json.dumps(record["tags"], ensure_ascii=False)}
    elif "tagsJson" in record:
         fields["tagsJson"] = {"stringValue": record["tagsJson"]}
         
    return {"fields": fields}

def from_firestore_payload(doc):
    fields = doc.get("fields", {})
    record = {}
    for k, v in fields.items():
        if "stringValue" in v:
            record[k] = v["stringValue"]
        elif "integerValue" in v:
            record[k] = int(v["integerValue"])
        elif "doubleValue" in v:
            record[k] = float(v["doubleValue"])
        elif "booleanValue" in v:
            record[k] = v["booleanValue"]
            
    if "rorDatapointsJson" in record and record["rorDatapointsJson"]:
        try:
            record["rorDatapoints"] = json.loads(record["rorDatapointsJson"])
        except Exception:
            record["rorDatapoints"] = []
    else:
        record["rorDatapoints"] = []
        
    if "timelineActionsJson" in record and record["timelineActionsJson"]:
        try:
            record["timelineActions"] = json.loads(record["timelineActionsJson"])
        except Exception:
            record["timelineActions"] = []
    else:
        record["timelineActions"] = []
        
    if "imagesJson" in record and record["imagesJson"]:
        try:
            record["images"] = json.loads(record["imagesJson"])
        except Exception:
            record["images"] = []
    else:
        record["images"] = []
        
    if "tagsJson" in record and record["tagsJson"]:
        try:
            record["tags"] = json.loads(record["tagsJson"])
        except Exception:
            record["tags"] = []
    else:
        record["tags"] = []
        
    return record

def get_all_firestore_records():
    records = {}
    url = f"{FIRESTORE_URL}?pageSize=300"
    
    try:
        req = urllib.request.Request(url, method="GET")
        with urllib.request.urlopen(req) as response:
            res_data = response.read().decode("utf-8")
            data = json.loads(res_data)
            
            if "documents" in data:
                for doc in data["documents"]:
                    doc_id = doc["name"].split("/")[-1]
                    rec = from_firestore_payload(doc)
                    records[doc_id] = rec
    except Exception as e:
        print("[-] 讀取 Firestore 資料庫失敗:", e)
        
    return records

def upload_to_firestore(record_id, record):
    url = f"{FIRESTORE_URL}/{record_id}"
    payload = to_firestore_payload(record)
    req_data = json.dumps(payload).encode("utf-8")
    
    try:
        req = urllib.request.Request(url, data=req_data, method="PATCH")
        req.add_header("Content-Type", "application/json")
        with urllib.request.urlopen(req) as response:
            return True
    except Exception as e:
        print(f"[-] 上傳記錄 {record_id} 到 Firestore 失敗: {e}")
        return False

def write_id_to_frontmatter(filepath, record_id):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        parts = content.split('---', 2)
        if len(parts) < 3:
            return
            
        frontmatter = parts[1]
        body = parts[2]
        
        lines = frontmatter.splitlines()
        has_id = False
        for i, line in enumerate(lines):
            if line.strip().startswith('id:'):
                lines[i] = f"id: {record_id}"
                has_id = True
                break
                
        if not has_id:
            lines.append(f"id: {record_id}")
            
        new_frontmatter = "\n".join(lines)
        new_content = f"---{new_frontmatter}\n---{body}"
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"[+] 成功寫入 ID 到本機筆記 frontmatter: {os.path.basename(filepath)} -> {record_id}")
    except Exception as e:
        print(f"[-] 寫入 ID 到本機筆記失敗: {e}")

def create_local_markdown_note(folder_path, record):
    bean_name = record.get("beanName", "Unknown Bean")
    roast_date = record.get("roastDate", "2026-06-05")
    record_id = record.get("id", "")
    
    clean_bean = re.sub(r'[\\/*?:"<>|]', "", bean_name)
    clean_bean = clean_bean.replace(" ", "_")
    
    filename = f"{roast_date}_{clean_bean}.md"
    filepath = os.path.join(folder_path, filename)
    
    if os.path.exists(filepath):
        count = 1
        while os.path.exists(os.path.join(folder_path, f"{roast_date}_{clean_bean}_{count}.md")):
            count += 1
        filepath = os.path.join(folder_path, f"{roast_date}_{clean_bean}_{count}.md")
        filename = f"{roast_date}_{clean_bean}_{count}.md"
        
    bean_link = f"[[{bean_name}]]"
    
    tags = record.get("tags", ["coffee/roasting_log", "web_hub_sync"])
    if "coffee/roasting_log" not in tags:
        tags.append("coffee/roasting_log")
    if "web_hub_sync" not in tags:
        tags.append("web_hub_sync")
    tags_str = ", ".join(tags)
    
    frontmatter = f"""---
type: roasting_log
date: {roast_date}
machine: "{record.get('machine', '')}"
bean: "{bean_link}"
charge_mass_g: {record.get('chargeMassG', 0)}
drop_mass_g: {record.get('dropMassG', 0)}
charge_temp: {record.get('chargeTemp', 0)}
tp_temp: {record.get('tpTemp', 0)}
tp_time: "{record.get('tpTime', '')}"
fc_temp: {record.get('fcTemp', 0)}
fc_time: "{record.get('fcTime', '')}"
drop_temp: {record.get('dropTemp', 0)}
drop_time: "{record.get('dropTime', '')}"
dtr_ratio: "{record.get('dtrRatio', '')}"
loss_ratio: "{record.get('lossRatio', '')}"
tags: [{tags_str}]
id: {record_id}
---"""

    timeline_rows = ""
    for act in record.get("timelineActions", []):
        timeline_rows += f"| {act.get('time', '')} | {act.get('temp', '')}°C | {act.get('burner', '')} | {act.get('damper', '')} | {act.get('note', '')} |\n"
        
    ror_rows = ""
    for dp in record.get("rorDatapoints", []):
        ror_rows += f"| {dp.get('timeStr', '')} | {dp.get('beanTemp', '')}°C | {dp.get('ror', '')} | {dp.get('note', '')} |\n"
        
    image_embeds = ""
    for img in record.get("images", []):
        image_embeds += f"![[{img}]]\n"

    recommendations_str = ""
    try:
        local_files = [f for f in os.listdir(folder_path) if f.endswith(".md")]
        rec_count = 0
        for lf in local_files:
            if lf == filename:
                continue
            lf_batch, lf_kws = extract_batch_and_keywords(lf)
            rec_batch, rec_kws = extract_batch_and_keywords(bean_name)
            if lf_kws.intersection(rec_kws):
                note_title = lf[:-3]
                recommendations_str += f"- [[{note_title}]] (共用特徵: `{', '.join(lf_kws.intersection(rec_kws))}`)\n"
                rec_count += 1
                if rec_count >= 5:
                    break
    except Exception:
        pass
                
    if not recommendations_str:
        recommendations_str = "*暫無關聯推薦。*"

    content = f"""{frontmatter}

# ☕ 烘焙日誌：{bean_name} ({roast_date})

## 📊 數據指標與物理常數
- **失重率**: {record.get('lossRatio', '')}
- **發展時間比 (DTR)**: {record.get('dtrRatio', '')} (出豆溫: {record.get('dropTemp', '')}°C, 一爆溫: {record.get('fcTemp', '')}°C)
- **總烘焙計時**: {record.get('dropTime', '')} (一爆點: {record.get('fcTime', '')}, 回溫點: {record.get('tpTime', '')})

## 🔥 實體風火操作設定 (Timeline SOP)
| 時間 | 溫度 (°C) | 火力強度 | 風門強度 | 操作註記與控制目的 |
| :--- | :--- | :--- | :--- | :--- |
{timeline_rows}
## 📈 ROR 升溫率與實體豆溫歷程節點
| 計時 | 豆溫 BT (°C) | 升溫率 ROR (°C/min) | 物理操作與感官觀測 |
| :--- | :--- | :--- | :--- |
{ror_rows}
## 🖼️ 實體手寫日誌與烘焙後熟豆對照
{image_embeds}
---
*本筆記由金成淬科學化烘焙對話庫，根據手寫日誌翻拍照片深度解析生成。*

## 🔗 相關理論與對話推薦
{recommendations_str}
"""

    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"[+] 成功從雲端同步下載並建立 Obsidian 筆記: {filename}")
    except Exception as e:
        print(f"[-] 建立 Obsidian 筆記失敗 {filename}: {e}")

def find_matching_cloud_record(local_info, cloud_records):
    local_date = local_info["date"]
    local_name = local_info["filename"]
    
    local_batch, local_kws = extract_batch_and_keywords(local_name)
    
    for doc_id, cloud_rec in cloud_records.items():
        cloud_date = cloud_rec.get("roastDate")
        if cloud_date != local_date:
            continue
            
        cloud_name = cloud_rec.get("beanName", "")
        cloud_batch, cloud_kws = extract_batch_and_keywords(cloud_name)
        
        if local_batch is not None and cloud_batch is not None:
            if local_batch != cloud_batch:
                continue
        
        overlap = local_kws.intersection(cloud_kws)
        if overlap:
            return doc_id
            
    return None

def main():
    print("==================================================")
    print("☕ Firebase Firestore <-> Obsidian 雙向同步服務啟動")
    print("==================================================")
    
    # 決定路徑
    script_dir = os.path.dirname(os.path.abspath(__file__))
    vault_dir = os.path.dirname(script_dir)
    logs_dir = os.path.join(vault_dir, "02_Roasting_Logs")
    
    if not os.path.exists(logs_dir):
        print(f"[-] 錯誤：找不到本機烘焙日誌資料夾 {logs_dir}")
        sys.exit(1)
        
    print(f"[+] 本機日誌路徑: {logs_dir}")
    
    # 1. 取得全部 Firestore 雲端記錄
    print("[+] 正在與 Firebase Cloud Firestore 連線並拉取雲端數據...")
    cloud_records = get_all_firestore_records()
    print(f"[+] 雲端共找到 {len(cloud_records)} 筆烘焙記錄。")
    
    # 2. 掃描本機 Markdown 日誌
    print("[+] 正在掃描本機 Obsidian 烘焙日誌...")
    local_notes = []
    for f in os.listdir(logs_dir):
        if f.endswith(".md"):
            filepath = os.path.join(logs_dir, f)
            rec = parse_markdown_file(filepath)
            if rec:
                local_notes.append(rec)
                
    print(f"[+] 本機共解析到 {len(local_notes)} 筆有效的烘焙筆記。")
    
    # 3. 進行雙向同步
    local_id_map = {}
    updated_count = 0
    uploaded_count = 0
    
    for note in local_notes:
        note_id = note.get("id", "")
        filepath = note["filepath"]
        
        # A. 若本機筆記沒有 ID，嘗試與雲端現有的記錄進行 fuzzy 匹配
        if not note_id:
            matched_id = find_matching_cloud_record(note, cloud_records)
            if matched_id:
                note_id = matched_id
                note["id"] = note_id
                write_id_to_frontmatter(filepath, note_id)
            else:
                # 無匹配，生成新 ID
                new_id = f"roast_obs_{int(time.time() * 1000)}"
                note_id = new_id
                note["id"] = note_id
                write_id_to_frontmatter(filepath, note_id)
                
        local_id_map[note_id] = note
        
        # B. 檢查雲端是否已有此 ID
        if note_id in cloud_records:
            cloud_rec = cloud_records[note_id]
            # 判斷是否需要更新雲端
            # 如果本機的 ROR / Timeline 長度大於 0，且雲端的對應欄位長度為 0 (或者是剛建好的空白記錄)，則強制將本機的曲線更新上去
            local_has_data = len(note.get("rorDatapoints", [])) > 0 or len(note.get("timelineActions", [])) > 0
            cloud_has_data = len(cloud_rec.get("rorDatapoints", [])) > 0 or len(cloud_rec.get("timelineActions", [])) > 0
            
            # 進行合併：若本機無曲線數據，但雲端有，我們在合併時保留雲端的曲線
            if not local_has_data and cloud_has_data:
                note["rorDatapoints"] = cloud_rec["rorDatapoints"]
                note["timelineActions"] = cloud_rec["timelineActions"]
                note["rorDatapointsJson"] = cloud_rec.get("rorDatapointsJson", "")
                note["timelineActionsJson"] = cloud_rec.get("timelineActionsJson", "")
            
            # 我們比較關鍵的數值，若有不同，或者本機有新資料，則寫回雲端
            # 為求簡便與萬無一失，若本機為最新或是需要寫入，我們一律 PATCH
            if (note.get("beanName") != cloud_rec.get("beanName") or 
                note.get("roastDate") != cloud_rec.get("roastDate") or
                (local_has_data and not cloud_has_data)):
                print(f"[*] 雲端記錄 {note_id} 有欄位差異，正在同步更新到雲端...")
                if upload_to_firestore(note_id, note):
                    updated_count += 1
        else:
            # 雲端沒有此 ID，直接上傳全新記錄
            print(f"[+] 發現本機全新烘焙記錄 {note_id}，正在同步上傳到雲端 Firestore...")
            if upload_to_firestore(note_id, note):
                uploaded_count += 1
                # 將新記錄也加進 cloud_records 以便後面比對
                cloud_records[note_id] = note
                
    # C. 處理雲端有、但本機沒有的記錄 (Cloud -> Obsidian)
    downloaded_count = 0
    for doc_id, cloud_rec in cloud_records.items():
        if doc_id not in local_id_map:
            # 排除 Python test bean 垃圾資料
            if doc_id == "roast_test_python":
                continue
            print(f"[+] 發現雲端新增記錄 {doc_id}，正在同步下載並於 Obsidian 建立筆記...")
            create_local_markdown_note(logs_dir, cloud_rec)
            downloaded_count += 1
            
    print("==================================================")
    print("📊 同步統計結果：")
    print(f" - 本機新增上傳雲端: {uploaded_count} 筆")
    print(f" - 本機修改更新雲端: {updated_count} 筆")
    print(f" - 雲端新增下載本機: {downloaded_count} 筆")
    print("==================================================")
    print("[+] 雙向同步作業順利完成！")

if __name__ == "__main__":
    main()
