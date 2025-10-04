# Firebase環境變數配置指南

本指南將幫助您配置Firebase環境變數，以安全地管理Firebase配置。

## 📋 配置步驟

### 1. 創建環境變數文件

將 `env.template` 文件複製為 `.env`：

```bash
# Windows
copy env.template .env

# macOS/Linux
cp env.template .env
```

### 2. 獲取Firebase配置

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 選擇您的專案
3. 點擊設定圖標 ⚙️ → 「專案設定」
4. 滾動到「您的應用程式」部分
5. 選擇Web應用程式（如果沒有，點擊「新增應用程式」）
6. 複製配置值

### 3. 填寫環境變數

編輯 `.env` 文件，填入您的Firebase配置：

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyBuWO8hFVjjTUe2tqJDrqdbeGTrp4PoT5Q
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 🔧 配置說明

### 環境變數說明

| 變數名稱 | 說明 | 範例 |
|---------|------|------|
| `VITE_FIREBASE_API_KEY` | Firebase API密鑰 | `AIzaSyBuWO8hFVjjTUe2tqJDrqdbeGTrp4PoT5Q` |
| `VITE_FIREBASE_AUTH_DOMAIN` | 認證網域 | `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | 專案ID | `your-project-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | 儲存桶 | `your-project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | 訊息發送者ID | `123456789` |
| `VITE_FIREBASE_APP_ID` | 應用程式ID | `1:123456789:web:abcdef` |
| `VITE_FIREBASE_MEASUREMENT_ID` | Analytics測量ID（可選） | `G-XXXXXXXXXX` |

### 重要注意事項

1. **前綴要求**：所有變數必須以 `VITE_` 開頭才能被Vite讀取
2. **安全性**：`.env` 文件已加入 `.gitignore`，不會被提交到Git
3. **Next.js專案**：如果使用Next.js，請將前綴改為 `NEXT_PUBLIC_`
4. **Realtime Database**：如果使用Realtime Database，需要添加 `databaseURL`

## 🚀 使用方式

### 開發環境

```bash
# 安裝依賴
npm install

# 啟動開發服務器
npm run dev
```

### 生產環境

```bash
# 建置專案
npm run build

# 部署到Firebase Hosting
firebase deploy --only hosting
```

## 🔒 安全最佳實踐

### 1. 環境變數保護

- ✅ 不要將 `.env` 文件提交到版本控制
- ✅ 使用 `.env.example` 或 `env.template` 作為模板
- ✅ 在團隊中分享模板文件，而非實際配置

### 2. Firebase安全規則

確保您的Firestore規則正確設定：

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

### 3. 認證設定

- 啟用需要的認證方式（電子郵件/密碼、Google等）
- 設定授權網域
- 配置OAuth同意畫面（Google登入）

## 🐛 常見問題

### 問題1：環境變數未載入

**症狀**：應用程式顯示 "Missing required environment variables"

**解決方案**：
1. 確認 `.env` 文件存在於專案根目錄
2. 確認變數名稱以 `VITE_` 開頭
3. 重新啟動開發服務器

### 問題2：Firebase初始化失敗

**症狀**：Firebase相關錯誤

**解決方案**：
1. 檢查Firebase配置是否正確
2. 確認所有必要的環境變數都已設定
3. 檢查Firebase專案狀態

### 問題3：認證失敗

**症狀**：登入/註冊失敗

**解決方案**：
1. 檢查Firebase認證設定
2. 確認授權網域配置
3. 檢查API密鑰是否正確

## 📞 支援

如果遇到問題：

1. 檢查瀏覽器開發者工具的控制台錯誤
2. 確認Firebase控制台設定
3. 驗證環境變數配置
4. 查看Firebase文檔

## 🔄 遷移說明

如果您從舊的硬編碼配置遷移：

1. 創建 `.env` 文件
2. 將配置值從 `src/firebase/config.js` 移動到環境變數
3. 更新導入路徑（如果需要）
4. 測試應用程式功能

舊配置：
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  // ...
};
```

新配置：
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // ...
};
```
