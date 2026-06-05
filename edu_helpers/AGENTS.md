# 教育溝通與朗讀助手工作區 (edu_helpers)

整合「親師溝通顧問」與「國台英三語朗讀文本生成器」的雙重教育工作流。

## 固定偏好
- 親師溝通流程：讀取 `input/problem.txt` 的衝突點或困境，以同理心進行診斷並產出溝通範本。
- 三語朗讀流程：讀取 `input/speech_topic.txt` 的指定主題與對象，生成符合教育部標準漢字與台羅拼音的國語、台語及英文朗讀文本。
- 成品一律輸出至 `output/`。

## 怎麼用
1. **親師溝通診斷**：將您的親師對話或問題寫入 `input/problem.txt`，執行 `/diagnose`。
2. **三語朗讀生成**：將對象、字數與主題寫入 `input/speech_topic.txt`，執行 `/generate_speech`。
