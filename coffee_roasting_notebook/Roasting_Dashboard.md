# ☕ 金成淬 · 精品咖啡烘焙駕駛艙 (Coffee Roasting Dashboard)

> [!NOTE]
> 歡迎使用您的專屬烘焙大腦。本頁面集合了 SCA 咖啡證照理論、物理烘焙參數、風火操作日誌。
> *提示：本儀表板需啟用 Obsidian **Dataview** 外掛，即可自動彙整所有生豆與烘焙筆記。*

---

## 🟢 1. 生豆倉庫庫存 (Green Bean Inventory)
> [!TIP]
> 點選下方生豆連結，可直接查閱物理參數（含水率、密度）與 SCA 考官推薦初始風火配置。

```dataview
TABLE origin as "產區", estate as "莊園/處理廠", process as "處理法", variety as "品種", cup_score as "SCA 分數"
FROM #coffee/green_bean
SORT cup_score DESC
```

---

## 📉 2. 歷史烘焙操作日誌 (Recent Roasting Logs)
> [!IMPORTANT]
> 以下列出最近 10 次的烘焙實驗紀錄。DTR (發展時間比) 是控管淺焙花果香與甜感的物理核心指標。

```dataview
TABLE date as "烘焙日期", machine as "烘豆設備", bean as "烘焙生豆", charge_temp as "入豆溫 (°C)", drop_temp as "出豆溫 (°C)", dtr_ratio as "DTR %", loss_ratio as "失重比 %"
FROM #coffee/roasting_log
SORT date DESC
LIMIT 10
```

---

## 🔥 3. 標準烘焙風火配置 (Roasting Profiles SOP)
> [!CAUTION]
> 進行批量烘焙前，請先查閱特定烘豆機的標準風火操作流程 (SOP)。

```dataview
TABLE machine as "適用烘豆機", roast_level as "焙度", charge_mass_g as "批量重量 (g)", target_dtr_ratio as "目標 DTR"
FROM #coffee/roasting_profile
SORT machine ASC, roast_level ASC
```

---

## 📚 4. SCA 咖啡烘焙認證考官知識庫 (SCA Roasting Knowledge Base)
> [!NOTE]
> 與專屬 SCA 考官 Gem 的對話中，整理出的高價值核心理論與化學反應：

- 🧪 **梅納反應 (Maillard Reaction)**
  - *關鍵區間*: 150°C ➔ 170°C。
  - *控制重點*: 延長此階段可增加烘焙咖啡的醇厚度 (Body) 與複雜的堅果/焦糖香氣；過長則會導致風味扁平 (Baked)。
- 🌾 **焦糖化反應 (Caramelization)**
  - *關鍵區間*: 170°C ➔ 一爆開始。
  - *控制重點*: 蔗糖在高溫下裂解，產生焦糖甜感與微苦平衡，也是酸質轉化為甜感的重要物理過程。
- 📉 **升溫率 ROR (Rate of Rise) 控管物理**
  - *黃金守則*: **ROR 必須全程保持穩定遞減**。
  - *異常提醒*: 避免一爆前火力過低導致 ROR 墜毀 (Crash)，或一爆中過熱導致失控 (Flick)。這兩者皆會引發乾焦雜苦或死甜無香。

---

## 🚀 常用操作捷徑
* [📄 點此建立全新「生豆庫存」](obsidian://new?parent=coffee_roasting_notebook/01_Green_Beans&template=Green_Bean_Template)
* [📄 點此建立全新「烘焙日誌」](obsidian://new?parent=coffee_roasting_notebook/02_Roasting_Logs&template=Roasting_Log_Template)
* [📄 點此建立全新「風火曲線」](obsidian://new?parent=coffee_roasting_notebook/03_Roasting_Profiles&template=Roasting_Profile_Template)
