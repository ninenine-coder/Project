# 快速設定指南

## 步驟1: 安裝依賴
```bash
npm install
```

## 步驟2: Firebase設定

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 建立新專案，專案名稱建議使用 "pbls-platform"
3. 在專案設定中找到 "您的應用程式" 區塊
4. 點擊 "新增應用程式" > "Web應用程式"
5. 應用程式暱稱輸入 "PBLS Platform"
6. 複製 Firebase 配置物件

## 步驟3: 更新配置檔案

開啟 `src/firebase/config.js`，將以下內容替換為您的Firebase配置：

```javascript
const firebaseConfig = {
  apiKey: "您的API金鑰",
  authDomain: "您的專案.firebaseapp.com",
  projectId: "您的專案ID",
  storageBucket: "您的專案.appspot.com",
  messagingSenderId: "您的發送者ID",
  appId: "您的應用程式ID"
}
```

## 步驟4: 啟用Firebase服務

### 啟用Authentication
1. 在Firebase Console中，點擊左側選單的 "Authentication"
2. 點擊 "開始使用"
3. 在 "登入方法" 標籤中，啟用：
   - 電子郵件/密碼
   - Google

### 啟用Firestore
1. 在Firebase Console中，點擊左側選單的 "Firestore Database"
2. 點擊 "建立資料庫"
3. 選擇 "測試模式"（開發階段）
4. 選擇離您最近的區域

## 步驟5: 啟動應用程式

```bash
npm run dev
```

應用程式將在 http://localhost:3000 啟動

## 測試登入功能

1. 開啟瀏覽器前往 http://localhost:3000
2. 點擊 "立即註冊" 建立測試帳號
3. 或使用 "使用 Google 登入" 功能
4. 登入成功後會跳轉到主要介面

## 常見問題

### Q: Firebase配置錯誤
A: 請確認您已正確複製Firebase配置物件，並檢查專案ID是否正確

### Q: 登入失敗
A: 請確認Firebase Authentication已啟用，並且登入方法已正確設定

### Q: 頁面無法載入
A: 請確認已執行 `npm install` 安裝所有依賴

## 下一步

- 自訂介面樣式和色彩
- 添加更多教學內容
- 整合VR影片播放功能
- 實作學習進度追蹤
