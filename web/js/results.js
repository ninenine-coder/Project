// Firestore-only 成績儲存與讀取工具
import {
  getFirestore, doc, collection, setDoc, serverTimestamp,
  writeBatch, getDoc, getDocs, query, orderBy, limit
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/**
 * 儲存一次成績
 * @param {Object} payload
 * @param {string} payload.uid - 使用者文件 id（= 你的 studentId/uid）
 * @param {string} payload.examId
 * @param {string} payload.examTitle
 * @param {number} payload.scoreRaw
 * @param {number} payload.scorePct
 * @param {number} payload.totalQuestions
 * @param {number} payload.correctCount
 * @param {number} payload.durationSec
 * @param {Array|Object} payload.answers - 每題詳解：[{qid, selected, correct, isCorrect, timeSec}, ...]
 * @returns {Promise<{attemptId: string}>}
 */
export async function saveExamResultToFirestore(payload) {
  const {
    uid, examId, examTitle, scoreRaw, scorePct,
    totalQuestions, correctCount, durationSec, answers
  } = payload || {};
  if (!uid) throw new Error("缺少 uid，請先登入並寫入 localStorage.pbls_user.uid");

  const db = getFirestore();
  const resultRef = doc(collection(db, 'user', uid, 'results')); // 自動 ID
  const attemptId = resultRef.id;

  // 1) 寫入摘要
  await setDoc(resultRef, {
    examId, examTitle,
    submittedAt: serverTimestamp(),
    durationSec,
    totalQuestions, correctCount,
    scoreRaw, scorePct
  });

  // 2) 寫入每題詳解（分批批次；每批 <= 450）
  const list = Array.isArray(answers) ? answers : Object.values(answers || {});
  const CHUNK = 450;
  for (let i = 0; i < list.length; i += CHUNK) {
    const batch = writeBatch(db);
    for (let j = i; j < Math.min(i + CHUNK, list.length); j++) {
      const a = list[j] || {};
      const qid = String(a.qid || `Q${j + 1}`);
      const ansRef = doc(collection(db, 'user', uid, 'results', attemptId, 'answers'), qid);
      batch.set(ansRef, {
        qid,
        selected: a.selected ?? null,
        correct: a.correct ?? null,
        isCorrect: !!a.isCorrect,
        timeSec: a.timeSec ?? null
      });
    }
    await batch.commit();
  }

  // 3) 更新用戶的總測驗次數 +1
  await incrementTestCount(uid);

  return { attemptId };
}

/**
 * 增加用戶的總測驗次數
 * @param {string} userId - 用戶ID
 */
async function incrementTestCount(userId) {
  try {
    const { increment, getDoc, updateDoc } = await import("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js");
    const db = getFirestore();
    
    // 定義用戶文件
    const userRef = doc(db, "user", userId);

    // 取得用戶文件
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();

      // 如果 'totaltesttimes' 欄位不存在，設定為 1
      if (userData.totaltesttimes === undefined) {
        await updateDoc(userRef, {
          totaltesttimes: 1 // 設定初始值為 1
        });
        console.log(`用戶 ${userId} 的總測驗次數已設定為 1`);
      } else {
        // 每次測驗結束後將 'totaltesttimes' 欄位加 1
        await updateDoc(userRef, {
          totaltesttimes: increment(1)
        });
        console.log(`用戶 ${userId} 的總測驗次數已增加 1`);
      }
    } else {
      console.log('用戶資料未找到');
    }
  } catch (error) {
    console.error('更新總測驗次數失敗:', error);
    // 不拋出錯誤，避免影響測驗結果的保存
  }
}

/**
 * 讀取歷史成績列表（預設 20 筆）
 */
export async function loadMyResults({ uid, limitN = 20 }) {
  if (!uid) throw new Error("請先登入");
  const db = getFirestore();
  const q = query(
    collection(db, 'user', uid, 'results'),
    orderBy('submittedAt', 'desc'),
    limit(limitN)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * 讀取單筆成績＋所有詳解
 */
export async function loadOneResultWithAnswers({ uid, attemptId }) {
  const db = getFirestore();
  const resultRef = doc(db, 'user', uid, 'results', attemptId);
  const summarySnap = await getDoc(resultRef);
  if (!summarySnap.exists()) throw new Error('找不到這筆成績');

  const ansSnap = await getDocs(collection(db, 'user', uid, 'results', attemptId, 'answers'));
  const answers = ansSnap.docs.map(d => d.data());
  return { id: attemptId, ...summarySnap.data(), answers };
}

/**
 * 獲取用戶的總測驗次數
 * @param {string} uid - 用戶ID
 * @returns {Promise<number>} 總測驗次數
 */
export async function getUserExamCount(uid) {
  try {
    const db = getFirestore();
    const userRef = doc(db, 'user', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      return userData.totaltesttimes || 0;
    }
    return 0;
  } catch (error) {
    console.error('獲取總測驗次數失敗:', error);
    return 0;
  }
}

/**
 * 顯示用戶總測驗次數
 * @param {string} userId - 用戶ID
 * @param {string} elementId - 顯示元素的ID
 */
export async function displayTestCount(userId, elementId = 'total-tests') {
  try {
    const db = getFirestore();
    const userRef = doc(db, "user", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();

      // 顯示總測驗次數
      const totalTests = userData.totaltesttimes || 0;
      const element = document.getElementById(elementId);
      if (element) {
        element.textContent = totalTests; // 只顯示數字，不顯示 "次"
      }
      
      return totalTests;
    } else {
      console.log('用戶資料未找到');
      const element = document.getElementById(elementId);
      if (element) {
        element.textContent = '0';
      }
      return 0;
    }
  } catch (error) {
    console.error('顯示總測驗次數失敗:', error);
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = '0';
    }
    return 0;
  }
}

/**
 * 更新用戶總練習時間
 * @param {string} userId - 用戶ID
 */
export async function updateTotalTimeSpent(userId) {
  try {
    const { increment, serverTimestamp, updateDoc } = await import("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js");
    const db = getFirestore();
    const userRef = doc(db, "user", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      
      // 如果是第一次登入或沒有紀錄lastLogin，則初始化為當前時間
      const currentTime = new Date().getTime();
      const lastLoginTime = userData.lastLogin ? userData.lastLogin.toDate().getTime() : currentTime;

      // 計算時間差（當前時間 - 上次登入時間），單位為秒
      const timeSpent = Math.max(0, (currentTime - lastLoginTime) / 1000); // 轉換為秒，確保不為負數

      // 更新totalTimeSpent欄位
      await updateDoc(userRef, {
        totalTimeSpent: increment(timeSpent),  // 加總時間
        lastLogin: serverTimestamp()  // 更新lastLogin為當前時間
      });

      console.log(`用戶 ${userId} 的總練習時間已更新 ${timeSpent} 秒`);
      return timeSpent;
    } else {
      console.log('用戶資料未找到');
      return 0;
    }
  } catch (error) {
    console.error('更新總練習時間失敗:', error);
    return 0;
  }
}

/**
 * 顯示用戶總練習時間
 * @param {string} userId - 用戶ID
 * @param {string} elementId - 顯示元素的ID
 */
export async function displayTotalTimeSpent(userId, elementId = 'total-time-spent') {
  try {
    const db = getFirestore();
    const userRef = doc(db, "user", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const totalTimeSpent = userData.totalTimeSpent || 0;

      // 將秒數轉換為小時、分鐘、秒
      const hours = Math.floor(totalTimeSpent / 3600);
      const minutes = Math.floor((totalTimeSpent % 3600) / 60);
      const seconds = Math.floor(totalTimeSpent % 60);

      // 顯示在界面上，格式為 "3:12:11"
      const timeString = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      const element = document.getElementById(elementId);
      if (element) {
        element.textContent = timeString;
      }
      
      return totalTimeSpent;
    } else {
      console.log('用戶資料未找到');
      const element = document.getElementById(elementId);
      if (element) {
        element.textContent = '0:00:00';
      }
      return 0;
    }
  } catch (error) {
    console.error('顯示總練習時間失敗:', error);
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = '0:00:00';
    }
    return 0;
  }
}
