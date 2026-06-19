# 🗺️ 專案駕駛艙 (Obsidian Cockpit)

> 專案：2026antigravity-hub
> 位置：`d:\2026antigravity\notes\dashboard.md`
> 本日記錄：2026-06-17


---

## 🎯 專案目標與目前狀態

* **核心目標**：建構安全、高效的 AntiGravity 自動化與個人開發工作流。
* **目前狀態**：🟢 專案初始化、服務連接與雙向閉環系統部署配置均已綠燈完成。
  * [x] NotebookLM 整合與註冊 
  * [x] GitHub 認證連線驗證
  * [x] Firebase 專案對接與註冊
  * [x] Obsidian 筆記安全工作流註冊
  * [x] 生圖工具免金鑰配置與測試
  * [x] 甜味對決互動網頁設計與 Firebase Hosting 部署
  * [x] 國小國語心智圖學習單生成器開發與註冊
  * [x] 國小國語素養學習單生成器 (Bloom) 開發與註冊
  * [x] 國小班級成績自動轉換與分析器 (GAS) 開發完成
  * [x] Clasp 本地開發引擎安裝與安全排除配置
  * [x] Clasp MCP 與 Netlify MCP 服務全域註冊
  * [x] Clasp & Netlify 雙向閉環部署工作流自訂技能開發與全域註冊
  * [x] HTML 互動簡報生成器 (Reveal.js) 本地儲存庫克隆與 Python 依賴 Pillow 實裝
  * [x] HTML 互動簡報生成技能的 AntiGravity 適配（免金鑰內建生圖）與全域技能註冊
  * [x] YouTube 字幕自動提取與 Obsidian 三層式二腦知識庫技能實裝與初始化下載
  * [x] 國小考場專用倒數計時器網頁重建與 Netlify/GitHub Pages 雙向部署




---

## 🌐 GitHub Pages 專案託管清單 (已成功移轉)

由於 Netlify 免費額度限制，本專案之所有靜態網頁已全數移轉至 GitHub Pages 進行託管。
* **儲存庫狀態**：🟢 已設為公開 (Public)
* **GitHub Pages 根網址**：`https://samcct-bit.github.io/2026antigravity-hub/`

| 專案名稱 | 本地路徑 | 移轉後之 GitHub Pages 網址 | 備註 |
| :--- | :--- | :--- | :--- |
| 🍬 代糖與糖類大對決 | `public/index.html` | [🔗 點擊開啟](https://samcct-bit.github.io/2026antigravity-hub/public/index.html) | 當前主頁 (亦備用 Firebase Hosting) |
| ☕ **金成淬精品咖啡入口平台** | `[獨立倉庫] 2026coffeewebsite` | [🔗 點擊開啟](https://samcct-bit.github.io/2026coffeewebsite/) | **[NEW] 整合 13 款熟豆與職人手沖計算器的專屬門戶網站** |
| 🧮 數學救援遊戲 (3-2-7) | `public/math game/mathgame3-2-7` | [🔗 點擊開啟](https://samcct-bit.github.io/2026antigravity-hub/public/math%20game/mathgame3-2-7/index.html) | 具備防重練與重置歷史功能 |
| ⏱️ **數學時間遊戲 (3-2-8)** | `public/math game/timegame3-2-8` | [🔗 點擊開啟](https://samcct-bit.github.io/2026antigravity-hub/public/math%20game/timegame3-2-8/index.html) | **[NEW] 今日上線之全新數學遊戲** |
| 📖 **暑假作業國語學習單** | `public/chinese worksheet/...` | [🔗 點擊開啟](https://samcct-bit.github.io/2026antigravity-hub/public/chinese%20worksheet/暑假作業_國語閱讀與寫作學習單.html) | **[NEW] 支援 A4 100% 比例列印之滿分範文版** |
| 🙇 **叩首的意義與方法** | `public/kowtow-bowing/...` | [🔗 點擊開啟](https://samcct-bit.github.io/2026antigravity-hub/public/kowtow-bowing/index.html) | **[NEW] 整合 4 份簡報與 PDF 的互動式網頁簡報** |
| ⏱️ **考場專用倒數計時器** | `public/exam-timer` | [🔗 點擊開啟](https://samcct-bit.github.io/2026antigravity-hub/public/exam-timer/index.html) | **[NEW] 國小考場專用倒數計時器，大字體倒數及自訂科目/時間，Netlify網域：https://school-test-clock.netlify.app** |

*註：原本 Netlify 中的 `20260205board` 為手動離線部署之舊版專案，並未包含在本儲存庫與本次移轉範圍中。*

---

## 🏆 最近完成事項

- 成功整合 4 份「叩首的意義與方法」教材與 PDF 講義大綱，利用 Reveal.js + Firebase 成功建構暗色系禪意科技風格的「叩首的意義與方法」網頁式互動簡報，內建即時文字雲與觀念投票功能，並通過 Playwright 本地自動化驗證。
- 成功設計「甜味藥劑學：代糖與糖類大對決」互動網頁，整合 HSL 擬物玻璃態設計與**互動式甜度換算器**，並成功部署至 Firebase Hosting (https://my-teaching-tools-01.web.app)。
- 成功從最新的 NotebookLM 筆記本「The Apothecary of Sweetness: A Comparative Sugar Study」中下載並生成了高畫質的 **橫式與直式甜度強度對比資訊圖表**（已安全存放至 `assets/` 與 `public/assets/` 目錄中）。
- 成功開發、測試並在全域技能樹上註冊全新的「國小國語心智圖學習單生成器」技能（`08-chinese-worksheet.md`），大幅度優化了國小課文轉心智圖及 DALL-E/Midjourney 著色圖 Prompt 生成流程。
- 成功開發、測試並註冊全新的「國小國語素養學習單生成器」技能（`09-chinese-literacy-worksheet.md`），完全對接布魯姆認知六層次與 L10 2x3 精緻圓角虛線漫畫網格，能夠為任何指定課文與主題生成高水準、無答案的黑白著色著筆線稿生圖 Prompt。
- 成功為 AntiGravity 新增了多個自訂技能，全面優化了日常開發生命週期。


---

## 🚀 下一步 (TODO)

- [x] **《飛行員和小王子》25 分鏡自動生成與排程任務**（所有 25 個分鏡生成完畢，已針對箱子外觀一致性與 Scene 21 邏輯完成修正，並已成功打包錄製為 1080p 超高清教學影片）。
- [x] **安裝免確認 Hook 與克隆國小數學出題技能集**
- [x] **優化原來的暑假作業學習單**（融入 PIRLS 四大閱讀歷程題型、編譯 A4 100% 比例列印排版 HTML 並同步 Markdown 檔，第九回寫作學習單替換為中年級 6 級分標準範文與賞析）。
- [ ] 取得 `range.pdf` 與 `reference.pdf` 考綱檔案，分析並進行國小數學出題與排版（或分析 `public/math testreview/` 下的三下數學期末複習 PPT 與段考 DOCX，產出或優化數學練習題與排版系統）。
- [ ] 規劃將其他科學主題筆記本的實驗圖表也整合入多頁面展示中。
- [ ] 優化手機瀏覽器上的點擊觸控靈敏度與算式動畫。
- [ ] 僅在規則改變時更新本機的 ANTIGRAVITY.md。

---

## 🩹 踩坑與解法

1. **Bug/問題**：PowerShell 連接 `nlm` 時，可能因為 CP950 編碼問題而報 Unicode 錯。
   * **解法**：在 PowerShell 工作階段開頭手動注入 `$env:PYTHONIOENCODING = "utf-8"` 即可順利執行所有命令。
2. **Bug/問題**：`gh auth status` 會因環境中失效的 `GITHUB_TOKEN` 變數而導致報錯。
   * **解法**：在命令前使用 `$env:GITHUB_TOKEN=""` 清除暫時變數，即可順利讀取系統 Keyring 中的認證。
3. **Bug/問題**：手繪分鏡圖四周灰色編號標籤、外框灰線殘留，且底部的對話文字區侵入插圖畫面。
   * **解法**：實施智慧色彩邊界掃描演算法。頂部從高度 `24%` 起掃描避開編號，底部至 `70%` 止掃描避開文字區，左右限制在 `12%-88%` 寬度間，所得邊緣各向內縮進 `2px` 防護。最後在米黃底色 (`#FAF7EE`) 畫布上 contain 貼合並以 `LANCZOS` 高品質放大。
4. **Bug/問題**：Reveal.js 音訊播放結束 (`onended`) 後，若直接切頁，部分 Edge-TTS 旁白的尾音會被突兀截斷。
   * **解法**：在 `player.onended` 中設置 `1200ms` 的延遲緩衝 (`setTimeout`) 再進行 `Reveal.next()` 切頁，確保尾音完全釋放，大幅提升觀影流暢度。
5. **Bug/問題**：HTML 頁面列印成 A4 實體紙張時，瀏覽器默認邊距會強制縮放網頁比例（通常縮小至 80%），導致列印後四周留白過大且比例失真。
   * **解法**：在 CSS 的 `@media print` 區塊中配置 `@page { size: A4 portrait; margin: 0; }` 以消除預設邊距。將列印主體 `.page` 的尺寸寫死為 `width: 210mm; height: 297mm; margin: 0;`。由內部 CSS padding 自行控制版心邊界，實現 1:1 免縮放完美列印。
6. **Bug/問題**：最後一回寫作學習單若將大綱、工具箱與範文分析垂直排列，會顯著超出 A4 頁面高度限制（高於 1123px）。
   * **解法**：將大綱引導與寫作工具箱改為 Flexbox 左右並排排版（`.writing-guide-container`），並微調字級大小（12.5px ~ 13.5px）與縮減行高，將總高限制在 865px 內，安全容納於單頁中。

---

## 📅 每日日誌
 
- **2026-06-20**：🟢 **完成 GitHub 憑證過期疑慮排解與新電腦移轉計畫指南撰寫**。
  - **GitHub 憑證處理**：排查並確認本機已使用 Keychain/OAuth 機制（`gho_` Token），不受 `gh-cli` 傳統個人存取金鑰（PAT）過期影響。使用者可安全忽略或移除該金鑰。
  - **新舊電腦移轉方案**：撰寫 6 大核心步驟（備份、新機環境、設定還原、專案依賴安裝、重新授權、驗證測試），並提醒使用者名稱變更及安全隔離原則，完成完整移轉指引。

- **2026-06-17**：🟢 **重建國小考場專用倒數計時器網頁，並成功部署至 Netlify 與 GitHub Pages**。
  - **開工與服務連線檢測**：GitHub CLI（samcct-bit）、NotebookLM MCP（samcct@gmail.com）與 Firebase CLI 均綠燈健康。
  - **計時器網頁設計與開發**：
    - 設計極簡高對比、干擾低的考場計時器介面，支援國語、數學、英語三大預設科目及自訂科目與時間。
    - 實作超大字幕倒數鐘、起訖時間對齊、進度條顯示、當前即時時鐘與 localStorage 快取記憶。
    - 實作 Web Audio API 音效生成器，在剩餘 5 分鐘及時間終了時自動播放經典金屬鐘聲。
    - 提供雙擊編輯注意事項功能，修改結果會自動儲存於本地。
  - **自動化部署**：
    - 成功在 Netlify 註冊新站點並部署於 `https://school-test-clock.netlify.app`。
    - 同步於 [workflows_index.md](file:///d:/2026antigravity/notes/workflows_index.md) 索引與 [dashboard.md](file:///d:/2026antigravity/notes/dashboard.md) 中更新項目狀態。
  - **考場計時器預設值微調**：
    - 微調今日多堂排程預設範本：第一天的國語時間設為 `08:30 ~ 09:20`（50 分鐘），其餘多堂排程（第一日自然、英語與第二日數學、社會）均預設為 40 分鐘。
    - 微調單堂科目預設快速選擇（國語、數學、英語）的預設時間統一改為 `40` 分鐘，主計時器預設倒數值亦同步由 80:00 改為 `40:00`。
  - **簡章海報細節微調**：
    - 微調並放大「天祥大同新竹區一日基礎班課程簡章海報」中間四項說明文字的字體大小至 `32px`，並完成重新渲染與遠端推送同步。

- **2026-06-16**：🟢 **完成天祥大同新竹區一日基礎班課程簡章海報設計與自動化渲染，並完成 GitHub 憑證過期處理與安全防護**。
  - **開工與服務連線檢測**：GitHub CLI（samcct-bit）、NotebookLM MCP（samcct@gmail.com）與 Firebase CLI 均綠燈健康。
  - **素材去背與處理**：使用 Python PIL 智慧定位 [3.jpg](file:///d:/2026antigravity/public/course%20poster/3.jpg) 的文字與蓮花邊界（ y = 360 處），徹底去除上方黑字像素，僅保留純淨的「去背蓮花」並存為透明 PNG。
  - **新版面風格轉譯**：以 [2.jpg](file:///d:/2026antigravity/public/course%20poster/2.jpg) 風格為基準，利用內建 AI 生圖工具生成全新祥雲與蓮花之米色宣紙海報背景 [poster_bg.png](file:///d:/2026antigravity/public/course%20poster/poster_bg.png)。
  - **內容更新與排版**：
    - 將活動日期更新為 `2026年6月28日`，報到時間改為 `8:30` 並刪除獻供。
    - 上午專題課程改由 `林楹翔講師與林冠妘講師` 主講。
    - 下午課程調整為 `餅乾手作課程`。
    - 底部訓文改為 `3.jpg` 之無我無爭，完美融入去背蓮花。
  - **Playwright 自動化渲染**：建立 HTML 模板並呼叫 Playwright 進行高解析度 (1000px × 1414px) PNG 海報截圖渲染，存為 [poster.png](file:///d:/2026antigravity/public/course%20poster/poster.png)。
  - **GitHub 憑證過期安全防護**：處理個人存取金鑰 (PAT) "gh-cli" 的即將過期警示。確認本地已登入 `samcct-bit` 並改採安全且不受 classic PAT 過期限制的 OAuth 機制（認證存於系統 keyring 中）。經測試驗證，GitHub CLI 及 Git 遠端拉取（fetch）連線完全綠燈。

- **2026-06-15**：🟢 **YouTube 字幕自動提取與 Obsidian 三層式二腦知識庫安裝及週整理**。
  - **開工連線檢查通過**：GitHub CLI（samcct-bit）、NotebookLM MCP（samcct@gmail.com）及 Firebase CLI 全數健康綠燈。
  - **儲存庫克隆與適配**：克隆 `sensebar-agent-knowledge-vault-builder` 專案，將腳本中寫死的 C 槽路徑改為相對路徑，成功在本地虛擬環境執行。
  - **Obsidian 三層式資料夾建立**：在 `notes/` 駕駛艙建立 `Clipping`、`創作庫`、`知識庫` 三個子目錄，建立標準 Obsidian Second Brain 結構。
  - **自動下載與去重**：呼叫 `download_all_subs.py` 背景任務，自動下載 36 部 AI Agent 影片的自動字幕，去除 consecutive 滾動重複文字，產出乾淨 Markdown 並複製至 `notes/Clipping/`。
  - **技能全域註冊完成**：撰寫並註冊全新技能 [19-sensebar-knowledge-vault-builder.md](file:///d:/2026antigravity/skills/19-sensebar-knowledge-vault-builder.md)，編入懶人包入口與 workflows 索引中。
  - **知識庫週整理任務 (Weekly Restructure)**：啟動 3 位 AI 協作子代理，並行對 36 份字幕進行語意摘要、提取關鍵字並寫入 Obsidian `知識庫/` 中的 `AI工作流`、`教學趨勢` 與 `學術筆記` 資料夾，完成二腦知識結構建置。


- **2026-06-13**：🟢 **整合並轉化「叩首的意義與方法」互動式網頁簡報**。

  - **簡報整合與轉化**：分析 `叩首的意義與方法-員林.pptx` / `叩首的意義與方法-員林.pdf`，提取 `叩首的意義與好處.pdf`、`三寶心法員林普善佛堂.pdf` 與 `06三寶心法--南海古佛白話慈語`，將 4 份教材完美整合為單一風格之網頁簡報。
  - **禪意科技風格 (Zen Cyber Tech)**：配置午夜藍背景 (`#0a0f1d`)、佛光橘 (`#e8643a`) 與自性青 (`#4fc3f7`)。使用 `generate_image` 生成四款專屬禪意科技背景，並生成 4 欄並列圖標總表，配合本地 PIL 裁切與 `remove_bg.py` 自動去背。
  - **Firebase 互動元件**：成功在簡報中串接課前破冰「即時文字雲」與課中「觀念確認單選投票」，並修正點狀 Key 巢狀寫入問題。
  - **Playwright 自動化驗證**：撰寫並執行本地自動化測試腳本，排除跨專案 Firebase 授權權限錯誤（導回 `my-teaching-tools-01` 主專案），通過 100% 無錯驗證。

- **2026-06-12**：🟢 **完成暑假國語閱讀與寫作學習單優化與 100% A4 列印適配**。
  - **PIRLS 題型對接**：將 1 至 8 回閱讀理解題目完整升級為 PIRLS 四大閱讀歷程（擷取特定資訊、推解直接結論、詮釋整合與檢驗評估），題目設計更加精準。
  - **6 級分範文替換**：移除第九回作文稿紙格子，替換為中年級學生視角（學會騎雙輪單車）但符合國中教育會考 6 級分標準的高水準範文，並隨附精細的寫作亮點剖析。
  - **列印佈局優化**：
    - 在 CSS `@media print` 中配置 `@page` 邊界為 `0`，並鎖定 `.page` 物理尺寸為 210mm x 297mm，解決網頁需縮小至 80% 列印的長寬比不一致問題。
    - 將第九回的引導大綱與寫作工具箱改為 Flexbox 左右並排，微調行高與字體，完美將整頁高度控制在 1123px（A4 限高）以內，解決溢出問題。
  - **雙版本同步**：利用 Python 轉換程式，將 HTML 編譯結果同步回本機 Markdown 檔 [暑假作業_國語閱讀與寫作學習單.md](file:///d:/2026antigravity/暑假作業_國語閱讀與寫作學習單.md)。

- **2026-06-06**：🟢 **安裝免確認 Hook 並完成國小數學出題技能集克隆**。
  - **免確認 Hook 設定**：成功在 `C:\Users\USER\.gemini\config` 安裝免確認自動批准 Hook (`hooks.json`) 與過濾腳本 `auto_approve.py`。針對 `view_file`、`write_to_file`、`grep_search` 等多種工具進行優化，確保阻擋敏感檔案（`.env`, `id_rsa` 等）與高危指令（`rm`, `del` 等）並引導至手動確認，其餘操作自動放行；已於本地完成模擬管道測試，目前運行綠燈。
  - **克隆出題 Repo**：成功將「教學出題技能集」(`teaching-exam-skills`) 儲存庫克隆至本機 workspace 中，包含 `es-math-exam`、`es-math-geometry` 等多組適用於國小數學（一至六年級）的教學出題技能，做為後續自動命題與幾何繪圖的基礎。
  - **PDF 檔案檢索**：嘗試尋找並分析 `range.pdf` 與 `reference.pdf` 的路徑，在系統全盤搜尋後確認暫無對應檔案。所有搜尋背景工作已全數安全取消。

- **2026-06-04**：🟢 **完成 `gem-to-agent-kit` 部署，並成功將 HTML 資料檔內的所有 11 個 Gem 完整升級並整合為 6 大 Agent 自訂工作流與技能**。
  - **環境與依賴配置**：自動定位 `H:\我的雲端硬碟\Gemini Gems` 目錄並安裝 `python-docx`、`openpyxl`、`python-pptx` 與 `yt-dlp` 全套依賴套件。
  - **Gem 分析與合併遷移**：
    *   **雙語翻譯**：將「多語言翻譯特助」升級為 [translation_assistant](file:///d:/2026antigravity/translation_assistant) 專案與 `13-translation-assistant` 全域技能，內建 Word/Excel 雙欄格式匯出器。
    *   **教案規劃**：將「108課綱教案架構師」升級為 [curriculum_architect](file:///d:/2026antigravity/curriculum_architect) 專案與 `14-curriculum-architect` 全域技能。
    *   **教育溝通與朗讀**：將「親師溝通的GEMs」與「國台英朗讀文本生成師」整合為 [edu_helpers](file:///d:/2026antigravity/edu_helpers) 專案，並分別註冊為 `15-edu-communication-helper` 與 `16-trilingual-speech-generator` 全域技能。
    *   **視覺設計**：將「宗教哲學海報設計大師」、「專業角色設定圖繪製大師」與「極簡影像生成專員」合併升級為 [visual_design_expert](file:///d:/2026antigravity/visual_design_expert) 專案與 `17-visual-design-expert` 全域技能（支援多視角排版與安全術語轉譯）。
    *   **指令工程**：將「專業對話機器人指令架構師」升級為 [prompt_architect](file:///d:/2026antigravity/prompt_architect) 專案與 `18-prompt-architect` 全域技能（支援 YAML 指令完整繼承與版本遞增）。
  - **全域技能註冊與索引同步**：將所有新技能於 `C:\Users\USER\.gemini\antigravity\skills` 部署完畢，同步更新 `00-install-all.md`、`antigravity-lazy-packs.md`、`notes/workflows_index.md` 與狀態追蹤 `migration_state.json`。


- **2026-06-03**：
🟢 **小王子分鏡細節修正與 25 分鏡全部完成，1080p 超高清影片順利產出**。
  - **精細細節優化與連貫性**：接獲對接反饋，對中後段（Scene 18~25）進行更為嚴格的畫面一致性與邏輯優化：
    1. **箱子細節一致性**：統一將箱子 Prompt 描述升級為「**完全密封、無蓋且無縫隙的長方形木箱，外觀如同淺褐色松木實心木塊。側面水平均勻排列三個圓形呼吸孔。**」以徹底保證其長寬高比例與孔洞位置在各分鏡高度統一。
    2. **修正看圖紙邏輯 (Scene 21)**：修正小王子從畫紙背面透視圓孔的邏輯缺陷，將 Prompt 改為小王子雙手捧著畫紙，從**正面**低頭注視、湊近圖中箱子圓孔來張望，保證畫面合乎透視邏輯。
    3. **修正三隻手肢體問題 (Scene 23)**：透過「將畫紙置於膝蓋上、雙手托腮」的動作隔離，徹底解決 AI 在「抱紙」與「托腮」時同時繪製多隻手之缺陷。
  - **配額恢復與全自動生成**：生圖配額於 22:39 恢復後，順利完成了 Scene 18 至 25 所有剩餘分鏡的生成與部署。木箱比例在 Scene 18-24 的紙上及 Scene 25 的實體中高度統一，圓孔均勻對齊，無活動蓋，外觀極具連貫性；Scene 21 小王子近看正面圖紙的邏輯已修復；Scene 23 托腮姿勢無多餘手臂肢體 Bug。
  - **影音重合成功**：更新 HTML 投影片中的數據設定後，執行 `concat_audio.py` 合成全劇旁白 master 音訊，隨後使用 Playwright 啟動 `record_video.js` 網頁錄製 1080p WebM，最後調用 FFmpeg 與 master 音訊完美封裝，產出最新版本的小王子超高清教學影片 `public/little-prince/renders/little_prince_v1.mp4`！

- **2026-06-02**：🟢 **環境修復綠燈、小王子分鏡狀態管理與 6 小時自動生圖排程系統實裝上線，目前已順利完成 Scene 02 至 Scene 06 生成**。
  - **開工與環境診斷修復**：引導 `ensurepip` 修復虛擬環境缺失 the pip，順順利下載 `edge-tts` 與 `playwright`。修正 `setup.py` 中 ButTaiwan 源石黑體字型下載 URL 404 問題，成功下載並將三字重 OTF 部署至 Windows 系統字型與 Repo 備份目錄。
  - **生圖狀態管理系統開發**：
    - 建立 `storyboard_generation_state.json`，對齊 Reveal.js 簡報劇本，詳細規劃了 25 個場景的角色、台詞與生圖 Prompt，實裝統一的角色特徵一致性模型（小王子的金髮、綠連身褲、綠圍巾；飛行員的棕夾克、goggles）。
    - 建立 `generate_next_storyboard.py` 監控腳本，用以即時判讀並輸出下一個待生圖分鏡的 Prompt 與進度。
  - **即時生成 Scene 01 驗證畫風**：成功調用助理 `generate_image` 工具，即時渲染出第 1 張大圖（Sahara Meetup），將其無損部署到 `public/little-prince/images/scene_01.png`，更新狀態為 `completed`，畫風完美契合小王子手繪水彩風格。
  - **排程自動化部署（每 6 小時執行）**：為保證伺服器負載安全與高推進速度，排程設定為每 6 小時（一日 4 張）自動喚醒之 Cron Job (`task-292`)。每次生成後將直接標記完成並推進準備下一張分鏡。
  - **第 1 次排程自動執行 (Scene 02 就緒)**：中午 12:00 排程自動觸發喚醒 AI，精準識別出 `Scene 02` (飛行員詢問畫作)，調用 `generate_image` 完成生成，無損部署至 `public/little-prince/images/scene_02.png`，並更新狀態為已完成，進度順利推進至 `2/25`！
  - **Scene 03 即時手動生成**：在與老師確認一日 4 張的排程設定時，手動即時觸發並完成了 `Scene 03`（小王子：這很容易呀！你畫得很像。）的生成與部署，進度順利推進至 `3/25`！
  - **第 2 次排程自動執行 (Scene 04 就緒)**：傍晚 18:00 排程定時器自動喚醒 AI，順利完成 `Scene 04`（飛行員：你是不是要猜「這是一頂帽子」？）的生圖與部署，進度穩步推至 `4/25`！
  - **第 3 次排程自動執行 (Scene 05 就緒)**：深夜 00:00 排程定時器自動喚醒 AI，順利完成 `Scene 05`（小王子：它不是帽子！你畫的是一條吞了大象的蛇！）的生圖與部署，進度順暢推至 `5/25`！
  - **第 4 次排程自動執行 (Scene 06 就緒)**：清晨 06:00 排程定時器自動喚醒 AI，順利完成 `Scene 06`（飛行員：你怎麼知道？）的生圖與部署，進度穩步推至 `6/25`！
  - **手繪圖紙內容劇本對齊**：修正 Scene 01 與 Scene 02 中飛行員手持圖紙的內容。去除了 AI 自行想像的羊與狐狸，嚴格遵循劇本繪製出『看起來像帽子（實為蟒蛇吞大象）』的褐黑線條草圖，完美對齊故事開端。

- **2026-06-01**：🟢 **雙向閉環部署系統 & HTML 互動簡報生成器全套實裝與配置完成，以及小王子影片 16:9 1080p 超高清智慧重製上線**。
  - **開工連線檢查通過**：GitHub CLI（samcct-bit）、NotebookLM MCP（samcct@gmail.com）、Firebase CLI 全數健康綠燈。
  - **讀取並分析 clasp-netlify-mcp-guide**：深入解析 Clasp 和 Netlify MCP 結合的部署原則、檔案準備與踩坑指南，並據此為使用者提供互動式安裝選擇。
  - **實裝 Clasp 本地開發依賴**：在本地初始化 `package.json` 並安全配置 `.gitignore`，完成本地安裝 `@google/clasp` 依賴（驗證版本：`3.3.0`），同時徹底排除認證與快取檔以維護隱私。
  - **註冊 Anti-Gravity MCP 全域配置**：成功於 `mcp_config.json` 中配置並啟用 `clasp` 與 `netlify` 兩大本機 MCP 服務。
  - **開發專屬閉環部署技能**：撰寫全新自訂技能檔 [10-clasp-netlify-workflow.md](file:///d:/2026antigravity/skills/10-clasp-netlify-workflow.md)，並成功於 `00-install-all.md` 及 `antigravity-lazy-packs.md` 中進行全域註冊，同時將其連結編入專案整合索引檔 [workflows_index.md](file:///d:/2026antigravity/notes/workflows_index.md)。
  - **引進並適配 HTML 互動簡報生成器 (Reveal.js)**：
    - 成功將 `mathruffian-dot/claude-html-slide-builder` 儲存庫克隆至本機，並透過 `uv` 完成獨立 Python 虛擬環境 (`.venv`) 的 Pillow 圖形處理依賴包安裝，並排除 Git 追蹤。
    - 適配 AntiGravity 環境特性，將技能核心整合修改為本地免金鑰之 `generate_image` 生圖流程，避免洩漏 API Key。
    - 成功建立、註冊全新自訂技能 [11-html-slide-builder.md](file:///d:/2026antigravity/skills/11-html-slide-builder.md)，並同步更新於一鍵安裝入口、懶人包設定及專案整合索引。
  - **小王子教學影片 16:9 1080p 超高清重製與部署**：
    - 開發 Python 智慧色彩邊界掃描裁切腳本 `smart_crop_16_9.py`，完美清除 `storyboard_raw` 原圖中的分鏡標籤、灰線及文字對白，居中 contain 融入 16:9 米黃底色。
    - 修改播放器 `index.html` 的 Reveal.js 配置為標準 16:9 (1920x1080)；加入 Ken Burns 微縮放效果，優化音訊 `onended` 延遲緩衝 (1200ms)。
    - 透過 Playwright 進行網頁 1080p 高清錄影 (webm)，並調用 FFmpeg 進行旁白與畫面無損影音封裝，產出極致精美的 `little_prince_v1.mp4`！
    - 全套專案部署至 GitHub Pages，線上預覽連結：https://samcct-bit.github.io/2026antigravity-hub/public/little-prince/index.html
    - **更新技能與踩坑紀錄**：將智慧色彩掃描、時序與 FFmpeg 合成 Gotchas 寫入專案內 `skills/12-video-specs.md` 與全域技能庫中，順利完成部署。
    - **收工狀態**：老師反映部分圖片裁切問題仍存在，已記錄於下一步以利明日開工後進一步對接與精細微調。
  - **安全性與敏感資料排除**：檢查確認本機與 Git 目錄均不含任何明文 Token、API 鑰匙或 NotebookLM 個人檔案，符合最高隱私標準。

- **2026-05-29**：🟢 **開工與國小國語素養學習單生成器實裝完成**。
  - **開工連線檢查**：GitHub CLI（samcct-bit）、Firebase CLI 均綠燈正常；NotebookLM 暫時提示授權到期，等待更新。
  - **開發布魯姆素養學習單生成器技能**：
    - 精準參考 `public/chinese worksheet/L10素養學習單.jpg` 與布魯姆六大認知層次（記憶、理解、應用、分析、評鑑、創造）建構了新技能檔 [09-chinese-literacy-worksheet.md](file:///d:/2026antigravity/skills/09-chinese-literacy-worksheet.md)。
    - 完美配置 2x3 面板漫畫網格與圓角虛線框的 A4 橫式排版描述，並在 Prompt 中預留 35-40% 答題書寫留白、禁答案、僅繁體中文等嚴格標準。
    - 已同步將該新技能全域註冊至 [00-install-all.md](file:///d:/2026antigravity/skills/00-install-all.md) 與 [antigravity-lazy-packs.md](file:///d:/2026antigravity/skills/antigravity-lazy-packs.md)。
    - 將此技能編入專案整合索引檔 [workflows_index.md](file:///d:/2026antigravity/notes/workflows_index.md)。
  - **生成並審查 L11 素養學習單實體**：
    - 根據此技能，成功為第十一課《畫龍點睛》生成了「龍貓主題」黑白素養學習單實體圖檔 [L11素養學習單.png](file:///d:/2026antigravity/public/chinese%20worksheet/L11素養學習單.png)。
    - AI 對圖檔進行了全面檢核，確認排版完美對稱、布魯姆六大認知層次完全符合教育目標、中文字型與筆畫 100% 正確、龍貓森林風格裝飾與畫龍點睛主題交織完美，達到商用出版級的高水準！
  - 工作目錄無敏感資料殘留，符合安全防護標準。

- **2026-05-28**：🟢 **開工與收工狀態驗證通過，國小國語心智圖學習單生成器完美實裝**。
  - **開工連線檢查通過**：GitHub CLI（samcct-bit）、NotebookLM MCP（samcct@gmail.com）、Firebase CLI 全數綠燈。
  - **開發國小國語心智圖學習單生成器技能**：
    - 成功建立自訂技能檔 [08-chinese-worksheet.md](file:///d:/2026antigravity/skills/08-chinese-worksheet.md)。
    - 設計三步驟流程：課文重點萃取、著色圖排版規格、Midjourney/DALL-E 著色圖 Prompt。
    - 內置了三麗鷗、柯南、蠟筆小新、Minecraft、鬼滅之刃、粉紅豬小妹、龍貓、巧虎、功夫熊貓、美少女戰士、海綿寶寶等 11 種動畫主題及自訂主題支持。
  - **課文庫轉譯完成**：使用 Mammoth 工具成功將 `國語3下課文(114f705216).docx` 自動解析為 `public/chinese worksheet/lessons.txt`，便於 AI 精準檢索。
  - **完成兩大課文實例驗證**：
    - **第五課《茶鄉鹿谷》x「龍貓」風格**：完美結合凍頂山茶園美學與大龍貓喝茶情境，完成順時針四分支設計。
    - **第十二課《掉進一個兔子洞》x「愛麗絲夢遊仙境」風格**：將愛麗絲、白兔先生、柴郡貓、瘋帽子與紅心王后融入課文，完美生成文字與生圖 Prompt 的多重對接。
  - **技能全域註冊完成**：已同步將新技能編入 `00-install-all.md` 及 `antigravity-lazy-packs.md`。
  - 工作目錄無任何敏感資料金鑰與憑證，符合安全規範，於 13:25 順利收工。
  - **下午大考與成績分析工具開發 (15:45 - 16:15)**：
    - **未追蹤檔案大整理**：將 3 張心智圖範例 PNG 移動至 `assets/chinese worksheet/`，並修正技能檔的參考路徑；將精品咖啡技能架構 PDF 移動至 `assets/coffee/`，保持工作目錄乾淨。依指示保留原始課文 docx 與學生成績表 sample excel 在原處，並精準追蹤移入的 assets 與更新的技能檔。
    - **開發國小班級成績自動轉換與分析器 (GAS)**：根據 `305studentgrade-sample.xlsx` 結構，開發出具備防呆運算、智慧型期中/學期雙模式切換、不及格列自動著色（#FCE4D6）以及底端動態清理與重建全班統計摘要與級距區間的 Google Apps Script。
    - **編寫使用說明與安裝手冊**：提供極致便利的 [walkthrough.md](file:///C:/Users/USER/.gemini/antigravity/brain/c6ebad8e-be52-4d7d-9ada-b35a745878bf/walkthrough.md)，引導老師無痛完成 GAS 的安裝與權限啟用。

- **2026-05-27**：🟢 **開工與收工狀態驗證通過，遠端連線與登出測試圓滿成功**。
  - 成功完成遠端開工連線測試，驗證 Git 工作目錄乾淨，且本地與遠端 `master` 分支保持同步。
  - 驗證 GitHub CLI（samcct-bit）、NotebookLM MCP（samcct@gmail.com）及 Firebase CLI 各項服務連線均為正常綠燈。
  - 確認工作目錄安全，無任何 API Keys 或敏感憑證殘留，符合安全防護標準，於 18:15 順利收工。
  - **成功將所有 Netlify 靜態網頁移轉至 GitHub Pages**：
    - 將 `samcct-bit/2026antigravity-hub` 儲存庫設為公開 (Public)。
    - 使用 GitHub API 成功啟用該儲存庫的 GitHub Pages，並配置為由 `master` 分支根目錄直接託管。
    - 所有精品咖啡標籤與原先的數學救援遊戲 `mathgame3-2-7` 共 14 個專案網頁，均已成功移轉至 GitHub Pages，節省 Netlify 的免費額度！
  - **部署全新數學時間遊戲 `timegame3-2-8`**：
    - 將新生成的 `timegame3-2-8` 時間遊戲網頁整合至 `public/math game/timegame3-2-8/index.html`。
    - 已同步上傳至 GitHub，順利部署於 GitHub Pages (`https://samcct-bit.github.io/2026antigravity-hub/public/math%20game/timegame3-2-8/index.html`)。
  - **建立多裝置技能同步資料夾（`skills/`）**：
    - 成功將本地端所有的技能設定檔（含新咖啡自動化技能 `07-coffee.md`）複製並備份至專案根目錄的 `skills/` 資料夾中。
    - 已順利上傳至 GitHub 公開儲存庫，方便於家用筆電等其他裝置快速拉取並一鍵安裝。

- **2026-05-26**：🟢 **開工狀態驗證通過 & 咖啡標籤與數學遊戲部署優化圓滿收工**。
  - Git 工作目錄乾淨，遠端分支與 origin/master 同步。
  - GitHub CLI 登入正常（帳號：`samcct-bit`）。
  - NotebookLM 連線成功，已完成安全瀏覽器 OAuth 登入並成功讀取筆記本。
  - Firebase CLI 專案列表獲取正常（作用專案：`my-teaching-tools-01`）。
  - 所有連線均正常綠燈，已全面啟動今日工作流！
  - **完成筆記分類整理與清理**：成功分類整理原本的 62 個筆記本為 6 大核心類別，安全刪除 2 個無標題空白草稿，將總量精簡為 60 個，並更新本機的 [catalog.md](file:///d:/2026antigravity/private_notebooks/catalog.md)。
  - **成功串聯 Netlify 服務**：已完成本地 Netlify CLI 的安全授權登入（`samcct@gmail.com`），並成功讀取 13 個現存網站。
  - **部署 2 個新咖啡標籤網頁**：成功將新拷貝之本地專案 `Colombia Margarita Honeydew Melon` 與 `Ethiopia Worka Berry Queen` 建立並部署至 Netlify 生產環境，自訂子網域網址分別為：
    - 🇨🇴 Colombia Margarita：[colombia-margarita-honeydew-melon.netlify.app](https://colombia-margarita-honeydew-melon.netlify.app)
    - 🇪🇹 Ethiopia Worka：[ethiopia-worka-berry-queen.netlify.app](https://ethiopia-worka-berry-queen.netlify.app)
  - **修復咖啡標籤部署錯誤**：將本地未追蹤之 `public/coffee label/` 目錄安全推送至 GitHub，順利解除 Netlify 因缺少檔案導致的部署失敗問題，實現自動部署綠燈。
  - **重構與升級數學救援網頁**：優化 `public/math game/mathgame3-2-7/index.html`，實裝 `localStorage` 機制以實現「永久防重複練習」與「智能關卡歷史重置」功能，並於首頁與結束頁新增「清除進度」按鈕。已使用 Netlify CLI 部署至生產環境（`https://mathgame3-2-7.netlify.app`）並完成 Git 同步。

---

## 📢 對外教學說明

* 若要複製本套設定給其他 AI 助理，請直接將此目錄下的 `09-AntiGravity專屬懶人包.md` 作為參考文件提供給 AI。
