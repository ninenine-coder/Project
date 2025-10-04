# React認證系統部署指南

本指南將幫助您部署完整的React認證系統，包括Firebase認證、Firestore資料庫和路由功能。

## 📋 部署前準備

### 1. Firebase專案設定

#### 1.1 創建Firebase專案
1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 點擊「新增專案」
3. 輸入專案名稱：`pbls-vr-platform`
4. 啟用Google Analytics（可選）

#### 1.2 啟用認證服務
1. 在Firebase Console中，點擊「Authentication」
2. 點擊「開始使用」
3. 在「Sign-in method」標籤中：
   - 啟用「電子郵件/密碼」
   - 啟用「Google」登入
4. 配置Google OAuth：
   - 添加授權網域
   - 設定OAuth同意畫面

#### 1.3 設定Firestore資料庫
1. 點擊「Firestore Database」
2. 點擊「建立資料庫」
3. 選擇「測試模式」開始（稍後會設定安全規則）
4. 選擇資料庫位置

#### 1.4 部署Firestore規則
```bash
# 安裝Firebase CLI
npm install -g firebase-tools

# 登入Firebase
firebase login

# 初始化Firebase專案
firebase init

# 部署Firestore規則
firebase deploy --only firestore:rules
```

### 2. 更新Firebase配置

編輯 `src/firebase/config.js`：
```javascript
const firebaseConfig = {
  apiKey: "您的API密鑰",
  authDomain: "您的專案ID.firebaseapp.com",
  projectId: "您的專案ID",
  storageBucket: "您的專案ID.appspot.com",
  messagingSenderId: "您的發送者ID",
  appId: "您的應用程式ID"
}
```

## 🚀 部署步驟

### 1. 安裝依賴
```bash
npm install
```

### 2. 建置專案
```bash
npm run build
```

### 3. 部署到Firebase Hosting
```bash
# 初始化Firebase Hosting（如果尚未設定）
firebase init hosting

# 部署到Firebase Hosting
firebase deploy --only hosting
```

### 4. 部署Firestore規則
```bash
firebase deploy --only firestore:rules
```

## 🔧 配置說明

### 1. 路由配置
- `/` - 首頁（需要登入）
- `/login` - 登入頁面
- `/info` - 資訊頁面（需要登入）

### 2. 認證流程
1. 未登入用戶訪問首頁時會自動重定向到登入頁面
2. 登入成功後會重定向回首頁
3. 登入狀態會持久化保存在瀏覽器中

### 3. 資料結構
```
users/{uid}
├── uid: string
├── email: string
├── displayName: string
├── photoURL: string
├── createdAt: timestamp
├── updatedAt: timestamp
├── lastLoginAt: timestamp
├── quizResults: array
└── learningProgress: object
```

## 🔒 安全規則

### Firestore規則
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

### 認證設定
- 電子郵件/密碼認證
- Google OAuth認證
- 密碼最小長度：6個字符

## 📱 功能特色

### 1. 認證功能
- ✅ 電子郵件註冊/登入
- ✅ Google登入
- ✅ 自動登入狀態檢查
- ✅ 登出功能
- ✅ 錯誤訊息顯示

### 2. 用戶介面
- ✅ 響應式設計
- ✅ 載入狀態顯示
- ✅ 錯誤處理
- ✅ 美觀的動畫效果

### 3. 資料管理
- ✅ 用戶資料自動創建
- ✅ 測驗結果保存
- ✅ 學習進度追蹤
- ✅ 資料安全保護

## 🧪 測試

### 1. 認證測試
1. 註冊新帳戶
2. 登入/登出功能
3. Google登入
4. 錯誤處理

### 2. 路由測試
1. 未登入用戶重定向
2. 登入後頁面訪問
3. 瀏覽器前進/後退

### 3. 資料測試
1. 用戶資料創建
2. 測驗結果保存
3. 學習進度更新

## 🐛 常見問題

### 1. 認證問題
**問題**：Google登入失敗
**解決**：檢查OAuth配置和授權網域設定

**問題**：電子郵件認證失敗
**解決**：確認Firebase專案中已啟用電子郵件認證

### 2. 路由問題
**問題**：頁面刷新後路由失效
**解決**：確保Firebase Hosting配置正確

### 3. 資料問題
**問題**：Firestore讀寫失敗
**解決**：檢查安全規則和認證狀態

## 📞 支援

如果遇到問題，請檢查：
1. Firebase控制台設定
2. 瀏覽器開發者工具錯誤訊息
3. 網路連線狀態
4. Firebase專案配置

## 🎯 下一步

1. 自定義用戶介面
2. 添加更多認證方式
3. 實現進階功能
4. 優化性能
5. 添加測試覆蓋率
