# 🚀 快速開始指南

本指南將幫助您快速設置並運行PBLS VR教學平台的React認證系統。

## 📋 前置要求

- Node.js 16+ 
- npm 或 yarn
- Firebase專案（[創建Firebase專案](https://console.firebase.google.com/)）

## ⚡ 快速設置

### 1. 安裝依賴

```bash
npm install
```

### 2. 設置環境變數

#### 方法A：使用自動設置工具（推薦）

```bash
npm run setup-env
```

按照提示輸入您的Firebase配置信息。

#### 方法B：手動設置

```bash
# 複製環境變數模板
cp env.template .env

# 編輯 .env 文件，填入您的Firebase配置
```

### 3. 啟動開發服務器

```bash
npm run dev
```

應用程式將在 `http://localhost:3000` 啟動。

## 🔧 Firebase配置

### 獲取Firebase配置

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 選擇您的專案
3. 點擊 ⚙️ → 「專案設定」
4. 滾動到「您的應用程式」→ 選擇Web應用程式
5. 複製配置值到 `.env` 文件

### 必需的環境變數

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## 🎯 功能測試

### 1. 註冊新用戶
- 訪問 `http://localhost:3000/login`
- 點擊「立即註冊」
- 填寫電子郵件和密碼
- 或使用Google登入

### 2. 登入系統
- 使用註冊的帳戶登入
- 測試Google登入功能
- 驗證登入狀態持久化

### 3. 訪問受保護內容
- 登入後訪問首頁
- 測試語言切換功能
- 驗證登出功能

## 🚀 部署

### 建置專案

```bash
npm run build
```

### 部署到Firebase Hosting

```bash
# 安裝Firebase CLI
npm install -g firebase-tools

# 登入Firebase
firebase login

# 初始化Firebase專案
firebase init

# 部署
firebase deploy
```

## 🔒 安全設置

### 1. Firestore規則

部署Firestore安全規則：

```bash
firebase deploy --only firestore:rules
```

### 2. 認證設置

在Firebase Console中：
- 啟用「電子郵件/密碼」認證
- 啟用「Google」認證
- 配置授權網域

## 🐛 常見問題

### 問題1：環境變數未載入

**解決方案**：
```bash
# 重新啟動開發服務器
npm run dev
```

### 問題2：Firebase初始化失敗

**解決方案**：
1. 檢查 `.env` 文件是否存在
2. 確認所有環境變數都已設置
3. 驗證Firebase配置是否正確

### 問題3：認證失敗

**解決方案**：
1. 檢查Firebase認證設置
2. 確認授權網域配置
3. 檢查瀏覽器控制台錯誤

## 📚 更多資源

- [Firebase文檔](https://firebase.google.com/docs)
- [Vite文檔](https://vitejs.dev/)
- [React文檔](https://react.dev/)
- [詳細部署指南](REACT_AUTH_DEPLOYMENT.md)
- [環境變數設置指南](FIREBASE_ENV_SETUP.md)

## 🎉 完成！

恭喜！您已經成功設置了PBLS VR教學平台的React認證系統。

現在您可以：
- ✅ 註冊和登入用戶
- ✅ 保護頁面內容
- ✅ 使用Google認證
- ✅ 管理用戶資料
- ✅ 部署到生產環境

如有問題，請參考詳細文檔或檢查控制台錯誤信息。
