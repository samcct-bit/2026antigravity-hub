---
type: sca_theory
title: "Tank-200 肯亞B#3危機解除與收官"
date: 2026-05-10
tags: [coffee/sca_theory, imported/takeout]
---

# 📚 SCA 考官理論：Tank-200 肯亞B#3危機解除與收官

## 📋 對話理論紀錄
```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Tank-200 肯亞 B#3 危機解除與收官</title>
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

        .border-warning { border: 1px solid #f59e0b; }
        .border-success { border: 1px solid #10b981; }
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
        .nav-btn.active { color: #f59e0b; }
        .nav-btn.active i { transform: scale(1.15); }
    </style>
</head>
<body class="p-5">

    <header class="pt-2 pb-4 border-b border-[#334155] mb-5">
        <div class="text-xs text-yellow-500 font-bold tracking-wider mb-1 flex items-center">
            <i class="fa-solid fa-triangle-exclamation mr-2"></i> ERROR RECOVERY
        </div>
        <h1 class="text-2xl font-black gold-gradient">B#3 危機解除報告</h1>
        <p class="text-sm text-gray-400 mt-1">RoR 暴衝救援與最後兩鍋收官指引</p>
    </header>

    <main>

        <!-- Tab 1: 數據解密 -->
        <div id="tab-diagnosis" class="tab-pane active">
            
            <div class="card border-warning">
                <i class="fa-solid fa-fire-burner absolute -right-4 -top-4 text-8xl text-yellow-500/10"></i>
                <h2 class="text-lg font-bold text-yellow-500 mb-3 flex items-center border-b border-yellow-900 pb-2">
                    <i class="fa-solid fa-heart-pulse mr-2"></i> 210°C 延遲降火效應
                </h2>
                
                <div class="bg-slate-900 p-3 rounded-lg text-sm text-gray-300 space-y-3">
                    <p>
                        <strong class="text-red-400">物理現象 (Flick & Crash)：</strong><br>
                        205°C (一爆) 到 210°C 之間，肯亞豆正在瘋狂釋放自身熱能，加上您代償的 75% 火力並未移除，這會造成 RoR（升溫率）在短時間內向上飆升 (Flick)。
                    </p>
                    <p>
                        <strong class="text-emerald-400">神級煞車 (The Recovery)：</strong><br>
                        好險您在 210°C 察覺並<strong class="text-white bg-slate-700 px-1 rounded">瞬間把火力抽底至 60%</strong>，同時維持銀皮盒抽風！這硬生生把暴衝的升溫率壓了下來，最後以 <strong class="text-white bg-emerald-600 px-1 rounded">1分02秒 / 215°C</strong> 完美達標下豆點。這證明您的下豆決斷力遠大於參數的執著！
                    </p>
                </div>
            </div>

            <div class="card border-blue mt-4">
                <h2 class="text-lg font-bold text-blue-400 mb-2 flex items-center">
                    <i class="fa-solid fa-mug-hot mr-2"></i> 考官風味預測 (B#2 vs B#3)
                </h2>
                <p class="text-sm text-gray-400 mb-3">這兩鍋下豆溫度與發展時間一模一樣，但「發展期的曲線長相」完全不同：</p>
                <div class="grid grid-cols-2 gap-3 text-center text-sm">
                    <div class="bg-slate-900 p-2 rounded border border-slate-700">
                        <div class="font-bold text-blue-400 mb-1">B#2 (平穩滑行)</div>
                        <div class="text-xs text-gray-300">一爆即降火。風味會非常<strong class="text-white">乾淨、明亮</strong>，酸值像果汁般順滑。</div>
                    </div>
                    <div class="bg-slate-900 p-2 rounded border border-yellow-700/50">
                        <div class="font-bold text-yellow-500 mb-1">B#3 (短暫飆溫)</div>
                        <div class="text-xs text-gray-300">初期高熱促使焦糖化加速。酸值可能略減，但<strong class="text-white">甜感與醇厚度 (Body) 會大幅提升</strong>，帶有黑糖或深色莓果調。</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tab 2: 隱藏的成功 -->
        <div id="tab-success" class="tab-pane">
            <div class="card border-success">
                <i class="fa-solid fa-check-double absolute -right-4 -top-4 text-8xl text-emerald-500/10"></i>
                <h2 class="text-xl font-bold text-emerald-400 mb-3 border-b border-emerald-900 pb-2">
                    <i class="fa-solid fa-bullseye mr-2"></i> 隱藏的極致穩定度
                </h2>
                
                <p class="text-sm text-gray-300 mb-4 leading-relaxed">
                    先別管一爆延遲降火的失誤，您有沒有發現這張紀錄表上有一個<strong class="text-white bg-slate-700 px-1 rounded">絕對堪稱教科書級別</strong>的數據？
                </p>
                
                <div class="bg-slate-900 border border-emerald-500/50 p-4 rounded-xl text-center">
                    <div class="text-gray-400 text-sm mb-1">B#3 轉黃點 (Ye)</div>
                    <div class="text-4xl font-black text-white mb-2 tracking-widest">4:56</div>
                    <div class="text-xs text-emerald-400 font-bold">
                        B#2 轉黃點是 5:15<br>B#3 轉黃點是 4:56
                    </div>
                </div>
                
                <div class="text-sm text-gray-300 mt-4 space-y-2">
                    <p><i class="fa-solid fa-arrow-right text-emerald-400 mr-2"></i>這個數據證明：我們在上一鍋定調的 <strong class="text-white">200°C 入豆 + 85% 火力</strong> 是絕對正確的防禦戰略！</p>
                    <p><i class="fa-solid fa-arrow-right text-emerald-400 mr-2"></i>它成功把機器極限熱機狀態的脫水期，穩穩卡在 5 分鐘這個完美區間，沒有讓它暴衝跌破 4 分鐘！</p>
                </div>
            </div>
        </div>

        <!-- Tab 3: B#4 B#5 收官 -->
        <div id="tab-action" class="tab-pane">
            <div class="card border-red">
                <h2 class="text-xl font-bold text-red-500 mb-3 border-b border-red-900 pb-2">
                    <i class="fa-solid fa-flag-checkered mr-2"></i> 最後兩鍋：肌肉記憶鎖死
                </h2>
                <div class="bg-red-900/20 p-3 rounded-lg mb-4 text-sm text-red-200">
                    機器動能已經完全平衡。剩下最後兩鍋，把「預判」加入您的操作流程中！
                </div>
                
                <div class="space-y-4">
                    <div class="param-row">
                        <div>
                            <div class="font-bold text-white">入豆與脫水</div>
                        </div>
                        <div class="text-right">
                            <span class="badge bg-temp">死守 200°C</span><br>
                            <span class="text-xs text-gray-400">Ye 預計 5:00 上下</span>
                        </div>
                    </div>
                    
                    <div class="param-row bg-slate-900/80 -mx-5 px-5 border-y border-slate-700">
                        <div>
                            <div class="font-bold text-orange-400">195°C 拔抽屜</div>
                        </div>
                        <div class="text-right">
                            <span class="badge bg-fire">代償至 75%</span>
                        </div>
                    </div>

                    <div class="param-row bg-slate-900/80 -mx-5 px-5 border-b border-red-900/50 pb-3">
                        <div>
                            <div class="font-bold text-red-400">203°C (預備動作)</div>
                            <div class="text-xs text-red-300 font-bold mt-1">★ 避免失誤的關鍵防呆</div>
                        </div>
                        <div class="text-right mt-2">
                            <span class="text-sm font-bold text-white">手放在火力旋鈕上！</span><br>
                            <span class="text-xs text-gray-400">準備迎接第一聲爆裂</span>
                        </div>
                    </div>

                    <div class="param-row border-none pt-2">
                        <div>
                            <div class="font-bold text-yellow-500">205°C 聽到爆裂</div>
                        </div>
                        <div class="text-right">
                            <span class="badge" style="background:#475569; color:white;">秒降 60%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </main>

    <nav class="bottom-nav">
        <button class="nav-btn active" onclick="switchTab('diagnosis', this)">
            <i class="fa-solid fa-heart-pulse text-yellow-500"></i>
            <span class="text-yellow-500">危機解除</span>
        </button>
        <button class="nav-btn" onclick="switchTab('success', this)">
            <i class="fa-solid fa-bullseye text-emerald-400"></i>
            <span class="text-emerald-400">隱藏成功</span>
        </button>
        <button class="nav-btn" onclick="switchTab('action', this)">
            <i class="fa-solid fa-flag-checkered text-red-500"></i>
            <span class="text-red-500">完美收官</span>
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
- [[2026-05-10_Tank-200_肯亞B_3危機解除與收官_216]] (共用特徵: `肯亞, 焦糖化, ror`)
- [[2026-03-29_這是第一二支生豆_730]] (共用特徵: `肯亞, 焦糖化, ror`)
- [[2026-03-26_請同步更新以下兩支之前的火力建議配置_沒問題！這正是我們講師在做_SCA_烘焙認證考試時，要求學員必須具備的「機器適應力_799]] (共用特徵: `肯亞, 焦糖化, ror`)
- [[2026-03-26_請根據在tank200上火力小於50%會造成溫度停滯無法達到一爆溫度進行下面的修正，一爆約210度，機器無法控制風門大小_797]] (共用特徵: `肯亞, 焦糖化, ror`)
- [[2026-03-26_請根據您之前給我另外兩支豆子的建議，給我這兩支的火力控制__太棒了！身為你的_SCA_專業講師與考官，我非常欣賞你將「底_805]] (共用特徵: `肯亞, ror, 升溫率`)
