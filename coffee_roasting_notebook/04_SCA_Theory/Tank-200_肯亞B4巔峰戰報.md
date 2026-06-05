---
type: sca_theory
title: "Tank-200 肯亞B4巔峰戰報"
date: 2026-05-10
tags: [coffee/sca_theory, imported/takeout]
---

# 📚 SCA 考官理論：Tank-200 肯亞B4巔峰戰報

## 📋 對話理論紀錄
```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Tank-200 肯亞 B4 巔峰戰報</title>
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
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
            position: relative;
            overflow: hidden;
        }

        .border-red { border: 1px solid #ef4444; }
        .border-emerald { border: 1px solid #10b981; }
        .border-blue { border: 1px solid #3b82f6; }

        .param-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.8rem 0;
            border-bottom: 1px dashed #475569;
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
            <i class="fa-solid fa-fire-flame-curved mr-2 animate-pulse"></i> THERMAL DOMINATION
        </div>
        <h1 class="text-2xl font-black gold-gradient">B#4 巔峰戰報</h1>
        <p class="text-sm text-gray-400 mt-1">無視熱暴衝，完美鎖死發展期</p>
    </header>

    <main>

        <!-- Tab 1: 數據解密 -->
        <div id="tab-data" class="tab-pane active">
            <div class="card border-red">
                <i class="fa-solid fa-meteor absolute -right-4 -top-4 text-8xl text-red-500/10"></i>
                <h2 class="text-lg font-bold text-red-400 mb-4 flex items-center border-b border-red-900 pb-2">
                    <i class="fa-solid fa-magnifying-glass-chart mr-2"></i> 狂暴的前段與冷靜的後段
                </h2>
                
                <div class="bg-slate-900 p-3 rounded-lg text-sm text-gray-300 space-y-4">
                    <div class="flex items-start">
                        <i class="fa-solid fa-temperature-arrow-up text-red-500 mt-1 mr-3 text-lg"></i>
                        <div>
                            <strong class="text-white text-base">狂暴的前段 (Tp 94°C / Ye 4:15)</strong><br>
                            您看到了嗎？即使入豆溫沒變，Tp 竟然飆高到了 <strong class="text-red-400">94°C</strong>！轉黃點也被硬生生推快到 <strong class="text-red-400">4分15秒</strong>。這代表此時的 Tank-200 就像一座蓄滿岩漿的火山，熱能無比強大。
                        </div>
                    </div>
                    
                    <div class="flex items-start">
                        <i class="fa-solid fa-anchor text-blue-400 mt-1 mr-3 text-lg"></i>
                        <div>
                            <strong class="text-white text-base">冷靜的後段 (Dev 1:02 / +11°C)</strong><br>
                            最讓我驚豔的在這裡！即使前面衝得這麼快，您完全沒有慌亂。您精準地在 <strong class="text-blue-300">203°C</strong> 捕捉到一爆的瞬間並降火 60%。最終將發展時間完美鎖死在 <strong class="text-emerald-400 font-bold text-lg">1分02秒</strong>，在 214°C 下豆。
                        </div>
                    </div>
                </div>
            </div>

            <div class="card border-blue mt-4">
                <h2 class="text-lg font-bold text-blue-400 mb-3 flex items-center">
                    <i class="fa-solid fa-droplet mr-2"></i> 考官風味定調
                </h2>
                <p class="text-sm text-gray-300">
                    <strong class="text-white">高動能脫水 + 完美發展期 = 極致乾淨的果汁感！</strong><br>
                    這鍋豆子的酸質會比前兩鍋更為明亮且具有穿透力，但因為您成功鎖住了 1 分鐘的發展，甜感完全沒有流失。這絕對是比賽等級的烘焙作品！
                </p>
            </div>
        </div>

        <!-- Tab 2: 豆相評估 -->
        <div id="tab-visual" class="tab-pane">
            <div class="card border-emerald">
                <i class="fa-solid fa-eye absolute -right-4 -top-4 text-8xl text-emerald-500/10"></i>
                <h2 class="text-xl font-bold text-emerald-400 mb-3 border-b border-emerald-900 pb-2">
                    <i class="fa-solid fa-microscope mr-2"></i> 熟豆視覺評析
                </h2>
                
                <ul class="text-sm text-gray-300 space-y-3">
                    <li class="flex items-center bg-slate-900 p-2 rounded">
                        <i class="fa-solid fa-check-circle text-emerald-500 mr-3 text-lg"></i>
                        <span><strong class="text-white">零燙傷 (Zero Tipping):</strong> 前段 94°C 的高 Tp 完全沒有在豆表留下焦斑。</span>
                    </li>
                    <li class="flex items-center bg-slate-900 p-2 rounded">
                        <i class="fa-solid fa-check-circle text-emerald-500 mr-3 text-lg"></i>
                        <span><strong class="text-white">中線極淨 (Clean Center Cut):</strong> 銀皮排得非常乾淨，沒有煙燻回燒的跡象。</span>
                    </li>
                    <li class="flex items-center bg-slate-900 p-2 rounded">
                        <i class="fa-solid fa-check-circle text-emerald-500 mr-3 text-lg"></i>
                        <span><strong class="text-white">膨脹飽滿 (Excellent Expansion):</strong> 豆體撐得非常開，這是 11°C 溫升與 1分鐘 發展完美搭配的物理證明。</span>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Tab 3: B#5 最終指令 -->
        <div id="tab-final" class="tab-pane">
            <div class="card border-red">
                <h2 class="text-xl font-bold text-red-500 mb-3 border-b border-red-900 pb-2">
                    <i class="fa-solid fa-flag-checkered mr-2"></i> B#5 最終收官戰
                </h2>
                <div class="bg-red-900/20 p-3 rounded-lg mb-4 text-sm text-red-200">
                    機器現在的熱能已經到達無法再高的極限。最後一鍋，閉上眼睛，相信您的肌肉記憶！
                </div>
                
                <div class="space-y-4">
                    <div class="param-row">
                        <div>
                            <div class="font-bold text-white">1. 入豆與起火</div>
                        </div>
                        <div class="text-right">
                            <span class="badge bg-temp">200°C</span>
                            <span class="badge bg-fire ml-1">85%</span>
                        </div>
                    </div>
                    
                    <div class="param-row bg-slate-900/80 -mx-5 px-5 border-y border-slate-700">
                        <div>
                            <div class="font-bold text-orange-400">2. 無視轉黃點變化</div>
                            <div class="text-xs text-gray-400 mt-1">就算它 4:10 轉黃也不要慌！</div>
                        </div>
                        <div class="text-right">
                            <span class="badge" style="background:#ea580c; color:white;">順順降 75%</span>
                        </div>
                    </div>

                    <div class="param-row bg-slate-900/80 -mx-5 px-5 border-b border-red-900/50 pb-3">
                        <div>
                            <div class="font-bold text-red-400">3. 195°C 拔抽屜 + 預備</div>
                            <div class="text-xs text-red-300 font-bold mt-1">★ 手指放上火力旋鈕</div>
                        </div>
                        <div class="text-right mt-2">
                            <span class="text-sm font-bold text-white">代償 80% 迎擊一爆</span>
                        </div>
                    </div>

                    <div class="param-row border-none pt-2">
                        <div>
                            <div class="font-bold text-emerald-400">4. 完美複製的收尾</div>
                        </div>
                        <div class="text-right">
                            <span class="text-xs text-gray-400">爆裂降 60% <i class="fa-solid fa-arrow-right mx-1"></i></span>
                            <span class="badge bg-emerald-600">214°C Drop!</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </main>

    <nav class="bottom-nav">
        <button class="nav-btn active" onclick="switchTab('data', this)">
            <i class="fa-solid fa-chart-line text-red-400"></i>
            <span class="text-red-400">巔峰數據</span>
        </button>
        <button class="nav-btn" onclick="switchTab('visual', this)">
            <i class="fa-solid fa-eye text-emerald-400"></i>
            <span class="text-emerald-400">豆相評估</span>
        </button>
        <button class="nav-btn" onclick="switchTab('final', this)">
            <i class="fa-solid fa-flag-checkered text-yellow-500"></i>
            <span class="text-yellow-500">最後一戰</span>
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
![[7003-61d8ccd4c565400d.png]] ![[7003-85cc318439819f68.png]] ![[9000-b0d0d952ab8ef43b.jpg]] ![[10093408293917864137-4c73aabdd108e0ae.png]] ![[Gemini_Generated_Image_8ggri88ggr-44a8442c4e958641.jpg]] ![[Gemini_Generated_Image_htsu2ahtsu-e11f6500ada5b266.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-96a4cef5cc1008b1.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-be202b15b4d41e70.jpg]] ![[Gemini_Generated_Image_q59snqq59s-d7376f45389320a6.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-153057063c8c793c.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-758609cfa28db9a7.jpg]]

## 🔬 科學物理觀點解析
- *此理論卡片由 Gemini Takeout 匯出對話分析自動生成。*

## 🔗 相關理論與對話推薦
- [[2026-03-29_這是第一二支生豆_730]] (共用特徵: `肯亞, tp, 一爆`)
- [[2026-05-10_Tank-200_肯亞B4巔峰戰報_212]] (共用特徵: `肯亞, tp, 一爆`)
- [[2026-05-10_Tank-200_肯亞B_3危機解除與收官_216]] (共用特徵: `肯亞, tp, 一爆`)
- [[Tank-200_肯亞B_3危機解除與收官]] (共用特徵: `肯亞, tp, 一爆`)
- [[2026-03-26_Tank_200_專屬校正與直火實戰_812]] (共用特徵: `肯亞, tp, 一爆`)
