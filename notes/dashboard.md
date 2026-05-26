# 🗺️ 專案駕駛艙 (Obsidian Cockpit)

> 專案：2026antigravity-hub
> 位置：`d:\2026antigravity\notes\dashboard.md`
> 本日記錄：2026-05-26

---

## 🎯 專案目標與目前狀態

* **核心目標**：建構安全、高效的 AntiGravity 自動化與個人開發工作流。
* **目前狀態**：🟢 專案初始化與 Firebase 部署均已綠燈完成。
  * [x] NotebookLM 整合與註冊 
  * [x] GitHub 認證連線驗證
  * [x] Firebase 專案對接與註冊
  * [x] Obsidian 筆記安全工作流註冊
  * [x] 生圖工具免金鑰配置與測試
  * [x] 甜味對決互動網頁設計與 Firebase Hosting 部署

---

## 🏆 最近完成事項

- 成功設計「甜味藥劑學：代糖與糖類大對決」互動網頁，整合 HSL 擬物玻璃態設計與**互動式甜度換算器**，並成功部署至 Firebase Hosting (https://my-teaching-tools-01.web.app)。
- 成功從最新的 NotebookLM 筆記本「The Apothecary of Sweetness: A Comparative Sugar Study」中下載並生成了高畫質的 **橫式與直式甜度強度對比資訊圖表**（已安全存放至 `assets/` 與 `public/assets/` 目錄中）。
- 成功為 AntiGravity 新增了多個自訂技能，全面優化了日常開發生命週期。

---

## 🚀 下一步 (TODO)

- [ ] 規劃將其他科學主題筆記本的實驗圖表也整合入多頁面展示中。
- [ ] 優化手機瀏覽器上的點擊觸控靈敏度與算式動畫。
- [ ] 僅在規則改變時更新本機的 ANTIGRAVITY.md。

---

## 🩹 踩坑與解法

1. **Bug/問題**：PowerShell 連接 `nlm` 時，可能因為 CP950 編碼問題而報 Unicode 錯。
   * **解法**：在 PowerShell 工作階段開頭手動注入 `$env:PYTHONIOENCODING = "utf-8"` 即可順利執行所有命令。
2. **Bug/問題**：`gh auth status` 會因環境中失效的 `GITHUB_TOKEN` 變數而導致報錯。
   * **解法**：在命令前使用 `$env:GITHUB_TOKEN=""` 清除暫時變數，即可順利讀取系統 Keyring 中的認證。

---

## 📅 每日日誌

- **2026-05-26**：🟢 **開工狀態驗證通過 & NotebookLM 筆記整理 & Netlify 專案部署完成**。
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

---

## 📢 對外教學說明

* 若要複製本套設定給其他 AI 助理，請直接將此目錄下的 `09-AntiGravity專屬懶人包.md` 作為參考文件提供給 AI。
