import { auth, db } from './firebase.js';
import {
  collection, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const listEl    = document.querySelector('#scores-list');
const emptyEl   = document.querySelector('#scores-empty');
const loadingEl = document.querySelector('#scores-loading');

function fmtDate(d) {
  try {
    if (d?.seconds) return new Date(d.seconds * 1000).toLocaleString();
    if (typeof d === 'string') return d;
  } catch {}
  return '';
}

function renderScores(items) {
  loadingEl && (loadingEl.style.display = 'none');
  if (!items.length) {
    emptyEl && (emptyEl.style.display = 'block');
    if (listEl) listEl.innerHTML = '';
    return;
  }
  emptyEl && (emptyEl.style.display = 'none');
  if (!listEl) return;

  listEl.innerHTML = '';
  
  // 添加表格标题
  const header = document.createElement('div');
  header.className = 'score-table-header';
  header.innerHTML = `
    <div class="header-rank">編號</div>
    <div class="header-exam-type">測驗類型</div>
    <div class="header-time">耗時</div>
    <div class="header-score">成績</div>
    <div class="header-date">測驗時間</div>
  `;
  listEl.appendChild(header);
  
  // 添加成绩记录
  items.forEach((r, index) => {
    const row = document.createElement('div');
    row.className = 'score-item';
    
    const timeSpent = r.timeSpentMs ? 
      (r.timeSpentMs < 60000 ? 
        Math.round(r.timeSpentMs / 1000) + "秒" : 
        Math.round(r.timeSpentMs / 60000) + "分" + Math.round((r.timeSpentMs % 60000) / 1000) + "秒") : 
      "未知";
    
    const examType = r.examType || "筆試測驗";
    const scoreDisplay = r.score ? `${r.score}分` : "未知";
    const correctInfo = r.correctCount && r.questionCount ? 
      ` (${r.correctCount}/${r.questionCount})` : "";
    
    row.innerHTML = `
      <div class="score-rank">No.${index + 1}</div>
      <div class="score-exam-type">${examType}</div>
      <div class="score-time">${timeSpent}</div>
      <div class="score-value">${scoreDisplay}${correctInfo}</div>
      <div class="score-date">${fmtDate(r.submittedAt)}</div>
    `;
    listEl.appendChild(row);
  });
}

export async function loadMyScores() {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    console.warn("⚠️ 用户未登录，无法查询成绩");
    renderScores([]);
    return;
  }

  try {
    console.log("🔍 开始查询成绩，UID:", uid);
    
    // 优先根据 UID 查询（更安全）
    const q = query(collection(db, 'scores'), where('uid', '==', uid));
    const snap = await getDocs(q);
    const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    console.log("📊 查询到成绩数量:", rows.length);

    // 按提交时间倒序排列
    rows.sort((a, b) => {
      const timeA = a.submittedAt?.toDate ? a.submittedAt.toDate() : new Date(a.submittedAt);
      const timeB = b.submittedAt?.toDate ? b.submittedAt.toDate() : new Date(b.submittedAt);
      return timeB - timeA;
    });
    
    renderScores(rows);
  } catch (error) {
    console.error("❌ 查询成绩失败:", error);
    renderScores([]);
  }
}

// 获取用户名（学号/工号）
async function getUserName() {
  try {
    // 优先从 localStorage 获取
    const profile = JSON.parse(localStorage.getItem("pbls_user_profile") || "null");
    if (profile?.学号) return profile.学号;
    if (profile?.工号) return profile.工号;
    if (profile?.name) return profile.name;
    
    // 从全局变量获取
    if (window.currentUserName) return window.currentUserName;
    
    // 从 Firestore user 文档获取
    const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js");
    const uid = auth.currentUser?.uid;
    if (uid) {
      const userRef = doc(db, "user", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        return data.学号 || data.工号 || data.name || data.userName || "未命名使用者";
      }
    }
    
    return "未命名使用者";
  } catch (error) {
    console.error("获取用户名失败:", error);
    return "未命名使用者";
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    if (!auth.currentUser) return; // 你的專案會先處理登入
    loadingEl && (loadingEl.style.display = 'block');
    await loadMyScores();
  } catch (e) {
    console.error('載入成績失敗：', e);
    loadingEl && (loadingEl.style.display = 'none');
    emptyEl && (emptyEl.style.display = 'block');
  }
});
