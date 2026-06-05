---
type: sca_theory
title: "AI-Drawing-Studio"
date: 2026-05-27
tags: [coffee/sca_theory, imported/takeout]
---

# 📚 SCA 考官理論：AI-Drawing-Studio

## 📋 對話理論筆記
```react
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Wand2, PenTool, ImageIcon, Layers, FileText, MessageSquare, 
  Download, Sparkles, Bot, Loader2, Undo2, Redo2, Trash2, 
  Eraser, Info, X, SlidersHorizontal, ChevronRight, ChevronDown, 
  Facebook, Upload, Palette, Megaphone
} from 'lucide-react';

const PROMPT_TEMPLATES = [
  { label: '✨ 寫實 3D', prompt: '高畫質 3D 渲染，Unreal Engine 5 風格，光影細膩，電影級質感，Octane Render' },
  { label: '🍃 吉卜力風', prompt: '吉卜力工作室動畫風格，水彩背景，宮崎駿，溫馨柔和的光線，精緻的手繪感' },
  { label: '👾 像素藝術', prompt: '精緻的 16-bit 像素藝術，復古遊戲風格，色彩鮮明，等距視角 (Isometric)' },
  { label: '🌊 浮世繪', prompt: '日本傳統浮世繪風格，木版畫，葛飾北齋，細緻的線條與古典色彩' }
];

const STICKER_PHRASES = ['早安', '謝謝', '辛苦了', 'OK', '收到', '太棒了', '加油', '晚安'];

const AI_DICTIONARY = {
  text2img: { title: '💡 提示詞工程 (Prompt Engineering)', content: 'AI 繪圖的基礎。透過精確的文字描述（包含主體、環境、光影、風格、畫質要求），引導「擴散模型 (Diffusion Model)」從隨機雜訊中生成符合預期的圖像。' },
  sketch2img: { title: '💡 結構控制 (ControlNet/Scribble)', content: '傳統文生圖很難控制精確姿勢。透過提取手繪「線條骨架 (Scribble)」，AI 能在維持您規定的構圖下，自由發揮色彩與材質，大幅提升創作可控性。' },
  styleXfer: { title: '💡 風格遷移 (Style Transfer)', content: '保留原圖的「內容特徵 (Content)」，並替換為指定的「風格特徵 (Style)」。現代 AI 常透過 IP-Adapter 等技術，在不改變主體結構的前提下，完美轉換畫風。' },
  inpainting: { title: '💡 局部修補 (Inpainting & Masking)', content: '利用遮罩 (Mask) 告訴 AI「圖片中哪裡可以修改、哪裡必須保留」。AI 會在邊緣進行無縫接合，讓新增的物件（如：幫人物換衣服、加配件）自然融入原圖環境中。' },
  worksheet: { title: '💡 排版與長文本生成', content: 'AI 繪圖模型也能進行版面設計！透過指定長寬比例 (如 9:16) 並給予明確的排版指示與層次架構，可以生成出具備設計感且留有作答空間的視覺化學習單模板。' },
  stickers: { title: '💡 批次生成與自動裁切', content: '結合 AI 圖像生成與傳統 HTML5 Canvas 的圖像處理能力。由 AI 負責產生內容，再由程式自動將圖片精確裁切、縮放至 Line 官方規定的三種不同尺寸，實現自動化量產。' },
  poster: { title: '💡 專業排版與視覺傳達', content: '透過提供完整的文案資訊與風格描述，引導 AI 進行圖文整合排版。AI 會根據活動性質自動決定字體風格、顏色搭配與資訊層次，快速產出具備專業感的行政海報。' }
};

const apiKey = ''; // 在 Canvas 環境中會由系統自動攔截與注入金鑰

// 真實 API 呼叫：統一使用 gemini-2.5-flash-image-preview 模型 (Canvas 環境支援度最高且可生成文字)
const callGeminiAPI = async (prompt, imageBase64 = null, params = {}) => {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`;

    const parts = [{ text: prompt }];
    if (imageBase64) {
      parts.push({ inlineData: { mimeType: "image/png", data: imageBase64 } });
    }

    const payload = {
      contents: [{ parts }],
      generationConfig: { responseModalities: ['TEXT', 'IMAGE'] }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // 加入防禦性解析，避免 Unexpected end of input 崩潰
    const textRaw = await response.text();
    if (!textRaw) {
      throw new Error(`伺服器回傳空白 (HTTP ${response.status})。這可能是由於環境代理伺服器阻擋。`);
    }

    let data;
    try {
      data = JSON.parse(textRaw);
    } catch (e) {
      throw new Error(`API 回傳格式解析失敗 (HTTP ${response.status}): ${textRaw.substring(0, 100)}...`);
    }
    
    if (!response.ok) {
       throw new Error(data.error?.message || `圖片生成請求失敗 (${response.status})`);
    }

    // 解析 Base64 圖片
    const base64Data = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
    if (base64Data) {
      return `data:image/png;base64,${base64Data}`;
    }
    
    throw new Error("模型已回應，但未能於內容中解析到有效的圖片資料 (inlineData)。");
  } catch (err) {
    console.error("Image API 錯誤:", err);
    throw err;
  }
};

// 真實 API 呼叫：使用 Gemini 2.5 Flash Preview 處理文字擴寫
const callGeminiLLM = async (prompt, systemInstruction) => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
       throw new Error(data.error?.message || "文字模型 API 請求失敗");
    }

    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    console.error("Gemini LLM API 錯誤:", err);
    throw new Error("AI 文字處理發生錯誤，請檢查網路連線。");
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('text2img');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentResult, setCurrentResult] = useState({ image: null, originalImage: null });
  const [errorMsg, setErrorMsg] = useState('');
  const [showDictionary, setShowDictionary] = useState(false);

  // 全局 AI 參數
  const [aiParams, setAiParams] = useState({ negativePrompt: '', aspectRatio: '1:1', strength: 50 });
  const [showParams, setShowParams] = useState(false); 
  const [history, setHistory] = useState([]);

  // --- 學習單排版狀態 ---
  const [worksheetConfig, setWorksheetConfig] = useState({
    content: '', color: 'bw', audience: '國小低年級', phonetics: 'none', keywords: '', orientation: 'portrait'
  });

  // --- 行政海報狀態 ---
  const [posterConfig, setPosterConfig] = useState({
    eventName: '', department: '', details: '', style: '', layout: '', hasQR: 'yes'
  });
  const [posterLogo, setPosterLogo] = useState(null);
  const [posterLogoDisplay, setPosterLogoDisplay] = useState(null);

  // --- Line 貼圖狀態 ---
  const [stickerSubject, setStickerSubject] = useState('');
  const [stickerBaseImg, setStickerBaseImg] = useState(null);
  const [stickerBase64, setStickerBase64] = useState('');
  const [selectedPhrases, setSelectedPhrases] = useState(['早安', '謝謝']);
  const [customPhrasesList, setCustomPhrasesList] = useState([]);
  const [customPhraseInput, setCustomPhraseInput] = useState('');
  const [stickerResultsList, setStickerResultsList] = useState([]);
  const [isGeneratingStickers, setIsGeneratingStickers] = useState(false);

  const addToHistory = (resultImage, originalImage, prompt, config, mode) => {
    setHistory(prev => [{ id: Date.now(), image: resultImage, original: originalImage, prompt, config: {...config}, mode }, ...prev].slice(0, 8));
  };

  const handleGenerateBase = async (prompt, imageBase64 = null, mode = 'text2img', originalDisplayImage = null, overrideParams = null) => {
    setIsGenerating(true); setErrorMsg('');
    setCurrentResult({ image: null, originalImage: null });
    
    const finalParams = overrideParams || aiParams;
    console.log(`🚀 [Backend Test] 啟動 ${mode} 生成測試`);
    console.log(`📦 [Payload] Prompt: ${prompt}`);
    console.log(`📦 [Payload] Parameters:`, finalParams);
    
    try {
      const resultImageUrl = await callGeminiAPI(prompt, imageBase64, finalParams);
      console.log(`✅ [Backend Test] 圖片生成成功！`);
      setCurrentResult({ image: resultImageUrl, originalImage: originalDisplayImage });
      addToHistory(resultImageUrl, originalDisplayImage, prompt, finalParams, mode);
    } catch (err) {
      console.error(`❌ [Backend Test] 生成失敗:`, err);
      setErrorMsg(err.message || '生成失敗發生錯誤，請檢查網路或 API 設定。');
    } finally {
      setIsGenerating(false);
    }
  };

  const UsageInstruction = ({ text }) => (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg mb-4 text-sm text-blue-800 flex items-start gap-2 shadow-sm">
      <Info className="w-5 h-5 flex-shrink-0 text-blue-500 mt-0.5" />
      <p className="leading-relaxed">{text}</p>
    </div>
  );

  const AIParamsPanel = () => (
    <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden mb-6 transition-all">
      <button onClick={() => setShowParams(!showParams)} className="w-full flex items-center justify-between p-3 md:p-4 bg-slate-100/50 hover:bg-slate-100 text-slate-700 font-bold text-sm">
        <span className="flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" /> 🎛️ AI 參數控制面板</span>
        {showParams ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
      {showParams && (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2">負面提示詞</label>
            <input type="text" value={aiParams.negativePrompt} onChange={(e) => setAiParams(prev => ({...prev, negativePrompt: e.target.value}))} placeholder="例如：模糊、低畫質" className="w-full text-sm p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2">生成比例</label>
            <select value={aiParams.aspectRatio} onChange={(e) => setAiParams(prev => ({...prev, aspectRatio: e.target.value}))} className="w-full text-sm p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none">
              <option value="1:1">1:1 (正方形)</option>
              <option value="16:9">16:9 (橫幅)</option>
              <option value="9:16">9:16 (直幅)</option>
            </select>
          </div>
          <div className={`sm:col-span-2 lg:col-span-1 ${activeTab === 'text2img' ? 'opacity-50 pointer-events-none' : ''}`}>
            <label className="block text-xs font-bold text-slate-500 mb-2 flex justify-between">
              <span>影響力 (Denoising)</span><span className="text-indigo-600">{aiParams.strength}%</span>
            </label>
            <input type="range" min="0" max="100" value={aiParams.strength} onChange={(e) => setAiParams(prev => ({...prev, strength: Number(e.target.value)}))} className="w-full accent-indigo-500" />
          </div>
        </div>
      )}
    </div>
  );

  const CompareSlider = ({ original, generated }) => {
    const [sliderPos, setSliderPos] = useState(50);
    return (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-100 rounded-xl group cursor-ew-resize touch-none">
        <img src={generated} alt="Generated" className="absolute w-full h-full object-contain pointer-events-none" />
        <div className="absolute inset-0 z-10 w-full h-full pointer-events-none" style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}>
          <img src={original} alt="Original" className="absolute w-full h-full object-contain bg-white" />
        </div>
        <div className="absolute top-0 bottom-0 z-20 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none" style={{ left: `calc(${sliderPos}% - 2px)` }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-slate-400">◂▸</div>
        </div>
        <input type="range" min="0" max="100" value={sliderPos} onChange={(e) => setSliderPos(e.target.value)} className="absolute inset-0 z-30 w-full h-full opacity-0 cursor-ew-resize touch-none" />
      </div>
    );
  };

  const ResultArea = () => (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex-1 flex flex-col min-h-[350px] lg:min-h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">生成結果</h2>
        {currentResult.image && !isGenerating && (
          <button onClick={() => {
            const a = document.createElement('a'); a.href = currentResult.image; a.download = 'AI_Drawing.png'; a.click();
          }} className="text-slate-600 hover:text-indigo-600 flex items-center gap-1 bg-slate-50 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors text-xs md:text-sm font-medium">
            <Download className="w-4 h-4"/> 下載圖片
          </button>
        )}
      </div>
      
      <div className="flex-1 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center justify-center overflow-hidden relative min-h-[250px]">
        {isGenerating ? (
          <div className="flex flex-col items-center text-indigo-500">
            <Loader2 className="w-10 h-10 md:w-12 md:h-12 animate-spin mb-4" />
            <p className="font-medium animate-pulse text-sm md:text-base">AI 處理中，請稍候...</p>
          </div>
        ) : errorMsg ? (
          <div className="text-red-500 text-center p-6 bg-red-50 rounded-xl"><p className="font-bold mb-1">發生錯誤</p><p className="text-sm">{errorMsg}</p></div>
        ) : currentResult.image ? (
          currentResult.originalImage ? <CompareSlider original={currentResult.originalImage} generated={currentResult.image} /> : <img src={currentResult.image} alt="Generated" className="w-full h-full object-contain p-2 animate-in fade-in zoom-in duration-500" />
        ) : (
          <div className="text-slate-400 text-center flex flex-col items-center">
            <ImageIcon className="w-12 h-12 md:w-16 md:h-16 mb-3 opacity-20" />
            <p className="text-sm">等待您的指令...</p>
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <h3 className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1"><HistoryIcon className="w-3 h-3"/> 歷程紀錄</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar snap-x">
            {history.map((item) => (
              <img key={item.id} src={item.image} alt="history" title={item.prompt} onClick={() => setCurrentResult({ image: item.image, originalImage: item.original })} className={`h-12 w-12 md:h-16 md:w-16 object-cover rounded-lg cursor-pointer border-2 snap-center flex-shrink-0 hover:border-indigo-500 transition-all ${currentResult.image === item.image ? 'border-indigo-500' : 'border-transparent'}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const HistoryIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>;

  const [t2iPrompt, setT2iPrompt] = useState('');
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);

  const handleEnhancePrompt = async () => {
    if (!t2iPrompt.trim()) return;
    setIsEnhancingPrompt(true);
    try {
      const enhanced = await callGeminiLLM(t2iPrompt, "你是一個專業的 AI 繪圖提示詞工程師。請擴充使用者的描述。");
      setT2iPrompt(enhanced.trim());
    } finally { setIsEnhancingPrompt(false); }
  };

  const renderText2Img = () => (
    <div className="flex flex-col lg:flex-row gap-4 md:gap-6 min-h-full">
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2"><Wand2 className="text-indigo-500" /> 文字生圖</h2>
            <button onClick={handleEnhancePrompt} disabled={!t2iPrompt.trim() || isEnhancingPrompt} className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg disabled:opacity-50">
              {isEnhancingPrompt ? <Loader2 className="w-3 h-3 animate-spin" /> : <Bot className="w-3 h-3" />} AI 潤飾
            </button>
          </div>
          
          <UsageInstruction text="請在下方輸入您腦海中的畫面描述（提示詞 Prompt）。如果您不知道怎麼把描述寫得更好，可以輸入簡單的詞語後，點擊右上角的「AI 潤飾」讓大語言模型幫您擴寫！" />
          
          <textarea className="w-full p-3 md:p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none mb-4 text-sm" rows="4" placeholder="例如：一隻戴著太空帽的橘貓，漂浮在星空" value={t2iPrompt} onChange={(e) => setT2iPrompt(e.target.value)} />
          <div className="mb-6">
             <p className="text-xs font-bold text-slate-500 mb-2">🎨 範本引導</p>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
               {PROMPT_TEMPLATES.map((tpl, i) => (
                 <button key={i} onClick={() => setT2iPrompt(t2iPrompt ? `${t2iPrompt}, ${tpl.prompt}` : tpl.prompt)} className="text-left text-xs p-2.5 bg-slate-50 hover:bg-indigo-50 text-slate-600 border border-slate-100 rounded-lg truncate">{tpl.label}</button>
               ))}
             </div>
          </div>
          <AIParamsPanel />
          <button onClick={() => handleGenerateBase(t2iPrompt, null, 'text2img')} disabled={!t2iPrompt.trim() || isGenerating} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-indigo-200 active:scale-[0.98]">
            {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />} 開始生成
          </button>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col"><ResultArea /></div>
    </div>
  );

  const useCanvasHelper = (canvasRef, modeType) => {
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [brushSize, setBrushSize] = useState(modeType === 'sketch' ? 5 : 20);
    const [brushColor, setBrushColor] = useState(modeType === 'sketch' ? '#000000' : '#39ff14');
    const [isEraser, setIsEraser] = useState(false);
    const [maskOpacity, setMaskOpacity] = useState(0.5);

    const saveState = useCallback(() => {
      if(!canvasRef.current) return;
      setUndoStack(prev => [...prev, canvasRef.current.toDataURL()]);
      setRedoStack([]);
    }, [canvasRef]);

    const restoreState = useCallback((dataUrl) => {
      if(!canvasRef.current || !dataUrl) return;
      const ctx = canvasRef.current.getContext('2d');
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        if(modeType === 'sketch') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height); }
        ctx.drawImage(img, 0, 0);
      };
      img.src = dataUrl;
    }, [canvasRef, modeType]);

    const undo = () => {
      if(undoStack.length === 0) return;
      setRedoStack(prev => [...prev, canvasRef.current.toDataURL()]);
      const prev = undoStack[undoStack.length - 1];
      setUndoStack(prev => prev.slice(0, -1));
      restoreState(prev);
    };

    const redo = () => {
      if(redoStack.length === 0) return;
      setUndoStack(prev => [...prev, canvasRef.current.toDataURL()]);
      const nxt = redoStack[redoStack.length - 1];
      setRedoStack(prev => prev.slice(0, -1));
      restoreState(nxt);
    };

    return { saveState, undo, redo, undoStack, redoStack, isDrawing, setIsDrawing, brushSize, setBrushSize, brushColor, setBrushColor, isEraser, setIsEraser, maskOpacity, setMaskOpacity };
  };

  const drawAction = (e, helpers, ref, isBgMask = false) => {
    if (!helpers.isDrawing) return;
    if(e.cancelable) e.preventDefault();
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    ctx.lineTo((clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY);
    ctx.strokeStyle = isBgMask ? `rgba(57, 255, 20, ${helpers.maskOpacity})` : (helpers.isEraser ? '#ffffff' : helpers.brushColor);
    ctx.lineWidth = helpers.brushSize; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const startDraw = (e, helpers, ref) => {
    helpers.saveState();
    const ctx = ref.current.getContext('2d');
    const rect = ref.current.getBoundingClientRect();
    ctx.beginPath();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    ctx.moveTo((clientX - rect.left) * (ref.current.width / rect.width), (clientY - rect.top) * (ref.current.height / rect.height));
    helpers.setIsDrawing(true);
  };

  const sketchCanvasRef = useRef(null);
  const [sketchPrompt, setSketchPrompt] = useState('');
  const [isGettingIdea, setIsGettingIdea] = useState(false);
  const sketchHelpers = useCanvasHelper(sketchCanvasRef, 'sketch');

  useEffect(() => {
    if (activeTab === 'sketch2img' && sketchCanvasRef.current && sketchHelpers.undoStack.length === 0) {
      const ctx = sketchCanvasRef.current.getContext('2d');
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 512, 512);
      sketchHelpers.saveState();
    }
  }, [activeTab]);

  const renderSketch2Img = () => (
    <div className="flex flex-col lg:flex-row gap-4 md:gap-6 min-h-full">
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex-1 flex flex-col">
           <div className="flex justify-between items-center mb-3">
             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><PenTool className="text-pink-500" /> 塗鴉空間</h2>
             <div className="flex bg-slate-100 p-1 rounded-lg">
                <button onClick={sketchHelpers.undo} disabled={sketchHelpers.undoStack.length === 0} className="p-1 hover:bg-white rounded text-slate-600 disabled:opacity-30"><Undo2 className="w-4 h-4"/></button>
                <button onClick={sketchHelpers.redo} disabled={sketchHelpers.redoStack.length === 0} className="p-1 hover:bg-white rounded text-slate-600 disabled:opacity-30"><Redo2 className="w-4 h-4"/></button>
                <div className="w-px bg-slate-300 mx-1"></div>
                <button onClick={() => { sketchHelpers.saveState(); const ctx = sketchCanvasRef.current.getContext('2d'); ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,512,512); }} className="p-1 hover:bg-white rounded text-red-500"><Trash2 className="w-4 h-4"/></button>
             </div>
           </div>
           
           <UsageInstruction text="請在畫布上畫出簡單的線條草圖（火柴人也可以！）。您可以在下方輸入輔助文字，告訴 AI 您畫的是什麼，AI 會根據您的線條結構生成出精緻的彩色圖像。" />

           <div className="flex flex-wrap md:flex-nowrap items-center gap-3 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100 text-sm">
              <input type="color" value={sketchHelpers.brushColor} onChange={e => {sketchHelpers.setBrushColor(e.target.value); sketchHelpers.setIsEraser(false);}} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
              <button onClick={() => sketchHelpers.setIsEraser(!sketchHelpers.isEraser)} className={`p-1.5 rounded flex items-center gap-1 ${sketchHelpers.isEraser ? 'bg-pink-100 text-pink-600' : 'text-slate-600'}`}><Eraser className="w-4 h-4"/> 橡皮擦</button>
              <div className="flex items-center gap-2 w-full md:flex-1 pl-2 md:border-l border-slate-200">
                <span className="text-xs text-slate-500">粗細: {sketchHelpers.brushSize}px</span>
                <input type="range" min="1" max="50" value={sketchHelpers.brushSize} onChange={e => sketchHelpers.setBrushSize(e.target.value)} className="flex-1 accent-pink-500" />
              </div>
           </div>

           <div className="relative w-full aspect-square max-w-[512px] mx-auto bg-white rounded-xl overflow-hidden border-2 border-dashed border-slate-200 cursor-crosshair touch-none shadow-inner">
             <canvas ref={sketchCanvasRef} width={512} height={512} className="w-full h-full object-contain"
               onMouseDown={e => startDraw(e, sketchHelpers, sketchCanvasRef)} onMouseMove={e => drawAction(e, sketchHelpers, sketchCanvasRef)} onMouseUp={() => sketchHelpers.setIsDrawing(false)} onMouseLeave={() => sketchHelpers.setIsDrawing(false)}
               onTouchStart={e => startDraw(e, sketchHelpers, sketchCanvasRef)} onTouchMove={e => drawAction(e, sketchHelpers, sketchCanvasRef)} onTouchEnd={() => sketchHelpers.setIsDrawing(false)}
             />
           </div>

           <div className="mt-4">
             <div className="flex flex-col sm:flex-row gap-2 mb-4">
               <input type="text" placeholder="輔助提示詞 (選填)" value={sketchPrompt} onChange={(e) => setSketchPrompt(e.target.value)} className="flex-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-sm" />
               <button onClick={async () => { setIsGettingIdea(true); try { setSketchPrompt(await callGeminiLLM("給點子", "點子")); } finally { setIsGettingIdea(false); } }} disabled={isGettingIdea} className="bg-pink-50 text-pink-600 px-3 rounded-xl flex items-center gap-1 text-sm whitespace-nowrap">
                 {isGettingIdea ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />} AI 靈感
               </button>
             </div>
             <AIParamsPanel />
             <button onClick={() => handleGenerateBase(`將草圖轉換為藝術圖像：${sketchPrompt}`, sketchCanvasRef.current.toDataURL('image/png').split(',')[1], 'sketch2img', sketchCanvasRef.current.toDataURL())} disabled={isGenerating} className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3.5 rounded-xl disabled:opacity-50 flex justify-center items-center gap-2 active:scale-[0.98]">
                {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />} 生成精緻圖像
              </button>
           </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col"><ResultArea /></div>
    </div>
  );

  const [uploadedImage3, setUploadedImage3] = useState(null);
  const [base64Img3, setBase64Img3] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('anime');
  const [customStylePrompt, setCustomStylePrompt] = useState('');
  const [isOptimizingStyle, setIsOptimizingStyle] = useState(false);

  const styleOptions = [
    { id: 'anime', name: '日系動漫 (Anime)' }, { id: '3d', name: '3D 動畫 (3D Render)' },
    { id: 'cyberpunk', name: '賽博龐克 (Cyberpunk)' }, { id: 'watercolor', name: '水彩畫 (Watercolor)' }, 
    { id: 'other', name: '其他 (自訂輸入)' }
  ];

  const handleImageUpload3 = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage3(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => setBase64Img3(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    }
  };

  const renderStyleTransfer = () => (
    <div className="flex flex-col lg:flex-row gap-4 md:gap-6 min-h-full">
      <div className="bg-white w-full lg:w-1/2 p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4">
        <UsageInstruction text="上傳一張照片，選擇您想要的藝術風格。AI 會分析原圖的主體與構圖，並用全新的繪畫風格重新繪製出來。" />
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2"><Upload className="text-blue-500" /> 1. 上傳原圖</h2>
          {/* 【修正】加入 relative 屬性，限制 absolute 遮罩的範圍不會溢出 */}
          <label className="relative flex flex-col items-center justify-center w-full aspect-video md:h-48 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 overflow-hidden group">
            {uploadedImage3 ? (
              <>
                <img src={uploadedImage3} alt="Uploaded" className="w-full h-full object-contain" />
                {/* 【修正】使用 inset-0 確保遮罩緊貼父元素 */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <p className="text-white font-medium flex items-center gap-2"><Upload className="w-4 h-4" /> 重新上傳</p>
                </div>
              </>
            ) : (
              <div className="text-slate-400 flex flex-col items-center"><Upload className="w-8 h-8 mb-2" /><p className="text-sm">點擊上傳</p></div>
            )}
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload3} />
          </label>
        </div>
        <div className="flex flex-col flex-1">
          <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2"><Palette className="text-blue-500" /> 2. 選擇風格</h2>
          <select value={selectedStyle} onChange={e => setSelectedStyle(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none mb-4 text-sm">
            {styleOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
          </select>
          {selectedStyle === 'other' && (
            <div className="relative mb-4">
              <textarea placeholder="描述您想要的風格..." value={customStylePrompt} onChange={e => setCustomStylePrompt(e.target.value)} className="w-full p-3 pr-24 border border-slate-200 rounded-xl focus:ring-2 outline-none text-sm" rows="3" />
              <button onClick={async () => { setIsOptimizingStyle(true); try { setCustomStylePrompt(await callGeminiLLM(customStylePrompt, "專業藝術")); } finally { setIsOptimizingStyle(false); } }} className="absolute bottom-3 right-3 bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs flex items-center gap-1">優化</button>
            </div>
          )}
          <div className="mt-auto">
            <AIParamsPanel />
            <button onClick={() => handleGenerateBase(selectedStyle === 'other' ? `轉換風格：${customStylePrompt}` : `轉換為「${styleOptions.find(o=>o.id===selectedStyle).name}」風格`, base64Img3, 'styleXfer', uploadedImage3)} disabled={!base64Img3 || isGenerating} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl disabled:opacity-50 flex justify-center items-center gap-2 active:scale-[0.98]">
               {isGenerating ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5"/>} 開始轉換
            </button>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col"><ResultArea /></div>
    </div>
  );

  // --- 局部 AI 修改狀態與函式 ---
  const inpaintCanvasRef = useRef(null);
  const [uploadedImage4, setUploadedImage4] = useState(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [isRefiningEdit, setIsRefiningEdit] = useState(false);
  const imgObjRef = useRef(null);
  const inpaintHelpers = useCanvasHelper(inpaintCanvasRef, 'inpaint');

  const drawBackgroundToCanvas = (imgUrl) => {
    const img = new Image();
    img.onload = () => {
      imgObjRef.current = img;
      if (!inpaintCanvasRef.current) return;
      const canvas = inpaintCanvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = (canvas.height / 2) - (img.height / 2) * scale;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      inpaintHelpers.saveState(); 
    };
    img.src = imgUrl;
  };

  const handleInpaintUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage4(url);
      drawBackgroundToCanvas(url);
    }
  };

  const resetInpaintCanvas = () => {
    if(uploadedImage4) drawBackgroundToCanvas(uploadedImage4);
  };

  const handleInpaintGenerate = () => {
    if (!inpaintCanvasRef.current) return;
    const canvas = inpaintCanvasRef.current;
    const compositeBase64 = canvas.toDataURL('image/png').split(',')[1];
    const prompt = `[Inpainting Task] 我用半透明綠色標註了特定區域。請「只針對綠色標註的區域」進行修改：${editPrompt}。務必保留沒被綠色覆蓋的原圖部分。`;
    handleGenerateBase(prompt, compositeBase64, 'inpainting', uploadedImage4);
  };

  const renderInpainting = () => (
    <div className="flex flex-col lg:flex-row gap-4 md:gap-6 min-h-full">
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex-1 flex flex-col">
           <div className="flex justify-between items-center mb-3">
             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Layers className="text-emerald-500" /> 遮罩與修改</h2>
             <div className="flex gap-2">
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button onClick={inpaintHelpers.undo} disabled={inpaintHelpers.undoStack.length === 0} className="p-1 hover:bg-white rounded text-slate-600 disabled:opacity-30"><Undo2 className="w-4 h-4"/></button>
                  <button onClick={inpaintHelpers.redo} disabled={inpaintHelpers.redoStack.length === 0} className="p-1 hover:bg-white rounded text-slate-600 disabled:opacity-30"><Redo2 className="w-4 h-4"/></button>
                  <div className="w-px bg-slate-300 mx-1"></div>
                  <button onClick={resetInpaintCanvas} className="p-1 hover:bg-white rounded text-red-500" title="還原原圖"><Trash2 className="w-4 h-4"/></button>
                </div>
                <label className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg cursor-pointer text-sm font-medium transition-colors flex items-center gap-1">
                  <Upload className="w-4 h-4"/> <span className="hidden sm:inline">上傳</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleInpaintUpload} />
                </label>
             </div>
           </div>
           
           <UsageInstruction text="上傳圖片後，使用畫筆在想修改的地方塗上遮罩，並在下方輸入修改指令（例如：把這裡換成一朵花）。AI 會精準替換標註區域，並無縫融入原圖！" />

           <div className="flex flex-wrap md:flex-nowrap items-center gap-3 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100 text-sm">
              <div className="flex items-center gap-2 w-full md:flex-1">
                <span className="text-xs text-slate-500 whitespace-nowrap">筆刷大小</span>
                <input type="range" min="10" max="100" value={inpaintHelpers.brushSize} onChange={e => inpaintHelpers.setBrushSize(e.target.value)} className="flex-1 accent-emerald-500" />
              </div>
              <div className="flex items-center gap-2 w-full md:flex-1 pl-2 md:border-l border-slate-200">
                <span className="text-xs text-slate-500 whitespace-nowrap">遮罩透明度</span>
                <input type="range" min="0.1" max="1" step="0.1" value={inpaintHelpers.maskOpacity} onChange={e => inpaintHelpers.setMaskOpacity(e.target.value)} className="flex-1 accent-emerald-500" />
              </div>
           </div>

           <div className="relative w-full aspect-square max-w-[512px] mx-auto bg-slate-100 rounded-xl overflow-hidden border-2 border-dashed border-slate-200 cursor-crosshair touch-none group shadow-inner">
             {!uploadedImage4 && <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium pointer-events-none p-4 text-center">請先上傳圖片，再用螢光筆塗抹</div>}
             <canvas ref={inpaintCanvasRef} width={512} height={512} className="w-full h-full object-contain relative z-10"
               onMouseDown={e => startDraw(e, inpaintHelpers, inpaintCanvasRef)} onMouseMove={e => drawAction(e, inpaintHelpers, inpaintCanvasRef, true)} onMouseUp={() => inpaintHelpers.setIsDrawing(false)} onMouseLeave={() => inpaintHelpers.setIsDrawing(false)}
               onTouchStart={e => startDraw(e, inpaintHelpers, inpaintCanvasRef)} onTouchMove={e => drawAction(e, inpaintHelpers, inpaintCanvasRef, true)} onTouchEnd={() => inpaintHelpers.setIsDrawing(false)}
             />
           </div>

           <div className="mt-4 flex-1 flex flex-col justify-end">
             <div className="flex flex-col sm:flex-row gap-2 mb-4">
               <input type="text" placeholder="修改指令：例如 把這裡變成一朵花" value={editPrompt} onChange={(e) => setEditPrompt(e.target.value)} className="flex-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
               <button onClick={async () => {
                 setIsRefiningEdit(true);
                 try { setEditPrompt(await callGeminiLLM(editPrompt, "將局部修改意圖轉為清晰的生圖指令。")); }
                 finally { setIsRefiningEdit(false); }
               }} disabled={!editPrompt.trim() || isRefiningEdit} className="bg-emerald-50 text-emerald-600 px-3 rounded-xl flex items-center gap-1 text-sm whitespace-nowrap">
                 {isRefiningEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />} AI 改寫
               </button>
             </div>
             <AIParamsPanel />
             <button onClick={handleInpaintGenerate} disabled={!uploadedImage4 || isGenerating || !editPrompt.trim()} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl disabled:opacity-50 flex justify-center items-center gap-2 active:scale-[0.98]">
                {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />} 生成修改結果
              </button>
           </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col"><ResultArea /></div>
    </div>
  );

  const renderWorksheet = () => {
    const handleGenerateWorksheet = () => {
      const { content, color, audience, phonetics, keywords, orientation } = worksheetConfig;
      // 【修正】將比例改為最接近 A4 的 3:4 (直式) 與 4:3 (橫式)
      const aspect = orientation === 'portrait' ? '3:4' : '4:3';
      
      // 【修正】在提示詞中明確寫入 A4 (210×297mm) 的實體尺寸要求
      const prompt = `設計一張精美的教育學習單。目標對象：${audience}。版面：${orientation === 'portrait'?'直式':'橫式'}，尺寸為標準 A4 比例 (210×297mm)。風格：${color==='bw'?'黑白列印':'彩色'}。主題：${keywords}。注音空間需求：${phonetics === 'none' ? '無' : '需要較大的行距與留白以填寫拼音'}。
      請在學習單中「直接排版並繪製出」以下真實繁體中文內容：
      ${content}
      請確保中文字體清晰、無亂碼，並具備優良的視覺層次，排版結構要適合教育現場 A4 (210×297mm) 尺寸列印與學生作答。`;
      
      handleGenerateBase(prompt, null, 'worksheet', null, { ...aiParams, aspectRatio: aspect });
    };

    return (
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 min-h-full">
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex-1">
            <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><FileText className="text-indigo-500 w-5 h-5"/> 學習單美編排版</h2>
            
            <UsageInstruction text="設定目標對象與版面，並輸入學習內容。Gemini Flash 具備強大的中文生成能力，會為您直接將中文字體與視覺版面完美排版繪製出來！" />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">版面方向</label>
                <select value={worksheetConfig.orientation} onChange={e=>setWorksheetConfig({...worksheetConfig, orientation: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg text-sm">
                  <option value="portrait">直式 A4</option><option value="landscape">橫式 A4</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">色彩模式</label>
                <select value={worksheetConfig.color} onChange={e=>setWorksheetConfig({...worksheetConfig, color: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg text-sm">
                  <option value="bw">黑白 (列印)</option><option value="color">彩色 (視覺)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">注音/拼音</label>
                <select value={worksheetConfig.phonetics} onChange={e=>setWorksheetConfig({...worksheetConfig, phonetics: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg text-sm">
                  <option value="none">不需要</option><option value="注音">注音符號</option><option value="漢語拼音">漢語拼音</option>
                </select>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-bold text-slate-500 mb-1">目標對象</label>
                <input type="text" value={worksheetConfig.audience} onChange={e=>setWorksheetConfig({...worksheetConfig, audience: e.target.value})} placeholder="如: 國小三年級" className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
              </div>
              <div className="col-span-2 md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 mb-1">重點引導詞</label>
                <input type="text" value={worksheetConfig.keywords} onChange={e=>setWorksheetConfig({...worksheetConfig, keywords: e.target.value})} placeholder="如: 光合作用" className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
              </div>
            </div>

            <label className="block text-xs font-bold text-slate-500 mb-1">學習單內容 <span className="text-indigo-500">(✨ 請詳細輸入大綱，AI會依此留白)</span></label>
            <textarea className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 outline-none resize-none mb-4 text-sm" rows="6" placeholder="大標題、副標題、問答題內容..." value={worksheetConfig.content} onChange={e => setWorksheetConfig({...worksheetConfig, content: e.target.value})} />

            <button onClick={handleGenerateWorksheet} disabled={!worksheetConfig.content.trim() || isGenerating} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl disabled:opacity-50 flex justify-center items-center gap-2 active:scale-[0.98]">
              {isGenerating ? <Loader2 className="animate-spin" /> : <FileText />} 智慧排版生成
            </button>
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex flex-col"><ResultArea /></div>
      </div>
    );
  };

  const renderPoster = () => {
    const handleLogoUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        setPosterLogoDisplay(URL.createObjectURL(file));
        const reader = new FileReader();
        reader.onloadend = () => setPosterLogo(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
      }
    };

    const handleGeneratePoster = () => {
      const { eventName, department, details, style, layout, hasQR } = posterConfig;
      
      // 【修正】在提示詞中明確寫入 A4 (210×297mm) 的實體尺寸要求
      const prompt = `設計一張專業的行政機關或公關宣傳海報。尺寸為標準直式 A4 比例 (210×297mm)。
      【活動/主題名稱】：${eventName}
      【主責單位】：${department}
      【文告與活動事項】：${details}
      【海報整體風格】：${style}
      【排版與視覺描述】：${layout}
      【QR Code 需求】：${hasQR === 'yes' ? '請在海報角落設計一個顯眼的 QR Code 圖示區域' : '不需要 QR Code'}
      
      請將上述資訊與視覺元素進行專業的圖文排版設計。確保中文字體清晰無亂碼、標題醒目，視覺層次分明，符合正式行政公告與宣傳海報的標準 A4 排版。`;
      
      // 【修正】將比例改為最接近 A4 的 3:4 (直式)
      handleGenerateBase(prompt, posterLogo, 'poster', posterLogoDisplay, { ...aiParams, aspectRatio: '3:4' });
    };

    return (
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 min-h-full">
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex-1">
            <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Megaphone className="text-teal-500 w-5 h-5"/> 行政海報生成</h2>
            
            {/* 【修正】更新說明文字的比例提示 */}
            <UsageInstruction text="請完整填寫海報文案與風格需求，可選擇性上傳單位 Logo 作為風格參考。AI 將自動編排字體、層次與背景，快速產出標準 A4 比例 (3:4) 的專業海報！" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 mb-1">1. 活動/主題名稱 (必填)</label>
                <input type="text" value={posterConfig.eventName} onChange={e=>setPosterConfig({...posterConfig, eventName: e.target.value})} placeholder="例如：113年度淨灘環保大作戰" className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">2. 主責單位</label>
                <input type="text" value={posterConfig.department} onChange={e=>setPosterConfig({...posterConfig, department: e.target.value})} placeholder="例如：環保局" className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500" />
              </div>

              <div>
                 <label className="block text-xs font-bold text-slate-500 mb-1">3. 是否加入 QR Code</label>
                 <select value={posterConfig.hasQR} onChange={e=>setPosterConfig({...posterConfig, hasQR: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="yes">是 (預留 QR Code)</option>
                    <option value="no">否</option>
                 </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 mb-1">4. 海報風格</label>
                <input type="text" value={posterConfig.style} onChange={e=>setPosterConfig({...posterConfig, style: e.target.value})} placeholder="例如：清新自然風、漸層藍色系、簡約幾何" className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-500 mb-1">5. 單位 Logo (選填，將作為圖生圖參考)</label>
              <div className="flex items-center gap-3">
                <label className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 px-3 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors">
                  <Upload className="w-4 h-4 inline mr-1"/> 上傳 Logo
                  <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                </label>
                {posterLogoDisplay && <img src={posterLogoDisplay} alt="Logo" className="h-10 w-auto object-contain border rounded bg-white p-1" />}
              </div>
            </div>

            <label className="block text-xs font-bold text-slate-500 mb-1">6. 排列描述與文告事項 <span className="text-teal-500">(✨ 請輸入細節時間/地點/說明)</span></label>
            <textarea className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none resize-none mb-4 text-sm" rows="4" placeholder="時間：113年10月1日\n地點：市政大廳\n排列描述：標題置中，時間地點放在右下角..." value={posterConfig.details} onChange={e => setPosterConfig({...posterConfig, details: e.target.value})} />

            <button onClick={handleGeneratePoster} disabled={!posterConfig.eventName.trim() || isGenerating} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl disabled:opacity-50 flex justify-center items-center gap-2 active:scale-[0.98]">
              {isGenerating ? <Loader2 className="animate-spin" /> : <Megaphone />} 一鍵生成海報
            </button>
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex flex-col"><ResultArea /></div>
      </div>
    );
  };

  const renderLineSticker = () => {
    const handleStickerImgUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        setStickerBaseImg(URL.createObjectURL(file));
        const reader = new FileReader();
        reader.onloadend = () => setStickerBase64(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
      }
    };

    const handleGenerateStickers = async () => {
      setIsGeneratingStickers(true); setStickerResultsList([]);
      try {
        for (let phrase of selectedPhrases) {
          const prompt = `設計一個白底的通訊軟體可愛貼圖插畫，主體是：${stickerSubject}。請在圖片中清晰地加上繁體中文字：「${phrase}」。字體要活潑可愛、清晰易讀，最好帶有白邊或粗體效果，整體風格統一，絕不要包含無意義的亂碼。`;
          const finalUrl = await callGeminiAPI(prompt, stickerBase64, { ...aiParams, aspectRatio: '1:1' });
          
          setStickerResultsList(prev => [...prev, { phrase, url: finalUrl }]);
        }
      } catch (err) {
        console.error(err);
        setErrorMsg('貼圖生成失敗');
      } finally { 
        setIsGeneratingStickers(false); 
      }
    };

    const handleDownloadSticker = (imgUrl, phrase, sizeType) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const dims = { main: [240, 240], tab: [96, 74], sticker: [370, 320] }[sizeType];
      canvas.width = dims[0]; canvas.height = dims[1];
      const img = new Image();
      img.onload = () => {
        ctx.fillStyle = 'white'; ctx.fillRect(0,0,canvas.width,canvas.height);
        const scale = Math.min(canvas.width/img.width, canvas.height/img.height);
        ctx.drawImage(img, (canvas.width - img.width*scale)/2, (canvas.height - img.height*scale)/2, img.width*scale, img.height*scale);
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = `LineSticker_${phrase}_${sizeType}.png`;
        a.click();
      };
      img.src = imgUrl;
    };

    const allStickerPhrases = [...STICKER_PHRASES, ...customPhrasesList];

    return (
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 min-h-full">
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex-1">
            <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><MessageSquare className="text-amber-500 w-5 h-5"/> Line 貼圖批次生產</h2>
            
            <UsageInstruction text="描述主體並勾選最多 3 個對話文字（為避免 API 請求時間過長超時，單次上限 3 張）。系統會自動批次生成貼圖，並提供符合 Line 官方審核尺寸的下載按鈕。" />

            <div className="mb-4">
               <label className="block text-xs font-bold text-slate-500 mb-2">1. 參考角色 (選填)</label>
               <input type="file" accept="image/*" onChange={handleStickerImgUpload} className="w-full text-sm" />
               {stickerBaseImg && <img src={stickerBaseImg} alt="Base" className="mt-2 h-16 w-16 object-cover rounded-lg" />}
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-500 mb-1">2. 主體描述 (必填)</label>
              <input type="text" value={stickerSubject} onChange={e=>setStickerSubject(e.target.value)} placeholder="例如：一隻戴著黃色圍巾的可愛企鵝" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm" />
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                 <label className="block text-xs font-bold text-slate-500">3. 選擇文字 (上限 3 張)</label>
                 <span className={`text-xs font-bold ${selectedPhrases.length >= 3 ? 'text-red-500' : 'text-slate-400'}`}>已選 {selectedPhrases.length}/3</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {allStickerPhrases.map(phrase => {
                  const isSelected = selectedPhrases.includes(phrase);
                  const isAtLimit = !isSelected && selectedPhrases.length >= 3;
                  return (
                    <button key={phrase} onClick={() => {
                      if (isAtLimit) return;
                      setSelectedPhrases(prev => isSelected ? prev.filter(p => p !== phrase) : [...prev, phrase]);
                    }} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${isSelected ? 'bg-amber-500 text-white border-amber-500 scale-105' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'} ${isAtLimit ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {isSelected ? '✓ ' : ''}{phrase}
                    </button>
                  )
                })}
              </div>
              <div className="flex items-center gap-2">
                <input type="text" maxLength={6} value={customPhraseInput} onChange={e=>setCustomPhraseInput(e.target.value)} placeholder="自訂文字 (限 6 字)" className="p-2 border border-slate-200 rounded-lg text-sm flex-1 outline-none focus:ring-2 focus:ring-amber-500" />
                <button onClick={() => {
                  const newPhrase = customPhraseInput.trim();
                  if(!newPhrase || selectedPhrases.length >= 3) return;
                  if(!allStickerPhrases.includes(newPhrase)) setCustomPhrasesList(prev => [...prev, newPhrase]);
                  if(!selectedPhrases.includes(newPhrase)) setSelectedPhrases(prev => [...prev, newPhrase]);
                  setCustomPhraseInput('');
                }} disabled={!customPhraseInput.trim() || selectedPhrases.length >= 3} className="bg-amber-100 text-amber-700 px-3 py-2 rounded-lg text-sm font-bold disabled:opacity-50">新增</button>
              </div>
            </div>

            <button onClick={handleGenerateStickers} disabled={(!stickerSubject && !stickerBase64) || selectedPhrases.length === 0 || isGeneratingStickers} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl disabled:opacity-50 flex justify-center items-center gap-2 active:scale-[0.98]">
              {isGeneratingStickers ? <Loader2 className="animate-spin" /> : <Download />} 批次生成貼圖組
            </button>
          </div>
        </div>
        
        <div className="w-full lg:w-1/2 flex flex-col bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[350px]">
          <h2 className="text-lg font-bold text-slate-800 mb-4">生成結果與多尺寸下載</h2>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {isGeneratingStickers && <div className="flex items-center justify-center p-8 text-amber-500"><Loader2 className="animate-spin w-8 h-8 mr-2"/> 正在批次繪製中...</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stickerResultsList.map((item, idx) => (
                <div key={idx} className="border border-slate-100 rounded-xl p-3 flex flex-col items-center bg-slate-50">
                  <p className="font-bold text-slate-600 mb-2">「{item.phrase}」</p>
                  <img src={item.url} alt={item.phrase} className="w-32 h-32 object-contain bg-white rounded-lg border shadow-sm mb-3" />
                  <div className="flex flex-col gap-1 w-full text-xs">
                    <button onClick={()=>handleDownloadSticker(item.url, item.phrase, 'sticker')} className="bg-white hover:bg-slate-100 border py-1.5 rounded text-slate-700 font-medium">一般貼圖 (370x320)</button>
                    <button onClick={()=>handleDownloadSticker(item.url, item.phrase, 'main')} className="bg-white hover:bg-slate-100 border py-1.5 rounded text-slate-700 font-medium">主要圖片 (240x240)</button>
                    <button onClick={()=>handleDownloadSticker(item.url, item.phrase, 'tab')} className="bg-white hover:bg-slate-100 border py-1.5 rounded text-slate-700 font-medium">聊天室標籤 (96x74)</button>
                  </div>
                </div>
              ))}
            </div>
            {stickerResultsList.length === 0 && !isGeneratingStickers && <p className="text-center text-slate-400 mt-10">等待生成...</p>}
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'text2img', name: '提示詞生成', icon: <Wand2 className="w-5 h-5" />, desc: '基礎文生圖，學習 Prompt' },
    { id: 'sketch2img', name: '手繪轉圖像', icon: <PenTool className="w-5 h-5" />, desc: 'ControlNet 線條骨架' },
    { id: 'styleXfer', name: '風格轉換', icon: <ImageIcon className="w-5 h-5" />, desc: '風格遷移與特徵保留' },
    { id: 'inpainting', name: '局部 AI 修改', icon: <Layers className="w-5 h-5" />, desc: '遮罩 (Mask) 應用' },
    { id: 'worksheet', name: '學習單排版', icon: <FileText className="w-5 h-5 text-indigo-500" />, desc: '長文本與比例控制' },
    { id: 'poster', name: '行政海報生成', icon: <Megaphone className="w-5 h-5 text-teal-500" />, desc: '活動公關與宣傳海報' },
    { id: 'stickers', name: 'Line貼圖生成', icon: <MessageSquare className="w-5 h-5 text-amber-500" />, desc: '批次量產與自動裁切' }
  ];

  return (
    <div className="h-screen flex flex-col md:flex-row bg-slate-100 font-sans text-slate-800 overflow-hidden">
      
      {showDictionary && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 relative">
             <button onClick={() => setShowDictionary(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X className="w-5 h-5"/></button>
             <h3 className="text-xl font-black text-indigo-600 mb-4">{AI_DICTIONARY[activeTab].title}</h3>
             <p className="text-slate-600 leading-relaxed text-sm md:text-base">{AI_DICTIONARY[activeTab].content}</p>
             <button onClick={() => setShowDictionary(false)} className="mt-6 w-full py-2.5 bg-indigo-50 text-indigo-700 rounded-lg font-bold">了解了</button>
          </div>
        </div>
      )}

      <div className="w-full md:w-72 bg-white border-b md:border-r border-slate-200 flex-shrink-0 flex flex-col z-10 shadow-sm relative">
        <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center md:items-start md:flex-col">
          <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="text-indigo-600 w-5 h-5" /> 繪圖實驗室
          </h1>
          <p className="text-[10px] md:text-xs text-slate-500 md:mt-2 font-medium bg-slate-100 p-1 rounded-md inline-block">教學示範原型</p>
        </div>
        
        <nav className="p-3 md:p-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto custom-scrollbar snap-x touch-pan-x">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setCurrentResult({image:null, originalImage:null}); setErrorMsg(''); }} className={`flex items-center gap-2 md:gap-4 p-2.5 md:p-4 rounded-xl text-left transition-all whitespace-nowrap md:whitespace-normal flex-shrink-0 snap-center ${activeTab === tab.id ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100' : 'text-slate-500 hover:bg-slate-50 border border-transparent'}`}>
              <div className={`${activeTab === tab.id ? 'text-indigo-600 bg-white p-1.5 rounded-lg shadow-sm' : 'text-slate-400'}`}>{tab.icon}</div>
              <div><div className="text-sm md:text-base">{tab.name}</div><div className="text-xs font-normal text-slate-400 hidden md:block mt-0.5">{tab.desc}</div></div>
            </button>
          ))}
        </nav>
      </div>

      <main className="flex-1 p-3 md:p-6 overflow-y-auto relative custom-scrollbar">
        <div className="max-w-7xl mx-auto flex justify-between items-center mb-4 px-1">
           <h2 className="text-lg md:text-xl font-black text-slate-700 flex items-center gap-2">{tabs.find(t=>t.id === activeTab)?.name}</h2>
           <div className="flex items-center gap-2">
             <a href="https://www.facebook.com/Journal.of.Digital.Narrative" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-full font-bold text-xs md:text-sm border border-blue-200 transition-transform hover:scale-105 shadow-sm">
               <Facebook className="w-4 h-4"/> <span className="hidden sm:inline">追蹤數位敘事力</span>
             </a>
             <button onClick={() => setShowDictionary(true)} className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 px-3 py-1.5 rounded-full font-bold text-xs md:text-sm border border-yellow-200 transition-transform hover:scale-105 shadow-sm">
               <Info className="w-4 h-4"/> <span className="hidden sm:inline">原理科普</span><span className="sm:hidden">教學</span>
             </button>
           </div>
        </div>

        <div className="max-w-7xl mx-auto pb-10">
          {activeTab === 'text2img' && renderText2Img()}
          {activeTab === 'sketch2img' && renderSketch2Img()}
          {activeTab === 'styleXfer' && renderStyleTransfer()}
          {activeTab === 'inpainting' && renderInpainting()}
          {activeTab === 'worksheet' && renderWorksheet()}
          {activeTab === 'poster' && renderPoster()}
          {activeTab === 'stickers' && renderLineSticker()}
        </div>
      </main>
    </div>
  );
}



```

## 🖼️ 理論參考圖片
![[image_5bd301-a2e77f6c827bfe5a.png]] ![[image_db3f9f-6b6329d1c4cb4e92.png]] [[New Note-d803819e815fe0e1]] (附件) ![[10093408293917864137-4c73aabdd108e0ae.png]] ![[Gemini_Generated_Image_8ggri88ggr-44a8442c4e958641.jpg]] ![[Gemini_Generated_Image_htsu2ahtsu-e11f6500ada5b266.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-96a4cef5cc1008b1.jpg]] ![[Gemini_Generated_Image_k0hcak0hca-be202b15b4d41e70.jpg]] ![[Gemini_Generated_Image_q59snqq59s-d7376f45389320a6.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-153057063c8c793c.jpg]] ![[Gemini_Generated_Image_ykv67oykv6-758609cfa28db9a7.jpg]] [[test-fd8b17b0ccc0b7c9.mp4]] (附件) ![[IMG20260405202251-d26edf580f6611b8.jpg]] ![[IMG_0016-1381311bbb20b6d0.jpg]] ![[IMG_0020-259844b3aec492b8.png]] ![[IMG_0021-259844b3aec492b8.png]] ![[IMG_0022-259844b3aec492b8.jpg]] ![[IMG_0024-259844b3aec492b8.jpg]] ![[IMG_0025-259844b3aec492b8.png]] ![[IMG_0025-63235577b267a9cf.png]] ![[2555777530681031145-d3ce890839589fae.png]]

## 🔗 相關理論與對話推薦
- [[2026-04-13_肯亞AA_完整版_530]] (共用特徵: `肯亞, ror, tp`)
- [[2026-04-13_請幫我更新提示詞，以將網頁中固定會出現的logo更正為下方logo連結：_https___drive.google.co_518]] (共用特徵: `肯亞, ror, tp`)
- [[2026-04-13_金成淬專屬提示詞_513]] (共用特徵: `肯亞, ror, tp`)
- [[肯亞AA_完整版]] (共用特徵: `肯亞, ror, tp`)
- [[金成淬專屬提示詞]] (共用特徵: `肯亞, ror, tp`)
