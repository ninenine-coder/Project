# 🔐 Google OAuth 設置指南

## 📋 設置步驟

### 1. 前往 Google Cloud Console
1. 打開 [Google Cloud Console](https://console.cloud.google.com/)
2. 選擇現有專案或創建新專案

### 2. 啟用 Google+ API
1. 在左側選單中選擇 "API 和服務" > "程式庫"
2. 搜尋 "Google+ API"
3. 點擊啟用

### 3. 創建 OAuth 2.0 客戶端 ID
1. 前往 "API 和服務" > "憑證"
2. 點擊 "建立憑證" > "OAuth 2.0 客戶端 ID"
3. 選擇應用程式類型：**網頁應用程式**
4. 設定名稱：`PBLS VR教學平台`

### 4. 配置授權網域
在 "已授權的 JavaScript 來源" 中添加：
- `http://localhost:5000` (本地測試)
- `https://progect-115a5.firebaseapp.com` (Firebase Hosting)
- 您的自定義網域 (如果有)

在 "已授權的重新導向 URI" 中添加：
- `http://localhost:5000`
- `https://progect-115a5.firebaseapp.com`

### 5. 獲取客戶端 ID
1. 創建完成後，複製 **客戶端 ID**
2. 格式類似：`123456789-abcdefghijklmnop.apps.googleusercontent.com`

### 6. 更新 HTML 文件
將 `public/index.html` 中的 `YOUR_CLIENT_ID` 替換為實際的客戶端 ID：

```html
<meta name="google-signin-client_id" content="123456789-abcdefghijklmnop.apps.googleusercontent.com">

<div id="g_id_onload"
     data-client_id="123456789-abcdefghijklmnop.apps.googleusercontent.com"
     data-callback="handleCredentialResponse">
</div>
```

## 🧪 測試步驟

### 1. 本地測試
```bash
# 如果已安裝 Firebase CLI
firebase serve

# 或使用 Python 簡單服務器
python -m http.server 8000
```

### 2. 部署測試
```bash
firebase deploy
```

### 3. 功能測試
1. 打開登入頁面
2. 點擊 Google 登入按鈕
3. 選擇 Google 帳戶
4. 確認登入成功並跳轉

## 🔧 故障排除

### Google 登入按鈕不顯示
- 檢查客戶端 ID 是否正確
- 確認網域是否在授權列表中
- 檢查瀏覽器控制台錯誤

### 登入後無法跳轉
- 檢查 `handleCredentialResponse` 函數
- 確認 localStorage 設置正確
- 檢查跳轉 URL 是否正確

### 跨域問題
- 確認所有網域都在授權列表中
- 檢查 HTTPS 設置
- 確認 Firebase Hosting 配置

## 📱 部署後訪問
- **本地測試**: `http://localhost:5000`
- **Firebase Hosting**: `https://progect-115a5.firebaseapp.com`

## ✅ 完成檢查清單
- [ ] Google Cloud Console 專案設置
- [ ] Google+ API 已啟用
- [ ] OAuth 2.0 客戶端 ID 已創建
- [ ] 授權網域已設置
- [ ] HTML 文件中的客戶端 ID 已更新
- [ ] 本地測試成功
- [ ] 部署測試成功
- [ ] Google 登入功能正常
