---
type: sca_theory
title: "但是之前你已經將 Gem 系統指令（System Instructions）從*"
date: 2026-03-03
tags: [coffee/sca_theory, imported/takeout]
---

# 📚 SCA 考官理論：但是之前你已經將 Gem 系統指令（System Instructions）從**「多步驟 Markdown 結構」改寫

## 📋 對話理論筆記
我明白這種「看得到代碼，卻看不到圖」的挫折感。這通常是因為 Gem 在解析指令時，把「描述繪圖步驟」誤認為是「要對使用者說的話」。

Gemini 會偶爾出錯，但它一直在學習。我建議您直接在對話中糾正它，這有助於它未來做得更好。此外，您也可以在「您的 Gemini 說明」中添加具體細節，以自定義回應的語氣、格式或風格。

為了徹底解決「只出 JSON」和「出現引用標記（cite）」這兩個問題，我們需要將指令簡化為一個**「純粹的自動化流程」**，完全移除任何會讓它想「說話」或「解釋」的標題。

請嘗試將 Gem 的系統指令替換為以下這個**最簡化版本**：

---

## 🛠️ Gem 系統指令修正 (極簡自動化版)

 # Role: Professional Elementary Teacher & Manga Artist.
# Task: Automatically generate a 3rd Grade Mandarin Mind Map Worksheet Image.

## STRICT EXECUTION PROTOCOL:
1. When a user provides a lesson and text, SILENTLY extract the core theme and 4 main points.
2. TEXT CLEANING (CRITICAL): Automatically remove all bracketed citations like,, (cite: x), or any numbers in brackets from the extracted text before passing it to the image tool.
3. TRIGGER ACTION: Immediately and only invoke the `image_generation` tool using the cleaned content. Do not output any text, descriptions, or JSON code to the user.

## IMAGE TOOL INPUT PARAMETERS:
- Format: A4 Landscape.
- Style: Black and white line art (coloring book style), clean white background, no shading.
- Layout: 
  - Center: [Anime Theme Character] holding a sign with "[Lesson Name]".
  - Branches: 4 main branches flowing clockwise starting from the Top-Right.
  - Content: Each branch features an anime character leading a text box with a "Fill-in-the-blank" sentence based on the cleaned lesson points.
- Text Rules: Strict Standard Traditional Chinese (Mandarin). Use empty lines "________" for blanks. 
- PROHIBITION: DO NOT render any "cite" markers, brackets, or numbers in the final image.
  

---

## 💡 為什麼這次會成功？

1. **移除標題誘惑**：之前的指令包含「階段一」、「階段二」等標題，這會誘發 Gem 想要「打印出標題」來回報進度。這次我們改用  STRICT EXECUTION PROTOCOL 。
2. **前置清洗指令**：將  TEXT CLEANING  放在執行協議的第 2 步，強制它在動筆「畫」之前先做「校對」，確保 `` 這種髒資料不會被餵進繪圖引擎。
3. **單一觸發點**：明確告知  Do not output any text... （不要輸出任何文字），這能強迫它跳過說話階段，直接跳轉到執行繪圖。

### **下一步您可以這樣做：**

 更新完指令後，請直接輸入：**「生成第三課心智圖，動畫主題：哆啦A夢。課文：[貼上課文內容]」**。

如果它還是調皮地吐出代碼，您可以對它說：**「不要顯示代碼，直接執行 image_generation 並顯示圖片」**，這能強行將它導入正確的運行軌道。您需要我幫您測試看看特定的課文內容嗎？

## 🖼️ 理論參考圖片
![[Gemini_Generated_Image_8ggri88ggr-44a8442c4e958641.jpg]] ![[Gemini_Generated_Image_htsu2ahtsu-e11f6500ada5b266.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-96a4cef5cc1008b1.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-be202b15b4d41e70.jpg]] ![[Gemini_Generated_Image_q59snqq59s-d7376f45389320a6.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-153057063c8c793c.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-758609cfa28db9a7.jpg]] ![[image_5bd301-a2e77f6c827bfe5a.png]] ![[image_db3f9f-6b6329d1c4cb4e92.png]]

## 🔗 相關理論與對話推薦
- [[2026-04-13_請幫我更新提示詞，以將網頁中固定會出現的logo更正為下方logo連結：_https___drive.google.co_518]] (共用特徵: `肯亞, tp, 風門`)
- [[2026-02-05_SCA_Roasting_Intermediate_烘豆中級模擬試題_1386]] (共用特徵: `肯亞, tp, 風門`)
- [[2026-02-16_好的_1292]] (共用特徵: `肯亞, tp, 風門`)
- [[2026-02-16_根據前幾鍋的經驗，即使入豆溫高達195度，回溫點低至73，入豆溫降至170度，回溫點更是低到66度，按照您的建議180度_1289]] (共用特徵: `肯亞, tp, 風門`)
- [[2026-02-18_190_113_88_88_97_107_118_127_136_144_152_158_166_172_178_184_1281]] (共用特徵: `肯亞, tp, 風門`)
