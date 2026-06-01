---
name: antigravity-html-slide-builder
description: |
  給定任何教材（文字、課程大綱、PDF、講義、口述主題），自動生成完整的 Reveal.js HTML 互動簡報並部署至 GitHub Pages。

  自動處理四大視覺/互動強化：
  1. AI 生成背景底圖（調用 AntiGravity 內建 `generate_image` 工具，無須金鑰，儲存至 data-background-image）
  2. 扁平化圖標（使用 `generate_image` 生成總表 + 本地 python 虛擬環境 PIL 裁切去背，取代 emoji）
  3. Firebase 即時互動元件（文字雲、單選投票，Firestore 串接）
  4. 滑桿視覺化演示（clip-path 揭露，適合前後對比內容）

  當使用者說「幫我做 HTML 簡報」「把這份教材轉成互動簡報」「做 Reveal.js 簡報」「做成投影片」「做一份課程簡報」，或提供教材並要求轉成簡報格式時，務必使用此 Skill。即使使用者未明確說「互動」或「HTML」，只要目的是從教材產出可展示的簡報，也應觸發此 Skill。
---

教材 → 分析 → 確認大綱 → 生成 Reveal.js 簡報 → 強化（底圖/圖標/互動/視覺化）→ GitHub Pages 部署

---

## 0. 讀取教材
接受任何形式的輸入：

- **文字 / Markdown**：直接分析
- **PDF**：用 Read 工具讀取（若有多頁先讀摘要頁）
- **口述主題**：自行根據標準教學邏輯設計（引言→概念→範例→互動→結論）

若教材資訊不足，不要詢問，直接用教學慣例補充。

---

## 1. 分析大綱，等使用者確認
分析完畢後輸出大綱表格，**等使用者確認後才繼續**：

```
## 📋 簡報大綱草稿（共 N 頁）

| 頁碼 | 標題 | 內容摘要 | 功能標記 |
|------|------|----------|----------|
| 1    | 封面 | 課程名稱、講師 | [BG] |
| 2    | 破冰提問 | 文字雲收集學員想法 | [INTERACT:wordcloud] |
| 3    | 三大重點 | 並列說明三個核心概念 | [ICON] |
| 4    | 前後對比 | A 方案 vs B 方案演進 | [VIZ] |
...

**功能標記說明**
- [BG] 背景底圖（霓虹暗色風格）
- [ICON] 扁平化圖標（AI生成總表 + PIL 去背）
- [INTERACT:wordcloud] Firebase 即時文字雲
- [INTERACT:poll] Firebase 單選投票
- [VIZ] 滑桿視覺化演示（clip-path）

請確認大綱，或說明要調整的地方。
```

| 標記 | 觸發條件 | 每份簡報目標數量 |
|------|----------|-----------------|
| [BG] | 封面、封底、章節轉換、高衝擊結論 | 3–5 頁 |
| [ICON] | 頁面有 3–6 個並列項目（優缺點、步驟、特性） | 1–3 頁 |
| [INTERACT:wordcloud] | 開場破冰、先備知識調查、課尾反思 | 1 頁（通常第 2 頁） |
| [INTERACT:poll] | 概念確認、意見調查、前測/後測 | 0–1 頁 |
| [VIZ] | 「前後對比」「格式轉換」「A 到 B 的演進」 | 0–1 頁 |

---

## 2. 建立專案目錄與基礎 HTML
使用者確認後：

1. 建立專案目錄：`d:/2026antigravity/public/<簡報英文短名>/` (必須存放在 `public/` 目錄下以供 Pages 託管)
2. 建立 `images/` 子目錄
3. 生成 `index.html`（完整 Reveal.js 骨架）

讀取位於 `d:/2026antigravity/claude-html-slide-builder/skill/references/reveal-template.md` 獲得：完整 CSS 變數、元件樣式、Reveal.js 初始化程式碼。

**命名規則：**
- 專案目錄：kebab-case 英文（`ai-course`、`math-lesson`）
- Firestore 集合：`<slug>_wordcloud`、`<slug>_poll`（避免不同簡報資料混用）

**調色盤（所有簡報統一使用）：**
```css
--accent:  #e8643a;   /* 橘紅（主強調） */
--accent2: #4fc3f7;   /* 青（次強調） */
--success: #81c784;   /* 綠（正面） */
--warn:    #ffb74d;   /* 琥珀（提示） */
/* 背景：     #0d1117 ~ #1a1a2e（深暗色） */
```

---

## 3. 生成背景底圖 [BG]
對於每個標記為 `[BG]` 的頁面，直接調用 AntiGravity 內建的 `generate_image` 工具進行免金鑰生圖：
* **Prompt 格式**：`deep navy background, glowing neon [主題相關描述] nodes and light trails, cinematic wide, dark cyber theme, no text, abstract tech art`
* **ImageName 命名**：`<簡報slug>_bg_<頁碼>`
* **儲存目標目錄**：`d:/2026antigravity/public/<簡報slug>/images/`

在 HTML section 加上：
```html
<section data-background-image="images/<slug>_bg_<頁碼>.png"
         data-background-opacity="0.15"
         data-background-size="cover">
```
*透明度建議：封面 0.3–0.4；一般頁 0.12–0.18。*

---

## 4. 圖標系統生成與去背 [ICON]

### 4-1 生成圖標總表
呼叫 `generate_image` 生成圖標總表：
* **Prompt 格式**：`A clean icon sheet with exactly N flat neon icons in a single horizontal row on pure dark navy (#0d1117) background. [從左至右逐一簡單描述每個圖標，如：gear, lightbulb, laptop]. Each icon large, bold, centered in equal column, no text.`
* **ImageName**：`icon_sheet`
* **儲存路徑**：`d:/2026antigravity/public/<簡報slug>/images/icon_sheet.png`

### 4-2 本地 .venv 裁切
在 AntiGravity 本地虛擬環境 `.venv` 下執行 Python 程式碼，將總表等分裁切為 `icon_0.png`、`icon_1.png` 等個別檔案：

```python
from PIL import Image
from pathlib import Path

img = Image.open("d:/2026antigravity/public/<簡報slug>/images/icon_sheet.png").convert("RGBA")
w, h = img.size
n = <圖標數量>
icons = ["icon_0", "icon_1", ...]  # 命名清單

for i, name in enumerate(icons):
    x0 = i * (w // n)
    x1 = (i + 1) * (w // n) if i < n-1 else w
    col_w = x1 - x0
    sq = min(col_w, h)
    cx, cy = x0 + col_w // 2, h // 2
    crop = img.crop((cx-sq//2, cy-sq//2, cx+sq//2, cy+sq//2))
    crop = crop.resize((256, 256), Image.LANCZOS)
    crop.save(f"d:/2026antigravity/public/<簡報slug>/images/{name}.png")
```

### 4-3 本地 .venv 亮度去背
呼叫本機 `.venv` 執行去背腳本（路徑：`d:\2026antigravity\claude-html-slide-builder\skill\scripts\remove_bg.py`）：

```powershell
d:\2026antigravity\.venv\Scripts\python.exe d:\2026antigravity\claude-html-slide-builder\skill\scripts\remove_bg.py --dir d:\2026antigravity\public\<簡報slug>\images
```

### 4-4 嵌入 HTML
- 用 `<img src="images/icon_x.png" class="slide-icon">` 取代 emoji
- adv-card 統一用 `border-top: 4px solid var(--accent2)` + `text-align: center`
- 圖標 img 加 `filter: drop-shadow(0 0 10px rgba(79,195,247,0.6))`

---

## 5. 互動元件 [INTERACT]
讀取 `d:/2026antigravity/claude-html-slide-builder/skill/references/firebase-config.md` 獲得完整的文字雲和單選投票 HTML/JavaScript 片段。

**通用原則：**
- 互動 section 加 `id="slide-<slug>"`
- 使用 `Reveal.on('slidechanged', e => { if (e.currentSlide?.id === '...') { /* 重新連接或重繪 */ }})` 確保切頁後正確渲染。
- Firestore 集合命名：`<簡報slug>_wordcloud` / `<簡報slug>_poll`
- 樣式：配合暗色主題，輸入框 `background: rgba(255,255,255,0.08)`

---

## 6. 視覺化演示 [VIZ]
利用 clip-path 滑桿揭露效果，實作前後對比（CSS/JS 代碼詳見 reveal-template.md）。

---

## 7. 部署到 GitHub Pages
因為整個專案 `2026antigravity-hub` 已是公開 GitHub 儲存庫並啟用了 Pages 服務，生成的簡報位於 `public/<簡報slug>/index.html` 下。
在簡報全部生成並手動測試確認正常後，可執行 Git 推送：

```powershell
git status
git add public/<簡報slug>
git commit -m "feat: add slide <簡報中文名稱>"
git push origin master
```

回傳給使用者：
```
✅ 簡報已部署！
🔗 點擊預覽簡報：https://samcct-bit.github.io/2026antigravity-hub/public/<簡報slug>/index.html
（首次推送後約 1–3 分鐘生效）
```
