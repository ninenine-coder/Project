/**
 * 上線時間記錄服務
 * 用於記錄用戶在平台上的總上線時間
 */

import { auth, db } from '../../js/firebase.js';

class OnlineTimeService {
    constructor() {
        this.currentUser = null;
        this.sessionStartTime = null;
        this.updateInterval = null;
        this.isInitialized = false;
    }

    /**
     * 初始化上線時間服務
     */
    async initialize() {
        if (this.isInitialized) return;

        try {
            // 檢查用戶登入狀態
            this.currentUser = JSON.parse(localStorage.getItem('pbls_user') || 'null');
            if (!this.currentUser || !this.currentUser.uid) {
                console.warn('用戶未登入，無法記錄上線時間');
                return;
            }

            // 記錄會話開始時間
            this.sessionStartTime = Date.now();
            
            // 立即記錄一次上線時間
            await this.recordOnlineTime();
            
            // 設置定期更新（每5分鐘）
            this.updateInterval = setInterval(() => {
                this.recordOnlineTime();
            }, 5 * 60 * 1000);

            // 頁面離開時記錄
            window.addEventListener('beforeunload', () => {
                this.recordOnlineTime();
            });

            this.isInitialized = true;
            console.log('上線時間服務已初始化');
        } catch (error) {
            console.error('初始化上線時間服務失敗:', error);
        }
    }

    /**
     * 記錄上線時間到 Firestore
     */
    async recordOnlineTime() {
        try {
            if (!this.currentUser || !this.currentUser.uid) return;

            const { doc, getDoc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js");
            
            const userRef = doc(db, 'user', this.currentUser.uid);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
                const userData = userSnap.data();
                const currentTime = Date.now();
                const lastUpdate = userData.lastOnlineTimeUpdate || currentTime;
                
                // 計算本次會話時間（秒）
                const sessionTime = Math.floor((currentTime - lastUpdate) / 1000);
                
                // 只記錄有意義的時間（大於30秒）
                if (sessionTime > 30) {
                    const newTotalTime = (userData.totalOnlineTime || 0) + sessionTime;
                    
                    // 更新 Firestore
                    await setDoc(userRef, {
                        totalOnlineTime: newTotalTime,
                        lastOnlineTimeUpdate: currentTime
                    }, { merge: true });
                    
                    // 更新本地存儲
                    const localUserData = JSON.parse(localStorage.getItem('pbls_user') || '{}');
                    localUserData.totalOnlineTime = newTotalTime;
                    localStorage.setItem('pbls_user', JSON.stringify(localUserData));
                    
                    console.log(`記錄上線時間: ${sessionTime}秒，總時間: ${newTotalTime}秒`);
                }
            }
        } catch (error) {
            console.error('記錄上線時間失敗:', error);
        }
    }

    /**
     * 獲取總上線時間
     */
    getTotalOnlineTime() {
        const userData = JSON.parse(localStorage.getItem('pbls_user') || '{}');
        return userData.totalOnlineTime || 0;
    }

    /**
     * 格式化時間顯示
     */
    formatDuration(seconds) {
        if (!seconds || seconds === 0) return '-';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}時${minutes}分${secs}秒`;
        } else if (minutes > 0) {
            return `${minutes}分${secs}秒`;
        } else {
            return `${secs}秒`;
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
        
        // 最後記錄一次
        this.recordOnlineTime();
        
        this.isInitialized = false;
        console.log('上線時間服務已停止');
    }
}

// 創建全域實例
window.onlineTimeService = new OnlineTimeService();

// 自動初始化
document.addEventListener('DOMContentLoaded', () => {
    window.onlineTimeService.initialize();
});

// 導出服務
export default OnlineTimeService;
