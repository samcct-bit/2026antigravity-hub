---
type: sca_theory
title: "Tank-200 肯亞第二鍋戰報與定調"
date: 2026-05-10
tags: [coffee/sca_theory, imported/takeout]
---

# 📚 SCA 考官理論：Tank-200 肯亞第二鍋戰報與定調

## 📋 對話理論紀錄
```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Tank-200 肯亞 B#2 戰報與定調</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&display=swap');
        
        body {
            font-family: 'Noto Sans TC', sans-serif;
            background-color: #0f172a; 
            color: #f8fafc;
            margin: 0;
            padding-bottom: 3rem;
            overscroll-behavior: none;
        }

        .gold-gradient {
            background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .card {
            background-color: #1e293b; 
            border: 1px solid #334155; 
            border-radius: 1rem;
            padding: 1.25rem;
            margin-bottom: 1.25rem;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            position: relative;
            overflow: hidden;
        }

        .border-red { border: 1px solid #ef4444; }
        .border-blue { border: 1px solid #3b82f6; }
        .border-emerald { border: 1px solid #10b981; }

        .stat-box {
            background: #0f172a;
            border: 1px solid #334155;
            border-radius: 0.5rem;
            padding: 0.8rem;
            text-align: center;
            flex: 1;
            margin: 0 0.25rem;
        }

        .tab-pane {
            display: none;
            animation: fadeIn 0.4s ease-out forwards;
        }
        .tab-pane.active { display: block; }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: #0f172a;
            border-top: 1px solid #334155;
            display: flex;
            justify-content: space-around;
            padding: 0.5rem 0;
            padding-bottom: env(safe-area-inset-bottom, 0.5rem);
            z-index: 50;
        }

        .nav-btn {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #64748b;
            font-size: 0.75rem;
            transition: all 0.2s;
            background: none;
            border: none;
        }
        .nav-btn i {
            font-size: 1.25rem;
            margin-bottom: 0.25rem;
        }
        .nav-btn.active { color: #ef4444; }
        .nav-btn.active i { transform: scale(1.15); }
    </style>
</head>
<body class="p-5">

    <header class="pt-2 pb-4 border-b border-[#334155] mb-5">
        <div class="text-xs text-red-500 font-bold tracking-wider mb-1 flex items-center">
            <i class="fa-solid fa-microscope mr-2"></i> BATCH #2 EVALUATION
        </div>
        <h1 class="text-2xl font-black gold-gradient">肯亞 B#2 深度解析</h1>
        <p class="text-sm text-gray-400 mt-1">5°C 的蝴蝶效應與完美的神級控尾</p>
    </header>

    <main>

        <!-- Tab 1: 數據解密 -->
        <div id="tab-data" class="tab-pane active">
            <div class="card border-blue">
                <i class="fa-solid fa-bolt absolute -right-4 -top-4 text-8xl text-blue-500/10"></i>
                <h2 class="text-lg font-bold text-blue-400 mb-4 flex items-center border-b border-blue-900 pb-2">
                    <i class="fa-solid fa-scale-balanced mr-2"></i> B#1 vs B#2 核心對決
                </h2>
                
                <div class="flex justify-between mb-4">
                    <div class="stat-box opacity-75">
                        <div class="text-xs text-gray-400 mb-1">B#1 (205°C入)</div>
                        <div class="font-bold text-white text-xl">Ye 4:05</div>
                        <div class="text-xs text-gray-500">160°C</div>
                    </div>
                    <div class="stat-box border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                        <div class="text-xs text-blue-300 mb-1">B#2 (200°C入)</div>
                        <div class="font-bold text-white text-xl">Ye 5:15</div>
                        <div class="text-xs text-blue-400">160°C</div>
                    </div>
                </div>

                <div class="bg-slate-900 p-3 rounded-lg text-sm text-gray-300 space-y-3">
                    <p>
                        <strong class="text-red-400">驚人的物理現象：</strong><br>
                        您僅僅把入豆溫<strong class="text-white bg-red-900 px-1 rounded">調降了 5°C</strong> (205°C -> 200°C)，轉黃點竟然<strong class="text-white bg-blue-900 px-1 rounded">慢了 1 分 10 秒</strong>！
                    </p>
                    <p>
                        <strong class="text-yellow-500">為何會這樣？</strong><br>
                        這就是肯亞極硬豆的「熱能黑洞」特性。細胞壁太硬了，當初始動能（200°C）剛好跨不過某個物理門檻時，它脫水的速度就會慢下來。
                    </p>
                    <p>
                        <strong class="text-emerald-400">這是失誤嗎？絕對不是！</strong><br>
                        5分15秒 的脫水期對於肯亞來說是<strong class="text-white">非常完美的黃金區間</strong>！這代表熱能溫和且深層地穿透了硬豆的豆芯，完全排除了外熟內生（番茄味）的風險！
                    </p>
                </div>
            </div>

            <div class="card border-emerald">
                <h2 class="text-lg font-bold text-emerald-400 mb-3 flex items-center">
                    <i class="fa-solid fa-stopwatch mr-2"></i> 神級控尾：肌肉記憶的展現
                </h2>
                <div class="flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-slate-700">
                    <div>
                        <div class="text-xs text-gray-400">發展時間 (DTR)</div>
                        <div class="font-bold text-white">B#1 發展 <span class="text-emerald-400 text-lg">1:02</span></div>
                        <div class="font-bold text-white">B#2 發展 <span class="text-emerald-400 text-lg">1:02</span></div>
                    </div>
                    <div class="text-right">
                        <i class="fa-solid fa-check-double text-3xl text-emerald-500"></i>
                    </div>
                </div>
                <p class="text-sm text-gray-400 mt-3">
                    不管前面的脫水期差了一分多鐘，您在 195°C 拔抽屜代償、204°C 一爆急煞的操作，讓這兩鍋的發展時間<strong>「一秒不差」地鎖死在 1分02秒！</strong> 下豆溫度也是完美的 215°C 與 214°C。這就是職業水準的穩定度！
                </p>
            </div>
        </div>

        <!-- Tab 2: 風味與戰略修正 -->
        <div id="tab-strategy" class="tab-pane">
            <div class="card border-red">
                <i class="fa-solid fa-map-location-dot absolute -right-4 -top-4 text-8xl text-red-500/10"></i>
                <h2 class="text-xl font-bold text-red-400 mb-3 border-b border-red-900 pb-2">
                    <i class="fa-solid fa-tower-broadcast mr-2"></i> 緊急軍令：取消降溫計畫
                </h2>
                
                <p class="text-sm text-gray-300 mb-4 leading-relaxed">
                    在上一份報告中，我建議您在 B#4、B#5 將入豆溫降至 195°C。
                    <strong class="text-white bg-red-600 px-1 rounded">現在，我身為考官，正式收回這個指令！</strong>
                </p>
                
                <div class="bg-slate-900 border border-red-500/50 p-4 rounded-xl space-y-3 text-sm text-gray-300">
                    <p>
                        既然 200°C 入豆能跑出 <strong class="text-yellow-500">5分15秒</strong> 這個極度完美的脫水期，如果我們再降到 195°C，脫水期可能會被拖到 6 分半鐘，肯亞的酸值會變得沉悶平淡。
                    </p>
                    <div class="p-3 bg-red-900/30 border border-red-500 rounded text-center">
                        <strong class="text-white text-lg">接下來的 B#3, B#4, B#5：<br>
                        <span class="text-blue-400 text-2xl">全面鎖死 200°C 入豆！</span></strong>
                    </div>
                    <ul class="list-disc pl-5 text-gray-400 mt-2 space-y-1">
                        <li>起步火力：<strong class="text-white">維持 85%</strong></li>
                        <li>轉黃點 (Ye)：<strong class="text-white">預計落在 5:00 - 5:15</strong>，降火 75%</li>
                        <li>排煙與煞車：<strong class="text-white">維持您完美的神之手</strong> (195°C 代償, 一爆降 60%)</li>
                    </ul>
                </div>
            </div>

            <div class="card border-yellow mt-4">
                <h2 class="text-lg font-bold text-yellow-500 mb-3 flex items-center">
                    <i class="fa-solid fa-mug-hot mr-2"></i> B#1 與 B#2 雙重風味宇宙
                </h2>
                <p class="text-sm text-gray-300 mb-2">您現在手上有兩支截然不同的肯亞精品：</p>
                <div class="grid grid-cols-2 gap-3 text-center text-sm">
                    <div class="bg-slate-900 p-2 rounded border border-slate-700">
                        <div class="font-bold text-white mb-1">B#1 (Ye 4:05)</div>
                        <div class="text-xs text-blue-300">明亮銳利、酸值爆發、如黑醋栗果汁。</div>
                    </div>
                    <div class="bg-slate-900 p-2 rounded border border-yellow-700/50">
                        <div class="font-bold text-yellow-500 mb-1">B#2 (Ye 5:15)</div>
                        <div class="text-xs text-yellow-300">圓潤厚實、甜感極佳、如太妃糖與黑巧克力。</div>
                    </div>
                </div>
            </div>
        </div>

    </main>

    <nav class="bottom-nav">
        <button class="nav-btn active" onclick="switchTab('data', this)">
            <i class="fa-solid fa-microscope text-blue-400"></i>
            <span class="text-blue-400">數據解密</span>
        </button>
        <button class="nav-btn" onclick="switchTab('strategy', this)">
            <i class="fa-solid fa-map-location-dot text-red-400"></i>
            <span class="text-red-400">最終定調</span>
        </button>
    </nav>

    <script>
        function switchTab(tabId, btnElement) {
            document.querySelectorAll('.tab-pane').forEach(tab => {
                tab.classList.remove('active');
            });
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            document.getElementById('tab-' + tabId).classList.add('active');
            btnElement.classList.add('active');
            window.scrollTo(0, 0);
        }
    </script>
</body>
</html>
```


## 🖼️ 相關參考圖片與文件
![[7003-61d8ccd4c565400d.png]] ![[7003-85cc318439819f68.png]] ![[9000-b0d0d952ab8ef43b.jpg]] ![[10093408293917864137-4c73aabdd108e0ae.png]] ![[16009922497231620712-d01b1744e5213582.png]] ![[16010747200615915129-2c475562cbf29816.png]] ![[16057140004588957782-013a416dbc8e89ed.jpg]] ![[13023469110159187213-450df5f56c9a89a2.png]] ![[Gemini_Generated_Image_8ggri88ggr-44a8442c4e958641.jpg]] ![[Gemini_Generated_Image_htsu2ahtsu-e11f6500ada5b266.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-96a4cef5cc1008b1.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-be202b15b4d41e70.jpg]] ![[Gemini_Generated_Image_q59snqq59s-d7376f45389320a6.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-153057063c8c793c.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-758609cfa28db9a7.jpg]]

## 🔬 科學物理觀點解析
- *此理論卡片由 Gemini Takeout 匯出對話分析自動生成。*

## 🔗 相關理論與對話推薦
- [[2026-05-10_Tank-200_肯亞第二鍋戰報與定調_218]] (共用特徵: `肯亞, dtr, tp`)
- [[2026-03-26_請同時給我這一支豆子在同一台機器上詳細的烘焙計畫_800]] (共用特徵: `肯亞, dtr, tp`)
- [[2026-02-16_好的_1292]] (共用特徵: `肯亞, dtr, tp`)
- [[2026-03-25_請更新_821]] (共用特徵: `肯亞, tp, 一爆`)
- [[2026-03-26_Tank_200_專屬校正與直火實戰_812]] (共用特徵: `肯亞, tp, 一爆`)
