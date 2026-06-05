---
type: roasting_log
date: 2026-06-01
machine: ""
charge_temp: 
drop_temp: 
dtr_ratio: ""
tags: [coffee/roasting_log, imported/takeout]
id: roast_obs_1780636746411
---

# ☕ 匯入日誌：RoastCraft AI 智慧烘焙大師工作站

## 📊 對話數據記錄
```react
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine, Legend 
} from 'recharts';
import { 
  Play, Square, Clipboard, RefreshCw, Coffee, Timer, 
  RotateCcw, Flame, CheckCircle2, FileDown, AlertTriangle, Sparkles, 
  Bot, X, ScrollText, Trash2, Database, Eye, BookOpen, 
  Sliders, Volume2, VolumeX, Save, HelpCircle, Award,
  Scale, Droplets, Bell, Keyboard, Calendar, Star, ChevronRight
} from 'lucide-react';

const BEAN_COLORS = [
  { temp: 0, color: '#889e81', name: '生豆 Green' },
  { temp: 130, color: '#a2b380', name: '脫水 Drying' },
  { temp: 155, color: '#cbd18f', name: '轉黃 Yellowing' },
  { temp: 170, color: '#d4b26f', name: '一爆前 Pre-First Crack' },
  { temp: 190, color: '#a67c4e', name: '一爆開始 First Crack' },
  { temp: 205, color: '#7c532b', name: '發展中 Development' },
  { temp: 215, color: '#4a2f13', name: '二爆 Second Crack' },
  { temp: 225, color: '#2b1a08', name: '深烘焙 Dark Roast' },
];

const DEFAULT_API_KEY = "";

export default function App() {
  // 核心控制
  const [isRoasting, setIsRoasting] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); 
  const [isPaused, setIsPaused] = useState(false);
  
  // 烘焙設定
  const [beanName, setBeanName] = useState('衣索比亞 耶加雪菲 G1');
  const [chargeTemp, setChargeTemp] = useState('200');
  const [batchWeight, setBatchWeight] = useState('150'); 
  const [environmentTemp, setEnvironmentTemp] = useState('25'); 

  // 模式切換：預設為 FALSE (手動實機烘豆模式)
  const [isSimulatorMode, setIsSimulatorMode] = useState(false);

  // 【核心功能】30秒結構化登錄表單資料庫 (鍵值為秒數, 如 30, 60, 90, 120... 數值為溫度字串)
  const [ledger, setLedger] = useState({});
  // 30秒整點對應的烘焙事件 (如 { 30: 'turningPoint', 300: 'fcStart' })
  const [ledgerEvents, setLedgerEvents] = useState({});

  // 模擬器專用狀態
  const [simHeat, setSimHeat] = useState(80); 
  const [simAirflow, setSimAirflow] = useState(30); 
  const [simBeanTemp, setSimBeanTemp] = useState(200); 

  // 最大預建置時間軸 (預設 15 分鐘，即 900 秒)
  const [maxIntervalSeconds, setMaxIntervalSeconds] = useState(900);

  // 語音與音效輔助
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [audioBeepEnabled, setAudioBeepEnabled] = useState(true);
  const [lastReminderTime, setLastReminderTime] = useState(-1);

  // 歷史資料庫
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [referenceProfile, setReferenceProfile] = useState(null);
  const [selectedProfileForView, setSelectedProfileForView] = useState(null);
  
  // 彈出視窗與通知
  const [notification, setNotification] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [activeAiTab, setActiveAiTab] = useState('analysis'); 
  const [aiResult, setAiResult] = useState(""); 
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [brewingResult, setBrewingResult] = useState(""); 
  const [isBrewingAnalyzing, setIsBrewingAnalyzing] = useState(false);
  const [userApiKey, setUserApiKey] = useState(""); 
  const [roastRating, setRoastRating] = useState(8);
  const [roastNotes, setRoastNotes] = useState('');

  // 手沖計算機
  const [brewCoffeeWeight, setBrewCoffeeWeight] = useState(15);
  const [brewRatio, setBrewRatio] = useState(15); 

  // UI 分頁切換 (左側欄：'ledger' 記錄表單 | 'config' 烘焙計畫)
  const [leftTab, setLeftTab] = useState('ledger');

  const timerRef = useRef(null);
  const simIntervalRef = useRef(null);
  const scrollRef = useRef(null);

  // 載入 localStorage
  useEffect(() => {
    const loaded = localStorage.getItem('roastcraft_v3_profiles');
    if (loaded) {
      try { setSavedProfiles(JSON.parse(loaded)); } catch (e) { console.error(e); }
    }
  }, []);

  const saveToLocalStorage = (newProfiles) => {
    setSavedProfiles(newProfiles);
    localStorage.setItem('roastcraft_v3_profiles', JSON.stringify(newProfiles));
  };

  // 嗶聲合成器
  const playBeep = () => {
    if (!audioBeepEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 900; 
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) { console.warn(e); }
  };

  // 語音引擎
  const speak = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-TW';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) { console.warn(e); }
  };

  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined || isNaN(seconds)) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 生成每 30 秒一個間隔的時間清單
  const timeIntervals = useMemo(() => {
    const arr = [];
    for (let s = 30; s <= maxIntervalSeconds; s += 30) {
      arr.push(s);
    }
    return arr;
  }, [maxIntervalSeconds]);

  // 【核心升級】即時將 30s 登錄表單與入豆溫轉化為折線圖所需之 roastData 陣列，並在 runtime 精算 RoR！
  const roastData = useMemo(() => {
    const data = [{ timeStr: '00:00', timeSeconds: 0, temp: parseFloat(chargeTemp) || 200, ror: 0 }];
    
    // 取出所有已有輸入溫度的 30 秒整點
    const activeSeconds = Object.keys(ledger)
      .map(Number)
      .sort((a, b) => a - b);

    activeSeconds.forEach((sec) => {
      const tempVal = parseFloat(ledger[sec]);
      if (isNaN(tempVal)) return;

      const prevPoint = data[data.length - 1];
      let ror = 0;
      if (prevPoint) {
        const timeDiff = sec - prevPoint.timeSeconds;
        if (timeDiff > 0) {
          // RoR 標準公式: (當前溫度 - 前一溫度) / 時間差(秒) * 60秒
          ror = Math.round(((tempVal - prevPoint.temp) / timeDiff) * 60 * 10) / 10;
        }
      }

      data.push({
        timeStr: formatTime(sec),
        timeSeconds: sec,
        temp: tempVal,
        ror
      });
    });

    return data;
  }, [ledger, chargeTemp]);

  // 動態判定目前的烘焙事件點 (用於計算 DTR 與 AI 使用)
  const events = useMemo(() => {
    const result = {
      turningPoint: null,
      yellowing: null,
      fcStart: null,
      fcEnd: null,
      scStart: null,
      scEnd: null,
      drop: null
    };

    Object.entries(ledgerEvents).forEach(([secStr, eventKey]) => {
      const sec = Number(secStr);
      if (result[eventKey] === null || result[eventKey].timeSeconds < sec) {
        result[eventKey] = {
          timeStr: formatTime(sec),
          timeSeconds: sec
        };
      }
    });

    return result;
  }, [ledgerEvents]);

  // 計算 DTR 發展時間比率
  const calculateDtr = () => {
    if (!events.fcStart) return "0.0%";
    const fcSec = events.fcStart.timeSeconds;
    const endSec = events.drop ? events.drop.timeSeconds : elapsedTime;
    if (endSec <= fcSec) return "0.0%";
    const devSec = endSec - fcSec;
    const dtr = (devSec / endSec) * 100;
    return `${dtr.toFixed(1)}%`;
  };

  // 取得目前時間最接近的 30 秒整點，以此來引導高亮輸入格
  const activeFocusInterval = useMemo(() => {
    if (!isRoasting) return null;
    const remainder = Math.floor(elapsedTime) % 30;
    const base = Math.floor(elapsedTime) - remainder;
    const target = remainder >= 15 ? base + 30 : base;
    return target > 0 ? target : 30;
  }, [elapsedTime, isRoasting]);

  // 30秒定時提醒偵測
  useEffect(() => {
    if (isRoasting && !isPaused) {
      const elapsedInt = Math.floor(elapsedTime);
      if (elapsedInt > 0 && elapsedInt % 30 === 0 && elapsedInt !== lastReminderTime) {
        setLastReminderTime(elapsedInt);
        playBeep();
        speak(`請記錄 ${formatTime(elapsedInt)} 溫度`);
        showToast(`⏰ 達 ${formatTime(elapsedInt)} 登錄時間！`, "success");
      }

      // 當烘焙時間即將超出目前最大長度時，自動延長 2 分鐘
      if (elapsedTime > maxIntervalSeconds - 15) {
        setMaxIntervalSeconds(prev => prev + 120);
      }
    }
  }, [elapsedTime, isRoasting, isPaused, lastReminderTime, maxIntervalSeconds]);

  // 咖啡豆物理變色追蹤
  const currentBeanColor = useMemo(() => {
    const currentTemp = roastData[roastData.length - 1]?.temp || parseFloat(chargeTemp) || 200;
    let selected = BEAN_COLORS[0];
    for (let i = 0; i < BEAN_COLORS.length; i++) {
      if (currentTemp >= BEAN_COLORS[i].temp) {
        selected = BEAN_COLORS[i];
      }
    }
    return selected;
  }, [roastData, chargeTemp]);

  // 模擬器熱力學微分步進 (僅在模擬模式啟用時生效)
  const runSimulationStep = () => {
    setElapsedTime(prev => {
      const nextTime = prev + 1;
      setSimBeanTemp(currentTemp => {
        let ror = 0;
        if (nextTime < 60) {
          const dropFactor = (nextTime / 60);
          const targetTp = 95 + (parseFloat(environmentTemp) * 0.1); 
          const diff = parseFloat(chargeTemp) - targetTp;
          ror = -diff * Math.exp(-3 * dropFactor) * 0.05;
        } else {
          const baseHeatTransfer = (simHeat * 0.35) - (simAirflow * 0.12);
          const heatResistance = (currentTemp - 100) * 0.04;
          let reactionHeat = 0;
          if (currentTemp >= 150 && currentTemp < 170) reactionHeat = -1.2;
          else if (currentTemp >= 190 && currentTemp < 198) reactionHeat = 2.0;
          else if (currentTemp >= 215) reactionHeat = 2.8;

          ror = baseHeatTransfer - heatResistance + reactionHeat;
          ror = Math.max(-5, Math.min(ror, 30));
        }

        const nextTemp = Math.round((currentTemp + (ror / 60)) * 10) / 10;
        
        // 模擬模式：自動在 30 秒整點將溫度填入表單
        if (nextTime % 30 === 0) {
          setLedger(prevLedger => ({
            ...prevLedger,
            [nextTime]: nextTemp.toString()
          }));
        }

        // 模擬模式：自動觸發轉黃或一爆事件
        if (nextTime === 60) setLedgerEvents(prev => ({ ...prev, 60: 'turningPoint' }));
        if (nextTemp >= 155 && nextTemp < 156.5) setLedgerEvents(prev => ({ ...prev, [nextTime]: 'yellowing' }));
        if (nextTemp >= 191 && nextTemp < 192.5) setLedgerEvents(prev => ({ ...prev, [nextTime]: 'fcStart' }));

        return nextTemp;
      });
      return nextTime;
    });
  };

  // 計時器 Effect
  useEffect(() => {
    if (isRoasting && !isPaused) {
      if (isSimulatorMode) {
        simIntervalRef.current = setInterval(runSimulationStep, 1000);
      } else {
        timerRef.current = setInterval(() => {
          setElapsedTime(prev => prev + 1);
        }, 1000);
      }
    }
    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRoasting, isPaused, isSimulatorMode, simHeat, simAirflow, chargeTemp]);

  const handleStart = () => {
    if (!beanName.trim()) {
      showToast("⚠️ 請輸入烘焙豆款名稱", "error");
      return;
    }
    setElapsedTime(0);
    setLastReminderTime(-1);
    setLedger({});
    setLedgerEvents({});
    setIsPaused(false);
    setIsRoasting(true);
    setAiResult("");
    setBrewingResult("");

    speak(`烘焙大師工作站啟動。蔡老師，入豆溫設為 ${chargeTemp} 度。請密切注意 30 秒記錄指引。`);
    showToast("🚀 烘焙啟動！請依據左側 30 秒欄位錄入豆溫", "success");
  };

  const handleStop = () => {
    setIsRoasting(false);
    // 自動將目前時間設為下豆點
    const finalSec = Math.floor(elapsedTime);
    // 取最靠近的 30s 當作出豆點紀錄
    const snapSec = Math.round(finalSec / 30) * 30;
    if (snapSec > 0) {
      setLedgerEvents(prev => ({ ...prev, [snapSec]: 'drop' }));
    }
    speak("烘焙結束，請冷卻熟豆。");
    showToast("☕ 烘焙完成！請為此批次儲存存檔與進行大師評價", "success");
    setShowSaveModal(true);
  };

  const handleLedgerInputChange = (sec, value) => {
    setLedger(prev => {
      const updated = { ...prev };
      if (value === "") {
        delete updated[sec];
      } else {
        updated[sec] = value;
      }
      return updated;
    });
  };

  const cycleEventTag = (sec) => {
    const currentTag = ledgerEvents[sec];
    let nextTag = null;
    
    if (!currentTag) nextTag = 'turningPoint';
    else if (currentTag === 'turningPoint') nextTag = 'yellowing';
    else if (currentTag === 'yellowing') nextTag = 'fcStart';
    else if (currentTag === 'fcStart') nextTag = 'fcEnd';
    else if (currentTag === 'fcEnd') nextTag = 'scStart';
    else if (currentTag === 'scStart') nextTag = 'drop';
    else nextTag = null; // 循環回到無事件

    setLedgerEvents(prev => {
      const updated = { ...prev };
      if (nextTag === null) {
        delete updated[sec];
      } else {
        updated[sec] = nextTag;
      }
      return updated;
    });

    if (nextTag) {
      showToast(`已標記 ${getEventLabel(nextTag)}`, "success");
    }
  };

  const getEventLabel = (type) => {
    switch(type) {
      case 'turningPoint': return 'TP 回溫';
      case 'yellowing': return 'Dry 轉黃';
      case 'fcStart': return '1爆始';
      case 'fcEnd': return '1爆終';
      case 'scStart': return '2爆始';
      case 'drop': return 'Drop 出豆';
      default: return '';
    }
  };

  const getEventBgColor = (type) => {
    switch(type) {
      case 'turningPoint': return 'bg-cyan-500 text-white border-cyan-400';
      case 'yellowing': return 'bg-amber-500 text-stone-950 border-amber-400 font-bold';
      case 'fcStart': return 'bg-orange-500 text-white border-orange-400 font-bold';
      case 'fcEnd': return 'bg-orange-700 text-white border-orange-600';
      case 'scStart': return 'bg-rose-600 text-white border-rose-500';
      case 'drop': return 'bg-stone-100 text-stone-950 border-stone-200';
      default: return 'bg-stone-900 text-stone-400 hover:bg-stone-800';
    }
  };

  const confirmReset = () => {
    setIsRoasting(false);
    setIsPaused(false);
    setElapsedTime(0);
    setLedger({});
    setLedgerEvents({});
    setAiResult("");
    setBrewingResult("");
    setShowResetModal(false);
    showToast("所有即時狀態與表單皆已重設", "success");
  };

  const saveCurrentProfile = () => {
    if (roastData.length <= 1) {
      showToast("❌ 沒有足夠的烘焙數據可以儲存", "error");
      return;
    }

    const newProfile = {
      id: Date.now().toString(),
      beanName: beanName || "未命名批次",
      date: new Date().toLocaleDateString(),
      chargeTemp,
      batchWeight,
      roastData,
      events,
      rating: roastRating,
      notes: roastNotes,
      dtr: calculateDtr(),
      totalTime: formatTime(elapsedTime)
    };

    const updated = [newProfile, ...savedProfiles];
    saveToLocalStorage(updated);
    setShowSaveModal(false);
    showToast("💾 烘焙檔案已存入資料庫！", "success");
  };

  const deleteProfile = (id) => {
    const filtered = savedProfiles.filter(p => p.id !== id);
    saveToLocalStorage(filtered);
    showToast("已刪除該烘焙曲線檔案", "normal");
    if (referenceProfile?.id === id) setReferenceProfile(null);
  };

  const selectAsReference = (profile) => {
    setReferenceProfile(profile);
    showToast(`📈 已加載「${profile.beanName}」作為背景參考虛線！`, "success");
  };

  // --- AI 診斷 ---
  const callGeminiAPI = async () => {
    if (roastData.length < 5) {
      setAiResult("⚠️ 目前記錄的溫度點過少（至少需 5 個數據點），無法進行精準的曲線分析。");
      return;
    }
    setIsAnalyzing(true);
    setAiResult("");

    const roastCsv = roastData.map(d => `時間:${d.timeStr}, 溫度:${d.temp}°C, RoR:${d.ror}`).join("\n");
    const eventInfo = `
      入豆溫: ${chargeTemp}°C
      回溫點: ${events.turningPoint?.timeStr || "無紀錄"}
      轉黃黃化: ${events.yellowing?.timeStr || "無紀錄"}
      一爆開始: ${events.fcStart?.timeStr || "無紀錄"}
      一爆結束: ${events.fcEnd?.timeStr || "無紀錄"}
      出豆時間: ${events.drop?.timeStr || "無紀錄"}
      發展比率 (DTR): ${calculateDtr()}
    `;

    const systemPrompt = `你是一位榮獲世界手沖與烘豆大賽雙冠軍的殿堂級烘豆大師。請依據提供的 30 秒烘焙軌跡與事件，提供繁體中文的專業診斷報告。
    格式需非常精美，多用 emoji 分割：
    1. **烘焙特性評定** (依下豆點與 DTR 評估是極淺/淺/中/深烘焙)
    2. **升溫率 (RoR) 健檢** (指出是否有 Crash 驟降或 Flick 驟升，並說明其成因)
    3. **風味特徵預測** (如酸質表現、焦糖甜感、本體醇厚度)
    4. **大師優化建議** (為下一次烘豆提供具體火力或風門微調對策)
    `;

    const userPrompt = `咖啡豆: ${beanName} (${batchWeight}g)
    【事件節點】
    ${eventInfo}
    【30秒烘焙軌跡記錄】
    ${roastCsv}`;

    try {
      const activeKey = userApiKey || DEFAULT_API_KEY;
      if (!activeKey) throw new Error("請先輸入您的 Google Gemini API 金鑰");
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${activeKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] }
        })
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      setAiResult(text || "💡 AI 烘焙智庫暫時未給出解析，請重試。");
    } catch (e) {
      setAiResult(`❌ 分析失敗: ${e.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- AI 沖煮建議 ---
  const generateBrewingGuide = async () => {
    if (roastData.length < 5) {
      setBrewingResult("⚠️ 請先完成一輪烘焙並填入數據。");
      return;
    }
    setIsBrewingAnalyzing(true);
    setBrewingResult("");

    const lastPoint = roastData[roastData.length - 1];
    const systemPrompt = `你是一位世界級的精品咖啡杯測師。請針對這款咖啡豆的烘焙軌跡，設計一份最完美的 V60 金杯手沖沖煮指南。
    內容包括：
    1. **建議養豆期** (依烘焙度推薦天數)
    2. **沖煮關鍵參數** (建議水溫、粉水比例、研磨粗細推薦)
    3. **三段式斷水注水流程與秒數對照** (以 ml 與 秒數 表示)
    4. **預期杯測風味亮點**
    `;

    const userPrompt = `
      豆款: ${beanName}
      總烘焙時間: ${formatTime(elapsedTime)}
      最終出豆溫度: ${lastPoint?.temp}°C
      發展比 (DTR): ${calculateDtr()}
    `;

    try {
      const activeKey = userApiKey || DEFAULT_API_KEY;
      if (!activeKey) throw new Error("請先輸入您的 Google Gemini API 金鑰");

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${activeKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] }
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      setBrewingResult(text || "💡 沖煮指南產生失敗。");
    } catch (e) {
      setBrewingResult(`❌ 調配失敗: ${e.message}`);
    } finally {
      setIsBrewingAnalyzing(false);
    }
  };

  const handleExportCSV = () => {
    if (roastData.length <= 1) {
      showToast("無資料可供匯出", "error");
      return;
    }
    const headers = "Time,Time_Seconds,Temperature,RoR,Event\n";
    const rows = roastData.map(d => {
      const eventLabel = getEventLabel(ledgerEvents[d.timeSeconds]) || '';
      return `${d.timeStr},${d.timeSeconds},${d.temp},${d.ror},${eventLabel}`;
    }).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `RoastProfile_${beanName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("📊 烘焙 CSV 已成功下載！", "success");
  };

  // 合併與參考曲線的繪圖點
  const chartCombinedData = useMemo(() => {
    const maxSec = Math.max(
      roastData[roastData.length - 1]?.timeSeconds || 0,
      referenceProfile?.roastData[referenceProfile.roastData.length - 1]?.timeSeconds || 0,
      elapsedTime, // 加入當前時間讓渲染無縫平滑
      480 // 預設 8 分鐘起跳
    );

    const points = [];
    for (let s = 0; s <= maxSec; s += 5) {
      // 尋找 30s 整點、5s 繪圖格的數據
      const currentPoint = roastData.find(d => Math.abs(d.timeSeconds - s) < 3);
      const refPoint = referenceProfile?.roastData.find(d => Math.abs(d.timeSeconds - s) < 3);

      if (currentPoint || refPoint || s === 0) {
        points.push({
          timeSeconds: s,
          timeStr: formatTime(s),
          temp: currentPoint?.temp,
          ror: currentPoint?.ror,
          refTemp: refPoint?.temp,
          refRoR: refPoint?.ror
        });
      }
    }
    return points;
  }, [roastData, referenceProfile, elapsedTime]);

  const showToast = (msg, type = 'normal') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="h-screen flex flex-col bg-stone-950 font-sans text-stone-100 overflow-hidden select-none">
      
      {/* 頂部導航列 (核心儀表板) */}
      <header className="shrink-0 bg-stone-900/95 border-b border-stone-800 px-4 py-3 flex flex-wrap justify-between items-center gap-3 z-30 shadow-lg no-print">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 text-stone-950 p-2 rounded-xl font-black flex items-center justify-center animate-pulse shadow-md">
            <Coffee size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                RoastCraft AI
              </h1>
              <span className="text-[9px] bg-stone-800 text-stone-400 px-2 py-0.5 rounded-full border border-stone-700 font-mono">v3.8 教學版</span>
            </div>
            <p className="text-[10px] text-stone-400">蔡老師現場專屬：結構化 30s 整點對齊輸入面板</p>
          </div>
        </div>

        {/* 時間顯示與 DTR / RoR 指標 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-950 rounded-xl border border-stone-800 font-mono">
            <Timer size={14} className="text-amber-500" />
            <span className="text-lg font-black text-amber-400">{formatTime(elapsedTime)}</span>
          </div>

          <div className="hidden sm:flex items-center gap-3 border-l border-stone-800 pl-3">
            <div className="text-center">
              <span className="block text-[8px] uppercase text-stone-500 font-bold">DTR 發展率</span>
              <span className="text-xs font-black text-amber-500">{calculateDtr()}</span>
            </div>
            <div className="text-center border-l border-stone-800 pl-3">
              <span className="block text-[8px] uppercase text-stone-500 font-bold">即時 RoR</span>
              <span className="text-xs font-black text-cyan-400">
                {isSimulatorMode ? `${simRoR} °C/m` : `${roastData[roastData.length - 1]?.ror || 0} °C/m`}
              </span>
            </div>
          </div>

          {/* 輔劇設定與模式切換 */}
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => { setAudioBeepEnabled(!audioBeepEnabled); showToast(audioBeepEnabled ? "🔔 提示音已關閉" : "🔔 提示音已開啟"); }} 
              className={`p-2 rounded-lg border transition ${audioBeepEnabled ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-stone-800 border-stone-700 text-stone-500'}`}
              title="30秒提醒嗶聲"
            >
              <Bell size={14} />
            </button>
            <button 
              onClick={() => { setVoiceEnabled(!voiceEnabled); speak(voiceEnabled ? "語音廣播已關閉" : "語音廣播已開啟"); }} 
              className={`p-2 rounded-lg border transition ${voiceEnabled ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-stone-800 border-stone-700 text-stone-500'}`}
              title="大師語音助理"
            >
              {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </button>
            <button 
              onClick={() => {
                setIsSimulatorMode(!isSimulatorMode);
                setLedger({});
                setLedgerEvents({});
                showToast(isSimulatorMode ? "已切換為：蔡老師實體手動錄溫模式" : "已切換為：熱力學模擬烘焙模式", "success");
              }} 
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1 ${isSimulatorMode ? 'bg-emerald-950/50 border-emerald-800 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}
            >
              <Sliders size={12} />
              <span>{isSimulatorMode ? "熱能模擬" : "實機烘焙"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 主版面 */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

        {/* 左側欄：結構化登錄面板與計畫 */}
        <section className="w-full lg:w-[410px] xl:w-[460px] shrink-0 border-r border-stone-800 bg-stone-900/40 flex flex-col overflow-hidden z-10 no-print">
          
          {/* 左側控制面板分頁標籤 */}
          <div className="flex bg-stone-950 border-b border-stone-800 text-xs text-stone-400">
            <button 
              onClick={() => setLeftTab('ledger')}
              className={`flex-1 py-3 font-bold flex items-center justify-center gap-1.5 border-b-2 transition ${leftTab === 'ledger' ? 'bg-stone-900 border-amber-500 text-amber-400' : 'border-transparent hover:text-stone-200'}`}
            >
              <Keyboard size={14} />
              <span>30秒登錄表單</span>
            </button>
            <button 
              onClick={() => setLeftTab('config')}
              className={`flex-1 py-3 font-bold flex items-center justify-center gap-1.5 border-b-2 transition ${leftTab === 'config' ? 'bg-stone-900 border-amber-500 text-amber-400' : 'border-transparent hover:text-stone-200'}`}
            >
              <Sliders size={14} />
              <span>烘焙計畫 & 模擬器</span>
            </button>
          </div>

          {/* 分頁內容 */}
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* 分頁 A：30秒專屬登錄表格表單 */}
            {leftTab === 'ledger' && (
              <div className="flex-grow flex flex-col overflow-hidden p-3 space-y-3">
                
                {/* 狀態快捷控制條 */}
                <div className="bg-stone-900 p-3 rounded-xl border border-stone-800 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-stone-500">主控按鈕</span>
                    <div className="flex gap-2">
                      {!isRoasting ? (
                        <button 
                          onClick={handleStart}
                          className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-black rounded-lg text-xs transition"
                        >
                          開爐烘焙
                        </button>
                      ) : (
                        <button 
                          onClick={handleStop}
                          className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-lg text-xs animate-pulse transition"
                        >
                          下豆冷卻
                        </button>
                      )}
                      <button 
                        onClick={() => setShowResetModal(true)}
                        className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg border border-stone-700 transition"
                      >
                        <RotateCcw size={14} />
                      </button>
                    </div>
                  </div>

                  {/* 當前高亮指引資訊 */}
                  {isRoasting && activeFocusInterval && (
                    <div className="text-right space-y-0.5">
                      <span className="text-[9px] text-orange-400 font-bold flex items-center justify-end gap-1 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                        當前登錄節奏
                      </span>
                      <p className="text-sm font-black text-stone-100">
                        目標格：<span className="text-orange-400 font-mono">{formatTime(activeFocusInterval)}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* 30秒結構化連續表單 (學生填寫網格) */}
                <div className="flex-grow overflow-y-auto border border-stone-800 rounded-xl bg-stone-950/80 divide-y divide-stone-900">
                  
                  {/* 表單標頭 */}
                  <div className="sticky top-0 bg-stone-900/90 text-[10px] font-extrabold text-stone-400 uppercase tracking-wider p-2.5 grid grid-cols-12 gap-2 z-10 border-b border-stone-800">
                    <span className="col-span-3">時間</span>
                    <span className="col-span-4">豆溫溫度 (°C)</span>
                    <span className="col-span-2 text-right">RoR</span>
                    <span className="col-span-3 text-right">烘焙事件</span>
                  </div>

                  {timeIntervals.map((sec) => {
                    const isActive = activeFocusInterval === sec;
                    const isRecorded = ledger[sec] !== undefined && ledger[sec] !== "";
                    
                    return (
                      <div 
                        key={sec} 
                        className={`p-2 grid grid-cols-12 gap-2 items-center transition-all ${isActive ? 'bg-orange-500/10 ring-1 ring-inset ring-orange-500/30' : 'hover:bg-stone-900/30'}`}
                      >
                        {/* 1. 時間標籤與指引燈 */}
                        <div className="col-span-3 flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-orange-500 animate-ping' : isRecorded ? 'bg-emerald-500' : 'bg-stone-800'}`}></span>
                          <span className={`font-mono text-xs font-bold ${isActive ? 'text-orange-400' : 'text-stone-400'}`}>
                            {formatTime(sec)}
                          </span>
                        </div>

                        {/* 2. 精準輸入欄 */}
                        <div className="col-span-4 relative">
                          <input 
                            type="number" 
                            step="0.1"
                            disabled={!isRoasting || isSimulatorMode}
                            value={ledger[sec] || ''}
                            onChange={(e) => handleLedgerInputChange(sec, e.target.value)}
                            className={`w-full bg-stone-900 border text-xs font-bold rounded-lg p-1.5 outline-none text-stone-100 text-center transition ${isActive ? 'border-orange-500 focus:border-orange-400 bg-stone-950 ring-2 ring-orange-500/20' : isRecorded ? 'border-emerald-800 bg-emerald-950/10 focus:border-emerald-500' : 'border-stone-800 focus:border-amber-500'}`}
                            placeholder={isSimulatorMode ? "模擬中..." : `${sec % 60 === 0 ? "整點" : "半點"}`}
                          />
                        </div>

                        {/* 3. 實時算得之該時段 RoR */}
                        <div className="col-span-2 text-right font-mono text-xs font-black">
                          {(() => {
                            const foundPoint = roastData.find(d => d.timeSeconds === sec);
                            if (!foundPoint || foundPoint.ror === 0) return <span className="text-stone-700">--</span>;
                            return (
                              <span className={foundPoint.ror > 15 ? 'text-rose-500' : foundPoint.ror < 6 ? 'text-cyan-400' : 'text-emerald-500'}>
                                {foundPoint.ror > 0 ? `+${foundPoint.ror}` : foundPoint.ror}
                              </span>
                            );
                          })()}
                        </div>

                        {/* 4. 事件快捷標記按鈕 */}
                        <div className="col-span-3 text-right">
                          <button 
                            onClick={() => cycleEventTag(sec)}
                            disabled={!isRoasting}
                            className={`px-2 py-1 text-[9px] rounded-md border transition truncate w-full max-w-[90px] inline-block ${getEventBgColor(ledgerEvents[sec])}`}
                            title="按此循環標記烘焙事件"
                          >
                            {ledgerEvents[sec] ? getEventLabel(ledgerEvents[sec]) : "+ 標記"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 分頁 B：烘焙計畫 & 物理模擬器控制面板 */}
            {leftTab === 'config' && (
              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                
                {/* 參數設定卡 */}
                <div className="bg-stone-900 rounded-xl p-4 border border-stone-800 space-y-3 shadow-md">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <Calendar size={14} />
                    <span>批次計畫參數</span>
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="col-span-2">
                      <label className="text-[10px] text-stone-400 block mb-1">生豆名稱</label>
                      <input 
                        type="text" value={beanName} onChange={(e) => setBeanName(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-100 outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-400 block mb-1">裝量 (克)</label>
                      <input 
                        type="number" value={batchWeight} onChange={(e) => setBatchWeight(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-100 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-400 block mb-1">入豆溫度 (°C)</label>
                      <input 
                        type="number" value={chargeTemp} onChange={(e) => setChargeTemp(e.target.value)} disabled={isRoasting}
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-100 outline-none disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                {/* 模擬器即時操作滑塊 */}
                {isSimulatorMode && (
                  <div className="bg-stone-900 rounded-xl p-4 border border-stone-800 space-y-4 shadow-md animate-in slide-in-from-top-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                        <Flame size={14} />
                        <span>熱力學模擬風火操控</span>
                      </h3>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 animate-pulse">運作中</span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-stone-300">
                          <span className="font-bold text-orange-400">🔥 爐火火力：{simHeat}%</span>
                        </div>
                        <input 
                          type="range" min="0" max="100" value={simHeat} onChange={(e) => setSimHeat(Number(e.target.value))}
                          className="w-full accent-orange-500 h-1.5 bg-stone-950 rounded"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-stone-300">
                          <span className="font-bold text-blue-400">💨 風門風量：{simAirflow}%</span>
                        </div>
                        <input 
                          type="range" min="0" max="100" value={simAirflow} onChange={(e) => setSimAirflow(Number(e.target.value))}
                          className="w-full accent-blue-500 h-1.5 bg-stone-950 rounded"
                        />
                      </div>
                    </div>
                    <p className="text-[9px] text-stone-400 italic leading-relaxed">
                      * 模擬模式下，系統會依微分方程與風火開關自動算出每秒豆溫與 RoR 軌跡，並「自動」填寫 30 秒記錄網格。
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. 咖啡豆視覺變色儀 */}
          <div className="bg-stone-900/90 p-4 border-t border-stone-800 flex items-center gap-4">
            <div className="relative shrink-0">
              <svg className="w-14 h-14 drop-shadow-xl transition-colors duration-500" viewBox="0 0 100 100">
                <path 
                  d="M 50 10 C 20 10, 10 35, 10 60 C 10 85, 30 90, 50 90 C 70 90, 90 85, 90 60 C 90 35, 80 10, 50 10 Z" 
                  fill={currentBeanColor.color} 
                />
                <path 
                  d="M 50 12 Q 40 40, 55 60 Q 35 75, 50 88" 
                  fill="none" 
                  stroke="#1c1105" 
                  strokeWidth="4" 
                  strokeLinecap="round"
                  className={isRoasting ? "animate-pulse" : ""}
                />
              </svg>
            </div>
            <div className="flex-1 space-y-0.5">
              <span className="text-[9px] text-stone-500 font-extrabold uppercase tracking-widest">
                即時豆色美學追蹤
              </span>
              <h3 className="text-sm font-black text-amber-400">
                {currentBeanColor.name}
              </h3>
              <p className="text-[11px] text-stone-400">
                預測豆溫：<span className="font-mono font-bold text-amber-500">
                  {isSimulatorMode ? simBeanTemp : roastData[roastData.length - 1]?.temp || chargeTemp} °C
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* 右側欄：高解析雙軌曲線圖與大師工具箱 */}
        <section className="flex-1 bg-stone-950 p-4 flex flex-col space-y-4 overflow-y-auto">
          
          {/* A. 烘焙曲線圖核心卡 */}
          <div className="bg-stone-900/80 rounded-2xl p-4 border border-stone-800 shadow-2xl flex-1 min-h-[360px] sm:min-h-[420px] flex flex-col relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-2 border-b border-stone-800 mb-4 gap-2">
              <div>
                <h2 className="text-xs font-black text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Coffee size={14} />
                  <span>蔡老師大師核心雙軌曲線儀 (30s 即時對齊連線)</span>
                </h2>
                {referenceProfile && (
                  <p className="text-[10px] text-stone-400 mt-1">
                    目前正在對照背景參考線：<span className="text-amber-400 font-bold">{referenceProfile.beanName}</span>
                  </p>
                )}
              </div>
              
              <div className="flex gap-1.5 text-xs no-print">
                <button 
                  onClick={() => { setShowAiModal(true); setActiveAiTab('analysis'); if (roastData.length >= 5) callGeminiAPI(); }}
                  className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1 transition"
                >
                  <Sparkles size={12} />
                  <span>AI 診斷曲線</span>
                </button>
                <button 
                  onClick={() => { setShowAiModal(true); setActiveAiTab('brewing'); if (roastData.length >= 5) generateBrewingGuide(); }}
                  className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1 transition"
                >
                  <BookOpen size={12} />
                  <span>沖煮方案</span>
                </button>
                {referenceProfile && (
                  <button 
                    onClick={() => setReferenceProfile(null)}
                    className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold px-2 py-1 rounded-lg border border-stone-700 text-[10px]"
                  >
                    清除參考線
                  </button>
                )}
              </div>
            </div>

            {/* Recharts 折線雙軸圖 */}
            <div className="flex-grow w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartCombinedData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid stroke="#231f1a" strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timeSeconds" 
                    type="number" 
                    domain={[0, 'dataMax + 60']} 
                    tickFormatter={formatTime} 
                    stroke="#78716c"
                    tick={{ fontSize: 10, fill: '#a8a29e' }}
                  />
                  
                  {/* 左 Y 軸：溫度 */}
                  <YAxis 
                    yAxisId="temp" 
                    domain={[60, 240]} 
                    stroke="#ef4444" 
                    width={35}
                    tick={{ fontSize: 10, fill: '#ef4444' }}
                    label={{ value: '咖啡豆溫 (°C)', angle: -90, position: 'insideLeft', offset: 10, fill: '#ef4444', fontSize: 9, fontWeight: 'bold' }}
                  />
                  
                  {/* 右 Y 軸：RoR */}
                  <YAxis 
                    yAxisId="ror" 
                    orientation="right" 
                    domain={[-5, 30]} 
                    stroke="#3b82f6" 
                    width={35}
                    tick={{ fontSize: 10, fill: '#3b82f6' }}
                    label={{ value: '升溫率 RoR (°C/m)', angle: 90, position: 'insideRight', offset: 10, fill: '#3b82f6', fontSize: 9, fontWeight: 'bold' }}
                  />
                  
                  <Tooltip content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-stone-900 border border-stone-800 p-3 rounded-lg text-xs font-mono text-stone-200 shadow-2xl space-y-1">
                          <p className="font-bold text-amber-400 border-b border-stone-800 pb-1">🕒 時間: {d.timeStr}</p>
                          {d.temp !== undefined && <p className="text-rose-400">🌡️ 當前豆溫: {d.temp} °C</p>}
                          {d.ror !== undefined && <p className="text-cyan-400">📈 當前 RoR: {d.ror} °C/m</p>}
                          {d.refTemp !== undefined && <p className="text-stone-500">📜 參考豆溫: {d.refTemp} °C</p>}
                          {d.refRoR !== undefined && <p className="text-blue-500">📉 參考 RoR: {d.refRoR} °C/m</p>}
                        </div>
                      );
                    }
                    return null;
                  }} />
                  <Legend verticalAlign="top" height={32} iconSize={10} wrapperStyle={{ fontSize: '10px' }} />
                  
                  {/* 【核心修復】當前折線：加入 connectNulls={true} 確保在 5 秒細分間隔中有空值時，折線依然連續不中斷 */}
                  <Line 
                    yAxisId="temp" 
                    type="monotone" 
                    dataKey="temp" 
                    stroke="#ef4444" 
                    strokeWidth={3.5} 
                    name="豆溫" 
                    dot={true} 
                    isAnimationActive={false} 
                    connectNulls={true} 
                  />
                  <Line 
                    yAxisId="ror" 
                    type="monotone" 
                    dataKey="ror" 
                    stroke="#3b82f6" 
                    strokeWidth={2.5} 
                    name="RoR" 
                    dot={false} 
                    isAnimationActive={false} 
                    connectNulls={true} 
                  />
                  
                  {/* 參考虛線：同樣套用 connectNulls={true} */}
                  {referenceProfile && (
                    <>
                      <Line 
                        yAxisId="temp" 
                        type="monotone" 
                        dataKey="refTemp" 
                        stroke="#fca5a5" 
                        strokeDasharray="5 5" 
                        strokeWidth={1.5} 
                        name="[參考] 歷史豆溫" 
                        dot={false} 
                        isAnimationActive={false} 
                        connectNulls={true} 
                      />
                      <Line 
                        yAxisId="ror" 
                        type="monotone" 
                        dataKey="refRoR" 
                        stroke="#93c5fd" 
                        strokeDasharray="5 5" 
                        strokeWidth={1} 
                        name="[參考] 歷史 RoR" 
                        dot={false} 
                        isAnimationActive={false} 
                        connectNulls={true} 
                      />
                    </>
                  )}

                  {/* 事件輔助參考標線 */}
                  {events.turningPoint && <ReferenceLine yAxisId="temp" x={events.turningPoint.timeSeconds} stroke="#06b6d4" strokeDasharray="3 3" label={{ position: 'top', value: '回溫', fill: '#06b6d4', fontSize: 9 }} />}
                  {events.yellowing && <ReferenceLine yAxisId="temp" x={events.yellowing.timeSeconds} stroke="#eab308" strokeDasharray="3 3" label={{ position: 'top', value: '轉黃', fill: '#eab308', fontSize: 9 }} />}
                  {events.fcStart && <ReferenceLine yAxisId="temp" x={events.fcStart.timeSeconds} stroke="#f97316" strokeDasharray="3 3" label={{ position: 'top', value: '1爆始', fill: '#f97316', fontSize: 9 }} />}
                  {events.fcEnd && <ReferenceLine yAxisId="temp" x={events.fcEnd.timeSeconds} stroke="#ea580c" strokeDasharray="3 3" label={{ position: 'top', value: '1爆終', fill: '#ea580c', fontSize: 9 }} />}
                  {events.scStart && <ReferenceLine yAxisId="temp" x={events.scStart.timeSeconds} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: '2爆始', fill: '#ef4444', fontSize: 9 }} />}
                  {events.drop && <ReferenceLine yAxisId="temp" x={events.drop.timeSeconds} stroke="#fafaf9" strokeDasharray="3 3" label={{ position: 'top', value: '下豆', fill: '#fafaf9', fontSize: 9 }} />}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            
            {/* B. 歷史儲存烘焙庫 */}
            <div className="bg-stone-900/80 rounded-2xl p-4 border border-stone-800 shadow-xl flex flex-col min-h-[250px]">
              <h2 className="text-xs font-black text-amber-400 pb-2 border-b border-stone-800 flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                <Database size={14} />
                <span>烘焙歷程資料庫</span>
              </h2>

              <div className="flex-1 overflow-y-auto space-y-2 max-h-[190px] pr-1">
                {savedProfiles.length === 0 ? (
                  <div className="text-center py-8 text-stone-500 text-xs italic">
                    資料庫空空如也。烘焙結束、下豆冷卻後即可進行存檔！
                  </div>
                ) : (
                  savedProfiles.map((p) => (
                    <div key={p.id} className="bg-stone-950 p-3 rounded-xl border border-stone-850/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:border-stone-700 transition">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-stone-100">{p.beanName}</h4>
                          <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 font-mono font-bold">{p.dtr} DTR</span>
                        </div>
                        <p className="text-[9px] text-stone-400">日期: {p.date} • 總烘: {p.totalTime} • 重: {p.batchWeight}g • 評分: {p.rating}★</p>
                      </div>

                      <div className="flex gap-1.5 self-end sm:self-auto">
                        <button 
                          onClick={() => selectAsReference(p)}
                          className="bg-amber-500 hover:bg-amber-600 text-stone-950 text-[10px] font-extrabold px-2 py-1 rounded transition flex items-center gap-0.5"
                          title="載入至背景對比"
                        >
                          <Eye size={10} />
                          <span>對比</span>
                        </button>
                        <button 
                          onClick={() => setSelectedProfileForView(p)}
                          className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-[10px] font-bold px-2 py-1 rounded"
                        >
                          詳情
                        </button>
                        <button 
                          onClick={() => deleteProfile(p.id)}
                          className="text-stone-500 hover:text-red-400 p-1 rounded transition"
                          title="刪除"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* C. 精品咖啡手沖金杯比例推薦 */}
            <div className="bg-stone-900/80 rounded-2xl p-4 border border-stone-800 shadow-xl flex flex-col min-h-[250px]">
              <h2 className="text-xs font-black text-amber-400 pb-2 border-b border-stone-800 flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                <Scale size={14} />
                <span>精品手沖粉水比計算機</span>
              </h2>

              <div className="space-y-3 text-xs flex-1 flex flex-col justify-between">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] text-stone-400 block mb-1">研磨粉量 (g)</label>
                    <input 
                      type="number" 
                      value={brewCoffeeWeight}
                      onChange={(e) => setBrewCoffeeWeight(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 font-bold text-stone-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-stone-400 block mb-1">粉水比例 (1:X)</label>
                    <input 
                      type="number" 
                      step="0.5"
                      value={brewRatio}
                      onChange={(e) => setBrewRatio(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 font-bold text-stone-100 outline-none"
                    />
                  </div>
                </div>

                <div className="bg-stone-950 p-3 rounded-xl border border-stone-850 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-400">總注水水量：</span>
                    <span className="text-xs font-black text-amber-400">{(brewCoffeeWeight * brewRatio).toFixed(0)} ml</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-400">預期熟豆 (脫水15%)：</span>
                    <span className="text-stone-300">{(Number(batchWeight) * 0.85).toFixed(0)} g</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-stone-850 pt-2 text-[10px]">
                    <span className="text-stone-400">三段注水計畫：</span>
                    <span className="text-amber-500 font-bold">
                      {Math.round(brewCoffeeWeight * 2)}ml 悶蒸 → {Math.round(brewCoffeeWeight * brewRatio * 0.45)}ml → {Math.round(brewCoffeeWeight * brewRatio * 0.55)}ml
                    </span>
                  </div>
                </div>

                <p className="text-[9px] text-stone-500 text-center italic leading-relaxed">
                  * 本沖煮方案基於 SCA 金杯標準設計，建議手沖咖啡萃取率為 18% - 22%。
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* --- AI 烘焙診斷與沖煮建議 Modal --- */}
      {showAiModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-800 to-indigo-900 p-4 shrink-0 flex flex-col text-white">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 font-black text-sm">
                  <Bot size={18} className="text-purple-300" />
                  <span>Gemini 2.5 大師烘焙與手沖智庫</span>
                </div>
                <button onClick={() => setShowAiModal(false)} className="hover:bg-white/10 p-1 rounded-full transition"><X size={16}/></button>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 text-xs font-bold">
                <button 
                  onClick={() => setActiveAiTab('analysis')}
                  className={`pb-2 px-1 border-b-2 transition-all ${activeAiTab === 'analysis' ? 'border-amber-400 text-amber-400' : 'border-transparent text-purple-200 hover:text-white'}`}
                >
                  📊 烘焙曲線大師診斷
                </button>
                <button 
                  onClick={() => setActiveAiTab('brewing')}
                  className={`pb-2 px-1 border-b-2 transition-all ${activeAiTab === 'brewing' ? 'border-amber-400 text-amber-400' : 'border-transparent text-purple-200 hover:text-white'}`}
                >
                  ☕ SCA 精品手沖指南
                </button>
              </div>
            </div>

            {/* Modal 內容 */}
            <div className="p-6 overflow-y-auto flex-1 bg-stone-950 text-stone-200 space-y-4">
              
              {/* API KEY */}
              {!DEFAULT_API_KEY && !userApiKey && (
                <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-amber-400">輸入 Google Gemini API 金鑰</label>
                    <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-purple-400 underline hover:text-purple-350">免費申請金鑰</a>
                  </div>
                  <input 
                    type="password" value={userApiKey} onChange={(e) => setUserApiKey(e.target.value)} 
                    className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-xs font-mono outline-none focus:border-amber-500"
                    placeholder="貼上您的 Gemini API Key..." 
                  />
                </div>
              )}

              {activeAiTab === 'analysis' && (
                <div className="space-y-4">
                  {isAnalyzing ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-3">
                      <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                      <p className="text-xs font-bold text-purple-400 animate-pulse">大師正細讀蔡老師的 30 秒數據並構思報告中...</p>
                    </div>
                  ) : aiResult ? (
                    <div className="prose prose-invert max-w-none text-xs sm:text-sm whitespace-pre-wrap leading-relaxed bg-stone-900 p-4 rounded-xl border border-stone-850 shadow-inner">
                      {aiResult}
                    </div>
                  ) : (
                    <div className="text-center py-10 space-y-3">
                      <Sparkles size={36} className="mx-auto text-stone-600" />
                      <p className="text-stone-400 text-xs">烘焙曲線錄入完畢後，點擊下方按鈕即可呼叫大師解析。</p>
                      <button onClick={callGeminiAPI} className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2 rounded-xl text-xs transition active:scale-95 shadow-md">
                        開始診斷當前曲線
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeAiTab === 'brewing' && (
                <div className="space-y-4">
                  {isBrewingAnalyzing ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-3">
                      <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                      <p className="text-xs font-bold text-indigo-400 animate-pulse">正在精算與調配專屬此批次咖啡豆的手沖參數...</p>
                    </div>
                  ) : brewingResult ? (
                    <div className="prose prose-invert max-w-none text-xs sm:text-sm whitespace-pre-wrap leading-relaxed bg-stone-900 p-4 rounded-xl border border-stone-850 shadow-inner">
                      {brewingResult}
                    </div>
                  ) : (
                    <div className="text-center py-10 space-y-3">
                      <BookOpen size={36} className="mx-auto text-stone-600" />
                      <p className="text-stone-400 text-xs">大師將根據 DTR 與出豆溫，為蔡老師擬定專屬 V60 沖煮方案。</p>
                      <button onClick={generateBrewingGuide} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2 rounded-xl text-xs transition active:scale-95 shadow-md">
                        生成手沖咖啡配方
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-stone-850 bg-stone-900/60 shrink-0 flex justify-end">
              <button onClick={() => setShowAiModal(false)} className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold px-4 py-2 rounded-xl text-xs transition">
                關閉智庫
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 存檔與評價 Modal --- */}
      {showSaveModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto text-amber-400 mb-2">
                <Award size={24} />
              </div>
              <h3 className="text-base font-black text-stone-100">建立此批次烘焙存檔</h3>
              <p className="text-xs text-stone-400">儲存後可套用此曲線作為日後烘焙時的背景參考線！</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-stone-400 font-bold block mb-1">熟豆品質評價星等 (1 - 10)</label>
                <div className="flex gap-1.5 justify-center flex-wrap">
                  {[1,2,3,4,5,6,7,8,9,10].map((num) => (
                    <button 
                      key={num} onClick={() => setRoastRating(num)}
                      className={`w-8 h-8 rounded-lg font-bold border transition text-xs ${roastRating === num ? 'bg-amber-500 border-amber-500 text-stone-950 font-black' : 'bg-stone-950 border-stone-800 text-stone-400'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-stone-400 font-bold block mb-1">大師杯測筆記</label>
                <textarea 
                  value={roastNotes} onChange={(e) => setRoastNotes(e.target.value)}
                  className="w-full h-18 bg-stone-950 border border-stone-800 rounded-lg p-2.5 outline-none focus:border-amber-500 transition text-stone-100 text-xs"
                  placeholder="可記錄一爆音量、最終出豆色澤或期望風味特徵..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowSaveModal(false)} className="py-2.5 rounded-xl border border-stone-800 text-stone-400 font-bold text-xs">略過</button>
              <button onClick={saveCurrentProfile} className="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg">
                <Save size={14} />
                <span>儲存至歷史庫</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 單一曲線詳情彈窗 --- */}
      {selectedProfileForView && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-stone-800">
              <h3 className="font-black text-sm text-amber-400">📜 烘焙歷史詳情記錄</h3>
              <button onClick={() => setSelectedProfileForView(null)} className="hover:bg-white/10 p-1 rounded-full"><X size={16}/></button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 bg-stone-950 p-3 rounded-xl border border-stone-850 font-mono">
                <p className="text-stone-400">豆款: <span className="text-stone-100 font-bold">{selectedProfileForView.beanName}</span></p>
                <p className="text-stone-400">日期: <span className="text-stone-100 font-bold">{selectedProfileForView.date}</span></p>
                <p className="text-stone-400">入豆溫: <span className="text-stone-100 font-bold">{selectedProfileForView.chargeTemp} °C</span></p>
                <p className="text-stone-400">總烘時間: <span className="text-stone-100 font-bold">{selectedProfileForView.totalTime}</span></p>
                <p className="text-stone-400">裝豆量: <span className="text-stone-100 font-bold">{selectedProfileForView.batchWeight} g</span></p>
                <p className="text-stone-400">發展率 DTR: <span className="text-amber-400 font-bold">{selectedProfileForView.dtr}</span></p>
              </div>

              <div className="bg-stone-950 p-3 rounded-xl border border-stone-850 space-y-1">
                <p className="text-amber-500 font-bold flex items-center gap-1">
                  <Star size={12} fill="currentColor" />
                  大師評分: {selectedProfileForView.rating} / 10 分
                </p>
                <p className="text-stone-400">杯測筆記：</p>
                <p className="text-stone-200 italic whitespace-pre-wrap">{selectedProfileForView.notes || "未留下紀錄。"}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => { selectAsReference(selectedProfileForView); setSelectedProfileForView(null); }}
                className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-4 py-2 rounded-xl text-[11px] flex items-center gap-1"
              >
                <Eye size={12} />
                <span>載入為曲線參考線</span>
              </button>
              <button onClick={() => setSelectedProfileForView(null)} className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold px-4 py-2 rounded-xl text-[11px]">
                關閉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 重設警示 Modal --- */}
      {showResetModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 max-w-sm w-full text-center space-y-4">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500">
              <AlertTriangle size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-stone-100">確認清空重置？</h3>
              <p className="text-xs text-stone-400">這將會清除當前表單中所有的溫度紀錄、事件點、曲線數據，此動作無法復原。</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowResetModal(false)} className="py-2.5 rounded-xl border border-stone-800 text-stone-400 font-bold text-xs">取消</button>
              <button onClick={confirmReset} className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg">確認清除</button>
            </div>
          </div>
        </div>
      )}

      {/* --- 全域 Toast 通知 --- */}
      {notification && (
        <div className="no-print fixed top-6 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-2xl shadow-2xl z-[120] text-xs font-bold flex items-center gap-2 border bg-stone-900 border-stone-800 text-stone-100 animate-in slide-in-from-top-4 duration-300">
          {notification.type === 'error' ? (
            <AlertTriangle size={15} className="text-rose-500" />
          ) : (
            <CheckCircle2 size={15} className="text-emerald-500" />
          )}
          <span>{notification.msg}</span>
        </div>
      )}
    </div>
  );
}
```
```react
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine, Legend 
} from 'recharts';
import { 
  Play, Square, Clipboard, RefreshCw, Coffee, Timer, 
  RotateCcw, Flame, CheckCircle2, FileDown, AlertTriangle, Sparkles, 
  Bot, X, ScrollText, Trash2, Database, Eye, BookOpen, 
  Sliders, Volume2, VolumeX, Save, HelpCircle, Award,
  Scale, Droplets, Bell, Keyboard, Calendar, Star, ChevronRight
} from 'lucide-react';

const BEAN_COLORS = [
  { temp: 0, color: '#889e81', name: '生豆 Green' },
  { temp: 130, color: '#a2b380', name: '脫水 Drying' },
  { temp: 155, color: '#cbd18f', name: '轉黃 Yellowing' },
  { temp: 170, color: '#d4b26f', name: '一爆前 Pre-First Crack' },
  { temp: 190, color: '#a67c4e', name: '一爆開始 First Crack' },
  { temp: 205, color: '#7c532b', name: '發展中 Development' },
  { temp: 215, color: '#4a2f13', name: '二爆 Second Crack' },
  { temp: 225, color: '#2b1a08', name: '深烘焙 Dark Roast' },
];

const DEFAULT_API_KEY = "";

export default function App() {
  // 核心控制
  const [isRoasting, setIsRoasting] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); 
  const [isPaused, setIsPaused] = useState(false);
  
  // 烘焙設定
  const [beanName, setBeanName] = useState('衣索比亞 耶加雪菲 G1');
  const [chargeTemp, setChargeTemp] = useState('200');
  const [batchWeight, setBatchWeight] = useState('150'); 
  const [environmentTemp, setEnvironmentTemp] = useState('25'); 

  // 模式切換：預設改為 FALSE (讓蔡老師與學生進來就直接進行實體烘豆手動錄入)
  const [isSimulatorMode, setIsSimulatorMode] = useState(false);

  // 【核心升級】30秒結構化登錄表單資料庫 (鍵值為秒數, 如 30, 60, 90, 120... 數值為溫度字串)
  const [ledger, setLedger] = useState({});
  // 30秒整點對應的烘焙事件 (如 { 30: 'turningPoint', 300: 'fcStart' })
  const [ledgerEvents, setLedgerEvents] = useState({});

  // 模擬器專用狀態
  const [simHeat, setSimHeat] = useState(80); 
  const [simAirflow, setSimAirflow] = useState(30); 
  const [simBeanTemp, setSimBeanTemp] = useState(200); 

  // 最大預建置時間軸 (預設 15 分鐘，即 900 秒)
  const [maxIntervalSeconds, setMaxIntervalSeconds] = useState(900);

  // 語音與音效輔助
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [audioBeepEnabled, setAudioBeepEnabled] = useState(true);
  const [lastReminderTime, setLastReminderTime] = useState(-1);

  // 歷史資料庫
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [referenceProfile, setReferenceProfile] = useState(null);
  const [selectedProfileForView, setSelectedProfileForView] = useState(null);
  
  // 彈出視窗與通知
  const [notification, setNotification] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [activeAiTab, setActiveAiTab] = useState('analysis'); 
  const [aiResult, setAiResult] = useState(""); 
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [brewingResult, setBrewingResult] = useState(""); 
  const [isBrewingAnalyzing, setIsBrewingAnalyzing] = useState(false);
  const [userApiKey, setUserApiKey] = useState(""); 
  const [roastRating, setRoastRating] = useState(8);
  const [roastNotes, setRoastNotes] = useState('');

  // 手沖計算機
  const [brewCoffeeWeight, setBrewCoffeeWeight] = useState(15);
  const [brewRatio, setBrewRatio] = useState(15); 

  // UI 分頁切換 (左側欄：'ledger' 記錄表單 | 'config' 烘焙計畫)
  const [leftTab, setLeftTab] = useState('ledger');

  const timerRef = useRef(null);
  const simIntervalRef = useRef(null);
  const scrollRef = useRef(null);

  // 載入 localStorage
  useEffect(() => {
    const loaded = localStorage.getItem('roastcraft_v3_profiles');
    if (loaded) {
      try { setSavedProfiles(JSON.parse(loaded)); } catch (e) { console.error(e); }
    }
  }, []);

  const saveToLocalStorage = (newProfiles) => {
    setSavedProfiles(newProfiles);
    localStorage.setItem('roastcraft_v3_profiles', JSON.stringify(newProfiles));
  };

  // 嗶聲合成器
  const playBeep = () => {
    if (!audioBeepEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 900; 
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) { console.warn(e); }
  };

  // 語音引擎
  const speak = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-TW';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) { console.warn(e); }
  };

  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined || isNaN(seconds)) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 生成每 30 秒一個間隔的時間清單
  const timeIntervals = useMemo(() => {
    const arr = [];
    for (let s = 30; s <= maxIntervalSeconds; s += 30) {
      arr.push(s);
    }
    return arr;
  }, [maxIntervalSeconds]);

  // 【核心功能】即時將 30s 登錄表單與入豆溫轉化為折線圖所需之 roastData 陣列，並在 runtime 精算 RoR！
  const roastData = useMemo(() => {
    const data = [{ timeStr: '00:00', timeSeconds: 0, temp: parseFloat(chargeTemp) || 200, ror: 0 }];
    
    // 取出所有已有輸入溫度的 30 秒整點
    const activeSeconds = Object.keys(ledger)
      .map(Number)
      .sort((a, b) => a - b);

    activeSeconds.forEach((sec) => {
      const tempVal = parseFloat(ledger[sec]);
      if (isNaN(tempVal)) return;

      const prevPoint = data[data.length - 1];
      let ror = 0;
      if (prevPoint) {
        const timeDiff = sec - prevPoint.timeSeconds;
        if (timeDiff > 0) {
          // RoR 標準公式: (當前溫度 - 前一溫度) / 時間差(秒) * 60秒
          ror = Math.round(((tempVal - prevPoint.temp) / timeDiff) * 60 * 10) / 10;
        }
      }

      data.push({
        timeStr: formatTime(sec),
        timeSeconds: sec,
        temp: tempVal,
        ror
      });
    });

    return data;
  }, [ledger, chargeTemp]);

  // 動態判定目前的烘焙事件點 (用於計算 DTR 與 AI 使用)
  const events = useMemo(() => {
    const result = {
      turningPoint: null,
      yellowing: null,
      fcStart: null,
      fcEnd: null,
      scStart: null,
      scEnd: null,
      drop: null
    };

    Object.entries(ledgerEvents).forEach(([secStr, eventKey]) => {
      const sec = Number(secStr);
      if (result[eventKey] === null || result[eventKey].timeSeconds < sec) {
        result[eventKey] = {
          timeStr: formatTime(sec),
          timeSeconds: sec
        };
      }
    });

    return result;
  }, [ledgerEvents]);

  // 計算 DTR 發展時間比率
  const calculateDtr = () => {
    if (!events.fcStart) return "0.0%";
    const fcSec = events.fcStart.timeSeconds;
    const endSec = events.drop ? events.drop.timeSeconds : elapsedTime;
    if (endSec <= fcSec) return "0.0%";
    const devSec = endSec - fcSec;
    const dtr = (devSec / endSec) * 100;
    return `${dtr.toFixed(1)}%`;
  };

  // 取得目前時間最接近的 30 秒整點，以此來引導高亮輸入格
  const activeFocusInterval = useMemo(() => {
    if (!isRoasting) return null;
    const remainder = Math.floor(elapsedTime) % 30;
    const base = Math.floor(elapsedTime) - remainder;
    const target = remainder >= 15 ? base + 30 : base;
    return target > 0 ? target : 30;
  }, [elapsedTime, isRoasting]);

  // 30秒定時提醒偵測
  useEffect(() => {
    if (isRoasting && !isPaused) {
      const elapsedInt = Math.floor(elapsedTime);
      if (elapsedInt > 0 && elapsedInt % 30 === 0 && elapsedInt !== lastReminderTime) {
        setLastReminderTime(elapsedInt);
        playBeep();
        speak(`請記錄 ${formatTime(elapsedInt)} 溫度`);
        showToast(`⏰ 達 ${formatTime(elapsedInt)} 登錄時間！`, "success");
      }

      // 當烘焙時間即將超出目前最大長度時，自動延長 2 分鐘
      if (elapsedTime > maxIntervalSeconds - 15) {
        setMaxIntervalSeconds(prev => prev + 120);
      }
    }
  }, [elapsedTime, isRoasting, isPaused, lastReminderTime, maxIntervalSeconds]);

  // 咖啡豆物理變色追蹤
  const currentBeanColor = useMemo(() => {
    const currentTemp = roastData[roastData.length - 1]?.temp || parseFloat(chargeTemp) || 200;
    let selected = BEAN_COLORS[0];
    for (let i = 0; i < BEAN_COLORS.length; i++) {
      if (currentTemp >= BEAN_COLORS[i].temp) {
        selected = BEAN_COLORS[i];
      }
    }
    return selected;
  }, [roastData, chargeTemp]);

  // 模擬器熱力學微分步進 (僅在模擬模式啟用時生效)
  const runSimulationStep = () => {
    setElapsedTime(prev => {
      const nextTime = prev + 1;
      setSimBeanTemp(currentTemp => {
        let ror = 0;
        if (nextTime < 60) {
          const dropFactor = (nextTime / 60);
          const targetTp = 95 + (parseFloat(environmentTemp) * 0.1); 
          const diff = parseFloat(chargeTemp) - targetTp;
          ror = -diff * Math.exp(-3 * dropFactor) * 0.05;
        } else {
          const baseHeatTransfer = (simHeat * 0.35) - (simAirflow * 0.12);
          const heatResistance = (currentTemp - 100) * 0.04;
          let reactionHeat = 0;
          if (currentTemp >= 150 && currentTemp < 170) reactionHeat = -1.2;
          else if (currentTemp >= 190 && currentTemp < 198) reactionHeat = 2.0;
          else if (currentTemp >= 215) reactionHeat = 2.8;

          ror = baseHeatTransfer - heatResistance + reactionHeat;
          ror = Math.max(-5, Math.min(ror, 30));
        }

        const nextTemp = Math.round((currentTemp + (ror / 60)) * 10) / 10;
        
        // 模擬模式：自動在 30 秒整點將溫度填入表單
        if (nextTime % 30 === 0) {
          setLedger(prevLedger => ({
            ...prevLedger,
            [nextTime]: nextTemp.toString()
          }));
        }

        // 模擬模式：自動觸發轉黃或一爆事件
        if (nextTime === 60) setLedgerEvents(prev => ({ ...prev, 60: 'turningPoint' }));
        if (nextTemp >= 155 && nextTemp < 156.5) setLedgerEvents(prev => ({ ...prev, [nextTime]: 'yellowing' }));
        if (nextTemp >= 191 && nextTemp < 192.5) setLedgerEvents(prev => ({ ...prev, [nextTime]: 'fcStart' }));

        return nextTemp;
      });
      return nextTime;
    });
  };

  // 計時器 Effect
  useEffect(() => {
    if (isRoasting && !isPaused) {
      if (isSimulatorMode) {
        simIntervalRef.current = setInterval(runSimulationStep, 1000);
      } else {
        timerRef.current = setInterval(() => {
          setElapsedTime(prev => prev + 1);
        }, 1000);
      }
    }
    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRoasting, isPaused, isSimulatorMode, simHeat, simAirflow, chargeTemp]);

  const handleStart = () => {
    if (!beanName.trim()) {
      showToast("⚠️ 請輸入烘焙豆款名稱", "error");
      return;
    }
    setElapsedTime(0);
    setLastReminderTime(-1);
    setLedger({});
    setLedgerEvents({});
    setIsPaused(false);
    setIsRoasting(true);
    setAiResult("");
    setBrewingResult("");

    speak(`烘焙大師工作站啟動。蔡老師，入豆溫設為 ${chargeTemp} 度。請密切注意 30 秒記錄指引。`);
    showToast("🚀 烘焙啟動！請依據左側 30 秒欄位錄入豆溫", "success");
  };

  const handleStop = () => {
    setIsRoasting(false);
    // 自動將目前時間設為下豆點
    const finalSec = Math.floor(elapsedTime);
    // 取最靠近的 30s 當作出豆點紀錄
    const snapSec = Math.round(finalSec / 30) * 30;
    if (snapSec > 0) {
      setLedgerEvents(prev => ({ ...prev, [snapSec]: 'drop' }));
    }
    speak("烘焙結束，請冷卻熟豆。");
    showToast("☕ 烘焙完成！請為此批次儲存存檔與進行大師評價", "success");
    setShowSaveModal(true);
  };

  const handleLedgerInputChange = (sec, value) => {
    setLedger(prev => {
      const updated = { ...prev };
      if (value === "") {
        delete updated[sec];
      } else {
        updated[sec] = value;
      }
      return updated;
    });
  };

  const cycleEventTag = (sec) => {
    const currentTag = ledgerEvents[sec];
    let nextTag = null;
    
    if (!currentTag) nextTag = 'turningPoint';
    else if (currentTag === 'turningPoint') nextTag = 'yellowing';
    else if (currentTag === 'yellowing') nextTag = 'fcStart';
    else if (currentTag === 'fcStart') nextTag = 'fcEnd';
    else if (currentTag === 'fcEnd') nextTag = 'scStart';
    else if (currentTag === 'scStart') nextTag = 'drop';
    else nextTag = null; // 循環回到無事件

    setLedgerEvents(prev => {
      const updated = { ...prev };
      if (nextTag === null) {
        delete updated[sec];
      } else {
        updated[sec] = nextTag;
      }
      return updated;
    });

    if (nextTag) {
      showToast(`已標記 ${getEventLabel(nextTag)}`, "success");
    }
  };

  const getEventLabel = (type) => {
    switch(type) {
      case 'turningPoint': return 'TP 回溫';
      case 'yellowing': return 'Dry 轉黃';
      case 'fcStart': return '1爆始';
      case 'fcEnd': return '1爆終';
      case 'scStart': return '2爆始';
      case 'drop': return 'Drop 出豆';
      default: return '';
    }
  };

  const getEventBgColor = (type) => {
    switch(type) {
      case 'turningPoint': return 'bg-cyan-500 text-white border-cyan-400';
      case 'yellowing': return 'bg-amber-500 text-stone-950 border-amber-400 font-bold';
      case 'fcStart': return 'bg-orange-500 text-white border-orange-400 font-bold';
      case 'fcEnd': return 'bg-orange-700 text-white border-orange-600';
      case 'scStart': return 'bg-rose-600 text-white border-rose-500';
      case 'drop': return 'bg-stone-100 text-stone-950 border-stone-200';
      default: return 'bg-stone-900 text-stone-400 hover:bg-stone-800';
    }
  };

  const confirmReset = () => {
    setIsRoasting(false);
    setIsPaused(false);
    setElapsedTime(0);
    setLedger({});
    setLedgerEvents({});
    setAiResult("");
    setBrewingResult("");
    setShowResetModal(false);
    showToast("所有即時狀態與表單皆已重設", "success");
  };

  const saveCurrentProfile = () => {
    if (roastData.length <= 1) {
      showToast("❌ 沒有足夠的烘焙數據可以儲存", "error");
      return;
    }

    const newProfile = {
      id: Date.now().toString(),
      beanName: beanName || "未命名批次",
      date: new Date().toLocaleDateString(),
      chargeTemp,
      batchWeight,
      roastData,
      events,
      rating: roastRating,
      notes: roastNotes,
      dtr: calculateDtr(),
      totalTime: formatTime(elapsedTime)
    };

    const updated = [newProfile, ...savedProfiles];
    saveToLocalStorage(updated);
    setShowSaveModal(false);
    showToast("💾 烘焙檔案已存入資料庫！", "success");
  };

  const deleteProfile = (id) => {
    const filtered = savedProfiles.filter(p => p.id !== id);
    saveToLocalStorage(filtered);
    showToast("已刪除該烘焙曲線檔案", "normal");
    if (referenceProfile?.id === id) setReferenceProfile(null);
  };

  const selectAsReference = (profile) => {
    setReferenceProfile(profile);
    showToast(`📈 已加載「${profile.beanName}」作為背景參考虛線！`, "success");
  };

  // --- AI 診斷 ---
  const callGeminiAPI = async () => {
    if (roastData.length < 5) {
      setAiResult("⚠️ 目前記錄的溫度點過少（至少需 5 個數據點），無法進行精準的曲線分析。");
      return;
    }
    setIsAnalyzing(true);
    setAiResult("");

    const roastCsv = roastData.map(d => `時間:${d.timeStr}, 溫度:${d.temp}°C, RoR:${d.ror}`).join("\n");
    const eventInfo = `
      入豆溫: ${chargeTemp}°C
      回溫點: ${events.turningPoint?.timeStr || "無紀錄"}
      轉黃黃化: ${events.yellowing?.timeStr || "無紀錄"}
      一爆開始: ${events.fcStart?.timeStr || "無紀錄"}
      一爆結束: ${events.fcEnd?.timeStr || "無紀錄"}
      出豆時間: ${events.drop?.timeStr || "無紀錄"}
      發展比率 (DTR): ${calculateDtr()}
    `;

    const systemPrompt = `你是一位榮獲世界手沖與烘豆大賽雙冠軍的殿堂級烘豆大師。請依據提供的 30 秒烘焙軌跡與事件，提供繁體中文的專業診斷報告。
    格式需非常精美，多用 emoji 分割：
    1. **烘焙特性評定** (依下豆點與 DTR 評估是極淺/淺/中/深烘焙)
    2. **升溫率 (RoR) 健檢** (指出是否有 Crash 驟降或 Flick 驟升，並說明其成因)
    3. **風味特徵預測** (如酸質表現、焦糖甜感、本體醇厚度)
    4. **大師優化建議** (為下一次烘豆提供具體火力或風門微調對策)
    `;

    const userPrompt = `咖啡豆: ${beanName} (${batchWeight}g)
    【事件節點】
    ${eventInfo}
    【30秒烘焙軌跡記錄】
    ${roastCsv}`;

    try {
      const activeKey = userApiKey || DEFAULT_API_KEY;
      if (!activeKey) throw new Error("請先輸入您的 Google Gemini API 金鑰");
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${activeKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] }
        })
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      setAiResult(text || "💡 AI 烘焙智庫暫時未給出解析，請重試。");
    } catch (e) {
      setAiResult(`❌ 分析失敗: ${e.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- AI 沖煮建議 ---
  const generateBrewingGuide = async () => {
    if (roastData.length < 5) {
      setBrewingResult("⚠️ 請先完成一輪烘焙並填入數據。");
      return;
    }
    setIsBrewingAnalyzing(true);
    setBrewingResult("");

    const lastPoint = roastData[roastData.length - 1];
    const systemPrompt = `你是一位世界級的精品咖啡杯測師。請針對這款咖啡豆的烘焙軌跡，設計一份最完美的 V60 金杯手沖沖煮指南。
    內容包括：
    1. **建議養豆期** (依烘焙度推薦天數)
    2. **沖煮關鍵參數** (建議水溫、粉水比例、研磨粗細推薦)
    3. **三段式斷水注水流程與秒數對照** (以 ml 與 秒數 表示)
    4. **預期杯測風味亮點**
    `;

    const userPrompt = `
      豆款: ${beanName}
      總烘焙時間: ${formatTime(elapsedTime)}
      最終出豆溫度: ${lastPoint?.temp}°C
      發展比 (DTR): ${calculateDtr()}
    `;

    try {
      const activeKey = userApiKey || DEFAULT_API_KEY;
      if (!activeKey) throw new Error("請先輸入您的 Google Gemini API 金鑰");

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${activeKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] }
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      setBrewingResult(text || "💡 沖煮指南產生失敗。");
    } catch (e) {
      setBrewingResult(`❌ 調配失敗: ${e.message}`);
    } finally {
      setIsBrewingAnalyzing(false);
    }
  };

  const handleExportCSV = () => {
    if (roastData.length <= 1) {
      showToast("無資料可供匯出", "error");
      return;
    }
    const headers = "Time,Time_Seconds,Temperature,RoR,Event\n";
    const rows = roastData.map(d => {
      const eventLabel = getEventLabel(ledgerEvents[d.timeSeconds]) || '';
      return `${d.timeStr},${d.timeSeconds},${d.temp},${d.ror},${eventLabel}`;
    }).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `RoastProfile_${beanName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("📊 烘焙 CSV 已成功下載！", "success");
  };

  // 合併與參考曲線的繪圖點
  const chartCombinedData = useMemo(() => {
    const maxSec = Math.max(
      roastData[roastData.length - 1]?.timeSeconds || 0,
      referenceProfile?.roastData[referenceProfile.roastData.length - 1]?.timeSeconds || 0,
      480 // 預設 8 分鐘起跳
    );

    const points = [];
    for (let s = 0; s <= maxSec; s += 5) {
      // 尋找 30s 整點、5s 繪圖格的數據
      const currentPoint = roastData.find(d => Math.abs(d.timeSeconds - s) < 3);
      const refPoint = referenceProfile?.roastData.find(d => Math.abs(d.timeSeconds - s) < 3);

      if (currentPoint || refPoint || s === 0) {
        points.push({
          timeSeconds: s,
          timeStr: formatTime(s),
          temp: currentPoint?.temp,
          ror: currentPoint?.ror,
          refTemp: refPoint?.temp,
          refRoR: refPoint?.ror
        });
      }
    }
    return points;
  }, [roastData, referenceProfile]);

  const showToast = (msg, type = 'normal') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="h-screen flex flex-col bg-stone-950 font-sans text-stone-100 overflow-hidden select-none">
      
      {/* 頂部導航列 (核心儀表板) */}
      <header className="shrink-0 bg-stone-900/95 border-b border-stone-800 px-4 py-3 flex flex-wrap justify-between items-center gap-3 z-30 shadow-lg no-print">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 text-stone-950 p-2 rounded-xl font-black flex items-center justify-center animate-pulse shadow-md">
            <Coffee size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                RoastCraft AI
              </h1>
              <span className="text-[9px] bg-stone-800 text-stone-400 px-2 py-0.5 rounded-full border border-stone-700 font-mono">v3.8 教學版</span>
            </div>
            <p className="text-[10px] text-stone-400">蔡老師現場專屬：結構化 30s 整點對齊輸入面板</p>
          </div>
        </div>

        {/* 時間顯示與 DTR / RoR 指標 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-950 rounded-xl border border-stone-800 font-mono">
            <Timer size={14} className="text-amber-500" />
            <span className="text-lg font-black text-amber-400">{formatTime(elapsedTime)}</span>
          </div>

          <div className="hidden sm:flex items-center gap-3 border-l border-stone-800 pl-3">
            <div className="text-center">
              <span className="block text-[8px] uppercase text-stone-500 font-bold">DTR 發展率</span>
              <span className="text-xs font-black text-amber-500">{calculateDtr()}</span>
            </div>
            <div className="text-center border-l border-stone-800 pl-3">
              <span className="block text-[8px] uppercase text-stone-500 font-bold">即時 RoR</span>
              <span className="text-xs font-black text-cyan-400">
                {isSimulatorMode ? `${simRoR} °C/m` : `${roastData[roastData.length - 1]?.ror || 0} °C/m`}
              </span>
            </div>
          </div>

          {/* 輔助設定與模式切換 */}
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => { setAudioBeepEnabled(!audioBeepEnabled); showToast(audioBeepEnabled ? "🔔 提示音已關閉" : "🔔 提示音已開啟"); }} 
              className={`p-2 rounded-lg border transition ${audioBeepEnabled ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-stone-800 border-stone-700 text-stone-500'}`}
              title="30秒提醒嗶聲"
            >
              <Bell size={14} />
            </button>
            <button 
              onClick={() => { setVoiceEnabled(!voiceEnabled); speak(voiceEnabled ? "語音廣播已關閉" : "語音廣播已開啟"); }} 
              className={`p-2 rounded-lg border transition ${voiceEnabled ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-stone-800 border-stone-700 text-stone-500'}`}
              title="大師語音助理"
            >
              {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </button>
            <button 
              onClick={() => {
                setIsSimulatorMode(!isSimulatorMode);
                setLedger({});
                setLedgerEvents({});
                showToast(isSimulatorMode ? "已切換為：蔡老師實體手動錄溫模式" : "已切換為：熱力學模擬烘焙模式", "success");
              }} 
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1 ${isSimulatorMode ? 'bg-emerald-950/50 border-emerald-800 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}
            >
              <Sliders size={12} />
              <span>{isSimulatorMode ? "熱能模擬" : "實機烘焙"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 主版面 */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

        {/* 左側欄：結構化登錄面板與計畫 */}
        <section className="w-full lg:w-[410px] xl:w-[460px] shrink-0 border-r border-stone-800 bg-stone-900/40 flex flex-col overflow-hidden z-10 no-print">
          
          {/* 左側控制面板分頁標籤 */}
          <div className="flex bg-stone-950 border-b border-stone-800 text-xs text-stone-400">
            <button 
              onClick={() => setLeftTab('ledger')}
              className={`flex-1 py-3 font-bold flex items-center justify-center gap-1.5 border-b-2 transition ${leftTab === 'ledger' ? 'bg-stone-900 border-amber-500 text-amber-400' : 'border-transparent hover:text-stone-200'}`}
            >
              <Keyboard size={14} />
              <span>30秒登錄表單</span>
            </button>
            <button 
              onClick={() => setLeftTab('config')}
              className={`flex-1 py-3 font-bold flex items-center justify-center gap-1.5 border-b-2 transition ${leftTab === 'config' ? 'bg-stone-900 border-amber-500 text-amber-400' : 'border-transparent hover:text-stone-200'}`}
            >
              <Sliders size={14} />
              <span>烘焙計畫 & 模擬器</span>
            </button>
          </div>

          {/* 分頁內容 */}
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* 分頁 A：30秒專屬登錄表格表單 (蔡老師指名重點核心) */}
            {leftTab === 'ledger' && (
              <div className="flex-grow flex flex-col overflow-hidden p-3 space-y-3">
                
                {/* 狀態快捷控制條 */}
                <div className="bg-stone-900 p-3 rounded-xl border border-stone-800 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-stone-500">主控按鈕</span>
                    <div className="flex gap-2">
                      {!isRoasting ? (
                        <button 
                          onClick={handleStart}
                          className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-black rounded-lg text-xs transition"
                        >
                          開爐烘焙
                        </button>
                      ) : (
                        <button 
                          onClick={handleStop}
                          className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-lg text-xs animate-pulse transition"
                        >
                          下豆冷卻
                        </button>
                      )}
                      <button 
                        onClick={() => setShowResetModal(true)}
                        className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg border border-stone-700 transition"
                      >
                        <RotateCcw size={14} />
                      </button>
                    </div>
                  </div>

                  {/* 當前高亮指引資訊 */}
                  {isRoasting && activeFocusInterval && (
                    <div className="text-right space-y-0.5">
                      <span className="text-[9px] text-orange-400 font-bold flex items-center justify-end gap-1 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                        當前登錄節奏
                      </span>
                      <p className="text-sm font-black text-stone-100">
                        目標格：<span className="text-orange-400 font-mono">{formatTime(activeFocusInterval)}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* 30秒結構化連續表單 (學生填寫網格) */}
                <div className="flex-grow overflow-y-auto border border-stone-800 rounded-xl bg-stone-950/80 divide-y divide-stone-900">
                  
                  {/* 表單標頭 */}
                  <div className="sticky top-0 bg-stone-900/90 text-[10px] font-extrabold text-stone-400 uppercase tracking-wider p-2.5 grid grid-cols-12 gap-2 z-10 border-b border-stone-800">
                    <span className="col-span-3">時間</span>
                    <span className="col-span-4">豆溫溫度 (°C)</span>
                    <span className="col-span-2 text-right">RoR</span>
                    <span className="col-span-3 text-right">烘焙事件</span>
                  </div>

                  {timeIntervals.map((sec) => {
                    const isActive = activeFocusInterval === sec;
                    const isRecorded = ledger[sec] !== undefined && ledger[sec] !== "";
                    
                    return (
                      <div 
                        key={sec} 
                        className={`p-2 grid grid-cols-12 gap-2 items-center transition-all ${isActive ? 'bg-orange-500/10 ring-1 ring-inset ring-orange-500/30' : 'hover:bg-stone-900/30'}`}
                      >
                        {/* 1. 時間標籤與指引燈 */}
                        <div className="col-span-3 flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-orange-500 animate-ping' : isRecorded ? 'bg-emerald-500' : 'bg-stone-800'}`}></span>
                          <span className={`font-mono text-xs font-bold ${isActive ? 'text-orange-400' : 'text-stone-400'}`}>
                            {formatTime(sec)}
                          </span>
                        </div>

                        {/* 2. 精準輸入欄 */}
                        <div className="col-span-4 relative">
                          <input 
                            type="number" 
                            step="0.1"
                            disabled={!isRoasting || isSimulatorMode}
                            value={ledger[sec] || ''}
                            onChange={(e) => handleLedgerInputChange(sec, e.target.value)}
                            className={`w-full bg-stone-900 border text-xs font-bold rounded-lg p-1.5 outline-none text-stone-100 text-center transition ${isActive ? 'border-orange-500 focus:border-orange-400 bg-stone-950 ring-2 ring-orange-500/20' : isRecorded ? 'border-emerald-800 bg-emerald-950/10 focus:border-emerald-500' : 'border-stone-800 focus:border-amber-500'}`}
                            placeholder={isSimulatorMode ? "模擬中..." : `${sec % 60 === 0 ? "整點" : "半點"}`}
                          />
                        </div>

                        {/* 3. 實時算得之該時段 RoR */}
                        <div className="col-span-2 text-right font-mono text-xs font-black">
                          {(() => {
                            const foundPoint = roastData.find(d => d.timeSeconds === sec);
                            if (!foundPoint || foundPoint.ror === 0) return <span className="text-stone-700">--</span>;
                            return (
                              <span className={foundPoint.ror > 15 ? 'text-rose-500' : foundPoint.ror < 6 ? 'text-cyan-400' : 'text-emerald-500'}>
                                {foundPoint.ror > 0 ? `+${foundPoint.ror}` : foundPoint.ror}
                              </span>
                            );
                          })()}
                        </div>

                        {/* 4. 事件快捷標記按鈕 */}
                        <div className="col-span-3 text-right">
                          <button 
                            onClick={() => cycleEventTag(sec)}
                            disabled={!isRoasting}
                            className={`px-2 py-1 text-[9px] rounded-md border transition truncate w-full max-w-[90px] inline-block ${getEventBgColor(ledgerEvents[sec])}`}
                            title="按此循環標記烘焙事件"
                          >
                            {ledgerEvents[sec] ? getEventLabel(ledgerEvents[sec]) : "+ 標記"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 分頁 B：烘焙計畫 & 物理模擬器控制面板 */}
            {leftTab === 'config' && (
              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                
                {/* 參數設定卡 */}
                <div className="bg-stone-900 rounded-xl p-4 border border-stone-800 space-y-3 shadow-md">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <Calendar size={14} />
                    <span>批次計畫參數</span>
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="col-span-2">
                      <label className="text-[10px] text-stone-400 block mb-1">生豆名稱</label>
                      <input 
                        type="text" value={beanName} onChange={(e) => setBeanName(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-100 outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-400 block mb-1">裝量 (克)</label>
                      <input 
                        type="number" value={batchWeight} onChange={(e) => setBatchWeight(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-100 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-400 block mb-1">入豆溫度 (°C)</label>
                      <input 
                        type="number" value={chargeTemp} onChange={(e) => setChargeTemp(e.target.value)} disabled={isRoasting}
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-100 outline-none disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                {/* 模擬器即時操作滑塊 */}
                {isSimulatorMode && (
                  <div className="bg-stone-900 rounded-xl p-4 border border-stone-800 space-y-4 shadow-md animate-in slide-in-from-top-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                        <Flame size={14} />
                        <span>熱力學模擬風火操控</span>
                      </h3>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 animate-pulse">運作中</span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-stone-300">
                          <span className="font-bold text-orange-400">🔥 爐火火力：{simHeat}%</span>
                        </div>
                        <input 
                          type="range" min="0" max="100" value={simHeat} onChange={(e) => setSimHeat(Number(e.target.value))}
                          className="w-full accent-orange-500 h-1.5 bg-stone-950 rounded"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-stone-300">
                          <span className="font-bold text-blue-400">💨 風門風量：{simAirflow}%</span>
                        </div>
                        <input 
                          type="range" min="0" max="100" value={simAirflow} onChange={(e) => setSimAirflow(Number(e.target.value))}
                          className="w-full accent-blue-500 h-1.5 bg-stone-950 rounded"
                        />
                      </div>
                    </div>
                    <p className="text-[9px] text-stone-400 italic leading-relaxed">
                      * 模擬模式下，系統會依微分方程與風火開關自動算出每秒豆溫與 RoR 軌跡，並「自動」填寫 30 秒記錄網格。
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. 咖啡豆視覺變色儀 */}
          <div className="bg-stone-900/90 p-4 border-t border-stone-800 flex items-center gap-4">
            <div className="relative shrink-0">
              <svg className="w-14 h-14 drop-shadow-xl transition-colors duration-500" viewBox="0 0 100 100">
                <path 
                  d="M 50 10 C 20 10, 10 35, 10 60 C 10 85, 30 90, 50 90 C 70 90, 90 85, 90 60 C 90 35, 80 10, 50 10 Z" 
                  fill={currentBeanColor.color} 
                />
                <path 
                  d="M 50 12 Q 40 40, 55 60 Q 35 75, 50 88" 
                  fill="none" 
                  stroke="#1c1105" 
                  strokeWidth="4" 
                  strokeLinecap="round"
                  className={isRoasting ? "animate-pulse" : ""}
                />
              </svg>
            </div>
            <div className="flex-1 space-y-0.5">
              <span className="text-[9px] text-stone-500 font-extrabold uppercase tracking-widest">
                即時豆色美學追蹤
              </span>
              <h3 className="text-sm font-black text-amber-400">
                {currentBeanColor.name}
              </h3>
              <p className="text-[11px] text-stone-400">
                預測豆溫：<span className="font-mono font-bold text-amber-500">
                  {isSimulatorMode ? simBeanTemp : roastData[roastData.length - 1]?.temp || chargeTemp} °C
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* 右側欄：高解析雙軌曲線圖與大師工具箱 */}
        <section className="flex-1 bg-stone-950 p-4 flex flex-col space-y-4 overflow-y-auto">
          
          {/* A. 烘焙曲線圖核心卡 */}
          <div className="bg-stone-900/80 rounded-2xl p-4 border border-stone-800 shadow-2xl flex-1 min-h-[360px] sm:min-h-[420px] flex flex-col relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-2 border-b border-stone-800 mb-4 gap-2">
              <div>
                <h2 className="text-xs font-black text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Coffee size={14} />
                  <span>蔡老師大師核心雙軌曲線儀 (30s 極緻對齊)</span>
                </h2>
                {referenceProfile && (
                  <p className="text-[10px] text-stone-400 mt-1">
                    目前正在對照背景參考線：<span className="text-amber-400 font-bold">{referenceProfile.beanName}</span>
                  </p>
                )}
              </div>
              
              <div className="flex gap-1.5 text-xs no-print">
                <button 
                  onClick={() => { setShowAiModal(true); setActiveAiTab('analysis'); if (roastData.length >= 5) callGeminiAPI(); }}
                  className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1 transition"
                >
                  <Sparkles size={12} />
                  <span>AI 診斷曲線</span>
                </button>
                <button 
                  onClick={() => { setShowAiModal(true); setActiveAiTab('brewing'); if (roastData.length >= 5) generateBrewingGuide(); }}
                  className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1 transition"
                >
                  <BookOpen size={12} />
                  <span>沖煮方案</span>
                </button>
                {referenceProfile && (
                  <button 
                    onClick={() => setReferenceProfile(null)}
                    className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold px-2 py-1 rounded-lg border border-stone-700 text-[10px]"
                  >
                    清除參考線
                  </button>
                )}
              </div>
            </div>

            {/* Recharts 折線雙軸圖 */}
            <div className="flex-grow w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartCombinedData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid stroke="#231f1a" strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timeSeconds" 
                    type="number" 
                    domain={[0, 'dataMax + 60']} 
                    tickFormatter={formatTime} 
                    stroke="#78716c"
                    tick={{ fontSize: 10, fill: '#a8a29e' }}
                  />
                  
                  {/* 左 Y 軸：溫度 */}
                  <YAxis 
                    yAxisId="temp" 
                    domain={[60, 240]} 
                    stroke="#ef4444" 
                    width={35}
                    tick={{ fontSize: 10, fill: '#ef4444' }}
                    label={{ value: '咖啡豆溫 (°C)', angle: -90, position: 'insideLeft', offset: 10, fill: '#ef4444', fontSize: 9, fontWeight: 'bold' }}
                  />
                  
                  {/* 右 Y 軸：RoR */}
                  <YAxis 
                    yAxisId="ror" 
                    orientation="right" 
                    domain={[-5, 30]} 
                    stroke="#3b82f6" 
                    width={35}
                    tick={{ fontSize: 10, fill: '#3b82f6' }}
                    label={{ value: '升溫率 RoR (°C/m)', angle: 90, position: 'insideRight', offset: 10, fill: '#3b82f6', fontSize: 9, fontWeight: 'bold' }}
                  />
                  
                  <Tooltip content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-stone-900 border border-stone-800 p-3 rounded-lg text-xs font-mono text-stone-200 shadow-2xl space-y-1">
                          <p className="font-bold text-amber-400 border-b border-stone-800 pb-1">🕒 時間: {d.timeStr}</p>
                          {d.temp !== undefined && <p className="text-rose-400">🌡️ 當前豆溫: {d.temp} °C</p>}
                          {d.ror !== undefined && <p className="text-cyan-400">📈 當前 RoR: {d.ror} °C/m</p>}
                          {d.refTemp !== undefined && <p className="text-stone-500">📜 參考豆溫: {d.refTemp} °C</p>}
                          {d.refRoR !== undefined && <p className="text-blue-500">📉 參考 RoR: {d.refRoR} °C/m</p>}
                        </div>
                      );
                    }
                    return null;
                  }} />
                  <Legend verticalAlign="top" height={32} iconSize={10} wrapperStyle={{ fontSize: '10px' }} />
                  
                  {/* 當前折線 */}
                  <Line yAxisId="temp" type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={3.5} name="豆溫" dot={true} isAnimationActive={false} />
                  <Line yAxisId="ror" type="monotone" dataKey="ror" stroke="#3b82f6" strokeWidth={2.5} name="RoR" dot={false} isAnimationActive={false} />
                  
                  {/* 參考虛線 */}
                  {referenceProfile && (
                    <>
                      <Line yAxisId="temp" type="monotone" dataKey="refTemp" stroke="#fca5a5" strokeDasharray="5 5" strokeWidth={1.5} name="[參考] 歷史豆溫" dot={false} isAnimationActive={false} />
                      <Line yAxisId="ror" type="monotone" dataKey="refRoR" stroke="#93c5fd" strokeDasharray="5 5" strokeWidth={1} name="[參考] 歷史 RoR" dot={false} isAnimationActive={false} />
                    </>
                  )}

                  {/* 事件輔助參考標線 */}
                  {events.turningPoint && <ReferenceLine yAxisId="temp" x={events.turningPoint.timeSeconds} stroke="#06b6d4" strokeDasharray="3 3" label={{ position: 'top', value: '回溫', fill: '#06b6d4', fontSize: 9 }} />}
                  {events.yellowing && <ReferenceLine yAxisId="temp" x={events.yellowing.timeSeconds} stroke="#eab308" strokeDasharray="3 3" label={{ position: 'top', value: '轉黃', fill: '#eab308', fontSize: 9 }} />}
                  {events.fcStart && <ReferenceLine yAxisId="temp" x={events.fcStart.timeSeconds} stroke="#f97316" strokeDasharray="3 3" label={{ position: 'top', value: '1爆始', fill: '#f97316', fontSize: 9 }} />}
                  {events.fcEnd && <ReferenceLine yAxisId="temp" x={events.fcEnd.timeSeconds} stroke="#ea580c" strokeDasharray="3 3" label={{ position: 'top', value: '1爆終', fill: '#ea580c', fontSize: 9 }} />}
                  {events.scStart && <ReferenceLine yAxisId="temp" x={events.scStart.timeSeconds} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: '2爆始', fill: '#ef4444', fontSize: 9 }} />}
                  {events.drop && <ReferenceLine yAxisId="temp" x={events.drop.timeSeconds} stroke="#fafaf9" strokeDasharray="3 3" label={{ position: 'top', value: '下豆', fill: '#fafaf9', fontSize: 9 }} />}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            
            {/* B. 歷史儲存烘焙庫 */}
            <div className="bg-stone-900/80 rounded-2xl p-4 border border-stone-800 shadow-xl flex flex-col min-h-[250px]">
              <h2 className="text-xs font-black text-amber-400 pb-2 border-b border-stone-800 flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                <Database size={14} />
                <span>烘焙歷程資料庫</span>
              </h2>

              <div className="flex-1 overflow-y-auto space-y-2 max-h-[190px] pr-1">
                {savedProfiles.length === 0 ? (
                  <div className="text-center py-8 text-stone-500 text-xs italic">
                    資料庫空空如也。烘焙結束、下豆冷卻後即可進行存檔！
                  </div>
                ) : (
                  savedProfiles.map((p) => (
                    <div key={p.id} className="bg-stone-950 p-3 rounded-xl border border-stone-850/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:border-stone-700 transition">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-stone-100">{p.beanName}</h4>
                          <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 font-mono font-bold">{p.dtr} DTR</span>
                        </div>
                        <p className="text-[9px] text-stone-400">日期: {p.date} • 總烘: {p.totalTime} • 重: {p.batchWeight}g • 評分: {p.rating}★</p>
                      </div>

                      <div className="flex gap-1.5 self-end sm:self-auto">
                        <button 
                          onClick={() => selectAsReference(p)}
                          className="bg-amber-500 hover:bg-amber-600 text-stone-950 text-[10px] font-extrabold px-2 py-1 rounded transition flex items-center gap-0.5"
                          title="載入至背景對比"
                        >
                          <Eye size={10} />
                          <span>對比</span>
                        </button>
                        <button 
                          onClick={() => setSelectedProfileForView(p)}
                          className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-[10px] font-bold px-2 py-1 rounded"
                        >
                          詳情
                        </button>
                        <button 
                          onClick={() => deleteProfile(p.id)}
                          className="text-stone-500 hover:text-red-400 p-1 rounded transition"
                          title="刪除"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* C. 精品咖啡手沖金杯比例推薦 */}
            <div className="bg-stone-900/80 rounded-2xl p-4 border border-stone-800 shadow-xl flex flex-col min-h-[250px]">
              <h2 className="text-xs font-black text-amber-400 pb-2 border-b border-stone-800 flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                <Scale size={14} />
                <span>精品手沖粉水比計算機</span>
              </h2>

              <div className="space-y-3 text-xs flex-1 flex flex-col justify-between">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] text-stone-400 block mb-1">研磨粉量 (g)</label>
                    <input 
                      type="number" 
                      value={brewCoffeeWeight}
                      onChange={(e) => setBrewCoffeeWeight(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 font-bold text-stone-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-stone-400 block mb-1">粉水比例 (1:X)</label>
                    <input 
                      type="number" 
                      step="0.5"
                      value={brewRatio}
                      onChange={(e) => setBrewRatio(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 font-bold text-stone-100 outline-none"
                    />
                  </div>
                </div>

                <div className="bg-stone-950 p-3 rounded-xl border border-stone-850 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-400">總注水水量：</span>
                    <span className="text-xs font-black text-amber-400">{(brewCoffeeWeight * brewRatio).toFixed(0)} ml</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-400">預期熟豆 (脫水15%)：</span>
                    <span className="text-stone-300">{(Number(batchWeight) * 0.85).toFixed(0)} g</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-stone-850 pt-2 text-[10px]">
                    <span className="text-stone-400">三段注水計畫：</span>
                    <span className="text-amber-500 font-bold">
                      {Math.round(brewCoffeeWeight * 2)}ml 悶蒸 → {Math.round(brewCoffeeWeight * brewRatio * 0.45)}ml → {Math.round(brewCoffeeWeight * brewRatio * 0.55)}ml
                    </span>
                  </div>
                </div>

                <p className="text-[9px] text-stone-500 text-center italic leading-relaxed">
                  * 本沖煮方案基於 SCA 金杯標準設計，建議手沖咖啡萃取率為 18% - 22%。
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* --- AI 烘焙診斷與沖煮建議 Modal --- */}
      {showAiModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-800 to-indigo-900 p-4 shrink-0 flex flex-col text-white">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 font-black text-sm">
                  <Bot size={18} className="text-purple-300" />
                  <span>Gemini 2.5 大師烘焙與手沖智庫</span>
                </div>
                <button onClick={() => setShowAiModal(false)} className="hover:bg-white/10 p-1 rounded-full transition"><X size={16}/></button>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 text-xs font-bold">
                <button 
                  onClick={() => setActiveAiTab('analysis')}
                  className={`pb-2 px-1 border-b-2 transition-all ${activeAiTab === 'analysis' ? 'border-amber-400 text-amber-400' : 'border-transparent text-purple-200 hover:text-white'}`}
                >
                  📊 烘焙曲線大師診斷
                </button>
                <button 
                  onClick={() => setActiveAiTab('brewing')}
                  className={`pb-2 px-1 border-b-2 transition-all ${activeAiTab === 'brewing' ? 'border-amber-400 text-amber-400' : 'border-transparent text-purple-200 hover:text-white'}`}
                >
                  ☕ SCA 精品手沖指南
                </button>
              </div>
            </div>

            {/* Modal 內容 */}
            <div className="p-6 overflow-y-auto flex-1 bg-stone-950 text-stone-200 space-y-4">
              
              {/* API KEY */}
              {!DEFAULT_API_KEY && !userApiKey && (
                <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-amber-400">輸入 Google Gemini API 金鑰</label>
                    <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-purple-400 underline hover:text-purple-350">免費申請金鑰</a>
                  </div>
                  <input 
                    type="password" value={userApiKey} onChange={(e) => setUserApiKey(e.target.value)} 
                    className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-xs font-mono outline-none focus:border-amber-500"
                    placeholder="貼上您的 Gemini API Key..." 
                  />
                </div>
              )}

              {activeAiTab === 'analysis' && (
                <div className="space-y-4">
                  {isAnalyzing ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-3">
                      <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                      <p className="text-xs font-bold text-purple-400 animate-pulse">大師正細讀蔡老師的 30 秒數據並構思報告中...</p>
                    </div>
                  ) : aiResult ? (
                    <div className="prose prose-invert max-w-none text-xs sm:text-sm whitespace-pre-wrap leading-relaxed bg-stone-900 p-4 rounded-xl border border-stone-850 shadow-inner">
                      {aiResult}
                    </div>
                  ) : (
                    <div className="text-center py-10 space-y-3">
                      <Sparkles size={36} className="mx-auto text-stone-600" />
                      <p className="text-stone-400 text-xs">烘焙曲線錄入完畢後，點擊下方按鈕即可呼叫大師解析。</p>
                      <button onClick={callGeminiAPI} className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2 rounded-xl text-xs transition active:scale-95 shadow-md">
                        開始診斷當前曲線
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeAiTab === 'brewing' && (
                <div className="space-y-4">
                  {isBrewingAnalyzing ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-3">
                      <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                      <p className="text-xs font-bold text-indigo-400 animate-pulse">正在精算與調配專屬此批次咖啡豆的手沖參數...</p>
                    </div>
                  ) : brewingResult ? (
                    <div className="prose prose-invert max-w-none text-xs sm:text-sm whitespace-pre-wrap leading-relaxed bg-stone-900 p-4 rounded-xl border border-stone-850 shadow-inner">
                      {brewingResult}
                    </div>
                  ) : (
                    <div className="text-center py-10 space-y-3">
                      <BookOpen size={36} className="mx-auto text-stone-600" />
                      <p className="text-stone-400 text-xs">大師將根據 DTR 與出豆溫，為蔡老師擬定專屬 V60 沖煮方案。</p>
                      <button onClick={generateBrewingGuide} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2 rounded-xl text-xs transition active:scale-95 shadow-md">
                        生成手沖咖啡配方
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-stone-850 bg-stone-900/60 shrink-0 flex justify-end">
              <button onClick={() => setShowAiModal(false)} className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold px-4 py-2 rounded-xl text-xs transition">
                關閉智庫
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 存檔與評價 Modal --- */}
      {showSaveModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto text-amber-400 mb-2">
                <Award size={24} />
              </div>
              <h3 className="text-base font-black text-stone-100">建立此批次烘焙存檔</h3>
              <p className="text-xs text-stone-400">儲存後可套用此曲線作為日後烘焙時的背景參考線！</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-stone-400 font-bold block mb-1">熟豆品質評價星等 (1 - 10)</label>
                <div className="flex gap-1.5 justify-center flex-wrap">
                  {[1,2,3,4,5,6,7,8,9,10].map((num) => (
                    <button 
                      key={num} onClick={() => setRoastRating(num)}
                      className={`w-8 h-8 rounded-lg font-bold border transition text-xs ${roastRating === num ? 'bg-amber-500 border-amber-500 text-stone-950 font-black' : 'bg-stone-950 border-stone-800 text-stone-400'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-stone-400 font-bold block mb-1">大師杯測筆記</label>
                <textarea 
                  value={roastNotes} onChange={(e) => setRoastNotes(e.target.value)}
                  className="w-full h-18 bg-stone-950 border border-stone-800 rounded-lg p-2.5 outline-none focus:border-amber-500 transition text-stone-100 text-xs"
                  placeholder="可記錄一爆音量、最終出豆色澤或期望風味特徵..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowSaveModal(false)} className="py-2.5 rounded-xl border border-stone-800 text-stone-400 font-bold text-xs">略過</button>
              <button onClick={saveCurrentProfile} className="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg">
                <Save size={14} />
                <span>儲存至歷史庫</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 單一曲線詳情彈窗 --- */}
      {selectedProfileForView && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-stone-800">
              <h3 className="font-black text-sm text-amber-400">📜 烘焙歷史詳情記錄</h3>
              <button onClick={() => setSelectedProfileForView(null)} className="hover:bg-white/10 p-1 rounded-full"><X size={16}/></button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 bg-stone-950 p-3 rounded-xl border border-stone-850 font-mono">
                <p className="text-stone-400">豆款: <span className="text-stone-100 font-bold">{selectedProfileForView.beanName}</span></p>
                <p className="text-stone-400">日期: <span className="text-stone-100 font-bold">{selectedProfileForView.date}</span></p>
                <p className="text-stone-400">入豆溫: <span className="text-stone-100 font-bold">{selectedProfileForView.chargeTemp} °C</span></p>
                <p className="text-stone-400">總烘時間: <span className="text-stone-100 font-bold">{selectedProfileForView.totalTime}</span></p>
                <p className="text-stone-400">裝豆量: <span className="text-stone-100 font-bold">{selectedProfileForView.batchWeight} g</span></p>
                <p className="text-stone-400">發展率 DTR: <span className="text-amber-400 font-bold">{selectedProfileForView.dtr}</span></p>
              </div>

              <div className="bg-stone-950 p-3 rounded-xl border border-stone-850 space-y-1">
                <p className="text-amber-500 font-bold flex items-center gap-1">
                  <Star size={12} fill="currentColor" />
                  大師評分: {selectedProfileForView.rating} / 10 分
                </p>
                <p className="text-stone-400">杯測筆記：</p>
                <p className="text-stone-200 italic whitespace-pre-wrap">{selectedProfileForView.notes || "未留下紀錄。"}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => { selectAsReference(selectedProfileForView); setSelectedProfileForView(null); }}
                className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-4 py-2 rounded-xl text-[11px] flex items-center gap-1"
              >
                <Eye size={12} />
                <span>載入為曲線參考線</span>
              </button>
              <button onClick={() => setSelectedProfileForView(null)} className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold px-4 py-2 rounded-xl text-[11px]">
                關閉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 重設警示 Modal --- */}
      {showResetModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 max-w-sm w-full text-center space-y-4">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500">
              <AlertTriangle size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-stone-100">確認清空重置？</h3>
              <p className="text-xs text-stone-400">這將會清除當前表單中所有的溫度紀錄、事件點、曲線數據，此動作無法復原。</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowResetModal(false)} className="py-2.5 rounded-xl border border-stone-800 text-stone-400 font-bold text-xs">取消</button>
              <button onClick={confirmReset} className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg">確認清除</button>
            </div>
          </div>
        </div>
      )}

      {/* --- 全域 Toast 通知 --- */}
      {notification && (
        <div className="no-print fixed top-6 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-2xl shadow-2xl z-[120] text-xs font-bold flex items-center gap-2 border bg-stone-900 border-stone-800 text-stone-100 animate-in slide-in-from-top-4 duration-300">
          {notification.type === 'error' ? (
            <AlertTriangle size={15} className="text-rose-500" />
          ) : (
            <CheckCircle2 size={15} className="text-emerald-500" />
          )}
          <span>{notification.msg}</span>
        </div>
      )}
    </div>
  );
}
```
```react
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine, Legend 
} from 'recharts';
import { 
  Play, Square, Plus, Thermometer, Clipboard, RefreshCw, Coffee, Timer, 
  RotateCcw, Flame, CheckCircle2, FileDown, AlertTriangle, Sparkles, 
  Bot, X, CornerRightUp, ScrollText, Trash2, Database, Eye, BookOpen, 
  Sliders, Volume2, VolumeX, Save, HelpCircle, ArrowUpRight, Award,
  Scale, Droplets, Bell, CheckSquare, Square as SquareIcon
} from 'lucide-react';

const BEAN_COLORS = [
  { temp: 0, color: '#889e81', name: '生豆 Green' },
  { temp: 130, color: '#a2b380', name: '脫水 Drying' },
  { temp: 155, color: '#cbd18f', name: '轉黃 Yellowing' },
  { temp: 170, color: '#d4b26f', name: '一爆前 Pre-First Crack' },
  { temp: 190, color: '#a67c4e', name: '一爆開始 First Crack' },
  { temp: 205, color: '#7c532b', name: '發展中 Development' },
  { temp: 215, color: '#4a2f13', name: '二爆 Second Crack' },
  { temp: 225, color: '#2b1a08', name: '深烘焙 Dark Roast' },
];

const DEFAULT_API_KEY = "";

export default function App() {
  const [isRoasting, setIsRoasting] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0); 
  const [isPaused, setIsPaused] = useState(false);
  
  // 烘焙設定與參數
  const [beanName, setBeanName] = useState('衣索比亞 耶加雪菲 G1');
  const [chargeTemp, setChargeTemp] = useState('200');
  const [inputTemp, setInputTemp] = useState('');
  const [batchWeight, setBatchWeight] = useState('150'); // 單位：克
  const [environmentTemp, setEnvironmentTemp] = useState('25'); // 室溫

  // 烘焙歷程數據
  const [roastData, setRoastData] = useState([]);
  const [lastReminderTime, setLastReminderTime] = useState(-1);
  const [snapTo30s, setSnapTo30s] = useState(true); // 是否啟用自動 30 秒整點對位
  
  const [events, setEvents] = useState({
    turningPoint: null,
    yellowing: null,
    fcStart: null,
    fcEnd: null,
    scStart: null,
    scEnd: null,
    drop: null
  });

  // 模擬模式與實機記錄模式
  const [isSimulatorMode, setIsSimulatorMode] = useState(true);
  const [simHeat, setSimHeat] = useState(80); // 火力 0 - 100%
  const [simAirflow, setSimAirflow] = useState(30); // 風門 0 - 100%
  const [simBeanTemp, setSimBeanTemp] = useState(200); 
  const [simRoR, setSimRoR] = useState(0);

  // 系統輔助設定
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [audioBeepEnabled, setAudioBeepEnabled] = useState(true);
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [referenceProfile, setReferenceProfile] = useState(null);
  const [selectedProfileForView, setSelectedProfileForView] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [roastRating, setRoastRating] = useState(5);
  const [roastNotes, setRoastNotes] = useState('');

  // 彈出視窗與通知狀態
  const [notification, setNotification] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [activeAiTab, setActiveAiTab] = useState('analysis'); 
  const [aiResult, setAiResult] = useState(""); 
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [brewingResult, setBrewingResult] = useState(""); 
  const [isBrewingAnalyzing, setIsBrewingAnalyzing] = useState(false);
  const [userApiKey, setUserApiKey] = useState(""); 

  // 手沖計算機狀態
  const [brewCoffeeWeight, setBrewCoffeeWeight] = useState(15);
  const [brewRatio, setBrewRatio] = useState(15); // 1:15

  const timerRef = useRef(null);
  const simIntervalRef = useRef(null);
  const scrollRef = useRef(null);

  // 載入歷史檔案
  useEffect(() => {
    const loaded = localStorage.getItem('roastcraft_profiles');
    if (loaded) {
      try {
        setSavedProfiles(JSON.parse(loaded));
      } catch (e) {
        console.error("無法載入烘焙存檔資料", e);
      }
    }
  }, []);

  const saveToLocalStorage = (newProfiles) => {
    setSavedProfiles(newProfiles);
    localStorage.setItem('roastcraft_profiles', JSON.stringify(newProfiles));
  };

  // 瀏覽器音效合成器 (不需加載外部 mp3 即可發出完美 bip 聲)
  const playBeep = () => {
    if (!audioBeepEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880; // 乾淨的高音 A 頻率
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch (e) {
      console.warn("音效撥放失敗", e);
    }
  };

  // 瀏覽器文字轉語音
  const speak = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-TW';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("語音播報失敗", e);
    }
  };

  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined || isNaN(seconds)) return "00:00";
    const safeSeconds = Math.floor(Math.max(0, seconds));
    const m = Math.floor(safeSeconds / 60);
    const s = safeSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getDevTime = (startTime, endTime) => {
    if (startTime === null || startTime === undefined) return "00:00";
    const end = endTime !== null && endTime !== undefined ? endTime : elapsedTime;
    const diff = end - startTime;
    return formatTime(diff);
  };

  const calculateDtr = () => {
    if (!events.fcStart) return "0.0%";
    const fcSec = events.fcStart.timeSeconds;
    const endSec = events.drop ? events.drop.timeSeconds : elapsedTime;
    if (endSec <= fcSec) return "0.0%";
    const devSec = endSec - fcSec;
    const dtr = (devSec / endSec) * 100;
    return `${dtr.toFixed(1)}%`;
  };

  // 30秒倒數計時與整點狀態偵測
  const next30sCountdown = useMemo(() => {
    const elapsedInt = Math.floor(elapsedTime);
    return 30 - (elapsedInt % 30);
  }, [elapsedTime]);

  const countdownProgressPercent = useMemo(() => {
    return ((30 - next30sCountdown) / 30) * 100;
  }, [next30sCountdown]);

  // 偵測並觸發每30秒的整點提示
  useEffect(() => {
    if (isRoasting && !isPaused) {
      const elapsedInt = Math.floor(elapsedTime);
      if (elapsedInt > 0 && elapsedInt % 30 === 0 && elapsedInt !== lastReminderTime) {
        setLastReminderTime(elapsedInt);
        playBeep();
        speak(`請記錄 ${formatTime(elapsedInt)} 溫度`);
        showToast(`⏱️ 達 ${formatTime(elapsedInt)} 記錄時間點！`, "success");
      }
    }
  }, [elapsedTime, isRoasting, isPaused, lastReminderTime]);

  // 取得目前烘焙豆的模擬顏色與階段名稱
  const currentBeanColorAndName = useMemo(() => {
    const currentTemp = roastData[roastData.length - 1]?.temp || parseFloat(chargeTemp) || 200;
    let selected = BEAN_COLORS[0];
    for (let i = 0; i < BEAN_COLORS.length; i++) {
      if (currentTemp >= BEAN_COLORS[i].temp) {
        selected = BEAN_COLORS[i];
      }
    }
    return selected;
  }, [roastData, chargeTemp]);

  // 即時 RoR 預覽 (當使用者在手動輸入框打字時，即時運算其 RoR 趨勢)
  const instantRorPreview = useMemo(() => {
    if (!inputTemp || isNaN(inputTemp) || roastData.length === 0) return null;
    
    // 計算如果在此時此刻寫入，對應前一筆資料的 RoR 值
    let currentSec = Math.floor(elapsedTime);
    if (snapTo30s) {
      // 若啟用對位，計算對位後的秒數
      const remainder = currentSec % 30;
      currentSec = remainder >= 15 ? currentSec + (30 - remainder) : currentSec - remainder;
    }
    
    const lastPoint = roastData[roastData.length - 1];
    const timeDiff = currentSec - lastPoint.timeSeconds;
    
    if (timeDiff <= 0) return null;
    
    const tempDiff = parseFloat(inputTemp) - lastPoint.temp;
    const ror = Math.round(((tempDiff / timeDiff) * 60) * 10) / 10;
    return ror;
  }, [inputTemp, elapsedTime, roastData, snapTo30s]);

  // 採用熱力學微分方程簡化版，計算每秒豆溫與升溫率變化 (模擬模式)
  const runSimulationStep = () => {
    setElapsedTime(prev => {
      const nextTime = prev + 1;
      setSimBeanTemp(currentTemp => {
        let ror = 0;

        // 烘焙階段物理熱能動力學模擬
        if (nextTime < 60) {
          // 1. 剛入豆：豆溫急速下滑，準備到達回溫點 (Turning Point)
          const dropFactor = (nextTime / 60);
          const targetTp = 95 + (parseFloat(environmentTemp) * 0.1); 
          const diff = parseFloat(chargeTemp) - targetTp;
          ror = -diff * Math.exp(-3 * dropFactor) * 0.05;
        } else {
          // 2. 回溫點之後：升溫率(RoR)受火力與風門影響
          const baseHeatTransfer = (simHeat * 0.35) - (simAirflow * 0.12);
          
          // 隨著溫度爬升，機器與豆表熱阻增加
          const heatResistance = (currentTemp - 100) * 0.04;
          
          // 吸熱/放熱物理轉換
          let reactionHeat = 0;
          if (currentTemp >= 150 && currentTemp < 170) {
            // 梅納反應與焦糖化吸熱
            reactionHeat = -1.2;
          } else if (currentTemp >= 190 && currentTemp < 198) {
            // 一爆放熱反應 (發熱)
            reactionHeat = 2.0;
          } else if (currentTemp >= 215) {
            // 二爆劇烈放熱
            reactionHeat = 2.8;
          }

          ror = baseHeatTransfer - heatResistance + reactionHeat;
          
          // 限制合理 RoR 範圍
          ror = Math.max(-5, Math.min(ror, 30));
        }

        const nextTemp = Math.round((currentTemp + (ror / 60)) * 10) / 10;
        setSimRoR(Math.round(ror * 10) / 10);

        // 自動每 30 秒（或自訂時間）在圖表中記錄一筆數據
        if (nextTime % 30 === 0 || nextTime === 1) {
          const formattedRoR = Math.round(ror * 10) / 10;
          const newDataPoint = {
            timeStr: formatTime(nextTime),
            timeSeconds: nextTime,
            temp: nextTemp,
            ror: formattedRoR
          };
          setRoastData(d => {
            // 避免重複寫入
            if (d.some(p => p.timeSeconds === nextTime)) return d;
            return [...d, newDataPoint];
          });
        }

        // 自動觸發模擬事件
        if (nextTime === 60 && !events.turningPoint) {
          setEvents(e => ({ ...e, turningPoint: { timeStr: formatTime(nextTime), timeSeconds: nextTime } }));
        }
        if (currentTemp >= 155 && currentTemp < 156 && !events.yellowing) {
          setEvents(e => ({ ...e, yellowing: { timeStr: formatTime(nextTime), timeSeconds: nextTime } }));
        }
        if (currentTemp >= 191 && currentTemp < 192.5 && !events.fcStart) {
          setEvents(e => ({ ...e, fcStart: { timeStr: formatTime(nextTime), timeSeconds: nextTime } }));
        }

        return nextTemp;
      });
      return nextTime;
    });
  };

  useEffect(() => {
    if (isRoasting && !isPaused) {
      if (isSimulatorMode) {
        simIntervalRef.current = setInterval(() => {
          runSimulationStep();
        }, 1000);
      } else {
        // 真實手動記錄計時器
        timerRef.current = setInterval(() => {
          setElapsedTime(prev => prev + 1);
        }, 1000);
      }
    }

    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRoasting, isPaused, isSimulatorMode, simHeat, simAirflow, roastData, events]);

  const handleStart = () => {
    if (!beanName.trim()) {
      showToast("請輸入烘焙豆子名稱", "error");
      return;
    }
    const cTemp = parseFloat(chargeTemp);
    if (isNaN(cTemp)) {
      showToast("請輸入有效的入豆溫", "error");
      return;
    }

    setElapsedTime(0);
    setLastReminderTime(-1);
    setIsPaused(false);
    setIsRoasting(true);
    
    if (isSimulatorMode) {
      setSimBeanTemp(cTemp);
      setSimRoR(0);
      setRoastData([{ timeStr: '00:00', timeSeconds: 0, temp: cTemp, ror: 0 }]);
    } else {
      setRoastData([{ timeStr: '00:00', timeSeconds: 0, temp: cTemp, ror: 0 }]);
    }

    setEvents({
      turningPoint: null,
      yellowing: null,
      fcStart: null,
      fcEnd: null,
      scStart: null,
      scEnd: null,
      drop: null
    });
    setAiResult("");
    setBrewingResult("");
    
    speak(`烘焙工作站已啟動。入豆溫度為 ${chargeTemp} 度。`);
    showToast("烘焙正式開始！請密切關注 30 秒記錄節奏", "success");
  };

  const handleStop = () => {
    if (!events.drop) {
      recordEvent('drop', elapsedTime);
    }
    setIsRoasting(false);
    speak("烘焙結束，請迅速出豆冷卻");
    showToast("烘焙已完成！推薦使用 AI 診斷或沖煮智庫", "success");
    setShowSaveModal(true);
  };

  const recordEvent = (type, timeRaw) => {
    const timeSec = Math.floor(timeRaw);
    const timeStr = formatTime(timeSec);
    setEvents(prev => ({ ...prev, [type]: { timeStr, timeSeconds: timeSec } }));
  };

  // 手動輸入並新增點
  const handleAddManualDataPoint = (e) => {
    e.preventDefault();
    if (!inputTemp || isNaN(inputTemp)) return;
    
    const tempVal = parseFloat(inputTemp);
    let currentSec = Math.floor(elapsedTime);

    // 如果啟用 30 秒強制對位，將秒數精準歸位到最近的 30 或者是 60 乘積整數點
    if (snapTo30s) {
      const remainder = currentSec % 30;
      if (remainder >= 15) {
        currentSec = currentSec + (30 - remainder);
      } else {
        currentSec = currentSec - remainder;
      }
    }

    const lastPoint = roastData[roastData.length - 1];
    
    if (lastPoint && lastPoint.timeSeconds === currentSec) {
      showToast("此時間點數據已記錄，請勿重複寫入", "error");
      return;
    }

    // 計算升溫率 RoR (每分鐘升溫速度，依據時間差進行歸一化)
    let calculatedRor = 0;
    if (lastPoint) {
      const timeDiff = currentSec - lastPoint.timeSeconds;
      if (timeDiff > 0) {
        calculatedRor = Math.round(((tempVal - lastPoint.temp) / timeDiff) * 60 * 10) / 10;
      }
    }

    const newData = {
      timeStr: formatTime(currentSec),
      timeSeconds: currentSec,
      temp: tempVal,
      ror: calculatedRor
    };

    setRoastData(prev => [...prev, newData]);
    setInputTemp('');
    showToast(`寫入成功：${formatTime(currentSec)} - ${tempVal}°C (RoR: ${calculatedRor})`, "success");
  };

  const handleEventClick = (type) => {
    if (!isRoasting && roastData.length === 0) return;

    if (events[type]) {
      setEvents(prev => ({ ...prev, [type]: null }));
      showToast(`已重設 ${getEventLabel(type)} 事件`, "normal");
      return;
    }

    const currentSec = isRoasting ? elapsedTime : (roastData[roastData.length - 1]?.timeSeconds || 0);
    recordEvent(type, currentSec);
    speak(`${getEventLabel(type)} 已記錄`);
    showToast(`成功記錄 ${getEventLabel(type)}`, "success");

    if (type === 'drop') {
      handleStop();
    }
  };

  const getEventLabel = (type) => {
    switch(type) {
      case 'turningPoint': return '回溫點 (TP)';
      case 'yellowing': return '烘焙轉黃 (Dry)';
      case 'fcStart': return '一爆開始 (FCs)';
      case 'fcEnd': return '一爆結束 (FCe)';
      case 'scStart': return '二爆開始 (SCs)';
      case 'scEnd': return '二爆結束 (SCe)';
      case 'drop': return '下豆 (Drop)';
      default: return '';
    }
  };

  const saveCurrentProfile = () => {
    if (roastData.length === 0) {
      showToast("無資料可以儲存", "error");
      return;
    }

    const newProfile = {
      id: Date.now().toString(),
      beanName: beanName || "未命名批次",
      date: new Date().toLocaleDateString(),
      chargeTemp,
      batchWeight,
      roastData,
      events,
      rating: roastRating,
      notes: roastNotes,
      dtr: calculateDtr(),
      totalTime: formatTime(elapsedTime)
    };

    const updated = [newProfile, ...savedProfiles];
    saveToLocalStorage(updated);
    setShowSaveModal(false);
    showToast("烘焙批次已成功存檔！", "success");
  };

  const deleteProfile = (id) => {
    const filtered = savedProfiles.filter(p => p.id !== id);
    saveToLocalStorage(filtered);
    showToast("烘焙曲線檔案已刪除", "normal");
    if (referenceProfile?.id === id) setReferenceProfile(null);
    if (selectedProfileForView?.id === id) setSelectedProfileForView(null);
  };

  const selectAsReference = (profile) => {
    setReferenceProfile(profile);
    showToast(`已載入「${profile.beanName}」作為背景參考曲線！`, "success");
  };

  const callGeminiAPI = async () => {
    if (roastData.length < 5) {
      setAiResult("⚠️ 目前累積的烘焙數據太少（至少需要 5 個數據點），無法給予合適的診斷建議。");
      return;
    }
    setIsAnalyzing(true);
    setAiResult("");

    const roastCsv = roastData.map(d => `時間:${d.timeStr}, 溫度:${d.temp}°C, RoR:${d.ror}`).join("\n");
    const eventInfo = `
      入豆溫: ${chargeTemp}°C
      回溫點: ${events.turningPoint?.timeStr || "無紀錄"}
      梅納黃化: ${events.yellowing?.timeStr || "無紀錄"}
      一爆開始: ${events.fcStart?.timeStr || "無紀錄"}
      一爆結束: ${events.fcEnd?.timeStr || "無紀錄"}
      下豆時間: ${events.drop?.timeStr || "無紀錄"}
      發展率 (DTR): ${calculateDtr()}
    `;

    const systemPrompt = `你是一位榮獲世界手沖與烘豆大賽冠軍的超頂級烘豆大師。請依據提供的烘焙軌跡與事件，提供繁體中文的專業曲線報告。
    格式需極度精美：
    1. **烘焙度判定與特性解析** (依據 DTR% 與最終下豆溫判斷)
    2. **曲線健檢 (DTR 與 RoR)** (評估 RoR 有無 Crash 或 Flick，溫控是否合理)
    3. **預測風味調性** (精準預測可能帶有的花果酸、糖漿感、焙烤風味)
    4. **大師優化策略** (一針見血的下次火力風門調整建議)
    使用 emoji 豐富排版，使其宛如高階精品咖啡研究報告。`;

    const userPrompt = `咖啡豆名稱: ${beanName}
    裝入克數: ${batchWeight}g
    【烘焙曲線紀錄與事件】
    ${eventInfo}
    【精細溫度曲線數據】
    ${roastCsv}`;

    try {
      const activeKey = userApiKey || DEFAULT_API_KEY;
      if (!activeKey) throw new Error("請先輸入您的 Google Gemini API 金鑰");
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${activeKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] }
        })
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      setAiResult(text || "💡 AI 當前無法提供完整診斷，請稍後重試。");
    } catch (e) {
      setAiResult(`❌ 診斷失敗: ${e.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateBrewingGuide = async () => {
    if (roastData.length < 5) {
      setBrewingResult("⚠️ 請先完成一輪烘焙以產生相關數據。");
      return;
    }
    setIsBrewingAnalyzing(true);
    setBrewingResult("");

    const lastPoint = roastData[roastData.length - 1];
    const systemPrompt = `你是一位世界級的精品咖啡杯測師與頂尖手沖咖啡師。請針對這款咖啡豆的烘焙特性，設計專屬手沖金杯指南。
    內容必須包含：
    1. **建議養豆期** 2. **沖煮關鍵參數表** (水溫、粉水比、研磨刻度建議)
    3. **冠軍級三段注水萃取手法** (以毫升與秒數標註)
    4. **預期金杯品鑑筆記**`;

    const userPrompt = `
      豆子: ${beanName}
      總烘焙時間: ${formatTime(elapsedTime)}
      最終下豆溫度: ${lastPoint?.temp}°C
      一爆起點: ${events.fcStart?.timeStr || "無紀錄"}
      發展時間百分比 (DTR): ${calculateDtr()}
    `;

    try {
      const activeKey = userApiKey || DEFAULT_API_KEY;
      if (!activeKey) throw new Error("請先輸入您的 Google Gemini API 金鑰");

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${activeKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] }
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      setBrewingResult(text || "💡 沖煮配方產生失敗，請再試一次。");
    } catch (e) {
      setBrewingResult(`❌ 配方調配失敗: ${e.message}`);
    } finally {
      setIsBrewingAnalyzing(false);
    }
  };

  const showToast = (msg, type = 'normal') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const confirmReset = () => {
    setIsRoasting(false);
    setIsPaused(false);
    setElapsedTime(0);
    setRoastData([]);
    setEvents({
      turningPoint: null,
      yellowing: null,
      fcStart: null,
      fcEnd: null,
      scStart: null,
      scEnd: null,
      drop: null
    });
    setInputTemp('');
    setAiResult("");
    setBrewingResult("");
    setShowResetModal(false);
    showToast("所有即時狀態與曲線皆已成功重設", "success");
  };

  const handleExportCSV = () => {
    if (roastData.length === 0) {
      showToast("無資料可匯出", "error");
      return;
    }
    const headers = "Time,Time_Seconds,Temperature,RoR,Event\n";
    const eventMap = {};
    Object.entries(events).forEach(([key, val]) => {
      if (val) eventMap[val.timeSeconds] = getEventLabel(key);
    });

    const rows = roastData.map(d => {
      const eventLabel = eventMap[d.timeSeconds] || '';
      return `${d.timeStr},${d.timeSeconds},${d.temp},${d.ror},${eventLabel}`;
    }).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `RoastProfile_${beanName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV 烘焙軌跡已下載！", "success");
  };

  const chartCombinedData = useMemo(() => {
    const maxSec = Math.max(
      roastData[roastData.length - 1]?.timeSeconds || 0,
      referenceProfile?.roastData[referenceProfile.roastData.length - 1]?.timeSeconds || 0,
      600 // 預設 10 分鐘軸
    );

    const points = [];
    for (let s = 0; s <= maxSec; s += 5) {
      const currentPoint = roastData.find(d => Math.abs(d.timeSeconds - s) < 3);
      const refPoint = referenceProfile?.roastData.find(d => Math.abs(d.timeSeconds - s) < 3);

      if (currentPoint || refPoint || s === 0) {
        points.push({
          timeSeconds: s,
          timeStr: formatTime(s),
          temp: currentPoint?.temp,
          ror: currentPoint?.ror,
          refTemp: refPoint?.temp,
          refRoR: refPoint?.ror
        });
      }
    }
    return points;
  }, [roastData, referenceProfile]);

  const customTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-stone-900 border border-stone-700 p-3 rounded-lg text-xs text-stone-200 shadow-xl space-y-1 font-mono">
          <p className="font-bold border-b border-stone-700 pb-1 text-amber-400">🕒 時間: {data.timeStr}</p>
          {data.temp !== undefined && <p className="text-rose-400">🌡️ 當前豆溫: {data.temp} °C</p>}
          {data.ror !== undefined && <p className="text-cyan-400">📈 當前 RoR: {data.ror} °C/m</p>}
          {data.refTemp !== undefined && <p className="text-stone-400">📜 參考豆溫: {data.refTemp} °C</p>}
          {data.refRoR !== undefined && <p className="text-blue-400">📉 參考 RoR: {data.refRoR} °C/m</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-screen flex flex-col bg-stone-950 font-sans text-stone-100 overflow-hidden select-none">
      
      {/* 傳統列印樣式支援 */}
      <style>{`
        @media print {
          body { background-color: white !important; color: black !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .main-layout { display: block !important; height: auto !important; }
        }
      `}</style>

      {/* 頂部導航列 (控制中心) */}
      <header className="shrink-0 bg-stone-900/95 border-b border-stone-800 px-4 py-3 flex flex-wrap justify-between items-center gap-3 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 text-stone-950 p-2 rounded-xl shadow-inner font-black flex items-center justify-center animate-pulse">
            <Coffee size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-wider bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500 bg-clip-text text-transparent">
                RoastCraft AI
              </h1>
              <span className="text-[10px] bg-stone-800 text-stone-400 px-2 py-0.5 rounded-full border border-stone-700 font-mono">v3.5 Professional</span>
            </div>
            <p className="text-[11px] text-stone-400 hidden sm:block">蔡老師專屬工作站：30秒整點對位與即時 RoR 預判</p>
          </div>
        </div>

        {/* 即時碼錶與動態統計數據 */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-950 rounded-xl border border-stone-800 font-mono">
            <Timer size={14} className="text-amber-500" />
            <span className="text-base font-black text-amber-400">{formatTime(elapsedTime)}</span>
          </div>

          <div className="hidden md:flex items-center gap-3 border-l border-stone-800 pl-3">
            <div className="text-center">
              <span className="block text-[9px] uppercase text-stone-500 font-bold">DTR 發展比</span>
              <span className="text-sm font-black text-amber-500">{calculateDtr()}</span>
            </div>
            <div className="text-center border-l border-stone-800 pl-3">
              <span className="block text-[9px] uppercase text-stone-500 font-bold">即時升溫 RoR</span>
              <span className="text-sm font-black text-cyan-400">
                {isSimulatorMode ? `${simRoR} °C/m` : `${roastData[roastData.length - 1]?.ror || 0} °C/m`}
              </span>
            </div>
          </div>

          {/* 靜音/語音助理切換與重設 */}
          <div className="flex items-center gap-1">
            <button 
              onClick={() => { setAudioBeepEnabled(!audioBeepEnabled); showToast(audioBeepEnabled ? "🔔 提醒嗶聲已關閉" : "🔔 提醒嗶聲已開啟", "normal"); }} 
              className={`p-2 rounded-lg border transition ${audioBeepEnabled ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20' : 'bg-stone-800 border-stone-700 text-stone-400 hover:bg-stone-700'}`}
              title="30秒提醒嗶聲"
            >
              <Bell size={16} />
            </button>
            <button 
              onClick={() => { setVoiceEnabled(!voiceEnabled); speak(voiceEnabled ? "語音廣播已關閉" : "語音廣播已開啟"); }} 
              className={`p-2 rounded-lg border transition ${voiceEnabled ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20' : 'bg-stone-800 border-stone-700 text-stone-400 hover:bg-stone-700'}`}
              title="大師語音提示"
            >
              {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <button 
              onClick={() => setIsSimulatorMode(!isSimulatorMode)} 
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1 ${isSimulatorMode ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400' : 'bg-stone-800 border-stone-700 text-stone-400'}`}
              title="切換模擬器與實體烘豆模式"
            >
              <Sliders size={12} />
              <span>{isSimulatorMode ? "模擬模式" : "手動實機"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 主版面 */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

        {/* 左側：控制、事件設定、數據列表與模擬器調教 */}
        <section className="w-full lg:w-[410px] xl:w-[450px] shrink-0 border-r border-stone-800 bg-stone-900/40 flex flex-col overflow-y-auto p-4 space-y-4 no-print select-none">
          
          {/* 1. 烘焙設定與物理模擬調節面板 */}
          <div className="bg-stone-900/90 rounded-2xl p-4 border border-stone-800 shadow-xl space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-stone-800">
              <h2 className="text-sm font-black text-amber-400 flex items-center gap-1.5">
                <Sliders size={16} />
                <span>1. 烘焙基本變數與計畫</span>
              </h2>
              {isSimulatorMode && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                  動態熱力學模擬
                </span>
              )}
            </div>

            {/* 基本咖啡豆與物理變數設定 */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="text-[10px] text-stone-400 font-bold block mb-1">豆款名稱</label>
                <input 
                  type="text" 
                  value={beanName} 
                  onChange={(e) => setBeanName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-sm text-stone-100 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                  placeholder="例：衣索比亞 藝妓..."
                />
              </div>
              <div>
                <label className="text-[10px] text-stone-400 font-bold block mb-1">裝豆量 (克)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={batchWeight} 
                    onChange={(e) => setBatchWeight(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-sm text-stone-100 outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 text-[10px]">g</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-stone-400 font-bold block mb-1">目標入豆溫</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={chargeTemp} 
                    onChange={(e) => setChargeTemp(e.target.value)}
                    disabled={isRoasting}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-sm text-stone-100 outline-none disabled:opacity-50"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 text-[10px]">°C</span>
                </div>
              </div>
            </div>

            {/* 物理模擬即時熱能調節滑塊 */}
            {isSimulatorMode && isRoasting && (
              <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800/80 space-y-3 animate-in slide-in-from-top duration-300">
                <div className="flex justify-between text-xs text-stone-300 font-bold">
                  <span className="flex items-center gap-1 text-orange-400"><Flame size={14} /> 即時火力: {simHeat}%</span>
                  <span className="flex items-center gap-1 text-blue-400"><Droplets size={14} /> 風門風速: {simAirflow}%</span>
                </div>
                
                <div className="space-y-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={simHeat}
                    onChange={(e) => setSimHeat(Number(e.target.value))}
                    className="w-full accent-orange-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
                  />
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={simAirflow}
                    onChange={(e) => setSimAirflow(Number(e.target.value))}
                    className="w-full accent-blue-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-stone-400 text-center italic">
                  * 調整火力滑塊，豆溫與 RoR (升溫率) 軌跡將即時同步反應！
                </p>
              </div>
            )}

            {/* 控制主按鍵 */}
            <div className="flex gap-2 pt-1">
              {!isRoasting ? (
                <button 
                  onClick={handleStart} 
                  className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 active:scale-[0.98] text-stone-950 rounded-xl font-extrabold flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <Play size={18} fill="currentColor" />
                  <span>開始烘焙</span>
                </button>
              ) : (
                <button 
                  onClick={handleStop} 
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-stone-100 rounded-xl font-extrabold flex items-center justify-center gap-2 shadow-lg animate-pulse transition"
                >
                  <SquareIcon size={16} fill="currentColor" />
                  <span>下豆冷卻</span>
                </button>
              )}
              
              <button 
                onClick={() => setShowResetModal(true)}
                className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl border border-stone-700 transition"
                title="清空重置"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>

          {/* 2. 30秒倒數與手動數據急速輸入面板 */}
          <div className="bg-stone-900/90 rounded-2xl p-4 border border-stone-800 shadow-xl space-y-4">
            
            {/* 30秒倒數計時進度儀 */}
            {isRoasting && (
              <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-stone-400 font-bold flex items-center gap-1.5">
                    <Timer size={14} className="text-amber-500" />
                    <span>30秒定時記錄提醒</span>
                  </span>
                  <span className={`text-xs font-black px-2 py-0.5 rounded font-mono ${next30sCountdown <= 5 ? 'bg-rose-500/20 text-rose-400 animate-bounce' : 'bg-stone-800 text-stone-300'}`}>
                    {next30sCountdown <= 5 ? `倒數 ${next30sCountdown}s (準備輸入!)` : `距離下次記錄：${next30sCountdown}秒`}
                  </span>
                </div>
                
                {/* 自製倒數進度條 */}
                <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${next30sCountdown <= 5 ? 'bg-gradient-to-r from-rose-500 to-orange-500' : 'bg-gradient-to-r from-amber-500 to-amber-300'}`}
                    style={{ width: `${countdownProgressPercent}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pb-2 border-b border-stone-800">
              <h2 className="text-sm font-black text-amber-400 flex items-center gap-1.5">
                <CornerRightUp size={16} />
                <span>2. 手動輸入 & 30秒強制對位</span>
              </h2>
            </div>

            {/* 輸入與對位開關控制 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-stone-950/40 p-2.5 rounded-xl border border-stone-800 text-xs">
                <span className="text-stone-300 flex items-center gap-1">
                  <HelpCircle size={13} className="text-stone-400" />
                  30秒時間自動對位 (強烈推薦)
                </span>
                <button 
                  onClick={() => setSnapTo30s(!snapTo30s)}
                  className={`px-3 py-1 rounded font-bold transition text-[11px] ${snapTo30s ? 'bg-amber-500 text-stone-950' : 'bg-stone-850 text-stone-400'}`}
                >
                  {snapTo30s ? "已對位 (例如 1:28 → 1:30)" : "自由時間記錄"}
                </button>
              </div>

              {/* 手動輸入豆溫 + 即時 RoR 預覽 */}
              <form onSubmit={handleAddManualDataPoint} className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Thermometer className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={16} />
                    <input 
                      type="number" 
                      step="0.1" 
                      disabled={!isRoasting}
                      value={inputTemp}
                      onChange={(e) => setInputTemp(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2.5 text-sm font-bold outline-none focus:border-amber-500 transition text-stone-100 disabled:opacity-50"
                      placeholder={isSimulatorMode ? "模擬模式中 (不需打字)" : "輸入當前豆溫 °C..."}
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={!isRoasting || !inputTemp || isSimulatorMode}
                    className="px-5 bg-amber-500 hover:bg-amber-600 disabled:bg-stone-800 text-stone-950 font-black rounded-xl flex items-center justify-center transition"
                  >
                    <Plus size={22} />
                  </button>
                </div>

                {/* 即時 RoR 運算預覽 Badge */}
                {inputTemp && !isSimulatorMode && (
                  <div className="bg-stone-950 p-2 rounded-xl border border-stone-850 text-xs flex justify-between items-center animate-in fade-in">
                    <span className="text-stone-400">目前輸入之即時預估 RoR：</span>
                    <span className={`font-mono font-black text-sm ${instantRorPreview >= 15 ? 'text-rose-400' : instantRorPreview < 5 ? 'text-cyan-400' : 'text-emerald-400'}`}>
                      {instantRorPreview !== null ? `${instantRorPreview > 0 ? `+${instantRorPreview}` : instantRorPreview} °C/m` : "計算中..."}
                    </span>
                  </div>
                )}
              </form>
            </div>

            {/* 大師事件按鈕網格 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button 
                onClick={() => handleEventClick('turningPoint')}
                disabled={!isRoasting}
                className={`py-2 px-1.5 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${events.turningPoint ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-stone-950 border-stone-800 text-stone-400 hover:bg-stone-800'}`}
              >
                <span className="text-[10px] opacity-75">TP</span>
                <span>回溫點</span>
                {events.turningPoint && <span className="font-mono text-[9px] mt-0.5">{events.turningPoint.timeStr}</span>}
              </button>

              <button 
                onClick={() => handleEventClick('yellowing')}
                disabled={!isRoasting}
                className={`py-2 px-1.5 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${events.yellowing ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-stone-950 border-stone-800 text-stone-400 hover:bg-stone-800'}`}
              >
                <span className="text-[10px] opacity-75">Dry</span>
                <span>烘焙轉黃</span>
                {events.yellowing && <span className="font-mono text-[9px] mt-0.5">{events.yellowing.timeStr}</span>}
              </button>

              <button 
                onClick={() => handleEventClick('fcStart')}
                disabled={!isRoasting}
                className={`py-2 px-1.5 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${events.fcStart ? 'bg-orange-500/10 border-orange-500 text-orange-400' : 'bg-stone-950 border-stone-800 text-stone-400 hover:bg-stone-800'}`}
              >
                <span className="text-[10px] opacity-75">FCs</span>
                <span>一爆始</span>
                {events.fcStart && <span className="font-mono text-[9px] mt-0.5">{events.fcStart.timeStr}</span>}
              </button>

              <button 
                onClick={() => handleEventClick('fcEnd')}
                disabled={!isRoasting}
                className={`py-2 px-1.5 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${events.fcEnd ? 'bg-orange-600/10 border-orange-600 text-orange-400' : 'bg-stone-950 border-stone-800 text-stone-400 hover:bg-stone-800'}`}
              >
                <span className="text-[10px] opacity-75">FCe</span>
                <span>一爆終</span>
                {events.fcEnd && <span className="font-mono text-[9px] mt-0.5">{events.fcEnd.timeStr}</span>}
              </button>

              <button 
                onClick={() => handleEventClick('scStart')}
                disabled={!isRoasting}
                className={`py-2 px-1.5 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${events.scStart ? 'bg-red-500/10 border-red-500 text-red-400' : 'bg-stone-950 border-stone-800 text-stone-400 hover:bg-stone-800'}`}
              >
                <span className="text-[10px] opacity-75">SCs</span>
                <span>二爆始</span>
                {events.scStart && <span className="font-mono text-[9px] mt-0.5">{events.scStart.timeStr}</span>}
              </button>

              <button 
                onClick={() => handleEventClick('drop')}
                disabled={!isRoasting}
                className={`py-2 px-1.5 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${events.drop ? 'bg-stone-100 text-stone-950 border-stone-100' : 'bg-stone-950 border-stone-800 text-stone-400 hover:bg-stone-800'}`}
              >
                <span className="text-[10px] opacity-75">Drop</span>
                <span>出豆下豆</span>
                {events.drop && <span className="font-mono text-[9px] mt-0.5">{events.drop.timeStr}</span>}
              </button>
            </div>
          </div>

          {/* 3. 即時烘焙豆色澤動態追蹤與物理變化 (亮點特色) */}
          <div className="bg-stone-900/90 rounded-2xl p-4 border border-stone-800 shadow-xl flex items-center gap-4">
            <div className="relative">
              <svg className="w-16 h-16 drop-shadow-lg transition-colors duration-500" viewBox="0 0 100 100">
                <path 
                  d="M 50 10 C 20 10, 10 35, 10 60 C 10 85, 30 90, 50 90 C 70 90, 90 85, 90 60 C 90 35, 80 10, 50 10 Z" 
                  fill={currentBeanColorAndName.color} 
                />
                <path 
                  d="M 50 12 Q 40 40, 55 60 Q 35 75, 50 88" 
                  fill="none" 
                  stroke="#1c1105" 
                  strokeWidth="4" 
                  strokeLinecap="round"
                  className={isRoasting ? "animate-pulse" : ""}
                />
              </svg>
            </div>
            <div className="flex-1 space-y-1">
              <span className="text-[10px] text-stone-400 font-extrabold uppercase tracking-widest">
                目前豆表物理特徵
              </span>
              <h3 className="text-base font-black text-amber-400">
                {currentBeanColorAndName.name}
              </h3>
              <p className="text-xs text-stone-400">
                預估豆溫：<span className="font-bold text-amber-500 font-mono">
                  {isSimulatorMode ? simBeanTemp : roastData[roastData.length - 1]?.temp || chargeTemp} °C
                </span>
              </p>
            </div>
          </div>

          {/* 4. 即時烘焙數據軌跡表 */}
          <div className="bg-stone-900/90 rounded-2xl border border-stone-800 shadow-xl overflow-hidden flex flex-col min-h-[220px] max-h-[300px]">
            <div className="p-3 bg-stone-950 border-b border-stone-800 flex justify-between items-center text-xs">
              <span className="font-bold text-stone-300">📊 烘焙數據歷史 (蔡老師30秒整點記錄)</span>
              {roastData.length > 0 && (
                <button 
                  onClick={handleExportCSV}
                  className="text-[10px] bg-stone-800 hover:bg-stone-700 text-amber-400 px-2 py-1 rounded border border-stone-700 flex items-center gap-1"
                >
                  <FileDown size={12} />
                  <span>匯出 CSV</span>
                </button>
              )}
            </div>
            
            <div className="flex-grow overflow-y-auto" ref={scrollRef}>
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-950 text-stone-400 sticky top-0 shadow-md">
                  <tr>
                    <th className="p-2 font-bold text-[10px] uppercase">時間</th>
                    <th className="p-2 font-bold text-[10px] uppercase">豆溫 (°C)</th>
                    <th className="p-2 font-bold text-[10px] uppercase text-right">即時 RoR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                  {roastData.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="p-6 text-center text-stone-500 italic">
                        等待烘焙啟動，每30秒將記下一筆數據點。
                      </td>
                    </tr>
                  ) : (
                    roastData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-stone-800/40">
                        <td className="p-2 font-mono text-stone-400">{row.timeStr}</td>
                        <td className="p-2 font-bold text-stone-100">{row.temp} °C</td>
                        <td className={`p-2 font-mono font-bold text-right ${row.ror > 15 ? 'text-rose-500' : row.ror < 6 ? 'text-cyan-400' : 'text-emerald-500'}`}>
                          {row.ror > 0 ? `+${row.ror}` : row.ror} °C/m
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 右側核心看板：主烘焙雙曲線、AI 大師診斷實驗室、精品沖煮計算機、歷史檔案庫 */}
        <section className="flex-1 bg-stone-950 p-4 flex flex-col space-y-4 overflow-y-auto">
          
          {/* A. 頂級烘焙軌跡對比曲線圖 */}
          <div className="bg-stone-900/80 rounded-2xl p-4 border border-stone-800 shadow-2xl flex-1 min-h-[350px] sm:min-h-[420px] flex flex-col relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-2 border-b border-stone-800 mb-4 gap-2">
              <div>
                <h2 className="text-sm font-black text-amber-400 flex items-center gap-2">
                  <Coffee size={16} />
                  <span>RoastCraft 大師核心雙軌曲線儀 (30s 最佳分辨率)</span>
                </h2>
                {referenceProfile && (
                  <p className="text-[10px] text-stone-400">
                    目前正在對比背景參考曲線：<span className="text-amber-400 font-bold">{referenceProfile.beanName} ({referenceProfile.date})</span>
                  </p>
                )}
              </div>
              
              <div className="flex gap-2 text-xs no-print">
                <button 
                  onClick={() => { setShowAiModal(true); setActiveAiTab('analysis'); if (roastData.length >= 5) callGeminiAPI(); }}
                  className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1 transition"
                >
                  <Sparkles size={13} />
                  <span>AI 診斷曲線</span>
                </button>
                <button 
                  onClick={() => { setShowAiModal(true); setActiveAiTab('brewing'); if (roastData.length >= 5) generateBrewingGuide(); }}
                  className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1 transition"
                >
                  <BookOpen size={13} />
                  <span>手沖配方</span>
                </button>
                {referenceProfile && (
                  <button 
                    onClick={() => setReferenceProfile(null)}
                    className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold px-2.5 py-1 rounded-lg border border-stone-700"
                  >
                    清除參考線
                  </button>
                )}
              </div>
            </div>

            {/* Recharts 曲線渲染 */}
            <div className="flex-1 w-full min-h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartCombinedData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <CartesianGrid stroke="#2e2a24" strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timeSeconds" 
                    type="number" 
                    domain={[0, 'dataMax + 60']} 
                    tickFormatter={formatTime} 
                    stroke="#78716c"
                    tick={{ fontSize: 10, fill: '#a8a29e' }}
                  />
                  
                  {/* Y 軸 1: 豆溫 (紅) */}
                  <YAxis 
                    yAxisId="temp" 
                    domain={[60, 240]} 
                    stroke="#ef4444" 
                    width={35}
                    tick={{ fontSize: 10, fill: '#ef4444' }}
                    label={{ value: '咖啡豆溫 (°C)', angle: -90, position: 'insideLeft', offset: 10, fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }}
                  />
                  
                  {/* Y 軸 2: RoR 升溫率 (藍) */}
                  <YAxis 
                    yAxisId="ror" 
                    orientation="right" 
                    domain={[-5, 30]} 
                    stroke="#3b82f6" 
                    width={35}
                    tick={{ fontSize: 10, fill: '#3b82f6' }}
                    label={{ value: '升溫率 RoR (°C/m)', angle: 90, position: 'insideRight', offset: 10, fill: '#3b82f6', fontSize: 10, fontWeight: 'bold' }}
                  />
                  
                  <Tooltip content={customTooltip} />
                  <Legend verticalAlign="top" height={36} iconSize={10} wrapperStyle={{ fontSize: '11px', color: '#e7e5e4' }} />
                  
                  {/* 當前烘焙曲線實線 */}
                  <Line yAxisId="temp" type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={3.5} name="當前豆溫" dot={true} isAnimationActive={false} />
                  <Line yAxisId="ror" type="monotone" dataKey="ror" stroke="#3b82f6" strokeWidth={2.5} name="當前 RoR" dot={false} isAnimationActive={false} />
                  
                  {/* 歷史對比虛線 */}
                  {referenceProfile && (
                    <>
                      <Line yAxisId="temp" type="monotone" dataKey="refTemp" stroke="#fca5a5" strokeDasharray="5 5" strokeWidth={2} name="[參考] 歷史豆溫" dot={false} isAnimationActive={false} />
                      <Line yAxisId="ror" type="monotone" dataKey="refRoR" stroke="#93c5fd" strokeDasharray="5 5" strokeWidth={1.5} name="[參考] 歷史 RoR" dot={false} isAnimationActive={false} />
                    </>
                  )}

                  {/* 關鍵烘焙事件參考標線 */}
                  {events.turningPoint && <ReferenceLine yAxisId="temp" x={events.turningPoint.timeSeconds} stroke="#06b6d4" strokeDasharray="3 3" label={{ position: 'top', value: 'TP 回溫', fill: '#06b6d4', fontSize: 10 }} />}
                  {events.yellowing && <ReferenceLine yAxisId="temp" x={events.yellowing.timeSeconds} stroke="#eab308" strokeDasharray="3 3" label={{ position: 'top', value: 'Dry 轉黃', fill: '#eab308', fontSize: 10 }} />}
                  {events.fcStart && <ReferenceLine yAxisId="temp" x={events.fcStart.timeSeconds} stroke="#f97316" strokeDasharray="3 3" label={{ position: 'top', value: '1爆始', fill: '#f97316', fontSize: 10 }} />}
                  {events.fcEnd && <ReferenceLine yAxisId="temp" x={events.fcEnd.timeSeconds} stroke="#ea580c" strokeDasharray="3 3" label={{ position: 'top', value: '1爆終', fill: '#ea580c', fontSize: 10 }} />}
                  {events.scStart && <ReferenceLine yAxisId="temp" x={events.scStart.timeSeconds} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: '2爆始', fill: '#ef4444', fontSize: 10 }} />}
                  {events.drop && <ReferenceLine yAxisId="temp" x={events.drop.timeSeconds} stroke="#fafaf9" strokeDasharray="3 3" label={{ position: 'top', value: '出豆', fill: '#fafaf9', fontSize: 10 }} />}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            
            {/* B. 歷史烘焙檔案庫與對比系統 */}
            <div className="bg-stone-900/80 rounded-2xl p-4 border border-stone-800 shadow-xl flex flex-col min-h-[250px]">
              <h2 className="text-sm font-black text-amber-400 pb-2 border-b border-stone-800 flex items-center gap-1.5 mb-3">
                <Database size={16} />
                <span>烘焙資料庫</span>
              </h2>

              <div className="flex-1 overflow-y-auto space-y-2 max-h-[200px] pr-1">
                {savedProfiles.length === 0 ? (
                  <div className="text-center py-8 text-stone-500 text-xs italic">
                    尚未儲存任何烘焙曲線。下豆後即可為您的心血結晶存檔！
                  </div>
                ) : (
                  savedProfiles.map((p) => (
                    <div key={p.id} className="bg-stone-950 p-3 rounded-xl border border-stone-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:border-stone-700 transition">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-stone-100">{p.beanName}</h4>
                          <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20">{p.dtr} DTR</span>
                        </div>
                        <p className="text-[10px] text-stone-400">日期: {p.date} • 烘焙時間: {p.totalTime} • 重: {p.batchWeight}g</p>
                      </div>

                      <div className="flex gap-1.5 self-end sm:self-auto">
                        <button 
                          onClick={() => selectAsReference(p)}
                          className="bg-amber-500 hover:bg-amber-600 text-stone-950 text-[10px] font-extrabold px-2 py-1 rounded transition flex items-center gap-0.5"
                          title="載入至背景對比"
                        >
                          <Eye size={10} />
                          <span>對比</span>
                        </button>
                        <button 
                          onClick={() => setSelectedProfileForView(p)}
                          className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-[10px] font-bold px-2 py-1 rounded"
                        >
                          詳情
                        </button>
                        <button 
                          onClick={() => deleteProfile(p.id)}
                          className="text-stone-500 hover:text-red-400 p-1 rounded transition"
                          title="刪除"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* C. 手沖咖啡金杯萃取計算機 */}
            <div className="bg-stone-900/80 rounded-2xl p-4 border border-stone-800 shadow-xl flex flex-col min-h-[250px]">
              <h2 className="text-sm font-black text-amber-400 pb-2 border-b border-stone-800 flex items-center gap-1.5 mb-3">
                <Scale size={16} />
                <span>精品手沖粉水比金杯計算機</span>
              </h2>

              <div className="space-y-3 text-xs flex-1 flex flex-col justify-between">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-stone-400 font-bold block mb-1">熟豆粉量 (克)</label>
                    <input 
                      type="number" 
                      value={brewCoffeeWeight}
                      onChange={(e) => setBrewCoffeeWeight(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 font-bold text-stone-100 outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-400 font-bold block mb-1">粉水比例 (1:X)</label>
                    <input 
                      type="number" 
                      step="0.5"
                      value={brewRatio}
                      onChange={(e) => setBrewRatio(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 font-bold text-stone-100 outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="bg-stone-950 p-3 rounded-xl border border-stone-850 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-400">總注水總量：</span>
                    <span className="text-sm font-extrabold text-amber-400">{(brewCoffeeWeight * brewRatio).toFixed(0)} ml</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-400">預計可烘出熟豆 (預估15%脫水率)：</span>
                    <span className="text-xs font-bold text-stone-300">{(Number(batchWeight) * 0.85).toFixed(0)} g 熟豆</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-t border-stone-800 pt-2">
                    <span className="text-stone-400 font-bold">三段式手沖注水點：</span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {Math.round(brewCoffeeWeight * 2)}ml 悶蒸 → {Math.round(brewCoffeeWeight * brewRatio * 0.45)}ml → {Math.round(brewCoffeeWeight * brewRatio * 0.55)}ml
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-stone-500 italic text-center">
                  * SCA 標準：手沖咖啡萃取率建議落在 18% - 22% 的金杯區間。
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* --- AI 烘焙診斷與沖煮建議 Modal --- */}
      {showAiModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
            
            {/* Modal 頂部 */}
            <div className="bg-gradient-to-r from-purple-800 to-indigo-900 p-4 shrink-0 flex flex-col text-white">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 font-black text-base">
                  <Bot size={20} className="text-purple-300" />
                  <span>Gemini 2.5 大師烘焙與沖煮智庫</span>
                </div>
                <button onClick={() => setShowAiModal(false)} className="hover:bg-white/10 p-1 rounded-full transition"><X size={18}/></button>
              </div>

              {/* 頁籤切換 */}
              <div className="flex gap-4 text-sm font-bold">
                <button 
                  onClick={() => setActiveAiTab('analysis')}
                  className={`pb-2 px-1 border-b-2 transition-all ${activeAiTab === 'analysis' ? 'border-amber-400 text-amber-400' : 'border-transparent text-purple-200 hover:text-white'}`}
                >
                  📊 烘焙診斷與優化
                </button>
                <button 
                  onClick={() => setActiveAiTab('brewing')}
                  className={`pb-2 px-1 border-b-2 transition-all ${activeAiTab === 'brewing' ? 'border-amber-400 text-amber-400' : 'border-transparent text-purple-200 hover:text-white'}`}
                >
                  ☕ 冠軍手沖參數推薦
                </button>
              </div>
            </div>

            {/* Modal 內容 */}
            <div className="p-6 overflow-y-auto flex-1 bg-stone-950 text-stone-200 space-y-4">
              
              {/* API KEY 輸入 */}
              {!DEFAULT_API_KEY && !userApiKey && (
                <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-amber-400">輸入個人 Google Gemini API 金鑰</label>
                    <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-purple-400 underline hover:text-purple-300">免費申請 API Key</a>
                  </div>
                  <input 
                    type="password" 
                    value={userApiKey} 
                    onChange={(e) => setUserApiKey(e.target.value)} 
                    className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-xs font-mono outline-none focus:border-amber-500"
                    placeholder="貼上 AI Studio 取得的 API 金鑰..." 
                  />
                </div>
              )}

              {/* 烘焙診斷 */}
              {activeAiTab === 'analysis' && (
                <div className="space-y-4">
                  {isAnalyzing ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                      <p className="text-sm font-bold text-purple-400 animate-pulse">大師正在調閱蔡老師的烘焙曲線並精算中...</p>
                    </div>
                  ) : aiResult ? (
                    <div className="prose prose-invert max-w-none text-xs sm:text-sm whitespace-pre-wrap leading-relaxed bg-stone-900 p-4 rounded-xl border border-stone-850 shadow-inner">
                      {aiResult}
                    </div>
                  ) : (
                    <div className="text-center py-10 space-y-3">
                      <Sparkles size={40} className="mx-auto text-stone-600" />
                      <p className="text-stone-400 text-xs">準備好烘焙曲線數據後，即可呼叫大師 AI 提供專業分析報告。</p>
                      <button 
                        onClick={callGeminiAPI} 
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2 rounded-xl text-xs transition active:scale-95 shadow-md"
                      >
                        開始分析當前曲線
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 沖煮參數 */}
              {activeAiTab === 'brewing' && (
                <div className="space-y-4">
                  {isBrewingAnalyzing ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                      <p className="text-sm font-bold text-indigo-400 animate-pulse">正在精準擬定金杯手沖水溫與注水手法參數...</p>
                    </div>
                  ) : brewingResult ? (
                    <div className="prose prose-invert max-w-none text-xs sm:text-sm whitespace-pre-wrap leading-relaxed bg-stone-900 p-4 rounded-xl border border-stone-850 shadow-inner">
                      {brewingResult}
                    </div>
                  ) : (
                    <div className="text-center py-10 space-y-3">
                      <BookOpen size={40} className="mx-auto text-stone-600" />
                      <p className="text-stone-400 text-xs">大師將根據下豆溫與 DTR 發展比，為您精算專屬咖啡的沖煮指南。</p>
                      <button 
                        onClick={generateBrewingGuide} 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2 rounded-xl text-xs transition active:scale-95 shadow-md"
                      >
                        產生冠軍沖煮方案
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal 底部 */}
            <div className="p-4 border-t border-stone-850 shrink-0 flex justify-end gap-2 bg-stone-900/60">
              <button 
                onClick={() => setShowAiModal(false)}
                className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                關閉智庫
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 存檔與評價設定 Modal --- */}
      {showSaveModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto text-amber-400 mb-2">
                <Award size={24} />
              </div>
              <h3 className="text-base font-black text-stone-100">為此批烘焙檔案建立存檔</h3>
              <p className="text-xs text-stone-400">儲存後，您可以將此曲線隨時作為日後烘焙的背景對比參考線！</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-stone-400 font-bold block mb-1">熟豆品質自我評分 (1 - 10)</label>
                <div className="flex gap-1.5 justify-center">
                  {[1,2,3,4,5,6,7,8,9,10].map((num) => (
                    <button 
                      key={num}
                      onClick={() => setRoastRating(num)}
                      className={`w-8 h-8 rounded-lg font-bold transition text-xs border ${roastRating === num ? 'bg-amber-500 border-amber-500 text-stone-950 font-black' : 'bg-stone-950 border-stone-800 text-stone-400'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-stone-400 font-bold block mb-1">烘焙大師杯測筆記</label>
                <textarea 
                  value={roastNotes}
                  onChange={(e) => setRoastNotes(e.target.value)}
                  className="w-full h-20 bg-stone-950 border border-stone-800 rounded-lg p-2.5 outline-none focus:border-amber-500 transition text-stone-100"
                  placeholder="紀錄烘焙特徵、一爆劇烈度、或期望風味..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setShowSaveModal(false)}
                className="py-2.5 rounded-xl border border-stone-800 text-stone-400 font-bold text-xs"
              >
                略過
              </button>
              <button 
                onClick={saveCurrentProfile}
                className="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg"
              >
                <Save size={14} />
                <span>儲存至資料庫</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 單一歷史曲線詳情彈窗 --- */}
      {selectedProfileForView && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-stone-800">
              <h3 className="font-black text-base text-amber-400">📜 烘焙歷史詳情與大師評定</h3>
              <button onClick={() => setSelectedProfileForView(null)} className="hover:bg-white/10 p-1 rounded-full"><X size={16}/></button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-stone-950 p-3 rounded-xl border border-stone-850">
                <p className="text-stone-400">豆款名稱: <span className="text-stone-100 font-bold">{selectedProfileForView.beanName}</span></p>
                <p className="text-stone-400">烘焙日期: <span className="text-stone-100 font-bold">{selectedProfileForView.date}</span></p>
                <p className="text-stone-400">入豆溫度: <span className="text-stone-100 font-bold">{selectedProfileForView.chargeTemp} °C</span></p>
                <p className="text-stone-400">總計時間: <span className="text-stone-100 font-bold">{selectedProfileForView.totalTime}</span></p>
                <p className="text-stone-400">裝豆重量: <span className="text-stone-100 font-bold">{selectedProfileForView.batchWeight} g</span></p>
                <p className="text-stone-400">發展比率 (DTR): <span className="text-amber-400 font-bold">{selectedProfileForView.dtr}</span></p>
              </div>

              <div className="bg-stone-950 p-3 rounded-xl border border-stone-850 space-y-1">
                <div className="flex items-center gap-1 font-bold text-amber-500 mb-1">
                  <Award size={14} />
                  <span>評定星等: {selectedProfileForView.rating} / 10 分</span>
                </div>
                <p className="text-stone-400">大師杯測筆記：</p>
                <p className="text-stone-200 italic font-medium whitespace-pre-wrap">
                  {selectedProfileForView.notes || "無填寫杯測筆記。"}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => selectAsReference(selectedProfileForView)}
                className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1"
              >
                <Eye size={12} />
                <span>套用為對比線</span>
              </button>
              <button 
                onClick={() => setSelectedProfileForView(null)}
                className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold px-4 py-2 rounded-xl text-xs"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 重設警示 Modal --- */}
      {showResetModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 max-w-sm w-full text-center space-y-4">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500">
              <AlertTriangle size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-stone-100">確認清空重置？</h3>
              <p className="text-xs text-stone-400">這將會清除當前計時器、事件點以及圖表中所有的曲線數據，且此動作無法復原。</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowResetModal(false)} className="py-2 rounded-xl border border-stone-800 text-stone-400 font-bold text-xs">取消</button>
              <button onClick={confirmReset} className="py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg">確認清除</button>
            </div>
          </div>
        </div>
      )}

      {/* --- 全域 Toast 通知 --- */}
      {notification && (
        <div className="no-print fixed top-6 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-2xl shadow-2xl z-[120] text-xs font-bold flex items-center gap-2 border bg-stone-900 border-stone-800 text-stone-100 animate-in slide-in-from-top-4 duration-300">
          {notification.type === 'error' ? (
            <AlertTriangle size={15} className="text-rose-500" />
          ) : (
            <CheckCircle2 size={15} className="text-emerald-500" />
          )}
          <span>{notification.msg}</span>
        </div>
      )}
    </div>
  );
}
```
```react
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine, Legend 
} from 'recharts';
import { 
  Play, Square, Plus, Thermometer, Clipboard, RefreshCw, Coffee, Timer, 
  RotateCcw, Flame, CheckCircle2, FileDown, AlertTriangle, Sparkles, 
  Bot, X, CornerRightUp, ScrollText, Trash2, Database, Eye, BookOpen, 
  Sliders, Volume2, VolumeX, Save, HelpCircle, ArrowUpRight, Award,
  Scale, Droplets
} from 'lucide-react';

const BEAN_COLORS = [
  { temp: 0, color: '#889e81', name: '生豆 Green' },
  { temp: 130, color: '#a2b380', name: '脫水 Drying' },
  { temp: 155, color: '#cbd18f', name: '轉黃 Yellowing' },
  { temp: 170, color: '#d4b26f', name: '一爆前 Pre-First Crack' },
  { temp: 190, color: '#a67c4e', name: '一爆開始 First Crack' },
  { temp: 205, color: '#7c532b', name: '發展中 Development' },
  { temp: 215, color: '#4a2f13', name: '二爆 Second Crack' },
  { temp: 225, color: '#2b1a08', name: '深烘焙 Dark Roast' },
];

const DEFAULT_API_KEY = "";

export default function App() {
  const [isRoasting, setIsRoasting] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0); 
  const [isPaused, setIsPaused] = useState(false);
  
  // 烘焙設定與參數
  const [beanName, setBeanName] = useState('耶加雪菲 沃卡 G1');
  const [chargeTemp, setChargeTemp] = useState('200');
  const [inputTemp, setInputTemp] = useState('');
  const [batchWeight, setBatchWeight] = useState('150'); // 單位：克
  const [environmentTemp, setEnvironmentTemp] = useState('25'); // 室溫
  const [environmentHumidity, setEnvironmentHumidity] = useState('55'); // 濕度

  // 烘焙歷程數據
  const [roastData, setRoastData] = useState([]);
  
  const [events, setEvents] = useState({
    turningPoint: null,
    yellowing: null,
    fcStart: null,
    fcEnd: null,
    scStart: null,
    scEnd: null,
    drop: null
  });

  const [isSimulatorMode, setIsSimulatorMode] = useState(true);
  const [simHeat, setSimHeat] = useState(80); // 火力 0 - 100%
  const [simAirflow, setSimAirflow] = useState(30); // 風門 0 - 100%
  const [simBeanTemp, setSimBeanTemp] = useState(200); 
  const [simRoR, setSimRoR] = useState(0);
  const [lastSimUpdate, setLastSimUpdate] = useState(0);

  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [referenceProfile, setReferenceProfile] = useState(null);
  const [selectedProfileForView, setSelectedProfileForView] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [roastRating, setRoastRating] = useState(5);
  const [roastNotes, setRoastNotes] = useState('');

  const [notification, setNotification] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [activeAiTab, setActiveAiTab] = useState('analysis'); 
  const [aiResult, setAiResult] = useState(""); 
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [brewingResult, setBrewingResult] = useState(""); 
  const [isBrewingAnalyzing, setIsBrewingAnalyzing] = useState(false);
  const [userApiKey, setUserApiKey] = useState(""); 

  const [brewCoffeeWeight, setBrewCoffeeWeight] = useState(15);
  const [brewRatio, setBrewRatio] = useState(15); // 1:15
  const [brewTargetTDS, setBrewTargetTDS] = useState(1.35); // 金杯目標

  const timerRef = useRef(null);
  const simIntervalRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const loaded = localStorage.getItem('roastcraft_profiles');
    if (loaded) {
      try {
        setSavedProfiles(JSON.parse(loaded));
      } catch (e) {
        console.error("無法載入烘焙存檔資料", e);
      }
    }
  }, []);

  const saveToLocalStorage = (newProfiles) => {
    setSavedProfiles(newProfiles);
    localStorage.setItem('roastcraft_profiles', JSON.stringify(newProfiles));
  };

  const speak = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-TW';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("語音撥報失敗", e);
    }
  };

  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined || isNaN(seconds)) return "00:00";
    const safeSeconds = Math.floor(Math.max(0, seconds));
    const m = Math.floor(safeSeconds / 60);
    const s = safeSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getDevTime = (startTime, endTime) => {
    if (startTime === null || startTime === undefined) return "00:00";
    const end = endTime !== null && endTime !== undefined ? endTime : elapsedTime;
    const diff = end - startTime;
    return formatTime(diff);
  };

  const calculateDtr = () => {
    if (!events.fcStart) return "0.0%";
    const fcSec = events.fcStart.timeSeconds;
    const endSec = events.drop ? events.drop.timeSeconds : elapsedTime;
    if (endSec <= fcSec) return "0.0%";
    const devSec = endSec - fcSec;
    const dtr = (devSec / endSec) * 100;
    return `${dtr.toFixed(1)}%`;
  };

  // 取得目前烘焙豆的模擬顏色與階段名稱
  const currentBeanColorAndName = useMemo(() => {
    const currentTemp = roastData[roastData.length - 1]?.temp || parseFloat(chargeTemp) || 200;
    let selected = BEAN_COLORS[0];
    for (let i = 0; i < BEAN_COLORS.length; i++) {
      if (currentTemp >= BEAN_COLORS[i].temp) {
        selected = BEAN_COLORS[i];
      }
    }
    return selected;
  }, [roastData, chargeTemp]);

  // 採用熱力學微分方程簡化版，計算每秒豆溫與升溫率變化
  const runSimulationStep = () => {
    setElapsedTime(prev => {
      const nextTime = prev + 1;
      setSimBeanTemp(currentTemp => {
        let ror = 0;
        const lastPoint = roastData[roastData.length - 1];

        // 烘焙階段物理熱能動力學模擬
        if (nextTime < 60) {
          // 1. 剛入豆：豆溫急速下滑，準備到達回溫點 (Turning Point)
          const dropFactor = (nextTime / 60);
          const targetTp = 95 + (parseFloat(environmentTemp) * 0.1); 
          const diff = parseFloat(chargeTemp) - targetTp;
          ror = -diff * Math.exp(-3 * dropFactor) * 0.05;
        } else {
          // 2. 回溫點之後：升溫率(RoR)受火力與風門影響
          // 火力正向影響，風門起調節與散熱作用，生豆吸熱/放熱物理轉換
          const baseHeatTransfer = (simHeat * 0.35) - (simAirflow * 0.12);
          
          // 隨著溫度爬升，熱阻增加
          const heatResistance = (currentTemp - 100) * 0.04;
          
          // 吸熱放熱反應變化
          let reactionHeat = 0;
          if (currentTemp >= 150 && currentTemp < 170) {
            // 梅納反應與焦糖化吸熱
            reactionHeat = -1.2;
          } else if (currentTemp >= 190 && currentTemp < 198) {
            // 一爆放熱反應 (發熱)
            reactionHeat = 1.8;
          } else if (currentTemp >= 215) {
            // 二爆劇烈放熱
            reactionHeat = 2.5;
          }

          ror = baseHeatTransfer - heatResistance + reactionHeat;
          
          // 限制合理 RoR 範圍
          ror = Math.max(-5, Math.min(ror, 30));
        }

        const nextTemp = Math.round((currentTemp + (ror / 60)) * 10) / 10;
        setSimRoR(Math.round(ror * 10) / 10);

        // 自動每 5 秒在圖表中記錄一筆數據，或即時渲染
        if (nextTime % 5 === 0 || nextTime === 1) {
          const formattedRoR = Math.round(ror * 10) / 10;
          const newDataPoint = {
            timeStr: formatTime(nextTime),
            timeSeconds: nextTime,
            temp: nextTemp,
            ror: formattedRoR
          };
          setRoastData(d => [...d, newDataPoint]);
        }

        // 自動觸發模擬事件
        if (nextTime === 60 && !events.turningPoint) {
          setEvents(e => ({ ...e, turningPoint: { timeStr: formatTime(nextTime), timeSeconds: nextTime } }));
          speak("已到達回溫點");
        }
        if (currentTemp >= 155 && currentTemp < 156 && !events.yellowing) {
          setEvents(e => ({ ...e, yellowing: { timeStr: formatTime(nextTime), timeSeconds: nextTime } }));
          speak("烘焙轉黃，進入梅納反應階段");
        }
        if (currentTemp >= 191 && currentTemp < 192.5 && !events.fcStart) {
          setEvents(e => ({ ...e, fcStart: { timeStr: formatTime(nextTime), timeSeconds: nextTime } }));
          speak("一爆開始！請密切注意升溫率變化");
        }

        return nextTemp;
      });
      return nextTime;
    });
  };

  useEffect(() => {
    if (isRoasting && !isPaused) {
      if (isSimulatorMode) {
        simIntervalRef.current = setInterval(() => {
          runSimulationStep();
        }, 1000);
      } else {
        // 真實手動記錄時的碼錶計時器
        timerRef.current = setInterval(() => {
          setElapsedTime(prev => prev + 1);
        }, 1000);
      }
    }

    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRoasting, isPaused, isSimulatorMode, simHeat, simAirflow, roastData, events]);

  const handleStart = () => {
    if (!beanName.trim()) {
      showToast("請輸入烘焙豆子名稱", "error");
      return;
    }
    const cTemp = parseFloat(chargeTemp);
    if (isNaN(cTemp)) {
      showToast("請輸入有效的入豆溫", "error");
      return;
    }

    setElapsedTime(0);
    setIsPaused(false);
    setIsRoasting(true);
    
    if (isSimulatorMode) {
      setSimBeanTemp(cTemp);
      setSimRoR(0);
      setRoastData([{ timeStr: '00:00', timeSeconds: 0, temp: cTemp, ror: 0 }]);
    } else {
      setRoastData([{ timeStr: '00:00', timeSeconds: 0, temp: cTemp, ror: 0 }]);
    }

    setEvents({
      turningPoint: null,
      yellowing: null,
      fcStart: null,
      fcEnd: null,
      scStart: null,
      scEnd: null,
      drop: null
    });
    setAiResult("");
    setBrewingResult("");
    
    speak(`烘焙工作站已啟動。入豆溫度為 ${chargeTemp} 度。`);
    showToast("烘焙正式開始！", "success");
  };

  const handleStop = () => {
    if (!events.drop) {
      recordEvent('drop', elapsedTime);
    }
    setIsRoasting(false);
    speak("烘焙結束，請迅速出豆冷卻");
    showToast("烘焙已完成！建議前往儲存曲線或進行 AI 分析", "success");
    setShowSaveModal(true);
  };

  const recordEvent = (type, timeRaw) => {
    const timeSec = Math.floor(timeRaw);
    const timeStr = formatTime(timeSec);
    setEvents(prev => ({ ...prev, [type]: { timeStr, timeSeconds: timeSec } }));
  };

  const handleAddManualDataPoint = (e) => {
    e.preventDefault();
    if (!inputTemp || isNaN(inputTemp)) return;
    
    const tempVal = parseFloat(inputTemp);
    const currentSec = Math.floor(elapsedTime);
    const lastPoint = roastData[roastData.length - 1];
    
    if (lastPoint && lastPoint.timeSeconds === currentSec) {
      showToast("同一秒內不能重複紀錄數據", "error");
      return;
    }

    // 計算升溫率 RoR (每分鐘升溫速度)
    let calculatedRor = 0;
    if (lastPoint) {
      const timeDiff = currentSec - lastPoint.timeSeconds;
      if (timeDiff > 0) {
        calculatedRor = Math.round(((tempVal - lastPoint.temp) / timeDiff) * 60 * 10) / 10;
      }
    }

    const newData = {
      timeStr: formatTime(currentSec),
      timeSeconds: currentSec,
      temp: tempVal,
      ror: calculatedRor
    };

    setRoastData(prev => [...prev, newData]);
    setInputTemp('');
    showToast(`手動記錄：${formatTime(currentSec)} - ${tempVal}°C (RoR: ${calculatedRor})`, "normal");
  };

  const handleEventClick = (type) => {
    if (!isRoasting && roastData.length === 0) return;

    if (events[type]) {
      setEvents(prev => ({ ...prev, [type]: null }));
      showToast(`已重設 ${getEventLabel(type)} 事件`, "normal");
      return;
    }

    const currentSec = isRoasting ? elapsedTime : (roastData[roastData.length - 1]?.timeSeconds || 0);
    recordEvent(type, currentSec);
    speak(`${getEventLabel(type)} 已記錄`);
    showToast(`成功記錄 ${getEventLabel(type)}`, "success");

    if (type === 'drop') {
      handleStop();
    }
  };

  const getEventLabel = (type) => {
    switch(type) {
      case 'turningPoint': return '回溫點 (TP)';
      case 'yellowing': return '烘焙轉黃 (Dry)';
      case 'fcStart': return '一爆開始 (FCs)';
      case 'fcEnd': return '一爆結束 (FCe)';
      case 'scStart': return '二爆開始 (SCs)';
      case 'scEnd': return '二爆結束 (SCe)';
      case 'drop': return '下豆 (Drop)';
      default: return '';
    }
  };

  const saveCurrentProfile = () => {
    if (roastData.length === 0) {
      showToast("無資料可以儲存", "error");
      return;
    }

    const newProfile = {
      id: Date.now().toString(),
      beanName: beanName || "未命名批次",
      date: new Date().toLocaleDateString(),
      chargeTemp,
      batchWeight,
      roastData,
      events,
      rating: roastRating,
      notes: roastNotes,
      dtr: calculateDtr(),
      totalTime: formatTime(elapsedTime)
    };

    const updated = [newProfile, ...savedProfiles];
    saveToLocalStorage(updated);
    setShowSaveModal(false);
    showToast("烘焙批次已成功存檔！", "success");
  };

  const deleteProfile = (id) => {
    const filtered = savedProfiles.filter(p => p.id !== id);
    saveToLocalStorage(filtered);
    showToast("烘焙曲線檔案已刪除", "normal");
    if (referenceProfile?.id === id) setReferenceProfile(null);
    if (selectedProfileForView?.id === id) setSelectedProfileForView(null);
  };

  const selectAsReference = (profile) => {
    setReferenceProfile(profile);
    showToast(`已載入「${profile.beanName}」作為背景參考曲線！`, "success");
  };

  const callGeminiAPI = async () => {
    if (roastData.length < 5) {
      setAiResult("⚠️ 目前累積的烘焙數據太少（至少需要5個數據點），無法給予合適的診斷建議。");
      return;
    }
    setIsAnalyzing(true);
    setAiResult("");

    const roastCsv = roastData.map(d => `時間:${d.timeStr}, 溫度:${d.temp}°C, RoR:${d.ror}`).join("\n");
    const eventInfo = `
      入豆溫: ${chargeTemp}°C
      回溫點: ${events.turningPoint?.timeStr || "無紀錄"}
      梅納黃化: ${events.yellowing?.timeStr || "無紀錄"}
      一爆開始: ${events.fcStart?.timeStr || "無紀錄"}
      一爆結束: ${events.fcEnd?.timeStr || "無紀錄"}
      下豆時間: ${events.drop?.timeStr || "無紀錄"}
      發展率 (DTR): ${calculateDtr()}
    `;

    const systemPrompt = `你是一位榮獲世界手沖與烘豆大賽冠軍的超頂級烘豆大師。請依據提供的烘焙軌跡與事件，提供繁體中文的專業曲線報告。
    格式需極度精美：
    1. **烘焙度判定與特性解析** (依據 DTR% 與最終下豆溫判斷)
    2. **曲線健檢 (DTR 與 RoR)** (評估 RoR 有無 Crash 或 Flick，溫控是否合理)
    3. **預測風味調性** (精準預測可能帶有的花果酸、糖漿感、焙烤風味)
    4. **大師優化策略** (一針見血的下次火力風門調整建議)
    使用 emoji 豐富排版，使其宛如高階精品咖啡研究報告。`;

    const userPrompt = `咖啡豆名稱: ${beanName}
    裝入克數: ${batchWeight}g
    【烘焙曲線紀錄與事件】
    ${eventInfo}
    【精細溫度曲線數據】
    ${roastCsv}`;

    try {
      const activeKey = userApiKey || DEFAULT_API_KEY;
      if (!activeKey) throw new Error("請先輸入您的 Google Gemini API 金鑰");
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${activeKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] }
        })
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      setAiResult(text || "💡 AI 當前無法提供完整診斷，請稍後重試。");
    } catch (e) {
      setAiResult(`❌ 診斷失敗: ${e.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateBrewingGuide = async () => {
    if (roastData.length < 5) {
      setBrewingResult("⚠️ 請先完成一輪烘焙以產生相關數據。");
      return;
    }
    setIsBrewingAnalyzing(true);
    setBrewingResult("");

    const lastPoint = roastData[roastData.length - 1];
    const systemPrompt = `你是一位世界級的精品咖啡杯測師與頂尖手沖咖啡師。請針對這款咖啡豆的烘焙特性，設計專屬手沖金杯指南。
    內容必須包含：
    1. **建議養豆期** 
    2. **沖煮關鍵參數表** (水溫、粉水比、研磨刻度建議)
    3. **冠軍級三段注水萃取手法** (以毫升與秒數標註)
    4. **預期金杯品鑑筆記**`;

    const userPrompt = `
      豆子: ${beanName}
      總烘焙時間: ${formatTime(elapsedTime)}
      最終下豆溫度: ${lastPoint?.temp}°C
      一爆起點: ${events.fcStart?.timeStr || "無紀錄"}
      發展時間百分比 (DTR): ${calculateDtr()}
    `;

    try {
      const activeKey = userApiKey || DEFAULT_API_KEY;
      if (!activeKey) throw new Error("請先輸入您的 Google Gemini API 金鑰");

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${activeKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] }
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      setBrewingResult(text || "💡 沖煮配方產生失敗，請再試一次。");
    } catch (e) {
      setBrewingResult(`❌ 配方調配失敗: ${e.message}`);
    } finally {
      setIsBrewingAnalyzing(false);
    }
  };

  const showToast = (msg, type = 'normal') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const confirmReset = () => {
    setIsRoasting(false);
    setIsPaused(false);
    setElapsedTime(0);
    setRoastData([]);
    setEvents({
      turningPoint: null,
      yellowing: null,
      fcStart: null,
      fcEnd: null,
      scStart: null,
      scEnd: null,
      drop: null
    });
    setInputTemp('');
    setAiResult("");
    setBrewingResult("");
    setShowResetModal(false);
    showToast("所有即時狀態與曲線皆已成功重設", "success");
  };

  const handleExportCSV = () => {
    if (roastData.length === 0) {
      showToast("無資料可匯出", "error");
      return;
    }
    const headers = "Time,Time_Seconds,Temperature,RoR,Event\n";
    const eventMap = {};
    Object.entries(events).forEach(([key, val]) => {
      if (val) eventMap[val.timeSeconds] = getEventLabel(key);
    });

    const rows = roastData.map(d => {
      const eventLabel = eventMap[d.timeSeconds] || '';
      return `${d.timeStr},${d.timeSeconds},${d.temp},${d.ror},${eventLabel}`;
    }).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `RoastProfile_${beanName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV 烘焙軌跡已下載！", "success");
  };

  const chartCombinedData = useMemo(() => {
    // 建立一個整合當前數據與參考數據的秒數數組
    const maxSec = Math.max(
      roastData[roastData.length - 1]?.timeSeconds || 0,
      referenceProfile?.roastData[referenceProfile.roastData.length - 1]?.timeSeconds || 0,
      600 // 預設 10 分鐘軸
    );

    // 建立對應刻度 (每 5 秒一個點，使其圖表更精簡)
    const points = [];
    for (let s = 0; s <= maxSec; s += 5) {
      const currentPoint = roastData.find(d => Math.abs(d.timeSeconds - s) < 3);
      const refPoint = referenceProfile?.roastData.find(d => Math.abs(d.timeSeconds - s) < 3);

      if (currentPoint || refPoint || s === 0) {
        points.push({
          timeSeconds: s,
          timeStr: formatTime(s),
          temp: currentPoint?.temp,
          ror: currentPoint?.ror,
          refTemp: refPoint?.temp,
          refRoR: refPoint?.ror
        });
      }
    }
    return points;
  }, [roastData, referenceProfile]);

  const customTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-stone-900 border border-stone-700 p-3 rounded-lg text-xs text-stone-200 shadow-xl space-y-1 font-mono">
          <p className="font-bold border-b border-stone-700 pb-1 text-amber-400">🕒 時間: {data.timeStr}</p>
          {data.temp !== undefined && <p className="text-rose-400">🌡️ 當前豆溫: {data.temp} °C</p>}
          {data.ror !== undefined && <p className="text-cyan-400">📈 當前 RoR: {data.ror} °C/m</p>}
          {data.refTemp !== undefined && <p className="text-stone-400">📜 參考豆溫: {data.refTemp} °C</p>}
          {data.refRoR !== undefined && <p className="text-blue-400">📉 參考 RoR: {data.refRoR} °C/m</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-screen flex flex-col bg-stone-950 font-sans text-stone-100 overflow-hidden select-none">
      
      {/* 傳統列印樣式支援 */}
      <style>{`
        @media print {
          body { background-color: white !important; color: black !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .main-layout { display: block !important; height: auto !important; }
        }
      `}</style>

      {/* 頂部導航列 (控制中心) */}
      <header className="shrink-0 bg-stone-900/95 border-b border-stone-800 px-4 py-3 flex flex-wrap justify-between items-center gap-3 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 text-stone-950 p-2 rounded-xl shadow-inner font-black flex items-center justify-center animate-pulse">
            <Coffee size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-wider bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500 bg-clip-text text-transparent">
                RoastCraft AI
              </h1>
              <span className="text-[10px] bg-stone-800 text-stone-400 px-2 py-0.5 rounded-full border border-stone-700 font-mono">v3.2 Premium</span>
            </div>
            <p className="text-[11px] text-stone-400 hidden sm:block">世界級智慧咖啡烘焙與物理模擬工作站</p>
          </div>
        </div>

        {/* 即時碼錶與動態統計數據 */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-950 rounded-xl border border-stone-800 font-mono">
            <Timer size={14} className="text-amber-500" />
            <span className="text-base font-black text-amber-400">{formatTime(elapsedTime)}</span>
          </div>

          <div className="hidden md:flex items-center gap-3 border-l border-stone-800 pl-3">
            <div className="text-center">
              <span className="block text-[9px] uppercase text-stone-500 font-bold">DTR 發展比</span>
              <span className="text-sm font-black text-amber-500">{calculateDtr()}</span>
            </div>
            <div className="text-center border-l border-stone-800 pl-3">
              <span className="block text-[9px] uppercase text-stone-500 font-bold">即時升溫 RoR</span>
              <span className="text-sm font-black text-cyan-400">
                {isSimulatorMode ? `${simRoR} °C/m` : `${roastData[roastData.length - 1]?.ror || 0} °C/m`}
              </span>
            </div>
          </div>

          {/* 靜音/語音助理切換與重設 */}
          <div className="flex items-center gap-1">
            <button 
              onClick={() => { setVoiceEnabled(!voiceEnabled); speak(voiceEnabled ? "語音輔助已關閉" : "語音輔助已開啟"); }} 
              className={`p-2 rounded-lg border transition ${voiceEnabled ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20' : 'bg-stone-800 border-stone-700 text-stone-400 hover:bg-stone-700'}`}
              title="語音合成提示助手"
            >
              {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <button 
              onClick={() => setIsSimulatorMode(!isSimulatorMode)} 
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1 ${isSimulatorMode ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400' : 'bg-stone-800 border-stone-700 text-stone-400'}`}
              title="切換模擬器與實體烘豆模式"
            >
              <Sliders size={12} />
              <span>{isSimulatorMode ? "物理模擬" : "實機紀錄"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 主版面 */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

        {/* 左側：控制、事件設定、數據列表與模擬器調教 */}
        <section className="w-full lg:w-[410px] xl:w-[450px] shrink-0 border-r border-stone-800 bg-stone-900/40 flex flex-col overflow-y-auto p-4 space-y-4 no-print select-none">
          
          {/* 1. 烘焙設定與物理模擬調節面板 */}
          <div className="bg-stone-900/90 rounded-2xl p-4 border border-stone-800 shadow-xl space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-stone-800">
              <h2 className="text-sm font-black text-amber-400 flex items-center gap-1.5">
                <Sliders size={16} />
                <span>1. 烘焙計畫與物理模擬</span>
              </h2>
              {isSimulatorMode && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                  動態物理模型
                </span>
              )}
            </div>

            {/* 基本咖啡豆與物理變數設定 */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="text-[10px] text-stone-400 font-bold block mb-1">豆款名稱</label>
                <input 
                  type="text" 
                  value={beanName} 
                  onChange={(e) => setBeanName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-sm text-stone-100 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                  placeholder="例：衣索比亞 藝妓..."
                />
              </div>
              <div>
                <label className="text-[10px] text-stone-400 font-bold block mb-1">裝豆量 (克)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={batchWeight} 
                    onChange={(e) => setBatchWeight(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-sm text-stone-100 outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 text-[10px]">g</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-stone-400 font-bold block mb-1">目標入豆溫</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={chargeTemp} 
                    onChange={(e) => setChargeTemp(e.target.value)}
                    disabled={isRoasting}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-sm text-stone-100 outline-none disabled:opacity-50"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 text-[10px]">°C</span>
                </div>
              </div>
            </div>

            {/* 物理模擬即時熱能調節滑塊 */}
            {isSimulatorMode && isRoasting && (
              <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800/80 space-y-3 animate-in slide-in-from-top duration-300">
                <div className="flex justify-between text-xs text-stone-300 font-bold">
                  <span className="flex items-center gap-1 text-orange-400"><Flame size={14} /> 即時火力: {simHeat}%</span>
                  <span className="flex items-center gap-1 text-blue-400"><Droplets size={14} /> 風門風速: {simAirflow}%</span>
                </div>
                
                <div className="space-y-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={simHeat}
                    onChange={(e) => setSimHeat(Number(e.target.value))}
                    className="w-full accent-orange-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
                  />
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={simAirflow}
                    onChange={(e) => setSimAirflow(Number(e.target.value))}
                    className="w-full accent-blue-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-stone-500 text-center italic">
                  * 調整滑塊將即時計算熱力學微分方程，影響豆溫攀升斜率
                </p>
              </div>
            )}

            {/* 控制主按鍵 */}
            <div className="flex gap-2 pt-1">
              {!isRoasting ? (
                <button 
                  onClick={handleStart} 
                  className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 active:scale-[0.98] text-stone-950 rounded-xl font-extrabold flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <Play size={18} fill="currentColor" />
                  <span>開始烘焙</span>
                </button>
              ) : (
                <button 
                  onClick={handleStop} 
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-stone-100 rounded-xl font-extrabold flex items-center justify-center gap-2 shadow-lg animate-pulse transition"
                >
                  <Square size={16} fill="currentColor" />
                  <span>出豆 / 下豆</span>
                </button>
              )}
              
              <button 
                onClick={() => setShowResetModal(true)}
                className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl border border-stone-700 transition"
                title="清空重置"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>

          {/* 2. 即時烘焙豆色澤動態追蹤與物理變化 (亮點特色) */}
          <div className="bg-stone-900/90 rounded-2xl p-4 border border-stone-800 shadow-xl flex items-center gap-4">
            <div className="relative">
              {/* 精美 SVG 咖啡豆設計 */}
              <svg className="w-16 h-16 drop-shadow-lg transition-colors duration-500" viewBox="0 0 100 100">
                <path 
                  d="M 50 10 C 20 10, 10 35, 10 60 C 10 85, 30 90, 50 90 C 70 90, 90 85, 90 60 C 90 35, 80 10, 50 10 Z" 
                  fill={currentBeanColorAndName.color} 
                />
                {/* 咖啡豆中間裂紋線 */}
                <path 
                  d="M 50 12 Q 40 40, 55 60 Q 35 75, 50 88" 
                  fill="none" 
                  stroke="#1c1105" 
                  strokeWidth="4" 
                  strokeLinecap="round"
                  className={isRoasting ? "animate-pulse" : ""}
                />
              </svg>
            </div>
            <div className="flex-1 space-y-1">
              <span className="text-[10px] text-stone-400 font-extrabold uppercase tracking-widest">
                目前豆表物理特徵
              </span>
              <h3 className="text-base font-black text-amber-400">
                {currentBeanColorAndName.name}
              </h3>
              <p className="text-xs text-stone-400">
                預估豆溫約 <span className="font-bold text-amber-500 font-mono">
                  {isSimulatorMode ? simBeanTemp : roastData[roastData.length - 1]?.temp || chargeTemp} °C
                </span>
              </p>
            </div>
          </div>

          {/* 3. 實機手動輸入與大師事件快速記錄 */}
          <div className="bg-stone-900/90 rounded-2xl p-4 border border-stone-800 shadow-xl space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-stone-800">
              <h2 className="text-sm font-black text-amber-400 flex items-center gap-1.5">
                <CornerRightUp size={16} />
                <span>2. 烘焙關鍵事件與手動記錄</span>
              </h2>
            </div>

            {/* 真實模式手動輸入豆溫 */}
            {!isSimulatorMode && (
              <form onSubmit={handleAddManualDataPoint} className="flex gap-2 animate-in fade-in duration-300">
                <div className="relative flex-1">
                  <Thermometer className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={16} />
                  <input 
                    type="number" 
                    step="0.1" 
                    disabled={!isRoasting}
                    value={inputTemp}
                    onChange={(e) => setInputTemp(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-sm outline-none focus:border-amber-500 transition text-stone-100 disabled:opacity-50"
                    placeholder="手動輸入當前溫度 °C..."
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={!isRoasting || !inputTemp}
                  className="px-4 bg-amber-500 hover:bg-amber-600 disabled:bg-stone-800 text-stone-950 font-bold rounded-xl flex items-center justify-center transition"
                >
                  <Plus size={20} />
                </button>
              </form>
            )}

            {/* 大師事件按鈕網格 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button 
                onClick={() => handleEventClick('turningPoint')}
                disabled={!isRoasting}
                className={`py-2 px-1.5 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${events.turningPoint ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-stone-950 border-stone-800 text-stone-400 hover:bg-stone-800'}`}
              >
                <span className="text-[10px] opacity-75">TP</span>
                <span>回溫點</span>
                {events.turningPoint && <span className="font-mono text-[9px] mt-0.5">{events.turningPoint.timeStr}</span>}
              </button>

              <button 
                onClick={() => handleEventClick('yellowing')}
                disabled={!isRoasting}
                className={`py-2 px-1.5 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${events.yellowing ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-stone-950 border-stone-800 text-stone-400 hover:bg-stone-800'}`}
              >
                <span className="text-[10px] opacity-75">Dry</span>
                <span>烘焙轉黃</span>
                {events.yellowing && <span className="font-mono text-[9px] mt-0.5">{events.yellowing.timeStr}</span>}
              </button>

              <button 
                onClick={() => handleEventClick('fcStart')}
                disabled={!isRoasting}
                className={`py-2 px-1.5 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${events.fcStart ? 'bg-orange-500/10 border-orange-500 text-orange-400' : 'bg-stone-950 border-stone-800 text-stone-400 hover:bg-stone-800'}`}
              >
                <span className="text-[10px] opacity-75">FCs</span>
                <span>一爆始</span>
                {events.fcStart && <span className="font-mono text-[9px] mt-0.5">{events.fcStart.timeStr}</span>}
              </button>

              <button 
                onClick={() => handleEventClick('fcEnd')}
                disabled={!isRoasting}
                className={`py-2 px-1.5 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${events.fcEnd ? 'bg-orange-600/10 border-orange-600 text-orange-400' : 'bg-stone-950 border-stone-800 text-stone-400 hover:bg-stone-800'}`}
              >
                <span className="text-[10px] opacity-75">FCe</span>
                <span>一爆終</span>
                {events.fcEnd && <span className="font-mono text-[9px] mt-0.5">{events.fcEnd.timeStr}</span>}
              </button>

              <button 
                onClick={() => handleEventClick('scStart')}
                disabled={!isRoasting}
                className={`py-2 px-1.5 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${events.scStart ? 'bg-red-500/10 border-red-500 text-red-400' : 'bg-stone-950 border-stone-800 text-stone-400 hover:bg-stone-800'}`}
              >
                <span className="text-[10px] opacity-75">SCs</span>
                <span>二爆始</span>
                {events.scStart && <span className="font-mono text-[9px] mt-0.5">{events.scStart.timeStr}</span>}
              </button>

              <button 
                onClick={() => handleEventClick('drop')}
                disabled={!isRoasting}
                className={`py-2 px-1.5 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${events.drop ? 'bg-stone-100 text-stone-950 border-stone-100' : 'bg-stone-950 border-stone-800 text-stone-400 hover:bg-stone-800'}`}
              >
                <span className="text-[10px] opacity-75">Drop</span>
                <span>下豆出爐</span>
                {events.drop && <span className="font-mono text-[9px] mt-0.5">{events.drop.timeStr}</span>}
              </button>
            </div>
          </div>

          {/* 4. 即時烘焙數據軌跡表 */}
          <div className="bg-stone-900/90 rounded-2xl border border-stone-800 shadow-xl overflow-hidden flex flex-col min-h-[220px]">
            <div className="p-3 bg-stone-950 border-b border-stone-800 flex justify-between items-center text-xs">
              <span className="font-bold text-stone-300">📈 即時數據歷程 (每5秒紀錄)</span>
              {roastData.length > 0 && (
                <div className="flex gap-2">
                  <button 
                    onClick={handleExportCSV}
                    className="text-[10px] bg-stone-800 hover:bg-stone-700 text-amber-400 px-2 py-1 rounded border border-stone-700 flex items-center gap-1"
                  >
                    <FileDown size={12} />
                    <span>匯出 CSV</span>
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex-grow overflow-y-auto max-h-[250px]" ref={scrollRef}>
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-950 text-stone-400 sticky top-0 shadow-md">
                  <tr>
                    <th className="p-2 font-bold text-[10px] uppercase">時間 (分:秒)</th>
                    <th className="p-2 font-bold text-[10px] uppercase">當前豆溫</th>
                    <th className="p-2 font-bold text-[10px] uppercase text-right">RoR (升溫率)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                  {roastData.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="p-6 text-center text-stone-500 italic">
                        等待烘焙開始...
                      </td>
                    </tr>
                  ) : (
                    roastData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-stone-800/40">
                        <td className="p-2 font-mono text-stone-400">{row.timeStr}</td>
                        <td className="p-2 font-bold text-stone-100">{row.temp} °C</td>
                        <td className={`p-2 font-mono font-bold text-right ${row.ror > 15 ? 'text-rose-500' : row.ror < 6 ? 'text-cyan-400' : 'text-emerald-500'}`}>
                          {row.ror > 0 ? `+${row.ror}` : row.ror} °C/m
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 右側核心看板：主烘焙雙曲線、AI 大師診斷實驗室、精品沖煮計算機、歷史檔案庫 */}
        <section className="flex-1 bg-stone-950 p-4 flex flex-col space-y-4 overflow-y-auto">
          
          {/* A. 頂級烘焙軌跡對比曲線圖 */}
          <div className="bg-stone-900/80 rounded-2xl p-4 border border-stone-800 shadow-2xl flex-1 min-h-[350px] sm:min-h-[420px] flex flex-col relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-2 border-b border-stone-800 mb-4 gap-2">
              <div>
                <h2 className="text-sm font-black text-amber-400 flex items-center gap-2">
                  <Coffee size={16} />
                  <span>RoastCraft 大師核心雙軌曲線儀</span>
                </h2>
                {referenceProfile && (
                  <p className="text-[10px] text-stone-400">
                    目前正在對比背景參考曲線：<span className="text-amber-400 font-bold">{referenceProfile.beanName} ({referenceProfile.date})</span>
                  </p>
                )}
              </div>
              
              <div className="flex gap-2 text-xs no-print">
                <button 
                  onClick={() => { setShowAiModal(true); setActiveAiTab('analysis'); if (roastData.length >= 5) callGeminiAPI(); }}
                  className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1 transition"
                >
                  <Sparkles size={13} className="animate-spin" />
                  <span>AI 診斷</span>
                </button>
                <button 
                  onClick={() => { setShowAiModal(true); setActiveAiTab('brewing'); if (roastData.length >= 5) generateBrewingGuide(); }}
                  className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1 transition"
                >
                  <BookOpen size={13} />
                  <span>配方調製</span>
                </button>
                {referenceProfile && (
                  <button 
                    onClick={() => setReferenceProfile(null)}
                    className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold px-2.5 py-1 rounded-lg border border-stone-700"
                  >
                    清除參考線
                  </button>
                )}
              </div>
            </div>

            {/* Recharts 曲線渲染 */}
            <div className="flex-1 w-full min-h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartCombinedData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <CartesianGrid stroke="#2e2a24" strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timeSeconds" 
                    type="number" 
                    domain={[0, 'dataMax + 60']} 
                    tickFormatter={formatTime} 
                    stroke="#78716c"
                    tick={{ fontSize: 10, fill: '#a8a29e' }}
                  />
                  
                  {/* Y 軸 1: 豆溫 (紅/橘橘) */}
                  <YAxis 
                    yAxisId="temp" 
                    domain={[60, 240]} 
                    stroke="#ef4444" 
                    width={35}
                    tick={{ fontSize: 10, fill: '#ef4444' }}
                    label={{ value: '咖啡豆溫 (°C)', angle: -90, position: 'insideLeft', offset: 10, fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }}
                  />
                  
                  {/* Y 軸 2: RoR 升溫率 (藍/青) */}
                  <YAxis 
                    yAxisId="ror" 
                    orientation="right" 
                    domain={[-5, 30]} 
                    stroke="#3b82f6" 
                    width={35}
                    tick={{ fontSize: 10, fill: '#3b82f6' }}
                    label={{ value: '升溫率 RoR (°C/m)', angle: 90, position: 'insideRight', offset: 10, fill: '#3b82f6', fontSize: 10, fontWeight: 'bold' }}
                  />
                  
                  <Tooltip content={customTooltip} />
                  <Legend verticalAlign="top" height={36} iconSize={10} wrapperStyle={{ fontSize: '11px', color: '#e7e5e4' }} />
                  
                  {/* 當前烘焙曲線實線 */}
                  <Line yAxisId="temp" type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={3.5} name="當前豆溫" dot={false} isAnimationActive={false} />
                  <Line yAxisId="ror" type="monotone" dataKey="ror" stroke="#3b82f6" strokeWidth={2.5} name="當前 RoR" dot={false} isAnimationActive={false} />
                  
                  {/* 歷史載入之背景參考虛線 */}
                  {referenceProfile && (
                    <>
                      <Line yAxisId="temp" type="monotone" dataKey="refTemp" stroke="#fca5a5" strokeDasharray="5 5" strokeWidth={2} name="[參考] 歷史豆溫" dot={false} isAnimationActive={false} />
                      <Line yAxisId="ror" type="monotone" dataKey="refRoR" stroke="#93c5fd" strokeDasharray="5 5" strokeWidth={1.5} name="[參考] 歷史 RoR" dot={false} isAnimationActive={false} />
                    </>
                  )}

                  {/* 關鍵烘焙事件參考標線 */}
                  {events.turningPoint && <ReferenceLine yAxisId="temp" x={events.turningPoint.timeSeconds} stroke="#06b6d4" strokeDasharray="3 3" label={{ position: 'top', value: 'TP 回溫', fill: '#06b6d4', fontSize: 10 }} />}
                  {events.yellowing && <ReferenceLine yAxisId="temp" x={events.yellowing.timeSeconds} stroke="#eab308" strokeDasharray="3 3" label={{ position: 'top', value: 'Dry 轉黃', fill: '#eab308', fontSize: 10 }} />}
                  {events.fcStart && <ReferenceLine yAxisId="temp" x={events.fcStart.timeSeconds} stroke="#f97316" strokeDasharray="3 3" label={{ position: 'top', value: '1爆始', fill: '#f97316', fontSize: 10 }} />}
                  {events.fcEnd && <ReferenceLine yAxisId="temp" x={events.fcEnd.timeSeconds} stroke="#ea580c" strokeDasharray="3 3" label={{ position: 'top', value: '1爆終', fill: '#ea580c', fontSize: 10 }} />}
                  {events.scStart && <ReferenceLine yAxisId="temp" x={events.scStart.timeSeconds} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: '2爆始', fill: '#ef4444', fontSize: 10 }} />}
                  {events.drop && <ReferenceLine yAxisId="temp" x={events.drop.timeSeconds} stroke="#fafaf9" strokeDasharray="3 3" label={{ position: 'top', value: '出豆下豆', fill: '#fafaf9', fontSize: 10 }} />}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            
            {/* B. 歷史烘焙檔案庫與對比系統 */}
            <div className="bg-stone-900/80 rounded-2xl p-4 border border-stone-800 shadow-xl flex flex-col min-h-[250px]">
              <h2 className="text-sm font-black text-amber-400 pb-2 border-b border-stone-800 flex items-center gap-1.5 mb-3">
                <Database size={16} />
                <span>烘焙資料庫庫存檔案</span>
              </h2>

              <div className="flex-1 overflow-y-auto space-y-2 max-h-[200px] pr-1">
                {savedProfiles.length === 0 ? (
                  <div className="text-center py-8 text-stone-500 text-xs italic">
                    尚未儲存任何烘焙曲線。下豆後即可為您的心血結晶存檔！
                  </div>
                ) : (
                  savedProfiles.map((p) => (
                    <div key={p.id} className="bg-stone-950 p-3 rounded-xl border border-stone-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:border-stone-700 transition">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-stone-100">{p.beanName}</h4>
                          <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20">{p.dtr} DTR</span>
                        </div>
                        <p className="text-[10px] text-stone-400">日期: {p.date} • 烘焙時間: {p.totalTime} • 重: {p.batchWeight}g</p>
                      </div>

                      <div className="flex gap-1.5 self-end sm:self-auto">
                        <button 
                          onClick={() => selectAsReference(p)}
                          className="bg-amber-500 hover:bg-amber-600 text-stone-950 text-[10px] font-extrabold px-2 py-1 rounded transition flex items-center gap-0.5"
                          title="載入至背景對比"
                        >
                          <Eye size={10} />
                          <span>對比</span>
                        </button>
                        <button 
                          onClick={() => setSelectedProfileForView(p)}
                          className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-[10px] font-bold px-2 py-1 rounded"
                        >
                          詳情
                        </button>
                        <button 
                          onClick={() => deleteProfile(p.id)}
                          className="text-stone-500 hover:text-red-400 p-1 rounded transition"
                          title="刪除"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* C. 金杯理論沖煮與黃金粉水比計算機 */}
            <div className="bg-stone-900/80 rounded-2xl p-4 border border-stone-800 shadow-xl flex flex-col min-h-[250px]">
              <h2 className="text-sm font-black text-amber-400 pb-2 border-b border-stone-800 flex items-center gap-1.5 mb-3">
                <Scale size={16} />
                <span>精品手沖與黃金粉水比計算機</span>
              </h2>

              <div className="space-y-3 text-xs flex-1 flex flex-col justify-between">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-stone-400 font-bold block mb-1">粉量設定 (克)</label>
                    <input 
                      type="number" 
                      value={brewCoffeeWeight}
                      onChange={(e) => setCoffeeWeight(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 font-bold text-stone-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-400 font-bold block mb-1">粉水比例 (1:X)</label>
                    <input 
                      type="number" 
                      step="0.5"
                      value={brewRatio}
                      onChange={(e) => setBrewRatio(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 font-bold text-stone-100 outline-none"
                    />
                  </div>
                </div>

                <div className="bg-stone-950 p-3 rounded-xl border border-stone-850 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-400">總注入水量：</span>
                    <span className="text-sm font-extrabold text-amber-400">{(brewCoffeeWeight * brewRatio).toFixed(0)} ml</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-400">預期咖啡熟豆失水率 (預設15%)：</span>
                    <span className="text-xs font-bold text-stone-300">{(Number(batchWeight) * 0.85).toFixed(0)} g 熟豆</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-t border-stone-800 pt-2">
                    <span className="text-stone-400 font-bold">手沖黃金分段建議 (三段式)：</span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {Math.round(brewCoffeeWeight * 2)}ml 悶蒸 → {Math.round(brewCoffeeWeight * brewRatio * 0.4)}ml → {Math.round(brewCoffeeWeight * brewRatio * 0.6)}ml
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-stone-500 italic text-center">
                  * 依據 SCA 金杯準則，最佳手沖萃取建議水溫範圍為 88°C - 93°C。
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* --- AI 烘焙診斷與沖煮建議 Modal --- */}
      {showAiModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
            
            {/* Modal 漸變頂部 */}
            <div className="bg-gradient-to-r from-purple-800 to-indigo-900 p-4 shrink-0 flex flex-col text-white">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 font-black text-base">
                  <Bot size={20} className="text-purple-300" />
                  <span>Gemini 2.5 大師烘焙與沖煮智庫</span>
                </div>
                <button onClick={() => setShowAiModal(false)} className="hover:bg-white/10 p-1 rounded-full transition"><X size={18}/></button>
              </div>

              {/* 頁籤切換 */}
              <div className="flex gap-4 text-sm font-bold">
                <button 
                  onClick={() => setActiveAiTab('analysis')}
                  className={`pb-2 px-1 border-b-2 transition-all ${activeAiTab === 'analysis' ? 'border-amber-400 text-amber-400' : 'border-transparent text-purple-200 hover:text-white'}`}
                >
                  📊 烘焙診斷與優化
                </button>
                <button 
                  onClick={() => setActiveAiTab('brewing')}
                  className={`pb-2 px-1 border-b-2 transition-all ${activeAiTab === 'brewing' ? 'border-amber-400 text-amber-400' : 'border-transparent text-purple-200 hover:text-white'}`}
                >
                  ☕ 冠軍手沖參數推薦
                </button>
              </div>
            </div>

            {/* Modal 內容區 */}
            <div className="p-6 overflow-y-auto flex-1 bg-stone-950 text-stone-200 space-y-4">
              
              {/* API KEY 輸入框 */}
              {!DEFAULT_API_KEY && !userApiKey && (
                <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-amber-400">輸入個人 Google Gemini API 金鑰</label>
                    <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-purple-400 underline hover:text-purple-300">免費申請 API Key</a>
                  </div>
                  <input 
                    type="password" 
                    value={userApiKey} 
                    onChange={(e) => setUserApiKey(e.target.value)} 
                    className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-xs font-mono outline-none focus:border-amber-500"
                    placeholder="貼上 AI Studio 取得的 API 金鑰..." 
                  />
                </div>
              )}

              {/* 頁籤 1: 烘焙診斷 */}
              {activeAiTab === 'analysis' && (
                <div className="space-y-4">
                  {isAnalyzing ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                      <p className="text-sm font-bold text-purple-400 animate-pulse">大師正在調閱杯測標準與數據物理模型分析中...</p>
                    </div>
                  ) : aiResult ? (
                    <div className="prose prose-invert max-w-none text-xs sm:text-sm whitespace-pre-wrap leading-relaxed bg-stone-900 p-4 rounded-xl border border-stone-850 shadow-inner">
                      {aiResult}
                    </div>
                  ) : (
                    <div className="text-center py-10 space-y-3">
                      <Sparkles size={40} className="mx-auto text-stone-600" />
                      <p className="text-stone-400 text-xs">準備好烘焙曲線數據後，即可呼叫大師 AI 提供專業分析報告。</p>
                      <button 
                        onClick={callGeminiAPI} 
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2 rounded-xl text-xs transition active:scale-95 shadow-md"
                      >
                        開始分析當前曲線
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 頁籤 2: 沖煮參數 */}
              {activeAiTab === 'brewing' && (
                <div className="space-y-4">
                  {isBrewingAnalyzing ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                      <p className="text-sm font-bold text-indigo-400 animate-pulse">正在為這款烘焙豆計擬定金杯手沖水溫與注水手法參數...</p>
                    </div>
                  ) : brewingResult ? (
                    <div className="prose prose-invert max-w-none text-xs sm:text-sm whitespace-pre-wrap leading-relaxed bg-stone-900 p-4 rounded-xl border border-stone-850 shadow-inner">
                      {brewingResult}
                    </div>
                  ) : (
                    <div className="text-center py-10 space-y-3">
                      <BookOpen size={40} className="mx-auto text-stone-600" />
                      <p className="text-stone-400 text-xs">大師將根據出豆溫與 DTR 發展比，為您精算對應的養豆與萃取提案。</p>
                      <button 
                        onClick={generateBrewingGuide} 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2 rounded-xl text-xs transition active:scale-95 shadow-md"
                      >
                        產生冠軍沖煮方案
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal 底部 */}
            <div className="p-4 border-t border-stone-850 shrink-0 flex justify-end gap-2 bg-stone-900/60">
              <button 
                onClick={() => setShowAiModal(false)}
                className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                關閉智庫
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 存檔與評價設定 Modal --- */}
      {showSaveModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto text-amber-400 mb-2">
                <Award size={24} />
              </div>
              <h3 className="text-base font-black text-stone-100">為這批烘焙曲線建立存檔</h3>
              <p className="text-xs text-stone-400">保存烘焙紀錄，以便在日後進行對比與 AI 風味分析。</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-stone-400 font-bold block mb-1">熟豆品質自我評分 (1 - 10)</label>
                <div className="flex gap-1.5 justify-center">
                  {[1,2,3,4,5,6,7,8,9,10].map((num) => (
                    <button 
                      key={num}
                      onClick={() => setRoastRating(num)}
                      className={`w-8 h-8 rounded-lg font-bold transition text-xs border ${roastRating === num ? 'bg-amber-500 border-amber-500 text-stone-950 font-black' : 'bg-stone-950 border-stone-800 text-stone-400'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-stone-400 font-bold block mb-1">烘焙大師杯測筆記</label>
                <textarea 
                  value={roastNotes}
                  onChange={(e) => setRoastNotes(e.target.value)}
                  className="w-full h-20 bg-stone-950 border border-stone-800 rounded-lg p-2.5 outline-none focus:border-amber-500 transition text-stone-100"
                  placeholder="紀錄此批次的烘焙缺陷、一爆聲響密集度，或是任何調色特徵..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setShowSaveModal(false)}
                className="py-2.5 rounded-xl border border-stone-800 text-stone-400 font-bold text-xs"
              >
                略過存檔
              </button>
              <button 
                onClick={saveCurrentProfile}
                className="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg"
              >
                <Save size={14} />
                <span>儲存至資料庫</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 單一歷史曲線詳情檢視彈窗 --- */}
      {selectedProfileForView && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-stone-800">
              <h3 className="font-black text-base text-amber-400">📜 烘焙歷史詳情與大師評定</h3>
              <button onClick={() => setSelectedProfileForView(null)} className="hover:bg-white/10 p-1 rounded-full"><X size={16}/></button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-stone-950 p-3 rounded-xl border border-stone-850">
                <p className="text-stone-400">豆款名稱: <span className="text-stone-100 font-bold">{selectedProfileForView.beanName}</span></p>
                <p className="text-stone-400">烘焙日期: <span className="text-stone-100 font-bold">{selectedProfileForView.date}</span></p>
                <p className="text-stone-400">入豆溫度: <span className="text-stone-100 font-bold">{selectedProfileForView.chargeTemp} °C</span></p>
                <p className="text-stone-400">總計時間: <span className="text-stone-100 font-bold">{selectedProfileForView.totalTime}</span></p>
                <p className="text-stone-400">裝豆重量: <span className="text-stone-100 font-bold">{selectedProfileForView.batchWeight} g</span></p>
                <p className="text-stone-400">發展比率 (DTR): <span className="text-amber-400 font-bold">{selectedProfileForView.dtr}</span></p>
              </div>

              <div className="bg-stone-950 p-3 rounded-xl border border-stone-850 space-y-1">
                <div className="flex items-center gap-1 font-bold text-amber-500 mb-1">
                  <Award size={14} />
                  <span>評定星等: {selectedProfileForView.rating} / 10 分</span>
                </div>
                <p className="text-stone-400">大師杯測筆記：</p>
                <p className="text-stone-200 italic font-medium whitespace-pre-wrap">
                  {selectedProfileForView.notes || "無填寫杯測評筆。"}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => selectAsReference(selectedProfileForView)}
                className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1"
              >
                <Eye size={12} />
                <span>套用為對比線</span>
              </button>
              <button 
                onClick={() => setSelectedProfileForView(null)}
                className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold px-4 py-2 rounded-xl text-xs"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 重設警示 Modal --- */}
      {showResetModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 max-w-sm w-full text-center space-y-4">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500">
              <AlertTriangle size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-stone-100">確認清空重置？</h3>
              <p className="text-xs text-stone-400">這將會清除當前計時器、事件點以及圖表中所有的曲線數據，且此動作無法復原。</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowResetModal(false)} className="py-2 rounded-xl border border-stone-800 text-stone-400 font-bold text-xs">取消</button>
              <button onClick={confirmReset} className="py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg">確認清除</button>
            </div>
          </div>
        </div>
      )}

      {/* --- 全域 Toast 通知 --- */}
      {notification && (
        <div className="no-print fixed top-6 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-2xl shadow-2xl z-[120] text-xs font-bold flex items-center gap-2 border bg-stone-900 border-stone-800 text-stone-100 animate-in slide-in-from-top-4 duration-300">
          {notification.type === 'error' ? (
            <AlertTriangle size={15} className="text-rose-500" />
          ) : (
            <CheckCircle2 size={15} className="text-emerald-500" />
          )}
          <span>{notification.msg}</span>
        </div>
      )}
    </div>
  );
}
```


## 🖼️ ROR 曲線與實體翻拍圖片
![[13023469110159187213-450df5f56c9a89a2.png]] ![[15535583523822020334-c7f4ccfba84206d6.png]] ![[17081737008978786326-f7c5f3e4a0bc49f0.png]] [[Roasting_Intermediate_ProfileLog_-37207be7c8cf4ed8.pdf]] (附件檔案) ![[12019819059572421071-7afd66aea08ecfc3.png]] ![[9000-b0d0d952ab8ef43b.jpg]] [[New Note-d803819e815fe0e1]] (附件檔案) ![[10093408293917864137-4c73aabdd108e0ae.png]] ![[15662378191389929446-f0512e6670b77f81.png]] ![[1923732848207364118-66434a5cb126279b.png]] ![[Gemini_Generated_Image_8ggri88ggr-44a8442c4e958641.jpg]] ![[Gemini_Generated_Image_htsu2ahtsu-e11f6500ada5b266.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-96a4cef5cc1008b1.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-be202b15b4d41e70.jpg]] ![[Gemini_Generated_Image_q59snqq59s-d7376f45389320a6.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-153057063c8c793c.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-758609cfa28db9a7.jpg]]

## 🪵 烘焙點評與風火配置
- *此烘焙操作日誌由 Gemini Takeout 匯出對話分析自動生成。*

## 🔗 相關理論與對話推薦
- [[2026-06-01_RoastCraft_AI_智慧烘焙大師工作站_0]] (共用特徵: `莫札特, 沃卡, 梅納反應`)
- [[2026-03-29_請幫我針對一公斤寫出每分鐘的風火建議_732]] (共用特徵: `莫札特, 梅納反應, 焦糖化`)
- [[2026-04-05_下方是楊家0.5公斤半熱風的烘豆成功案例風火配置，請幫我依據先前的經驗值，為我分析接下來在這台機器上烘焙莫札特建議的入豆_667]] (共用特徵: `莫札特, 梅納反應, 焦糖化`)
- [[2026-01-27_請幫我規劃西達磨日曬獅子王g2，200公克，楊家500公克瓦斯半熱風烘豆機，sca_roasting認證考試，建議烘焙計_1477]] (共用特徵: `莫札特, 梅納反應, dtr`)
- [[2026-02-24_請幫我撰寫即時記錄ror值的gas程式，包含前端網頁及後端邏輯程式碼，可以標注幾個重要的時間溫度點，如：回溫點，轉黃點，_1203]] (共用特徵: `莫札特, 梅納反應, dtr`)
