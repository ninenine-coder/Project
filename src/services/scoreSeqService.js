// scoreSeqService.js
import { db, auth } from '../../js/firebase.js';
import {
  doc, runTransaction, setDoc, getDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

/**
 * 根據測驗類型獲取對應的計數器名稱和文檔 ID 前綴
 */
function getCounterInfo(examType) {
  if (examType === 'VR操作測驗') {
    return { counterName: 'VR', prefix: 'VR' };
  } else if (examType === 'virti') {
    return { counterName: 'virti', prefix: 'virti' };
  } else {
    // 筆試測驗或其他類型使用預設的 scores 計數器
    return { counterName: 'scores', prefix: 'scores' };
  }
}

/**
 * 以交易方式建立一筆 scores，根據測驗類型生成對應的文檔 ID
 * - 筆試測驗：scores1, scores2, scores3...
 * - VR操作測驗：VR1, VR2, VR3...
 * - virti：virti1, virti2, virti3...
 * 
 * payload 需包含 uid（= auth.currentUser.uid）和 examType
 * 回傳：實際使用的 docId（例如 "scores17"、"VR1"、"virti1"）
 */
export async function createSequentialScore(payload) {
  // 優先使用 payload 中的 uid，如果沒有則使用 auth.currentUser.uid
  let uid = payload.uid;
  if (!uid) {
    uid = auth.currentUser?.uid;
  }
  if (!uid) throw new Error('not signed in');
  if (payload.uid && payload.uid !== uid) {
    // 如果 payload 中有 uid 但與當前登入者不同，使用 payload 中的 uid（可能是統一 UID）
    uid = payload.uid;
  }
  // 確保 payload 包含正確的 uid
  payload = { ...payload, uid };

  // 根據測驗類型獲取計數器信息
  const examType = payload.examType || '筆試測驗';
  const { counterName, prefix } = getCounterInfo(examType);
  const counterRef = doc(db, 'counters', counterName);

  const docId = await runTransaction(db, async (tx) => {
    const counterSnap = await tx.get(counterRef);

    let next;
    if (!counterSnap.exists()) {
      // 初次：第一筆要用 1，故把 next 設 2（規則允許 >=2）
      next = 1;
      tx.set(counterRef, { next: 2 });
    } else {
      next = Number(counterSnap.data()?.next) || 1;
      // 使用 next 當本次序號，並將 next+1 回寫
      tx.update(counterRef, { next: next + 1 });
    }

    const newId = `${prefix}${next}`;
    const scoreRef = doc(db, 'scores', newId);

    // 準備要保存的數據（確保 submittedAt 使用 serverTimestamp）
    const dataToSave = { ...payload };
    
    // 如果 payload 中的 submittedAt 是字符串或 Date，替換為 serverTimestamp
    // 這樣可以確保與歷史成績頁面的查詢邏輯兼容
    if (dataToSave.submittedAt && typeof dataToSave.submittedAt !== 'object') {
      // submittedAt 是字符串或其他類型，使用 serverTimestamp
      dataToSave.submittedAt = serverTimestamp();
    } else if (dataToSave.submittedAt && !dataToSave.submittedAt.toDate) {
      // submittedAt 是普通對象但不是 Timestamp，使用 serverTimestamp
      dataToSave.submittedAt = serverTimestamp();
    }
    // 如果已經是 serverTimestamp() 或 Timestamp，保持不變

    // 在同一個交易內寫入分數（這是「create」而非 update）
    tx.set(scoreRef, dataToSave); // 不要 merge，避免誤觸 update 規則

    return newId;
  });

  return docId;
}

/**
 * 初始化計數器（可選，通常不需要手動執行）
 * 只在需要重置計數器時使用
 * @param {string} examType - 測驗類型（'筆試測驗'、'VR操作測驗'、'virti'），如果不指定則初始化所有計數器
 */
export async function initializeCounter(examType = null) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('not signed in');
  
  if (examType) {
    // 初始化指定類型的計數器
    const { counterName } = getCounterInfo(examType);
    const counterRef = doc(db, 'counters', counterName);
    await setDoc(counterRef, { next: 2 });
    console.log(`✅ ${counterName} 計數器已初始化`);
  } else {
    // 初始化所有計數器
    const counters = ['scores', 'VR', 'virti'];
    for (const counterName of counters) {
      const counterRef = doc(db, 'counters', counterName);
      await setDoc(counterRef, { next: 2 });
      console.log(`✅ ${counterName} 計數器已初始化`);
    }
  }
}

/**
 * 獲取當前計數器狀態（除錯用）
 * @param {string} examType - 測驗類型（'筆試測驗'、'VR操作測驗'、'virti'），如果不指定則獲取所有計數器狀態
 */
export async function getCounterStatus(examType = null) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('not signed in');
  
  if (examType) {
    // 獲取指定類型的計數器狀態
    const { counterName } = getCounterInfo(examType);
    const counterRef = doc(db, 'counters', counterName);
    const snap = await getDoc(counterRef);
    
    if (snap.exists()) {
      const data = snap.data();
      console.log(`📊 ${counterName} 計數器狀態:`, data);
      return { [counterName]: data };
    } else {
      console.log(`📊 ${counterName} 計數器尚未初始化`);
      return { [counterName]: null };
    }
  } else {
    // 獲取所有計數器狀態
    const counters = ['scores', 'VR', 'virti'];
    const status = {};
    
    for (const counterName of counters) {
      const counterRef = doc(db, 'counters', counterName);
      const snap = await getDoc(counterRef);
      
      if (snap.exists()) {
        status[counterName] = snap.data();
      } else {
        status[counterName] = null;
      }
    }
    
    console.log('📊 所有計數器狀態:', status);
    return status;
  }
}
