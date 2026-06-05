---
type: sca_theory
title: "Tank-200 雙日戰役面板"
date: 2026-05-08
tags: [coffee/sca_theory, imported/takeout]
---

# 📚 SCA 考官理論：Tank-200 雙日戰役面板

## 📋 對話理論紀錄
```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Tank-200 雙日戰役擴充面板</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&display=swap');
        
        body {
            font-family: 'Noto Sans TC', sans-serif;
            background-color: #111827; /* Gray 900 */
            color: #f3f4f6; /* Gray 100 */
            margin: 0;
            overflow-x: hidden;
            overscroll-behavior: none;
            padding-bottom: 80px; /* Space for bottom nav */
        }

        .gold-gradient {
            background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .card {
            background-color: #1f2937; /* Gray 800 */
            border: 1px solid #374151;
            border-radius: 1rem;
            padding: 1.25rem;
            margin-bottom: 1rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
        }

        .param-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 0;
            border-bottom: 1px solid #374151;
        }
        .param-row:last-child {
            border-bottom: none;
        }

        .badge-temp {
            background-color: #2563eb; /* Blue 600 */
            color: white;
            padding: 0.2rem 0.6rem;
            border-radius: 0.5rem;
            font-weight: 700;
            font-size: 0.85rem;
        }

        .badge-fire {
            background-color: #dc2626; /* Red 600 */
            color: white;
            padding: 0.2rem 0.6rem;
            border-radius: 0.5rem;
            font-weight: 700;
            font-size: 0.85rem;
        }

        .badge-alert {
            border: 2px solid #fbbf24; /* Amber 400 */
            color: #fbbf24;
            background-color: rgba(251, 191, 36, 0.1);
        }

        /* Tabs setup */
        .tab-pane {
            display: none;
            animation: slideUp 0.4s ease-out forwards;
        }
        .tab-pane.active {
            display: block;
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Bottom Nav */
        .bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: #111827;
            border-top: 1px solid #374151;
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
            color: #6b7280; /* Gray 500 */
            font-size: 0.75rem;
            transition: all 0.2s;
            background: none;
            border: none;
        }
        .nav-btn i {
            font-size: 1.25rem;
            margin-bottom: 0.25rem;
            transition: transform 0.2s;
        }
        .nav-btn.active {
            color: #fbbf24; /* Amber 400 */
        }
        .nav-btn.active i {
            transform: scale(1.1);
        }
    </style>
</head>
<body>

    <!-- Header -->
    <header class="pt-6 pb-4 px-5 bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div class="text-xs text-gray-400 font-bold tracking-wider mb-1">SCA ROASTING PLAN</div>
        <h1 class="text-2xl font-black gold-gradient">Tank-200 雙日戰役</h1>
    </header>

    <main class="p-5">

        <!-- 總戰略 (Strategy) -->
        <div id="tab-strategy" class="tab-pane active">
            <h2 class="text-xl font-bold mb-4 flex items-center text-white">
                <i class="fa-solid fa-chess-knight text-yellow-500 mr-2"></i> 兵力佈署邏輯
            </h2>
            
            <div class="card border-l-4 border-blue-500">
                <h3 class="font-bold text-lg text-blue-400 mb-2">Day 1：高溫穿透日 (水洗/SHB)</h3>
                <p class="text-sm text-gray-300 mb-3">
                    <strong>目標：</strong> 利用高入豆溫 (200-205°C) 攻破高海拔極硬豆的結構，提取乾淨花香。
                </p>
                <div class="bg-gray-900 rounded p-2 text-sm border border-gray-700">
                    <span class="text-white font-bold">順序 1：</span> 古吉 藝伎 G1 (水洗)<br>
                    <span class="text-white font-bold">順序 2：</span> 法拉漢尼斯 蘇丹藝伎 (水洗 SHB)
                </div>
            </div>

            <div class="card border-l-4 border-orange-500">
                <h3 class="font-bold text-lg text-orange-400 mb-2">Day 2：蜜處理與日曬日 (糖分管理)</h3>
                <p class="text-sm text-gray-300 mb-3">
                    <strong>目標：</strong> 低溫入豆 (190°C)，防範外表糖分焦糖化過度，運用 60% 穩火拉長梅納反應提升甜感。
                </p>
                <div class="bg-gray-900 rounded p-2 text-sm border border-gray-700 space-y-1">
                    <span class="text-white font-bold">順序 1：</span> 薇拉 薇拉莎琪 (蜜處理)<br>
                    <span class="text-white font-bold">順序 2：</span> 布穀鳥 古優種 (日曬)<br>
                    <span class="text-white font-bold">順序 3：</span> 木蘭花 卡杜依 (日曬)
                </div>
            </div>
            
            <div class="p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-sm text-red-200 mt-4 flex items-start">
                <i class="fa-solid fa-triangle-exclamation mt-1 mr-2 text-red-400"></i>
                <p><strong>考官鐵則重申：</strong> 根據您的紀錄表，Tank 200 在 160°C 之後，<strong>火力底線絕對是 60%</strong>。低於 60% 將引發失溫 (Baked) 悲劇！</p>
            </div>
        </div>

        <!-- Day 1 SOP -->
        <div id="tab-day1" class="tab-pane">
            <h2 class="text-xl font-bold text-blue-400 mb-4 border-b border-gray-700 pb-2">
                <i class="fa-solid fa-water mr-2"></i> Day 1：水洗高硬度
            </h2>

            <div class="text-sm text-gray-400 mb-4 px-1">
                <strong>基礎參數：</strong> 170g 滿載 | 參考「肯亞AA」日誌邏輯。
            </div>

            <!-- 豆1: 藝伎水洗 -->
            <div class="card">
                <div class="flex justify-between items-center mb-3">
                    <h3 class="font-bold text-blue-300 text-lg">1. 古吉 藝伎 G1</h3>
                    <span class="text-xs bg-gray-700 px-2 py-1 rounded">水洗</span>
                </div>
                <div class="param-row">
                    <div><div class="font-bold">入豆 (冷/熱機)</div><div class="text-xs text-gray-400">高溫破風</div></div>
                    <div><span class="badge-temp">200-205°C</span> <span class="badge-fire">80%</span></div>
                </div>
                <div class="param-row">
                    <div><div class="font-bold">轉黃 (約160°C)</div><div class="text-xs text-gray-400">提防飆溫</div></div>
                    <div><span class="badge-fire bg-yellow-600">降 70%</span></div>
                </div>
                <div class="param-row">
                    <div><div class="font-bold">梅納中段 (190°C)</div><div class="text-xs text-gray-400">守住底線</div></div>
                    <div><span class="badge-fire badge-alert">守 60%</span></div>
                </div>
                <div class="param-row">
                    <div><div class="font-bold text-green-400">下豆 Drop</div><div class="text-xs text-gray-400">發展 50-60秒</div></div>
                    <div class="font-bold text-lg">216-218°C</div>
                </div>
            </div>

            <!-- 豆2: 蘇丹藝伎水洗 -->
            <div class="card">
                <div class="flex justify-between items-center mb-3">
                    <h3 class="font-bold text-blue-300 text-lg">2. 蘇丹藝伎 騎士</h3>
                    <span class="text-xs bg-gray-700 px-2 py-1 rounded">水洗 SHB</span>
                </div>
                <p class="text-xs text-gray-300 mb-3 bg-gray-700/50 p-2 rounded">
                    這支 SHB (極硬豆) 需要強大穿透力。與第一鍋打法幾乎相同，但因為是熱機狀態，轉黃速度會變快。
                </p>
                <div class="param-row">
                    <div><div class="font-bold">入豆 (熱機)</div></div>
                    <div><span class="badge-temp">205°C</span> <span class="badge-fire">75-80%</span></div>
                </div>
                <div class="param-row">
                    <div><div class="font-bold">轉黃 (約160°C)</div><div class="text-xs text-gray-400">需提早 10 秒降火</div></div>
                    <div><span class="badge-fire bg-yellow-600">降 70%</span></div>
                </div>
                <div class="param-row">
                    <div><div class="font-bold text-green-400">下豆 Drop</div><div class="text-xs text-gray-400">逼出星星茉莉花</div></div>
                    <div class="font-bold text-lg">217-219°C</div>
                </div>
            </div>
        </div>

        <!-- Day 2 SOP -->
        <div id="tab-day2" class="tab-pane">
            <h2 class="text-xl font-bold text-orange-400 mb-4 border-b border-gray-700 pb-2">
                <i class="fa-solid fa-sun mr-2"></i> Day 2：糖分與發酵
            </h2>

            <div class="text-sm text-gray-400 mb-4 px-1">
                <strong>基礎參數：</strong> 170g 滿載 | 參考「巴拿馬花魁」日誌邏輯。
            </div>

            <!-- 豆1: 蜜處理 -->
            <div class="card">
                <div class="flex justify-between items-center mb-3">
                    <h3 class="font-bold text-yellow-400 text-lg">1. 薇拉莎琪 蜜處理</h3>
                    <span class="text-xs bg-gray-700 px-2 py-1 rounded">蜜處理</span>
                </div>
                <p class="text-xs text-gray-300 mb-3 bg-gray-700/50 p-2 rounded">
                    蜜處理果膠多，低溫入豆防焦。保留酒香與蜂蜜感，發展期可稍長。
                </p>
                <div class="param-row">
                    <div><div class="font-bold">入豆 (冷機)</div></div>
                    <div><span class="badge-temp">190°C</span> <span class="badge-fire">75%</span></div>
                </div>
                <div class="param-row">
                    <div><div class="font-bold">轉黃 (160°C)</div></div>
                    <div><span class="badge-fire bg-yellow-600">降 65%</span></div>
                </div>
                <div class="param-row">
                    <div><div class="font-bold">梅納中段 (190°C)</div></div>
                    <div><span class="badge-fire badge-alert">守 60%</span></div>
                </div>
                <div class="param-row">
                    <div><div class="font-bold text-green-400">下豆 Drop</div><div class="text-xs text-gray-400">發展 60-70秒</div></div>
                    <div class="font-bold text-lg">215-217°C</div>
                </div>
            </div>

            <!-- 豆2: 布穀鳥日曬 -->
            <div class="card border-l-2 border-orange-500">
                <div class="flex justify-between items-center mb-2">
                    <h3 class="font-bold text-orange-300 text-lg">2. 布穀鳥 古優種</h3>
                    <span class="text-xs bg-gray-700 px-2 py-1 rounded">日曬</span>
                </div>
                <div class="flex text-xs text-gray-400 mb-2 space-x-4">
                    <span>入豆: <b class="text-blue-300">190°C</b></span>
                    <span>起火: <b class="text-red-400">70-75%</b> (熱機)</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span>轉黃: 降 65%</span>
                    <span class="text-yellow-500 font-bold">底線: 守 60%</span>
                    <span class="text-green-400">下豆: 218°C</span>
                </div>
            </div>

            <!-- 豆3: 木蘭花日曬 -->
            <div class="card border-l-2 border-orange-500">
                <div class="flex justify-between items-center mb-2">
                    <h3 class="font-bold text-orange-300 text-lg">3. 木蘭花 卡杜依</h3>
                    <span class="text-xs bg-gray-700 px-2 py-1 rounded">日曬</span>
                </div>
                <p class="text-xs text-gray-400 mb-2">
                    此時機器達到「熱飽和顛峰」。入豆後吸熱極快，需留意轉黃點會提早抵達。追求楓糖漿與莓果甜感。
                </p>
                <div class="flex text-xs text-gray-400 mb-2 space-x-4">
                    <span>入豆: <b class="text-blue-300">190°C</b></span>
                    <span>起火: <b class="text-red-400">70%</b> (極熱機降火)</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span>轉黃: 降 65%</span>
                    <span class="text-yellow-500 font-bold">底線: 守 60%</span>
                    <span class="text-green-400">下豆: 218-220°C</span>
                </div>
            </div>

        </div>

    </main>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav">
        <button class="nav-btn active" onclick="switchTab('strategy', this)">
            <i class="fa-solid fa-chess"></i>
            <span>戰略</span>
        </button>
        <button class="nav-btn" onclick="switchTab('day1', this)">
            <i class="fa-solid fa-water"></i>
            <span>Day 1 水洗</span>
        </button>
        <button class="nav-btn" onclick="switchTab('day2', this)">
            <i class="fa-solid fa-sun"></i>
            <span>Day 2 日/蜜</span>
        </button>
    </nav>

    <script>
        function switchTab(tabId, btnElement) {
            // Hide all tabs
            document.querySelectorAll('.tab-pane').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Remove active class from all buttons
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            // Show selected tab and activate button
            document.getElementById('tab-' + tabId).classList.add('active');
            btnElement.classList.add('active');
            
            // Scroll to top when switching
            window.scrollTo(0, 0);
        }
    </script>
</body>
</html>
```


## 🖼️ 相關參考圖片與文件
![[7003-61d8ccd4c565400d.png]] ![[7003-85cc318439819f68.png]] ![[9000-b0d0d952ab8ef43b.jpg]] ![[10093408293917864137-4c73aabdd108e0ae.png]] ![[800212608471928293-153057063c8c793c.png]] [[Roasting_Intermediate_ProfileLog_-37207be7c8cf4ed8.pdf]] (附件檔案) ![[16009922497231620712-d01b1744e5213582.png]] ![[16010747200615915129-2c475562cbf29816.png]] ![[16057140004588957782-013a416dbc8e89ed.jpg]] ![[2189dc4f-4ef1-4e97-85c6-f82cb1006-eeb045030994d3db.jpg]] ![[Gemini_Generated_Image_8ggri88ggr-44a8442c4e958641.jpg]] ![[Gemini_Generated_Image_htsu2ahtsu-e11f6500ada5b266.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-96a4cef5cc1008b1.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-be202b15b4d41e70.jpg]] ![[Gemini_Generated_Image_q59snqq59s-d7376f45389320a6.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-153057063c8c793c.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-758609cfa28db9a7.jpg]]

## 🔬 科學物理觀點解析
- *此理論卡片由 Gemini Takeout 匯出對話分析自動生成。*

## 🔗 相關理論與對話推薦
- [[2026-05-08_Tank-200_雙日戰役面板_264]] (共用特徵: `藝伎, 肯亞, 巴拿馬`)
- [[2026-03-26_如果只能用Tank200烘，還是建議只烘紫風鈴和寶貝藝妓嗎？_804]] (共用特徵: `藝伎, 肯亞, 巴拿馬`)
- [[2026-05-08_附上之前成功在Tank200上的烘豆紀錄，我還有幾支生豆要請你幫我評估哪些較適合在Tank200烘，可以和水洗藝伎及日曬_265]] (共用特徵: `藝伎, 肯亞, 巴拿馬`)
- [[2026-03-26_請同步更新以下兩支之前的火力建議配置_沒問題！這正是我們講師在做_SCA_烘焙認證考試時，要求學員必須具備的「機器適應力_799]] (共用特徵: `肯亞, 巴拿馬, 蜜處理`)
- [[2026-03-26_請根據在tank200上火力小於50%會造成溫度停滯無法達到一爆溫度進行下面的修正，一爆約210度，機器無法控制風門大小_797]] (共用特徵: `肯亞, 巴拿馬, 蜜處理`)
