import { auth, db, authReady } from './firebase.js';
import { getUnifiedUID } from './unifiedAuthService.js';
import { collection, query, where, getDocs, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

export async function loadMyScores(limitN = 50) {
  await authReady;
  const me = auth.currentUser;
  if (!me) {
    // 未登入，導向登入頁
    location.href = 'login.html';
    return [];
  }

  // 獲取統一的 UID
  const currentUID = await getUnifiedUID();
  if (!currentUID) {
    console.error('❌ 無法獲取統一 UID');
    return [];
  }

  console.log('🔍 使用統一 UID 查詢成績:', currentUID);
  console.log('📊 當前 Firebase Auth UID:', me.uid);

  let snap;
  try {
    snap = await getDocs(query(
      collection(db, 'scores'),
      where('uid', '==', currentUID),
      orderBy('submittedAt', 'desc'),
      limit(limitN)
    ));
  } catch {
    // 如果 submittedAt 非 Timestamp（是字串），退回不排序
    snap = await getDocs(query(
      collection(db, 'scores'),
      where('uid', '==', currentUID),
      limit(limitN)
    ));
  }
  
  const scores = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  console.log(`✅ 載入了 ${scores.length} 筆成績，UID: ${currentUID}`);
  return scores;
}
