// Firebase 配置修復腳本
// 請將 YOUR_ACTUAL_APP_ID 替換為從 Firebase Console 獲取的完整 App ID

const YOUR_ACTUAL_APP_ID = "1:109099222287:web:YOUR_ACTUAL_APP_ID"; // 請替換為實際的 App ID

console.log("Firebase 配置修復腳本");
console.log("請按照以下步驟修復配置：");
console.log("");
console.log("1. 前往 Firebase Console: https://console.firebase.google.com/");
console.log("2. 選擇專案 'Progect'");
console.log("3. 點擊 ⚙️ 設定 > 專案設定");
console.log("4. 在 '您的應用程式' 區段找到 Web 應用程式");
console.log("5. 複製完整的 App ID");
console.log("6. 將 YOUR_ACTUAL_APP_ID 替換為實際的 App ID");
console.log("");
console.log("需要更新的文件：");
console.log("- login.html (第19行)");
console.log("- firebase-config.js (第10行)");
console.log("- src/firebase/config.js (第12行)");
console.log("");
console.log("修復後的配置應該是：");
console.log("appId: \"" + YOUR_ACTUAL_APP_ID + "\"");

// 檢查當前配置
const currentConfig = {
    apiKey: "AIzaSyBuWO8hFVjjTUe2tqJDrqdbeGTrp4PoT5Q",
    authDomain: "progect-115a5.firebaseapp.com",
    projectId: "progect-115a5",
    storageBucket: "progect-115a5.appspot.com",
    messagingSenderId: "109099222287",
    appId: "1:109099222287:web:your-app-id"
};

console.log("");
console.log("當前配置：");
console.log(JSON.stringify(currentConfig, null, 2));
