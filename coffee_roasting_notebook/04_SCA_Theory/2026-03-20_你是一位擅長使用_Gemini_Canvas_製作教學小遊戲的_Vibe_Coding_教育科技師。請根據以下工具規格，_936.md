---
type: sca_theory
title: "你是一位擅長使用 Gemini Canvas 製作教學小遊戲的 Vibe Cod"
date: 2026-03-20
tags: [coffee/sca_theory, imported/takeout]
---

# 📚 SCA 考官理論：你是一位擅長使用 Gemini Canvas 製作教學小遊戲的 Vibe Coding 教育科技師。請根據以下工具規格，

## 📋 對話理論筆記
沒問題！身為一位擅長 Vibe Coding 的教育科技師，我為你準備了一款專為小三學生設計的**「三位數除法大冒險」**。

這個單一 HTML 檔案整合了具備現代感的 UI 介面、流暢的 CSS 動畫，以及針對國小生開發的「除盡」邏輯（確保題目符合教學進度，不會出現過於挫折的無限小數）。

你可以直接將以下程式碼複製並貼上到 Gemini Canvas 中運行。

 <!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>三位數除法小高手 - 教學遊戲</title>
    <style>
        :root {
            --primary-color: #4A90E2;
            --secondary-color: #F5A623;
            --success-color: #7ED321;
            --danger-color: #D0021B;
            --bg-color: #F0F7FF;
            --white: #FFFFFF;
        }

        * { box-sizing: border-box; font-family: 'Segoe UI', 'Microsoft JhengHei', sans-serif; }

        body {
            background-color: var(--bg-color);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            overflow: hidden;
        }

        #game-container {
            background: var(--white);
            width: 90%;
            max-width: 500px;
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            text-align: center;
            position: relative;
        }

        /* 頂部資訊欄 */
        .header-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .progress-bar-container {
            width: 60%;
            height: 12px;
            background: #eee;
            border-radius: 10px;
            overflow: hidden;
        }

        #progress-fill {
            height: 100%;
            background: var(--primary-color);
            width: 0%;
            transition: width 0.3s ease;
        }

        .stats { font-weight: bold; color: var(--primary-color); font-size: 1.1rem; }

        /* 題目區域 */
        #timer-display {
            font-size: 1.2rem;
            color: var(--danger-color);
            height: 30px;
            font-weight: 900;
        }

        .question-area {
            margin: 40px 0;
        }

        .math-text {
            font-size: 4rem;
            font-weight: bold;
            color: #333;
            margin-bottom: 20px;
            display: block;
        }

        input[type="number"] {
            width: 150px;
            font-size: 2rem;
            padding: 10px;
            border: 3px solid #ddd;
            border-radius: 10px;
            text-align: center;
            outline: none;
            transition: border-color 0.3s;
        }

        input[type="number"]:focus { border-color: var(--primary-color); }

        button {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 12px 30px;
            font-size: 1.2rem;
            border-radius: 50px;
            cursor: pointer;
            transition: transform 0.2s, background 0.3s;
            margin-top: 20px;
        }

        button:hover { transform: scale(1.05); background: #357ABD; }
        button:active { transform: scale(0.95); }

        /* 反饋與解析 */
        #feedback-overlay {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(255,255,255,0.95);
            display: none;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-radius: 20px;
            z-index: 10;
            padding: 20px;
        }

        .feedback-icon { font-size: 5rem; margin-bottom: 10px; }
        .explanation { font-size: 1.1rem; color: #555; line-height: 1.6; margin-top: 15px; }

        /* 動畫 */
        .bounce { animation: bounce 0.6s ease; }
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
            40% {transform: translateY(-20px);}
            60% {transform: translateY(-10px);}
        }

        .shake { animation: shake 0.5s; }
        @keyframes shake {
            0%, 100% {transform: translateX(0);}
            25% {transform: translateX(-10px);}
            75% {transform: translateX(10px);}
        }

        /* 隱藏元素 */
        .hidden { display: none !important; }

        /* 結果頁面 */
        #result-screen h2 { font-size: 2rem; color: var(--primary-color); }
        .final-score { font-size: 4rem; color: var(--secondary-color); margin: 20px 0; }
    </style>
</head>
<body>

<div id="game-container">
    <div id="start-screen">
        <h1>🔢 三位數除法挑戰</h1>
        <p>準備好成位除法小高手了嗎？</p>
        <div style="margin: 20px 0;">
            <label style="font-size: 1.1rem;">
                <input type="checkbox" id="timer-toggle" checked> 開啟限時模式 (30秒/題)
            </label>
        </div>
        <button onclick="startGame()">開始遊戲</button>
    </div>

    <div id="game-board" class="hidden">
        <div class="header-info">
            <div class="progress-bar-container">
                <div id="progress-fill"></div>
            </div>
            <div class="stats">得分: <span id="current-score">0</span></div>
        </div>

        <div id="timer-display"></div>

        <div class="question-area">
            <span class="math-text" id="question-text">--- ÷ - = ?</span>
            <input type="number" id="answer-input" placeholder="答案" onkeyup="if(event.key==='Enter') checkAnswer()">
            <br>
            <button onclick="checkAnswer()">送出答案</button>
        </div>
    </div>

    <div id="feedback-overlay">
        <div class="feedback-icon" id="fb-icon"></div>
        <h2 id="fb-text"></h2>
        <div class="explanation" id="fb-explanation"></div>
        <button onclick="nextQuestion()">下一題</button>
    </div>

    <div id="result-screen" class="hidden">
        <h2>🎉 挑戰完成！</h2>
        <div class="final-score" id="final-score-val">0</div>
        <p id="result-comment"></p>
        <button onclick="location.reload()">再玩一次</button>
    </div>
</div>

<script>
    let score = 0;
    let currentStep = 0;
    const totalSteps = 5;
    let timeLeft = 30;
    let timerInterval;
    let currentProblem = { dividend: 0, divisor: 0, answer: 0 };
    let useTimer = true;

    function startGame() {
        useTimer = document.getElementById('timer-toggle').checked;
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-board').classList.remove('hidden');
        generateQuestion();
    }

    function generateQuestion() {
        // 產生邏輯：3位數 / 1位數，且必須整除（適合小三初學者）
        let divisor = Math.floor(Math.random() * 8) + 2; // 2-9
        let answer = Math.floor(Math.random() * 80) + 12; // 確保三位數結果
        let dividend = divisor * answer;
        
        // 確保被除數是 100-999 之間
        while(dividend < 100 || dividend > 999) {
            divisor = Math.floor(Math.random() * 8) + 2;
            answer = Math.floor(Math.random() * 150) + 20;
            dividend = divisor * answer;
        }

        currentProblem = { dividend, divisor, answer };
        document.getElementById('question-text').innerText = `${dividend} ÷ ${divisor} =`;
        document.getElementById('answer-input').value = '';
        document.getElementById('answer-input').focus();
        
        updateProgressBar();
        startTimer();
    }

    function startTimer() {
        clearInterval(timerInterval);
        if (!useTimer) {
            document.getElementById('timer-display').innerText = "練習模式";
            return;
        }
        
        timeLeft = 30;
        document.getElementById('timer-display').innerText = `剩餘時間：${timeLeft}s`;
        
        timerInterval = setInterval(() => {
            timeLeft--;
            document.getElementById('timer-display').innerText = `剩餘時間：${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                showFeedback(false, true); // 時間到視同答錯
            }
        }, 1000);
    }

    function checkAnswer() {
        const userAnswer = parseInt(document.getElementById('answer-input').value);
        if (isNaN(userAnswer)) return;

        clearInterval(timerInterval);
        const isCorrect = userAnswer === currentProblem.answer;
        showFeedback(isCorrect);
    }

    function showFeedback(isCorrect, isTimeout = false) {
        const overlay = document.getElementById('feedback-overlay');
        const icon = document.getElementById('fb-icon');
        const text = document.getElementById('fb-text');
        const exp = document.getElementById('fb-explanation');
        
        overlay.style.display = 'flex';
        
        if (isCorrect) {
            score += 20;
            document.getElementById('current-score').innerText = score;
            icon.innerText = "🌟";
            icon.className = "feedback-icon bounce";
            text.innerText = "太棒了！答對了";
            text.style.color = "var(--success-color)";
            exp.innerText = "你對數字的直覺真好，繼續保持！";
        } else {
            icon.innerText = "💡";
            icon.className = "feedback-icon shake";
            text.innerText = isTimeout ? "時間到了！" : "再挑戰看看！";
            text.style.color = "var(--danger-color)";
            
            // 簡易解析邏輯
            const d = currentProblem.dividend;
            const s = currentProblem.divisor;
            const a = currentProblem.answer;
            exp.innerHTML = `解析：<br>${d} ÷ ${s} = <b>${a}</b><br><small>可以想成：${s} 乘以多少會接近 ${d} 呢？</small>`;
        }
    }

    function nextQuestion() {
        currentStep++;
        document.getElementById('feedback-overlay').style.display = 'none';
        
        if (currentStep < totalSteps) {
            generateQuestion();
        } else {
            showResult();
        }
    }

    function updateProgressBar() {
        const percentage = (currentStep / totalSteps) * 100;
        document.getElementById('progress-fill').style.width = `${percentage}%`;
    }

    function showResult() {
        document.getElementById('game-board').classList.add('hidden');
        document.getElementById('result-screen').classList.remove('hidden');
        document.getElementById('final-score-val').innerText = score;
        
        let comment = "";
        if (score >= 100) comment = "完美！你是真正的除法大師！";
        else if (score >= 60) comment = "很不錯喔！再多練習會更厲害！";
        else comment = "加油！練習是進步的唯一捷徑！";
        document.getElementById('result-comment').innerText = comment;
    }
</script>

</body>
</html>
  

### 這款工具的特色：

1. **專為小三設計**：

- **數值控制**：題目自動鎖定在「三位數除以一位數」且「能整除」的範圍。這符合國小三年級初期學習除法的信心建立階段。
- **大字體介面**：考慮到學童視力與操作便利性，使用了極大的數位顯示。
2. **即時回饋系統**：

- **動畫效果**：答對時會有星星跳動（Bounce），答錯或超時則會有震動提示（Shake）。
- **解析功能**：答錯時不只給答案，還會提供簡單的引導式解析，幫助學生思考。
3. **Vibe Coding 風格**：

- 採用簡潔的商務級配色（Blue & White），並加入陰影與圓角，讓教學工具看起來像專業的 App。
- **限時模式開關**：學生可以自行選擇要「舒壓練習」還是「計時挑戰」。

 **你可以試著對我說：**

- 「幫我把題目增加到 10 題。」
- 「請把背景換成可愛的森林風格。」
- 「加入『餘數』的功能，讓難度變高。」

## 🖼️ 理論參考圖片
![[Gemini_Generated_Image_8ggri88ggr-44a8442c4e958641.jpg]] ![[Gemini_Generated_Image_htsu2ahtsu-e11f6500ada5b266.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-96a4cef5cc1008b1.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-be202b15b4d41e70.jpg]] ![[Gemini_Generated_Image_q59snqq59s-d7376f45389320a6.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-153057063c8c793c.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-758609cfa28db9a7.jpg]] ![[10093408293917864137-4c73aabdd108e0ae.png]] ![[9000-b0d0d952ab8ef43b.jpg]] ![[2555777530681031145-d3ce890839589fae.png]]

## 🔗 相關理論與對話推薦
- [[2026-04-13_請幫我更新提示詞，以將網頁中固定會出現的logo更正為下方logo連結：_https___drive.google.co_518]] (共用特徵: `肯亞, tp, 風門`)
- [[2026-02-05_SCA_Roasting_Intermediate_烘豆中級模擬試題_1386]] (共用特徵: `肯亞, tp, 風門`)
- [[2026-02-16_好的_1292]] (共用特徵: `肯亞, tp, 風門`)
- [[2026-02-16_根據前幾鍋的經驗，即使入豆溫高達195度，回溫點低至73，入豆溫降至170度，回溫點更是低到66度，按照您的建議180度_1289]] (共用特徵: `肯亞, tp, 風門`)
- [[2026-02-18_190_113_88_88_97_107_118_127_136_144_152_158_166_172_178_184_1281]] (共用特徵: `肯亞, tp, 風門`)
