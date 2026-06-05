---
type: sca_theory
title: "SCA 進階微型烘豆訓練簡報"
date: 2026-05-03
tags: [coffee/sca_theory, imported/takeout]
---

# 📚 SCA 考官理論：SCA 進階微型烘豆訓練簡報

## 📋 對話理論紀錄
```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SCA 進階微型烘豆自主訓練</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700;900&display=swap');
        
        body {
            font-family: 'Noto Sans TC', sans-serif;
            background-color: #1a1a1a;
            color: #f3f4f6;
            overflow: hidden;
        }

        .slide {
            display: none;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
        }

        .slide.active {
            display: flex;
            opacity: 1;
        }

        .glass-panel {
            background: rgba(40, 40, 40, 0.8);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .coffee-gradient {
            background: linear-gradient(135deg, #c3976a 0%, #8b5a2b 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .progress-bar {
            transition: width 0.3s ease;
        }
    </style>
</head>
<body class="h-screen w-screen flex flex-col items-center justify-center relative bg-[url('https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center">
    
    <!-- Dark Overlay -->
    <div class="absolute inset-0 bg-black/70 z-0"></div>

    <!-- Presentation Container -->
    <div class="z-10 w-full max-w-5xl h-[85vh] glass-panel rounded-2xl shadow-2xl flex flex-col relative overflow-hidden m-4">
        
        <!-- Header / Progress -->
        <div class="h-2 w-full bg-gray-800 rounded-t-2xl overflow-hidden">
            <div id="progress" class="h-full bg-[#c3976a] progress-bar" style="width: 16.6%;"></div>
        </div>

        <!-- Slides Container -->
        <div class="flex-1 relative p-8 md:p-12">
            
            <!-- Slide 1: Title -->
            <div class="slide active flex-col justify-center items-center h-full text-center space-y-6" id="slide-1">
                <div class="w-24 h-24 rounded-full bg-[#c3976a]/20 flex items-center justify-center mb-4 border border-[#c3976a]/50">
                    <i class="fa-solid fa-fire-burner text-5xl text-[#c3976a]"></i>
                </div>
                <h2 class="text-xl md:text-2xl text-gray-400 tracking-widest uppercase">SCA Professional Training Module</h2>
                <h1 class="text-4xl md:text-6xl font-bold coffee-gradient leading-tight">Tank 200 微型烘豆<br>與極致風味解析</h1>
                <p class="text-lg md:text-xl text-gray-300 max-w-2xl mt-6">
                    講師：SCA 專業全方位認證考官<br>
                    訓練目標：掌握微批次烘豆機的熱能慣性，精準建構水洗藝伎與日曬古優種的對照曲線。
                </p>
                <div class="mt-8 animate-bounce">
                    <i class="fa-solid fa-chevron-down text-2xl text-[#c3976a]"></i>
                </div>
            </div>

            <!-- Slide 2: Equipment & Strategy -->
            <div class="slide flex-col h-full space-y-6" id="slide-2">
                <h2 class="text-3xl font-bold coffee-gradient border-b border-gray-700 pb-4">第一單元：Tank 200 特性與選豆策略</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 h-full items-start mt-4">
                    <div class="bg-black/40 p-6 rounded-xl border border-gray-600">
                        <h3 class="text-xl font-semibold text-white mb-4"><i class="fa-solid fa-microchip text-[#c3976a] mr-2"></i>Tank 200 設備特性</h3>
                        <ul class="space-y-3 text-gray-300 list-disc list-inside">
                            <li><strong>低熱慣性 (Low Thermal Inertia)：</strong> 反應極快。火力調整會立即反映在 RoR (升溫率) 上。</li>
                            <li><strong>風門敏感度高：</strong> 小容量烘焙時，過大的風門容易抽走過多熱能，導致發展停滯 (Baked)。</li>
                            <li><strong>訓練重點：</strong> 預測一爆前的放熱反應 (Exothermic Flash)，提前降火，避免 RoR 飆升 (Flick)。</li>
                        </ul>
                    </div>
                    <div class="bg-black/40 p-6 rounded-xl border border-gray-600">
                        <h3 class="text-xl font-semibold text-white mb-4"><i class="fa-solid fa-seedling text-[#c3976a] mr-2"></i>本次對照訓練選豆</h3>
                        <p class="text-gray-300 mb-3">利用各 1kg 的生豆，進行每鍋 200g、共 5 鍋的曲線收斂測試。</p>
                        <div class="space-y-4">
                            <div class="p-3 bg-blue-900/30 rounded border border-blue-500/30">
                                <span class="text-blue-400 font-bold">對照 A (水洗)：</span> 古吉 葛連娜 藝伎 G1<br>
                                <span class="text-sm text-gray-400">極致的酸甜平衡與精緻花香測試</span>
                            </div>
                            <div class="p-3 bg-orange-900/30 rounded border border-orange-500/30">
                                <span class="text-orange-400 font-bold">對照 B (日曬)：</span> 衣索比亞 罕貝拉 布穀鳥<br>
                                <span class="text-sm text-gray-400">複雜水果調性與甜感發展測試</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 3: Bean A Profile -->
            <div class="slide flex-col h-full space-y-6" id="slide-3">
                <h2 class="text-3xl font-bold coffee-gradient border-b border-gray-700 pb-4">第二單元：水洗藝伎 烘焙策略 (對照A)</h2>
                <div class="bg-blue-900/10 p-6 rounded-xl border border-blue-500/20 flex-1">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-2xl font-semibold text-blue-300">古吉 葛連娜 藝伎 G1 (Washed)</h3>
                        <span class="px-3 py-1 bg-blue-800/50 rounded-full text-sm">密度: 852 g/L | 水份: 10.8%</span>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <div class="p-4 bg-black/50 rounded-lg">
                            <h4 class="text-[#c3976a] font-bold mb-2">1. 脫水期 (Drying Phase)</h4>
                            <p class="text-sm text-gray-300">密度高 (852 g/L) 且水份健康，代表<strong class="text-white">傳熱效率佳且耐火</strong>。入豆溫可設定偏高，給予足夠的初始熱能 (Charge Heat)，快速通過脫水期，以保留明亮的茉莉花香與檸檬酸質。</p>
                        </div>
                        <div class="p-4 bg-black/50 rounded-lg">
                            <h4 class="text-[#c3976a] font-bold mb-2">2. 梅納期 (Maillard Phase)</h4>
                            <p class="text-sm text-gray-300">進入黃色階段後，開始穩步降火。在 Tank 200 上保持 RoR 平緩下降。此階段不宜拖長，避免消耗掉藝伎特有的精緻果酸（白桃、荔枝）。</p>
                        </div>
                        <div class="p-4 bg-black/50 rounded-lg">
                            <h4 class="text-[#c3976a] font-bold mb-2">3. 發展期 (Development)</h4>
                            <p class="text-sm text-gray-300">預計一爆溫度。一爆前 10-15 秒必須提前收火，防止 RoR Flick 破壞乾淨度。建議 <strong class="text-white">DTR (發展時間比) 控制在 10% - 12%</strong>，極淺焙至淺焙出爐。</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 4: Bean B Profile -->
            <div class="slide flex-col h-full space-y-6" id="slide-4">
                <h2 class="text-3xl font-bold coffee-gradient border-b border-gray-700 pb-4">第三單元：日曬古優種 烘焙策略 (對照B)</h2>
                <div class="bg-orange-900/10 p-6 rounded-xl border border-orange-500/20 flex-1">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-2xl font-semibold text-orange-300">罕貝拉 布穀鳥 (Natural)</h3>
                        <span class="px-3 py-1 bg-orange-800/50 rounded-full text-sm">海拔: 1800-2000m | 古優種</span>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <div class="p-4 bg-black/50 rounded-lg">
                            <h4 class="text-[#c3976a] font-bold mb-2">1. 脫水期 (Drying Phase)</h4>
                            <p class="text-sm text-gray-300">日曬豆表面附著較多果膠糖分。入豆溫需比水洗豆<strong class="text-white">低 5-10°C</strong>，以防表面出現焦斑 (Scorching) 產生苦澀味。初期吸熱較慢，需耐心給熱。</p>
                        </div>
                        <div class="p-4 bg-black/50 rounded-lg">
                            <h4 class="text-[#c3976a] font-bold mb-2">2. 梅納期 (Maillard Phase)</h4>
                            <p class="text-sm text-gray-300">稍微延長梅納反應時間，這有助於強化百香果、芒果等複雜水果調性的厚實度 (Body) 與甜感。風門維持中等，帶走銀皮但保留鍋內香氣。</p>
                        </div>
                        <div class="p-4 bg-black/50 rounded-lg">
                            <h4 class="text-[#c3976a] font-bold mb-2">3. 發展期 (Development)</h4>
                            <p class="text-sm text-gray-300">日曬豆在一爆時放熱通常較劇烈。進入一爆的瞬間可適度開大風門排煙，防止煙燻味 (Smoky)。建議 <strong class="text-white">DTR 落在 13% - 15%</strong>，確保甜感發展完全。</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Slide 5: Roasting Curve Comparison -->
            <div class="slide flex-col h-full space-y-6" id="slide-5">
                <h2 class="text-3xl font-bold coffee-gradient border-b border-gray-700 pb-4">第四單元：RoR 曲線預測對照</h2>
                <div class="flex-1 flex flex-col justify-center items-center">
                    <!-- Conceptual Chart Design using CSS -->
                    <div class="w-full max-w-3xl h-64 border-l-2 border-b-2 border-gray-500 relative flex items-end mb-8">
                        <div class="absolute -left-12 top-0 text-xs text-gray-400">RoR</div>
                        <div class="absolute -bottom-6 right-0 text-xs text-gray-400">Time</div>
                        
                        <!-- Washed Gesha Curve (Blue) -->
                        <svg class="absolute w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                            <path d="M 0,10 Q 20,100 40,60 T 80,30 T 100,10" fill="none" stroke="#60a5fa" stroke-width="2" stroke-dasharray="4" />
                            <!-- Text labels for blue curve -->
                            <text x="5" y="8" fill="#60a5fa" font-size="4">水洗藝伎: 較高初始 RoR，短發展</text>
                        </svg>

                        <!-- Natural Curve (Orange) -->
                        <svg class="absolute w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                            <path d="M 0,30 Q 30,80 50,50 T 85,25 T 100,20" fill="none" stroke="#fb923c" stroke-width="2" />
                            <text x="5" y="28" fill="#fb923c" font-size="4">日曬古優: 較平緩起步，略長發展</text>
                            
                            <!-- First Crack Marker -->
                            <line x1="80" y1="0" x2="80" y2="100" stroke="white" stroke-width="0.5" stroke-dasharray="2"/>
                            <text x="75" y="95" fill="white" font-size="3">一爆 (FC)</text>
                        </svg>
                    </div>
                    
                    <div class="flex space-x-8 text-sm">
                        <div class="flex items-center"><div class="w-4 h-1 bg-blue-400 mr-2 border-dashed border-2"></div> 水洗藝伎預期曲線</div>
                        <div class="flex items-center"><div class="w-4 h-1 bg-orange-400 mr-2"></div> 日曬布穀鳥預期曲線</div>
                    </div>
                </div>
            </div>

            <!-- Slide 6: Cupping & Action Plan -->
            <div class="slide flex-col h-full space-y-6" id="slide-6">
                <h2 class="text-3xl font-bold coffee-gradient border-b border-gray-700 pb-4">第五單元：杯測驗證與行動計畫</h2>
                <div class="bg-black/40 p-8 rounded-xl border border-gray-600 flex-1 flex flex-col justify-center items-center text-center">
                    <i class="fa-solid fa-mug-hot text-5xl text-[#c3976a] mb-6"></i>
                    <h3 class="text-2xl font-bold text-white mb-4">5 鍋 1kg 訓練計畫 (1 Batch = 200g)</h3>
                    <ul class="text-left text-gray-300 space-y-4 max-w-2xl mx-auto text-lg mb-8">
                        <li><strong class="text-[#c3976a]">Batch 1 & 2：</strong> 設定基準線 (Baseline)。使用上述理論分別烘焙水洗與日曬各一鍋。</li>
                        <li><strong class="text-[#c3976a]">SCA 杯測：</strong> 烘焙後靜置 12-24 小時進行杯測。尋找「發展不足 (草本、澀)」或「發展過度 (平淡、烤麵包)」的瑕疵。</li>
                        <li><strong class="text-[#c3976a]">Batch 3 & 4：</strong> 變數微調。針對杯測結果，<span class="underline text-white">每次只改變一個變數</span> (例如：僅改變 DTR，或僅改變入豆溫)。</li>
                        <li><strong class="text-[#c3976a]">Batch 5：</strong> 完美重現 (Production Profile)。將表現最好的一鍋完整複製，測試對機器的熟練度。</li>
                    </ul>
                    <button onclick="alert('恭喜完成本次自主訓練模組！準備好您的 Tank 200，開始烘焙吧！')" class="px-8 py-3 bg-[#c3976a] hover:bg-[#a67c52] text-white font-bold rounded-full transition duration-300 shadow-lg shadow-[#c3976a]/20">
                        <i class="fa-solid fa-check mr-2"></i> 完成訓練模組
                    </button>
                </div>
            </div>

        </div>

        <!-- Navigation Controls -->
        <div class="h-16 border-t border-gray-800 flex justify-between items-center px-8 bg-black/50 rounded-b-2xl">
            <button id="prevBtn" class="text-gray-400 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed" disabled>
                <i class="fa-solid fa-arrow-left mr-2"></i> 上一頁
            </button>
            <span class="text-gray-500 font-mono"><span id="currentSlide">1</span> / 6</span>
            <button id="nextBtn" class="text-[#c3976a] hover:text-white transition">
                下一頁 <i class="fa-solid fa-arrow-right ml-2"></i>
            </button>
        </div>
    </div>

    <script>
        const slides = document.querySelectorAll('.slide');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const currentSlideEl = document.getElementById('currentSlide');
        const progressBar = document.getElementById('progress');
        
        let currentSlide = 0;
        const totalSlides = slides.length;

        function updateSlides() {
            // Hide all
            slides.forEach(slide => slide.classList.remove('active'));
            // Show current
            slides[currentSlide].classList.add('active');
            
            // Update counters and buttons
            currentSlideEl.innerText = currentSlide + 1;
            progressBar.style.width = `${((currentSlide + 1) / totalSlides) * 100}%`;
            
            prevBtn.disabled = currentSlide === 0;
            if (currentSlide === totalSlides - 1) {
                nextBtn.style.display = 'none';
            } else {
                nextBtn.style.display = 'block';
            }
        }

        prevBtn.addEventListener('click', () => {
            if (currentSlide > 0) {
                currentSlide--;
                updateSlides();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
                updateSlides();
            }
        });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') nextBtn.click();
            if (e.key === 'ArrowLeft') prevBtn.click();
        });

        // Initialize
        updateSlides();
    </script>
</body>
</html>
```


## 🖼️ 相關參考圖片與文件
![[7003-61d8ccd4c565400d.png]] ![[7003-85cc318439819f68.png]] ![[9000-b0d0d952ab8ef43b.jpg]] ![[2555777530681031145-d3ce890839589fae.png]] ![[10093408293917864137-4c73aabdd108e0ae.png]] [[Roasting_Intermediate_ProfileLog_-37207be7c8cf4ed8.pdf]] (附件檔案) ![[Gemini_Generated_Image_8ggri88ggr-44a8442c4e958641.jpg]] ![[Gemini_Generated_Image_htsu2ahtsu-e11f6500ada5b266.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-96a4cef5cc1008b1.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-be202b15b4d41e70.jpg]] ![[Gemini_Generated_Image_q59snqq59s-d7376f45389320a6.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-153057063c8c793c.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-758609cfa28db9a7.jpg]]

## 🔬 科學物理觀點解析
- *此理論卡片由 Gemini Takeout 匯出對話分析自動生成。*

## 🔗 相關理論與對話推薦
- [[2026-05-03_SCA_進階微型烘豆訓練簡報_340]] (共用特徵: `莫札特, 藝伎, gesha`)
- [[2026-01-27_請幫我規劃西達磨日曬獅子王g2，200公克，楊家500公克瓦斯半熱風烘豆機，sca_roasting認證考試，建議烘焙計_1477]] (共用特徵: `莫札特, 梅納反應, dtr`)
- [[2026-03-26_請同時給我這一支豆子在同一台機器上詳細的烘焙計畫_800]] (共用特徵: `莫札特, 藝伎, gesha`)
- [[2026-04-05_下方是楊家0.5公斤半熱風的烘豆成功案例風火配置，請幫我依據先前的經驗值，為我分析接下來在這台機器上烘焙莫札特建議的入豆_667]] (共用特徵: `莫札特, 梅納反應, dtr`)
- [[2026-02-26_明天要用之前烘獅子王的楊家半公斤的半熱風烘豆機烘果丁丁村1.4公斤，每次200公克，之前烘獅子王g2日曬每次200公克都_1191]] (共用特徵: `莫札特, 梅納反應, ror`)
