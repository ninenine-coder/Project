// Firebase 快速修復腳本
console.log("🔧 Firebase 快速修復腳本");
console.log("=====================================");

// 檢查當前配置
const currentConfig = {
    apiKey: "AIzaSyBuWO8hFVjjTUe2tqJDrqdbeGTrp4PoT5Q",
    authDomain: "progect-115a5.firebaseapp.com",
    projectId: "progect-115a5",
    storageBucket: "progect-115a5.appspot.com",
    messagingSenderId: "109099222287",
    appId: "1:109099222287:web:your-app-id"
};

console.log("📋 當前配置狀態：");
console.log(JSON.stringify(currentConfig, null, 2));

console.log("\n⚠️ 發現的問題：");
console.log("1. App ID 未正確配置 (your-app-id)");
console.log("2. firebase-config.js 使用了 ES6 模組語法");
console.log("3. 可能存在 Firebase 初始化衝突");

console.log("\n🔧 修復步驟：");
console.log("1. 前往 Firebase Console: https://console.firebase.google.com/");
console.log("2. 選擇專案 'Progect'");
console.log("3. 點擊 ⚙️ 設定 > 專案設定");
console.log("4. 在 '您的應用程式' 區段找到 Web 應用程式");
console.log("5. 複製完整的 App ID (格式: 1:109099222287:web:xxxxxxxxxxxxxxxx)");
console.log("6. 將以下文件中的 'your-app-id' 替換為完整的 App ID:");
console.log("   - login.html (第19行)");
console.log("   - firebase-config.js (第10行)");
console.log("   - src/firebase/config.js (第12行)");

console.log("\n✅ 已修復的問題：");
console.log("1. firebase-config.js 已移除 ES6 模組語法");
console.log("2. 統一使用傳統 Firebase v8 語法");

console.log("\n📝 修復後的配置模板：");
const fixedConfig = {
    apiKey: "AIzaSyBuWO8hFVjjTUe2tqJDrqdbeGTrp4PoT5Q",
    authDomain: "progect-115a5.firebaseapp.com",
    projectId: "progect-115a5",
    storageBucket: "progect-115a5.appspot.com",
    messagingSenderId: "109099222287",
    appId: "1:109099222287:web:YOUR_ACTUAL_APP_ID" // 替換為實際的 App ID
};

console.log(JSON.stringify(fixedConfig, null, 2));

console.log("\n🎯 下一步：");
console.log("1. 獲取完整的 App ID");
console.log("2. 更新所有文件中的 App ID");
console.log("3. 在 Firebase Console 中啟用 Google 登入");
console.log("4. 設置授權網域 (localhost)");
console.log("5. 測試 Google 登入功能");

console.log("\n🔍 測試工具：");
console.log("打開 firebase-debug-fix.html 進行完整檢查");
