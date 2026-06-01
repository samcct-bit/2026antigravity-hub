---
name: antigravity-video-specs
description: |
  老師與創作者專屬的「三類影片製作規範與自動化 Bootstrap 渲染系統」。
  支援自動檢測環境、分流三類影片規格（活動紀錄、教學影片、社群科普），結合 Edge-TTS 旁白生成、Playwright 網頁動態錄製與 FFmpeg 影音合成，打造一鍵式自動影片製作工作流。

  當老師說「我要做影片」、「啟動 claude-video-specs」、「照影片規範做影片」、「製作教學影片」、「製作活動紀錄影片」、「製作社群科普影片」或「自動渲染影片」時，務必使用此 Skill。
---

三類影片規範 → 環境檢測 (setup.py) → 劇本/分鏡規劃 → 旁白生成 (Edge-TTS) → 畫面錄製 (Playwright) → 影音合成 (FFmpeg) → 交付預覽

---

## 0. 讀取與分流影片規格

當老師表達影片製作意圖時，首先分析並引導老師將需求分流至下列三類規範之一：

| 類型編號 | 影片類型 | 建議片長 | 核心元素與特色 | 範本路徑 |
|---|------|------|---------|---|
| **01** | **活動紀錄影片** | 60–180s | 口白 + 大字卡 + BGM 過場，著重重現當下情緒與氛圍 | `claude-video-specs/examples/01-marathon-light/` |
| **02** | **教學影片** | 4–8 min | SOIL 教學脈絡 + 概念動畫 + Edge-TTS 旁白，著重清晰講解 | `claude-video-specs/examples/02-factors-multiples/` |
| **03** | **社群科普影片** | 2–3 min | 強 Hook + 多版面 + 證據照片，適合 IG / YouTube Shorts 傳播 | `claude-video-specs/examples/03-ai-context/` |

**主要規範文件路徑：**
- 01 活動紀錄影片：`d:/2026antigravity/claude-video-specs/specs/01-活動紀錄影片.md`
- 02 教學影片：`d:/2026antigravity/claude-video-specs/specs/02-教學影片.md`
- 03 社群科普影片：`d:/2026antigravity/claude-video-specs/specs/03-社群科普影片.md`

---

## 1. 環境檢查與自動補齊

在開始製作影片前，自動執行本地 Python 環境檢測（免去複雜 shell 手動指令），確保所有影音工具就緒。

### 1-1 執行環境檢測
在本地工作目錄下執行：
```powershell
d:\2026antigravity\.venv\Scripts\python.exe d:\2026antigravity\claude-video-specs\install\setup.py check
```

將檢測結果（Python, pip, edge-tts, Node.js, ffmpeg, 字體, Playwright）格式化為表格呈報給老師。

### 1-2 缺失元件一鍵安裝
若有部分非系統層依賴缺失（如 edge-tts, 源石黑體, Playwright 渲染核心），可執行：
```powershell
d:\2026antigravity\.venv\Scripts\python.exe d:\2026antigravity\claude-video-specs\install\setup.py all
```
*註：這會自動安裝 `edge-tts`、下載並安裝「源石黑體」字型（ButTaiwan 釋出）、以及將 Playwright 核心安裝在 Windows `%TEMP%/cvs-render` 目錄下以避免雲端同步問題。*

---

## 2. 規劃影片劇本與分鏡

引導老師提供影片素材（如大綱、投影片或講義文字），並為老師產生包含以下內容的「影片劇本表」：

```markdown
### 🎬 影片劇本與分鏡表（範例）

| 鏡頭/段落 | 畫面視覺 (HTML / 投影片內容) | 旁白口白 (Voiceover) | 音效/音樂建議 | 預估秒數 |
|---|---|---|---|---|
| 01 (片頭) | 亮色底圖、源石黑體大字「馬拉松精神」 | 「歡迎來到這趟挑戰自我的旅程...」 | 激昂鼓聲漸入 | 5s |
| 02 (正片) | 滑動對比圖表、數據視覺化 | 「今天，我們用三個指標來解構...」 | 輕快電子樂背景 | 15s |
...
```

**等候老師確認或調整後，才進入素材生成階段。**

---

## 3. 生成旁白語音 (Edge-TTS)

使用免 API 金鑰且聲音擬真度極高的微軟 Edge-TTS 進行旁白生成：
1. **指定配音員**：台灣中文預設推薦 `zh-TW-HsiaoChenNeural`（女聲）或 `zh-TW-YunJheNeural`（男聲）。
2. **序列生成腳本**：為了防範並行請求被 edge-tts 斷線限制，必須序列生成並配置 3 次 Retry 機制。
3. **指令格式**：
   ```powershell
   edge-tts --voice zh-TW-HsiaoChenNeural --text "老師您好，這是第一段旁白。" --write-to d:\2026antigravity\public\assets\voice_01.mp3
   ```

---

## 4. 網頁畫面渲染與 Playwright 錄製

三類影片規範皆支援使用 HTML5 進行極致的排版與動畫設計。
1. **範本拷貝**：複製 `claude-video-specs/examples/<對應編號範本>/` 到 `d:/2026antigravity/public/<影片slug>/` 目錄。
2. **字體應用**：CSS 中預設載入並指定字體：
   ```css
   font-family: 'GenSekiGothic2TW-H', 'Inter', sans-serif;
   ```
3. **Playwright 靜態與動態錄製**：
   啟動位於臨時渲染目錄的 Playwright 對網頁進行頁面擷取或無頭瀏覽器錄影（WebM 格式），並搭配旁白長度進行精準的時間軸對齊。

---

## 5. 音視頻合成 (FFmpeg Muxing)

利用本地 FFmpeg 將渲染出來的 WebM/MP4 影像，與 Edge-TTS 生成的旁白音軌及背景音樂 (BGM) 進行多軌無損合成：

```powershell
ffmpeg -i video.webm -i voice_all.mp3 -i bgm.mp3 -filter_complex "[2:a]volume=0.15[bgm]; [1:a][bgm]amix=inputs=2:duration=first[audio]" -map 0:v -map "[audio]" -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest output.mp4
```
*參數說明：將背景音樂 (BGM) 音量降低至 15%，並與主旁白混音，合成出具備精美背景聲的教學影片。*

---

## 6. 部署與預覽

將影片與預覽網頁存放在 `d:/2026antigravity/public/<影片slug>/`，並提交至 GitHub：
```powershell
git add public/<影片slug>/
git commit -m "feat: add video specs project <影片中文名稱>"
git push origin master
```

回報給老師：
```markdown
✅ 影片專案與預覽頁面已部署！
🔗 預覽網頁連結：https://samcct-bit.github.io/2026antigravity-hub/public/<影片slug>/index.html
（影片檔亦可於該目錄下直接下載 `output.mp4`）
```

---

## 避坑指南與最佳實踐 (Gotchas)

1. **Edge-TTS 穩定度**：多段語音轉換時切忌並行 (parallel) 請求，容易被伺服器拒絕。請採用 JavaScript 或 Python 寫迴圈進行 `await` 序列生成，並加入例外重試機制。
2. **字型安裝權限**：在 Windows 平台上，源石黑體需安裝在使用者目錄字型路徑（`%LOCALAPPDATA%\Microsoft\Windows\Fonts`），而非系統 `C:\Windows\Fonts`，以防寫入權限不足報錯。
3. **Playwright 與 Google Drive 衝突**：請勿在 Google Drive 映射雲端硬碟中直接進行 Node.js 渲染與套件安裝。Playwright 運作目錄必須指向本地實體硬碟（如 `%TEMP%/cvs-render` 或 `d:/2026antigravity/scratch/`）。

### 🎨 4. 智慧圖像裁切去雜訊實戰 (Image Smart Crop & Boundary Clean-up)
對於帶有灰色編號標籤、外框灰線、底部白色對白文字區的手繪分鏡大圖，傳統 AI 生圖或簡單裁切會造成雜訊殘留。以下為「智慧色彩邊界掃描」演算法最佳實踐：
* **頂部邊界掃描**：從原分鏡格高度的 `24%` 處開始往下掃描（非白像素），能 100% 避開左上角手繪灰色編號標籤盒（如「1」、「2」等）。
* **底部邊界掃描**：自高度 `70%` 處往上掃描，精準定位彩色插畫的底邊，徹底蒸發底部大區塊的對白文字干擾。
* **左右邊界掃描**：掃描區間限制在寬度 `12%` 到 `88%` 之間，完美過濾手繪格子左右粗糙黑灰邊界線。
* **安全縮進 margin**：定位到邊界後，上下左右向內各縮進 `2 像素`，達成 0% 白灰框殘留。
* **16:9 紙張補色融合**：建立 16:9 (`1280x720` 或 `1920x1080`) 的溫暖米黃背景色 `#FAF7EE` 畫布，並以 `Image.Resampling.LANCZOS` 高品質抗鋸齒將去邊插圖居中 contain 縮放貼合。

### 🎬 5. Reveal.js 16:9 1080p 極致播放適配
* **標準 16:9 尺寸**：將 `.reveal .slides` 與 `Reveal.initialize` 的寬高設定為標準 `1920` 與 `1080`，`minScale` / `maxScale` 設為 `1.0` 鎖定比例。
* **Ken Burns 微幅縮放特效**：為 `.slide-img` 加上微幅縮放動畫（`scale(1.0)` 至 `scale(1.05)`，配合 `15s` 線性循環過渡），為靜態手繪插圖賦予溫馨的呼吸感。
* **聽覺尾音過渡 buffer**：在音訊 `onended` 觸發時，加上 `1200ms` 的延遲緩衝 (`setTimeout`) 再切換到下一張投影片，能完美吸收 Edge-TTS 語音的尾音，避免聲音被突兀截斷，提升觀影流暢度。

### 🎥 6. 1080p 高清網頁錄製與 FFmpeg 無損合成
* **Playwright 錄製配置**：錄製時設定 viewport 為 `1920x1080`，並確保等待老師點擊「啟動」大遮罩觸發 Chrome 的 Autoplay 權限後才開始錄影。
* **FFmpeg 封裝相容性**：影像使用 `-c:v libx264 -pix_fmt yuv420p`，音訊使用 `-c:a aac`，以確保生成的 MP4 能在所有主流瀏覽器與播放裝置上 100% 完美流暢播映。
