# Firebase 配置檢查清單

## ✅ 已更新的文件

### 1. `login.html` ✅
- apiKey: "AIzaSyBuWO8hFVjjTUe2tqJDrqdbeGTrp4PoT5Q"
- authDomain: "progect-115a5.firebaseapp.com"
- projectId: "progect-115a5"
- storageBucket: "progect-115a5.appspot.com"
- messagingSenderId: "109099222287"
- appId: "1:109099222287:web:your-app-id" ⚠️ 需要更新

### 2. `firebase-config.js` ✅
- 所有配置已更新

### 3. `src/firebase/config.js` ✅
- 所有配置已更新

## ⚠️ 需要完成的步驟

### 1. 獲取完整的 App ID
1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 選擇專案 "Progect"
3. 點擊 ⚙️ 設定 > 專案設定
4. 在 "您的應用程式" 區段找到 Web 應用程式
5. 複製完整的 App ID (格式: `1:109099222287:web:xxxxxxxxxxxxxxxx`)

### 2. 更新 App ID
將以下文件中的 `your-app-id` 替換為完整的 App ID：
- `login.html` (第19行)
- `firebase-config.js` (第10行)
- `src/firebase/config.js` (第12行)

### 3. 啟用 Google 登入
1. 在 Firebase Console 中
2. 前往 Authentication > Sign-in method
3. 啟用 Google 登入提供者
4. 設定 OAuth 同意畫面

### 4. 設置授權網域
1. 在 Firebase Console 中
2. 前往 Authentication > Settings
3. 在 "授權網域" 區段添加：
   - `localhost` (用於本地測試)
   - 您的實際網域 (如果有的話)

## 🔧 測試步驟

1. 更新所有 App ID
2. 啟用 Google 登入
3. 設置授權網域
4. 使用 Chrome 或 Edge 瀏覽器測試
5. 打開 `login.html`
6. 點擊 "用 Google 登入" 按鈕
7. 檢查是否彈出 Google 登入視窗

## 📝 專案資訊摘要

- **專案名稱**: Progect
- **專案 ID**: progect-115a5
- **專案編號**: 109099222287
- **Web API 金鑰**: AIzaSyBuWO8hFVjjTUe2tqJDrqdbeGTrp4PoT5Q
- **App ID**: 需要從 Firebase Console 獲取完整版本
