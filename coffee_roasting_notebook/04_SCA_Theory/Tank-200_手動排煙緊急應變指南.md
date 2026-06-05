---
type: sca_theory
title: "Tank-200 手動排煙緊急應變指南"
date: 2026-05-10
tags: [coffee/sca_theory, imported/takeout]
---

# 📚 SCA 考官理論：Tank-200 手動排煙緊急應變指南

## 📋 對話理論紀錄
```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Tank-200 手動排煙緊急應變指南</title>
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
        }

        .alert-text {
            background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .card {
            background-color: #1e293b; 
            border: 2px solid #ef4444; 
            border-radius: 1rem;
            padding: 1.5rem;
            margin-bottom: 1rem;
            box-shadow: 0 4px 20px rgba(239, 68, 68, 0.2);
            position: relative;
            overflow: hidden;
        }

        .step-row {
            padding: 1.25rem 0;
            border-bottom: 1px dashed #475569;
        }
        .step-row:last-child {
            border-bottom: none;
        }

        .badge {
            padding: 0.3rem 0.8rem;
            border-radius: 0.5rem;
            font-weight: 900;
            font-size: 1rem;
            display: inline-block;
        }
    </style>
</head>
<body class="p-5">

    <header class="mb-6 border-b border-slate-700 pb-4">
        <div class="text-xs text-red-500 font-bold tracking-wider mb-1 flex items-center">
            <i class="fa-solid fa-triangle-exclamation mr-2 animate-pulse"></i> URGENT: NO DAMPER HACK
        </div>
        <h1 class="text-3xl font-black alert-text mb-2">手動排煙 & 火力代償</h1>
        <p class="text-sm text-gray-300">禁用正壓灌風！採用「負壓抽風」與「火力代償」戰術。</p>
    </header>

    <main>
        <!-- 物理學觀念修正 -->
        <div class="bg-blue-900/40 border border-blue-500 rounded-xl p-4 mb-6">
            <h3 class="text-blue-400 font-bold text-lg mb-2 flex items-center">
                <i class="fa-solid fa-fan mr-2"></i> 電風扇的正確用法 (負壓效應)
            </h3>
            <p class="text-sm text-blue-200 mb-3 leading-relaxed">
                絕對不可將風扇對著銀皮盒「吹入」。<br>
                請將電風扇放在機器旁邊，風向<strong>「往外吹」或「橫向吹過」</strong>銀皮盒開口。利用白努利定律（流速快氣壓低），在開口處製造「負壓」，把機器裡的煙<strong>「吸出來」</strong>！
            </p>
            <div class="bg-black/50 p-2 rounded text-center text-xs text-blue-300">
                <i class="fa-solid fa-arrow-right-from-bracket mr-1"></i> 正確：吸出 (Exhaust) | 錯誤：吹入 (Blow in)
            </div>
        </div>

        <!-- 實戰 SOP Card -->
        <h2 class="text-xl font-bold text-white mb-4 flex items-center">
            <i class="fa-solid fa-fire text-red-500 mr-2"></i> 拔抽屜實戰 SOP (以肯亞為例)
        </h2>

        <div class="card">
            <i class="fa-solid fa-skull absolute -right-6 -bottom-6 text-9xl text-red-500/5"></i>
            
            <div class="step-row">
                <div class="flex items-center mb-2">
                    <span class="bg-slate-700 text-white px-2 py-1 rounded text-xs font-bold mr-3">前段</span>
                    <span class="font-bold text-lg text-gray-300">入豆 到 195°C</span>
                </div>
                <div class="text-sm text-gray-400 mb-2">
                    銀皮盒<strong>緊閉</strong>，電風扇關閉。依正常 195g 火力配置（85% -> 75% -> 65%）。
                </div>
            </div>

            <div class="step-row bg-red-900/20 -mx-6 px-6 border-y border-red-500">
                <div class="flex justify-between items-start mb-2">
                    <div class="flex items-center">
                        <span class="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold mr-3">關鍵</span>
                        <span class="font-bold text-xl text-orange-400">195°C ~ 200°C (一爆前夕)</span>
                    </div>
                </div>
                <div class="text-sm text-red-200 font-bold mb-3">
                    此時準備大量排煙！必須執行「火力代償」，彌補打開抽屜流失的熱能！
                </div>
                <ul class="text-sm text-white space-y-2">
                    <li class="flex items-center bg-slate-800 p-2 rounded">
                        <i class="fa-solid fa-1 text-red-400 mr-3"></i> 
                        先將火力從 65% <strong>拉高至 70% 甚至 75%</strong>
                    </li>
                    <li class="flex items-center bg-slate-800 p-2 rounded">
                        <i class="fa-solid fa-2 text-blue-400 mr-3"></i> 
                        電風扇往外吹，拉開銀皮盒 3~5 公分縫隙
                    </li>
                </ul>
            </div>

            <div class="step-row">
                <div class="flex items-center mb-2">
                    <span class="bg-slate-700 text-white px-2 py-1 rounded text-xs font-bold mr-3">一爆</span>
                    <span class="font-bold text-lg text-red-400">一爆密集 (約 208°C)</span>
                </div>
                <div class="text-sm text-gray-400">
                    若煙量極大，可將銀皮盒拉開一半，但<strong>眼睛死盯溫度</strong>。若溫度停滯，火力再補 5%；若溫度狂飆，火力立刻降回 60%。
                </div>
            </div>

            <div class="step-row border-none">
                <div class="flex justify-between items-center">
                    <div>
                        <div class="font-bold text-xl text-green-400">下豆 216-217°C</div>
                        <div class="text-xs text-gray-400 mt-1">發展 50-60 秒果斷出爐</div>
                    </div>
                    <div class="text-right">
                        <span class="badge bg-green-600 text-white">立刻冷卻</span>
                    </div>
                </div>
            </div>
        </div>
        
    </main>

</body>
</html>
```


## 🖼️ 相關參考圖片與文件
![[7003-61d8ccd4c565400d.png]] ![[7003-85cc318439819f68.png]] ![[9000-b0d0d952ab8ef43b.jpg]] ![[10093408293917864137-4c73aabdd108e0ae.png]] ![[Gemini_Generated_Image_8ggri88ggr-44a8442c4e958641.jpg]] ![[Gemini_Generated_Image_htsu2ahtsu-e11f6500ada5b266.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-96a4cef5cc1008b1.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-be202b15b4d41e70.jpg]] ![[Gemini_Generated_Image_q59snqq59s-d7376f45389320a6.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-153057063c8c793c.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-758609cfa28db9a7.jpg]]

## 🔬 科學物理觀點解析
- *此理論卡片由 Gemini Takeout 匯出對話分析自動生成。*

## 🔗 相關理論與對話推薦
- [[2026-05-03_Tank-200_實戰風火配置面板_334]] (共用特徵: `肯亞, tp, 一爆`)
- [[2026-05-10_Tank-200_肯亞AA_195g_轉換面板_226]] (共用特徵: `肯亞, tp, 一爆`)
- [[2026-05-10_Tank-200_肯亞四連戰防禦面板_220]] (共用特徵: `肯亞, tp, 一爆`)
- [[2026-05-10_Tank-200_肯亞第二鍋戰報與定調_218]] (共用特徵: `肯亞, tp, 一爆`)
- [[2026-05-10_Tank-200_手動排煙緊急應變指南_240]] (共用特徵: `肯亞, tp, 一爆`)
