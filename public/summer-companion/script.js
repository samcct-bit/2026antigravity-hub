/* ==========================================
   升小四無痛接軌 - 暑假陪伴工具箱 腳本邏輯
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 初始化集點板
  initStickers();
  
  // 展開第一個手冊折疊卡
  toggleAccordion(0);
});

// ==================== TAB SWITCHING ====================

function switchTab(tabId) {
  // 隱藏所有分頁內容
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => tab.classList.remove('active'));
  
  // 取消所有導覽按鈕啟用狀態
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => btn.classList.remove('active'));
  
  // 顯示選定分頁與按鈕
  document.getElementById(`tab-${tabId}`).classList.add('active');
  document.getElementById(`btn-${tabId}`).classList.add('active');

  // 如果切換到列印分頁，滾動到頂部
  if (tabId === 'print') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ==================== ACCORDION FOR HABITS ====================

function toggleAccordion(index) {
  const items = document.querySelectorAll('.habit-item');
  
  items.forEach((item, idx) => {
    if (idx === index) {
      item.classList.toggle('open');
    } else {
      item.classList.remove('open');
    }
  });
}

// ==================== TOOL A: DAILY PLANNER ====================

function saveDailyPlanner() {
  const task1 = document.getElementById('task1-name').value.trim();
  const est1 = document.getElementById('task1-est').value;
  const task2 = document.getElementById('task2-name').value.trim();
  const est2 = document.getElementById('task2-est').value;
  const task3 = document.getElementById('task3-name').value.trim();
  const est3 = document.getElementById('task3-est').value;
  
  const challengeRes = document.querySelector('input[name="challenge-res"]:checked');
  const note = document.getElementById('challenge-note').value.trim();

  // 驗證
  if (!task1 && !task2 && !task3) {
    alert('⚠️ 請至少填寫一項明天的重要任務！');
    return;
  }

  const plannerData = {
    date: new Date().toLocaleDateString(),
    tasks: [
      { name: task1, est: est1 },
      { name: task2, est: est2 },
      { name: task3, est: est3 }
    ],
    result: challengeRes ? challengeRes.value : '',
    note: note
  };

  // 儲存至本地快取
  localStorage.setItem('dailyPlannerData', JSON.stringify(plannerData));
  
  // 集點增加
  incrementStickers(1);
  
  alert('💾 今日時間規劃儲存成功！\n✨ 集點板已自動增加 1 個貼紙！持續加油！');
}

function clearDailyInputs() {
  if (confirm('確定要清除填寫的規劃嗎？')) {
    document.getElementById('task1-name').value = '';
    document.getElementById('task1-est').value = '';
    document.getElementById('task2-name').value = '';
    document.getElementById('task2-est').value = '';
    document.getElementById('task3-name').value = '';
    document.getElementById('task3-est').value = '';
    
    const checkedRadio = document.querySelector('input[name="challenge-res"]:checked');
    if (checkedRadio) checkedRadio.checked = false;
    
    document.getElementById('challenge-note').value = '';
  }
}

// ==================== TOOL B: READING思考卡 ====================

function generateReadingCard() {
  const title = document.getElementById('book-title').value.trim();
  const who = document.getElementById('book-who').value.trim();
  const what = document.getElementById('book-what').value.trim();
  const where = document.getElementById('book-where').value.trim();
  const when = document.getElementById('book-when').value.trim();
  const why = document.getElementById('book-why').value.trim();
  const how = document.getElementById('book-how').value.trim();
  const thoughts = document.getElementById('book-thoughts').value.trim();

  if (!title) {
    alert('⚠️ 請填寫書名/文章名！');
    return;
  }

  // 寫入預覽卡片
  document.getElementById('prev-title').innerText = title;
  document.getElementById('prev-who').innerText = who || '-';
  document.getElementById('prev-when').innerText = when || '-';
  document.getElementById('prev-where').innerText = where || '-';
  document.getElementById('prev-what').innerText = what || '-';
  document.getElementById('prev-why').innerText = why || '-';
  document.getElementById('prev-how').innerText = how || '-';
  document.getElementById('prev-thoughts').innerText = thoughts || '-';

  // 顯示預覽卡片
  const previewCard = document.getElementById('reading-preview-card');
  previewCard.style.display = 'block';
  previewCard.scrollIntoView({ behavior: 'smooth' });

  // 儲存資料
  const readingData = { title, who, what, where, when, why, how, thoughts };
  localStorage.setItem('weeklyReadingData', JSON.stringify(readingData));

  // 集點增加
  incrementStickers(1);

  alert('📚 閱讀思考卡已成功產生！\n✨ 集點板已自動增加 1 個貼紙！');
}

function clearReadingInputs() {
  if (confirm('確定要清除填寫的閱讀筆記嗎？')) {
    document.getElementById('book-title').value = '';
    document.getElementById('book-who').value = '';
    document.getElementById('book-what').value = '';
    document.getElementById('book-where').value = '';
    document.getElementById('book-when').value = '';
    document.getElementById('book-why').value = '';
    document.getElementById('book-how').value = '';
    document.getElementById('book-thoughts').value = '';
    hideReadingPreview();
  }
}

function hideReadingPreview() {
  document.getElementById('reading-preview-card').style.display = 'none';
}

function printSingleCard() {
  alert('💡 提示：本卡片將隨整個 A4 模板列印，點擊後會為您引導至「列印分頁」，您可以在該分頁直接列印完整 A4 實體卡！');
  switchTab('print');
}

// ==================== STICKER BOARD ====================

const MAX_STICKERS = 30;

function initStickers() {
  const container = document.getElementById('stickers-container');
  container.innerHTML = '';
  
  let stickerCount = parseInt(localStorage.getItem('stickerCount')) || 0;
  // 防呆限制
  if (stickerCount > MAX_STICKERS) stickerCount = MAX_STICKERS;
  if (stickerCount < 0) stickerCount = 0;

  document.getElementById('sticker-count-num').innerText = stickerCount;

  for (let i = 1; i <= MAX_STICKERS; i++) {
    const slot = document.createElement('div');
    slot.className = 'sticker-slot';
    if (i <= stickerCount) {
      slot.classList.add('active');
    }
    
    // 點擊貼紙格可手動集點/取消點數，增加互動樂趣
    slot.onclick = () => {
      toggleStickerAt(i);
    };
    
    container.appendChild(slot);
  }

  updateMilestones(stickerCount);
}

function toggleStickerAt(index) {
  let stickerCount = parseInt(localStorage.getItem('stickerCount')) || 0;
  
  if (index <= stickerCount) {
    // 縮減點數到選中格子前一個
    stickerCount = index - 1;
  } else {
    // 增加點數到選中格子
    stickerCount = index;
  }
  
  localStorage.setItem('stickerCount', stickerCount);
  initStickers();
}

function incrementStickers(amount) {
  let stickerCount = parseInt(localStorage.getItem('stickerCount')) || 0;
  stickerCount += amount;
  if (stickerCount > MAX_STICKERS) stickerCount = MAX_STICKERS;
  
  localStorage.setItem('stickerCount', stickerCount);
  initStickers();
}

function addStickerDirectly() {
  incrementStickers(1);
}

function resetStickers() {
  if (confirm('確定要將累積的貼紙點數重置歸零嗎？')) {
    localStorage.setItem('stickerCount', 0);
    initStickers();
  }
}

function updateMilestones(count) {
  const m3 = document.getElementById('milestone-3');
  const m15 = document.getElementById('milestone-15');
  const m30 = document.getElementById('milestone-30');

  // Milestone 3
  if (count >= 3) {
    m3.classList.add('unlocked');
  } else {
    m3.classList.remove('unlocked');
  }

  // Milestone 15
  if (count >= 15) {
    m15.classList.add('unlocked');
  } else {
    m15.classList.remove('unlocked');
  }

  // Milestone 30
  if (count >= 30) {
    m30.classList.add('unlocked');
  } else {
    m30.classList.remove('unlocked');
  }
}

// ==================== PRINT TRIGGER ====================

function triggerPrint() {
  window.print();
}
