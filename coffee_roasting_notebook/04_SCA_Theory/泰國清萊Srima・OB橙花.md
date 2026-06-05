---
type: sca_theory
title: "泰國清萊Srima・OB橙花"
date: 2026-04-13
tags: [coffee/sca_theory, imported/takeout]
---

# 📚 SCA 考官理論：泰國清萊Srima・OB橙花

## 📋 對話理論紀錄
```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>泰國 清萊Srima・OB橙花 | 金成淬精選</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'zen-white': '#FAFAFA',
                        'ink-gray': '#2C2C2C',
                        'alchemy-gold': '#B8905B',
                    },
                    fontFamily: {
                        serif: ['"Noto Serif TC"', 'serif']
                    }
                }
            }
        }
    </script>
    <style>
        body { background-color: #FAFAFA; }
        .fade-in-up { 
            opacity: 0; 
            transform: translateY(30px); 
            transition: opacity 1s ease-out, transform 1s ease-out; 
        }
        .fade-in-up.is-visible { 
            opacity: 1; 
            transform: none; 
        }
        .writing-vertical {
            writing-mode: vertical-rl;
            text-orientation: mixed;
        }
        /* 宣紙紋理疊加層 */
        .paper-texture {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            opacity: 0.4;
            pointer-events: none;
            z-index: 50;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E");
        }
    </style>
</head>
<body class="text-ink-gray font-serif antialiased selection:bg-alchemy-gold selection:text-white">
    <div class="paper-texture"></div>

    <!-- 首屏 Logo 與 意境 -->
    <header class="relative min-h-[75vh] flex flex-col items-center justify-center px-4 pt-16 pb-12 overflow-hidden">
        
        <!-- 強制指定的 Logo 區塊 (一字不漏) -->
        <div class="w-32 h-32 mb-4 relative flex items-center justify-center">
            <img src="https://lh3.googleusercontent.com/d/1B82p7LcB66OSw61u-TH6UIC-g3LnuJ4M" 
                 alt="金成淬 Logo" 
                 class="w-full h-full object-contain mix-blend-multiply brightness-110 contrast-125 grayscale"
                 onerror="this.style.display='none'; document.getElementById('logo-fallback').style.display='flex';">
                 
            <div id="logo-fallback" class="hidden w-28 h-28 rounded-full border-2 border-gray-800 flex-col items-center justify-center relative">
                <div class="absolute inset-1 rounded-full border border-gray-800 opacity-30"></div>
                <div class="text-center leading-tight mt-1">
                    <span class="block text-xs font-bold tracking-widest text-gray-800">金成</span>
                    <span class="block text-3xl font-bold my-1 text-gray-800">淬</span>
                    <span class="block text-xs font-bold tracking-widest text-gray-800">成金</span>
                </div>
            </div>
        </div>

        <div class="fade-in-up flex flex-col items-center mt-12 z-10 text-center">
            <span class="text-alchemy-gold tracking-[0.4em] text-sm mb-6 border-b border-alchemy-gold/30 pb-2">金成淬 · 淬成金</span>
            <h1 class="text-3xl md:text-5xl font-light tracking-[0.2em] leading-relaxed mb-6">
                隱於泰北群山<br>淬取純淨之花
            </h1>
            <p class="text-lg md:text-xl text-ink-gray/60 tracking-widest font-light">
                清萊 Srima 莊園 · 雙重厭氧蜜處理
            </p>
        </div>

        <!-- 禪意垂直裝飾線 -->
        <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[1px] h-24 bg-gradient-to-b from-alchemy-gold to-transparent"></div>
    </header>

    <main class="max-w-4xl mx-auto px-6 py-16 space-y-32">
        
        <!-- 實體標籤視覺化卡片 (80mm x 50mm 比例延伸) -->
        <section class="fade-in-up" id="label">
            <div class="relative bg-white p-10 md:p-16 border border-ink-gray/10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] mx-auto max-w-2xl">
                <!-- 裝飾角 -->
                <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-alchemy-gold"></div>
                <div class="absolute top-0 right-0 w-4 h-4 border-t border-r border-alchemy-gold"></div>
                <div class="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-alchemy-gold"></div>
                <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-alchemy-gold"></div>

                <div class="text-center mb-12">
                    <h2 class="text-2xl md:text-3xl font-medium tracking-widest text-ink-gray mb-3">泰國 清萊 Srima 莊園</h2>
                    <p class="text-alchemy-gold tracking-[0.3em] font-light">OB橙花・雙重厭氧蜜處理</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 border-y border-ink-gray/10 py-8 mb-10 text-sm md:text-base">
                    <div class="flex justify-between items-center">
                        <span class="text-ink-gray/50 tracking-widest">產區</span>
                        <span class="tracking-widest font-medium">泰國 清萊</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-ink-gray/50 tracking-widest">海拔</span>
                        <span class="tracking-widest font-medium">1400-1600m</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-ink-gray/50 tracking-widest">處理</span>
                        <span class="tracking-widest font-medium">雙重厭氧蜜處理</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-ink-gray/50 tracking-widest">品種</span>
                        <span class="tracking-widest font-medium">Caturra</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-ink-gray/50 tracking-widest">烘焙</span>
                        <span class="tracking-widest font-medium">淺焙</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-ink-gray/50 tracking-widest">日期</span>
                        <span class="tracking-widest font-medium">2026.04.13</span>
                    </div>
                </div>

                <div class="space-y-4 text-center md:text-left flex flex-col items-center">
                    <div class="grid grid-cols-[80px_1fr] items-center w-full max-w-sm gap-4">
                        <span class="text-alchemy-gold border border-alchemy-gold rounded-sm py-1 text-xs tracking-widest text-center">初韻</span>
                        <span class="tracking-widest font-light">橙花綻放、柚子清香</span>
                    </div>
                    <div class="grid grid-cols-[80px_1fr] items-center w-full max-w-sm gap-4">
                        <span class="text-alchemy-gold border border-alchemy-gold rounded-sm py-1 text-xs tracking-widest text-center">中調</span>
                        <span class="tracking-widest font-light">幽雅茉莉、蜜糖甜感</span>
                    </div>
                    <div class="grid grid-cols-[80px_1fr] items-center w-full max-w-sm gap-4">
                        <span class="text-alchemy-gold border border-alchemy-gold rounded-sm py-1 text-xs tracking-widest text-center">尾韻</span>
                        <span class="tracking-widest font-light">溫潤醇厚、細緻果脂</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- 品牌行銷文案 -->
        <section class="fade-in-up max-w-2xl mx-auto text-center" id="story">
            <div class="mb-8">
                <span class="inline-block w-1 h-1 bg-alchemy-gold rounded-full mx-1"></span>
                <span class="inline-block w-1 h-1 bg-alchemy-gold rounded-full mx-1 opacity-50"></span>
                <span class="inline-block w-1 h-1 bg-alchemy-gold rounded-full mx-1 opacity-20"></span>
            </div>
            <div class="space-y-8 text-lg md:text-xl text-ink-gray/80 leading-[2.5] font-light tracking-[0.1em] text-justify md:text-center px-4">
                <p>來自泰國清萊海拔 1600 公尺的 Srima 莊園，<br class="hidden md:inline">透過繁複而克制的<span class="text-alchemy-gold mx-1">「雙重厭氧蜜處理」</span>，<br class="hidden md:inline">將高山裡純淨的白花香氣，完美封存於這支 Caturra 之中。</p>
                <p>研磨的瞬間，宛如走入初春的橙花林，伴隨著明亮的柚子微光；<br class="hidden md:inline">熱水傾注，幽雅的茉莉花香與蜂蜜的甜感在杯中緩緩舒展。</p>
                <p class="text-ink-gray font-medium pt-8">「入喉溫潤，如飲一口山間晨露，於極簡的禪意中，品味大自然的豐盛。」</p>
            </div>
        </section>

        <!-- 考官沖煮建議 -->
        <section class="fade-in-up" id="brewing">
            <div class="border border-ink-gray/10 p-8 md:p-12 relative">
                <h3 class="text-xl tracking-[0.3em] text-center mb-10 text-ink-gray flex items-center justify-center gap-4">
                    <span class="w-8 h-[1px] bg-alchemy-gold"></span>
                    SCA 考官沖煮指引
                    <span class="w-8 h-[1px] bg-alchemy-gold"></span>
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div class="p-6">
                        <div class="text-alchemy-gold text-3xl mb-4 font-light">88<span class="text-lg">°C</span></div>
                        <h4 class="font-medium tracking-widest mb-3">水溫控制</h4>
                        <p class="text-sm text-ink-gray/60 leading-relaxed font-light">雙重厭氧豆質易萃取，略低水溫能避免過度發酵味，保留橙花與茉莉最純淨的上揚香氣。</p>
                    </div>
                    <div class="p-6 md:border-x border-ink-gray/10">
                        <div class="text-alchemy-gold text-xl mb-4 tracking-widest font-light h-9 flex items-center justify-center">中偏粗</div>
                        <h4 class="font-medium tracking-widest mb-3">研磨度</h4>
                        <p class="text-sm text-ink-gray/60 leading-relaxed font-light">建議比一般淺焙豆調粗半格至一格，讓水流順暢通過，維持極致乾淨的口感。</p>
                    </div>
                    <div class="p-6">
                        <div class="text-alchemy-gold text-xl mb-4 tracking-widest font-light h-9 flex items-center justify-center">柔和慢注</div>
                        <h4 class="font-medium tracking-widest mb-3">流速手法</h4>
                        <p class="text-sm text-ink-gray/60 leading-relaxed font-light">採 1:15 粉水比。中心小水流輕柔注水，減少擾動，讓蜜甜與柚香層層遞進舒展。</p>
                    </div>
                </div>
            </div>
        </section>

    </main>

    <footer class="mt-24 pb-12 pt-16 border-t border-ink-gray/5 flex flex-col items-center">
        <p class="text-ink-gray font-medium tracking-[0.3em] mb-4 text-sm">金成淬 ALCHEMY OF REFINEMENT</p>
        <p class="text-ink-gray/40 text-xs tracking-widest font-light">自然 · 禪意 · 專業 · 淬煉</p>
    </footer>

    <script>
        // 簡單的滾動淡入動畫
        document.addEventListener("DOMContentLoaded", function() {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => { 
                    if (entry.isIntersecting) { 
                        entry.target.classList.add('is-visible'); 
                        obs.unobserve(entry.target); 
                    } 
                });
            }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
            
            document.querySelectorAll('.fade-in-up').forEach(sec => observer.observe(sec));
        });
    </script>
</body>
</html>
```


## 🖼️ 相關參考圖片與文件
![[7003-61d8ccd4c565400d.png]] ![[7003-85cc318439819f68.png]] ![[image_5bd301-a2e77f6c827bfe5a.png]] ![[image_db3f9f-6b6329d1c4cb4e92.png]] ![[10093408293917864137-4c73aabdd108e0ae.png]] ![[IMG20260405202251-d26edf580f6611b8.jpg]] ![[IMG_0016-1381311bbb20b6d0.jpg]] ![[IMG_0020-259844b3aec492b8.png]] ![[IMG_0021-259844b3aec492b8.png]] ![[IMG_0022-259844b3aec492b8.jpg]] ![[IMG_0024-259844b3aec492b8.jpg]] ![[IMG_0025-259844b3aec492b8.png]] ![[IMG_0025-63235577b267a9cf.png]] ![[14008462579978004516-578406f068f1819c.png]] [[2026烘豆機選購指南-acd668a8e22d7335.pdf]] (附件檔案) ![[16009922497231620712-d01b1744e5213582.png]] [[New Note-d803819e815fe0e1]] (附件檔案) ![[Gemini_Generated_Image_8ggri88ggr-44a8442c4e958641.jpg]] ![[Gemini_Generated_Image_htsu2ahtsu-e11f6500ada5b266.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-96a4cef5cc1008b1.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-be202b15b4d41e70.jpg]] ![[Gemini_Generated_Image_q59snqq59s-d7376f45389320a6.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-153057063c8c793c.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-758609cfa28db9a7.jpg]]

## 🔬 科學物理觀點解析
- *此理論卡片由 Gemini Takeout 匯出對話分析自動生成。*

## 🔗 相關理論與對話推薦
- [[2026-02-16_根據前幾鍋的經驗，即使入豆溫高達195度，回溫點低至73，入豆溫降至170度，回溫點更是低到66度，按照您的建議180度_1289]] (共用特徵: `莫札特, 橙花, srima`)
- [[2026-03-26_請同時給我這一支豆子在同一台機器上詳細的烘焙計畫_800]] (共用特徵: `莫札特, 橙花, srima`)
- [[2026-04-22_SCA烘焙訓練：泰國Srima雙重厭氧蜜處理_457]] (共用特徵: `莫札特, 橙花, srima`)
- [[2026-04-22_泰國Srima_微調莫札特曲線_烘焙計畫表_455]] (共用特徵: `莫札特, 橙花, srima`)
- [[2026-04-25_泰國橙花_第一鍋曲線解析與風味預測_414]] (共用特徵: `莫札特, 橙花, srima`)
