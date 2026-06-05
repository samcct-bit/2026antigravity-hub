#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re
import sys
import io

# 強制控制台輸出為 UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GREEN_BEANS_DIR = os.path.join(BASE_DIR, "01_Green_Beans")
ROASTING_LOGS_DIR = os.path.join(BASE_DIR, "02_Roasting_Logs")
SCA_THEORY_DIR = os.path.join(BASE_DIR, "04_SCA_Theory")

# 關鍵字清單：用於建立語意卡片深度連結
KEY_TERMS = [
    # 豆種與產區
    '莫札特', '巴哈', '蕭邦', '貝多芬', '藝伎', 'gesha', '橙花', '莓果女王', '沃卡', '肯亞', '巴拿馬', '哥倫比亞', '哥斯大黎加', 'srima', '瑪麗亞', '厭氧', '蜜處理',
    # 熱力學與烘焙物理
    '梅納反應', '焦糖化', 'dtr', '發展比', 'ror', '升溫率', '回溫點', 'tp', '一爆', 'fc', '一爆後', '發展期', '脫水', '轉黃', 'bbp', '盲飛', '排煙', '風門', '火力', '蓄熱', '熱能', '熱傳導', '對流', '輻射', '表溫', '豆芯', '導熱', '梅納', '水蒸氣', '熱慣性', '滑行',
    # 烘豆設備
    'giesen', 'diedrich', 'bullet', '盧貝斯', '楊家', 'tank-200'
]

def main():
    print(f"==================================================")
    print(f"正在執行 SCA 理論卡片 & 烘焙日誌雙向深度連結語意網建立程式...")
    print(f"Obsidian 儲存庫路徑: {BASE_DIR}")
    print(f"==================================================")

    # 1. 蒐集所有 Markdown 檔案
    all_notes = []
    for folder in [GREEN_BEANS_DIR, ROASTING_LOGS_DIR, SCA_THEORY_DIR]:
        if os.path.exists(folder):
            for f in os.listdir(folder):
                if f.endswith(".md"):
                    all_notes.append(os.path.join(folder, f))

    print(f"[+] 共尋找到 {len(all_notes)} 篇筆記檔案。")

    # 2. 建立索引：掃描每篇筆記的關鍵字
    note_terms = {}      # path -> list of terms found
    term_to_notes = {term: [] for term in KEY_TERMS} # term -> list of paths containing it
    note_names = {}      # path -> note name (no ext)

    for path in all_notes:
        note_name = os.path.splitext(os.path.basename(path))[0]
        note_names[path] = note_name

        try:
            with open(path, "r", encoding="utf-8") as f:
                content = f.read().lower()
            
            # 去除 YAML frontmatter 以提高搜尋精準度
            if content.startswith("---"):
                parts = content.split("---", 2)
                if len(parts) >= 3:
                    content = parts[2]

            found_terms = []
            for term in KEY_TERMS:
                if term.lower() in content:
                    found_terms.append(term)
                    term_to_notes[term].append(path)
            
            note_terms[path] = found_terms
        except Exception as e:
            print(f"[-] 讀取失敗: {path} | {e}")

    # 3. 建立雙向深度連結並寫入檔案
    updated_files = 0

    for path in all_notes:
        current_name = note_names[path]
        current_terms = note_terms.get(path, [])
        if not current_terms:
            continue

        # 尋找與本筆記分享最多關鍵字的其他筆記
        related_scores = {} # related_path -> score
        for term in current_terms:
            for related_path in term_to_notes[term]:
                if related_path == path:
                    continue
                related_scores[related_path] = related_scores.get(related_path, 0) + 1

        if not related_scores:
            continue

        # 排序前 5 篇最相關筆記
        sorted_related = sorted(related_scores.items(), key=lambda x: x[1], reverse=True)[:5]
        
        # 建立 markdown 連結區塊
        link_lines = []
        for rel_path, score in sorted_related:
            rel_name = note_names[rel_path]
            shared = [t for t in current_terms if rel_path in term_to_notes[t]]
            shared_str = ", ".join(shared[:3]) # 顯示前三個共用關鍵字
            link_lines.append(f"- [[{rel_name}]] (共用特徵: `{shared_str}`)")

        if not link_lines:
            continue

        links_block = "\n\n## 🔗 相關理論與對話推薦\n" + "\n".join(link_lines) + "\n"

        try:
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()

            # 如果已有連結區塊，先將其切除，以便覆寫更新
            if "## 🔗 相關理論與對話推薦" in content:
                content = content.split("## 🔗 相關理論與對話推薦")[0].strip()

            # 附加新連結
            new_content = content.strip() + links_block

            with open(path, "w", encoding="utf-8") as f:
                f.write(new_content)
            
            updated_files += 1
        except Exception as e:
            print(f"[-] 寫入連結失敗: {path} | {e}")

    print(f"\n==================================================")
    print(f"🎉 雙向深度連結對話網建立完成！")
    print(f"==================================================")
    print(f"[+] 成功嵌入並更新之 Obsidian 筆記: {updated_files} 篇")
    print(f"==================================================")

if __name__ == "__main__":
    main()
