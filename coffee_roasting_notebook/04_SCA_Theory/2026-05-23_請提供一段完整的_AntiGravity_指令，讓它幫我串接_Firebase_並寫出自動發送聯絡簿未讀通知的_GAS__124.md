---
type: sca_theory
title: "請提供一段完整的 AntiGravity 指令，讓它幫我串接 Firebase "
date: 2026-05-23
tags: [coffee/sca_theory, imported/takeout]
---

# 📚 SCA 考官理論：請提供一段完整的 AntiGravity 指令，讓它幫我串接 Firebase 並寫出自動發送聯絡簿未讀通知的 GAS 

## 📋 對話理論筆記
蔡老師您好，我是全方位專家。

針對您的自動化需求，以下為您規劃專屬的 **AntiGravity 2.0 高階指令模板**。這個指令採用了「防禦性編程（Defensive Programming）」邏輯，能引導 AI 代理人在生成 Google Apps Script (GAS) 時，自動嵌入雙重校驗機制，徹底杜絕 Firebase 與 Google Sheets 資料被異常覆蓋的風險。

---

### 一、 AntiGravity 2.0 主控指令模板（可直接複製使用）

請將以下這段結構化指令，直接貼入 AntiGravity 2.0 的對話視窗中：

 【角色設定】
你現在是資深雲端架構師與 Google Workspace 自動化專家。請為我開發一套結合 Firebase 與 Google Sheets 聯絡簿的「未讀通知自動發送系統」。

【系統架構與任務要求】
1. 建立一個 Google Apps Script (GAS) 腳本。
2. 系統需讀取 Google Sheets 內「聯絡簿資料表」中的學生/家長名單與通知狀態。
3. 系統需與 Firebase Realtime Database 進行 REST API 連線，同步「當日聯絡簿未讀狀態」（欄位包含：student_id, date, status, last_notify_time）。
4. 針對 Firebase 中 status 為 "unread" 且今日尚未發過通知的對象，自動透過 Gmail 發送提醒信件。

【核心安全機制（強制執行）】
為了防止資料誤蓋或重複發送，你生成的程式碼必須嚴格遵守以下防禦性邏輯：
- 寫入前檢查（Read-Before-Write）：在更新 Firebase 或試算表狀態前，必須先撈取該節點的最新狀態。若狀態已變更為 "read" 或 "notified"，必須立刻中斷該筆處理。
- 僅限附加紀錄（Append-Only Log）：系統所有自動化操作（發信成功/失敗、連線異常），必須透過 appendRow() 寫入獨立的「系統日誌（Log）」分頁，嚴禁複寫歷史紀錄。
- 狀態鎖定（State Lock）：發送 Gmail 前，先將試算表或 Firebase 的狀態改為 "sending"，成功後改為 "notified"，若失敗則還原並記錄異常，避免因網路延遲導致重複發送。

【輸出格式】
請直接提供完整的 GAS 程式碼，並在關鍵安全邏輯處加上詳細的繁體中文註解。
  

---

### 二、 核心安全架構與 GAS 示範程式碼

 根據上述指令，AntiGravity 2.0 將會為您生成類似下方結構的防禦性腳本。以下提供核心連線與安全校驗的實作範例：

 /**
 * 聯絡簿未讀通知主程式（具備防誤蓋安全機制）
 */
function sendUnreadNotifications() {
  const SPREADSHEET_ID = "您的_GOOGLE_SHEETS_ID";
  const FIREBASE_DB_URL = "https://您的_PROJECT_ID.firebaseio.com/";
  const FIREBASE_TOKEN = "您的_FIREBASE_AUTH_TOKEN_或_SECRET";
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const dataSheet = ss.getSheetByName("聯絡簿資料表");
  const logSheet = ss.getSheetByName("系統日誌"); // 安全機制：獨立日誌表
  
  const todayStr = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd");
  const data = dataSheet.getDataRange().getValues();
  
  // 從第二行開始讀取學生資料 (假設欄位：0學號, 1姓名, 2家長Email, 3今日狀態)
  for (let i = 1; i < data.length; i++) {
    let studentId = data[i][0];
    let studentName = data[i][1];
    let parentEmail = data[i][2];
    
    if (!studentId) continue;
    
    try {
      // --- 安全機制 1：寫入前檢查 (Read-Before-Write) ---
      let firebasePath = `contacts/${todayStr}/${studentId}.json?auth=${FIREBASE_TOKEN}`;
      let response = UrlFetchApp.fetch(FIREBASE_DB_URL + firebasePath);
      let fbData = JSON.parse(response.getContentText());
      
      // 如果 Firebase 中根本沒有這筆紀錄，或是已經讀取、今日已通知，則直接跳過，不進行任何複寫
      if (!fbData || fbData.status === "read" || fbData.status === "notified") {
        continue; 
      }
      
      // --- 安全機制 2：狀態鎖定 (State Lock) 防止重複發送 ---
      // 先在 Firebase 標記為發送中，避免並行操作或延遲造成二次觸發
      let lockPayload = JSON.stringify({ status: "sending", last_notify_time: new Date().toISOString() });
      UrlFetchApp.fetch(FIREBASE_DB_URL + firebasePath, {
        method: "patch",
        contentType: "application/json",
        payload: lockPayload
      });
      
      // --- 執行核心任務：發送通知 ---
      let emailSubject = `【未讀提醒】今日電子聯絡簿尚未查閱`;
      let emailBody = `${studentName} 的家長您好：\n\n今日的學校聯絡簿目前尚未有您的查閱紀錄，請抽空點選連結查看，謝謝！`;
      
      MailApp.sendEmail(parentEmail, emailSubject, emailBody);
      
      // --- 任務成功：更新最終狀態 ---
      let successPayload = JSON.stringify({ status: "notified" });
      UrlFetchApp.fetch(FIREBASE_DB_URL + firebasePath, {
        method: "patch",
        contentType: "application/json",
        payload: successPayload
      });
      
      // 更新 Google Sheets 當前欄位狀態
      dataSheet.getRange(i + 1, 4).setValue("已發信提醒");
      
      // --- 安全機制 3：僅限附加紀錄 (Append-Only Log) ---
      logSheet.appendRow([new Date(), "SUCCESS", `已成功發送通知給 ${studentName} 的家長 (${parentEmail})`]);
      
    } catch (error) {
      // 異常處理：若發信或連線失敗，將狀態還原為 unread，並寫入錯誤日誌
      logSheet.appendRow([new Date(), "ERROR", `處理學生編號 ${studentId} 時發生異常: ${error.toString()}`]);
      
      // 嘗試還原鎖定狀態
      try {
        let rollbackPayload = JSON.stringify({ status: "unread" });
        UrlFetchApp.fetch(FIREBASE_DB_URL + `contacts/${todayStr}/${studentId}.json?auth=${FIREBASE_TOKEN}`, {
          method: "patch",
          contentType: "application/json",
          payload: rollbackPayload
        });
      } catch (rollbackError) {
        logSheet.appendRow([new Date(), "CRITICAL", `還原狀態失敗: ${rollbackError.toString()}`]);
      }
    }
  }
}
  

---

### 三、 專家風險提醒與邏輯盲點

 在將這套生成指令投入實際運行前，全方位專家為您指出以下兩個實務操作上的**盲點與隱藏風險**：

1. **Firebase REST API 的權限漏洞**：
上述代碼使用的是 Firebase Legacy Tokens (Database Secrets) 或簡單的 Auth 參數。由於這類權限通常是全開（Admin）的，一旦腳本或 Sheet 權限不小心分享給其他人，等同於將整個 Firebase 資料庫的修改權拱手讓人。

- *替代方案*：若資安要求較高，建議請 AntiGravity 2.0 改用 **Google Cloud Service Account JWT** 進行 OAuth2 認證，並在 Firebase Security Rules 中限縮該帳號只能對  contacts/  路徑進行  read  與  update ，無法進行  delete 。
2. **GAS 執行時間限制與配額（6分鐘限制）**：
如果名單人數較多（例如跨班級或全學年），且每次迴圈都要進行兩次  UrlFetchApp.fetch （一次讀取、一次鎖定/更新），很容易因為網路延遲導致腳本執行超過 6 分鐘而被迫中斷。中斷可能導致部分學生狀態停留在 "sending" 鎖定狀態。

- *優化建議*：在指令中加入要求：「請優化連線效率，改採一次性獲取當日所有節點的 JSON 資料，在 GAS 記憶體內進行資料比對後，再分批（Batch Update）發送與更新狀態。」

## 🖼️ 理論參考圖片
[[Antigravity2_Coffee_Skill_Archite-9c2eacaa7a629653.pdf]] (附件) [[New Note-d803819e815fe0e1]] (附件)

## 🔗 相關理論與對話推薦
- [[2026-04-13_肯亞AA_完整版_530]] (共用特徵: `肯亞, ror, tp`)
- [[2026-04-13_請幫我更新提示詞，以將網頁中固定會出現的logo更正為下方logo連結：_https___drive.google.co_518]] (共用特徵: `肯亞, ror, tp`)
- [[2026-04-13_金成淬專屬提示詞_513]] (共用特徵: `肯亞, ror, tp`)
- [[肯亞AA_完整版]] (共用特徵: `肯亞, ror, tp`)
- [[金成淬專屬提示詞]] (共用特徵: `肯亞, ror, tp`)
