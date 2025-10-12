/**
 * 用戶字段管理服務
 * 處理用戶字段的創建、更新、遷移和驗證
 */

import { getAllDefaults, applyDefaults, validateUserData, USER_SCHEMA } from '../schemas/userSchema.js';

// Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyBuWO8hFVjjTUe2tqJDrqdbeGTrp4PoT5Q",
    authDomain: "progect-115a5.firebaseapp.com",
    projectId: "progect-115a5",
    storageBucket: "progect-115a5.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

class UserFieldManager {
    constructor() {
        this.isInitialized = false;
        this.db = null;
    }

    /**
     * 初始化服務
     */
    async initialize() {
        if (this.isInitialized) return;

        try {
            const { db } = await import("../../js/firebase.js");
            this.db = db;
            
            this.isInitialized = true;
            console.log('用戶字段管理服務已初始化');
        } catch (error) {
            console.error('初始化用戶字段管理服務失敗:', error);
        }
    }

    /**
     * 創建新用戶文檔（註冊時使用）
     * @param {string} userId - 用戶ID
     * @param {Object} userData - 用戶數據
     * @returns {Promise<boolean>} 是否成功
     */
    async createUserDocument(userId, userData) {
        try {
            if (!this.isInitialized) {
                await this.initialize();
            }

            const { doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js");
            
            // 準備完整的用戶數據
            const completeUserData = {
                ...userData,
                uid: userId,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                lastLogin: serverTimestamp()
            };

            // 應用預設值
            const userDataWithDefaults = applyDefaults(completeUserData);

            // 驗證數據
            const validation = validateUserData(userDataWithDefaults);
            if (!validation.valid) {
                console.error('用戶數據驗證失敗:', validation.errors);
                return false;
            }

            // 創建用戶文檔
            const userRef = doc(this.db, 'user', userId);
            await setDoc(userRef, userDataWithDefaults);

            console.log('新用戶文檔已創建:', userId);
            return true;
        } catch (error) {
            console.error('創建用戶文檔失敗:', error);
            return false;
        }
    }

    /**
     * 更新用戶文檔（登入時使用）
     * @param {string} userId - 用戶ID
     * @param {Object} updateData - 要更新的數據
     * @returns {Promise<boolean>} 是否成功
     */
    async updateUserDocument(userId, updateData) {
        try {
            if (!this.isInitialized) {
                await this.initialize();
            }

            const { doc, updateDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js");
            
            const userRef = doc(this.db, 'user', userId);
            
            // 添加更新時間
            const updateDataWithTimestamp = {
                ...updateData,
                updatedAt: serverTimestamp()
            };

            await updateDoc(userRef, updateDataWithTimestamp);
            console.log('用戶文檔已更新:', userId);
            return true;
        } catch (error) {
            console.error('更新用戶文檔失敗:', error);
            return false;
        }
    }

    /**
     * 獲取用戶文檔並應用預設值
     * @param {string} userId - 用戶ID
     * @returns {Promise<Object|null>} 用戶數據
     */
    async getUserDocument(userId) {
        try {
            if (!this.isInitialized) {
                await this.initialize();
            }

            const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js");
            
            const userRef = doc(this.db, 'user', userId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                // 應用預設值
                return applyDefaults(userData);
            }

            return null;
        } catch (error) {
            console.error('獲取用戶文檔失敗:', error);
            return null;
        }
    }

    /**
     * 檢查用戶文檔是否需要遷移
     * @param {string} userId - 用戶ID
     * @returns {Promise<Object>} 遷移信息
     */
    async checkMigrationNeeded(userId) {
        try {
            if (!this.isInitialized) {
                await this.initialize();
            }

            const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js");
            
            const userRef = doc(this.db, 'user', userId);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                return {
                    needsMigration: true,
                    reason: '用戶文檔不存在',
                    missingFields: Object.keys(getAllDefaults())
                };
            }

            const userData = userSnap.data();
            const defaults = getAllDefaults();
            const missingFields = [];

            // 檢查缺少的字段
            Object.keys(defaults).forEach(fieldName => {
                if (userData[fieldName] === undefined || userData[fieldName] === null) {
                    missingFields.push(fieldName);
                }
            });

            return {
                needsMigration: missingFields.length > 0,
                reason: missingFields.length > 0 ? `缺少 ${missingFields.length} 個字段` : '無需遷移',
                missingFields,
                existingFields: Object.keys(userData)
            };
        } catch (error) {
            console.error('檢查遷移需求失敗:', error);
            return {
                needsMigration: false,
                reason: '檢查失敗',
                error: error.message
            };
        }
    }

    /**
     * 遷移用戶文檔（添加缺少的字段）
     * @param {string} userId - 用戶ID
     * @returns {Promise<boolean>} 是否成功
     */
    async migrateUserDocument(userId) {
        try {
            if (!this.isInitialized) {
                await this.initialize();
            }

            const migrationInfo = await this.checkMigrationNeeded(userId);
            if (!migrationInfo.needsMigration) {
                console.log('用戶文檔無需遷移:', userId);
                return true;
            }

            console.log('開始遷移用戶文檔:', userId, migrationInfo);

            const { doc, getDoc, updateDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js");
            
            const userRef = doc(this.db, 'user', userId);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                // 如果文檔不存在，創建新文檔
                const defaults = getAllDefaults();
                await this.createUserDocument(userId, defaults);
                console.log('已創建新用戶文檔:', userId);
                return true;
            }

            const userData = userSnap.data();
            const defaults = getAllDefaults();
            const updateFields = {};

            // 只更新缺少的字段
            migrationInfo.missingFields.forEach(fieldName => {
                updateFields[fieldName] = defaults[fieldName];
            });

            // 添加遷移時間戳
            updateFields.migratedAt = serverTimestamp();
            updateFields.updatedAt = serverTimestamp();

            await updateDoc(userRef, updateFields);

            console.log('用戶文檔遷移完成:', userId, '添加字段:', migrationInfo.missingFields);
            return true;
        } catch (error) {
            console.error('遷移用戶文檔失敗:', error);
            return false;
        }
    }

    /**
     * 批量遷移所有用戶文檔
     * @returns {Promise<Object>} 遷移結果
     */
    async migrateAllUsers() {
        try {
            if (!this.isInitialized) {
                await this.initialize();
            }

            const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js");
            
            const usersRef = collection(this.db, 'user');
            const usersSnap = await getDocs(usersRef);

            const results = {
                total: 0,
                migrated: 0,
                failed: 0,
                errors: []
            };

            for (const userDoc of usersSnap.docs) {
                results.total++;
                const userId = userDoc.id;
                
                try {
                    const success = await this.migrateUserDocument(userId);
                    if (success) {
                        results.migrated++;
                    } else {
                        results.failed++;
                        results.errors.push(`用戶 ${userId} 遷移失敗`);
                    }
                } catch (error) {
                    results.failed++;
                    results.errors.push(`用戶 ${userId} 遷移錯誤: ${error.message}`);
                }
            }

            console.log('批量遷移完成:', results);
            return results;
        } catch (error) {
            console.error('批量遷移失敗:', error);
            return {
                total: 0,
                migrated: 0,
                failed: 0,
                errors: [error.message]
            };
        }
    }

    /**
     * 獲取字段統計信息
     * @returns {Promise<Object>} 統計信息
     */
    async getFieldStatistics() {
        try {
            if (!this.isInitialized) {
                await this.initialize();
            }

            const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js");
            
            const usersRef = collection(this.db, 'user');
            const usersSnap = await getDocs(usersRef);

            const fieldStats = {};
            const allFields = Object.keys(USER_SCHEMA);
            
            // 初始化統計
            allFields.forEach(fieldName => {
                fieldStats[fieldName] = {
                    present: 0,
                    missing: 0,
                    percentage: 0
                };
            });

            let totalUsers = 0;

            usersSnap.forEach(userDoc => {
                totalUsers++;
                const userData = userDoc.data();
                
                allFields.forEach(fieldName => {
                    if (userData[fieldName] !== undefined && userData[fieldName] !== null) {
                        fieldStats[fieldName].present++;
                    } else {
                        fieldStats[fieldName].missing++;
                    }
                });
            });

            // 計算百分比
            allFields.forEach(fieldName => {
                const stats = fieldStats[fieldName];
                stats.percentage = totalUsers > 0 ? Math.round((stats.present / totalUsers) * 100) : 0;
            });

            return {
                totalUsers,
                fieldStats,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('獲取字段統計失敗:', error);
            return null;
        }
    }
}

// 創建全局實例
window.userFieldManager = new UserFieldManager();

// 自動初始化
document.addEventListener('DOMContentLoaded', () => {
    window.userFieldManager.initialize();
});

export default UserFieldManager;
