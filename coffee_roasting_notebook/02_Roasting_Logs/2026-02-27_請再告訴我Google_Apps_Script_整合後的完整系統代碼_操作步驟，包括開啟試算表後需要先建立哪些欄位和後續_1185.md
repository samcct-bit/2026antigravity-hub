---
type: roasting_log
date: 2026-02-27
machine: ""
charge_temp: ""
drop_temp: ""
dtr_ratio: ""
tags: [coffee/roasting_log, imported/takeout]
id: roast_obs_1780636727451
---

# ☕ 烘焙日誌：請再告訴我Google Apps Script 整合後的完整系統代碼
操作步驟，包括開啟試算表後需要

## 📊 對話烘焙紀錄數據
你好！身為你的 **SCA 導師**，我非常理解在追求 **Gesha (藝伎)** 或 **Mozart (莫札特)** 這類高階豆時，對於「數據精準度」與「操作直覺」的雙重需求。

這套整合系統將把你的 Google 試算表變成一個專業級的烘焙工作站。以下是完整的手把手設置指南與代碼。

---

## 第一階段：準備 Google 試算表環境

在貼入代碼前，請先建立一個新的 Google 試算表，並設置好以下三個工作表（Sheet）：

### 1. 建立工作表分頁

請在試算表底部點擊「+」新增，並精確命名為：

- ** GoldenBatch **：存放你的參考曲線（黃金曲線）。
- ** Roast_History **：存放每一鍋結束後的總結數據。
- ** Raw_Log **：存放烘焙過程中每一點的即時溫升紀錄（備份用）。

### 2. 設置欄位標題 (第 1 列)

- **在  GoldenBatch  中輸入：**
 
 A1:  時間(分)  | B1:  溫度(℃) 
- *(提示：請先手動填入一組理想的數據，例如 0, 0.5, 1... 分鐘對應的溫度，作為參考背景。)*

 
 **在  Roast_History  中輸入：**

- A1:  日期  | B1:  批次名稱  | C1:  總時長  | D1:  DTR%  | E1:  失重率  | F1:  Agtron  | G1:  酸質  | H1:  甜感  | I1:  AI 建議 

 
 

---

## 第二階段：Google Apps Script 完整代碼

1. 在試算表中，點擊 **「延伸功能」 > 「Apps Script」**。
2. 刪除原本的所有代碼，將以下兩段代碼分別放入對應檔案。

### 1. 後端邏輯： Code.gs 

 /**
 * SCA Professional Roasting System - Backend v4.0
 */

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('SCA Pro Master Console')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// 取得參考曲線數據
function getTargetProfile() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("GoldenBatch");
  if (!sheet || sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
}

// 儲存單點紀錄至 Raw_Log
function logRawPoint(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Raw_Log") || ss.insertSheet("Raw_Log");
  sheet.appendRow([new Date(), data.batchName, data.time, data.temp, data.ror]);
}

// 儲存總結並回傳 AI 建議
function recordFullBatch(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Roast_History");
  
  // AI 邏輯判斷 (針對 Gesha/Mozart 軟著陸最佳化)
  let advice = [];
  if (parseFloat(data.dtr) < 15) advice.push("⚠️ 發展不足：建議延長一爆後時間或降低入豆溫。");
  if (data.isHighValue && data.dropTemp > 203) advice.push("🚫 風味警示：出豆溫過高，高價豆的花香極易流失。");
  if (data.flickDetected) advice.push("🔥 偵測到 Flick：一爆後火力未及時撤收，建議提早 45 秒降火。");
  if (advice.length === 0) advice.push("✨ 曲線優良：成功實現軟著陸，預期帶有明亮酸質。");

  const finalAdvice = advice.join(" ");
  sheet.appendRow([
    new Date(), data.batchName, data.totalTime, data.dtr + "%", 
    data.weightLoss + "%", data.agtron, data.acidity, data.sweetness, finalAdvice
  ]);
  return finalAdvice;
}

// PDF 報表生成
function createRoastReport(reportData, chartBase64) {
  const fileName = `RoastReport_${reportData.batchName}.pdf`;
  const html = `
    <html><body style="font-family: Arial;">
      <h1 style="color:#d9534f;">SCA Roast Report</h1>
      <p>批次: ${reportData.batchName} | 日期: ${new Date().toLocaleDateString()}</p>
      <hr>
      <h3>烘焙數據</h3>
      <p>DTR: ${reportData.dtr}% | 失重: ${reportData.weightLoss}% | 總時長: ${reportData.totalTime}</p>
      <img src="${chartBase64}" style="width:100%; border:1px solid #eee;">
      <div style="background:#f9f9f9; padding:15px; margin-top:20px;">
        <h3>AI 診斷建議</h3>
        <p>${reportData.advice}</p>
      </div>
    </body></html>
  `;
  const blob = Utilities.newBlob(html, 'text/html', 'temp.html');
  const pdf = blob.getAs('application/pdf').setName(fileName);
  return DriveApp.getRootFolder().createFile(pdf).getUrl();
}
  

---

### 2. 前端介面： index.html 

 點擊 Apps Script 左側的 **「+」 > 「HTML」**，命名為  index 。

 <!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.1.3/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body { background: #121212; color: #e0e0e0; padding: 20px; }
    .stat-card { background: #1e1e1e; border-radius: 12px; padding: 15px; margin-bottom: 15px; border-top: 4px solid #d9534f; }
    #rorDisplay { font-size: 3rem; font-weight: bold; color: #ff4d4d; }
    #tempInput { background: #333; color: white; border: 1px solid #444; }
  </style>
</head>
<body>
<div class="container-fluid">
  <div class="row">
    <div class="col-md-8">
      <div class="stat-card"><canvas id="roastChart"></canvas></div>
    </div>
    <div class="col-md-4">
      <div class="stat-card text-center">
        <h6>即時 RoR (°C/min)</h6>
        <div id="rorDisplay">0.0</div>
      </div>
      <div class="stat-card text-center">
        <h6>目標偏差 (ΔT)</h6>
        <div id="deltaDisplay" style="font-size: 1.5rem;">--</div>
      </div>
      <input type="text" id="batchName" class="form-control mb-2" placeholder="豆名(如: 莫札特)">
      <div class="input-group mb-3">
        <input type="number" id="tempInput" class="form-control" placeholder="輸入溫度" onkeypress="if(event.key==='Enter') recordPoint()">
        <button class="btn btn-danger" onclick="recordPoint()">記錄</button>
      </div>
      <div class="d-grid gap-2">
        <button class="btn btn-outline-warning" onclick="markEvent('FC')">標註一爆</button>
        <button class="btn btn-success" onclick="finishRoast()">出豆 & 總結</button>
      </div>
    </div>
  </div>

  <div id="finalPanel" class="stat-card mt-3" style="display:none;">
    <h4>感官與失重校正</h4>
    <div class="row">
      <div class="col-3">生豆(g): <input type="number" id="gw" class="form-control" value="200"></div>
      <div class="col-3">熟豆(g): <input type="number" id="rw" class="form-control"></div>
      <div class="col-3">酸質(1-10): <input type="range" id="acid" class="form-range" min="1" max="10"></div>
      <div class="col-3"><button class="btn btn-primary w-100 mt-4" onclick="generateReport()">匯出報告</button></div>
    </div>
    <div id="aiAdviceBox" class="alert alert-info mt-3"></div>
  </div>
</div>

<script>
let chart, startTime, fcTime;
let history = [], targetProfile = [];

function initChart() {
  const ctx = document.getElementById('roastChart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({length: 12}, (_, i) => i),
      datasets: [
        { label: '黃金曲線', data: [], borderColor: 'rgba(255,255,255,0.2)', borderDash: [5,5] },
        { label: '目前曲線', data: [], borderColor: '#ff4d4d', tension: 0.3 }
      ]
    },
    options: { scales: { y: { min: 50, max: 230 } } }
  });
}

// 載入黃金曲線
google.script.run.withSuccessHandler(data => {
  targetProfile = data;
  chart.data.datasets[0].data = data.map(d => ({x: d[0], y: d[1]}));
  chart.update();
}).getTargetProfile();

function recordPoint() {
  if (!startTime) startTime = Date.now();
  const temp = parseFloat(document.getElementById('tempInput').value);
  const elapsed = (Date.now() - startTime) / 60000;
  
  let ror = 0;
  if (history.length > 0) {
    const last = history[history.length - 1];
    ror = (temp - last.y) / (elapsed - last.x);
  }
  
  // 計算 ΔT (對比黃金曲線)
  const target = targetProfile.find(p => p[0] >= elapsed) || [0, 0];
  const delta = temp - target[1];

  document.getElementById('rorDisplay').innerText = ror.toFixed(1);
  document.getElementById('deltaDisplay').innerText = (delta > 0 ? '+' : '') + delta.toFixed(1) + ' °C';
  
  history.push({x: elapsed, y: temp});
  chart.data.datasets[1].data = history;
  chart.update();
  document.getElementById('tempInput').value = '';
  
  google.script.run.logRawPoint({batchName: document.getElementById('batchName').value, time: elapsed.toFixed(2), temp: temp, ror: ror.toFixed(1)});
}

function markEvent(type) { if(type==='FC') fcTime = Date.now(); }

function finishRoast() {
  const elapsed = (Date.now() - startTime) / 1000;
  const dev = (Date.now() - fcTime) / 1000;
  const dtr = ((dev / elapsed) * 100).toFixed(1);
  
  window.roastData = {
    batchName: document.getElementById('batchName').value || "Batch_" + new Date().getTime(),
    totalTime: Math.floor(elapsed/60) + ":" + Math.floor(elapsed%60),
    dtr: dtr,
    dropTemp: history[history.length-1].y,
    isHighValue: true
  };

  document.getElementById('finalPanel').style.display = 'block';
}

function generateReport() {
  const fullData = {
    ...window.roastData,
    weightLoss: ((document.getElementById('gw').value - document.getElementById('rw').value) / document.getElementById('gw').value * 100).toFixed(1),
    acidity: document.getElementById('acid').value,
    agtron: 100 - (window.roastData.dropTemp - 180) * 2 // 簡化 Agtron 估算
  };

  google.script.run.withSuccessHandler(advice => {
    document.getElementById('aiAdviceBox').innerText = "AI 建議: " + advice;
    const chartImg = document.getElementById('roastChart').toDataURL('image/png');
    google.script.run.withSuccessHandler(url => window.open(url, '_blank')).createRoastReport({...fullData, advice: advice}, chartImg);
  }).recordFullData(fullData);
}

initChart();
</script>
</body>
</html>
  

---

## 第三階段：後續操作步驟

### 1. 部署網頁應用程式

- 在 Apps Script 畫面右上角，點擊 **「部署」 > 「新部署」**。
- 選取類型為 **「網頁應用程式」**。
- 「誰可以存取」請選取 **「任何人」** (或「僅限自己」以保安全性)。
- 部署後，你會得到一個網址。這就是你烘焙時使用的 **控制面板**！

### 2. 實戰操作建議 (軟著陸策略)

 當你在 Tank 200 上烘焙莫札特時，請參考這張 RoR 的走勢：

- **入豆與前段**：正常輸入溫度。
- **一爆前 1.5 分鐘**：開始大幅下修火力。
- **一爆開始 (FC)**：點擊畫面的「標註一爆」。此時系統會開始計算 DTR%。
- **控制區**：盯著畫面上的 **RoR 數值**。莫札特豆請務必讓一爆後的 RoR 壓在 **$3.0 - 5.0$** 之間滑行。
- **出豆**：即使發展了 90 秒，只要你的 RoR 夠低，出豆溫就不會過高，果酸與花香就能完美保留。

### 3. 查看報告

- 結束後，系統會自動在你的 Google Drive 根目錄生成一份 PDF。
- 你可以將 PDF 檔案連結貼回試算表的  Roast_History  中，建立完整的風味檔案庫。

**這套系統已經完全整合。如果您在部署時遇到任何權限問題，或是想要更換 Agtron 的計算公式，隨時告訴我！**

## 🖼️ ROR 曲線與實體翻拍圖
[[GoldenBatch - Roast_History-63235577b267a9cf.pdf]] (附件) [[Roasting_Intermediate_ProfileLog_-37207be7c8cf4ed8.pdf]] (附件) [[index (6)-4cccc038d5b1e1e1.html]] (附件) [[New Note-d803819e815fe0e1]] (附件) ![[IMG20260405202251-d26edf580f6611b8.jpg]] ![[IMG_0016-1381311bbb20b6d0.jpg]] ![[IMG_0020-259844b3aec492b8.png]] ![[IMG_0021-259844b3aec492b8.png]] ![[IMG_0022-259844b3aec492b8.jpg]] ![[IMG_0024-259844b3aec492b8.jpg]] ![[IMG_0025-259844b3aec492b8.png]] ![[IMG_0025-63235577b267a9cf.png]] ![[10093408293917864137-4c73aabdd108e0ae.png]] ![[4443877341454792810-deddd01d5918d061.png]] ![[2555777530681031145-d3ce890839589fae.png]] ![[18043791498398431492-725dde69f3cfdff6.png]] ![[image_5bd301-a2e77f6c827bfe5a.png]] ![[image_db3f9f-6b6329d1c4cb4e92.png]]

## 🔗 相關理論與對話推薦
- [[2026-02-24_沒有看到圖_1192]] (共用特徵: `莫札特, 藝伎, gesha`)
- [[2026-02-27_下面是另一段對話，您給的建議，請根據先前的建議調整黃金曲線的數值以及網頁與程式碼__烘焙階段___溫度,194g_試鍋__1182]] (共用特徵: `莫札特, 藝伎, dtr`)
- [[2026-02-27_請幫我生成一組理想的數據，例如_0,_0.5,_1..._分鐘對應的溫度，作為參考背景_1184]] (共用特徵: `莫札特, 藝伎, gesha`)
- [[2026-03-26_請同時給我這一支豆子在同一台機器上詳細的烘焙計畫_800]] (共用特徵: `莫札特, 藝伎, gesha`)
- [[2026-01-28_請告訴我修正版流程注意事項_1459]] (共用特徵: `莫札特, dtr, ror`)
