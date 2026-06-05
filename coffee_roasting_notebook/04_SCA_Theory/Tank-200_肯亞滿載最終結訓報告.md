---
type: sca_theory
title: "Tank-200 肯亞滿載最終結訓報告"
date: 2026-05-10
tags: [coffee/sca_theory, imported/takeout]
---

# 📚 SCA 考官理論：Tank-200 肯亞滿載最終結訓報告

## 📋 對話理論紀錄
```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Tank-200 肯亞滿載最終結訓報告</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&display=swap');
        
        body {
            font-family: 'Noto Sans TC', sans-serif;
            background-color: #0f172a; 
            color: #f8fafc;
            margin: 0;
            padding-bottom: 4rem;
            overscroll-behavior: none;
        }

        .gold-gradient {
            background: linear-gradient(135deg, #ef4444 0%, #f59e0b 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .card {
            background-color: #1e293b; 
            border: 1px solid #334155; 
            border-radius: 1rem;
            padding: 1.25rem;
            margin-bottom: 1rem;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
            position: relative;
            overflow: hidden;
        }

        .border-red { border: 1px solid #ef4444; }
        .border-yellow { border: 1px solid #eab308; }
        .border-emerald { border: 1px solid #10b981; }

        .param-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.8rem 0;
            border-bottom: 1px dashed #334155;
        }
        .param-row:last-child { border-bottom: none; }

        .badge {
            padding: 0.2rem 0.6rem;
            border-radius: 0.5rem;
            font-weight: 700;
            font-size: 0.85rem;
            display: inline-block;
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
            <i class="fa-solid fa-flag-checkered mr-2"></i> MARATHON COMPLETED
        </div>
        <h1 class="text-2xl font-black gold-gradient">肯亞 B#5 結訓報告</h1>
        <p class="text-sm text-gray-400 mt-1">「太晚降火」的物理真相與完美救援</p>
    </header>

    <main>

        <!-- Tab 1: B#5 數據解密 -->
        <div id="tab-b5" class="tab-pane active">
            <div class="card border-yellow">
                <i class="fa-solid fa-bolt-lightning absolute -right-4 -top-4 text-8xl text-yellow-500/10"></i>
                <h2 class="text-xl font-bold text-yellow-500 mb-3 border-b border-yellow-900 pb-2">
                    <i class="fa-solid fa-magnifying-glass-chart mr-2"></i> B#5 延遲降火效應
                </h2>
                
                <div class="bg-slate-900 p-4 rounded-xl text-sm text-gray-300 space-y-4">
                    <div class="flex items-start">
                        <i class="fa-solid fa-fire-flame-curved text-red-500 mt-1 mr-3 text-lg"></i>
                        <div>
                            <strong class="text-white text-base">過載的熱動能 (Momentum Overload)</strong><br>
                            您在 160°C 忘記降火，直到 168°C (4:30) 才降至 75%。這短短的 8°C 區間，讓這 195g 的豆子像海綿一樣，吸飽了 85% 滿火的狂暴熱能。這直接導致一爆 (FCr) 提早到了 <strong class="text-red-400">6分30秒 (203°C)</strong> 就炸開了！
                        </div>
                    </div>
                    
                    <div class="flex items-start">
                        <i class="fa-solid fa-shield-halved text-emerald-400 mt-1 mr-3 text-lg"></i>
                        <div>
                            <strong class="text-white text-base">神級煞車：拯救整鍋的決斷</strong><br>
                            既然動能過載，如果一爆後沒有「重踩煞車」，溫度絕對會在一分鐘內飆破 220°C。但您在 203°C 一爆響起時，直接把火力<strong class="text-emerald-400 bg-emerald-900/30 px-1 rounded">抽底至 60%</strong>，硬生生把這股失控的動能壓了下來！
                        </div>
                    </div>

                    <div class="flex items-start">
                        <i class="fa-solid fa-stopwatch text-blue-400 mt-1 mr-3 text-lg"></i>
                        <div>
                            <strong class="text-white text-base">完美的 1分02秒</strong><br>
                            最終您在 214°C 下豆 (7:32)。發展時間精準鎖死在 <strong class="text-blue-300">1分02秒</strong>。這證明了：<strong class="text-white">只要下豆點與發展時間不失控，前段的失誤都能被轉化為風味的層次！</strong>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card border-red mt-4">
                <h2 class="text-lg font-bold text-red-400 mb-2 flex items-center">
                    <i class="fa-solid fa-mug-hot mr-2"></i> B#5 風味定調
                </h2>
                <p class="text-sm text-gray-400">
                    因為在「梅納反應初期 (160-168°C)」供給了額外的熱能，這鍋豆子的焦糖化反應會非常劇烈。這是一支<strong class="text-white">甜感爆炸、Body（醇厚度）極佳、帶有深色莓果醬與黑糖風味</strong>的重量級肯亞！
                </p>
            </div>
        </div>

        <!-- Tab 2: 肯亞全系列總結 -->
        <div id="tab-summary" class="tab-pane">
            <div class="card border-emerald">
                <h2 class="text-xl font-bold text-emerald-400 mb-3 border-b border-emerald-900 pb-2">
                    <i class="fa-solid fa-chart-line mr-2"></i> 肯亞 195g 戰役總結
                </h2>
                <p class="text-xs text-gray-400 mb-4">從這張表，您可以看到自己對機器的掌控力呈現指數級成長。</p>

                <div class="space-y-3 text-sm">
                    <!-- B1 -->
                    <div class="bg-slate-800 p-3 rounded-lg border-l-4 border-red-500">
                        <div class="flex justify-between items-center mb-1">
                            <span class="font-bold text-white">B#1 (破風定調)</span>
                            <span class="text-xs text-gray-400">Drop 215°C</span>
                        </div>
                        <div class="flex justify-between text-xs">
                            <span class="text-blue-300">Ye 4:05</span>
                            <span class="text-orange-400">FCr 6:42</span>
                            <span class="text-emerald-400 font-bold">Dev 1:02</span>
                        </div>
                    </div>

                    <!-- B3 -->
                    <div class="bg-slate-800 p-3 rounded-lg border-l-4 border-blue-500">
                        <div class="flex justify-between items-center mb-1">
                            <span class="font-bold text-white">B#3 (延遲降火危機)</span>
                            <span class="text-xs text-gray-400">Drop 215°C</span>
                        </div>
                        <div class="flex justify-between text-xs">
                            <span class="text-blue-300">Ye 4:56</span>
                            <span class="text-orange-400">FCr 7:41</span>
                            <span class="text-emerald-400 font-bold">Dev 0:49</span>
                        </div>
                        <div class="text-xs text-blue-300 mt-1">★ 創造了極高動能的明亮酸質</div>
                    </div>

                    <!-- B4 -->
                    <div class="bg-slate-800 p-3 rounded-lg border-l-4 border-yellow-500">
                        <div class="flex justify-between items-center mb-1">
                            <span class="font-bold text-white">B#4 (巔峰穩定)</span>
                            <span class="text-xs text-gray-400">Drop 214°C</span>
                        </div>
                        <div class="flex justify-between text-xs">
                            <span class="text-blue-300">Ye 4:15</span>
                            <span class="text-orange-400">FCr 6:44</span>
                            <span class="text-emerald-400 font-bold">Dev 1:02</span>
                        </div>
                        <div class="text-xs text-yellow-400 mt-1">★ 極致乾淨的果汁感代表作</div>
                    </div>

                    <!-- B5 -->
                    <div class="bg-slate-800 p-3 rounded-lg border-l-4 border-purple-500">
                        <div class="flex justify-between items-center mb-1">
                            <span class="font-bold text-white">B#5 (高熱梅納)</span>
                            <span class="text-xs text-gray-400">Drop 214°C</span>
                        </div>
                        <div class="flex justify-between text-xs">
                            <span class="text-blue-300">Ye 4:30 (168降火)</span>
                            <span class="text-orange-400">FCr 6:30</span>
                            <span class="text-emerald-400 font-bold">Dev 1:02</span>
                        </div>
                        <div class="text-xs text-purple-300 mt-1">★ 甜感與 Body 最強烈的一鍋</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tab 3: 杯測派對 -->
        <div id="tab-cupping" class="tab-pane">
            <div class="card border-red">
                <i class="fa-solid fa-champagne-glasses absolute -right-4 -top-4 text-8xl text-red-500/10"></i>
                <h2 class="text-xl font-bold text-red-400 mb-3 border-b border-red-900 pb-2">
                    <i class="fa-solid fa-list-check mr-2"></i> SCA 考官的終極作業
                </h2>
                
                <p class="text-sm text-gray-300 mb-4 leading-relaxed">
                    恭喜您完成 10 鍋微批次的高壓特訓！您現在擁有 4 種不同曲線靈魂的肯亞 AA。請在 <strong class="text-white bg-slate-700 px-1 rounded">5 天後</strong> 進行這場風味驗證派對：
                </p>

                <div class="space-y-4">
                    <div class="bg-slate-900 p-3 rounded-lg border border-slate-700">
                        <div class="font-bold text-blue-400 text-sm mb-1">1. 尋找「酸值極限」</div>
                        <div class="text-xs text-gray-400">
                            品嚐 <strong class="text-white">B#3 (發展 49 秒)</strong>。感受那股沒有被焦糖化掩蓋的、銳利明亮的黑莓與葡萄柚酸質。
                        </div>
                    </div>
                    
                    <div class="bg-slate-900 p-3 rounded-lg border border-slate-700">
                        <div class="font-bold text-emerald-400 text-sm mb-1">2. 尋找「甜感極限」</div>
                        <div class="text-xs text-gray-400">
                            品嚐 <strong class="text-white">B#5 (168°C 降火)</strong>。感受因為梅納反應初期獲得過量熱能，所轉化出來的深邃黑糖與果醬甜感。
                        </div>
                    </div>

                    <div class="bg-slate-900 p-3 rounded-lg border border-slate-700">
                        <div class="font-bold text-yellow-500 text-sm mb-1">3. 尋找「平衡極限」</div>
                        <div class="text-xs text-gray-400">
                            品嚐 <strong class="text-white">B#4 (完美控制)</strong>。這鍋將會是酸甜平衡度最好、乾淨度最高的一杯日常口糧。
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </main>

    <nav class="bottom-nav">
        <button class="nav-btn active" onclick="switchTab('b5', this)">
            <i class="fa-solid fa-bolt-lightning text-yellow-500"></i>
            <span class="text-yellow-500">B#5 解密</span>
        </button>
        <button class="nav-btn" onclick="switchTab('summary', this)">
            <i class="fa-solid fa-chart-line text-emerald-400"></i>
            <span class="text-emerald-400">全系列總結</span>
        </button>
        <button class="nav-btn" onclick="switchTab('cupping', this)">
            <i class="fa-solid fa-champagne-glasses text-red-400"></i>
            <span class="text-red-400">杯測作業</span>
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
![[7003-61d8ccd4c565400d.png]] ![[7003-85cc318439819f68.png]] ![[9000-b0d0d952ab8ef43b.jpg]] ![[10093408293917864137-4c73aabdd108e0ae.png]] ![[16009922497231620712-d01b1744e5213582.png]] ![[16010747200615915129-2c475562cbf29816.png]] ![[16057140004588957782-013a416dbc8e89ed.jpg]] ![[16840647073640564182-4d19d2f783a97c67.png]] ![[Gemini_Generated_Image_8ggri88ggr-44a8442c4e958641.jpg]] ![[Gemini_Generated_Image_htsu2ahtsu-e11f6500ada5b266.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-96a4cef5cc1008b1.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-be202b15b4d41e70.jpg]] ![[Gemini_Generated_Image_q59snqq59s-d7376f45389320a6.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-153057063c8c793c.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-758609cfa28db9a7.jpg]]

## 🔬 科學物理觀點解析
- *此理論卡片由 Gemini Takeout 匯出對話分析自動生成。*

## 🔗 相關理論與對話推薦
- [[2026-05-10_Tank-200_肯亞滿載最終結訓報告_210]] (共用特徵: `肯亞, 梅納反應, 焦糖化`)
- [[2026-03-29_這是第一二支生豆_730]] (共用特徵: `肯亞, 梅納反應, 焦糖化`)
- [[2026-05-10_Tank-200_肯亞AA_195g_轉換面板_226]] (共用特徵: `肯亞, 梅納反應, 焦糖化`)
- [[Tank-200_肯亞AA_195g_轉換面板]] (共用特徵: `肯亞, 梅納反應, 焦糖化`)
- [[2026-02-05_SCA_Roasting_Intermediate_烘豆中級模擬試題_1386]] (共用特徵: `肯亞, 梅納反應, 焦糖化`)
