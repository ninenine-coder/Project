// Firebase設定檢查工具
// 這個檔案可以幫助您檢查Firebase配置是否正確

console.log('========================================');
console.log('    PBLS VR教學平台 - Firebase設定檢查');
console.log('========================================');
console.log('');

// 檢查Firebase配置檔案是否存在
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'src', 'firebase', 'config.js');

console.log('1. 檢查Firebase配置檔案...');
if (fs.existsSync(configPath)) {
    console.log('✅ Firebase配置檔案存在');
    
    // 讀取配置檔案內容
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // 檢查是否包含預設配置
    if (configContent.includes('your-api-key')) {
        console.log('⚠️  警告: 檢測到預設配置，請更新為您的Firebase配置');
        console.log('');
        console.log('請按照以下步驟設定Firebase:');
        console.log('1. 前往 https://console.firebase.google.com/');
        console.log('2. 建立新專案或選擇現有專案');
        console.log('3. 啟用 Authentication 和 Firestore');
        console.log('4. 複製專案配置到 src/firebase/config.js');
        console.log('');
    } else {
        console.log('✅ Firebase配置已更新');
    }
} else {
    console.log('❌ Firebase配置檔案不存在');
    console.log('請確認檔案路徑: src/firebase/config.js');
}

console.log('');

// 檢查必要的Firebase服務
console.log('2. Firebase服務檢查清單:');
console.log('   □ Authentication (電子郵件/密碼)');
console.log('   □ Authentication (Google登入) - 可選');
console.log('   □ Firestore Database');
console.log('');

console.log('3. 設定完成後，請執行:');
console.log('   npm run dev');
console.log('');

console.log('4. 測試步驟:');
console.log('   1. 開啟 http://localhost:3000');
console.log('   2. 嘗試註冊新帳號');
console.log('   3. 嘗試登入');
console.log('   4. 檢查是否成功跳轉到主要介面');
console.log('');

console.log('如需詳細說明，請參考 README.md 或 INSTALLATION_GUIDE.md');
console.log('========================================');
