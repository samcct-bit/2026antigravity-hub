---
type: sca_theory
title: "AI 實習生小測驗修正版"
date: 2026-04-07
tags: [coffee/sca_theory, imported/takeout]
---

# 📚 SCA 考官理論：AI 實習生小測驗修正版

## 📋 對話理論紀錄
```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI 實習生隨堂小測驗</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; color: #333; line-height: 1.6; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        h1 { text-align: center; color: #2c3e50; font-size: 24px; }
        .question-text { font-size: 18px; font-weight: bold; margin-bottom: 20px; }
        .options { display: flex; flex-direction: column; gap: 12px; }
        
        /* 選項按鈕基本樣式 */
        .option-btn { padding: 12px 15px; border: 2px solid #3498db; background: transparent; color: #3498db; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; font-size: 16px; text-align: left; }
        .option-btn:hover:not(:disabled) { background: #3498db; color: #fff; }
        
        /* 專門給題目選項用的鎖定狀態 */
        .quiz-option:disabled { cursor: not-allowed; opacity: 0.8; }
        
        /* 結果頁面的特殊按鈕 */
        .restart-btn { text-align: center; width: 100%; background: #3498db; color: white; margin-top: 20px; display: none; }
        .restart-btn:hover { background: #2980b9; }

        .feedback { margin-top: 20px; padding: 15px; border-radius: 8px; display: none; font-weight: bold; }
        .correct { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .incorrect { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        
        #next-btn { display: none; margin-top: 25px; background: #2ecc71; color: white; border: none; width: 100%; padding: 15px; font-size: 18px; border-radius: 8px; cursor: pointer; }
        #next-btn:hover { background: #27ae60; }
        #result-screen { display: none; text-align: center; }
        .perfect-score { color: #27ae60; font-size: 20px; font-weight: bold; margin: 20px 0; }
    </style>
</head>
<body>

<div class="container" id="quiz-container">
    <h1>🧠 佛堂 AI 實習生隨堂測驗</h1>
    <div id="question-area">
        <div class="question-text" id="question-text">載入中...</div>
        <div class="options" id="options-area"></div>
        <div class="feedback" id="feedback"></div>
        <button id="next-btn" onclick="nextQuestion()">下一題</button>
    </div>
    <div id="result-screen">
        <h2>🎉 測驗完成！</h2>
        <div id="result-message"></div>
        <button id="restart-btn" class="option-btn restart-btn" onclick="restartQuiz()">再測一次</button>
    </div>
</div>

<script>
    const quizData = [
        {
            question: "👻 關於「AI 幻覺」：如果您請 AI 解釋一段三教經典，它給出了一個聽起來很有道理，但您從未看過的解釋。您應該怎麼做？",
            options: [
                "A. 覺得 AI 很聰明，直接把這段解釋放進晚上的講義裡。",
                "B. 把 AI 當作過度熱心的實習生，必須親自翻閱經典原文或詢問點傳師來查證。",
                "C. 認為 AI 壞掉了，以後再也不用它。"
            ],
            answer: 1, 
            explanation: "答對了！AI 為了給出答案，有時會「腦補」出不存在的內容。我們必須扮演主管的角色，為它的產出把關。"
        },
        {
            question: "🛡️ 關於「資安紅綠燈」：下列哪一份道場文件屬於「紅燈」，絕對「不適合」上傳給 AI 幫忙整理？",
            options: [
                "A. 包含信眾姓名、電話與詳細地址的出缺席名單。",
                "B. 已經公開發行的《如何護持法船》空白講義。",
                "C. 佛堂下個月預計舉辦的活動時間表草稿。"
            ],
            answer: 0,
            explanation: "完全正確！只要牽涉到個人隱私與機密個資，都必須亮起「紅燈」，不可以交給外部的 AI 處理，以保護道親的資料安全。"
        },
        {
            question: "🎭 關於「給予 AI 角色設定」：在請 Gemini 整理《如何護持法船》講義時，如果我們「忘記設定角色」，或者錯誤地請 AI 扮演「剛來佛堂的新進班員」，最可能會出現什麼結果？",
            options: [
                "A. 完全沒影響，因為 AI 會自動偵測講義內容，給出最標準的道場語氣。",
                "B. AI 產出的簡報語氣可能會太過口語、淺薄，缺乏經典該有的深度與莊嚴感。",
                "C. AI 會顯示錯誤畫面，並拒絕回答，直到我們給予正確的身份設定為止。"
            ],
            answer: 1,
            explanation: "完全正確！AI 就像演員，如果沒有給它劇本（忘記設定），或給錯劇本（設定為新進班員），它就無法用「資深點傳師」那種化繁為簡又具備深度的語氣來產出內容。明確的角色設定是成功的關鍵！"
        }
    ];

    let currentQuestion = 0;
    let wrongCount = 0; // 新增：記錄答錯次數

    function loadQuestion() {
        const q = quizData[currentQuestion];
        document.getElementById('question-text').innerText = q.question;
        const optionsArea = document.getElementById('options-area');
        optionsArea.innerHTML = '';
        
        const feedback = document.getElementById('feedback');
        feedback.style.display = 'none';
        feedback.className = 'feedback';
        
        document.getElementById('next-btn').style.display = 'none';

        q.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn quiz-option'; // 加上 quiz-option 類別
            btn.innerText = opt;
            btn.onclick = () => checkAnswer(index, btn);
            optionsArea.appendChild(btn);
        });
    }

    function checkAnswer(selectedIndex, btn) {
        const q = quizData[currentQuestion];
        const feedback = document.getElementById('feedback');
        const quizButtons = document.querySelectorAll('.quiz-option'); // 只鎖定題目選項
        
        quizButtons.forEach(b => b.disabled = true);

        if (selectedIndex === q.answer) {
            feedback.innerText = q.explanation;
            feedback.className = 'feedback correct';
            btn.style.background = '#d4edda';
            btn.style.borderColor = '#28a745';
            btn.style.color = '#155724';
        } else {
            wrongCount++; // 答錯次數加一
            feedback.innerText = "再想想看！" + q.explanation;
            feedback.className = 'feedback incorrect';
            btn.style.background = '#f8d7da';
            btn.style.borderColor = '#dc3545';
            btn.style.color = '#721c24';
        }
        feedback.style.display = 'block';
        document.getElementById('next-btn').style.display = 'block';
    }

    function nextQuestion() {
        currentQuestion++;
        if (currentQuestion < quizData.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }

    function showResults() {
        document.getElementById('question-area').style.display = 'none';
        const resultScreen = document.getElementById('result-screen');
        const resultMessage = document.getElementById('result-message');
        const restartBtn = document.getElementById('restart-btn');
        
        resultScreen.style.display = 'block';
        
        if (wrongCount === 0) {
            // 全部答對
            resultMessage.innerHTML = "<div class='perfect-score'>🎉 滿分！太優秀了！</div><p>您已經完全掌握了與 AI 合作的基本守則，是合格的 AI 導師！</p>";
            restartBtn.style.display = 'none';
        } else {
            // 有答錯
            resultMessage.innerHTML = `<p>您總共答錯了 ${wrongCount} 題。</p><p>建議您再次複習，以確保與 AI 合作的安全與效率。</p>`;
            restartBtn.style.display = 'block';
            restartBtn.disabled = false; // 確保按鈕是啟用狀態
        }
    }

    function restartQuiz() {
        currentQuestion = 0;
        wrongCount = 0; // 重置錯誤次數
        document.getElementById('result-screen').style.display = 'none';
        document.getElementById('question-area').style.display = 'block';
        loadQuestion();
    }

    window.onload = loadQuestion;
</script>
</body>
</html>
```


## 🖼️ 相關參考圖片與文件
![[10093408293917864137-4c73aabdd108e0ae.png]] ![[Gemini_Generated_Image_8ggri88ggr-44a8442c4e958641.jpg]] ![[Gemini_Generated_Image_htsu2ahtsu-e11f6500ada5b266.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-96a4cef5cc1008b1.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-be202b15b4d41e70.jpg]] ![[Gemini_Generated_Image_q59snqq59s-d7376f45389320a6.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-153057063c8c793c.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-758609cfa28db9a7.jpg]] [[index (6)-4cccc038d5b1e1e1.html]] (附件檔案)

## 🔬 科學物理觀點解析
- *此理論卡片由 Gemini Takeout 匯出對話分析自動生成。*
