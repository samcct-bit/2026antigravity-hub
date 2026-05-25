# Anti-Gravity 工作規則 (ANTIGRAVITY.md)

> 專案名稱：2026antigravity-hub
> 用途：AntiGravity 懶人包與個人工作流管理專案
> 工作資料夾：`d:\2026antigravity`
> 專案筆記 / Obsidian 駕駛艙：`d:\2026antigravity\notes`

---

## 📌 固定規則與專案邊界

1. **核心原則**：本專案為 AntiGravity 懶人包與工作流管理中心，所有工作流（開工、收工、筆記）均須嚴格遵守安全與隱私防護規定。
2. **進度與日誌記錄**：開發進度、Bug 踩坑、每日紀錄應保存在專案筆記或 Obsidian 專案駕駛艙（`d:\2026antigravity\notes`），**不得**寫入本規則檔或 commit 至公開庫。
3. **生圖儲存**：生成圖片一律存放在專案的 `assets/` 目錄中，重要的文字資訊建議後製加上。

---

## 🔒 安全原則 (Do's & Don'ts)

### ✅ Do's (應做事項)
* **NotebookLM 授權**：登入一律通過瀏覽器安全 OAuth（`nlm login`）。
* **憑證隔離**：Firebase 前端 config 可以公開，但 Admin SDK 憑證與任何私鑰均應嚴格置於本地排除範圍。
* **收工檢查**：收工時務必使用 `git status` 與 `git diff` 檢查變更，並撰寫結構化的 commit message，獲得確認後方可提交。
* **精準提交**：僅 Stage 本次任務直接相關的檔案，嚴格過濾敏感變更。

### ❌ Don'ts (嚴禁事項)
* **嚴禁**無差別使用 `git add .`。
* **嚴禁**將 API Keys、GitHub Token、Firebase Admin 憑證等任何明文金鑰寫入 Markdown 或 Git 庫。
* **嚴禁**將 `notebooks.json`、NotebookLM 筆記本 ID 清單、研究報告或生成圖片 commit 到公開/懶人包 repository 中。
* **嚴禁**在 AntiGravity 中安裝或註冊 `@bitbonsai/mcpvault` 與 Obsidian MCP，保持筆記工作流的免 MCP 安全管理模式。
