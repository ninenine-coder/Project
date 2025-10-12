// js/firebase.js - 统一的 Firebase 初始化（只初始化一次）
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBuWO8hFVjjTUe2tqJDrqdbeGTrp4PoT5Q",
  authDomain: "progect-115a5.firebaseapp.com",
  databaseURL: "https://progect-115a5-default-rtdb.firebaseio.com",
  projectId: "progect-115a5",
  storageBucket: "progect-115a5.firebasestorage.app",
  messagingSenderId: "109099222287",
  appId: "1:109099222287:web:4f7b56a1eebe5abbfaaa7a",
  measurementId: "G-DZVNBQ3G6S"
};

export const app  = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);

// 使用長期保存（跨頁會自動還原）
await setPersistence(auth, browserLocalPersistence);

// 提供一個「等 Auth 準備好」的 Promise
export const authReady = new Promise(res => {
  const off = onAuthStateChanged(auth, () => { off(); res(); });
});

// 方便除錯
window.__FB__ = { app, auth, db, authReady };

console.log("✅ Firebase 初始化完成，Auth 持久化已启用");
