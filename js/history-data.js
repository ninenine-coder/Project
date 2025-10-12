import { auth, db, authReady } from './firebase.js';
import { collection, query, where, getDocs, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

export async function loadMyScores(limitN = 50) {
  await authReady;
  const me = auth.currentUser;
  if (!me) {
    // 未登入，導向登入頁
    location.href = 'login.html';
    return [];
  }

  let snap;
  try {
    snap = await getDocs(query(
      collection(db, 'scores'),
      where('uid', '==', me.uid),
      orderBy('submittedAt', 'desc'),
      limit(limitN)
    ));
  } catch {
    // 如果 submittedAt 非 Timestamp（是字串），退回不排序
    snap = await getDocs(query(
      collection(db, 'scores'),
      where('uid', '==', me.uid),
      limit(limitN)
    ));
  }
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
