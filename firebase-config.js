// Firebase配置文件
// 請替換為您的實際Firebase項目配置

const firebaseConfig = {
    apiKey: "AIzaSyBuWO8hFVjjTUe2tqJDrqdbeGTrp4PoT5Q",
    authDomain: "progect-115a5.firebaseapp.com",
    projectId: "progect-115a5",
    storageBucket: "progect-115a5.appspot.com",
    messagingSenderId: "109099222287",
    appId: "1:109099222287:web:your-app-id" // 需要從 Firebase Console 獲取完整 App ID
};

// 導出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = firebaseConfig;
} else {
    window.firebaseConfig = firebaseConfig;
}