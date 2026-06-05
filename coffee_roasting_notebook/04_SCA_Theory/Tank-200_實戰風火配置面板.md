---
type: sca_theory
title: "Tank-200 實戰風火配置面板"
date: 2026-05-03
tags: [coffee/sca_theory, imported/takeout]
---

# 📚 SCA 考官理論：Tank-200 實戰風火配置面板

## 📋 對話理論紀錄
```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Tank-200 實戰風火配置面板</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&display=swap');
        
        body {
            font-family: 'Noto Sans TC', sans-serif;
            background-color: #0f172a; /* Slate 900 */
            color: #f8fafc;
            margin: 0;
            overflow-x: hidden;
            overscroll-behavior: none;
        }

        .gradient-text {
            background: linear-gradient(to right, #fbbf24, #f59e0b);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .card {
            background-color: #1e293b; /* Slate 800 */
            border: 1px solid #334155;
            border-radius: 1rem;
            padding: 1.25rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .data-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 0;
            border-bottom: 1px solid #334155;
        }
        .data-row:last-child {
            border-bottom: none;
        }

        .fire-badge {
            background-color: #ef4444;
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-weight: bold;
            font-size: 0.875rem;
        }

        .temp-badge {
            background-color: #3b82f6;
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-weight: bold;
            font-size: 0.875rem;
        }

        .tab-content {
            display: none;
            animation: fadeIn 0.3s ease-in-out;
        }
        .tab-content.active {
            display: block;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* 導覽列固定在底部 */
        .bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: #0f172a;
            border-top: 1px solid #334155;
            display: flex;
            justify-content: space-around;
            padding: 0.75rem;
            padding-bottom: env(safe-area-inset-bottom, 1rem); /* 支援 iOS 安全區域 */
            z-index: 50;
        }

        .nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #64748b;
            font-size: 0.75rem;
            transition: color 0.2s;
        }
        .nav-item.active {
            color: #fbbf24;
        }
        .nav-item i {
            font-size: 1.25rem;
            margin-bottom: 0.25rem;
        }
    </style>
</head>
<body class="pb-24">

    <!-- Header -->
    <header class="pt-8 pb-6 px-6 bg-[#1e293b] rounded-b-3xl shadow-lg border-b border-[#334155] sticky top-0 z-40">
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-sm text-gray-400 font-bold tracking-widest uppercase mb-1">SCA Professional</h2>
                <h1 class="text-2xl font-black gradient-text">Tank-200 戰術面板</h1>
            </div>
            <div class="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center border border-yellow-500/30">
                <i class="fa-solid fa-fire-flame-curved text-yellow-500 text-xl"></i>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="p-6">

        <!-- Tab 1: 烘豆順序與戰略 (Strategy) -->
        <div id="tab-strategy" class="tab-content active space-y-6">
            <div class="card border-l-4 border-l-blue-500 relative overflow-hidden">
                <i class="fa-solid fa-1 absolute -right-4 -bottom-4 text-8xl text-blue-500/10"></i>
                <h3 class="text-xl font-bold mb-2 flex items-center"><i class="fa-solid fa-droplet text-blue-400 mr-2"></i>上半場：水洗藝伎 (鍋次 1~5)</h3>
                <p class="text-sm text-gray-300 mb-4 leading-relaxed">
                    <strong>戰略定位：</strong> 融合「肯亞硬豆」的穿透力與「花魁」的極淺焙收尾。<br>
                    <strong>原因：</strong> 確保鍋爐乾淨無銀皮味，冷機到熱機的過程，剛好用來測試 852g/L 高密度豆子需要的入豆熱能。
                </p>
                <div class="bg-slate-900 rounded p-3 text-sm border border-slate-700">
                    <span class="text-red-400 font-bold">防雷重點：</span> 密度雖高，但尾段發展極快。一爆後嚴格遵守「60%火力死亡線」，發展 50 秒內果斷下豆。
                </div>
            </div>

            <div class="card border-l-4 border-l-orange-500 relative overflow-hidden">
                <i class="fa-solid fa-2 absolute -right-4 -bottom-4 text-8xl text-orange-500/10"></i>
                <h3 class="text-xl font-bold mb-2 flex items-center"><i class="fa-solid fa-sun text-orange-400 mr-2"></i>下半場：日曬布穀鳥 (鍋次 6~10)</h3>
                <p class="text-sm text-gray-300 mb-4 leading-relaxed">
                    <strong>戰略定位：</strong> 完美套用「花魁 SOP」，利用熱飽和效應溫和逼出甜感。<br>
                    <strong>原因：</strong> 此時機器已達「極熱機」狀態（鑄鐵吃滿熱能），最適合日曬豆溫柔入豆，防表面焦斑。
                </p>
                <div class="bg-slate-900 rounded p-3 text-sm border border-slate-700">
                    <span class="text-red-400 font-bold">防雷重點：</span> 機器蓄熱極強，起步火力比水洗少 5-10%。尾段依舊守住 60% 底線對抗環境降溫。
                </div>
            </div>
        </div>

        <!-- Tab 2: 水洗藝伎 SOP -->
        <div id="tab-washed" class="tab-content space-y-4">
            <h2 class="text-xl font-bold text-blue-400 flex items-center mb-4">
                <i class="fa-solid fa-fire text-white mr-2"></i> 水洗藝伎 SOP (170g)
            </h2>
            
            <div class="card p-0 overflow-hidden">
                <div class="bg-blue-900/40 p-3 border-b border-slate-700 flex justify-between items-center">
                    <span class="font-bold text-blue-300">階段指標</span>
                    <span class="text-xs bg-slate-800 px-2 py-1 rounded text-gray-300">參考肯亞與花魁紀錄</span>
                </div>
                
                <div class="px-4">
                    <div class="data-row">
                        <div>
                            <div class="font-bold">入豆 (Charge)</div>
                            <div class="text-xs text-gray-400 mt-1">冷機第一鍋火力 +5%</div>
                        </div>
                        <div class="text-right">
                            <span class="temp-badge bg-slate-700">200°C</span>
                            <span class="fire-badge ml-2">80% 火</span>
                        </div>
                    </div>
                    
                    <div class="data-row">
                        <div>
                            <div class="font-bold text-yellow-500">轉黃點 (Ye)</div>
                            <div class="text-xs text-gray-400 mt-1">約 4:45 - 5:00 抵達</div>
                        </div>
                        <div class="text-right">
                            <span class="temp-badge bg-slate-700">160°C</span>
                            <span class="fire-badge ml-2">降 70%</span>
                        </div>
                    </div>

                    <div class="data-row">
                        <div>
                            <div class="font-bold text-orange-400">梅納中段</div>
                            <div class="text-xs text-gray-400 mt-1">絕對死亡線警戒區</div>
                        </div>
                        <div class="text-right">
                            <span class="temp-badge bg-slate-700">190°C</span>
                            <span class="fire-badge ml-2 border-2 border-red-500 bg-red-600">降 60% 守住</span>
                        </div>
                    </div>

                    <div class="data-row">
                        <div>
                            <div class="font-bold text-red-400">一爆 (FCr)</div>
                            <div class="text-xs text-gray-400 mt-1">維持底火，預防失速</div>
                        </div>
                        <div class="text-right">
                            <span class="temp-badge bg-slate-700">208°C</span>
                            <span class="fire-badge ml-2 bg-slate-600">持平 60%</span>
                        </div>
                    </div>

                    <div class="data-row border-none">
                        <div>
                            <div class="font-bold text-green-400">下豆 (Drop)</div>
                            <div class="text-xs text-gray-400 mt-1">極淺焙，發展 50-60秒</div>
                        </div>
                        <div class="text-right">
                            <span class="temp-badge bg-green-600">216-218°C</span>
                            <span class="text-sm font-bold text-gray-300 ml-2">出爐冷卻</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tab 3: 日曬古優 SOP -->
        <div id="tab-natural" class="tab-content space-y-4">
            <h2 class="text-xl font-bold text-orange-400 flex items-center mb-4">
                <i class="fa-solid fa-fire text-white mr-2"></i> 日曬布穀鳥 SOP (170g)
            </h2>
            
            <div class="card p-0 overflow-hidden">
                <div class="bg-orange-900/30 p-3 border-b border-slate-700 flex justify-between items-center">
                    <span class="font-bold text-orange-300">階段指標</span>
                    <span class="text-xs bg-slate-800 px-2 py-1 rounded text-gray-300">機器熱飽和狀態適用</span>
                </div>
                
                <div class="px-4">
                    <div class="data-row">
                        <div>
                            <div class="font-bold">入豆 (Charge)</div>
                            <div class="text-xs text-gray-400 mt-1">低溫入豆，防表面焦斑</div>
                        </div>
                        <div class="text-right">
                            <span class="temp-badge bg-slate-700">190°C</span>
                            <span class="fire-badge ml-2">70-75% 火</span>
                        </div>
                    </div>
                    
                    <div class="data-row">
                        <div>
                            <div class="font-bold text-yellow-500">轉黃點 (Ye)</div>
                            <div class="text-xs text-gray-400 mt-1">此時熱蓄積強烈</div>
                        </div>
                        <div class="text-right">
                            <span class="temp-badge bg-slate-700">160°C</span>
                            <span class="fire-badge ml-2">降 65%</span>
                        </div>
                    </div>

                    <div class="data-row">
                        <div>
                            <div class="font-bold text-orange-400">梅納中段</div>
                            <div class="text-xs text-gray-400 mt-1">強化熱帶水果甜感</div>
                        </div>
                        <div class="text-right">
                            <span class="temp-badge bg-slate-700">190°C</span>
                            <span class="fire-badge ml-2 border-2 border-red-500 bg-red-600">降 60% 守住</span>
                        </div>
                    </div>

                    <div class="data-row">
                        <div>
                            <div class="font-bold text-red-400">一爆 (FCr)</div>
                            <div class="text-xs text-gray-400 mt-1">若有風門可略開排煙</div>
                        </div>
                        <div class="text-right">
                            <span class="temp-badge bg-slate-700">208°C</span>
                            <span class="fire-badge ml-2 bg-slate-600">持平 60%</span>
                        </div>
                    </div>

                    <div class="data-row border-none">
                        <div>
                            <div class="font-bold text-green-400">下豆 (Drop)</div>
                            <div class="text-xs text-gray-400 mt-1">淺焙，發展 60-70秒</div>
                        </div>
                        <div class="text-right">
                            <span class="temp-badge bg-green-600">218-220°C</span>
                            <span class="text-sm font-bold text-gray-300 ml-2">出爐冷卻</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </main>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav">
        <button class="nav-item active" onclick="switchTab('strategy', this)">
            <i class="fa-solid fa-route"></i>
            <span>烘豆戰略</span>
        </button>
        <button class="nav-item" onclick="switchTab('washed', this)">
            <i class="fa-solid fa-droplet text-blue-400"></i>
            <span class="text-blue-400">水洗藝伎</span>
        </button>
        <button class="nav-item" onclick="switchTab('natural', this)">
            <i class="fa-solid fa-sun text-orange-400"></i>
            <span class="text-orange-400">日曬古優</span>
        </button>
    </nav>

    <script>
        function switchTab(tabId, element) {
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Remove active class from all nav items
            document.querySelectorAll('.nav-item').forEach(nav => {
                nav.classList.remove('active');
            });

            // Show selected tab
            document.getElementById('tab-' + tabId).classList.add('active');
            
            // Add active class to clicked nav item
            element.classList.add('active');
        }
    </script>
</body>
</html>
```


## 🖼️ 相關參考圖片與文件
![[7003-61d8ccd4c565400d.png]] ![[7003-85cc318439819f68.png]] ![[9000-b0d0d952ab8ef43b.jpg]] ![[800212608471928293-153057063c8c793c.png]] ![[16009922497231620712-d01b1744e5213582.png]] ![[16010747200615915129-2c475562cbf29816.png]] ![[16057140004588957782-013a416dbc8e89ed.jpg]] ![[2189dc4f-4ef1-4e97-85c6-f82cb1006-eeb045030994d3db.jpg]] ![[Gemini_Generated_Image_8ggri88ggr-44a8442c4e958641.jpg]] ![[Gemini_Generated_Image_htsu2ahtsu-e11f6500ada5b266.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-96a4cef5cc1008b1.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-be202b15b4d41e70.jpg]] ![[Gemini_Generated_Image_q59snqq59s-d7376f45389320a6.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-153057063c8c793c.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-758609cfa28db9a7.jpg]]

## 🔬 科學物理觀點解析
- *此理論卡片由 Gemini Takeout 匯出對話分析自動生成。*

## 🔗 相關理論與對話推薦
- [[2026-05-03_Tank-200_實戰風火配置面板_334]] (共用特徵: `藝伎, 肯亞, tp`)
- [[2026-03-26_請同時給我這一支豆子在同一台機器上詳細的烘焙計畫_800]] (共用特徵: `藝伎, 肯亞, tp`)
- [[2026-03-26_請根據您之前給我另外兩支豆子的建議，給我這兩支的火力控制__太棒了！身為你的_SCA_專業講師與考官，我非常欣賞你將「底_805]] (共用特徵: `藝伎, 肯亞, tp`)
- [[2026-05-08_附上之前成功在Tank200上的烘豆紀錄，我還有幾支生豆要請你幫我評估哪些較適合在Tank200烘，可以和水洗藝伎及日曬_265]] (共用特徵: `藝伎, 肯亞, tp`)
- [[2026-03-24_如果接下來要用同樣的烘豆機烘圖片中的這兩支豆子各1公斤，我會分成每200克一鍋來烘，烘豆的順序和火力配置有何不同？_845]] (共用特徵: `藝伎, 肯亞, tp`)
