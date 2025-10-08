/**
 * 用戶註冊服務 - 統一處理所有註冊數據寫入Firestore
 * 支援多種註冊方式：電子郵件、學號/工號等
 */

import { 
  initializeApp 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp,
  collection, 
  query, 
  where, 
  getDocs,
  updateDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { ValidationUtils, ErrorHandler } from '../utils/validationUtils.js';
import { applyDefaults, getAllDefaults } from '../schemas/userSchema.js';

// Firebase 配置
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

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * 用戶註冊數據結構
 */
export class UserRegistrationData {
  constructor(data) {
    this.studentId = data.studentId || data.sid;           // 學號/工號（作為文檔ID）
    this.account = data.account || data.email;             // 登入帳號
    this.password = data.password;                         // 密碼
    this.name = data.name || data["姓名"];                 // 姓名
    this.department = data.department;                     // 系所/部門
    this.phone = data.phone;                               // 電話
    this.school = data.school || data.unit;                // 學校/醫院
    this.createdAt = serverTimestamp();                    // 註冊時間
    this.isActive = true;                                  // 帳號狀態
    this.lastLogin = null;                                 // 最後登入時間
  }

  // 轉換為Firestore格式
  toFirestore() {
    // 基本用戶數據
    const userData = {
      uid: this.studentId,
      email: this.account,
      name: this.name,
      displayName: this.name,
      account: this.account,
      password: this.password,
      "姓名": this.name,
      studentId: this.studentId,
      department: this.department,
      phone: this.phone || null,
      where: this.school,
      school: this.school,
      "school/hospital": this.school,
      createdAt: this.createdAt,
      isActive: this.isActive,
      lastLogin: this.lastLogin
    };

    // 應用所有預設值
    return applyDefaults(userData);
  }

  // 驗證數據完整性 - 使用統一的驗證工具
  validate() {
    const validation = ValidationUtils.validateUserRegistrationData({
      account: this.account,
      password: this.password,
      name: this.name,
      studentId: this.studentId,
      department: this.department,
      school: this.school,
      phone: this.phone
    });

    return {
      isValid: validation.isValid,
      errors: validation.errors,
      warnings: validation.warnings
    };
  }
}

/**
 * 用戶註冊服務類
 */
export class UserRegistrationService {
  constructor() {
    this.db = db;
    this.collectionName = "user";
  }

  /**
   * 註冊新用戶
   * @param {Object} userData - 用戶註冊數據
   * @returns {Promise<Object>} 註冊結果
   */
  async registerUser(userData) {
    try {
      // 創建用戶數據對象
      const user = new UserRegistrationData(userData);
      
      // 驗證數據
      const validation = user.validate();
      if (!validation.isValid) {
        return ErrorHandler.createErrorResponse(
          "數據驗證失敗", 
          "VALIDATION_ERROR", 
          validation.errors
        );
      }

      // 檢查學號/工號是否已存在
      const docRef = doc(this.db, this.collectionName, user.studentId);
      const snap = await getDoc(docRef);
      
      if (snap.exists()) {
        return ErrorHandler.createErrorResponse("此學號/工號已存在，請更換", "STUDENT_ID_EXISTS");
      }

      // 檢查帳號是否已存在
      const accountExists = await this.checkAccountExists(user.account);
      if (accountExists) {
        return ErrorHandler.createErrorResponse("此帳號已存在，請更換", "ACCOUNT_EXISTS");
      }

      // 寫入Firestore
      await setDoc(docRef, user.toFirestore());

      console.log('✅ 用戶註冊成功:', {
        studentId: user.studentId,
        account: user.account,
        name: user.name
      });

      return ErrorHandler.createSuccessResponse("註冊成功！", {
        studentId: user.studentId,
        account: user.account,
        name: user.name,
        department: user.department,
        school: user.school
      });

    } catch (error) {
      ErrorHandler.logError("用戶註冊失敗", error, { userData });
      return ErrorHandler.createErrorResponse(
        ErrorHandler.handleFirebaseError(error),
        error.code || "REGISTRATION_ERROR"
      );
    }
  }

  /**
   * 檢查帳號是否已存在
   * @param {string} account - 帳號
   * @returns {Promise<boolean>} 是否存在
   */
  async checkAccountExists(account) {
    try {
      const q = query(
        collection(this.db, this.collectionName),
        where("account", "==", account)
      );
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("檢查帳號存在性失敗:", error);
      return false;
    }
  }

  /**
   * 檢查學號/工號是否已存在
   * @param {string} studentId - 學號/工號
   * @returns {Promise<boolean>} 是否存在
   */
  async checkStudentIdExists(studentId) {
    try {
      const docRef = doc(this.db, this.collectionName, studentId);
      const snap = await getDoc(docRef);
      return snap.exists();
    } catch (error) {
      console.error("檢查學號存在性失敗:", error);
      return false;
    }
  }

  /**
   * 用戶登入驗證
   * @param {string} account - 帳號
   * @param {string} password - 密碼
   * @returns {Promise<Object>} 登入結果
   */
  async loginUser(account, password) {
    try {
      // 基本驗證
      if (!account || !password) {
        return ErrorHandler.createErrorResponse("帳號和密碼不能為空", "MISSING_CREDENTIALS");
      }

      const q = query(
        collection(this.db, this.collectionName),
        where("account", "==", account.trim()),
        where("password", "==", password)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        
        // 更新最後登入時間
        await updateDoc(doc(this.db, this.collectionName, userDoc.id), {
          lastLogin: serverTimestamp()
        });

        return ErrorHandler.createSuccessResponse("登入成功", {
          uid: userDoc.id,
          email: account,
          name: userData["姓名"] || userData.name,
          displayName: userData["姓名"] || userData.name,
          photoURL: 'https://via.placeholder.com/40/17a2b8/ffffff?text=' + (userData["姓名"] || userData.name || 'U').charAt(0),
          loginTime: new Date().toISOString(),
          loginMethod: 'firebase',
          where: userData["school/hospital"] || userData.school,
          department: userData.department,
          phone: userData.phone
        });
      } else {
        return ErrorHandler.createErrorResponse("帳號或密碼錯誤", "INVALID_CREDENTIALS");
      }
    } catch (error) {
      ErrorHandler.logError("用戶登入失敗", error, { account });
      return ErrorHandler.createErrorResponse(
        ErrorHandler.handleFirebaseError(error),
        error.code || "LOGIN_ERROR"
      );
    }
  }

  /**
   * 獲取用戶資料
   * @param {string} studentId - 學號/工號
   * @returns {Promise<Object>} 用戶資料
   */
  async getUserData(studentId) {
    try {
      const docRef = doc(this.db, this.collectionName, studentId);
      const snap = await getDoc(docRef);
      
      if (snap.exists()) {
        return {
          success: true,
          userData: snap.data()
        };
      } else {
        return {
          success: false,
          error: "用戶不存在"
        };
      }
    } catch (error) {
      console.error("❌ 獲取用戶資料失敗:", error);
      return {
        success: false,
        error: "獲取用戶資料失敗",
        details: error.message || error
      };
    }
  }

  /**
   * 更新用戶資料
   * @param {string} studentId - 學號/工號
   * @param {Object} updateData - 要更新的資料
   * @returns {Promise<Object>} 更新結果
   */
  async updateUserData(studentId, updateData) {
    try {
      const docRef = doc(this.db, this.collectionName, studentId);
      
      // 添加更新時間戳
      const dataWithTimestamp = {
        ...updateData,
        updatedAt: serverTimestamp()
      };

      await updateDoc(docRef, dataWithTimestamp);

      return {
        success: true,
        message: "資料更新成功"
      };
    } catch (error) {
      console.error("❌ 更新用戶資料失敗:", error);
      return {
        success: false,
        error: "更新資料失敗",
        details: error.message || error
      };
    }
  }

  /**
   * 獲取所有用戶（管理員功能）
   * @param {string} unit - 篩選單位（可選）
   * @returns {Promise<Object>} 用戶列表
   */
  async getAllUsers(unit = null) {
    try {
      let q;
      
      if (unit) {
        q = query(
          collection(this.db, this.collectionName),
          where("school/hospital", "==", unit)
        );
      } else {
        q = query(collection(this.db, this.collectionName));
      }
      
      const querySnapshot = await getDocs(q);
      const users = [];
      
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return {
        success: true,
        users: users,
        count: users.length
      };
    } catch (error) {
      console.error("❌ 獲取用戶列表失敗:", error);
      return {
        success: false,
        error: "獲取用戶列表失敗",
        details: error.message || error
      };
    }
  }
}

// 創建服務實例
export const userRegistrationService = new UserRegistrationService();

// 導出給其他模組使用
export default userRegistrationService;
