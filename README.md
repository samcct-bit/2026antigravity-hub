# 2026antigravity-hub

> AntiGravity 懶人包與個人工作流管理專案

本專案是為 AntiGravity 所設計的個人工作流管理中心，整合了 NotebookLM、GitHub、Firebase 以及 Obsidian 的高效安全協作架構。

## 📁 專案結構

- `ANTIGRAVITY.md`：核心工作規則與邊界，規範 AI 行為。
- `notes/`：專案筆記與 Obsidian 駕駛艙，記錄專案目標、下一步行動與開發踩坑。
- `assets/`：專案素材與生成的圖片存放處。
- `09-AntiGravity專屬懶人包.md`：本機參考之完整設定指南。

## 🔒 安全原則

1. **認證安全**：NotebookLM 登入採用瀏覽器 OAuth，本專案不保留任何 Cookie 或 Token。
2. **無金鑰提交**：絕不提交任何 API 金鑰、Token 或 Firebase Admin 憑證。
3. **精準 Commit**：收工時仔細檢查變更，不使用無差別 `git add .`。
