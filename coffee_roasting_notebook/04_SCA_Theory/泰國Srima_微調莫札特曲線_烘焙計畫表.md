---
type: sca_theory
title: "泰國Srima_微調莫札特曲線_烘焙計畫表"
date: 2026-04-22
tags: [coffee/sca_theory, imported/takeout]
---

# 📚 SCA 考官理論：泰國Srima_微調莫札特曲線_烘焙計畫表

## 📋 對話理論紀錄
```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>泰國 Srima 烘焙計畫表 (微調莫札特曲線)</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            font-family: 'PingFang TC', 'Microsoft JhengHei', sans-serif;
            background-color: #1a1a1a;
            color: #f3f4f6;
            margin: 0;
            padding: 2rem;
            display: flex;
            justify-content: center;
        }
        .container {
            max-width: 1000px;
            width: 100%;
            background: #2a2a2a;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            padding: 2rem;
            border: 1px solid #3f3f3f;
        }
        .header-panel {
            background: linear-gradient(135deg, #1f2937, #111827);
            border-left: 5px solid #d4af37;
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 2rem;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.95rem;
        }
        th, td {
            padding: 0.75rem 1rem;
            text-align: center;
            border-bottom: 1px solid #3f3f3f;
        }
        th {
            background-color: rgba(212, 175, 55, 0.15);
            color: #d4af37;
            font-weight: 600;
        }
        tr:nth-child(even) {
            background-color: rgba(255, 255, 255, 0.02);
        }
        tr:hover {
            background-color: rgba(212, 175, 55, 0.05);
        }
        .action-cell {
            text-align: left;
            font-weight: 500;
            color: #fbbf24; /* amber-400 */
        }
        .phase-divider {
            background-color: #374151;
            color: #9ca3af;
            font-weight: bold;
            text-align: left;
            padding: 0.5rem 1rem;
            letter-spacing: 0.05em;
        }
    </style>
</head>
<body>

    <div class="container">
        <div class="header-panel">
            <h1 class="text-3xl font-bold mb-2 text-white">烘焙執行計畫表：泰國 Srima 雙重厭氧蜜</h1>
            <p class="text-gray-400">設備：楊家 0.5kg 半熱風 | 策略：微調莫札特極短發展曲線 | 限制：風門恆定 2.5</p>
            
            <div class="grid grid-cols-4 gap-4 mt-4 text-sm">
                <div class="bg-gray-800 p-2 rounded border border-gray-700">
                    <span class="text-gray-400 block">目標入豆溫</span>
                    <span class="text-xl font-bold text-yellow-500">165°C - 168°C</span>
                </div>
                <div class="bg-gray-800 p-2 rounded border border-gray-700">
                    <span class="text-gray-400 block">固定風門</span>
                    <span class="text-xl font-bold text-white">2.5</span>
                </div>
                <div class="bg-gray-800 p-2 rounded border border-gray-700">
                    <span class="text-gray-400 block">預估一爆</span>
                    <span class="text-xl font-bold text-red-400">約 9:30 / 178°C</span>
                </div>
                <div class="bg-gray-800 p-2 rounded border border-gray-700">
                    <span class="text-gray-400 block">目標下豆</span>
                    <span class="text-xl font-bold text-green-400">約 10:15 / 182°C</span>
                </div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th width="15%">時間 (Min)</th>
                    <th width="20%">預估豆溫 (°C)</th>
                    <th width="15%">火力設定</th>
                    <th width="50%">狀態觀察與操作建議 (Action)</th>
                </tr>
            </thead>
            <tbody>
                <!-- 脫水期 -->
                <tr><td colspan="4" class="phase-divider">階段 1：脫水期 (Drying Phase)</td></tr>
                <tr>
                    <td>0:00</td>
                    <td>165 - 168</td>
                    <td>關火或 0.2</td>
                    <td class="action-cell text-white">入豆 (Charge)。因密度較低，降低入豆溫。</td>
                </tr>
                <tr>
                    <td>0:30</td>
                    <td>110 - 120</td>
                    <td>0.2</td>
                    <td class="text-gray-400 text-left">豆溫急降。</td>
                </tr>
                <tr>
                    <td>1:00</td>
                    <td>90 - 100</td>
                    <td>0.2</td>
                    <td class="text-gray-400 text-left">預計 1:15 - 1:30 抵達回溫點 (Turning Point)。</td>
                </tr>
                <tr>
                    <td>1:30</td>
                    <td>85 - 90</td>
                    <td><span class="text-red-500 font-bold">1.0</span></td>
                    <td class="action-cell">確認過回溫點後，火力推至 1.0 (略低於莫札特的 1.2)。</td>
                </tr>
                <tr>
                    <td>2:00</td>
                    <td>95 - 100</td>
                    <td>1.0</td>
                    <td class="text-gray-400 text-left">穩步爬升，確保 RoR 不要飆破 20。</td>
                </tr>
                <tr>
                    <td>2:30</td>
                    <td>105 - 110</td>
                    <td>1.0</td>
                    <td class="text-gray-400 text-left">水氣開始釋放，聞生草味。</td>
                </tr>
                <tr>
                    <td>3:00</td>
                    <td>115 - 120</td>
                    <td>1.0</td>
                    <td class="text-gray-400 text-left">維持節奏。</td>
                </tr>
                <tr>
                    <td>3:30</td>
                    <td>125 - 130</td>
                    <td>1.0</td>
                    <td class="text-gray-400 text-left">顏色開始泛白。</td>
                </tr>
                <tr>
                    <td>4:00</td>
                    <td>135 - 140</td>
                    <td>1.0</td>
                    <td class="text-gray-400 text-left">接近轉黃，生草味逐漸轉為烤麵包/穀物香。</td>
                </tr>

                <!-- 梅納反應期 -->
                <tr><td colspan="4" class="phase-divider">階段 2：梅納反應期 (Maillard Phase)</td></tr>
                <tr>
                    <td>4:30</td>
                    <td>145 - 150</td>
                    <td>1.0</td>
                    <td class="action-cell text-white">預估轉黃 (Yellowing)。注意脫水是否均勻。</td>
                </tr>
                <tr>
                    <td>5:00</td>
                    <td>153 - 156</td>
                    <td>1.0</td>
                    <td class="text-gray-400 text-left">梅納反應加速。</td>
                </tr>
                <tr>
                    <td>5:30</td>
                    <td>159 - 162</td>
                    <td>1.0</td>
                    <td class="text-gray-400 text-left">豆表顏色變深褐。</td>
                </tr>
                <tr>
                    <td>6:00</td>
                    <td>165 - 167</td>
                    <td>1.0</td>
                    <td class="text-gray-400 text-left">注意 RoR 應開始自然緩步下降。</td>
                </tr>
                <tr>
                    <td>6:30</td>
                    <td>169 - 171</td>
                    <td>1.0</td>
                    <td class="text-gray-400 text-left">雙重厭氧處理在此時可能開始出現些微煙霧與焦糖香。</td>
                </tr>
                <tr>
                    <td>7:00</td>
                    <td>172 - 174</td>
                    <td><span class="text-yellow-500 font-bold">0.8</span></td>
                    <td class="action-cell"><b>提早降火！</b> 因為風門固定，必須提早降火力至 0.8，避免表面糖分在一爆前燒焦產生煙燻味。</td>
                </tr>
                <tr>
                    <td>7:30</td>
                    <td>174 - 175</td>
                    <td>0.8</td>
                    <td class="text-gray-400 text-left">準備迎接一爆，觀察排煙狀況。</td>
                </tr>

                <!-- 發展期 -->
                <tr><td colspan="4" class="phase-divider">階段 3：發展期 (Development Phase)</td></tr>
                <tr>
                    <td>8:00</td>
                    <td>176 - 177</td>
                    <td>0.8</td>
                    <td class="text-gray-400 text-left">聽到零星爆聲。</td>
                </tr>
                <tr>
                    <td>8:30</td>
                    <td>178</td>
                    <td>0.8</td>
                    <td class="action-cell text-red-400"><b>預計一爆開始 (FC)。</b> 記錄時間與溫度。維持 0.8，讓它以剩餘動能推進。</td>
                </tr>
                <tr>
                    <td>9:00</td>
                    <td>180 - 181</td>
                    <td>0.8</td>
                    <td class="text-gray-400 text-left">爆聲密集。聞香氣是否從酸香轉為花果甜香。</td>
                </tr>
                <tr>
                    <td>9:15</td>
                    <td>182 - 183</td>
                    <td>關火或 0.2</td>
                    <td class="action-cell text-green-400"><b>下豆準備！</b> 發展時間約 45 秒 (DTR 約 8%)，溫度達 182-183°C 時立刻下豆，鎖住橙花與柚子香。</td>
                </tr>
            </tbody>
        </table>
        
        <div class="mt-6 p-4 bg-gray-800 rounded border-l-4 border-yellow-500">
            <h4 class="font-bold text-white mb-2">⚠️ 考官重點提示：</h4>
            <p class="text-sm text-gray-300">此計畫的核心在於<span class="text-yellow-400">「降入豆溫」</span>與<span class="text-yellow-400">「提早降火」</span>。因為我們鎖死了風門 (無法靠抽風散熱)，雙重厭氧豆子在一爆前很容易因為火力慣性而導致表面微焦，這會完全掩蓋掉精緻的花香。7分鐘那次降火是成敗關鍵。</p>
        </div>
    </div>

</body>
</html>
```


## 🖼️ 相關參考圖片與文件
![[10093408293917864137-4c73aabdd108e0ae.png]] ![[17515777487485734111-4d19d2f783a97c67.png]] ![[2555777530681031145-d3ce890839589fae.png]] ![[16544113557186314641-e81ba32a4992f6d2.png]] ![[165d0ca5-9027-4d54-9d6a-e18f06805-4f69e9f03854182d.jpg]] ![[16840647073640564182-4d19d2f783a97c67.png]] ![[18216880672359319213-cc4db790cd9081b8.png]] ![[12019819059572421071-7afd66aea08ecfc3.png]] ![[10525877304504348788-6b6255a86e9f0ee7.jpg]] [[115探究教案 教學簡案參�-40198bbf9e167c9e.docx]] (附件檔案) ![[12516469288539840443-7c2953090e53617d.png]] ![[13023469110159187213-450df5f56c9a89a2.png]] ![[14008462579978004516-578406f068f1819c.png]] ![[14025574375674782333-bda08fb35d59d4e9.png]] ![[14061255993213757039-71630eb532e8cd34.png]] ![[15662378191389929446-f0512e6670b77f81.png]] ![[15978711758568601827-1f1ac69cb8f8efcb.png]] ![[1675995131094~2-db03acd853336212.jpg]] ![[16909170301254691705-7b8f8e10a2f9686a.png]] ![[17276976052128932656-a4c08ddb01d6b17b.png]] ![[17409793803240343415-a48b298bfc2fcbd1.png]] ![[17639388188470622529-7e1fefb03fc1fcef.png]] ![[1772519438079-4acc814a37b6af40.jpg]] [[1773652869415-b99009fa368e7fa9.mp4]] (附件檔案) ![[1774242176700-169e49c6063a5723.jpg]] ![[17745731039953828698-d3fc96ce3f267d55.png]] ![[1774677459606-0b196cdc3e297f9d.jpg]] ![[17765547980150319759-8448ca74908ade51.png]] ![[1776926492270-a5c8f835a6983428.jpg]] ![[1776926640045-de6eac9b4d06328b.jpg]] ![[1776926981106-be202b15b4d41e70.jpg]] ![[1776927489697-96a4cef5cc1008b1.jpg]] ![[18043791498398431492-725dde69f3cfdff6.png]] ![[18145602550749916098-6dc115598c9070e4.png]] ![[Gemini_Generated_Image_8ggri88ggr-44a8442c4e958641.jpg]] ![[Gemini_Generated_Image_htsu2ahtsu-e11f6500ada5b266.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-96a4cef5cc1008b1.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-be202b15b4d41e70.jpg]] ![[Gemini_Generated_Image_q59snqq59s-d7376f45389320a6.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-153057063c8c793c.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-758609cfa28db9a7.jpg]]

## 🔬 科學物理觀點解析
- *此理論卡片由 Gemini Takeout 匯出對話分析自動生成。*

## 🔗 相關理論與對話推薦
- [[2026-04-22_泰國Srima_微調莫札特曲線_烘焙計畫表_455]] (共用特徵: `莫札特, 橙花, srima`)
- [[2026-03-26_請同時給我這一支豆子在同一台機器上詳細的烘焙計畫_800]] (共用特徵: `莫札特, 橙花, srima`)
- [[2026-04-22_SCA烘焙訓練：泰國Srima雙重厭氧蜜處理_457]] (共用特徵: `莫札特, 橙花, srima`)
- [[SCA烘焙訓練：泰國Srima雙重厭氧蜜處理]] (共用特徵: `莫札特, 橙花, srima`)
- [[2026-04-22_泰國Srima_333g修正版烘焙計畫表_453]] (共用特徵: `莫札特, 橙花, srima`)
