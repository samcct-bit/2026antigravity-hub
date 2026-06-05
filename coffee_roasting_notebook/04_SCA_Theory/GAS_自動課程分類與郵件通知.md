---
type: sca_theory
title: "GAS 自動課程分類與郵件通知"
date: 2026-02-05
tags: [coffee/sca_theory, imported/takeout]
---

# 📚 SCA 考官理論：GAS 自動課程分類與郵件通知

## 📋 對話理論紀錄
```javascript
/**
 * 自動讀取第一張工作表的最後一筆資料，
 * 分類至對應工作表，並從 Google Doc 讀取範本寄送個人化感謝信。
 */
function processLatestCourseEntry() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sourceSheet = ss.getSheets()[0]; // 取得第一個工作表（表單回應）
  const lastRow = sourceSheet.getLastRow();
  
  // 如果只有標題列或沒有資料，則停止執行
  if (lastRow < 2) {
    console.log("目前沒有可處理的資料內容。");
    return;
  }

  // 1. 取得標題列，用來定位特定欄位的索引位置
  const headers = sourceSheet.getRange(1, 1, 1, sourceSheet.getLastColumn()).getValues()[0];
  
  // 定義我們需要獲取的目標欄位名稱
  const targetFields = ["時間戳記", "電子郵件地址", "姓名", "性別", "選擇要參加的課程"];
  
  // 建立欄位索引地圖
  const colIndices = targetFields.map(field => headers.indexOf(field));

  if (colIndices.includes(-1)) {
    SpreadsheetApp.getUi().alert("錯誤：找不到必要的欄位標題，請確認包含：\n" + targetFields.join(", "));
    return;
  }

  // 2. 取得最後一筆資料的值
  const lastRowValues = sourceSheet.getRange(lastRow, 1, 1, sourceSheet.getLastColumn()).getValues()[0];

  const email = lastRowValues[colIndices[1]];
  const name = lastRowValues[colIndices[2]];
  const gender = lastRowValues[colIndices[3]];
  const courseName = lastRowValues[colIndices[4]];

  if (!courseName || courseName.toString().trim() === "") {
    console.log("課程名稱為空，跳過處理。");
    return;
  }

  // 3. 處理目標工作表分類
  let targetSheet = ss.getSheetByName(courseName);
  if (!targetSheet) {
    targetSheet = ss.insertSheet(courseName);
    targetSheet.appendRow(targetFields);
    
    // 美化標題列
    const headerRange = targetSheet.getRange(1, 1, 1, targetFields.length);
    headerRange.setFontWeight("bold").setBackground("#f3f3f3");
    targetSheet.setFrozenRows(1);
  }

  // 寫入資料到分類分頁
  const rowData = colIndices.map(idx => lastRowValues[idx]);
  targetSheet.appendRow(rowData);
  targetSheet.autoResizeColumns(1, targetFields.length);

  // 4. 讀取 Google Doc 範本並寄送郵件
  try {
    const docId = "1JoyxqOAVwQJqDZi2ndq7clf0HDKGW-oebnruw2zEIVg";
    const doc = DocumentApp.openById(docId);
    const docContent = doc.getBody().getText();

    // 判斷稱謂 (根據性別欄位)
    let salutation = "";
    const genderStr = gender ? gender.toString().trim() : "";
    if (genderStr === "男" || genderStr === "男性") {
      salutation = "先生";
    } else if (genderStr === "女" || genderStr === "女性") {
      salutation = "小姐";
    } else {
      salutation = "君"; // 若性別不明則使用通用稱謂
    }

    // 組合郵件內容：第一行為姓名稱謂，接著是 Doc 內文
    const finalEmailBody = `${name}${salutation}您好：\n\n${docContent}`;
    const subject = `【報名成功確認】2026 AI 課程：${courseName}`;

    // 執行寄信
    if (email && email.toString().includes("@")) {
      MailApp.sendEmail({
        to: email,
        subject: subject,
        body: finalEmailBody
      });
      console.log(`郵件已成功寄送至：${email}`);
    } else {
      console.warn("電子郵件地址無效或缺失，跳過寄信步驟。");
    }

  } catch (err) {
    console.error("讀取文件或寄送郵件時發生錯誤：" + err.message);
  }

  console.log(`成功處理：已將「${name}」資料歸類並完成通知。`);
}

/**
 * 當試算表開啟時建立自訂選單
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('自動化工具')
      .addItem('手動分類最後一筆並寄信', 'processLatestCourseEntry')
      .addToUi();
}
```


## 🖼️ 相關參考圖片與文件
[[2026烘豆機選購指南-acd668a8e22d7335.pdf]] (附件檔案) ![[Gemini_Generated_Image_8ggri88ggr-44a8442c4e958641.jpg]] ![[Gemini_Generated_Image_htsu2ahtsu-e11f6500ada5b266.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-96a4cef5cc1008b1.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-be202b15b4d41e70.jpg]] ![[Gemini_Generated_Image_q59snqq59s-d7376f45389320a6.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-153057063c8c793c.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-758609cfa28db9a7.jpg]]

## 🔬 科學物理觀點解析
- *此理論卡片由 Gemini Takeout 匯出對話分析自動生成。*

## 🔗 相關理論與對話推薦
- [[2026-03-28_實戰演練：_給您一款豆子的資訊（產區_處理法），幫我撰寫一份符合「金成淬」風格的風味描述，讓我可以呈現在標籤上_771]] (共用特徵: `肯亞, ror, 風門`)
- [[2026-04-13_請幫我更新提示詞，以將網頁中固定會出現的logo更正為下方logo連結：_https___drive.google.co_518]] (共用特徵: `肯亞, ror, 風門`)
- [[2026-02-05_SCA_Roasting_Intermediate_烘豆中級模擬試題_1386]] (共用特徵: `肯亞, ror, 風門`)
- [[2026-02-16_好的_1292]] (共用特徵: `肯亞, ror, 風門`)
- [[2026-02-16_根據前幾鍋的經驗，即使入豆溫高達195度，回溫點低至73，入豆溫降至170度，回溫點更是低到66度，按照您的建議180度_1289]] (共用特徵: `肯亞, ror, 風門`)
