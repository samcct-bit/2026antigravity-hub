# AI 編碼與 Agent 工具指南

本指南彙整了 **GPT-CodeX**、**OpenCode**、**Google AntiGravity** 與 **Claude** 四大主流 AI Agent 工具的核心知識。藉由深入分析 12 篇字幕檔，幫助您從安裝、環境建置、資料庫串接，一路上升到雙 AI 協同分工、自動化電腦遠端控制等高級工作流，實現十倍速的數位教學與日常辦公效率。

---

## 📂 目錄
1. [GPT-CodeX 桌面版 Agent 指南](#part-1-gpt-codex-桌面版-agent-指南)
2. [OpenCode 低成本/開源 Agent 實踐](#part-2-opencode-低成本開源-agent-實踐)
3. [Google AntiGravity 2.0 實測與技能升級](#part-3-google-antigravity-20-實測與技能升級)
4. [Claude 全生態與 Skills/Dispatch 功能](#part-4-claude-全生態與-skillsdispatch-功能)

---

## Part 1: GPT-CodeX 桌面版 Agent 指南

### 1. GPTcodeX 基本功 EP01
* **原字幕檔連結**: [[notes/Clipping/GPTcodeX基本功EP01_十分鐘上手 GPT-CodeX：手把手帶你從安裝到專案初始化_別再買貴森森的 Claude Code 了！GPT-CodeX 才是真正的省錢神器.md|原字幕檔]]
* **影片連結**: [YouTube 影片](https://www.youtube.com/watch?v=0IKrl7nNIM0)
* **一句話精華**: GPT-CodeX 是一款比 Claude Code 更划算的桌面版本地 AI Agent，僅需登入 ChatGPT Plus 帳號即可執行本地端檔案讀寫與專案初始化。
* **三大核心知識點**:
  1. **安裝與模式設定**: 安裝桌面版後，日常使用建議採用「日常工作」模式、"DefaultApp" 開啟目的地，核准政策設為 "on request" 以兼顧安全與自動化。
  2. **聊天與專案模式之別**: 左側聊天視窗屬於雲端 AI，而「專案」模式才是真正的本地 Agent。必須開啟 "Workspace write" 才能允許 AI 在本地讀寫檔案與執行指令。
  3. **專案骨架與上下文管理**: 連接本地資料夾後打「專案初始化」，AI 會自動生成 `agents.md` 來記錄專案藍圖和進度。內建自主瀏覽器供自動化搜尋，上下文上限為 25 萬 Token。
* **涉及的 AI 軟體 / 工作流工具**: GPT-CodeX 桌面版 (GPT-CodeX App), ChatGPT (Plus 帳號), Git, DefaultApp

---

### 2. Codex 基本功 EP02
* **原字幕檔連結**: [[notes/Clipping/Codex基本功EP02_初學者必裝外掛程式跟技能_打造你的個人 AI 助理，Codex 基礎教學實戰.md|原字幕檔]]
* **影片連結**: [YouTube 影片](https://www.youtube.com/watch?v=5FM_O66g2Ng)
* **一句話精華**: 介紹如何為 Codex 安裝初學者必備的外掛與技能，並透過自動化瀏覽器執行資料抓取與固定流程的 Skills 技能打包。
* **三大核心知識點**:
  1. **初學者必裝生態外掛**: 推薦安裝微軟 Office 三件套外掛、Google 日曆、Gmail 及 GitHub 外掛，並啟用 AI 生圖技能（對接最新的 Image 2.0 引擎）。
  2. **瀏覽器自動化與電腦控制**: 使用 "Computer Use" 外掛可呼叫內建瀏覽器，自動聯網下載檔案（如自動抓取會考數學試題），在背景默默執行，不干擾用戶其他日常操作。
  3. **重複流程打包為 Skills**: 將多步驟流程（如分析歷屆試題、產出策略、畫資訊圖表、生成試算表）一次性交代，可極大化節省重複讀取對話所消耗的 Token。成熟後可用「技能產生器」打包為 Local 技能重複使用。
* **涉及的 AI 軟體 / 工作流工具**: Codex Skills, Image 2.0 (生圖), Office/Google plugins, Computer Use, Markdown, Excel/Spreadsheet

---

### 3. GPT Codex 基本功 EP03
* **原字幕檔連結**: [[notes/Clipping/GPT Codex 基本功 EP03：為你的 Agent 裝上第二大腦與程式倉庫_打造最強 AI 助理：手把手教你連接Github與Obsidian.md|原字幕檔]]
* **影片連結**: [YouTube 影片](https://www.youtube.com/watch?v=VEbBbFubCZ8)
* **一句話精華**: 引導使用者將 GitHub CLI 程式倉庫與 Obsidian 第二大腦接上 Codex，讓本地 AI Agent 具備全域的代碼提交與知識庫讀寫能力。
* **三大核心知識點**:
  1. **GitHub 全域讀寫與提交**: 透過安裝 GitHub CLI (gh) 讓 Codex 進行本地授權與認證，使 Agent 能夠全域對 GitHub 儲存庫進行讀寫、版本提交與代碼上傳。
  2. **Obsidian 連接與第二大腦**: 安裝 Obsidian 的 "MCP Vault" 外掛，使 Codex 能自動對接並讀寫本地或雲端同步的 Obsidian 筆記，將筆記庫直接作為 AI 的外部大腦。
  3. **跨工具與跨專案通用性**: 這些外掛與連接技能在 Codex 與 Claude 中高度共通，設定一次即可跨專案、跨對話全域使用。
* **涉及的 AI 軟體 / 工作流工具**: GPT-CodeX, GitHub CLI (gh), Obsidian, MCP Vault, Claude (共通概念)

---

### 4. GPTcodex 基本功 EP04
* **原字幕檔連結**: [[notes/Clipping/GPTcodex基本功EP04_串接資料庫_初始化你的專案.md|原字幕檔]]
* **影片連結**: [YouTube 影片](https://www.youtube.com/watch?v=BN40JSi1EBk)
* **一句話精華**: 教導如何在 Codex 中串接 Firebase 資料庫，並透過「開工、收工與專案初始化」三大技能建立高效且可跨 Agent 合作的標準工作流。
* **三大核心知識點**:
  1. **Firebase 資料庫串接**: 藉由懶人包在 Codex 中無縫串接 Firebase，使開發出的網頁具備雲端後端、資料儲存與即時讀寫的功能。
  2. **核心工作流三大技能**:
     - **專案初始化**: 自動在資料夾內建立 `agents.md` 藍圖，並在 Obsidian 中建立專案駕駛艙。
     - **開工**: 開啟新對話 Session 時，自動讀取 `agents.md` 延續上次進度，以清空舊對話、大幅節省 Token 並防 AI 變笨。
     - **收工**: 彙整本次重點、更新 `agents.md`，自動完成 Git Commit 並推送至 GitHub。
  3. **跨 Agent 協作模式**: 由於代碼、筆記與資料庫皆獨立存在，使用者可在額度用完時在同一個專案資料夾內靈活切換不同 Agent 工具（如 Claude Code 寫程式，Codex 審代碼）。
* **涉及的 AI 軟體 / 工作流工具**: GPT-CodeX, Claude Code, Firebase (Firestore), Obsidian (專案駕駛艙), GitHub CLI, Git (開工/收工/初始化工作流)

---

## Part 2: OpenCode 低成本/開源 Agent 實踐

### 5. OpenCode 基本功 EP02
* **原字幕檔連結**: [[notes/Clipping/OpenCode基本功EP02_一次搞懂最便宜的AI agents_別再盲目訂閱20美金AI！這款開源Agent憑什麼成為黑馬？.md|原字幕檔]]
* **影片連結**: [YouTube 影片](https://www.youtube.com/watch?v=U87EGssCzDY)
* **一句話精華**: 介紹開源 AI Agent 工具 OpenCode 的付費與免付費模式，並實測其主力模型在低代價下處理日常雜務的優勢。
* **三大核心知識點**:
  1. **AI Agents 四大家比較**:
     - **Claude Code**: 聰明穩定，但用量太貴。
     - **Codex**: 20 美元首選，極聰明能生圖，但速度偏慢且加速燒錢快。
     - **AntiGravity**: 速度極快但尚不穩定成熟，Google 官方目前提供 3 倍用量。
     - **OpenCode**: 第三方開源，支持自備/第三方 API Key，適合省錢與實驗。
  2. **計費與模型方案選用**: 
     - **Zen 方案**: 儲值制，主力推薦 **GPT-5.4 mini**（便宜又聰明，每次對話僅約 0.01 美元），強烈建議避免用極貴的 Gemini 3.5 Flash。
     - **Go 方案**: 包月制（首月 5 美元，次月 10 美元），可調用多款陸版模型如 **Deepseek V4 Flash** 或 **Kimi 2.6**。
     - **免費模型**: 內建 Deepseek V4 Flash Free 與 NVIDIA Neotron 3 Super Free。
  3. **基礎環境快速安裝**: 透過 Lazy-Pack 懶人包一鍵完成 NotebookLM、GitHub、Obsidian 的 MCP 設定與 Firebase 資料庫連接。
* **涉及的 AI 軟體 / 工作流工具**: OpenCode, Deepseek V4 Flash, GPT-5.4 mini, Kimi 2.6 (多模態), Obsidian, Firebase

---

### 6. OpenCode 基本功 EP03
* **原字幕檔連結**: [[notes/Clipping/OpenCode基本功EP03 近乎無限的用量 Opencode Go方案心得_AI工具分工學：最聰明的模型做規劃，最便宜的模型做苦工.md|原字幕檔]]
* **影片連結**: [YouTube 影片](https://www.youtube.com/watch?v=r59BNhIuh_4)
* **一句話精華**: 分析 OpenCode Go 方案中三款核心陸版模型的特點，倡導「最聰明的模型做規劃，最便宜的模型做苦工」的 AI 分工學，藉由 Deepseek V4 Flash 實現近乎無限的免費 Agent 任務。
* **三大核心知識點**:
  1. **三大核心模型定位（機車、房車、卡車）**:
     - **Deepseek V4 Flash（機車）**: 超便宜且極速，5 小時額度高達 31,650 次，近乎無限用量，適合大量做 HTML 簡報、出考卷等重複性苦工。
     - **Deepseek V4 Pro（房車）**: 純文字頂尖模型，100 萬上下文，無多模態，適合複雜代碼編寫與架構決策。
     - **Kimi 2.6（卡車）**: 多模態頂尖模型，最懂中文，25.6 萬上下文，支援圖片與影片辨識，適合排錯（截圖溝通）與處理含圖文檔。
  2. **AI 分工學概念**: 讓最聰明、高昂的 AI（如 Claude）撰寫計畫書與簡報規格書；隨後將計畫書交給極便宜且用量無限的 Deepseek V4 Flash 進行批量代碼與簡報輸出，可省下近 30 倍的 Token 費用。
  3. **團隊 API 共享協作**: OpenCode Go 的 API Key 可由 5~10 人共用跑 Deepseek V4 Flash，五小時的額度依然綽綽有餘，為團隊與學生實踐 Agent 工作流之首選。
* **涉及的 AI 軟體 / 工作流工具**: OpenCode Go, Deepseek V4 Flash, Deepseek V4 Pro, Kimi 2.6, Claude Code (規劃端)

---

### 7. OpenCode 基本功 EP04
* **原字幕檔連結**: [[notes/Clipping/OpenCode 基本功EP04_免費組裝你的 Agent 大軍，無限解放 Token.md|原字幕檔]]
* **影片連結**: [YouTube 影片](https://www.youtube.com/watch?v=-cplfCsPJXs)
* **一句話精華**: 實測利用 NVIDIA 開發者帳號取得免費 API 金鑰，並藉由 Claude Code 與 OpenCode CLI 「雙 AI 協同分工」在本地端大量施工，達到 Token 自由。
* **三大核心知識點**:
  1. **本地端 AI 限制與應用**: 本地跑 ollama Gemma 4 12B 模型需要 16G 以上的 NVIDIA 顯存（12G VRAM 的 4080 跑起來稍顯吃力），其能力無法與頂級雲端模型相比，僅建議用於處理不可外流的敏感資訊與學生個資。
  2. **NVIDIA 免費 API 獲取**: 註冊 NVIDIA 開發者帳號，可獲得免費的 API Key，串接至 OpenCode 以免費使用 Deepseek V4 Flash (百萬上下文) 與 Kimi 2.6。缺點是繁忙期需排隊等待，速度會變慢。
  3. **雙 AI 派工與上下文控制**: 
     - **軍師**: 讓聰明且昂貴的 Claude Code 負責制定架構並寫出 Markdown 格式計畫書。
     - **士兵**: 呼叫 OpenCode CLI 啟用免費模型（如 Deepseek V4 Flash），載入計畫書在本地大量寫程式或生成簡報。
     - **防上下文膨脹**: Claude Code 僅負責派發計畫並讀取 OpenCode 產出的 Git diff 或摘要結論（如 `result.md`），不直接導入士兵對話全文，防止昂貴的 token 快速燒乾。
* **涉及的 AI 軟體 / 工作流工具**: OpenCode CLI, Claude Code (GUI), NVIDIA Developer API, ollama, Gemma 4 12B, Git diff

---

## Part 3: Google AntiGravity 2.0 實測與技能升級

### 8. AntiGravity 基本功 EP01
* **原字幕檔連結**: [[notes/Clipping/AntiGravity 基本功 EP01_Claude Code 與 Codex 的強敵？Google AntiGravity 2.0 實測評價.md|原字幕檔]]
* **影片連結**: [YouTube 影片](https://www.youtube.com/watch?v=LyiiMVZE7uM)
* **一句話精華**: 實測 Google 推出的 AntiGravity 2.0 桌面端 AI Agent，展現其類似 Claude Code 的 GUI 界面、極快的運行速度與內建生圖引擎（Imagen），並可用懶人包快速連接本地/雲端服務。
* **三大核心知識點**:
  1. **界面與機制定位**: AntiGravity 2.0 是一個桌面端 AI Agent 工作環境（Harness），旨在與 Claude Code、Codex 對齊。它將原先的 IDE 改版為 Harness，預設使用 Gemini 3.5 Flash，並有全域（Global）與專案（Project）級別設定。
  2. **自動化與權限設定**: 在設定中建議將 Browser 與 Apps 的權限設為 "Always proceed"，並開啟「防止電腦進入睡眠」以確保長時間自動化工作不中斷；但目前版本設定 "Always proceed" 後仍可能跳出確認，存在些許 Bug。
  3. **四件套懶人包實測**: 藉由 Lazy-Pack，AntiGravity 2.0 能一鍵連接 GitHub, Obsidian（讀取 agents.md 檔案）、Firebase 與 NotebookLM，並在抓取 NotebookLM 內容後使用內建生圖引擎自動繪製中文資訊圖表。
* **涉及的 AI 軟體 / 工作流工具**: AntiGravity 2.0, Gemini 3.5 Flash (預設), Imagen (內建生圖), NotebookLM, Obsidian, GitHub, Firebase

---

### 9. AntiGravity 基本功 EP04
* **原字幕檔連結**: [[notes/Clipping/AntiGravity 基本功 EP04_一鍵將 Gems 全面升級成 Skill 的終極指南_懶人包大放送.md|原字幕檔]]
* **影片連結**: [YouTube 影片](https://www.youtube.com/watch?v=kmmYXntln_E)
* **一句話精華**: 指導如何使用懶人包一鍵將落伍的 Gemini Gems 全面升級為 AntiGravity 2.0 中的 Skills（工作流），並實測自動生成三頁式繁體中文語音電子書漫畫的驚人效果。
* **三大核心知識點**:
  1. **Gems 限制 vs. Agent 殺手功能**: Gems 存在對話重啟、單一輸出、無法執行程式與只能做單一事件的限制。而 Agent 支援工作流（Workflow）、可批量讀寫並產生本地檔案（Word/Excel）、可整合 Python 工具並將生圖直接嵌入工作流中。
  2. **Gems 自動化提取與合併**: 登入 Google 帳號並安裝雲端硬碟 app 後，AntiGravity 2.0 能讀取硬碟中的 `Gemini Gems` 資料夾並進行分析與歸類（如將多個同質 Gem 合併），自動寫入本地專案或全域的 `agents.md` 中。
  3. **實戰電子書漫畫技能**: 輸入情境後，Agent 自主生成角色、繪製三頁式四格漫畫（內建 Nano Banana/Imagen 生圖且中文精準）、生成語音 TTS、並組裝成可在瀏覽器點播與翻頁的 HTML 電子書，遠超 Gems 能力。
* **涉及的 AI 軟體 / 工作流工具**: AntiGravity 2.0, Imagen/Nano Banana Pro (生圖), Skill/Workflow, Google Drive (Gemini Gems), Netlify, TTS (語音生成)

---

## Part 4: Claude 全生態與 Skills/Dispatch 功能

### 10. Claude 基本功 EP01
* **原字幕檔連結**: [[notes/Clipping/Claude基本功 EP01：一次搞懂 Claude 全生態：從聊天到全自動化寫程式.md|原字幕檔]]
* **影片連結**: [YouTube 影片](https://www.youtube.com/watch?v=luRFvHW0SF8)
* **一句話精華**: 介紹 Claude 全生態的四種模式，並說明初學者從聊天、協作到全自動化寫程式的技能進階路徑。
* **三大核心知識點**:
  1. **Claude 四大模式定位**:
     - **Claude Chat**: 雲端網頁聊天，輸出 Word, PDF, PPT 與 SVG 圖表（畫圖精準），但無法存取本地檔案。
     - **Cowork**: 桌面版功能，可在本地 User 目錄下批量處理檔案、規劃排程任務、並利用 Dispatch 遠端遙控。
     - **Claude Code 桌面版**: 本地 GUI 寫程式，支持 Plan Mode 計劃引導或 Auto Accept/Bypass Permissions 等高自動化模式。
     - **Claude Code CLI**: 命令列操作介面，對老手最有效率，直接與系統對接以進行自動部署與腳本編寫。
  2. **實際開發協作案例**: 透過 Claude Code 協同開發出本地語音輸入工具（typenone，跑本地 ollama）以及自製語音轉字幕與校對工具（調用付費 API 確保高準確率）。
  3. **初學者進階之路**: 建議先從 cloud chat 開始（熟悉對話），再進階到 Cowork 協作檔案與排程，再到 Claude Code 桌面版寫程式（九成日常需求可在此解決），最後是 CLI 版本進行極致的自動化。
* **涉及的 AI 軟體 / 工作流工具**: Claude Chat, Cowork, Claude Code (GUI/CLI), typenone (本地語音輸入), typeless (語音輸入), ollama, SVG 繪圖

---

### 11. Claude 基本功 EP02
* **原字幕檔連結**: [[notes/Clipping/Claude基本功EP02 _從入門到精通的 Skills 全攻略.md|原字幕檔]]
* **影片連結**: [YouTube 影片](https://www.youtube.com/watch?v=u3FvQCm5CO4)
* **一句話精華**: 全面解構 Claude 的 Skills 技能機制，說明如何使用 Skill Creator 來將重複、固定的 SOP 流程打包成 markdown 格式的技能以節省上下文。
* **三大核心知識點**:
  1. **Skills 技能核心機制**: Skills 是寫入 Markdown 檔的固定 SOP。藉由包含「技能名稱」與「觸發關鍵字」的名片區設計，Claude 只有在對話涉及關鍵字時才會載入該技能說明書，從而防止每次對話都載入大量提示詞而爆掉上下文。
  2. **雲端 Skills 與本地 Skills 分類**:
     - **對話型 Skills**: 存於 Claude Chat 雲端，跨設備同步，無本地檔案存取（如「番茄炒蛋食譜」搜尋與 PDF 暫存下載）。
     - **檔案型 Skills**: 僅存於本地，涉及實體檔案讀寫、Python 執行環境（如數學段考出題並寫入 docx），無法直接與雲端同步。
  3. **Claude 五大擴充機制（由外到內）**: 最外層是 **Plugin**，內部包含 **Skills**（SOP 說明書）、**Hooks**（定時定點腳本）、**MCP Server**（外部接口，如連接 Google/Obsidian）、**Commands**（終端指令），而 **claude.md** 則做為全域背景知識設定。
* **涉及的 AI 軟體 / 工作流工具**: Skill Creator, Markdown (.md), claude.md, Plugin, MCP, Hooks, Python docx/pdf-gen

---

### 12. Claude Dispatch 功能
* **原字幕檔連結**: [[notes/Clipping/Claude Dispatch 功能來取代你的龍蝦_最穩定、最簡單的電腦遠端控制方案來了.md|原字幕檔]]
* **影片連結**: [YouTube 影片](https://www.youtube.com/watch?v=64O1LSpGJYI)
* **一句話精華**: 詳細介紹 Claude 桌面版 Cowork 的 Dispatch 功能，如何讓使用者人在戶外，即可透過手機 app 連動家中的電腦進行自動網頁操作、YouTube 後台回覆與批量出卷。
* **三大核心知識點**:
  1. **Dispatch 核心概念**: Dispatch 是桌面版 Cowork 內建的手機與電腦連動控制方案，功能等同於自建的「個人遠端遙控龍蝦（LobeChat/類似的自建 AI）」，僅需 20 美元訂閱，完全無需繁瑣代碼與複雜伺服器架設。
  2. **電腦與手機連動配置**:
     - **電腦端**: 必須保持開機與非休眠，將所需操控的帳號（如 Google/YouTube）在瀏覽器預先登入，並安裝 Claude 瀏覽器外掛以授權 AI 接管（被接管時網頁會呈現橘色邊框）。
     - **手機端**: 安裝 Claude App，掃描電腦 QR code 連接並開啟 Dispatch。
  3. **戶外遠端應用情境**:
     - **網頁自動化**: 在手機上輸入「總結本周 AI 新聞」或「查詢 YouTube 後台最新留言」，電腦端瀏覽器會自動在背景開分頁、點選、滑動並把結果回傳到手機（可分類留言優先級）。
     - **檔案生成**: 結合 typeless 語音輸入與預先寫好的數學出題 Skills（如 JH Math Exam），人在外面可用語音派發考卷需求，回家即可在硬碟直接收成出好的題目卷、答案卷與雙向細目表 word 檔。
* **涉及的 AI 軟體 / 工作流工具**: Claude Desktop App, Cowork (Dispatch), Claude Browser Extension, typeless, JH Math Exam Skill, Word (docx)
