---
name: clasp-netlify-mcp-workflow
description: Clasp + Netlify MCP 零複製雙向閉環網頁系統工作流。建立網頁前端、GAS 後端及自動部署時載入。
---

# Clasp 雲端部署 + Netlify MCP 零複製雙向閉環網頁系統工作流

本技能定義了 Clasp 與 Netlify MCP 配合的完整自動化部署流程，實現「網頁前端 + Google Sheets 資料庫（GAS Web App API）+ Netlify 部署」的零複製、安全雙向閉環系統。

---

## 🔒 一、 先備條件與安全原則
1. **本機依賴**：必須安裝 `Node.js`（v22+）、`npm`、`git`。
2. **認證保護**：**嚴禁**將 Netlify Personal Access Token、GITHUB_TOKEN 或任何 Google 帳號憑證寫入程式碼或提交。
3. **安全排除**：確認 `.gitignore` 已加入：
   ```git
   .clasprc.json
   .clasp.json
   node_modules/
   ```

---

## 📁 二、 本地檔案結構準備
在部署前，AI 必須在本地建立以下結構：
1. **GAS 檔 (`gas_code.js`)**：包含 `doPost(e)` 與 `doGet(e)` 處理 API 請求與試算表寫入。
2. **GAS 設定 (`appsscript.json`)**：
   ```json
   {
     "timeZone": "Asia/Taipei",
     "dependencies": {},
     "exceptionLogging": "STACKDRIVER",
     "runtimeVersion": "V8",
     "webapp": {
       "executeAs": "USER_DEPLOYING",
       "access": "ANYONE_ANONYMOUS"
     }
   }
   ```
3. **排除過濾清單 (`.claspignore`)**：
   在專案根目錄建立 `.claspignore`，**僅允許**推送 GAS 後端，排除所有前端檔案：
   ```text
   **/*
   !gas_code.js
   !appsscript.json
   ```
4. **前端網頁檔案**：HTML、CSS、JS。連線 JS 必須留有 API 網址預留空字串：
   ```javascript
   const GAS_API_URL = "YOUR_GAS_API_URL_HERE";
   ```

---

## 🚀 三、 完整自動化安裝與部署步驟

當接收到閉環系統建立或部署指示時，AI 應依序執行：

1. **安裝 Clasp 本地開發工具**：
   * 執行：`npm.cmd install --save-dev @google/clasp`
2. **完成 Google 雲端授權**：
   * 執行：`npx.cmd clasp login`
   * *AI 行動*：從 Terminal 輸出中完整抓取 `🔑 Authorize clasp by visiting this url: ...` 授權連結，清晰呈現給使用者引導點擊。
3. **創建 GAS 雲端專案**：
   * 執行：`npx.cmd clasp create --title "專案資料庫" --type standalone`
4. **推送後端與發佈 Web App**：
   * 執行強推：`npx.cmd clasp push -f`
   * 執行發佈：`npx.cmd clasp deploy --description "Production Web App"`
5. **動態注入 API 網址**：
   * 執行 `npx.cmd clasp deployments` 列出部署。
   * *AI 行動*：抓取最新的 Deployment ID，組合成網址：`https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec`，自動替換前端 JS 中的 `YOUR_GAS_API_URL_HERE`。
6. **Netlify 發佈網頁**：
   * *AI 行動*：
     1. 使用 Netlify MCP（或 `npx.cmd -y @netlify/mcp create-new-project`）建立新網站獲取 `site_id`。
     2. 使用 Netlify MCP（或 `npx.cmd -y @netlify/mcp deploy-site`）上傳前端目錄。
     3. 輸出最終 Netlify 公共網址給使用者。

---

## 🩹 四、 五大踩坑與解法對策
1. **Google 帳號未啟用 Apps Script API**：
   * *徵兆*：`User has not enabled the Apps Script API...`
   * *對策*：引導點擊 [Apps Script 使用者設定頁面](https://script.google.com/home/usersettings) 並開啟 API。
2. **前端檔案推送到 GAS 導致報錯**：
   * *徵兆*：`ReferenceError: document is not defined`
   * *對策*：確認 `.claspignore` 正確，微調 `gas_code.js` 重新強推 `npx.cmd clasp push -f` 即可自動刪除遠端舊檔案。
3. **腳本權限未經首次執行驗證 (Authorization Required)**：
   * *徵兆*：前端 Fetch 回傳「無法開啟檔案」或權限錯誤。
   * *對策*：引導擁有者點開專案線上編輯器，點擊「執行」任意函數，完成 Google 線上權限審查授權。
4. **Netlify MCP 部署提示 `state.json` 不存在**：
   * *對策*：不可直接 deploy。必須先執行 `create-new-project` 獲取 site ID 後再執行部署。
5. **瀏覽器多重帳號登入 Session 衝突**：
   * *對策*：強烈建議使用者使用「無痕視窗 (Incognito)」或乾淨的瀏覽器環境開啟 Netlify 網址進行實測。
