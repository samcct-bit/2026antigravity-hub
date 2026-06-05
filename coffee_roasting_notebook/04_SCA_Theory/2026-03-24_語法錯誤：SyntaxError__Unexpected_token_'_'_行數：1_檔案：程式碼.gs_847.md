---
type: sca_theory
title: "語法錯誤：SyntaxError: Unexpected token '<' 行"
date: 2026-03-24
tags: [coffee/sca_theory, imported/takeout]
---

# 📚 SCA 考官理論：語法錯誤：SyntaxError: Unexpected token '<' 行數：1 檔案：程式碼.gs

## 📋 對話理論筆記
這個錯誤是因為您不小心將**前端的 HTML 程式碼**（包含  <  標籤的內容）貼到了 Google Apps Script (GAS) 的  程式碼.gs  檔案中了。

GAS 預期的是 JavaScript 程式碼，所以看到 HTML 的  <  符號就會出現  SyntaxError: Unexpected token '<'  的錯誤。

### 解決方法：

請回到您的 Google 試算表，打開「擴充功能」>「Apps Script」，然後**清空  程式碼.gs  裡面所有的內容**，並將下方這段 **GAS 專用的後端程式碼** 複製貼上：

 function doPost(e) {
  try {
    var params = JSON.parse(e.postData.contents);
    var action = params.action; var data = params.data; var result = {};
    initSheets();
    if (action === "getTopics") result = getTopics();
    else if (action === "addTopic") result = addTopic(data);
    else if (action === "updateTopicStatus") result = updateTopicStatus(data.id, data.isActive);
    else if (action === "getSubmissions") result = getSubmissions();
    else if (action === "addSubmission") result = addSubmission(data);
    else if (action === "updateSubmission") result = updateSubmission(data);
    else if (action === "getSettings") result = getSettings();
    else if (action === "updateSettings") result = updateSettings(data);
    else throw new Error("Unknown action");
    return ContentService.createTextOutput(JSON.stringify({ success: true, data: result })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}
function doGet(e) { return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT); }
function initSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss.getSheetByName("系統設定")) { var s = ss.insertSheet("系統設定"); s.appendRow(["設定鍵", "設定值", "更新時間"]); s.appendRow(["criteria", JSON.stringify(["立意取材", "結構組織", "遣詞造句", "總結建議"]), new Date().toISOString()]); }
  if (!ss.getSheetByName("題目清單")) { ss.insertSheet("題目清單").appendRow(["題目ID", "標題", "內容", "狀態", "建立時間"]); }
  if (!ss.getSheetByName("繳交紀錄")) { ss.insertSheet("繳交紀錄").appendRow(["繳交ID", "題目ID", "學生姓名", "類型", "檔案類型", "內容", "狀態", "AI批改結果", "教師評分", "教師評語", "查看密碼", "建立時間"]); }
}
function getSettings() { var d = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("系統設定").getDataRange().getValues(); var s = {}; for (var i=1; i<d.length; i++) s[d[i][0]] = d[i][1]; return s; }
function updateSettings(data) { var s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("系統設定"); var v = s.getDataRange().getValues(); for (var i=1; i<v.length; i++) { if (v[i][0] === data.key) { s.getRange(i+1, 2).setValue(data.value); return true; } } s.appendRow([data.key, data.value, new Date().toISOString()]); return true; }
function getTopics() { var d = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("題目清單").getDataRange().getValues(); var t = []; for (var i=1; i<d.length; i++) t.push({id: d[i][0], title: d[i][1], content: d[i][2], isActive: d[i][3]===true||d[i][3]==="true"}); return t; }
function addTopic(data) { var id = "T_"+new Date().getTime(); SpreadsheetApp.getActiveSpreadsheet().getSheetByName("題目清單").appendRow([id, data.title, data.content, true, new Date().toISOString()]); return {id: id}; }
function updateTopicStatus(id, active) { var s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("題目清單"); var d = s.getDataRange().getValues(); for (var i=1; i<d.length; i++) { if (d[i][0] === id) { s.getRange(i+1, 4).setValue(active); return true; } } }
function getSubmissions() { var d = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("繳交紀錄").getDataRange().getValues(); var r = []; for (var i=1; i<d.length; i++) r.push({id: d[i][0], topicId: d[i][1], studentName: d[i][2], type: d[i][3], mimeType: d[i][4], content: d[i][5], status: d[i][6], aiGrading: d[i][7]?JSON.parse(d[i][7]):null, manualScore: d[i][8], manualComment: d[i][9], viewPassword: d[i][10], createdAt: d[i][11]}); return r; }
function addSubmission(data) { var id = "S_"+new Date().getTime(); SpreadsheetApp.getActiveSpreadsheet().getSheetByName("繳交紀錄").appendRow([id, data.topicId, data.studentName, data.type, data.mimeType, data.content, "pending", "", "", "", "", new Date().toISOString()]); return {id: id}; }
function updateSubmission(data) { var s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("繳交紀錄"); var v = s.getDataRange().getValues(); for (var i=1; i<v.length; i++) { if (v[i][0] === data.id) { if(data.aiGrading!==undefined) s.getRange(i+1, 8).setValue(JSON.stringify(data.aiGrading)); if(data.status!==undefined) s.getRange(i+1, 7).setValue(data.status); if(data.manualScore!==undefined) s.getRange(i+1, 9).setValue(data.manualScore); if(data.manualComment!==undefined) s.getRange(i+1, 10).setValue(data.manualComment); if(data.viewPassword!==undefined) s.getRange(i+1, 11).setValue(data.viewPassword); return true; } } }
  
 **貼上後，請記得：**

1. 點擊上方的 💾 (儲存) 按鈕。
2. 點擊右上角的「部署」>「新增部署作業」。
3. 確保存取權限設為「**所有人**」，然後完成部署並授權。
4. 重新複製新的「網頁應用程式網址」回到介面上設定即可！

## 🖼️ 理論參考圖片
[[New Note-d803819e815fe0e1]] (附件)

## 🔗 相關理論與對話推薦
- [[2026-04-13_肯亞AA_完整版_530]] (共用特徵: `肯亞, ror, tp`)
- [[2026-04-13_請幫我更新提示詞，以將網頁中固定會出現的logo更正為下方logo連結：_https___drive.google.co_518]] (共用特徵: `肯亞, ror, tp`)
- [[2026-04-13_金成淬專屬提示詞_513]] (共用特徵: `肯亞, ror, tp`)
- [[肯亞AA_完整版]] (共用特徵: `肯亞, ror, tp`)
- [[金成淬專屬提示詞]] (共用特徵: `肯亞, ror, tp`)
