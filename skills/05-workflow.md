---
name: antigravity-workflow
description: AntiGravity 開工/收工/新專案初始化流程。說「開工」「收工」「新專案初始化」「初始化專案」時載入。
---

# 開工 / 收工 / 新專案初始化工作流

本技能定義了 AntiGravity 專案的核心開發生命週期，包括每日的開工與收工，以及全新專案的初始化引導。

## 📁 規則管理 (ANTIGRAVITY.md)
* 專案根目錄的 `ANTIGRAVITY.md` 作為 AI 工作規則入口。
* 它應記錄**固定規則、路徑、專案邊界與 Do / Don't**。
* 進度、踩坑、每日紀錄應放在專案筆記或 Obsidian 專案駕駛艙（不要求使用 MCPVault 自動讀寫）。

---

## 🌅 一、開工 (Say "開工")
當使用者說「開工」時，AI 應依序執行：
1. **讀取規則**：讀取專案根目錄的 `ANTIGRAVITY.md` 或同等規則檔。
2. **讀取筆記**：讀取或請使用者提供專案筆記 / Obsidian 專案駕駛艙重點。
3. **檢查狀態**：執行 `git status` 與最近 commit 檢查。
4. **回報建議**：回報目前狀態與建議的下一步。
5. **安全界線**：**絕不**自動執行 `pull`、`commit` 或 `push`，必須由使用者決定。

---

## 🌌 二、收工 (Say "收工")
當使用者說「收工」時，AI 應依序執行：
1. **安全檢查**：檢查代碼與變更中是否含有敏感資料（如：API key、token、憑證、NotebookLM 匯出清單、學生真名）。
2. **更新筆記**：更新專案筆記或 Obsidian 專案駕駛艙（記錄完成事項、下一步、踩坑）。
3. **規則更新**：**只有**在固定規則或路徑改變時，才更新 `ANTIGRAVITY.md`。
4. **Git 檢查**：執行 `git status` 與 `git diff` 檢查。
5. **精準 Stage**：只 stage 本次任務相關檔案，**絕不**使用無差別 `git add .`。
6. **代碼提交**：自動產生結構化的 commit message，獲得使用者確認後執行 commit / push。
7. **同步回報**：清晰回報專案筆記、規則檔與 GitHub 的同步結果。

---

## 🚀 三、新專案初始化 (Say "新專案初始化")
當使用者說「新專案初始化」時，AI 應先問清楚以下資訊：
1. **專案名稱**
2. **用途**
3. **工作資料夾**
4. **是否建立 GitHub repo**
5. **repo 公開或私有**
6. **是否需要 GitHub Pages / Firebase / 其他部署**
7. **專案筆記或 Obsidian 專案駕駛艙位置**

接著，建立或補齊以下結構（只補缺口，不覆蓋既有設定）：
* `ANTIGRAVITY.md` (AI 規則檔)
* `README.md` (專案說明)
* `.gitignore` (安全排除設定)
* Git repo (本地初始化)
* GitHub repo（若使用者需要）
* 專案筆記或 Obsidian 專案駕駛艙檔案
