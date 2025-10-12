/**
 * 統一認證服務
 * 整合 Firestore 用戶資料與 Firebase Auth，確保跨瀏覽器一致性
 */
import { auth, db, authReady } from './firebase.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

class UnifiedAuthService {
  constructor() {
    this.currentUser = null;
    this.userData = null;
    this.isInitialized = false;
  }

  /**
   * 初始化認證服務
   */
  async initialize() {
    await authReady;
    this.currentUser = auth.currentUser;
    
    if (this.currentUser) {
      // 載入用戶資料
      await this.loadUserData();
    }
    
    this.isInitialized = true;
    return this.currentUser;
  }

  /**
   * 統一登入方法
   * 1. 先查詢 Firestore 驗證帳號密碼
   * 2. 獲取用戶的 Firebase Auth email
   * 3. 使用 Firebase Auth 登入
   * 4. 保存完整用戶資料
   */
  async login(account, password) {
    try {
      console.log('🔐 開始統一登入流程...');
      
      // Step 1: 查詢 Firestore 中的用戶資料
      const q = query(
        collection(db, "user"),
        where("account", "==", account)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('帳號不存在');
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      
      // Step 2: 驗證密碼
      if (userData.password !== password) {
        throw new Error('密碼錯誤');
      }

      console.log('✅ Firestore 驗證通過');
      
      // Step 3: 檢查是否有 Firebase Auth email
      let firebaseEmail = userData.firebaseEmail;
      
      if (!firebaseEmail) {
        // 如果沒有 Firebase Auth email，創建一個
        // 使用格式: userDocId@pbls.local
        firebaseEmail = `${userDoc.id}@pbls.local`;
        
        console.log('📧 創建 Firebase Auth 帳號:', firebaseEmail);
        
        try {
          // 嘗試創建 Firebase Auth 用戶
          await createUserWithEmailAndPassword(auth, firebaseEmail, password);
          
          // 更新 Firestore 保存 Firebase Auth email
          await updateDoc(doc(db, "user", userDoc.id), {
            firebaseEmail: firebaseEmail,
            updatedAt: serverTimestamp()
          });
          
          console.log('✅ Firebase Auth 帳號創建成功');
        } catch (authError) {
          // 如果帳號已存在，直接登入
          if (authError.code === 'auth/email-already-in-use') {
            console.log('ℹ️ Firebase Auth 帳號已存在，直接登入');
          } else {
            throw authError;
          }
        }
      }

      // Step 4: 使用 Firebase Auth 登入
      console.log('🔑 使用 Firebase Auth 登入:', firebaseEmail);
      await signInWithEmailAndPassword(auth, firebaseEmail, password);
      
      // Step 5: 等待認證完成
      await authReady;
      this.currentUser = auth.currentUser;
      
      if (!this.currentUser) {
        throw new Error('Firebase Auth 登入失敗');
      }

      console.log('✅ Firebase Auth 登入成功, UID:', this.currentUser.uid);

      // Step 6: 更新最後登入時間
      await updateDoc(doc(db, "user", userDoc.id), {
        lastLogin: serverTimestamp(),
        lastFirebaseUID: this.currentUser.uid
      });

      // Step 7: 保存完整的用戶資料（包含關鍵的映射信息）
      this.userData = {
        // Firestore 文檔 ID（用於查詢用戶資料）
        firestoreDocId: userDoc.id,
        // Firebase Auth UID（用於認證狀態）
        firebaseUID: this.currentUser.uid,
        // 統一 UID（使用 Firestore 文檔 ID 作為主要 UID）
        uid: userDoc.id,
        // 用戶資料
        account: account,
        email: firebaseEmail,
        name: userData["姓名"] || userData.name,
        displayName: userData["姓名"] || userData.name,
        photoURL: `https://via.placeholder.com/40/17a2b8/ffffff?text=${(userData["姓名"] || userData.name || 'U').charAt(0)}`,
        where: userData["school/hospital"] || userData.school || userData.where,
        department: userData.department,
        phone: userData.phone,
        studentId: userData.studentId,
        // 統計資料
        totalTests: userData.totalTests || 0,
        totalTimeSpent: userData.totalTimeSpent || 0,
        // 時間戳
        loginTime: new Date().toISOString(),
        createdAt: userData.createdAt,
        lastLogin: userData.lastLogin,
        isActive: userData.isActive
      };

      // 保存到 localStorage
      localStorage.setItem('pbls_user', JSON.stringify(this.userData));
      
      // 創建 UID 映射記錄
      await this.createUIDMapping();

      console.log('✅ 統一登入完成');
      console.log('📊 用戶資料:', {
        firestoreDocId: this.userData.firestoreDocId,
        firebaseUID: this.userData.firebaseUID,
        統一UID: this.userData.uid
      });

      return {
        success: true,
        user: this.currentUser,
        userData: this.userData
      };

    } catch (error) {
      console.error('❌ 統一登入失敗:', error);
      return {
        success: false,
        error: error.message || '登入失敗'
      };
    }
  }

  /**
   * 創建 UID 映射記錄
   */
  async createUIDMapping() {
    if (!this.currentUser || !this.userData) return;

    try {
      const mappingDoc = {
        firebaseUID: this.currentUser.uid,
        firestoreDocId: this.userData.firestoreDocId,
        account: this.userData.account,
        email: this.userData.email,
        name: this.userData.name,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // 使用 Firebase Auth UID 作為文檔 ID
      await setDoc(doc(db, 'uid_mappings', this.currentUser.uid), mappingDoc, { merge: true });
      
      // 同時使用 Firestore Doc ID 創建反向映射
      await setDoc(doc(db, 'uid_mappings', this.userData.firestoreDocId), {
        ...mappingDoc,
        isFallback: true
      }, { merge: true });
      
      console.log('✅ UID 映射記錄已創建');
    } catch (error) {
      console.error('❌ 創建 UID 映射失敗:', error);
    }
  }

  /**
   * 載入用戶資料
   */
  async loadUserData() {
    if (!this.currentUser) return null;

    try {
      // 先嘗試從 localStorage 讀取
      const localData = localStorage.getItem('pbls_user');
      if (localData) {
        this.userData = JSON.parse(localData);
        console.log('✅ 從 localStorage 載入用戶資料');
        return this.userData;
      }

      // 如果 localStorage 沒有，從 Firestore 載入
      // 先嘗試通過 UID 映射查找
      const mappingDoc = await getDoc(doc(db, 'uid_mappings', this.currentUser.uid));
      
      if (mappingDoc.exists()) {
        const mapping = mappingDoc.data();
        const userDoc = await getDoc(doc(db, 'user', mapping.firestoreDocId));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          this.userData = {
            firestoreDocId: userDoc.id,
            firebaseUID: this.currentUser.uid,
            uid: userDoc.id,
            account: userData.account,
            email: userData.firebaseEmail || userData.email,
            name: userData["姓名"] || userData.name,
            displayName: userData["姓名"] || userData.name,
            // ... 其他資料
          };
          
          localStorage.setItem('pbls_user', JSON.stringify(this.userData));
          console.log('✅ 從 Firestore 載入用戶資料');
          return this.userData;
        }
      }

      console.warn('⚠️ 無法載入用戶資料');
      return null;
    } catch (error) {
      console.error('❌ 載入用戶資料失敗:', error);
      return null;
    }
  }

  /**
   * 獲取統一的 UID（用於查詢成績等）
   */
  getUnifiedUID() {
    if (this.userData) {
      return this.userData.uid; // 返回 Firestore 文檔 ID
    }
    
    // 嘗試從 localStorage 獲取
    const localData = localStorage.getItem('pbls_user');
    if (localData) {
      const userData = JSON.parse(localData);
      return userData.uid;
    }
    
    return null;
  }

  /**
   * 登出
   */
  async logout() {
    try {
      await firebaseSignOut(auth);
      localStorage.removeItem('pbls_user');
      this.currentUser = null;
      this.userData = null;
      console.log('✅ 登出成功');
      return { success: true };
    } catch (error) {
      console.error('❌ 登出失敗:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 檢查認證狀態
   */
  async checkAuth() {
    await authReady;
    this.currentUser = auth.currentUser;
    
    if (this.currentUser) {
      await this.loadUserData();
      return true;
    }
    
    return false;
  }
}

// 創建全域實例
export const unifiedAuthService = new UnifiedAuthService();

// 便捷函數
export async function unifiedLogin(account, password) {
  return await unifiedAuthService.login(account, password);
}

export async function unifiedLogout() {
  return await unifiedAuthService.logout();
}

export async function getUnifiedUID() {
  await unifiedAuthService.initialize();
  return unifiedAuthService.getUnifiedUID();
}

export async function checkAuthStatus() {
  return await unifiedAuthService.checkAuth();
}

// 暴露到全域以便除錯
window.__UnifiedAuth__ = unifiedAuthService;

