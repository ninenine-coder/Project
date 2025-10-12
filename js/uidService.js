/**
 * UID 統一管理服務
 * 確保跨瀏覽器的 UID 一致性
 */
import { auth, db, authReady } from './firebase.js';
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

class UIDService {
  constructor() {
    this.currentUID = null;
    this.firebaseUID = null;
    this.userDocID = null;
    this.isInitialized = false;
  }

  /**
   * 初始化 UID 服務
   * 確保使用統一的 UID 來源
   */
  async initialize() {
    if (this.isInitialized) return this.currentUID;
    
    await authReady;
    const user = auth.currentUser;
    
    if (!user) {
      console.warn('⚠️ 用戶未登入，無法初始化 UID 服務');
      return null;
    }

    try {
      // 獲取 Firebase Auth UID
      this.firebaseUID = user.uid;
      console.log('🔑 Firebase Auth UID:', this.firebaseUID);

      // 嘗試從 localStorage 獲取用戶資料
      const localUserData = localStorage.getItem('pbls_user');
      if (localUserData) {
        const userData = JSON.parse(localUserData);
        this.userDocID = userData.uid; // 這是 Firestore 文檔 ID
        console.log('📄 Firestore 文檔 ID:', this.userDocID);
        
        // 統一使用 Firestore 文檔 ID 作為主要 UID
        this.currentUID = this.userDocID;
        
        // 創建或更新 UID 映射記錄
        await this.createUIDMapping();
        
        this.isInitialized = true;
        console.log('✅ UID 服務初始化完成，統一 UID:', this.currentUID);
        return this.currentUID;
      } else {
        console.warn('⚠️ 未找到本地用戶資料，使用 Firebase Auth UID');
        this.currentUID = this.firebaseUID;
        this.isInitialized = true;
        return this.currentUID;
      }
    } catch (error) {
      console.error('❌ UID 服務初始化失敗:', error);
      // 備用方案：使用 Firebase Auth UID
      this.currentUID = this.firebaseUID;
      this.isInitialized = true;
      return this.currentUID;
    }
  }

  /**
   * 創建 UID 映射記錄
   * 在 Firestore 中建立 Firebase Auth UID 和用戶文檔 ID 的對應關係
   */
  async createUIDMapping() {
    if (!this.firebaseUID || !this.userDocID) return;

    try {
      const mappingDoc = {
        firebaseUID: this.firebaseUID,
        userDocID: this.userDocID,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // 使用 Firebase Auth UID 作為文檔 ID 存儲映射
      await setDoc(doc(db, 'uid_mappings', this.firebaseUID), mappingDoc);
      console.log('✅ UID 映射記錄已創建');
    } catch (error) {
      console.error('❌ 創建 UID 映射失敗:', error);
    }
  }

  /**
   * 獲取當前統一的 UID
   */
  getCurrentUID() {
    return this.currentUID;
  }

  /**
   * 獲取 Firebase Auth UID
   */
  getFirebaseUID() {
    return this.firebaseUID;
  }

  /**
   * 獲取用戶文檔 ID
   */
  getUserDocID() {
    return this.userDocID;
  }

  /**
   * 檢查 UID 一致性
   */
  async checkUIDConsistency() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const consistency = {
      isConsistent: true,
      issues: [],
      firebaseUID: this.firebaseUID,
      userDocID: this.userDocID,
      currentUID: this.currentUID
    };

    // 檢查是否有不一致的情況
    if (this.firebaseUID && this.userDocID && this.firebaseUID !== this.userDocID) {
      consistency.isConsistent = false;
      consistency.issues.push('Firebase Auth UID 與用戶文檔 ID 不一致');
    }

    if (!this.currentUID) {
      consistency.isConsistent = false;
      consistency.issues.push('當前 UID 為空');
    }

    console.log('🔍 UID 一致性檢查:', consistency);
    return consistency;
  }
}

// 創建全域實例
export const uidService = new UIDService();

// 便捷函數
export async function getCurrentUID() {
  return await uidService.initialize();
}

export async function ensureUIDConsistency() {
  await uidService.initialize();
  return await uidService.checkUIDConsistency();
}
