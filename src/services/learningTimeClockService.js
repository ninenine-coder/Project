/**
 * 學習時間時鐘服務
 * 實現實時時鐘動畫和學習時間記錄功能
 */

// Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyBuWO8hFVjjTUe2tqJDrqdbeGTrp4PoT5Q",
    authDomain: "progect-115a5.firebaseapp.com",
    projectId: "progect-115a5"
};

class LearningTimeClockService {
    constructor() {
        this.currentUser = null;
        this.sessionStartTime = null;
        this.totalTimeSpent = 0; // 從Firebase獲取的總時間
        this.clockInterval = null;
        this.isRunning = false;
        this.isInitialized = false;
    }

    /**
     * 初始化學習時間時鐘服務
     */
    async initialize() {
        if (this.isInitialized) return;

        try {
            // 檢查用戶登入狀態
            this.currentUser = JSON.parse(localStorage.getItem('pbls_user') || 'null');
            if (!this.currentUser || !this.currentUser.uid) {
                console.warn('用戶未登入，無法初始化學習時間時鐘服務');
                return;
            }

            // 從Firebase獲取總學習時間
            await this.loadTotalTimeFromFirebase();
            
            // 記錄會話開始時間
            this.sessionStartTime = Date.now();
            
            // 立即更新一次顯示，確保從正確的起始時間開始
            this.updateClockDisplay();
            
            // 啟動時鐘動畫
            this.startClock();
            
            // 設置頁面離開時保存時間
            this.setupPageUnloadHandler();
            
            this.isInitialized = true;
            console.log('學習時間時鐘服務已初始化');
        } catch (error) {
            console.error('初始化學習時間時鐘服務失敗:', error);
        }
    }

    /**
     * 從Firebase載入總學習時間
     */
    async loadTotalTimeFromFirebase() {
        try {
            const { getFirestore, doc, getDoc } = await import("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js");
            const db = getFirestore();
            const userRef = doc(db, 'user', this.currentUser.uid);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
                const userData = userSnap.data();
                const firebaseTotalTime = userData.totalTimeSpent || 0;
                
                // 檢查本地是否有更舊的總時間，如果有則使用較大的值
                const localTotalTime = this.currentUser.totalTimeSpent || 0;
                this.totalTimeSpent = Math.max(firebaseTotalTime, localTotalTime);
                
                console.log(`從Firebase載入總學習時間: ${firebaseTotalTime} 秒`);
                console.log(`本地總學習時間: ${localTotalTime} 秒`);
                console.log(`使用總學習時間: ${this.totalTimeSpent} 秒 (${this.formatTime(this.totalTimeSpent)})`);
                
                // 更新本地用戶資料
                if (this.currentUser) {
                    this.currentUser.totalTimeSpent = this.totalTimeSpent;
                    localStorage.setItem('pbls_user', JSON.stringify(this.currentUser));
                }
                
                // 如果Firebase的時間較小，更新Firebase
                if (firebaseTotalTime < localTotalTime) {
                    await this.updateFirebaseTotalTime(this.totalTimeSpent);
                }
            } else {
                console.log('用戶資料不存在，初始化總學習時間為0');
                this.totalTimeSpent = 0;
            }
        } catch (error) {
            console.error('載入總學習時間失敗:', error);
            // 如果載入失敗，使用本地存儲的時間
            this.totalTimeSpent = this.currentUser.totalTimeSpent || 0;
            console.log(`使用本地總學習時間: ${this.totalTimeSpent} 秒`);
        }
    }

    /**
     * 啟動時鐘動畫
     */
    startClock() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.clockInterval = setInterval(() => {
            this.updateClockDisplay();
        }, 1000); // 每秒更新一次
        
        console.log('學習時間時鐘已啟動');
    }

    /**
     * 停止時鐘動畫
     */
    stopClock() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        if (this.clockInterval) {
            clearInterval(this.clockInterval);
            this.clockInterval = null;
        }
        
        console.log('學習時間時鐘已停止');
    }

    /**
     * 更新時鐘顯示
     */
    updateClockDisplay() {
        if (!this.sessionStartTime) return;
        
        // 計算當前會話時間
        const currentTime = Date.now();
        const sessionTime = Math.floor((currentTime - this.sessionStartTime) / 1000);
        
        // 總時間 = Firebase時間 + 當前會話時間
        const totalTime = this.totalTimeSpent + sessionTime;
        
        // 調試資訊（每10秒輸出一次）
        if (sessionTime % 10 === 0) {
            console.log(`時鐘更新 - Firebase時間: ${this.totalTimeSpent}秒, 會話時間: ${sessionTime}秒, 總時間: ${totalTime}秒`);
        }
        
        // 格式化時間顯示
        const formattedTime = this.formatTime(totalTime);
        
        // 更新所有時鐘顯示元素
        this.updateAllClockDisplays(formattedTime);
    }

    /**
     * 格式化時間為 "X:YY:ZZ" 格式
     */
    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * 更新所有時鐘顯示元素
     */
    updateAllClockDisplays(formattedTime) {
        // 更新歷史成績頁面的時鐘
        const historyClock = document.getElementById('totalTime');
        if (historyClock) {
            historyClock.textContent = formattedTime;
        }

        // 更新其他可能的時鐘顯示元素
        const clockElements = document.querySelectorAll('.learning-time-clock, #total-time-spent, .total-learning-time');
        clockElements.forEach(element => {
            element.textContent = formattedTime;
        });

        // 觸發自定義事件
        window.dispatchEvent(new CustomEvent('learningTimeUpdate', {
            detail: { formattedTime, totalSeconds: this.totalTimeSpent + Math.floor((Date.now() - this.sessionStartTime) / 1000) }
        }));
    }

    /**
     * 更新Firebase中的總學習時間
     */
    async updateFirebaseTotalTime(totalTime) {
        try {
            if (!this.currentUser) return;
            
            const { getFirestore, doc, updateDoc } = await import("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js");
            const db = getFirestore();
            const userRef = doc(db, 'user', this.currentUser.uid);
            
            await updateDoc(userRef, {
                totalTimeSpent: totalTime
            });
            
            console.log(`Firebase總學習時間已更新: ${totalTime} 秒`);
        } catch (error) {
            console.error('更新Firebase總學習時間失敗:', error);
        }
    }

    /**
     * 保存學習時間到Firebase
     */
    async saveTimeToFirebase() {
        try {
            if (!this.currentUser || !this.sessionStartTime) return 0;
            
            const { getFirestore, doc, updateDoc, increment } = await import("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js");
            const db = getFirestore();
            const userRef = doc(db, 'user', this.currentUser.uid);
            
            // 計算本次會話時間
            const currentTime = Date.now();
            const sessionTime = Math.floor((currentTime - this.sessionStartTime) / 1000);
            
            if (sessionTime > 0) {
                // 更新Firebase中的總學習時間
                await updateDoc(userRef, {
                    totalTimeSpent: increment(sessionTime)
                });
                
                // 更新本地總時間
                this.totalTimeSpent += sessionTime;
                if (this.currentUser) {
                    this.currentUser.totalTimeSpent = this.totalTimeSpent;
                    localStorage.setItem('pbls_user', JSON.stringify(this.currentUser));
                }
                
                console.log(`學習時間已保存到Firebase: ${sessionTime} 秒，總時間: ${this.totalTimeSpent} 秒`);
                return sessionTime;
            }
            
            return 0;
        } catch (error) {
            console.error('保存學習時間到Firebase失敗:', error);
            return 0;
        }
    }

    /**
     * 設置頁面離開時保存時間
     */
    setupPageUnloadHandler() {
        // 頁面離開時保存時間
        window.addEventListener('beforeunload', () => {
            this.saveTimeToFirebase();
        });

        // 頁面隱藏時保存時間
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveTimeToFirebase();
            }
        });

        // 定期保存時間（每5分鐘）
        setInterval(() => {
            this.saveTimeToFirebase();
        }, 5 * 60 * 1000);
    }

    /**
     * 獲取當前總學習時間（秒）
     */
    getCurrentTotalTime() {
        if (!this.sessionStartTime) return this.totalTimeSpent;
        
        const currentTime = Date.now();
        const sessionTime = Math.floor((currentTime - this.sessionStartTime) / 1000);
        return this.totalTimeSpent + sessionTime;
    }

    /**
     * 獲取格式化的當前時間
     */
    getCurrentFormattedTime() {
        return this.formatTime(this.getCurrentTotalTime());
    }

    /**
     * 重置時鐘
     */
    resetClock() {
        this.stopClock();
        this.totalTimeSpent = 0;
        this.sessionStartTime = Date.now();
        this.updateClockDisplay();
        this.startClock();
    }

    /**
     * 停止服務
     */
    stop() {
        this.stopClock();
        this.saveTimeToFirebase();
        this.isInitialized = false;
        console.log('學習時間時鐘服務已停止');
    }
}

// 創建全域實例
window.learningTimeClockService = new LearningTimeClockService();

// 自動初始化
document.addEventListener('DOMContentLoaded', () => {
    window.learningTimeClockService.initialize();
});

// 導出服務
export default LearningTimeClockService;
