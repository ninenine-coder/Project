# PBLS VR教學平台

這是一個基於Vue 3和Firebase的VR教學平台，提供360度實境教學影片和互動學習功能。

## 功能特色

- 🔐 Firebase認證系統（電子郵件/Google登入）
- 🎥 360度VR教學影片播放
- 🎯 4個互動選單（對話練習、聽力訓練、閱讀練習、數據分析）
- 👤 用戶個人資料管理
- 📱 響應式設計，支援各種裝置
- 🌐 中英文語言切換
- 📊 學習進度追蹤

## 技術棧

- **前端框架**: Vue 3
- **路由**: Vue Router 4
- **建構工具**: Vite
- **認證**: Firebase Authentication
- **資料庫**: Firebase Firestore
- **樣式**: CSS3 + Font Awesome圖示

## 安裝與設定

### 1. 安裝依賴

```bash
npm install
```

### 2. Firebase設定

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 建立新專案或選擇現有專案
3. 啟用 Authentication 和 Firestore
4. 在 Authentication 中啟用電子郵件/密碼和Google登入
5. 複製專案配置資訊

### 3. 更新Firebase配置

編輯 `src/firebase/config.js` 檔案，替換為您的Firebase專案配置：

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
}
```

### 4. 啟動開發伺服器

```bash
npm run dev
```

應用程式將在 `http://localhost:3000` 啟動。

## 專案結構

```
src/
├── components/
│   ├── Login.vue          # 登入頁面
│   └── Dashboard.vue      # 主要介面
├── firebase/
│   ├── config.js          # Firebase配置
│   └── auth.js            # 認證功能
├── App.vue                # 根組件
├── main.js                # 應用程式入口
└── style.css              # 全域樣式
```

## 主要功能說明

### 登入系統
- 支援電子郵件/密碼登入
- 支援Google帳號登入
- 新用戶註冊功能
- 錯誤訊息本地化

### 主要介面
- **跑馬燈區域**: 顯示網站新資訊和PBLS知識
- **4個選單**: 
  - 對話練習（語音氣泡圖示）
  - 聽力訓練（聲音圖示）
  - 閱讀練習（書本圖示）
  - 數據分析（圖表圖示）
- **VR影片區域**: 360度實境教學影片播放
- **用戶區域**: 個人資料、設定選單、登出功能
- **幫助區域**: 使用手冊和運動選項

### 互動功能
- 滑鼠懸停選單展開
- 點擊選單項目自動跳轉
- 用戶頭像點擊彈出選單
- 響應式設計適配各種螢幕

## 部署

### 建構生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

## 自訂設定

### 修改主題色彩

在 `src/style.css` 中修改CSS變數：

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #f093fb;
}
```

### 添加新的選單項目

在 `src/components/Dashboard.vue` 中修改 `menus` 陣列：

```javascript
menus: [
  {
    name: '新功能',
    icon: 'fas fa-new-icon',
    items: [
      { name: '子項目1', icon: 'fas fa-icon1' },
      { name: '子項目2', icon: 'fas fa-icon2' }
    ]
  }
]
```

## 瀏覽器支援

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 授權

MIT License

## 聯絡資訊

如有問題或建議，請聯絡開發團隊。
