/**
 * 蔡老師行政工具箱 - 國小班級成績自動轉換與分析器
 * 
 * 功能特點：
 * 1. 智慧型雙模式：自動辨識「僅期中考」或「期中與期末考」狀態，動態生成成績與狀態欄位。
 * 2. 智慧建欄：若「期中成績」、「期末成績」、「學期總成績」或「狀態」欄位不存在，會自動在合適的位置插入新欄位。
 * 3. 極致防呆：欄位留白、填寫非數字、缺考均會自動視為 0 分處理，絕不中斷程式。
 * 4. 不及格視覺標示：自動將不及格學生整列著色為淡紅色 (#FCE4D6)，及格學生重置為白色。
 * 5. 全動態統計區塊：自動清理舊有的統計行，重新在最下方生成全班「平均分、最高分、最低分、不及格人數」與「月考級距表」。
 * 
 * 使用方式：
 * 將此程式碼完整複製並貼入 Google 試算表的「擴充功能」 -> 「Apps Script」中，存檔後重啟試算表即可在上方工具列看到「蔡老師行政工具箱」。
 */

/**
 * 試算表開啟時自動執行，建立上方自訂選單
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('蔡老師行政工具箱')
    .addItem('一鍵轉換並分析成績', 'analyzeGrades')
    .addToUi();
}

/**
 * 核心分析主程式
 */
function analyzeGrades() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  // 優先對接名為「學生成績輸入表」的工作表，若不存在則對接目前活動中的工作表
  var sheet = ss.getSheetByName("學生成績輸入表") || ss.getActiveSheet();
  
  // 取得工作表的所有資料
  var lastRow = sheet.getLastRow();
  var lastColumn = sheet.getLastColumn();
  
  if (lastRow < 2) {
    SpreadsheetApp.getUi().alert("⚠️ 錯誤：工作表內沒有足夠的資料（至少需要首行標頭與一行學生資料）！");
    return;
  }
  
  // 1. 讀取並解析第一行（標頭行）
  var headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  
  // 定義我們需要尋找的欄位名稱（支援多種常見命名方式）
  var colIndices = {
    usualMid: -1,  // 期中平時
    examMid: -1,   // 期中月考
    totalMid: -1,  // 期中成績
    usualFin: -1,  // 期末平時
    examFin: -1,   // 期末月考
    totalFin: -1,  // 期末成績
    totalSem: -1,  // 學期總成績
    status: -1     // 狀態
  };
  
  // 掃描現有欄位
  for (var i = 0; i < headers.length; i++) {
    var header = headers[i].toString().trim();
    
    // 期中平時判定
    if (header === "平時" || header === "期中平時" || header === "平時成績") {
      colIndices.usualMid = i + 1;
    }
    // 期中月考判定
    else if (header === "月考" || header === "期中月考" || header === "月考1" || header === "期中月考成績") {
      colIndices.examMid = i + 1;
    }
    // 期中成績判定
    else if (header === "期中" || header === "期中成績" || header === "期中總分") {
      colIndices.totalMid = i + 1;
    }
    // 期末平時判定
    else if (header === "期末平時" || header === "平時2" || header === "期末平時成績") {
      colIndices.usualFin = i + 1;
    }
    // 期末月考判定
    else if (header === "期末月考" || header === "月考2" || header === "期末月考成績") {
      colIndices.examFin = i + 1;
    }
    // 期末成績判定
    else if (header === "期末" || header === "期末成績" || header === "期末總分") {
      colIndices.totalFin = i + 1;
    }
    // 學期總成績判定
    else if (header === "學期總成績" || header === "學期成績" || header === "總成績" || header === "總分") {
      colIndices.totalSem = i + 1;
    }
    // 狀態判定
    else if (header === "狀態") {
      colIndices.status = i + 1;
    }
  }
  
  // 2. 判斷運算模式（期中單考模式 vs 學期模式）
  // 只要有偵測到期末平時或期末月考的欄位，就判定為學期模式
  var isSemesterMode = (colIndices.usualFin !== -1 || colIndices.examFin !== -1);
  
  // 如果連最基本的期中平時與月考欄位都沒找到，提醒老師
  if (colIndices.usualMid === -1 || colIndices.examMid === -1) {
    SpreadsheetApp.getUi().alert("⚠️ 找不到期中平時或期中月考欄位！\n請確認第一行標頭是否包含「平時」(或期中平時) 與「月考」(或期中月考)。");
    return;
  }
  
  // 3. 自動補齊缺失的計算欄位
  // A. 處理期中成績欄位
  if (colIndices.totalMid === -1) {
    // 若沒有期中成績欄位，在期中月考後面插入一欄
    sheet.insertColumnAfter(colIndices.examMid);
    sheet.getRange(1, colIndices.examMid + 1).setValue("期中成績");
    colIndices.totalMid = colIndices.examMid + 1;
    // 修正之後所有在該欄右側的欄位索引
    adjustColumnIndices(colIndices, colIndices.totalMid);
    lastColumn++;
  }
  
  // B. 處理學期模式下的期末與學期總成績欄位
  if (isSemesterMode) {
    // 確保有期末成績欄位
    if (colIndices.totalFin === -1) {
      var insertAfterCol = colIndices.examFin !== -1 ? colIndices.examFin : lastColumn;
      sheet.insertColumnAfter(insertAfterCol);
      sheet.getRange(1, insertAfterCol + 1).setValue("期末成績");
      colIndices.totalFin = insertAfterCol + 1;
      adjustColumnIndices(colIndices, colIndices.totalFin);
      lastColumn++;
    }
    // 確保有學期總成績欄位
    if (colIndices.totalSem === -1) {
      sheet.insertColumnAfter(colIndices.totalFin);
      sheet.getRange(1, colIndices.totalFin + 1).setValue("學期總成績");
      colIndices.totalSem = colIndices.totalFin + 1;
      adjustColumnIndices(colIndices, colIndices.totalSem);
      lastColumn++;
    }
  }
  
  // C. 處理狀態欄位
  if (colIndices.status === -1) {
    // 將狀態欄位放在最後一個計算分數欄位之後
    var baseCol = isSemesterMode ? colIndices.totalSem : colIndices.totalMid;
    sheet.insertColumnAfter(baseCol);
    sheet.getRange(1, baseCol + 1).setValue("狀態");
    colIndices.status = baseCol + 1;
    adjustColumnIndices(colIndices, colIndices.status);
    lastColumn++;
  }
  
  // 4. 定位真正的學生資料列（排除底部的統計行）
  // 讀取第一欄「座號」
  var seatNumbers = sheet.getRange(1, 1, lastRow, 1).getValues();
  var studentLastRow = 1;
  
  for (var r = 1; r < lastRow; r++) {
    var seatVal = seatNumbers[r][0];
    // 座號若為正整數，判定為學生資料列
    if (typeof seatVal === 'number' && !isNaN(seatVal) && seatVal > 0 && Number.isInteger(seatVal)) {
      studentLastRow = r + 1; // 轉為 1-based index
    }
  }
  
  if (studentLastRow === 1) {
    SpreadsheetApp.getUi().alert("⚠️ 錯誤：找不到任何有效的學生資料列（請確認『座號』欄位為正整數數字，如 1, 2, 3...）！");
    return;
  }
  
  // 5. 動態清理舊的統計區塊（學生資料列底下的所有格式與內容）
  if (lastRow > studentLastRow) {
    var oldStatsRange = sheet.getRange(studentLastRow + 1, 1, lastRow - studentLastRow, lastColumn);
    oldStatsRange.clearContent();
    oldStatsRange.setBackground(null);
    oldStatsRange.setFontWeight("normal");
    oldStatsRange.setFontStyle("normal");
    oldStatsRange.setFontColor(null);
    oldStatsRange.setBorder(false, false, false, false, false, false);
    oldStatsRange.setHorizontalAlignment("left");
  }
  
  // 6. 逐行運算學生成績、判定狀態、不及格標色
  // 取得學生行的所有資料以提高執行效率
  var studentRange = sheet.getRange(2, 1, studentLastRow - 1, lastColumn);
  var studentData = studentRange.getValues();
  var rowBackgrounds = studentRange.getBackgrounds();
  
  // 統計所需的陣列
  var midtermUsuals = [];
  var midtermExams = [];
  var midtermTotals = [];
  var finalUsuals = [];
  var finalExams = [];
  var finalTotals = [];
  var semesterTotals = [];
  
  for (var i = 0; i < studentData.length; i++) {
    var row = studentData[i];
    
    // A. 讀取並防呆處理期中成績
    var midUsual = parseFloat(row[colIndices.usualMid - 1]);
    var midExam = parseFloat(row[colIndices.examMid - 1]);
    
    midUsual = (isNaN(midUsual) || midUsual < 0) ? 0 : midUsual;
    midExam = (isNaN(midExam) || midExam < 0) ? 0 : midExam;
    
    // 計算期中成績 = 平時 60% + 月考 40%
    var midTotal = Math.round((midUsual * 0.6 + midExam * 0.4) * 100) / 100;
    
    // 寫回記憶體
    row[colIndices.totalMid - 1] = midTotal;
    
    // 收集統計數據
    midtermUsuals.push(midUsual);
    midtermExams.push(midExam);
    midtermTotals.push(midTotal);
    
    var finalScoreToJudge = midTotal; // 用於及格判斷的分數，預設為期中成績
    
    // B. 若為學期模式，讀取並防呆處理期末及學期總成績
    if (isSemesterMode) {
      var finUsual = parseFloat(row[colIndices.usualFin - 1]);
      var finExam = parseFloat(row[colIndices.examFin - 1]);
      
      finUsual = (isNaN(finUsual) || finUsual < 0) ? 0 : finUsual;
      finExam = (isNaN(finExam) || finExam < 0) ? 0 : finExam;
      
      // 計算期末成績 = 平時 60% + 月考 40%
      var finTotal = Math.round((finUsual * 0.6 + finExam * 0.4) * 100) / 100;
      row[colIndices.totalFin - 1] = finTotal;
      
      // 計算學期總成績 = (期中 + 期末) / 2
      var semTotal = Math.round(((midTotal + finTotal) / 2) * 100) / 100;
      row[colIndices.totalSem - 1] = semTotal;
      
      // 收集期末與學期數據
      finalUsuals.push(finUsual);
      finalExams.push(finExam);
      finalTotals.push(finTotal);
      semesterTotals.push(semTotal);
      
      finalScoreToJudge = semTotal; // 學期模式下，及格與否看學期總成績
    }
    
    // C. 判斷及格狀態與設定 Row 背景顏色
    if (finalScoreToJudge >= 60) {
      row[colIndices.status - 1] = "及格";
      // 及格則重置背景為白色
      for (var colIdx = 0; colIdx < lastColumn; colIdx++) {
        rowBackgrounds[i][colIdx] = "#FFFFFF";
      }
    } else {
      row[colIndices.status - 1] = "不及格";
      // 不及格著色為淡紅色 (#FCE4D6)
      for (var colIdx = 0; colIdx < lastColumn; colIdx++) {
        rowBackgrounds[i][colIdx] = "#FCE4D6";
      }
    }
  }
  
  // 將運算好的成績、狀態與背景顏色寫回試算表
  studentRange.setValues(studentData);
  studentRange.setBackgrounds(rowBackgrounds);
  
  // 7. 產生全班統計摘要行（平均、最高、最低、不及格人數）
  // 決定統計行寫入的起始列（學生最後一列下方空一行，即 studentLastRow + 2）
  var statsStartRow = studentLastRow + 2;
  
  // 建立統計摘要資料矩陣，預設全為空字串
  var statsRows = [
    createEmptyRow(lastColumn, "全班平均分"),
    createEmptyRow(lastColumn, "全班最高分"),
    createEmptyRow(lastColumn, "全班最低分"),
    createEmptyRow(lastColumn, "不及格人數")
  ];
  
  // 計算並填入對應欄位的統計值
  fillStats(statsRows[0], statsRows[1], statsRows[2], statsRows[3], colIndices.usualMid, midtermUsuals, true);
  fillStats(statsRows[0], statsRows[1], statsRows[2], statsRows[3], colIndices.examMid, midtermExams, true);
  fillStats(statsRows[0], statsRows[1], statsRows[2], statsRows[3], colIndices.totalMid, midtermTotals, true);
  
  if (isSemesterMode) {
    fillStats(statsRows[0], statsRows[1], statsRows[2], statsRows[3], colIndices.usualFin, finalUsuals, true);
    fillStats(statsRows[0], statsRows[1], statsRows[2], statsRows[3], colIndices.examFin, finalExams, true);
    fillStats(statsRows[0], statsRows[1], statsRows[2], statsRows[3], colIndices.totalFin, finalTotals, true);
    fillStats(statsRows[0], statsRows[1], statsRows[2], statsRows[3], colIndices.totalSem, semesterTotals, true);
  }
  
  // 寫入全班統計摘要行
  var statsRange = sheet.getRange(statsStartRow, 1, 4, lastColumn);
  statsRange.setValues(statsRows);
  
  // 套用全班統計摘要樣式（淡灰色背景與加粗）
  statsRange.setBackground("#F2F2F2");
  statsRange.setFontWeight("bold");
  statsRange.setFontColor("#333333");
  // 加上簡約實線外框
  statsRange.setBorder(true, true, true, true, true, true, "#D9D9D9", SpreadsheetApp.BorderStyle.SOLID);
  
  // 8. 產生月考級距摘要表格
  var distStartRow = statsStartRow + 6; // 再空兩行開始級距表
  
  // 標題行
  sheet.getRange(distStartRow, 1).setValue("📈 月考成績級距與平均分摘要").setFontWeight("bold").setFontSize(11).setFontColor("#1F4E79");
  
  // 級距表欄位標頭
  var distHeaders = ["月考名稱", "全班平均分", "100分", "90-99分", "80-89分", "70-79分", "60-69分", "未達60分"];
  var distHeaderRange = sheet.getRange(distStartRow + 1, 1, 1, distHeaders.length);
  distHeaderRange.setValues([distHeaders]);
  distHeaderRange.setBackground("#2F5597");
  distHeaderRange.setFontColor("#FFFFFF");
  distHeaderRange.setFontWeight("bold");
  distHeaderRange.setHorizontalAlignment("center");
  
  // 計算級距數據
  var distRowsData = [];
  
  // 期中月考級距
  var midDist = calculateDistribution(midtermExams);
  var midAvg = calculateAverage(midtermExams);
  distRowsData.push([
    "期中月考",
    midAvg,
    midDist.count100,
    midDist.count90to99,
    midDist.count80to89,
    midDist.count70to79,
    midDist.count60to69,
    midDist.countFail
  ]);
  
  // 如果是學期模式，加入期末月考級距
  if (isSemesterMode) {
    var finDist = calculateDistribution(finalExams);
    var finAvg = calculateAverage(finalExams);
    distRowsData.push([
      "期末月考",
      finAvg,
      finDist.count100,
      finDist.count90to99,
      finDist.count80to89,
      finDist.count70to79,
      finDist.count60to69,
      finDist.countFail
    ]);
  }
  
  // 寫入級距數據
  var distDataRange = sheet.getRange(distStartRow + 2, 1, distRowsData.length, distHeaders.length);
  distDataRange.setValues(distRowsData);
  distDataRange.setHorizontalAlignment("center");
  distDataRange.setFontWeight("bold");
  
  // 美化級距數據表
  var fullDistTableRange = sheet.getRange(distStartRow + 1, 1, distRowsData.length + 1, distHeaders.length);
  fullDistTableRange.setBorder(true, true, true, true, true, true, "#B4C6E7", SpreadsheetApp.BorderStyle.SOLID);
  
  // 級距內容底色微調（間行底色）
  for (var d = 0; d < distRowsData.length; d++) {
    var rowBgColor = (d % 2 === 0) ? "#F2F2F2" : "#FFFFFF";
    sheet.getRange(distStartRow + 2 + d, 1, 1, distHeaders.length).setBackground(rowBgColor);
  }
  
  // 提示視窗
  var modeMessage = isSemesterMode ? "學期總成績模式（已包含期中期末考分析）" : "期中單考模式（僅包含期中考分析）";
  SpreadsheetApp.getUi().alert("🎉 成績轉換與分析完成！\n\n當前運行模式：" + modeMessage + "\n已成功完成分值計算、不及格整列標紅（#FCE4D6），並於下方生成「全班平均統計摘要」與「月考級距人數分析表」。");
}

/**
 * 輔助函式：新增欄位後，自動調整其他欄位索引以確保定位正確
 */
function adjustColumnIndices(indices, insertedColIndex) {
  for (var key in indices) {
    if (indices[key] >= insertedColIndex) {
      indices[key]++;
    }
  }
}

/**
 * 輔助函式：建立一個指定長度且首欄有文字的空白列矩陣
 */
function createEmptyRow(length, firstColValue) {
  var arr = [];
  for (var i = 0; i < length; i++) {
    arr.push("");
  }
  arr[0] = firstColValue;
  return arr;
}

/**
 * 輔助函式：計算指定陣列的平均數（捨入至小數點後兩位）
 */
function calculateAverage(dataArr) {
  if (dataArr.length === 0) return 0;
  var sum = dataArr.reduce(function(acc, val) { return acc + val; }, 0);
  return Math.round((sum / dataArr.length) * 100) / 100;
}

/**
 * 輔助函式：將統計數據填入統計矩陣的對應欄位
 */
function fillStats(avgRow, maxRow, minRow, failRow, colIndex, dataArr, isScoreColumn) {
  if (colIndex === -1 || dataArr.length === 0) return;
  
  var sum = dataArr.reduce(function(acc, val) { return acc + val; }, 0);
  var avg = Math.round((sum / dataArr.length) * 100) / 100;
  var max = Math.max.apply(null, dataArr);
  var min = Math.min.apply(null, dataArr);
  
  var failCount = 0;
  for (var i = 0; i < dataArr.length; i++) {
    if (dataArr[i] < 60) {
      failCount++;
    }
  }
  
  avgRow[colIndex - 1] = avg;
  maxRow[colIndex - 1] = max;
  minRow[colIndex - 1] = min;
  
  // 只有總分或期中期末成績欄位才需要顯示不及格人數，平時與月考若需要也可顯示
  if (isScoreColumn) {
    failRow[colIndex - 1] = failCount + " 人";
  } else {
    failRow[colIndex - 1] = "-";
  }
}

/**
 * 輔助函式：計算級距人數
 */
function calculateDistribution(scores) {
  var dist = {
    count100: 0,
    count90to99: 0,
    count80to89: 0,
    count70to79: 0,
    count60to69: 0,
    countFail: 0
  };
  
  for (var i = 0; i < scores.length; i++) {
    var score = scores[i];
    if (score === 100) {
      dist.count100++;
    } else if (score >= 90 && score < 100) {
      dist.count90to99++;
    } else if (score >= 80 && score < 90) {
      dist.count80to89++;
    } else if (score >= 70 && score < 80) {
      dist.count70to79++;
    } else if (score >= 60 && score < 70) {
      dist.count60to69++;
    } else {
      dist.countFail++;
    }
  }
  
  return dist;
}
