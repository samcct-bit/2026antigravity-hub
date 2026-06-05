---
type: sca_theory
title: "Tank 200 專屬校正與直火實戰"
date: 2026-03-26
tags: [coffee/sca_theory, imported/takeout]
---

# 📚 SCA 考官理論：Tank 200 專屬校正與直火實戰

## 📋 對話理論紀錄
```slides
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tank 200 專屬校正與直火實戰</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&family=Poppins:wght@500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    
    <style>
        /* 1. THE SETUP */
        * {
            box-sizing: border-box;
        }

        p {
            margin: 0;
            margin-bottom: 15px;
        }

        body {
            background-color: #2c2c2c; /* 外圍深色背景 */
            display: grid;
            gap: 20px;
            grid-template-columns: 1fr;
            margin: 0;
            min-height: 100vh;
            padding: 20px 0;
            place-items: center;
        }

        .slide-container {
            align-items: center;
            background-color: #f3eee4; /* 拿鐵奶油白 */
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            font-family: 'Noto Sans TC', sans-serif;
            height: 720px;
            justify-content: center;
            overflow: hidden;
            padding: 60px;
            position: relative;
            width: 1280px;
        }

        .slide-container::before {
            content: '';
            height: 100%;
            left: 0;
            position: absolute;
            top: 0;
            width: 100%;
            z-index: 0;
        }

        .slide-container > * {
            position: relative;
            z-index: 1;
        }

        /* 2. CONSISTENT TYPOGRAPHY */
        .slide-container h1,
        .slide-container h2,
        .slide-container h3,
        .slide-container h4 {
            color: #3e2723; /* 深濃縮咖啡棕 */
            font-weight: 700;
            font-family: 'Poppins', 'Noto Sans TC', sans-serif;
            margin: 0;
        }

        .slide-container p,
        .slide-container li,
        .slide-container .subtitle,
        .slide-container th,
        .slide-container td {
            color: #5d4037; 
            font-family: 'Noto Sans TC', sans-serif;
            line-height: 1.6;
        }

        .slide-container h1 {
            font-size: 64px;
            line-height: 1.2;
            margin-bottom: 20px;
        }

        .slide-container .slide-title {
            font-size: 42px;
            font-weight: 700;
            margin-bottom: 40px;
            text-align: left;
            width: 100%;
            color: #3e2723;
        }
        
        .slide-container .slide-title span {
            color: #d35400; /* 焦糖橘點綴 */
        }

        .slide-container h3 {
            font-size: 32px;
            margin-bottom: 15px;
        }

        .slide-container p,
        .slide-container li,
        .slide-container td {
            font-size: 18px;
        }

        .slide-container .subtitle {
            font-size: 22px;
            font-weight: 500;
            margin-top: 10px;
            color: #8d6e63;
        }

        .slide-container .content-area {
            align-items: center;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            justify-content: center;
            width: 100%;
        }

        /* 3. LAYOUT DEFINITIONS */
        .title-layout {
            text-align: center;
        }

        .two-column {
            align-items: flex-start;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 50px;
            width: 100%;
        }

        .image-wrapper {
            border-radius: 12px;
            height: 400px;
            max-width: 100%;
            overflow: hidden;
            width: 100%;
            border: 4px solid #3e2723;
            box-shadow: 0 10px 20px rgba(62, 39, 35, 0.15);
        }

        .image-wrapper img {
            height: 100%;
            width: 100%;
            object-fit: cover;
        }

        .two-column .image-wrapper img {
            object-fit: cover;
        }

        /* Tiled Content */
        .tiled-content {
            align-items: stretch;
            display: flex;
            gap: 40px;
            justify-content: center;
            width: 100%;
        }

        .tile {
            align-items: center;
            background-color: #ffffff;
            border-radius: 16px;
            border: 2px solid #e0e0e0;
            display: flex;
            flex-direction: column;
            flex: 1;
            justify-content: flex-start;
            padding: 40px 30px;
            text-align: center;
            box-shadow: 0 8px 15px rgba(0,0,0,0.05);
            transition: transform 0.3s ease;
        }

        .tile .icon {
            color: #d35400;
            font-size: 52px;
            margin-bottom: 25px;
            background: #fff3e0;
            height: 90px;
            width: 90px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }

        /* Bleed Image Right Layout */
        .slide-container.bleed-image-layout {
            align-items: start;
            display: grid;
            gap: 0;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            padding: 0;
        }

        .slide-container.bleed-image-layout > .content-container {
            padding: 60px 50px 60px 60px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 100%;
            background-color: #f3eee4;
        }

        .slide-container.bleed-image-layout > .image-container {
            height: 100%;
            overflow: hidden;
            width: 100%;
        }

        .slide-container.bleed-image-layout img.bleed-image-side {
            display: block;
            height: 720px;
            object-fit: cover;
            object-position: center;
            width: 100%;
        }

        .accent-box {
            background-color: #3e2723;
            border-radius: 8px;
            padding: 25px;
            margin-top: 30px;
            border-left: 6px solid #d35400;
        }

        .accent-box p, .accent-box h4 {
            color: #f3eee4;
            margin-bottom: 10px;
        }
        
        .accent-box p:last-child {
            margin-bottom: 0;
        }

        /* Section Title Layout */
        .section-title-layout {
            align-items: center;
            display: flex;
            flex-direction: column;
            height: 100%;
            justify-content: center;
            text-align: center;
            width: 100%;
            background-color: #3e2723;
            border-radius: 16px;
            padding: 60px;
            color: #f3eee4;
        }

        .section-title-layout h2 {
            font-size: 64px;
            margin-bottom: 20px;
            color: #f3eee4;
            letter-spacing: 2px;
        }
        
        .section-title-layout h2 span {
            color: #d35400;
        }

        .section-title-layout p {
            font-size: 24px;
            margin: 0 auto;
            max-width: 800px;
            color: #e0e0e0;
        }

        .section-title-layout hr {
            background-color: #d35400;
            border: none;
            height: 6px;
            margin: 40px auto;
            width: 120px;
            border-radius: 3px;
        }

        /* Table Layout */
        .table-layout {
            width: 100%;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }

        .table-layout table {
            border-collapse: collapse;
            width: 100%;
        }

        .table-layout th,
        .table-layout td {
            border-bottom: 1px solid #e0e0e0;
            padding: 14px 20px;
            text-align: left;
            font-size: 16px; /* Optimized for dense info */
        }

        .table-layout th {
            background-color: #3e2723;
            color: #f3eee4;
            font-size: 18px;
            font-weight: 700;
            letter-spacing: 1px;
        }

        .table-layout tr:last-child td {
            border-bottom: none;
        }
        
        .table-layout tr:nth-child(even) {
            background-color: #faf8f5;
        }

        .table-layout td:nth-child(1) { font-weight: 700; color: #d35400; width: 10%; } /* Time */
        .table-layout td:nth-child(2) { font-weight: 700; width: 15%; } /* Status */
        .table-layout td:nth-child(3) { color: #d35400; font-family: 'Poppins', sans-serif; font-weight: 700; width: 15%; } /* Temp */
        .table-layout td:nth-child(4) { font-weight: 700; width: 18%; } /* Action */
        .table-layout td:nth-child(5) { width: 42%; line-height: 1.5; color: #5d4037; } /* Analysis */

        .status-badge {
            background-color: #fbe9e7;
            color: #d35400;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 14px;
            display: inline-block;
            margin-right: 8px;
            font-weight: bold;
        }

        /* Bullet List */
        .bullet-list ul {
            list-style: none;
            margin: 0;
            padding: 0;
        }

        .bullet-list li {
            font-size: 20px;
            margin-bottom: 25px;
            padding-left: 50px;
            position: relative;
            line-height: 1.5;
        }

        .bullet-list i {
            color: #d35400;
            font-size: 28px;
            left: 0;
            position: absolute;
            top: 2px;
        }

        .bullet-list li strong {
            color: #3e2723;
            font-weight: 700;
            display: block;
            margin-bottom: 5px;
            font-size: 24px;
        }

        /* Q&A Layout */
        .qa-layout {
            margin: 0 auto;
            text-align: center;
            width: 100%;
            align-self: center;
        }

        .qa-layout h2 {
            font-size: 90px;
            margin-bottom: 30px;
            color: #3e2723;
        }

        .qa-layout p {
            font-size: 28px;
            color: #d35400;
            font-weight: 500;
        }
    </style>
</head>
<body>

<!-- Slide 1: Cover (Bleed Image Right) -->
<div class="slide-container bleed-image-layout" id="slide1">
    <div class="content-container">
        <p class="subtitle" style="color: #d35400; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">自主訓練簡報</p>
        <h1 style="font-size: 56px;">Tank 200<br>專屬校正與<br>直火實戰</h1>
        <p style="font-size: 24px; margin-top: 20px; font-weight: 500;">SCA 專業烘焙技術：實戰整合劇本</p>
        
        <div class="accent-box">
            <h4><i class="fa-solid fa-crosshairs" style="margin-right: 10px;"></i>核心戰略</h4>
            <p>探針校正 (一爆 210°C) ✖️ 直火蓄熱管理 (關火入豆)</p>
            <hr style="border-color: rgba(255,255,255,0.2); margin: 15px 0;">
            <p style="font-size: 16px; opacity: 0.9;"><i class="fa-solid fa-fire-burner" style="margin-right: 10px;"></i>操作機種：Tank 200 微型直火機</p>
        </div>
    </div>
    <div class="image-container">
        <!-- 採用沉穩暗色調的微型烘豆機，呼應Tank 200職人感 -->
        <img class="bleed-image-side" src="http://googleusercontent.com/image_collection/image_retrieval/17055607199365675297" alt="Professional coffee roaster machine">
    </div>
</div>

<!-- Slide 2: Examiner's Mindset (Tiled_Text_With_Icons) -->
<div class="slide-container" id="slide2">
    <h2 class="slide-title">考官的爐前心法：<span>為什麼要整合？</span></h2>
    <div class="content-area">
        <div class="tiled-content">
            <div class="tile">
                <div class="icon"><i class="fa-solid fa-temperature-arrow-down"></i></div>
                <h3>機台現實</h3>
                <p>Tank 200 探針大約有 <strong>10°C 的偏移</strong>（一爆顯示約為 210°C），因此我們必須在邏輯上將所有 BT（豆溫）座標平移，重新定義火力節點。</p>
            </div>
            <div class="tile">
                <div class="icon"><i class="fa-solid fa-fire"></i></div>
                <h3>直火現實</h3>
                <p>即使 BT 數據因為探針平移而降低，滾筒金屬的<strong>「絕對高溫」與「輻射熱」依然存在</strong>，熱衝擊的風險並未消失，必須調整給火時機。</p>
            </div>
            <div class="tile">
                <div class="icon"><i class="fa-solid fa-rotate"></i></div>
                <h3>黃金交叉</h3>
                <p>必須用<strong>「看 ET 預熱與關火」</strong>來避開入豆焦斑，隨後切換成<strong>「看 BT 與感官」</strong>來執行後續的火力降階與下豆，兩者互補才是關鍵。</p>
            </div>
        </div>
    </div>
</div>

<!-- Slide 3: Intro to Script A (Section_Title) -->
<div class="slide-container" id="slide3" style="padding: 0;">
    <div class="section-title-layout">
        <h2 style="font-size: 48px; margin-bottom: 10px;">實戰腳本 A</h2>
        <h2 style="font-size: 64px;">肯亞 AA 安達貝斯莊園 <span>(日曬)</span></h2>
        <hr>
        <p style="margin-bottom: 20px;"><strong>豆質特性：</strong> 高密度硬豆</p>
        <p style="margin-bottom: 20px;"><strong>戰略代號：</strong> 強勢穿透，順勢滑行</p>
        <p style="color: #ffcc80;"><strong>目標風味：</strong> 莓果酸亮、烏梅、飽滿黑糖甜感</p>
    </div>
</div>

<!-- Slide 4: Script A Table -->
<div class="slide-container" id="slide4">
    <h2 class="slide-title">肯亞 AA <span>整合戰略時間表</span></h2>
    <div class="content-area">
        <div class="table-layout">
            <table>
                <thead>
                    <tr>
                        <th>時間</th>
                        <th>狀態標記</th>
                        <th>溫度指標 (BT)</th>
                        <th>火力動作</th>
                        <th>講師技術解析 (直火應用)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>-01:00</td>
                        <td>預熱與關火</td>
                        <td>預熱 ET 235°C</td>
                        <td>關火，風門微開</td>
                        <td><span class="status-badge">直火關鍵</span>衝高 ET 蓄熱後關火，等待熱能均勻滲透金屬，消除攻擊性。</td>
                    </tr>
                    <tr>
                        <td>00:00</td>
                        <td>入豆 (Charge)</td>
                        <td>205 - 208°C</td>
                        <td>維持關火 (浸泡)</td>
                        <td>讓豆表吸收溫和的輻射熱，不急著點火，避開入豆瞬間的熱衝擊。</td>
                    </tr>
                    <tr>
                        <td>01:15</td>
                        <td>回溫點 (TP)</td>
                        <td>85 - 95°C</td>
                        <td>點火 80%</td>
                        <td><span class="status-badge">重新給火</span>觀察溫度停止下降 (約 TP 前 10 秒)，給予強火建立脫水動能。</td>
                    </tr>
                    <tr>
                        <td>05:00</td>
                        <td>轉黃點 (Yellow)</td>
                        <td>160 - 165°C</td>
                        <td>⬇️ 降至 60%</td>
                        <td>豆表轉黃，降火保護表面，讓熱能往豆芯走，避免外層燒焦。</td>
                    </tr>
                    <tr>
                        <td>07:30</td>
                        <td>梅納中段</td>
                        <td>185 - 190°C</td>
                        <td>⬇️ 降至 40%</td>
                        <td>日曬豆糖分高，開始收斂動能，避免梅納反應發展過速。</td>
                    </tr>
                    <tr>
                        <td>09:00</td>
                        <td>一爆前夕</td>
                        <td>202 - 205°C</td>
                        <td>⬇️ 降至 20%</td>
                        <td>距離一爆剩 5-8°C，全靠金屬熱慣性滑入一爆，保留醇厚度。</td>
                    </tr>
                    <tr>
                        <td>10:00</td>
                        <td>一爆初</td>
                        <td>210°C</td>
                        <td>20% 或 關火</td>
                        <td><span class="status-badge">基準確認</span>聽見連爆。若 ROR 衝太快果斷關火滑行。</td>
                    </tr>
                    <tr>
                        <td>11:20</td>
                        <td>下豆 (Drop)</td>
                        <td>220 - 222°C</td>
                        <td>出爐冷卻</td>
                        <td>發展期 1 分 15 秒至 1 分半，果斷下豆，鎖住黑糖甜感！</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Slide 5: Intro to Script B (Section_Title) -->
<div class="slide-container" id="slide5" style="padding: 0;">
    <div class="section-title-layout">
        <h2 style="font-size: 48px; margin-bottom: 10px;">實戰腳本 B</h2>
        <h2 style="font-size: 64px;">巴拿馬 艾利達 花魁 <span>(96h 厭氧)</span></h2>
        <hr>
        <p style="margin-bottom: 20px;"><strong>豆質特性：</strong> 脆弱處理法</p>
        <p style="margin-bottom: 20px;"><strong>戰略代號：</strong> 溫柔慢熬，精準煞車</p>
        <p style="color: #ffcc80;"><strong>目標風味：</strong> 伯爵茶、白花香、奶昔滑順感</p>
    </div>
</div>

<!-- Slide 6: Script B Table -->
<div class="slide-container" id="slide6">
    <h2 class="slide-title">巴拿馬 厭氧花魁 <span>整合戰略時間表</span></h2>
    <div class="content-area">
        <div class="table-layout">
            <table>
                <thead>
                    <tr>
                        <th>時間</th>
                        <th>狀態標記</th>
                        <th>溫度指標 (BT)</th>
                        <th>火力動作</th>
                        <th>講師技術解析 (直火應用)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>-01:30</td>
                        <td>預熱與關火</td>
                        <td>預熱 ET 215°C</td>
                        <td>關火，風門全開 10s</td>
                        <td><span class="status-badge">直火關鍵</span>溫和預熱。風門全開排掉多餘表面熱能，保護脆弱的厭氧發酵細胞壁。</td>
                    </tr>
                    <tr>
                        <td>00:00</td>
                        <td>入豆 (Charge)</td>
                        <td>190 - 195°C</td>
                        <td>維持關火 (浸泡)</td>
                        <td>低溫起步，拉長浸泡期 (Soak)，溫柔啟動脫水，不強迫升溫。</td>
                    </tr>
                    <tr>
                        <td>01:30</td>
                        <td>回溫點 (TP)</td>
                        <td>80 - 90°C</td>
                        <td>點火 60%</td>
                        <td><span class="status-badge">重新給火</span>不急著推火，在 TP 點確實出現後，才給予中等火力。</td>
                    </tr>
                    <tr>
                        <td>05:30</td>
                        <td>轉黃點 (Yellow)</td>
                        <td>160 - 165°C</td>
                        <td>⬇️ 降至 50%</td>
                        <td>進入梅納反應，用中低溫慢烤創造奶昔般的 Body 與觸感。</td>
                    </tr>
                    <tr>
                        <td>08:30</td>
                        <td>梅納中段</td>
                        <td>190°C</td>
                        <td>⬇️ 降至 40%</td>
                        <td>維持平穩 ROR，這時煙管應該已經飄出明顯的茶香與果香。</td>
                    </tr>
                    <tr>
                        <td>10:30</td>
                        <td>一爆前夕</td>
                        <td>205 - 207°C</td>
                        <td>⬇️ 降至 30%</td>
                        <td>厭氧豆不能收火收太乾淨，必須保留微量推力，避免 ROR 歸零停滯。</td>
                    </tr>
                    <tr>
                        <td>11:30</td>
                        <td>一爆初</td>
                        <td>210°C</td>
                        <td>維持 30%</td>
                        <td><span class="status-badge">基準確認</span>爆聲可能極小，必須看溫度並聞到強烈甜香來判斷一爆。</td>
                    </tr>
                    <tr>
                        <td>12:20</td>
                        <td>下豆 (Drop)</td>
                        <td>215 - 217°C</td>
                        <td>出爐冷卻</td>
                        <td>發展期僅 45-60 秒，極淺焙快速下豆，完美鎖住花香與茶感！</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Slide 7: Sensory Navigation (Image_Right_Text_Left) -->
<div class="slide-container" id="slide7">
    <h2 class="slide-title">感官導航系統：<span>考官的最終叮嚀</span></h2>
    <div class="content-area">
        <div class="two-column">
            <div>
                <p style="font-size: 20px; margin-bottom: 30px; color: #3e2723; font-weight: 500;">機器數據已為你建立安全的邊界，但在爐前的微調，請相信你的眼、鼻、耳：</p>
                <div class="bullet-list">
                    <ul>
                        <li>
                            <i class="fa-solid fa-eye"></i>
                            <strong>視覺防線</strong>
                            脫水結束轉黃時，如果有黑點（焦斑），代表你「預熱 ET 還是太高」或「浸泡關火時間不夠長」。
                        </li>
                        <li>
                            <i class="fa-solid fa-wind"></i>
                            <strong>嗅覺防線</strong>
                            一爆前後，如果出現刺鼻煙燻味，立刻微升排風（風門），直火機對排煙極度敏感。
                        </li>
                        <li>
                            <i class="fa-solid fa-ear-listen"></i>
                            <strong>聽覺防線</strong>
                            肯亞的爆裂聲會非常清脆猛烈；厭氧花魁可能只有悶悶的「啵啵」聲。不要死等聲音，溫度（210°C）加上氣味轉甜，就是一爆的信號！
                        </li>
                    </ul>
                </div>
            </div>
            <div>
                <div class="image-wrapper">
                    <!-- 呈現出剛出爐咖啡豆的美麗色澤與光影，扣緊感官的主題 -->
                    <img src="http://googleusercontent.com/image_collection/image_retrieval/8229772574924774159" alt="Close up of freshly roasted coffee beans cooling">
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Slide 8: Q&A Layout -->
<div class="slide-container" id="slide8">
    <div class="qa-layout">
        <h2>Ready to Roast?</h2>
        <p>相信你的感官，精準掌控每一爐。</p>
    </div>
</div>

</body>
</html>
```


## 🖼️ 相關參考圖片與文件
![[7003-61d8ccd4c565400d.png]] ![[7003-85cc318439819f68.png]] ![[10093408293917864137-4c73aabdd108e0ae.png]] ![[IMG20260405202251-d26edf580f6611b8.jpg]] ![[IMG_0016-1381311bbb20b6d0.jpg]] ![[IMG_0020-259844b3aec492b8.png]] ![[IMG_0021-259844b3aec492b8.png]] ![[IMG_0022-259844b3aec492b8.jpg]] ![[IMG_0024-259844b3aec492b8.jpg]] ![[IMG_0025-259844b3aec492b8.png]] ![[IMG_0025-63235577b267a9cf.png]] ![[image_5bd301-a2e77f6c827bfe5a.png]] ![[image_db3f9f-6b6329d1c4cb4e92.png]] ![[2555777530681031145-d3ce890839589fae.png]] ![[16009922497231620712-d01b1744e5213582.png]] ![[16010747200615915129-2c475562cbf29816.png]] ![[16057140004588957782-013a416dbc8e89ed.jpg]] ![[16544113557186314641-e81ba32a4992f6d2.png]] ![[165d0ca5-9027-4d54-9d6a-e18f06805-4f69e9f03854182d.jpg]] ![[2020-42bd1200ba8b3586.jpg]] ![[2021-42bd1200ba8b3586.jpg]] ![[2022-42bd1200ba8b3586.jpg]] ![[2023-42bd1200ba8b3586.jpg]] ![[2024-42bd1200ba8b3586.jpg]] [[2026烘豆機選購指南-acd668a8e22d7335.pdf]] (附件檔案) ![[2070008902362922822-55e4bd152ce255b3.png]] [[Roasting_Intermediate_ProfileLog_-37207be7c8cf4ed8.pdf]] (附件檔案) ![[Gemini_Generated_Image_8ggri88ggr-44a8442c4e958641.jpg]] ![[Gemini_Generated_Image_htsu2ahtsu-e11f6500ada5b266.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-96a4cef5cc1008b1.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-be202b15b4d41e70.jpg]] ![[Gemini_Generated_Image_q59snqq59s-d7376f45389320a6.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-153057063c8c793c.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-758609cfa28db9a7.jpg]]

## 🔬 科學物理觀點解析
- *此理論卡片由 Gemini Takeout 匯出對話分析自動生成。*

## 🔗 相關理論與對話推薦
- [[2026-03-26_Tank_200_專屬校正與直火實戰_812]] (共用特徵: `肯亞, 巴拿馬, 厭氧`)
- [[2026-03-26_請幫我整合上面的建議與之前下方的建議__沒問題！這正是我們講師在做_SCA_烘焙認證考試時，要求學員必須具備的「機器適應_817]] (共用特徵: `肯亞, 巴拿馬, 厭氧`)
- [[2026-03-26_請同時給我這一支豆子在同一台機器上詳細的烘焙計畫_800]] (共用特徵: `肯亞, 厭氧, 梅納反應`)
- [[2026-03-26_請根據您之前給我另外兩支豆子的建議，給我這兩支的火力控制__太棒了！身為你的_SCA_專業講師與考官，我非常欣賞你將「底_805]] (共用特徵: `肯亞, 厭氧, 梅納反應`)
- [[2026-03-25_請幫我依據修正版計畫及這兩筆數據，推論與建議這台機器接下來要烘肯亞Aa的火力建議，因為風門無法調整_827]] (共用特徵: `肯亞, 厭氧, 梅納反應`)
