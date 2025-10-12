/**
 * 用戶資料服務
 * 用於管理用戶登入、登出、以及載入 Firestore 中的姓名資料
 */

import { auth, db, authReady } from '../../js/firebase.js';
import {
  doc, getDoc, collection, query, where, limit, getDocs, setDoc
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

export const userDataService = {
  currentUser: null,
  currentUserName: null,
  isInitialized: false,

  /**
   * 初始化使用者狀態監聽
   */
  async initialize() {
    // 等待 Firebase 認證還原完成
    await authReady;
    
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          console.log("👤 使用者已登入:", user.email || user.uid);
          this.currentUser = user;
          await this.loadUserName(user.uid);
          this.isInitialized = true;
          resolve(user);
        } else {
          console.warn("⚠️ 尚未登入使用者");
          this.currentUser = null;
          this.currentUserName = null;
          this.isInitialized = true;
          resolve(null);
        }
      });
    });
  },

  /**
   * 從 Firestore 載入使用者姓名（多重 fallback）
   */
  async loadUserName(uid) {
    try {
      // 1) 直讀 /user/{uid}
      const uref = doc(db, 'user', uid);
      let snap = await getDoc(uref);
      if (snap.exists()) {
        const d = snap.data();
        const name = d.姓名 ?? d.userName ?? d.displayName ?? '(未命名)';
        this.currentUserName = name;
        window.currentUserName = name;
        console.log(`✅ 直讀 /user/{uid} 成功：${name}`);
        return name;
      }

      // 2) /user where uid == 我的 uid
      let qs = await getDocs(query(collection(db, 'user'), where('uid', '==', uid), limit(1)));
      if (!qs.empty) {
        const d = qs.docs[0].data();
        // 可選：順手把別名補到 /user/{uid}，下次直讀
        await setDoc(uref, { ...d, uid }, { merge: true });
        const name = d.姓名 ?? d.userName ?? d.displayName ?? '(未命名)';
        this.currentUserName = name;
        window.currentUserName = name;
        console.log(`✅ where uid 查詢成功：${name}`);
        return name;
      }

      // 3) /user where account == 登入 email
      const email = auth.currentUser?.email || null;
      if (email) {
        qs = await getDocs(query(collection(db, 'user'), where('account', '==', email), limit(1)));
        if (!qs.empty) {
          const d = qs.docs[0].data();
          await setDoc(uref, { ...d, uid }, { merge: true });
          const name = d.姓名 ?? d.userName ?? d.displayName ?? '(未命名)';
          this.currentUserName = name;
          window.currentUserName = name;
          console.log(`✅ where account 查詢成功：${name}`);
          return name;
        }
      }

      // 4) 最後退路：從 scores 取 userName
      qs = await getDocs(query(collection(db, 'scores'), where('uid', '==', uid), limit(1)));
      if (!qs.empty) {
        const d = qs.docs[0].data();
        const name = d.userName ?? '(未命名)';
        this.currentUserName = name;
        window.currentUserName = name;
        console.log(`✅ 從 scores 取得：${name}`);
        return name;
      }

      // 全部失敗，使用預設值
      this.currentUserName = '(未命名)';
      window.currentUserName = '(未命名)';
      console.log('⚠️ 所有查詢方式都失敗，使用預設名稱');
      return '(未命名)';
    } catch (err) {
      console.error("❌ 載入使用者姓名失敗：", err);
      this.currentUserName = '(未命名)';
      window.currentUserName = '(未命名)';
      return '(未命名)';
    }
  },

  /**
   * 取得當前使用者顯示資訊（供 UI 使用）
   */
  getUserInfo() {
    if (!this.currentUser) return "未登入";
    const name = this.currentUserName || "未命名使用者";
    const email = this.currentUser.email || "";
    return `${name} (${email})`;
  },

  /**
   * 檢查是否登入
   */
  isLoggedIn() {
    return !!this.currentUser;
  },

  /**
   * 登出帳號
   */
  async logout() {
    try {
      await signOut(auth);
      console.log("🚪 使用者已登出");
      localStorage.removeItem("pbls_user");
      localStorage.removeItem("pbls_user_profile");
      this.currentUser = null;
      this.currentUserName = null;
      window.currentUserName = null;
    } catch (err) {
      console.error("❌ 登出失敗：", err);
    }
  },
};

// === 自動初始化 ===
(async () => {
  await userDataService.initialize();
})();

// === 暴露到全域（供其他頁面使用）===
window.userDataService = userDataService;
