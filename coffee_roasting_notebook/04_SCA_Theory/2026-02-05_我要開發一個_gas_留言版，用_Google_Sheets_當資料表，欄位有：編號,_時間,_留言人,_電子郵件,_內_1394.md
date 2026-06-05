---
type: sca_theory
title: "我要開發一個 gas 留言版，用 Google Sheets 當資料表，欄位有："
date: 2026-02-05
tags: [coffee/sca_theory, imported/takeout]
---

# 📚 SCA 考官理論：我要開發一個 gas 留言版，用 Google Sheets 當資料表，欄位有：編號, 時間, 留言人, 電子郵件, 內

## 📋 對話理論筆記
這是一個非常實用的專案！為了讓畫面「漂亮且吸引人」，我將使用 **Tailwind CSS**（目前最流行的網頁樣式框架）來打造一個具備微互動感、磨砂玻璃效果（Glassmorphism）的響應式留言板。

請按照以下步驟設定：

### 第一步：準備 Google 試算表

1. 建立一個新的 Google 試算表。
2. 將第一列（標題列）依序填入： 編號 ,  時間 ,  留言人 ,  電子郵件 ,  內容 ,  表情 。
3. 記下這個試算表的 **ID**（網址中  /d/  之後到  /edit  之前的那串字元）。

---

### 第二步：編寫 Apps Script ( Code.gs )

在試算表中點選「擴充功能」>「Apps Script」，刪除原本代碼並貼入以下內容：

 /**
 * 處理網頁進入點
 */
function doGet() {
  return HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setTitle('時光留言板')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * 儲存留言到試算表
 */
function submitForm(formData) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheets()[0];
    const id = sheet.getLastRow(); // 簡易 ID
    const timestamp = new Date();
    
    sheet.appendRow([
      id, 
      timestamp, 
      formData.name, 
      formData.email, 
      formData.content, 
      formData.emoji
    ]);
    
    return { status: 'success', message: '留言成功！' };
  } catch (e) {
    return { status: 'error', message: e.toString() };
  }
}

/**
 * 取得所有留言（顯示用）
 */
function getMessages() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheets()[0];
  const data = sheet.getDataRange().getValues();
  
  // 移除標題列並反轉陣列（讓最新的留言在上面）
  data.shift();
  return data.reverse().map(row => ({
    time: Utilities.formatDate(new Date(row[1]), "GMT+8", "yyyy-MM-dd HH:mm"),
    name: row[2],
    content: row[4],
    emoji: row[5]
  }));
}
  

---

### 第三步：編寫網頁前端 ( index.html )

 在 Apps Script 編輯器左側點選「+」新增一個 HTML 檔案，命名為  index ，貼入以下代碼：

 <!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" rel="stylesheet">
  <style>
    body {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }
    .glass {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .emoji-radio:checked + label {
      border-color: #667eea;
      background: #ebf4ff;
      transform: scale(1.1);
    }
  </style>
</head>
<body class="py-10 px-4">

  <div class="max-w-2xl mx-auto">
    <div class="text-center mb-10 animate__animated animate__fadeInDown">
      <h1 class="text-4xl font-extrabold text-white mb-2">✨ 時光留言板</h1>
      <p class="text-indigo-100">留下你的足跡與心情</p>
    </div>

    <div class="glass rounded-3xl p-8 shadow-2xl mb-10 animate__animated animate__fadeIn">
      <form id="guestbookForm" onsubmit="handleFormSubmit(this)">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">留言人</label>
            <input type="text" name="name" required class="mt-1 block w-full rounded-xl border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 bg-gray-50/50">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">電子郵件</label>
            <input type="email" name="email" required class="mt-1 block w-full rounded-xl border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 bg-gray-50/50">
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">今天心情如何？</label>
          <div class="flex justify-between gap-2">
            <div class="flex-1">
              <input type="radio" name="emoji" id="e1" value="😍" class="hidden emoji-radio" checked>
              <label for="e1" class="flex flex-col items-center p-3 border-2 border-transparent rounded-2xl cursor-pointer hover:bg-gray-100 transition-all text-2xl text-center">😍<span class="text-xs mt-1 text-gray-500">超棒</span></label>
            </div>
            <div class="flex-1">
              <input type="radio" name="emoji" id="e2" value="😂" class="hidden emoji-radio">
              <label for="e2" class="flex flex-col items-center p-3 border-2 border-transparent rounded-2xl cursor-pointer hover:bg-gray-100 transition-all text-2xl text-center">😂<span class="text-xs mt-1 text-gray-500">開心</span></label>
            </div>
            <div class="flex-1">
              <input type="radio" name="emoji" id="e3" value="🤔" class="hidden emoji-radio">
              <label for="e3" class="flex flex-col items-center p-3 border-2 border-transparent rounded-2xl cursor-pointer hover:bg-gray-100 transition-all text-2xl text-center">🤔<span class="text-xs mt-1 text-gray-500">思考</span></label>
            </div>
            <div class="flex-1">
              <input type="radio" name="emoji" id="e4" value="😴" class="hidden emoji-radio">
              <label for="e4" class="flex flex-col items-center p-3 border-2 border-transparent rounded-2xl cursor-pointer hover:bg-gray-100 transition-all text-2xl text-center">😴<span class="text-xs mt-1 text-gray-500">想睡</span></label>
            </div>
            <div class="flex-1">
              <input type="radio" name="emoji" id="e5" value="🔥" class="hidden emoji-radio">
              <label for="e5" class="flex flex-col items-center p-3 border-2 border-transparent rounded-2xl cursor-pointer hover:bg-gray-100 transition-all text-2xl text-center">🔥<span class="text-xs mt-1 text-gray-500">熱血</span></label>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700">留言內容</label>
          <textarea name="content" rows="3" required class="mt-1 block w-full rounded-xl border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 bg-gray-50/50"></textarea>
        </div>

        <button type="submit" id="submitBtn" class="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-indigo-700 transition-all transform hover:-translate-y-1 active:scale-95">
          送出留言
        </button>
      </form>
    </div>

    <div id="messageList" class="space-y-4 animate__animated animate__fadeInUp">
      <div class="text-white text-center italic">正在加載留言...</div>
    </div>
  </div>

  <script>
    // 頁面加載時讀取留言
    window.onload = loadMessages;

    function loadMessages() {
      google.script.run.withSuccessHandler(displayMessages).getMessages();
    }

    function displayMessages(messages) {
      const container = document.getElementById('messageList');
      if (messages.length === 0) {
        container.innerHTML = '<div class="glass p-6 rounded-2xl text-center text-gray-500">尚無留言，快來搶頭香！</div>';
        return;
      }
      
      container.innerHTML = messages.map(msg => `
        <div class="glass p-6 rounded-3xl shadow-lg border-l-8 border-indigo-400">
          <div class="flex justify-between items-start mb-2">
            <div>
              <span class="font-bold text-indigo-900 text-lg">${msg.name}</span>
              <span class="text-xs text-gray-400 ml-2">${msg.time}</span>
            </div>
            <div class="text-3xl">${msg.emoji}</div>
          </div>
          <p class="text-gray-700 leading-relaxed">${msg.content}</p>
        </div>
      `).join('');
    }

    function handleFormSubmit(form) {
      const btn = document.getElementById('submitBtn');
      btn.disabled = true;
      btn.innerHTML = '傳送中...';
      btn.classList.add('opacity-50');

      const formData = {
        name: form.name.value,
        email: form.email.value,
        content: form.content.value,
        emoji: form.querySelector('input[name="emoji"]:checked').value
      };

      google.script.run.withSuccessHandler(function(response) {
        alert(response.message);
        form.reset();
        btn.disabled = false;
        btn.innerHTML = '送出留言';
        btn.classList.remove('opacity-50');
        loadMessages(); // 重新加載列表
      }).submitForm(formData);
      
      event.preventDefault();
    }
  </script>
</body>
</html>
  

---

### 第四步：部署 (Deployment)

1. 在 Apps Script 畫面右上角，點選「**部署**」>「**新增部署**」。
2. 種類選擇「**網頁應用程式**」。
3. 內容描述填入「留言板 V1」。
4. 執行身分：選擇「**我**」。
5. 誰可以存取：選擇「**所有人**」（Anyone）。
6. 點擊部署，並複製產生的 **網頁應用程式 URL**。

---

### 功能亮點說明

- **響應式設計 (RWD)**：使用 Tailwind CSS 確保在手機與電腦上都有完美的顯示效果（例如姓名與 Email 欄位在手機會自動堆疊）。
- **表情符號選擇**：採用橫向卡片式單選鈕，選擇後會有縮放與顏色變化的微互動。
- **UI 質感**：使用了 **Glassmorphism (玻璃擬態)** 風格，配合紫色漸層背景，讓網頁看起來現代且高級。
- **動態效果**：整合了  Animate.css ，進入頁面時標題與表單會有滑入動畫。
- **防呆機制**：點擊送出後按鈕會進入禁用的 loading 狀態，避免使用者重複點擊產生重複資料。

 你想讓我為你示範如何將留言內容改成能上傳圖片的功能嗎？

## 🖼️ 理論參考圖片
![[edited-image-2832bc99aaf88628.png]] ![[edited-image-449a611572dacba8.jpg]] ![[edited-image-7078ac6441993ba4.jpg]] ![[edited-image-75426fa384f8541c.jpg]] ![[edited-image-7e1fefb03fc1fcef.jpg]] ![[edited-image-a5b3045c17edf51e.png]] ![[edited-image-a984f3a996558092.jpg]] ![[edited-image-bbd7237671058d61.png]] ![[edited-image-cf1f31809c03699f.jpg]] ![[edited-image-d7c741754a6a2a27.jpg]] ![[edited-image-da589a7c04d5505e.jpg]] ![[edited-image-de6eac9b4d06328b.jpg]] [[index (6)-4cccc038d5b1e1e1.html]] (附件) [[New Note-d803819e815fe0e1]] (附件) ![[10093408293917864137-4c73aabdd108e0ae.png]] ![[2555777530681031145-d3ce890839589fae.png]]

## 🔗 相關理論與對話推薦
- [[2026-01-26_Roaster_AI_Brewing_1482]] (共用特徵: `ror, tp, fc`)
- [[2026-01-27_好的_1475]] (共用特徵: `ror, tp, fc`)
- [[2026-01-27_如果樣本烘焙入豆溫170度，1分46秒回溫119.9度，4分30秒141度轉黃點，6分30秒155度肉桂色，10分15秒_1476]] (共用特徵: `ror, tp, fc`)
- [[2026-01-27_我有修正一鍋為入豆溫170度，1分44秒回溫117.8度，4分30秒142度轉黃點，6分154度肉桂色，9分10秒179_1474]] (共用特徵: `ror, tp, fc`)
- [[2026-01-27_請告訴我_1471]] (共用特徵: `ror, tp, fc`)
