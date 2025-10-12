/**
 * 學習時間追蹤服務
 * 基於用戶需求重新設計的學習時間追蹤系統
 */

import { auth, db } from '../../js/firebase.js';

class LearningTimeService {
    constructor() {
        this.currentUser = null;
        this.db = db;
        this.isInitialized = false;
        this.updateInterval = null;
        this.isPageVisible = true;
        this.isWindowFocused = true;
    }

    /**
     * 初始化服務
     */
    async initialize() {
        if (this.isInitialized) return;

        try {
            // 初始化 Firebase
            // Firebase 已通过 firebase.js 初始化，直接使用 db 实例

            // 取得目前用戶
            this.currentUser = JSON.parse(localStorage.getItem('pbls_user') || '{}');
            
            if (!this.currentUser.uid) {
                console.warn('用戶未登入，無法初始化學習時間服務');
                return;
            }

            // 如果是第一次登入，記錄會話開始時間
            if (!localStorage.getItem('sessionStartTime')) {
                this.recordLoginTime();
            }
            
            // 獲取總學習時間並顯示
            await this.initializeDisplay();

            // 設置頁面可見性和焦點檢測
            this.setupVisibilityHandlers();

            // 設置定期更新
            this.setupPeriodicUpdate();

            this.isInitialized = true;
            console.log('學習時間服務已初始化');
        } catch (error) {
            console.error('初始化學習時間服務失敗:', error);
        }
    }

    /**
     * 記錄會話開始時間
     */
    recordLoginTime() {
        const sessionStartTime = new Date();
        localStorage.setItem('sessionStartTime', sessionStartTime.toISOString());
        console.log('記錄會話開始時間:', sessionStartTime.toLocaleString());
    }

    /**
     * 獲取總學習時間
     */
    async getTotalLearningTime() {
        try {
            const { doc, getDoc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js");
            const userRef = doc(this.db, "user", this.currentUser.uid);
            const userDoc = await getDoc(userRef);
            
            if (userDoc.exists()) {
                // 取得用戶的總學習時間
                const userData = userDoc.data();
                const totalTime = userData.totalTimeSpent || 0;
                console.log(`從Firebase載入總學習時間: ${totalTime} 秒`);
                return totalTime;
            } else {
                // 如果用戶尚未儲存過資料，初始化並儲存
                await setDoc(userRef, { 
                    totalTimeSpent: 0, 
                    firstLogin: serverTimestamp(),
                    uid: this.currentUser.uid
                });
                console.log('初始化用戶資料，總學習時間設為0');
                return 0;
            }
        } catch (error) {
            console.error('獲取總學習時間失敗:', error);
            return 0;
        }
    }

    /**
     * 更新學習時間
     */
    async updateLearningTime(additionalTime) {
        try {
            const { doc, updateDoc, increment } = await import("https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js");
            const userRef = doc(this.db, "user", this.currentUser.uid);
            
            await updateDoc(userRef, {
                totalTimeSpent: increment(additionalTime),
                lastUpdate: new Date()
            });
            
            console.log(`學習時間已更新到Firebase: +${additionalTime} 秒`);
        } catch (error) {
            console.error('更新學習時間失敗:', error);
        }
    }

    /**
     * 計算當前會話時間
     */
    getCurrentSessionTime() {
        const sessionStartTime = localStorage.getItem('sessionStartTime');
        if (!sessionStartTime) return 0;
        
        const now = new Date();
        const startTime = new Date(sessionStartTime);
        const sessionTime = Math.floor((now - startTime) / 1000);
        
        return sessionTime;
    }

    /**
     * 初始化顯示
     */
    async initializeDisplay() {
        const totalLearningTime = await this.getTotalLearningTime();
        this.firebaseTime = totalLearningTime; // 保存Firebase時間
        const currentSessionTime = this.getCurrentSessionTime();
        const totalTime = totalLearningTime + currentSessionTime;
        
        this.updateDisplay(totalTime);
        console.log(`初始化顯示 - Firebase時間: ${totalLearningTime}秒, 會話時間: ${currentSessionTime}秒, 總時間: ${totalTime}秒`);
    }

    /**
     * 更新顯示
     */
    updateDisplay(totalSeconds) {
        const formattedTime = this.formatDuration(totalSeconds);
        
        // 更新所有時間顯示元素
        const timeElements = document.querySelectorAll('#totalTime, .total-learning-time, .learning-time-display');
        timeElements.forEach(element => {
            element.textContent = formattedTime;
        });

        // 觸發自定義事件
        window.dispatchEvent(new CustomEvent('learningTimeUpdate', {
            detail: { 
                formattedTime, 
                totalSeconds,
                firebaseTime: 0, // 將在實際實現中計算
                sessionTime: this.getCurrentSessionTime()
            }
        }));
    }

    /**
     * 格式化時間為 'H:MM:SS' 格式
     */
    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * 設置頁面可見性和焦點檢測
     */
    setupVisibilityHandlers() {
        // 頁面可見性變化檢測
        document.addEventListener('visibilitychange', () => {
            this.isPageVisible = !document.hidden;
            console.log(`頁面可見性變化: ${this.isPageVisible ? '可見' : '隱藏'}`);
        });

        // 視窗焦點變化檢測
        window.addEventListener('focus', () => {
            this.isWindowFocused = true;
            console.log('視窗獲得焦點');
        });

        window.addEventListener('blur', () => {
            this.isWindowFocused = false;
            console.log('視窗失去焦點');
        });

        // 頁面載入時檢查初始狀態
        this.isPageVisible = !document.hidden;
        this.isWindowFocused = document.hasFocus();
    }

    /**
     * 設置定期更新
     */
    setupPeriodicUpdate() {
        // 每秒更新顯示
        this.updateInterval = setInterval(() => {
            if (this.isPageVisible && this.isWindowFocused) {
                this.updateDisplayFromSessionSync();
            }
        }, 1000);

        // 每5分鐘保存一次到Firebase
        setInterval(() => {
            this.saveCurrentSession();
        }, 5 * 60 * 1000);
    }

    /**
     * 從會話更新顯示（同步版本）
     */
    updateDisplayFromSessionSync() {
        const currentSessionTime = this.getCurrentSessionTime();
        // 使用已保存的Firebase時間
        const firebaseTime = this.firebaseTime || 0;
        const totalTime = firebaseTime + currentSessionTime;
        this.updateDisplay(totalTime);
    }

    /**
     * 從會話更新顯示（異步版本）
     */
    async updateDisplayFromSession() {
        const currentSessionTime = this.getCurrentSessionTime();
        // 從Firebase獲取基礎時間
        const firebaseTime = await this.getTotalLearningTime();
        this.firebaseTime = firebaseTime; // 保存Firebase時間
        const totalTime = firebaseTime + currentSessionTime;
        this.updateDisplay(totalTime);
    }

    /**
     * 保存當前會話
     */
    async saveCurrentSession() {
        if (!this.isPageVisible || !this.isWindowFocused) return;
        
        const sessionTime = this.getCurrentSessionTime();
        if (sessionTime > 0) {
            await this.updateLearningTime(sessionTime);
            // 重置會話開始時間
            this.recordLoginTime();
        }
    }

    /**
     * 處理登出
     */
    async handleLogout() {
        try {
            const sessionStartTime = localStorage.getItem('sessionStartTime');
            if (sessionStartTime) {
                const sessionDuration = Math.floor((new Date() - new Date(sessionStartTime)) / 1000);
                if (sessionDuration > 0) {
                    await this.updateLearningTime(sessionDuration);
                    console.log(`登出時保存學習時間: ${sessionDuration} 秒`);
                }
            }
            
            // 清除會話開始時間
            localStorage.removeItem('sessionStartTime');
            
            // 停止服務
            this.stop();
            
            console.log('學習時間服務已停止');
        } catch (error) {
            console.error('處理登出時發生錯誤:', error);
        }
    }

    /**
     * 停止服務
     */
    stop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        
        this.isInitialized = false;
    }
}

// 創建全域實例
window.learningTimeService = new LearningTimeService();

// 自動初始化
document.addEventListener('DOMContentLoaded', () => {
    window.learningTimeService.initialize();
});

// 導出服務
export default LearningTimeService;
