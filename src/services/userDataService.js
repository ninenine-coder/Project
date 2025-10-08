/**
 * 用戶資料服務
 * 用於管理用戶資料的獲取、更新和顯示
 */

import { applyDefaults } from '../schemas/userSchema.js';

// Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyBuWO8hFVjjTUe2tqJDrqdbeGTrp4PoT5Q",
    authDomain: "progect-115a5.firebaseapp.com",
    projectId: "progect-115a5",
    storageBucket: "progect-115a5.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

class UserDataService {
    constructor() {
        this.currentUser = null;
        this.isInitialized = false;
    }

    /**
     * 初始化用戶資料服務
     */
    async initialize() {
        if (this.isInitialized) return;

        try {
            // 從localStorage獲取當前用戶
            this.currentUser = JSON.parse(localStorage.getItem('pbls_user') || 'null');
            
            if (!this.currentUser || !this.currentUser.uid) {
                console.warn('用戶未登入，無法初始化用戶資料服務');
                return;
            }

            // 從Firestore獲取最新的用戶資料
            await this.refreshUserData();
            
            this.isInitialized = true;
            console.log('用戶資料服務已初始化');
        } catch (error) {
            console.error('初始化用戶資料服務失敗:', error);
        }
    }

    /**
     * 從Firestore獲取最新的用戶資料
     */
    async refreshUserData() {
        try {
            if (!this.currentUser || !this.currentUser.uid) return;

            const { getFirestore, doc, getDoc } = await import("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js");
            const db = getFirestore();
            
            const userRef = doc(db, 'user', this.currentUser.uid);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
                const userData = userSnap.data();
                
                // 應用預設值並更新本地用戶資料
                const userDataWithDefaults = applyDefaults(userData);
                
                this.currentUser = {
                    ...this.currentUser,
                    ...userDataWithDefaults,
                    // 確保兼容性字段
                    name: userDataWithDefaults["姓名"] || userDataWithDefaults.name,
                    displayName: userDataWithDefaults["姓名"] || userDataWithDefaults.name,
                    where: userDataWithDefaults["school/hospital"] || userDataWithDefaults.school || userDataWithDefaults.where
                };
                
                // 更新localStorage
                localStorage.setItem('pbls_user', JSON.stringify(this.currentUser));
                
                console.log('用戶資料已更新（包含預設值）');
                return this.currentUser;
            }
        } catch (error) {
            console.error('刷新用戶資料失敗:', error);
        }
        return null;
    }

    /**
     * 獲取當前用戶資料
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * 獲取用戶顯示名稱
     */
    getDisplayName() {
        return this.currentUser?.name || this.currentUser?.displayName || '未知用戶';
    }

    /**
     * 獲取用戶單位資訊
     */
    getUserInfo() {
        if (!this.currentUser) return '未登入';
        
        // 優先使用 where 欄位，如果沒有則使用 school 欄位
        const unit = this.currentUser.where || this.currentUser.school || '未知單位';
        const department = this.currentUser.department || '未知系所';
        
        return `${unit}, ${department}`;
    }

    /**
     * 獲取總測驗次數
     */
    getTotalExamCount() {
        return this.currentUser?.totaltesttimes || 0;
    }

    /**
     * 獲取總練習時間
     */
    getTotalTimeSpent() {
        return this.currentUser?.totalTimeSpent || 0;
    }

    /**
     * 格式化時間顯示
     */
    formatDuration(seconds) {
        if (!seconds || seconds === 0) return '0:00:00';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        // 格式為 "3:12:11"
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * 更新頁面中的用戶資訊顯示
     */
    updateUserInfoDisplay() {
        if (!this.currentUser) return;

        // 更新用戶資訊顯示
        const userInfoElements = document.querySelectorAll('.user-info');
        userInfoElements.forEach(element => {
            element.textContent = this.getUserInfo();
        });

        // 更新用戶名稱顯示
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(element => {
            element.textContent = this.getDisplayName();
        });

        // 更新總測驗次數顯示
        const examCountElements = document.querySelectorAll('#totalAttempts');
        examCountElements.forEach(element => {
            element.textContent = this.getTotalExamCount();
        });

        // 更新總練習時間顯示
        const timeSpentElements = document.querySelectorAll('#totalTime');
        timeSpentElements.forEach(element => {
            element.textContent = this.formatDuration(this.getTotalTimeSpent());
        });

        console.log('用戶資訊顯示已更新');
    }

    /**
     * 檢查用戶登入狀態
     */
    isLoggedIn() {
        return this.currentUser && this.currentUser.uid;
    }

    /**
     * 登出用戶
     */
    logout() {
        this.currentUser = null;
        localStorage.removeItem('pbls_user');
        localStorage.removeItem('pbls_user_profile');
        this.isInitialized = false;
        console.log('用戶已登出');
    }
}

// 創建全域實例
window.userDataService = new UserDataService();

// 自動初始化
document.addEventListener('DOMContentLoaded', () => {
    window.userDataService.initialize().then(() => {
        // 初始化完成後更新顯示
        window.userDataService.updateUserInfoDisplay();
    });
});

// 導出服務
export default UserDataService;
