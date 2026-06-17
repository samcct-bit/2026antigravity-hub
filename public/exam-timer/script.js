// 考場專用計時器 JavaScript 邏輯

document.addEventListener("DOMContentLoaded", () => {
    // === DOM 元素獲取 ===
    const body = document.body;
    const currentDateEl = document.getElementById("current-date");
    const currentTimeEl = document.getElementById("current-time");
    
    const examSubjectDisplay = document.getElementById("exam-subject-display");
    const examTimeRangeDisplay = document.getElementById("exam-time-range-display");
    const countdownTimer = document.getElementById("countdown-timer");
    const progressBar = document.getElementById("progress-bar");
    const timerStatusMsg = document.getElementById("timer-status-msg");
    const headerInfo = document.querySelector(".header-info");
    
    // 注意事項相關
    const editableInstructions = document.getElementById("editable-instructions");
    const instructionsEditorActions = document.getElementById("instructions-editor-actions");
    const saveInstructionsBtn = document.getElementById("save-instructions-btn");
    const cancelInstructionsBtn = document.getElementById("cancel-instructions-btn");
    
    // 側邊欄控制與遮罩
    const configSidebar = document.getElementById("config-sidebar");
    const sidebarOverlay = document.getElementById("sidebar-overlay");
    const configToggleBtn = document.getElementById("config-toggle-btn");
    const configCloseBtn = document.getElementById("config-close-btn");
    
    // 設定表單欄位
    const presetButtons = document.querySelectorAll(".preset-btn");
    const customSubjectInputs = document.getElementById("custom-subject-inputs");
    const customSubjectNameInput = document.getElementById("custom-subject-name");
    const customDurationInput = document.getElementById("custom-duration");
    
    const timeModeRadios = document.getElementsByName("time-mode");
    const manualTimeInputs = document.getElementById("manual-time-inputs");
    const manualStartTimeInput = document.getElementById("manual-start-time");
    
    const soundFinishToggle = document.getElementById("sound-finish-toggle");
    const soundWarningToggle = document.getElementById("sound-warning-toggle");
    const themeToggle = document.getElementById("theme-toggle");
    
    // 控制按鈕
    const startBtn = document.getElementById("start-btn");
    const pauseBtn = document.getElementById("pause-btn");
    const resetBtn = document.getElementById("reset-btn");

    // === 狀態變數 ===
    let timerInterval = null;
    let clockUpdateInterval = null;
    let fadeTimeout = null;
    
    let isRunning = false;
    let isPaused = false;
    
    // 核心計時參數
    let selectedSubject = "國語";
    let examDurationMinutes = 80;
    let totalSeconds = 80 * 60;
    let secondsRemaining = 80 * 60;
    let startTimeMode = "auto-now"; // "auto-now" | "manual"
    let targetEndTimeStamp = null; // 當前倒數終點時間戳 (ms)
    let pauseRemainingMs = null;   // 暫停時剩餘的毫秒數
    let scheduledStartTime = null; // 手動指定的開始時間 (Date 對象)
    
    // 聲音警示觸發旗標 (防重複觸發)
    let warningSoundPlayed = false;
    let finishSoundPlayed = false;

    // === 預設與本地快取記憶功能 ===
    const defaultInstructions = `
        <ol>
            <li>下課鐘聲響起即停止作答，雙手離開桌面。</li>
            <li>試卷上請務必書寫班級、座號與姓名。</li>
            <li>考試期間嚴禁左顧右盼、低聲交談或攜帶穿戴式電子裝置。</li>
        </ol>
    `;

    // 初始化載入
    function init() {
        // 載入注意事項
        const savedInstructions = localStorage.getItem("exam_instructions_v2");
        if (savedInstructions) {
            editableInstructions.innerHTML = savedInstructions;
        } else {
            editableInstructions.innerHTML = defaultInstructions;
            localStorage.setItem("exam_instructions_v2", defaultInstructions);
        }

        // 載入主題設定
        const isDarkMode = localStorage.getItem("exam_theme_dark") === "true";
        themeToggle.checked = isDarkMode;
        if (isDarkMode) {
            body.className = "dark-theme";
        } else {
            body.className = "light-theme";
        }

        // 載入聲音設定
        const soundFinish = localStorage.getItem("exam_sound_finish");
        if (soundFinish !== null) {
            soundFinishToggle.checked = soundFinish === "true";
        }
        const soundWarning = localStorage.getItem("exam_sound_warning");
        if (soundWarning !== null) {
            soundWarningToggle.checked = soundWarning === "true";
        }

        // 初始化日期與本機即時時鐘
        updateLiveClock();
        clockUpdateInterval = setInterval(updateLiveClock, 1000);

        // 設置手動開始時間為當前時間的 5 分鐘後，方便使用者快速調整
        const now = new Date();
        now.setMinutes(now.getMinutes() + 5);
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        manualStartTimeInput.value = `${hours}:${minutes}`;

        // 首次更新計時器靜態顯示
        updateTimerDisplay();
        updateTimeRangeDisplay();

        // 啟動滑鼠移動淡出控制欄功能
        setupFadeControls();
    }

    // === 即時時鐘與日期更新 ===
    function updateLiveClock() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const date = now.getDate();
        const dayNames = ["日", "一", "二", "三", "四", "五", "六"];
        const day = dayNames[now.getDay()];
        
        currentDateEl.textContent = `${year} 年 ${month} 月 ${date} 日 (星期${day})`;
        
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        currentTimeEl.textContent = `${hours}:${minutes}:${seconds}`;

        // 若是處於手動排程模式且尚未開始，每秒檢查是否到達開始時間
        if (isRunning && startTimeMode === "manual" && scheduledStartTime) {
            if (Date.now() >= scheduledStartTime.getTime() && !targetEndTimeStamp) {
                // 時間到，正式切換為倒數狀態
                const durationMs = examDurationMinutes * 60 * 1000;
                targetEndTimeStamp = Date.now() + durationMs;
                timerStatusMsg.textContent = "";
                playBellSound(false); // 播放開考鐘聲
                updateTimeRangeDisplay();
            }
        }
    }

    // === 音效生成 (Web Audio API) ===
    function playBellSound(isWarning) {
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            const audioCtx = new AudioContextClass();
            
            // 警示音（低頻雙音），結束音（經典四聲和弦鐘聲）
            const frequencies = isWarning ? [392, 494] : [523, 659, 784, 1046];
            const duration = isWarning ? 0.8 : 2.5;
            const now = audioCtx.currentTime;

            frequencies.forEach((freq, index) => {
                const osc = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                
                osc.type = 'sine';
                // 稍微加入隨機偏音量以模擬真實銅鐘金屬泛音
                osc.frequency.setValueAtTime(freq + (index * 1.5), now);
                
                // 聲音漸強再淡出
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(0.15 / frequencies.length, now + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
                
                osc.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                
                osc.start(now);
                osc.stop(now + duration);
            });
        } catch (e) {
            console.warn("無法初始化 Web Audio API 播音:", e);
        }
    }

    // === 倒數計時核心邏輯 ===
    function updateTimerDisplay() {
        const hrs = Math.floor(secondsRemaining / 3600);
        const mins = Math.floor((secondsRemaining % 3600) / 60);
        const secs = secondsRemaining % 60;

        let displayStr = "";
        if (hrs > 0) {
            displayStr = `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
        } else {
            displayStr = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
        }
        
        countdownTimer.textContent = displayStr;

        // 進度條更新
        const percent = totalSeconds > 0 ? ((totalSeconds - secondsRemaining) / totalSeconds) * 100 : 0;
        progressBar.style.width = `${percent}%`;

        // 倒數 5 分鐘警示處理
        if (secondsRemaining <= 300 && secondsRemaining > 0) {
            countdownTimer.classList.add("danger");
            progressBar.classList.add("danger");
            
            // 提醒 5 分鐘警示音
            if (soundWarningToggle.checked && !warningSoundPlayed && isRunning && startTimeMode !== "manual" || (startTimeMode === "manual" && targetEndTimeStamp)) {
                playBellSound(true);
                warningSoundPlayed = true;
            }
        } else {
            countdownTimer.classList.remove("danger");
            progressBar.classList.remove("danger");
        }
    }

    function updateTimeRangeDisplay() {
        if (startTimeMode === "auto-now") {
            if (isRunning && targetEndTimeStamp) {
                const start = new Date(targetEndTimeStamp - examDurationMinutes * 60 * 1000);
                const end = new Date(targetEndTimeStamp);
                examTimeRangeDisplay.textContent = `考試時間：${formatTime(start)} ~ ${formatTime(end)}`;
            } else {
                examTimeRangeDisplay.textContent = `預估長度：${examDurationMinutes} 分鐘`;
            }
        } else {
            // 手動排程模式
            if (scheduledStartTime) {
                const start = scheduledStartTime;
                const end = new Date(start.getTime() + examDurationMinutes * 60 * 1000);
                examTimeRangeDisplay.textContent = `考試時間：${formatTime(start)} ~ ${formatTime(end)}`;
            } else {
                examTimeRangeDisplay.textContent = `排程長度：${examDurationMinutes} 分鐘`;
            }
        }
    }

    function formatTime(date) {
        return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    }

    // 倒數更新循環
    function runTimerLoop() {
        if (!isRunning || isPaused) return;

        if (startTimeMode === "manual" && !targetEndTimeStamp) {
            // 還沒到開考時間，僅更新靜態等待文字
            const msToStart = scheduledStartTime.getTime() - Date.now();
            if (msToStart > 0) {
                const diffSecs = Math.ceil(msToStart / 1000);
                const waitMins = Math.floor(diffSecs / 60);
                const waitSecs = diffSecs % 60;
                timerStatusMsg.textContent = `等待開考：距離開考還有 ${waitMins}分${waitSecs}秒`;
                secondsRemaining = examDurationMinutes * 60;
                updateTimerDisplay();
                return;
            }
        }

        // 計算絕對時間剩餘秒數，防止瀏覽器後台降頻時差
        const nowMs = Date.now();
        const diffMs = targetEndTimeStamp - nowMs;

        if (diffMs <= 0) {
            // 時間終了
            secondsRemaining = 0;
            updateTimerDisplay();
            timerEnd();
        } else {
            secondsRemaining = Math.ceil(diffMs / 1000);
            updateTimerDisplay();
        }
    }

    function timerEnd() {
        isRunning = false;
        clearInterval(timerInterval);
        timerInterval = null;
        
        timerStatusMsg.textContent = "⌛ 考試結束，請停止作答！";
        progressBar.style.width = "100%";
        
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = false;

        // 播放終點鐘聲
        if (soundFinishToggle.checked && !finishSoundPlayed) {
            playBellSound(false);
            finishSoundPlayed = true;
        }

        // 喚醒控制列
        showControls();
    }

    // === 事件綁定與操作控制 ===

    // 開始按鈕
    startBtn.addEventListener("click", () => {
        if (isRunning) return;

        // 獲取科目與時間設定
        const activePreset = document.querySelector(".preset-btn.active");
        selectedSubject = activePreset.dataset.subject;
        if (selectedSubject === "自訂") {
            selectedSubject = customSubjectNameInput.value.trim() || "自訂科目";
            examDurationMinutes = parseInt(customDurationInput.value, 10) || 40;
        } else {
            examDurationMinutes = parseInt(activePreset.dataset.duration, 10);
        }

        examSubjectDisplay.textContent = selectedSubject;
        totalSeconds = examDurationMinutes * 60;
        secondsRemaining = totalSeconds;
        
        // 取得起訖時間設定模式
        const selectedModeRadio = document.querySelector('input[name="time-mode"]:checked');
        startTimeMode = selectedModeRadio.value;

        // 重置音效標記
        warningSoundPlayed = false;
        finishSoundPlayed = false;
        timerStatusMsg.textContent = "";

        if (startTimeMode === "auto-now") {
            // 立即開始
            const durationMs = examDurationMinutes * 60 * 1000;
            targetEndTimeStamp = Date.now() + durationMs;
            scheduledStartTime = null;
        } else {
            // 手動指定時間
            const timeVal = manualStartTimeInput.value;
            if (!timeVal) {
                alert("請指定有效的考試開始時間！");
                return;
            }
            const [hours, minutes] = timeVal.split(":").map(Number);
            const start = new Date();
            start.setHours(hours, minutes, 0, 0);
            
            const durationMs = examDurationMinutes * 60 * 1000;
            let endTimeMs = start.getTime() + durationMs;
            
            // 如果考試結束時間小於當前時間，說明該時段已過去，判定為排程明天同時間
            if (endTimeMs < Date.now()) {
                start.setDate(start.getDate() + 1);
                endTimeMs = start.getTime() + durationMs;
            }
            
            scheduledStartTime = start;
            
            if (Date.now() < start.getTime()) {
                // 還沒開始，等待開考
                targetEndTimeStamp = null;
                secondsRemaining = examDurationMinutes * 60;
            } else {
                // 已經在考試時間內 (start <= now < endTimeMs)
                targetEndTimeStamp = endTimeMs;
                secondsRemaining = Math.max(0, Math.ceil((endTimeMs - Date.now()) / 1000));
            }
        }

        isRunning = true;
        isPaused = false;
        
        updateTimeRangeDisplay();
        updateTimerDisplay();

        startBtn.disabled = true;
        pauseBtn.disabled = false;
        resetBtn.disabled = false;

        // 開啟計時循環
        timerInterval = setInterval(runTimerLoop, 200);

        // 關閉側邊欄並引導全螢幕極簡狀態
        closeSidebar();
        
        // 淡出控制項
        hideControlsDelayed();
    });

    // 暫停按鈕
    pauseBtn.addEventListener("click", () => {
        if (!isRunning) return;

        if (!isPaused) {
            // 暫停
            isPaused = true;
            pauseBtn.textContent = "恢復";
            timerStatusMsg.textContent = "⏸️ 倒數計時已暫停";
            
            if (startTimeMode === "auto-now" || targetEndTimeStamp) {
                pauseRemainingMs = targetEndTimeStamp - Date.now();
            }
            
            showControls();
        } else {
            // 恢復
            isPaused = false;
            pauseBtn.textContent = "暫停";
            timerStatusMsg.textContent = "";
            
            if (startTimeMode === "auto-now" || targetEndTimeStamp) {
                targetEndTimeStamp = Date.now() + pauseRemainingMs;
            }
            
            hideControlsDelayed();
        }
    });

    // 重置按鈕
    resetBtn.addEventListener("click", () => {
        if (!confirm("確定要重置計時器嗎？這將會清除當前倒數狀態。")) return;

        isRunning = false;
        isPaused = false;
        clearInterval(timerInterval);
        timerInterval = null;
        
        targetEndTimeStamp = null;
        scheduledStartTime = null;
        pauseRemainingMs = null;
        
        secondsRemaining = examDurationMinutes * 60;
        timerStatusMsg.textContent = "";
        pauseBtn.textContent = "暫停";
        
        updateTimerDisplay();
        updateTimeRangeDisplay();

        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = false;

        showControls();
    });

    // === 科目預設切換 ===
    presetButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            presetButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const subj = btn.dataset.subject;
            if (subj === "自訂") {
                customSubjectInputs.classList.remove("hidden");
            } else {
                customSubjectInputs.classList.add("hidden");
                examDurationMinutes = parseInt(btn.dataset.duration, 10);
                secondsRemaining = examDurationMinutes * 60;
                updateTimerDisplay();
                updateTimeRangeDisplay();
            }
        });
    });

    // 時間模式單選鈕切換
    timeModeRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            if (radio.value === "manual") {
                manualTimeInputs.classList.remove("hidden");
            } else {
                manualTimeInputs.classList.add("hidden");
            }
            startTimeMode = radio.value;
            updateTimeRangeDisplay();
        });
    });

    // === 注意事項編輯功能 ===
    editableInstructions.addEventListener("dblclick", () => {
        if (isRunning) {
            // 考試中防止點擊編輯
            return;
        }
        editableInstructions.contentEditable = "true";
        editableInstructions.focus();
        instructionsEditorActions.classList.remove("hidden");
    });

    saveInstructionsBtn.addEventListener("click", () => {
        editableInstructions.contentEditable = "false";
        instructionsEditorActions.classList.add("hidden");
        localStorage.setItem("exam_instructions_v2", editableInstructions.innerHTML);
    });

    cancelInstructionsBtn.addEventListener("click", () => {
        editableInstructions.contentEditable = "false";
        instructionsEditorActions.classList.add("hidden");
        const savedInstructions = localStorage.getItem("exam_instructions_v2");
        if (savedInstructions) {
            editableInstructions.innerHTML = savedInstructions;
        }
    });

    // === 側邊欄控制 ===
    function openSidebar() {
        configSidebar.classList.add("open");
        sidebarOverlay.classList.remove("hidden");
    }

    function closeSidebar() {
        configSidebar.classList.remove("open");
        sidebarOverlay.classList.add("hidden");
    }

    configToggleBtn.addEventListener("click", openSidebar);
    configCloseBtn.addEventListener("click", closeSidebar);
    sidebarOverlay.addEventListener("click", closeSidebar);

    // === 偏好與設定儲存 ===
    themeToggle.addEventListener("change", () => {
        const isDark = themeToggle.checked;
        localStorage.setItem("exam_theme_dark", isDark);
        if (isDark) {
            body.className = "dark-theme";
        } else {
            body.className = "light-theme";
        }
    });

    soundFinishToggle.addEventListener("change", () => {
        localStorage.setItem("exam_sound_finish", soundFinishToggle.checked);
    });

    soundWarningToggle.addEventListener("change", () => {
        localStorage.setItem("exam_sound_warning", soundWarningToggle.checked);
    });

    // === 滑鼠靜止淡出控制項機制 ===
    function setupFadeControls() {
        const resetFadeTimeout = () => {
            showControls();
            if (isRunning && !isPaused) {
                hideControlsDelayed();
            }
        };

        // 滑鼠移動、點擊或觸控時顯示控制列
        document.addEventListener("mousemove", resetFadeTimeout);
        document.addEventListener("mousedown", resetFadeTimeout);
        document.addEventListener("keydown", resetFadeTimeout);
        document.addEventListener("touchstart", resetFadeTimeout);
    }

    function showControls() {
        if (fadeTimeout) clearTimeout(fadeTimeout);
        headerInfo.classList.remove("fade-out");
        headerInfo.classList.add("fade-in");
    }

    function hideControlsDelayed() {
        if (fadeTimeout) clearTimeout(fadeTimeout);
        fadeTimeout = setTimeout(() => {
            // 只有在執行中且未暫停時才隱藏
            if (isRunning && !isPaused) {
                headerInfo.classList.remove("fade-in");
                headerInfo.classList.add("fade-out");
            }
        }, 3500); // 3.5秒無操作自動淡出
    }

    // 啟動初始化
    init();
});
