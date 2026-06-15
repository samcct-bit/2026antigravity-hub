---
name: sensebar-knowledge-vault-builder
description: YouTube 影片字幕提取與 Obsidian 三層式知識庫（Obsidian Second Brain）構建技能。當使用者需要「下載 @sensebar 影片字幕」、「建立二腦知識庫」、「Obsidian 知識整理」或「sensebar 知識庫」時載入。
conversation_starters:
  - 幫我將 @sensebar 頻道中匹配的 AI Agent 影片字幕下載並整理進知識庫
  - 啟動 Obsidian 三層式知識庫的週整理任務 (Weekly Restructure)
  - 檢查目前 Clipping 資料夾中的字幕，並進行分析與跨筆記引用
model: gemini-3.5-flash
---

# Obsidian 三層式二腦知識庫構建技能 (Sensebar Knowledge Vault Builder)

本技能定義了如何從 YouTube 頻道提取影片自動字幕（VTT 格式），經過 consecutive 滾動行去重、清洗與 H1/H2 排版後，自動建構並維護一個標準的 **Obsidian 三層式個人二腦知識庫 (Obsidian Second Brain)**。

---

## 📁 三層式知識庫架構 (Obsidian Second Brain Architecture)

所有檔案應儲存在 `notes/` 駕駛艙目錄下，並細分為以下三層：

1. **`notes/Clipping/` (外部剪輯層)**：
   * **用途**：存放所有從外部提取的影片字幕 Markdown、網頁剪貼等。
   * **規則**：**嚴禁手動修改此目錄下的 raw 檔案**，保持來源的真實性與完整性。
2. **`notes/創作庫/` (創作發表層)**：
   * **用途**：存放個人撰寫的腳本、教案設計、影片腳本與發表成品。
   * **規則**：此為您的個人資產輸出區。
3. **`notes/知識庫/` (核心知識層 - 由 Agent 自動維護)**：
   * **用途**：存放經過分類、結構化提煉後的永久筆記 (Evergreen Notes)、主題索引與 MOC (Map of Content)。
   * **分類結構**：
     * `AI工作流/`：AI 工具串接、技能編寫與開發日誌。
     * `教學趨勢/`：小學國語、數學教學大綱與素養教育。
     * `學術筆記/`：教育理論、心理學與大模型應用。

---

## 🛠️ 自動化腳本執行指引 (Script Execution)

在虛擬環境 [d:\2026antigravity\.venv](file:///d:/2026antigravity/.venv) 中配置了專屬的 Python 提取程式：

### 1. 影片資訊篩選與 URL 提取
* **指令**：`.venv\Scripts\python sensebar-agent-knowledge-vault-builder\extract_videos.py`
* **功能**：獲取 [@sensebar 頻道](https://www.youtube.com/@sensebar) 的所有影片，匹配關鍵字 (`claude`, `codex`, `antigravity`, `opencode`, `agent`)，並匯出：
  * [sensebar_ai_urls.txt](file:///d:/2026antigravity/sensebar-agent-knowledge-vault-builder/sensebar_ai_urls.txt) (URL 清單)
  * [sensebar_ai_videos.md](file:///d:/2026antigravity/sensebar-agent-knowledge-vault-builder/sensebar_ai_videos.md) (影片表格)

### 2. 字幕下載、滾動重複去重與 Markdown 轉換
* **指令**：`.venv\Scripts\python sensebar-agent-knowledge-vault-builder\download_all_subs.py`
* **功能**：讀取 URL 清單，呼叫 `yt-dlp` 下載 VTT 字幕，並通過**滾動重複去重引擎**去除連續重複句，輸出整潔的 Markdown 檔案至 `subtitles/` 目錄。
* **手動同步**：下載完成後，請將 `subtitles/` 下的檔案複製/移動至 [notes/Clipping/](file:///d:/2026antigravity/notes/Clipping) 中。

---

## 🤖 Agent 知識整理工作流 (Weekly Restructure Workflow)

當使用者啟動「知識庫整理」任務時，請扮演 **Obsidian 知識庫管理專家**，依序執行以下整理流程：

### Step 1: 增量掃描與摘要
1. 讀取 [notes/Clipping/](file:///d:/2026antigravity/notes/Clipping) 資料夾中新加入的字幕 Markdown。
2. 對每一篇影片字幕進行語意提煉，萃取出：
   * **一句話精華 (One-liner Summary)**
   * **三大核心知識點 (Core Takeaways)**
   * **涉及的 AI 軟體 / 工作流工具**
   * **相關的外部 YouTube 影片連結**

### Step 2: 建立與更新「主題筆記」
1. 將提煉出來的知識點歸納到 [notes/知識庫/](file:///d:/2026antigravity/notes/知識庫) 下對應的主題筆記中。
2. 如果是全新的概念，在 `知識庫/` 下建立新的 `.md` 檔案，並在頂部加上主題標籤與時間戳記。
3. 如果是已有的概念，在現有的主題筆記中以 `## [影片標題]` 進行內容增補與更新。

### Step 3: 建立雙向鏈結與跨引用 (Bidirectional Links)
1. 確保每一篇剪輯筆記 (Clipping) 都在頂部鏈結至對應的主題筆記。
2. 檢查主題筆記之間是否存在關聯性，使用 `[[其他主題筆記]]` 建立跨引用，便於 Obsidian 生成完整的 Graph 知識網。

### Step 4: 更新二腦索引與日誌 (Log & Index)
1. 在 [notes/dashboard.md](file:///d:/2026antigravity/notes/dashboard.md) 中記錄本次整理的進度。
2. 在 [notes/workflows_index.md](file:///d:/2026antigravity/notes/workflows_index.md) 的「五、外部服務連線技能」中，增補該知識庫的點擊鏈結。

---
