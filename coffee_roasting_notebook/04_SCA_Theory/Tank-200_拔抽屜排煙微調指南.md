---
type: sca_theory
title: "Tank-200 拔抽屜排煙微調指南"
date: 2026-05-10
tags: [coffee/sca_theory, imported/takeout]
---

# 📚 SCA 考官理論：Tank-200 拔抽屜排煙微調指南

## 📋 對話理論紀錄
```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Tank-200 拔抽屜排煙微調指南</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&display=swap');
        
        body {
            font-family: 'Noto Sans TC', sans-serif;
            background-color: #0f172a; 
            color: #f8fafc;
            margin: 0;
            padding-bottom: 5rem;
            overscroll-behavior: none;
        }

        .gold-gradient {
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .card {
            background-color: #1e293b; 
            border-radius: 1rem;
            padding: 1.25rem;
            margin-bottom: 1rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        }

        .border-washed { border: 1px solid #3b82f6; }
        .border-natural { border: 1px solid #f97316; }

        .param-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.85rem 0;
            border-bottom: 1px dashed #334155;
        }
        .param-row:last-child {
            border-bottom: none;
        }

        .badge {
            padding: 0.2rem 0.6rem;
            border-radius: 0.5rem;
            font-weight: 700;
            font-size: 0.85rem;
            display: inline-block;
        }
        .bg-temp { background-color: #2563eb; color: white; }
        .bg-fire { background-color: #dc2626; color: white; }
        .bg-wind { background-color: #0ea5e9; border: 1px solid #38bdf8; color: white;}
        .bg-alert { border: 2px solid #fbbf24; color: #fbbf24; background-color: rgba(251, 191, 36, 0.1); }

        .tab-pane {
            display: none;
            animation: fadeIn 0.3s ease-out forwards;
        }
        .tab-pane.active {
            display: block;
        }

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
        .nav-btn.active { color: #fbbf24; }
        .nav-btn.active i { transform: scale(1.15); }
    </style>
</head>
<body>

    <header class="pt-6 pb-4 px-5 bg-[#1e293b] border-b border-[#334155] sticky top-0 z-40">
        <div class="text-xs text-red-400 font-bold tracking-wider mb-1 flex items-center">
            <i class="fa-solid fa-fan mr-2"></i> NO DAMPER PROTOCOL
        </div>
        <h1 class="text-2xl font-black gold-gradient">無風門排煙 195g 修正</h1>
    </header>

    <main class="p-5">

        <!-- Tab 1: 水洗藝伎 (晚拔抽屜) -->
        <div id="tab-washed" class="tab-pane active">
            <h2 class="text-xl font-bold text-blue-400 mb-4 border-b border-[#334155] pb-2">
                <i class="fa-solid fa-water mr-2"></i> 古吉 藝伎 G1 (水洗)
            </h2>
            
            <div class="bg-blue-900/20 border border-blue-500/50 rounded-lg p-3 mb-4 text-sm text-blue-200">
                <strong class="text-blue-400">考官解析：</strong> 銀皮較少，煙霧中等。太早拔抽屜會導致失溫，扼殺脆弱的白桃花香。必須採取**「晚拔抽屜、輕微代償」**戰術。
            </div>

            <div class="card border-washed relative">
                <i class="fa-solid fa-fan absolute -right-4 -top-4 text-8xl text-blue-500/10"></i>
                
                <div class="param-row">
                    <div>
                        <div class="font-bold text-gray-300">190°C (梅納中段)</div>
                        <div class="text-xs text-gray-400">銀皮盒緊閉</div>
                    </div>
                    <div><span class="badge bg-alert">守 65%</span></div>
                </div>

                <div class="param-row bg-slate-900/50 -mx-5 px-5 border-y border-slate-700">
                    <div>
                        <div class="font-bold text-orange-400">200°C - 205°C (一爆前)</div>
                        <div class="text-xs text-blue-300 font-bold mt-1">★ 晚拔抽屜 & 輕微代償</div>
                    </div>
                    <div class="text-right">
                        <span class="badge bg-fire mb-1">升 70%</span><br>
                        <span class="badge bg-wind"><i class="fa-solid fa-arrow-right"></i> 拉開 3cm 縫隙</span>
                    </div>
                </div>

                <div class="param-row">
                    <div>
                        <div class="font-bold text-red-400">一爆 FCr (208°C)</div>
                        <div class="text-xs text-gray-400">維持縫隙與火力</div>
                    </div>
                    <div class="text-right">
                        <span class="badge bg-fire" style="background:#475569">持平 70%</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tab 2: 蜜處理/日曬 (早拔抽屜) -->
        <div id="tab-natural" class="tab-pane">
            <h2 class="text-xl font-bold text-orange-400 mb-4 border-b border-[#334155] pb-2">
                <i class="fa-solid fa-sun mr-2"></i> 蜜處理 & 日曬組
            </h2>

            <div class="bg-orange-900/20 border border-orange-500/50 rounded-lg p-3 mb-4 text-sm text-orange-200">
                <strong class="text-orange-400">考官解析：</strong> 表面含糖量極高，銀皮如雪花般炸裂！如果等一爆才拔抽屜絕對來不及。必須採取**「提早拔抽屜、強代償、一爆急煞」**戰術！
            </div>

            <div class="card border-natural relative">
                <div class="flex justify-between items-center mb-3">
                    <h3 class="font-bold text-white text-lg">適用豆單</h3>
                </div>
                <div class="flex space-x-2 mb-4">
                    <span class="text-xs bg-pink-900 text-pink-300 border border-pink-700 px-2 py-1 rounded">草莓 CO2 蜜處理</span>
                    <span class="text-xs bg-orange-900 text-orange-300 border border-orange-700 px-2 py-1 rounded">布穀鳥 日曬</span>
                </div>

                <div class="param-row">
                    <div>
                        <div class="font-bold text-gray-300">185°C (梅納中段)</div>
                        <div class="text-xs text-gray-400">底火推動 195g</div>
                    </div>
                    <div><span class="badge bg-alert">守 65%</span></div>
                </div>

                <div class="param-row bg-slate-900/50 -mx-5 px-5 border-y border-red-900">
                    <div>
                        <div class="font-bold text-red-400">195°C (極大煙霧準備)</div>
                        <div class="text-xs text-orange-300 font-bold mt-1">★ 提早拔 & 強力代償！</div>
                    </div>
                    <div class="text-right">
                        <span class="badge bg-fire mb-1">升 75%</span><br>
                        <span class="badge bg-wind"><i class="fa-solid fa-arrow-right"></i> 拉開 5cm 縫隙</span>
                    </div>
                </div>

                <div class="param-row bg-slate-900/50 -mx-5 px-5 border-b border-red-900 pb-3">
                    <div>
                        <div class="font-bold text-yellow-500">一爆 FCr (208°C)</div>
                        <div class="text-xs text-red-300 font-bold mt-1">★ 防糖分燒焦急煞車！</div>
                    </div>
                    <div class="text-right mt-2">
                        <span class="badge bg-fire" style="background:#ea580c">秒降回 60%</span><br>
                        <span class="text-xs text-gray-400">縫隙保持全開</span>
                    </div>
                </div>

                <div class="param-row border-none pt-3">
                    <div>
                        <div class="font-bold text-green-400">下豆 Drop</div>
                        <div class="text-xs text-gray-400 mt-1">發展不超過 60 秒</div>
                    </div>
                    <div class="font-bold text-xl text-white">214-216°C</div>
                </div>
            </div>
        </div>

    </main>

    <nav class="bottom-nav">
        <button class="nav-btn active" onclick="switchTab('washed', this)">
            <i class="fa-solid fa-water text-blue-400"></i>
            <span class="text-blue-400">水洗藝伎</span>
        </button>
        <button class="nav-btn" onclick="switchTab('natural', this)">
            <i class="fa-solid fa-sun text-orange-400"></i>
            <span class="text-orange-400">日曬/蜜處理</span>
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
- [[2026-05-10_Tank-200_195g滿載全線指南_242]] (共用特徵: `藝伎, 蜜處理, tp`)
- [[2026-05-10_Tank-200_拔抽屜排煙微調指南_238]] (共用特徵: `藝伎, 蜜處理, tp`)
- [[Tank-200_195g滿載全線指南]] (共用特徵: `藝伎, 蜜處理, tp`)
- [[2026-03-26_請同時給我這一支豆子在同一台機器上詳細的烘焙計畫_800]] (共用特徵: `藝伎, 蜜處理, tp`)
- [[2026-05-03_Tank-200_實戰風火配置面板_334]] (共用特徵: `藝伎, tp, 一爆`)
