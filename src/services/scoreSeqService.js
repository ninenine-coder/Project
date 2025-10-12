// scoreSeqService.js
import { db, auth } from '../../js/firebase.js';
import {
  doc, runTransaction, setDoc
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

/**
 * 以交易方式建立一筆 scores，docId = scores{N}
 * payload 需包含 uid（= auth.currentUser.uid）
 * 回傳：實際使用的 docId（例如 "scores17"）
 */
export async function createSequentialScore(payload) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('not signed in');
  if (payload.uid !== uid) {
    // 規則要求新寫入的 uid 必須等於登入者
    payload = { ...payload, uid };
  }

  const counterRef = doc(db, 'counters', 'scores');

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

    const newId = `scores${next}`;
    const scoreRef = doc(db, 'scores', newId);

    // 在同一個交易內寫入分數（這是「create」而非 update）
    tx.set(scoreRef, payload); // 不要 merge，避免誤觸 update 規則

    return newId;
  });

  return docId;
}

/**
 * 初始化計數器（可選，通常不需要手動執行）
 * 只在需要重置計數器時使用
 */
export async function initializeCounter() {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('not signed in');
  
  const counterRef = doc(db, 'counters', 'scores');
  await setDoc(counterRef, { next: 2 });
  console.log('✅ 計數器已初始化');
}

/**
 * 獲取當前計數器狀態（除錯用）
 */
export async function getCounterStatus() {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('not signed in');
  
  const counterRef = doc(db, 'counters', 'scores');
  const snap = await getDoc(counterRef);
  
  if (snap.exists()) {
    const data = snap.data();
    console.log('📊 計數器狀態:', data);
    return data;
  } else {
    console.log('📊 計數器尚未初始化');
    return null;
  }
}
