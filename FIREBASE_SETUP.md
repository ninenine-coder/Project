# Firebase 設置指南

## 🔥 Firebase Authentication 設置步驟

### 1. 創建Firebase項目
1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 點擊「創建項目」或「Add project」
3. 輸入項目名稱（例如：pbls-vr-platform）
4. 選擇是否啟用Google Analytics（可選）
5. 點擊「創建項目」

### 2. 啟用Authentication
1. 在Firebase Console中，點擊左側選單的「Authentication」
2. 點擊「開始使用」
3. 在「Sign-in method」標籤中：
   - 啟用「電子郵件/密碼」
   - 啟用「Google」

### 3. 獲取配置信息
1. 在Firebase Console中，點擊左側選單的「Project settings」（齒輪圖標）
2. 滾動到「Your apps」部分
3. 點擊「Web」圖標（</>）來添加Web應用
4. 輸入應用名稱（例如：PBLS VR Platform）
5. 複製配置信息

### 4. 更新配置文件
將獲取的配置信息更新到 `firebase-config.js` 文件中：

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};
```

### 5. 更新登入頁面配置
在 `login.html` 中，將第14-21行的配置替換為您的實際配置：

```javascript
const firebaseConfig = {
    apiKey: "您的API密鑰",
    authDomain: "您的項目.firebaseapp.com",
    projectId: "您的項目ID",
    storageBucket: "您的項目.appspot.com",
    messagingSenderId: "您的發送者ID",
    appId: "您的應用ID"
};
```

## 🔐 認證功能

### 已實現的功能：
- ✅ 電子郵件/密碼登入
- ✅ Google帳號登入
- ✅ 自動登入狀態檢查
- ✅ 登出功能
- ✅ 錯誤處理和用戶友好的錯誤訊息

### 支援的登入方式：
1. **電子郵件登入**：用戶可以使用電子郵件和密碼登入
2. **Google登入**：用戶可以使用Google帳號快速登入

### 安全特性：
- 🔒 Firebase Authentication提供企業級安全
- 🔒 自動密碼加密和驗證
- 🔒 防止暴力破解攻擊
- 🔒 安全的會話管理

## 🚀 部署注意事項

### GitHub Pages部署：
1. 確保Firebase配置正確
2. 在Firebase Console中設置授權域名
3. 添加您的GitHub Pages域名到授權域名列表

### 本地測試：
1. 確保所有Firebase配置正確
2. 使用 `http://localhost` 或 `https://localhost` 進行測試
3. 檢查瀏覽器控制台是否有錯誤訊息

## 🛠️ 故障排除

### 常見問題：
1. **配置錯誤**：檢查Firebase配置是否正確
2. **域名未授權**：在Firebase Console中添加您的域名
3. **Google登入失敗**：檢查Google OAuth設置
4. **網路問題**：檢查網路連接和防火牆設置

### 調試步驟：
1. 打開瀏覽器開發者工具
2. 檢查Console中的錯誤訊息
3. 檢查Network標籤中的請求狀態
4. 確認Firebase配置是否正確載入

## 📞 技術支援

如果遇到問題，請檢查：
1. Firebase Console中的錯誤日誌
2. 瀏覽器控制台的錯誤訊息
3. 網路連接狀態
4. Firebase項目設置

---

**注意**：請確保將示例配置替換為您的實際Firebase項目配置，以確保應用程序正常工作。




