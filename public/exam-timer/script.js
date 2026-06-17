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
    const subjectPresetGroup = document.getElementById("subject-preset-group");
    const customSubjectInputs = document.getElementById("custom-subject-inputs");
    const customSubjectNameInput = document.getElementById("custom-subject-name");
    const customDurationInput = document.getElementById("custom-duration");
    
    const timeModeRadios = document.getElementsByName("time-mode");
    const manualTimeInputs = document.getElementById("manual-time-inputs");
    const manualStartTimeInput = document.getElementById("manual-start-time");
    
    // 多堂排程設定欄位
    const dailyScheduleInputs = document.getElementById("daily-schedule-inputs");
    const dailyScheduleList = document.getElementById("daily-schedule-list");
    
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
    
    // 核心計時參數 (單堂模式)
    let selectedSubject = "國語";
    let examDurationMinutes = 80;
    let totalSeconds = 80 * 60;
    let secondsRemaining = 80 * 60;
    let startTimeMode = "auto-now"; // "auto-now" | "manual" | "daily-schedule"
    let targetEndTimeStamp = null; // 當前倒數終點時間戳 (ms)
    let pauseRemainingMs = null;   // 暫停時剩餘的毫秒數
    let scheduledStartTime = null; // 手動指定的開始時間 (Date 對象)
    
    // 今日多堂排程參數
    let dailyClasses = [];
    let lastPhase = ""; // 用於排程模式下偵測狀態轉換來播放開考/結束鐘聲
    
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

        // 載入多堂排程設定
        for (let i = 1; i <= 3; i++) {
            const active = localStorage.getItem(`exam_class_active_v2_${i}`) !== "false"; // 預設為 true
            const subj = localStorage.getItem(`exam_class_subj_v2_${i}`) || (i === 1 ? "國語" : i === 2 ? "自然" : "英語");
            const start = localStorage.getItem(`exam_class_start_v2_${i}`) || (i === 1 ? "08:30" : i === 2 ? "09:30" : "10:30");
            const end = localStorage.getItem(`exam_class_end_v2_${i}`) || (i === 1 ? "09:20" : i === 2 ? "10:10" : "11:10");
            
            document.getElementById(`class-active-${i}`).checked = active;
            document.getElementById(`class-subj-${i}`).value = subj;
            document.getElementById(`class-start-${i}`).value = start;
            document.getElementById(`class-end-${i}`).value = end;
        }

        // 載入時間模式設定
        const savedTimeMode = localStorage.getItem("exam_time_mode");
        if (savedTimeMode) {
            const radio = Array.from(timeModeRadios).find(r => r.value === savedTimeMode);
            if (radio) {
                radio.checked = true;
                startTimeMode = savedTimeMode;
            }
        }
        
        // 執行一次模式切換 UI 調整
        handleTimeModeChange(startTimeMode);

        // 初始化日期與本機即時時鐘
        updateLiveClock();
        clockUpdateInterval = setInterval(updateLiveClock, 1000);

        // 設置單堂手動開始時間為當前時間的 5 分鐘後
        const now = new Date();
        now.setMinutes(now.getMinutes() + 5);
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        manualStartTimeInput.value = `${hours}:${minutes}`;

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

        // 若是處於手動排程模式且尚未開始，每秒檢查是否到達開始時間 (單堂模式)
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

        // 進度條更新 (單堂)
        if (startTimeMode !== "daily-schedule") {
            const percent = totalSeconds > 0 ? ((totalSeconds - secondsRemaining) / totalSeconds) * 100 : 0;
            progressBar.style.width = `${percent}%`;

            // 倒數 5 分鐘警示處理
            if (secondsRemaining <= 300 && secondsRemaining > 0) {
                countdownTimer.classList.add("danger");
                progressBar.classList.add("danger");
                
                // 提醒 5 分鐘警示音
                if (soundWarningToggle.checked && !warningSoundPlayed && isRunning && (startTimeMode === "auto-now" || targetEndTimeStamp)) {
                    playBellSound(true);
                    warningSoundPlayed = true;
                }
            } else {
                countdownTimer.classList.remove("danger");
                progressBar.classList.remove("danger");
            }
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
        } else if (startTimeMode === "manual") {
            // 手動排程模式 (單堂)
            if (scheduledStartTime) {
                const start = scheduledStartTime;
                const end = new Date(start.getTime() + examDurationMinutes * 60 * 1000);
                examTimeRangeDisplay.textContent = `考試時間：${formatTime(start)} ~ ${formatTime(end)}`;
            } else {
                examTimeRangeDisplay.textContent = `排程長度：${examDurationMinutes} 分鐘`;
            }
        } else {
            // 多堂排程模式下，起訖時間由倒數更新循環自動處理
            examTimeRangeDisplay.textContent = "今日多堂考試自動倒數模式";
        }
    }

    function formatTime(date) {
        return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    }

    // 倒數更新循環
    function runTimerLoop() {
        if (!isRunning || isPaused) return;

        if (startTimeMode === "daily-schedule") {
            runDailyScheduleLoop();
            return;
        }

        if (startTimeMode === "manual" && !targetEndTimeStamp) {
            // 還沒到開考時間，僅更新靜態等待文字 (單堂模式)
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

        // 計算絕對時間剩餘秒數，防止瀏覽器後台降頻時差 (單堂模式)
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

    // === 今日多堂排程計時邏輯 ===
    function runDailyScheduleLoop() {
        const nowMs = Date.now();
        
        // 1. 解析所有啟用的考程時間點（轉為今日的 Date 對象）
        const scheduleDates = dailyClasses.map((item, index) => {
            if (!item.active) return null;
            
            const [sh, sm] = item.start.split(":").map(Number);
            const [eh, em] = item.end.split(":").map(Number);
            
            const startDate = new Date();
            startDate.setHours(sh, sm, 0, 0);
            
            const endDate = new Date();
            endDate.setHours(eh, em, 0, 0);
            
            return {
                index: index,
                subject: item.subject,
                startMs: startDate.getTime(),
                endMs: endDate.getTime(),
                durationMs: endDate.getTime() - startDate.getTime()
            };
        }).filter(Boolean);

        if (scheduleDates.length === 0) {
            timerStatusMsg.textContent = "❌ 未啟用任何考試節次，請至設定中勾選。";
            isRunning = false;
            clearInterval(timerInterval);
            timerInterval = null;
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            return;
        }

        // 排序排程（依開始時間）
        scheduleDates.sort((a, b) => a.startMs - b.startMs);

        // 2. 判定當前時間所處的階段
        let currentPhase = ""; // "waiting-first" | "class-running" | "break-running" | "ended"
        let activeIndex = -1;  // 處於排序後考程清單中的哪一節
        let targetMs = 0;
        let activeSubject = "";
        let timeRangeText = "";
        let classDurationSecs = 0;

        const firstClass = scheduleDates[0];
        const lastClass = scheduleDates[scheduleDates.length - 1];

        if (nowMs < firstClass.startMs) {
            currentPhase = "waiting-first";
            targetMs = firstClass.startMs;
            activeSubject = firstClass.subject;
            timeRangeText = `下一節考程：${formatTime(new Date(firstClass.startMs))} ~ ${formatTime(new Date(firstClass.endMs))}`;
        } else if (nowMs >= lastClass.endMs) {
            currentPhase = "ended";
            targetMs = lastClass.endMs;
        } else {
            // 尋找進行中或休息中的時段
            for (let i = 0; i < scheduleDates.length; i++) {
                const c = scheduleDates[i];
                if (nowMs >= c.startMs && nowMs < c.endMs) {
                    currentPhase = "class-running";
                    activeIndex = i;
                    targetMs = c.endMs;
                    activeSubject = c.subject;
                    timeRangeText = `考試時間：${formatTime(new Date(c.startMs))} ~ ${formatTime(new Date(c.endMs))}`;
                    classDurationSecs = Math.round(c.durationMs / 1000);
                    break;
                }
                
                // 檢查是否是兩節課之間的下課
                if (i < scheduleDates.length - 1) {
                    const nextC = scheduleDates[i + 1];
                    if (nowMs >= c.endMs && nowMs < nextC.startMs) {
                        currentPhase = "break-running";
                        activeIndex = i;
                        targetMs = nextC.startMs;
                        activeSubject = "下課休息";
                        timeRangeText = `休息時間：${formatTime(new Date(c.endMs))} ~ ${formatTime(new Date(nextC.startMs))}`;
                        classDurationSecs = Math.round((nextC.startMs - c.endMs) / 1000);
                        break;
                    }
                }
            }
        }

        // 3. 處理狀態轉變並播放鐘聲
        if (currentPhase !== lastPhase) {
            warningSoundPlayed = false;
            
            // 只有當差距小於 10 秒時，才播放提示音，避免載入或中途啟動時誤鳴
            if (currentPhase === "class-running") {
                const activeClassDate = scheduleDates[activeIndex];
                if (Math.abs(nowMs - activeClassDate.startMs) < 10000) {
                    playBellSound(false); // 播放開考鐘聲
                }
            } else if (currentPhase === "break-running") {
                const prevClassDate = scheduleDates[activeIndex];
                if (Math.abs(nowMs - prevClassDate.endMs) < 10000) {
                    playBellSound(false); // 播放下課鐘聲
                }
            } else if (currentPhase === "ended") {
                if (Math.abs(nowMs - lastClass.endMs) < 10000) {
                    playBellSound(false); // 播放最後收考鐘聲
                }
            }
            
            lastPhase = currentPhase;
            
            // 更新狀態列的高亮顯示
            renderDailyScheduleList(scheduleDates, currentPhase, activeIndex);
        }

        // 4. 更新 UI 顯示
        if (currentPhase === "waiting-first") {
            examSubjectDisplay.textContent = activeSubject;
            examTimeRangeDisplay.textContent = timeRangeText;
            
            const diffSecs = Math.max(0, Math.ceil((targetMs - nowMs) / 1000));
            const mins = Math.floor(diffSecs / 60);
            const secs = diffSecs % 60;
            countdownTimer.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
            timerStatusMsg.textContent = `⏳ 等待第一節考試開始`;
            progressBar.style.width = "0%";
            countdownTimer.classList.remove("danger");
            progressBar.classList.remove("danger");
        } 
        else if (currentPhase === "class-running") {
            examSubjectDisplay.textContent = activeSubject;
            examTimeRangeDisplay.textContent = timeRangeText;
            
            const diffSecs = Math.max(0, Math.ceil((targetMs - nowMs) / 1000));
            const mins = Math.floor(diffSecs / 60);
            const secs = diffSecs % 60;
            countdownTimer.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
            timerStatusMsg.textContent = "";

            // 更新進度條
            const elapsed = classDurationSecs - diffSecs;
            const percent = classDurationSecs > 0 ? (elapsed / classDurationSecs) * 100 : 0;
            progressBar.style.width = `${percent}%`;

            // 5分鐘警示音效
            if (diffSecs <= 300 && diffSecs > 0) {
                countdownTimer.classList.add("danger");
                progressBar.classList.add("danger");
                
                if (soundWarningToggle.checked && !warningSoundPlayed) {
                    playBellSound(true); // 播放警示
                    warningSoundPlayed = true;
                }
            } else {
                countdownTimer.classList.remove("danger");
                progressBar.classList.remove("danger");
            }
        } 
        else if (currentPhase === "break-running") {
            examSubjectDisplay.textContent = "下課休息";
            examTimeRangeDisplay.textContent = timeRangeText;
            
            const diffSecs = Math.max(0, Math.ceil((targetMs - nowMs) / 1000));
            const mins = Math.floor(diffSecs / 60);
            const secs = diffSecs % 60;
            countdownTimer.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
            
            const nextClass = scheduleDates[activeIndex + 1];
            timerStatusMsg.textContent = `⏳ 下課休息中，距離下一節【${nextClass.subject}】開考還有 ${mins} 分 ${secs} 秒`;
            
            // 休息進度條
            const elapsed = classDurationSecs - diffSecs;
            const percent = classDurationSecs > 0 ? (elapsed / classDurationSecs) * 100 : 0;
            progressBar.style.width = `${percent}%`;
            
            countdownTimer.classList.remove("danger");
            progressBar.classList.remove("danger");
        } 
        else if (currentPhase === "ended") {
            examSubjectDisplay.textContent = "今日考程結束";
            examTimeRangeDisplay.textContent = "今日考試已全部結束";
            countdownTimer.textContent = "00:00";
            timerStatusMsg.textContent = "⌛ 今日考試全部結束！";
            progressBar.style.width = "100%";
            countdownTimer.classList.remove("danger");
            progressBar.classList.remove("danger");
            
            isRunning = false;
            clearInterval(timerInterval);
            timerInterval = null;
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            resetBtn.disabled = false;
            
            showControls();
        }
    }

    // 渲染今日考程進度狀態列到主畫面
    function renderDailyScheduleList(scheduleDates, currentPhase, activeIndex) {
        dailyScheduleList.innerHTML = "";
        
        scheduleDates.forEach((c, index) => {
            const itemEl = document.createElement("div");
            itemEl.className = "schedule-item";
            
            const numIcons = ["➊", "➋", "➌", "➍", "➎"];
            const icon = numIcons[index] || `➏`;
            
            const startHourMin = formatTime(new Date(c.startMs));
            const endHourMin = formatTime(new Date(c.endMs));
            
            itemEl.textContent = `${icon} ${c.subject} (${startHourMin}~${endHourMin})`;
            
            // 根據排程進度動態配置樣式
            if (currentPhase === "waiting-first") {
                itemEl.classList.add("upcoming");
            } else if (currentPhase === "class-running") {
                if (index === activeIndex) {
                    itemEl.classList.add("active");
                } else if (index < activeIndex) {
                    itemEl.classList.add("completed");
                } else {
                    itemEl.classList.add("upcoming");
                }
            } else if (currentPhase === "break-running") {
                if (index === activeIndex) {
                    itemEl.classList.add("completed");
                } else if (index === activeIndex + 1) {
                    itemEl.classList.add("active", "break"); // 高亮提示下一節即將開考
                } else if (index < activeIndex) {
                    itemEl.classList.add("completed");
                } else {
                    itemEl.classList.add("upcoming");
                }
            } else if (currentPhase === "ended") {
                itemEl.classList.add("completed");
            }
            
            dailyScheduleList.appendChild(itemEl);
        });
    }

    // 側邊欄變更多堂設定時，動態更新主畫面排程預覽
    function updateDailySchedulePreview() {
        const previewClasses = [];
        for (let i = 1; i <= 3; i++) {
            const active = document.getElementById(`class-active-${i}`).checked;
            const subject = document.getElementById(`class-subj-${i}`).value.trim() || `第${i}節`;
            const start = document.getElementById(`class-start-${i}`).value;
            const end = document.getElementById(`class-end-${i}`).value;
            
            if (active) {
                const [sh, sm] = start.split(":").map(Number);
                const [eh, em] = end.split(":").map(Number);
                const startDate = new Date();
                startDate.setHours(sh, sm, 0, 0);
                const endDate = new Date();
                endDate.setHours(eh, em, 0, 0);
                
                previewClasses.push({
                    subject: subject,
                    startMs: startDate.getTime(),
                    endMs: endDate.getTime(),
                    start: start,
                    end: end
                });
            }
        }
        
        previewClasses.sort((a, b) => a.startMs - b.startMs);
        
        dailyScheduleList.innerHTML = "";
        if (previewClasses.length > 0) {
            dailyScheduleList.classList.remove("hidden");
            previewClasses.forEach((c, index) => {
                const itemEl = document.createElement("div");
                itemEl.className = "schedule-item upcoming";
                const numIcons = ["➊", "➋", "➌", "➍", "➎"];
                const icon = numIcons[index] || `➏`;
                itemEl.textContent = `${icon} ${c.subject} (${c.start}~${c.end})`;
                dailyScheduleList.appendChild(itemEl);
            });
        } else {
            dailyScheduleList.classList.add("hidden");
        }
    }

    // === 事件綁定與操作控制 ===

    // 開始按鈕
    startBtn.addEventListener("click", () => {
        if (isRunning) return;

        // 取得起訖時間設定模式
        const selectedModeRadio = document.querySelector('input[name="time-mode"]:checked');
        startTimeMode = selectedModeRadio.value;
        localStorage.setItem("exam_time_mode", startTimeMode);

        warningSoundPlayed = false;
        finishSoundPlayed = false;
        timerStatusMsg.textContent = "";
        lastPhase = ""; // 重置排程階段偵測

        if (startTimeMode === "daily-schedule") {
            // 今日多堂考程模式
            dailyClasses = [];
            for (let i = 1; i <= 3; i++) {
                const active = document.getElementById(`class-active-${i}`).checked;
                const subject = document.getElementById(`class-subj-${i}`).value.trim() || `第${i}節`;
                const start = document.getElementById(`class-start-${i}`).value;
                const end = document.getElementById(`class-end-${i}`).value;
                
                dailyClasses.push({ active, subject, start, end });
                
                // 本地快取儲存，方便下次使用
                localStorage.setItem(`exam_class_active_v2_${i}`, active);
                localStorage.setItem(`exam_class_subj_v2_${i}`, subject);
                localStorage.setItem(`exam_class_start_v2_${i}`, start);
                localStorage.setItem(`exam_class_end_v2_${i}`, end);
            }
            
            // 初次手動渲染預覽
            const activeDates = dailyClasses.map((item, index) => {
                if (!item.active) return null;
                const [sh, sm] = item.start.split(":").map(Number);
                const [eh, em] = item.end.split(":").map(Number);
                const startDate = new Date();
                startDate.setHours(sh, sm, 0, 0);
                const endDate = new Date();
                endDate.setHours(eh, em, 0, 0);
                return {
                    index,
                    subject: item.subject,
                    startMs: startDate.getTime(),
                    endMs: endDate.getTime()
                };
            }).filter(Boolean).sort((a, b) => a.startMs - b.startMs);
            
            renderDailyScheduleList(activeDates, "waiting-first", -1);
            dailyScheduleList.classList.remove("hidden");
            
            // 清理單堂時間範圍字樣
            examTimeRangeDisplay.textContent = "今日多堂考試自動倒數模式";
        }
        else {
            // 單堂考試模式
            dailyScheduleList.classList.add("hidden");
            
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
            
            updateTimeRangeDisplay();
            updateTimerDisplay();
        }

        isRunning = true;
        isPaused = false;

        startBtn.disabled = true;
        pauseBtn.disabled = false;
        resetBtn.disabled = false;

        // 啟動主計時更新循環
        timerInterval = setInterval(runTimerLoop, 200);

        // 關閉設定側邊欄
        closeSidebar();
        
        // 倒數計時期間自動淡出頂部控制面板
        hideControlsDelayed();
    });

    // 暫停按鈕
    pauseBtn.addEventListener("click", () => {
        if (!isRunning) return;

        if (!isPaused) {
            isPaused = true;
            pauseBtn.textContent = "恢復";
            timerStatusMsg.textContent = "⏸️ 倒數計時已暫停";
            
            if (startTimeMode !== "daily-schedule") {
                if (startTimeMode === "auto-now" || targetEndTimeStamp) {
                    pauseRemainingMs = targetEndTimeStamp - Date.now();
                }
            }
            showControls();
        } else {
            isPaused = false;
            pauseBtn.textContent = "暫停";
            timerStatusMsg.textContent = "";
            
            if (startTimeMode !== "daily-schedule") {
                if (startTimeMode === "auto-now" || targetEndTimeStamp) {
                    targetEndTimeStamp = Date.now() + pauseRemainingMs;
                }
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
        lastPhase = "";
        
        if (startTimeMode !== "daily-schedule") {
            secondsRemaining = examDurationMinutes * 60;
            updateTimerDisplay();
            updateTimeRangeDisplay();
        } else {
            // 排程模式重置回預覽狀態
            updateDailySchedulePreview();
            examSubjectDisplay.textContent = "多堂排程";
            examTimeRangeDisplay.textContent = "今日多堂考試自動倒數模式";
            countdownTimer.textContent = "--:--";
            progressBar.style.width = "0%";
        }
        
        timerStatusMsg.textContent = "";
        pauseBtn.textContent = "暫停";
        
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = false;

        showControls();
    });

    // === 時間設定模式切換 UI 反應 ===
    function handleTimeModeChange(mode) {
        if (mode === "daily-schedule") {
            subjectPresetGroup.classList.add("hidden");
            customSubjectInputs.classList.add("hidden");
            manualTimeInputs.classList.add("hidden");
            dailyScheduleInputs.classList.remove("hidden");
            
            examSubjectDisplay.textContent = "多堂排程";
            examTimeRangeDisplay.textContent = "今日多堂考試自動倒數模式";
            countdownTimer.textContent = "--:--";
            progressBar.style.width = "0%";
            
            updateDailySchedulePreview();
        } else {
            subjectPresetGroup.classList.remove("hidden");
            dailyScheduleInputs.classList.add("hidden");
            dailyScheduleList.classList.add("hidden");
            
            const activePreset = document.querySelector(".preset-btn.active");
            if (activePreset) {
                const subj = activePreset.dataset.subject;
                if (subj === "自訂") {
                    customSubjectInputs.classList.remove("hidden");
                    examSubjectDisplay.textContent = customSubjectNameInput.value.trim() || "自訂科目";
                    examDurationMinutes = parseInt(customDurationInput.value, 10) || 40;
                } else {
                    customSubjectInputs.classList.add("hidden");
                    examSubjectDisplay.textContent = subj;
                    examDurationMinutes = parseInt(activePreset.dataset.duration, 10);
                }
            }
            
            if (mode === "manual") {
                manualTimeInputs.classList.remove("hidden");
            } else {
                manualTimeInputs.classList.add("hidden");
            }
            
            secondsRemaining = examDurationMinutes * 60;
            updateTimerDisplay();
            updateTimeRangeDisplay();
        }
    }

    timeModeRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            startTimeMode = radio.value;
            localStorage.setItem("exam_time_mode", startTimeMode);
            handleTimeModeChange(startTimeMode);
        });
    });

    // 快速預設科目按鈕切換
    presetButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            presetButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const subj = btn.dataset.subject;
            if (subj === "自訂") {
                customSubjectInputs.classList.remove("hidden");
                examSubjectDisplay.textContent = customSubjectNameInput.value.trim() || "自訂科目";
                examDurationMinutes = parseInt(customDurationInput.value, 10) || 40;
            } else {
                customSubjectInputs.classList.add("hidden");
                examSubjectDisplay.textContent = subj;
                examDurationMinutes = parseInt(btn.dataset.duration, 10);
            }
            secondsRemaining = examDurationMinutes * 60;
            updateTimerDisplay();
            updateTimeRangeDisplay();
        });
    });

    // 自訂科目文字輸入聯動
    customSubjectNameInput.addEventListener("input", () => {
        if (startTimeMode !== "daily-schedule") {
            examSubjectDisplay.textContent = customSubjectNameInput.value.trim() || "自訂科目";
        }
    });

    customDurationInput.addEventListener("input", () => {
        if (startTimeMode !== "daily-schedule") {
            examDurationMinutes = parseInt(customDurationInput.value, 10) || 40;
            secondsRemaining = examDurationMinutes * 60;
            updateTimerDisplay();
            updateTimeRangeDisplay();
        }
    });

    // 綁定排程輸入即時變更事件 (聯動主畫面預覽)
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`class-active-${i}`).addEventListener("change", () => {
            if (startTimeMode === "daily-schedule") updateDailySchedulePreview();
        });
        document.getElementById(`class-subj-${i}`).addEventListener("input", () => {
            if (startTimeMode === "daily-schedule") updateDailySchedulePreview();
        });
        document.getElementById(`class-start-${i}`).addEventListener("change", () => {
            if (startTimeMode === "daily-schedule") updateDailySchedulePreview();
        });
        document.getElementById(`class-end-${i}`).addEventListener("change", () => {
            if (startTimeMode === "daily-schedule") updateDailySchedulePreview();
        });
    }

    // === 注意事項編輯功能 ===
    editableInstructions.addEventListener("dblclick", () => {
        if (isRunning) return; // 考試計時中防止誤觸編輯
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

    // === 快速載入考程範本按鈕事件 ===
    const presetDay1Btn = document.getElementById("preset-day-1");
    const presetDay2Btn = document.getElementById("preset-day-2");

    if (presetDay1Btn && presetDay2Btn) {
        presetDay1Btn.addEventListener("click", () => {
            document.getElementById("class-active-1").checked = true;
            document.getElementById("class-subj-1").value = "國語";
            document.getElementById("class-start-1").value = "08:30";
            document.getElementById("class-end-1").value = "09:20";

            document.getElementById("class-active-2").checked = true;
            document.getElementById("class-subj-2").value = "自然";
            document.getElementById("class-start-2").value = "09:30";
            document.getElementById("class-end-2").value = "10:10";

            document.getElementById("class-active-3").checked = true;
            document.getElementById("class-subj-3").value = "英語";
            document.getElementById("class-start-3").value = "10:30";
            document.getElementById("class-end-3").value = "11:10";

            if (startTimeMode === "daily-schedule") {
                updateDailySchedulePreview();
            }
        });

        presetDay2Btn.addEventListener("click", () => {
            document.getElementById("class-active-1").checked = true;
            document.getElementById("class-subj-1").value = "數學";
            document.getElementById("class-start-1").value = "08:40";
            document.getElementById("class-end-1").value = "09:20";

            document.getElementById("class-active-2").checked = true;
            document.getElementById("class-subj-2").value = "社會";
            document.getElementById("class-start-2").value = "09:30";
            document.getElementById("class-end-2").value = "10:10";

            document.getElementById("class-active-3").checked = false;

            if (startTimeMode === "daily-schedule") {
                updateDailySchedulePreview();
            }
        });
    }

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
            if (isRunning && !isPaused) {
                headerInfo.classList.remove("fade-in");
                headerInfo.classList.add("fade-out");
            }
        }, 3500); // 3.5秒無操作自動淡出
    }

    // 啟動初始化
    init();
});
