import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBuWO8hFVjjTUe2tqJDrqdbeGTrp4PoT5Q",
  authDomain: "progect-115a5.firebaseapp.com",
  projectId: "progect-115a5"
};

export const app  = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);

// 跨頁保存登入；換頁後 SDK 會自動還原
await setPersistence(auth, browserLocalPersistence);

// 提供「等還原完成」的 Promise
export const authReady = new Promise((resolve) => {
  const off = onAuthStateChanged(auth, () => { off(); resolve(); });
});

// 方便除錯
window.__FB__ = { app, auth, db, authReady };

// 認證狀態監控（除錯用）
onAuthStateChanged(auth, u => {
  console.log('[auth] state ->', u ? (u.email || (u.isAnonymous?'匿名':'') + u.uid) : 'null');
});