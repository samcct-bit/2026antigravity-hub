---
type: sca_theory
title: "AI 基礎與實務應用：Gemini & NotebookLM 入門"
date: 2026-04-08
tags: [coffee/sca_theory, imported/takeout]
---

# 📚 SCA 考官理論：AI 基礎與實務應用：Gemini & NotebookLM 入門

## 📋 對話理論筆記
```slides
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI 基礎與實務應用：Gemini & NotebookLM</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700&family=Inter:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        /* 核心設計原則：專業、簡潔、高對比度 */
        * { box-sizing: border-box; }
        body {
            background-color: #E2E8F0;
            display: grid;
            gap: 40px;
            grid-template-columns: 1fr;
            margin: 0;
            min-height: 100vh;
            padding: 40px 0;
            place-items: center;
        }

        .slide-container {
            align-items: center;
            background-color: #FFFFFF;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            display: flex;
            flex-direction: column;
            font-family: 'Noto Sans TC', sans-serif;
            height: 720px;
            justify-content: flex-start;
            overflow: hidden;
            padding: 60px;
            position: relative;
            width: 1280px;
        }

        /* 抽象背景設計 - 流動線條 */
        .slide-container::before {
            content: '';
            position: absolute;
            top: -10%;
            right: -10%;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, transparent 70%);
            z-index: 0;
            border-radius: 50%;
        }

        .slide-container::after {
            content: '';
            position: absolute;
            bottom: -5%;
            left: -5%;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(15, 23, 42, 0.03) 0%, transparent 70%);
            z-index: 0;
            border-radius: 50%;
        }

        .slide-container > * { position: relative; z-index: 1; }

        /* 字體樣式 */
        h1, h2, h3 { color: #0F172A; font-weight: 700; margin: 0; }
        p, li, td, th { color: #475569; font-size: 20px; line-height: 1.6; }

        .slide-title {
            font-size: 44px;
            margin-bottom: 40px;
            text-align: left;
            width: 100%;
            border-left: 8px solid #2563EB;
            padding-left: 20px;
        }

        .content-area {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            justify-content: center;
            width: 100%;
        }

        /* 標題頁樣式 */
        .title-layout { text-align: center; justify-content: center; height: 100%; }
        .title-layout h1 { font-size: 72px; color: #2563EB; margin-bottom: 20px; }
        .subtitle { font-size: 28px; color: #64748B; max-width: 800px; margin: 0 auto; }

        /* 兩欄樣式 */
        .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; width: 100%; align-items: center; }
        .image-wrapper { border-radius: 16px; overflow: hidden; box-shadow: 0 10px 20px rgba(0,0,0,0.1); height: 400px; }
        .image-wrapper img { width: 100%; height: 100%; object-fit: contain; background: #F8FAFC; }

        /* 磁磚樣式 */
        .tiled-content { display: flex; gap: 30px; width: 100%; }
        .tile { flex: 1; background: #F8FAFC; padding: 35px; border-radius: 16px; border: 1px solid #E2E8F0; text-align: center; }
        .tile .icon { font-size: 50px; color: #2563EB; margin-bottom: 20px; }
        .tile h3 { font-size: 26px; margin-bottom: 15px; }

        /* 列表樣式 */
        .bullet-list ul { list-style: none; padding: 0; }
        .bullet-list li { position: relative; padding-left: 45px; margin-bottom: 25px; font-size: 22px; }
        .bullet-list i { position: absolute; left: 0; top: 5px; color: #2563EB; font-size: 28px; }

        /* 表格樣式 */
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #0F172A; color: #FFFFFF; padding: 20px; text-align: left; font-size: 22px; }
        td { padding: 20px; border-bottom: 1px solid #E2E8F0; font-size: 20px; }
        tr:nth-child(even) { background: #F8FAFC; }

        /* 時間軸 */
        .timeline-layout { display: flex; justify-content: space-between; position: relative; padding: 40px 0; }
        .timeline-line { position: absolute; top: 50%; left: 0; width: 100%; height: 4px; background: #E2E8F0; z-index: 0; }
        .timeline-item { width: 22%; position: relative; z-index: 1; text-align: center; }
        .timeline-dot { width: 24px; height: 24px; background: #2563EB; border-radius: 50%; margin: 15px auto; border: 4px solid #FFF; }
        .timeline-item h3 { font-size: 22px; color: #2563EB; }

        /* Section Title */
        .section-title-layout { text-align: center; }
        .section-title-layout h2 { font-size: 64px; color: #0F172A; }
        .section-title-layout hr { width: 100px; height: 6px; background: #2563EB; border: none; margin: 30px auto; }

        /* Bleed Image */
        .slide-container.bleed-image-layout { grid-template-columns: repeat(2, minmax(0, 1fr)); display: grid; padding: 0; align-items: start; }
        .bleed-text-side { padding: 80px 60px; }
        .bleed-image-side { width: 100%; height: 720px; object-fit: cover; }

        /* Q&A */
        .qa-layout { text-align: center; width: 100%; }
        .qa-layout h2 { font-size: 80px; margin-bottom: 30px; color: #2563EB; }
    </style>
</head>
<body>

<!-- Slide 1: 標題頁 -->
<div class="slide-container" id="slide1">
    <div class="title-layout content-area">
        <h1>AI 基礎與實務應用</h1>
        <p class="subtitle">一般大眾的 Gemini 與 NotebookLM 入門指南：輕鬆上手，智慧生活</p>
        <div style="margin-top: 40px; color: #64748B; font-size: 20px;">
            講師：您的 AI 學習夥伴 | 課程長度：60 分鐘
        </div>
    </div>
</div>

<!-- Slide 2: 課程大綱 (Timeline) -->
<div class="slide-container" id="slide2">
    <h2 class="slide-title">一小時精彩行程</h2>
    <div class="content-area">
        <div class="timeline-layout">
            <div class="timeline-line"></div>
            <div class="timeline-item">
                <h3>認識 AI 與安全</h3>
                <div class="timeline-dot"></div>
                <p>15 分鐘</p>
            </div>
            <div class="timeline-item">
                <h3>Gemini 實戰</h3>
                <div class="timeline-dot"></div>
                <p>15 分鐘</p>
            </div>
            <div class="timeline-item">
                <h3>NotebookLM 應用</h3>
                <div class="timeline-dot"></div>
                <p>20 分鐘</p>
            </div>
            <div class="timeline-item">
                <h3>綜合練習與 Q&A</h3>
                <div class="timeline-dot"></div>
                <p>10 分鐘</p>
            </div>
        </div>
    </div>
</div>

<!-- Slide 3: Section Title 1 -->
<div class="slide-container" id="slide3">
    <div class="section-title-layout content-area">
        <p style="font-size: 24px; color: #2563EB; font-weight: bold;">PART 01</p>
        <h2>認識 AI 的本質與安全守則</h2>
        <hr>
        <p>理解 AI 的能力邊界，建立安全的使用習慣</p>
    </div>
</div>

<!-- Slide 4: 什麼是 AI？ (Image_Right_Text_Left) -->
<div class="slide-container" id="slide4">
    <h2 class="slide-title">什麼是 AI？您的智慧數位夥伴</h2>
    <div class="content-area">
        <div class="two-column">
            <div>
                <p>AI（人工智慧）就像一個博學多聞但偶爾會犯錯的助手：</p>
                <ul style="padding-left: 20px;">
                    <li style="margin-bottom: 15px;"><strong>強大的理解力：</strong> 能閱讀海量資料並整理重點。</li>
                    <li style="margin-bottom: 15px;"><strong>創意生成：</strong> 能幫您寫信、草擬計畫或發想點子。</li>
                    <li style="margin-bottom: 15px;"><strong>生成式 AI：</strong> 就像是「預測下一個字」的高手，根據機率給出答案。</li>
                </ul>
                <p style="background: #EFF6FF; padding: 15px; border-radius: 8px; font-style: italic;">
                    提示：AI 不是搜尋引擎，它是在「對話」中解決問題。
                </p>
            </div>
            <div class="image-wrapper">
                <img src="http://googleusercontent.com/image_collection/image_retrieval/8099787839380188272" alt="Friendly AI Concept">
            </div>
        </div>
    </div>
</div>

<!-- Slide 5: 使用而不依賴 (Tiled_Text_With_Icons) -->
<div class="slide-container" id="slide5">
    <h2 class="slide-title">聰明使用而不產生「AI 依賴」</h2>
    <div class="content-area">
        <div class="tiled-content">
            <div class="tile">
                <div class="icon"><i class="fa-solid fa-brain"></i></div>
                <h3>保持批判思考</h3>
                <p>AI 有時會「一本正經胡說八道」（幻覺）。永遠要檢查重要資訊的真實性。</p>
            </div>
            <div class="tile">
                <div class="icon"><i class="fa-solid fa-magnifying-glass"></i></div>
                <h3>查證與輔助</h3>
                <p>將 AI 視為「草稿機」而非「最終裁判」。將節省的時間用來做深度查證。</p>
            </div>
            <div class="tile">
                <div class="icon"><i class="fa-solid fa-pencil"></i></div>
                <h3>保留個人風格</h3>
                <p>利用 AI 激發靈感，但加入您的獨特見解與情感，讓內容更具溫度。</p>
            </div>
        </div>
    </div>
</div>

<!-- Slide 6: 資安與個資 (Styled_Bullet_Points) -->
<div class="slide-container" id="slide6">
    <h2 class="slide-title">資訊安全與個資防護：三不原則</h2>
    <div class="content-area">
        <div class="two-column">
            <div class="bullet-list">
                <ul>
                    <li><i class="fa-solid fa-user-secret"></i> <strong>不輸入私密個資：</strong> 地址、身份證字號、信用卡號等絕對不輸入對話框。</li>
                    <li><i class="fa-solid fa-briefcase"></i> <strong>不提供公司機密：</strong> 商業合約、研發資料應避免上傳至公共 AI 服務。</li>
                    <li><i class="fa-solid fa-eye-slash"></i> <strong>關閉活動紀錄：</strong> 若有隱私考量，可於設定中關閉「Gemini 應用程式活動」。</li>
                </ul>
            </div>
            <div class="image-wrapper" style="height: 350px;">
                <img src="http://googleusercontent.com/image_collection/image_retrieval/7504821527278033659" alt="Cybersecurity Shield">
            </div>
        </div>
    </div>
</div>

<!-- Slide 7: Section Title 2 -->
<div class="slide-container" id="slide7">
    <div class="section-title-layout content-area">
        <p style="font-size: 24px; color: #2563EB; font-weight: bold;">PART 02</p>
        <h2>Google Gemini 實戰入門</h2>
        <hr>
        <p>全方位的對話式 AI，解決生活大小事</p>
    </div>
</div>

<!-- Slide 8: Gemini 介面導覽 (Bleed_Image_Right) -->
<div class="slide-container bleed-image-layout" id="slide8">
    <div class="bleed-text-side">
        <h2 class="slide-title" style="border: none; padding: 0;">Gemini 介面與登入</h2>
        <p><strong>如何開始：</strong></p>
        <ul style="font-size: 18px; margin-bottom: 20px;">
            <li>網址：<span style="color: #2563EB;">gemini.google.com</span></li>
            <li>登入：使用您的 Google 帳號即可免費開始。</li>
        </ul>
        <p><strong>介面重點：</strong></p>
        <div class="bullet-list" style="font-size: 18px;">
            <ul>
                <li><i class="fa-solid fa-comment" style="font-size: 20px;"></i> <strong>對話框：</strong> 在下方輸入指令 (Prompt)。</li>
                <li><i class="fa-solid fa-history" style="font-size: 20px;"></i> <strong>側邊欄：</strong> 管理過往的對話紀錄。</li>
                <li><i class="fa-solid fa-gear" style="font-size: 20px;"></i> <strong>設定：</strong> 切換深淺模式與隱私控管。</li>
            </ul>
        </div>
    </div>
    <img src="http://googleusercontent.com/image_collection/image_retrieval/17478912726574806404" class="bleed-image-side" alt="Gemini UI Screenshot">
</div>

<!-- Slide 9: Gemini 功能練習 (Table) -->
<div class="slide-container" id="slide9">
    <h2 class="slide-title">常見功能介紹與小練習</h2>
    <div class="content-area">
        <table>
            <thead>
                <tr>
                    <th>應用場景</th>
                    <th>您可以這樣說 (指令範例)</th>
                    <th>建議練習項目</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>生活助手</strong></td>
                    <td>「請幫我規劃台北三天兩夜不開車的旅遊行程。」</td>
                    <td>規劃週末晚餐菜單</td>
                </tr>
                <tr>
                    <td><strong>文件處理</strong></td>
                    <td>「幫我把這段文字摘要成 100 字以內的重點。」</td>
                    <td>總結一篇長文章</td>
                </tr>
                <tr>
                    <td><strong>創意發想</strong></td>
                    <td>「我想寫一張送給長輩的生日卡片，語氣要親切感人。」</td>
                    <td>草擬工作辭呈或求職信</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<!-- Slide 10: Section Title 3 -->
<div class="slide-container" id="slide10">
    <div class="section-title-layout content-area">
        <p style="font-size: 24px; color: #2563EB; font-weight: bold;">PART 03</p>
        <h2>NotebookLM 知識管理</h2>
        <hr>
        <p>讓 AI 讀完資料，為您量身打造的知識庫</p>
    </div>
</div>

<!-- Slide 11: NotebookLM 介紹 (Image_Right_Text_Left) -->
<div class="slide-container" id="slide11">
    <h2 class="slide-title">NotebookLM：私人筆記與研究助手</h2>
    <div class="content-area">
        <div class="two-column">
            <div>
                <p>不同於一般聊天 AI，它「只會」根據您提供的資料回答：</p>
                <ul style="padding-left: 20px;">
                    <li style="margin-bottom: 15px;"><strong>上傳來源：</strong> 可放入 PDF、Google 文件或網址。</li>
                    <li style="margin-bottom: 15px;"><strong>精準對答：</strong> 只針對資料內容回答，減少幻覺風險。</li>
                    <li style="margin-bottom: 15px;"><strong>自動摘要：</strong> 快速生成該筆記的導覽摘要。</li>
                </ul>
                <div style="background: #FFFBEB; padding: 15px; border-radius: 8px; border: 1px solid #FDE68A;">
                    <strong>特色功能：</strong> 點擊答案旁的引註，可直接跳回原始文件出處。
                </div>
            </div>
            <div class="image-wrapper">
                <img src="http://googleusercontent.com/image_collection/image_retrieval/12768523723546571093" alt="NotebookLM Sources UI">
            </div>
        </div>
    </div>
</div>

<!-- Slide 12: Q&A -->
<div class="slide-container" id="slide12">
    <div class="qa-layout content-area">
        <div class="icon" style="font-size: 60px; color: #2563EB; margin-bottom: 20px;">
            <i class="fa-solid fa-comments-question"></i>
        </div>
        <h2>問與答時間</h2>
        <p>您的第一步：現在就登入嘗試吧！</p>
        <div style="margin-top: 50px; display: flex; justify-content: center; gap: 40px;">
            <div style="text-align: left; padding: 20px; border-left: 4px solid #E2E8F0;">
                <p style="font-weight: bold; margin-bottom: 5px;">Gemini</p>
                <small>gemini.google.com</small>
            </div>
            <div style="text-align: left; padding: 20px; border-left: 4px solid #E2E8F0;">
                <p style="font-weight: bold; margin-bottom: 5px;">NotebookLM</p>
                <small>notebooklm.google.com</small>
            </div>
        </div>
    </div>
</div>

</body>
</html>
```

## 🖼️ 理論參考圖片
![[Gemini_Generated_Image_8ggri88ggr-44a8442c4e958641.jpg]] ![[Gemini_Generated_Image_htsu2ahtsu-e11f6500ada5b266.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-96a4cef5cc1008b1.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-be202b15b4d41e70.jpg]] ![[Gemini_Generated_Image_q59snqq59s-d7376f45389320a6.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-153057063c8c793c.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-758609cfa28db9a7.jpg]] ![[7003-61d8ccd4c565400d.png]] ![[7003-85cc318439819f68.png]] ![[10093408293917864137-4c73aabdd108e0ae.png]] ![[IMG20260405202251-d26edf580f6611b8.jpg]] ![[IMG_0016-1381311bbb20b6d0.jpg]] ![[IMG_0020-259844b3aec492b8.png]] ![[IMG_0021-259844b3aec492b8.png]] ![[IMG_0022-259844b3aec492b8.jpg]] ![[IMG_0024-259844b3aec492b8.jpg]] ![[IMG_0025-259844b3aec492b8.png]] ![[IMG_0025-63235577b267a9cf.png]] ![[image_5bd301-a2e77f6c827bfe5a.png]] ![[image_db3f9f-6b6329d1c4cb4e92.png]]

## 🔗 相關理論與對話推薦
- [[2026-03-26_Tank_200_專屬校正與直火實戰_812]] (共用特徵: `tp, fc, bullet`)
- [[2026-03-01_SlideCraft_AI_1139]] (共用特徵: `tp, fc, bullet`)
- [[2026-05-08_動物的生存秘密網站企劃_268]] (共用特徵: `tp, fc, bullet`)
- [[AI_基礎與實務應用：Gemini_&_NotebookLM_入門]] (共用特徵: `tp, fc, bullet`)
- [[SlideCraft_AI]] (共用特徵: `tp, fc, bullet`)
