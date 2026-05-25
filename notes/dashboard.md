# 🗺️ 專案駕駛艙 (Obsidian Cockpit)

> 專案：2026antigravity-hub
> 位置：`d:\2026antigravity\notes\dashboard.md`
> 本日記錄：2026-05-25

---

## 🎯 專案目標與目前狀態

* **核心目標**：建構安全、高效的 AntiGravity 自動化與個人開發工作流。
* **目前狀態**：🟢 專案初始化完成。
  * [x] NotebookLM 整合與註冊 
  * [x] GitHub 認證連線驗證
  * [x] Firebase 專案對接與註冊
  * [x] Obsidian 筆記安全工作流註冊
  * [x] 生圖工具免金鑰配置與測試

---

## 🏆 最近完成事項

- 成功從最新的 NotebookLM 筆記本「The Apothecary of Sweetness: A Comparative Sugar Study」中下載並生成了高畫質的 **橫式與直式甜度強度對比資訊圖表**（已安全存放至 `assets/` 目錄中）。
- 成功為 AntiGravity 新增了多個自訂技能，全面優化了日常開發生命週期。

---

## 🚀 下一步 (TODO)

- [ ] 設定本地的 Firebase Hosting / 部署測試環境。
- [ ] 將本初始化結構進行首次 Git Commit。
- [ ] 使用 GitHub CLI 建立遠端的 Private 儲存庫並上傳（`2026antigravity-hub`）。

---

## 🩹 踩坑與解法

1. **Bug/問題**：PowerShell 連接 `nlm` 時，可能因為 CP950 編碼問題而報 Unicode 錯。
   * **解法**：在 PowerShell 工作階段開頭手動注入 `$env:PYTHONIOENCODING = "utf-8"` 即可順利執行所有命令。
2. **Bug/問題**：`gh auth status` 會因環境中失效的 `GITHUB_TOKEN` 變數而導致報錯。
   * **解法**：在命令前使用 `$env:GITHUB_TOKEN=""` 清除暫時變數，即可順利讀取系統 Keyring 中的認證。

---

## 📢 對外教學說明

* 若要複製本套設定給其他 AI 助理，請直接將此目錄下的 `09-AntiGravity專屬懶人包.md` 作為參考文件提供給 AI。
