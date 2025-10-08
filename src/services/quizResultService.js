/**
 * 測驗結果服務
 * 用於處理測驗完成後的數據保存和統計更新
 */

// Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyBuWO8hFVjjTUe2tqJDrqdbeGTrp4PoT5Q",
    authDomain: "progect-115a5.firebaseapp.com",
    projectId: "progect-115a5",
    storageBucket: "progect-115a5.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

class QuizResultService {
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
            // 動態導入 Firebase Firestore
            const { initializeApp } = await import("https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js");
            const { getFirestore, doc, updateDoc, increment, serverTimestamp, arrayUnion } = await import("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js");
            
            // 初始化 Firebase
            const app = initializeApp(firebaseConfig);
            this.db = getFirestore(app);
            
            this.isInitialized = true;
            console.log('測驗結果服務已初始化');
        } catch (error) {
            console.error('初始化測驗結果服務失敗:', error);
        }
    }

    /**
     * 獲取當前用戶
     */
    getCurrentUser() {
        const userData = localStorage.getItem('pbls_user');
        if (!userData) {
            console.warn('用戶未登入');
            return null;
        }
        
        try {
            return JSON.parse(userData);
        } catch (error) {
            console.error('解析用戶數據失敗:', error);
            return null;
        }
    }

    /**
     * 保存測驗結果並更新統計數據
     * @param {Object} quizResult - 測驗結果數據
     * @param {number} quizResult.score - 分數
     * @param {number} quizResult.correctAnswers - 答對題數
     * @param {number} quizResult.totalQuestions - 總題數
     * @param {number} quizResult.totalTime - 總用時（秒）
     * @param {Array} quizResult.answers - 答案詳情
     */
    async saveQuizResult(quizResult) {
        try {
            // 確保服務已初始化
            if (!this.isInitialized) {
                await this.initialize();
            }

            const currentUser = this.getCurrentUser();
            if (!currentUser || !currentUser.uid) {
                console.error('用戶未登入，無法保存測驗結果');
                return false;
            }

            console.log('開始保存測驗結果:', quizResult);

            // 準備測驗結果數據
            const resultData = {
                date: new Date().toISOString(),
                score: quizResult.score,
                correctAnswers: quizResult.correctAnswers,
                totalQuestions: quizResult.totalQuestions,
                totalTime: quizResult.totalTime,
                answers: quizResult.answers || []
            };

            // 更新用戶文檔
            const userRef = doc(this.db, 'user', currentUser.uid);
            
            // 使用 Firestore 的 increment 操作來原子性地增加總測驗次數
            await updateDoc(userRef, {
                totaltesttimes: increment(1), // 總測驗次數 +1
                totalTimeSpent: increment(quizResult.totalTime), // 總用時增加
                lastQuizDate: serverTimestamp(), // 最後測驗時間
                updatedAt: serverTimestamp() // 更新時間
            });

            // 保存詳細的測驗結果到子集合
            await this.saveDetailedQuizResult(currentUser.uid, resultData);

            console.log('測驗結果已成功保存到 Firebase');
            
            // 觸發事件通知其他組件
            window.dispatchEvent(new CustomEvent('quizResultSaved', {
                detail: {
                    userId: currentUser.uid,
                    result: resultData
                }
            }));

            return true;
        } catch (error) {
            console.error('保存測驗結果失敗:', error);
            return false;
        }
    }

    /**
     * 保存詳細的測驗結果到子集合
     * @param {string} userId - 用戶ID
     * @param {Object} resultData - 測驗結果數據
     */
    async saveDetailedQuizResult(userId, resultData) {
        try {
            const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js");
            
            // 保存到 quizResults 子集合
            const quizResultsRef = collection(this.db, 'user', userId, 'quizResults');
            await addDoc(quizResultsRef, {
                ...resultData,
                createdAt: serverTimestamp()
            });

            console.log('詳細測驗結果已保存到子集合');
        } catch (error) {
            console.error('保存詳細測驗結果失敗:', error);
            // 不拋出錯誤，因為主要統計數據已經更新
        }
    }

    /**
     * 獲取用戶的測驗統計
     * @returns {Promise<Object>} 測驗統計數據
     */
    async getUserQuizStats() {
        try {
            if (!this.isInitialized) {
                await this.initialize();
            }

            const currentUser = this.getCurrentUser();
            if (!currentUser || !currentUser.uid) {
                return null;
            }

            const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js");
            const userRef = doc(this.db, 'user', currentUser.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                return {
                    totaltesttimes: userData.totaltesttimes || 0,
                    totalTimeSpent: userData.totalTimeSpent || 0,
                    lastQuizDate: userData.lastQuizDate,
                    averageScore: await this.calculateAverageScore(currentUser.uid)
                };
            }

            return null;
        } catch (error) {
            console.error('獲取用戶測驗統計失敗:', error);
            return null;
        }
    }

    /**
     * 計算平均分數
     * @param {string} userId - 用戶ID
     * @returns {Promise<number>} 平均分數
     */
    async calculateAverageScore(userId) {
        try {
            const { collection, getDocs, query, orderBy, limit } = await import("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js");
            
            const quizResultsRef = collection(this.db, 'user', userId, 'quizResults');
            const q = query(quizResultsRef, orderBy('date', 'desc'), limit(10)); // 最近10次測驗
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return 0;
            }

            let totalScore = 0;
            let count = 0;

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                totalScore += data.score || 0;
                count++;
            });

            return count > 0 ? Math.round(totalScore / count) : 0;
        } catch (error) {
            console.error('計算平均分數失敗:', error);
            return 0;
        }
    }

    /**
     * 獲取最近的測驗結果
     * @param {number} limit - 限制數量，默認10
     * @returns {Promise<Array>} 測驗結果列表
     */
    async getRecentQuizResults(limit = 10) {
        try {
            if (!this.isInitialized) {
                await this.initialize();
            }

            const currentUser = this.getCurrentUser();
            if (!currentUser || !currentUser.uid) {
                return [];
            }

            const { collection, getDocs, query, orderBy, limit: limitQuery } = await import("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js");
            
            const quizResultsRef = collection(this.db, 'user', currentUser.uid, 'quizResults');
            const q = query(quizResultsRef, orderBy('date', 'desc'), limitQuery(limit));
            const querySnapshot = await getDocs(q);

            const results = [];
            querySnapshot.forEach((doc) => {
                results.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return results;
        } catch (error) {
            console.error('獲取最近測驗結果失敗:', error);
            return [];
        }
    }
}

// 創建全局實例
window.quizResultService = new QuizResultService();

// 自動初始化
document.addEventListener('DOMContentLoaded', () => {
    window.quizResultService.initialize();
});

// 導出服務
export default QuizResultService;
