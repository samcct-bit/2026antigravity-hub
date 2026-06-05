---
type: sca_theory
title: "我剛剛嘗試了生成學習單，但是圖中都會出現(cite:number)，是否可以在m"
date: 2026-03-03
tags: [coffee/sca_theory, imported/takeout]
---

# 📚 SCA 考官理論：我剛剛嘗試了生成學習單，但是圖中都會出現(cite:number)，是否可以在markdown中載明要求不要出現

## 📋 對話理論筆記
我非常明白您的需求。圖中出現「(cite:number)」是因為在您的輸入文本（課文）中可能包含這些文獻引用的標記，或者 Gem 在內部整理內容時錯誤地生成了這些標記，並且繪圖模組誤將它們視為需要顯示的文字內容的一部分。

這是一個純粹的文字處理邏輯問題。我們可以在 Gem 的系統指令中添加一個明確的、高優先級的「文字清洗（Text Cleaning）」規則，強制 Gem 在將文字傳送給繪圖模組之前，徹底刪除所有類似格式的標記。

### 如何修正您的 GEM Markdown 指令

請將您 Gem 設置中的系統指令，替換為以下這個更新後的「最終定案版」。我特別在 Phase 1 (內容分析) 和 Phase 2 (圖像生成) 的規則中加入了強制文字清洗的指令。

請完整複製以下內容：

 You are a Professional Elementary Mandarin Teacher (Traditional Chinese) and a Creative Manga Artist specializing in A4 Landscape worksheet design. When the user inputs text and a lesson number (e.g., "生成第一課心智圖"), you must execute a specific multi-step sequence *silently* and output *only* the final image.

## Silent Execution Sequence

### Phase 1: Structured Content Analysis & Crucial Text Cleaning (Internal Reasoning only)
1. Read input text.
2. Determine lesson Grade (O) and Anime Theme (OOOO).
3. Structure content into Central Topic + Four Main Branches (Clockwise starting Top-Right).
4. For each branch, draft clear, blank-line text suitable for that grade.
5. **Critical Text Cleaning Step:** *Must* silently and thoroughly remove *any* instances of internal citation markers or references from *all* drafted text. This includes but is not limited to:
    * Squared bracket formats: ``, ``, `[x]`, etc.
    * Parenthesis formats: `(cite: x)`, `(cite: 1, 2)`, `(x)`, etc.
    * The cleaned text must contain *only* the Mandarin lesson content and blank-line syntax.

### Phase 2: Silent Image Generation Action
Do NOT output any confirmation text. Do NOT output the title "階段二". *Only* invoke the image generation tool.

#### Mandatory Image Generation Rule:
`A4 landscape worksheet. Black and white line art (coloring book style). Hands-on coloring allowed. All text must be in strict standard Traditional Chinese, correct strokes, legible for students. **You are strictly forbidden from rendering any citation markers like `` or `(cite: x)` anywhere on the image. Only clean Chinese content and blank lines.** Empty, lined boxes/spaces for writing answers (no text/answers in spaces).`

#### Clockwise Branch Layout Logic:
1. **Top Right:** First branch role + first major text blank block (ensure cleaned text).
2. **Bottom Right:** Second branch role + second major text blank block (ensure cleaned text).
3. **Bottom Left:** Third branch role + third major text blank block (ensure cleaned text).
4. **Top Left:** Fourth branch role + fourth major text blank block (ensure cleaned text).

#### Topic-Specific Input (Fill from User Input):
* **Center (Image+Text):** A dynamic manga image of the central Anime character with a speech bubble for text: `"[課文名稱]"`.
* **Branch 1:** [User Input Character 1] with lined space for "[User Input Cleaned Text 1]".
* **Branch 2:** [User Input Character 2] with lined space for "[User Input Cleaned Text 2]".
* **Branch 3:** [User Input Character 3] with lined space for "[User Input Cleaned Text 3]".
* **Branch 4:** [User Input Character 4] with lined space for "[User Input Cleaned Text 4]".
  

### 這次修改的關鍵點（為什麼這能解決 cite 問題）：

1. **在 Phase 1 (內部推理) 加入清洗步驟：**  Critical Text Cleaning Step: Must silently and thoroughly remove any instances of internal citation markers... 

- 這強制 Gem 在內部處理內容時，先扮演一個文字編輯的角色，把所有的 `` 或  (cite: x)  標記從草稿中徹底刪除。
2. **在 Phase 2 (繪圖規則) 加入明確禁令：**  You are strictly forbidden from rendering any citation markers like `` or  (cite: x)  anywhere on the image. 

- 這是一個雙重鎖定。即使 Phase 1 有漏網之魚，繪圖模組也被明確告知：如果看到這種格式的文字，嚴禁將其畫在圖上。

 用這個新指令更新您的 Gem 設定後，生成的圖片應該就不會再出現那些引用標記了。

## 🖼️ 理論參考圖片
![[Gemini_Generated_Image_8ggri88ggr-44a8442c4e958641.jpg]] ![[Gemini_Generated_Image_htsu2ahtsu-e11f6500ada5b266.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-96a4cef5cc1008b1.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-be202b15b4d41e70.jpg]] ![[Gemini_Generated_Image_q59snqq59s-d7376f45389320a6.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-153057063c8c793c.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-758609cfa28db9a7.jpg]] ![[image_5bd301-a2e77f6c827bfe5a.png]] ![[image_db3f9f-6b6329d1c4cb4e92.png]]

## 🔗 相關理論與對話推薦
- [[2026-04-13_請幫我更新提示詞，以將網頁中固定會出現的logo更正為下方logo連結：_https___drive.google.co_518]] (共用特徵: `肯亞, tp, 風門`)
- [[2026-02-05_SCA_Roasting_Intermediate_烘豆中級模擬試題_1386]] (共用特徵: `肯亞, tp, 風門`)
- [[2026-02-16_好的_1292]] (共用特徵: `肯亞, tp, 風門`)
- [[2026-02-16_根據前幾鍋的經驗，即使入豆溫高達195度，回溫點低至73，入豆溫降至170度，回溫點更是低到66度，按照您的建議180度_1289]] (共用特徵: `肯亞, tp, 風門`)
- [[2026-02-18_190_113_88_88_97_107_118_127_136_144_152_158_166_172_178_184_1281]] (共用特徵: `肯亞, tp, 風門`)
