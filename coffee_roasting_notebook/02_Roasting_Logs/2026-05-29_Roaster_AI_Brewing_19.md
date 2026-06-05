---
type: roasting_log
date: 2026-05-29
machine: ""
charge_temp: ""
drop_temp: ""
dtr_ratio: ""
tags: [coffee/roasting_log, imported/takeout]
id: roast_obs_1780636745409
---

# ☕ 烘焙日誌：Roaster AI Brewing

## 📊 對話烘焙紀錄數據
```react
import React, { useState, useEffect, useRef } from 'react';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { Play, Square, Plus, Thermometer, Clipboard, RefreshCw, Coffee, Timer, RotateCcw, CheckCircle2, FileDown, AlertTriangle, Sparkles, Bot, X, CornerRightUp, ScrollText, Tag, MessageSquare, Send } from 'lucide-react';

const RoasterLandscape = () => {
  // --- 狀態管理 ---
  const [isRoasting, setIsRoasting] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0); 
  
  // 資料輸入
  const [beanName, setBeanName] = useState('');
  const [chargeTemp, setChargeTemp] = useState('200');
  const [inputTemp, setInputTemp] = useState('');
  
  // 烘焙數據
  const [roastData, setRoastData] = useState([]);
  
  // 事件紀錄
  const [events, setEvents] = useState({
    turningPoint: null,
    fcStart: null,
    fcEnd: null,
    scStart: null,
    scEnd: null,
    drop: null
  });
  
  // UI 狀態
  const [notification, setNotification] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  
  // AI 相關狀態
  const [showAiModal, setShowAiModal] = useState(false);
  const [activeAiTab, setActiveAiTab] = useState('analysis'); // 'analysis' | 'brewing' | 'label' | 'coach'
  
  const [aiResult, setAiResult] = useState(""); 
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [brewingResult, setBrewingResult] = useState(""); 
  const [isBrewingAnalyzing, setIsBrewingAnalyzing] = useState(false);

  const [labelResult, setLabelResult] = useState("");
  const [isGeneratingLabel, setIsGeneratingLabel] = useState(false);

  const [coachGoal, setCoachGoal] = useState("");
  const [coachResult, setCoachResult] = useState("");
  const [isCoaching, setIsCoaching] = useState(false);
  
  const [userApiKey, setUserApiKey] = useState(""); 
  const apiKey = ""; // API Key 留空，由環境提供

  const timerRef = useRef(null);
  const scrollRef = useRef(null);

  // --- 輔助函式 ---

  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined || isNaN(seconds)) return "00:00";
    const safeSeconds = Math.floor(Math.max(0, seconds));
    const m = Math.floor(safeSeconds / 60);
    const s = safeSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getDevTime = (startTime, endTime) => {
    if (startTime === null || startTime === undefined) return "00:00";
    if (endTime !== null && endTime !== undefined) {
        const diff = endTime - startTime;
        return formatTime(diff);
    }
    const diff = elapsedTime - startTime;
    return formatTime(diff);
  };

  const calculateRoR = (currentTemp, currentTime, lastDataPoint) => {
    if (!lastDataPoint) return 0;
    const timeDiff = currentTime - lastDataPoint.timeSeconds;
    if (timeDiff <= 0) return 0;
    const tempDiff = currentTemp - lastDataPoint.temp;
    return parseFloat(((tempDiff / timeDiff) * 60).toFixed(1));
  };

  // --- Effects ---

  useEffect(() => {
    if (isRoasting) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        setElapsedTime((now - startTime) / 1000);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRoasting, startTime]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [roastData]);

  // 自動觸發 AI 分析
  useEffect(() => {
    if (events.drop && !aiResult && roastData.length >= 5) {
        const timer = setTimeout(() => {
            setShowAiModal(true);
            setActiveAiTab('analysis');
            callGeminiAPI();
        }, 800);
        return () => clearTimeout(timer);
    }
  }, [events.drop]); 

  // --- 操作邏輯 ---

  const handleStart = () => {
    if (!beanName.trim()) {
      showToast("請輸入豆子名稱", "error");
      return;
    }
    const cTemp = parseFloat(chargeTemp);
    if (isNaN(cTemp)) {
      showToast("請輸入有效的入豆溫", "error");
      return;
    }

    const now = Date.now();
    setStartTime(now);
    setIsRoasting(true);
    setElapsedTime(0);
    setRoastData([{ timeStr: '00:00', timeSeconds: 0, temp: cTemp, ror: 0 }]); 
    setEvents({ turningPoint: null, fcStart: null, fcEnd: null, scStart: null, scEnd: null, drop: null });
    
    // 重置所有 AI 狀態
    setAiResult("");
    setBrewingResult("");
    setLabelResult("");
    setCoachResult("");
    setCoachGoal("");

    showToast("烘焙開始！", "success");
  };

  const handleStop = () => {
    if (!events.drop) {
        recordEvent('drop', elapsedTime); 
    }
    setIsRoasting(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleResetClick = () => {
    if (roastData.length === 0 && !beanName && !isRoasting) {
        showToast("目前沒有資料可以重設", "normal");
        return;
    }
    setShowResetModal(true);
  };

  const confirmReset = () => {
    setIsRoasting(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setStartTime(null);
    setElapsedTime(0);
    setRoastData([]);
    setEvents({ turningPoint: null, fcStart: null, fcEnd: null, scStart: null, scEnd: null, drop: null });
    setInputTemp('');
    setBeanName('');
    
    setAiResult("");
    setBrewingResult("");
    setLabelResult("");
    setCoachResult("");
    setCoachGoal("");

    setShowResetModal(false);
    showToast("已重置所有數據", "success");
  };

  const handleAddDataPoint = (e) => {
    e.preventDefault();
    if (!inputTemp || isNaN(inputTemp)) return;
    addDataPointLogic(inputTemp);
  };

  const addDataPointLogic = (tempValue) => {
    const tempVal = parseFloat(tempValue);
    const currentSec = Math.floor(elapsedTime);
    const lastPoint = roastData[roastData.length - 1];
    
    if (lastPoint && lastPoint.timeSeconds === currentSec) return false;

    const rorVal = calculateRoR(tempVal, currentSec, lastPoint);
    const newData = { timeStr: formatTime(currentSec), timeSeconds: currentSec, temp: tempVal, ror: rorVal };
    setRoastData(prev => [...prev, newData]);
    setInputTemp(''); 
    return true;
  };

  const recordEvent = (type, timeRaw) => {
    let timeSec = Math.floor(timeRaw);
    if (isNaN(timeSec) || timeSec < 0) timeSec = 0;
    const timeStr = formatTime(timeSec);
    setEvents(prev => ({ ...prev, [type]: { timeStr, timeSeconds: timeSec } }));
  };

  const handleEventClick = (type) => {
    if (!isRoasting && roastData.length === 0) return;
    if (events[type]) {
        setEvents(prev => ({ ...prev, [type]: null }));
        showToast(`已取消 ${getEventLabel(type)}`, "normal");
        return;
    }
    const currentSec = isRoasting ? elapsedTime : (roastData[roastData.length-1]?.timeSeconds || 0);
    let msg = `已記錄 ${getEventLabel(type)}`;
    if (inputTemp && !isNaN(inputTemp)) {
        const added = addDataPointLogic(inputTemp);
        if (added) msg += " 與 溫度";
    }
    recordEvent(type, currentSec);
    showToast(msg, "success");
    if (type === 'drop') handleStop();
  };

  const getEventLabel = (type) => {
    switch(type) {
      case 'turningPoint': return '回溫點';
      case 'fcStart': return '一爆始';
      case 'fcEnd': return '一爆終';
      case 'scStart': return '二爆始';
      case 'scEnd': return '二爆終';
      case 'drop': return '下豆';
      default: return '';
    }
  };

  const showToast = (msg, type) => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const copyToClipboard = () => {
    const headers = "時間(分:秒),秒數,豆溫,RoR,事件\n";
    const eventMap = {};
    Object.entries(events).forEach(([key, val]) => {
        if(val) eventMap[val.timeSeconds] = getEventLabel(key);
    });

    let csvRows = roastData.map(d => {
        const eventLabel = eventMap[d.timeSeconds] || '';
        return `${d.timeStr},${d.timeSeconds},${d.temp},${d.ror},${eventLabel}`;
    }).join("\n");

    const fullContent = `豆名: ${beanName}\n入豆溫: ${chargeTemp}\n日期: ${new Date().toLocaleDateString()}\n\n${headers}${csvRows}`;
    const textArea = document.createElement("textarea");
    textArea.value = fullContent;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        showToast("已複製 CSV", "success");
    } catch (err) {
        showToast("複製失敗", "error");
    }
    document.body.removeChild(textArea);
  };

  const handleExportPDF = () => {
    if (roastData.length === 0) { showToast("無數據", "error"); return; }
    setTimeout(() => { try { window.print(); } catch (e) { showToast("請按 Ctrl+P", "normal"); } }, 500);
  };

  // --- Gemini API 統一呼叫函式 (含 Exponential Backoff) ---
  const fetchGeminiWithRetry = async (prompt, systemInstruction) => {
    const effectiveKey = apiKey || userApiKey;
    if (!effectiveKey) throw new Error("請輸入 Gemini API Key");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${effectiveKey}`;
    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] }
    };

    const maxRetries = 5;
    const delays = [1000, 2000, 4000, 8000, 16000];

    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error.message);
            return data.candidates?.[0]?.content?.parts?.[0]?.text;
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, delays[i])); // 等待後重試
        }
    }
  };

  // --- AI Feature 1: 烘焙分析 ---
  const callGeminiAPI = async () => {
    if (roastData.length < 5) { setAiResult("數據點過少，無法進行有效分析。"); return; }
    setIsAnalyzing(true);
    
    const roastCsv = roastData.map(d => `${d.timeStr},${d.temp},${d.ror}`).join("\n");
    const eventInfo = `入豆溫: ${chargeTemp}°C\n回溫點: ${events.turningPoint?.timeStr || "未記錄"}\n一爆開始: ${events.fcStart?.timeStr || "未記錄"}\n下豆時間: ${events.drop?.timeStr || "未記錄"}`;
    
    const systemPrompt = `你是一位世界冠軍級的烘豆師。請根據使用者的烘焙數據進行專業分析。請用繁體中文，並以 Markdown 格式回答：
    1. **烘焙度判定**：根據下豆溫與發展時間判斷（如：淺焙、中深焙）。
    2. **曲線診斷**：DTR 是否合理？RoR 是否順暢？有無 Crash/Flick？
    3. **風味預測**：預期會有什麼風味。
    4. **大師建議**：一句話建議下次如何調整操作。`; 
    const userPrompt = `豆子: ${beanName}\n\n事件:\n${eventInfo}\n\n數據 (時間,溫,RoR):\n${roastCsv}`;

    try {
        const text = await fetchGeminiWithRetry(userPrompt, systemPrompt);
        setAiResult(text || "AI 暫時無法回應。");
    } catch (error) {
        setAiResult(`分析失敗: ${error.message}`);
    } finally {
        setIsAnalyzing(false);
    }
  };

  // --- AI Feature 2: 沖煮建議 ---
  const generateBrewingGuide = async () => {
    if (roastData.length < 5) { setBrewingResult("請先完成烘焙並記錄數據。"); return; }
    setIsBrewingAnalyzing(true);
    
    const devTime = events.fcStart ? getDevTime(events.fcStart.timeSeconds, events.drop?.timeSeconds) : "未記錄";
    const systemPrompt = `你是一位資深的咖啡沖煮師與烘豆師。請根據使用者的烘焙結果，設計一份專屬的沖煮指南。請用繁體中文，Markdown 格式：
    ### ☕ 養豆建議
    ### 💧 沖煮參數推薦 (粉水比、水溫、研磨度、器材)
    ### 📝 手沖步驟 (或是濃縮萃取方案)`;
    
    const userPrompt = `豆子名稱: ${beanName}\n總烘焙時間: ${roastData[roastData.length-1]?.timeStr}\n下豆溫度: ${roastData[roastData.length-1]?.temp}°C\n發展時間 (Development Time): ${devTime}`;

    try {
        const text = await fetchGeminiWithRetry(userPrompt, systemPrompt);
        setBrewingResult(text || "AI 暫時無法回應。");
    } catch (error) {
        setBrewingResult(`生成失敗: ${error.message}`);
    } finally {
        setIsBrewingAnalyzing(false);
    }
  };

  // --- AI Feature 3: 風味標籤產生器 (NEW) ---
  const generateBagLabel = async () => {
    if (roastData.length < 5) { setLabelResult("需要更多烘焙數據才能產生準確的標籤。"); return; }
    setIsGeneratingLabel(true);

    const devTime = events.fcStart ? getDevTime(events.fcStart.timeSeconds, events.drop?.timeSeconds) : "未記錄";
    const systemPrompt = `你是一位頂尖的咖啡品牌行銷大師。根據提供的咖啡生豆名稱與烘焙數據，為這鍋咖啡豆設計吸引人的包裝標籤文案。請用繁體中文，Markdown 格式輸出：
    ### 🏷️ 創意命名
    (給這鍋豆子一個詩意或有趣的副標題)
    ### 🎨 風味筆記 (Tasting Notes)
    (條列 3-4 個最突出的具體風味，例如：茉莉花、覆盆子、蜂蜜)
    ### 📖 烘豆師的話
    (約 50 字的短文，描述這支豆子的口感特色與烘焙故事，用來吸引消費者購買)`;

    const userPrompt = `豆子名稱: ${beanName}\n入豆溫: ${chargeTemp}°C\n總烘焙時間: ${roastData[roastData.length-1]?.timeStr}\n下豆溫度: ${roastData[roastData.length-1]?.temp}°C\n發展時間: ${devTime}\n二爆: ${events.scStart ? "有" : "無"}`;

    try {
        const text = await fetchGeminiWithRetry(userPrompt, systemPrompt);
        setLabelResult(text || "AI 暫時無法回應。");
    } catch (error) {
        setLabelResult(`生成失敗: ${error.message}`);
    } finally {
        setIsGeneratingLabel(false);
    }
  };

  // --- AI Feature 4: 烘焙教練 (NEW) ---
  const askRoastCoach = async (e) => {
    e.preventDefault();
    if (!coachGoal.trim()) return;
    if (roastData.length < 5) { showToast("需要烘焙數據才能提供教練建議。", "error"); return; }
    
    setIsCoaching(true);
    
    const roastCsv = roastData.map(d => `${d.timeStr},${d.temp},${d.ror}`).join("\n");
    const systemPrompt = `你是一位世界級烘豆教練。使用者會提供他們的上一鍋烘焙數據，以及他們對於這鍋豆子的『品嚐反饋』或『下次期望的調整目標』。
    請給予具體、可操作的烘焙曲線調整建議。請用繁體中文，Markdown 格式：
    ### 🎯 診斷與目標確認
    ### 🔧 具體操作建議 (例如：入豆溫調整、火力調整時機、一爆發展時間增減)
    ### 💡 核心觀念提醒`;
    
    const userPrompt = `上鍋豆子: ${beanName}\n使用者目標/品嚐反饋: "${coachGoal}"\n\n上鍋數據 (時間,溫,RoR):\n${roastCsv}`;

    try {
        const text = await fetchGeminiWithRetry(userPrompt, systemPrompt);
        setCoachResult(text || "AI 暫時無法回應。");
    } catch (error) {
        setCoachResult(`分析失敗: ${error.message}`);
    } finally {
        setIsCoaching(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-stone-300 shadow text-sm">
          <p className="font-bold">{formatTime(label)}</p>
          {payload.map((p, idx) => (<p key={idx} style={{ color: p.color }}>{p.name}: {p.value}</p>))}
        </div>
      );
    }
    return null;
  };

  const SafeReferenceLine = ({ x, color, labelText, dash="3 3" }) => {
    if (roastData.length === 0 || x === null || x === undefined) return null;
    return <ReferenceLine x={x} stroke={color} strokeDasharray={dash} label={{ position: 'top', value: labelText, fill: color, fontSize: 12 }} />;
  };

  return (
    <div className="h-screen flex flex-col bg-stone-50 font-sans text-stone-800 overflow-hidden">
      {/* Print Styles */}
      <style>{`
        @media print {
          @page { size: landscape; margin: 0.5cm; }
          body { background-color: white; -webkit-print-color-adjust: exact; overflow: visible !important; height: auto !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .main-layout { display: block !important; height: auto !important; }
          .left-panel { width: 100% !important; border: none !important; height: auto !important; overflow: visible !important; }
          .right-panel { width: 100% !important; height: 500px !important; margin-top: 20px; page-break-inside: avoid; }
          .data-table-container { max-height: none !important; overflow: visible !important; }
          .text-stone-200 { color: #000 !important; }
          .bg-stone-900 { background-color: white !important; color: black !important; border-bottom: 2px solid black; }
        }
        .print-only { display: none; }
      `}</style>

      {/* Modals & Toasts */}
      {showAiModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 no-print backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                {/* AI Modal Header */}
                <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 pt-4 px-4 pb-0 flex flex-col text-white shrink-0">
                    <div className="flex justify-between items-center mb-4">
                         <div className="flex items-center gap-2 font-bold text-xl"><Bot size={28} /> <span>Gemini 智慧烘焙工作室</span></div>
                         <button onClick={() => setShowAiModal(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors"><X size={20}/></button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar">
                        <button onClick={() => setActiveAiTab('analysis')} className={`pb-3 px-2 border-b-2 transition-all font-bold flex items-center gap-2 whitespace-nowrap ${activeAiTab === 'analysis' ? 'border-white text-white' : 'border-transparent text-purple-200 hover:text-white'}`}>
                            <Sparkles size={16}/> 烘焙診斷
                        </button>
                        <button onClick={() => setActiveAiTab('brewing')} className={`pb-3 px-2 border-b-2 transition-all font-bold flex items-center gap-2 whitespace-nowrap ${activeAiTab === 'brewing' ? 'border-white text-white' : 'border-transparent text-purple-200 hover:text-white'}`}>
                            <Coffee size={16}/> 沖煮建議
                        </button>
                        <button onClick={() => setActiveAiTab('label')} className={`pb-3 px-2 border-b-2 transition-all font-bold flex items-center gap-2 whitespace-nowrap ${activeAiTab === 'label' ? 'border-white text-white' : 'border-transparent text-purple-200 hover:text-white'}`}>
                            <Tag size={16}/> 風味標籤
                        </button>
                        <button onClick={() => setActiveAiTab('coach')} className={`pb-3 px-2 border-b-2 transition-all font-bold flex items-center gap-2 whitespace-nowrap ${activeAiTab === 'coach' ? 'border-white text-white' : 'border-transparent text-purple-200 hover:text-white'}`}>
                            <MessageSquare size={16}/> 烘焙教練
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto flex-grow bg-stone-50">
                    {!apiKey && !userApiKey && (
                         <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-inner">
                            <label className="text-xs font-bold text-stone-500 block mb-1">請輸入 Gemini API Key 以啟用 AI 功能</label>
                            <input type="password" value={userApiKey} onChange={(e) => setUserApiKey(e.target.value)} className="w-full p-2 border border-stone-300 rounded text-sm focus:ring-2 focus:ring-purple-300 outline-none" placeholder="貼上您的 API Key..." />
                        </div>
                    )}

                    {/* Tab 1: Analysis */}
                    {activeAiTab === 'analysis' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2">
                            {isAnalyzing && <div className="text-center py-10 text-purple-700 font-bold animate-pulse flex flex-col items-center gap-3"><div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div> AI 正在深度分析您的烘焙曲線...</div>}
                            {!isAnalyzing && aiResult && <div className="prose prose-stone prose-sm max-w-none bg-white p-5 rounded-xl border shadow-sm whitespace-pre-wrap">{aiResult}</div>}
                            {!isAnalyzing && !aiResult && (apiKey || userApiKey) && (
                                <div className="text-center py-12 flex flex-col items-center gap-4">
                                     <div className="bg-purple-100 p-4 rounded-full text-purple-600"><Bot size={32}/></div>
                                     <p className="text-stone-500 text-sm max-w-xs">想知道這鍋豆子烘得如何？有無瑕疵？<br/>讓 Gemini 為您進行專業診斷。</p>
                                    <button onClick={callGeminiAPI} className="bg-purple-600 text-white px-6 py-2.5 rounded-full font-bold shadow hover:bg-purple-700 hover:scale-105 transition flex items-center gap-2">
                                        ✨ 生成烘焙診斷報告
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 2: Brewing */}
                    {activeAiTab === 'brewing' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2">
                             {isBrewingAnalyzing && <div className="text-center py-10 text-indigo-700 font-bold animate-pulse flex flex-col items-center gap-3"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div> 正在為您調配最佳沖煮方案...</div>}
                             {!isBrewingAnalyzing && brewingResult && <div className="prose prose-stone prose-sm max-w-none bg-white p-5 rounded-xl border shadow-sm whitespace-pre-wrap">{brewingResult}</div>}
                             {!isBrewingAnalyzing && !brewingResult && (apiKey || userApiKey) && (
                                 <div className="text-center py-12 flex flex-col items-center gap-4">
                                     <div className="bg-indigo-100 p-4 rounded-full text-indigo-600"><ScrollText size={32}/></div>
                                     <p className="text-stone-500 text-sm max-w-xs">不知道這鍋豆子該怎麼沖？<br/>讓 AI 根據您的烘焙曲線推薦最佳萃取參數。</p>
                                     <button onClick={generateBrewingGuide} className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-bold shadow hover:bg-indigo-700 hover:scale-105 transition flex items-center gap-2">
                                         ✨ 生成專屬沖煮指南
                                     </button>
                                 </div>
                             )}
                        </div>
                    )}

                    {/* Tab 3: Bag Label */}
                    {activeAiTab === 'label' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2">
                             {isGeneratingLabel && <div className="text-center py-10 text-pink-700 font-bold animate-pulse flex flex-col items-center gap-3"><div className="w-8 h-8 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div> 行銷大師撰寫文案中...</div>}
                             {!isGeneratingLabel && labelResult && <div className="prose prose-stone prose-sm max-w-none bg-white p-5 rounded-xl border shadow-sm whitespace-pre-wrap">{labelResult}</div>}
                             {!isGeneratingLabel && !labelResult && (apiKey || userApiKey) && (
                                 <div className="text-center py-12 flex flex-col items-center gap-4">
                                     <div className="bg-pink-100 p-4 rounded-full text-pink-600"><Tag size={32}/></div>
                                     <p className="text-stone-500 text-sm max-w-xs">準備包裝這鍋咖啡了嗎？<br/>自動生成吸引人的風味描述與行銷文案。</p>
                                     <button onClick={generateBagLabel} className="bg-pink-600 text-white px-6 py-2.5 rounded-full font-bold shadow hover:bg-pink-700 hover:scale-105 transition flex items-center gap-2">
                                         ✨ 產生風味行銷標籤
                                     </button>
                                 </div>
                             )}
                        </div>
                    )}

                    {/* Tab 4: Coach */}
                    {activeAiTab === 'coach' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 flex flex-col h-full">
                             {!isCoaching && !coachResult && (apiKey || userApiKey) && (
                                 <div className="text-center py-6 flex flex-col items-center gap-4">
                                     <div className="bg-blue-100 p-4 rounded-full text-blue-600"><MessageSquare size={32}/></div>
                                     <p className="text-stone-500 text-sm max-w-md">告訴教練這鍋豆子喝起來如何，或是您下一鍋想達到什麼目標。<br/>(例如：「這鍋有點太酸了，我想增加一點甜感跟body」)</p>
                                 </div>
                             )}

                             {isCoaching && <div className="text-center py-10 text-blue-700 font-bold animate-pulse flex flex-col items-center gap-3"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div> 烘焙教練正在為您規劃下一鍋的策略...</div>}
                             
                             {!isCoaching && coachResult && (
                                 <div className="prose prose-stone prose-sm max-w-none bg-white p-5 rounded-xl border shadow-sm whitespace-pre-wrap mb-4 overflow-y-auto">
                                    <div className="bg-blue-50 text-blue-800 p-3 rounded mb-4 text-xs font-bold border border-blue-100">
                                        您的反饋/目標：{coachGoal}
                                    </div>
                                    {coachResult}
                                 </div>
                             )}

                             {(apiKey || userApiKey) && !isCoaching && (
                                <form onSubmit={askRoastCoach} className="mt-auto pt-4 border-t border-stone-200 flex gap-2">
                                    <input 
                                        type="text" 
                                        value={coachGoal}
                                        onChange={(e) => setCoachGoal(e.target.value)}
                                        placeholder="輸入您的品嚐反饋或下次目標..." 
                                        className="flex-grow p-3 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none"
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={!coachGoal.trim()}
                                        className="bg-blue-600 disabled:bg-stone-300 text-white px-5 rounded-lg font-bold shadow hover:bg-blue-700 transition flex items-center gap-2"
                                    >
                                        ✨ 詢問建議
                                    </button>
                                </form>
                             )}
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {showResetModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 no-print backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full border border-stone-200 text-center">
                <h3 className="text-lg font-bold mb-2">確定要重設嗎？</h3>
                <div className="grid grid-cols-2 gap-3 mt-4">
                    <button onClick={() => setShowResetModal(false)} className="py-2 rounded border font-bold">取消</button>
                    <button onClick={confirmReset} className="py-2 rounded bg-red-600 text-white font-bold">確認清除</button>
                </div>
            </div>
        </div>
      )}

      {notification && (
        <div className={`no-print fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded shadow-lg z-[90] text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${notification.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-stone-800 text-white'}`}>
            {notification.type === 'error' ? <AlertTriangle size={16}/> : <CheckCircle2 size={16}/>}
            {notification.msg}
        </div>
      )}

      {/* Header */}
      <header className="w-full bg-stone-900 shrink-0 z-40 shadow-md print:bg-white print:shadow-none">
          <div className="flex justify-between items-center p-3">
            <div className="flex items-center gap-2 text-amber-500 print:text-black">
                <Coffee size={20} />
                <h1 className="font-bold text-stone-200 print:text-black hidden sm:block">烘焙紀錄</h1>
                <span className="print-only text-xl font-bold ml-2">烘焙紀錄表</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xl font-bold text-amber-400 bg-stone-800 px-3 py-1 rounded border border-stone-700 no-print">
                <Timer size={18} className="text-stone-500"/>
                {formatTime(elapsedTime)}
            </div>
          </div>

          {(events.fcStart || events.scStart) && (
             <div className="flex w-full bg-stone-800 border-t border-stone-700 divide-x divide-stone-700 text-xs sm:text-sm print:bg-white print:border-black print:divide-black print:text-black">
                {events.fcStart && (
                    <div className="flex-1 py-1 flex justify-center items-center gap-2 text-yellow-500 font-mono font-bold">
                       <span className="opacity-70">1爆持續</span> {getDevTime(events.fcStart.timeSeconds, events.fcEnd?.timeSeconds)}
                    </div>
                )}
                {events.scStart && (
                    <div className="flex-1 py-1 flex justify-center items-center gap-2 text-orange-500 font-mono font-bold">
                       <span className="opacity-70">2爆持續</span> {getDevTime(events.scStart.timeSeconds, events.scEnd?.timeSeconds || events.drop?.timeSeconds)}
                    </div>
                )}
             </div>
          )}
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden main-layout relative">
         
         {/* Left Panel */}
         <div className="w-full md:w-[360px] lg:w-[400px] flex flex-col bg-white border-r border-stone-200 z-10 shadow-lg md:shadow-none left-panel overflow-hidden">
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
                
                {/* 1. Setup Card */}
                <div className="bg-white p-3 rounded-lg shadow-sm border border-stone-200 shrink-0">
                    <div className="flex flex-col gap-2">
                         <div className="flex gap-2">
                             <div className="flex-1">
                                <label className="text-[10px] font-bold text-stone-400 uppercase">豆名</label>
                                <input type="text" className="w-full p-2 bg-stone-50 border rounded text-sm focus:border-amber-500 outline-none" value={beanName} onChange={(e) => setBeanName(e.target.value)} placeholder="豆子名稱..." />
                             </div>
                             <div className="w-20">
                                <label className="text-[10px] font-bold text-stone-400 uppercase">入豆溫</label>
                                <input type="number" className="w-full p-2 bg-stone-50 border rounded text-sm text-center outline-none" value={chargeTemp} onChange={(e) => setChargeTemp(e.target.value)} disabled={isRoasting || roastData.length > 0} />
                             </div>
                         </div>
                         <div className="flex gap-1 no-print mt-1">
                            {!isRoasting ? (
                            <button onClick={handleStart} className="flex-grow p-2 bg-emerald-600 text-white rounded font-bold flex items-center justify-center gap-1 shadow-sm text-sm"><Play size={16} /> 開始</button>
                            ) : (
                            <button onClick={handleStop} className="flex-grow p-2 bg-red-600 text-white rounded font-bold flex items-center justify-center gap-1 shadow-sm animate-pulse text-sm"><Square size={16} /> 停止</button>
                            )}
                            <button onClick={handleResetClick} className="p-2 w-10 flex justify-center items-center rounded border bg-white hover:bg-stone-100"><RotateCcw size={16} /></button>
                            <button onClick={handleExportPDF} disabled={roastData.length === 0} className="p-2 w-10 flex justify-center items-center rounded border bg-white text-blue-600 border-blue-200"><FileDown size={16} /></button>
                            <button onClick={() => { setShowAiModal(true); setActiveAiTab('analysis'); }} className="p-2 w-10 flex justify-center items-center rounded border bg-gradient-to-br from-purple-100 to-indigo-100 text-indigo-700 border-indigo-200 hover:scale-105 transition-transform" title="Gemini AI 工作室"><Sparkles size={16} /></button>
                         </div>
                    </div>
                </div>

                {/* 2. Input & Events Card */}
                <div className="bg-amber-50/80 p-3 rounded border border-amber-100 shrink-0 no-print">
                    <form onSubmit={handleAddDataPoint} className="flex gap-2 mb-3">
                        <div className="relative flex-grow">
                            <Thermometer className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" size={20}/>
                            <input type="number" step="0.1" placeholder="豆溫..." className="w-full pl-9 pr-3 h-10 text-xl font-bold text-stone-800 bg-white border border-amber-300 rounded focus:border-amber-500 outline-none" value={inputTemp} onChange={(e) => setInputTemp(e.target.value)} disabled={(!isRoasting && roastData.length === 0)} />
                        </div>
                        <button type="submit" disabled={!inputTemp} className="w-12 bg-amber-500 disabled:bg-stone-300 text-white rounded flex items-center justify-center shadow-sm"><Plus size={24} /></button>
                    </form>

                    <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => handleEventClick('turningPoint')} disabled={(!isRoasting && roastData.length === 0)} className={`h-10 rounded border flex items-center justify-center gap-1 ${events.turningPoint ? 'bg-cyan-100 border-cyan-400 text-cyan-800 ring-2 ring-cyan-200' : 'bg-white text-stone-600 hover:bg-stone-50'}`}><CornerRightUp size={14}/><span className="text-xs font-bold">回溫</span></button>
                        <button onClick={() => handleEventClick('fcStart')} disabled={(!isRoasting && roastData.length === 0)} className={`h-10 rounded border flex items-center justify-center ${events.fcStart ? 'bg-yellow-100 border-yellow-400 text-yellow-800 ring-2 ring-yellow-200' : 'bg-white text-stone-600 hover:bg-stone-50'}`}><span className="text-xs font-bold">一爆始</span></button>
                        <button onClick={() => handleEventClick('fcEnd')} disabled={(!isRoasting && roastData.length === 0)} className={`h-10 rounded border flex items-center justify-center ${events.fcEnd ? 'bg-yellow-100 border-yellow-600 text-yellow-900 ring-2 ring-yellow-200' : 'bg-white text-stone-600 hover:bg-stone-50'}`}><span className="text-xs font-bold">一爆終</span></button>
                        <button onClick={() => handleEventClick('scStart')} disabled={(!isRoasting && roastData.length === 0)} className={`h-10 rounded border flex items-center justify-center ${events.scStart ? 'bg-orange-100 border-orange-500 text-orange-800 ring-2 ring-orange-200' : 'bg-white text-stone-600 hover:bg-stone-50'}`}><span className="text-xs font-bold">二爆始</span></button>
                        <button onClick={() => handleEventClick('scEnd')} disabled={(!isRoasting && roastData.length === 0)} className={`h-10 rounded border flex items-center justify-center ${events.scEnd ? 'bg-orange-100 border-orange-600 text-orange-900 ring-2 ring-orange-200' : 'bg-white text-stone-600 hover:bg-stone-50'}`}><span className="text-xs font-bold">二爆終</span></button>
                        <button onClick={() => handleEventClick('drop')} disabled={(!isRoasting && roastData.length === 0)} className={`h-10 rounded border flex items-center justify-center ${events.drop ? 'bg-stone-700 text-white ring-2 ring-stone-400' : 'bg-white text-stone-600 hover:bg-stone-50'}`}><span className="text-xs font-bold">下豆</span></button>
                    </div>
                </div>

                {/* 3. Data Table */}
                <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden min-h-[200px] data-table-container">
                    <div className="p-2 bg-stone-100 border-b flex justify-between items-center text-xs">
                        <span className="font-bold text-stone-600">數據列表</span>
                        {roastData.length > 0 && (<button onClick={copyToClipboard} className="flex items-center gap-1 text-stone-500 hover:text-stone-800"><Clipboard size={10}/> 複製</button>)}
                    </div>
                    <div className="flex-1 overflow-y-auto" ref={scrollRef}>
                        <table className="w-full text-xs text-left">
                            <thead className="bg-stone-50 text-stone-500 sticky top-0 shadow-sm z-10">
                                <tr>
                                    <th className="p-2">時間</th>
                                    <th className="p-2">溫</th>
                                    <th className="p-2 text-right">RoR</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {roastData.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-amber-50">
                                        <td className="p-2 font-mono text-stone-500">{row.timeStr}</td>
                                        <td className="p-2 font-bold">{row.temp}</td>
                                        <td className={`p-2 font-mono font-bold text-right ${row.ror > 15 ? 'text-red-500' : row.ror < 5 ? 'text-blue-500' : 'text-emerald-600'}`}>{row.ror}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
         </div>

         {/* Right Panel: Chart Area */}
         <div className="flex-1 p-3 bg-stone-50 flex flex-col right-panel min-h-[400px]">
            <div className="bg-white p-2 rounded-xl shadow-sm border border-stone-200 flex-1 relative chart-container flex flex-col">
                <div className="print-only text-center font-bold mb-2 text-lg">烘焙曲線圖</div>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={roastData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                        <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                        <XAxis dataKey="timeSeconds" type="number" domain={['dataMin', 'dataMax + 60']} tickFormatter={formatTime} tick={{fontSize: 12}} allowDecimals={false} label={{ value: '時間 (Time)', position: 'insideBottomRight', offset: -10, fontSize: 12 }} />
                        <YAxis yAxisId="temp" domain={['auto', 'auto']} stroke="#ef4444" tick={{fontSize: 12}} width={40} allowDecimals={false} label={{ value: '豆溫 °C', angle: -90, position: 'insideLeft', fill: '#ef4444', fontSize: 12 }} />
                        <YAxis yAxisId="ror" orientation="right" domain={[0, 25]} stroke="#3b82f6" tick={{fontSize: 12}} width={40} label={{ value: 'RoR', angle: 90, position: 'insideRight', fill: '#3b82f6', fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="top" height={36} iconSize={12} wrapperStyle={{fontSize:'14px', paddingTop: '10px'}}/>
                        <Line yAxisId="temp" type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={3} name="豆溫" dot={{ r: 3 }} isAnimationActive={false} />
                        <Line yAxisId="ror" type="monotone" dataKey="ror" stroke="#3b82f6" strokeWidth={2} name="RoR" dot={false} isAnimationActive={false} />
                        <SafeReferenceLine x={events.turningPoint?.timeSeconds} color="#06b6d4" labelText="回溫" dash="3 3" />
                        <SafeReferenceLine x={events.fcStart?.timeSeconds} color="#eab308" labelText="一爆" dash="5 5" />
                        <SafeReferenceLine x={events.fcEnd?.timeSeconds} color="#ca8a04" labelText="" dash="5 5" />
                        <SafeReferenceLine x={events.scStart?.timeSeconds} color="#f97316" labelText="二爆" dash="5 5" />
                        <SafeReferenceLine x={events.scEnd?.timeSeconds} color="#ea580c" labelText="" dash="5 5" />
                        <SafeReferenceLine x={events.drop?.timeSeconds} color="#44403c" labelText="下豆" dash="3 3" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
            <div className="text-center text-[10px] text-stone-400 mt-2">Roast Master Dashboard Mode</div>
         </div>

      </main>
    </div>
  );
};

export default RoasterLandscape;

```
```react
import React, { useState, useEffect, useRef } from 'react';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { Play, Square, Plus, Thermometer, Clipboard, RefreshCw, Coffee, Timer, RotateCcw, Flame, CheckCircle2, FileDown, AlertTriangle, Sparkles, Bot, X, CornerRightUp, ScrollText, Eraser } from 'lucide-react';

const RoasterLandscape = () => {
  // --- 狀態管理 ---
  const [isRoasting, setIsRoasting] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0); 
  
  // 資料輸入
  const [beanName, setBeanName] = useState('');
  const [chargeTemp, setChargeTemp] = useState('200');
  const [inputTemp, setInputTemp] = useState('');
  
  // 烘焙數據
  const [roastData, setRoastData] = useState([]);
  
  // 事件紀錄
  const [events, setEvents] = useState({
    turningPoint: null,
    fcStart: null,
    fcEnd: null,
    scStart: null,
    scEnd: null,
    drop: null
  });
  
  // UI 狀態
  const [notification, setNotification] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  
  // AI 相關狀態
  const [showAiModal, setShowAiModal] = useState(false);
  const [activeAiTab, setActiveAiTab] = useState('analysis'); // 'analysis' | 'brewing'
  
  const [aiResult, setAiResult] = useState(""); // 烘焙分析結果
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [brewingResult, setBrewingResult] = useState(""); // 沖煮建議結果
  const [isBrewingAnalyzing, setIsBrewingAnalyzing] = useState(false);
  
  const [userApiKey, setUserApiKey] = useState(""); 
  const apiKey = ""; 

  const timerRef = useRef(null);
  const scrollRef = useRef(null);

  // --- 輔助函式 ---

  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined || isNaN(seconds)) return "00:00";
    const safeSeconds = Math.floor(Math.max(0, seconds));
    const m = Math.floor(safeSeconds / 60);
    const s = safeSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getDevTime = (startTime, endTime) => {
    if (startTime === null || startTime === undefined) return "00:00";
    if (endTime !== null && endTime !== undefined) {
        const diff = endTime - startTime;
        return formatTime(diff);
    }
    const diff = elapsedTime - startTime;
    return formatTime(diff);
  };

  const calculateRoR = (currentTemp, currentTime, lastDataPoint) => {
    if (!lastDataPoint) return 0;
    const timeDiff = currentTime - lastDataPoint.timeSeconds;
    if (timeDiff <= 0) return 0;
    const tempDiff = currentTemp - lastDataPoint.temp;
    return parseFloat(((tempDiff / timeDiff) * 60).toFixed(1));
  };

  // --- Effects ---

  useEffect(() => {
    if (isRoasting) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        setElapsedTime((now - startTime) / 1000);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRoasting, startTime]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [roastData]);

  // 自動觸發 AI 分析 (僅觸發烘焙分析)
  useEffect(() => {
    if (events.drop && !aiResult && roastData.length >= 5) {
        const timer = setTimeout(() => {
            setShowAiModal(true);
            setActiveAiTab('analysis');
            callGeminiAPI();
        }, 800);
        return () => clearTimeout(timer);
    }
  }, [events.drop]); 

  // --- 操作邏輯 ---

  const handleStart = () => {
    if (!beanName.trim()) {
      showToast("請輸入豆子名稱", "error");
      return;
    }
    const cTemp = parseFloat(chargeTemp);
    if (isNaN(cTemp)) {
      showToast("請輸入有效的入豆溫", "error");
      return;
    }

    const now = Date.now();
    setStartTime(now);
    setIsRoasting(true);
    setElapsedTime(0);
    setRoastData([{ timeStr: '00:00', timeSeconds: 0, temp: cTemp, ror: 0 }]); 
    setEvents({ turningPoint: null, fcStart: null, fcEnd: null, scStart: null, scEnd: null, drop: null });
    setAiResult("");
    setBrewingResult("");
    showToast("烘焙開始！", "success");
  };

  const handleStop = () => {
    // 只有在還沒紀錄下豆時才自動紀錄
    if (!events.drop) {
        recordEvent('drop', elapsedTime); 
    }
    setIsRoasting(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleResetClick = () => {
    if (roastData.length === 0 && !beanName && !isRoasting) {
        showToast("目前沒有資料可以重設", "normal");
        return;
    }
    setShowResetModal(true);
  };

  const confirmReset = () => {
    setIsRoasting(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setStartTime(null);
    setElapsedTime(0);
    setRoastData([]);
    setEvents({ turningPoint: null, fcStart: null, fcEnd: null, scStart: null, scEnd: null, drop: null });
    setInputTemp('');
    setBeanName('');
    setAiResult("");
    setBrewingResult("");
    setShowResetModal(false);
    showToast("已重置所有數據", "success");
  };

  const handleAddDataPoint = (e) => {
    e.preventDefault();
    if (!inputTemp || isNaN(inputTemp)) return;
    addDataPointLogic(inputTemp);
  };

  const addDataPointLogic = (tempValue) => {
    const tempVal = parseFloat(tempValue);
    const currentSec = Math.floor(elapsedTime);
    const lastPoint = roastData[roastData.length - 1];
    
    if (lastPoint && lastPoint.timeSeconds === currentSec) return false;

    const rorVal = calculateRoR(tempVal, currentSec, lastPoint);
    const newData = { timeStr: formatTime(currentSec), timeSeconds: currentSec, temp: tempVal, ror: rorVal };
    setRoastData(prev => [...prev, newData]);
    setInputTemp(''); 
    return true;
  };

  const recordEvent = (type, timeRaw) => {
    let timeSec = Math.floor(timeRaw);
    if (isNaN(timeSec) || timeSec < 0) timeSec = 0;
    const timeStr = formatTime(timeSec);
    setEvents(prev => ({ ...prev, [type]: { timeStr, timeSeconds: timeSec } }));
  };

  // ★★★ 修改後的事件點擊邏輯 (支援取消/反悔) ★★★
  const handleEventClick = (type) => {
    if (!isRoasting && roastData.length === 0) return;

    // 1. 如果該事件已經存在 -> 執行取消 (反悔)
    if (events[type]) {
        setEvents(prev => ({ ...prev, [type]: null }));
        showToast(`已取消 ${getEventLabel(type)}`, "normal");
        return;
    }

    // 2. 如果該事件不存在 -> 執行記錄
    const currentSec = isRoasting ? elapsedTime : (roastData[roastData.length-1]?.timeSeconds || 0);
    let msg = `已記錄 ${getEventLabel(type)}`;

    if (inputTemp && !isNaN(inputTemp)) {
        const added = addDataPointLogic(inputTemp);
        if (added) msg += " 與 溫度";
    }

    recordEvent(type, currentSec);
    showToast(msg, "success");
    
    // 如果按下的是「下豆」，同時停止計時
    if (type === 'drop') handleStop();
  };

  const getEventLabel = (type) => {
    switch(type) {
      case 'turningPoint': return '回溫點';
      case 'fcStart': return '一爆始';
      case 'fcEnd': return '一爆終';
      case 'scStart': return '二爆始';
      case 'scEnd': return '二爆終';
      case 'drop': return '下豆';
      default: return '';
    }
  };

  const showToast = (msg, type) => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const copyToClipboard = () => {
    const headers = "時間(分:秒),秒數,豆溫,RoR,事件\n";
    const eventMap = {};
    Object.entries(events).forEach(([key, val]) => {
        if(val) eventMap[val.timeSeconds] = getEventLabel(key);
    });

    let csvRows = roastData.map(d => {
        const eventLabel = eventMap[d.timeSeconds] || '';
        return `${d.timeStr},${d.timeSeconds},${d.temp},${d.ror},${eventLabel}`;
    }).join("\n");

    const fullContent = `豆名: ${beanName}\n入豆溫: ${chargeTemp}\n日期: ${new Date().toLocaleDateString()}\n\n${headers}${csvRows}`;
    const textArea = document.createElement("textarea");
    textArea.value = fullContent;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        showToast("已複製 CSV", "success");
    } catch (err) {
        showToast("複製失敗", "error");
    }
    document.body.removeChild(textArea);
  };

  const handleExportPDF = () => {
    if (roastData.length === 0) { showToast("無數據", "error"); return; }
    setTimeout(() => { try { window.print(); } catch (e) { alert("請按 Ctrl+P"); } }, 500);
  };

  // --- AI Gemini 分析 (烘焙報告) ---
  const callGeminiAPI = async () => {
    if (roastData.length < 5) {
        setAiResult("數據點過少，無法進行有效分析。");
        return;
    }
    setIsAnalyzing(true);
    const roastCsv = roastData.map(d => `${d.timeStr},${d.temp},${d.ror}`).join("\n");
    const eventInfo = `
      入豆溫: ${chargeTemp}°C
      回溫點: ${events.turningPoint?.timeStr || "未記錄"}
      一爆開始: ${events.fcStart?.timeStr || "未記錄"}
      一爆結束: ${events.fcEnd?.timeStr || "未記錄"}
      二爆開始: ${events.scStart?.timeStr || "未記錄"}
      二爆結束: ${events.scEnd?.timeStr || "未記錄"}
      下豆時間: ${events.drop?.timeStr || "未記錄"}
    `;
    const systemPrompt = `你是一位世界冠軍級的烘豆師。請根據使用者的烘焙數據進行專業分析。
    請用繁體中文，並以 Markdown 格式回答：
    1. **烘焙度判定**：根據下豆溫與發展時間判斷（如：淺焙、中深焙）。
    2. **曲線診斷**：DTR 是否合理？RoR 是否順暢？有無 Crash/Flick？
    3. **風味預測**：預期會有什麼風味（花香、果酸、堅果、可可、焦苦...）。
    4. **大師建議**：一句話建議下次如何調整操作。
    `; 
    const userPrompt = `豆子: ${beanName}\n\n事件:\n${eventInfo}\n\n數據 (時間,溫,RoR):\n${roastCsv}`;

    try {
        const effectiveKey = apiKey || userApiKey;
        if (!effectiveKey) throw new Error("請輸入 Gemini API Key");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${effectiveKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: userPrompt }] }], systemInstruction: { parts: [{ text: systemPrompt }] } })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        setAiResult(text || "AI 暫時無法回應。");
    } catch (error) {
        setAiResult(`分析失敗: ${error.message}`);
    } finally {
        setIsAnalyzing(false);
    }
  };

  // --- AI Gemini 沖煮建議 ---
  const generateBrewingGuide = async () => {
    if (roastData.length < 5) {
        setBrewingResult("請先完成烘焙並記錄數據。");
        return;
    }
    setIsBrewingAnalyzing(true);
    
    const dropTemp = roastData[roastData.length-1]?.temp;
    const totalTime = roastData[roastData.length-1]?.timeStr;
    const devTime = events.fcStart ? getDevTime(events.fcStart.timeSeconds, events.drop?.timeSeconds) : "未記錄";

    const systemPrompt = `你是一位資深的咖啡沖煮師與烘豆師。請根據使用者的烘焙結果，設計一份專屬的沖煮指南。
    請用繁體中文，Markdown 格式，包含以下區塊：
    ### ☕ 養豆建議
    - 建議養豆天數（根據烘焙度）。
    ### 💧 沖煮參數推薦
    - **粉水比** (Ratio)
    - **水溫** (Water Temp)
    - **研磨度** (Grind Size)
    - **建議器材** (V60, Origami, Espresso...)
    ### 📝 手沖步驟 (或是濃縮萃取方案)
    - 簡單的注水步驟指引。
    `;
    
    const userPrompt = `
      豆子名稱: ${beanName}
      總烘焙時間: ${totalTime}
      下豆溫度: ${dropTemp}°C
      一爆時間: ${events.fcStart?.timeStr || "未記錄"}
      發展時間 (Development Time): ${devTime}
      二爆: ${events.scStart ? "有進入二爆" : "無"}
    `;

    try {
        const effectiveKey = apiKey || userApiKey;
        if (!effectiveKey) throw new Error("請輸入 Gemini API Key");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${effectiveKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: userPrompt }] }], systemInstruction: { parts: [{ text: systemPrompt }] } })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        setBrewingResult(text || "AI 暫時無法回應。");
    } catch (error) {
        setBrewingResult(`生成失敗: ${error.message}`);
    } finally {
        setIsBrewingAnalyzing(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-stone-300 shadow text-sm">
          <p className="font-bold">{formatTime(label)}</p>
          {payload.map((p, idx) => (<p key={idx} style={{ color: p.color }}>{p.name}: {p.value}</p>))}
        </div>
      );
    }
    return null;
  };

  const SafeReferenceLine = ({ x, color, labelText, dash="3 3" }) => {
    if (roastData.length === 0 || x === null || x === undefined) return null;
    return <ReferenceLine x={x} stroke={color} strokeDasharray={dash} label={{ position: 'top', value: labelText, fill: color, fontSize: 12 }} />;
  };

  return (
    <div className="h-screen flex flex-col bg-stone-50 font-sans text-stone-800 overflow-hidden">
      {/* Print Styles */}
      <style>{`
        @media print {
          @page { size: landscape; margin: 0.5cm; }
          body { background-color: white; -webkit-print-color-adjust: exact; overflow: visible !important; height: auto !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .main-layout { display: block !important; height: auto !important; }
          .left-panel { width: 100% !important; border: none !important; height: auto !important; overflow: visible !important; }
          .right-panel { width: 100% !important; height: 500px !important; margin-top: 20px; page-break-inside: avoid; }
          .data-table-container { max-height: none !important; overflow: visible !important; }
          .text-stone-200 { color: #000 !important; }
          .bg-stone-900 { background-color: white !important; color: black !important; border-bottom: 2px solid black; }
        }
        .print-only { display: none; }
      `}</style>

      {/* Modals & Toasts */}
      {showAiModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 no-print backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                {/* AI Modal Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 pt-4 px-4 pb-0 flex flex-col text-white shrink-0">
                    <div className="flex justify-between items-center mb-4">
                         <div className="flex items-center gap-2 font-bold text-lg"><Bot size={24} /> <span>Gemini 智慧助手</span></div>
                         <button onClick={() => setShowAiModal(false)} className="hover:bg-white/20 p-1 rounded-full"><X size={20}/></button>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setActiveAiTab('analysis')}
                            className={`pb-3 px-2 border-b-2 transition-all font-bold flex items-center gap-2 ${activeAiTab === 'analysis' ? 'border-white text-white' : 'border-transparent text-purple-200 hover:text-white'}`}
                        >
                            <Sparkles size={16}/> 烘焙分析
                        </button>
                        <button 
                            onClick={() => setActiveAiTab('brewing')}
                            className={`pb-3 px-2 border-b-2 transition-all font-bold flex items-center gap-2 ${activeAiTab === 'brewing' ? 'border-white text-white' : 'border-transparent text-purple-200 hover:text-white'}`}
                        >
                            <Coffee size={16}/> 沖煮建議
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto flex-grow bg-stone-50">
                    {!apiKey && !userApiKey && (
                         <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <label className="text-xs font-bold text-stone-500 block mb-1">請輸入 Gemini API Key</label>
                            <input type="password" value={userApiKey} onChange={(e) => setUserApiKey(e.target.value)} className="w-full p-2 border border-stone-300 rounded text-sm" placeholder="貼上您的 API Key..." />
                        </div>
                    )}

                    {activeAiTab === 'analysis' && (
                        <>
                            {isAnalyzing && <div className="text-center py-10 text-purple-700 font-bold animate-pulse">AI 正在分析您的烘焙曲線...</div>}
                            {!isAnalyzing && aiResult && <div className="prose prose-stone max-w-none text-sm whitespace-pre-wrap">{aiResult}</div>}
                            {!isAnalyzing && !aiResult && (apiKey || userApiKey) && <div className="text-center py-10"><button onClick={callGeminiAPI} className="bg-purple-600 text-white px-6 py-2 rounded-full font-bold shadow hover:scale-105 transition">開始烘焙分析</button></div>}
                            {!isAnalyzing && aiResult && (
                                <div className="mt-8 pt-4 border-t border-stone-200 flex justify-end">
                                    <button onClick={callGeminiAPI} className="text-purple-600 hover:text-purple-800 text-sm font-bold flex items-center gap-1"><RefreshCw size={14} /> 重新分析</button>
                                </div>
                            )}
                        </>
                    )}

                    {activeAiTab === 'brewing' && (
                        <>
                             {isBrewingAnalyzing && (
                                 <div className="flex flex-col items-center justify-center py-10 gap-3">
                                     <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                                     <div className="text-indigo-700 font-bold animate-pulse">正在為您調配最佳沖煮方案...</div>
                                 </div>
                             )}
                             {!isBrewingAnalyzing && brewingResult && (
                                 <div className="prose prose-stone max-w-none text-sm whitespace-pre-wrap bg-white p-4 rounded-lg border border-stone-200 shadow-sm">
                                     {brewingResult}
                                 </div>
                             )}
                             {!isBrewingAnalyzing && !brewingResult && (apiKey || userApiKey) && (
                                 <div className="text-center py-10 flex flex-col items-center gap-4">
                                     <div className="bg-indigo-100 p-4 rounded-full text-indigo-600"><ScrollText size={32}/></div>
                                     <p className="text-stone-500 text-sm max-w-xs">不知道這鍋豆子該怎麼沖？<br/>讓 AI 根據您的烘焙曲線推薦最佳參數。</p>
                                     <button onClick={generateBrewingGuide} className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold shadow hover:bg-indigo-700 hover:scale-105 transition flex items-center gap-2">
                                         <Coffee size={18}/> 生成沖煮建議
                                     </button>
                                 </div>
                             )}
                             {!isBrewingAnalyzing && brewingResult && (
                                <div className="mt-6 flex justify-end">
                                    <button onClick={generateBrewingGuide} className="text-indigo-600 hover:text-indigo-800 text-sm font-bold flex items-center gap-1"><RefreshCw size={14} /> 重新生成</button>
                                </div>
                             )}
                        </>
                    )}
                </div>
            </div>
        </div>
      )}

      {showResetModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 no-print backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full border border-stone-200 text-center">
                <h3 className="text-lg font-bold mb-2">確定要重設嗎？</h3>
                <div className="grid grid-cols-2 gap-3 mt-4">
                    <button onClick={() => setShowResetModal(false)} className="py-2 rounded border font-bold">取消</button>
                    <button onClick={confirmReset} className="py-2 rounded bg-red-600 text-white font-bold">確認清除</button>
                </div>
            </div>
        </div>
      )}

      {notification && (
        <div className={`no-print fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded shadow-lg z-[90] text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${notification.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-stone-800 text-white'}`}>
            {notification.type === 'error' ? <AlertTriangle size={16}/> : <CheckCircle2 size={16}/>}
            {notification.msg}
        </div>
      )}

      {/* Header */}
      <header className="w-full bg-stone-900 shrink-0 z-40 shadow-md print:bg-white print:shadow-none">
          <div className="flex justify-between items-center p-3">
            <div className="flex items-center gap-2 text-amber-500 print:text-black">
                <Coffee size={20} />
                <h1 className="font-bold text-stone-200 print:text-black hidden sm:block">烘焙紀錄</h1>
                <span className="print-only text-xl font-bold ml-2">烘焙紀錄表</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xl font-bold text-amber-400 bg-stone-800 px-3 py-1 rounded border border-stone-700 no-print">
                <Timer size={18} className="text-stone-500"/>
                {formatTime(elapsedTime)}
            </div>
          </div>

          {(events.fcStart || events.scStart) && (
             <div className="flex w-full bg-stone-800 border-t border-stone-700 divide-x divide-stone-700 text-xs sm:text-sm print:bg-white print:border-black print:divide-black print:text-black">
                {events.fcStart && (
                    <div className="flex-1 py-1 flex justify-center items-center gap-2 text-yellow-500 font-mono font-bold">
                       <span className="opacity-70">1爆持續</span> {getDevTime(events.fcStart.timeSeconds, events.fcEnd?.timeSeconds)}
                    </div>
                )}
                {events.scStart && (
                    <div className="flex-1 py-1 flex justify-center items-center gap-2 text-orange-500 font-mono font-bold">
                       <span className="opacity-70">2爆持續</span> {getDevTime(events.scStart.timeSeconds, events.scEnd?.timeSeconds || events.drop?.timeSeconds)}
                    </div>
                )}
             </div>
          )}
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden main-layout relative">
         
         {/* Left Panel */}
         <div className="w-full md:w-[360px] lg:w-[400px] flex flex-col bg-white border-r border-stone-200 z-10 shadow-lg md:shadow-none left-panel overflow-hidden">
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
                
                {/* 1. Setup Card */}
                <div className="bg-white p-3 rounded-lg shadow-sm border border-stone-200 shrink-0">
                    <div className="flex flex-col gap-2">
                         <div className="flex gap-2">
                             <div className="flex-1">
                                <label className="text-[10px] font-bold text-stone-400 uppercase">豆名</label>
                                <input type="text" className="w-full p-2 bg-stone-50 border rounded text-sm focus:border-amber-500 outline-none" value={beanName} onChange={(e) => setBeanName(e.target.value)} placeholder="豆子名稱..." />
                             </div>
                             <div className="w-20">
                                <label className="text-[10px] font-bold text-stone-400 uppercase">入豆溫</label>
                                <input type="number" className="w-full p-2 bg-stone-50 border rounded text-sm text-center outline-none" value={chargeTemp} onChange={(e) => setChargeTemp(e.target.value)} disabled={isRoasting || roastData.length > 0} />
                             </div>
                         </div>
                         <div className="flex gap-1 no-print mt-1">
                            {!isRoasting ? (
                            <button onClick={handleStart} className="flex-grow p-2 bg-emerald-600 text-white rounded font-bold flex items-center justify-center gap-1 shadow-sm text-sm"><Play size={16} /> 開始</button>
                            ) : (
                            <button onClick={handleStop} className="flex-grow p-2 bg-red-600 text-white rounded font-bold flex items-center justify-center gap-1 shadow-sm animate-pulse text-sm"><Square size={16} /> 停止</button>
                            )}
                            <button onClick={handleResetClick} className="p-2 w-10 flex justify-center items-center rounded border bg-white hover:bg-stone-100"><RotateCcw size={16} /></button>
                            <button onClick={handleExportPDF} disabled={roastData.length === 0} className="p-2 w-10 flex justify-center items-center rounded border bg-white text-blue-600 border-blue-200"><FileDown size={16} /></button>
                            <button onClick={() => { setShowAiModal(true); setActiveAiTab('analysis'); }} className="p-2 w-10 flex justify-center items-center rounded border bg-purple-50 text-purple-600 border-purple-200"><Sparkles size={16} /></button>
                         </div>
                    </div>
                </div>

                {/* 2. Input & Events Card */}
                <div className="bg-amber-50/80 p-3 rounded border border-amber-100 shrink-0 no-print">
                    <form onSubmit={handleAddDataPoint} className="flex gap-2 mb-3">
                        <div className="relative flex-grow">
                            <Thermometer className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" size={20}/>
                            <input type="number" step="0.1" placeholder="豆溫..." className="w-full pl-9 pr-3 h-10 text-xl font-bold text-stone-800 bg-white border border-amber-300 rounded focus:border-amber-500 outline-none" value={inputTemp} onChange={(e) => setInputTemp(e.target.value)} disabled={(!isRoasting && roastData.length === 0)} />
                        </div>
                        <button type="submit" disabled={!inputTemp} className="w-12 bg-amber-500 disabled:bg-stone-300 text-white rounded flex items-center justify-center shadow-sm"><Plus size={24} /></button>
                    </form>

                    {/* Updated Buttons: Removed disabled logic for toggling */}
                    <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => handleEventClick('turningPoint')} disabled={(!isRoasting && roastData.length === 0)} className={`h-10 rounded border flex items-center justify-center gap-1 ${events.turningPoint ? 'bg-cyan-100 border-cyan-400 text-cyan-800 ring-2 ring-cyan-200' : 'bg-white text-stone-600 hover:bg-stone-50'}`}><CornerRightUp size={14}/><span className="text-xs font-bold">回溫</span></button>
                        <button onClick={() => handleEventClick('fcStart')} disabled={(!isRoasting && roastData.length === 0)} className={`h-10 rounded border flex items-center justify-center ${events.fcStart ? 'bg-yellow-100 border-yellow-400 text-yellow-800 ring-2 ring-yellow-200' : 'bg-white text-stone-600 hover:bg-stone-50'}`}><span className="text-xs font-bold">一爆始</span></button>
                        <button onClick={() => handleEventClick('fcEnd')} disabled={(!isRoasting && roastData.length === 0)} className={`h-10 rounded border flex items-center justify-center ${events.fcEnd ? 'bg-yellow-100 border-yellow-600 text-yellow-900 ring-2 ring-yellow-200' : 'bg-white text-stone-600 hover:bg-stone-50'}`}><span className="text-xs font-bold">一爆終</span></button>
                        <button onClick={() => handleEventClick('scStart')} disabled={(!isRoasting && roastData.length === 0)} className={`h-10 rounded border flex items-center justify-center ${events.scStart ? 'bg-orange-100 border-orange-500 text-orange-800 ring-2 ring-orange-200' : 'bg-white text-stone-600 hover:bg-stone-50'}`}><span className="text-xs font-bold">二爆始</span></button>
                        <button onClick={() => handleEventClick('scEnd')} disabled={(!isRoasting && roastData.length === 0)} className={`h-10 rounded border flex items-center justify-center ${events.scEnd ? 'bg-orange-100 border-orange-600 text-orange-900 ring-2 ring-orange-200' : 'bg-white text-stone-600 hover:bg-stone-50'}`}><span className="text-xs font-bold">二爆終</span></button>
                        <button onClick={() => handleEventClick('drop')} disabled={(!isRoasting && roastData.length === 0)} className={`h-10 rounded border flex items-center justify-center ${events.drop ? 'bg-stone-700 text-white ring-2 ring-stone-400' : 'bg-white text-stone-600 hover:bg-stone-50'}`}><span className="text-xs font-bold">下豆</span></button>
                    </div>
                </div>

                {/* 3. Data Table */}
                <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden min-h-[200px] data-table-container">
                    <div className="p-2 bg-stone-100 border-b flex justify-between items-center text-xs">
                        <span className="font-bold text-stone-600">數據列表</span>
                        {roastData.length > 0 && (<button onClick={copyToClipboard} className="flex items-center gap-1 text-stone-500 hover:text-stone-800"><Clipboard size={10}/> 複製</button>)}
                    </div>
                    <div className="flex-1 overflow-y-auto" ref={scrollRef}>
                        <table className="w-full text-xs text-left">
                            <thead className="bg-stone-50 text-stone-500 sticky top-0 shadow-sm z-10">
                                <tr>
                                    <th className="p-2">時間</th>
                                    <th className="p-2">溫</th>
                                    <th className="p-2 text-right">RoR</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {roastData.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-amber-50">
                                        <td className="p-2 font-mono text-stone-500">{row.timeStr}</td>
                                        <td className="p-2 font-bold">{row.temp}</td>
                                        <td className={`p-2 font-mono font-bold text-right ${row.ror > 15 ? 'text-red-500' : row.ror < 5 ? 'text-blue-500' : 'text-emerald-600'}`}>{row.ror}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
         </div>

         {/* Right Panel: Chart Area */}
         <div className="flex-1 p-3 bg-stone-50 flex flex-col right-panel min-h-[400px]">
            <div className="bg-white p-2 rounded-xl shadow-sm border border-stone-200 flex-1 relative chart-container flex flex-col">
                <div className="print-only text-center font-bold mb-2 text-lg">烘焙曲線圖</div>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={roastData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                        <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                        <XAxis dataKey="timeSeconds" type="number" domain={['dataMin', 'dataMax + 60']} tickFormatter={formatTime} tick={{fontSize: 12}} allowDecimals={false} label={{ value: '時間 (Time)', position: 'insideBottomRight', offset: -10, fontSize: 12 }} />
                        <YAxis yAxisId="temp" domain={['auto', 'auto']} stroke="#ef4444" tick={{fontSize: 12}} width={40} allowDecimals={false} label={{ value: '豆溫 °C', angle: -90, position: 'insideLeft', fill: '#ef4444', fontSize: 12 }} />
                        <YAxis yAxisId="ror" orientation="right" domain={[0, 25]} stroke="#3b82f6" tick={{fontSize: 12}} width={40} label={{ value: 'RoR', angle: 90, position: 'insideRight', fill: '#3b82f6', fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="top" height={36} iconSize={12} wrapperStyle={{fontSize:'14px', paddingTop: '10px'}}/>
                        <Line yAxisId="temp" type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={3} name="豆溫" dot={{ r: 3 }} isAnimationActive={false} />
                        <Line yAxisId="ror" type="monotone" dataKey="ror" stroke="#3b82f6" strokeWidth={2} name="RoR" dot={false} isAnimationActive={false} />
                        <SafeReferenceLine x={events.turningPoint?.timeSeconds} color="#06b6d4" labelText="回溫" dash="3 3" />
                        <SafeReferenceLine x={events.fcStart?.timeSeconds} color="#eab308" labelText="一爆" dash="5 5" />
                        <SafeReferenceLine x={events.fcEnd?.timeSeconds} color="#ca8a04" labelText="" dash="5 5" />
                        <SafeReferenceLine x={events.scStart?.timeSeconds} color="#f97316" labelText="二爆" dash="5 5" />
                        <SafeReferenceLine x={events.scEnd?.timeSeconds} color="#ea580c" labelText="" dash="5 5" />
                        <SafeReferenceLine x={events.drop?.timeSeconds} color="#44403c" labelText="下豆" dash="3 3" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
            <div className="text-center text-[10px] text-stone-400 mt-2">Roast Master Dashboard Mode</div>
         </div>

      </main>
    </div>
  );
};

export default RoasterLandscape;

```

## 🖼️ ROR 曲線與實體翻拍圖
![[800212608471928293-153057063c8c793c.png]] [[New Note-d803819e815fe0e1]] (附件) ![[Gemini_Generated_Image_8ggri88ggr-44a8442c4e958641.jpg]] ![[Gemini_Generated_Image_htsu2ahtsu-e11f6500ada5b266.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-96a4cef5cc1008b1.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-be202b15b4d41e70.jpg]] ![[Gemini_Generated_Image_q59snqq59s-d7376f45389320a6.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-153057063c8c793c.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-758609cfa28db9a7.jpg]] ![[10093408293917864137-4c73aabdd108e0ae.png]] [[Roasting_Intermediate_ProfileLog_-37207be7c8cf4ed8.pdf]] (附件) ![[watermarked_img_10492246427767670-348becf21133fee3.png]] ![[watermarked_img_11106705015425215-f77f1d07742087ca.png]] ![[watermarked_img_12999798758131674-a69e1a5f282c98e9.png]] ![[watermarked_img_16136715147583793-751883e0b7d2a99b.png]] ![[watermarked_img_21996552928734358-81d33d7ced524557.png]] ![[watermarked_img_61291876590427009-8376951e268fe4c7.png]] ![[watermarked_img_72689651678688229-7a8d1f7f9139d1a9.png]] ![[watermarked_img_79491086321839540-fb7db2f02ea5b6b9.png]] ![[watermarked_img_95038301526181137-99bd81edff9fea77.png]]

## 🔗 相關理論與對話推薦
- [[2026-01-27_好的_1475]] (共用特徵: `dtr, ror, 回溫點`)
- [[2026-01-27_如果樣本烘焙入豆溫170度，1分46秒回溫119.9度，4分30秒141度轉黃點，6分30秒155度肉桂色，10分15秒_1476]] (共用特徵: `dtr, ror, 回溫點`)
- [[2026-01-27_我有修正一鍋為入豆溫170度，1分44秒回溫117.8度，4分30秒142度轉黃點，6分154度肉桂色，9分10秒179_1474]] (共用特徵: `dtr, ror, 回溫點`)
- [[2026-01-27_請幫我規劃西達磨日曬獅子王g2，200公克，楊家500公克瓦斯半熱風烘豆機，sca_roasting認證考試，建議烘焙計_1477]] (共用特徵: `dtr, ror, 回溫點`)
- [[2026-02-05_Sca_roasting_intermediate_考證照前如何充分準備與練習學科與術科_1392]] (共用特徵: `dtr, ror, 回溫點`)
