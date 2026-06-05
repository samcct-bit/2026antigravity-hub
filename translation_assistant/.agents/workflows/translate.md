---
name: translate
description: 一鍵把 input/ 的材料翻譯並輸出雙語對照成品
---

# /translate

請套用 `translation_assistant` Skill，依序執行其流程，把 `input/` 的材料翻譯為指定的目標語言，成品放 `output/`。

執行完回報：
1. 處理了什麼材料。
2. 目標語言。
3. 產出的 Excel、Word 及 Markdown 對照表檔案連結。
4. 特定專有名詞或俚語的註釋說明。

若 `input/` 為空，請先提醒使用者放入材料。
