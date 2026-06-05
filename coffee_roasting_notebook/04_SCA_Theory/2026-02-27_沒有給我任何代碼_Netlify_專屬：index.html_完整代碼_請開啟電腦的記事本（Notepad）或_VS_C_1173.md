---
type: sca_theory
title: "沒有給我任何代碼
Netlify 專屬：index.html 完整代碼
請開啟電"
date: 2026-02-27
tags: [coffee/sca_theory, imported/takeout]
---

# 📚 SCA 考官理論：沒有給我任何代碼
Netlify 專屬：index.html 完整代碼
請開啟電腦的記事本（Notepad）或 VS C

## 📋 對話理論筆記
非常抱歉！身為講師，我理解在關鍵的操作步驟卡住是非常挫折的。這次我不再夾雜過多解釋，直接將您所需要的 **Netlify 專屬  index.html ** 代碼全文放在下方。

這段代碼是您的「外殼」，請直接複製。

---

### 📄 Netlify 專屬：index.html 完整代碼

請在您的電腦上開啟「記事本」或「VS Code」，貼入以下內容，並將檔案命名為 ** index.html **。

 <!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>SCA Pro Roaster | 專業烘焙控制台</title>
    <style>
        body, html { 
            margin: 0; 
            padding: 0; 
            height: 100%; 
            width: 100%;
            overflow: hidden; 
            background-color: #121212; 
        }
        iframe { 
            position: absolute;
            top: 0;
            left: 0;
            width: 100%; 
            height: 100%; 
            border: none; 
        }
    </style>
</head>
<body>
    <iframe src="在此處替換為您的_GAS_部署網址_末尾必須是_exec"></iframe>
</body>
</html>
  

---

### 🛠️ 部署到 Netlify 的操作清單

 為了確保您一次成功，請跟著我這位 **AST 講師** 完成最後三步：

1. **修改網址**：在上面的代碼中，找到  src="..."  的部分，把裡面那段文字換成您在 Google Apps Script 點擊「部署」後產生的那個以  /exec  結尾的長網址。
2. **存檔資料夾**：將這個  index.html  放入一個獨立的資料夾（例如命名為  MyRoaster ）。
3. **拖拽部署**：登入  Netlify ，找到 **"Sites"** 頁面，將您的 ** MyRoaster  資料夾** 直接拖進去。

---

### 👨‍🏫 講師的重要叮嚀：為什麼一定要  /exec ？

- **開發版網址 ( /dev )**：只有您本人登入 Google 帳號時才能看見，Netlify 會顯示拒絕連線。
- **執行版網址 ( /exec )**：這是正式對外發佈的版本。
- **權限設定**：部署時，請務必確認「誰可以存取 (Who has access)」設定為 **「任何人 (Anyone)」**，這樣您的 Netlify 網址才能順利抓取到烘焙數據。

這套系統現在已經整裝待發，準備好要為您的 **楊家機 500g** 與 **果丁丁日曬** 服務了。

**如果您在拖拽部署後，看到網頁顯示「拒絕連線」或「空白」，這通常是 Google 端的權限問題。您需要我為您示範如何檢查 Google Apps Script 的權限設定嗎？**

## 🖼️ 理論參考圖片
[[index (6)-4cccc038d5b1e1e1.html]] (附件) ![[10093408293917864137-4c73aabdd108e0ae.png]]

## 🔗 相關理論與對話推薦
- [[2026-03-20_楊家500公克半熱風_1.​生豆資訊（產區、處理法、品種、含水率、密度等）：果丁丁村日曬_2.​入豆溫與批次量：175度_923]] (共用特徵: `回溫點, 一爆, 轉黃`)
- [[2026-03-20_請幫我儲存成功的烘豆記錄與烘豆機的火力風門搭配，以便我之後使用同樣的機器烘不同品種生豆的參考依據。_接下來我會依序提供紀_924]] (共用特徵: `回溫點, 一爆, 轉黃`)
- [[2026-01-27_好的_1475]] (共用特徵: `回溫點, 一爆, 轉黃`)
- [[2026-01-27_如果回溫點仍然在1分45秒才出現，且溫度達118度，會影響後面轉黃點和一爆達標嗎？_1472]] (共用特徵: `回溫點, 一爆, 轉黃`)
- [[2026-01-27_如果我的訓練講師希望我回溫點到一爆前，火力維持在1.3kPa，風門維持在2.5，一爆火力降為1，風門都不變，如果在這樣限_1473]] (共用特徵: `回溫點, 一爆, 轉黃`)
