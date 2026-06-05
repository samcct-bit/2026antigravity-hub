---
type: roasting_log
date: 2026-05-24
machine: ""
charge_temp: ""
drop_temp: ""
dtr_ratio: ""
tags: [coffee/roasting_log, imported/takeout]
id: roast_obs_1780636745168
---

# ☕ 烘焙日誌：這份歸納好的 SOP 已經非常具體。需要我幫您把這些規則直接寫成一段可以在 Google Apps 

## 📊 對話烘焙紀錄數據
蔡老師您好，我是全方位專家。

沒問題！我已經為您撰寫好完整的 **Google Apps Script (GAS)** 程式碼。這段腳本會直接在您的 Google 試算表中建立一個自訂選單。您只要在試算表輸入「豆種」與「重量」，點擊按鈕，系統就會自動判斷物理特性，並**自動繪製、上色、格式化**出專屬的風火配置表。

以下是完整的設定步驟與直接複製使用的程式碼：

---

### 🛠️ 步驟一：將程式碼複製到 Google 試算表

1. 開啟您的 Google 試算表。
2. 點擊頂部選單的 **「擴充功能」 ➡️ 「Apps Script」**。
3. 清空左側編輯器中原本的  myFunction()  程式碼。
4. 將下方的完整程式碼**複製並貼上**到編輯器中。
5. 點擊頂部的 **「儲存 (磁碟圖示)」** 儲存專案。
6. 重整（重新整理）您的 Google 試算表網頁。

 /**
 * 盧貝思烘豆自動化配置系統
 * 全方位專家 專屬開發版
 */

// 當試算表開啟時，自動建立自訂選單
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('☕ 盧貝思烘豆控制')
    .addItem('1. 初始化設定輸入區', 'setupInputArea')
    .addItem('2. ⚡ 產生專屬風火配置表', 'generateRoastProfile')
    .addToUi();
}

// 初始化建立輸入欄位與下拉選單
function setupInputArea() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.clear(); // 清空目前工作表
  
  // 設定標題
  sheet.getRange('A1:E1').merge().setValue('盧貝思烘豆參數自動生成器').setFontSize(14).setFontWeight('bold').setBackground('#78350f').setFontColor('#ffffff').setHorizontalAlignment('center');
  
  // 設定輸入標籤
  sheet.getRange('A3').setValue('選擇豆種群組：').setFontWeight('bold');
  sheet.getRange('A4').setValue('輸入烘焙重量 (g)：').setFontWeight('bold');
  
  // 建立豆種下拉選單
  var cellBean = sheet.getRange('B3');
  var rule = SpreadsheetApp.newDataValidation().requireValueInList([
    '極硬豆/高海拔水洗日曬 (如：沃卡/藝伎)', 
    '高糖分/特殊厭氧蜜處理 (如：瑪格麗特)'
  ], true).build();
  cellBean.setDataValidation(rule);
  cellBean.setValue('極硬豆/高海拔水洗日曬 (如：沃卡/藝伎)'); // 預設值
  
  // 建立重量欄位
  sheet.getRange('B4').setValue(500).setHorizontalAlignment('left');
  
  // 美化輸入區邊框
  sheet.getRange('A3:B4').setBorder(true, true, true, true, true, true, '#d6d3d1', SpreadsheetApp.BorderStyle.SOLID);
  sheet.autoResizeColumns(1, 2);
  
  SpreadsheetApp.getUi().alert('初始化完成！請在 B3 選擇豆種、B4 輸入重量，接著點選選單的「2. ⚡ 產生專屬風火配置表」。');
}

// 核心主程式：根據輸入生成表格
function generateRoastProfile() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var ui = SpreadsheetApp.getUi();
  
  // 讀取輸入值
  var beanType = sheet.getRange('B3').getValue();
  var weight = sheet.getRange('B4').getValue();
  
  if (!beanType || !weight) {
    ui.alert('錯誤', '請確認已選擇豆種並輸入重量！', ui.ButtonSet.OK);
    return;
  }
  
  // 重量安全機制提醒
  if (weight != 500) {
    var response = ui.alert('【負載量警告】', '目前參數邏輯是針對 500g 半載進行黃金最佳化。您輸入的重量為 ' + weight + 'g，仍要強制產生參考表格嗎？', ui.ButtonSet.YES_NO);
    if (response == ui.Button.NO) return;
  }
  
  // 清除第 6 行之後的舊表格
  if (sheet.getLastRow() >= 6) {
    sheet.getRange(6, 1, sheet.getLastRow() - 5, 5).clear();
  }
  
  // 定義兩套風火配置數據
  var data = [];
  var titleColor = '';
  
  if (beanType.indexOf('極硬豆') !== -1) {
    // 衣索比亞沃卡型 策略
    titleColor = '#b45309'; // 琥珀橘
    data = [
      ['1. 入豆起步', '165°C', '10%', '30%', '【溫和入豆】維持基礎風門，等待回溫點。'],
      ['2. 回溫點 (TP)', '約 1:40 (62°C-68°C)', '85%', '30%', '【核心重踩】反彈瞬間立刻推滿 85% 火力，建立穿透動能。'],
      ['3. 高速脫水', 'TP ➡️ 145°C', '🔒 85% 鎖定', '35%', '【防降火心魔】中途絕對不要手動降火，一口氣壓縮脫水期。'],
      ['4. 轉黃期', '145°C (草香轉黃)', '70%', '50%', '【第一次煞車】轉黃點一到立刻降火，風門介入控溫。'],
      ['5. 梅納反應', '175°C ➡️ 190°C', '55%', '70%', '【預防飆溫】利用風門大開進行散熱防禦，讓 RoR 平滑下滑。'],
      ['6. 一爆發展', '194°C ➡️ 200°C+', '45%', '80% - 100%', '【嚴禁關火】維持底火防失速，風門全開抽走煙塵，45-60秒下豆。']
    ];
  } else {
    // 哥倫比亞哈密瓜型 策略
    titleColor = '#be123c'; // 玫瑰紅
    data = [
      ['1. 入豆起步', '155°C', '10%', '40%', '【較低溫入豆】保護表面高壓發酵糖分，嚴防瞬間烤焦。'],
      ['2. 回溫點 (TP)', '約 1:40 (62°C-64°C)', '80%', '40%', '【溫和推火】最高火力鎖定在 80% 即可，不宜過度暴力。'],
      ['3. 高速脫水', 'TP ➡️ 145°C', '🔒 80% 鎖定', '45%', '【鎖定火力】轉黃前同樣不輕易動火，維持穩定熱能。'],
      ['4. 轉黃期', '145°C (轉黃點)', '65%', '60%', '【核心降火】降至 65%，將控溫主力正式交接給大風門。'],
      ['5. 一爆前夕', '175°C ➡️ 194°C', '55%', '80%', '【防禦重煙】果醬香爆發，提早開大風門，防止表面焦黑 (Scorching)。'],
      ['6. 一爆發展', '約 194°C 觸發', '40%', '90% - 100%', '【防禦低沉爆聲】一爆聲較微弱，維持底火，發展 40秒 內果斷下豆。']
    ];
  }
  
  // 寫入表格標題列
  var headers = [['烘焙階段', '溫度 / 狀態指標', '火力 (Heat)', '風門 (Wind)', '專家操作定義與目的']];
  sheet.getRange('A6:E6').setValues(headers).setFontWeight('bold').setBackground(titleColor).setFontColor('#ffffff').setHorizontalAlignment('center');
  
  // 寫入數據
  sheet.getRange(7, 1, data.length, 5).setValues(data);
  
  // 格式化美化表格
  var tableRange = sheet.getRange(6, 1, data.length + 1, 5);
  tableRange.setBorder(true, true, true, true, true, true, '#7c7267', SpreadsheetApp.BorderStyle.SOLID);
  tableRange.setVerticalAlignment('middle');
  
  // 個別欄位對齊調整
  sheet.getRange(7, 1, data.length, 1).setHorizontalAlignment('center').setFontWeight('bold'); // 階段
  sheet.getRange(7, 2, data.length, 1).setHorizontalAlignment('center'); // 溫度
  sheet.getRange(7, 3, data.length, 2).setHorizontalAlignment('center').setFontWeight('bold'); // 風火值
  
  // 自動調整欄寬
  sheet.autoResizeColumns(1, 5);
  
  ui.alert('🎉 配置表生成成功！', '已根據「' + beanType + '」特性自動生成專屬實戰曲線腳本。', ui.ButtonSet.OK);
}
  

---

### 🚀 步驟二：如何實戰使用它？

1. 回到 Google 試算表視窗，您會發現最右邊多了一個自訂選單：**「☕ 盧貝思烘豆控制」**。
2. 第一次使用，請點選 **「1. 初始化設定輸入區」**。
3. 此時系統會跳出授權視窗（Apps Script 首次執行皆會要求權限），請點選 **「繼續」 ➡️ 選擇您的 Google 帳號 ➡️ 點選「進階」 ➡️ 點選「前往盧貝思烘豆自動化（不安全）」 ➡️ 點選「允許」**。
4. 授權完成後，工作表會自動產生精美的輸入框。
5. 您只要在  B3  單擊下拉選單切換豆種（極硬豆 vs 厭氧蜜處理），接著點選選單的 **「2. ⚡ 產生專屬風火配置表」**，下方的表格與提示就會瞬間動態更新！

---

### 🔍 程式碼設計的行政與分工考量

- **清晰性與可執行性：** 表格中不含任何空泛定義，火力與風門設定皆文字化、粗體化（例如： 🔒 85% 鎖定 ），方便一線教育現場或烘豆工作坊學員直接看表操作。
- **風險管理（防呆機制）：** 當您輸入的重量不是  500  時，系統會跳出彈窗警告，提醒您這套風火邏輯是半載專屬，防止不小心將半載參數直接誤用到滿載，造成烘焙失速或外焦內生。

 您可以立刻測試看看這個自動化工具，看介面是否符合您在工作坊或現場教學時的排版習慣！

## 🖼️ ROR 曲線與實體翻拍圖
![[16544113557186314641-e81ba32a4992f6d2.png]] ![[165d0ca5-9027-4d54-9d6a-e18f06805-4f69e9f03854182d.jpg]] ![[17515777487485734111-4d19d2f783a97c67.png]] ![[10093408293917864137-4c73aabdd108e0ae.png]] ![[15535583523822020334-c7f4ccfba84206d6.png]]

## 🔗 相關理論與對話推薦
- [[2026-05-24_請根據今天的四鍋經驗幫我分析歸納整理下次使用這台機器的注意事項與風火策略_96]] (共用特徵: `沃卡, 哥倫比亞, 厭氧`)
- [[2026-03-26_如果只能用Tank200烘，還是建議只烘紫風鈴和寶貝藝妓嗎？_804]] (共用特徵: `藝伎, 厭氧, 蜜處理`)
- [[2026-03-26_請同時給我這一支豆子在同一台機器上詳細的烘焙計畫_800]] (共用特徵: `藝伎, 厭氧, 蜜處理`)
- [[2026-03-26_請幫我針對tank200烘豆機，為這幾支適合的豆子提供完整烘焙計畫方案_806]] (共用特徵: `藝伎, 厭氧, 蜜處理`)
- [[2026-05-08_附上之前成功在Tank200上的烘豆紀錄，我還有幾支生豆要請你幫我評估哪些較適合在Tank200烘，可以和水洗藝伎及日曬_265]] (共用特徵: `藝伎, 哥倫比亞, 厭氧`)
