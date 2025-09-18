# PBLS VR教學平台 - 完整安裝指南

## 前置需求

在開始之前，您需要安裝以下軟體：

### 1. 安裝 Node.js

1. 前往 [Node.js官網](https://nodejs.org/)
2. 下載並安裝 **LTS版本**（推薦版本）
3. 安裝完成後，重新開啟命令提示字元或PowerShell
4. 驗證安裝：
   ```bash
   node --version
   npm --version
   ```

### 2. 安裝 Git（可選但推薦）

1. 前往 [Git官網](https://git-scm.com/)
2. 下載並安裝Git for Windows
3. 安裝完成後重新開啟命令提示字元

## 專案設定步驟

### 步驟1: 安裝專案依賴

在專案資料夾中開啟命令提示字元或PowerShell，執行：

```bash
npm install
```

### 步驟2: Firebase設定

#### 2.1 建立Firebase專案

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 點擊「建立專案」
3. 專案名稱輸入：`pbls-platform`
4. 選擇是否啟用Google Analytics（可選）
5. 點擊「建立專案」

#### 2.2 啟用Authentication

1. 在Firebase Console中，點擊左側選單的「Authentication」
2. 點擊「開始使用」
3. 在「登入方法」標籤中：
   - 啟用「電子郵件/密碼」
   - 啟用「Google」（可選）

#### 2.3 啟用Firestore Database

1. 點擊左側選單的「Firestore Database」
2. 點擊「建立資料庫」
3. 選擇「測試模式」（開發階段）
4. 選擇離您最近的區域（建議選擇asia-southeast1）

#### 2.4 取得Firebase配置

1. 點擊左側選單的「專案設定」（齒輪圖示）
2. 滾動到「您的應用程式」區塊
3. 點擊「新增應用程式」> 選擇「Web」圖示
4. 應用程式暱稱輸入：`PBLS Platform`
5. 點擊「註冊應用程式」
6. 複製Firebase配置物件

### 步驟3: 更新專案配置

1. 開啟專案中的 `src/firebase/config.js` 檔案
2. 將以下內容替換為您的Firebase配置：

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

### 步驟4: 啟動開發伺服器

```bash
npm run dev
```

成功啟動後，您會看到類似以下的訊息：
```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### 步驟5: 測試應用程式

1. 開啟瀏覽器，前往 `http://localhost:3000`
2. 您應該會看到登入頁面
3. 點擊「立即註冊」建立測試帳號
4. 或使用「使用 Google 登入」功能
5. 登入成功後會跳轉到主要介面

## 常見問題解決

### Q1: npm指令無法識別
**解決方案**: 請確認已正確安裝Node.js，並重新開啟命令提示字元

### Q2: Firebase配置錯誤
**解決方案**: 
- 確認已正確複製Firebase配置物件
- 檢查專案ID是否正確
- 確認Authentication和Firestore已啟用

### Q3: 登入失敗
**解決方案**:
- 確認Firebase Authentication已啟用
- 檢查登入方法是否正確設定
- 確認Firebase配置正確

### Q4: 頁面無法載入
**解決方案**:
- 確認已執行 `npm install`
- 檢查是否有錯誤訊息
- 嘗試重新啟動開發伺服器

### Q5: 端口被占用
**解決方案**:
- 修改 `vite.config.js` 中的端口設定
- 或使用 `npm run dev -- --port 3001`

## 生產環境部署

### 建構生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

## 技術支援

如果遇到任何問題，請檢查：

1. Node.js版本是否為LTS版本
2. Firebase專案設定是否正確
3. 網路連線是否正常
4. 防火牆是否阻擋了連接

## 下一步

完成基本設定後，您可以：

1. 自訂介面樣式和色彩
2. 添加更多教學內容
3. 整合真實的VR影片
4. 實作學習進度追蹤
5. 添加更多互動功能
